import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envLines = fs.readFileSync('.env', 'utf8').split('\n');
let supabaseUrl = '';
let supabaseKey = '';
for (const line of envLines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim().replace(/['"]/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim().replace(/['"]/g, '');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CHAMPIONS_DATA = [
  {
    email: 'samson_dauda_oly@test.com',
    username: 'Samson_Dauda',
    avatar: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600',
    bio: '2024 Mr. Olympia Champion. The Nigerian Lion.',
    post: 'Pinnacle of bodybuilding! Winning the Sandow was just the beginning. The Nigerian Lion is ready for the next chapter. 🦁🏆',
    postImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'
  },
  {
    email: 'derek_lunsford_oly@test.com',
    username: 'Derek_Lunsford',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Derek_Lunsford_Arnold_Classic.jpg',
    bio: '2023 Mr. Olympia Champion. First ever 212 and Open Olympia Champion.',
    post: "Champions aren't made in the light; they are made in the dark hours of absolute grit. Grateful for the journey! 💪",
    postImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'
  },
  {
    email: 'hadi_choopan_oly@test.com',
    username: 'Hadi_Choopan',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/%D9%87%D8%A7%D8%AF%DB%8C_%DA%86%D9%88%D9%BE%D8%A7%D9%86_2024.jpg',
    bio: '2022 Mr. Olympia Champion. The Persian Wolf.',
    post: 'To my fans around the world, thank you for your endless love. I do this for you. 🐺',
    postImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'
  },
  {
    email: 'big_ramy_oly@test.com',
    username: 'Big_Ramy',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Big_Ramy2.png',
    bio: '2x Mr. Olympia Champion (2020, 2021).',
    post: 'Winter is coming! Stay focused, work hard, and never stop believing in your dreams. Yalla! ❄️',
    postImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'
  },
  {
    email: 'brandon_curry_oly@test.com',
    username: 'Brandon_Curry',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Brandon_curry_2.jpg',
    bio: '2019 Mr. Olympia Champion.',
    post: 'Consistency is key. Every single day, brick by brick, build your legacy. 🧱',
    postImage: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800'
  },
  {
    email: 'shawn_rhoden_oly@test.com',
    username: 'Shawn_Rhoden',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Shawn_Rhoden.jpg',
    bio: '2018 Mr. Olympia Champion. Rest in peace.',
    post: 'Outwork everyone, stay humble, and let your results speak for themselves. Rest in peace, champ. 🕊️',
    postImage: 'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&q=80&w=800'
  },
  {
    email: 'phil_heath_oly@test.com',
    username: 'Phil_Heath',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Philheath.jpg',
    bio: '7x Mr. Olympia Champion.',
    post: '7 Sandows later, the fire still burns. Thank you to everyone who supported the dream. 🏆',
    postImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'
  },
  {
    email: 'andrea_shaw_oly@test.com',
    username: 'Andrea_Shaw',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Andrea_Shaw_at_the_2023_IFBB_Pro_League_New_York_Pro.png',
    bio: '6x Ms. Olympia Champion.',
    post: '6 years consecutive! Unbelievably honored to represent the division and push boundaries. 🥇',
    postImage: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800'
  },
  {
    email: 'iris_kyle_oly@test.com',
    username: 'Iris_Kyle',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Iris_Kyle_posing_at_2008_Ms._Olympia_%28cropped%29.jpg',
    bio: '10x Ms. Olympia Champion.',
    post: '10x Ms. Olympia. Dedication, sacrifice, and the heart of a champion. Keep pushing your limits! 🏆',
    postImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800'
  }
];

async function run() {
  console.log("Fetching Mr. Olympia whitelabel config ID...");
  const { data: wlData, error: wlError } = await supabase
    .from('whitelabel_configs')
    .select('id')
    .eq('domain', 'mrolympia.com')
    .single();

  if (wlError || !wlData) {
    console.error("Could not find Mr. Olympia whitelabel config in database:", wlError?.message);
    return;
  }

  const parentId = wlData.id;
  console.log("Found Mr. Olympia Whitelabel ID:", parentId);

  const creators: Array<{ username: string, profileId: string }> = [];

  for (const champion of CHAMPIONS_DATA) {
    console.log(`\n--- Processing champion: ${champion.username} ---`);
    const password = 'TestPassword123!';

    // Check if profile exists first
    const { data: extProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', champion.username)
      .eq('whitelabel_id', parentId)
      .limit(1);

    let profileId = '';
    if (extProfile && extProfile.length > 0) {
      profileId = extProfile[0].id;
      console.log(`Profile already exists. ID: ${profileId}`);
    } else {
      console.log(`Signing up auth user for ${champion.username}...`);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: champion.email,
        password,
        options: {
          data: {
            role: 'influencer',
            whitelabel_id: parentId
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          console.log(`Auth user already registered. Querying by logging in...`);
          const tempClient = createClient(supabaseUrl, supabaseKey);
          const { data: signInData, error: signInError } = await tempClient.auth.signInWithPassword({
            email: champion.email,
            password
          });
          if (signInError) {
            console.error(`Error signing in:`, signInError.message);
            continue;
          }
          profileId = signInData.user.id;
        } else {
          console.error(`Failed to sign up ${champion.username}:`, authError.message);
          continue;
        }
      } else if (authData.user) {
        profileId = authData.user.id;
      }
    }

    if (profileId) {
      creators.push({ username: champion.username, profileId });

      // Update or insert the profile row
      const profilePayload = {
        username: champion.username,
        role: 'influencer',
        whitelabel_id: parentId,
        avatar_url: champion.avatar,
        bio: champion.bio
      };

      console.log(`Updating profile row for ${champion.username}...`);
      const { error: profUpdateErr } = await supabase
        .from('profiles')
        .update(profilePayload)
        .eq('id', profileId);

      if (profUpdateErr) {
        console.warn(`Profile update failed (RLS). Trying insert...`);
        const { error: profInsertErr } = await supabase
          .from('profiles')
          .insert({
            id: profileId,
            ...profilePayload
          });
        if (profInsertErr) console.error(`Error inserting profile:`, profInsertErr.message);
      }

      // Insert mock post in their feed
      console.log(`Inserting mock post for ${champion.username}...`);
      const { data: extPost } = await supabase
        .from('posts')
        .select('id')
        .eq('creator_id', profileId)
        .eq('content', champion.post)
        .limit(1);

      if (!extPost || extPost.length === 0) {
        const { error: postErr } = await supabase
          .from('posts')
          .insert({
            creator_id: profileId,
            content: champion.post,
            image_url: champion.postImage,
            likes: Math.floor(Math.random() * 800) + 200,
            created_at: new Date().toISOString()
          });
        if (postErr) console.error(`Error inserting post:`, postErr.message);
        else console.log(`Successfully created mock post!`);
      } else {
        console.log(`Mock post already exists.`);
      }
    }
  }

  // Distribute Gymreapers products to their stores
  console.log("\nDistributing Gymreapers products to the champion stores...");
  const { data: dbProducts } = await supabase
    .from('products')
    .select('id, title');

  if (dbProducts && dbProducts.length > 0 && creators.length > 0) {
    let assignedCount = 0;
    for (let i = 0; i < dbProducts.length; i++) {
      const product = dbProducts[i];
      // Skip B2K or non-Olympia products if any
      if (product.title.includes('B2K') || product.title.includes('Millennium') || product.title.includes('Fizz') || product.title.includes('Omarion')) {
        continue;
      }

      // Rotate through creators
      const creator = creators[i % creators.length];
      const { error: prodUpdateErr } = await supabase
        .from('products')
        .update({ creator_id: creator.profileId })
        .eq('id', product.id);

      if (prodUpdateErr) {
        console.error(`Error updating product ${product.title}:`, prodUpdateErr.message);
      } else {
        assignedCount++;
      }
    }
    console.log(`Assigned ${assignedCount} products to champion profile stores!`);
  }

  console.log("\nSeeding completed successfully!");
  console.log("-----------------------------------------");
  console.log("Please copy these generated UUIDs to N2NHome.tsx:");
  creators.forEach(c => {
    console.log(`  ${c.username}: "${c.profileId}"`);
  });
  console.log("-----------------------------------------");
}

run().catch(console.error);
