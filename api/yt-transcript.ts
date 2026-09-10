import { createClient } from '@supabase/supabase-js';

const sbUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';
const supabase = createClient(sbUrl, sbKey);

export default async function handler(req: any, res: any) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const rawId = req.query.videoId || req.query.url || '';
    const match = String(rawId).match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    const videoId = (match && match[1]?.length === 11) ? match[1] : (String(rawId).length === 11 ? String(rawId) : '');

    if (!videoId) {
      return res.status(400).json({ success: false, error: 'Valid YouTube videoId is required.' });
    }

    // 1. Check Supabase cache (instant, 0ms latency)
    try {
      const { data: cached } = await supabase
        .from('video_transcripts')
        .select('transcript')
        .eq('video_id', videoId)
        .maybeSingle();

      if (cached && Array.isArray(cached.transcript) && cached.transcript.length > 0) {
        return res.status(200).json({
          success: true,
          videoId,
          segments: cached.transcript,
          source: 'supabase_cache'
        });
      }
    } catch (cacheErr) {
      console.warn('[yt-transcript API] Cache query error:', cacheErr);
    }

    // 2. Try Invidious / Piped proxy mirrors for fast fallback extraction
    const mirrorEndpoints = [
      `https://pipedapi.kavin.rocks/captions/${videoId}`,
      `https://vid.puffyan.us/api/v1/captions/${videoId}`,
      `https://invidious.jing.rocks/api/v1/captions/${videoId}`
    ];

    for (const endpoint of mirrorEndpoints) {
      try {
        const mirrorRes = await fetch(endpoint, { signal: AbortSignal.timeout(4000) });
        if (mirrorRes.ok) {
          const json = await mirrorRes.json();
          const subs = json.subtitles || json.captions || [];
          if (Array.isArray(subs) && subs.length > 0) {
            const enSub = subs.find((s: any) => s.lang?.startsWith('en') || s.languageCode?.startsWith('en')) || subs[0];
            if (enSub && enSub.url) {
              const subRes = await fetch(enSub.url, { signal: AbortSignal.timeout(4000) });
              if (subRes.ok) {
                const subJson = await subRes.json();
                if (subJson.events && Array.isArray(subJson.events)) {
                  const segments: any[] = [];
                  for (const ev of subJson.events) {
                    if (ev.segs && ev.tStartMs !== undefined) {
                      let text = ev.segs.map((s: any) => s.utf8).join('').trim();
                      text = text.replace(/^[*\s♪#]+|[*\s♪#]+$/g, '').trim();
                      if (text && text.length > 1) {
                        const totalSec = Math.floor(ev.tStartMs / 1000);
                        const m = Math.floor(totalSec / 60);
                        const s = Math.floor(totalSec % 60);
                        segments.push({
                          time: `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`,
                          seconds: totalSec,
                          speaker: 'YouTube Audio',
                          text: text,
                          isRecorded: true
                        });
                      }
                    }
                  }

                  if (segments.length > 0) {
                    // Cache in Supabase
                    supabase.from('video_transcripts').upsert({
                      video_id: videoId,
                      transcript: segments,
                      created_at: new Date().toISOString()
                    }, { onConflict: 'video_id' }).catch(() => {});

                    return res.status(200).json({
                      success: true,
                      videoId,
                      segments,
                      source: 'mirror'
                    });
                  }
                }
              }
            }
          }
        }
      } catch (_) {}
    }

    return res.status(404).json({
      success: false,
      videoId,
      error: 'No captions found for this video.'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Server error'
    });
  }
}
