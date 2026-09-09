const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');

const sbUrl = 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';
const supabase = createClient(sbUrl, sbKey);

const CHANNELS = [
  { name: 'Fox News', channelId: 'UCXIJgqnII2ZOINSWNOGFThA' },
  { name: 'CNN News', channelId: 'UCupvZG-5ko_eiXAupbDfxWw' },
  { name: 'MSNBC Politics', channelId: 'UCaXkIU1QidjPwiAYu6GcHjg' },
  { name: 'People Weekly', channelId: 'UCGbQJy-531_5vfphay-rChQ' },
  { name: 'CNBC Business', channelId: 'UCvJJ_dzjViJCoLf5uKUTwoA' },
  { name: 'ESPN Sports', channelId: 'UCiWLfSweyRNmLpgEHekhoAg' },
  { name: 'TCT Network', channelId: 'UCQjstwROWgM16K9V7HNH0vA' },
  { name: 'OlympiaTV', channelId: 'UCYukge4AuskD8xPjfrSoiBg' },
  { name: "Nick's Strength & Power", channelId: 'UClfyDMfX-RhmExpVm-nCl4Q' },
  { name: 'Jay Cutler', channelId: 'UCiq2MIlqqeOcEvj9cP9f1bA' },
  { name: 'We Playin Spades', channelId: 'UCi572gE-hKq_gPz9_l4_P-A' },
  { name: "Wild 'N Out", channelId: 'UC8P0dc0Zn2gf8L6tJi_k6xg' },
  { name: 'Smile of a Child', channelId: 'UCmkgg5el8Fg3IX_baZyfSaQ' }
];

async function extractCaptions(videoId, title, speaker = 'Host') {
  try {
    const cmd = `yt-dlp --no-warnings --extractor-args "youtube:player_client=android" --dump-json --skip-download "https://www.youtube.com/watch?v=${videoId}"`;
    const raw = execSync(cmd, { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024, timeout: 15000 });
    const data = JSON.parse(raw);
    const subs = data.subtitles || {};
    const autoSubs = data.automatic_captions || {};

    const langKey = Object.keys(subs).find(k => k.startsWith('en'))
      || Object.keys(autoSubs).find(k => k.startsWith('en'))
      || Object.keys(subs)[0]
      || Object.keys(autoSubs)[0];

    if (!langKey) return null;

    const formats = (subs[langKey] || autoSubs[langKey] || []);
    const json3Format = formats.find(f => f.ext === 'json3') || formats[0];
    if (!json3Format?.url) return null;

    const capRes = await fetch(json3Format.url, {
      headers: { 'User-Agent': 'com.google.android.youtube/19.29.37 (Linux; U; Android 11) gzip' }
    });
    if (!capRes.ok) return null;

    const json = await capRes.json();
    const segments = [];
    for (const ev of json.events || []) {
      if (ev.segs && ev.tStartMs !== undefined) {
        let text = ev.segs.map(s => s.utf8).join('').trim();
        text = text.replace(/^[*\s♪#]+|[*\s♪#]+$/g, '').trim();
        if (text && text.length > 1) {
          const totalSec = Math.floor(ev.tStartMs / 1000);
          const m = Math.floor(totalSec / 60);
          const s = Math.floor(totalSec % 60);
          segments.push({
            time: `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`,
            seconds: totalSec,
            speaker: speaker,
            text: text,
            isRecorded: true
          });
        }
      }
    }
    return segments.length > 0 ? segments : null;
  } catch (err) {
    console.warn(`  [${videoId}] Caption extraction notice:`, err.message?.slice(0, 100));
    return null;
  }
}

async function run() {
  console.log('🚀 Fetching active feed videos from YouTube RSS feeds...\n');

  const { data: cached } = await supabase.from('video_transcripts').select('video_id');
  const cachedSet = new Set((cached || []).map(c => c.video_id));
  console.log(`📦 Currently cached videos in Supabase: ${cachedSet.size}\n`);

  for (const ch of CHANNELS) {
    try {
      console.log(`📡 Fetching channel: ${ch.name} (${ch.channelId})...`);
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${ch.channelId}`);
      if (!res.ok) {
        console.warn(`  Failed to fetch RSS for ${ch.name}`);
        continue;
      }
      const xml = await res.text();
      const entries = xml.split('<entry>');
      const videos = [];
      for (let i = 1; i < entries.length; i++) {
        const e = entries[i];
        const id = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
        const title = e.match(/<title>([^<]+)<\/title>/)?.[1];
        if (id && title) videos.push({ id, title });
      }

      console.log(`  Found ${videos.length} videos.`);

      for (const v of videos.slice(0, 4)) { // Process top 4 most recent videos per feed
        if (cachedSet.has(v.id)) {
          console.log(`  ✓ [${v.id}] "${v.title.slice(0, 40)}..." already cached.`);
          continue;
        }

        console.log(`  ⏳ Extracting real captions for: [${v.id}] "${v.title.slice(0, 45)}..."`);
        const segments = await extractCaptions(v.id, v.title, ch.name);

        if (segments && segments.length > 0) {
          await supabase.from('video_transcripts').upsert({
            video_id: v.id,
            transcript: segments,
            created_at: new Date().toISOString()
          }, { onConflict: 'video_id' });
          cachedSet.add(v.id);
          console.log(`    ✅ Saved ${segments.length} real dialogue segments to Supabase!`);
        } else {
          console.log(`    ⚠️ No auto-captions available from YouTube for [${v.id}].`);
        }
      }
    } catch (err) {
      console.error(`Error processing channel ${ch.name}:`, err.message);
    }
  }

  const { count } = await supabase.from('video_transcripts').select('*', { count: 'exact', head: true });
  console.log(`\n🎉 Complete! Total cached transcripts in Supabase: ${count}`);
}

run().catch(console.error);
