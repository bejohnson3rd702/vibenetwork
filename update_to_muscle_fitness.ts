import { supabase } from './supabaseClientLoader.ts';

async function run() {
  const parentId = '7a017c4d-c08f-4260-8540-a0cc8bed4e11';
  const childId = '100b0000-c08f-4260-8540-a0cc8bed4e11';

  console.log("🔑 Logging in as admin_avonetwork@test.com...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError || !authData) {
    console.error("❌ Login failed:", authError?.message);
    return;
  }

  console.log("✅ Logged in successfully! Fetching configs...");

  // 1. Update Parent config
  const { data: parentCurrent, error: parentFetchErr } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('id', parentId)
    .single();

  if (parentFetchErr || !parentCurrent) {
    console.error("❌ Failed to fetch parent config:", parentFetchErr?.message);
  } else {
    const parentTheme = {
      ...(parentCurrent.theme || {}),
      accent: '#E31B23',
      logoImage: '/n2n/muscle_fitness_logo.svg',
      heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
      heroCopy: 'Muscle & Fitness — Mr. Olympia Edition',
      shopifyUrl: 'https://mrolympia.com/weekend-schedule',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: true
    };

    console.log("Updating parent config name, logo, and theme...");
    const { data: parentUpdate, error: parentUpdateErr } = await supabase
      .from('whitelabel_configs')
      .update({
        name: 'Muscle & Fitness',
        logo: '/n2n/muscle_fitness_logo.svg',
        theme: parentTheme
      })
      .eq('id', parentId)
      .select();

    if (parentUpdateErr) {
      console.error("❌ Parent update failed:", parentUpdateErr.message);
    } else {
      console.log("✅ Parent config updated successfully:", parentUpdate);
    }
  }

  // 2. Update Child config
  const { data: childCurrent, error: childFetchErr } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('id', childId)
    .single();

  if (childFetchErr || !childCurrent) {
    console.error("❌ Failed to fetch child config:", childFetchErr?.message);
  } else {
    const childTheme = {
      ...(childCurrent.theme || {}),
      accent: '#E31B23',
      logoImage: '/n2n/muscle_fitness_logo.svg',
      heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
      heroCopy: 'Muscle & Fitness — Bodybuilding Legends & Champion Apparel'
    };

    console.log("Updating child config name, logo, and theme...");
    const { data: childUpdate, error: childUpdateErr } = await supabase
      .from('whitelabel_configs')
      .update({
        name: 'Muscle & Fitness Channel',
        logo: '/n2n/muscle_fitness_logo.svg',
        theme: childTheme
      })
      .eq('id', childId)
      .select();

    if (childUpdateErr) {
      console.error("❌ Child update failed:", childUpdateErr.message);
    } else {
      console.log("✅ Child config updated successfully:", childUpdate);
    }
  }
}

run().catch(console.error);
