import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Tv, FileText, Copy, Check, Search, Maximize2, Share2 } from 'lucide-react';
import { extractYouTubeId } from './KpleAddVideoModal';
import type { KpleVideoItem } from './KpleWatchPlayer';

interface KpleInlineWatchSectionProps {
  videos: KpleVideoItem[];
  accent?: string;
  networkName?: string;
  onOpenModal?: (vid: KpleVideoItem) => void;
}

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
  const [activeVideo, setActiveVideo] = useState<KpleVideoItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState<'description' | 'transcript'>('description');
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize active video
  useEffect(() => {
    if (videos.length > 0 && !activeVideo) {
      setActiveVideo(videos[0]);
    }
  }, [videos]);

  // Load video playback when activeVideo changes
  useEffect(() => {
    if (activeVideo && videoRef.current) {
      videoRef.current.load();
    }
  }, [activeVideo?.id]);

  // Filter out livestreams
  const cleanVideos = videos.filter(v => {
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

  if (cleanVideos.length === 0) return null;

  const currentActive = cleanVideos.find(v => v.id === activeVideo?.id) || cleanVideos[0];

  // Filtered playlist
  const filteredVideos = cleanVideos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.channelName && v.channelName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (v.tags && v.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const ytId = extractYouTubeId(currentActive.videoUrl);

  return (
    <section id="whats-on-now" style={{ padding: '40px 0', width: '100%', overflow: 'hidden' }}>
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
              {ytId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=0`}
                  title={currentActive.title}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              ) : (currentActive.videoUrl && (currentActive.videoUrl.includes('lightcast.com') || currentActive.videoUrl.includes('embed') || currentActive.videoUrl.includes('player.php'))) ? (
                <iframe
                  src={currentActive.videoUrl}
                  title={currentActive.title}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  src={currentActive.videoUrl}
                  controls
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                >
                  <source src={currentActive.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>

            {/* Video Metadata & Description/Transcript Tabs */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '0 0 4px 0', letterSpacing: '-0.3px' }}>
                    {sanitizeTitle(currentActive.title)}
                  </h3>
                  {currentActive.channelName && (
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: accent }}>
                      {currentActive.channelName}
                    </span>
                  )}
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
                  Section Video Playlist
                </h3>
                <span style={{ fontSize: '11px', fontWeight: 800, color: accent, background: `${accent}22`, padding: '3px 8px', borderRadius: '10px' }}>
                  {filteredVideos.length} Videos
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input
                  type="text"
                  placeholder="Filter section videos..."
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

            {/* Video List Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredVideos.map((vid) => {
                const isCurrent = vid.id === currentActive.id;
                return (
                  <motion.div
                    key={vid.id}
                    whileHover={{ scale: 1.02, x: 2 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setActiveVideo(vid)}
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
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                        {isCurrent ? (
                          <span style={{ color: accent, fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ▶ NOW PLAYING
                          </span>
                        ) : (
                          <span>{vid.channelName || networkName}</span>
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
