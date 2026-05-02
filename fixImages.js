import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fimzetmvrmbmdggvqzpr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const imageMap = {
  'Exclusive Trap Beat - "Midnight"': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop',
  'Vibe Network Official Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
  'Mastering Vocal Mixing Course': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=600&fit=crop', // Same studio vibe
  'Custom 1-on-1 Consulting': 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=600&fit=crop',
  'Acoustic Guitar Sample Pack': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=600&fit=crop',
  'Limited Edition Snapback': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop'
};

async function updateImages() {
  const { data: products } = await supabase.from('products').select('*');
  if (products) {
    for (const p of products) {
      if (imageMap[p.title]) {
        await supabase.from('products').update({ image_url: imageMap[p.title] }).eq('id', p.id);
        console.log("Updated", p.title);
      }
    }
  }
}

updateImages();
