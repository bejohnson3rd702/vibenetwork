import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fimzetmvrmbmdggvqzpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg'
);

const CHILDREN = [
  { name: 'Baylor University', domain: 'baylor.avoclothing.com', accent: '#154734', heroCopy: "Sic 'Em Bears — Premium Gameday Apparel" },
  { name: 'University of Colorado', domain: 'colorado.avoclothing.com', accent: '#CFB87C', heroCopy: 'Go Buffs — Official Colorado Gameday Gear' },
  { name: 'University of Georgia', domain: 'georgia.avoclothing.com', accent: '#BA0C2F', heroCopy: 'Go Dawgs — Premium UGA Apparel' },
  { name: 'Mississippi State University', domain: 'msstate.avoclothing.com', accent: '#660000', heroCopy: 'Hail State — Official Bulldog Apparel' },
  { name: 'University of Alabama', domain: 'alabama.avoclothing.com', accent: '#9E1B32', heroCopy: 'Roll Tide — Premium Crimson Tide Gear' },
  { name: 'Ole Miss University', domain: 'olemiss.avoclothing.com', accent: '#CE1126', heroCopy: 'Hotty Toddy — Official Rebels Apparel' },
  { name: 'Vanderbilt University', domain: 'vanderbilt.avoclothing.com', accent: '#866D4B', heroCopy: 'Anchor Down — Premium Commodores Gear' },
  { name: 'Penn State University', domain: 'pennstate.avoclothing.com', accent: '#041E42', heroCopy: 'We Are — Official Nittany Lions Apparel' },
];

async function seed() {
  console.log('🌱 Seeding N2N data (using theme JSONB for n2n fields)...\n');

  // Step 1: Check if AVO NETWORK already exists
  const { data: existing } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('name', 'AVO NETWORK')
    .limit(1);

  let parentId: string;

  if (existing && existing.length > 0) {
    parentId = existing[0].id;
    console.log(`✅ AVO NETWORK already exists: ${parentId}`);

    // Enable N2N via theme
    const currentTheme = existing[0].theme || {};
    const { error } = await supabase
      .from('whitelabel_configs')
      .update({ theme: { ...currentTheme, n2n_enabled: true } })
      .eq('id', parentId);
    
    if (error) console.error('❌ Failed to enable N2N:', error.message);
    else console.log('⚡ N2N enabled on AVO NETWORK (via theme)');
  } else {
    console.log('🏗️  Creating AVO NETWORK...');
    const { data: newParent, error } = await supabase
      .from('whitelabel_configs')
      .insert({
        name: 'AVO NETWORK',
        domain: 'shopavo.la',
        logo: 'https://shopavo.la/cdn/shop/files/fav-icon_32x32.png?v=1731445399',
        platform_fee_percentage: 15,
        theme: {
          accent: '#D35400',
          heroCopy: 'AVO NETWORK — The Future of College Apparel',
          heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&q=80&w=2000',
          enableWatchLive: true,
          enableBooking: false,
          heroLayoutMode: 'verbiage',
          sliderCount: 4,
          n2n_enabled: true,
        },
      })
      .select()
      .single();

    if (error || !newParent) {
      console.error('❌ Failed to create AVO NETWORK:', error?.message);
      process.exit(1);
    }
    parentId = newParent.id;
    console.log(`✅ AVO NETWORK created: ${parentId}`);
  }

  // Step 2: Create child networks
  console.log('\n🎓 Creating 8 college child networks...\n');

  for (const child of CHILDREN) {
    // Check if child already exists
    const { data: existingChild } = await supabase
      .from('whitelabel_configs')
      .select('id')
      .eq('name', child.name)
      .limit(1);

    if (existingChild && existingChild.length > 0) {
      // Update it to link to parent
      const { error: updateErr } = await supabase
        .from('whitelabel_configs')
        .update({
          theme: {
            accent: child.accent,
            heroCopy: child.heroCopy,
            heroImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
            enableWatchLive: true,
            enableBooking: false,
            heroLayoutMode: 'verbiage',
            sliderCount: 4,
            parent_network_id: parentId,
          }
        })
        .eq('id', existingChild[0].id);
      
      if (updateErr) console.log(`  ❌ ${child.name}: ${updateErr.message}`);
      else console.log(`  🔗 ${child.name} linked to parent (updated)`);
      continue;
    }

    const { data, error } = await supabase
      .from('whitelabel_configs')
      .insert({
        name: child.name,
        domain: child.domain,
        platform_fee_percentage: 30,
        theme: {
          accent: child.accent,
          heroCopy: child.heroCopy,
          heroImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
          enableWatchLive: true,
          enableBooking: false,
          heroLayoutMode: 'verbiage',
          sliderCount: 4,
          parent_network_id: parentId,
        },
      })
      .select()
      .single();

    if (error) {
      console.error(`  ❌ ${child.name}: ${error.message}`);
    } else {
      console.log(`  ✅ ${child.name} → ${data?.id}`);
    }
  }

  // Step 3: Print access info
  console.log('\n' + '═'.repeat(60));
  console.log(`\n🚀 N2N is LIVE! Open this URL:\n`);
  console.log(`   http://localhost:5173/?tenant=${parentId}\n`);
  console.log('═'.repeat(60) + '\n');
}

seed().catch(console.error);
