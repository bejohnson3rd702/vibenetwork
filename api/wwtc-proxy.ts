import type { IncomingMessage, ServerResponse } from 'http';

const WWTC_API_KEY = process.env.WWTC_API_KEY || process.env.VITE_WWTC_API_KEY || '95a35451.30ece979-c4bd-447b-8b1e-fd9a6c77418b';
const CORE_BASE_URL = 'https://core.worldwidetechconnections.com';
const API_BASE_URL = 'https://api.worldwidetechconnections.com';

// In-memory cache on the serverless instance to avoid redundant API hits
const languagesCache: { data: any; timestamp: number } = { data: null, timestamp: 0 };
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action = 'languages' } = req.query;

  try {
    // 1. Fetch supported languages
    if (action === 'languages') {
      if (languagesCache.data && Date.now() - languagesCache.timestamp < CACHE_TTL_MS) {
        return res.status(200).json(languagesCache.data);
      }

      const response = await fetch(`${CORE_BASE_URL}/languages`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'api-authorization': WWTC_API_KEY,
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: `WWTC API Error: ${response.statusText}` });
      }

      const data = await response.json();
      languagesCache.data = data;
      languagesCache.timestamp = Date.now();
      return res.status(200).json(data);
    }

    // 2. Translation or Synthesis Service (TTT, TTS, STT)
    if (action === 'service') {
      const { serviceCode, sourceLang, targetLang, text } = req.body || {};

      if (!serviceCode || !sourceLang || !targetLang) {
        return res.status(400).json({ error: 'Missing serviceCode, sourceLang, or targetLang' });
      }

      const allowedServices = ['stt', 'ttt', 'tts', 'sts'];
      if (!allowedServices.includes(serviceCode)) {
        return res.status(400).json({ error: 'Invalid serviceCode' });
      }

      const url = new URL(`${API_BASE_URL}/services/${serviceCode}/${sourceLang}/${targetLang}`);
      if (text) {
        url.searchParams.set('text', String(text).slice(0, 10000)); // Bound input length to protect against abuse
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-authorization': WWTC_API_KEY,
        },
      });

      if (!response.ok) {
        let errDetails = `WWTC Error: ${response.statusText}`;
        try {
          const errJson = await response.json();
          if (errJson?.error) errDetails = errJson.error;
        } catch (_) {}
        return res.status(response.status).json({ error: errDetails });
      }

      const result = await response.json();
      return res.status(200).json(result);
    }

    return res.status(400).json({ error: `Unsupported action: ${action}` });
  } catch (error: any) {
    console.error('[wwtc-proxy] Serverless error:', error);
    return res.status(500).json({ error: error.message || 'Internal proxy error' });
  }
}
