import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// read from .env
const envFile = fs.readFileSync(path.resolve('.env'), 'utf-8');
const lines = envFile.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('VITE_SUPABASE_URL'))?.split('=')[1].trim() || '';
const supabaseKey = lines.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY'))?.split('=')[1].trim() || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { error: e1 } = await supabase.from('whitelabel_configs').select('is_featured_global').limit(1);
  console.log('whitelabels has is_featured_global?', !e1);
  if (e1) console.log(e1.message);

  const { error: e2 } = await supabase.from('profiles').select('is_featured_global').limit(1);
  console.log('profiles has is_featured_global?', !e2);
  if (e2) console.log(e2.message);
}
check();
