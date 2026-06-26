require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const parentId = '7a017c4d-c08f-4260-8540-a0cc8bed4e11';
  console.log('Querying for Mr. Olympian network...');
  const { data: parent, error: parentErr } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('id', parentId);
    
  if (parentErr) {
    console.error('Error fetching parent:', parentErr);
    return;
  }
  console.log('Parent Network:', parent);

  console.log('Querying for child networks...');
  const { data: children, error: childErr } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('parent_network_id', parentId);
    
  if (childErr) {
    console.error('Error fetching children:', childErr);
    return;
  }
  console.log('Child Networks Count:', children.length);
  children.forEach(c => {
    console.log(`- Child ID: ${c.id}, Name: ${c.name}, Domain: ${c.domain}, Theme:`, c.theme);
  });
}

main();
