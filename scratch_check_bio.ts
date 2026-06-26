import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '/Volumes/Dev/vibe-network-ui/.env' });

const url = process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(url, key);

async function run() {
  const targetId = '8e0994e2-4351-422c-8da0-3aff8ae4e13d'; // Rev Bennie Johnson
  console.log(`Checking profile for ID ${targetId}...`);
  const { data: profileBefore, error: loadError } = await supabase.from('profiles').select('*').eq('id', targetId).single();
  if (loadError) {
    console.error("Load error:", loadError);
    return;
  }
  console.log("Profile before update:", profileBefore);

  console.log("Attempting to update bio to 'Test Bio'...");
  const { data: updateData, error: updateError } = await supabase
    .from('profiles')
    .update({ bio: 'Test Bio' })
    .eq('id', targetId)
    .select();

  if (updateError) {
    console.error("Update error:", updateError);
  } else {
    console.log("Update success! Result:", updateData);
  }
}

run();
