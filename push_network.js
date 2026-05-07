import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fimzetmvrmbmdggvqzpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg'
);

async function run() {
  const jamiesGirlsConfig = {
    id: '00000000-0000-0000-0000-000000000001',
    owner_id: 'cbdbc5b9-68a3-4143-b738-3d45926d4712',
    name: "Jamie's Girls",
    domain: "jamiesgirls.com",
    logo: null,
    theme: {
       accent: "#ff4d85",
       bg: "#0a0a0a",
       heroCopy: "The Ultimate Network for Fashion & Beauty",
       btnPrimary: "#ff4d85",
       sliderCount: 4,
       customSections: "Platform Architecture,Success Stories",
       enableWatchLive: true,
       enableBooking: true,
       heroLayoutMode: "verbiage"
    }
  };

  const { data, error } = await supabase.from('whitelabel_configs').upsert(jamiesGirlsConfig).select();
  if (error) {
    console.error('Error inserting Jamie\'s Girls config:', error);
  } else {
    console.log('Successfully pushed Jamie\'s Girls to the Production DB!', data);
  }
}

run();
