import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Tv, FileText, Copy, Check, Search, Maximize2, Share2, Volume2, VolumeX, Radio } from 'lucide-react';
import { extractYouTubeId } from './KpleAddVideoModal';
import type { KpleVideoItem } from './KpleWatchPlayer';

interface KpleInlineWatchSectionProps {
  videos: KpleVideoItem[];
  accent?: string;
  networkName?: string;
  onOpenModal?: (vid: KpleVideoItem) => void;
}

export interface BroadcastScheduleItem {
  video: KpleVideoItem;
  elapsedSeconds: number;
  scheduledAirTime?: string;
  isCustomScheduled: boolean;
  isCommercialBreak?: boolean;
  commercialLabel?: string;
}

function computeSlotTimeline(
  v: KpleVideoItem,
  slotMin: number,
  slotElapsedSec: number,
  scheduledAirTime?: string
): BroadcastScheduleItem {
  const slotTotalSec = slotMin * 60;

  // Extract main video duration in seconds (default to 22m for 30m slot, 45m for 60m slot if unspecified)
  let rawDur = (v as any).durationMinutes && (v as any).durationMinutes > 0
    ? Math.floor((v as any).durationMinutes * 60)
    : (typeof v.duration === 'number' && v.duration > 0 ? v.duration : (slotMin === 60 ? 2700 : 1320));

  // Mid-roll break length: 2 mins (120s) for 30m slot, 3 mins (180s) for 60m slot
  const midRollSec = slotMin === 60 ? 180 : 120;
  const maxProgSec = Math.max(60, slotTotalSec - midRollSec);
  const progDurSec = Math.min(rawDur, maxProgSec);
  const midSec = Math.floor(progDurSec / 2);

  // Extract commercial URL from tags if available
  const tagsStr = (v.tags || []).join(' ');
  const adUrlMatch = tagsStr.match(/ad_url:([^\s]+)/);
  const adUrl = adUrlMatch ? adUrlMatch[1] : (v as any).commercialMediaUrl;

  const commercialVideo: KpleVideoItem = {
    id: `ad-${v.id}`,
    title: `KPLE-TV Station Promos & Commercial Break`,
    videoUrl: adUrl || 'https://www.youtube.com/watch?v=njSC3gMfjjU',
    image: v.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
    channelName: 'KPLE-TV Network',
    description: 'Official KPLE-TV Station Commercial Break and Community Announcements',
    scheduledAirTime: scheduledAirTime || v.scheduledAirTime,
    airTimeSlot: v.airTimeSlot
  };

  // Phase 1: Main Video Part 1 (0 to midSec)
  if (slotElapsedSec < midSec) {
    return {
      video: v,
      elapsedSeconds: slotElapsedSec,
      scheduledAirTime: scheduledAirTime || v.scheduledAirTime,
      isCustomScheduled: true,
      isCommercialBreak: false
    };
  }

  // Phase 2: Mid-Roll Commercial Break (midSec to midSec + midRollSec)
  if (slotElapsedSec < midSec + midRollSec) {
    return {
      video: commercialVideo,
      elapsedSeconds: slotElapsedSec - midSec,
      scheduledAirTime: scheduledAirTime || v.scheduledAirTime,
      isCustomScheduled: true,
      isCommercialBreak: true,
      commercialLabel: 'MID-ROLL COMMERCIAL BREAK'
    };
  }

  // Phase 3: Main Video Part 2 (midSec + midRollSec to progDurSec + midRollSec)
  if (slotElapsedSec < progDurSec + midRollSec) {
    const mainSeekSec = midSec + (slotElapsedSec - (midSec + midRollSec));
    return {
      video: v,
      elapsedSeconds: mainSeekSec,
      scheduledAirTime: scheduledAirTime || v.scheduledAirTime,
      isCustomScheduled: true,
      isCommercialBreak: false
    };
  }

  // Phase 4: Post-Show Commercial & Station Promo Reel (progDurSec + midRollSec to slotTotalSec)
  return {
    video: commercialVideo,
    elapsedSeconds: slotElapsedSec - (progDurSec + midRollSec),
    scheduledAirTime: scheduledAirTime || v.scheduledAirTime,
    isCustomScheduled: true,
    isCommercialBreak: true,
    commercialLabel: 'STATION PROMO & SPONSOR REEL'
  };
}

