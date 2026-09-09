import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  getWwtcLanguages, 
  translateText, 
  parseLanguageCapabilities,
  supportsTTS,
  supportsSTT,
  supportsSTS,
  type WwtcLanguage 
} from '../../lib/wwtc';
import { 
  Languages, Copy, Check, Volume2, Play, Pause, 
  Loader2, AlertCircle, RefreshCw, ArrowRightLeft, Globe, Download, Mic, Sparkles, Filter
} from 'lucide-react';

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

  // Audio Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        serviceCode: serviceMode,
        sourceLang,
        targetLang,
        audioBlob: blob
      });

      if (result.source_text) {
        setRecognizedSourceText(result.source_text);
      }
      if (result.translated_text) {
        setTranslatedText(result.translated_text);
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
      const result = await executeWwtcService({
        serviceCode: serviceMode,
        sourceLang,
        targetLang,
        text: (serviceMode === 'ttt' || serviceMode === 'tts') ? inputText : (inputText.trim() || undefined),
        audioBlob: (serviceMode === 'stt' || serviceMode === 'sts') ? recordedAudioBlob || undefined : undefined
      });

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

  const filteredLanguages = useMemo(() => {
    if (capabilityFilter === 'tts') {
      return languages.filter(l => supportsTTS(l));
    }
    if (capabilityFilter === 'sts') {
      return languages.filter(l => supportsSTS(l));
    }
    return languages;
  }, [languages, capabilityFilter]);

  const targetSupportsTTS = targetLangObj ? supportsTTS(targetLangObj) : true;

  // Play/Pause translated audio
  const toggleAudio = () => {
    if (!audioBase64) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(`data:audio/wav;base64,${audioBase64}`);
      audioRef.current.onEnded = () => setIsPlaying(false);
      audioRef.current.onPause = () => setIsPlaying(false);
      audioRef.current.onPlay = () => setIsPlaying(true);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.src = `data:audio/wav;base64,${audioBase64}`;
      audioRef.current.play().catch(err => {
        console.error('Audio playback failed:', err);
        setIsPlaying(false);
      });
    }
  };

  // Download translated audio WAV
  const handleDownloadAudio = () => {
    if (!audioBase64) return;
    const link = document.createElement('a');
    link.href = `data:audio/wav;base64,${audioBase64}`;
    link.download = `wwtc-translation-${targetLang}-${Date.now()}.wav`;
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
                    {filteredLanguages.map((l) => (
                      <option key={`src-${l.code}`} value={l.code} style={{ background: '#1c1c1f' }}>
                        {l.name}
                      </option>
                    ))}
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
                    {filteredLanguages.map((l) => (
                      <option key={`tgt-${l.code}`} value={l.code} style={{ background: '#1c1c1f' }}>
                        {l.name}
                      </option>
                    ))}
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
