require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const parentId = '7a017c4d-c08f-4260-8540-a0cc8bed4e11';
  console.log('Updating parent network config...');
  
  const updatedTheme = {
    accent: '#E31B23',
    heroCopy: 'Muscle & Fitness — Mr. Olympia Edition',
    heroImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
    logoImage: '/n2n/muscle_fitness_logo.svg',
    shopifyUrl: 'https://mrolympia.com/weekend-schedule',
    sliderCount: 4,
    enableBooking: false,
    heroLayoutMode: 'verbiage',
    enableWatchLive: true
  };

  const { data, error } = await supabase
    .from('whitelabel_configs')
    .update({
      name: 'Muscle & Fitness',
      theme: updatedTheme
    })
    .eq('id', parentId)
    .select();

  if (error) {
    console.error('Error updating config:', error);
  } else {
    console.log('Successfully updated:', data);
  }
}

main();
