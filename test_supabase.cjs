const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://fimzetmvrmbmdggvqzpr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg');

async function test() {
  const { data, error } = await supabase.from('ledger').select('*, profiles(*)').limit(1);
  console.log(JSON.stringify(data, null, 2));
  console.log(error);
}
test();
