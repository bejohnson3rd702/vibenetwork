import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fimzetmvrmbmdggvqzpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg'
);

async function run() {
  // 1. Get Jamie's Girls Network ID from the DB
  const { data: networks, error: wlError } = await supabase
    .from('whitelabel_configs')
    .select('id, name')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (wlError || !networks || networks.length === 0) {
    console.log('Error finding network:', wlError);
    return;
  }
  
  const jamiesGirls = networks.find(n => n.name && n.name.includes('Jamie'));
  if (!jamiesGirls) {
    console.log('Could not find Jamie\'s Girls in the DB. Existing networks:', networks);
    return;
  }

  const networkId = jamiesGirls.id;
  console.log('Found Network ID for Jamie\'s Girls:', networkId);

  // Generate a random UUID for the test profile
  const testUserId = crypto.randomUUID();

  // 2. Create the Test Profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: testUserId,
      username: 'TestCreator_' + Math.floor(Math.random() * 1000),
      full_name: 'Jamie\'s Model 1',
      bio: 'This is a test profile created to verify network marketplace features.',
      whitelabel_id: networkId
    })
    .select()
    .single();

  if (profileError) {
    console.log('Error creating profile (Might be RLS blocking ANON key):', profileError);
    // If it fails due to RLS, the user will have to do it through the UI
    return;
  }
  
  console.log('Created Test Profile:', profileData.username);

  // 3. Create Mock Products for this Profile
  const testProducts = [
    {
      creator_id: testUserId,
      title: 'Neon Skateboard Deck',
      price: 49.99,
      type: 'physical',
      image_url: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&q=80&w=800',
      hidden_from_network: false
    },
    {
      creator_id: testUserId,
      title: 'Exclusive Digital Photo Pack',
      price: 19.99,
      type: 'digital',
      image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
      hidden_from_network: false
    },
    {
      creator_id: testUserId,
      title: 'Test Product (Network Hidden)',
      price: 99.99,
      type: 'digital',
      image_url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800',
      hidden_from_network: true
    }
  ];

  const { data: prodData, error: prodError } = await supabase
    .from('products')
    .insert(testProducts)
    .select();

  if (prodError) {
    console.log('Error creating products:', prodError);
  } else {
    console.log(`Successfully added ${prodData.length} test products for the marketplace!`);
  }
}

run();
