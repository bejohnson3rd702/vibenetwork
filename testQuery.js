import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fimzetmvrmbmdggvqzpr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testQuery() {
  const query = supabase
    .from('products')
    .select('*, creator:profiles!inner(username, avatar_url, whitelabel_id)');

  const { data, error } = await query;
  console.log("Error:", error);
  console.log("Data length:", data?.length);
  if (data?.length > 0) {
    console.log("First item:", data[0]);
  }
}

testQuery();
