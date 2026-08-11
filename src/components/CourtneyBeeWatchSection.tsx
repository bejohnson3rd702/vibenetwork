import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export interface CourtneyVideo {
  id: string;
  youtubeId: string;
  videoUrl?: string;
  title: string;
  show: string;
  category: 'spades' | 'wildnout' | 'standup' | 'dailycannon';
  description: string;
  duration: string;
  thumbnail: string;
}

const COURTNEY_BEE_VIDEOS: CourtneyVideo[] = [
  // --- WE PLAYIN' SPADES ---
  {
    id: 'E_MKI9NQmQk',
    youtubeId: 'E_MKI9NQmQk',
    title: '"I\'m Ovulating, Nick" with Tiffany Haddish | We Playin\' Spades',
    show: "We Playin' Spades",
    category: 'spades',
    description: "Courtney Bee & Nick Cannon host Tiffany Haddish at the turquoise table for high-stakes Spades, trash talk, and uncensored stories.",
    duration: '27:30',
    thumbnail: 'https://i.ytimg.com/vi/E_MKI9NQmQk/hqdefault.jpg'
  },
  {
    id: '9EdpssHIbM8',
    youtubeId: '9EdpssHIbM8',
    title: "Standing on Boundaries and Wrestling with Mercedes Moné | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "Pro wrestling superstar Mercedes Moné hits the Spades table with Courtney Bee and Nick Cannon.",
    duration: '25:40',
    thumbnail: 'https://i.ytimg.com/vi/9EdpssHIbM8/hqdefault.jpg'
  },
  {
    id: 't0Hpg8g1yRk',
    youtubeId: 't0Hpg8g1yRk',
    title: "SAG Awards, Geese Fights & the Comedy Hustle with Lavell Crawford | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "Lavell Crawford brings the laughs to the Spades table with Courtney Bee and Nick Cannon.",
    duration: '22:15',
    thumbnail: 'https://i.ytimg.com/vi/t0Hpg8g1yRk/hqdefault.jpg'
  },
  {
    id: 'OfhFTOGPfdc',
    youtubeId: 'OfhFTOGPfdc',
    title: "Flex Alexander & Brian Hooks on Comedy, Culture & the Hollywood Hustle | We Playin' Spades",
    show: "We Playin' Spades",
    category: 'spades',
    description: "Flex Alexander and Brian Hooks sit down at the turquoise table for laughs, culture, and Spades.",
    duration: '24:00',
    thumbnail: 'https://i.ytimg.com/vi/OfhFTOGPfdc/hqdefault.jpg'
  },

  // --- WILD 'N OUT ---
  {
    id: '6cQKtZtqXEk',
    youtubeId: '6cQKtZtqXEk',
    title: "Best Of Courtney Bee 🤣 Wild 'N Out",
    show: "Wild 'N Out",
    category: 'wildnout',
    description: "Watch Courtney Bee's greatest Wild 'N Out moments — punchlines, roasts, and Wildstyle battles.",
    duration: '12:00',
    thumbnail: 'https://i.ytimg.com/vi/6cQKtZtqXEk/hqdefault.jpg'
  },
  {
    id: 'ifB7zrLD09s',
    youtubeId: 'ifB7zrLD09s',
    title: "Courtney Bee Takes NO Disrespect 😤 Wild 'N Out",
    show: "Wild 'N Out",
    category: 'wildnout',
    description: "Courtney Bee fires back hard and shuts down the competition on the Wild 'N Out stage.",
    duration: '8:45',
    thumbnail: 'https://i.ytimg.com/vi/ifB7zrLD09s/hqdefault.jpg'
  },
  {
    id: 'NxjONMYd2O8',
    youtubeId: 'NxjONMYd2O8',
    title: "Courtney Bee DESTROYS the New School 🔥🤬 Wild N' Out",
    show: "Wild 'N Out",
    category: 'wildnout',
    description: "Courtney Bee goes all out and destroys the new school cast in this Wild 'N Out battle.",
    duration: '9:30',
    thumbnail: 'https://i.ytimg.com/vi/NxjONMYd2O8/hqdefault.jpg'
  },

  // --- STAND-UP COMEDY ---
  {
    id: 'MMDuJxKq7yI',
    youtubeId: 'MMDuJxKq7yI',
    title: "Courtney Bee Takes Harlem Nights",
    show: "Courtney Bee Comedy",
    category: 'standup',
    description: "Courtney Bee hits the stage at the legendary Harlem Nights for a hilarious live stand-up set.",
    duration: '18:00',
    thumbnail: 'https://i.ytimg.com/vi/MMDuJxKq7yI/hqdefault.jpg'
  },
  {
    id: 'vc3JcMQS08A',
    youtubeId: 'vc3JcMQS08A',
    title: "Courtney Bee Runs a [Soul] Train: Uproarious Story and Song at Hollywood Improv",
    show: "Courtney Bee Comedy",
    category: 'standup',
    description: "Courtney Bee takes the Hollywood Improv stage with an uproarious story and an original song.",
    duration: '15:20',
    thumbnail: 'https://i.ytimg.com/vi/vc3JcMQS08A/hqdefault.jpg'
  },
  {
    id: 'cXBSpTi8Vbk',
    youtubeId: 'cXBSpTi8Vbk',
    title: "Courtney Bee Meets Comedy's Rising Stars: Amir K., Correy Bell, Darius Bennett & More",
    show: "Courtney Bee Comedy",
    category: 'standup',
    description: "Courtney Bee links up with comedy's next generation in this hilarious roundup.",
    duration: '20:00',
    thumbnail: 'https://i.ytimg.com/vi/cXBSpTi8Vbk/hqdefault.jpg'
  },

  // --- THE DAILY CANNON ---
  {
    id: 'DesiNickIlluminati',
    youtubeId: 'pujOwBc-tAE',
    title: 'Desi Banks Asks Nick Cannon If The Illuminati Is Real | The Daily Cannon Show',
    show: 'The Daily Cannon',
    category: 'dailycannon',
    description: 'Courtney Bee hosts The Daily Cannon as Desi Banks and Nick Cannon dive deep on conspiracies, comedy, and culture.',
    duration: '18:30',
    thumbnail: 'https://i.ytimg.com/vi/pujOwBc-tAE/hqdefault.jpg'
  },
  {
    id: 'pujOwBc-tAE',
    youtubeId: 'pujOwBc-tAE',
    title: 'Does Body Count Matter? with Courtney Bee | The Daily Cannon',
    show: 'The Daily Cannon',
    category: 'dailycannon',
    description: 'Courtney Bee goes in on dating, body counts, and modern relationship culture on The Daily Cannon Show.',
    duration: '12:45',
    thumbnail: 'https://i.ytimg.com/vi/pujOwBc-tAE/hqdefault.jpg'
  },
  {
    id: '5w0ybBRuifc',
    youtubeId: '5w0ybBRuifc',
    title: 'Your Dating History: How Many is Too Many? with Courtney Bee | The Daily Cannon',
    show: 'The Daily Cannon',
    category: 'dailycannon',
    description: 'Courtney Bee and guests debate the hot topic of dating history and relationship standards on The Daily Cannon.',
    duration: '14:20',
    thumbnail: 'https://i.ytimg.com/vi/5w0ybBRuifc/hqdefault.jpg'
  }
];

