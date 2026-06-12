import { supabase } from './supabaseClientLoader.ts';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Helper to create client with specific email login for getting IDs
const envLines = fs.readFileSync('.env', 'utf8').split('\n');
let supabaseUrl = '';
let supabaseKey = '';
for (const line of envLines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim().replace(/['"]/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim().replace(/['"]/g, '');
}

async function getOrCreateCategory(title: string) {
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('title', title)
    .limit(1);

  if (existing && existing.length > 0) {
    return existing[0].id;
  }

  const { data: created, error } = await supabase
    .from('categories')
    .insert({ title })
    .select()
    .single();

  if (error) {
    console.error(`❌ Error creating category "${title}":`, error.message);
    throw error;
  }
  return created.id;
}

const HOSTS = [
  // TCT Network
  {
    networkName: 'TCT Network',
    username: 'Stephen_Vancura',
    email: 'stephenvancura_kple@test.com',
    bio: 'Host of Bread of Life Bible Study. Diving deep into the scriptures to bring the bread of life.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    videos: [
      {
        title: 'God doesn’t want robotic prayers—He wants your heart.',
        url: 'https://www.youtube.com/watch?v=5BFZ5rg1ZLc',
        image: 'https://images.unsplash.com/photo-1504052434569-70ad585e5151?auto=format&fit=crop&q=80&w=600',
        category: 'Bible Studies',
        tags: ['TCT', 'Bible Study', 'Bread of Life']
      },
      {
        title: 'God is fighting for you in ways you may not even see.',
        url: 'https://www.youtube.com/watch?v=vwmCBGEmpY0',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
        category: 'Bible Studies',
        tags: ['TCT', 'Bible Study', 'Grace']
      }
    ],
    post: {
      content: "Blessed to share our new Bible study series on Bread of Life. Join us as we examine the depth of God's grace this Wednesday at 8 PM.",
      likes: 120,
      image: 'https://images.unsplash.com/photo-1504052434569-70ad585e5151?auto=format&fit=crop&q=80&w=600'
    }
  },
  {
    networkName: 'TCT Network',
    username: 'Cynthia_Morris',
    email: 'cynthiamorris_kple@test.com',
    bio: 'Pastor of Family Dominion Church. Reaching families and building lives on the Word.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    videos: [
      {
        title: 'There is power in the name of Jesus.',
        url: 'https://www.youtube.com/watch?v=Z5q63JNeAZs',
        image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=600',
        category: 'Sermons & Messages',
        tags: ['TCT', 'Sermon', 'Family Dominion']
      }
    ],
    post: {
      content: "Had an amazing Sunday service at Family Dominion Church! God is building strong, victorious families here in Central Texas.",
      likes: 85,
      image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=600'
    }
  },
  {
    networkName: 'TCT Network',
    username: 'Claudette_Morgan_Scott',
    email: 'claudettemorgan_kple@test.com',
    bio: 'Founder of Impact Nation ministries. Empowering lives through faith and biblical guidance.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    videos: [
      {
        title: 'Frankly Speaking with Pastor Frank',
        url: 'https://www.youtube.com/watch?v=x2bt6n_Xkq8',
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600',
        category: 'Sermons & Messages',
        tags: ['TCT', 'Impact Nation', 'Empowerment']
      }
    ],
    post: {
      content: "We are taking back territory! Impact Nation is expanding. Join us this Wednesday morning for inspiration and fellowship.",
      likes: 95,
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600'
    }
  },
  // The Walk TV
  {
    networkName: 'The Walk TV',
    username: 'Doug_Detert',
    email: 'dougdetert_kple@test.com',
    bio: 'Host of Meditations In The Revelation. Unlocking Biblical prophecy.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
    videos: [
      {
        title: 'The Word Of Life - The Temptation Of Jesus',
        url: 'https://www.youtube.com/watch?v=EWGs1CV8g_s',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600',
        category: 'Bible Studies',
        tags: ['The Walk TV', 'Revelation', 'Prophecy']
      }
    ],
    post: {
      content: "New Revelation studies have been uploaded. Take time to study biblical prophecy and align with God's perfect calendar.",
      likes: 70,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600'
    }
  },
  {
    networkName: 'The Walk TV',
    username: 'Darryl_Shaw',
    email: 'darrylshaw_kple@test.com',
    bio: 'Bishop Darryl Shaw, co-host of Men of Integrity study group. Supporting strong families.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    videos: [
      {
        title: 'Men of Integrity - Honor and Strength',
        url: 'https://www.youtube.com/watch?v=9drtdb9zqy4',
        image: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?auto=format&fit=crop&q=80&w=600',
        category: 'Sermons & Messages',
        tags: ['The Walk TV', 'Men of Integrity', 'Leadership']
      }
    ],
    post: {
      content: "Calling all Men of Integrity. It's time to stand up for our families, protect our homes, and lead our communities with honor.",
      likes: 65,
      image: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?auto=format&fit=crop&q=80&w=600'
    }
  },
  // Enlace USA
  {
    networkName: 'Enlace USA',
    username: 'Mitzi_Gibson',
    email: 'mitzigibson_kple@test.com',
    bio: 'Reverend Mitzi Gibson, host of The Word of Life / La Palabra de Vida.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    videos: [
      {
        title: 'La Palabra de Vida - Una Nueva Identidad',
        url: 'https://www.youtube.com/watch?v=e5PyPssFC5U',
        image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&q=80&w=600',
        category: 'Spanish Ministries',
        tags: ['Enlace', 'Palabra de Vida', 'Mitzi Gibson']
      },
      {
        title: 'The Word of Life - Walk in Divine Victory',
        url: 'https://www.youtube.com/watch?v=ak06e1w0n3s',
        image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=600',
        category: 'Sermons & Messages',
        tags: ['TCT', 'Word of Life', 'Victory']
      }
    ],
    post: {
      content: "¡Dios tiene un propósito maravilloso para tu vida! Sintoniza La Palabra de Vida esta semana en Enlace USA para un mensaje de victoria.",
      likes: 110,
      image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&q=80&w=600'
    }
  },
  // Attention Central Texas
  {
    networkName: 'Attention Central Texas',
    username: 'ACT_Community_Host',
    email: 'acthost_kple@test.com',
    bio: 'Host and interviewer for Attention Central Texas public service & local community events.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    videos: [
      {
        title: 'Attention Central Texas - Local Public Service Bulletin',
        url: 'https://www.youtube.com/watch?v=vdHg6fe8P5Y',
        image: 'https://images.unsplash.com/photo-1492534513006-37715f336a39?auto=format&fit=crop&q=80&w=600',
        category: 'Community News',
        tags: ['ACT', 'Community', 'Texas']
      },
      {
        title: 'Veterans Resources Show - Accessing Local Support',
        url: 'https://www.youtube.com/watch?v=vdHg6fe8P5Y',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
        category: 'Community News',
        tags: ['ACT', 'Veterans', 'Support']
      }
    ],
    post: {
      content: "Thank you to everyone who joined us for our community forum on ACT. Let's keep Central Texas informed and strong.",
      likes: 150,
      image: 'https://images.unsplash.com/photo-1492534513006-37715f336a39?auto=format&fit=crop&q=80&w=600'
    }
  },
  // Smile of a Child
  {
    networkName: 'Smile of a Child',
    username: 'Smile_Kids_Host',
    email: 'smilehost_kple@test.com',
    bio: 'Presenter for Smile of a Child, providing faith-filled stories and cartoons for children.',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=256',
    videos: [
      {
        title: 'Superbook - A Giant Adventure (David and Goliath)',
        url: 'https://www.youtube.com/watch?v=TvJHIFotb3s',
        image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&q=80&w=600',
        category: 'Kids & Youth',
        tags: ['Smile', 'Kids', 'Bible Story']
      }
    ],
    post: {
      content: "The children are learning that they can overcome any giant with God's help! Watch new Superbook episodes playing now!",
      likes: 130,
      image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&q=80&w=600'
    }
  },
  // Positiv
  {
    networkName: 'Positiv',
    username: 'Positiv_Family_Host',
    email: 'positivhost_kple@test.com',
    bio: 'Host presenting positive family films, stories, and trailers on Positiv Network.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    videos: [
      {
        title: 'Positiv Cinema - Family Movie Night Spotlight',
        url: 'https://www.youtube.com/watch?v=p1k8H32aB_w',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600',
        category: 'Family Movies',
        tags: ['Positiv', 'Family', 'Movies']
      }
    ],
    post: {
      content: "Uplifting and encouraging movies are what we do best. Check out the new family films list for this weekend on Positiv!",
      likes: 90,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600'
    }
  }
];

