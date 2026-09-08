import { 
  getWwtcLanguages, 
  executeWwtcService, 
  translateText, 
  parseLanguageCapabilities,
  supportsSTT,
  supportsTTT,
  supportsTTS,
  supportsSTS
} from './src/lib/wwtc';

/**
 * Helper to create a synthetic 16kHz 16-bit Mono PCM WAV buffer for testing speech endpoints
 */
function createSynthetic16kWavBuffer(durationSeconds = 1.0, freq = 440): Buffer {
  const sampleRate = 16000;
  const numChannels = 1;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * 2; // 16-bit = 2 bytes per sample
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * 2, 28); // ByteRate
  buffer.writeUInt16LE(numChannels * 2, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate sine wave samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * freq * t);
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

async function runSuite() {
  console.log('====================================================');
  console.log('🚀 RUNNING WWTC TRANSLATION & SPEECH TEST SUITE');
  console.log('====================================================\n');

  // TEST 1: Language Directory & Capability Breakdown
  console.log('📍 [TEST 1] Fetching languages from Core API...');
  let langs: any[] = [];
  try {
    langs = await getWwtcLanguages(true);
    console.log(`✅ Success! Retrieved ${langs.length} languages from WWTC Core API.`);
    
    let sttCount = 0;
    let tttCount = 0;
    let ttsCount = 0;
    let stsCount = 0;

    for (const l of langs) {
      if (supportsSTT(l)) sttCount++;
      if (supportsTTT(l)) tttCount++;
      if (supportsTTS(l)) ttsCount++;
      if (supportsSTS(l)) stsCount++;
    }

    console.log(`   📊 Language Capabilities Breakdown:`);
    console.log(`      • Text-to-Text (TTT):       ${tttCount} / ${langs.length} languages`);
    console.log(`      • Text-to-Speech (TTS):     ${ttsCount} / ${langs.length} languages`);
    console.log(`      • Speech-to-Text (STT):     ${sttCount} / ${langs.length} languages`);
    console.log(`      • Full Speech-to-Speech:    ${stsCount} / ${langs.length} languages`);
    
    const sample = langs.find(l => l.code === 'spanish-international');
    console.log(`   🔎 Sample parsed capability for '${sample?.name}' (${sample?.code}):`, parseLanguageCapabilities(sample));
  } catch (err: any) {
    console.error('❌ [TEST 1 FAILED] Language fetch failed:', err.message);
  }

  // TEST 2: Text-to-Text (TTT) Translation
  console.log('\n📍 [TEST 2] Testing TTT (Text-to-Text) Translation...');
  const testPhrases = [
    { text: 'Welcome to the future of live network broadcasting.', target: 'spanish-international', name: 'Spanish' },
    { text: 'Welcome to the future of live network broadcasting.', target: 'french-france', name: 'French' },
    { text: 'Welcome to the future of live network broadcasting.', target: 'japanese', name: 'Japanese' },
    { text: 'Welcome to the future of live network broadcasting.', target: 'german-germany', name: 'German' }
  ];

  for (const t of testPhrases) {
    try {
      const res = await executeWwtcService({
        serviceCode: 'ttt',
        sourceLang: 'english-united-states',
        targetLang: t.target,
        text: t.text
      });
      console.log(`   ✅ [EN ➔ ${t.name}]: "${res.translated_text}"`);
    } catch (err: any) {
      console.error(`   ❌ [EN ➔ ${t.name} FAILED]:`, err.message);
    }
  }

  // TEST 3: Text-to-Speech (TTS) Voice Synthesis
  console.log('\n📍 [TEST 3] Testing TTS (Text-to-Speech) Voice Synthesis...');
  try {
    const ttsText = 'Your broadcast is now live across the network.';
    const res = await executeWwtcService({
      serviceCode: 'tts',
      sourceLang: 'english-united-states',
      targetLang: 'spanish-international',
      text: ttsText
    });
    console.log(`   ✅ Original Text:   "${res.source_text}"`);
    console.log(`   ✅ Translated Text: "${res.translated_text}"`);
    if (res.audio && res.audio.length > 0) {
      console.log(`   ✅ Audio Generated: Base64 WAV stream (${res.audio.length} chars, ~${Math.round(res.audio.length * 0.75 / 1024)} KB)`);
      // Verify Base64 starts with RIFF header (UklGR in base64)
      if (res.audio.startsWith('UklGR')) {
        console.log(`   ✅ Audio Format: Valid RIFF WAV header detected!`);
      }
    } else {
      console.warn(`   ⚠️ Warning: Audio payload was empty.`);
    }
  } catch (err: any) {
    console.error('❌ [TEST 3 FAILED] TTS failed:', err.message);
  }

  // TEST 4: Speech-to-Speech / Speech-to-Text with 16kHz WAV Audio
  console.log('\n📍 [TEST 4] Testing Speech Service with 16kHz Mono WAV audio payload...');
  try {
    const wavBuffer = createSynthetic16kWavBuffer(1.5, 440);
    const audioBlob = new Blob([wavBuffer], { type: 'audio/wav' });

    console.log(`   📦 Created synthetic 16kHz mono WAV (${wavBuffer.length} bytes)`);
    console.log(`   🚀 Sending to STT endpoint...`);

    const sttRes = await executeWwtcService({
      serviceCode: 'stt',
      sourceLang: 'english-united-states',
      targetLang: 'spanish-international',
      audioBlob
    });

    console.log(`   ✅ STT Response Received:`, sttRes);
  } catch (err: any) {
    console.log(`   ℹ️ STT Endpoint response: ${err.message} (Synthetic tone test)`);
  }

  console.log('\n====================================================');
  console.log('🎉 WWTC TEST SUITE EXECUTION COMPLETED');
  console.log('====================================================\n');
}

runSuite();
