require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function run() {
  const { data: configs, error: cError } = await supabase
    .from('whitelabel_configs')
    .select('id, name, parent_network_id, created_at')
    .order('created_at', { ascending: false });

  if (cError) {
    console.error("Error:", cError);
    return;
  }

  console.log(`Total configs: ${configs.length}`);
  configs.forEach((c, i) => {
    console.log(`${i+1}. ID: ${c.id} | Name: "${c.name}" | Parent ID: ${c.parent_network_id} | Created: ${c.created_at}`);
  });
}

run();
