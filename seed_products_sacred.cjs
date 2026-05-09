const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fimzetmvrmbmdggvqzpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg'
);

async function run() {
  const { data: wl } = await supabase.from('whitelabel_configs').select('id, name').ilike('name', '%sacred%').single();
  if (!wl) {
    console.error('Could not find sacred serpent whitelabel config');
    return;
  }
  console.log('Found network:', wl.name);
  
  const { data: profiles } = await supabase.from('profiles').select('id, username').eq('whitelabel_id', wl.id);
  console.log(`Found ${profiles.length} profiles`);
  
  const tattooProducts = [
    { title: 'Custom Sleeve Design Session', price: 150.00, img: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=800' },
    { title: 'Flash Tattoo Deposit', price: 50.00, img: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=800' },
    { title: 'Tattoo Aftercare Kit', price: 25.00, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800' },
    { title: 'Sacred Serpent T-Shirt', price: 35.00, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
    { title: 'Half-Day Session Deposit', price: 200.00, img: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&q=80&w=800' }
  ];

  for (const profile of profiles) {
    console.log(`Adding products to ${profile.username}...`);
    
    for (const prod of tattooProducts) {
      const { error } = await supabase.from('products').insert({
        creator_id: profile.id,
        title: prod.title,
        price: prod.price,
        image_url: prod.img,
        type: 'digital',
        hidden_from_network: false
      });
      if (error) {
         console.error('Error adding product', error);
      }
    }
  }
  console.log('Done!');
}
run();
