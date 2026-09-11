import { createClient } from '@supabase/supabase-js';
import { getLocalTranscript } from '../src/lib/staticTranscripts';

const sbUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';
const supabase = createClient(sbUrl, sbKey);

function formatSecs(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

// Clean and group subtitle events into natural 5-10 second speech segments
function groupCaptionEvents(events: Array<{ text: string; startSec: number; durationSec?: number }>, speaker = 'Broadcast Audio') {
  const segments: Array<{ time: string; seconds: number; speaker: string; text: string; isRecorded: boolean }> = [];
  let cur = { startSec: 0, text: '' };

  for (const ev of events) {
    let textStr = (ev.text || '').replace(/^[*\s♪#\n]+|[*\s♪#\n]+$/g, '').trim();
    if (!textStr) continue;

    const evSec = Math.floor(ev.startSec);

    if (!cur.text) {
      cur.startSec = evSec;
      cur.text = textStr;
    } else if (evSec - cur.startSec < 10 && cur.text.length < 130 && !cur.text.endsWith('.') && !cur.text.endsWith('?')) {
      cur.text += ' ' + textStr;
    } else {
      segments.push({
        time: formatSecs(cur.startSec),
        seconds: cur.startSec,
        speaker,
        text: cur.text.trim(),
        isRecorded: true
      });
      cur = { startSec: evSec, text: textStr };
    }
  }

  if (cur.text) {
    segments.push({
      time: formatSecs(cur.startSec),
      seconds: cur.startSec,
      speaker,
      text: cur.text.trim(),
      isRecorded: true
    });
  }

  return segments;
}

// Parse YouTube XML timedtext format: <text start="0.5" dur="3.2">Hello</text>
function parseXmlCaptions(xml: string) {
  const events: Array<{ text: string; startSec: number }> = [];
  const regex = /<text\s+start="([\d.]+)"(?:\s+dur="[\d.]+")?[^>]*>([\s\S]*?)<\/text>/gi;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const startSec = parseFloat(match[1]);
    let text = match[2]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/<[^>]+>/g, '')
      .trim();
    if (text) {
      events.push({ text, startSec });
    }
  }
  return events;
}

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

    // 1. Check bundled high-quality static transcripts first (0ms latency)
    try {
      const local = getLocalTranscript(videoId);
      if (local && Array.isArray(local) && local.length > 0) {
        return res.status(200).json({
          success: true,
          videoId,
          segments: local,
          source: 'bundled_static'
        });
      }
    } catch (_) {}

    // 2. Check Supabase database cache (instant)
    try {
      const { data: cached } = await supabase
        .from('video_transcripts')
        .select('transcript')
        .eq('video_id', videoId)
        .maybeSingle();

      if (cached && Array.isArray(cached.transcript) && cached.transcript.length > 0) {
        // Verify this is not an outdated placeholder/description row
        const isDescriptionOrPlaceholder = cached.transcript.some((s: any) =>
          s.isPlaceholder ||
          s.isRecorded === false ||
          s.text?.includes('agenda and details:') ||
          s.text?.includes('Welcome into the live studio broadcast') ||
          s.text?.includes('Official Video Broadcast') ||
          s.text?.includes('Streaming now on Vibe Network.')
        );

        if (!isDescriptionOrPlaceholder) {
          return res.status(200).json({
            success: true,
            videoId,
            segments: cached.transcript,
            source: 'supabase_cache'
          });
        }
      }
    } catch (cacheErr) {
      console.warn('[yt-transcript API] Cache query error:', cacheErr);
    }

    // 3. Attempt direct YouTube player HTML caption extraction
    try {
      const ytPageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(5000)
      });

      if (ytPageRes.ok) {
        const html = await ytPageRes.text();
        const tracksMatch = html.match(/"captionTracks":\s*(\[.*?\])/);
        if (tracksMatch && tracksMatch[1]) {
          const tracks = JSON.parse(tracksMatch[1]);
          const enTrack = tracks.find((t: any) => t.languageCode?.startsWith('en')) || tracks[0];
          if (enTrack?.baseUrl) {
            const capRes = await fetch(enTrack.baseUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': `https://www.youtube.com/watch?v=${videoId}`
              },
              signal: AbortSignal.timeout(5000)
            });

            if (capRes.ok) {
              const xml = await capRes.text();
              const events = parseXmlCaptions(xml);
              if (events.length > 0) {
                const segments = groupCaptionEvents(events, 'Broadcast Audio');
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
                    source: 'youtube_timedtext'
                  });
                }
              }
            }
          }
        }
      }
    } catch (directErr) {
      console.warn('[yt-transcript API] Direct extraction notice:', (directErr as any)?.message);
    }

    // 4. Attempt Invidious / Piped proxy mirrors
    const mirrorEndpoints = [
      `https://inv.tux.pizza/api/v1/captions/${videoId}`,
      `https://invidious.nerdvpn.de/api/v1/captions/${videoId}`,
      `https://yt.artemislena.eu/api/v1/captions/${videoId}`,
      `https://invidious.private.coffee/api/v1/captions/${videoId}`,
      `https://iv.ggtyler.dev/api/v1/captions/${videoId}`,
      `https://pipedapi.kavin.rocks/captions/${videoId}`,
      `https://vid.puffyan.us/api/v1/captions/${videoId}`
    ];

    for (const endpoint of mirrorEndpoints) {
      try {
        const mirrorRes = await fetch(endpoint, { signal: AbortSignal.timeout(3500) });
        if (mirrorRes.ok) {
          const json = await mirrorRes.json();
          const subs = json.subtitles || json.captions || [];
          if (Array.isArray(subs) && subs.length > 0) {
            const enSub = subs.find((s: any) => s.lang?.startsWith('en') || s.languageCode?.startsWith('en')) || subs[0];
            if (enSub && enSub.url) {
              const subUrl = enSub.url.startsWith('http') ? enSub.url : new URL(enSub.url, endpoint).href;
              const subRes = await fetch(subUrl, { signal: AbortSignal.timeout(3500) });
              if (subRes.ok) {
                const subText = await subRes.text();
                let events: Array<{ text: string; startSec: number }> = [];

                if (subText.trim().startsWith('<')) {
                  events = parseXmlCaptions(subText);
                } else {
                  try {
                    const subJson = JSON.parse(subText);
                    for (const ev of subJson.events || []) {
                      if (ev.segs && ev.tStartMs !== undefined) {
                        const t = ev.segs.map((s: any) => s.utf8).join('').trim();
                        if (t) events.push({ text: t, startSec: ev.tStartMs / 1000 });
                      }
                    }
                  } catch (_) {}
                }

                if (events.length > 0) {
                  const segments = groupCaptionEvents(events, 'Broadcast Audio');
                  if (segments.length > 0) {
                    supabase.from('video_transcripts').upsert({
                      video_id: videoId,
                      transcript: segments,
                      created_at: new Date().toISOString()
                    }, { onConflict: 'video_id' }).catch(() => {});

                    return res.status(200).json({
                      success: true,
                      videoId,
                      segments,
                      source: 'invidious_mirror'
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
      error: 'No broadcast dialogue captions found for this video.'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Server error'
    });
  }
}
