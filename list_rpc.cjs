const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fimzetmvrmbmdggvqzpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg'
);

async function run() {
  const req = await fetch('https://fimzetmvrmbmdggvqzpr.supabase.co/rest/v1/', {
    headers: { apikey: supabase.supabaseKey }
  });
  const data = await req.json();
  console.log(Object.keys(data.paths).filter(p => p.startsWith('/rpc/')));
}

run();
