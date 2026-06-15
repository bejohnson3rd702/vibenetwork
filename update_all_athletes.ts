import { supabase } from './supabaseClientLoader.ts';

const ATHLETE_IMAGES: Record<string, string> = {
  // 1. Soccer Goalkeepers / Players
  sarah_jenkins: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400&h=400',
  hannah_state: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400&h=400',
  lauren_anchored: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400&h=400',

  // 2. Basketball
  marcus_jones: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400&h=400',

  // 3. Gymnasts
  elena_rodriguez: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=400&h=400',
  dawg_madison: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=400&h=400',

  // 4. Baseball Pitcher
  brandon_cole: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=400&h=400',

  // 5. Football (American)
  jalen_ross: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=400&h=400',
  charlie_kline: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=400&h=400',
  davis_miller: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=400&h=400',
  marcus_miller: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=400&h=400',

  // 6. Track & Field / Sprinters
  devon_carter: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=400&h=400',
  emily_nittany: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=400&h=400',

  // 7. Tennis
  clara_thorne: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400&h=400',
  bears_lily: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400&h=400',

  // 8. Skier
  elena_vance: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&q=80&w=400&h=400',

  // 9. Wrestler / Combat Athlete
  derek_vance: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400&h=400',

  // 10. Cheerleading / Activewear / College Fans
  chloe_psu: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400&h=400',
  bama_sarah: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=400&h=400',
  roll_tide_jenna: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=400&h=400',
  rebel_taylor: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400&h=400',
  olemiss_brooke: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400&h=400',
  vandy_sophia: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400&h=400',
  uga_olivia: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400&h=400',
  hail_state_hannah: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=400&h=400',
  msstate_charlotte: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400&h=400',
  baylor_bella: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=400&h=400',
  buffs_zoe: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400&h=400',
  colorado_mia: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400&h=400',
};

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

  console.log("✅ Logged in successfully! Updating all athlete images...");

  let updatedCount = 0;
  for (const [username, avatarUrl] of Object.entries(ATHLETE_IMAGES)) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('username', username)
      .select('username');

    if (error) {
      console.error(`❌ Failed to update profile for ${username}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`✅ Updated profile for ${username}`);
      updatedCount++;
    } else {
      console.log(`⚠️ Profile not found or update skipped for ${username}`);
    }
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} athlete profiles in database!`);
}

run().catch(console.error);
