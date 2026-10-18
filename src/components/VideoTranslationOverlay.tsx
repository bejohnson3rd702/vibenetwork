import React, { useState, useEffect, useRef } from 'react';
import { 
  getWwtcLanguages, 
  filterActiveLanguages,
  getReservedPremiumLanguages,
  translateText, 
  batchPrefetchTranslations,
  fetchYouTubeCaptions, 
  supportsTTS,
  prewarmActiveLanguagesTTS,
  prewarmVideoDialogue,
  getCachedTranslation,
  isTranslationCached,
  getAudioDataUri,
  getActiveCaptionSlice,
  type WwtcLanguage, 
  type YouTubeCaptionSegment 
} from '../lib/wwtc';
import { Globe, Volume2, VolumeX, Sparkles, Loader2 } from 'lucide-react';

interface VideoTranslationOverlayProps {
  videoUrl: string;
  videoId?: string;
  currentTime?: number;
  accent?: string;
  onMuteVideo?: (mute: boolean) => void;
  style?: React.CSSProperties;
}

export const VideoTranslationOverlay: React.FC<VideoTranslationOverlayProps> = ({
  videoUrl,
  videoId,
  currentTime = 0,
  accent = '#ff4d85',
  onMuteVideo,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalTime, setInternalTime] = useState<number>(0);

  // Extract YouTube ID from any YouTube URL format (watch, shorts, live, embed, youtu.be)
  const resolvedId = React.useMemo(() => {
    if (videoId && videoId.length === 11) return videoId;
    const match = (videoUrl || '').match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return (match && match[1]?.length === 11) ? match[1] : (videoId || '');
  }, [videoUrl, videoId]);

  const [languages, setLanguages] = useState<WwtcLanguage[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>('english-united-states');
  const [transcript, setTranscript] = useState<YouTubeCaptionSegment[]>([]);
  const [translatedSegments, setTranslatedSegments] = useState<Record<number, string>>({});
  const [loadingTranscript, setLoadingTranscript] = useState<boolean>(false);
  const [translating, setTranslating] = useState<boolean>(false);
  const [enableVoiceover, setEnableVoiceover] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const voiceoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const playedSegmentIndices = useRef<Set<number>>(new Set());
  const lastSegmentIndex = useRef<number>(-1);
  const preloadedAudioRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Synchronize playback time automatically from YouTube iframes or HTML5 video
  useEffect(() => {
    // 1. Listen for postMessage from YouTube iframe with enablejsapi=1
    const handleMsg = (e: MessageEvent) => {
      try {
        let data = e.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (_) {
            return;
          }
        }
        if (data && typeof data === 'object') {
          const curTime = data.info?.currentTime ?? data.currentTime;
          if (typeof curTime === 'number') {
            setInternalTime(curTime);
          }
        }
      } catch (_) {}
    };
    window.addEventListener('message', handleMsg);

    // 2. Query iframe periodically to activate listening (100ms for high responsiveness)
    const timer = setInterval(() => {
      const parent = containerRef.current?.parentElement;
      const iframe = parent?.querySelector('iframe') || document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1 }), '*');
          iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'getCurrentTime', args: [] }), '*');
        } catch (_) {}
      }
    }, 100);

    // 3. Listen to native HTML5 video element if present
    const parent = containerRef.current?.parentElement;
    const vid = parent?.querySelector('video');
    const onTimeUpdate = () => {
      if (vid) setInternalTime(vid.currentTime);
    };
    if (vid) {
      vid.addEventListener('timeupdate', onTimeUpdate);
    }

    return () => {
      window.removeEventListener('message', handleMsg);
      clearInterval(timer);
      if (vid) {
        vid.removeEventListener('timeupdate', onTimeUpdate);
      }
    };
  }, []);

  const activeTime = currentTime > 0 ? currentTime : internalTime;

  // Load WWTC languages
  useEffect(() => {
    getWwtcLanguages()
      .then(langs => {
        if (Array.isArray(langs)) {
          setLanguages(langs.sort((a, b) => a.name.localeCompare(b.name)));
        }
      })
      .catch(err => console.warn('[VideoTranslationOverlay] Languages load warning:', err));
  }, []);

  // Fetch Transcript when video changes
  useEffect(() => {
    if (!resolvedId) {
      setTranscript([]);
      return;
    }

    let isMounted = true;
    setLoadingTranscript(true);
    setStatusMessage('⌛ Loading captions for translation...');

    fetchYouTubeCaptions(resolvedId)
      .then(segments => {
        if (!isMounted) return;
        if (Array.isArray(segments) && segments.length > 0) {
          setTranscript(segments);
          setStatusMessage(`Ready (${segments.length} captions)`);
          prewarmVideoDialogue(segments);
        } else {
          setTranscript([]);
          setStatusMessage('');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        console.warn('[VideoTranslationOverlay] Caption fetch notice:', err.message);
        setTranscript([]);
        setStatusMessage('');
      })
      .finally(() => {
        if (isMounted) setLoadingTranscript(false);
      });

    return () => {
      isMounted = false;
    };
  }, [resolvedId]);

  // Translate active segment on demand if a target language is chosen
  const currentSegmentIndex = React.useMemo(() => {
    if (!transcript || transcript.length === 0) return -1;
    for (let i = 0; i < transcript.length; i++) {
      const seg = transcript[i];
      const nextSeg = transcript[i + 1];
      if (activeTime >= seg.seconds && (!nextSeg || activeTime < nextSeg.seconds)) {
        return i;
      }
    }
    // If activeTime is within initial intro beats before the first dialogue line, show first line
    if (activeTime < transcript[0].seconds && transcript[0].seconds <= 6) {
      return 0;
    }
    return -1;
  }, [transcript, activeTime]);

  const activeSegment = currentSegmentIndex >= 0 ? transcript[currentSegmentIndex] : null;

  // 1. Full-video background prefetcher (populates cache with concurrency 4)
  useEffect(() => {
    if (!transcript || transcript.length === 0 || selectedLang === 'english-united-states') return;

    let isCancelled = false;
    const texts = transcript.map(s => s.text);

    batchPrefetchTranslations({
      texts,
      sourceLang: 'english-united-states',
      targetLang: selectedLang,
      serviceCode: 'ttt',
      concurrency: 4,
      onItemTranslated: (idx, _src, translated) => {
        if (!isCancelled) {
          setTranslatedSegments(prev => ({ ...prev, [`${selectedLang}:${idx}`]: translated }));
        }
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [transcript, selectedLang]);

  // 2. High-priority immediate lookahead around current playback head (next 8 segments)
  useEffect(() => {
    if (!transcript || transcript.length === 0 || selectedLang === 'english-united-states') return;

    const startIdx = Math.max(0, currentSegmentIndex);
    const endIdx = Math.min(transcript.length, startIdx + 8);
    const urgentItems: { index: number; text: string }[] = [];

    for (let i = startIdx; i < endIdx; i++) {
      const key = `${selectedLang}:${i}`;
      if (!translatedSegments[key] && transcript[i]?.text) {
        urgentItems.push({ index: i, text: transcript[i].text });
      }
    }

    if (urgentItems.length === 0) return;

    let isCancelled = false;
    urgentItems.forEach(({ index, text }) => {
      translateText({
        text,
        sourceLang: 'english-united-states',
        targetLang: selectedLang,
        serviceCode: 'ttt'
      }).then(res => {
        if (!isCancelled && res.translated_text) {
          setTranslatedSegments(prev => {
            const key = `${selectedLang}:${index}`;
            if (prev[key]) return prev;
            return { ...prev, [key]: res.translated_text };
          });
        }
      }).catch(err => {
        console.warn(`[VideoTranslationOverlay] Translate ${selectedLang} error:`, err);
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [currentSegmentIndex, transcript, selectedLang]);

  // 3a. Pre-warm upcoming dialogue lines for active languages as playback progresses
  useEffect(() => {
    if (!transcript || transcript.length === 0 || currentSegmentIndex < 0) return;
    const next1 = transcript[currentSegmentIndex + 1];
    const next2 = transcript[currentSegmentIndex + 2];
    if (next1?.text) prewarmActiveLanguagesTTS(next1.text);
    if (next2?.text) prewarmActiveLanguagesTTS(next2.text);
  }, [currentSegmentIndex, transcript]);

  // 3b. Pre-buffer TTS audio for current and upcoming segments (0ms latency voiceover)
  useEffect(() => {
    if (!enableVoiceover || selectedLang === 'english-united-states' || !transcript || transcript.length === 0) return;

    const candidates = [currentSegmentIndex, currentSegmentIndex + 1, currentSegmentIndex + 2];
    candidates.forEach(idx => {
      if (idx >= 0 && idx < transcript.length) {
        const key = `${selectedLang}:${idx}`;
        if (!preloadedAudioRef.current.has(key)) {
          const seg = transcript[idx];
          if (seg && seg.text) {
            const cached = getCachedTranslation({
              text: seg.text,
              sourceLang: 'english-united-states',
              targetLang: selectedLang,
              serviceCode: 'tts',
            });
            if (cached?.audio) {
              const audio = new Audio(getAudioDataUri(cached.audio));
              audio.preload = 'auto';
              preloadedAudioRef.current.set(key, audio);
            } else {
              translateText({
                text: seg.text,
                sourceLang: 'english-united-states',
                targetLang: selectedLang,
                serviceCode: 'tts'
              }).then(res => {
                const b64 = (res as any).audio_base64 || res.audio;
                if (b64) {
                  const audio = new Audio(getAudioDataUri(b64));
                  audio.preload = 'auto';
                  preloadedAudioRef.current.set(key, audio);
                }
              }).catch(() => {});
            }
          }
        }
      }
    });
  }, [currentSegmentIndex, enableVoiceover, selectedLang, transcript]);

  // 4. Instant Voiceover Playback using preloaded audio (0ms latency, zero dead air)
  useEffect(() => {
    const isTranslated = selectedLang !== 'english-united-states';

    if (!isTranslated || !enableVoiceover || !activeSegment) {
      if (voiceoverAudioRef.current) {
        voiceoverAudioRef.current.pause();
        voiceoverAudioRef.current = null;
      }
      if (onMuteVideo) onMuteVideo(false);
      return;
    }

    // Trigger voiceover once per segment
    if (currentSegmentIndex !== lastSegmentIndex.current && !playedSegmentIndices.current.has(currentSegmentIndex)) {
      lastSegmentIndex.current = currentSegmentIndex;
      playedSegmentIndices.current.add(currentSegmentIndex);

      const key = `${selectedLang}:${currentSegmentIndex}`;
      const preloaded = preloadedAudioRef.current.get(key);

      if (preloaded) {
        // Instant 0ms playback: mute native video and play preloaded audio immediately
        if (onMuteVideo) onMuteVideo(true);
        if (voiceoverAudioRef.current) {
          voiceoverAudioRef.current.pause();
        }
        preloaded.currentTime = 0;
        preloaded.volume = 1.0;
        voiceoverAudioRef.current = preloaded;
        preloaded.play().catch(e => console.warn('[VideoTranslationOverlay] Audio autoplay notice:', e));
      } else {
        // Check synchronous cache first
        const cached = getCachedTranslation({
          text: activeSegment.text,
          sourceLang: 'english-united-states',
          targetLang: selectedLang,
          serviceCode: 'tts',
        });
        if (cached?.audio) {
          if (onMuteVideo) onMuteVideo(true);
          if (voiceoverAudioRef.current) {
            voiceoverAudioRef.current.pause();
          }
          const audio = new Audio(getAudioDataUri(cached.audio));
          audio.volume = 1.0;
          voiceoverAudioRef.current = audio;
          preloadedAudioRef.current.set(key, audio);
          audio.play().catch(e => console.warn('[VideoTranslationOverlay] Audio autoplay notice:', e));
        } else {
          // Fallback on-demand TTS: mute native video immediately so it does not overlap
          if (onMuteVideo) onMuteVideo(true);
          translateText({
            text: activeSegment.text,
            sourceLang: 'english-united-states',
            targetLang: selectedLang,
            serviceCode: 'tts'
          })
            .then(res => {
              const b64 = (res as any).audio_base64 || res.audio;
              if (b64) {
                if (onMuteVideo) onMuteVideo(true);
                if (voiceoverAudioRef.current) {
                  voiceoverAudioRef.current.pause();
                }
                const audio = new Audio(getAudioDataUri(b64));
                audio.volume = 1.0;
                voiceoverAudioRef.current = audio;
                preloadedAudioRef.current.set(key, audio);
                audio.play().catch(e => console.warn('[VideoTranslationOverlay] Audio autoplay notice:', e));
              }
            })
            .catch(err => console.warn('[VideoTranslationOverlay] TTS error:', err));
        }
      }
    }
  }, [currentSegmentIndex, selectedLang, enableVoiceover, activeSegment, onMuteVideo]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (voiceoverAudioRef.current) {
        voiceoverAudioRef.current.pause();
        voiceoverAudioRef.current = null;
      }
      if (onMuteVideo) onMuteVideo(false);
    };
  }, [onMuteVideo]);

  const currentKey = `${selectedLang}:${currentSegmentIndex}`;
  const translatedText = translatedSegments[currentKey];
  const isTranslated = selectedLang !== 'english-united-states';

  const activeSubtitleText = activeSegment
    ? (isTranslated && translatedText ? translatedText : activeSegment.text)
    : null;

  // 1-2 sentence subtitle slice synchronized with playback head (replaces paragraph dumps)
  const displayedSubtitleText = React.useMemo(() => {
    if (!activeSubtitleText || !activeSegment) return '';
    const nextSeg = transcript[currentSegmentIndex + 1];
    return getActiveCaptionSlice({
      fullText: activeSubtitleText,
      currentTime: activeTime,
      segmentStart: activeSegment.seconds,
      segmentEnd: nextSeg ? nextSeg.seconds : undefined,
      maxSentences: 2,
      maxWords: 16,
    });
  }, [activeSubtitleText, activeSegment, currentSegmentIndex, transcript, activeTime]);

  return (
    <div ref={containerRef} style={{ pointerEvents: 'none', position: 'relative', width: '100%', height: '100%', ...style }}>
      {/* Top Floating Language Bar */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '12px', 
          right: '12px', 
          zIndex: 40, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(15, 15, 15, 0.85)', 
          backdropFilter: 'blur(12px)', 
          padding: '6px 12px', 
          borderRadius: '100px', 
          border: '1px solid rgba(255, 255, 255, 0.15)', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)', 
          pointerEvents: 'auto' 
        }}
      >
        <Globe size={14} color={selectedLang !== 'english-united-states' ? accent : '#aaa'} />
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff', letterSpacing: '0.2px' }}>
          Translate:
        </span>
        {(() => {
          const activeLanguages = filterActiveLanguages(languages);
          const reservedLanguages = getReservedPremiumLanguages(languages);

          return (
            <select
              value={selectedLang}
              onFocus={() => {
                if (transcript && currentSegmentIndex >= 0) {
                  if (transcript[currentSegmentIndex]?.text) prewarmActiveLanguagesTTS(transcript[currentSegmentIndex].text);
                  if (transcript[currentSegmentIndex + 1]?.text) prewarmActiveLanguagesTTS(transcript[currentSegmentIndex + 1].text);
                }
              }}
              onMouseEnter={() => {
                if (transcript && currentSegmentIndex >= 0) {
                  if (transcript[currentSegmentIndex]?.text) prewarmActiveLanguagesTTS(transcript[currentSegmentIndex].text);
                  if (transcript[currentSegmentIndex + 1]?.text) prewarmActiveLanguagesTTS(transcript[currentSegmentIndex + 1].text);
                }
              }}
              onChange={e => {
                const nextLang = e.target.value;
                if (voiceoverAudioRef.current) {
                  try {
                    voiceoverAudioRef.current.pause();
                    voiceoverAudioRef.current.currentTime = 0;
                  } catch (_) {}
                  voiceoverAudioRef.current = null;
                }
                playedSegmentIndices.current.clear();
                lastSegmentIndex.current = -1;
                setSelectedLang(nextLang);
                if (nextLang === 'english-united-states') {
                  if (onMuteVideo) onMuteVideo(false);
                } else {
                  if (onMuteVideo) onMuteVideo(true);
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '3px 8px',
                cursor: 'pointer',
                outline: 'none',
                maxWidth: '130px'
              }}
            >
              <optgroup label="Active Languages (Free)" style={{ background: '#18181b', color: accent, fontWeight: 'bold' }}>
                {activeLanguages.map(l => (
                  <option key={`act-${l.code}`} value={l.code} style={{ background: '#111', color: '#fff' }}>
                    {l.code.startsWith('english') ? 'Original Sound (English)' : l.name}
                  </option>
                ))}
              </optgroup>
              {reservedLanguages.length > 0 && (
                <optgroup label="🔒 Premium Tier (Coming Soon)" style={{ background: '#18181b', color: '#ffaa00', fontWeight: 'bold' }}>
                  {reservedLanguages.map(l => (
                    <option key={`res-${l.code}`} value={l.code} disabled style={{ background: '#111', color: '#777' }}>
                      🔒 {l.name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          );
        })()}

        {/* Voiceover Mute Toggle when non-English */}
        {selectedLang !== 'english-united-states' && (() => {
          const langObj = languages.find(l => l.code === selectedLang);
          const hasTTS = langObj ? supportsTTS(langObj) : true;

          if (!hasTTS) {
            return (
              <span 
                title="Subtitles only (voiceover model not available for this dialect)"
                style={{ fontSize: '10px', color: '#aaa', background: 'rgba(255,255,255,0.06)', padding: '3px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}
              >
                Subtitles
              </span>
            );
          }

          return (
            <button
              type="button"
              onClick={() => setEnableVoiceover(!enableVoiceover)}
              title={enableVoiceover ? "Voiceover Active (Click to Mute Voiceover)" : "Voiceover Muted (Subtitles Only)"}
              style={{
                background: enableVoiceover ? `${accent}33` : 'rgba(255,255,255,0.08)',
                border: `1px solid ${enableVoiceover ? accent : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '6px',
                color: enableVoiceover ? accent : '#888',
                padding: '3px 6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              {enableVoiceover ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>
          );
        })()}

        {loadingTranscript && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Loader2 size={12} color={accent} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: '10px', color: '#bbb' }}>Loading...</span>
          </div>
        )}

        {!loadingTranscript && (!transcript || transcript.length === 0) && (
          <span 
            title="This video does not have an active speech or caption track available on YouTube."
            style={{ fontSize: '10px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 8px', borderRadius: '10px', whiteSpace: 'nowrap' }}
          >
            No Captions
          </span>
        )}

        {!loadingTranscript && transcript && transcript.length > 0 && selectedLang !== 'english-united-states' && !translatedText && (
          <span style={{ fontSize: '10px', color: '#00ffcc', animation: 'pulse 1.2s infinite', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Sparkles size={10} color="#00ffcc" /> Translating...
          </span>
        )}
      </div>

      {/* Live Synchronized Subtitle Overlay (1-2 sentences at a time) */}
      {displayedSubtitleText && (
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '24px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 35, 
            maxWidth: '90%', 
            minWidth: '220px',
            background: 'rgba(0, 0, 0, 0.86)', 
            backdropFilter: 'blur(10px)', 
            padding: '8px 20px', 
            borderRadius: '12px', 
            border: `1px solid ${selectedLang !== 'english-united-states' ? `${accent}44` : 'rgba(255, 255, 255, 0.16)'}`, 
            boxShadow: '0 6px 25px rgba(0, 0, 0, 0.7)', 
            textAlign: 'center', 
            pointerEvents: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          {selectedLang !== 'english-united-states' && (
            <Sparkles size={13} color={accent} style={{ flexShrink: 0 }} />
          )}
          <span 
            style={{ 
              color: selectedLang !== 'english-united-states' ? '#00ffcc' : '#fff', 
              fontSize: '14px', 
              fontWeight: 700, 
              letterSpacing: '0.2px', 
              lineHeight: 1.45, 
              textShadow: '0 2px 4px rgba(0,0,0,0.9)' 
            }}
          >
            {displayedSubtitleText}
          </span>
        </div>
      )}
    </div>
  );
};
