import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Tv, ChevronDown, ChevronUp, RotateCw } from 'lucide-react';

export interface VibeVideoClip {
  id: string;
  youtubeId?: string;
  videoUrl: string;
  title: string;
  source: string;
  category: 'news' | 'foxnews' | 'politics';
  description: string;
  duration: string;
  thumbnail: string;
  published?: Date;
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  news: { label: 'CNN News', icon: '📰' },
  foxnews: { label: 'Fox News', icon: '🦊' },
  politics: { label: 'MSNBC Politics', icon: '⚖️' },
};

const VIBE_FEEDS = [
  { key: 'news', label: '📰 CNN News', channelId: 'UCupvZG-5ko_eiXAupbDfxWw' },
  { key: 'foxnews', label: '🦊 Fox News', channelId: 'UCXIJgqnII2ZOINSWNOGFThA' },
  { key: 'politics', label: '⚖️ MSNBC Politics', channelId: 'UCaXkIU1QidjPwiAYu6GcHjg' },
];

function formatTimeAgo(date?: Date): string {
  if (!date || isNaN(date.getTime()) || date.getTime() === 0) return 'Recent';
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

const DEFAULT_VIBE_CLIPS: VibeVideoClip[] = [
  // --- FOX NEWS ---
  {
    id: 'R1flHmd_hMA',
    youtubeId: 'R1flHmd_hMA',
    videoUrl: 'https://www.youtube.com/watch?v=R1flHmd_hMA',
    title: 'WATCH LIVE: Trump, Vance announce $25M fraud whistleblower incentive program',
    source: 'Fox News',
    category: 'foxnews',
    description: 'Fox News live coverage of the press briefing and national policy addresses from Washington.',
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/R1flHmd_hMA/hqdefault.jpg',
    published: new Date('2026-10-20T12:30:56.000Z')
  },
  {
    id: '-mw4oUPVUvI',
    youtubeId: '-mw4oUPVUvI',
    videoUrl: 'https://www.youtube.com/watch?v=-mw4oUPVUvI',
    title: 'DEVELOPING: DOJ sends grand jury subpoenas to Philadelphia DA',
    source: 'Fox News',
    category: 'foxnews',
    description: 'Federal authorities issue grand jury subpoenas in ongoing accountability and jurisdiction investigation.',
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/-mw4oUPVUvI/hqdefault.jpg',
    published: new Date('2026-10-20T18:15:38.000Z')
  },
  // --- CNN NEWS ---
  {
    id: 'ykFqelzbAGU',
    youtubeId: 'ykFqelzbAGU',
    videoUrl: 'https://www.youtube.com/watch?v=ykFqelzbAGU',
    title: 'Russian drone kills toddler and her mother in Ukrainian park',
    source: 'CNN News',
    category: 'news',
    description: 'CNN reports on the latest conflict developments, international reactions, and emergency response operations.',
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/ykFqelzbAGU/hqdefault.jpg',
    published: new Date('2026-10-20T17:33:34.000Z')
  },
  {
    id: 'KLAQxEyJ5C0',
    youtubeId: 'KLAQxEyJ5C0',
    videoUrl: 'https://www.youtube.com/watch?v=KLAQxEyJ5C0',
    title: 'Trump remarks on campaign trail and political landscape',
    source: 'CNN News',
    category: 'news',
    description: 'Key moments and policy analysis from speeches and rallies across key battleground districts.',
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/KLAQxEyJ5C0/hqdefault.jpg',
    published: new Date('2026-10-20T17:01:21.000Z')
  },
  // --- MSNBC POLITICS ---
  {
    id: 'nMnO3AYCYVE',
    youtubeId: 'nMnO3AYCYVE',
    videoUrl: 'https://www.youtube.com/watch?v=nMnO3AYCYVE',
    title: 'LIVE: President Trump and VP Vance announce fraud whistleblower program as midterms loom',
    source: 'MSNBC Politics',
    category: 'politics',
    description: 'Special political report and panel discussion analyzing executive announcements and legislative impact.',
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/nMnO3AYCYVE/hqdefault.jpg',
    published: new Date('2026-10-20T16:35:36.000Z')
  },
  {
    id: 'Be5Udi94Bk0',
    youtubeId: 'Be5Udi94Bk0',
    videoUrl: 'https://www.youtube.com/watch?v=Be5Udi94Bk0',
    title: "Why would Putin stop? He 'has every incentive' to press his advantage: Fmr. Deputy NSA",
    source: 'MSNBC Politics',
    category: 'politics',
    description: 'National security analysis on foreign policy strategies, global alliances, and regional stability.',
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/Be5Udi94Bk0/hqdefault.jpg',
    published: new Date('2026-10-20T17:05:33.000Z')
  }
];

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function VibeWatchSection({ accent = '#D35400' }: { accent?: string }) {
  const [videoList, setVideoList] = useState<VibeVideoClip[]>(DEFAULT_VIBE_CLIPS);
  const [selectedVideo, setSelectedVideo] = useState<VibeVideoClip | null>(DEFAULT_VIBE_CLIPS[0]);
  const [filter, setFilter] = useState<'all' | 'news' | 'foxnews' | 'politics'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const userSelectedVideoIdRef = useRef<string | null>(null);
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

  // Fetch dynamic live news feeds
  const loadDynamicFeeds = useCallback(async (isManual: boolean = false) => {
    setIsRefreshing(true);
    const dynamicClips: VibeVideoClip[] = [];
    const seen = new Set<string>();

    // Helper to parse XML feed text into video clips
    const parseXmlEntries = (xmlText: string, feedKey: string, feedLabel: string) => {
      try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        const entries = xml.getElementsByTagName('entry');

        for (let i = 0; i < Math.min(entries.length, 12); i++) {
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
            || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
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
              source: feedLabel,
              category: feedKey as any,
              published
            });
          }
        }
      } catch (err) {
        console.warn('Error parsing XML entry:', err);
      }
    };

    // Fetch all live news channels in parallel
    const feedPromises = VIBE_FEEDS.map(async (feed) => {
      try {
        // 1. Try serverless proxy endpoint
        const res = await fetch(`/api/yt-rss/${feed.channelId}`, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const xmlText = await res.text();
          if (xmlText && xmlText.includes('<entry')) {
            parseXmlEntries(xmlText, feed.key, CATEGORY_META[feed.key]?.label || 'News');
            return;
          }
        }
      } catch {}

      try {
        // 2. Direct client fallback via rss2json
        const r2jUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=' + feed.channelId)}`;
        const r2jRes = await fetch(r2jUrl, { signal: AbortSignal.timeout(5000) });
        if (r2jRes.ok) {
          const json = await r2jRes.json();
          if (json.status === 'ok' && Array.isArray(json.items)) {
            for (let i = 0; i < Math.min(json.items.length, 12); i++) {
              const item = json.items[i];
              const id = item.guid?.replace(/^yt:video:/, '') || (item.link || '').match(/v=([^&]+)/)?.[1] || '';
              if (id && !seen.has(id)) {
                seen.add(id);
                dynamicClips.push({
                  id,
                  youtubeId: id,
                  title: item.title || '',
                  description: item.description || item.title || '',
                  thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                  videoUrl: item.link || `https://www.youtube.com/watch?v=${id}`,
                  duration: 'Live Feed',
                  source: CATEGORY_META[feed.key]?.label || 'News',
                  category: feed.key as any,
                  published: item.pubDate ? new Date(item.pubDate) : new Date(0)
                });
              }
            }
          }
        }
      } catch {}
    });

    await Promise.allSettled(feedPromises);

    if (dynamicClips.length > 0) {
      // Sort newest broadcasts first
      dynamicClips.sort((a, b) => (b.published?.getTime() || 0) - (a.published?.getTime() || 0));
      setVideoList(dynamicClips);

      // If user has explicitly clicked a video, preserve it if still in list;
      // otherwise, promote the freshest breaking news video to the cinema player!
      setSelectedVideo(prev => {
        if (userSelectedVideoIdRef.current) {
          const found = dynamicClips.find(v => v.id === userSelectedVideoIdRef.current);
          if (found) return found;
        }
        return dynamicClips[0];
      });
    }

    setLastRefreshed(new Date());
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadDynamicFeeds(false);
    // Auto-refresh every 5 minutes so breaking broadcasts stay live
    const interval = setInterval(() => {
      loadDynamicFeeds(false);
    }, 300000);
    return () => clearInterval(interval);
  }, [loadDynamicFeeds]);

  if (!currentVideo || videoList.length === 0) {
    return null;
  }

  const sidebarVideos = filteredVideos.filter(v => v.id !== currentVideo.id);
  const activeYtId = currentVideo.youtubeId || extractYouTubeId(currentVideo.videoUrl);
  const activeCategoryMeta = CATEGORY_META[currentVideo.category] || { label: currentVideo.source, icon: '📰' };

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
              Real-time news broadcasts, prime-time reporting & breaking headlines from CNN, Fox News, and MSNBC
            </p>
          </div>
        </div>

        {/* News Category Filter Pills */}
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
            ['all', 'All News Feeds'],
            ['news', '📰 CNN News'],
            ['foxnews', '🦊 Fox News'],
            ['politics', '⚖️ MSNBC Politics']
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setFilter(key);
                userSelectedVideoIdRef.current = null;
                const matches = key === 'all' ? videoList : videoList.filter(v => v.category === key);
                if (matches.length > 0) {
                  setSelectedVideo(matches[0]);
                }
              }}
              style={{
                padding: '7px 16px',
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
                    backgroundImage: `url(${currentVideo.thumbnail || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800'})`,
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
                <span style={{ fontSize: '12px', color: '#aaa', fontWeight: 600 }}>
                  {formatTimeAgo(currentVideo.published)}
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
                  letterSpacing: '1px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88', display: 'inline-block' }} />
                  Live Broadcast
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 6px 0', gap: '8px' }}>
            <p style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888', margin: 0 }}>
              Live News — {filteredVideos.length} Broadcasts
            </p>
            <button
              onClick={() => loadDynamicFeeds(true)}
              disabled={isRefreshing}
              title="Refresh live news feeds"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '11px',
                color: accent,
                fontWeight: 800,
                cursor: isRefreshing ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              <RotateCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
              <span style={{ fontSize: '10px', color: '#999', fontWeight: 500 }}>
                {lastRefreshed ? `· ${lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
              </span>
            </button>
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
              No other news broadcasts in this channel.
            </div>
          ) : (
            sidebarVideos.map(video => {
              const meta = CATEGORY_META[video.category] || { label: video.source, icon: '📰' };
              return (
                <div
                  key={video.id}
                  onClick={() => {
                    userSelectedVideoIdRef.current = video.id;
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
                      src={video.thumbnail || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800'}
                      alt={video.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800';
                      }}
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
                      {formatTimeAgo(video.published)}
                    </span>
                  </div>

                  {/* Text details */}
                  <div style={{ padding: '8px 10px 8px 0', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', fontSize: '10px', fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
                      <span>{meta.icon} {meta.label}</span>
                      <span style={{ fontSize: '9px', color: '#888', fontWeight: 600, textTransform: 'none' }}>
                        {formatTimeAgo(video.published)}
                      </span>
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
