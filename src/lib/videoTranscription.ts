import { supabase, supabaseUrl } from '../supabaseClient';
import { encode16kMonoWav, type YouTubeCaptionSegment } from './wwtc';
import { getLocalTranscript } from './staticTranscripts';

/**
 * Video transcription pipeline
 * ----------------------------
 * 1. At upload time the browser decodes the video's audio (resampled to 16 kHz),
 *    slices it into 30s WAV chunks, and sends each chunk to the
 *    `transcribe-video` Supabase Edge Function.
 * 2. The Edge Function calls WWTC Speech-to-Text with the server-side key and
 *    merges each segment into `video_transcripts` using the service role.
 * 3. Players only READ transcripts (see `fetchTranscriptForVideo`).
 *
 * Transcripts are keyed by storage path: "videos/<user_id>/<file>".
 */

const CHUNK_SECONDS = 30;
// Decoding happens fully in memory; beyond this size the tab may run out of memory.
const MAX_DECODE_BYTES = 1024 * 1024 * 1024; // 1 GB

export interface TranscribeVideoOptions {
  /** Storage path inside the `videos` bucket, e.g. "<uid>/post_video_123.mp4" (or a public URL). */
  storagePath: string;
  speaker?: string;
  sourceLang?: string;
  targetLang?: string;
  onProgress?: (message: string, percent: number) => void;
}

/**
 * Normalize a public storage URL, a "videos/..." key, or a bare "<uid>/<file>" path
 * into the canonical transcript key "videos/<uid>/<file>". Returns null for
 * non-storage URLs (YouTube, external links, etc.).
 */