const CATEGORY_ICON: Record<string, string> = {
  spades: '♠️',
  wildnout: '🔥',
  standup: '🎤',
  dailycannon: '📡'
};

export default function CourtneyBeeWatchSection({ accent = '#D35400' }: { accent?: string }) {
  const [selectedVideo, setSelectedVideo] = useState<CourtneyVideo>(COURTNEY_BEE_VIDEOS[0]);
  const [filter, setFilter] = useState<'all' | 'spades' | 'wildnout' | 'standup' | 'dailycannon'>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const filteredVideos = COURTNEY_BEE_VIDEOS.filter(v =>
    filter === 'all' ? true : v.category === filter
  );

  const sidebarVideos = filteredVideos.filter(v => v.id !== selectedVideo.id);

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
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '4px', height: '28px', borderRadius: '2px', background: accent }} />
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', margin: 0, color: '#fff' }}>
              Courtney Bee <span style={{ color: accent }}>Watch Cinema</span>
            </h2>
            <p style={{ fontSize: '13px', color: '#999', margin: '4px 0 0 0' }}>
              Official Wild 'N Out episodes & We Playin' Spades starring Nick Cannon & Courtney Bee
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {([['all', 'All Episodes'], ['spades', "♠️ We Playin' Spades"], ['wildnout', '🔥 Wild \'N Out'], ['standup', '🎤 Stand-Up'], ['dailycannon', '📡 Daily Cannon']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
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

      {/* Player + Sidebar: stacks vertically on mobile */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', alignItems: 'flex-start' }}>

        {/* LEFT: Main Player */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          {/* Player */}
          <div style={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#000',
            border: `1px solid ${accent}33`,
            boxShadow: `0 16px 50px rgba(0,0,0,0.8), 0 0 30px ${accent}10`
          }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
              {isPlaying ? (
                <iframe
                  key={selectedVideo.youtubeId}
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <div
                  onClick={() => setIsPlaying(true)}
                  style={{
                    position: 'absolute', inset: 0, cursor: 'pointer', overflow: 'hidden',
                    backgroundImage: `url(${selectedVideo.thumbnail})`,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      width: '72px', height: '72px', borderRadius: '50%',
                      background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 30px ${accent}`, transition: 'transform 0.2s ease'
                    }}>
                      <Play size={32} color="#000" fill="#000" style={{ marginLeft: '4px' }} />
                    </div>
                    <span style={{ marginTop: '16px', color: '#fff', fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                      Click To Play Video
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info Bar */}
            <div style={{ padding: '16px 20px', background: 'rgba(12,12,14,0.98)', borderTop: `1px solid ${accent}22` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ padding: '3px 10px', borderRadius: '6px', background: accent, color: '#000', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {CATEGORY_ICON[selectedVideo.category]} {selectedVideo.show}
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>{selectedVideo.duration}</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                {selectedVideo.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#999', margin: 0, lineHeight: 1.5 }}>
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Scrollable Video Sidebar */}
        <div style={{
          width: isMobile ? '100%' : '320px',
          flexShrink: 0,
          maxHeight: isMobile ? 'none' : 'calc(9/16 * (100vw - 360px) + 110px)',
          overflowY: isMobile ? 'visible' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingRight: isMobile ? '0' : '4px',
          scrollbarWidth: 'thin',
          scrollbarColor: `${accent}44 transparent`
        }}>
          <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#555', margin: '0 0 4px 0' }}>
            Up Next — {sidebarVideos.length} more
          </p>

          {sidebarVideos.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#555', fontSize: '13px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              No other videos in this category.
            </div>
          ) : sidebarVideos.map(video => {
            const icon = CATEGORY_ICON[video.category];
            return (
              <div
                key={video.id}
                onClick={() => { setSelectedVideo(video); setIsPlaying(true); window.scrollTo({ top: (document.getElementById('whats-on-now')?.offsetTop ?? 0) - 80, behavior: 'smooth' }); }}
                style={{
                  display: 'flex',
                  gap: '10px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseOver={e => { e.currentTarget.style.background = `${accent}12`; e.currentTarget.style.borderColor = `${accent}55`; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', width: '140px', flexShrink: 0, aspectRatio: '16/9' }}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Play overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: 'rgba(0,0,0,0.75)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Play size={13} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                    </div>
                  </div>
                  {/* Duration badge */}
                  <span style={{
                    position: 'absolute', bottom: '4px', right: '4px',
                    padding: '2px 5px', borderRadius: '4px',
                    background: 'rgba(0,0,0,0.85)', fontSize: '10px', fontWeight: 800, color: '#fff'
                  }}>
                    {video.duration}
                  </span>
                </div>

                {/* Text */}
                <div style={{ padding: '10px 10px 10px 0', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '9px', fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    {icon} {video.show}
                  </div>
                  <p style={{
                    fontSize: '12px', fontWeight: 700, color: '#ddd',
                    margin: 0, lineHeight: 1.35,
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                  }}>
                    {video.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
