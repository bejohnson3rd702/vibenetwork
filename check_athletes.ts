import { supabase } from './supabaseClientLoader.ts';

async function run() {
  // AVO Network Parent ID: 3915f1e5-4c79-4b2a-ad41-7029ce8052d7
  const parentId = '3915f1e5-4c79-4b2a-ad41-7029ce8052d7';

  // Get child networks
  const { data: children } = await supabase
    .from('whitelabel_configs')
    .select('id, name')
    .eq('parent_network_id', parentId);

  if (!children || children.length === 0) {
    console.log("No child networks found.");
    return;
  }

  const childIds = children.map(c => c.id);
  console.log(`AVO Child IDs:`, childIds);

  // Fetch influencer profiles
  const { data: athletes, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, bio, whitelabel_id')
    .in('whitelabel_id', childIds)
    .eq('role', 'influencer');

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log(`Found ${athletes?.length} athletes:`);
  athletes?.forEach(ath => {
    const school = children.find(c => c.id === ath.whitelabel_id)?.name;
    console.log(`- Athlete: ${ath.username}`);
    console.log(`  ID: ${ath.id}`);
    console.log(`  School: ${school}`);
    console.log(`  Avatar URL: ${ath.avatar_url}`);
    console.log(`  Bio: ${ath.bio}`);
    console.log("");
  });
}

run();
