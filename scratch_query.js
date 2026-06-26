import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Read .env
const env = {};
try {
  const content = fs.readFileSync('.env', 'utf-8');
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').replace(/"/g, '').trim();
    }
  });
} catch (e) {
  console.error("Failed to read .env", e);
}

const url = env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const key = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function run() {
  const bookingsColumns = [
    'guest_name', 'guest_phone', 'meeting_purpose', 'meeting_type', 
    'meeting_link', 'date', 'time', 'price', 'status', 'duration', 
    'booking_type', 'call_type', 'scheduled_at'
  ];
  
  console.log("Checking bookings columns:");
  for (const col of bookingsColumns) {
    const { data, error } = await supabase.from('bookings').select(col).limit(1);
    if (error) {
      console.log(`❌ ${col}: NOT present (Error: ${error.message})`);
    } else {
      console.log(`✅ ${col}: PRESENT`);
    }
  }

  const profilesColumns = [
    'booking_price', 'booking_availability', 'sms_enabled', 'sms_phone'
  ];

  console.log("\nChecking profiles columns:");
  for (const col of profilesColumns) {
    const { data, error } = await supabase.from('profiles').select(col).limit(1);
    if (error) {
      console.log(`❌ ${col}: NOT present (Error: ${error.message})`);
    } else {
      console.log(`✅ ${col}: PRESENT`);
    }
  }
}
run();
