require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase
    .from('whitelabel_configs')
    .select('id, name, parent_network_id')
    .ilike('name', '%avo%');
    
  if (error) {
    console.error('Error fetching networks:', error);
    return;
  }
  
  console.log('AVO Networks:', data);
  
  if (data.length > 0) {
      const parentIds = data.map(n => n.id);
      const { data: children, error: childErr } = await supabase
        .from('whitelabel_configs')
        .select('id, name, parent_network_id')
        .in('parent_network_id', parentIds);
        
      if (childErr) {
        console.error('Error fetching child networks:', childErr);
      } else {
        console.log('Child Networks:', children);
      }
  }
}

main();
