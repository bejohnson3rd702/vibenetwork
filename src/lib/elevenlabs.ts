/**
 * ElevenLabs AI Voice Cloning & Multilingual Speech Synthesis Client
 * 
 * Provides:
 * 1. Zero-shot voice cloning from audio samples (5-30s of creator's voice)
 * 2. Multilingual speech synthesis (eleven_multilingual_v2) for Spanish, French, Mandarin, Portuguese, Hindi, etc.
 * 3. In-memory & localStorage voice ID caching per video/creator
 * 4. Automatic fallback to default multilingual voices if a custom sample is not yet captured
 */

const ELEVENLABS_PROXY_URL = '/api/elevenlabs-proxy';
const ELEVENLABS_KEY_STORAGE = 'vibe_elevenlabs_api_key';
const VOICE_CLONING_ENABLED_STORAGE = 'vibe_voice_cloning_enabled';
const VOICE_CACHE_PREFIX = 'vibe_voice_id_';

// Curated high-fidelity default multilingual voices for immediate playback
export const DEFAULT_MULTILINGUAL_VOICES = {
  male_dynamic: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Deep & Confident)' },
  female_natural: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Warm & Engaging)' },
  male_warm: { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Smooth & Natural)' },
  female_expressive: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Expressive & Clear)' }
} as const;

export interface VoiceCloneResult {
  voice_id: string;
  name: string;
  source: 'custom_clone' | 'preset_clone';
}

const DEFAULT_ELEVENLABS_KEY = 'sk_d4e661d70401864ba64053e82ec364d73e7609f7259efef9';

/**
 * Get the configured ElevenLabs API key (from localStorage override or env)
 */
export function getElevenLabsApiKey(): string {
  if (typeof window !== 'undefined') {
    const userOverride = localStorage.getItem(ELEVENLABS_KEY_STORAGE);
    if (userOverride && userOverride.trim()) return userOverride.trim();
  }
  return (
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ELEVENLABS_API_KEY) ||
    DEFAULT_ELEVENLABS_KEY
  );
}

/**
 * Set a custom ElevenLabs API key in localStorage
 */
export function setElevenLabsApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key || !key.trim()) {
    localStorage.removeItem(ELEVENLABS_KEY_STORAGE);
  } else {
    localStorage.setItem(ELEVENLABS_KEY_STORAGE, key.trim());
  }
}

/**
 * Check whether voice cloning is enabled by user preference
 */
export function isVoiceCloningEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(VOICE_CLONING_ENABLED_STORAGE);
  // Default to true if an API key exists
  if (val === null) return Boolean(getElevenLabsApiKey());
  return val === 'true';
}

/**
 * Toggle voice cloning enabled preference
 */
export function setVoiceCloningEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VOICE_CLONING_ENABLED_STORAGE, enabled ? 'true' : 'false');
}

/**
 * Get cached voice ID for a video or creator
 */
export function getCachedVoiceId(identifier: string): string | null {
  if (typeof window === 'undefined' || !identifier) return null;
  return localStorage.getItem(VOICE_CACHE_PREFIX + identifier) || null;
}

const DEFAULT_CLONED_VOICE_STORAGE = 'vibe_default_cloned_voice_id';

/**
 * Returns a valid audio data URI by detecting whether base64 contains MP3 or WAV
 */
export function getAudioDataUri(base64: string): string {
  if (!base64) return '';
  const clean = base64.trim();
  if (clean.startsWith('data:audio/')) return clean;
  // MP3 signature: ID3 header ('SUQz' in base64) or sync word 0xFFFB/0xFFF3 ('//' or '/+')
  if (clean.startsWith('SUQz') || clean.startsWith('//') || clean.startsWith('/+')) {
    return `data:audio/mp3;base64,${clean}`;
  }
  // Default to WAV (WWTC format)
  return `data:audio/wav;base64,${clean}`;
}

/**
 * Get user-selected default cloned voice ID
 */
export function getDefaultVoiceId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(DEFAULT_CLONED_VOICE_STORAGE);
}

/**
 * Set user-selected default cloned voice ID
 */
export function setDefaultVoiceId(voiceId: string): void {
  if (typeof window === 'undefined') return;
  if (!voiceId) {
    localStorage.removeItem(DEFAULT_CLONED_VOICE_STORAGE);
  } else {
    localStorage.setItem(DEFAULT_CLONED_VOICE_STORAGE, voiceId);
  }
}

/**
 * Cache a voice ID for a video or creator
 */
export function setCachedVoiceId(identifier: string, voiceId: string): void {
  if (typeof window === 'undefined' || !identifier || !voiceId) return;
  try {
    localStorage.setItem(VOICE_CACHE_PREFIX + identifier, voiceId);
  } catch (_) {}
}

/**
 * Check ElevenLabs proxy & key health status
 */
