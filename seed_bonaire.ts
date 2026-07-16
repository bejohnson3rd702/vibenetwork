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

const supabase = createClient(supabaseUrl, supabaseKey);

const BONAIRE_PARENT_ID = 'b0ea0000-c08f-4260-8540-a0cc8bed4e11';

const BONAIRE_PARENT_THEME = {
  accent: '#00A3E0',
  heroCopy: 'Welcome to the Bonaire Chamber of Commerce N2N Network. Supporting local businesses, encouraging commerce, and showcasing Bonaire\'s premier shops online.',
  heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
  logoImage: '/n2n/kvk_bonaire_logo.png',
  enableWatchLive: true,
  enableBooking: true,
  heroLayoutMode: 'verbiage',
  sliderCount: 4,
  n2n_enabled: true
};

const BONAIRE_CHILDREN = [
  {
    id: 'b0ea0001-c08f-4260-8540-a0cc8bed4e11',
    name: 'Bonaire Salt Shop',
    domain: 'bonairesalt.vibenetwork.tv',
    logo: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=256',
    theme: {
      accent: '#00B2A9',
      heroCopy: 'Experience the purity of Bonaire. Hand-harvested gourmet sea salts, relaxing bath salts, and unique coral-infused gifts straight from the Caribbean.',
      heroImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=1200',
      logoImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=400',
      enableWatchLive: false,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      parent_network_id: BONAIRE_PARENT_ID
    },
    influencer: {
      userId: 'b0ea1001-c08f-4260-8540-a0cc8bed4e11',
      email: 'salt_shop@bonairechamber.com',
      username: 'Bonaire_Salt_Shop_Manager',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',
      bio: 'Managing Director of the Bonaire Salt Shop. Curating handcrafted gourmet and bath salts harvested from the salt pans.'
    },
    products: [
      { title: 'Gourmet Coarse Sea Salt (250g)', price: 8.99, image_url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=600' },
      { title: 'Lavender Bath Salt Crystals (500g)', price: 12.50, image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600' },
      { title: 'Artisanal Wooden Salt Mill', price: 24.99, image_url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=600' }
    ],
    posts: [
      {
        content: 'Fresh batch of our gourmet coarse sea salt has just been hand-harvested from the southern salt pans of Bonaire! Perfect for curing, cooking, and adding a touch of Caribbean magic to your table.',
        image_url: '["https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800"]',
        likes: 45
      }
    ]
  },
  {
    id: 'b0ea0002-c08f-4260-8540-a0cc8bed4e11',
    name: 'Bonaire Dive Gear',
    domain: 'bonairedive.vibenetwork.tv',
    logo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=256',
    theme: {
      accent: '#FF5E13',
      heroCopy: 'Dive into adventure with Bonaire\'s premier dive gear and ocean apparel. Sun-protection rashguards, dry bags, and premium snorkeling equipment.',
      heroImage: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=1200',
      logoImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400',
      enableWatchLive: false,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      parent_network_id: BONAIRE_PARENT_ID
    },
    influencer: {
      userId: 'b0ea1002-c08f-4260-8540-a0cc8bed4e11',
      email: 'dive_gear@bonairechamber.com',
      username: 'Bonaire_Dive_Gear_Manager',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
      bio: 'Head Instructor & Operator at Bonaire Dive Gear & Apparel.'
    },
    products: [
      { title: 'UV-Protection Long-Sleeve Rashguard', price: 34.99, image_url: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&q=80&w=600' },
      { title: 'Premium Snorkeling Mask & Snorkel Set', price: 49.99, image_url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=600' },
      { title: 'Waterproof Ocean Dry Bag (20L)', price: 19.99, image_url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=600' }
    ],
    posts: [
      {
        content: 'Keep our oceans clean and protect our reefs! STINAPA-certified decontamination stations are now set up at Bonaire Dive Gear. Stop by to disinfect your equipment and get our new eco-friendly snorkel mask set.',
        image_url: '["https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&q=80&w=800"]',
        likes: 32
      }
    ]
  },
  {
    id: 'b0ea0003-c08f-4260-8540-a0cc8bed4e11',
    name: 'Flamingo Eco Tours',
    domain: 'bonairetours.vibenetwork.tv',
    logo: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?auto=format&fit=crop&q=80&w=256',
    theme: {
      accent: '#FF6F61',
      heroCopy: 'Explore the wonders of Bonaire\'s pristine national parks, salt flats, and flamingo sanctuaries. Book guided eco-tours and buy eco-friendly souvenirs.',
      heroImage: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=1200',
      logoImage: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?auto=format&fit=crop&q=80&w=400',
      enableWatchLive: false,
      enableBooking: true,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      parent_network_id: BONAIRE_PARENT_ID
    },
    influencer: {
      userId: 'b0ea1003-c08f-4260-8540-a0cc8bed4e11',
      email: 'eco_tours@bonairechamber.com',
      username: 'Bonaire_Eco_Tours_Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
      bio: 'Biologist & Naturalist Guide at Flamingo Eco Tours Bonaire.'
    },
    products: [
      { title: 'Guided Mangrove Snorkeling Tour Ticket', price: 75.00, image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600' },
      { title: 'Flamingo Eco Plush Toy (Organic)', price: 14.99, image_url: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&q=80&w=600' },
      { title: 'Aluminum Island Refillable Water Bottle', price: 18.50, image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600' }
    ],
    posts: [
      {
        content: 'Morning views from our Pekelmeer Flamingo Sanctuary tour. Today we spotted a flock of over 200 Caribbean flamingos! Book your guided eco-tour online and help us support conservation programs.',
        image_url: '["https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?auto=format&fit=crop&q=80&w=800"]',
        likes: 58
      }
    ]
  },
  {
    id: 'b0ea0004-c08f-4260-8540-a0cc8bed4e11',
    name: 'Cadushy Distillery Shop',
    domain: 'cadushyshop.vibenetwork.tv',
    logo: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=256',
    theme: {
      accent: '#2E8B57',
      heroCopy: 'Home of the Cadushy Distillery in Rincon. Order authentic cactus liqueurs, award-winning rum, vodka, and Cadushy merchandise shipped worldwide.',
      heroImage: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=1200',
      logoImage: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=400',
      enableWatchLive: false,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      parent_network_id: BONAIRE_PARENT_ID
    },
    influencer: {
      userId: 'b0ea1004-c08f-4260-8540-a0cc8bed4e11',
      email: 'cadushy@bonairechamber.com',
      username: 'Bonaire_Cadushy_Distiller',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
      bio: 'Master Distiller at The Cadushy Distillery, Rincon, Bonaire.'
    },
    products: [
      { title: 'Cadushy Cactus Liqueur Gift Set', price: 29.99, image_url: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=600' },
      { title: 'Rom Rincon 12-Year Aged Rum (750ml)', price: 59.99, image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600' },
      { title: 'The Cadushy Distillery Branded Apron', price: 22.00, image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600' }
    ],
    posts: [
      {
        content: 'Distilling another batch of our world-famous Cadushy Cactus Liqueur in Rincon. Made from real local kadushi cacti, it brings the authentic flavor of the island to your glass. Come by for a free tasting!',
        image_url: '["https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=800"]',
        likes: 64
      }
    ]
  }
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

  console.log("\n🚀 Seeding Bonaire Chamber of Commerce parent config via RPC...");
  
  const parentSql = `
    INSERT INTO public.whitelabel_configs (id, name, domain, logo, platform_fee_percentage, n2n_enabled, theme)
    VALUES (
      '${BONAIRE_PARENT_ID}',
      $$Bonaire Chamber of Commerce$$,
      $$bonairechamber.vibenetwork.tv$$,
      $$/n2n/kvk_bonaire_logo.png$$,
      15.00,
      true,
      $$${JSON.stringify(BONAIRE_PARENT_THEME)}$$::jsonb
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      domain = EXCLUDED.domain,
      logo = EXCLUDED.logo,
      platform_fee_percentage = EXCLUDED.platform_fee_percentage,
      n2n_enabled = EXCLUDED.n2n_enabled,
      theme = EXCLUDED.theme;
  `;

  let { error: parentErr } = await supabase.rpc('execute_sql', { sql: parentSql });
  if (parentErr) {
    console.error("❌ Failed to seed parent config:", parentErr);
    process.exit(1);
  }
  console.log("✅ Parent config seeded successfully!");

  for (const child of BONAIRE_CHILDREN) {
    console.log(`\n--- Child Business: ${child.name} ---`);

    // Seed whitelabel config
    console.log(`   Seeding whitelabel config...`);
    const childSql = `
      INSERT INTO public.whitelabel_configs (id, name, domain, logo, parent_network_id, theme)
      VALUES (
        '${child.id}',
        $$${child.name}$$,
        $$${child.domain}$$,
        $$${child.logo}$$,
        '${BONAIRE_PARENT_ID}',
        $$${JSON.stringify(child.theme)}$$::jsonb
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        domain = EXCLUDED.domain,
        logo = EXCLUDED.logo,
        parent_network_id = EXCLUDED.parent_network_id,
        theme = EXCLUDED.theme;
    `;

    const { error: childErr } = await supabase.rpc('execute_sql', { sql: childSql });
    if (childErr) {
      console.error(`   ❌ Failed to seed child config for ${child.name}:`, childErr);
      continue;
    }

    // Seed auth user
    console.log(`   Seeding auth user...`);
    const userSql = `
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
      )
      VALUES (
        '00000000-0000-0000-0000-000000000000',
        '${child.influencer.userId}',
        'authenticated',
        'authenticated',
        '${child.influencer.email}',
        '$2a$10$n8nE/p.oYh.y5kR2Q0v/iOt9hL5JkP67T5ZfLdZ0R1O0r1T0O0C2q', -- bcrypt for 'VibePassword100!'
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"role":"influencer","whitelabel_id":"${child.id}"}'::jsonb,
        now(),
        now(),
        '',
        '',
        '',
        ''
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = now();
    `;

    const { error: userErr } = await supabase.rpc('execute_sql', { sql: userSql });
    if (userErr) {
      console.error(`   ❌ Failed to seed auth user for ${child.name}:`, userErr);
      continue;
    }

    // Seed public profile
    console.log(`   Seeding profile...`);
    const profileSql = `
      INSERT INTO public.profiles (id, username, role, whitelabel_id, avatar_url, bio, created_at)
      VALUES (
        '${child.influencer.userId}',
        $$${child.influencer.username}$$,
        'influencer',
        '${child.id}',
        $$${child.influencer.avatar}$$,
        $$${child.influencer.bio}$$,
        now()
      )
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        role = EXCLUDED.role,
        whitelabel_id = EXCLUDED.whitelabel_id,
        avatar_url = EXCLUDED.avatar_url,
        bio = EXCLUDED.bio;
    `;

    const { error: profileErr } = await supabase.rpc('execute_sql', { sql: profileSql });
    if (profileErr) {
      console.error(`   ❌ Failed to seed profile for ${child.name}:`, profileErr);
      continue;
    }

    // Seed products
    console.log(`   Seeding products...`);
    
    // First clear old products for this creator
    const deleteProductsSql = `DELETE FROM public.products WHERE creator_id = '${child.influencer.userId}';`;
    await supabase.rpc('execute_sql', { sql: deleteProductsSql });

    for (const prod of child.products) {
      const prodSql = `
        INSERT INTO public.products (title, price, type, image_url, creator_id)
        VALUES (
          $$${prod.title}$$,
          ${prod.price},
          'physical',
          $$${prod.image_url}$$,
          '${child.influencer.userId}'
        );
      `;
      const { error: prodErr } = await supabase.rpc('execute_sql', { sql: prodSql });
      if (prodErr) {
        console.error(`     ❌ Failed to seed product ${prod.title}:`, prodErr);
      } else {
        console.log(`     Added product: ${prod.title}`);
      }
    }

    // Seed posts
    console.log(`   Seeding posts...`);
    const deletePostsSql = `DELETE FROM public.posts WHERE creator_id = '${child.influencer.userId}';`;
    await supabase.rpc('execute_sql', { sql: deletePostsSql });

    if (child.posts) {
      for (const post of child.posts) {
        const postSql = `
          INSERT INTO public.posts (creator_id, content, is_locked, likes, image_url, created_at)
          VALUES (
            '${child.influencer.userId}',
            $$${post.content}$$,
            false,
            ${post.likes},
            $$${post.image_url}$$,
            now()
          );
        `;
        const { error: postErr } = await supabase.rpc('execute_sql', { sql: postSql });
        if (postErr) {
          console.error(`     ❌ Failed to seed post:`, postErr);
        } else {
          console.log(`     Added post: "${post.content.substring(0, 30)}..."`);
        }
      }
    }

    console.log(`✅ Completed ${child.name}!`);
  }

  console.log("\n🎉 Bonaire Chamber parent & child N2N networks seeded successfully via RPC!");
}

run().catch(err => {
  console.error("❌ Seeding failed with error:", err);
  process.exit(1);
});