async function seedContent() {
  console.log('🌱 Seeding KPLE TV N2N Child Content (dev DB)...\n');

  console.log("🔑 Logging in as admin_avonetwork@test.com...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.error("❌ Login failed:", authError.message);
    process.exit(1);
  }
  console.log("✅ Logged in successfully! Admin ID:", authData.user.id);

  // Get parent config
  const { data: parentConfig } = await supabase
    .from('whitelabel_configs')
    .select('id')
    .eq('name', 'KPLE TV')
    .single();

  if (!parentConfig) {
    console.error("❌ KPLE TV parent config not found. Please run seed_kple_n2n.ts first!");
    process.exit(1);
  }
  const parentId = parentConfig.id;
  console.log("✅ KPLE TV Parent ID:", parentId);

  // Get all child networks
  const { data: childConfigs } = await supabase
    .from('whitelabel_configs')
    .select('id, name')
    .eq('parent_network_id', parentId);

  if (!childConfigs || childConfigs.length === 0) {
    console.error("❌ KPLE TV child networks not found. Please run seed_kple_n2n.ts first!");
    process.exit(1);
  }
  console.log(`✅ Found ${childConfigs.length} child networks.`);

  // Loop through each host
  for (const host of HOSTS) {
    const childConfig = childConfigs.find(c => c.name === host.networkName);
    if (!childConfig) {
      console.warn(`⚠️ Child network "${host.networkName}" not found. Skipping host "${host.username}".`);
      continue;
    }
    const childId = childConfig.id;
    console.log(`\n⛪ Seeding host "${host.username}" for network "${host.networkName}" (${childId})...`);

    // A. Check/Create Auth User for Host
    const password = 'TestPassword123!';
    let hostUserId = '';

    const { data: existingHostProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', host.username)
      .eq('whitelabel_id', childId)
      .limit(1);

    if (existingHostProfile && existingHostProfile.length > 0) {
      hostUserId = existingHostProfile[0].id;
      console.log(`  👤 Host profile exists. ID: ${hostUserId}`);
    } else {
      console.log(`  👤 Signing up host auth account: ${host.email}...`);
      const { data: hostAuthData, error: hostAuthError } = await supabase.auth.signUp({
        email: host.email,
        password,
        options: {
          data: {
            role: 'influencer',
            whitelabel_id: childId
          }
        }
      });

      if (hostAuthError) {
        if (hostAuthError.message.includes('already registered') || hostAuthError.message.includes('already exists')) {
          console.log(`  👤 Auth account already registered. Logging in temporarily to retrieve ID...`);
          const tempClient = createClient(supabaseUrl, supabaseKey);
          const { data: tempAuthData, error: tempAuthError } = await tempClient.auth.signInWithPassword({
            email: host.email,
            password
          });
          if (tempAuthError) {
            console.error(`  ❌ Temporary login failed for host:`, tempAuthError.message);
            continue;
          }
          hostUserId = tempAuthData.user.id;
        } else {
          console.error(`  ❌ Sign up failed for host:`, hostAuthError.message);
          continue;
        }
      } else if (hostAuthData.user) {
        hostUserId = hostAuthData.user.id;
      }
      console.log(`  👤 Host authenticated user ID: ${hostUserId}`);
    }

    // B. Update/Insert Host Profile Row
    const hostProfilePayload = {
      username: host.username,
      role: 'influencer',
      whitelabel_id: childId,
      avatar_url: host.avatar,
      bio: host.bio
    };

    console.log(`  👤 Updating profile row for ${host.username}...`);
    const { error: hostProfUpdateErr } = await supabase
      .from('profiles')
      .update(hostProfilePayload)
      .eq('id', hostUserId);

    if (hostProfUpdateErr) {
      console.warn(`  ⚠️ Profile update failed, inserting profiles row: ${hostProfUpdateErr.message}`);
      const { error: hostProfInsertErr } = await supabase
        .from('profiles')
        .insert({
          id: hostUserId,
          ...hostProfilePayload
        });
      if (hostProfInsertErr) {
        console.error(`  ❌ Profiles insert failed:`, hostProfInsertErr.message);
        continue;
      }
    }

    // Make sure we log back in as admin_avonetwork@test.com
    const { error: adminLoginErr } = await supabase.auth.signInWithPassword({
      email: 'admin_avonetwork@test.com',
      password: 'TestPassword123!'
    });
    if (adminLoginErr) {
      console.error("❌ Failed to restore admin session:", adminLoginErr.message);
      process.exit(1);
    }

    // C. Seed Videos
    for (const vid of host.videos) {
      const catId = await getOrCreateCategory(vid.category);
      
      const { data: extVid } = await supabase
        .from('videos')
        .select('id')
        .eq('title', vid.title)
        .eq('creator_id', hostUserId)
        .limit(1);

      const videoPayload = {
        title: vid.title,
        video_url: vid.url,
        image_url: vid.image,
        category_id: catId,
        creator_id: hostUserId,
        tags: vid.tags
      };

      if (extVid && extVid.length > 0) {
        console.log(`    📺 Video "${vid.title}" exists. Updating...`);
        const { error: vidUpdateErr } = await supabase
          .from('videos')
          .update(videoPayload)
          .eq('id', extVid[0].id);
        if (vidUpdateErr) console.error(`    ❌ Failed to update video:`, vidUpdateErr.message);
      } else {
        console.log(`    📺 Video "${vid.title}" doesn't exist. Inserting...`);
        const { error: vidInsertErr } = await supabase
          .from('videos')
          .insert(videoPayload);
        if (vidInsertErr) console.error(`    ❌ Failed to insert video:`, vidInsertErr.message);
      }
    }

    // D. Seed Post
    if (host.post) {
      const { data: extPost } = await supabase
        .from('posts')
        .select('id')
        .eq('content', host.post.content)
        .eq('creator_id', hostUserId)
        .limit(1);

      const postPayload = {
        content: host.post.content,
        likes: host.post.likes,
        image_url: host.post.image,
        creator_id: hostUserId
      };

      if (extPost && extPost.length > 0) {
        console.log(`    📝 Post exists. Updating...`);
        const { error: postUpdateErr } = await supabase
          .from('posts')
          .update(postPayload)
          .eq('id', extPost[0].id);
        if (postUpdateErr) console.error(`    ❌ Failed to update post:`, postUpdateErr.message);
      } else {
        console.log(`    📝 Post doesn't exist. Inserting...`);
        const { error: postInsertErr } = await supabase
          .from('posts')
          .insert(postPayload);
        if (postInsertErr) console.error(`    ❌ Failed to insert post:`, postInsertErr.message);
      }
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`\n🚀 KPLE TV Child Content Seeding Complete!\n`);
  console.log(`   Check child networks by opening parent portal:`);
  console.log(`   http://localhost:5173/?tenant=${parentId}\n`);
  console.log('═'.repeat(60) + '\n');
}

seedContent().catch(console.error);
