require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error("❌ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing in environment.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function verifyTable(tableName) {
  const { data, error } = await supabase.from(tableName).select('*').limit(1);
  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('not found') || error.message.includes('does not exist')) {
      console.log(`❌ Table public.${tableName} is NOT deployed or accessible.`);
      return false;
    }
    // PGRST116 is single row empty, but for select limit 1, a 200/empty list means table exists!
    console.log(`⚠️  Table public.${tableName} returned query error:`, error.message);
    return false;
  }
  console.log(`✅ Table public.${tableName} is verified (exist and accessible).`);
  return true;
}

async function run() {
  console.log("🔑 Authenticating as admin to verify schema...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.error("❌ Admin login failed:", authError.message);
    process.exit(1);
  }
  console.log("✅ Logged in successfully.");

  const tables = [
    'crm_integrations',
    'crm_contacts',
    'crm_contact_tags',
    'crm_pipelines',
    'crm_pipeline_stages',
    'crm_opportunities',
    'crm_contact_activities',
    'crm_sync_logs'
  ];

  console.log("\n🔍 Verifying CRM database tables...");
  let allOk = true;
  for (const t of tables) {
    const ok = await verifyTable(t);
    if (!ok) allOk = false;
  }

  if (allOk) {
    console.log("\n🎉 Verification succeeded! All CRM tables are successfully deployed and verified.\n");
  } else {
    console.log("\n❌ Verification failed. Please ensure the SQL commands inside crm_schema.sql were executed in the Supabase editor.\n");
  }
}

run().catch(console.error);
