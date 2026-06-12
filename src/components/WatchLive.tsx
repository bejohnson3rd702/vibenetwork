import { useState, useEffect, useRef } from 'react';
import { Play, Tv, X, ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoClip {
  id: string;
  headline: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  source: string;
  sport: string;
  articleUrl?: string;
}

const FEEDS = [
  { key: 'cfb', label: '🏈 Football', sport: 'football', league: 'college-football' },
  { key: 'cbb', label: '🏀 Basketball', sport: 'basketball', league: 'mens-college-basketball' },
  { key: 'base', label: '⚾ Baseball', sport: 'baseball', league: 'college-baseball' },
];

const OLYMPIAN_FEEDS = [
  { key: 'olympiatv', label: '🏆 OlympiaTV', channelId: 'UCYukge4AuskD8xPjfrSoiBg' },
  { key: 'nicksnp', label: '💪 Nick\'s Strength & Power', channelId: 'UClfyDMfX-RhmExpVm-nCl4Q' },
  { key: 'jaycutler', label: '👑 Jay Cutler', channelId: 'UCiq2MIlqqeOcEvj9cP9f1bA' },
];

const B2K_FEEDS = [
  { key: 'b2k_group', label: '👥 B2K Group' },
  { key: 'omarion', label: '🎤 Omarion' },
  { key: 'fizz', label: "🎧 Lil' Fizz" },
  { key: 'jboog', label: '🎸 J-Boog' },
];

const VIBE_FEEDS = [
  { key: 'news', label: '📰 CNN News', source: 'Dailymotion', query: 'cnn news' },
  { key: 'politics', label: '⚖️ Fox Politics', source: 'Dailymotion', query: 'fox news politics' },
  { key: 'entertainment', label: '🎭 People Weekly', source: 'YouTube', channelId: 'UCZkUr5v7CgH0f2FpA3W40GQ' },
  { key: 'money', label: '💵 CNBC Business', source: 'YouTube', channelId: 'UCEAZeUIe207jqqN1QghN0eA' },
];

const B2K_CLIPS: VideoClip[] = [
  {
    id: 'lgyEYMxzVpw',
    headline: "B2K - Bump, Bump, Bump (Official Music Video) ft. P. Diddy",
    description: "Watch the official music video for B2K's smash hit 'Bump, Bump, Bump' featuring P. Diddy.",
    thumbnail: 'https://i.ytimg.com/vi/lgyEYMxzVpw/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=lgyEYMxzVpw',
    duration: 238,
    source: 'YouTube',
    sport: 'b2k_group'
  },
  {
    id: 'CgiX53hjAPc',
    headline: "B2K - Uh Huh (Official Music Video)",
    description: "Watch B2K's debut hit single 'Uh Huh' off their self-titled debut album.",
    thumbnail: 'https://i.ytimg.com/vi/CgiX53hjAPc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=CgiX53hjAPc',
    duration: 253,
    source: 'YouTube',
    sport: 'b2k_group'
  },
  {
    id: 'd8BFf32yDWQ',
    headline: "B2K - Gots Ta Be (Official Music Video)",
    description: "Experience the official music video for B2K's classic smooth R&B ballad 'Gots Ta Be'.",
    thumbnail: 'https://i.ytimg.com/vi/d8BFf32yDWQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=d8BFf32yDWQ',
    duration: 261,
    source: 'YouTube',
    sport: 'b2k_group'
  },
  {
    id: '6OihwykYdBc',
    headline: "B2K - Girlfriend (Official Music Video)",
    description: "The official music video for B2K's hit single 'Girlfriend' off the album Pandemonium!.",
    thumbnail: 'https://i.ytimg.com/vi/6OihwykYdBc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=6OihwykYdBc',
    duration: 204,
    source: 'YouTube',
    sport: 'b2k_group'
  },
  {
    id: '_Z_5lpErdyM',
    headline: "Omarion - 'Touch' (Official Music Video)",
    description: "Watch the official music video for Omarion's smash solo hit 'Touch' off his debut album O.",
    thumbnail: 'https://i.ytimg.com/vi/_Z_5lpErdyM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=_Z_5lpErdyM',
    duration: 254,
    source: 'YouTube',
    sport: 'omarion'
  },
  {
    id: 'AdJEg47RTZ4',
    headline: "Lil' Fizz - 'Fluid' (Official Music Video) ft. Missez",
    description: "Watch the official music video for Lil' Fizz's solo single 'Fluid' featuring Missez.",
    thumbnail: 'https://i.ytimg.com/vi/AdJEg47RTZ4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=AdJEg47RTZ4',
    duration: 210,
    source: 'YouTube',
    sport: 'fizz'
  },
  {
    id: 'JwIHOk7b5sQ',
    headline: "B2K - Big Boy TV Reunion Interview ft. J-Boog",
    description: "J-Boog, Raz-B and the group sit down at Big Boy TV to talk about the Millennium reunion tour and history.",
    thumbnail: 'https://i.ytimg.com/vi/JwIHOk7b5sQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=JwIHOk7b5sQ',
    duration: 1845,
    source: 'YouTube',
    sport: 'jboog'
  },
  {
    id: 'OJl-628FyIk',
    headline: "Omarion - 'Ice Box' (Official Music Video)",
    description: "Watch the official music video for Omarion's chart-topping platinum solo single 'Ice Box'.",
    thumbnail: 'https://i.ytimg.com/vi/OJl-628FyIk/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=OJl-628FyIk',
    duration: 260,
    source: 'YouTube',
    sport: 'omarion'
  }
];

const STATIC_OLYMPIAN_CLIPS: VideoClip[] = [
  {
    id: 'SV7JP7y80UM',
    headline: 'Official OlympiaTV - The 212 Debate',
    description: 'Watch the official debate and analysis of the 212 division ahead of the Mr. Olympia contest.',
    thumbnail: 'https://i.ytimg.com/vi/SV7JP7y80UM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=SV7JP7y80UM',
    duration: 1845,
    source: 'YouTube',
    sport: 'olympiatv'
  },
  {
    id: 'MzWgJtFIxg8',
    headline: 'The Athletes that Changed the Game',
    description: 'Arnold made bodybuilding popular and Dorian brought the mass monster era. The experts discuss the iconic transitions.',
    thumbnail: 'https://i.ytimg.com/vi/MzWgJtFIxg8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=MzWgJtFIxg8',
    duration: 780,
    source: 'YouTube',
    sport: 'olympiatv'
  },
  {
    id: 'NMjCB0Y2rh4',
    headline: 'The Victor Martinez Moment!',
    description: 'The 2007 Mr. Olympia has been considered one of the most controversial moments in bodybuilding history.',
    thumbnail: 'https://i.ytimg.com/vi/NMjCB0Y2rh4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=NMjCB0Y2rh4',
    duration: 915,
    source: 'YouTube',
    sport: 'olympiatv'
  },
  {
    id: 'P0Ivio8Onew',
    headline: 'Was Hassan Robbed At The Toronto Pro?',
    description: 'Nick\'s Strength and Power breaks down the prejudging comparisons and predicts who will take home the Sandow Trophy.',
    thumbnail: 'https://i.ytimg.com/vi/P0Ivio8Onew/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=P0Ivio8Onew',
    duration: 812,
    source: 'YouTube',
    sport: 'nicksnp'
  },
  {
    id: 'GJkBAbzrhkQ',
    headline: 'Hassan Mostafa’s Side Chest is INSANE!!!',
    description: 'Nick\'s Strength and Power breaks down Hassan Mostafa\'s mind-blowing side chest pose and his performance in recent contests.',
    thumbnail: 'https://i.ytimg.com/vi/GJkBAbzrhkQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=GJkBAbzrhkQ',
    duration: 345,
    source: 'YouTube',
    sport: 'nicksnp'
  },
  {
    id: 'dTqpdNacxYM',
    headline: 'New Cutler Nutrition Q&A with DT Roth!',
    description: '4x Mr. Olympia Jay Cutler takes us through his intense off-season chest workout, explaining his set/rep selection and training volume.',
    thumbnail: 'https://i.ytimg.com/vi/dTqpdNacxYM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dTqpdNacxYM',
    duration: 645,
    source: 'YouTube',
    sport: 'jaycutler'
  },
  {
    id: 'fxl8zZId73g',
    headline: 'Prevail Focus: Cutler Nutrition Performance',
    description: 'DT Roth breaks down what separates Prevail Focus pre-workout from the competition and how it can help your performance.',
    thumbnail: 'https://i.ytimg.com/vi/fxl8zZId73g/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=fxl8zZId73g',
    duration: 490,
    source: 'YouTube',
    sport: 'jaycutler'
  }
];

const STATIC_VIBE_CLIPS: VideoClip[] = [
  {
    id: 'x8l0290',
    headline: 'News: CNN breaking global coverage',
    description: 'Global breaking news reports and motivational stories from the CNN desk.',
    thumbnail: 'https://s1.dmcdn.net/v/ZmZFo1fNHmnDR11EJ/x720',
    videoUrl: 'https://www.dailymotion.com/video/x8l0290',
    duration: 234,
    source: 'Dailymotion',
    sport: 'news'
  },
  {
    id: 'xaezlle',
    headline: 'Politics: Donald Trump announces agreement with Iran',
    description: 'The US president promised a new offensive against Iran, then claimed an agreement is close.',
    thumbnail: 'https://s1.dmcdn.net/v/bYeuI1gB3mRR3LLZu/x720',
    videoUrl: 'https://www.dailymotion.com/video/xaezlle',
    duration: 172,
    source: 'Dailymotion',
    sport: 'politics'
  },
  {
    id: 'JwIHOk7b5sQ',
    headline: 'Entertainment: Millenium Tour Reunion Special & Red Carpet',
    description: 'A special look behind-the-scenes at reunion stories, music, and group interviews.',
    thumbnail: 'https://i.ytimg.com/vi/JwIHOk7b5sQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=JwIHOk7b5sQ',
    duration: 1845,
    source: 'YouTube',
    sport: 'entertainment'
  },
  {
    id: 'dTqpdNacxYM',
    headline: 'Money: Business performance Q&A and Cutler performance',
    description: 'Financial insights, product selection, Q&A session on brand business metrics.',
    thumbnail: 'https://i.ytimg.com/vi/dTqpdNacxYM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dTqpdNacxYM',
    duration: 645,
    source: 'YouTube',
    sport: 'money'
  }
];

export default function WatchLive({ accent = '#D35400', isOlympian = false, isB2K = false, isVibe = false }: { accent?: string; isOlympian?: boolean; isB2K?: boolean; isVibe?: boolean }) {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoClip | null>(null);
  const [filter, setFilter] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const feedsToUse = isOlympian ? OLYMPIAN_FEEDS : (isB2K ? B2K_FEEDS : (isVibe ? VIBE_FEEDS : FEEDS));

  const handleClipClick = (clip: VideoClip) => {
    const isYouTube = clip.videoUrl.includes('youtube.com') || clip.videoUrl.includes('youtu.be');
    const isDailymotion = clip.videoUrl.includes('dailymotion.com') || clip.videoUrl.includes('dai.ly') || clip.source === 'Dailymotion';
    const isMp4 = clip.videoUrl.toLowerCase().endsWith('.mp4');
    if (!isYouTube && !isDailymotion && !isMp4) {
      window.open(clip.videoUrl, '_blank');
    } else {
      setActiveVideo(clip);
    }
  };

  useEffect(() => {
    const fetchClips = async () => {
      setLoading(true);
      const allClips: VideoClip[] = [];
      const seen = new Set<string>();

      if (isOlympian) {
        // Pre-populate with high quality static videos to guarantee content
        allClips.push(...STATIC_OLYMPIAN_CLIPS);
        for (const item of STATIC_OLYMPIAN_CLIPS) {
          seen.add(item.id);
        }
        for (const feed of OLYMPIAN_FEEDS) {
          try {
            const res = await fetch(`/api/yt-rss/${feed.channelId}`);
            if (!res.ok) continue;
            const xmlText = await res.text();
            
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, 'text/xml');
            const entries = xml.getElementsByTagName('entry');
            
            for (let i = 0; i < entries.length; i++) {
              const entry = entries[i];
              const id = entry.getElementsByTagName('yt:videoId')[0]?.textContent 
                || entry.getElementsByTagName('id')[0]?.textContent?.split(':').pop() 
                || '';
              const headline = entry.getElementsByTagName('title')[0]?.textContent || '';
              
              const mediaGroup = entry.getElementsByTagName('media:group')[0];
              const description = mediaGroup?.getElementsByTagName('media:description')[0]?.textContent 
                || entry.getElementsByTagName('summary')[0]?.textContent 
                || '';
              
              const thumbnail = mediaGroup?.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url')
                || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
              
              const videoUrl = `https://www.youtube.com/watch?v=${id}`;
              
              if (id && !seen.has(id)) {
                seen.add(id);
                allClips.push({
                  id,
                  headline,
                  description,
                  thumbnail,
                  videoUrl,
                  duration: 0,
                  source: 'YouTube',
                  sport: feed.key,
                });
              }
            }
          } catch (err) {
            console.warn(`WatchLive: failed to fetch YouTube RSS for ${feed.label}`, err);
          }
        }
      } else if (isB2K) {
        allClips.push(...B2K_CLIPS);
      } else if (isVibe) {
        // Pre-populate with static fallback clips
        allClips.push(...STATIC_VIBE_CLIPS);
        for (const item of STATIC_VIBE_CLIPS) {
          seen.add(item.id);
        }

        // Fetch each video feed (DailyMotion search or YouTube RSS)
        for (const feed of VIBE_FEEDS) {
          try {
            if (feed.source === 'Dailymotion' && feed.query) {
              const res = await fetch(`https://api.dailymotion.com/videos?search=${encodeURIComponent(feed.query)}&languages=en&limit=10&fields=id,title,description,thumbnail_720_url,duration,url`);
              if (res.ok) {
                const json = await res.json();
                for (const item of (json.list || [])) {
                  if (item.id && !seen.has(item.id)) {
                    seen.add(item.id);
                    allClips.push({
                      id: item.id,
                      headline: item.title || '',
                      description: item.description || '',
                      thumbnail: item.thumbnail_720_url || `https://s1.dmcdn.net/v/${item.id}/x720`,
                      videoUrl: `https://www.dailymotion.com/video/${item.id}`,
                      duration: item.duration || 0,
                      source: 'Dailymotion',
                      sport: feed.key,
                    });
                  }
                }
              }
            } else if (feed.source === 'YouTube' && feed.channelId) {
              const res = await fetch(`/api/yt-rss/${feed.channelId}`);
              if (res.ok) {
                const xmlText = await res.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlText, 'text/xml');
                const entries = xml.getElementsByTagName('entry');
                for (let i = 0; i < entries.length; i++) {
                  const entry = entries[i];
                  const id = entry.getElementsByTagName('yt:videoId')[0]?.textContent 
                    || entry.getElementsByTagName('id')[0]?.textContent?.split(':').pop() 
                    || '';
                  const headline = entry.getElementsByTagName('title')[0]?.textContent || '';
                  const mediaGroup = entry.getElementsByTagName('media:group')[0];
                  const description = mediaGroup?.getElementsByTagName('media:description')[0]?.textContent 
                    || entry.getElementsByTagName('summary')[0]?.textContent 
                    || '';
                  const thumbnail = mediaGroup?.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url')
                    || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
                  const videoUrl = `https://www.youtube.com/watch?v=${id}`;
                  
                  if (id && !seen.has(id)) {
                    seen.add(id);
                    allClips.push({
                      id,
                      headline,
                      description,
                      thumbnail,
                      videoUrl,
                      duration: 0,
                      source: 'YouTube',
                      sport: feed.key,
                    });
                  }
                }
              }
            }
          } catch (err) {
            console.warn(`WatchLive: failed to fetch video feed for ${feed.label}`, err);
          }
        }
      } else {
        const NCAA_KEYWORDS = ['college', 'ncaa'];

        for (const feed of FEEDS) {
          try {
            const res = await fetch(`/api/story?sport=${feed.sport}&league=${feed.league}&limit=30`);
            if (!res.ok) continue;
            const data = await res.json();
            for (const h of (data.headlines || [])) {
              const leagues = (h.categories || [])
                .filter((c: any) => c.type === 'league')
                .map((c: any) => (c.description || '').toLowerCase());
              const isCollege = leagues.some((l: string) =>
                NCAA_KEYWORDS.some(kw => l.includes(kw))
              );
              if (!isCollege) continue;

              const vids = h.video || [];
              if (vids.length > 0) {
                const v = vids[0];
                const clipId = String(v.id || h.id || Math.random());
                const mp4 = v.links?.source?.mezzanine?.href
                  || v.links?.source?.HD?.href
                  || v.links?.source?.full?.href
                  || v.links?.source?.href
                  || '';
                if (!mp4) continue;
                if (seen.has(clipId) || seen.has(mp4)) continue;
                seen.add(clipId);
                seen.add(mp4);

                allClips.push({
                  id: clipId,
                  headline: v.headline || h.headline || '',
                  description: v.description || h.description || '',
                  thumbnail: v.thumbnail || '',
                  videoUrl: mp4,
                  duration: v.duration || 0,
                  source: 'ESPN',
                  sport: feed.key,
                });
              }
            }
          } catch (err) {
            console.warn(`WatchLive: failed to fetch ${feed.key}`, err);
          }
        }
      }

      setClips(allClips);
      setLoading(false);
    };

    fetchClips();
    const interval = setInterval(fetchClips, 300000);
    return () => clearInterval(interval);
  }, [isOlympian, isB2K, isVibe]);

  useEffect(() => {
    if (activeVideo) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeVideo]);

  useEffect(() => {
    if (activeVideo && activeVideo.source !== 'YouTube' && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.warn("WatchLive: Playback was prevented or failed:", err);
      });
    }
  }, [activeVideo]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const filtered = filter === 'all' ? clips : clips.filter(c => c.sport === filter);

  if (loading) {
    return (
      <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Tv size={24} color={accent} />
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>Watch</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#555', fontSize: '14px' }}>Loading clips...</div>
      </div>
    );
  }

  if (clips.length === 0) return null;

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${accent}, #ff0050)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Tv size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>Watch</h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>Analysis, highlights & recaps</p>
            </div>
          </div>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ key: 'all', label: 'All' }, ...feedsToUse.map(f => ({ key: f.key, label: f.label }))].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: '6px 16px', borderRadius: '20px',
                border: `1px solid ${filter === f.key ? accent : 'rgba(255,255,255,0.08)'}`,
                background: filter === f.key ? `${accent}20` : 'rgba(255,255,255,0.03)',
                color: filter === f.key ? accent : '#888',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured video */}
        {featured && (
          <div
            onClick={() => handleClipClick(featured)}
            style={{
              position: 'relative', borderRadius: '20px', overflow: 'hidden',
              marginBottom: '24px', cursor: 'pointer', transition: 'transform 0.3s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.003)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', overflow: 'hidden' }}>
              <img src={featured.thumbnail} alt={featured.headline} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent 70%)' }} />
              {/* Play / Link button */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: `${accent}dd`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 30px ${accent}55`, transition: 'transform 0.2s',
                }}>
                  {(!featured.videoUrl.includes('youtube.com') && !featured.videoUrl.includes('youtu.be') && !featured.videoUrl.toLowerCase().endsWith('.mp4')) ? (
                    <ExternalLink size={28} color="#fff" />
                  ) : (
                    <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: '3px' }} />
                  )}
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '6px', background: accent, color: '#000', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {isOlympian 
                      ? '💪 Fitness & Bodybuilding' 
                      : (isB2K ? '🎤 R&B Music' : (isVibe ? (featured.sport === 'news' ? '📰 News' : featured.sport === 'politics' ? '⚖️ Politics' : featured.sport === 'entertainment' ? '🎭 Entertainment' : '💵 Money') : (featured.sport === 'cfb' ? '🏈 Football' : featured.sport === 'cbb' ? '🏀 Basketball' : '⚾ Baseball')))
                    }
                  </span>
                  {featured.duration > 0 && (
                    <span style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {formatDuration(featured.duration)}
                    </span>
                  )}
                </div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '26px', fontWeight: 900, lineHeight: 1.2, maxWidth: '700px' }}>{featured.headline}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#aaa', maxWidth: '600px', lineHeight: 1.5 }}>{featured.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable clips */}
        {rest.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#666', margin: 0 }}>
                More Clips
              </h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => scroll('left')} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={16} /></button>
                <button onClick={() => scroll('right')} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={16} /></button>
              </div>
            </div>
            <div ref={scrollRef} style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '8px', scrollbarWidth: 'none' }}>
              {rest.map(clip => (
                <div
                  key={clip.id}
                  onClick={() => handleClipClick(clip)}
                  style={{
                    flexShrink: 0, width: '320px', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = `${accent}44`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                    <img src={clip.thumbnail} alt={clip.headline} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${accent}bb`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {(!clip.videoUrl.includes('youtube.com') && !clip.videoUrl.includes('youtu.be') && !clip.videoUrl.toLowerCase().endsWith('.mp4')) ? (
                          <ExternalLink size={18} color="#fff" />
                        ) : (
                          <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                        )}
                      </div>
                    </div>
                    {clip.duration > 0 && (
                      <span style={{ position: 'absolute', bottom: '8px', right: '8px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.8)', fontSize: '10px', fontWeight: 700, color: '#ddd' }}>
                        {formatDuration(clip.duration)}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      {isOlympian 
                        ? 'Bodybuilding' 
                        : (isB2K ? 'Music' : (isVibe ? (clip.sport === 'news' ? 'News' : clip.sport === 'politics' ? 'Politics' : clip.sport === 'entertainment' ? 'Entertainment' : 'Money') : (clip.sport === 'cfb' ? 'Football' : clip.sport === 'cbb' ? 'Basketball' : 'Baseball')))
                      } · {clip.source}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4, color: '#ccc', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {clip.headline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ═══ Video Player Overlay ═══ */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', padding: '60px 40px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '960px', position: 'relative' }}
            >
              <button onClick={() => setActiveVideo(null)}
                style={{
                  position: 'absolute', 
                  top: '16px', 
                  right: '16px', 
                  zIndex: 10,
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <X size={20} />
              </button>
              <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#000', aspectRatio: '16/9', position: 'relative' }}>
                {activeVideo.source === 'YouTube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&controls=1&rel=0`}
                    title={activeVideo.headline}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, border: 'none' }}
                  />
                ) : activeVideo.source === 'Dailymotion' || activeVideo.videoUrl.includes('dailymotion.com') ? (
                  <iframe
                    src={`https://www.dailymotion.com/embed/video/${activeVideo.id}?autoplay=1`}
                    title={activeVideo.headline}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, border: 'none' }}
                  />
                ) : (
                  <video
                    key={activeVideo.videoUrl}
                    ref={videoRef}
                    src={activeVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    style={{ width: '100%', display: 'block', height: '100%', objectFit: 'contain' }}
                    poster={activeVideo.thumbnail}
                  >
                    <source src={activeVideo.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#fff' }}>{activeVideo.headline}</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{activeVideo.description}</p>
                </div>
                {activeVideo.articleUrl && (
                  <a
                    href={activeVideo.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      background: accent,
                      color: '#000',
                      fontSize: '12px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      whiteSpace: 'nowrap',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                  >
                    Read Story <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
