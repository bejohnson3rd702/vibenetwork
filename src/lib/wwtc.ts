const WWTC_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WWTC_API_KEY) || '95a35451.30ece979-c4bd-447b-8b1e-fd9a6c77418b';
const CORE_BASE_URL = 'https://core.worldwidetechconnections.com';
const API_BASE_URL = 'https://api.worldwidetechconnections.com';

export interface WwtcLanguage {
  code: string;
  name: string;
  services: string; // Format: X-X-X (STT-TTT-TTS, e.g. "stt-ttt-tts", "x-ttt-x", "x-ttt-tts")
  flag: string;     // URL to language flag image
}

export interface LanguageCapabilities {
  stt: boolean; // Speech-to-Text (Position 1)
  ttt: boolean; // Text-to-Text (Position 2)
  tts: boolean; // Text-to-Speech (Position 3)
  sts: boolean; // Full Speech-to-Speech (stt && ttt && tts, no 'x')
}

/**
 * Extract capability flags from a WWTC service code string (format: X-X-X)
 */
export function parseLanguageCapabilities(servicesOrLang: string | WwtcLanguage): LanguageCapabilities {
  const services = typeof servicesOrLang === 'string' ? servicesOrLang : servicesOrLang?.services || '';
  const parts = services.toLowerCase().split('-');
  
  const stt = parts[0] ? parts[0] !== 'x' && (parts[0] === 'stt' || parts[0] === 'sts') : false;
  const ttt = parts[1] ? parts[1] !== 'x' && parts[1] === 'ttt' : false;
  const tts = parts[2] ? parts[2] !== 'x' && (parts[2] === 'tts' || parts[2] === 'sts') : false;
  const sts = stt && ttt && tts && !services.includes('x');

  return { stt, ttt, tts, sts };
}

export function supportsSTT(lang: WwtcLanguage | string): boolean {
  return parseLanguageCapabilities(lang).stt;
}

export function supportsTTT(lang: WwtcLanguage | string): boolean {
  return parseLanguageCapabilities(lang).ttt;
}

export function supportsTTS(lang: WwtcLanguage | string): boolean {
  return parseLanguageCapabilities(lang).tts;
}

export function supportsSTS(lang: WwtcLanguage | string): boolean {
  return parseLanguageCapabilities(lang).sts;
}

const CACHE_KEY = 'wwtc_languages_cache_v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Fetch supported languages from WWTC Core API with localStorage caching
 */
export async function getWwtcLanguages(forceRefresh = false): Promise<WwtcLanguage[]> {
  if (!forceRefresh && typeof window !== 'undefined' && window.localStorage) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.data)) {
          return parsed.data;
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }

  const response = await fetch(`${CORE_BASE_URL}/languages`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api-authorization': WWTC_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`WWTC API Error: ${response.status} ${response.statusText}`);
  }

  const data: WwtcLanguage[] = await response.json();

  if (typeof window !== 'undefined' && window.localStorage && Array.isArray(data) && data.length > 0) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
    } catch {
      // Ignore quota errors
    }
  }

  return data;
}

export interface WwtcServiceRequest {
  serviceCode: 'stt' | 'ttt' | 'tts' | 'sts';
  sourceLang: string; // e.g., 'english-united-states'
  targetLang: string; // e.g., 'spanish-international'
  text?: string;
  audioBlob?: Blob; // Required for STT and STS
}

export interface WwtcServiceResponse {
  source_text: string;
  translated_text: string;
  audio?: string; // Base64 WAV (for TTS and STS)
}

/**
 * Execute WWTC Translation or Speech Synthesis Service
 * Endpoint: POST https://api.worldwidetechconnections.com/services/{serviceCode}/{sourceLanguage}/{targetLanguage}
 */
