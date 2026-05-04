import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fimzetmvrmbmdggvqzpr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log("Fetching a profile to own the DJ sets...");
  const { data: profiles, error: fetchError } = await supabase.from('profiles').select('id, username').limit(1);

  if (fetchError || !profiles || profiles.length === 0) {
    console.error("Error fetching profiles:", fetchError);
    return;
  }

  const creatorId = profiles[0].id;
  console.log("Profile found:", profiles[0].username);

  console.log("Checking for 'Live DJ Sets' category...");
  let { data: categories, error: catError } = await supabase.from('categories').select('id').eq('title', 'Live DJ Sets');
  
  let categoryId;
  
  if (!categories || categories.length === 0) {
    console.log("Category not found, creating 'Live DJ Sets'...");
    const { data: newCat, error: insertCatError } = await supabase.from('categories').insert([{ title: 'Live DJ Sets' }]).select();
    if (insertCatError) {
      console.error("Failed to create category:", insertCatError);
      return;
    }
    categoryId = newCat[0].id;
  } else {
    categoryId = categories[0].id;
  }
  
  console.log("Category ID:", categoryId);

  const djSets = [
    {
      title: 'Fred again.. | Boiler Room: London',
      video_url: 'https://www.youtube.com/embed/c0-hvjV2A5Y',
      image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200',
      stream_time: '71:00',
      price: 0,
      preview_duration: 90,
      category_id: categoryId,
      creator_id: creatorId
    },
    {
      title: 'Skrillex | Boiler Room x OWSLA',
      video_url: 'https://www.youtube.com/embed/V7z7BAZdt2M',
      image_url: 'https://images.unsplash.com/photo-1598387181032-a3103ea27146?auto=format&fit=crop&q=80&w=1200',
      stream_time: '45:30',
      price: 0,
      preview_duration: 90,
      category_id: categoryId,
      creator_id: creatorId
    },
    {
      title: 'Solomun @ Tulum (Live Set)',
      video_url: 'https://www.youtube.com/embed/_tGz05aZzEo',
      image_url: 'https://images.unsplash.com/photo-1571266028243-cb40f54020a5?auto=format&fit=crop&q=80&w=1200',
      stream_time: '120:00',
      price: 0,
      preview_duration: 90,
      category_id: categoryId,
      creator_id: creatorId
    },
    {
      title: 'Carl Cox | Boiler Room Ibiza',
      video_url: 'https://www.youtube.com/embed/W86cTIoMv2U',
      image_url: 'https://images.unsplash.com/photo-1470229722913-7c092bb4ace4?auto=format&fit=crop&q=80&w=1200',
      stream_time: '90:00',
      price: 0,
      preview_duration: 90,
      category_id: categoryId,
      creator_id: creatorId
    }
  ];

  console.log("Inserting DJ Sets...");
  const { error } = await supabase.from('videos').insert(djSets);

  if (error) {
    console.error("Error inserting DJ sets:", error);
  } else {
    console.log("Successfully inserted 4 new DJ Sets!");
  }
}

seed();
