import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  const { data, error } = await supabase.from('platform_settings').update({ global_vibe_fee_whitelabel: 99 }).neq('id', '00000000-0000-0000-0000-000000000000').select();
  console.log("Update Error:", error);
}

testUpdate();
