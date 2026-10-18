import React, { useState, useEffect, useRef } from 'react';
import { Globe, Volume2, VolumeX, Sparkles, Loader2, Subtitles, Check, AlertCircle, Lock } from 'lucide-react';
import { 
  getWwtcLanguages, 
  filterActiveLanguages,
  getReservedPremiumLanguages,
  translateText, 
  supportsTTS, 
  prewarmActiveLanguagesTTS,
  prewarmVideoDialogue,
  isTranslationCached,
  getCachedTranslation,
  getActiveCaptionSlice,
  encode16kMonoWav,
  ACTIVE_FOREIGN_LANGUAGES,
  type WwtcLanguage, 
  type YouTubeCaptionSegment 
} from '../lib/wwtc';
import { fetchTranscriptForVideo, decodeAudio16k, sliceAudioBuffer, saveTranscriptRow } from '../lib/videoTranscription';
import { 
  isVoiceCloningEnabled, 
  getAudioDataUri, 
  getCachedVoiceId, 
  setCachedVoiceId, 
  getDefaultVoiceId, 
  cloneVoiceFromAudio 
} from '../lib/elevenlabs';



interface FeedVideoPlayerProps {
  videoUrl: string;
  postId?: string | number;
  title?: string;
  accent?: string;
  maxHeight?: string;
  className?: string;
  style?: React.CSSProperties;
}

function getShortLangCode(code: string): string {
  if (!code) return 'EN';
  if (code.startsWith('english')) return 'EN';
  if (code.startsWith('spanish')) return 'ES';
  if (code.startsWith('french')) return 'FR';
  if (code.startsWith('german')) return 'DE';
  if (code.startsWith('italian')) return 'IT';
  if (code.startsWith('portuguese')) return 'PT';
  if (code.startsWith('japanese')) return 'JA';
  if (code.startsWith('korean')) return 'KO';
  if (code.startsWith('chinese')) return 'ZH';
  if (code.startsWith('dutch')) return 'NL';
  if (code.startsWith('arabic')) return 'AR';
  if (code.startsWith('russian')) return 'RU';
  if (code.startsWith('hindi')) return 'HI';
  return code.slice(0, 2).toUpperCase();
}

