import { supabase } from './supabaseClientLoader.ts';

const CHILDREN = [
  { name: 'TCT Network', domain: 'tct.kpletv.org', accent: '#004e98', heroCopy: 'TCT Network — Share the Word of God' },
  { name: 'Smile of a Child', domain: 'smile.kpletv.org', accent: '#FF66CC', heroCopy: 'Smile of a Child — Inspiring faith-filled children' },
  { name: 'Positiv', domain: 'positiv.kpletv.org', accent: '#33CC66', heroCopy: 'Positiv — Good stories, positive family movies' },
  { name: 'The Walk TV', domain: 'thewalk.kpletv.org', accent: '#FF9900', heroCopy: 'The Walk TV — Christian lifestyle and entertainment' },
  { name: 'Enlace USA', domain: 'enlace.kpletv.org', accent: '#0099FF', heroCopy: 'Enlace USA — Inspirando tu vida diaria' },
  { name: 'Attention Central Texas', domain: 'act.kpletv.org', accent: '#CC0000', heroCopy: 'ACT — Attention Central Texas community news' },
];

async function createProfileForChild(child: any, logoUrl: string) {
  const safeName = child.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const email = `admin_${safeName}@test.com`;
  const password = 'TestPassword123!';

  console.log(`  👤 Signing up admin account for "${child.name}" (${email})...`);
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: child.name,
        last_name: 'Admin',
        whitelabel_id: child.id
      }
    }
  });

  if (signUpError) {
    if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
      console.log(`  👤 Account already exists for "${child.name}"`);
      return;
    } else {
      console.error(`  ❌ Error signing up account for ${child.name}:`, signUpError.message);
      return;
    }
  }

  const user = authData.user;
  if (user) {
    console.log(`  ✅ Account signed up successfully for "${child.name}". Updating profile...`);
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        username: child.name,
        role: 'influencer',
        avatar_url: logoUrl,
        bio: `Official ${child.name} Network Channel`
      })
      .eq('id', user.id);

    if (profileError) {
      console.error(`  ❌ Error updating profile for ${child.name}:`, profileError.message);
    } else {
      console.log(`  ✅ Profile successfully updated for "${child.name}"`);
    }
  }
}

async function seed() {
  console.log('🌱 Seeding KPLE TV N2N Network (Dev database)...\n');

  console.log("🔑 Logging in as admin_avonetwork@test.com...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.error("❌ Login failed:", authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log("✅ Logged in successfully! User ID:", userId);

  // Step 1: Create or get KPLE TV parent config
  const { data: existingParent } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('name', 'KPLE TV')
    .limit(1);

  let parentId: string;
  const parentPayload = {
    owner_id: userId,
    name: 'KPLE TV',
    domain: 'kpletv.org',
    logo: 'https://ui-avatars.com/api/?name=KPLE+TV&background=004e98&color=fff',
    platform_fee_percentage: 15,
    n2n_enabled: true,
    theme: {
      accent: '#004e98',
      heroCopy: 'KPLE TV — Come All Revival. Class A Christian Broadcasting in Killeen, Texas.',
      heroImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&q=80&w=2000',
      enableWatchLive: true,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      n2n_enabled: true,
    }
  };

  if (existingParent && existingParent.length > 0) {
    parentId = existingParent[0].id;
    console.log(`✅ KPLE TV Parent already exists: ${parentId}. Updating...`);
    const { error } = await supabase
      .from('whitelabel_configs')
      .update(parentPayload)
      .eq('id', parentId);
    
    if (error) console.error('❌ Failed to update Parent KPLE:', error.message);
    else console.log('⚡ Parent KPLE configuration updated successfully.');
  } else {
    console.log('🏗️  Creating Parent KPLE TV...');
    const { data: newParent, error } = await supabase
      .from('whitelabel_configs')
      .insert(parentPayload)
      .select()
      .single();

    if (error || !newParent) {
      console.error('❌ Failed to create Parent KPLE:', error?.message);
      process.exit(1);
    }
    parentId = newParent.id;
    console.log(`✅ Parent KPLE TV created: ${parentId}`);
  }

  // Step 2: Create or update child networks
  console.log('\n⛪ Creating 6 KPLE child networks...\n');

  for (const child of CHILDREN) {
    const { data: existingChild } = await supabase
      .from('whitelabel_configs')
      .select('id')
      .eq('name', child.name)
      .limit(1);

    const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=${child.accent.replace('#', '')}&color=fff&size=256&bold=true`;

    const childPayload = {
      owner_id: userId,
      name: child.name,
      domain: child.domain,
      logo: logoUrl,
      platform_fee_percentage: 30,
      parent_network_id: parentId,
      theme: {
        accent: child.accent,
        logoImage: logoUrl,
        heroCopy: child.heroCopy,
        heroImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
        enableWatchLive: true,
        enableBooking: false,
        heroLayoutMode: 'verbiage',
        sliderCount: 4,
        parent_network_id: parentId,
      }
    };

    if (existingChild && existingChild.length > 0) {
      const { error: updateErr } = await supabase
        .from('whitelabel_configs')
        .update(childPayload)
        .eq('id', existingChild[0].id);

      if (updateErr) console.log(`  ❌ ${child.name}: ${updateErr.message}`);
      else console.log(`  🔗 ${child.name} linked to parent (updated)`);
    } else {
      const { data, error } = await supabase
        .from('whitelabel_configs')
        .insert(childPayload)
        .select()
        .single();

      if (error) {
        console.error(`  ❌ ${child.name}: ${error.message}`);
      } else {
        console.log(`  ✅ ${child.name} → ${data?.id}`);
      }
    }
  }

  // Step 3: Create mock profiles for child networks so they appear on N2N sliders
  console.log("\n👤 Creating profiles for child networks (via auth signUp flow)...");
  const { data: seededChildren } = await supabase
    .from('whitelabel_configs')
    .select('id, name, theme')
    .eq('parent_network_id', parentId);

  if (seededChildren) {
    for (const child of seededChildren) {
      const accentVal = (child.theme as any)?.accent || '#333333';
      const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=${accentVal.replace('#', '')}&color=fff&size=256&bold=true`;
      
      const { data: extProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('whitelabel_id', child.id)
        .eq('username', child.name)
        .limit(1);

      if (!extProfile || extProfile.length === 0) {
        await createProfileForChild(child, logoUrl);
        
        // Log back in as admin_avonetwork@test.com so we are ready for the next operations
        const { error: loginErr } = await supabase.auth.signInWithPassword({
          email: 'admin_avonetwork@test.com',
          password: 'TestPassword123!'
        });
        if (loginErr) {
          console.error("❌ Failed to log back in as admin:", loginErr.message);
          process.exit(1);
        }
      } else {
        console.log(`  👤 Profile already exists for "${child.name}"`);
      }
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`\n🚀 KPLE TV N2N is LIVE locally! Open this URL:\n`);
  console.log(`   http://localhost:5173/?tenant=${parentId}\n`);
  console.log('═'.repeat(60) + '\n');
}

seed().catch(console.error);
