import { useState, useEffect, useRef } from 'react';
import { Play, Tv, X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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
}

const FEEDS = [
  { key: 'cfb', label: '🏈 Football', sport: 'football', league: 'college-football' },
  { key: 'cbb', label: '🏀 Basketball', sport: 'basketball', league: 'mens-college-basketball' },
  { key: 'base', label: '⚾ Baseball', sport: 'baseball', league: 'college-baseball' },
];

export default function WatchLive({ accent = '#D35400' }: { accent?: string }) {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoClip | null>(null);
  const [filter, setFilter] = useState('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchClips = async () => {
      const allClips: VideoClip[] = [];
      const seen = new Set<string>();

      // Allowlist: only keep content tagged with these NCAA league names
      const NCAA_KEYWORDS = ['college', 'ncaa'];

      for (const feed of FEEDS) {
        try {
          const res = await fetch(`/api/story?sport=${feed.sport}&league=${feed.league}&limit=30`);
          if (!res.ok) continue;
          const data = await res.json();
          for (const h of (data.headlines || [])) {
            // Only keep headlines tagged with a college/NCAA league
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

      setClips(allClips);
      setLoading(false);
    };

    fetchClips();
    const interval = setInterval(fetchClips, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeVideo) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeVideo]);

  useEffect(() => {
    if (activeVideo && videoRef.current) {
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

  // Featured = first clip, rest = scrollable
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
            {[{ key: 'all', label: 'All' }, ...FEEDS.map(f => ({ key: f.key, label: f.label }))].map(f => (
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
            onClick={() => setActiveVideo(featured)}
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
              {/* Play button */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: `${accent}dd`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 30px ${accent}55`, transition: 'transform 0.2s',
                }}>
                  <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: '3px' }} />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '6px', background: accent, color: '#000', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {featured.sport === 'cfb' ? '🏈 Football' : featured.sport === 'cbb' ? '🏀 Basketball' : '⚾ Baseball'}
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
                  onClick={() => setActiveVideo(clip)}
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
                        <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
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
                      {clip.sport === 'cfb' ? 'Football' : clip.sport === 'cbb' ? 'Basketball' : 'Baseball'} · ESPN
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
                  position: 'absolute', top: '-48px', right: '0', zIndex: 10,
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <X size={16} />
              </button>
              <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#000' }}>
                <video
                  key={activeVideo.videoUrl}
                  ref={videoRef}
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  style={{ width: '100%', display: 'block' }}
                  poster={activeVideo.thumbnail}
                >
                  <source src={activeVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div style={{ marginTop: '16px' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#fff' }}>{activeVideo.headline}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{activeVideo.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
