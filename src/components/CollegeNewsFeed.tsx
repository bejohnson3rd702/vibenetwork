import { useState, useEffect } from 'react';
import { X, Clock, Newspaper, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Article {
  id: number;
  headline: string;
  description: string;
  imageUrl: string;
  link: string;
  published: string;
  byline?: string;
  sport: string;
}

const FEEDS = [
  { key: 'cfb', label: 'Football', url: '/api/espn/football/college-football/news?limit=8' },
  { key: 'cbb', label: 'Basketball', url: '/api/espn/basketball/mens-college-basketball/news?limit=6' },
  { key: 'base', label: 'Baseball', url: '/api/espn/baseball/college-baseball/news?limit=4' },
];

export default function CollegeNewsFeed({ accent = '#D35400' }: { accent?: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [storyHtml, setStoryHtml] = useState<string>('');
  const [storyLoading, setStoryLoading] = useState(false);

  const openArticle = async (article: Article) => {
    setSelectedArticle(article);
    setStoryHtml('');
    setStoryLoading(true);
    try {
      const res = await fetch(`/api/story/${article.id}`);
      if (res.ok) {
        const data = await res.json();
        const story = data?.headlines?.[0]?.story || '';
        // Clean up ESPN inline tags and fix links
        const cleaned = story
          .replace(/<inline\d+>/g, '')
          .replace(/<\/inline\d+>/g, '')
          .replace(/href="http:\/\/www\.espn\.com/g, 'href="https://www.espn.com')
          .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
        setStoryHtml(cleaned);
      }
    } catch (err) {
      console.warn('Failed to fetch full story', err);
    }
    setStoryLoading(false);
  };

  useEffect(() => {
    const fetchNews = async () => {
      const allArticles: Article[] = [];

      for (const feed of FEEDS) {
        try {
          const res = await fetch(feed.url);
          if (!res.ok) continue;
          const data = await res.json();
          (data.articles || []).forEach((a: any) => {
            const img = a.images?.find((i: any) => i.type === 'header') || a.images?.[0];
            allArticles.push({
              id: a.id,
              headline: a.headline || '',
              description: a.description || '',
              imageUrl: img?.url || '',
              link: a.links?.web?.href || '#',
              published: a.published || '',
              byline: a.byline || '',
              sport: feed.key,
            });
          });
        } catch (err) {
          console.warn(`News: failed to fetch ${feed.key}`, err);
        }
      }

      allArticles.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
      setArticles(allArticles);
      setLoading(false);
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll when article is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedArticle]);

  const filtered = activeFilter === 'all' ? articles : articles.filter(a => a.sport === activeFilter);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    });
  };

  const sportLabel = (key: string) =>
    key === 'cfb' ? '🏈 College Football' : key === 'cbb' ? '🏀 College Basketball' : '⚾ College Baseball';

  if (loading) {
    return (
      <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <Newspaper size={24} color={accent} />
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>College Sports News</h2>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#555', fontSize: '14px' }}>Loading latest stories...</div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  const featured = filtered[0];
  const grid = filtered.slice(1, 9);

  return (
    <>
      <div style={{ padding: '60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Newspaper size={24} color={accent} />
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>College Sports News</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ key: 'all', label: 'All' }, ...FEEDS.map(f => ({ key: f.key, label: f.label }))].map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  padding: '6px 16px', borderRadius: '20px',
                  border: `1px solid ${activeFilter === f.key ? accent : 'rgba(255,255,255,0.08)'}`,
                  background: activeFilter === f.key ? `${accent}20` : 'rgba(255,255,255,0.03)',
                  color: activeFilter === f.key ? accent : '#888',
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featured && (
          <div
            onClick={() => openArticle(featured)}
            style={{
              position: 'relative', borderRadius: '20px', overflow: 'hidden',
              marginBottom: '24px', cursor: 'pointer', transition: 'transform 0.3s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.005)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', overflow: 'hidden' }}>
              <img src={featured.imageUrl} alt={featured.headline} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px' }}>
                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '6px',
                  background: accent, color: '#000', fontSize: '10px', fontWeight: 900,
                  textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px',
                }}>
                  {sportLabel(featured.sport)}
                </span>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 900, lineHeight: 1.2, maxWidth: '700px' }}>
                  {featured.headline}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#aaa', maxWidth: '600px', lineHeight: 1.5 }}>
                  {featured.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', fontSize: '11px', color: '#666' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {timeAgo(featured.published)}
                  </span>
                  {featured.byline && <span>· {featured.byline}</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: accent }}>
                    Read Story <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {grid.map(article => (
            <div
              key={article.id}
              onClick={() => openArticle(article)}
              style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = `${accent}33`;
                e.currentTarget.style.boxShadow = `0 12px 30px ${accent}11`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {article.imageUrl && (
                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img
                    src={article.imageUrl} alt={article.headline} loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseOver={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.03)'; }}
                    onMouseOut={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                  />
                </div>
              )}
              <div style={{ padding: '16px 20px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px',
                    color: accent, padding: '2px 8px', background: `${accent}12`, borderRadius: '4px',
                  }}>
                    {article.sport === 'cfb' ? 'Football' : article.sport === 'cbb' ? 'Basketball' : 'Baseball'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#555', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={10} /> {timeAgo(article.published)}
                  </span>
                </div>
                <h4 style={{
                  margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {article.headline}
                </h4>
                <p style={{
                  margin: 0, fontSize: '12px', color: '#777', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '10px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Powered by ESPN
        </div>
      </div>

      {/* ═══ Article Reader Overlay ═══ */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedArticle(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              overflowY: 'auto', padding: '100px 20px 40px',
            }}
          >
            <motion.article
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '860px',
                background: '#0d0d0d', borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden', position: 'relative',
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute', top: '16px', right: '16px', zIndex: 10,
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; }}
              >
                <X size={18} />
              </button>

              {/* Hero image */}
              {selectedArticle.imageUrl && (
                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.headline}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
                    background: 'linear-gradient(to top, #0d0d0d, transparent)',
                  }} />
                </div>
              )}

              {/* Content */}
              <div style={{ padding: '0 48px 48px' }}>
                {/* Sport + date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', marginTop: selectedArticle.imageUrl ? '-20px' : '40px', position: 'relative', zIndex: 2 }}>
                  <span style={{
                    padding: '5px 14px', borderRadius: '8px',
                    background: accent, color: '#000', fontSize: '11px', fontWeight: 900,
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}>
                    {sportLabel(selectedArticle.sport)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} /> {formatDate(selectedArticle.published)}
                  </span>
                </div>

                {/* Headline */}
                <h1 style={{
                  margin: '0 0 20px 0', fontSize: '36px', fontWeight: 900,
                  lineHeight: 1.2, letterSpacing: '-1px', color: '#fff',
                }}>
                  {selectedArticle.headline}
                </h1>

                {/* Byline */}
                {selectedArticle.byline && (
                  <div style={{
                    fontSize: '14px', color: accent, fontWeight: 700,
                    marginBottom: '24px', paddingBottom: '24px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    By {selectedArticle.byline}
                  </div>
                )}

                {/* Article body */}
                {storyLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#555', fontSize: '14px' }}>
                    Loading full story...
                  </div>
                ) : storyHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: storyHtml }}
                    style={{
                      fontSize: '17px', lineHeight: 1.8, color: '#ccc',
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                    }}
                    className="espn-story-body"
                  />
                ) : (
                  <div style={{
                    fontSize: '17px', lineHeight: 1.8, color: '#ccc',
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                  }}>
                    <p style={{ margin: '0 0 24px 0' }}>
                      {selectedArticle.description}
                    </p>
                  </div>
                )}

                <style>{`
                  .espn-story-body p {
                    margin: 0 0 20px 0;
                  }
                  .espn-story-body a {
                    color: ${accent};
                    text-decoration: none;
                    border-bottom: 1px solid ${accent}44;
                    transition: border-color 0.2s;
                  }
                  .espn-story-body a:hover {
                    border-color: ${accent};
                  }
                  .espn-story-body ul, .espn-story-body ol {
                    padding-left: 24px;
                    margin: 0 0 20px 0;
                  }
                  .espn-story-body li {
                    margin-bottom: 8px;
                  }
                  .espn-story-body h2, .espn-story-body h3 {
                    color: #fff;
                    margin: 32px 0 16px 0;
                    font-family: 'Inter', system-ui, sans-serif;
                  }
                  .espn-story-body blockquote {
                    border-left: 3px solid ${accent};
                    margin: 24px 0;
                    padding: 12px 24px;
                    color: #aaa;
                    font-style: italic;
                  }
                  .espn-story-body img {
                    max-width: 100%;
                    border-radius: 12px;
                    margin: 20px 0;
                  }
                `}</style>

                {/* Divider */}
                <div style={{
                  width: '60px', height: '3px', background: accent,
                  borderRadius: '2px', margin: '40px 0',
                }} />

                {/* Source attribution */}
                <div style={{
                  fontSize: '12px', color: '#555', lineHeight: 1.6,
                }}>
                  Source: ESPN · Content provided for informational purposes.
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