export const FeedVideoPlayer: React.FC<FeedVideoPlayerProps> = ({
  videoUrl,
  postId,
  title,
  accent = '#00ff88',
  maxHeight = '550px',
  className = '',
  style = {}
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSource, setActiveSource] = useState(videoUrl);
  const [hasPlaybackError, setHasPlaybackError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [transcript, setTranscript] = useState<YouTubeCaptionSegment[]>([]);
  const [translatedSegments, setTranslatedSegments] = useState<Record<string, string>>({});
  const [languages, setLanguages] = useState<WwtcLanguage[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>('english-united-states');
  const [showTranslateMenu, setShowTranslateMenu] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false); // Default CC to OFF as requested
  const [translationAudioMuted, setTranslationAudioMuted] = useState(false);
  const translationAudioMutedRef = useRef(translationAudioMuted);
  translationAudioMutedRef.current = translationAudioMuted;
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const ttsAudioCacheRef = useRef<Record<string, string>>({});
  const preloadedAudioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const lastPlayedSegmentRef = useRef<number>(-1);
  const selectedLangRef = useRef<string>(selectedLang);
  selectedLangRef.current = selectedLang;
  const activeSegmentIndexRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const translateMenuRef = useRef<HTMLDivElement>(null);
  const translateButtonRef = useRef<HTMLButtonElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);

  const getOrCreateAudioElement = (cacheKey: string, base64: string): HTMLAudioElement => {
    let audio = preloadedAudioElementsRef.current.get(cacheKey);
    if (!audio) {
      audio = new Audio(getAudioDataUri(base64));
      audio.preload = 'auto';
      preloadedAudioElementsRef.current.set(cacheKey, audio);
    }
    return audio;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.getBoundingClientRect().width;
        if (w > 0) setContainerWidth(w);
      }
    };
    updateWidth();
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect && entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    window.addEventListener('resize', updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Close translate dropdown when tapping outside
  useEffect(() => {
    if (!showTranslateMenu) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        translateMenuRef.current && 
        !translateMenuRef.current.contains(target) &&
        translateButtonRef.current &&
        !translateButtonRef.current.contains(target)
      ) {
        setShowTranslateMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showTranslateMenu]);

  useEffect(() => {
    setActiveSource(videoUrl);
    setHasPlaybackError(false);
  }, [videoUrl]);

  // Clean up any playing translation audio on unmount
  useEffect(() => {
    return () => {
      if (ttsAudioRef.current) {
        try { ttsAudioRef.current.pause(); } catch (_) {}
        ttsAudioRef.current = null;
      }
    };
  }, []);


  const queryId = postId ? String(postId) : videoUrl;

  const [clonedVoiceId, setClonedVoiceId] = useState<string | undefined>(() => {
    return getCachedVoiceId(queryId) || getDefaultVoiceId() || undefined;
  });
  const clonedVoiceIdRef = useRef(clonedVoiceId);
  clonedVoiceIdRef.current = clonedVoiceId;
  const isCloningRef = useRef(false);

  // Auto-clone creator voice from video audio if voice cloning is active
  useEffect(() => {
    if (clonedVoiceId || isCloningRef.current || !isVoiceCloningEnabled()) return;
    if (!videoUrl || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) return;

    isCloningRef.current = true;
    fetch(videoUrl, { mode: 'cors' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then(async (blob) => {
        const decoded = await decodeAudio16k(blob);
        if (decoded && decoded.duration > 1) {
          const sampleDuration = Math.min(10, decoded.duration);
          const slice = sliceAudioBuffer(decoded, 0, sampleDuration);
          const wavBlob = encode16kMonoWav(slice);
          const res = await cloneVoiceFromAudio({
            name: title || `Creator Voice ${postId || Date.now()}`,
            audioBlob: wavBlob,
            creatorId: queryId,
          });
          if (res?.voice_id) {
            setClonedVoiceId(res.voice_id);
            setCachedVoiceId(queryId, res.voice_id);
            if (videoUrl) setCachedVoiceId(videoUrl, res.voice_id);
            if (transcript && transcript.length > 0) {
              const updated = [...transcript];
              (updated[0] as any).voice_id = res.voice_id;
              saveTranscriptRow([queryId, videoUrl], updated).catch(() => {});
            }
          }
        }
      })
      .catch(err => {
        console.warn('[FeedVideoPlayer] Auto voice clone fallback notice:', err.message);
      })
      .finally(() => {
        isCloningRef.current = false;
      });
  }, [videoUrl, queryId, clonedVoiceId, title]);

  // 1. Load transcript (read-only; transcription happens once at upload time)
  useEffect(() => {
    let isMounted = true;
    setLoadingTranscript(true);
    setTranscript([]);

    fetchTranscriptForVideo(videoUrl, postId, title || 'Channel Host')
      .then(data => {
        if (isMounted && data && data.length > 0) {
          setTranscript(data);
          const vId = (data[0] as any)?.voice_id || clonedVoiceId;
          if ((data[0] as any)?.voice_id && (data[0] as any).voice_id !== clonedVoiceId) {
            setClonedVoiceId((data[0] as any).voice_id);
          }
          const seeded: Record<string, string> = {};
          data.forEach(seg => {
            if (seg.text && seg.translatedText) {
              seeded[`spanish-international:${seg.text}`] = seg.translatedText;
            }
          });
          if (Object.keys(seeded).length > 0) {
            setTranslatedSegments(prev => ({ ...prev, ...seeded }));
          }
          prewarmVideoDialogue(data, vId);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingTranscript(false);
      });

    const handleAutoTranscript = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail || !isMounted) return;
      if (
        (detail.videoUrl && detail.videoUrl === videoUrl) ||
        (detail.postId && postId && String(detail.postId) === String(postId))
      ) {
        if (Array.isArray(detail.segments) && detail.segments.length > 0) {
          setTranscript(detail.segments);
          const vId = (detail.segments[0] as any)?.voice_id || clonedVoiceId;
          if ((detail.segments[0] as any)?.voice_id && (detail.segments[0] as any).voice_id !== clonedVoiceId) {
            setClonedVoiceId((detail.segments[0] as any).voice_id);
          }
          const seeded: Record<string, string> = {};
          detail.segments.forEach((seg: any) => {
            if (seg.text && seg.translatedText) {
              seeded[`spanish-international:${seg.text}`] = seg.translatedText;
            }
          });
          if (Object.keys(seeded).length > 0) {
            setTranslatedSegments(prev => ({ ...prev, ...seeded }));
          }
          prewarmVideoDialogue(detail.segments, vId);
        }
      }
    };

    window.addEventListener('vibe-transcript-ready', handleAutoTranscript);

    const handleVoiceCloned = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail || !isMounted) return;
      if (
        (detail.storagePath && detail.storagePath === videoUrl) ||
        (detail.videoKey && (detail.videoKey === videoUrl || detail.videoKey === queryId))
      ) {
        if (detail.voiceId) {
          setClonedVoiceId(detail.voiceId);
          setCachedVoiceId(queryId, detail.voiceId);
          if (transcript && transcript.length > 0) {
            prewarmVideoDialogue(transcript, detail.voiceId);
          }
        }
      }
    };
    window.addEventListener('vibe-voice-cloned', handleVoiceCloned);

    return () => { 
      isMounted = false;
      window.removeEventListener('vibe-transcript-ready', handleAutoTranscript);
      window.removeEventListener('vibe-voice-cloned', handleVoiceCloned);
    };
  }, [videoUrl, postId, title, queryId]);

  // 2. Fetch supported WWTC languages
  useEffect(() => {
    getWwtcLanguages()
      .then(langs => {
        if (Array.isArray(langs)) {
          setLanguages(langs.sort((a, b) => a.name.localeCompare(b.name)));
        }
      })
      .catch(err => console.warn('[FeedVideoPlayer] Language fetch notice:', err));
  }, []);

  // 3. Track video playback time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      activeSegmentIndexRef.current = activeSegmentIndex;
    }
  };

  // 4. Find the active segment matching current playback time
  const activeSegmentIndex = React.useMemo(() => {
    if (!transcript || transcript.length === 0) return -1;
    for (let i = 0; i < transcript.length; i++) {
      const seg = transcript[i];
      const nextSeg = transcript[i + 1];
      if (currentTime >= seg.seconds && (!nextSeg || currentTime < nextSeg.seconds)) {
        return i;
      }
    }
    if (currentTime < transcript[0].seconds && transcript[0].seconds <= 5) {
      return 0;
    }
    return 0;
  }, [transcript, currentTime]);

  const activeSegment = activeSegmentIndex >= 0 ? transcript[activeSegmentIndex] : null;
  activeSegmentIndexRef.current = activeSegmentIndex;

  // 4b. Pre-warm upcoming dialogue lines for active languages as playback progresses
  useEffect(() => {
    if (!transcript || transcript.length === 0 || activeSegmentIndex < 0) return;
    activeSegmentIndexRef.current = activeSegmentIndex;
    const next1 = transcript[activeSegmentIndex + 1];
    const next2 = transcript[activeSegmentIndex + 2];
    const effectiveVoiceId = clonedVoiceIdRef.current || getDefaultVoiceId() || undefined;
    if (next1?.text) prewarmActiveLanguagesTTS(next1.text, ACTIVE_FOREIGN_LANGUAGES, effectiveVoiceId);
    if (next2?.text) prewarmActiveLanguagesTTS(next2.text, ACTIVE_FOREIGN_LANGUAGES, effectiveVoiceId);
  }, [activeSegmentIndex, transcript]);

  // Pre-warm current and next lines when menu is hovered or opened
  const handleOpenOrHoverMenu = () => {
    if (!transcript || transcript.length === 0 || activeSegmentIndex < 0) return;
    const current = transcript[activeSegmentIndex];
    const next1 = transcript[activeSegmentIndex + 1];
    const next2 = transcript[activeSegmentIndex + 2];
    const effectiveVoiceId = clonedVoiceId || getDefaultVoiceId() || undefined;
    [current, next1, next2].forEach(seg => {
      if (seg?.text) prewarmActiveLanguagesTTS(seg.text, ACTIVE_FOREIGN_LANGUAGES, effectiveVoiceId);
    });
  };

  // Pre-warm a specific language when cursor hovers over its menu row
  const handleHoverLanguage = (langCode: string) => {
    if (langCode === 'english-united-states' || !transcript || activeSegmentIndex < 0) return;
    const current = transcript[activeSegmentIndex];
    const next1 = transcript[activeSegmentIndex + 1];
    const effectiveVoiceId = clonedVoiceId || getDefaultVoiceId() || undefined;
    [current, next1].forEach(seg => {
      if (seg?.text) {
        translateText({
          text: seg.text,
          sourceLang: 'english-united-states',
          targetLang: langCode,
          serviceCode: 'tts',
          voiceId: effectiveVoiceId,
        }).then(res => {
          if (res.audio) {
            const cacheKey = `${langCode}:${seg.text}`;
            ttsAudioCacheRef.current[cacheKey] = res.audio;
            getOrCreateAudioElement(cacheKey, res.audio);
          }
        }).catch(() => {});
      }
    });
  };

  // 5. Translate active segment when target language is selected
  useEffect(() => {
    if (!activeSegment || selectedLang === 'english-united-states') return;

    const cacheKey = `${selectedLang}:${activeSegment.text}`;
    if (translatedSegments[cacheKey]) return;

    let isMounted = true;
    setIsTranslating(true);

    translateText({
      text: activeSegment.text,
      sourceLang: 'english-united-states',
      targetLang: selectedLang,
      serviceCode: 'ttt'
    })
      .then(res => {
        if (isMounted && res.translated_text) {
          setTranslatedSegments(prev => ({
            ...prev,
            [cacheKey]: res.translated_text
          }));
        }
      })
      .catch(err => console.warn('[FeedVideoPlayer] Translation error:', err))
      .finally(() => {
        if (isMounted) setIsTranslating(false);
      });

    return () => { isMounted = false; };
  }, [activeSegment, selectedLang]);

  // Display text: either translated or original
  const currentSubtitleText = React.useMemo(() => {
    if (!activeSegment) return '';
    if (selectedLang === 'english-united-states') return activeSegment.text;
    const cacheKey = `${selectedLang}:${activeSegment.text}`;
    return translatedSegments[cacheKey] || activeSegment.translatedText || activeSegment.text;
  }, [activeSegment, selectedLang, translatedSegments]);

  // 1-2 sentence subtitle slice synchronized with currentTime (replaces paragraph dumps)
  const displayedCaptionText = React.useMemo(() => {
    if (!currentSubtitleText || !activeSegment) return '';
    const nextSeg = transcript[activeSegmentIndex + 1];
    return getActiveCaptionSlice({
      fullText: currentSubtitleText,
      currentTime,
      segmentStart: activeSegment.seconds,
      segmentEnd: nextSeg ? nextSeg.seconds : undefined,
      videoDuration: videoRef.current?.duration,
      maxSentences: 2,
      maxWords: 16,
    });
  }, [currentSubtitleText, activeSegment, activeSegmentIndex, transcript, currentTime]);

  // 6. Play translation voiceover (TTS) in selected language (with 0ms instant playback cache)
  const playSegmentVoiceover = async (segmentIndex: number, targetLang = selectedLangRef.current, forcePlay = false) => {
    if (!transcript || segmentIndex < 0 || segmentIndex >= transcript.length) return;
    if (targetLang === 'english-united-states') return;
    if (!forcePlay && translationAudioMutedRef.current) return;

    const seg = transcript[segmentIndex];
    if (!seg || !seg.text || (seg as any).isPlaceholder) return;

    const effectiveVoiceId = clonedVoiceIdRef.current || clonedVoiceId || getDefaultVoiceId() || undefined;
    const cacheKey = `${targetLang}:${seg.text}`;
    let audioBase64 = ttsAudioCacheRef.current[cacheKey];

    // Synchronous memory/session cache check (instant 0ms hit)
    if (!audioBase64) {
      const cached = getCachedTranslation({
        text: seg.text,
        sourceLang: 'english-united-states',
        targetLang: targetLang,
        serviceCode: 'tts',
        voiceId: effectiveVoiceId,
      });
      if (cached?.audio) {
        audioBase64 = cached.audio;
        ttsAudioCacheRef.current[cacheKey] = cached.audio;
        getOrCreateAudioElement(cacheKey, cached.audio);
      }
    }

    if (!audioBase64) {
      try {
        setIsTranslating(true);
        const res = await translateText({
          text: seg.text,
          sourceLang: 'english-united-states',
          targetLang: targetLang,
          serviceCode: 'tts',
          voiceId: effectiveVoiceId,
        });
        if (res.translated_text) {
          setTranslatedSegments(prev => ({
            ...prev,
            [cacheKey]: res.translated_text
          }));
        }
        if (res.audio) {
          audioBase64 = res.audio;
          ttsAudioCacheRef.current[cacheKey] = res.audio;
          getOrCreateAudioElement(cacheKey, res.audio);
        }
      } catch (err) {
        console.warn('[FeedVideoPlayer] Voiceover fetch error:', err);
      } finally {
        setIsTranslating(false);
      }
    }

    // Play translation audio immediately if still on this segment, matching language, not muted, and video is playing
    if (
      audioBase64 && 
      (forcePlay || !translationAudioMutedRef.current) && 
      videoRef.current && 
      !videoRef.current.paused &&
      selectedLangRef.current === targetLang
    ) {
      // If playback head is still in or near this segment, or forcePlay is true, play immediately!
      if (forcePlay || activeSegmentIndexRef.current === segmentIndex || activeSegmentIndexRef.current === segmentIndex - 1) {
        if (ttsAudioRef.current) {
          try {
            ttsAudioRef.current.pause();
            ttsAudioRef.current.currentTime = 0;
          } catch (_) {}
        }
        const audio = getOrCreateAudioElement(cacheKey, audioBase64);
        ttsAudioRef.current = audio;
        setTtsPlaying(true);
        audio.currentTime = 0;
        audio.volume = 1.0;
        audio.onended = () => setTtsPlaying(false);
        audio.onerror = () => setTtsPlaying(false);
        audio.play().catch(e => console.warn('[FeedVideoPlayer] Translation audio play notice:', e));
      } else if (activeSegmentIndexRef.current > segmentIndex) {
        // Video already moved to next segment while audio was downloading; catch up seamlessly!
        playSegmentVoiceover(activeSegmentIndexRef.current, targetLang);
      }
    }

    // Prefetch upcoming segments voiceover for seamless gapless playback
    [segmentIndex + 1, segmentIndex + 2].forEach(nextIndex => {
      if (nextIndex < transcript.length) {
        const nextSeg = transcript[nextIndex];
        if (nextSeg && nextSeg.text && !(nextSeg as any).isPlaceholder) {
          const nextCacheKey = `${targetLang}:${nextSeg.text}`;
          if (!ttsAudioCacheRef.current[nextCacheKey]) {
            translateText({
              text: nextSeg.text,
              sourceLang: 'english-united-states',
              targetLang: targetLang,
              serviceCode: 'tts',
              voiceId: effectiveVoiceId,
            }).then(res => {
              if (res.translated_text) {
                setTranslatedSegments(prev => ({ ...prev, [nextCacheKey]: res.translated_text }));
              }
              if (res.audio) {
                ttsAudioCacheRef.current[nextCacheKey] = res.audio;
                getOrCreateAudioElement(nextCacheKey, res.audio);
              }
            }).catch(() => {});
          }
        }
      }
    });
  };

  // 7. Language selection: instantly mute current audio and switch to new language immediately
  const handleSelectLanguage = async (langCode: string) => {
    setSelectedLang(langCode);
    selectedLangRef.current = langCode;
    setShowTranslateMenu(false);

    // 1. Instantly stop and mute any currently playing translated voiceover
    if (ttsAudioRef.current) {
      try {
        ttsAudioRef.current.pause();
        ttsAudioRef.current.currentTime = 0;
      } catch (_) {}
      ttsAudioRef.current = null;
    }
    setTtsPlaying(false);

    if (langCode === 'english-united-states') {
      // Switched back to original English (Original Sound):
      // Mute translated audio and immediately unmute original video track at full volume
      translationAudioMutedRef.current = true;
      setTranslationAudioMuted(true);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
      }
    } else {
      // Switched to a foreign language:
      // Instantly mute the original video audio so no English or previous audio bleeds through
      translationAudioMutedRef.current = false;
      setTranslationAudioMuted(false);
      if (videoRef.current) {
        videoRef.current.muted = true;
      }

      // Immediately trigger playback for the current segment
      const segIndex = activeSegmentIndex >= 0 ? activeSegmentIndex : 0;
      lastPlayedSegmentRef.current = segIndex;
      playSegmentVoiceover(segIndex, langCode, true);
    }
  };

  // 8. Trigger voiceover when active segment advances during playback
  useEffect(() => {
    if (
      activeSegmentIndex >= 0 &&
      activeSegmentIndex !== lastPlayedSegmentRef.current &&
      selectedLang !== 'english-united-states' &&
      !translationAudioMuted &&
      videoRef.current &&
      !videoRef.current.paused
    ) {
      lastPlayedSegmentRef.current = activeSegmentIndex;
      playSegmentVoiceover(activeSegmentIndex, selectedLang);
    }
  }, [activeSegmentIndex, selectedLang, translationAudioMuted]);

  // 9. Sync translation audio with native video player events
  const handlePlay = () => {
    if (selectedLangRef.current !== 'english-united-states') {
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
      if (!translationAudioMutedRef.current && activeSegmentIndex >= 0) {
        if (ttsAudioRef.current && ttsAudioRef.current.paused && !ttsAudioRef.current.ended) {
          ttsAudioRef.current.play().catch(() => {});
          setTtsPlaying(true);
        } else {
          lastPlayedSegmentRef.current = activeSegmentIndex;
          playSegmentVoiceover(activeSegmentIndex, selectedLangRef.current);
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
      }
    }
  };

  const handlePause = () => {
    if (ttsAudioRef.current) {
      try { ttsAudioRef.current.pause(); } catch (_) {}
      setTtsPlaying(false);
    }
  };

  const handleSeeked = () => {
    if (ttsAudioRef.current) {
      try {
        ttsAudioRef.current.pause();
        ttsAudioRef.current.currentTime = 0;
      } catch (_) {}
      ttsAudioRef.current = null;
      setTtsPlaying(false);
    }
    if (
      selectedLangRef.current !== 'english-united-states' && 
      !translationAudioMutedRef.current && 
      videoRef.current && 
      !videoRef.current.paused &&
      activeSegmentIndex >= 0
    ) {
      lastPlayedSegmentRef.current = activeSegmentIndex;
      playSegmentVoiceover(activeSegmentIndex, selectedLangRef.current, true);
    }
  };


  const selectedLangObj = languages.find(l => l.code === selectedLang);

  const isYouTube = Boolean((activeSource || '').match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i));
  // Covers all mobile phones and iPads/tablets (up to 840px container width)
  const isCompact = containerWidth > 0 && containerWidth <= 840;
  const isUltraCompact = containerWidth > 0 && containerWidth < 360;

  return (
    <div 
      ref={containerRef}
      className={`feed-video-player-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#000',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        ...style
      }}
    >
      {/* Suppress WebKit iPadOS native PiP and AirPlay overlay buttons that collide with custom controls */}
      <style>{`
        .feed-video-player-container video::-webkit-media-controls-picture-in-picture-button,
        .feed-video-player-container video::-webkit-media-controls-wireless-playback-picker-button {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
      {/* ── Video Player Content (Native Video, YouTube, or Error State) ── */}
      {(() => {
        const ytMatch = (activeSource || '').match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        const ytId = ytMatch ? ytMatch[1] : null;

        if (ytId) {
          return (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1`}
              title={title || 'YouTube Feed Video'}
              style={{
                width: '100%',
                height: '420px',
                border: 'none',
                display: 'block',
                background: '#000'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          );
        }

        if (hasPlaybackError) {
          return (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#fff', width: '100%', background: 'rgba(20,20,20,0.95)' }}>
              <AlertCircle size={40} color="#ff4444" style={{ margin: '0 auto 14px auto' }} />
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>Video Stream Unavailable</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', maxWidth: '440px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                This video was uploaded prior to the storage bucket update (or the file returned a 404). Please re-upload your video using the updated feed upload to stream properly.
              </div>
              <button
                type="button"
                onClick={() => {
                  setHasPlaybackError(false);
                  setActiveSource(videoUrl);
                }}
                style={{
                  background: `${accent}22`,
                  border: `1px solid ${accent}66`,
                  color: accent,
                  padding: '8px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                Retry Playback
              </button>
            </div>
          );
        }

        return (
          <video
            ref={videoRef}
            src={activeSource}
            controls
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            // @ts-ignore
            x-webkit-airplay="deny"
            controlsList="nodownload noplaybackrate"
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={handleSeeked}
            onTimeUpdate={handleTimeUpdate}
            onError={() => {
              // If the file was in images bucket, try the videos bucket
              if (activeSource.includes('/object/public/images/')) {
                const switched = activeSource.replace('/object/public/images/', '/object/public/videos/');
                console.warn('[FeedVideoPlayer] Video failed in images bucket, retrying with videos bucket:', switched);
                setActiveSource(switched);
                return;
              }
              console.warn('[FeedVideoPlayer] Video failed to load:', activeSource);
              setHasPlaybackError(true);
            }}
            style={{
              width: '100%',
              maxHeight,
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              background: '#000'
            }}
          />
        );
      })()}

      {/* ── Top-Right Translation Controls Bar ────────────────────────── */}
      <div 
        style={{
          position: 'absolute',
          top: isYouTube ? (isCompact ? '64px' : '72px') : (isCompact ? '8px' : '12px'),
          right: isCompact ? '8px' : '12px',
          display: 'flex',
          alignItems: 'center',
          gap: isCompact ? '4px' : '6px',
          zIndex: 25,
          maxWidth: 'calc(100% - 16px)',
          pointerEvents: 'auto',
          flexWrap: 'nowrap'
        }}
      >
        {/* Captions Toggle Pill */}
        <button
          type="button"
          onClick={() => setCaptionsEnabled(!captionsEnabled)}
          title={captionsEnabled ? 'Hide Captions' : 'Show Captions'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isCompact ? '4px' : '5px',
            background: captionsEnabled ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${captionsEnabled ? accent : 'rgba(255,255,255,0.25)'}`,
            borderRadius: '20px',
            padding: isCompact ? '4px 8px' : '5px 10px',
            color: captionsEnabled ? '#fff' : '#ccc',
            fontSize: isCompact ? '11px' : '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            lineHeight: 1,
            flexShrink: 0
          }}
        >
          <Subtitles size={isCompact ? 13 : 14} color={captionsEnabled ? accent : '#aaa'} />
          <span>CC</span>
        </button>

        {/* Translation Language Selector Pill */}
        <button
          ref={translateButtonRef}
          type="button"
          onClick={() => {
            handleOpenOrHoverMenu();
            setShowTranslateMenu(!showTranslateMenu);
          }}
          onMouseEnter={handleOpenOrHoverMenu}
          title={`Audio: ${selectedLang === 'english-united-states' ? 'Original Sound' : (selectedLangObj?.name || 'Translated Audio')}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isCompact ? '4px' : '5px',
            background: selectedLang !== 'english-united-states' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${selectedLang !== 'english-united-states' ? accent : 'rgba(255,255,255,0.25)'}`,
            borderRadius: '20px',
            padding: isCompact ? '4px 8px' : '5px 10px',
            color: '#fff',
            fontSize: isCompact ? '11px' : '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            lineHeight: 1,
            flexShrink: 0
          }}
        >
          <Globe size={isCompact ? 13 : 14} color={selectedLang !== 'english-united-states' ? accent : '#aaa'} />
          <span>
            {selectedLang === 'english-united-states' ? 'ORIGINAL' : (selectedLangObj ? getShortLangCode(selectedLangObj.code) : 'ORIGINAL')}
          </span>
          {isTranslating ? (
            <Loader2 size={11} className="animate-spin" color={accent} />
          ) : (
            selectedLang !== 'english-united-states' && isVoiceCloningEnabled() && (
              <span title="ElevenLabs AI Voice Clone Active" style={{ display: 'flex', alignItems: 'center' }}>
                <Sparkles size={11} color="#ffaa00" />
              </span>
            )
          )}
        </button>

        {/* Audio TTS Voiceover Unmute / Mute Button */}
        {selectedLang !== 'english-united-states' && (
          <button
            type="button"
            onClick={() => {
              if (translationAudioMutedRef.current) {
                // Unmute translation audio and ensure native video stays muted
                translationAudioMutedRef.current = false;
                setTranslationAudioMuted(false);
                if (videoRef.current) videoRef.current.muted = true;
                if (activeSegmentIndex >= 0) {
                  lastPlayedSegmentRef.current = activeSegmentIndex;
                  playSegmentVoiceover(activeSegmentIndex, selectedLangRef.current, true);
                }
              } else {
                // Mute translation audio
                translationAudioMutedRef.current = true;
                setTranslationAudioMuted(true);
                if (ttsAudioRef.current) {
                  try {
                    ttsAudioRef.current.pause();
                    ttsAudioRef.current.currentTime = 0;
                  } catch (_) {}
                  ttsAudioRef.current = null;
                }
                setTtsPlaying(false);
              }
            }}
            title={translationAudioMuted ? 'Unmute Translation Audio' : 'Mute Translation Audio (' + (selectedLangObj?.name || 'Selected Language') + ')'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isCompact ? '26px' : '28px',
              height: isCompact ? '26px' : '28px',
              background: !translationAudioMuted ? accent : 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${!translationAudioMuted ? accent : 'rgba(255,255,255,0.25)'}`,
              borderRadius: '50%',
              color: !translationAudioMuted ? '#000' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {translationAudioMuted ? <VolumeX size={isCompact ? 13 : 14} /> : <Volume2 size={isCompact ? 13 : 14} />}
          </button>
        )}
      </div>

      {/* ── Language Dropdown Menu ───────────────────────────────────── */}
      {showTranslateMenu && (() => {
        const activeLanguages = filterActiveLanguages(languages);
        const reservedLanguages = getReservedPremiumLanguages(languages);

        return (
          <div
            ref={translateMenuRef}
            style={{
              position: 'absolute',
              top: isYouTube ? (isCompact ? '98px' : '108px') : (isCompact ? '42px' : '48px'),
              right: isCompact ? '8px' : '12px',
              maxHeight: 'min(320px, 60vh)',
              width: isCompact ? '200px' : '230px',
              overflowY: 'auto',
              background: 'rgba(15, 15, 15, 0.96)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${accent}44`,
              borderRadius: '14px',
              padding: '6px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.85)',
              zIndex: 35,
              display: 'flex',
              flexDirection: 'column',
              gap: '3px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted, #888)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <span>Available Languages</span>
              <span style={{ fontSize: '9px', background: `${accent}22`, color: accent, padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Active</span>
            </div>

            {/* 5 Active Languages + Original Sound (English) */}
            {activeLanguages.map(lang => {
              const isSelected = selectedLang === lang.code;
              const isOriginal = lang.code.startsWith('english');
              const displayName = isOriginal ? 'Original Sound (English)' : lang.name;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  onMouseEnter={() => handleHoverLanguage(lang.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: isSelected ? `${accent}22` : 'transparent',
                    border: isSelected ? `1px solid ${accent}66` : '1px solid transparent',
                    color: isSelected ? accent : '#fff',
                    fontSize: '13px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseOver={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseOut={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isOriginal && <Volume2 size={13} color={isSelected ? accent : '#aaa'} />}
                    {displayName}
                  </span>
                  {isSelected && <Check size={14} color={accent} />}
                </button>
              );
            })}

            {/* Reserved / Premium Tier Section */}
            {reservedLanguages.length > 0 && (
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 6px', fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={10} color="#ffaa00" /> Premium Tier
                  </span>
                  <span style={{ fontSize: '9px', background: 'rgba(255, 170, 0, 0.15)', color: '#ffaa00', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>Soon</span>
                </div>
                <div style={{ padding: '0 4px', maxHeight: '110px', overflowY: 'auto' }}>
                  {reservedLanguages.map(lang => (
                    <div
                      key={`res-${lang.code}`}
                      title={`${lang.name} - Reserved for Premium Tier`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '12px',
                        cursor: 'not-allowed',
                        userSelect: 'none'
                      }}
                    >
                      <span>{lang.name}</span>
                      <Lock size={11} color="rgba(255,255,255,0.3)" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Active Synchronized Caption Overlay (1-2 sentences at a time) ─ */}
      {captionsEnabled && displayedCaptionText && (
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '90%',
            minWidth: '220px',
            background: 'rgba(0, 0, 0, 0.86)',
            backdropFilter: 'blur(10px)',
            color: '#ffffff',
            padding: '8px 18px',
            borderRadius: '12px',
            fontSize: isCompact ? '13px' : '15px',
            fontWeight: 600,
            lineHeight: 1.45,
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.9)',
            border: `1px solid ${selectedLang !== 'english-united-states' ? `${accent}44` : 'rgba(255,255,255,0.16)'}`,
            boxShadow: '0 6px 20px rgba(0,0,0,0.65)',
            pointerEvents: 'none',
            zIndex: 15,
            transition: 'all 0.15s ease'
          }}
        >
          {selectedLang !== 'english-united-states' && (
            <span style={{ color: accent, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '3px', letterSpacing: '0.5px' }}>
              {selectedLangObj?.name || 'Translated'} CC
            </span>
          )}
          {displayedCaptionText}
        </div>
      )}

      {/* ── Hidden Transcript Containers for Translation Software ──────── */}
      {/* 1. Source English Transcript Container */}
      {transcript && transcript.length > 0 && (
        <div
          id="video-transcript"
          className={`feed-video-transcript video-transcript-container video-transcript-${postId || 'active'}`}
          style={{ display: 'none' }}
          data-video-id={queryId}
          data-video-url={videoUrl}
          data-post-id={postId || ''}
        >
          {transcript
            .filter(seg => 
              seg.text && 
              !seg.isPlaceholder && 
              (seg as any).isRecorded !== false &&
              !seg.text.includes('_001_') &&
              !seg.text.includes('.mp4') &&
              !seg.text.includes('Did-Lush-') &&
              (title ? seg.text.trim().toLowerCase() !== title.trim().toLowerCase() : true)
            )
            .map((seg, idx) => (
            <div
              key={`feed-seg-${idx}`}
              className="transcript-segment"
              data-seconds={seg.seconds}
              data-time={seg.time}
              data-speaker={seg.speaker}
            >
              {seg.text}
            </div>
          ))}
        </div>
      )}

      {/* 2. Translated Transcript Container */}
      {selectedLang !== 'english-united-states' && transcript && transcript.length > 0 && (
        <div
          id="video-translated-transcript"
          className={`feed-video-translated-transcript video-translated-container video-translated-transcript-${postId || 'active'}`}
          style={{ display: 'none' }}
          data-video-id={queryId}
          data-target-lang={selectedLang}
        >
          {transcript.map((seg, idx) => {
            const cacheKey = `${selectedLang}:${seg.text}`;
            const transText = translatedSegments[cacheKey] || seg.translatedText || seg.text;
            return (
              <div
                key={`feed-trans-seg-${idx}`}
                className="translated-transcript-segment"
                data-seconds={seg.seconds}
                data-time={seg.time}
                data-speaker={seg.speaker}
                data-lang={selectedLang}
              >
                {transText}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FeedVideoPlayer;