export function transcriptKeyFor(urlOrPath: string): string | null {
  if (!urlOrPath) return null;
  const trimmed = urlOrPath.trim().split('?')[0].split('#')[0];

  const publicPrefix = '/storage/v1/object/public/';
  const idx = trimmed.indexOf(publicPrefix);
  if (idx >= 0) {
    if (!trimmed.startsWith(supabaseUrl) && !/\.supabase\.co\//.test(trimmed)) return null;
    const rest = decodeURIComponent(trimmed.slice(idx + publicPrefix.length)); // "<bucket>/<uid>/<file>"
    return rest.startsWith('videos/') ? rest : null;
  }

  if (/^https?:\/\//i.test(trimmed)) return null;
  const clean = trimmed.replace(/^\/+/, '');
  if (clean.startsWith('videos/')) return clean;
  if (/^[^/]+\/[^/]+$/.test(clean)) return `videos/${clean}`;
  return null;
}

function formatSecs(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Decode a video/audio file's soundtrack, resampled to 16 kHz to keep memory low. */
async function decodeAudio16k(file: File | Blob): Promise<AudioBuffer> {
  const OfflineCtx = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
  if (!OfflineCtx) throw new Error('Web Audio API is not supported in this browser.');
  // decodeAudioData resamples to the context's sample rate
  const ctx = new OfflineCtx(1, 1, 16000);
  const arrayBuffer = await file.arrayBuffer();
  return await ctx.decodeAudioData(arrayBuffer);
}

function sliceAudioBuffer(audioBuffer: AudioBuffer, startSec: number, endSec: number): AudioBuffer {
  const { sampleRate, numberOfChannels } = audioBuffer;
  const startSample = Math.max(0, Math.floor(startSec * sampleRate));
  const endSample = Math.min(audioBuffer.length, Math.floor(endSec * sampleRate));
  const sub = new AudioBuffer({
    numberOfChannels,
    length: Math.max(1, endSample - startSample),
    sampleRate,
  });
  for (let c = 0; c < numberOfChannels; c++) {
    sub.getChannelData(c).set(audioBuffer.getChannelData(c).subarray(startSample, endSample));
  }
  return sub;
}

/**
 * Transcribe an uploaded video. Runs in the uploader's browser tab; each chunk is
 * persisted server-side as it completes, so partial progress survives a closed tab.
 * Returns the segments recognized in this run.
 */
export async function transcribeUploadedVideo(
  file: File,
  options: TranscribeVideoOptions
): Promise<YouTubeCaptionSegment[]> {
  const {
    storagePath,
    speaker = 'Channel Speaker',
    sourceLang = 'english-united-states',
    targetLang = 'spanish-international',
    onProgress,
  } = options;

  const videoKey = transcriptKeyFor(storagePath);
  if (!videoKey) throw new Error(`Not a storage video path: ${storagePath}`);
  if (!supabase) throw new Error('Supabase client unavailable');

  if (file.size > MAX_DECODE_BYTES) {
    onProgress?.('Video is too large to transcribe in the browser — skipping transcript.', 100);
    return [];
  }

  onProgress?.('Extracting audio for transcription...', 5);
  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await decodeAudio16k(file);
  } catch (err: any) {
    console.warn('[VideoTranscription] Audio decode failed:', err?.message);
    onProgress?.('This video format could not be decoded for transcription.', 100);
    return [];
  }

  const duration = audioBuffer.duration;
  if (!duration || duration < 0.5) return [];

  const totalChunks = Math.ceil(duration / CHUNK_SECONDS);
  const segments: YouTubeCaptionSegment[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const startSec = i * CHUNK_SECONDS;
    const endSec = Math.min(duration, startSec + CHUNK_SECONDS);
    const percent = Math.round(10 + (i / totalChunks) * 85);
    onProgress?.(`Transcribing ${formatSecs(startSec)} / ${formatSecs(duration)}...`, percent);

    const wav = encode16kMonoWav(sliceAudioBuffer(audioBuffer, startSec, endSec));
    const form = new FormData();
    form.append('videoKey', videoKey);
    form.append('startSec', String(startSec));
    form.append('speaker', speaker);
    form.append('sourceLang', sourceLang);
    form.append('targetLang', targetLang);
    form.append('reset', i === 0 ? 'true' : 'false');
    form.append('audio', wav, `chunk_${i}.wav`);

    // WWTC occasionally drops connections, so retry each chunk with backoff
    let data: any = null;
    let lastError: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await supabase.functions.invoke('transcribe-video', { body: form });
      if (!res.error) { data = res.data; lastError = null; break; }
      lastError = res.error;
      await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
    if (lastError) {
      console.warn(`[VideoTranscription] Chunk ${i + 1}/${totalChunks} failed:`, lastError.message);
      continue;
    }
    if (data?.segment) segments.push(data.segment as YouTubeCaptionSegment);
  }

  onProgress?.(
    segments.length > 0
      ? `Transcription complete (${segments.length} segment${segments.length === 1 ? '' : 's'}).`
      : 'No speech detected.',
    100
  );
  return segments;
}

/**
 * Read-only transcript lookup for players.
 * Order: bundled static transcripts → canonical storage key → legacy keys (raw URL / post ID).
 */
export async function fetchTranscriptForVideo(
  videoUrl: string,
  postId?: string | number
): Promise<YouTubeCaptionSegment[] | null> {
  if (!videoUrl && !postId) return null;

  const local = getLocalTranscript(videoUrl) || (postId ? getLocalTranscript(String(postId)) : null);
  if (local && local.length > 0) return local;

  if (!supabase) return null;

  const key = transcriptKeyFor(videoUrl);
  // Legacy rows were saved under the raw URL or post ID
  const candidates = [key, videoUrl?.trim(), postId != null ? String(postId) : null].filter(
    (v): v is string => Boolean(v)
  );
  if (candidates.length === 0) return null;

  try {
    const { data } = await supabase
      .from('video_transcripts')
      .select('video_id, transcript')
      .in('video_id', candidates);

    if (!data || data.length === 0) return null;
    // Prefer the canonical key, then the order of candidates
    const row = candidates.map(c => data.find(d => d.video_id === c)).find(Boolean);
    const transcript = row?.transcript;
    if (Array.isArray(transcript) && transcript.length > 0 && !transcript.some((s: any) => s.isPlaceholder || s.isRecorded === false)) {
      return transcript as YouTubeCaptionSegment[];
    }
  } catch (err) {
    console.warn('[VideoTranscription] Fetch transcript failed:', err);
  }
  return null;
}
