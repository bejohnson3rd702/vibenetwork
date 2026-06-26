require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const updates = [
  {
    email: 'elena_vance@avo.com',
    username: 'elena_vance',
    avatar_url: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&q=80&w=400' // Skier down the mountain (Verified 200)
  },
  {
    email: 'sarah_jenkins@avo.com',
    username: 'sarah_jenkins',
    avatar_url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=400' // Soccer goalie jumping action (Verified 200)
  },
  {
    email: 'clara_thorne@avo.com',
    username: 'clara_thorne',
    avatar_url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=400' // Tennis player mid-swing (Verified 200)
  }
];

async function updateImages() {
  console.log('Updating athlete profile images using authenticated sessions for specific athletes...');
  
  for (const item of updates) {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    
    const password = 'AthletePassword123!';
    
    // Sign in as this user
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: item.email,
      password
    });
    
    if (signInError) {
      console.error(`[ERROR] Failed to sign in as ${item.email}:`, signInError.message);
      continue;
    }
    
    const userId = authData.user.id;
    
    // Update the profile
    const { data, error } = await supabase
      .from('profiles')
      .update({ avatar_url: item.avatar_url })
      .eq('id', userId)
      .select('username, avatar_url');
      
    if (error) {
      console.error(`[ERROR] Failed to update profile for ${item.username}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`[SUCCESS] Updated profile for ${data[0].username} to: ${data[0].avatar_url}`);
    } else {
      console.log(`[WARN] Update succeeded but no data returned for ${item.username}`);
    }
  }
}

updateImages();
