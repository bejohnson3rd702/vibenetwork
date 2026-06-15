require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const athletes = [
  {
    email: 'devon_carter@avo.com',
    username: 'devon_carter',
    bio: 'Baylor track & field sprinter. 100m & 200m dash specialist. Repping AVO Baylor.',
    avatar_url: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=400',
    whitelabel_id: 'e86c5900-0d27-420b-98f7-922213540ec2', // Baylor
    college_name: 'Baylor'
  },
  {
    email: 'elena_vance@avo.com',
    username: 'elena_vance',
    bio: 'Colorado skiers champion. Slope-style athlete. Repping AVO Colorado.',
    avatar_url: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&q=80&w=400',
    whitelabel_id: 'd0fd9b57-d8af-474b-a011-aa8babeadb34', // Colorado
    college_name: 'Colorado'
  },
  {
    email: 'marcus_miller@avo.com',
    username: 'marcus_miller',
    bio: 'Georgia Bulldogs defensive back. National Championship contender. Repping AVO Georgia.',
    avatar_url: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=400',
    whitelabel_id: '83b21eac-0f37-4b66-b7e0-1320105e82f1', // Georgia
    college_name: 'Georgia'
  },
  {
    email: 'sarah_jenkins@avo.com',
    username: 'sarah_jenkins',
    bio: 'Mississippi State soccer goalkeeper. SEC All-Freshman team. Repping AVO Miss State.',
    avatar_url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400',
    whitelabel_id: 'b7f74446-403b-4f9b-8be1-1bd2df35df54', // Miss State
    college_name: 'Mississippi State'
  },
  {
    email: 'jalen_ross@avo.com',
    username: 'jalen_ross',
    bio: 'Alabama Crimson Tide wide receiver. Speedster. Repping AVO Alabama.',
    avatar_url: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&q=80&w=400',
    whitelabel_id: 'be124de3-82be-4017-b6d0-58b0132f5550', // Alabama
    college_name: 'Alabama'
  },
  {
    email: 'clara_thorne@avo.com',
    username: 'clara_thorne',
    bio: 'Ole Miss tennis star. SEC singles player of the year. Repping AVO Ole Miss.',
    avatar_url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400',
    whitelabel_id: 'eb2428a2-87e2-46ed-b7c5-c1f5e6c4cf1b', // Ole Miss
    college_name: 'Ole Miss'
  },
  {
    email: 'brandon_cole@avo.com',
    username: 'brandon_cole',
    bio: 'Vanderbilt Commodores baseball pitcher. Fastball specialist. Repping AVO Vanderbilt.',
    avatar_url: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=400',
    whitelabel_id: '6b797710-bec0-4887-8336-d1eaf76cd307', // Vanderbilt
    college_name: 'Vanderbilt'
  },
  {
    email: 'derek_vance@avo.com',
    username: 'derek_vance',
    bio: 'Penn State Nittany Lions wrestler. All-American contender. Repping AVO Penn State.',
    avatar_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400',
    whitelabel_id: '16e37654-6a62-490c-bb55-aee61558eee4', // Penn State
    college_name: 'Penn State'
  }
];

async function seedAthletes() {
  console.log('Seeding collegiate athletes...');

  for (const athlete of athletes) {
    const password = 'AthletePassword123!';
    
    // Check if profile exists by username
    const { data: existingProfiles, error: checkError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', athlete.username);

    if (checkError) {
      console.error(`[ERROR] Checking athlete ${athlete.username}:`, checkError);
      continue;
    }

    let userId = null;

    if (existingProfiles && existingProfiles.length > 0) {
      console.log(`[SKIP SIGNUP] User profile ${athlete.username} already exists.`);
      userId = existingProfiles[0].id;
    } else {
      // Sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: athlete.email,
        password,
        options: {
          data: {
            username: athlete.username,
            role: 'influencer',
            whitelabel_id: athlete.whitelabel_id
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          // Fallback if auth user exists but profile username matches something else or profile was not fetched properly
          console.log(`[WARN] Auth user already exists for ${athlete.email}. Fetching profile...`);
          const { data: authUserResult, error: authUserErr } = await supabase.auth.signInWithPassword({
            email: athlete.email,
            password
          });
          if (authUserResult && authUserResult.user) {
            userId = authUserResult.user.id;
          } else {
            console.error(`[ERROR] Could not authenticate existing user ${athlete.email}:`, authUserErr);
            continue;
          }
        } else {
          console.error(`[ERROR] Failed to sign up ${athlete.email}:`, authError.message);
          continue;
        }
      } else if (authData.user) {
        console.log(`[SUCCESS SIGNUP] Signed up auth user for ${athlete.username}`);
        userId = authData.user.id;
      }
    }

    if (userId) {
      // Update or insert profile info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: athlete.username,
          role: 'influencer',
          whitelabel_id: athlete.whitelabel_id,
          bio: athlete.bio,
          avatar_url: athlete.avatar_url
        })
        .eq('id', userId);

      if (profileError) {
        console.error(`[ERROR] Failed to update profile for ${athlete.username}:`, profileError.message);
      } else {
        console.log(`[SUCCESS PROFILE] Updated profile info for ${athlete.username} (${athlete.college_name})`);
      }
    }
  }
}

seedAthletes();
