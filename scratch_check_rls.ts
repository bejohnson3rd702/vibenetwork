import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Volumes/Dev/vibe-network-ui/.env' });

const url = process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(url, key);

async function run() {
  // First, we need to sign in as admin to have permission to execute_sql
  console.log("Logging in as admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.error("Admin login failed:", authError);
    return;
  }
  console.log("Logged in!");

  const sql = `SELECT * FROM pg_policies WHERE tablename = 'profiles';`;
  console.log("Querying RLS policies on profiles...");
  const { data, error } = await supabase.rpc('execute_sql', { sql });
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("RLS POLICIES:");
  console.log(JSON.stringify(data, null, 2));
}

run();
