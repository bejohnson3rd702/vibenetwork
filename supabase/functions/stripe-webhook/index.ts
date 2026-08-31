import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.14.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

async function sendTwilioSMS(to: string, body: string) {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const apiKeySid = Deno.env.get("TWILIO_API_KEY_SID");
  const apiKeySecret = Deno.env.get("TWILIO_API_KEY_SECRET");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_FROM_NUMBER");
  
  if (!accountSid || !from) {
    console.warn("⚠️ Twilio accountSid or from number missing. Skipping SMS.");
    return;
  }
  
  const username = apiKeySid || accountSid;
  const password = apiKeySecret || authToken;
  
  if (!password || !to || to.trim() === '') {
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = btoa(`${username}:${password}`);
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString()
    });
    
    if (!res.ok) {
      const errText = await res.text();
      console.error(`❌ Twilio Error sending to ${to}:`, errText);
    } else {
      console.log(`✅ Twilio SMS sent successfully to ${to}`);
    }
  } catch (err: any) {
    console.error(`❌ Twilio network error sending to ${to}:`, err.message);
  }
}

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Check for Thin V2 Events
    let thinEvent: any = null;
    try {
      if (typeof (stripe as any).parseThinEvent === 'function') {
        thinEvent = (stripe as any).parseThinEvent(body, signature, webhookSecret);
      }
    } catch (_err) {
      // Not a thin event signature format; fall back to standard V1 event construct
    }

    if (thinEvent && thinEvent.id) {
      // Retrieve full event data from V2 Events API
      const event = await (stripe as any).v2.core.events.retrieve(thinEvent.id);
      console.log(`📩 [V2 THIN WEBHOOK] Processing thin event ${event.id}: ${event.type}`);

      if (event.type === 'v2.core.account[requirements].updated' || 
          event.type.includes('capability_status_updated')) {
        const accountId = event.related_object?.id;
        if (accountId) {
          try {
            const acc = await (stripe as any).v2.core.accounts.retrieve(accountId, {
              include: ["configuration.merchant", "requirements"],
            });
            const isReady = acc?.configuration?.merchant?.capabilities?.card_payments?.status === "active";
            console.log(`✅ V2 Account ${accountId} card_payments capability status: ${isReady ? 'active' : 'pending'}`);
          } catch (err: any) {
            console.warn(`Failed to inspect V2 account ${accountId}:`, err.message);
          }
        }
      }

      return new Response(JSON.stringify({ received: true, thinEventId: event.id }), { status: 200 });
    }

    // 2. Standard V1 Webhook Events
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Handle Subscription Updated (V2 Account Subscriptions use subscription.customer_account)
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as any;
      const connectedAccountId = subscription.customer_account || subscription.customer;
      const currentPriceId = subscription.items?.data?.[0]?.price?.id;
      const isCanceled = subscription.cancel_at_period_end;

      console.log(`📊 Subscription updated for connected account: ${connectedAccountId} (Price: ${currentPriceId}, CancelAtEnd: ${isCanceled})`);
    } else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as any;
      const connectedAccountId = subscription.customer_account || subscription.customer;
      console.log(`🚫 Subscription canceled for connected account: ${connectedAccountId}`);
    }

    // Handle Payment Intent Succeeded
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata || {};

      console.log(`Payment Success! $${paymentIntent.amount / 100} for ${metadata.product_title || 'Purchase'}`);

      // Lookup whitelabel_id from metadata or fallback to creator profile
      let whitelabelId = metadata.whitelabel_id || null;
      if (!whitelabelId && metadata.creator_id) {
        const { data: creatorProf } = await supabase
          .from('profiles')
          .select('whitelabel_id')
          .eq('id', metadata.creator_id)
          .maybeSingle();
        whitelabelId = creatorProf?.whitelabel_id || null;
      }

      await supabase.from('ledger').insert({
        amount: paymentIntent.amount / 100,
        buyer_id: metadata.buyer_id || null,
        creator_id: metadata.creator_id || null,
        whitelabel_id: whitelabelId,
        product_title: metadata.product_title || 'Vibe Network Purchase',
        transaction_type: metadata.transaction_type || 'PPV',
        stripe_payment_intent: paymentIntent.id
      });

      // Storage Limit Upgrades
      if (metadata.storage_tier) {
        let newLimit = 10737418240; // Default 10 GB
        if (metadata.storage_tier === 'pro_100gb') {
          newLimit = 107374182400; // 100 GB
        } else if (metadata.storage_tier === 'studio_500gb') {
          newLimit = 536870912000; // 500 GB
        } else if (metadata.storage_tier === 'enterprise_2tb') {
          newLimit = 2199023255552; // 2 TB
        }

        await supabase
          .from('profiles')
          .update({ storage_limit_bytes: newLimit })
          .eq('id', metadata.creator_id);
      }

      // Booking Confirmed
      if (metadata.is_booking === 'true' || metadata.is_booking === true) {
         const bookingId = crypto.randomUUID();
         const customCallRoomUrl = `https://vibenetwork.tv/call/${bookingId}`;
         const guestName = metadata.guest_name || 'Customer';
         const guestPhone = metadata.guest_phone || '';
         const meetingPurpose = metadata.meeting_purpose || '';
         const scheduledAt = metadata.scheduled_at || null;
         const recordCall = metadata.record_call === 'true' || metadata.record_call === true;
         const recordingPrice = Number(metadata.recording_price || 0);

         await supabase.from('bookings').insert({
             id: bookingId,
             creator_id: metadata.creator_id,
             buyer_id: metadata.buyer_id,
             guest_name: guestName,
             guest_phone: guestPhone,
             meeting_purpose: meetingPurpose,
             date: metadata.date,
             time: metadata.time,
             price: paymentIntent.amount / 100,
             meeting_type: metadata.meeting_type,
             meeting_link: customCallRoomUrl,
             scheduled_at: scheduledAt,
             record_call: recordCall,
             recording_price: recordingPrice,
             status: 'confirmed'
         });

         const { data: creatorProfile } = await supabase
           .from('profiles')
           .select('username, sms_enabled, sms_phone')
           .eq('id', metadata.creator_id)
           .single();

         const callTypeDisplay = metadata.meeting_type?.includes('audio') ? 'Audio Call' : 'Video Call';
         const guestMsg = `Hi ${guestName}, your ${callTypeDisplay} with @${creatorProfile?.username || 'Creator'} is confirmed for ${metadata.date} at ${metadata.time}! Join: ${customCallRoomUrl}`;
         await sendTwilioSMS(guestPhone, guestMsg);

         if (creatorProfile?.sms_enabled && creatorProfile?.sms_phone) {
           const creatorMsg = `Hi @${creatorProfile.username}, new ${callTypeDisplay} booked by ${guestName} for ${metadata.date} at ${metadata.time}. Host: ${customCallRoomUrl}`;
           await sendTwilioSMS(creatorProfile.sms_phone, creatorMsg);
         }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
