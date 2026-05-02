import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fimzetmvrmbmdggvqzpr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log("Fetching profiles...");
  const { data: profiles, error: fetchError } = await supabase.from('profiles').select('id, username').limit(2);

  if (fetchError || !profiles || profiles.length === 0) {
    console.error("Error fetching profiles:", fetchError);
    return;
  }

  console.log("Profiles found:", profiles.map(p => p.username));

  const p1 = profiles[0].id;
  
  const mockProducts = [
    {
      title: 'Exclusive Trap Beat - "Midnight"',
      price: 49.99,
      type: 'beat',
      image_url: 'https://image.pollinations.ai/prompt/midnight%20studio%20neon%20beat%20cover%20art?width=400&height=400&nologo=true',
      creator_id: p1
    },
    {
      title: 'Vibe Network Official Hoodie',
      price: 59.99,
      type: 'physical',
      image_url: 'https://image.pollinations.ai/prompt/black%20premium%20hoodie%20apparel%20mockup?width=400&height=400&nologo=true',
      creator_id: p1
    },
    {
      title: 'Mastering Vocal Mixing Course',
      price: 99.00,
      type: 'digital',
      image_url: 'https://image.pollinations.ai/prompt/mixing%20board%20studio%20course%20cover?width=400&height=400&nologo=true',
      creator_id: p1
    }
  ];

  if (profiles.length > 1) {
    const p2 = profiles[1].id;
    mockProducts.push(
      {
        title: 'Custom 1-on-1 Consulting',
        price: 150.00,
        type: 'digital',
        image_url: 'https://image.pollinations.ai/prompt/professional%20consulting%20video%20call?width=400&height=400&nologo=true',
        creator_id: p2
      },
      {
        title: 'Acoustic Guitar Sample Pack',
        price: 29.99,
        type: 'beat',
        image_url: 'https://image.pollinations.ai/prompt/acoustic%20guitar%20studio%20sample%20pack?width=400&height=400&nologo=true',
        creator_id: p2
      },
      {
        title: 'Limited Edition Snapback',
        price: 35.00,
        type: 'physical',
        image_url: 'https://image.pollinations.ai/prompt/premium%20snapback%20hat%20merch?width=400&height=400&nologo=true',
        creator_id: p2
      }
    );
  }

  console.log("Inserting products...");
  const { data, error } = await supabase.from('products').insert(mockProducts);

  if (error) {
    console.error("Error inserting products:", error);
  } else {
    console.log("Successfully inserted mock products!");
  }
}

seed();
