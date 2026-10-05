import React, { useState, useEffect, useRef } from 'react';
import { Play, Tv, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../supabaseClient';

export interface VibeVideoClip {
  id: string;
  youtubeId?: string;
  videoUrl: string;
  title: string;
  source: string;
  category: 'originals' | 'news' | 'foxnews' | 'politics' | 'money' | 'sports';
  description: string;
  duration: string;
  thumbnail: string;
  published?: Date;
  isOriginal?: boolean;
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  originals: { label: 'Vibe Originals', icon: '✨' },
  news: { label: 'CNN News', icon: '📰' },
  foxnews: { label: 'Fox News', icon: '🦊' },
  politics: { label: 'MSNBC Politics', icon: '⚖️' },
  money: { label: 'CNBC Business', icon: '💵' },
  sports: { label: 'ESPN Sports', icon: '🏈' },
};

const VIBE_FEEDS = [
  { key: 'news', label: '📰 CNN News', channelId: 'UCupvZG-5ko_eiXAupbDfxWw' },
  { key: 'foxnews', label: '🦊 Fox News', channelId: 'UCXIJgqnII2ZOINSWNOGFThA' },
  { key: 'politics', label: '⚖️ MSNBC Politics', channelId: 'UCaXkIU1QidjPwiAYu6GcHjg' },
  { key: 'money', label: '💵 CNBC Business', channelId: 'UCvJJ_dzjViJCoLf5uKUTwoA', altChannelId: 'UCIALMKvObZNtJ6AmdCLP7Lg' },
  { key: 'sports', label: '🏈 ESPN Sports', channelId: 'UCiWLfSweyRNmLpgEHekhoAg' },
];

const DEFAULT_VIBE_CLIPS: VibeVideoClip[] = [
  {
    id: '44bdc4c8-f78b-4638-9560-43c6f1ca0811',
    videoUrl: 'https://fimzetmvrmbmdggvqzpr.supabase.co/storage/v1/object/public/videos/past-streams/19a1f776-daa5-460b-8dc9-c89dd4cb4d06/1791157915566.webm',
    title: 'Live Stream - 10/4/2026 Studio Broadcast',
    source: 'Vibe Network',
    category: 'originals',
    description: 'Exclusive recorded live broadcast from the Vibe Network production studio featuring real-time stream highlights, multi-lingual transcription, and creator interviews.',
    duration: 'Live Feed',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
    published: new Date('2026-10-04T23:51:59.000Z'),
    isOriginal: true
  },
  {
    id: '_mbBBOOWaxg',
    youtubeId: '_mbBBOOWaxg',
    videoUrl: 'https://www.youtube.com/watch?v=_mbBBOOWaxg',
    title: 'Yemen announces military action against Iran-backed Houthis',
    source: 'CNN News',
    category: 'news',
    description: 'The Saudi-led Coalition to Support Legitimacy in Yemen pledged full support as Yemen’s internationally recognized government announced a military offensive. CNN’s Nic Robertson reports.',
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/_mbBBOOWaxg/hqdefault.jpg',
    published: new Date('2026-10-05T01:03:44.000Z')
  },
  {
    id: '8DFsWxJVV_o',
    youtubeId: '8DFsWxJVV_o',
    videoUrl: 'https://www.youtube.com/watch?v=8DFsWxJVV_o',
    title: "'The warning was there': Inside Flydubai's aviation security systems",
    source: 'CNN News',
    category: 'news',
    description: "An in-depth investigation into flight safety, emergency response protocols, and security procedures across international airspace.",
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/8DFsWxJVV_o/hqdefault.jpg',
    published: new Date('2026-10-04T22:00:00.000Z')
  },
  {
    id: 'rufMKA2FPxc',
    youtubeId: 'rufMKA2FPxc',
    videoUrl: 'https://www.youtube.com/watch?v=rufMKA2FPxc',
    title: "Questions MOUNT over FlyDubai's vetting of hijacking suspect",
    source: 'Fox News',
    category: 'foxnews',
    description: "Federal authorities and international aviation experts examine security clearance breakdowns following the attempted hijacking incident.",
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/rufMKA2FPxc/hqdefault.jpg',
    published: new Date('2026-10-04T20:30:36.000Z')
  },
  {
    id: 'aaEM5VTjUmM',
    youtubeId: 'aaEM5VTjUmM',
    videoUrl: 'https://www.youtube.com/watch?v=aaEM5VTjUmM',
    title: "AG Blanche FIRES BACK at 'fearmongering' over election monitors",
    source: 'Fox News',
    category: 'foxnews',
    description: "Attorney General addresses reporters regarding voting oversight regulations, armed agents, and election integrity measures.",
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/aaEM5VTjUmM/hqdefault.jpg',
    published: new Date('2026-10-04T18:45:33.000Z')
  },
  {
    id: 'ph8Hrzqfu8Q',
    youtubeId: 'ph8Hrzqfu8Q',
    videoUrl: 'https://www.youtube.com/watch?v=ph8Hrzqfu8Q',
    title: "What Rachel Maddow wants you to know about fighting for America's democracy",
    source: 'MSNBC Politics',
    category: 'politics',
    description: "Rachel Maddow breaks down the constitutional precedents, civil liberties, and legislative battlegrounds shaping the political landscape.",
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/ph8Hrzqfu8Q/hqdefault.jpg',
    published: new Date('2026-10-04T21:00:24.000Z')
  },
  {
    id: 'XLMotnp3iBk',
    youtubeId: 'XLMotnp3iBk',
    videoUrl: 'https://www.youtube.com/watch?v=XLMotnp3iBk',
    title: "They hate both parties. These voters could decide Congress.",
    source: 'MSNBC Politics',
    category: 'politics',
    description: "A nationwide look at independent and undecided voters in key swing districts ahead of the upcoming congressional elections.",
    duration: 'Live Feed',
    thumbnail: 'https://i.ytimg.com/vi/XLMotnp3iBk/hqdefault.jpg',
    published: new Date('2026-10-04T20:46:51.000Z')
  },
  {
    id: 'vwOxJJ80t3k',
    youtubeId: 'vwOxJJ80t3k',
    videoUrl: 'https://www.youtube.com/watch?v=vwOxJJ80t3k',
    title: 'Index Fund Investing & Global Market Strategy',
    source: 'CNBC Business',
    category: 'money',
    description: 'Wall Street analysts discuss Federal Reserve interest rate projections, S&P 500 trends, and portfolio hedging strategies.',
    duration: '10:15',
    thumbnail: 'https://i.ytimg.com/vi/vwOxJJ80t3k/hqdefault.jpg',
    published: new Date('2026-10-04T19:00:00.000Z')
  },
  {
    id: 'E_MKI9NQmQk',
    youtubeId: 'E_MKI9NQmQk',
    videoUrl: 'https://www.youtube.com/watch?v=E_MKI9NQmQk',
    title: '"I\'m Ovulating, Nick" with Tiffany Haddish | We Playin\' Spades',
    source: 'Vibe Network',
    category: 'originals',
    description: 'Courtney Bee & Nick Cannon host Tiffany Haddish at the turquoise table for high-stakes Spades, trash talk, and uncensored stories.',
    duration: '27:30',
    thumbnail: 'https://i.ytimg.com/vi/E_MKI9NQmQk/hqdefault.jpg',
    published: new Date('2026-10-04T18:00:00.000Z'),
    isOriginal: true
  },
  {
    id: 'boAP0v2Kckk',
    youtubeId: 'boAP0v2Kckk',
    videoUrl: 'https://www.youtube.com/watch?v=boAP0v2Kckk',
    title: 'Raz-B - Exclusive No Jumper Interview',
    source: 'Vibe Network',
    category: 'originals',
    description: 'Raz-B sits down for an intimate, tell-all interview discussing B2K history, the Millennium Tour, and new solo releases.',
    duration: '45:10',
    thumbnail: 'https://i.ytimg.com/vi/boAP0v2Kckk/hqdefault.jpg',
    published: new Date('2026-10-03T12:00:00.000Z'),
    isOriginal: true
  },
  {
    id: 'vyqy7PcDGLM',
    youtubeId: 'vyqy7PcDGLM',
    videoUrl: 'https://www.youtube.com/watch?v=vyqy7PcDGLM',
    title: 'AVO Campus Tour 2026 Highlight Reel & Gameday Preview',
    source: 'ESPN Sports',
    category: 'sports',
    description: 'College football highlights, athletic program spotlights, and campus gameday atmosphere across top licensed universities.',
    duration: '08:45',
    thumbnail: 'https://i.ytimg.com/vi/vyqy7PcDGLM/hqdefault.jpg',
    published: new Date('2026-10-04T17:00:00.000Z')
  },
  {
    id: 'SV7JP7y80UM',
    youtubeId: 'SV7JP7y80UM',
    videoUrl: 'https://www.youtube.com/watch?v=SV7JP7y80UM',
    title: "Mr. Olympia 2024 Men’s Open Prejudging Analysis",
    source: 'ESPN Sports',
    category: 'sports',
    description: "Complete breakdown of the Sandow trophy race, stage comparisons, conditioning, and scorecards from Las Vegas.",
    duration: '14:20',
    thumbnail: 'https://i.ytimg.com/vi/SV7JP7y80UM/hqdefault.jpg',
    published: new Date('2026-10-03T20:00:00.000Z')
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
  const [filter, setFilter] = useState<'all' | 'originals' | 'news' | 'foxnews' | 'politics' | 'money' | 'sports'>('all');
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

      // Helper to parse XML feed text into video clips
      const parseXmlEntries = (xmlText: string, feedKey: string, feedLabel: string) => {
        try {
          const parser = new DOMParser();
          const xml = parser.parseFromString(xmlText, 'text/xml');
          const entries = xml.getElementsByTagName('entry');

          for (let i = 0; i < Math.min(entries.length, 6); i++) {
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
        } catch {}
      };

      // 1. Fetch live RSS channels in parallel with client-side fallback
      const feedPromises = VIBE_FEEDS.map(async (feed) => {
        const targetIds = [feed.channelId, (feed as any).altChannelId].filter(Boolean);
        for (const cid of targetIds) {
          try {
            // First try internal serverless endpoint
            const res = await fetch(`/api/yt-rss/${cid}`, { signal: AbortSignal.timeout(4000) });
            if (res.ok) {
              const xmlText = await res.text();
              if (xmlText && xmlText.includes('<entry')) {
                parseXmlEntries(xmlText, feed.key, CATEGORY_META[feed.key]?.label || 'Broadcast');
                return;
              }
            }
          } catch {}

          try {
            // Client fallback to rss2json proxy directly
            const r2jUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id=' + cid)}`;
            const r2jRes = await fetch(r2jUrl, { signal: AbortSignal.timeout(4000) });
            if (r2jRes.ok) {
              const json = await r2jRes.json();
              if (json.status === 'ok' && Array.isArray(json.items)) {
                for (let i = 0; i < Math.min(json.items.length, 6); i++) {
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
                      source: CATEGORY_META[feed.key]?.label || 'Broadcast',
                      category: feed.key as any,
                      published: item.pubDate ? new Date(item.pubDate) : new Date(0)
                    });
                  }
                }
                return;
              }
            }
          } catch {}
        }
      });

      // 2. Fetch Supabase videos and episodes tables concurrently
      const dbPromise = (async () => {
        try {
          if (!supabase) return;
          const [videosRes, episodesRes] = await Promise.all([
            supabase.from('videos').select('*').order('created_at', { ascending: false }).limit(25),
            supabase.from('episodes').select('*').order('created_at', { ascending: false }).limit(25)
          ]);

          // Process videos table
          if (videosRes.data) {
            for (const v of videosRes.data) {
              const id = String(v.id);
              if (id && !seen.has(id) && v.video_url) {
                seen.add(id);
                const ytId = extractYouTubeId(v.video_url) || undefined;
                const thumb = v.image_url || v.thumbnail_url || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800');
                
                const tagStr = (Array.isArray(v.tags) ? v.tags.join(' ') : String(v.tags || '')).toLowerCase();
                const titleStr = (v.title || '').toLowerCase();
                let cat: VibeVideoClip['category'] = 'originals';
                if (tagStr.includes('sport') || tagStr.includes('olympia') || tagStr.includes('fitness') || titleStr.includes('olympia') || tagStr.includes('football')) {
                  cat = 'sports';
                } else if (tagStr.includes('money') || tagStr.includes('invest') || tagStr.includes('finance') || tagStr.includes('business')) {
                  cat = 'money';
                } else if (tagStr.includes('politic') || tagStr.includes('election') || tagStr.includes('congress')) {
                  cat = 'politics';
                } else if (tagStr.includes('music') || tagStr.includes('r&b') || tagStr.includes('b2k') || tagStr.includes('spades') || tagStr.includes('comedy')) {
                  cat = 'entertainment';
                } else if (tagStr.includes('fox')) {
                  cat = 'foxnews';
                } else if (tagStr.includes('news') || titleStr.includes('news')) {
                  cat = 'news';
                }

                dynamicClips.push({
                  id,
                  youtubeId: ytId,
                  title: v.title || 'Studio Broadcast',
                  description: v.description || 'Recorded network broadcast streamed live from the Vibe production studios.',
                  thumbnail: thumb,
                  videoUrl: v.video_url,
                  duration: v.duration ? `${Math.floor(v.duration / 60)}:${String(v.duration % 60).padStart(2, '0')}` : 'Studio Feed',
                  source: v.source || 'Vibe Network',
                  category: cat,
                  published: v.created_at ? new Date(v.created_at) : new Date(0),
                  isOriginal: true
                });
              }
            }
          }

          // Process episodes table
          if (episodesRes.data) {
            for (const ep of episodesRes.data) {
              const id = String(ep.id);
              if (id && !seen.has(id) && ep.video_url) {
                seen.add(id);
                const ytId = extractYouTubeId(ep.video_url) || undefined;
                const thumb = ep.thumbnail_url || ep.image_url || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800');
                
                const genreStr = String(ep.genre || '').toLowerCase();
                let cat: VibeVideoClip['category'] = 'originals';
                if (genreStr.includes('sport') || genreStr.includes('fitness')) {
                  cat = 'sports';
                } else if (genreStr.includes('business') || genreStr.includes('money')) {
                  cat = 'money';
                } else if (genreStr.includes('politic')) {
                  cat = 'politics';
                } else if (genreStr.includes('comedy') || genreStr.includes('music') || genreStr.includes('entertainment')) {
                  cat = 'entertainment';
                }

                dynamicClips.push({
                  id,
                  youtubeId: ytId,
                  title: ep.title || 'Creator Episode',
                  description: ep.description || 'Featured creator broadcast published directly to the Vibe content network.',
                  thumbnail: thumb,
                  videoUrl: ep.video_url,
                  duration: ep.length || 'Full Episode',
                  source: 'Vibe Creator',
                  category: cat,
                  published: ep.created_at ? new Date(ep.created_at) : new Date(0),
                  isOriginal: true
                });
              }
            }
          }
        } catch {}
      })();

      await Promise.allSettled([...feedPromises, dbPromise]);

      if (!cancelled) {
        // Merge with static defaults for any missing items
        for (const def of DEFAULT_VIBE_CLIPS) {
          if (!seen.has(def.id)) {
            seen.add(def.id);
            dynamicClips.push(def);
          }
        }

        // Sort by published descending so brand-new uploads are at the top
        dynamicClips.sort((a, b) => (b.published?.getTime() || 0) - (a.published?.getTime() || 0));

        setVideoList(dynamicClips);
        setSelectedVideo(prev => prev ? (dynamicClips.find(v => v.id === prev.id) || dynamicClips[0]) : dynamicClips[0]);
      }
    }

    loadDynamicFeeds();
    return () => { cancelled = true; };
  }, []);

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
            ['originals', '✨ Vibe Originals'],
            ['news', '📰 CNN News'],
            ['foxnews', '🦊 Fox News'],
            ['politics', '⚖️ MSNBC'],
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
                    backgroundImage: `url(${currentVideo.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'})`,
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
                  {currentVideo.isOriginal ? '● Network Original' : '● High Definition Broadcast'}
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
                      src={video.thumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'}
                      alt={video.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800';
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
