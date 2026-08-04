import React, { useState } from 'react';
import { Play, ExternalLink, Sparkles, Tv, Flame, Mic, ChevronRight } from 'lucide-react';

export interface CourtneyVideo {
  id: string;
  youtubeId: string;
  title: string;
  show: string;
  category: 'spades' | 'wildnout' | 'standup';
  description: string;
  duration: string;
  thumbnail: string;
}

const COURTNEY_BEE_VIDEOS: CourtneyVideo[] = [
  {
    id: 'cb-1',
    youtubeId: 'CytqhMMV7sQ',
    title: "“I'm Ovulating, Nick” with Tiffany Haddish | We Playin' Spades Ep. 1",
    show: "We Playin' Spades",
    category: 'spades',
    description: "Courtney Bee & Nick Cannon host Tiffany Haddish at the turquoise table for high-stakes Spades, trash talk, and uncensored stories.",
    duration: '27:30',
    thumbnail: 'https://i.ytimg.com/vi/CytqhMMV7sQ/hqdefault.jpg'
  },
  {
    id: 'cb-2',
    youtubeId: 'pd5J_kQqLB0',
    title: "Standing on Boundaries and Wrestling with Mercedes Moné | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "Pro wrestling superstar Mercedes Moné hits the Spades table with Courtney Bee and Nick Cannon.",
    duration: '25:40',
    thumbnail: 'https://i.ytimg.com/vi/pd5J_kQqLB0/hqdefault.jpg'
  },
  {
    id: 'cb-3',
    youtubeId: 'p1k8H32aB_w',
    title: "Life After Football, Freedom & Viral Moments with Antonio Brown | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "NFL superstar Antonio Brown locks in with Courtney Bee and Nick Cannon for high-energy Spades play and uncensored debates.",
    duration: '28:40',
    thumbnail: 'https://i.ytimg.com/vi/p1k8H32aB_w/hqdefault.jpg'
  },
  {
    id: 'cb-4',
    youtubeId: 'EWGs1CV8g_s',
    title: "Southern Wisdom, Stand-Up & Relationships with Karlous Miller | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "Comedy star Karlous Miller & Chris Jones join Courtney Bee and Nick Cannon for non-stop laughs and competitive card battles.",
    duration: '25:30',
    thumbnail: 'https://i.ytimg.com/vi/EWGs1CV8g_s/hqdefault.jpg'
  },
  {
    id: 'cb-5',
    youtubeId: 'TvJHIFotb3s',
    title: "Shade, Strategy & Backyard Boogie with TS Madison & Rodney Chester | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "TS Madison and Rodney Chester bring hilarious energy, trash talk, and legendary Spades gameplay to Nick & Courtney's table.",
    duration: '26:50',
    thumbnail: 'https://i.ytimg.com/vi/TvJHIFotb3s/hqdefault.jpg'
  },
  {
    id: 'cb-6',
    youtubeId: 'e5PyPssFC5U',
    title: "90s TV, Parenting & Business with Raven-Symoné & Miranda Maday | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "Raven-Symoné and Miranda Maday join Courtney Bee and Nick Cannon for 90s nostalgia, laughter, and serious card table strategy.",
    duration: '24:40',
    thumbnail: 'https://i.ytimg.com/vi/e5PyPssFC5U/hqdefault.jpg'
  },
  {
    id: 'cb-7',
    youtubeId: '9drtdb9zqy4',
    title: "Marriage, Faith & Industry Secrets with Warryn & Erica Campbell | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "Gospel legends Warryn and Erica Campbell pull up to Courtney Bee and Nick Cannon's turquoise Spades table.",
    duration: '24:50',
    thumbnail: 'https://i.ytimg.com/vi/9drtdb9zqy4/hqdefault.jpg'
  },
  {
    id: 'cb-8',
    youtubeId: 'x2bt6n_Xkq8',
    title: "Reality TV & Hood 101 Lessons with Lil Scrappy & Momma Dee | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "Lil Scrappy and Momma Dee bring legendary family energy and trash talk to Courtney Bee & Nick Cannon's Spades show.",
    duration: '26:20',
    thumbnail: 'https://i.ytimg.com/vi/x2bt6n_Xkq8/hqdefault.jpg'
  },
  {
    id: 'cb-9',
    youtubeId: 'Z5q63JNeAZs',
    title: "Hollywood Hustle & Stand-Up Secrets with Page Kennedy | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "Page Kennedy and Dannon Green sit down at the turquoise table with Courtney Bee and Nick Cannon for high-stakes cards.",
    duration: '27:20',
    thumbnail: 'https://i.ytimg.com/vi/Z5q63JNeAZs/hqdefault.jpg'
  }
];

