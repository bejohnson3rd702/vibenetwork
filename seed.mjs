import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Connecting to Supabase...');
  
  // 1. We will try to delete the existing videos and categories, but wait, anon key might not have delete permissions!
  // Let's check if we can select them first.
  const { data: vids } = await supabase.from('videos').select('*');
  console.log('Existing videos:', vids?.length || 0);
  
  if (vids && vids.length > 0) {
    const { error } = await supabase.from('videos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
       console.log('Delete error (likely RLS):', error.message);
    } else {
       console.log('Successfully deleted existing videos.');
    }
  }
}

run();
