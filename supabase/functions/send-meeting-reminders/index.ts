import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
  // Simple auth check to prevent arbitrary public calls triggering SMS spend
  // In production, you would check for a secret cron header or Bearer token
  const authHeader = req.headers.get("Authorization");
  const cronSecret = Deno.env.get("CRON_SECRET");
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate dates in ISO format for JS query
    const now = Date.now();
    const fifteenMinsFromNow = new Date(now + 15 * 60 * 1000).toISOString();
    const pastLimit = new Date(now - 30 * 60 * 1000).toISOString(); // 30 mins window to catch delayed runs

    console.log(`Checking bookings scheduled between ${pastLimit} and ${fifteenMinsFromNow}`);

    // Query bookings
    const { data: bookings, error: queryError } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'confirmed')
      .eq('reminder_sent', false)
      .lte('scheduled_at', fifteenMinsFromNow)
      .gte('scheduled_at', pastLimit);

    if (queryError) {
      throw queryError;
    }

    console.log(`Found ${bookings?.length || 0} bookings requiring reminders.`);

    if (bookings && bookings.length > 0) {
      for (const booking of bookings) {
        // Fetch creator details
        const { data: creator } = await supabase
          .from('profiles')
          .select('username, sms_enabled, sms_phone')
          .eq('id', booking.creator_id)
          .single();

        const isVirtual = booking.meeting_type?.includes('virtual');
        const joinText = isVirtual ? `Join Call Link: ${booking.meeting_link}` : '';

        // 1. Send SMS to Guest
        if (booking.guest_phone) {
          const guestMsg = `Reminder: Your 1-on-1 session with @${creator?.username || 'Creator'} starts in 15 minutes! ${joinText}`;
          await sendTwilioSMS(booking.guest_phone, guestMsg);
        }

        // 2. Send SMS to Creator
        if (creator?.sms_enabled && creator?.sms_phone) {
          const creatorMsg = `Reminder: Your meeting with ${booking.guest_name || 'Guest'} starts in 15 minutes! ${joinText}`;
          await sendTwilioSMS(creator.sms_phone, creatorMsg);
        }

        // Update booking state
        await supabase
          .from('bookings')
          .update({ reminder_sent: true })
          .eq('id', booking.id);
          
        console.log(`Processed reminder for booking: ${booking.id}`);
      }
    }

    return new Response(JSON.stringify({ success: true, processed: bookings?.length || 0 }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (err: any) {
    console.error(`Reminders Cron Error: ${err.message}`);
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
