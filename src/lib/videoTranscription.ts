import { supabase } from '../supabaseClient';
import { encode16kMonoWav, transcribeAudioBlob, type YouTubeCaptionSegment } from './wwtc';
import { getLocalTranscript } from './staticTranscripts';

function formatSecs(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

export interface TranscribeVideoOptions {
  videoUrl?: string;
  postId?: string;
  videoTitle?: string;
  channelName?: string;
  onProgress?: (progressMessage: string) => void;
}

/**
 * Transcribe video audio via backend speech recognition service (FFmpeg + Google Speech Recognition)
 */
export async function transcribeVideoViaBackend(
  videoUrl: string,
  postId?: string,
  speaker: string = 'Channel Speaker'
): Promise<YouTubeCaptionSegment[]> {
  try {
    const res = await fetch('/api/transcribe-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoUrl, postId, speaker })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.segments) && data.segments.length > 0) {
        // Save to Supabase using current authenticated user session
        if (postId) {
          saveVideoTranscript(postId, data.segments).catch(() => {});
        }
        saveVideoTranscript(videoUrl, data.segments).catch(() => {});
        return data.segments;
      }
    }
  } catch (err: any) {
    console.warn('[VideoTranscription] Backend speech recognition note:', err.message);
  }
  return [];
}

/**
 * Extract audio track from an uploaded video file (MP4, WebM, MOV, etc.) and decode to an AudioBuffer
 */
export async function extractAudioBufferFromFile(file: File | Blob): Promise<AudioBuffer> {
  const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtxClass) {
    throw new Error('Web Audio API is not supported in this browser environment.');
  }
  const audioCtx = new AudioCtxClass();
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } finally {
    if (audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
  }
}

/**
 * Slice a portion of an AudioBuffer (from startSec to endSec)
 */
function sliceAudioBuffer(
  audioBuffer: AudioBuffer,
  startSec: number,
  endSec: number
): AudioBuffer {
  const sampleRate = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const startSample = Math.max(0, Math.floor(startSec * sampleRate));
  const endSample = Math.min(audioBuffer.length, Math.floor(endSec * sampleRate));
  const frameCount = Math.max(1, endSample - startSample);

  const subBuffer = new AudioBuffer({
    numberOfChannels: numChannels,
    length: frameCount,
    sampleRate: sampleRate,
  });

  for (let c = 0; c < numChannels; c++) {
    const sourceData = audioBuffer.getChannelData(c);
    const targetData = subBuffer.getChannelData(c);
    targetData.set(sourceData.subarray(startSample, endSample));
  }

  return subBuffer;
}

/**
 * Transcribes any video uploaded to a channel or feed:
 * 1. Checks backend AI speech recognition first for fast server-side extraction.
 * 2. Falls back to browser Web Audio decoding if supported.
 * 3. Saves real spoken dialogue directly into Supabase video_transcripts table.
 * 4. NEVER substitutes the title as spoken speech.
 */
