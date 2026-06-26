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
  
  if (!password) {
    console.warn("⚠️ Twilio authentication credential (secret or token) missing. Skipping SMS.");
    return;
  }
  
  if (!to || to.trim() === '') {
    console.warn("⚠️ Recipient phone number is empty. Skipping SMS.");
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  // btoa is built-in in Deno
  const auth = btoa(`${username}:${password}`);
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        To: to,
        From: from,
        Body: body
      }).toString()
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
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle Successful Payment
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata;

      console.log(`Payment Success! $${paymentIntent.amount / 100} for ${metadata.product_title}`);

      await supabase.from('ledger').insert({
        amount: paymentIntent.amount / 100,
        buyer_id: metadata.buyer_id,
        creator_id: metadata.creator_id,
        product_title: metadata.product_title,
        transaction_type: 'PPV',
        stripe_payment_intent: paymentIntent.id
      });

      // Handle Storage Upgrades
      if (metadata.storage_tier) {
        let newLimit = 10737418240; // Default 10 GB fallback
        if (metadata.storage_tier === 'pro_100gb') {
          newLimit = 107374182400; // 100 GB
        } else if (metadata.storage_tier === 'studio_500gb') {
          newLimit = 536870912000; // 500 GB
        } else if (metadata.storage_tier === 'enterprise_2tb') {
          newLimit = 2199023255552; // 2 TB
        }

        console.log(`Upgrading storage limit for creator ${metadata.creator_id} to ${newLimit} bytes`);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ storage_limit_bytes: newLimit })
          .eq('id', metadata.creator_id);

        if (updateError) {
          console.error("❌ Failed to update storage limit:", updateError.message);
        } else {
          console.log("✅ Storage limit updated successfully.");
        }
      }

      if (metadata.is_booking === 'true' || metadata.is_booking === true) {
         // Create the booking entry
         const bookingId = crypto.randomUUID();
         
         // Custom call link (routing to our custom WebRTC client call room)
         const customCallRoomUrl = `https://vibenetwork.tv/call/${bookingId}`;
         
         // Format Jitsi fallback link
         let jitsiLink = `https://meet.jit.si/vibe_${bookingId}`;
         if (metadata.meeting_type === 'virtual_audio') {
           jitsiLink += '#config.startWithVideoMuted=true&config.startAudioOnly=true';
         }
         
         // Determine which meeting link to store
         const meetLink = customCallRoomUrl;

         const guestName = metadata.guest_name || 'Customer';
         const guestPhone = metadata.guest_phone || '';
         const meetingPurpose = metadata.meeting_purpose || '';
         const scheduledAt = metadata.scheduled_at || null;
         const recordCall = metadata.record_call === 'true' || metadata.record_call === true;
         const recordingPrice = Number(metadata.recording_price || 0);

         // Insert booking
         const { error: insertError } = await supabase.from('bookings').insert({
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
             meeting_link: meetLink,
             scheduled_at: scheduledAt,
             record_call: recordCall,
             recording_price: recordingPrice,
             status: 'confirmed'
         });

         if (insertError) {
           console.error("❌ Failed to insert booking:", insertError.message);
         } else {
           console.log("✅ Booking inserted successfully.");
           
           // Fetch creator's profile details for SMS notifications
           const { data: creatorProfile } = await supabase
             .from('profiles')
             .select('username, sms_enabled, sms_phone')
             .eq('id', metadata.creator_id)
             .single();

           const isAudio = metadata.meeting_type?.includes('audio');
           const isVideo = metadata.meeting_type?.includes('video');
           const isVirtual = isAudio || isVideo;
           
           const callTypeDisplay = isAudio ? 'Audio Call' : isVideo ? 'Video Call' : 'Physical Meeting';
           const recordingAlert = recordCall ? ' (Call Recording purchased)' : '';

           // 1. Send SMS to Guest
           const guestMsg = `Hi ${guestName}, your 1-on-1 ${callTypeDisplay} with @${creatorProfile?.username || 'Creator'} is confirmed for ${metadata.date} at ${metadata.time}! ${isVirtual ? `Join room: ${customCallRoomUrl}` : ''}${recordingAlert}`;
           await sendTwilioSMS(guestPhone, guestMsg);

           // 2. Send SMS to Creator (if enabled and phone number exists)
           if (creatorProfile?.sms_enabled && creatorProfile?.sms_phone) {
             const creatorMsg = `Hi @${creatorProfile.username}, you have a new ${callTypeDisplay} booked by ${guestName} for ${metadata.date} at ${metadata.time}. Purpose: ${meetingPurpose}. ${isVirtual ? `Host room: ${customCallRoomUrl}` : ''}${recordingAlert}`;
             await sendTwilioSMS(creatorProfile.sms_phone, creatorMsg);
           }
         }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
