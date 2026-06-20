import { useState, useEffect, useRef } from 'react';
import { getWwtcLanguages, translateText, type WwtcLanguage } from '../../lib/wwtc';
import { 
  Languages, Copy, Check, Volume2, VolumeX, Play, Pause, 
  Loader2, AlertCircle, RefreshCw, ArrowRightLeft, Globe
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
  const [serviceMode, setServiceMode] = useState<'ttt' | 'tts'>('tts');

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

  const fetchLanguages = async () => {
    setLoadingLangs(true);
    setLangError(null);
    try {
      const data = await getWwtcLanguages();
      // Sort alphabetically
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setLanguages(sorted);
    } catch (err: any) {
      setLangError(err.message || 'Failed to load languages.');
    } finally {
      setLoadingLangs(false);
    }
  };

  // Handle translation
  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsTranslating(true);
    setTranslateError(null);
    setTranslatedText('');
    setAudioBase64(null);
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const result = await translateText({
        text: inputText,
        sourceLang,
        targetLang,
        serviceCode: serviceMode
      });

      if (result.translated_text) {
        setTranslatedText(result.translated_text);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800' }}>
            <Languages size={36} color={accent} /> WWTC Translation Center
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>
            Interactive translation testbench powered by Worldwide Tech Connections REST API.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
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
          <button onClick={fetchLanguages} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: accent, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
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
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '10px' }}>Service Mode</label>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setServiceMode('tts')}
                    style={{
                      flex: 1, padding: '10px 14px', border: 'none', borderRadius: '8px',
                      background: serviceMode === 'tts' ? accent : 'transparent',
                      color: serviceMode === 'tts' ? '#fff' : 'var(--text-muted)',
                      fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    Text to Speech (TTS)
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceMode('ttt')}
                    style={{
                      flex: 1, padding: '10px 14px', border: 'none', borderRadius: '8px',
                      background: serviceMode === 'ttt' ? accent : 'transparent',
                      color: serviceMode === 'ttt' ? '#fff' : 'var(--text-muted)',
                      fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    Text to Text (TTT)
                  </button>
                </div>
              </div>

              {/* Language Picker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    {languages.map((l) => (
                      <option key={`src-${l.code}`} value={l.code} style={{ background: '#1c1c1f' }}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap Languages"
                  style={{
                    marginTop: '22px', padding: '10px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', transition: 'all 0.2s'
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
                    {languages.map((l) => (
                      <option key={`tgt-${l.code}`} value={l.code} style={{ background: '#1c1c1f' }}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '8px' }}>Text to Translate</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter sentence or phrase here..."
                  rows={4}
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
                disabled={isTranslating || !inputText.trim()}
                style={{
                  width: '100%', padding: '14px 20px', background: isTranslating ? 'rgba(255,255,255,0.05)' : accent,
                  color: isTranslating ? 'var(--text-muted)' : '#fff', border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '800', cursor: (isTranslating || !inputText.trim()) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: (isTranslating || !inputText.trim()) ? 'none' : `0 4px 15px ${accent}44`,
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => { if (!isTranslating && inputText.trim()) e.currentTarget.style.filter = 'brightness(1.15)'; }}
                onMouseOut={e => e.currentTarget.style.filter = 'none'}
              >
                {isTranslating ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1.2s linear infinite' }} />
                    Translating...
                  </>
                ) : (
                  'Run Translation'
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
                  </div>
                )}
              </div>

              {translateError && (
                <div style={{ background: 'rgba(255, 59, 48, 0.04)', border: '1px solid rgba(255, 59, 48, 0.1)', borderRadius: '10px', padding: '16px', display: 'flex', gap: '10px', color: '#ff3b30', fontSize: '14px' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>{translateError}</div>
                </div>
              )}

              {translatedText ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Translated Text Bubble */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px 20px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '18px', color: '#fff', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{translatedText}</div>
                    
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
                          onMouseOut={e => e.currentTarget.style.none}
                        >
                          {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                        </button>
                        
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>Audio Translation</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {isPlaying ? 'Playing translated speech...' : 'Click to hear spoken output'}
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
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Enter text on the left and click "Run Translation".</div>
                  </div>
                )
              )}
            </div>

            {/* Bottom details card */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>WWTC Service Information</div>
              <div>• TTS (Text-to-Speech) returns base64 raw WAV audio (PCM 16kHz format).</div>
              <div>• Language code names follow World Wide Tech Connections API standards.</div>
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
