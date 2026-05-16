import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  const { data, error } = await supabase.from('whitelabel_configs').select('theme, accent').eq('id', 'c8c4084d-56b4-4c45-94f6-e4b1821dad75');
  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}

testQuery();
