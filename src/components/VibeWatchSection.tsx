import React, { useState, useEffect } from 'react';
import { Play, Tv, ExternalLink } from 'lucide-react';

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

const STATIC_VIBE_VIDEOS: VibeVideoClip[] = [
  {
    id: '4cqcl3Jy_hw',
    youtubeId: '4cqcl3Jy_hw',
    title: 'FAA Wants to Change This Old Air Traffic System',
    source: 'CNN News',
    category: 'news',
    description: "Many of America's busiest air traffic control towers still rely on paper flight strips to track aircraft movements. Now, the FAA is pushing for modernization.",
    duration: '3:15',
    thumbnail: '/n2n/air_traffic_control.png',
    videoUrl: 'https://www.youtube.com/watch?v=4cqcl3Jy_hw'
  },
  {
    id: '-d4T5ruaGeA',
    youtubeId: '-d4T5ruaGeA',
    title: "'COMPLETE JOKE': Mamdani RIPPED for 'Self-Serving' ICE Demand",
    source: 'Fox News',
    category: 'foxnews',
    description: "Former Acting ICE Director Jonathan Fahey joined 'Fox & Friends First' to discuss calls regarding agency oversight and immigration policy.",
    duration: '4:20',
    thumbnail: 'https://i2.ytimg.com/vi/-d4T5ruaGeA/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=-d4T5ruaGeA'
  },
  {
    id: 'ciq7HeiJCOE',
    youtubeId: 'ciq7HeiJCOE',
    title: "Ashley Parker Analysis: Live Broadcast & White House Events",
    source: 'MSNBC',
    category: 'politics',
    description: "Political correspondents break down the high-profile White House events and policy discussions from Washington.",
    duration: '5:45',
    thumbnail: 'https://i4.ytimg.com/vi/ciq7HeiJCOE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ciq7HeiJCOE'
  },
  {
    id: 'HPiqxMrKMKQ',
    youtubeId: 'HPiqxMrKMKQ',
    title: 'The Surprising Way Elizabeth Hurley & Billy Ray Cyrus Started Dating',
    source: 'People Weekly',
    category: 'entertainment',
    description: 'Billy Ray Cyrus reveals how his romance with Elizabeth Hurley began and what brought the two celebrity stars together.',
    duration: '3:40',
    thumbnail: 'https://i1.ytimg.com/vi/HPiqxMrKMKQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=HPiqxMrKMKQ'
  },
  {
    id: 'vwOxJJ80t3k',
    youtubeId: 'vwOxJJ80t3k',
    title: 'Market Shifts: Fast Food Competition & Business Strategies',
    source: 'CNBC',
    category: 'money',
    description: 'Industry analysts examine the quick-service restaurant wars and how consumer demand is reshaping national food chains.',
    duration: '6:12',
    thumbnail: 'https://i3.ytimg.com/vi/vwOxJJ80t3k/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=vwOxJJ80t3k'
  },
  {
    id: 'vyqy7PcDGLM',
    youtubeId: 'vyqy7PcDGLM',
    title: "College World Series Experience + Top Star Athletes to Watch",
    source: 'ESPN',
    category: 'sports',
    description: 'Karl Ravech joins The Pat McAfee Show to break down the Men\'s College World Series showdown in Omaha.',
    duration: '7:50',
    thumbnail: 'https://i3.ytimg.com/vi/vyqy7PcDGLM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=vyqy7PcDGLM'
  }
];

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function VibeWatchSection({ accent = '#D35400' }: { accent?: string }) {
  const [videoList, setVideoList] = useState<VibeVideoClip[]>(STATIC_VIBE_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VibeVideoClip>(STATIC_VIBE_VIDEOS[0]);
  const [filter, setFilter] = useState<'all' | 'news' | 'foxnews' | 'politics' | 'entertainment' | 'money' | 'sports'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Fetch dynamic YouTube RSS feeds
  useEffect(() => {
    let cancelled = false;

    async function loadDynamicFeeds() {
      const dynamicClips: VibeVideoClip[] = [];
      const seen = new Set<string>(STATIC_VIBE_VIDEOS.map(v => v.id));

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

      if (!cancelled && dynamicClips.length > 0) {
        // Sort dynamic clips by published date descending
        dynamicClips.sort((a, b) => (b.published?.getTime() || 0) - (a.published?.getTime() || 0));
        setVideoList([...dynamicClips, ...STATIC_VIBE_VIDEOS]);
        setSelectedVideo(prev => {
          if (prev.id === STATIC_VIBE_VIDEOS[0]?.id) {
            return dynamicClips[0];
          }
          return prev;
        });
      }
    }

    loadDynamicFeeds();
    return () => { cancelled = true; };
  }, []);

  const filteredVideos = videoList.filter(v =>
    filter === 'all' ? true : v.category === filter
  );

  const sidebarVideos = filteredVideos.filter(v => v.id !== selectedVideo.id);
  const activeYtId = selectedVideo.youtubeId || extractYouTubeId(selectedVideo.videoUrl);
  const activeCategoryMeta = CATEGORY_META[selectedVideo.category] || { label: selectedVideo.source, icon: '📺' };

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
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                ) : (
                  <video
                    key={selectedVideo.videoUrl}
                    src={selectedVideo.videoUrl}
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
                    backgroundImage: `url(${selectedVideo.thumbnail})`,
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
                  {selectedVideo.duration}
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
                {selectedVideo.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#aaa', margin: 0, lineHeight: 1.6 }}>
                {selectedVideo.description}
              </p>
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
