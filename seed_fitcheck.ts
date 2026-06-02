import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fimzetmvrmbmdggvqzpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg'
);

async function seedFitCheckPosts() {
  // 1. Get all child networks under AVO
  const { data: configs, error: configErr } = await supabase
    .from('whitelabel_configs')
    .select('id, name, owner_id, parent_network_id');

  if (configErr) { console.error('Error fetching configs:', configErr); return; }
  console.log(`Found ${configs?.length} configs`);

  // Find AVO parent
  const avo = configs?.find(c => c.name?.toLowerCase().includes('avo'));
  if (!avo) { console.error('AVO network not found'); return; }
  console.log('AVO:', avo.id, avo.name);

  // Get child networks
  const children = configs?.filter(c => c.parent_network_id === avo.id) || [];
  console.log(`Found ${children.length} child networks`);

  if (children.length === 0) {
    console.log('No child networks. Listing all configs:');
    configs?.forEach(c => console.log(`  ${c.name} (${c.id}) parent=${c.parent_network_id}`));
    return;
  }

  // 2. For each child, find the owner profile and insert a fit check post
  const flyerUrl = '/n2n/fitcheck-flyer.png'; // local asset

  for (const child of children) {
    const schoolName = child.name || 'College';
    
    // Find a profile in this child network to post as
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('whitelabel_id', child.id)
      .limit(1);

    let creatorId = profiles?.[0]?.id || child.owner_id;
    
    if (!creatorId) {
      console.log(`  Skipping ${schoolName} - no profile/owner found`);
      continue;
    }

    const postContent = `🔥 ${schoolName} FIT CHECK CONTEST is HERE! Show us your best game day outfit. Tag @AVO and post your look — the top-voted fit wins exclusive merch from the AVO collection! 👟🏆 Free entry. Let's see what you got!`;

    const { data: post, error: postErr } = await supabase
      .from('posts')
      .insert([{
        creator_id: creatorId,
        content: postContent,
        image_url: flyerUrl,
        is_locked: false,
        likes: Math.floor(Math.random() * 150) + 50,
      }])
      .select();

    if (postErr) {
      console.error(`  Error inserting for ${schoolName}:`, postErr.message);
    } else {
      console.log(`  ✅ Posted fit check for ${schoolName} (post id: ${post?.[0]?.id})`);
    }
  }

  console.log('\nDone!');
}

seedFitCheckPosts();
