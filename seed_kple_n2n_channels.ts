import { supabase } from './supabaseClientLoader.ts';
import fs from 'fs';

const CHRISTIAN_REVIVAL_ID = '33742e2f-430b-4c2d-9cba-42507891ef02';
const KPLE_PARENT_ID = '100d0000-c08f-4260-8540-a0cc8bed4e01';

// YouTube videos from KPLE-TV YouTube channel @KPLEtv
const YOUTUBE_VIDEOS = [
  { ytId: '6xemkfErFFk', title: 'Veteran Resources Show #116 Military Order of the Purple Heart Cen-Tex Chapter 1876' },
  { ytId: 'r8k-Iu8GSgA', title: 'Veteran Resources Show #115 Pastor Les Williams "New Sunset Community Church"' },
  { ytId: 'vdHg6fe8P5Y', title: 'Veterans Resources Show #114 Dr. Angenet Wilkerson, KISD Purple Star Campus Designation' },
  
  { ytId: 'uyna6v_qEFM', title: 'Men Of Integrity #1242 Biblical Breakthroughs' },
  { ytId: 'XCJOatmtlHA', title: 'Men Of Integrity #1241 The Truth About Prayer' },
  { ytId: 'n624VCegwjU', title: 'Men Of Integrity #1240 "Why Aren\'t You Hearing From God"' },
  { ytId: 'ohTHhKbXP7Q', title: 'Men Of Integrity #1239 "Overcoming Through Faith in God’s Word"' },
  { ytId: 'bupNZnG0UaI', title: 'Men Of Integrity #1238 "You Have To Believe God"' },
  { ytId: '9drtdb9zqy4', title: 'Men Of Integrity #1237 "Why The Mind Breaks And How God Heals"' },
  { ytId: 'VJ-LLizp_No', title: 'Getting Personal With God - Men Of Integrity #202' },
  { ytId: 'szoYyujku_E', title: 'The Importance of The Word of God- Men Of Integrity #201' },
  { ytId: '7buWfZ-20n0', title: 'Men Of Integrity #200' },

  { ytId: 'vw04aMnMmJg', title: 'The Word Of Life #8007E "The Temptation Of Jesus" pt5' },
  { ytId: 'cLyKqD-2HQk', title: 'The Word Of Life #8006E "The Temptation Of Jesus" pt4' },
  { ytId: 'e5PyPssFC5U', title: 'Word Of Life #6010s "Una Nueva Identidad" pt1' },
  { ytId: 'EWGs1CV8g_s', title: 'The Word Of Life #8005E "The Temptation Of Jesus" pt3' },
  { ytId: 'JcgUaIO8NSk', title: 'The Word Of Life #8004E "The Temptation Of Jesus" pt2' },
  { ytId: 'bQcximwxVoQ', title: 'The Word Of Life #8003E "The Temptation Of Jesus" pt1' },
  { ytId: 'ak06e1w0n3s', title: 'The Word Of Life #8002E "A Living Sacrifice"' },

  { ytId: 'vwmCBGEmpY0', title: 'Bread Of Life #3010 "The Faith That Moves Mountains"' },
  { ytId: '5BFZ5rg1ZLc', title: 'Bread Of Life #3009 "Walking In The Spirit"' },

  { ytId: 'x2bt6n_Xkq8', title: 'Frankly Speaking #104 "Kingdom Purpose"' },

  { ytId: 'TvJHIFotb3s', title: 'Superbook - A Giant Adventure (David and Goliath)' },

  { ytId: 'p1k8H32aB_w', title: 'Positiv Cinema Spotlight' },

  { ytId: 'C32DH5lIH88', title: 'Aware Central Texas #113 Growing Up In Abuse' },
  { ytId: 'QDhB0vJJHLs', title: 'Aware Central Texas #112' },
  { ytId: 'CtDtZTZ-ORY', title: 'Aware Central Texas #111' },

  { ytId: 'pdEn4PVPLg4', title: 'The Gathering #122' },
  { ytId: 'k0nKqmwsBCY', title: 'The Gathering #121' },

  { ytId: 'v_kSIoCNaCE', title: 'The Journey #305' },
  { ytId: 'hT7Xihx1Ng0', title: 'The Journey #304' },
  { ytId: 'D---2YqLu1U', title: 'The Journey #303' },

  { ytId: 'vwY9rCp_frY', title: 'Grief To Peace #106' },

  { ytId: 'VGeIoMPmfY4', title: 'Dr. Trena Parker Ministries #801' },
  { ytId: 'FSsBvlF0-Kc', title: 'Dr. Trena Parker Ministries #807' },

  { ytId: 'iTn-ZOJKM8Q', title: 'For Such A Time As This #132' },

  { ytId: '6AEfkwYTNeI', title: 'Confess Your Success Pt6 -The Journey#307' },
  { ytId: 'pIYpllssNQc', title: 'Confess Your Success Pt5 - The Journey #306' }
];