function calculateCurrentBroadcast(videos: KpleVideoItem[]): BroadcastScheduleItem | null {
  if (!videos || videos.length === 0) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSecondsInMin = now.getSeconds();

  // 1. Direct slot match
  for (const v of videos) {
    if (v.scheduledAirTime) {
      const parts = v.scheduledAirTime.split(':');
      const startMin = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      const slotMin = (v.airTimeSlot === '1 Hour' || (v as any).slotMinutes === 60) ? 60 : 30;
      const endMin = startMin + slotMin;

      let isMatch = false;
      let elapsedMin = 0;

      if (endMin <= 1440) {
        if (currentMinutes >= startMin && currentMinutes < endMin) {
          isMatch = true;
          elapsedMin = currentMinutes - startMin;
        }
      } else {
        // Midnight wrap window (e.g. 23:30 - 00:30)
        const wrappedEnd = endMin % 1440;
        if (currentMinutes >= startMin || currentMinutes < wrappedEnd) {
          isMatch = true;
          elapsedMin = (currentMinutes - startMin + 1440) % 1440;
        }
      }

      if (isMatch) {
        const slotElapsedSec = elapsedMin * 60 + currentSecondsInMin;
        return computeSlotTimeline(v, slotMin, slotElapsedSec, v.scheduledAirTime);
      }
    }
  }

  // 2. Continuous 24/7 Looping Fallback
  const firstParts = (videos[0].scheduledAirTime || '15:30').split(':');
  const firstStartMin = parseInt(firstParts[0], 10) * 60 + parseInt(firstParts[1], 10);
  let totalScheduleMin = 0;
  for (const v of videos) {
    totalScheduleMin += (v.airTimeSlot === '1 Hour' || (v as any).slotMinutes === 60) ? 60 : 30;
  }
  if (totalScheduleMin === 0) totalScheduleMin = videos.length * 30;

  const diffFromScheduleStart = (currentMinutes - firstStartMin + 1440) % 1440;
  const cycleMin = diffFromScheduleStart % totalScheduleMin;

  let accumulatedMin = 0;
  for (const v of videos) {
    const vSlotMin = (v.airTimeSlot === '1 Hour' || (v as any).slotMinutes === 60) ? 60 : 30;
    if (cycleMin >= accumulatedMin && cycleMin < accumulatedMin + vSlotMin) {
      const slotElapsedSec = (cycleMin - accumulatedMin) * 60 + currentSecondsInMin;
      const cycleStartMin = (currentMinutes - (cycleMin - accumulatedMin) + 1440) % 1440;
      const h = Math.floor(cycleStartMin / 60);
      const m = cycleStartMin % 60;
      const currentAirTime = `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;

      return computeSlotTimeline(v, vSlotMin, slotElapsedSec, currentAirTime);
    }
    accumulatedMin += vSlotMin;
  }

  return computeSlotTimeline(videos[0], 30, 0, videos[0].scheduledAirTime || '15:30');
}

const formatAirTime12h = (timeStr?: string) => {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
};

const sanitizeTitle = (t?: string) => {
  if (!t) return '';
  return t
    .replace(/Diairies/gi, 'Diaries')
    .replace(/Banglades/gi, 'Bangladesh')
    .trim();
};

export const KpleInlineWatchSection: React.FC<KpleInlineWatchSectionProps> = ({
  videos = [],
  accent = '#004e98',
  networkName = 'KPLE-TV',
  onOpenModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'description' | 'transcript'>('description');
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [userSelectedVideo, setUserSelectedVideo] = useState<KpleVideoItem | null>(null);
  const [clockTick, setClockTick] = useState<number>(() => Date.now());

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytDurationRef = useRef<number>(0);

  // High-precision clock tick: ensures live broadcast transitions happen synchronously on the second
  useEffect(() => {
    const timer = setInterval(() => {
      setClockTick(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter out livestreams
  const cleanVideos = useMemo(() => {
    return videos.filter(v => {
      const url = (v.videoUrl || '').toLowerCase();
      const title = (v.title || '').toLowerCase();
      const tagsStr = (v.tags || []).join(' ').toLowerCase();
      return (
        !tagsStr.includes('live stream') &&
        !tagsStr.includes('livestream') &&
        !title.includes('live stream') &&
        !title.includes('livestream') &&
        !url.includes('.m3u8') &&
        !url.includes('stream.mux.com')
      );
    });
  }, [videos]);

  // Synchronously compute current broadcast from cleanVideos and clockTick
  const currentBroadcast = useMemo(() => {
    return calculateCurrentBroadcast(cleanVideos);
  }, [cleanVideos, clockTick]);

  // Derive currently active video: user selection takes priority; otherwise active live program
  const currentActive = userSelectedVideo || currentBroadcast?.video || cleanVideos[0];
  const isCurrentAirProgram = !userSelectedVideo && currentBroadcast && currentActive?.id === currentBroadcast.video.id;
  const rawElapsed = isCurrentAirProgram && currentBroadcast ? Math.max(0, Math.floor(currentBroadcast.elapsedSeconds)) : 0;

  // Exact startSeconds with duration boundary handling
  const startSeconds = useMemo(() => {
    if (!isCurrentAirProgram || rawElapsed <= 0) return 0;
    const durSec = (currentActive as any)?.durationMinutes && (currentActive as any).durationMinutes > 0
      ? Math.floor((currentActive as any).durationMinutes * 60)
      : (typeof currentActive?.duration === 'number' && currentActive.duration > 0
        ? currentActive.duration
        : (ytDurationRef.current > 0 ? Math.floor(ytDurationRef.current) : 1650));
    
    let calc = rawElapsed;
    if (durSec > 0 && calc >= durSec) {
      calc = calc % durSec;
    }
    return Math.max(0, Math.floor(calc));
  }, [isCurrentAirProgram, rawElapsed, currentActive]);

  // Compute initial start seconds once per active video change to keep iframe src stable
  const initialStartRef = useRef<{ id: string; seconds: number }>({ id: '', seconds: 0 });
  if (initialStartRef.current.id !== (currentActive?.id || '')) {
    initialStartRef.current = {
      id: currentActive?.id || '',
      seconds: startSeconds
    };
  }
  const initialStartSeconds = initialStartRef.current.seconds;

  const ytId = currentActive ? extractYouTubeId(currentActive.videoUrl) : null;

  // PostMessage helper for YouTube iframe API
  const postToYouTube = (func: string, args: any[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args
          }),
          '*'
        );
      }
    } catch (e) {
      console.warn('YouTube postMessage error:', e);
    }
  };

  // Execute precise seek on YouTube
  const executeYouTubeSeek = (targetSec: number) => {
    if (targetSec <= 0) return;
    let actualTarget = targetSec;
    if (ytDurationRef.current > 0 && actualTarget >= ytDurationRef.current) {
      actualTarget = actualTarget % Math.floor(ytDurationRef.current);
    }
    postToYouTube('seekTo', [Math.floor(actualTarget), true]);
    postToYouTube('playVideo');
    if (isMuted) {
      postToYouTube('mute');
    } else {
      postToYouTube('unMute');
      postToYouTube('setVolume', [100]);
    }
  };

  // Toggle Mute / Unmute handler
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    // 1. YouTube iframe control
    if (ytId) {
      if (nextMuted) {
        postToYouTube('mute');
      } else {
        postToYouTube('unMute');
        postToYouTube('setVolume', [100]);
        postToYouTube('playVideo');
      }
    }

    // 2. HTML5 <video> control
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(e => console.warn('HTML5 play on unmute error:', e));
      }
    }
  };

  // Listen to YouTube API messages to capture duration and enforce seek when player is ready
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        if (!event.data || typeof event.data !== 'string') return;
        const data = JSON.parse(event.data);

        // Capture reported duration from YouTube
        if (data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            ytDurationRef.current = data.info.duration;
          }
        }

        // When YouTube player announces ready
        if (data.event === 'onReady' || (data.event === 'infoDelivery' && data.info && data.info.playerState !== undefined)) {
          if (isCurrentAirProgram && initialStartSeconds > 0) {
            executeYouTubeSeek(initialStartSeconds);
          }
          if (isMuted) {
            postToYouTube('mute');
          } else {
            postToYouTube('unMute');
            postToYouTube('setVolume', [100]);
          }
        }
      } catch (_) {}
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [isCurrentAirProgram, currentActive?.id, isMuted]);

  // Handle iframe load event with staggered retry sequence to guarantee sync
  const handleIframeLoad = () => {
    [150, 450, 900, 1800].forEach(delay => {
      setTimeout(() => {
        if (isCurrentAirProgram && initialStartSeconds > 0) {
          executeYouTubeSeek(initialStartSeconds);
        }
        postToYouTube('playVideo');
        if (isMuted) {
          postToYouTube('mute');
        } else {
          postToYouTube('unMute');
          postToYouTube('setVolume', [100]);
        }
      }, delay);
    });
  };

  // Seek and play for HTML5 <video>
  const applyHtml5Seek = () => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isCurrentAirProgram && startSeconds > 0) {
        try {
          const dur = videoRef.current.duration;
          let target = startSeconds;
          if (dur && !isNaN(dur) && dur > 0 && target >= dur) {
            target = target % Math.floor(dur);
          }
          if (Math.abs(videoRef.current.currentTime - target) > 1.5) {
            videoRef.current.currentTime = target;
          }
        } catch (_) {}
      }
      videoRef.current.play().catch(err => {
        console.warn("Virtual linear TV play error, retrying muted:", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(e => console.warn("Fallback muted play failed:", e));
        }
      });
    }
  };

  const handleVideoLoadedMetadata = () => {
    applyHtml5Seek();
  };

  // HTML5 video play when currentActive or isCurrentAirProgram changes
  useEffect(() => {
    if (videoRef.current && currentActive && !ytId) {
      applyHtml5Seek();
    }
  }, [currentActive?.id, isCurrentAirProgram]);

  if (cleanVideos.length === 0) return null;

  // Filtered playlist sorted sequentially starting from 3:30 PM (930 mins from midnight)
  const filteredVideos = cleanVideos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.channelName && v.channelName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (v.tags && v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  ).sort((a, b) => {
    const getOffsetMin = (timeStr?: string) => {
      if (!timeStr) return 0;
      const parts = timeStr.split(':');
      const min = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      return (min - 930 + 1440) % 1440;
    };
    return getOffsetMin(a.scheduledAirTime) - getOffsetMin(b.scheduledAirTime);
  });

  return (
    <section id="whats-on-now" style={{ padding: '40px 0', width: '100%', overflow: 'hidden' }}>
      {/* Pulse Animation Style */}
      <style>{`
        @keyframes kpleLiveDotPulse {
          0% { transform: scale(0.9); opacity: 0.8; box-shadow: 0 0 4px #ff0050; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 16px #ff0050; }
          100% { transform: scale(0.9); opacity: 0.8; box-shadow: 0 0 4px #ff0050; }
        }
      `}</style>

      <div className="px-mobile-sm" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ width: '4px', height: '24px', borderRadius: '4px', background: accent, boxShadow: `0 0 12px ${accent}` }} />
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px', color: accent }}>
                KPLE-TV Official Watch Theater
              </span>
            </div>
            <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              WHAT'S ON NOW
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onOpenModal && (
              <button
                onClick={() => onOpenModal(currentActive)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  fontSize: '12px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <Maximize2 size={16} />
                <span>Open Cinema Theater</span>
              </button>
            )}
          </div>
        </div>

        {/* Watch Theater Main Container */}
        <div style={{
          background: 'rgba(12, 13, 20, 0.95)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: 0
        }} className="flex-col-mobile">
          
          {/* Left Stage: Player & Info */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Player Container */}
            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              background: '#000',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.9)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {/* Broadcast LIVE Watermark (Top Right) */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 25,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.72)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                padding: '6px 14px',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
                pointerEvents: 'none',
                userSelect: 'none'
              }}>
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#ff0050',
                  boxShadow: '0 0 12px #ff0050',
                  display: 'inline-block',
                  animation: 'kpleLiveDotPulse 1.5s infinite ease-in-out'
                }} />
                <span style={{
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  lineHeight: 1
                }}>
                  LIVE
                </span>
              </div>

              {/* Unmute / Volume Control Overlay */}
              <button
                type="button"
                onClick={handleToggleMute}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  zIndex: 25,
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMuted ? '8px' : '6px',
                  background: isMuted ? 'rgba(0, 0, 0, 0.88)' : 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isMuted ? `1.5px solid ${accent}` : '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: isMuted ? '8px 18px' : '6px 14px',
                  borderRadius: '30px',
                  fontSize: isMuted ? '12px' : '11px',
                  fontWeight: isMuted ? 800 : 700,
                  cursor: 'pointer',
                  boxShadow: isMuted ? `0 8px 24px rgba(0,0,0,0.7), 0 0 15px ${accent}44` : 'none',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {isMuted ? (
                  <>
                    <VolumeX size={16} color={accent} />
                    <span>Click to Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} color="#30d158" />
                    <span>Mute</span>
                  </>
                )}
              </button>

              {currentBroadcast?.isCommercialBreak && !userSelectedVideo ? (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 20,
                  background: 'radial-gradient(circle at center, #0e1222 0%, #05060b 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px',
                  textAlign: 'center',
                  boxSizing: 'border-box'
                }}>
                  {/* Glowing Ambient Light */}
                  <div style={{
                    position: 'absolute',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    background: accent,
                    filter: 'blur(110px)',
                    opacity: 0.22,
                    pointerEvents: 'none'
                  }} />

                  {/* KPLE Station Logo Icon */}
                  <div style={{
                    width: '76px',
                    height: '76px',
                    borderRadius: '22px',
                    background: `linear-gradient(135deg, ${accent}44, rgba(0,0,0,0.85))`,
                    border: `1.5px solid ${accent}aa`,
                    boxShadow: `0 0 45px ${accent}66`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '22px',
                    position: 'relative'
                  }}>
                    <Radio size={38} color="#fff" />
                  </div>

                  <div style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    color: accent,
                    marginBottom: '10px'
                  }}>
                    KPLE-TV • CHRISTIAN REVIVAL NETWORK
                  </div>

                  <h2 style={{
                    fontSize: '38px',
                    fontWeight: 900,
                    color: '#fff',
                    margin: '0 0 14px 0',
                    letterSpacing: '-0.8px',
                    textShadow: '0 4px 25px rgba(0,0,0,0.9)'
                  }}>
                    WE WILL BE RIGHT BACK
                  </h2>

                  <p style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.72)',
                    maxWidth: '480px',
                    margin: '0 0 24px 0',
                    lineHeight: 1.5,
                    fontWeight: 500
                  }}>
                    Station break in progress. Live programming will resume shortly.
                  </p>

                  {/* Station Status Pill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    padding: '8px 22px',
                    borderRadius: '30px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#ffaa00',
                      boxShadow: '0 0 12px #ffaa00',
                      animation: 'kpleLiveDotPulse 1.5s infinite ease-in-out'
                    }} />
                    <span>📣 {currentBroadcast.commercialLabel || 'COMMERCIAL BREAK IN PROGRESS'}</span>
                  </div>
                </div>
              ) : ytId ? (
                <iframe
                  ref={iframeRef}
                  key={`yt-${currentActive.id}-${isCurrentAirProgram ? 'live' : 'vod'}`}
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=1&enablejsapi=1&rel=0&start=${initialStartSeconds}&playsinline=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
                  title={currentActive.title}
                  onLoad={handleIframeLoad}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; clipboard-write; gyroscope"
                  allowFullScreen
                />
              ) : (currentActive.videoUrl && (currentActive.videoUrl.includes('lightcast.com') || currentActive.videoUrl.includes('embed') || currentActive.videoUrl.includes('player.php'))) ? (
                <iframe
                  src={currentActive.videoUrl}
                  title={currentActive.title}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  key={`vid-${currentActive.id}-${isCurrentAirProgram ? 'live' : 'vod'}`}
                  src={currentActive.videoUrl}
                  autoPlay
                  muted={isMuted}
                  playsInline
                  controls
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onLoadedData={applyHtml5Seek}
                  onCanPlay={applyHtml5Seek}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onEnded={() => {
                    if (userSelectedVideo) {
                      setUserSelectedVideo(null);
                    } else {
                      applyHtml5Seek();
                    }
                  }}
                >
                  <source src={currentActive.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>

            {/* Video Metadata & Description/Transcript Tabs */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    {isCurrentAirProgram ? (
                      currentBroadcast?.isCommercialBreak ? (
                        <span style={{
                          background: 'rgba(255, 170, 0, 0.18)',
                          border: '1px solid rgba(255, 170, 0, 0.5)',
                          color: '#ffaa00',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 900,
                          letterSpacing: '0.8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffaa00', display: 'inline-block', animation: 'kpleLiveDotPulse 1.5s infinite ease-in-out' }} />
                          📣 {currentBroadcast.commercialLabel || 'COMMERCIAL BREAK'} • {formatAirTime12h(currentActive.scheduledAirTime || currentBroadcast?.scheduledAirTime)}
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(255, 0, 80, 0.15)',
                          border: '1px solid rgba(255, 0, 80, 0.4)',
                          color: '#ff4d85',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 900,
                          letterSpacing: '0.8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff0050', display: 'inline-block', animation: 'kpleLiveDotPulse 1.5s infinite ease-in-out' }} />
                          ON AIR NOW • {formatAirTime12h(currentActive.scheduledAirTime || currentBroadcast?.scheduledAirTime)} ({currentActive.airTimeSlot || '30 mins'})
                        </span>
                      )
                    ) : (
                      <>
                        <span style={{
                          background: 'rgba(0, 212, 255, 0.12)',
                          border: '1px solid rgba(0, 212, 255, 0.3)',
                          color: '#00d4ff',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          📅 BROADCAST AIRTIME: {formatAirTime12h(currentActive.scheduledAirTime) || 'Scheduled'} ({currentActive.airTimeSlot || '30 mins'})
                        </span>
                        {userSelectedVideo && currentBroadcast && (
                          <button
                            type="button"
                            onClick={() => setUserSelectedVideo(null)}
                            style={{
                              background: 'rgba(255, 0, 80, 0.18)',
                              border: '1px solid rgba(255, 0, 80, 0.45)',
                              color: '#ff4d85',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Radio size={12} />
                            <span>Return to Live Broadcast</span>
                          </button>
                        )}
                      </>
                    )}
                    {currentActive.channelName && (
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: accent }}>
                        {currentActive.channelName}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '0 0 4px 0', letterSpacing: '-0.3px' }}>
                    {sanitizeTitle(currentActive.title)}
                  </h3>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentActive.videoUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {copiedLink ? <Check size={14} color="#30d158" /> : <Share2 size={14} />}
                    <span>{copiedLink ? 'Copied!' : 'Share Video'}</span>
                  </button>
                </div>
              </div>

              {/* Tabs: Description | Transcript */}
              <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '14px' }}>
                <button
                  onClick={() => setTab('description')}
                  style={{
                    background: tab === 'description' ? accent : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Description
                </button>

                <button
                  onClick={() => setTab('transcript')}
                  style={{
                    background: tab === 'transcript' ? accent : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <FileText size={14} />
                  <span>Transcript</span>
                </button>
              </div>

              {/* Tab Content */}
              {tab === 'description' && (
                <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-line' }}>
                  {currentActive.description || 'Welcome to KPLE-TV. Stream faith, family, and community-centered broadcasts.'}
                </div>
              )}

              {tab === 'transcript' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: accent }}>
                      Episode Transcript
                    </span>

                    {currentActive.transcript && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(currentActive.transcript || '');
                          setCopiedTranscript(true);
                          setTimeout(() => setCopiedTranscript(false), 2000);
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {copiedTranscript ? <Check size={12} color="#30d158" /> : <Copy size={12} />}
                        <span>{copiedTranscript ? 'Copied!' : 'Copy Transcript'}</span>
                      </button>
                    )}
                  </div>

                  <div style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '14px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.9)',
                    whiteSpace: 'pre-line'
                  }}>
                    {currentActive.transcript || '[00:00] Transcript available for this broadcast episode.'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Stage: Section Video List Playlist */}
          <div style={{
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxHeight: '720px'
          }}>
            {/* Playlist Header & Search */}
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>
                  📺 Broadcast Air Schedule
                </h3>
                <span style={{ fontSize: '11px', fontWeight: 800, color: accent, background: `${accent}22`, padding: '3px 8px', borderRadius: '10px' }}>
                  {filteredVideos.length} Scheduled Shows
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type="text"
                  placeholder="Filter broadcast schedule..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    padding: '8px 12px 8px 34px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Return to Live Schedule Broadcast Banner */}
            {userSelectedVideo && currentBroadcast && (
              <div style={{ padding: '12px 14px 0 14px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setUserSelectedVideo(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 0, 80, 0.14)',
                    border: '1px solid rgba(255, 0, 80, 0.35)',
                    borderRadius: '12px',
                    color: '#ff4d85',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 0, 80, 0.22)'}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 0, 80, 0.14)'}
                >
                  <Radio size={14} />
                  <span>Return to Live Broadcast</span>
                </button>
              </div>
            )}

            {/* Video List Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredVideos.map((vid) => {
                const isCurrent = vid.id === currentActive.id;
                const isAirBroadcast = currentBroadcast && vid.id === currentBroadcast.video.id;
                return (
                  <motion.div
                    key={vid.id}
                    whileHover={{ scale: 1.02, x: 2 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => {
                      if (currentBroadcast && vid.id === currentBroadcast.video.id) {
                        setUserSelectedVideo(null);
                      } else {
                        setUserSelectedVideo(vid);
                      }
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '14px',
                      background: isCurrent ? `${accent}22` : 'rgba(255,255,255,0.02)',
                      border: isCurrent ? `1.5px solid ${accent}` : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Thumbnail Box */}
                    <div style={{
                      width: '100px',
                      height: '56px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      position: 'relative',
                      background: '#000',
                      flexShrink: 0
                    }}>
                      <img
                        src={vid.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400'}
                        alt={vid.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {isCurrent ? (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Tv size={18} color={accent} />
                        </div>
                      ) : (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.8
                        }}>
                          <Play size={16} fill="#fff" color="#fff" />
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: isCurrent ? '#fff' : 'rgba(255,255,255,0.9)',
                        margin: 0,
                        lineHeight: 1.35,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }} title={sanitizeTitle(vid.title)}>
                        {sanitizeTitle(vid.title)}
                      </h4>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', flexWrap: 'wrap', marginTop: '4px' }}>
                        {isAirBroadcast ? (
                          <span style={{
                            color: '#ff4d85',
                            fontWeight: 900,
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            background: 'rgba(255,0,80,0.15)',
                            padding: '2px 6px',
                            borderRadius: '5px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ff0050', display: 'inline-block', animation: 'kpleLiveDotPulse 1.5s infinite ease-in-out' }} />
                            ON AIR NOW • {formatAirTime12h(vid.scheduledAirTime)} ({vid.airTimeSlot || '30 mins'})
                          </span>
                        ) : (
                          <span style={{
                            color: '#00d4ff',
                            fontWeight: 800,
                            fontSize: '10px',
                            background: 'rgba(0,212,255,0.1)',
                            padding: '2px 6px',
                            borderRadius: '5px'
                          }}>
                            📅 Airs {formatAirTime12h(vid.scheduledAirTime) || 'Scheduled'} ({vid.airTimeSlot || '30 mins'})
                          </span>
                        )}
                        {isCurrent ? (
                          <span style={{ color: accent, fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ▶ VIEWING
                          </span>
                        ) : (
                          <span>• {vid.channelName || networkName}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
