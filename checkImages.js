import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fimzetmvrmbmdggvqzpr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkImages() {
  const { data: products } = await supabase.from('products').select('title, image_url');
  console.log(products);
}

checkImages();
