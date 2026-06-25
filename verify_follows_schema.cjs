require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing in environment.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function verifyTable() {
  const { data, error } = await supabase.from('user_follows').select('*').limit(1);
  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('not found') || error.message.includes('does not exist')) {
      console.log(`❌ Table public.user_follows is NOT deployed or accessible.`);
      return false;
    }
    console.log(`⚠️  Table public.user_follows returned query error:`, error.message);
    return false;
  }
  console.log(`✅ Table public.user_follows is verified (exists and is accessible).`);
  return true;
}

async function run() {
  console.log("🔑 Authenticating as admin to verify follows schema...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.error("❌ Admin login failed:", authError.message);
    process.exit(1);
  }
  console.log("✅ Logged in successfully.");

  console.log("\n🔍 Verifying follows database table...");
  const ok = await verifyTable();

  if (ok) {
    console.log("\n🎉 Verification succeeded! user_follows table is successfully deployed and verified.\n");
  } else {
    console.log("\n❌ Verification failed. Please ensure the SQL commands inside follows_schema.sql were executed in the Supabase editor.\n");
  }
}

run().catch(console.error);
