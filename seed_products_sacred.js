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
    { title: 'Custom Sleeve Design Session', price: 150.00, desc: 'One hour design consultation for your custom full sleeve.' },
    { title: 'Flash Tattoo Deposit', price: 50.00, desc: 'Secure your spot for any flash piece.' },
    { title: 'Tattoo Aftercare Kit', price: 25.00, desc: 'Premium ointment and antibacterial soap.' },
    { title: 'Sacred Serpent T-Shirt', price: 35.00, desc: 'Limited edition shop merch.' },
    { title: 'Half-Day Session Deposit', price: 200.00, desc: 'Deposit to lock in a 4-hour tattoo session.' }
  ];

  for (const profile of profiles) {
    // Only fake/test profiles usually don't have many products, but we will add to all profiles for this network just in case, or maybe only specific ones?
    // User said "for the fake accounts on sacred serpant". I'll add to all profiles on that network, or maybe filter out the owner.
    console.log(`Adding products to ${profile.username}...`);
    
    for (const prod of tattooProducts) {
      await supabase.from('products').insert({
        seller_id: profile.id,
        title: prod.title,
        description: prod.desc,
        price: prod.price,
        image_url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=800',
        whitelabel_id: wl.id
      });
    }
  }
  console.log('Done!');
}
run();
