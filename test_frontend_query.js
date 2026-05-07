import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fimzetmvrmbmdggvqzpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg'
);

async function run() {
  const query = supabase.from('products').select('*, creator:profiles!inner(username, avatar_url, whitelabel_id)');
  query.eq('creator.whitelabel_id', '940cd852-f359-47b7-b33c-cd73f70059d7');

  const { data: prodData, error } = await query;
  if (error) {
    console.log('Query Error:', error);
  } else {
    console.log('Products Found for Tenant via Anon Key:', prodData?.length);
    console.log(prodData);
  }
}

run();
