import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  console.log("Checking Categories...");
  const c = await supabase.from('categories').select('*');
  console.log("Categories:", c.error ? c.error.message : c.data);
  
  console.log("\nChecking Videos...");
  const v = await supabase.from('videos').select('id, title, video_url, category_id');
  console.log("Videos:", v.error ? v.error.message : v.data.slice(0, 3));
}
run();
