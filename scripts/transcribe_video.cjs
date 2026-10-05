const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read Supabase credentials
const envPath = path.join(__dirname, '..', '.env');
let supabaseUrl = 'https://fimzetmvrmbmdggvqzpr.supabase.co';
let supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    if (line.trim().startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].replace(/"/g, '').trim();
    }
    if (line.trim().startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].replace(/"/g, '').trim();
    }
  }
}

const supabase = createClient(supabaseUrl, supabaseKey);
const WWTC_API_KEY = '95a35451.30ece979-c4bd-447b-8b1e-fd9a6c77418b';
const WWTC_STT_URL = 'https://api.worldwidetechconnections.com/services/stt/english-united-states/spanish-international';
const CHUNK_DURATION = 15; // 15-second chunks for fast STT and no timeout

function isDirectVideoUrl(url) {
  if (!url) return false;
  return /\.(mp4|mov|webm|m4v|mkv)(\?.*)?$/i.test(url) || url.includes('/storage/v1/object/public/videos/');
}

function getYouTubeId(input) {
  if (!input) return '';
  const match = input.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  if (match && match[2].length === 11) {
    return match[2];
  }
  if (input.length === 11 && !input.includes('/') && !input.includes('.')) return input;
  return '';
}

function formatSecs(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

async function saveTranscript(keys, segments) {
  const jsonStr = JSON.stringify(segments).replace(/\x27/g, "''");
  for (const k of keys) {
    if (!k) continue;
    const sql = `
      INSERT INTO public.video_transcripts (video_id, transcript, created_at)
      VALUES ('${k.replace(/\x27/g, "''")}', '${jsonStr}'::jsonb, NOW())
      ON CONFLICT (video_id)
      DO UPDATE SET transcript = EXCLUDED.transcript, created_at = NOW();
    `;
    const { error } = await supabase.rpc('execute_sql', { sql });
    if (error) {
      console.warn(`⚠️ execute_sql error for key ${k}:`, error.message);
    } else {
      console.log(`✅ Saved transcript to Supabase for key: ${k}`);
    }
  }
}

async function transcribeVideo(videoInput, customSpeaker = 'Channel Speaker') {
  const isDirect = isDirectVideoUrl(videoInput);
  const ytId = !isDirect ? getYouTubeId(videoInput) : '';

  if (!isDirect && !ytId && !videoInput.startsWith('http')) {
    console.error('❌ Please provide a valid YouTube URL, Supabase video storage URL (.mov, .mp4), or video file path.');
    process.exit(1);
  }

  const cleanId = ytId || videoInput.split('?')[0].split('/').pop().replace(/\.[^.]+$/, '');
  const tempDir = path.join(__dirname, '..', 'tmp', `transcribe_${Date.now()}_${cleanId}`);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const full16kWav = path.join(tempDir, 'full_16k.wav');
  const chunkPattern = path.join(tempDir, 'chunk_%03d.wav');

  console.log(`\n🎬 Processing Video: ${cleanId}`);
  console.log(`🔗 Input: ${videoInput}`);

  try {
    if (isDirect) {
      console.log('⏳ Step 1: Extracting audio and resampling to 16kHz mono via ffmpeg...');
      execSync(`ffmpeg -y -i "${videoInput}" -ar 16000 -ac 1 -c:a pcm_s16le "${full16kWav}"`, { stdio: 'inherit' });
    } else {
      const targetUrl = videoInput.startsWith('http') ? videoInput : `https://www.youtube.com/watch?v=${ytId}`;
      const rawWav = path.join(tempDir, 'raw.wav');
      console.log('⏳ Step 1: Downloading YouTube audio via yt-dlp...');
      execSync(`yt-dlp --extractor-args "youtube:player_client=android" -x --audio-format wav --audio-quality 0 --no-playlist -o "${rawWav}" "${targetUrl}"`, { stdio: 'inherit' });
      execSync(`ffmpeg -y -i "${rawWav}" -ar 16000 -ac 1 -c:a pcm_s16le "${full16kWav}"`, { stdio: 'pipe' });
    }

    console.log(`⏳ Step 2: Segmenting audio into ${CHUNK_DURATION}-second chunks for WWTC STT...`);
    execSync(`ffmpeg -y -i "${full16kWav}" -f segment -segment_time ${CHUNK_DURATION} -c copy "${chunkPattern}"`, { stdio: 'pipe' });

    const chunkFiles = fs.readdirSync(tempDir)
      .filter(f => f.startsWith('chunk_') && f.endsWith('.wav'))
      .sort();

    console.log(`🎙️ Total Audio Chunks to Transcribe: ${chunkFiles.length}`);
    const segments = [];

    for (let i = 0; i < chunkFiles.length; i++) {
      const chunkFile = path.join(tempDir, chunkFiles[i]);
      const startSec = i * CHUNK_DURATION;
      const timeStr = formatSecs(startSec);

      console.log(`⏳ Transcribing Chunk ${i + 1}/${chunkFiles.length} (${timeStr})...`);

      let succeeded = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const curlCmd = `curl -s --connect-timeout 35 --max-time 120 -X POST "${WWTC_STT_URL}" \
            -H "accept: application/json" \
            -H "api-authorization: ${WWTC_API_KEY}" \
            -H "Content-Type: audio/wav" \
            --data-binary "@${chunkFile}"`;

          const responseRaw = execSync(curlCmd, { encoding: 'utf8' });
          const sttResult = JSON.parse(responseRaw);

          if (sttResult.source_text && sttResult.source_text.trim()) {
            console.log(`   [${timeStr}] "${sttResult.source_text.trim().slice(0, 60)}..."`);
            segments.push({
              time: timeStr,
              seconds: startSec,
              speaker: customSpeaker,
              text: sttResult.source_text.trim(),
              translatedText: sttResult.translated_text || null,
              isRecorded: true,
            });
          }
          succeeded = true;
          break;
        } catch (chunkErr) {
          console.warn(`   ⚠️ Attempt ${attempt + 1} failed: ${chunkErr.message}`);
          execSync('sleep 2');
        }
      }
      if (!succeeded) {
        console.warn(`   ⚠️ Warning: Chunk ${i + 1} permanently failed.`);
      }
    }

    if (segments.length === 0) {
      console.warn('⚠️ No speech detected by WWTC STT across audio chunks.');
      return;
    }

    console.log(`\n✅ Transcribed ${segments.length} spoken audio segments!`);

    // Determine storage / lookup keys to save under
    const keysToSave = [];
    if (ytId) keysToSave.push(ytId);
    if (isDirect) {
      keysToSave.push(videoInput);
      const publicPrefix = '/storage/v1/object/public/';
      const idx = videoInput.indexOf(publicPrefix);
      if (idx >= 0) {
        const canonicalKey = decodeURIComponent(videoInput.slice(idx + publicPrefix.length));
        keysToSave.push(canonicalKey);
      }
    }

    await saveTranscript(keysToSave, segments);
    console.log('🎉 Transcribing and translating complete!');

  } catch (err) {
    console.error('❌ Error processing video:', err.message || err);
  } finally {
    try {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (_) {}
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: npm run transcribe <video_url_or_id> [speaker_name]');
  process.exit(0);
}

transcribeVideo(args[0], args[1] || 'Channel Host');
