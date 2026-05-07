import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.rpc('execute_sql', { sql: 'ALTER TABLE public.products ADD COLUMN featured_on_vibe BOOLEAN DEFAULT false;' });
  console.log("Error:", error);
}
run();