function extractChannelName(title: string): string {
  if (title.toLowerCase().includes('veteran') || title.toLowerCase().includes('veterans')) {
    return 'Veteran Resources Show';
  }
  if (title.toLowerCase().includes('men of integrity') || title.toLowerCase().includes('men of intergrity')) {
    return 'Men Of Integrity';
  }
  if (title.toLowerCase().includes('word of life') || title.toLowerCase().includes('the word of life')) {
    return 'The Word Of Life';
  }
  if (title.toLowerCase().includes('aware central texas')) {
    return 'Aware Central Texas';
  }
  if (title.toLowerCase().includes('dr. trena parker')) {
    return 'Dr. Trena Parker';
  }
  if (title.toLowerCase().includes('confess your success')) {
    return 'Confess Your Success';
  }

  const cleanTitle = title.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
  const words = cleanTitle.split(' ');
  return words.slice(0, Math.min(words.length, 3)).join(' ');
}

const CHANNEL_ACCENTS: Record<string, string> = {
  'Veteran Resources Show': '#CC0000',
  'Men Of Integrity': '#004E98',
  'The Word Of Life': '#D4AF37',
  'Bread Of Life': '#2E8B57',
  'Frankly Speaking': '#8E44AD',
  'Superbook': '#FF6600',
  'Positiv Cinema': '#00A86B',
  'Aware Central Texas': '#C0392B',
  'The Gathering': '#2980B9',
  'The Journey': '#D35400',
  'Grief To Peace': '#16A085',
  'Dr. Trena Parker': '#9B59B6',
  'For Such A': '#E67E22',
  'Confess Your Success': '#27AE60'
};

const CATEGORY_MAP: Record<string, string> = {
  'Veteran Resources Show': '8fb926d0-20b5-4f65-a1fa-77db2c57d1db', // Community News
  'Men Of Integrity': 'c5b39a85-3bcf-4c5b-bd73-627725924005', // Sermons & Messages
  'The Word Of Life': 'abc82ad7-a5e6-4c68-aa8a-86ecd2d53a8a', // Bible Studies
  'Bread Of Life': 'abc82ad7-a5e6-4c68-aa8a-86ecd2d53a8a', // Bible Studies
  'Frankly Speaking': 'c5b39a85-3bcf-4c5b-bd73-627725924005',
  'Superbook': '76a4791e-931d-4d9f-bdf7-1b3f48a84679', // Kids & Youth
  'Positiv Cinema': 'cc6be3f6-1f0b-429b-8cc9-76288f920121', // Family Movies
  'Aware Central Texas': '8fb926d0-20b5-4f65-a1fa-77db2c57d1db', // Community News
  'The Gathering': 'c5b39a85-3bcf-4c5b-bd73-627725924005',
  'The Journey': 'c5b39a85-3bcf-4c5b-bd73-627725924005',
  'Grief To Peace': 'c5b39a85-3bcf-4c5b-bd73-627725924005',
  'Dr. Trena Parker': 'c5b39a85-3bcf-4c5b-bd73-627725924005',
  'For Such A': 'c5b39a85-3bcf-4c5b-bd73-627725924005',
  'Confess Your Success': 'c5b39a85-3bcf-4c5b-bd73-627725924005'
};

