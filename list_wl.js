import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://uivqsqpsqtzguxvysshv.supabase.co";
// Fallback key if not provided (should be local)
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "YOUR_KEY_HERE";

if (!supabaseKey || supabaseKey === "YOUR_KEY_HERE") { 
  console.log('No Supabase Key Found'); 
  process.exit(1); 
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('whitelabel_configs').select('id, name, domain');
  console.log(JSON.stringify(data, null, 2));
}

check();
