import { supabase } from './supabaseClientLoader.ts';

async function run() {
  const { data: configs, error } = await supabase
    .from('whitelabel_configs')
    .select('id, name, domain, parent_network_id, n2n_enabled, theme')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log(`Total networks: ${configs.length}`);
  configs.forEach(c => {
    console.log(`- ID: ${c.id} | Name: "${c.name}" | Domain: "${c.domain}" | ParentID: ${c.parent_network_id} | N2N Enabled: ${c.n2n_enabled || c.theme?.n2n_enabled}`);
  });
}

run();
