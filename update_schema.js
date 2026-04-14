import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envVars = fs.readFileSync('.env', 'utf-8').split('\n');
const supabaseUrl = envVars.find(l => l.startsWith('VITE_SUPABASE_URL'))?.split('=')[1] || '';
const supabaseKey = envVars.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY'))?.split('=')[1] || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { error: e1 } = await supabase.from('whitelabel_configs').select('is_featured_global').limit(1);
  console.log('whitelabels has is_featured_global?', !e1);

  const { error: e2 } = await supabase.from('profiles').select('is_featured_global').limit(1);
  console.log('profiles has is_featured_global?', !e2);
}
check();
