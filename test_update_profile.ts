import { supabase } from './supabaseClientLoader.ts';

async function run() {
  console.log("🔑 Logging in as admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.error("❌ Login failed:", authError.message);
    return;
  }

  console.log("✅ Logged in! Attempting to update emily_nittany profile...");
  const { data, error } = await supabase
    .from('profiles')
    .update({ avatar_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=400&h=400' })
    .eq('username', 'emily_nittany')
    .select();

  if (error) {
    console.error("❌ RLS blocked or update failed:", error.message);
  } else {
    console.log("✅ Update response:", data);
  }
}

run();
