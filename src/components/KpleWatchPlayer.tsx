import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Volume2, VolumeX, Copy, Check, FileText, Search, Tv, ChevronRight, Sparkles, Share2 } from 'lucide-react';
import { extractYouTubeId } from './KpleAddVideoModal';

export interface KpleVideoItem {
  id: string;
  title: string;
  image: string;
  videoUrl: string;
  tags?: string[];
  channelName?: string;
  description?: string;
  transcript?: string;
  created_at?: string;
  scheduledAirDate?: string;
  scheduledAirTime?: string;
  airTimeSlot?: string;
  duration?: number;
}

interface KpleWatchPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videos: KpleVideoItem[];
  initialVideoId?: string;
  accent?: string;
  networkName?: string;
}

const sanitizeTitle = (t?: string) => {
  if (!t) return '';
  return t
    .replace(/Diairies/gi, 'Diaries')
    .replace(/Banglades/gi, 'Bangladesh')
    .trim();
};

export const KpleWatchPlayer: React.FC<KpleWatchPlayerProps> = ({
  isOpen,
  onClose,
  videos = [],
  initialVideoId,
  accent = '#004e98',
  networkName = 'KPLE-TV Network'
}) => {
  const [activeVideo, setActiveVideo] = useState<KpleVideoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'description' | 'transcript'>('description');
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize active video
  useEffect(() => {
    if (videos.length === 0) return;
    if (initialVideoId) {
      const found = videos.find(v => v.id === initialVideoId);
      if (found) {
        setActiveVideo(found);
        return;
      }
    }
    setActiveVideo(videos[0]);
  }, [videos, initialVideoId]);

  // PostMessage helper for YouTube iframe API
  const postToYouTube = (func: string, args: any[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      }
    } catch (e) {
      console.warn('YouTube postMessage error in modal:', e);
    }
  };

  // Toggle Mute / Unmute handler
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (iframeRef.current) {
      if (nextMuted) {
        postToYouTube('mute');
      } else {
        postToYouTube('unMute');
        postToYouTube('setVolume', [100]);
        postToYouTube('playVideo');
      }
    }

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(e => console.warn('HTML5 play on unmute error:', e));
      }
    }
  };

  // Load video playback and trigger play when activeVideo changes
  useEffect(() => {
    if (activeVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(err => {
        console.warn("Muted autoplay retry:", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(_ => {});
        }
      });
    }
  }, [activeVideo?.id]);

  if (!isOpen || !activeVideo) return null;

  // Filtered playlist
  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.channelName && v.channelName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (v.tags && v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const ytId = extractYouTubeId(activeVideo.videoUrl);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 6, 12, 0.95)',
          backdropFilter: 'blur(30px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '24px',
          boxSizing: 'border-box'
        }}
      >
        <motion.div
          initial={{ scale: 0.96, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '1440px',
            height: '92vh',
            background: '#090a10',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '28px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 30px 90px rgba(0,0,0,0.92)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.02)',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${accent}22`, border: `1px solid ${accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Tv size={20} style={{ color: accent }} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: accent, display: 'block' }}>
                  {networkName} Watch Theater
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '2px 0 0', letterSpacing: '-0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={sanitizeTitle(activeVideo.title)}>
                  {sanitizeTitle(activeVideo.title)}
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copiedLink ? <Check size={14} color="#30d158" /> : <Share2 size={14} />}
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  margin: 0,
                  lineHeight: 1,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <X size={18} style={{ display: 'block' }} />
              </button>
            </div>
          </div>

          {/* Main Stage: Cinema Player (Left) + Video Catalog List (Right) */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', overflow: 'hidden' }}>
            
            {/* Left Stage: Player + Video Info Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px', gap: '20px' }}>
              {/* Cinema Player Container */}
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                maxHeight: '580px',
                background: '#000',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <style>{`
                  @keyframes kpleLiveDotPulse {
                    0% { transform: scale(0.9); opacity: 0.8; box-shadow: 0 0 4px #ff0050; }
                    50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 16px #ff0050; }
                    100% { transform: scale(0.9); opacity: 0.8; box-shadow: 0 0 4px #ff0050; }
                  }
                `}</style>

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

                {activeVideo.id.startsWith('ad-') ? (
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
                      <span>📣 COMMERCIAL BREAK IN PROGRESS</span>
                    </div>
                  </div>
                ) : ytId ? (
                  <iframe
                    ref={iframeRef}
                    key={`yt-modal-${activeVideo.id}`}
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=1&enablejsapi=1&rel=0&playsinline=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
                    title={activeVideo.title}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; clipboard-write; gyroscope"
                    allowFullScreen
                  />
                ) : (activeVideo.videoUrl && (activeVideo.videoUrl.includes('lightcast.com') || activeVideo.videoUrl.includes('embed') || activeVideo.videoUrl.includes('player.php'))) ? (
                  <iframe
                    src={activeVideo.videoUrl}
                    title={activeVideo.title}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    key={`vid-modal-${activeVideo.id}`}
                    src={activeVideo.videoUrl}
                    autoPlay
                    muted={isMuted}
                    playsInline
                    controls
                    preload="auto"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  >
                    <source src={activeVideo.videoUrl} type="video/mp4" />
                  </video>
                )}
              </div>

              {/* Active Video Meta & Tabs */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                      {sanitizeTitle(activeVideo.title)}
                    </h1>
                    {activeVideo.channelName && (
                      <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: accent }}>
                        {activeVideo.channelName}
                      </span>
                    )}
                  </div>

                  {activeVideo.tags && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {activeVideo.tags.map(t => (
                        <span key={t} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: 700 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tabs: Description | Transcript */}
                <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
                  <button
                    onClick={() => setTab('description')}
                    style={{
                      background: tab === 'description' ? accent : 'rgba(255,255,255,0.06)',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '13px',
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
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <FileText size={15} />
                    <span>Transcript</span>
                  </button>
                </div>

                {/* Tab Content */}
                {tab === 'description' && (
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-line' }}>
                    {activeVideo.description || 'Welcome to this broadcast. Stream high-definition Christian media and teachings on the KPLE-TV Network.'}
                  </div>
                )}

                {tab === 'transcript' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: accent }}>
                        Episode Transcript
                      </span>

                      {activeVideo.transcript && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(activeVideo.transcript || '');
                            setCopiedTranscript(true);
                            setTimeout(() => setCopiedTranscript(false), 2000);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.1)',
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
                          {copiedTranscript ? <Check size={14} color="#30d158" /> : <Copy size={14} />}
                          <span>{copiedTranscript ? 'Copied!' : 'Copy Transcript'}</span>
                        </button>
                      )}
                    </div>

                    <div style={{
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      padding: '18px',
                      maxHeight: '260px',
                      overflowY: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.9)',
                      whiteSpace: 'pre-line'
                    }}>
                      {activeVideo.transcript || '[00:00] Transcript available for this broadcast episode.\n[01:00] In-depth sermon & teaching.'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Video Playlist Catalog List */}
            <div style={{
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.01)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              {/* Search & Header */}
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>
                    Videos in Section
                  </h3>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: accent, background: `${accent}22`, padding: '4px 10px', borderRadius: '12px' }}>
                    {filteredVideos.length} Videos
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input
                    type="text"
                    placeholder="Search section videos..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff',
                      padding: '10px 14px 10px 40px',
                      borderRadius: '14px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Playlist Video Items List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredVideos.map((vid, idx) => {
                  const isCurrent = vid.id === activeVideo.id;
                  return (
                    <motion.div
                      key={vid.id}
                      whileHover={{ scale: 1.02, x: 2 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setActiveVideo(vid)}
                      style={{
                        padding: '10px',
                        borderRadius: '16px',
                        background: isCurrent ? `${accent}25` : 'rgba(255,255,255,0.03)',
                        border: isCurrent ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      {/* Thumbnail Cover */}
                      <div style={{ width: '110px', height: '64px', borderRadius: '10px', overflow: 'hidden', position: 'relative', flexShrink: 0, background: '#000' }}>
                        <img src={vid.image} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isCurrent ? (
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play fill="white" size={14} style={{ marginLeft: '2px' }} />
                            </div>
                          ) : (
                            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play fill="white" size={12} style={{ marginLeft: '2px' }} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Video Info */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                        {isCurrent && (
                          <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', color: accent }}>
                            ▶ NOW PLAYING
                          </span>
                        )}
                        <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={sanitizeTitle(vid.title)}>
                          {sanitizeTitle(vid.title)}
                        </h4>
                        {vid.channelName && (
                          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                            {vid.channelName}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default KpleWatchPlayer;
