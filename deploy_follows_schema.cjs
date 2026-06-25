require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing in environment.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  console.log("🔄 Reading follows_schema.sql...");
  const sqlPath = path.join(__dirname, 'follows_schema.sql');
  const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

  console.log("🔑 Authenticating as admin to try automatic deploy...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.warn("⚠️  Admin login failed. Proceeding with anonymous query...");
  } else {
    console.log("✅ Admin logged in successfully.");
  }

  console.log("🚀 Executing database migration SQL via exec_sql RPC...");
  const { data, error } = await supabase.rpc('exec_sql', { query: sqlQuery });

  if (error) {
    console.log("\n❌ Automatic schema deployment failed: ", error.message);
    console.log("\n=========================================================================");
    console.log("⚠️  ACTION REQUIRED: YOU MUST DEPLOY THE FOLLOWS TABLES MANUALLY.");
    console.log("   Copy the SQL contents from:");
    console.log(`   ${sqlPath}`);
    console.log("   And paste it into your Supabase Dashboard SQL Editor:");
    console.log(`   ${url.replace('https://', 'https://supabase.com/dashboard/project/')}/sql/new`);
    console.log("=========================================================================\n");
  } else {
    console.log("✅ Follows & Subscriptions tables, indexes, and RLS policies successfully deployed!", data);
  }
}

run().catch(console.error);
