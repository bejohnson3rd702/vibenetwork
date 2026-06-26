import { supabase } from './supabaseClientLoader.ts';

const OLYMPIAN_CONFIG = {
  name: 'Mr. Olympian',
  domain: 'mrolympian.avoclothing.com',
  logo: 'https://mrolympia.com/sites/mrolympia.com/files/logo-2026.png',
  platform_fee_percentage: 30,
  parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7', // AVO NETWORK
  n2n_enabled: false,
  theme: {
    accent: '#C5A059',
    heroCopy: 'Mr. Olympian — Official Weekend Schedule & Gear',
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    logoImage: 'https://mrolympia.com/sites/mrolympia.com/files/logo-2026.png',
    shopifyUrl: 'https://www.gymreapers.com/collections/olympia-collection?utm_source=Website&utm_medium=Olympia&utm_campaign=Web+Banner&utm_id=Olympia&utm_term=limited+drop',
    sliderCount: 4,
    enableBooking: false,
    heroLayoutMode: 'verbiage',
    enableWatchLive: true
  }
};

async function run() {
  console.log("Checking if Mr. Olympian config already exists...");
  const { data: existing } = await supabase
    .from('whitelabel_configs')
    .select('id')
    .eq('name', OLYMPIAN_CONFIG.name)
    .limit(1);

  if (existing && existing.length > 0) {
    const id = existing[0].id;
    console.log(`Config exists with ID: ${id}. Updating...`);
    const { data, error } = await supabase
      .from('whitelabel_configs')
      .update(OLYMPIAN_CONFIG)
      .eq('id', id)
      .select();
      
    if (error) {
      console.error("Update error:", error);
    } else {
      console.log("Successfully updated Mr. Olympian config:", JSON.stringify(data[0], null, 2));
    }
  } else {
    console.log("Config does not exist. Creating new config...");
    const { data, error } = await supabase
      .from('whitelabel_configs')
      .insert(OLYMPIAN_CONFIG)
      .select();
      
    if (error) {
      console.error("Insert error:", error);
    } else {
      console.log("Successfully created Mr. Olympian config:", JSON.stringify(data[0], null, 2));
    }
  }
}

run();
