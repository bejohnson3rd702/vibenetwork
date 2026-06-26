require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("🔐 Authenticating admin session...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.error("❌ Authentication failed:", authError.message);
    return;
  }

  console.log("✅ Authenticated successfully.");

  // Fetch all networks
  const { data: configs, error: fetchErr } = await supabase
    .from('whitelabel_configs')
    .select('id, name, domain, parent_network_id');

  if (fetchErr) {
    console.error("❌ Error fetching configs:", fetchErr);
    return;
  }

  // Identify any test parent networks (those without parent_network_id containing bennie, noelani, leilani, leiloe, or test)
  const testKeywords = ['bennie', 'noelani', 'leilani', 'leiloe', 'test'];
  const targets = (configs || []).filter(c => {
    // Only target parent networks that don't have a parent_network_id yet
    if (c.parent_network_id) return false;
    
    const nameLower = (c.name || '').toLowerCase();
    const domainLower = (c.domain || '').toLowerCase();
    
    return testKeywords.some(keyword => nameLower.includes(keyword) || domainLower.includes(keyword));
  });

  if (targets.length === 0) {
    console.log("✨ No active test parent networks found that need hiding.");
    return;
  }

  console.log(`🧹 Found ${targets.length} test parent network(s) to hide from production:`);
  targets.forEach(t => console.log(`   - ID: ${t.id} | Name: "${t.name}" | Domain: "${t.domain}"`));

  // Update them to have a parent ID (AVO Network) to automatically filter them out on prod
  const avoParentId = '3915f1e5-4c79-4b2a-ad41-7029ce8052d7';

  for (const target of targets) {
    console.log(`⚙️  Hiding "${target.name}"...`);
    const { error: updateErr } = await supabase
      .from('whitelabel_configs')
      .update({
        parent_network_id: avoParentId,
        theme: {
          parent_network_id: avoParentId
        }
      })
      .eq('id', target.id);

    if (updateErr) {
      console.error(`   ❌ Failed to hide ${target.name}:`, updateErr.message);
    } else {
      console.log(`   ✅ Successfully hid ${target.name}`);
    }
  }

  console.log("\n🎉 Clean-up completed successfully!");
}

run();
