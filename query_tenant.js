import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: wl } = await supabase.from('whitelabel_configs').select('*').eq('id', 'c8c4084d-56b4-4c45-94f6-e4b1821dad75');
  console.log('Whitelabel Config:', JSON.stringify(wl, null, 2));
}

check();