async function run() {
  console.log('🚀 Seeding KPLE TV N2N Channels for Christian Revival Network...\n');

  // Step 1: Login as admin
  console.log("🔑 Logging in as admin_avonetwork@test.com...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError) {
    console.error("❌ Admin login failed:", authError.message);
    process.exit(1);
  }
  const adminId = authData.user.id;
  console.log("✅ Admin logged in. User ID:", adminId);

  // Step 2: Ensure Parent Christian Revival Network exists & is configured
  const { data: extChristianRevival } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('id', CHRISTIAN_REVIVAL_ID)
    .limit(1);

  if (!extChristianRevival || extChristianRevival.length === 0) {
    console.log('🏗️ Creating Christian Revival Network...');
    await supabase.from('whitelabel_configs').insert({
      id: CHRISTIAN_REVIVAL_ID,
      owner_id: adminId,
      name: 'Christian Revival Network',
      domain: 'christianrevival.vibenetwork.tv',
      logo: 'https://ui-avatars.com/api/?name=Christian+Revival&background=004e98&color=fff',
      n2n_enabled: true,
      platform_fee_percentage: 15,
      theme: {
        accent: '#004e98',
        heroCopy: 'Christian Revival Network — Spreading the Good News and Revival Across All Nations.',
        heroImage: 'https://fimzetmvrmbmdggvqzpr.supabase.co/storage/v1/object/public/images/brand/1784659868962_0.04816690586975225.jpg',
        n2n_enabled: true,
        enableWatchLive: true
      }
    });
  } else {
    console.log('✅ Christian Revival Network verified. Updating N2N enabled status...');
    await supabase.from('whitelabel_configs').update({
      n2n_enabled: true,
      theme: {
        ...(extChristianRevival[0].theme as object),
        n2n_enabled: true
      }
    }).eq('id', CHRISTIAN_REVIVAL_ID);
  }

  // Step 3: Create or update KPLE-TV as child network of Christian Revival Network
  const kplePayload = {
    owner_id: adminId,
    name: 'KPLE-TV',
    domain: 'kple.kpletv.org',
    logo: 'https://fimzetmvrmbmdggvqzpr.supabase.co/storage/v1/object/public/images/brand/1784738405205_0.385791659295728.jpg',
    parent_network_id: CHRISTIAN_REVIVAL_ID,
    n2n_enabled: true,
    platform_fee_percentage: 20,
    theme: {
      accent: '#004e98',
      heroCopy: 'KPLE-TV — Come All Revival. Class A Christian Broadcasting in Killeen, Texas.',
      heroTitle: 'KPLE-TV',
      heroImage: 'https://fimzetmvrmbmdggvqzpr.supabase.co/storage/v1/object/public/images/brand/1784659868962_0.04816690586975225.jpg',
      logoImage: '/n2n/kple_logo_transparent.png',
      n2n_enabled: true,
      parent_network_id: CHRISTIAN_REVIVAL_ID,
      enableWatchLive: true,
      heroLayoutMode: 'verbiage'
    }
  };

  const { data: extKple } = await supabase
    .from('whitelabel_configs')
    .select('id')
    .eq('id', KPLE_PARENT_ID)
    .limit(1);

  if (extKple && extKple.length > 0) {
    console.log('⚡ Updating KPLE-TV parent network configuration...');
    await supabase.from('whitelabel_configs').update(kplePayload).eq('id', KPLE_PARENT_ID);
  } else {
    console.log('🏗️ Creating KPLE-TV parent network...');
    await supabase.from('whitelabel_configs').insert({
      id: KPLE_PARENT_ID,
      ...kplePayload
    });
  }
  console.log('✅ KPLE-TV configured as N2N child of Christian Revival Network and N2N parent for channels!');

  // Group videos by extracted channel name (first 3 words)
  const channelVideoMap: Record<string, typeof YOUTUBE_VIDEOS> = {};
  YOUTUBE_VIDEOS.forEach(vid => {
    const chName = extractChannelName(vid.title);
    if (!channelVideoMap[chName]) {
      channelVideoMap[chName] = [];
    }
    channelVideoMap[chName].push(vid);
  });

  const channelNames = Object.keys(channelVideoMap);
  console.log(`\n📺 Processing ${channelNames.length} YouTube channels:`);

  for (const chName of channelNames) {
    const vids = channelVideoMap[chName];
    const safeDomain = chName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.kpletv.org';
    const accent = CHANNEL_ACCENTS[chName] || '#004e98';
    const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(chName)}&background=${accent.replace('#', '')}&color=fff&size=256&bold=true`;

    const { data: existingCh } = await supabase
      .from('whitelabel_configs')
      .select('id')
      .eq('name', chName)
      .eq('parent_network_id', KPLE_PARENT_ID)
      .limit(1);

    let channelId: string;

    const channelPayload = {
      owner_id: adminId,
      name: chName,
      domain: safeDomain,
      logo: logoUrl,
      parent_network_id: KPLE_PARENT_ID,
      platform_fee_percentage: 30,
      theme: {
        accent: accent,
        heroTitle: chName,
        heroCopy: `${chName} — Watch official episodes, broadcasts, and series on KPLE-TV.`,
        heroImage: `https://i.ytimg.com/vi/${vids[0].ytId}/hqdefault.jpg`,
        logoImage: logoUrl,
        parent_network_id: KPLE_PARENT_ID,
        enableWatchLive: true,
        heroLayoutMode: 'verbiage'
      }
    };

    if (existingCh && existingCh.length > 0) {
      channelId = existingCh[0].id;
      await supabase.from('whitelabel_configs').update(channelPayload).eq('id', channelId);
    } else {
      const { data: newCh, error: chErr } = await supabase
        .from('whitelabel_configs')
        .insert(channelPayload)
        .select('id')
        .single();

      if (chErr || !newCh) {
        console.error(`  ❌ Failed to create channel "${chName}":`, chErr?.message);
        continue;
      }
      channelId = newCh.id;
    }

    // A. Check or Create Creator Profile for Channel Host
    const { data: extProf } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', chName)
      .limit(1);

    let hostUserId = adminId;
    if (extProf && extProf.length > 0) {
      hostUserId = extProf[0].id;
      await supabase.from('profiles').update({
        whitelabel_id: channelId,
        avatar_url: logoUrl,
        bio: `Official Channel for ${chName} on KPLE-TV`,
        role: 'influencer'
      }).eq('id', hostUserId);
    } else {
      // Upsert profile for admin/channel host
      await supabase.from('profiles').upsert({
        id: adminId,
        username: chName,
        whitelabel_id: channelId,
        avatar_url: logoUrl,
        bio: `Official Channel for ${chName} on KPLE-TV`,
        role: 'influencer'
      });
    }

    // B. Create Series row in `series` table for this channel using adminId as creator_id to comply with RLS
    const seriesTitle = `${chName} Series`;
    const { data: extSeries } = await supabase
      .from('series')
      .select('id')
      .eq('creator_id', adminId)
      .eq('title', seriesTitle)
      .limit(1);

    let seriesId: string;
    const seriesPayload = {
      creator_id: adminId,
      title: seriesTitle,
      description: `Official broadcasting series for ${chName} on KPLE-TV.`,
      img: `https://i.ytimg.com/vi/${vids[0].ytId}/hqdefault.jpg`,
      price: 0,
      subscriber_free: true,
      billing_level: 'series'
    };

    if (extSeries && extSeries.length > 0) {
      seriesId = extSeries[0].id;
      await supabase.from('series').update(seriesPayload).eq('id', seriesId);
      console.log(`  🎬 Series "${seriesTitle}" updated (ID: ${seriesId}).`);
    } else {
      const { data: newSeries, error: sErr } = await supabase
        .from('series')
        .insert(seriesPayload)
        .select('id')
        .single();

      if (sErr || !newSeries) {
        console.error(`  ❌ Failed to create series for "${chName}":`, sErr?.message);
        continue;
      }
      seriesId = newSeries.id;
      console.log(`  🎬 Created series "${seriesTitle}" (ID: ${seriesId}).`);
    }

    // C. Seed Episodes & Videos belonging to this Channel/Series
    const catId = CATEGORY_MAP[chName] || 'c5b39a85-3bcf-4c5b-bd73-627725924005';

    for (const v of vids) {
      const videoUrl = `https://www.youtube.com/watch?v=${v.ytId}`;
      const imageUrl = `https://i.ytimg.com/vi/${v.ytId}/hqdefault.jpg`;

      // Insert/Update into `episodes` table
      const { data: extEp } = await supabase
        .from('episodes')
        .select('id')
        .eq('series_id', seriesId)
        .eq('title', v.title)
        .limit(1);

      const epPayload = {
        series_id: seriesId,
        title: v.title,
        description: `${chName} episode on KPLE-TV broadcast network.`,
        video_url: videoUrl,
        thumbnail_url: imageUrl,
        subscriber_free: true
      };

      if (extEp && extEp.length > 0) {
        await supabase.from('episodes').update(epPayload).eq('id', extEp[0].id);
      } else {
        await supabase.from('episodes').insert(epPayload);
      }

      // Insert/Update into `videos` table
      const { data: extVid } = await supabase
        .from('videos')
        .select('id')
        .eq('video_url', videoUrl)
        .limit(1);

      const vidPayload = {
        title: v.title,
        video_url: videoUrl,
        image_url: imageUrl,
        creator_id: adminId,
        whitelabel_id: channelId,
        category_id: catId,
        tags: ['KPLE-TV', chName, 'Series']
      };

      if (extVid && extVid.length > 0) {
        await supabase.from('videos').update(vidPayload).eq('id', extVid[0].id);
      } else {
        await supabase.from('videos').insert(vidPayload);
      }
    }
    console.log(`  📺 Configured ${vids.length} videos & episodes in series for "${chName}".`);
  }

  console.log('\n' + '═'.repeat(65));
  console.log('🎉 KPLE-TV N2N Child Network & Channels successfully seeded!');
  console.log('👉 Open KPLE-TV Parent Network: http://localhost:5173/?tenant=' + KPLE_PARENT_ID);
  console.log('👉 Open Christian Revival Parent: http://localhost:5173/?tenant=' + CHRISTIAN_REVIVAL_ID);
  console.log('═'.repeat(65) + '\n');
}

run().catch(console.error);
