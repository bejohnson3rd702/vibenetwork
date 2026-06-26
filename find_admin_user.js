import { supabase } from './supabaseClientLoader.ts';

async function run() {
  const { data: admins, error } = await supabase
    .from('profiles')
    .select('id, username, is_admin, role')
    .eq('is_admin', true);

  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Admin users:", admins);
}

run();
