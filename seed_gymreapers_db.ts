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

const GYMREAPERS_PRODUCTS = [
  {
    name: "Olympia Lifting Club Basic Tee",
    price: 40.0,
    image: "https://www.gymreapers.com/cdn/shop/files/OLYMPIA_LiftingClub_BlackBasic1.jpg?v=1759356123"
  },
  {
    name: "Olympia Wreath Straight Leg Jogger",
    price: 85.0,
    image: "https://www.gymreapers.com/cdn/shop/files/JoggersFront.jpg?v=1759269457"
  },
  {
    name: "Olympia Lifting Department Tee",
    price: 40.0,
    image: "https://www.gymreapers.com/cdn/shop/files/OLYMPIA_LiftingDept_StoneBasic2_2.jpg?v=1759869223"
  },
  {
    name: "18\" Olympia Wrist Wraps",
    price: 30.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_wristwraps_main_1.jpg?v=1759264926"
  },
  {
    name: "Olympia Lifting Straps",
    price: 20.0,
    image: "https://www.gymreapers.com/cdn/shop/files/OlympiaLS.png?v=1759265818"
  },
  {
    name: "1965 Vintage Olympia Tee",
    price: 50.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Vintage1965Main_Front_EmberRed.jpg?v=1759272065"
  },
  {
    name: "Olympia Basic Tee",
    price: 40.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_BLKGLDBasicTee_8299a16f-c9ff-4bfe-be3e-88eb293e29c4.jpg?v=1759266687"
  },
  {
    name: "Olympia Champions Made Varsity Jacket",
    price: 295.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia-championmade-jacket-291.jpg?v=1759337439"
  },
  {
    name: "Olympia Ribbed Knit Beanie",
    price: 29.99,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_ribbedknitbeanie.jpg?v=1759265731"
  },
  {
    name: "Olympia Joe Bomber Jacket",
    price: 195.0,
    image: "https://www.gymreapers.com/cdn/shop/files/BJ-BLK-5.jpg?v=1759954115"
  },
  {
    name: "Olympia Racer Back Tank Top",
    price: 40.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Racerback-Detail1.jpg?v=1759334005"
  },
  {
    name: "Olympia 4\" Training Shorts",
    price: 40.0,
    image: "https://www.gymreapers.com/cdn/shop/files/olympia4inshortsblackfront.jpg?v=1759269170"
  },
  {
    name: "Olympia 29\" Training Legging",
    price: 70.0,
    image: "https://www.gymreapers.com/cdn/shop/files/oly-legging-blac_1.jpg?v=1759334280"
  },
  {
    name: "Olympia Hoodie",
    price: 95.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_Ohoodie_mainfront_994b6dfc-9976-4371-a93b-9856a3168ae4_1.jpg?v=1759338297"
  },
  {
    name: "Classic Olympia Varsity Jacket",
    price: 295.0,
    image: "https://www.gymreapers.com/cdn/shop/files/TheOlympia_Back.jpg?v=1759877358"
  },
  {
    name: "Gymreapers x Olympia Tee",
    price: 50.0,
    image: "https://www.gymreapers.com/cdn/shop/files/GRXO_MAINBack.jpg?v=1759267698"
  },
  {
    name: "Old English O Long Sleeve Shirt",
    price: 55.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_oldenglish_black_mainfront_1_1.jpg?v=1759267257"
  },
  {
    name: "GRxO Racing Team Varsity Jacket",
    price: 295.0,
    image: "https://www.gymreapers.com/cdn/shop/files/GR_RacingTeam_MainBackBH.jpg?v=1759938562"
  },
  {
    name: "Olympia The O Varsity Jacket",
    price: 295.0,
    image: "https://www.gymreapers.com/cdn/shop/files/TheO_Back.jpg?v=1759935861"
  },
  {
    name: "Olympia Varsity Jacket Electric Skull",
    price: 295.0,
    image: "https://www.gymreapers.com/cdn/shop/files/ElecticSkull_Back_3de86f14-1053-47f4-a5fe-4814d140ad4a.jpg?v=1759875910"
  },
  {
    name: "Gymreapers x Olympia Varsity Jacket",
    price: 295.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Skull_MainBack3.jpg?v=1759875284"
  },
  {
    name: "Royal Olympia Varsity Jacket",
    price: 295.0,
    image: "https://www.gymreapers.com/cdn/shop/files/RoyalO_Back.jpg?v=1759335646"
  },
  {
    name: "Olympia Mr. O Varsity Jacket",
    price: 295.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Mr.Olympia_Back.jpg?v=1759332416"
  },
  {
    name: "Olympia Lifting Club Varsity Jacket",
    price: 295.0,
    image: "https://www.gymreapers.com/cdn/shop/files/LiftClub_Back1.jpg?v=1759328409"
  },
  {
    name: "GRxO USA Varsity Jacket",
    price: 295.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia-grxousa-jacket-26_1_1.jpg?v=1759939645"
  },
  {
    name: "Olympia Full Length Training Tank",
    price: 40.0,
    image: "https://www.gymreapers.com/cdn/shop/files/FLTTank_1_1.jpg?v=1760024244"
  },
  {
    name: "Olympia Crest Long Sleeve Shirt",
    price: 55.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_crestgfx_mainback_1_1.jpg?v=1759854819"
  },
  {
    name: "Olympia Patches",
    price: 6.99,
    image: "https://www.gymreapers.com/cdn/shop/files/olympia-crest-patch.jpg?v=1759874562"
  },
  {
    name: "GRxO Lifting Club Tee",
    price: 50.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_GRXO_liftingclub_mainback_1.jpg?v=1759874906"
  },
  {
    name: "Olympia Cropped Bomber Jacket",
    price: 175.0,
    image: "https://www.gymreapers.com/cdn/shop/files/CBJ_BLK_1.jpg?v=1759335198"
  },
  {
    name: "Olympia Harmony Bra",
    price: 40.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia-obra-black-7.jpg?v=1760021590"
  },
  {
    name: "Olympia Jogger",
    price: 85.0,
    image: "https://www.gymreapers.com/cdn/shop/files/THEOLYMPIA_Joggers_MainFront_1.jpg?v=1759349048"
  },
  {
    name: "Olympia Sweat Short",
    price: 65.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_sweatshorts_mainfront.jpg?v=1759249162"
  },
  {
    name: "Olympia Cropped Varsity Jacket",
    price: 245.0,
    image: "https://www.gymreapers.com/cdn/shop/files/CVJ_1_895ce9fc-3f47-4289-89f9-6071a2205530.jpg?v=1759337343"
  },
  {
    name: "Olympia O Mesh Shorts",
    price: 50.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_mesh_shorts_main.jpg?v=1759277953"
  },
  {
    name: "Olympia Script Cropped Hoodie",
    price: 75.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Script_CH_1_1_c7fe560e-19d5-462e-a458-2f49ce63ffcc.jpg?v=1760018844"
  },
  {
    name: "Olympia Distressed Basic Tee",
    price: 40.0,
    image: "https://www.gymreapers.com/cdn/shop/files/DistrressedOlympia_MainFront_1.jpg?v=1759855871"
  },
  {
    name: "Raw Hem Olympia Training Stringer",
    price: 35.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_training_stringer_mainfront_3ec14029-4cf6-46d5-9021-27f1b383277e.jpg?v=1759267726"
  },
  {
    name: "Bound Edge Classic Olympia Stringer",
    price: 35.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_boundedge_stringer_1.jpg?v=1759420083"
  },
  {
    name: "Raw Hem Olympia Stringer",
    price: 35.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_rawhem_stringer_mainfront_1_1.jpg?v=1759421414"
  },
  {
    name: "Olympia Crest Cut Off",
    price: 45.0,
    image: "https://www.gymreapers.com/cdn/shop/files/OlympiaCrest_CutOff_MainBack.jpg?v=1759269370"
  },
  {
    name: "Ring of Fire Zip-Up",
    price: 95.0,
    image: "https://www.gymreapers.com/cdn/shop/files/olympia_ringoffire_mainfront_2c4ff3cd-f96e-4551-8838-d9cae6f91d71.jpg?v=1759180935"
  },
  {
    name: "7MM Bodybuilding Belt",
    price: 100.0,
    image: "https://www.gymreapers.com/cdn/shop/files/7MM_Olympia_Main.jpg?v=1759264674"
  },
  {
    name: "Olympia Gold Shoulder Tee",
    price: 50.0,
    image: "https://www.gymreapers.com/cdn/shop/files/Olympia_goldshoulder_mainback_1.jpg?v=1759268699"
  }
];

