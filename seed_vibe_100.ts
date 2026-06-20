import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Parse .env manually
const envLines = fs.readFileSync('.env', 'utf8').split('\n');
let supabaseUrl = '';
let supabaseKey = '';
for (const line of envLines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim().replace(/['"]/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim().replace(/['"]/g, '');
}

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Failed to parse VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY from .env");
  process.exit(1);
}

// Main admin client
const supabase = createClient(supabaseUrl, supabaseKey);

const VIBE_100_ID = 'e5c100aa-c08f-4260-8540-a0cc8bed4e11';

const VIBE_100_CONFIG = {
  id: VIBE_100_ID,
  name: 'VIBE 100',
  domain: 'vibe100.vibenetwork.tv',
  logo: '/n2n/vibe_100_logo.png',
  platform_fee_percentage: 15.00,
  n2n_enabled: true,
  theme: {
    accent: '#E0115F',
    heroCopy: 'VIBE 100 — The Top 100 Networks in the Vibe Ecosystem',
    heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
    logoImage: '/n2n/vibe_100_logo.png',
    enableWatchLive: true,
    enableBooking: false,
    heroLayoutMode: 'verbiage',
    sliderCount: 4,
    n2n_enabled: true,
  }
};

const CHILD_NETWORKS = [
  {
    id: '100a0000-c08f-4260-8540-a0cc8bed4e11',
    name: 'AVO Channel',
    domain: 'v100-avo.vibenetwork.tv',
    logo: '/n2n/avo-network.png',
    parent_network_id: VIBE_100_ID,
    theme: {
      accent: '#D35400',
      heroCopy: 'AVO — Premium College Lifestyle & Gameday Apparel',
      heroImage: '/n2n/baylor.png',
      logoImage: '/n2n/avo-network.png',
      enableWatchLive: true,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      parent_network_id: VIBE_100_ID
    },
    influencer: {
      email: 'v100_avo@vibe100.tv',
      username: 'AVO_V100_Host',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      bio: 'Official Host for AVO Channel on VIBE 100. Rep your school colors!'
    },
    video: {
      title: 'AVO Campus Tour 2026 Highlight Reel',
      video_url: 'https://www.youtube.com/watch?v=vyqy7PcDGLM',
      image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
      tags: ['Apparel', 'Gameday']
    }
  },
  {
    id: '100b0000-c08f-4260-8540-a0cc8bed4e11',
    name: 'Muscle & Fitness Channel',
    domain: 'v100-muscle.vibenetwork.tv',
    logo: '/n2n/muscle_fitness_logo.svg',
    parent_network_id: VIBE_100_ID,
    theme: {
      accent: '#E31B23',
      heroCopy: 'Muscle & Fitness — Bodybuilding Legends & Champion Apparel',
      heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
      logoImage: '/n2n/muscle_fitness_logo.svg',
      enableWatchLive: true,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      parent_network_id: VIBE_100_ID
    },
    influencer: {
      email: 'v100_muscle@vibe100.tv',
      username: 'Muscle_Fitness_Host',
      avatar: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600',
      bio: 'Official Host for Muscle & Fitness Channel on VIBE 100.'
    },
    video: {
      title: 'Muscle & Fitness Training and Conditioning Guide',
      video_url: 'https://www.youtube.com/watch?v=SV7JP7y80UM',
      image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
      tags: ['Bodybuilding', 'Conditioning']
    }
  },
  {
    id: '100c0000-c08f-4260-8540-a0cc8bed4e11',
    name: 'B2K Channel',
    domain: 'v100-b2k.vibenetwork.tv',
    logo: 'https://www.vibe.com/wp-content/uploads/2019/05/B2K-vibe-magazine-digital-cover-1557942120.jpg',
    parent_network_id: VIBE_100_ID,
    theme: {
      accent: '#FF2A54',
      heroCopy: 'B2K — Millennium R&B Grooves, Reunion Tours & Videos',
      heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
      logoImage: 'https://www.vibe.com/wp-content/uploads/2019/05/B2K-vibe-magazine-digital-cover-1557942120.jpg',
      enableWatchLive: true,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      parent_network_id: VIBE_100_ID
    },
    influencer: {
      email: 'v100_b2k@vibe100.tv',
      username: 'B2K_V100_Host',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600',
      bio: 'Official Host for B2K Channel on VIBE 100. Smooth Millennium R&B Vibes.'
    },
    video: {
      title: 'B2K Reunion Tour Live Performance',
      video_url: 'https://www.youtube.com/watch?v=lgyEYMxzVpw',
      image_url: '/n2n/b2k_tour.png',
      tags: ['R&B', 'Music']
    }
  },
  {
    id: '100d0000-c08f-4260-8540-a0cc8bed4e11',
    name: 'Christian Revival Channel',
    domain: 'v100-kple.vibenetwork.tv',
    logo: 'https://ui-avatars.com/api/?name=KPLE+TV&background=004e98&color=fff',
    parent_network_id: VIBE_100_ID,
    theme: {
      accent: '#004e98',
      heroCopy: 'Christian Revival Channel — Faith, Hope & Gospel Broadcasts',
      heroImage: '/kple_network_thumbnail.png',
      logoImage: 'https://ui-avatars.com/api/?name=KPLE+TV&background=004e98&color=fff',
      enableWatchLive: true,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      parent_network_id: VIBE_100_ID
    },
    influencer: {
      email: 'v100_kple@vibe100.tv',
      username: 'CRN_V100_Host',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
      bio: 'Official Host for Christian Revival Channel on VIBE 100. Faith and encouragement.'
    },
    video: {
      title: 'Walking in Faith — Daily Gospel Message',
      video_url: 'https://www.youtube.com/watch?v=5BFZ5rg1ZLc',
      image_url: 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80&w=800',
      tags: ['Gospel', 'Faith']
    }
  },
  /*
  {
    id: '100e0000-c08f-4260-8540-a0cc8bed4e11',
    name: 'FINFIRE Channel',
    domain: 'v100-finfire.vibenetwork.tv',
    logo: 'https://ui-avatars.com/api/?name=FINFIRE&background=270ced&color=fff',
    parent_network_id: VIBE_100_ID,
    theme: {
      accent: '#270ced',
      heroCopy: 'FINFIRE — Financial Independence & Wealth Building',
      heroImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200',
      logoImage: 'https://ui-avatars.com/api/?name=FINFIRE&background=270ced&color=fff',
      enableWatchLive: true,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      parent_network_id: VIBE_100_ID
    },
    influencer: {
      email: 'v100_finfire@vibe100.tv',
      username: 'Finfire_V100_Host',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      bio: 'Official Host for FINFIRE Channel on VIBE 100. Build wealth and change your future.'
    },
    video: {
      title: 'Index Fund Investing Explained in 10 Minutes',
      video_url: 'https://www.youtube.com/watch?v=vwOxJJ80t3k',
      image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
      tags: ['Finance', 'Investing']
    }
  }
  */
];

async function run() {
  console.log("🔑 Logging in as admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError || !authData) {
    console.error("❌ Admin login failed:", authError?.message);
    process.exit(1);
  }
  console.log("✅ Logged in successfully!");

  console.log("\n🚀 Seeding VIBE 100 parent network config...");
  
  // 1. Insert or update VIBE 100 parent
  const { data: existingParent } = await supabase
    .from('whitelabel_configs')
    .select('id')
    .eq('id', VIBE_100_ID)
    .limit(1);

  if (existingParent && existingParent.length > 0) {
    console.log("   Parent already exists, updating...");
    const { error: parentUpdateErr } = await supabase
      .from('whitelabel_configs')
      .update(VIBE_100_CONFIG)
      .eq('id', VIBE_100_ID);
    if (parentUpdateErr) throw parentUpdateErr;
  } else {
    console.log("   Creating parent...");
    const { error: parentInsertErr } = await supabase
      .from('whitelabel_configs')
      .insert(VIBE_100_CONFIG);
    if (parentInsertErr) throw parentInsertErr;
  }
  console.log("✅ VIBE 100 parent config seeded!");

  // 2. Insert or update child channels
  console.log("\n🎓 Seeding child channels and hosts...");
  for (const child of CHILD_NETWORKS) {
    console.log(`\n--- Channel: ${child.name} ---`);
    const { data: existingChild } = await supabase
      .from('whitelabel_configs')
      .select('id')
      .eq('id', child.id)
      .limit(1);

    const childPayload = {
      id: child.id,
      name: child.name,
      domain: child.domain,
      logo: child.logo,
      parent_network_id: child.parent_network_id,
      theme: child.theme
    };

    if (existingChild && existingChild.length > 0) {
      console.log(`   Updating channel config...`);
      const { error: childUpdateErr } = await supabase
        .from('whitelabel_configs')
        .update(childPayload)
        .eq('id', child.id);
      if (childUpdateErr) throw childUpdateErr;
    } else {
      console.log(`   Creating channel config...`);
      const { error: childInsertErr } = await supabase
        .from('whitelabel_configs')
        .insert(childPayload);
      if (childInsertErr) throw childInsertErr;
    }

    // 3. Signup / query host user using a separate client to protect admin session
    const password = 'VibePassword100!';
    let profileId = '';

    const { data: extProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', child.influencer.username)
      .eq('whitelabel_id', child.id)
      .limit(1);

    if (extProfile && extProfile.length > 0) {
      profileId = extProfile[0].id;
      console.log(`   Host profile already exists. ID: ${profileId}`);
    } else {
      console.log(`   Signing up host auth user...`);
      const tempClient = createClient(supabaseUrl, supabaseKey);
      const { data: authData, error: authError } = await tempClient.auth.signUp({
        email: child.influencer.email,
        password,
        options: {
          data: {
            role: 'influencer',
            whitelabel_id: child.id
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          console.log(`   Host auth user already registered. Signing in to retrieve ID...`);
          const { data: signInData, error: signInError } = await tempClient.auth.signInWithPassword({
            email: child.influencer.email,
            password
          });
          if (signInError) {
            console.error(`   Error signing in host:`, signInError.message);
            continue;
          }
          profileId = signInData.user.id;
        } else {
          console.error(`   Failed to sign up host:`, authError.message);
          continue;
        }
      } else if (authData.user) {
        profileId = authData.user.id;
      }
    }

    if (profileId) {
      // 4. Update / Insert profile row
      const profilePayload = {
        username: child.influencer.username,
        role: 'influencer',
        whitelabel_id: child.id,
        avatar_url: child.influencer.avatar,
        bio: child.influencer.bio
      };

      console.log(`   Updating profile details...`);
      const { error: profUpdateErr } = await supabase
        .from('profiles')
        .update(profilePayload)
        .eq('id', profileId);

      if (profUpdateErr) {
        console.log(`   Profile update failed. Trying insert...`);
        const { error: profInsertErr } = await supabase
          .from('profiles')
          .insert({
            id: profileId,
            ...profilePayload
          });
        if (profInsertErr) console.error(`   Failed to insert profile:`, profInsertErr.message);
      } else {
        console.log("   Profile details synced.");
      }

      // 5. Seed video for channel content
      const { data: extVideo } = await supabase
        .from('videos')
        .select('id')
        .eq('creator_id', profileId)
        .eq('title', child.video.title)
        .limit(1);

      if (!extVideo || extVideo.length === 0) {
        console.log(`   Inserting mock video: ${child.video.title}`);
        const { error: videoErr } = await supabase
          .from('videos')
          .insert({
            title: child.video.title,
            video_url: child.video.video_url,
            image_url: child.video.image_url,
            tags: child.video.tags,
            creator_id: profileId
          });
        if (videoErr) console.error(`   Failed to seed video:`, videoErr.message);
        else console.log(`   Seeded video successfully!`);
      } else {
        console.log(`   Mock video already seeded.`);
      }
    }
  }

  console.log("\n🎉 VIBE 100 parent and child channels seeded successfully!");
}

run().catch(console.error);
