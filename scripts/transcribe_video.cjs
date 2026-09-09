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

function getYouTubeId(input) {
  if (!input) return '';
  const match = input.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  if (match && match[2].length === 11) {
    return match[2];
  }
  if (input.length === 11) return input;
  return input;
}

function formatSecs(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

async function transcribeVideo(videoInput) {
  const videoId = getYouTubeId(videoInput);
  if (!videoId) {
    console.error('❌ Please provide a valid YouTube video URL or ID.');
    process.exit(1);
  }

  const targetUrl = videoInput.startsWith('http') 
    ? videoInput 
    : `https://www.youtube.com/watch?v=${videoId}`;

  console.log(`\n🎬 Processing Video: ${videoId}`);
  console.log(`🔗 Target URL: ${targetUrl}`);

  const tempDir = path.join(__dirname, '..', 'tmp', videoId);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const rawWav = path.join(tempDir, `raw.wav`);
  const full16kWav = path.join(tempDir, `full_16k.wav`);
  const chunkPattern = path.join(tempDir, `chunk_%03d.wav`);

  try {
    // Step 1: Download video audio via yt-dlp
    console.log('⏳ Step 1: Extracting video audio via yt-dlp...');
    execSync(`yt-dlp --extractor-args "youtube:player_client=android" -x --audio-format wav --audio-quality 0 --no-playlist -o "${rawWav}" "${targetUrl}"`, { stdio: 'inherit' });

    // Step 2: Resample audio to 16kHz Mono 16-bit PCM WAV via ffmpeg
    console.log('⏳ Step 2: Resampling audio to 16kHz Mono 16-bit PCM WAV via ffmpeg...');
    execSync(`ffmpeg -y -i "${rawWav}" -ar 16000 -ac 1 -c:a pcm_s16le "${full16kWav}"`, { stdio: 'pipe' });

    // Step 3: Segment audio into 60-second chunks for WWTC STT processing
    console.log('⏳ Step 3: Segmenting audio into 60-second chunks for WWTC Speech-To-Text...');
    execSync(`ffmpeg -y -i "${full16kWav}" -f segment -segment_time 60 -c copy "${chunkPattern}"`, { stdio: 'pipe' });

    const chunkFiles = fs.readdirSync(tempDir)
      .filter(f => f.startsWith('chunk_') && f.endsWith('.wav'))
      .sort();

    console.log(`🎙️ Total Audio Chunks to Transcribe: ${chunkFiles.length}`);

    const segments = [];

    for (let i = 0; i < chunkFiles.length; i++) {
      const chunkFile = path.join(tempDir, chunkFiles[i]);
      const startSec = i * 60;
      const timeStr = formatSecs(startSec);

      console.log(`⏳ Transcribing Chunk ${i + 1}/${chunkFiles.length} (${timeStr})...`);

      try {
        const curlCmd = `curl -s -X POST "${WWTC_STT_URL}" \
          -H "accept: application/json" \
          -H "api-authorization: ${WWTC_API_KEY}" \
          -F "audio=@${chunkFile};type=audio/wav"`;

        const responseRaw = execSync(curlCmd, { encoding: 'utf8' });
        const sttResult = JSON.parse(responseRaw);

        if (sttResult.source_text && sttResult.source_text.trim()) {
          console.log(`   [${timeStr}] "${sttResult.source_text.trim()}"`);
          segments.push({
            time: timeStr,
            seconds: startSec,
            speaker: 'Live Video Spoken Audio',
            text: sttResult.source_text.trim(),
            translatedText: sttResult.translated_text || null,
            isRecorded: true,
          });
        }
      } catch (chunkErr) {
        console.warn(`   ⚠️ Warning: Chunk ${i + 1} STT failed:`, chunkErr.message);
      }
    }

    if (segments.length === 0) {
      console.warn('⚠️ No speech detected by WWTC STT across audio chunks.');
      return;
    }

    console.log(`\n✅ Transcribed ${segments.length} spoken audio segments!`);

    // Step 4: Save spoken transcript segments to Supabase video_transcripts table
    console.log('⏳ Step 4: Saving transcript to Supabase video_transcripts table...');
    const { error } = await supabase
      .from('video_transcripts')
      .upsert(
        { video_id: videoId, transcript: segments, created_at: new Date().toISOString() },
        { onConflict: 'video_id' }
      );

    if (error) {
      console.error('❌ Supabase Save Error:', error.message);
    } else {
      console.log(`🎉 SUCCESS! Audio transcript saved for video_id: ${videoId}`);
    }

  } catch (err) {
    console.error('❌ Error transcribing video audio:', err.message || err);
  } finally {
    // Clean up temporary files
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (_) {}
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: npm run transcribe <video_url_or_id>');
  process.exit(0);
}

transcribeVideo(args[0]);
