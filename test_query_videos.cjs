require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: vidsData, error: vidsErr } = await supabase
    .from('videos')
    .select('*, creator:profiles!inner(whitelabel_id, whitelabel:whitelabel_configs!inner(name, parent_network_id))')
    .eq('creator.whitelabel.parent_network_id', 'e5c100aa-c08f-4260-8540-a0cc8bed4e11')
    .order('created_at', { ascending: false });

  if (vidsErr) {
    console.error('Error fetching videos:', vidsErr);
  } else {
    console.log('Videos fetched:', vidsData?.length, vidsData);
  }
}
run();
