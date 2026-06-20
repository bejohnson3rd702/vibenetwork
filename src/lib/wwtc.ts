const WWTC_API_KEY = '95a35451.30ece979-c4bd-447b-8b1e-fd9a6c77418b';
const CORE_BASE_URL = 'https://core.worldwidetechconnections.com';
const API_BASE_URL = 'https://api.worldwidetechconnections.com';

export interface WwtcLanguage {
  code: string;
  name: string;
  services: string; // e.g. "stt-ttt-tts" (Speech-to-Text, Text-to-Text, Text-to-Speech)
  flag: string;     // flag icon PNG url
}

/**
 * Fetch supported languages from WWTC
 */
export async function getWwtcLanguages(): Promise<WwtcLanguage[]> {
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

  return response.json();
}

/**
 * Send text for translation service
 */
export async function translateText(params: {
  text: string;
  sourceLang: string; // e.g., 'english-united-states'
  targetLang: string; // e.g., 'spanish-international'
  serviceCode?: 'sts' | 'ttt' | 'stt' | 'tts';
}): Promise<any> {
  const { text, sourceLang, targetLang, serviceCode = 'sts' } = params;
  
  const query = new URLSearchParams({
    text,
    serviceCode,
    sourceLanguageCode: sourceLang,
    targetLanguageCode: targetLang,
  });

  const response = await fetch(`${API_BASE_URL}/services/tts/${sourceLang}/${targetLang}?${query}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-authorization': WWTC_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`WWTC Translation Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
