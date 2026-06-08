import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import crypto from 'crypto';

// Load variables from .env
const envLines = fs.readFileSync('.env', 'utf8').split('\n');
let supabaseUrl = '';
let supabaseKey = '';
for (const line of envLines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim().replace(/['"]/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim().replace(/['"]/g, '');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Logging in as admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.error("Login failed:", authError.message);
    return;
  }

  const userId = authData.user.id;
  console.log("Logged in successfully! User ID:", userId);

  console.log("Ensuring admin permissions on user profile...");
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ is_admin: true })
    .eq('id', userId);

  if (profileError) {
    console.warn("Warning: Failed to set is_admin on profile:", profileError.message);
  } else {
    console.log("Admin permissions verified.");
  }

  // 1. Create/Update Parent B2K Network
  const B2K_PARENT_CONFIG = {
    owner_id: userId,
    name: 'B2K Network',
    domain: 'b2k.vibenetwork.tv',
    logo: 'https://www.vibe.com/wp-content/uploads/2019/05/B2K-vibe-magazine-digital-cover-1557942120.jpg',
    platform_fee_percentage: 15,
    parent_network_id: null,
    n2n_enabled: true,
    theme: {
      accent: '#FF2A54',
      heroCopy: 'B2K — THE BOYS 4 LIFE TOUR',
      heroImage: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-5-1557518926.jpg',
      logoImage: 'https://www.vibe.com/wp-content/uploads/2019/05/B2K-vibe-magazine-digital-cover-1557942120.jpg',
      shopifyUrl: 'https://b2kofficial.com/tour',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: true,
      n2n_enabled: true
    }
  };

  console.log("Inserting/Updating B2K parent config...");
  const { data: existingParent } = await supabase
    .from('whitelabel_configs')
    .select('id')
    .eq('domain', 'b2k.vibenetwork.tv')
    .limit(1);

  let parentId = '';
  if (existingParent && existingParent.length > 0) {
    parentId = existingParent[0].id;
    console.log(`B2K parent config already exists with ID: ${parentId}. Updating...`);
    const { error } = await supabase
      .from('whitelabel_configs')
      .update(B2K_PARENT_CONFIG)
      .eq('id', parentId);
    if (error) console.error("Update error parent:", error);
  } else {
    console.log("B2K parent config doesn't exist. Inserting...");
    const { data, error } = await supabase
      .from('whitelabel_configs')
      .insert(B2K_PARENT_CONFIG)
      .select();
    if (error || !data) {
      console.error("Insert error parent:", error);
      return;
    }
    parentId = data[0].id;
  }
  console.log("Parent Config Setup Complete. ID:", parentId);

  // Create/Update Parent Profile for B2K
  const { data: parentProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', 'B2K')
    .limit(1);

  let parentProfileId = '';
  if (!parentProfile || parentProfile.length === 0) {
    console.log("Creating parent profile for B2K...");
    parentProfileId = crypto.randomUUID();
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: parentProfileId,
        username: 'B2K',
        role: 'influencer',
        whitelabel_id: parentId,
        avatar_url: 'https://www.vibe.com/wp-content/uploads/2019/05/B2K-vibe-magazine-digital-cover-1557942120.jpg',
        bio: 'B2K Official — The Millennium Boy Band'
      });
    if (error) console.error("Error creating B2K profile:", error.message);
  } else {
    parentProfileId = parentProfile[0].id;
    console.log("Updating parent profile for B2K...");
    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_url: 'https://www.vibe.com/wp-content/uploads/2019/05/B2K-vibe-magazine-digital-cover-1557942120.jpg',
        whitelabel_id: parentId
      })
      .eq('id', parentProfileId);
    if (error) console.error("Error updating B2K profile:", error.message);
  }

  // 2. Setup Categories
  console.log("Setting up categories...");
  const musicVideosCatId = await getOrCreateCategory("Music Videos");
  const interviewsCatId = await getOrCreateCategory("BTS & Interviews");

  // Seed B2K Group Videos
  console.log("Seeding B2K group videos...");
  const B2K_GROUP_VIDEOS = [
    { title: "B2K - Bump, Bump, Bump (Official Music Video) ft. P. Diddy", url: "https://www.youtube.com/watch?v=lgyEYMxzVpw", categoryId: musicVideosCatId, image: "https://i.ytimg.com/vi/lgyEYMxzVpw/hqdefault.jpg" },
    { title: "B2K - Uh Huh (Official Music Video)", url: "https://www.youtube.com/watch?v=CgiX53hjAPc", categoryId: musicVideosCatId, image: "https://i.ytimg.com/vi/CgiX53hjAPc/hqdefault.jpg" },
    { title: "B2K - Gots Ta Be (Official Music Video)", url: "https://www.youtube.com/watch?v=d8BFf32yDWQ", categoryId: musicVideosCatId, image: "https://i.ytimg.com/vi/d8BFf32yDWQ/hqdefault.jpg" },
    { title: "B2K - Girlfriend (Official Music Video)", url: "https://www.youtube.com/watch?v=6OihwykYdBc", categoryId: musicVideosCatId, image: "https://i.ytimg.com/vi/6OihwykYdBc/hqdefault.jpg" }
  ];

  for (const vid of B2K_GROUP_VIDEOS) {
    const { data: extVid } = await supabase
      .from('videos')
      .select('id')
      .eq('title', vid.title)
      .eq('creator_id', parentProfileId)
      .limit(1);

    if (extVid && extVid.length > 0) {
      console.log(`  Updating parent group video: "${vid.title}"...`);
      const { error } = await supabase
        .from('videos')
        .update({
          video_url: vid.url,
          image_url: vid.image,
          category_id: vid.categoryId
        })
        .eq('id', extVid[0].id);
      if (error) console.error(`    Error updating group video:`, error.message);
    } else {
      console.log(`  Seeding parent group video: "${vid.title}"...`);
      const { error } = await supabase
        .from('videos')
        .insert({
          title: vid.title,
          video_url: vid.url,
          image_url: vid.image,
          category_id: vid.categoryId,
          creator_id: parentProfileId,
          tags: ['B2K', 'Group', 'Music']
        });
      if (error) console.error(`    Error seeding group video:`, error.message);
    }
  }

  // 3. Setup Members (Child Networks & Profiles & Content)
  const MEMBERS = [
    {
      name: 'Omarion',
      domain: 'omarion.vibenetwork.tv',
      accent: '#00E5FF',
      heroCopy: "Omarion — New Album 'O2' & Solo Music",
      heroImage: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-4-1557518838.jpg',
      logo: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-4-1557518838.jpg',
      bio: 'Omarion — Lead Singer of B2K and Solo Artist. Catch the new album O2.',
      videos: [
        { title: "Omarion - 'Touch' (Official Music Video)", url: "https://www.youtube.com/watch?v=_Z_5lpErdyM", categoryId: musicVideosCatId, image: "https://i.ytimg.com/vi/_Z_5lpErdyM/hqdefault.jpg" },
        { title: "Omarion - 'Ice Box' (Official Music Video)", url: "https://www.youtube.com/watch?v=OJl-628FyIk", categoryId: musicVideosCatId, image: "https://i.ytimg.com/vi/OJl-628FyIk/hqdefault.jpg" }
      ],
      products: [
        { title: "Omarion 'O2' Limited Vinyl LP", price: 34.99, type: 'physical', image: "https://images.unsplash.com/photo-1539628399243-734011af4063?auto=format&fit=crop&q=80&w=400" },
        { title: "Omarion Signature Embroidered Sweatshirt", price: 59.99, type: 'apparel', image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400" }
      ],
      posts: [
        { content: "The O2 album is finally out! Incredibly grateful for the fans who have walked this path with me since day one. Full Circle.", likes: 1420, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800" }
      ]
    },
    {
      name: 'Lil Fizz',
      domain: 'fizz.vibenetwork.tv',
      accent: '#9B5DE5',
      heroCopy: "Lil' Fizz — Music Production & Beats",
      heroImage: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-3-1557518763.jpg',
      logo: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-3-1557518763.jpg',
      bio: "Lil' Fizz — Rapper, Producer, and B2K member. Check out my new beat kits and tour apparel.",
      videos: [
        { title: "Lil' Fizz - 'Fluid' (Official Music Video) ft. Missez", url: "https://www.youtube.com/watch?v=AdJEg47RTZ4", categoryId: musicVideosCatId, image: "https://i.ytimg.com/vi/AdJEg47RTZ4/hqdefault.jpg" }
      ],
      products: [
        { title: "Fizz Signature R&B Drum Kit (WAV)", price: 29.99, type: 'digital', image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400" }
      ],
      posts: [
        { content: "Back in the studio cooking up beats for the Boys 4 Life album. The Millennium Tour is going to be legendary! 🎤🔥", likes: 520, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800" }
      ]
    },
    {
      name: 'J-Boog',
      domain: 'jboog.vibenetwork.tv',
      accent: '#F15BB5',
      heroCopy: "J-Boog — Reggae Vibes & Brightside Tour",
      heroImage: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-2-1557518658.jpg',
      logo: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-2-1557518658.jpg',
      bio: 'J-Boog — B2K member and Solo Reggae artist. Touring worldwide.',
      videos: [
        { title: "B2K - Big Boy TV Reunion Interview ft. J-Boog", url: "https://www.youtube.com/watch?v=JwIHOk7b5sQ", categoryId: interviewsCatId, image: "https://i.ytimg.com/vi/JwIHOk7b5sQ/hqdefault.jpg" }
      ],
      products: [
        { title: "Brightside Reggae Tour Tee", price: 24.99, type: 'apparel', image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400" }
      ],
      posts: [
        { content: "Blessed to be back on stage with my brothers for our 25th anniversary. Opening night in Columbia was absolute fire!", likes: 780, image: "https://images.unsplash.com/photo-1482440308425-276ad0f28b19?auto=format&fit=crop&q=80&w=800" }
      ]
    },
    {
      name: 'Raz-B',
      domain: 'razb.vibenetwork.tv',
      accent: '#00F5D4',
      heroCopy: "Raz-B — Acting, Solo Projects & Live Streams",
      heroImage: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-8-1557519170.jpg',
      logo: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-8-1557519170.jpg',
      bio: 'Raz-B — Singer, Actor, and Entertainer. Rep the legacy of the millennium.',
      videos: [
        { title: "Raz-B - Exclusive No Jumper Interview", url: "https://www.youtube.com/watch?v=boAP0v2Kckk", categoryId: interviewsCatId, image: "https://i.ytimg.com/vi/boAP0v2Kckk/hqdefault.jpg" }
      ],
      products: [
        { title: "Raz-B Tour Meet & Greet VIP Pass", price: 150.00, type: 'tickets', image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400" }
      ],
      posts: [
        { content: "Nothing stops the brotherhood. The Boys 4 Life 2026 Tour is going strong. Love to all the supporters who showed out!", likes: 410, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" }
      ]
    }
  ];

  console.log("Seeding B2K member networks, profiles, and content...");
  for (const member of MEMBERS) {
    // A. Check/Create Child Whitelabel Config
    const { data: extConfig } = await supabase
      .from('whitelabel_configs')
      .select('id')
      .eq('name', `${member.name} Network`)
      .limit(1);

    const childPayload = {
      owner_id: userId,
      name: `${member.name} Network`,
      domain: member.domain,
      logo: member.logo,
      parent_network_id: parentId,
      n2n_enabled: false,
      platform_fee_percentage: 30,
      theme: {
        accent: member.accent,
        heroCopy: member.heroCopy,
        heroImage: member.heroImage,
        logoImage: member.logo,
        enableWatchLive: true,
        enableBooking: false,
        heroLayoutMode: 'verbiage',
        sliderCount: 4,
        parent_network_id: parentId
      }
    };

    let childId = '';
    if (extConfig && extConfig.length > 0) {
      childId = extConfig[0].id;
      console.log(`  Child Config "${member.name} Network" exists (ID: ${childId}). Updating...`);
      const { error } = await supabase
        .from('whitelabel_configs')
        .update(childPayload)
        .eq('id', childId);
      if (error) console.error(`  Error updating child config for ${member.name}:`, error.message);
    } else {
      console.log(`  Child Config "${member.name} Network" doesn't exist. Inserting...`);
      const { data, error } = await supabase
        .from('whitelabel_configs')
        .insert(childPayload)
        .select();
      if (error || !data) {
        console.error(`  Error inserting child config for ${member.name}:`, error?.message);
        continue;
      }
      childId = data[0].id;
    }

    // B. Check/Create Creator Profile via Auth SignUp/SignIn if needed
    const email = `${member.name.toLowerCase().replace(/[^a-z0-9]/g, '')}_b2k@test.com`;
    const password = 'TestPassword123!';

    let { data: extProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('whitelabel_id', childId)
      .limit(1);

    let profileId = '';

    if (extProfile && extProfile.length > 0) {
      profileId = extProfile[0].id;
      console.log(`  Profile for ${member.name} already exists. ID: ${profileId}`);
    } else {
      console.log(`  Signing up auth user for ${member.name} (${email})...`);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'influencer',
            whitelabel_id: childId
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          console.log(`  Auth user already registered. Querying profiles or signing in temporarily...`);
          // We can sign in to a separate temporary client to fetch the user ID without corrupting admin session
          const tempClient = createClient(supabaseUrl, supabaseKey);
          const { data: signInData, error: signInError } = await tempClient.auth.signInWithPassword({
            email,
            password
          });
          if (signInError) {
            console.error(`  Error signing in to get ID:`, signInError.message);
            continue;
          }
          profileId = signInData.user.id;
        } else {
          console.error(`  Failed to sign up ${member.name}:`, authError.message);
          continue;
        }
      } else if (authData.user) {
        profileId = authData.user.id;
      }
      console.log(`  Seeded auth user for ${member.name}. ID: ${profileId}`);
    }

    // C. Update Profile to set username, bio, etc.
    const profilePayload = {
      username: member.name.replace(' ', '_'),
      role: 'influencer',
      whitelabel_id: childId,
      avatar_url: member.logo,
      bio: member.bio
    };

    console.log(`  Updating profile details for "${member.name}"...`);
    const { error: profUpdateErr } = await supabase
      .from('profiles')
      .update(profilePayload)
      .eq('id', profileId);

    if (profUpdateErr) {
      console.error(`  Error updating profile details for ${member.name}:`, profUpdateErr.message);
      // Wait! If the row in profiles doesn't exist, we must insert it. In case auth signup trigger didn't fire.
      const { error: profInsertErr } = await supabase
        .from('profiles')
        .insert({
          id: profileId,
          ...profilePayload
        });
      if (profInsertErr) {
        console.error(`  Error inserting profile row for ${member.name}:`, profInsertErr.message);
        continue;
      }
    }

    // D. Seed/Update Videos for Member
    for (const vid of member.videos) {
      const { data: extVid } = await supabase
        .from('videos')
        .select('id')
        .eq('title', vid.title)
        .eq('creator_id', profileId)
        .limit(1);

      if (extVid && extVid.length > 0) {
        console.log(`    Updating video: "${vid.title}"...`);
        const { error } = await supabase
          .from('videos')
          .update({
            video_url: vid.url,
            image_url: vid.image,
            category_id: vid.categoryId
          })
          .eq('id', extVid[0].id);
        if (error) console.error(`    Error updating video:`, error.message);
      } else {
        console.log(`    Seeding video: "${vid.title}"...`);
        const { error } = await supabase
          .from('videos')
          .insert({
            title: vid.title,
            video_url: vid.url,
            image_url: vid.image,
            category_id: vid.categoryId,
            creator_id: profileId,
            tags: ['B2K', member.name, 'Music']
          });
        if (error) console.error(`    Error seeding video:`, error.message);
      }
    }

    // E. Seed Products for Member
    for (const prod of member.products) {
      const { data: extProd } = await supabase
        .from('products')
        .select('id')
        .eq('title', prod.title)
        .eq('creator_id', profileId)
        .limit(1);

      if (!extProd || extProd.length === 0) {
        console.log(`    Seeding product: "${prod.title}"...`);
        const { error } = await supabase
          .from('products')
          .insert({
            title: prod.title,
            price: prod.price,
            type: prod.type,
            image_url: prod.image,
            creator_id: profileId
          });
        if (error) console.error(`    Error seeding product:`, error.message);
      }
    }

    // F. Seed Posts for Member
    for (const post of member.posts) {
      const { data: extPost } = await supabase
        .from('posts')
        .select('id')
        .eq('content', post.content)
        .eq('creator_id', profileId)
        .limit(1);

      if (!extPost || extPost.length === 0) {
        console.log(`    Seeding post for "${member.name}"...`);
        const { error } = await supabase
          .from('posts')
          .insert({
            content: post.content,
            likes: post.likes,
            image_url: post.image,
            creator_id: profileId
          });
        if (error) console.error(`    Error seeding post:`, error.message);
      }
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`\n🚀 B2K N2N Network Seeding is COMPLETE!\n`);
  console.log(`   Link to open: http://localhost:5173/?tenant=${parentId}\n`);
  console.log('═'.repeat(60) + '\n');
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
    console.error("Error creating category:", error.message);
    throw error;
  }
  return created.id;
}

run().catch(console.error);
