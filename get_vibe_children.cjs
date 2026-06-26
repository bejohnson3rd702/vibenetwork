require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('whitelabel_configs')
    .select('id, name, domain, parent_network_id')
    .eq('parent_network_id', 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30');

  if (error) {
    console.error(error);
  } else {
    console.log("Vibe Network Children:", data);
  }
}
run();
