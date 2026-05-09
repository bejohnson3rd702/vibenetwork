const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fimzetmvrmbmdggvqzpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg'
);

async function run() {
  const titles = [
    'Custom Sleeve Design Session',
    'Flash Tattoo Deposit',
    'Tattoo Aftercare Kit',
    'Sacred Serpent T-Shirt',
    'Half-Day Session Deposit',
    'Bad panda T-shirt',
    'Exclusive Digital Photo Pack',
    'Neon Skateboard Deck',
    'Hidden VIP Content',
    'Test',
    'test'
  ];
  
  for (const title of titles) {
    const { error, data } = await supabase.from('products').delete().eq('title', title);
    if (error) {
      console.error('Error deleting', title, error.message);
    } else {
      console.log('Deleted', title);
    }
  }
}
run();