export async function executeWwtcService(params: WwtcServiceRequest): Promise<WwtcServiceResponse> {
  const { serviceCode, sourceLang, targetLang, text, audioBlob } = params;

  const url = new URL(`${API_BASE_URL}/services/${serviceCode}/${sourceLang}/${targetLang}`);
  if (text) {
    url.searchParams.set('text', text);
  }

  const headers: HeadersInit = {
    'accept': 'application/json',
    'api-authorization': WWTC_API_KEY,
  };

  let body: BodyInit | undefined = undefined;

  if (audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    body = formData;
  }

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    let errorMsg = `WWTC ${serviceCode.toUpperCase()} Error: ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.error) {
        errorMsg = `WWTC Error: ${errJson.error}`;
      }
    } catch {
      // Ignore JSON parse errors on non-200
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

/**
 * Send text for translation service (TTT or TTS)
 */
export async function translateText(params: {
  text: string;
  sourceLang: string; // e.g., 'english-united-states'
  targetLang: string; // e.g., 'spanish-international'
  serviceCode?: 'sts' | 'ttt' | 'stt' | 'tts';
}): Promise<WwtcServiceResponse> {
  const { text, sourceLang, targetLang, serviceCode = 'tts' } = params;
  
  return executeWwtcService({
    serviceCode: serviceCode === 'sts' ? 'tts' : serviceCode,
    sourceLang,
    targetLang,
    text,
  });
}

/**
 * Helper to encode AudioBuffer to 16kHz Mono 16-bit PCM WAV format
 * Required by WWTC STT/STS API specifications
 */
export function encode16kMonoWav(audioBuffer: AudioBuffer): Blob {
  const sampleRate = 16000;
  const numChannels = 1;

  // Resample if necessary
  const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
    1,
    Math.ceil(audioBuffer.duration * sampleRate),
    sampleRate
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  // We can also synchronously downsample buffer data:
  const channelData = audioBuffer.getChannelData(0);
  const ratio = audioBuffer.sampleRate / sampleRate;
  const newLength = Math.round(channelData.length / ratio);
  const result = new Float32Array(newLength);
  
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < channelData.length; i++) {
      accum += channelData[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }

  // Create WAV container
  const buffer = new ArrayBuffer(44 + result.length * 2);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + result.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw PCM) */
  view.setUint16(20, 1, true);
  /* channel count (mono) */
  view.setUint16(22, numChannels, true);
  /* sample rate (16000) */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sampleRate * numChannels * 2) */
  view.setUint32(28, sampleRate * 2, true);
  /* block align (numChannels * 2) */
  view.setUint16(32, 2, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, result.length * 2, true);

  // Write PCM samples (16-bit signed integer)
  let index = 44;
  for (let i = 0; i < result.length; i++) {
    const s = Math.max(-1, Math.min(1, result[i]));
    view.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    index += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Send recorded audio blob to WWTC Speech-To-Text (STT) service
 */
export async function transcribeAudioBlob(params: {
  audioBlob: Blob;
  sourceLang?: string;
  targetLang?: string;
}): Promise<WwtcServiceResponse> {
  const { audioBlob, sourceLang = 'english-united-states', targetLang = 'spanish-international' } = params;
  return executeWwtcService({
    serviceCode: 'stt',
    sourceLang,
    targetLang,
    audioBlob,
  });
}

/**
 * Transcribe an uploaded audio File (.mp3, .wav, .m4a) via Web Audio API + WWTC STT
 */
export async function transcribeAudioFile(file: File, sourceLang = 'english-united-states', targetLang = 'spanish-international'): Promise<WwtcServiceResponse> {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const arrayBuffer = await file.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const wavBlob = encode16kMonoWav(audioBuffer);
  return transcribeAudioBlob({ audioBlob: wavBlob, sourceLang, targetLang });
}

export interface YouTubeCaptionSegment {
  time: string;
  seconds: number;
  speaker: string;
  text: string;
  isRecorded?: boolean;
}

async function fetchWithCorsProxy(targetUrl: string): Promise<string> {
  const proxyConstructors = [
    (url: string) => url,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
  ];

  for (const buildProxyUrl of proxyConstructors) {
    try {
      const proxyUrl = buildProxyUrl(targetUrl);
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0 && !text.includes('Error 404') && !text.includes('404 Not Found')) {
          return text;
        }
      }
    } catch {
      // Continue to next proxy candidate
    }
  }
  throw new Error(`Failed to fetch ${targetUrl} via direct fetch and CORS proxies`);
}

/**
 * Fetch and parse YouTube auto-captions / timedtext subtitles for a video ID
 */
export async function fetchYouTubeCaptions(videoId: string): Promise<YouTubeCaptionSegment[]> {
  if (!videoId) throw new Error("Video ID is required");

  // Attempt timedtext API endpoints
  const urls = [
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en`,
    `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en-US`,
  ];

  for (const url of urls) {
    try {
      const rawText = await fetchWithCorsProxy(url);

      if (url.includes('fmt=json3')) {
        let json: any;
        try {
          json = JSON.parse(rawText);
        } catch {
          continue;
        }
        if (json.events && Array.isArray(json.events)) {
          const segments: YouTubeCaptionSegment[] = [];
          for (const ev of json.events) {
            if (ev.segs && ev.tStartMs !== undefined) {
              const textStr = ev.segs.map((s: any) => s.utf8).join('').trim();
              if (textStr && textStr !== '\n') {
                const totalSec = Math.floor(ev.tStartMs / 1000);
                const m = Math.floor(totalSec / 60);
                const s = Math.floor(totalSec % 60);
                const timeStr = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
                segments.push({
                  time: timeStr,
                  seconds: totalSec,
                  speaker: "YouTube Captions",
                  text: textStr,
                  isRecorded: true,
                });
              }
            }
          }
          if (segments.length > 0) return segments;
        }
      } else {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rawText, "text/xml");
        const textNodes = xmlDoc.getElementsByTagName("text");
        if (textNodes && textNodes.length > 0) {
          const segments: YouTubeCaptionSegment[] = [];
          for (let i = 0; i < textNodes.length; i++) {
            const node = textNodes[i];
            const startSec = parseFloat(node.getAttribute("start") || "0");
            const rawTextContent = node.textContent || "";
            const cleanText = rawTextContent
              .replace(/&amp;/g, '&')
              .replace(/&#39;/g, "'")
              .replace(/&quot;/g, '"')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/\n/g, ' ')
              .trim();

            if (cleanText) {
              const totalSec = Math.floor(startSec);
              const m = Math.floor(totalSec / 60);
              const s = Math.floor(totalSec % 60);
              const timeStr = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
              segments.push({
                time: timeStr,
                seconds: totalSec,
                speaker: "YouTube Captions",
                text: cleanText,
                isRecorded: true,
              });
            }
          }
          if (segments.length > 0) return segments;
        }
      }
    } catch {
      // Try next url candidate
    }
  }

  throw new Error("No YouTube caption track available for this video.");
}


