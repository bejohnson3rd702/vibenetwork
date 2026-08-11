import { supabase } from './src/supabaseClient.ts';

async function checkBjChannelDb() {
  console.log("=== Checking BJ Channel DB Fields ===");

  // Check profiles with username 'bj' or 'bjohnson3rd' or 'Rev Bennie Johnson' or ID '8c409557-a48c-41d4-8133-9d9788aebe0d'
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .or('username.ilike.%bj%,id.eq.8c409557-a48c-41d4-8133-9d9788aebe0d');

  console.log("Profiles:", JSON.stringify(profiles, null, 2));

  // Check whitelabel_configs for any matching owner_id or name
  const { data: configs } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .or('owner_id.eq.8c409557-a48c-41d4-8133-9d9788aebe0d,name.ilike.%bennie%');

  console.log("Configs:", JSON.stringify(configs, null, 2));
}

checkBjChannelDb();
