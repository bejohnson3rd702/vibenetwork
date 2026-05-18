import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('.env', 'utf8');
const urlMatch = envText.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envText.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].replace(/['"]/g, '').trim();
const supabaseKey = keyMatch[1].replace(/['"]/g, '').trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('profiles').select('id, username');
  if (error) console.error(error);
  else console.log(JSON.stringify(data.filter(u => u.username && u.username.toLowerCase().includes('dummy')), null, 2));
}
run();
