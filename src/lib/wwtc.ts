import { supabase } from '../supabaseClient';
import { getLocalTranscript } from './staticTranscripts';
import { synthesizeClonedVoice, isVoiceCloningEnabled, getAudioDataUri } from './elevenlabs';
export { getAudioDataUri };

// WWTC API proxy route (runs server-side to keep WWTC_API_KEY secure)
const WWTC_PROXY_URL = '/api/wwtc-proxy';

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

/**
 * Translation Software Tier Configuration:
 * - Active tier languages (Freemium): English + 5 key languages:
 *   Spanish, French, Mandarin Chinese, Portuguese, Hindi.
 * - All other languages are reserved for the upcoming Freemium/Paid upgrade tier.
 */
export const ACTIVE_TRANSLATION_LANG_CODES = [
  'english-united-states',
  'spanish-international',
  'french-france',
  'chinese-mandarin',
  'portuguese-brazil',
  'hindi',
] as const;

export const ACTIVE_FOREIGN_LANGUAGES = [
  'spanish-international',
  'french-france',
  'chinese-mandarin',
  'portuguese-brazil',
  'hindi',
] as const;

export const DEFAULT_ACTIVE_LANGUAGES: WwtcLanguage[] = [
  { code: 'english-united-states', name: 'English (US)', services: 'stt-ttt-tts', flag: '' },
  { code: 'spanish-international', name: 'Spanish', services: 'stt-ttt-tts', flag: '' },
  { code: 'french-france', name: 'French', services: 'stt-ttt-tts', flag: '' },
  { code: 'chinese-mandarin', name: 'Mandarin Chinese', services: 'x-ttt-tts', flag: '' },
  { code: 'portuguese-brazil', name: 'Portuguese', services: 'stt-ttt-tts', flag: '' },
  { code: 'hindi', name: 'Hindi', services: 'x-ttt-tts', flag: '' },
];

/**
 * Helper to determine if a language code represents the original native sound (English)
 */
export function isOriginalSound(langCode: string | null | undefined): boolean {
  if (!langCode) return true;
  const lower = langCode.toLowerCase().trim();
  return (
    lower === 'english-united-states' ||
    lower === 'english-us' ||
    lower.startsWith('english') ||
    lower === 'en' ||
    lower === 'original' ||
    lower.includes('original')
  );
}

/**
 * Filter a language list to only the 5 active translation languages plus English.
 */
export function filterActiveLanguages(allLanguages: WwtcLanguage[]): WwtcLanguage[] {
  if (!Array.isArray(allLanguages) || allLanguages.length === 0) {
    return DEFAULT_ACTIVE_LANGUAGES;
  }

  const findLang = (matcher: (l: WwtcLanguage) => boolean, fallback: WwtcLanguage) =>
    allLanguages.find(matcher) || fallback;

  // Always force English to be canonical Original Sound (English) with code 'english-united-states'
  const rawEnglish =
    allLanguages.find(l => l.code === 'english-united-states') ||
    allLanguages.find(l => l.code === 'english-us') ||
    allLanguages.find(l => l.name.toLowerCase().includes('united states')) ||
    DEFAULT_ACTIVE_LANGUAGES[0];

  const english: WwtcLanguage = {
    ...rawEnglish,
    code: 'english-united-states',
    name: 'Original Sound (English)',
  };
  const spanish = findLang(
    l => l.code === 'spanish-international' || l.code.startsWith('spanish') || l.name.toLowerCase().includes('spanish'),
    DEFAULT_ACTIVE_LANGUAGES[1]
  );
  const french = findLang(
    l => l.code === 'french-france' || l.code.startsWith('french') || l.name.toLowerCase().includes('french'),
    DEFAULT_ACTIVE_LANGUAGES[2]
  );
  const mandarin = findLang(
    l => l.code === 'chinese-mandarin' || l.code.includes('chinese') || l.code.includes('mandarin') || l.name.toLowerCase().includes('mandarin') || l.name.toLowerCase().includes('chinese'),
    DEFAULT_ACTIVE_LANGUAGES[3]
  );
  const portuguese = findLang(
    l => l.code === 'portuguese-brazil' || l.code.startsWith('portuguese') || l.name.toLowerCase().includes('portuguese'),
    DEFAULT_ACTIVE_LANGUAGES[4]
  );
  const hindi = findLang(
    l => l.code === 'hindi' || l.code.startsWith('hindi') || l.name.toLowerCase().includes('hindi'),
    DEFAULT_ACTIVE_LANGUAGES[5]
  );

  return [english, spanish, french, mandarin, portuguese, hindi];
}

