import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envLines = fs.readFileSync('.env', 'utf8').split('\n');
let supabaseUrl = '';
let supabaseKey = '';
for (const line of envLines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim().replace(/['"]/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim().replace(/['"]/g, '');
}

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('profiles').select('*').eq('whitelabel_id', 'faa887c6-e49b-4f5a-97e4-bc117572e82f');
  if (error) console.error(error);
  else console.log(data);
}

run();