export async function transcribeUploadedVideo(
  file: File,
  options: TranscribeVideoOptions = {}
): Promise<YouTubeCaptionSegment[]> {
  const { videoUrl, postId, videoTitle: _videoTitle, channelName = 'Channel Speaker', onProgress } = options;

  onProgress?.('Extracting and transcribing dialogue for translation software...');

  // 1. If videoUrl is available, use fast backend speech recognition
  if (videoUrl) {
    const backendSegments = await transcribeVideoViaBackend(videoUrl, postId, channelName);
    if (backendSegments && backendSegments.length > 0) {
      onProgress?.(`✅ Transcribed ${backendSegments.length} dialogue segments for translation software!`);
      return backendSegments;
    }
  }

  // 2. Client-side audio extraction fallback via Web Audio
  let audioBuffer: AudioBuffer | null = null;
  try {
    audioBuffer = await extractAudioBufferFromFile(file);
  } catch (err: any) {
    console.warn('[VideoTranscription] Browser audio decode notice:', err.message);
  }

  const segments: YouTubeCaptionSegment[] = [];

  if (audioBuffer && audioBuffer.duration > 0.5) {
    const duration = audioBuffer.duration;
    const chunkSize = 30;
    const totalChunks = Math.max(1, Math.ceil(duration / chunkSize));

    for (let i = 0; i < totalChunks; i++) {
      const startSec = i * chunkSize;
      const endSec = Math.min(duration, (i + 1) * chunkSize);
      const timeStr = formatSecs(startSec);

      try {
        const chunkBuffer = sliceAudioBuffer(audioBuffer, startSec, endSec);
        const wavBlob = encode16kMonoWav(chunkBuffer);

        const res = await transcribeAudioBlob({
          audioBlob: wavBlob,
          sourceLang: 'english-united-states',
          targetLang: 'spanish-international',
        });

        const recognizedText = (res.source_text || '').trim();
        if (recognizedText && !recognizedText.toLowerCase().includes('error')) {
          segments.push({
            time: timeStr,
            seconds: Math.round(startSec),
            speaker: channelName,
            text: recognizedText,
            translatedText: res.translated_text || undefined,
            isRecorded: true,
          });
        }
      } catch (chunkErr: any) {
        console.warn(`[VideoTranscription] Chunk ${i + 1} notice:`, chunkErr.message);
      }
    }
  }

  // 3. Save genuine spoken dialogue into Supabase (NEVER store the video title as spoken dialogue)
  if (segments.length > 0) {
    if (videoUrl) await saveVideoTranscript(videoUrl, segments);
    if (postId) await saveVideoTranscript(postId, segments);
    onProgress?.(`Transcription complete! (${segments.length} segment${segments.length > 1 ? 's' : ''} ready for translation)`);
  }

  return segments;
}

/**
 * Save transcript directly to Supabase video_transcripts table so translation software can find it
 */
export async function saveVideoTranscript(
  videoIdOrUrl: string,
  transcript: YouTubeCaptionSegment[]
): Promise<boolean> {
  if (!videoIdOrUrl || !transcript || transcript.length === 0 || !supabase) {
    return false;
  }

  // Filter out any bogus placeholder entries that contain file names
  const validSegments = transcript.filter(s => 
    s.text && 
    !s.isPlaceholder && 
    !s.text.includes('_001_') && 
    !s.text.includes('.mp4') &&
    !s.text.includes('Did-Lush-')
  );

  if (validSegments.length === 0) return false;

  try {
    const { error } = await supabase
      .from('video_transcripts')
      .upsert(
        {
          video_id: videoIdOrUrl.trim(),
          transcript: validSegments,
          created_at: new Date().toISOString()
        },
        { onConflict: 'video_id' }
      );

    if (error) {
      console.warn('[VideoTranscription] Supabase upsert notice:', error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.warn('[VideoTranscription] Failed to save transcript to Supabase:', err.message);
    return false;
  }
}

/**
 * Fetch video transcript by ID or URL from Supabase, filtering out obsolete dummy placeholders
 */
export async function fetchTranscriptForVideo(
  videoIdOrUrl: string
): Promise<YouTubeCaptionSegment[] | null> {
  if (!videoIdOrUrl) return null;

  // 1. Check local static transcripts first (guarantees authentic dialogue without network delays)
  const local = getLocalTranscript(videoIdOrUrl);
  if (local && local.length > 0) {
    return local;
  }

  if (!supabase) return null;

  try {
    const { data } = await supabase
      .from('video_transcripts')
      .select('transcript')
      .eq('video_id', videoIdOrUrl.trim())
      .maybeSingle();

    if (data && Array.isArray(data.transcript) && data.transcript.length > 0) {
      // Validate that this is authentic dialogue and not a placeholder containing the video title
      const isPlaceholder = data.transcript.some((s: any) =>
        s.isPlaceholder ||
        s.isRecorded === false ||
        s.text?.includes('_001_') ||
        s.text?.includes('.mp4') ||
        s.text?.includes('Did-Lush-') ||
        s.text?.includes('Did-Lush-Purposely-Dodge-Wack')
      );

      if (!isPlaceholder) {
        return data.transcript;
      }
    }
  } catch (err) {
    console.warn('[VideoTranscription] Fetch transcript notice:', err);
  }

  // 2. Final fallback to local transcript lookup
  return getLocalTranscript(videoIdOrUrl);
}

