import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const WWTC_API_KEY = process.env.WWTC_API_KEY || process.env.VITE_WWTC_API_KEY || '95a35451.30ece979-c4bd-447b-8b1e-fd9a6c77418b';
const CHUNK_DURATION = 15; // 15-second chunks for fast STT (< 3s per chunk) and no gateway timeouts

const sbUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';
const supabase = createClient(sbUrl, sbKey);

function getFfmpegPath(): string {
  const commonPaths = [
    '/opt/homebrew/bin/ffmpeg',
    '/usr/local/bin/ffmpeg',
    '/usr/bin/ffmpeg',
    'ffmpeg'
  ];
  for (const p of commonPaths) {
    try {
      execSync(`"${p}" -version`, { stdio: 'ignore' });
      return p;
    } catch (_) {}
  }
  return 'ffmpeg';
}

function formatSecs(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function sendJson(res: any, data: any, status = 200) {
  res.statusCode = status;
  if (typeof res.json === 'function') {
    return res.json(data);
  }
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(data));
}

async function saveTranscriptRows(keys: string[], segments: any[]) {
  const jsonStr = JSON.stringify(segments).replace(/\x27/g, "''");
  for (const k of keys) {
    if (!k || typeof k !== 'string') continue;
    const cleanKey = k.replace(/\x27/g, "''");
    const sql = `
      INSERT INTO public.video_transcripts (video_id, transcript, created_at)
      VALUES ('${cleanKey}', '${jsonStr}'::jsonb, NOW())
      ON CONFLICT (video_id)
      DO UPDATE SET transcript = EXCLUDED.transcript, created_at = NOW();
    `;
    try {
      await supabase.rpc('execute_sql', { sql });
    } catch (err: any) {
      console.warn(`[api/transcribe-video] execute_sql error for key ${k}:`, err.message);
    }
  }
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, { error: 'Method not allowed' }, 405);
  }

  let body = req.body;
  if (!body) {
    try {
      const chunks: any[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      body = JSON.parse(raw || '{}');
    } catch (_) {
      body = {};
    }
  } else if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch (_) {
      body = {};
    }
  }

  const {
    videoUrl,
    storagePath,
    speaker = 'Channel Speaker',
    sourceLang = 'english-united-states',
    targetLang = 'spanish-international',
    postId
  } = body || {};

  const targetUrl = videoUrl || (storagePath ? `${sbUrl}/storage/v1/object/public/videos/${storagePath.replace(/^videos\//, '')}` : '');

  if (!targetUrl) {
    return sendJson(res, { error: 'Missing videoUrl or storagePath' }, 400);
  }

  const ffmpeg = getFfmpegPath();
  const tempDir = path.join(os.tmpdir(), `vibe_transcribe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const fullWav = path.join(tempDir, 'full_16k.wav');
  const chunkPattern = path.join(tempDir, 'chunk_%03d.wav');

  try {
    console.log(`[api/transcribe-video] Extracting audio with ffmpeg (${ffmpeg}) from: ${targetUrl}`);
    execSync(`"${ffmpeg}" -y -i "${targetUrl}" -ar 16000 -ac 1 -c:a pcm_s16le "${fullWav}"`, {
      stdio: 'pipe',
      timeout: 120000
    });

    if (!fs.existsSync(fullWav) || fs.statSync(fullWav).size === 0) {
      throw new Error('Audio extraction yielded empty file or failed');
    }

    // Segment into 15-second chunks
    execSync(`"${ffmpeg}" -y -i "${fullWav}" -f segment -segment_time ${CHUNK_DURATION} -c copy "${chunkPattern}"`, {
      stdio: 'pipe',
      timeout: 60000
    });

    const chunkFiles = fs.readdirSync(tempDir)
      .filter(f => f.startsWith('chunk_') && f.endsWith('.wav'))
      .sort();

    console.log(`[api/transcribe-video] Extracted ${chunkFiles.length} chunks to transcribe via WWTC...`);

    const wwtcSttUrl = `https://api.worldwidetechconnections.com/services/stt/${encodeURIComponent(sourceLang)}/${encodeURIComponent(targetLang)}`;
    const segments: any[] = [];

    for (let i = 0; i < chunkFiles.length; i++) {
      const chunkFile = path.join(tempDir, chunkFiles[i]);
      const startSec = i * CHUNK_DURATION;
      const timeStr = formatSecs(startSec);
      const audioBuffer = fs.readFileSync(chunkFile);

      try {
        const wwtcRes = await fetch(wwtcSttUrl, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-authorization': WWTC_API_KEY,
            'Content-Type': 'audio/wav'
          },
          body: audioBuffer
        });

        if (wwtcRes.ok) {
          const stt = await wwtcRes.json();
          if (stt?.source_text && stt.source_text.trim()) {
            segments.push({
              time: timeStr,
              seconds: startSec,
              speaker,
              text: stt.source_text.trim(),
              translatedText: stt.translated_text || undefined,
              isRecorded: true
            });
          }
        }
      } catch (chunkErr: any) {
        console.warn(`[api/transcribe-video] Chunk ${i} WWTC error:`, chunkErr.message);
      }
    }

    // Collect all database lookup keys
    const keysToSave = new Set<string>();
    if (targetUrl) keysToSave.add(targetUrl);
    if (storagePath) {
      keysToSave.add(storagePath);
      keysToSave.add(storagePath.startsWith('videos/') ? storagePath : `videos/${storagePath}`);
      keysToSave.add(storagePath.replace(/^videos\//, ''));
    }
    if (postId) keysToSave.add(String(postId));

    const finalKeys = Array.from(keysToSave);

    if (segments.length > 0) {
      await saveTranscriptRows(finalKeys, segments);
      console.log(`[api/transcribe-video] Saved ${segments.length} segments to keys:`, finalKeys);
    }

    return sendJson(res, {
      success: true,
      segments,
      segmentCount: segments.length,
      keys: finalKeys
    }, 200);
  } catch (err: any) {
    console.error('[api/transcribe-video] Error:', err);
    return sendJson(res, {
      success: false,
      error: err.message || 'Failed to extract audio or transcribe video'
    }, 500);
  } finally {
    try {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (_) {}
  }
}
