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

async function run() {
  console.log("Logging in as admin_avonetwork@test.com...");
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

  const OLYMPIAN_CONFIG = {
    owner_id: userId,
    name: 'Muscle & Fitness | Mr. Olympian',
    domain: 'mrolympia.com',
    logo: '/n2n/muscle_fitness_logo.svg',
    platform_fee_percentage: 30,
    parent_network_id: null,
    n2n_enabled: true,
    theme: {
      accent: '#E31B23',
      heroCopy: 'Muscle & Fitness — Mr. Olympian Edition',
      heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
      logoImage: '/n2n/muscle_fitness_logo.svg',
      shopifyUrl: 'https://www.gymreapers.com/collections/olympia-collection?utm_source=Website&utm_medium=Olympia&utm_campaign=Web+Banner&utm_id=Olympia&utm_term=limited+drop',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: true
    }
  };

  console.log("Inserting/Updating Mr. Olympian config...");
  // Check if it exists first
  const { data: existing } = await supabase
    .from('whitelabel_configs')
    .select('id')
    .eq('domain', 'mrolympia.com')
    .limit(1);

  let parentId = '';
  if (existing && existing.length > 0) {
    parentId = existing[0].id;
    console.log(`Config already exists with ID: ${parentId}. Updating...`);
    const { data, error } = await supabase
      .from('whitelabel_configs')
      .update(OLYMPIAN_CONFIG)
      .eq('id', parentId)
      .select();
    if (error) {
      console.error("Update error:", error);
    } else {
      console.log("Successfully updated Mr. Olympian config.");
    }
  } else {
    console.log("Config doesn't exist. Inserting...");
    const { data, error } = await supabase
      .from('whitelabel_configs')
      .insert(OLYMPIAN_CONFIG)
      .select();
    if (error) {
      console.error("Insert error:", error);
      return;
    } else {
      parentId = data[0].id;
      console.log("Successfully inserted Mr. Olympian config. ID:", parentId);
    }
  }

  // Seed child networks
  const PARTNERS = [
    { 
      name: "Gold's Gym", 
      domain: 'golds.avoclothing.com', 
      accent: '#f1c40f', 
      heroCopy: "The Mecca of Bodybuilding — Official Gold's Gear",
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/Gold%27s_Gym_logo.svg/500px-Gold%27s_Gym_logo.svg.png'
    },
    { 
      name: "Gaspari Nutrition", 
      domain: 'gaspari.avoclothing.com', 
      accent: '#0033a0', 
      heroCopy: 'Gaspari Nutrition — Engineered for Champions',
      logo: 'https://gasparinutrition.com/cdn/shop/files/GaspariLogo_Full_WhiteBKG_b3ab95a5-36af-43f7-a184-3487f3bc2552.png?v=1613220659'
    },
    { 
      name: "Rogue Fitness", 
      domain: 'rogue.avoclothing.com', 
      accent: '#222222', 
      heroCopy: 'Rogue Fitness — High Performance Training Gear',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Rogue_Fitness.png/500px-Rogue_Fitness.png'
    },
    { 
      name: "Redcon1", 
      domain: 'redcon1.avoclothing.com', 
      accent: '#4a5d4e', 
      heroCopy: 'Redcon1 — Highest State of Readiness',
      logo: 'https://redcon1.com/cdn/shop/files/redcon1-logo_200x.png'
    },
    {
      name: "Gymshark",
      domain: 'gymshark.avoclothing.com',
      accent: '#000000',
      heroCopy: 'Gymshark — Be a Visionary',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Gymshark.svg/500px-Gymshark.svg.png'
    }
  ];

  console.log("Seeding Mr. Olympian partner child networks...");
  for (const partner of PARTNERS) {
    const { data: extPartner } = await supabase
      .from('whitelabel_configs')
      .select('id')
      .eq('name', partner.name)
      .limit(1);

    const partnerPayload = {
      owner_id: userId,
      name: partner.name,
      domain: partner.domain,
      logo: partner.logo,
      parent_network_id: parentId,
      n2n_enabled: false,
      platform_fee_percentage: 30,
      theme: {
        accent: partner.accent,
        heroCopy: partner.heroCopy,
        heroImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1200',
        logoImage: partner.logo,
        enableWatchLive: true,
        enableBooking: false,
        heroLayoutMode: 'verbiage',
        sliderCount: 4
      }
    };

    if (extPartner && extPartner.length > 0) {
      console.log(`Partner "${partner.name}" already exists. Updating...`);
      const { error } = await supabase
        .from('whitelabel_configs')
        .update(partnerPayload)
        .eq('id', extPartner[0].id);
      if (error) console.error(`Error updating partner ${partner.name}:`, error.message);
    } else {
      console.log(`Partner "${partner.name}" doesn't exist. Inserting...`);
      const { error } = await supabase
        .from('whitelabel_configs')
        .insert(partnerPayload);
      if (error) console.error(`Error inserting partner ${partner.name}:`, error.message);
    }
  }

  // Create mock profiles for Mr. Olympian child networks so they show up in N2N queries
  console.log("Creating profiles for Mr. Olympian child networks...");
  const { data: seededPartners } = await supabase
    .from('whitelabel_configs')
    .select('id, name, logo, theme')
    .eq('parent_network_id', parentId);

  if (seededPartners) {
    for (const child of seededPartners) {
      const accentVal = (child.theme as any)?.accent || '#333333';
      const logoUrl = child.logo || (child.theme as any)?.logoImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=${accentVal.replace('#', '')}&color=fff&size=256&bold=true`;
      
      const { data: extProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('whitelabel_id', child.id)
        .eq('username', child.name)
        .limit(1);

      if (!extProfile || extProfile.length === 0) {
        console.log(`Creating profile for child network "${child.name}"...`);
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: crypto.randomUUID ? crypto.randomUUID() : 'c_' + Math.random().toString(36).substr(2, 9),
            username: child.name,
            role: 'influencer',
            whitelabel_id: child.id,
            avatar_url: logoUrl,
            bio: `Official ${child.name} Partner Profile`,
            created_at: new Date().toISOString()
          });
        if (error) console.error(`Error creating profile for ${child.name}:`, error.message);
      } else {
        console.log(`Updating profile avatar for child network "${child.name}"...`);
        const { error } = await supabase
          .from('profiles')
          .update({
            avatar_url: logoUrl
          })
          .eq('id', extProfile[0].id);
        if (error) console.error(`Error updating profile for ${child.name}:`, error.message);
      }
    }
  }

  console.log("Olympian Seeding Finished!");
}

run();
