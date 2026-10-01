import React, { useState, useEffect, useRef } from 'react';
import { Play, Tv, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export interface VibeVideoClip {
  id: string;
  youtubeId?: string;
  videoUrl: string;
  title: string;
  source: string;
  category: 'news' | 'foxnews' | 'politics' | 'entertainment' | 'money' | 'sports';
  description: string;
  duration: string;
  thumbnail: string;
  published?: Date;
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  news: { label: 'CNN News', icon: '📰' },
  foxnews: { label: 'Fox News', icon: '🦊' },
  politics: { label: 'MSNBC Politics', icon: '⚖️' },
  entertainment: { label: 'People Weekly', icon: '🎭' },
  money: { label: 'CNBC Business', icon: '💵' },
  sports: { label: 'ESPN Sports', icon: '🏈' },
};

const VIBE_FEEDS = [
  { key: 'news', label: '📰 CNN News', channelId: 'UCupvZG-5ko_eiXAupbDfxWw' },
  { key: 'foxnews', label: '🦊 Fox News', channelId: 'UCXIJgqnII2ZOINSWNOGFThA' },
  { key: 'politics', label: '⚖️ MSNBC Politics', channelId: 'UCaXkIU1QidjPwiAYu6GcHjg' },
  { key: 'entertainment', label: '🎭 People Weekly', channelId: 'UCGbQJy-531_5vfphay-rChQ' },
  { key: 'money', label: '💵 CNBC Business', channelId: 'UCvJJ_dzjViJCoLf5uKUTwoA' },
  { key: 'sports', label: '🏈 ESPN Sports', channelId: 'UCiWLfSweyRNmLpgEHekhoAg' },
];

import { supabase } from '../supabaseClient';

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function VibeWatchSection({ accent = '#D35400' }: { accent?: string }) {
  const [videoList, setVideoList] = useState<VibeVideoClip[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VibeVideoClip | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'news' | 'foxnews' | 'politics' | 'entertainment' | 'money' | 'sports'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  const filteredVideos = videoList.filter(v =>
    filter === 'all' ? true : v.category === filter
  );

  const currentVideo = (selectedVideo && filteredVideos.some(v => v.id === selectedVideo.id))
    ? selectedVideo
    : (filteredVideos[0] || videoList[0] || null);

  useEffect(() => {
    setIsDescriptionExpanded(false);
    const timer = setTimeout(() => {
      if (descRef.current) {
        setHasMore(descRef.current.scrollHeight > descRef.current.clientHeight + 4 || (currentVideo?.description?.length || 0) > 160);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [currentVideo?.id, currentVideo?.description]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Fetch dynamic YouTube RSS feeds & Supabase videos
  useEffect(() => {
    let cancelled = false;

    async function loadDynamicFeeds() {
      const dynamicClips: VibeVideoClip[] = [];
      const seen = new Set<string>();

      // 1. Live YouTube RSS channels
      for (const feed of VIBE_FEEDS) {
        try {
          const res = await fetch(`/api/yt-rss/${feed.channelId}`);
          if (!res.ok) continue;
          const xmlText = await res.text();
          const parser = new DOMParser();
          const xml = parser.parseFromString(xmlText, 'text/xml');
          const entries = xml.getElementsByTagName('entry');

          for (let i = 0; i < Math.min(entries.length, 3); i++) {
            const entry = entries[i];
            const id = entry.getElementsByTagName('yt:videoId')[0]?.textContent 
              || entry.getElementsByTagName('id')[0]?.textContent?.split(':').pop() 
              || '';
            const title = entry.getElementsByTagName('title')[0]?.textContent || '';
            const mediaGroup = entry.getElementsByTagName('media:group')[0];
            const description = mediaGroup?.getElementsByTagName('media:description')[0]?.textContent 
              || entry.getElementsByTagName('summary')[0]?.textContent 
              || '';
            const thumbnail = mediaGroup?.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url')
              || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
            const videoUrl = `https://www.youtube.com/watch?v=${id}`;
            const publishedText = entry.getElementsByTagName('published')[0]?.textContent || '';
            const published = publishedText ? new Date(publishedText) : new Date(0);

            if (id && !seen.has(id)) {
              seen.add(id);
              dynamicClips.push({
                id,
                youtubeId: id,
                title,
                description,
                thumbnail,
                videoUrl,
                duration: 'Live Feed',
                source: CATEGORY_META[feed.key]?.label || 'Broadcast',
                category: feed.key as any,
                published
              });
            }
          }
        } catch (_) {}
      }

      // 2. Query Supabase videos table for dynamic items
      try {
        if (supabase) {
          const { data: dbVideos } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

          if (dbVideos) {
            for (const v of dbVideos) {
              const id = String(v.id);
              if (id && !seen.has(id) && v.video_url) {
                seen.add(id);
                const ytId = extractYouTubeId(v.video_url) || undefined;
                dynamicClips.push({
                  id,
                  youtubeId: ytId,
                  title: v.title || 'Broadcast',
                  description: v.description || '',
                  thumbnail: v.thumbnail_url || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : ''),
                  videoUrl: v.video_url,
                  duration: v.duration ? `${Math.floor(v.duration / 60)}:${String(v.duration % 60).padStart(2, '0')}` : 'Live Feed',
                  source: v.source || 'Vibe Network',
                  category: (v.category && CATEGORY_META[v.category] ? v.category : 'news') as any,
                  published: v.created_at ? new Date(v.created_at) : new Date(0)
                });
              }
            }
          }
        }
      } catch (_) {}

      if (!cancelled) {
        if (dynamicClips.length > 0) {
          dynamicClips.sort((a, b) => (b.published?.getTime() || 0) - (a.published?.getTime() || 0));
          setVideoList(dynamicClips);
          setSelectedVideo(prev => prev ? (dynamicClips.find(v => v.id === prev.id) || dynamicClips[0]) : dynamicClips[0]);
        }
        setLoading(false);
      }
    }

    loadDynamicFeeds();
    return () => { cancelled = true; };
  }, []);

  if (loading && videoList.length === 0) {
    return (
      <section
        id="whats-on-now"
        style={{
          position: 'relative',
          padding: '40px 40px',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        <p style={{ color: '#888', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Syncing live broadcasts...
        </p>
      </section>
    );
  }

  if (!currentVideo || videoList.length === 0) {
    return null;
  }

  const sidebarVideos = filteredVideos.filter(v => v.id !== currentVideo.id);
  const activeYtId = currentVideo.youtubeId || extractYouTubeId(currentVideo.videoUrl);
  const activeCategoryMeta = CATEGORY_META[currentVideo.category] || { label: currentVideo.source, icon: '📺' };

  return (
    <section
      id="whats-on-now"
      style={{
        position: 'relative',
        padding: '20px 40px 50px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '4px', 
            height: '32px', 
            borderRadius: '4px', 
            background: accent,
            boxShadow: `0 0 12px ${accent}`
          }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${accent}, #ff0050)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Tv size={15} color="#fff" />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.5px', margin: 0, color: '#fff' }}>
                Vibe <span style={{ color: accent }}>Watch Live</span>
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #999)', margin: '4px 0 0 0' }}>
              Real-time broadcasts, prime-time news, cultural features, sports analysis & entertainment
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          background: 'rgba(255,255,255,0.03)', 
          padding: '4px', 
          borderRadius: '14px', 
          border: '1px solid rgba(255,255,255,0.06)', 
          overflowX: 'auto', 
          scrollbarWidth: 'none', 
          WebkitOverflowScrolling: 'touch',
          maxWidth: '100%'
        } as React.CSSProperties}>
          {([
            ['all', 'All Broadcasts'],
            ['news', '📰 CNN News'],
            ['foxnews', '🦊 Fox News'],
            ['politics', '⚖️ MSNBC'],
            ['entertainment', '🎭 People'],
            ['money', '💵 CNBC'],
            ['sports', '🏈 ESPN']
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '7px 15px',
                borderRadius: '10px',
                border: 'none',
                background: filter === key ? accent : 'transparent',
                color: filter === key ? '#000' : '#888',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Cinema Player on Left + Up Next Sidebar on Right */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '24px', alignItems: 'flex-start' }}>

        {/* LEFT: Main Cinema Player */}
        <div style={{ flex: '1 1 0', minWidth: 0, width: '100%' }}>
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#000',
            border: `1px solid ${accent}33`,
            boxShadow: `0 16px 50px rgba(0,0,0,0.8), 0 0 35px ${accent}12`
          }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
              {isPlaying ? (
                activeYtId ? (
                  <iframe
                    key={activeYtId}
                    src={`https://www.youtube.com/embed/${activeYtId}?autoplay=1&mute=0&rel=0&modestbranding=1&enablejsapi=1&playsinline=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                ) : (
                  <video
                    key={currentVideo.videoUrl}
                    src={currentVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )
              ) : (
                <div
                  onClick={() => setIsPlaying(true)}
                  style={{
                    position: 'absolute', 
                    inset: 0, 
                    cursor: 'pointer', 
                    overflow: 'hidden',
                    backgroundImage: `url(${currentVideo.thumbnail})`,
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center'
                  }}
                >
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)', 
                    backdropFilter: 'blur(2px)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <div style={{
                      width: '74px', 
                      height: '74px', 
                      borderRadius: '50%',
                      background: accent, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: `0 0 35px ${accent}`, 
                      transition: 'transform 0.25s ease',
                      cursor: 'pointer'
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <Play size={32} color="#000" fill="#000" style={{ marginLeft: '4px' }} />
                    </div>
                    <span style={{ marginTop: '18px', color: '#fff', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                      Click To Play Broadcast
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info Bar */}
            <div style={{ padding: '18px 24px', background: 'rgba(12,12,14,0.98)', borderTop: `1px solid ${accent}22` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  background: accent, 
                  color: '#000', 
                  fontSize: '11px', 
                  fontWeight: 900, 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px' 
                }}>
                  {activeCategoryMeta.icon} {activeCategoryMeta.label}
                </span>
                <span style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>
                  {currentVideo.duration}
                </span>
                <span style={{ 
                  fontSize: '10px', 
                  color: '#00ff88', 
                  fontWeight: 800, 
                  background: 'rgba(0,255,136,0.1)', 
                  border: '1px solid rgba(0,255,136,0.3)', 
                  padding: '3px 8px', 
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  ● High Definition Broadcast
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0', lineHeight: 1.35 }}>
                {currentVideo.title}
              </h3>
              <p
                ref={descRef}
                style={{
                  fontSize: '13px',
                  color: '#aaa',
                  margin: 0,
                  lineHeight: 1.6,
                  display: isDescriptionExpanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: isDescriptionExpanded ? undefined : 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: isDescriptionExpanded ? 'visible' : 'hidden',
                  whiteSpace: 'pre-line'
                }}
              >
                {currentVideo.description}
              </p>
              {hasMore && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 0 0 0',
                    color: accent,
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    outline: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px'
                  }}
                  onMouseOver={e => { e.currentTarget.style.opacity = '0.8'; }}
                  onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  {isDescriptionExpanded ? (
                    <>Show Less <ChevronUp size={14} /></>
                  ) : (
                    <>... More <ChevronDown size={14} /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Scrollable Up Next Sidebar */}
        <div style={{
          width: isMobile ? '100%' : '360px',
          flexShrink: 0,
          maxHeight: isMobile ? 'none' : '560px',
          overflowY: isMobile ? 'visible' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: isMobile ? '0' : '4px',
          scrollbarWidth: 'thin',
          scrollbarColor: `${accent}44 transparent`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 2px 0' }}>
            <p style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: '#666', margin: 0 }}>
              Up Next — {sidebarVideos.length} Broadcasts
            </p>
            <span style={{ fontSize: '11px', color: accent, fontWeight: 700 }}>Auto-Synced</span>
          </div>

          {sidebarVideos.length === 0 ? (
            <div style={{ 
              padding: '30px', 
              textAlign: 'center', 
              color: '#666', 
              fontSize: '13px', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.05)' 
            }}>
              No other broadcasts in this category.
            </div>
          ) : (
            sidebarVideos.map(video => {
              const meta = CATEGORY_META[video.category] || { label: video.source, icon: '📺' };
              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    setIsPlaying(true);
                    if (isMobile) {
                      const el = document.getElementById('whats-on-now');
                      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                    }
                  }}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = `${accent}14`;
                    e.currentTarget.style.borderColor = `${accent}55`;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  {/* Thumbnail with overlay & duration */}
                  <div style={{ position: 'relative', width: '135px', flexShrink: 0, aspectRatio: '16/9' }}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(0,0,0,0.75)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Play size={12} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                      </div>
                    </div>
                    <span style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      background: 'rgba(0,0,0,0.85)',
                      fontSize: '9px',
                      fontWeight: 800,
                      color: '#fff'
                    }}>
                      {video.duration}
                    </span>
                  </div>

                  {/* Text details */}
                  <div style={{ padding: '8px 10px 8px 0', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                      {meta.icon} {meta.label}
                    </div>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#eee',
                      margin: 0,
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {video.title}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
