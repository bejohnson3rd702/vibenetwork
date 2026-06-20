/*
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('.env', 'utf8');
const urlMatch = envText.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envText.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch[1].replace(/['"]/g, '').trim();
const supabaseKey = keyMatch[1].replace(/['"]/g, '').trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: config } = await supabase.from('whitelabel_configs').select('owner_id').eq('domain', 'finfire.com').single();
  if (config && config.owner_id) {
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', config.owner_id).single();
    if (error) console.error(error);
    console.log("Network Owner ID:", config.owner_id);
    console.log("Network Owner Profile:", profile);
  } else {
    console.log("No owner_id assigned to finfire.com");
  }
}
run();
*/
