import { supabase } from './supabaseClientLoader.ts';

async function run() {
  console.log("Querying all whitelabel configs...");
  const { data, error } = await supabase
    .from('whitelabel_configs')
    .select('id, name, domain, logo, parent_network_id, theme');

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log(`Found ${data?.length} configs:`);
  data?.forEach(wl => {
    console.log(`- ID: ${wl.id}`);
    console.log(`  Name: ${wl.name}`);
    console.log(`  Domain: ${wl.domain}`);
    console.log(`  Logo: ${wl.logo}`);
    console.log(`  Parent ID: ${wl.parent_network_id}`);
    console.log(`  Theme Keys:`, wl.theme ? Object.keys(wl.theme) : null);
    if (wl.theme) {
      console.log(`  Theme.accent:`, (wl.theme as any).accent);
      console.log(`  Theme.logoImage:`, (wl.theme as any).logoImage);
      console.log(`  Theme.heroImage:`, (wl.theme as any).heroImage);
    }
    console.log("");
  });
}

run();
