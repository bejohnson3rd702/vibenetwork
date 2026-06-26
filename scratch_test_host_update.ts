import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Volumes/Dev/vibe-network-ui/.env' });

const url = process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(url, key);

async function run() {
  console.log("Logging in as stephenvancura_kple@test.com...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'stephenvancura_kple@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.error("Login failed:", authError);
    return;
  }
  console.log("Logged in successfully! User ID:", authData.user.id);

  console.log("Attempting to update bio to 'Updated Stephen Bio'...");
  const { data, error } = await supabase
    .from('profiles')
    .update({ bio: 'Updated Stephen Bio' })
    .eq('id', authData.user.id)
    .select();

  if (error) {
    console.error("❌ Update failed:", error);
  } else {
    console.log("✅ Update success! Result:", data);
  }
}

run();