async function run() {
  console.log("Fetching Mr. Olympia whitelabel config...");
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

  // Check if a profile named "Gymreapers" already exists under this whitelabel
  let { data: profileData } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', 'Gymreapers')
    .eq('whitelabel_id', parentId)
    .limit(1);

  let creatorId = '';
  if (profileData && profileData.length > 0) {
    creatorId = profileData[0].id;
    console.log("Found existing Gymreapers profile:", creatorId);
  } else {
    creatorId = crypto.randomUUID ? crypto.randomUUID() : 'gym_' + Math.random().toString(36).substr(2, 9);
    console.log("Creating new Gymreapers profile:", creatorId);
    const { error: profError } = await supabase
      .from('profiles')
      .insert({
        id: creatorId,
        username: 'Gymreapers',
        role: 'influencer',
        whitelabel_id: parentId,
        avatar_url: 'https://cdn.shopify.com/s/files/1/0752/5585/t/287/assets/gr.png?v=1675974841&width=96',
        bio: 'Official Gymreapers x Mr. Olympia Collection partner. Premium weightlifting belts, wraps, apparel, and training gear.',
        created_at: new Date().toISOString()
      });

    if (profError) {
      console.warn("Could not insert profile (RLS might prevent direct insert). Querying for a fallback profile...");
      // Fallback: use the admin user ID
      const { data: adminAuth } = await supabase.auth.signInWithPassword({
        email: 'admin_avonetwork@test.com',
        password: 'TestPassword123!'
      });
      if (adminAuth?.user) {
        creatorId = adminAuth.user.id;
        console.log("Using fallback admin user profile:", creatorId);
      } else {
        console.error("Profile creation failed and no admin session could be established.");
        return;
      }
    }
  }

  console.log("Seeding Gymreapers products into the database...");
  let successCount = 0;
  for (const product of GYMREAPERS_PRODUCTS) {
    // Check if the product already exists
    const { data: extProd } = await supabase
      .from('products')
      .select('id')
      .eq('title', product.name)
      .eq('creator_id', creatorId)
      .limit(1);

    if (extProd && extProd.length > 0) {
      // Product exists, update it
      const { error: updErr } = await supabase
        .from('products')
        .update({
          price: product.price,
          image_url: product.image,
          type: 'physical',
          variants: {
            colors: ['Black', 'White', 'Navy', 'Maroon', 'Stone', 'Pale Blue'],
            sizes: ['S', 'M', 'L', 'XL', '2XL'],
            is_clothing: !/belt|wrap|strap|patch|beanie/i.test(product.name)
          }
        })
        .eq('id', extProd[0].id);
      
      if (updErr) {
        console.error(`Failed to update ${product.name}:`, updErr.message);
      } else {
        successCount++;
      }
    } else {
      // Product does not exist, insert it
      const { error: insErr } = await supabase
        .from('products')
        .insert({
          title: product.name,
          price: product.price,
          type: 'physical',
          image_url: product.image,
          creator_id: creatorId,
          variants: {
            colors: ['Black', 'White', 'Navy', 'Maroon', 'Stone', 'Pale Blue'],
            sizes: ['S', 'M', 'L', 'XL', '2XL'],
            is_clothing: !/belt|wrap|strap|patch|beanie/i.test(product.name)
          }
        });

      if (insErr) {
        console.error(`Failed to insert ${product.name}:`, insErr.message);
      } else {
        successCount++;
      }
    }
  }

  console.log(`Successfully seeded ${successCount}/${GYMREAPERS_PRODUCTS.length} Gymreapers products in Supabase!`);
}

run().catch(console.error);
