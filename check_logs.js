import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data, error } = await supabase.from('system_logs').insert([{
     level: 'INFO',
     message: 'Test log from backend'
  }]).select();
  console.log('Insert Error:', error);
  console.log('Insert Data:', data);
}

testInsert();