/**
 * Get the languages reserved for the upcoming Premium / Paid version.
 */
export function getReservedPremiumLanguages(allLanguages: WwtcLanguage[]): WwtcLanguage[] {
  if (!Array.isArray(allLanguages)) return [];
  const activeList = filterActiveLanguages(allLanguages);
  const activeCodes = new Set(activeList.map(l => l.code));
  return allLanguages.filter(l => !activeCodes.has(l.code));
}

const CACHE_KEY = 'wwtc_languages_cache_v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Fetch supported languages from WWTC Core API via secure proxy with localStorage caching
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

  const response = await fetch(`${WWTC_PROXY_URL}?action=languages`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
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
  audio?: string; // Base64 WAV or MP3 (for TTS, STS, and cloned voice)
  voice_id?: string;
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Execute WWTC Translation or Speech Synthesis Service via secure serverless proxy
 */
export async function executeWwtcService(params: WwtcServiceRequest): Promise<WwtcServiceResponse> {
  const { serviceCode, sourceLang, targetLang, text, audioBlob } = params;

  let audioBase64: string | undefined;
  if (audioBlob) {
    try {
      audioBase64 = await blobToBase64(audioBlob);
    } catch (e) {
      console.warn('[WWTC] Failed to encode audioBlob to base64:', e);
    }
  }

  // All calls go through the server-side proxy so the WWTC API key never ships to the browser.
  const response = await fetch(`${WWTC_PROXY_URL}?action=${serviceCode === 'stt' ? 'stt' : 'service'}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serviceCode,
      sourceLang,
      targetLang,
      text,
      audioBase64,
    }),
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

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`WWTC Proxy returned non-JSON response (${contentType || 'empty'})`);
  }

  return response.json();
}

// Global In-Memory Translation Cache & Deduplication Pool
const translationMemoryCache = new Map<string, WwtcServiceResponse>();
const inFlightTranslations = new Map<string, Promise<WwtcServiceResponse>>();

const SESSION_CACHE_PREFIX = 'wwtc_v1_';

function getSessionCached(key: string): WwtcServiceResponse | null {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}

function setSessionCached(key: string, res: WwtcServiceResponse): void {
  try {
    sessionStorage.setItem(SESSION_CACHE_PREFIX + key, JSON.stringify(res));
  } catch (_) {
    // If storage quota exceeded, purge older WWTC entries
    try {
      let evicted = 0;
      for (let i = sessionStorage.length - 1; i >= 0 && evicted < 12; i--) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(SESSION_CACHE_PREFIX)) {
          sessionStorage.removeItem(k);
          evicted++;
        }
      }
    } catch (_) {}
  }
}

/**
 * Check synchronously if a translation (especially TTS audio) is already cached in memory or session
 */
export function isTranslationCached(params: {
  text: string;
  sourceLang?: string;
  targetLang: string;
  serviceCode?: 'sts' | 'ttt' | 'stt' | 'tts';
  useVoiceCloning?: boolean;
  voiceId?: string;
}): boolean {
  const { text, sourceLang = 'english-united-states', targetLang, serviceCode = 'tts', useVoiceCloning = true, voiceId } = params;
  const cleanText = (text || '').trim();
  if (!cleanText || sourceLang === targetLang) return true;

  const normalizedService = serviceCode === 'sts' ? 'tts' : serviceCode;
  const cloneKeyTag = (normalizedService === 'tts' && useVoiceCloning && isVoiceCloningEnabled()) ? `:cloned:${voiceId || 'default'}` : '';
  const cacheKey = `${normalizedService}:${sourceLang}:${targetLang}:${cleanText}${cloneKeyTag}`;

  if (translationMemoryCache.has(cacheKey)) return true;
  if (getSessionCached(cacheKey)) return true;

  // Fallback checks (e.g. if cached with default clone or generic key)
  if (cloneKeyTag) {
    const defaultTag = `:cloned:default`;
    const defaultKey = `${normalizedService}:${sourceLang}:${targetLang}:${cleanText}${defaultTag}`;
    if (translationMemoryCache.has(defaultKey) || getSessionCached(defaultKey)) return true;

    const baseKey = `${normalizedService}:${sourceLang}:${targetLang}:${cleanText}`;
    if (translationMemoryCache.has(baseKey) || getSessionCached(baseKey)) return true;
  }

  return false;
}

/**
 * Retrieve cached translation response synchronously if available (0ms instant hit)
 */
export function getCachedTranslation(params: {
  text: string;
  sourceLang?: string;
  targetLang: string;
  serviceCode?: 'sts' | 'ttt' | 'stt' | 'tts';
  useVoiceCloning?: boolean;
  voiceId?: string;
}): WwtcServiceResponse | null {
  const { text, sourceLang = 'english-united-states', targetLang, serviceCode = 'tts', useVoiceCloning = true, voiceId } = params;
  const cleanText = (text || '').trim();
  if (!cleanText) return null;
  if (sourceLang === targetLang) {
    return { source_text: cleanText, translated_text: cleanText, audio: '' };
  }

  const normalizedService = serviceCode === 'sts' ? 'tts' : serviceCode;
  const cloneKeyTag = (normalizedService === 'tts' && useVoiceCloning && isVoiceCloningEnabled()) ? `:cloned:${voiceId || 'default'}` : '';
  const cacheKey = `${normalizedService}:${sourceLang}:${targetLang}:${cleanText}${cloneKeyTag}`;

  if (translationMemoryCache.has(cacheKey)) {
    return translationMemoryCache.get(cacheKey)!;
  }
  const sessionItem = getSessionCached(cacheKey);
  if (sessionItem) {
    translationMemoryCache.set(cacheKey, sessionItem);
    return sessionItem;
  }

  // Fallback: check with default cloned voice or base key
  if (cloneKeyTag) {
    const defaultKey = `${normalizedService}:${sourceLang}:${targetLang}:${cleanText}:cloned:default`;
    if (translationMemoryCache.has(defaultKey)) return translationMemoryCache.get(defaultKey)!;
    const defaultSession = getSessionCached(defaultKey);
    if (defaultSession) {
      translationMemoryCache.set(defaultKey, defaultSession);
      return defaultSession;
    }

    const baseKey = `${normalizedService}:${sourceLang}:${targetLang}:${cleanText}`;
    if (translationMemoryCache.has(baseKey)) return translationMemoryCache.get(baseKey)!;
    const baseSession = getSessionCached(baseKey);
    if (baseSession) {
      translationMemoryCache.set(baseKey, baseSession);
      return baseSession;
    }
  }

  return null;
}

/**
 * Send text for translation service (TTT or TTS) with high-speed in-memory & session caching and coalescing
 */
export async function translateText(params: {
  text: string;
  sourceLang: string; // e.g., 'english-united-states'
  targetLang: string; // e.g., 'spanish-international'
  serviceCode?: 'sts' | 'ttt' | 'stt' | 'tts';
  useVoiceCloning?: boolean;
  voiceId?: string;
}): Promise<WwtcServiceResponse> {
  const { text, sourceLang, targetLang, serviceCode = 'tts', useVoiceCloning = true, voiceId } = params;
  const cleanText = (text || '').trim();

  if (!cleanText) {
    return { source_text: '', translated_text: '', audio: '' };
  }

  // Same language: instant 0ms response
  if (sourceLang === targetLang) {
    return { source_text: cleanText, translated_text: cleanText, audio: '' };
  }

  const normalizedService = serviceCode === 'sts' ? 'tts' : serviceCode;
  const cloneKeyTag = (normalizedService === 'tts' && useVoiceCloning && isVoiceCloningEnabled()) ? `:cloned:${voiceId || 'default'}` : '';
  const cacheKey = `${normalizedService}:${sourceLang}:${targetLang}:${cleanText}${cloneKeyTag}`;

  // 1. Instant In-Memory Cache Hit (0ms)
  if (translationMemoryCache.has(cacheKey)) {
    return translationMemoryCache.get(cacheKey)!;
  }

  // 2. Instant Session Storage Hit (0ms)
  const sessionCached = getSessionCached(cacheKey);
  if (sessionCached) {
    translationMemoryCache.set(cacheKey, sessionCached);
    return sessionCached;
  }

  // 3. Coalesce with any identical in-flight request
  if (inFlightTranslations.has(cacheKey)) {
    return inFlightTranslations.get(cacheKey)!;
  }

  const requestPromise = (async () => {
    try {
      // If voice cloning is requested and active, synthesize speech using ElevenLabs Multilingual V2 / Flash
      if (normalizedService === 'tts' && useVoiceCloning && isVoiceCloningEnabled()) {
        try {
          // 1. Translate the text first (using fast TTT)
          const textRes = await translateText({
            text: cleanText,
            sourceLang,
            targetLang,
            serviceCode: 'ttt',
            useVoiceCloning: false,
          });

          const translatedScript = textRes.translated_text || cleanText;

          // 2. Synthesize using ElevenLabs cloned voice
          const clonedRes = await synthesizeClonedVoice({
            text: translatedScript,
            voiceId,
            targetLang,
          });

          if (clonedRes?.audio) {
            const finalRes: WwtcServiceResponse = {
              source_text: cleanText,
              translated_text: translatedScript,
              audio: clonedRes.audio,
              voice_id: clonedRes.voiceId,
            };
            translationMemoryCache.set(cacheKey, finalRes);
            setSessionCached(cacheKey, finalRes);
            return finalRes;
          }
        } catch (cloneErr: any) {
          console.warn('[translateText] ElevenLabs voice clone notice, using standard TTS:', cloneErr.message);
        }
      }

      const res = await executeWwtcService({
        serviceCode: normalizedService,
        sourceLang,
        targetLang,
        text: cleanText,
      });

      // Cache successful response in memory and session storage
      translationMemoryCache.set(cacheKey, res);
      setSessionCached(cacheKey, res);

      // LRU cache bounding (max 2500 entries)
      if (translationMemoryCache.size > 2500) {
        const oldestKey = translationMemoryCache.keys().next().value;
        if (oldestKey) translationMemoryCache.delete(oldestKey);
      }

      return res;
    } catch (err: any) {
      console.warn(`[WWTC] translateText proxy notice for "${cleanText.slice(0, 30)}...":`, err.message);
      // No direct-API fallback: calling WWTC from the browser would expose the API key.

      return {
        source_text: cleanText,
        translated_text: cleanText,
        audio: ''
      };
    } finally {
      inFlightTranslations.delete(cacheKey);
    }
  })();

  inFlightTranslations.set(cacheKey, requestPromise);
  return requestPromise;
}

/**
 * Pre-warm translation voiceover (TTS) in the background for active foreign languages.
 * Safe to fire and forget; coalesces identical requests and caches in memory & sessionStorage.
 */
export function prewarmActiveLanguagesTTS(
  text: string,
  targetLangs: readonly string[] = ACTIVE_FOREIGN_LANGUAGES,
  voiceId?: string
): void {
  const clean = (text || '').trim();
  if (!clean) return;

  targetLangs.forEach((lang, idx) => {
    if (lang === 'english-united-states') return;

    // 1. Prewarm text translation (TTT) immediately (staggered slightly to avoid browser thread lock)
    const tttKey = `ttt:english-united-states:${lang}:${clean}`;
    if (!translationMemoryCache.has(tttKey) && !inFlightTranslations.has(tttKey)) {
      setTimeout(() => {
        translateText({
          text: clean,
          sourceLang: 'english-united-states',
          targetLang: lang,
          serviceCode: 'ttt',
          useVoiceCloning: false,
        }).catch(() => {});
      }, idx * 25);
    }

    // 2. Prewarm speech audio (TTS) with voiceId
    const isCloning = isVoiceCloningEnabled();
    const cloneKeyTag = isCloning ? `:cloned:${voiceId || 'default'}` : '';
    const ttsKey = `tts:english-united-states:${lang}:${clean}${cloneKeyTag}`;
    if (!translationMemoryCache.has(ttsKey) && !inFlightTranslations.has(ttsKey)) {
      // Prioritize Spanish (starts within 40ms); stagger other languages
      const delay = lang.startsWith('spanish') ? 40 : 120 + idx * 120;
      setTimeout(() => {
        translateText({
          text: clean,
          sourceLang: 'english-united-states',
          targetLang: lang,
          serviceCode: 'tts',
          voiceId,
        }).catch(() => {});
      }, delay);
    }
  });
}

/**
 * Pre-warms the entire video dialogue text (TTT) and the initial segments' audio (TTS)
 * for immediate 0ms language switching when viewing videos in the feed.
 */
export function prewarmVideoDialogue(
  segments: YouTubeCaptionSegment[],
  voiceId?: string,
  targetLangs: readonly string[] = ACTIVE_FOREIGN_LANGUAGES
): void {
  if (!Array.isArray(segments) || segments.length === 0) return;

  // 1. Prewarm text translation (TTT) for all segments across active languages in background
  const texts = segments.map(s => s.text).filter(Boolean);
  targetLangs.forEach(lang => {
    if (lang === 'english-united-states') return;
    batchPrefetchTranslations({
      texts,
      sourceLang: 'english-united-states',
      targetLang: lang,
      serviceCode: 'ttt',
      concurrency: 4,
    }).catch(() => {});
  });

  // 2. Prewarm TTS for first 3 segments immediately for Spanish + other active languages
  const initialSegments = segments.slice(0, 3);
  initialSegments.forEach((seg, segIdx) => {
    if (seg?.text) {
      setTimeout(() => {
        prewarmActiveLanguagesTTS(seg.text, targetLangs, voiceId);
      }, segIdx * 80);
    }
  });
}

/**
 * Splits caption text into readable 1-to-2 sentence chunks (or 10-18 words max).
 * Handles punctuated text, run-on unpunctuated STT transcripts, and multi-language scripts.
 */
export function splitIntoSentenceSlices(
  text: string,
  maxSentences = 2,
  maxWords = 16
): string[] {
  const clean = (text || '').trim();
  if (!clean) return [];

  // Check CJK characters (Chinese / Japanese)
  const isCjk = /[\u4e00-\u9fa5\u3040-\u30ff]/.test(clean) && !clean.includes(' ');
  if (isCjk) {
    const cjkParts = clean.split(/([。！？\n]+)/).filter(Boolean);
    const slices: string[] = [];
    let cur = '';
    for (let i = 0; i < cjkParts.length; i++) {
      cur += cjkParts[i];
      if (cur.length >= 22 || /[。！？]/.test(cjkParts[i])) {
        slices.push(cur.trim());
        cur = '';
      }
    }
    if (cur.trim()) slices.push(cur.trim());
    return slices.length > 0 ? slices : [clean];
  }

  // 1. Split on sentence boundaries: (. ! ? or Hindi danda । or newline)
  const sentenceRegex = /[^.!?\n।]+(?:[.!?\n।]+|$)/g;
  const rawSentences = clean.match(sentenceRegex) || [clean];
  const processedSentences: string[] = [];

  for (const raw of rawSentences) {
    const s = raw.trim();
    if (!s) continue;
    const words = s.split(/\s+/);
    if (words.length > maxWords) {
      // Split on punctuation (comma, semicolon, dash) or major coordinating conjunctions
      const clauseParts = s.split(/([,;:\-–—]+|\s+(?:and|but|or|so|because|y|pero|o|porque|et|mais|ou|e|mas)\s+)/i);
      let chunk = '';
      for (let i = 0; i < clauseParts.length; i++) {
        const part = clauseParts[i];
        if (!part) continue;
        const testChunk = chunk ? `${chunk} ${part}`.replace(/\s+/g, ' ') : part;
        const testWords = testChunk.trim().split(/\s+/).length;
        if (testWords > maxWords && chunk.trim()) {
          processedSentences.push(chunk.replace(/\s+([,;:!?.])/g, '$1').trim());
          chunk = part.trim();
        } else {
          chunk = testChunk;
        }
      }
      if (chunk.trim()) {
        const remainingWords = chunk.trim().split(/\s+/);
        if (remainingWords.length > maxWords) {
          for (let w = 0; w < remainingWords.length; w += maxWords) {
            processedSentences.push(remainingWords.slice(w, w + maxWords).join(' '));
          }
        } else {
          processedSentences.push(chunk.replace(/\s+([,;:!?.])/g, '$1').trim());
        }
      }
    } else {
      processedSentences.push(s);
    }
  }

  // Clean boundary punctuation and group into 1 or 2 sentences per slice
  const slices: string[] = [];
  let currentSlice: string[] = [];
  let currentSliceWords = 0;

  for (const rawSent of processedSentences) {
    const sent = rawSent.replace(/^[,;:\s]+/, '').trim();
    if (!sent) continue;
    const sentWords = sent.split(/\s+/).length;
    if (currentSlice.length >= maxSentences || (currentSlice.length > 0 && currentSliceWords + sentWords > 18)) {
      slices.push(currentSlice.join(' ').replace(/\s+([,;:!?.])/g, '$1'));
      currentSlice = [sent];
      currentSliceWords = sentWords;
    } else {
      currentSlice.push(sent);
      currentSliceWords += sentWords;
    }
  }
  if (currentSlice.length > 0) {
    slices.push(currentSlice.join(' ').replace(/\s+([,;:!?.])/g, '$1'));
  }
  return slices;
}

/**
 * Returns the active 1-to-2 sentence subtitle slice corresponding to the current playback time.
 * Dynamically computes slice duration based on text length to avoid displaying whole paragraphs.
 */
export function getActiveCaptionSlice(params: {
  fullText: string;
  currentTime: number;
  segmentStart: number;
  segmentEnd?: number;
  videoDuration?: number;
  maxSentences?: number;
  maxWords?: number;
}): string {
  const {
    fullText,
    currentTime,
    segmentStart,
    segmentEnd,
    videoDuration = 0,
    maxSentences = 2,
    maxWords = 16,
  } = params;

  if (!fullText || !fullText.trim()) return '';
  const slices = splitIntoSentenceSlices(fullText, maxSentences, maxWords);
  if (slices.length <= 1) return fullText.trim();

  let totalDuration = 0;
  if (segmentEnd && segmentEnd > segmentStart) {
    totalDuration = segmentEnd - segmentStart;
  } else if (videoDuration > segmentStart) {
    totalDuration = videoDuration - segmentStart;
  } else {
    const totalWords = fullText.trim().split(/\s+/).length;
    totalDuration = Math.max(3, totalWords * 0.35);
  }

  const weights = slices.map(s => Math.max(1, s.trim().split(/\s+/).length));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const elapsed = Math.max(0, currentTime - segmentStart);
  let accumulatedTime = 0;

  for (let i = 0; i < slices.length; i++) {
    const sliceDuration = totalDuration * (weights[i] / totalWeight);
    if (elapsed < accumulatedTime + sliceDuration || i === slices.length - 1) {
      return slices[i];
    }
    accumulatedTime += sliceDuration;
  }

  return slices[slices.length - 1];
}

/**
 * High-speed parallel pre-fetcher for caption segments / text chunks
 * Uses a concurrency pool (default 4 workers) to pre-warm the cache ahead of playback
 */
export async function batchPrefetchTranslations(params: {
  texts: string[];
  sourceLang: string;
  targetLang: string;
  serviceCode?: 'ttt' | 'tts';
  concurrency?: number;
  onItemTranslated?: (index: number, text: string, translatedText: string, audio?: string) => void;
}): Promise<Record<number, string>> {
  const { 
    texts, 
    sourceLang, 
    targetLang, 
    serviceCode = 'ttt', 
    concurrency = 4,
    onItemTranslated 
  } = params;

  const results: Record<number, string> = {};
  if (!texts || texts.length === 0 || sourceLang === targetLang) {
    return results;
  }

  let currentIndex = 0;

  const worker = async () => {
    while (currentIndex < texts.length) {
      const idx = currentIndex++;
      const txt = texts[idx];
      if (!txt || !txt.trim()) continue;

      try {
        const res = await translateText({
          text: txt,
          sourceLang,
          targetLang,
          serviceCode,
        });

        const translated = res.translated_text || txt;
        results[idx] = translated;
        if (onItemTranslated) {
          onItemTranslated(idx, txt, translated, res.audio);
        }
      } catch (err) {
        // Continue prefetching remaining items even if one fails
        console.warn(`[WWTC] Prefetch item ${idx} notice:`, err);
      }
    }
  };

  const pool = Array.from({ length: Math.min(concurrency, texts.length) }, () => worker());
  await Promise.all(pool);
  return results;
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
  translatedText?: string;
  isPlaceholder?: boolean;
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
 * Fetch and parse YouTube auto-captions / timedtext subtitles for a video ID or URL
 */
export async function fetchYouTubeCaptions(videoId: string): Promise<YouTubeCaptionSegment[]> {
  if (!videoId) throw new Error("Video ID is required");

  // Extract clean 11-char video ID if a full URL was provided
  const match = videoId.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  const cleanId = (match && match[1]?.length === 11) ? match[1] : (videoId.length === 11 ? videoId : videoId);

  // 1. Check bundled local high-quality static transcripts first
  const local = getLocalTranscript(cleanId) || getLocalTranscript(videoId);
  if (local && local.length > 0) {
    return local.map((s: any) => ({ ...s, isRecorded: true }));
  }

  // 2. Check Supabase database cache (instant)
  if (supabase) {
    try {
      const { data } = await supabase
        .from('video_transcripts')
        .select('transcript')
        .eq('video_id', cleanId)
        .maybeSingle();

      if (data && Array.isArray(data.transcript) && data.transcript.length > 0) {
        const isPlaceholder = data.transcript.some((s: any) =>
          s.isPlaceholder ||
          s.isRecorded === false ||
          s.text?.includes('agenda and details:') ||
          s.text?.includes('Welcome into the live studio broadcast') ||
          s.text?.includes('Official Video Broadcast') ||
          s.text?.includes('Streaming now on Vibe Network.')
        );
        if (!isPlaceholder) {
          return data.transcript.map((s: any) => ({ ...s, isRecorded: true }));
        }
      }
    } catch (dbErr) {
      console.warn("[WWTC] Supabase transcript check notice:", dbErr);
    }
  }

  // 3. Call server-side transcript extraction API (uses yt-dlp & signed timedtext endpoint)
  try {
    const res = await fetch(`/api/yt-transcript?videoId=${encodeURIComponent(cleanId)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.segments) && json.segments.length > 0) {
        return json.segments;
      }
    }
  } catch (apiErr) {
    console.warn("[WWTC] /api/yt-transcript API notice:", apiErr);
  }

  // 4. Fallback to active Invidious endpoints
  const thirdPartyEndpoints = [
    `https://inv.tux.pizza/api/v1/captions/${cleanId}`,
    `https://invidious.nerdvpn.de/api/v1/captions/${cleanId}`,
    `https://yt.artemislena.eu/api/v1/captions/${cleanId}`,
    `https://invidious.private.coffee/api/v1/captions/${cleanId}`
  ];

  for (const endpoint of thirdPartyEndpoints) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const json = await res.json();
        // Handle Piped captions response format
        if (json.subtitles && Array.isArray(json.subtitles)) {
          const enSub = json.subtitles.find((s: any) => s.lang?.startsWith('en')) || json.subtitles[0];
          if (enSub && enSub.url) {
            const subRes = await fetch(enSub.url);
            if (subRes.ok) {
              const subJson = await subRes.json();
              if (subJson.events && Array.isArray(subJson.events)) {
                const segments: YouTubeCaptionSegment[] = [];
                for (const ev of subJson.events) {
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
            }
          }
        }
        // Handle Invidious captions response format
        if (json.captions && Array.isArray(json.captions)) {
          const enCap = json.captions.find((c: any) => c.languageCode?.startsWith('en')) || json.captions[0];
          if (enCap && enCap.url) {
            const rawXml = await fetchWithCorsProxy(`https://vid.puffyan.us${enCap.url}`);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(rawXml, "text/xml");
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
        }
      }
    } catch {
      // Continue to YouTube timedtext fallbacks
    }
  }

  // Attempt standard YouTube timedtext API endpoints
  const urls = [
    `https://www.youtube.com/api/timedtext?v=${cleanId}&lang=en&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${cleanId}&lang=en-US&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${cleanId}&lang=a.en&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${cleanId}&lang=en`,
    `https://www.youtube.com/api/timedtext?v=${cleanId}&lang=en-US`,
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


