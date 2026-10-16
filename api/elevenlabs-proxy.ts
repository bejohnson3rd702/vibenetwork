const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, xi-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action = 'status' } = req.query;
  const body = req.body || {};

  const apiKey = (
    body.apiKey ||
    req.headers['xi-api-key'] ||
    process.env.ELEVENLABS_API_KEY ||
    process.env.VITE_ELEVENLABS_API_KEY ||
    ''
  ).trim();

  // 1. Status Check
  if (action === 'status') {
    if (!apiKey) {
      return res.status(200).json({ hasKey: false, message: 'ELEVENLABS_API_KEY not configured' });
    }

    try {
      const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'xi-api-key': apiKey,
        },
      });

      if (!response.ok) {
        let errMsg = response.statusText;
        try {
          const errData = await response.json();
          if (errData?.detail?.message) errMsg = errData.detail.message;
          else if (typeof errData?.detail === 'string') errMsg = errData.detail;
        } catch (_) {}
        return res.status(200).json({
          hasKey: false,
          error: errMsg,
        });
      }

      const data = await response.json();
      return res.status(200).json({
        hasKey: true,
        voicesCount: Array.isArray(data.voices) ? data.voices.length : 0,
      });
    } catch (err: any) {
      return res.status(500).json({ hasKey: false, error: err.message });
    }
  }

  // Check key requirement for other actions
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing ELEVENLABS_API_KEY. Configure it in .env or settings.' });
  }

  // 2. List voices
  if (action === 'voices') {
    try {
      const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'xi-api-key': apiKey,
        },
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 3. User subscription info
  if (action === 'subscription') {
    try {
      const response = await fetch(`${ELEVENLABS_BASE_URL}/user/subscription`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'xi-api-key': apiKey,
        },
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // 4. Clone Voice from Audio Sample
  if (action === 'clone') {
    try {
      const { name = 'Creator Voice', audioBase64, description = 'Cloned from Vibe Network' } = body;
      if (!audioBase64) {
        return res.status(400).json({ error: 'Missing audioBase64 for voice cloning' });
      }

      const audioBuffer = Buffer.from(audioBase64, 'base64');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      
      const isWav = audioBuffer.length >= 4 && audioBuffer.toString('utf8', 0, 4) === 'RIFF';
      const mimeType = isWav ? 'audio/wav' : 'audio/mpeg';
      const filename = isWav ? 'sample.wav' : 'sample.mp3';
      const audioBlob = new Blob([audioBuffer], { type: mimeType });
      formData.append('files', audioBlob, filename);

      const response = await fetch(`${ELEVENLABS_BASE_URL}/voices/add`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: `ElevenLabs Clone Error: ${errText}` });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Voice cloning failed' });
    }
  }

  // 3. Text-To-Speech with Cloned Voice
  if (action === 'tts') {
    try {
      const { voiceId = 'pNInz6obpgDQGcFmaJgB', text } = body; // Defaults to Adam (natural multilingual)
      if (!text) {
        return res.status(400).json({ error: 'Missing text to synthesize' });
      }

      const response = await fetch(`${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
        method: 'POST',
        headers: {
          'accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: body.model_id || 'eleven_flash_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.85,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        return res.status(response.status).json({ error: `ElevenLabs TTS Error: ${err}` });
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString('base64');

      return res.status(200).json({
        audio: base64Audio,
        format: 'audio/mp3',
        voice_id: voiceId,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'ElevenLabs synthesis failed' });
    }
  }

  return res.status(400).json({ error: `Unsupported action: ${action}` });
}