export default function CourtneyBeeWatchSection({ accent = '#D35400' }: { accent?: string }) {
  const [selectedVideo, setSelectedVideo] = useState<CourtneyVideo>(COURTNEY_BEE_VIDEOS[0]);
  const [filter, setFilter] = useState<'all' | 'spades' | 'wildnout' | 'standup'>('all');

  const filteredVideos = COURTNEY_BEE_VIDEOS.filter(v => {
    if (filter === 'all') return true;
    return v.category === filter;
  });

  return (
    <section 
      id="whats-on-now" 
      style={{
        position: 'relative',
        padding: '40px 0 60px 0',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Section Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: accent }} />
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0, color: '#fff' }}>
              Courtney Bee <span style={{ color: accent }}>Watch Cinema</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#999', margin: '4px 0 0 0' }}>
              Official episodes of We Playin' Spades starring Nick Cannon & Courtney Bee
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'all' ? accent : 'transparent',
              color: filter === 'all' ? '#000' : '#888',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            All Episodes
          </button>
          <button
            onClick={() => setFilter('spades')}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'spades' ? accent : 'transparent',
              color: filter === 'spades' ? '#000' : '#888',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ♠️ We Playin' Spades
          </button>
        </div>
      </div>

      {/* Main Video Player Box */}
      <div 
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#09090b',
          border: `1px solid ${accent}44`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${accent}15`,
          marginBottom: '32px'
        }}
      >
        {/* Responsive 16:9 Iframe Screen */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
          <iframe
            key={selectedVideo.youtubeId}
            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={selectedVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        </div>

        {/* Video Info Bar */}
        <div style={{ padding: '20px 24px', background: 'linear-gradient(180deg, rgba(20,20,25,0.95) 0%, rgba(10,10,12,0.98) 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ padding: '4px 10px', borderRadius: '6px', background: accent, color: '#000', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                ♠️ {selectedVideo.show}
              </span>
              <span style={{ fontSize: '12px', color: '#888' }}>
                Duration: {selectedVideo.duration}
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 6px 0', lineHeight: 1.3 }}>
              {selectedVideo.title}
            </h3>
            <p style={{ fontSize: '13px', color: '#aaa', margin: 0, lineHeight: 1.4 }}>
              {selectedVideo.description}
            </p>
          </div>

          {/* External Fallback Link Button */}
          <a
            href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.background = `${accent}33`; e.currentTarget.style.borderColor = accent; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            Watch on YouTube <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Episode Carousel / Grid */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#777', marginBottom: '16px' }}>
          Select Episode
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredVideos.map(video => {
            const isSelected = selectedVideo.id === video.id;
            return (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: isSelected ? `${accent}15` : 'rgba(255,255,255,0.02)',
                  border: isSelected ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? `0 8px 24px ${accent}33` : 'none'
                }}
                onMouseOver={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = `${accent}66`;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }
                }}
                onMouseOut={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Thumbnail Image Box */}
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: isSelected ? accent : 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                      }}
                    >
                      <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                    </div>
                  </div>

                  <span style={{ position: 'absolute', bottom: '8px', right: '8px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.85)', fontSize: '11px', fontWeight: 800, color: '#fff' }}>
                    {video.duration}
                  </span>
                </div>

                {/* Card Content */}
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    ♠️ {video.show}
                  </div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? '#fff' : '#ccc', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {video.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
