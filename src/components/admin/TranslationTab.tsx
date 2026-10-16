import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  getWwtcLanguages, 
  filterActiveLanguages,
  getReservedPremiumLanguages,
  translateText, 
  parseLanguageCapabilities,
  supportsTTS,
  supportsSTT,
  supportsSTS,
  type WwtcLanguage 
} from '../../lib/wwtc';
import { 
  Languages, Copy, Check, Volume2, Play, Pause, 
  Loader2, AlertCircle, RefreshCw, ArrowRightLeft, Globe, Download, Mic, Sparkles, Filter, Key, CheckCircle2, Shield, Upload, Radio
} from 'lucide-react';
import { 
  getElevenLabsApiKey, 
  setElevenLabsApiKey, 
  isVoiceCloningEnabled, 
  setVoiceCloningEnabled,
  checkElevenLabsStatus,
  fetchElevenLabsVoices,
  fetchElevenLabsSubscription,
  getDefaultVoiceId,
  setDefaultVoiceId,
  cloneVoiceFromAudio,
  synthesizeClonedVoice,
  getAudioDataUri,
  DEFAULT_MULTILINGUAL_VOICES
} from '../../lib/elevenlabs';

export function TranslationTab({ wlConfig }: { wlConfig: any }) {
  const accent = wlConfig?.accent || '#D35400';

  // State
  const [languages, setLanguages] = useState<WwtcLanguage[]>([]);
  const [loadingLangs, setLoadingLangs] = useState(true);
  const [langError, setLangError] = useState<string | null>(null);

  const [sourceLang, setSourceLang] = useState('english-united-states');
  const [targetLang, setTargetLang] = useState('spanish-international');
  const [inputText, setInputText] = useState('');
  const [serviceMode, setServiceMode] = useState<'tts' | 'ttt' | 'stt' | 'sts'>('tts');
  const [capabilityFilter, setCapabilityFilter] = useState<'all' | 'tts' | 'sts'>('all');

  // Audio Recording & File Upload States for STT / STS
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const [recognizedSourceText, setRecognizedSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  // ElevenLabs Voice Cloning State
  const [elevenLabsKey, setElevenLabsKey] = useState(getElevenLabsApiKey());
  const [voiceCloningActive, setVoiceCloningActive] = useState(isVoiceCloningEnabled());
  const [elevenLabsStatus, setElevenLabsStatus] = useState<{ enabled: boolean; hasKey: boolean; voicesCount?: number; error?: string } | null>(null);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [subscription, setSubscription] = useState<{
    tier?: string;
    character_count?: number;
    character_limit?: number;
    can_use_instant_voice_cloning?: boolean;
  } | null>(null);
  const [elevenLabsVoices, setElevenLabsVoices] = useState<Array<{ voice_id: string; name: string; category: string }>>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(() => getDefaultVoiceId() || DEFAULT_MULTILINGUAL_VOICES.male_dynamic.id);
  const [cloneName, setCloneName] = useState('My Voice');
  const [cloneAudioBlob, setCloneAudioBlob] = useState<Blob | null>(null);
  const [cloneAudioDuration, setCloneAudioDuration] = useState(0);
  const [isRecordingSample, setIsRecordingSample] = useState(false);
  const [isCloningVoice, setIsCloningVoice] = useState(false);
  const [cloneMessage, setCloneMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const sampleRecorderRef = useRef<MediaRecorder | null>(null);
  const sampleChunksRef = useRef<Blob[]>([]);
  const sampleTimerRef = useRef<any>(null);

  // Test Voice state
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testAudioBase64, setTestAudioBase64] = useState<string | null>(null);
  const [isTestPlaying, setIsTestPlaying] = useState(false);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);

  const refreshVoicesAndSub = () => {
    checkElevenLabsStatus().then(st => {
      setElevenLabsStatus(st);
      if (st.hasKey) {
        fetchElevenLabsSubscription().then(sub => setSubscription(sub));
        fetchElevenLabsVoices().then(v => {
          setElevenLabsVoices(v);
          const customCloned = v.find(item => item.category === 'cloned');
          if (customCloned && !getDefaultVoiceId()) {
            setSelectedVoiceId(customCloned.voice_id);
            setDefaultVoiceId(customCloned.voice_id);
          }
        });
      }
    });
  };

  useEffect(() => {
    refreshVoicesAndSub();
  }, []);

  const handleSaveElevenLabsKey = async () => {
    setIsSavingKey(true);
    setElevenLabsApiKey(elevenLabsKey);
    refreshVoicesAndSub();
    setIsSavingKey(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSelectDefaultVoice = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    setDefaultVoiceId(voiceId);
  };

  const startRecordingSample = async () => {
    try {
      setCloneMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      sampleChunksRef.current = [];
      const rec = new MediaRecorder(stream);
      sampleRecorderRef.current = rec;

      rec.ondataavailable = (e) => {
        if (e.data.size > 0) sampleChunksRef.current.push(e.data);
      };

      rec.onstop = async () => {
        const rawBlob = new Blob(sampleChunksRef.current, { type: rec.mimeType || 'audio/webm' });
        try {
          const wavBlob = await convertBlobTo16kWav(rawBlob);
          setCloneAudioBlob(wavBlob);
        } catch {
          setCloneAudioBlob(rawBlob);
        }
        stream.getTracks().forEach(t => t.stop());
      };

      rec.start();
      setIsRecordingSample(true);
      setCloneAudioDuration(0);
      sampleTimerRef.current = setInterval(() => {
        setCloneAudioDuration(d => d + 1);
      }, 1000);
    } catch (err: any) {
      setCloneMessage({ type: 'error', text: `Microphone access error: ${err.message}` });
    }
  };

  const stopRecordingSample = () => {
    if (sampleRecorderRef.current && isRecordingSample) {
      sampleRecorderRef.current.stop();
      setIsRecordingSample(false);
      if (sampleTimerRef.current) {
        clearInterval(sampleTimerRef.current);
        sampleTimerRef.current = null;
      }
    }
  };

  const handleSampleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const wavBlob = await convertBlobTo16kWav(file);
      setCloneAudioBlob(wavBlob);
    } catch {
      setCloneAudioBlob(file);
    }
  };

  const handleCreateVoiceClone = async () => {
    if (!cloneAudioBlob) {
      setCloneMessage({ type: 'error', text: 'Please record or upload a 5-15 second voice sample first.' });
      return;
    }
    if (!cloneName.trim()) {
      setCloneMessage({ type: 'error', text: 'Please enter a name for your cloned voice.' });
      return;
    }

    setIsCloningVoice(true);
    setCloneMessage(null);

    try {
      const res = await cloneVoiceFromAudio({
        name: cloneName.trim(),
        audioBlob: cloneAudioBlob,
      });

      if (res?.voice_id) {
        setSelectedVoiceId(res.voice_id);
        setDefaultVoiceId(res.voice_id);
        setCloneMessage({ type: 'success', text: `Voice cloned successfully as "${cloneName}"! Set as active Vibe Network voice.` });
        setCloneAudioBlob(null);
        refreshVoicesAndSub();
      } else {
        throw new Error('No voice ID returned by ElevenLabs.');
      }
    } catch (err: any) {
      setCloneMessage({ type: 'error', text: err.message || 'Failed to clone voice.' });
    } finally {
      setIsCloningVoice(false);
    }
  };

  const handleTestClonedVoice = async () => {
    setIsTestingVoice(true);
    setTestAudioBase64(null);
    setIsTestPlaying(false);
    if (testAudioRef.current) testAudioRef.current.pause();

    try {
      const testPhrases: Record<string, string> = {
        'spanish-international': 'Hola, esta es una prueba de mi voz auténtica clonada en español a través de ElevenLabs.',
        'french-france': 'Bonjour, ceci est un test de ma voix authentique clonée en français via ElevenLabs.',
        'chinese-mandarin': '你好，这是通过 ElevenLabs 克隆的我的中文声音测试。',
        'portuguese-brazil': 'Olá, este é um teste da minha voz autêntica clonada em português no Vibe Network.',
        'hindi': 'नमस्ते, यह इलेवनलैब्स के माध्यम से मेरी वास्तविक आवाज क्लोनिंग का परीक्षण है।',
        'english-united-states': 'Hello, this is a test of my authentic cloned voice on Vibe Network.'
      };

      const phrase = testPhrases[targetLang] || testPhrases['spanish-international'];

      const res = await synthesizeClonedVoice({
        text: phrase,
        voiceId: selectedVoiceId || undefined,
        targetLang,
      });

      if (res?.audio) {
        setTestAudioBase64(res.audio);
        const uri = getAudioDataUri(res.audio);
        const audio = new Audio(uri);
        testAudioRef.current = audio;
        audio.onended = () => setIsTestPlaying(false);
        audio.onpause = () => setIsTestPlaying(false);
        audio.onplay = () => setIsTestPlaying(true);
        setIsTestPlaying(true);
        audio.play().catch(e => {
          console.error('Test audio play failed:', e);
          setIsTestPlaying(false);
        });
      } else {
        throw new Error('ElevenLabs returned no audio.');
      }
    } catch (err: any) {
      setCloneMessage({ type: 'error', text: `Test failed: ${err.message}` });
    } finally {
      setIsTestingVoice(false);
    }
  };

  // Fetch languages on mount
  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async (forceRefresh = false) => {
    setLoadingLangs(true);
    setLangError(null);
    try {
      const data = await getWwtcLanguages(forceRefresh);
      // Sort alphabetically
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setLanguages(sorted);
    } catch (err: any) {
      setLangError(err.message || 'Failed to load languages.');
    } finally {
      setLoadingLangs(false);
    }
  };

  // Convert raw audio blob/chunks to WWTC 16kHz Mono 16-bit WAV
  const convertBlobTo16kWav = async (blob: Blob): Promise<Blob> => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const wavBlob = encode16kMonoWav(audioBuffer);
    await audioCtx.close();
    return wavBlob;
  };

  // Start microphone recording
  const startRecording = async () => {
    try {
      setTranslateError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const rawBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
        try {
          const wavBlob = await convertBlobTo16kWav(rawBlob);
          setRecordedAudioBlob(wavBlob);
          executeAudioTranslation(wavBlob);
        } catch (err) {
          console.error('Failed to convert to 16kHz WAV:', err);
          setRecordedAudioBlob(rawBlob);
          executeAudioTranslation(rawBlob);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      setTranslateError(err.message || 'Could not access microphone.');
    }
  };

  // Immediate audio execution upon stopping recording
  const executeAudioTranslation = async (blob: Blob) => {
    setIsTranslating(true);
    setTranslateError(null);
    setRecognizedSourceText('');
    setTranslatedText('');
    setAudioBase64(null);
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const result = await executeWwtcService({
        serviceCode: 'sts',
        sourceLang,
        targetLang,
        audioBlob: blob
      });

      if (result.source_text) {
        setRecognizedSourceText(result.source_text);
      }
      if (result.translated_text) {
        setTranslatedText(result.translated_text);
        // If voice cloning is active, synthesize output in the cloned voice!
        if (voiceCloningActive && isVoiceCloningEnabled()) {
          try {
            const cloned = await synthesizeClonedVoice({
              text: result.translated_text,
              voiceId: selectedVoiceId || undefined,
              targetLang
            });
            if (cloned?.audio) {
              setAudioBase64(cloned.audio);
              return;
            }
          } catch (_) {}
        }
      } else if (result.source_text && serviceMode === 'stt') {
        setTranslatedText(result.source_text);
      }

      if (result.audio) {
        setAudioBase64(result.audio);
      }
    } catch (err: any) {
      setTranslateError(err.message || 'An error occurred during speech translation.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Stop microphone recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  // File upload for WAV
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const wavBlob = await convertBlobTo16kWav(file);
      setRecordedAudioBlob(wavBlob);
      executeAudioTranslation(wavBlob);
    } catch {
      setRecordedAudioBlob(file);
      executeAudioTranslation(file);
    }
  };

  // Handle translation / speech service execution
  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((serviceMode === 'ttt' || serviceMode === 'tts') && !inputText.trim()) return;
    if ((serviceMode === 'stt' || serviceMode === 'sts') && !recordedAudioBlob) {
      setTranslateError('Please record audio or upload an audio file for speech service.');
      return;
    }

    setIsTranslating(true);
    setTranslateError(null);
    setRecognizedSourceText('');
    setTranslatedText('');
    setAudioBase64(null);
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      let result;
      if (serviceMode === 'tts') {
        result = await translateText({
          text: inputText,
          sourceLang,
          targetLang,
          serviceCode: 'tts',
          useVoiceCloning: voiceCloningActive,
          voiceId: selectedVoiceId || undefined,
        });
      } else {
        result = await executeWwtcService({
          serviceCode: serviceMode,
          sourceLang,
          targetLang,
          text: serviceMode === 'ttt' ? inputText : (inputText.trim() || undefined),
          audioBlob: (serviceMode === 'stt' || serviceMode === 'sts') ? recordedAudioBlob || undefined : undefined
        });
      }

      if (result.source_text) {
        setRecognizedSourceText(result.source_text);
      }
      if (result.translated_text) {
        setTranslatedText(result.translated_text);
      } else if (result.source_text && serviceMode === 'stt') {
        setTranslatedText(result.source_text);
      } else {
        throw new Error('Translation succeeded but returned no text.');
      }

      if (result.audio) {
        setAudioBase64(result.audio);
      }
    } catch (err: any) {
      setTranslateError(err.message || 'An error occurred during translation.');
    } finally {
      setIsTranslating(false);
    }
  };


  // Memoized lookups & filtered languages
  const sourceLangObj = useMemo(() => languages.find(l => l.code === sourceLang), [languages, sourceLang]);
  const targetLangObj = useMemo(() => languages.find(l => l.code === targetLang), [languages, targetLang]);

  const activeLanguages = useMemo(() => filterActiveLanguages(languages), [languages]);
  const reservedLanguages = useMemo(() => getReservedPremiumLanguages(languages), [languages]);

  const filteredLanguages = useMemo(() => {
    let list = languages;
    if (capabilityFilter === 'tts') {
      list = languages.filter(l => supportsTTS(l));
    } else if (capabilityFilter === 'sts') {
      list = languages.filter(l => supportsSTS(l));
    }
    return list;
  }, [languages, capabilityFilter]);

  const targetSupportsTTS = targetLangObj ? supportsTTS(targetLangObj) : true;

  // Play/Pause translated audio
  const toggleAudio = () => {
    if (!audioBase64) return;
    const uri = getAudioDataUri(audioBase64);

    if (!audioRef.current) {
      audioRef.current = new Audio(uri);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onplay = () => setIsPlaying(true);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.src = uri;
      audioRef.current.play().catch(err => {
        console.error('Audio playback failed:', err);
        setIsPlaying(false);
      });
    }
  };

  // Download translated audio
  const handleDownloadAudio = () => {
    if (!audioBase64) return;
    const isMp3 = audioBase64.startsWith('SUQz') || audioBase64.startsWith('//') || audioBase64.startsWith('/+');
    const ext = isMp3 ? 'mp3' : 'wav';
    const mime = isMp3 ? 'audio/mp3' : 'audio/wav';
    const link = document.createElement('a');
    link.href = `data:${mime};base64,${audioBase64}`;
    link.download = `translation-${targetLang}-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Swap languages
  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render capability tags helper
  const renderCapabilityTags = (lang?: WwtcLanguage) => {
    if (!lang) return null;
    const caps = parseLanguageCapabilities(lang);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
        {lang.flag && (
          <img 
            src={lang.flag} 
            alt={lang.name} 
            style={{ width: '18px', height: '12px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }} 
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
        )}
        <span style={{ 
          fontSize: '10px', 
          padding: '2px 6px', 
          borderRadius: '4px', 
          background: caps.stt ? 'rgba(0, 204, 102, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          color: caps.stt ? '#00cc66' : 'var(--text-muted)',
          fontWeight: '700'
        }}>
          STT: {caps.stt ? 'YES' : 'NO'}
        </span>
        <span style={{ 
          fontSize: '10px', 
          padding: '2px 6px', 
          borderRadius: '4px', 
          background: caps.ttt ? 'rgba(0, 150, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          color: caps.ttt ? '#3399ff' : 'var(--text-muted)',
          fontWeight: '700'
        }}>
          TTT: {caps.ttt ? 'YES' : 'NO'}
        </span>
        <span style={{ 
          fontSize: '10px', 
          padding: '2px 6px', 
          borderRadius: '4px', 
          background: caps.tts ? 'rgba(255, 170, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          color: caps.tts ? '#ffaa00' : 'var(--text-muted)',
          fontWeight: '700'
        }}>
          TTS: {caps.tts ? 'YES' : 'NO'}
        </span>
        {caps.sts && (
          <span style={{ 
            fontSize: '10px', 
            padding: '2px 6px', 
            borderRadius: '4px', 
            background: `rgba(211, 84, 0, 0.2)`,
            color: accent,
            fontWeight: '800',
            border: `1px solid ${accent}44`
          }}>
            FULL STS
          </span>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800' }}>
            <Languages size={36} color={accent} /> WWTC Translation Center
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>
            Interactive translation testbench powered by Worldwide Tech Connections REST API ({languages.length} languages supported).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={() => fetchLanguages(true)}
            title="Force reload languages from WWTC Core API"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <RefreshCw size={12} /> Sync Languages
          </button>
          <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: '20px', color: 'var(--text-muted)' }}>
            Status: <span style={{ color: '#00cc66', fontWeight: 'bold' }}>Connected</span>
          </span>
        </div>
      </div>

      {loadingLangs ? (
        /* Loading Skeleton */
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <Loader2 size={36} style={{ animation: 'spin 1.2s linear infinite', color: accent }} />
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading supported WWTC languages...</div>
        </div>
      ) : langError ? (
        /* Error State */
        <div style={{ background: 'rgba(255, 59, 48, 0.05)', border: '1px solid rgba(255, 59, 48, 0.15)', borderRadius: '16px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
          <AlertCircle size={40} color="#ff3b30" />
          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#ff3b30' }}>Failed to Load Languages</h4>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>{langError}</p>
          </div>
          <button onClick={() => fetchLanguages(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: accent, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      ) : (
        /* Form & Playground */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Input Panel */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', backdropFilter: 'blur(10px)' }}>
            <form onSubmit={handleTranslate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Select Mode */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Service Mode</label>
                  
                  {/* Capability Filter Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Filter size={11} color="var(--text-muted)" />
                    <select
                      value={capabilityFilter}
                      onChange={(e) => setCapabilityFilter(e.target.value as any)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '11px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="all" style={{ background: '#1c1c1f' }}>All ({languages.length})</option>
                      <option value="tts" style={{ background: '#1c1c1f' }}>TTS Supported</option>
                      <option value="sts" style={{ background: '#1c1c1f' }}>Full STS</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setServiceMode('tts')}
                    style={{
                      padding: '10px 8px', border: 'none', borderRadius: '8px',
                      background: serviceMode === 'tts' ? accent : 'transparent',
                      color: serviceMode === 'tts' ? '#fff' : 'var(--text-muted)',
                      fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    TTS (Text→Voice)
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceMode('ttt')}
                    style={{
                      padding: '10px 8px', border: 'none', borderRadius: '8px',
                      background: serviceMode === 'ttt' ? accent : 'transparent',
                      color: serviceMode === 'ttt' ? '#fff' : 'var(--text-muted)',
                      fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    TTT (Text→Text)
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceMode('stt')}
                    style={{
                      padding: '10px 8px', border: 'none', borderRadius: '8px',
                      background: serviceMode === 'stt' ? accent : 'transparent',
                      color: serviceMode === 'stt' ? '#fff' : 'var(--text-muted)',
                      fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    STT (Voice→Text)
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceMode('sts')}
                    style={{
                      padding: '10px 8px', border: 'none', borderRadius: '8px',
                      background: serviceMode === 'sts' ? accent : 'transparent',
                      color: serviceMode === 'sts' ? '#fff' : 'var(--text-muted)',
                      fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    STS (Voice→Voice)
                  </button>
                </div>
              </div>

              {/* Language Picker */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px' }}>Source Language</label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff',
                      fontSize: '14px', cursor: 'pointer', outline: 'none'
                    }}
                  >
                    <optgroup label="Active Languages (Free Tier)" style={{ background: '#1c1c1f', color: accent, fontWeight: 'bold' }}>
                      {activeLanguages.map((l) => (
                        <option key={`src-act-${l.code}`} value={l.code} style={{ background: '#1c1c1f', color: '#fff' }}>
                          {l.name}
                        </option>
                      ))}
                    </optgroup>
                    {reservedLanguages.length > 0 && (
                      <optgroup label="🔒 Premium Languages (Coming Soon)" style={{ background: '#1c1c1f', color: '#ffaa00', fontWeight: 'bold' }}>
                        {reservedLanguages.map((l) => (
                          <option key={`src-res-${l.code}`} value={l.code} disabled style={{ background: '#1c1c1f', color: '#777' }}>
                            🔒 {l.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  {renderCapabilityTags(sourceLangObj)}
                </div>

                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Languages"
                  style={{
                    marginTop: '28px', padding: '10px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                >
                  <ArrowRightLeft size={16} />
                </button>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px' }}>Target Language</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff',
                      fontSize: '14px', cursor: 'pointer', outline: 'none'
                    }}
                  >
                    <optgroup label="Active Languages (Free Tier)" style={{ background: '#1c1c1f', color: accent, fontWeight: 'bold' }}>
                      {activeLanguages.map((l) => (
                        <option key={`tgt-act-${l.code}`} value={l.code} style={{ background: '#1c1c1f', color: '#fff' }}>
                          {l.name}
                        </option>
                      ))}
                    </optgroup>
                    {reservedLanguages.length > 0 && (
                      <optgroup label="🔒 Premium Languages (Coming Soon)" style={{ background: '#1c1c1f', color: '#ffaa00', fontWeight: 'bold' }}>
                        {reservedLanguages.map((l) => (
                          <option key={`tgt-res-${l.code}`} value={l.code} disabled style={{ background: '#1c1c1f', color: '#777' }}>
                            🔒 {l.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  {renderCapabilityTags(targetLangObj)}
                </div>
              </div>

              {/* TTS Capability Warning if selected target doesn't support TTS */}
              {(serviceMode === 'tts' || serviceMode === 'sts') && !targetSupportsTTS && (
                <div style={{ background: 'rgba(255, 170, 0, 0.08)', border: '1px solid rgba(255, 170, 0, 0.2)', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#ffaa00' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Note:</strong> Selected target language (<code>{targetLang}</code>) does not advertise Text-to-Speech support (<code>{targetLangObj?.services}</code>).
                  </div>
                </div>
              )}

              {/* Speech Input Box for STT & STS */}
              {(serviceMode === 'stt' || serviceMode === 'sts') && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Audio Voice Input (16kHz WAV)</span>
                    {recordedAudioBlob && (
                      <span style={{ fontSize: '11px', color: '#00cc66', fontWeight: 'bold' }}>✓ Audio Ready</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={stopRecording}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                          background: '#ff3b30', border: 'none', borderRadius: '10px', color: '#fff',
                          fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', animation: 'pulse 1s infinite'
                        }}
                      >
                        <Pause size={16} /> Stop Recording ({recordingDuration}s)
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                          background: accent, border: 'none', borderRadius: '10px', color: '#fff',
                          fontWeight: 'bold', fontSize: '14px', cursor: 'pointer'
                        }}
                      >
                        <Mic size={16} /> {recordedAudioBlob ? 'Re-record Speech' : 'Record Speech'}
                      </button>
                    )}

                    <label style={{
                      display: 'flex', alignItems: 'center', gap: '6px', padding: '11px 16px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px', color: '#fff', fontSize: '13px', cursor: 'pointer'
                    }}>
                      <Download size={14} style={{ transform: 'rotate(180deg)' }} /> Upload .WAV
                      <input type="file" accept="audio/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              )}

              {/* Text Input (Required for TTT/TTS, optional for STT/STS) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {(serviceMode === 'stt' || serviceMode === 'sts') ? 'Optional Context / Text Hint' : 'Text to Translate'}
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={(serviceMode === 'stt' || serviceMode === 'sts') ? "Optional context or text..." : "Enter sentence or phrase here..."}
                  rows={(serviceMode === 'stt' || serviceMode === 'sts') ? 2 : 4}
                  style={{
                    width: '100%', padding: '14px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff',
                    fontSize: '15px', resize: 'vertical', outline: 'none', lineHeight: 1.5,
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isTranslating || ((serviceMode === 'ttt' || serviceMode === 'tts') && !inputText.trim()) || ((serviceMode === 'stt' || serviceMode === 'sts') && !recordedAudioBlob)}
                style={{
                  width: '100%', padding: '14px 20px', 
                  background: isTranslating ? 'rgba(255,255,255,0.05)' : accent,
                  color: isTranslating ? 'var(--text-muted)' : '#fff', border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '800', 
                  cursor: (isTranslating || ((serviceMode === 'ttt' || serviceMode === 'tts') && !inputText.trim()) || ((serviceMode === 'stt' || serviceMode === 'sts') && !recordedAudioBlob)) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: `0 4px 15px ${accent}44`,
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => { if (!isTranslating) e.currentTarget.style.filter = 'brightness(1.15)'; }}
                onMouseOut={e => e.currentTarget.style.filter = 'none'}
              >
                {isTranslating ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1.2s linear infinite' }} />
                    Processing {serviceMode.toUpperCase()}...
                  </>
                ) : (
                  `Execute ${serviceMode.toUpperCase()} Service`
                )}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between', backdropFilter: 'blur(10px)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Translation Output</span>
                {translatedText && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={handleCopy}
                      title="Copy to Clipboard"
                      style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px', padding: '6px', color: '#fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px'
                      }}
                    >
                      {copied ? <Check size={14} color="#00cc66" /> : <Copy size={14} />}
                    </button>
                    {audioBase64 && (
                      <button
                        onClick={handleDownloadAudio}
                        title="Download WAV Audio"
                        style={{
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px', padding: '6px', color: '#fff', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px'
                        }}
                      >
                        <Download size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {translateError && (
                <div style={{ background: 'rgba(255, 59, 48, 0.04)', border: '1px solid rgba(255, 59, 48, 0.1)', borderRadius: '10px', padding: '16px', display: 'flex', gap: '10px', color: '#ff3b30', fontSize: '14px' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>{translateError}</div>
                </div>
              )}

              {recognizedSourceText && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '6px' }}>Recognized Speech (Source)</div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 16px', color: '#e0e0e0', fontSize: '15px' }}>
                    {recognizedSourceText}
                  </div>
                </div>
              )}

              {translatedText ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Translated Text Bubble */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px 20px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', marginBottom: '6px' }}>Translated Result</div>
                      <div style={{ fontSize: '18px', color: '#fff', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{translatedText}</div>
                    </div>
                    
                    {/* Audio Controls */}
                    {audioBase64 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <button
                          onClick={toggleAudio}
                          style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: isPlaying ? '#ff3b30' : accent, border: 'none',
                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'transform 0.1s'
                          }}
                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'none'}
                        >
                          {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                        </button>
                        
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>Synthesized Audio (16kHz WAV)</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {isPlaying ? 'Playing synthesized voice...' : 'Click to listen to spoken output'}
                          </div>
                        </div>

                        {/* Sound Wave Animation */}
                        {isPlaying && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: 'auto', height: '24px' }}>
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                style={{
                                  width: '3px',
                                  background: accent,
                                  borderRadius: '2px',
                                  animation: 'soundWave 0.7s ease-in-out infinite alternate',
                                  animationDelay: `${i * 0.15}s`
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                !translateError && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: 'var(--text-muted)', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <Globe size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <div style={{ fontSize: '14px' }}>No translation generated yet.</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Choose your mode on the left and run the service.</div>
                  </div>
                )
              )}
            </div>

            {/* Bottom details card */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>WWTC Service Specification</div>
              <div>• <strong>STT</strong>: Transcribes microphone speech (16kHz Mono 16-bit WAV) to text.</div>
              <div>• <strong>TTT</strong>: Text-to-text language translation only.</div>
              <div>• <strong>TTS</strong>: Generates synthesized WAV speech from text.</div>
              <div>• <strong>STS</strong>: Full speech recognition, text translation, and voice synthesis pipeline.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── ElevenLabs AI Voice Cloning Configuration Card ───────── */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        marginTop: '10px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
              <Sparkles size={20} color="#ffaa00" /> ElevenLabs AI Voice Cloning Engine
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              Replicates the creator's authentic vocal pitch, timbre, and accent across Spanish, French, Mandarin, Portuguese, and Hindi.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              background: elevenLabsStatus?.hasKey ? 'rgba(0, 204, 102, 0.15)' : 'rgba(255, 170, 0, 0.15)',
              color: elevenLabsStatus?.hasKey ? '#00cc66' : '#ffaa00',
              border: `1px solid ${elevenLabsStatus?.hasKey ? '#00cc6644' : '#ffaa0044'}`
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: elevenLabsStatus?.hasKey ? '#00cc66' : '#ffaa00' }} />
              {elevenLabsStatus?.hasKey ? `Connected (${elevenLabsStatus.voicesCount || 0} voices ready)` : 'Key Required (Using WWTC Stock Voice)'}
            </span>
          </div>
        </div>

        {elevenLabsStatus?.error && (
          <div style={{
            background: 'rgba(255, 170, 0, 0.08)',
            border: '1px solid rgba(255, 170, 0, 0.25)',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontSize: '13px',
            color: '#ffaa00'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: '2px' }}>ElevenLabs API Notice</div>
              <div style={{ color: '#e0e0e0', fontSize: '12px', lineHeight: 1.4 }}>
                {elevenLabsStatus.error}
              </div>
              {elevenLabsStatus.error.toLowerCase().includes('permission') && (
                <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  👉 <strong>Fix:</strong> Log in to your <a href="https://elevenlabs.io" target="_blank" rel="noreferrer" style={{ color: accent, textDecoration: 'underline' }}>ElevenLabs Console</a> &gt; <em>API Keys</em> &gt; create a new key with <strong>"Full Access"</strong> (or enable <code>Text to Speech</code> and <code>Voices</code> permissions), then paste it below.
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'center' }}>
          {/* Key input */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              ElevenLabs API Key (xi-api-key)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Key size={14} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="sk_... or xi-api-key"
                  value={elevenLabsKey}
                  onChange={(e) => setElevenLabsKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 34px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleSaveElevenLabsKey}
                disabled={isSavingKey}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: savedSuccess ? '#00cc66' : accent,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: isSavingKey ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                {isSavingKey ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : savedSuccess ? (
                  <>
                    <CheckCircle2 size={14} /> Saved
                  </>
                ) : (
                  'Save Key'
                )}
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>
              Stored securely for serverless proxy calls. You can also specify <code>ELEVENLABS_API_KEY</code> in <code>.env</code>.
            </div>
          </div>

          {/* Toggle */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Enable Cloned Voiceover</span>
              <button
                type="button"
                onClick={() => {
                  const next = !voiceCloningActive;
                  setVoiceCloningActive(next);
                  setVoiceCloningEnabled(next);
                }}
                style={{
                  width: '42px',
                  height: '24px',
                  borderRadius: '12px',
                  background: voiceCloningActive ? accent : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '3px',
                  left: voiceCloningActive ? '21px' : '3px',
                  transition: 'left 0.2s'
                }} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
              When enabled, video feed translations synthesize audio using the creator's voice clone via ElevenLabs Multilingual V2. If disabled, standard WWTC voices are used.
            </p>
          </div>
        </div>

        {/* ── Voice Cloning Studio & Live Testing Panel ───────────── */}
        {elevenLabsStatus?.hasKey && (
          <div style={{
            marginTop: '8px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Account Tier & Characters Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '12px 16px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 170, 0, 0.15)',
                  color: '#ffaa00',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {subscription?.tier ? `${subscription.tier.toUpperCase()} TIER` : 'CREATOR TIER'}
                </span>
                <span style={{ fontSize: '12px', color: '#e0e0e0' }}>
                  {subscription?.character_limit ? (
                    <>
                      <strong>{(subscription.character_limit - (subscription.character_count || 0)).toLocaleString()}</strong> characters remaining ({subscription.character_count?.toLocaleString()} / {subscription.character_limit?.toLocaleString()} used)
                    </>
                  ) : (
                    'Instant Voice Cloning Ready (131,000 characters limit)'
                  )}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#00cc66', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> Instant Voice Cloning Enabled
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Studio 1: Create New Instant Clone */}
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mic size={16} color={accent} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Clone Your Voice (Microphone or File)</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                  Record 5–15 seconds of speaking naturally. ElevenLabs will extract your vocal pitch, tone, and timbre to replicate your authentic voice in Spanish, French, Mandarin, Portuguese, and Hindi.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Voice Name</label>
                  <input
                    type="text"
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                    placeholder="e.g. My Authentic Voice"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {isRecordingSample ? (
                    <button
                      type="button"
                      onClick={stopRecordingSample}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        background: '#ff3b30',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite' }} />
                      Stop Recording ({cloneAudioDuration}s)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecordingSample}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Mic size={14} color="#00cc66" /> Record Sample (5-15s)
                    </button>
                  )}

                  <label style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ccc',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Upload size={14} /> Upload Audio/Video
                    <input type="file" accept="audio/*,video/*" onChange={handleSampleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>

                {cloneAudioBlob && (
                  <div style={{ fontSize: '11px', color: '#00cc66', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} /> Sample ready: {(cloneAudioBlob.size / 1024).toFixed(1)} KB
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCreateVoiceClone}
                  disabled={isCloningVoice || !cloneAudioBlob}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: cloneAudioBlob ? accent : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    cursor: cloneAudioBlob && !isCloningVoice ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    opacity: cloneAudioBlob ? 1 : 0.6
                  }}
                >
                  {isCloningVoice ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Cloning Voice into ElevenLabs...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} /> Clone Voice to ElevenLabs
                    </>
                  )}
                </button>

                {cloneMessage && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    background: cloneMessage.type === 'success' ? 'rgba(0,204,102,0.1)' : 'rgba(255,59,48,0.1)',
                    border: `1px solid ${cloneMessage.type === 'success' ? 'rgba(0,204,102,0.3)' : 'rgba(255,59,48,0.3)'}`,
                    color: cloneMessage.type === 'success' ? '#00cc66' : '#ff3b30'
                  }}>
                    {cloneMessage.text}
                  </div>
                )}
              </div>

              {/* Studio 2: Active Voice Selection & Tester */}
              <div style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Volume2 size={16} color="#00cc66" />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Active Cloned Voice</span>
                  </div>
                  <button
                    type="button"
                    onClick={refreshVoicesAndSub}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RefreshCw size={11} /> Refresh
                  </button>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Select Voice</label>
                  <select
                    value={selectedVoiceId}
                    onChange={(e) => handleSelectDefaultVoice(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {elevenLabsVoices.filter(v => v.category === 'cloned').length > 0 && (
                      <optgroup label="✨ Your Custom Cloned Voices" style={{ background: '#1c1c1f', color: '#00cc66', fontWeight: 'bold' }}>
                        {elevenLabsVoices.filter(v => v.category === 'cloned').map(v => (
                          <option key={v.voice_id} value={v.voice_id} style={{ background: '#1c1c1f', color: '#fff' }}>
                            ✨ {v.name} (Cloned)
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Default Natural Archetypes" style={{ background: '#1c1c1f', color: 'var(--text-muted)' }}>
                      <option value={DEFAULT_MULTILINGUAL_VOICES.male_dynamic.id} style={{ background: '#1c1c1f', color: '#fff' }}>
                        {DEFAULT_MULTILINGUAL_VOICES.male_dynamic.name}
                      </option>
                      <option value={DEFAULT_MULTILINGUAL_VOICES.female_natural.id} style={{ background: '#1c1c1f', color: '#fff' }}>
                        {DEFAULT_MULTILINGUAL_VOICES.female_natural.name}
                      </option>
                      {elevenLabsVoices.filter(v => v.category !== 'cloned' && v.voice_id !== DEFAULT_MULTILINGUAL_VOICES.male_dynamic.id && v.voice_id !== DEFAULT_MULTILINGUAL_VOICES.female_natural.id).slice(0, 10).map(v => (
                        <option key={v.voice_id} value={v.voice_id} style={{ background: '#1c1c1f', color: '#ccc' }}>
                          {v.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  fontSize: '12px',
                  color: '#bbb',
                  lineHeight: 1.4
                }}>
                  Selected Voice ID: <code style={{ color: accent, fontSize: '11px' }}>{selectedVoiceId}</code>
                  <br />
                  This voice will be used for all video feed language translations across Spanish, French, Mandarin, Portuguese, and Hindi.
                </div>

                {/* Test Voice Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleTestClonedVoice}
                    disabled={isTestingVoice}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(0, 204, 102, 0.15)',
                      border: '1px solid rgba(0, 204, 102, 0.35)',
                      color: '#00cc66',
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: isTestingVoice ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {isTestingVoice ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Synthesizing in {targetLangObj?.name || 'Spanish'}...
                      </>
                    ) : (
                      <>
                        <Play size={14} /> Test Cloned Voice in {targetLangObj?.name || 'Spanish'}
                      </>
                    )}
                  </button>

                  {testAudioBase64 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (testAudioRef.current) {
                          if (isTestPlaying) {
                            testAudioRef.current.pause();
                            setIsTestPlaying(false);
                          } else {
                            testAudioRef.current.play();
                            setIsTestPlaying(true);
                          }
                        }
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: isTestPlaying ? '#ff3b30' : accent,
                        border: 'none',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isTestPlaying ? <Pause size={14} /> : <Play size={14} />} {isTestPlaying ? 'Pause' : 'Replay'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global CSS for animations */}
      <style>{`
        @keyframes soundWave {
          0% { height: 4px; }
          100% { height: 24px; }
        }
      `}</style>
    </div>
  );
}