export async function checkElevenLabsStatus(): Promise<{
  enabled: boolean;
  hasKey: boolean;
  voicesCount?: number;
  error?: string;
}> {
  const localKey = getElevenLabsApiKey();
  try {
    const res = await fetch(`${ELEVENLABS_PROXY_URL}?action=status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey: localKey || undefined }),
    });

    if (!res.ok) {
      return { enabled: false, hasKey: Boolean(localKey), error: `Status check error ${res.status}` };
    }

    const data = await res.json();
    return {
      enabled: Boolean(data.hasKey && isVoiceCloningEnabled()),
      hasKey: Boolean(data.hasKey),
      voicesCount: data.voicesCount,
    };
  } catch (err: any) {
    return { enabled: false, hasKey: Boolean(localKey), error: err.message };
  }
}

/**
 * Clone a voice from an audio sample buffer or base64
 */
export async function cloneVoiceFromAudio(params: {
  name: string;
  audioBase64?: string;
  audioBlob?: Blob;
  description?: string;
  creatorId?: string;
}): Promise<VoiceCloneResult> {
  const { name, audioBase64, audioBlob, description, creatorId } = params;

  let base64Data = audioBase64;
  if (!base64Data && audioBlob) {
    base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        resolve(res.split(',')[1] || res);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  }

  const localKey = getElevenLabsApiKey();

  // If no audio was provided, fallback to default high-fidelity multilingual archetype
  if (!base64Data) {
    const fallbackId = DEFAULT_MULTILINGUAL_VOICES.male_dynamic.id;
    if (creatorId) setCachedVoiceId(creatorId, fallbackId);
    return { voice_id: fallbackId, name: DEFAULT_MULTILINGUAL_VOICES.male_dynamic.name, source: 'preset_clone' };
  }

  try {
    const response = await fetch(`${ELEVENLABS_PROXY_URL}?action=clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: localKey || undefined,
        name: name || `Vibe Creator - ${Date.now()}`,
        audioBase64: base64Data,
        description: description || 'Voice extracted from Vibe Network broadcast',
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Voice cloning failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.voice_id) {
      if (creatorId) setCachedVoiceId(creatorId, data.voice_id);
      return { voice_id: data.voice_id, name, source: 'custom_clone' };
    }
  } catch (err: any) {
    console.warn('[ElevenLabs] Voice clone failed, falling back to preset multilingual clone:', err.message);
  }

  // Graceful fallback to natural voice preset
  const fallback = DEFAULT_MULTILINGUAL_VOICES.male_dynamic.id;
  if (creatorId) setCachedVoiceId(creatorId, fallback);
  return { voice_id: fallback, name: DEFAULT_MULTILINGUAL_VOICES.male_dynamic.name, source: 'preset_clone' };
}

// Concurrency slot limiter for ElevenLabs API (prevents 429 concurrent_limit_exceeded)
let activeElevenLabsRequests = 0;
const elevenLabsQueue: Array<() => void> = [];

async function acquireElevenLabsSlot(): Promise<() => void> {
  if (activeElevenLabsRequests < 3) {
    activeElevenLabsRequests++;
    return () => {
      activeElevenLabsRequests--;
      if (elevenLabsQueue.length > 0) {
        const next = elevenLabsQueue.shift();
        if (next) next();
      }
    };
  }

  return new Promise((resolve) => {
    elevenLabsQueue.push(() => {
      activeElevenLabsRequests++;
      resolve(() => {
        activeElevenLabsRequests--;
        if (elevenLabsQueue.length > 0) {
          const next = elevenLabsQueue.shift();
          if (next) next();
        }
      });
    });
  });
}

/**
 * Synthesize translated text in the cloned voice using ElevenLabs Multilingual V2 model
 */
export async function synthesizeClonedVoice(params: {
  text: string;
  voiceId?: string;
  targetLang?: string;
}): Promise<{ audio: string; voiceId: string } | null> {
  const effectiveVoiceId = params.voiceId || getDefaultVoiceId() || DEFAULT_MULTILINGUAL_VOICES.male_dynamic.id;
  const { text } = params;
  const cleanText = (text || '').trim();
  if (!cleanText) return null;

  const localKey = getElevenLabsApiKey();
  const releaseSlot = await acquireElevenLabsSlot();

  try {
    const response = await fetch(`${ELEVENLABS_PROXY_URL}?action=tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: localKey || undefined,
        voiceId: effectiveVoiceId,
        text: cleanText,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.warn('[ElevenLabs TTS] Proxy error:', err.error || response.statusText);
      return null;
    }

    const data = await response.json();
    if (data.audio) {
      return { audio: data.audio, voiceId: effectiveVoiceId };
    }
  } catch (err: any) {
    console.warn('[ElevenLabs TTS] Network notice:', err.message);
  } finally {
    releaseSlot();
  }

  return null;
}

/**
 * Fetch all available voices from ElevenLabs account
 */
export async function fetchElevenLabsVoices(): Promise<Array<{
  voice_id: string;
  name: string;
  category: string;
  preview_url?: string;
}>> {
  const localKey = getElevenLabsApiKey();
  try {
    const res = await fetch(`${ELEVENLABS_PROXY_URL}?action=voices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: localKey || undefined }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.voices) ? data.voices : [];
  } catch {
    return [];
  }
}

/**
 * Fetch ElevenLabs user account subscription details
 */
export async function fetchElevenLabsSubscription(): Promise<{
  tier?: string;
  character_count?: number;
  character_limit?: number;
  can_use_instant_voice_cloning?: boolean;
} | null> {
  const localKey = getElevenLabsApiKey();
  try {
    const res = await fetch(`${ELEVENLABS_PROXY_URL}?action=subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: localKey || undefined }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
