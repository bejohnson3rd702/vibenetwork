import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// read from .env
const envFile = fs.readFileSync(path.resolve('.env'), 'utf-8');
const lines = envFile.split('\n');
const supabaseUrl = lines.find(l => l.startsWith('VITE_SUPABASE_URL'))?.split('=')[1].trim() || '';
const supabaseKey = lines.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY'))?.split('=')[1].trim() || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('ledger').select('*').limit(1);
  if (error) {
     console.log('No ledger table:', error.message);
  } else {
     console.log('Ledger table exists!');
  }
}
run();
