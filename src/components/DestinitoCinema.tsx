import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Info, 
  Plus, 
  Check, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  ThumbsUp, 
  Film, 
  Tv, 
  Compass, 
  Globe, 
  Sparkles,
  Maximize2,
  Sliders,
  Hotel
} from 'lucide-react';
import { DESTINITO_MOVIES, DESTINITO_GENRES, DESTINITO_ISLANDS, type MovieItem } from '../data/destinitoMovies';
import { VideoTranslationOverlay } from './VideoTranslationOverlay';

interface DestinitoCinemaProps {
  wlConfig?: any;
  user?: any;
  activeVideo?: any;
  setActiveVideo?: (v: any) => void;
}

export default function DestinitoCinema({ wlConfig, user, setActiveVideo }: DestinitoCinemaProps) {
  const accent = wlConfig?.accent || '#00F5D4';
  const [featuredMovie, setFeaturedMovie] = useState<MovieItem>(DESTINITO_MOVIES[0]);
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [playingMovie, setPlayingMovie] = useState<MovieItem | null>(null);
  const [myList, setMyList] = useState<string[]>(['destinito-saba-passage', 'destinito-anguilla-shoals']);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [activeGenre, setActiveGenre] = useState<string>('All Movies');
  const [activeIsland, setActiveIsland] = useState<string>('All 14 Islands');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState('English [CC]');
  const [selectedAudio, setSelectedAudio] = useState('English (Original)');
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll navbar state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMyList = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMyList(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const handlePlay = (movie: MovieItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlayingMovie(movie);
    if (setActiveVideo) {
      setActiveVideo({
        id: movie.id,
        title: movie.title,
        videoUrl: movie.videoUrl,
        image: movie.backdropUrl
      });
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, movie?: MovieItem | null) => {
    const target = e.currentTarget;
    if (!target.dataset.fallbackTried && movie?.videoUrl) {
      target.dataset.fallbackTried = 'true';
      const match = movie.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))?([\w-]{11})/);
      if (match && match[1]) {
        target.src = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
      }
    }
  };

  // Filter movies
  const filteredMovies = DESTINITO_MOVIES.filter(m => {
    const matchesSearch = searchQuery.trim() === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.islandLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cast.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIsland = activeIsland === 'All 14 Islands' || m.islandLocation.toLowerCase().includes(activeIsland.toLowerCase().replace('all 14 islands', ''));

    const matchesGenre = activeGenre === 'All Movies' || 
      (activeGenre === 'Top 10 Today' && !!m.trendingRank) ||
      (activeGenre === 'In-Room Premieres' && m.isInRoomExclusive) ||
      (activeGenre === 'Island Originals' && m.isOriginal) ||
      m.genres.some(g => g.toLowerCase().includes(activeGenre.toLowerCase()));

    return matchesSearch && matchesIsland && matchesGenre;
  });

  const top10Movies = [...DESTINITO_MOVIES].filter(m => m.trendingRank).sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99));
  const inRoomMovies = DESTINITO_MOVIES.filter(m => m.isInRoomExclusive);
  const islandOriginals = DESTINITO_MOVIES.filter(m => m.isOriginal);
  const actionMovies = DESTINITO_MOVIES.filter(m => m.genres.includes('Action') || m.genres.includes('Maritime Thriller') || m.genres.includes('Heist'));
  const docMovies = DESTINITO_MOVIES.filter(m => m.genres.includes('Documentary') || m.genres.includes('Nature & Wildlife'));
  const comedyMovies = DESTINITO_MOVIES.filter(m => m.genres.includes('Comedy') || m.genres.includes('Animation') || m.genres.includes('Family'));

  // Horizontal Scroll Row helper
  const RowSlider = ({ title, movies, isTop10 = false, icon }: { title: string; movies: MovieItem[]; isTop10?: boolean; icon?: React.ReactNode }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const handleScroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const offset = direction === 'left' ? -600 : 600;
        scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        setTimeout(checkScroll, 350);
      }
    };

    if (movies.length === 0) return null;

    return (
      <div style={{ marginBottom: '46px', position: 'relative' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: isMobile ? '0 18px' : '0 48px', 
          marginBottom: '14px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {icon && <span style={{ color: accent }}>{icon}</span>}
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 800, 
              color: '#ffffff', 
              letterSpacing: '0.3px', 
              margin: 0,
              fontFamily: "'Netflix Sans', 'Outfit', system-ui, sans-serif"
            }}>
              {title}
            </h2>
            <span style={{ 
              fontSize: '11px', 
              color: 'rgba(255,255,255,0.4)', 
              fontWeight: 600, 
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginLeft: '6px'
            }}>
              Explore All ›
            </span>
          </div>
        </div>

        {/* Slider Track with Left / Right Floating Chevrons */}
        <div style={{ position: 'relative' }} className="destinito-slider-group">
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous titles"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '46px',
                zIndex: 20,
                background: 'linear-gradient(to right, rgba(8, 12, 16, 0.95), transparent)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
            >
              <ChevronLeft size={34} />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            style={{
              display: 'flex',
              gap: isTop10 ? '24px' : '16px',
              overflowX: 'auto',
              padding: isMobile ? '12px 18px 20px' : '16px 48px 24px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {movies.map((movie, index) => {
              const inList = myList.includes(movie.id);
              if (isTop10) {
                return (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      cursor: 'pointer',
                      flexShrink: 0,
                      position: 'relative',
                      userSelect: 'none'
                    }}
                  >
                    {/* Giant Netflix rank number */}
                    <div style={{
                      fontSize: '180px',
                      fontWeight: 900,
                      lineHeight: 0.8,
                      letterSpacing: '-16px',
                      color: '#080c10',
                      WebkitTextStroke: `4px ${accent}88`,
                      marginRight: '-30px',
                      zIndex: 1,
                      fontFamily: "'Anton', 'Impact', sans-serif",
                      textShadow: `0 0 25px ${accent}33`
                    }}>
                      {index + 1}
                    </div>

                    {/* Movie poster card */}
                    <motion.div
                      whileHover={{ scale: 1.05, y: -6, zIndex: 10 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        width: '165px',
                        height: '245px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 2,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title}
                        onError={(e) => handleImageError(e, movie)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '12px 10px 8px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}>
                        <span style={{ fontSize: '10px', color: accent, fontWeight: 800, textTransform: 'uppercase' }}>
                          {movie.islandLocation.split('&')[0]}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {movie.title}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                );
              }

              return (
                <motion.div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  whileHover={{ scale: 1.06, y: -6, zIndex: 15 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    minWidth: '260px',
                    maxWidth: '260px',
                    height: '160px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    flexShrink: 0,
                    background: '#11171f',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.6)'
                  }}
                >
                  <img
                    src={movie.backdropUrl}
                    alt={movie.title}
                    onError={(e) => handleImageError(e, movie)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />

                  {/* Badges */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                    {movie.isOriginal && (
                      <span style={{
                        background: accent,
                        color: '#080c10',
                        fontSize: '9px',
                        fontWeight: 900,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        letterSpacing: '0.6px',
                        textTransform: 'uppercase'
                      }}>
                        ORIGINAL
                      </span>
                    )}
                    {movie.isInRoomExclusive && (
                      <span style={{
                        background: 'rgba(0,0,0,0.75)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Hotel size={10} /> IN-ROOM
                      </span>
                    )}
                  </div>

                  {/* Bottom Vignette & Metadata */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '20px 12px 10px',
                    background: 'linear-gradient(to top, #080c10 20%, rgba(8, 12, 16, 0.8) 60%, transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                        {movie.title}
                      </span>
                      <button
                        onClick={(e) => handlePlay(movie, e)}
                        aria-label="Play"
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: '#fff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                        }}
                      >
                        <Play size={13} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>
                      <span style={{ color: '#46d369', fontWeight: 800 }}>{movie.matchScore}% Match</span>
                      <span style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '0 4px', borderRadius: '2px', fontSize: '9px', color: '#ccc' }}>{movie.rating}</span>
                      <span>{movie.duration}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', fontSize: '10px', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {movie.genres.slice(0, 2).join(' • ')}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next titles"
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '46px',
                zIndex: 20,
                background: 'linear-gradient(to left, rgba(8, 12, 16, 0.95), transparent)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
            >
              <ChevronRight size={34} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      background: '#080c10', 
      minHeight: '100vh', 
      color: '#ffffff', 
      fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* ═══ Netflix / Hulu Style Header Bar ═══ */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '68px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 18px' : '0 48px',
        background: scrolled ? 'rgba(8, 12, 16, 0.96)' : 'linear-gradient(to bottom, rgba(8,12,16,0.9) 0%, rgba(8,12,16,0) 100%)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.35s ease'
      }}>
        {/* Left: Brand + Navigation links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '38px' }}>
          <div 
            onClick={() => { setActiveGenre('All Movies'); setActiveIsland('All 14 Islands'); setSearchQuery(''); }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <div style={{
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '2px',
              fontFamily: "'Anton', 'Outfit', sans-serif",
              background: `linear-gradient(135deg, #ffffff 40%, ${accent} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase'
            }}>
              DESTINITO
            </div>
            <span style={{
              background: `${accent}22`,
              border: `1px solid ${accent}66`,
              color: accent,
              fontSize: '10px',
              fontWeight: 900,
              padding: '2px 7px',
              borderRadius: '4px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}>
              CINEMA
            </span>
          </div>

          <div className="hide-on-mobile hide-on-tablet" style={{ display: 'flex', alignItems: 'center', gap: '22px', fontSize: '14px', fontWeight: 600 }}>
            {['Home', 'Movies', 'Top 10', 'In-Room Premieres', 'Island Originals', 'Documentaries', 'My List'].map(tab => (
              <span
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'Top 10') setActiveGenre('Top 10 Today');
                  else if (tab === 'In-Room Premieres') setActiveGenre('In-Room Premieres');
                  else if (tab === 'Island Originals') setActiveGenre('Island Originals');
                  else if (tab === 'Documentaries') setActiveGenre('Documentaries');
                  else setActiveGenre('All Movies');
                }}
                style={{
                  color: activeTab === tab ? '#ffffff' : 'rgba(255,255,255,0.65)',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab ? 700 : 500,
                  transition: 'color 0.2s',
                  position: 'relative'
                }}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    style={{ position: 'absolute', bottom: '-6px', left: 0, right: 0, height: '2px', background: accent, borderRadius: '2px' }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Island Selector, Search, Multilingual badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Island Filter Dropdown */}
          <div style={{ position: 'relative' }} className="hide-on-mobile">
            <select
              value={activeIsland}
              onChange={(e) => setActiveIsland(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '20px',
                padding: '6px 14px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {DESTINITO_ISLANDS.map(island => (
                <option key={island} value={island} style={{ background: '#0d131a', color: '#fff' }}>
                  🌴 {island}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.85)', border: `1px solid ${accent}66`, borderRadius: '20px', padding: '4px 10px', overflow: 'hidden' }}
                >
                  <Search size={14} color={accent} style={{ marginRight: '6px', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Titles, actors, islands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                      outline: 'none',
                      width: '100%'
                    }}
                  />
                  <X 
                    size={14} 
                    color="#aaa" 
                    onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }} 
                    style={{ cursor: 'pointer', flexShrink: 0 }}
                  />
                </motion.div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search movies"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px'
                  }}
                >
                  <Search size={19} />
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* In-Room Concierge Badge */}
          <div 
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 245, 212, 0.08)',
              border: `1px solid ${accent}44`,
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 700,
              color: accent
            }}
          >
            <Hotel size={13} />
            <span>Resort In-Room Network</span>
          </div>
        </div>
      </nav>

      {/* ═══ Netflix Cinematic Hero Billboard ═══ */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '85vh',
        minHeight: '580px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        padding: isMobile ? '0 18px 50px' : '0 48px 120px'
      }}>
        {/* Backdrop Image with Netflix Vignette */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            src={featuredMovie.backdropUrl}
            alt={featuredMovie.title}
            onError={(e) => handleImageError(e, featuredMovie)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 25%',
              filter: 'brightness(0.85) contrast(1.05)'
            }}
          />
          {/* Top to Bottom and Left to Right Vignette Fades */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(8,12,16,0.95) 15%, rgba(8,12,16,0.65) 45%, transparent 75%)'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(8,12,16,0.6) 0%, transparent 40%, rgba(8,12,16,0.85) 80%, #080c10 100%)'
          }} />
        </div>

        {/* Billboard Information Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Category & Shooting Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: accent,
              color: '#080c10',
              fontWeight: 900,
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '4px',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              DESTINITO ORIGINAL
            </span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
              📍 Filmed in {featuredMovie.islandLocation}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: isMobile ? '36px' : '56px',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            lineHeight: 1.05,
            margin: 0,
            color: '#fff',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            fontFamily: "'Anton', 'Outfit', sans-serif",
            textTransform: 'uppercase'
          }}>
            {featuredMovie.title}
          </h1>

          {/* Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#fff' }}>
            <span style={{ color: '#46d369', fontWeight: 800 }}>{featuredMovie.matchScore}% Match</span>
            <span style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', padding: '1px 6px', borderRadius: '3px', fontSize: '11px', fontWeight: 700 }}>
              {featuredMovie.rating}
            </span>
            <span>{featuredMovie.duration}</span>
            <span style={{ border: `1px solid ${accent}66`, color: accent, padding: '1px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 700 }}>
              {featuredMovie.quality}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: '3px', fontSize: '10px' }}>
              {featuredMovie.audioFormat}
            </span>
          </div>

          {/* Tagline & Logline */}
          <p style={{
            fontSize: '15px',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.82)',
            margin: 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            maxWidth: '580px'
          }}>
            {featuredMovie.description}
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px' }}>
            <button
              onClick={(e) => handlePlay(featuredMovie, e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(0,0,0,0.4)',
                transition: 'transform 0.15s ease, background 0.15s ease'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Play size={20} fill="#000" color="#000" />
              <span>Play Movie</span>
            </button>

            <button
              onClick={() => setSelectedMovie(featuredMovie)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(109, 109, 110, 0.7)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 26px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.15s ease, background 0.15s ease'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(109, 109, 110, 0.9)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(109, 109, 110, 0.7)'}
            >
              <Info size={20} />
              <span>More Info</span>
            </button>

            <button
              onClick={() => toggleMyList(featuredMovie.id)}
              aria-label="Add to List"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.4)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {myList.includes(featuredMovie.id) ? <Check size={18} color={accent} /> : <Plus size={18} />}
            </button>
          </div>
        </div>

        {/* Right Billboard Controls: Sound toggle & Age Rating */}
        <div style={{
          position: 'absolute',
          right: 0,
          bottom: '120px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <button
            onClick={() => setIsHeroMuted(!isHeroMuted)}
            aria-label="Toggle Mute"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)'
            }}
          >
            {isHeroMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <div style={{
            background: 'rgba(51, 51, 51, 0.75)',
            borderLeft: `3px solid ${accent}`,
            padding: '6px 14px 6px 10px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '1px'
          }}>
            16+
          </div>
        </div>
      </div>

      {/* ═══ Netflix Genre Filter Bar ═══ */}
      <div style={{
        padding: isMobile ? '0 18px 20px' : '0 48px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        marginTop: '-30px',
        position: 'relative',
        zIndex: 20
      }}>
        {DESTINITO_GENRES.map(genre => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              background: activeGenre === genre ? accent : 'rgba(255,255,255,0.06)',
              color: activeGenre === genre ? '#080c10' : '#ffffff',
              border: `1px solid ${activeGenre === genre ? accent : 'rgba(255,255,255,0.12)'}`,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: activeGenre === genre ? `0 2px 12px ${accent}44` : 'none'
            }}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* ═══ Netflix & Hulu Style Carousels (Rows) ═══ */}
      <div style={{ position: 'relative', zIndex: 10, paddingBottom: '80px' }}>
        {searchQuery ? (
          <div style={{ padding: '0 48px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
              Search results for "{searchQuery}" ({filteredMovies.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {filteredMovies.map(movie => (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  style={{
                    background: '#11171f',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <img 
                    src={movie.backdropUrl} 
                    alt={movie.title} 
                    onError={(e) => handleImageError(e, movie)}
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }} 
                  />
                  <div style={{ padding: '12px' }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{movie.title}</div>
                    <div style={{ color: '#46d369', fontSize: '11px', fontWeight: 800, marginTop: '4px' }}>{movie.matchScore}% Match • {movie.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Top 10 in Caribbean Row */}
            <RowSlider 
              title="Top 10 Movies Today in the Caribbean" 
              movies={top10Movies} 
              isTop10={true}
              icon={<Sparkles size={18} />}
            />

            {/* In-Room Resort Premieres */}
            <RowSlider 
              title="Destinito In-Room Resort Premieres" 
              movies={inRoomMovies}
              icon={<Hotel size={18} />}
            />

            {/* Island Originals */}
            <RowSlider 
              title="Caribbean Island Originals" 
              movies={islandOriginals}
              icon={<Film size={18} />}
            />

            {/* Action & Maritime Thrillers */}
            <RowSlider 
              title="Action, Maritime Heists & Thrillers" 
              movies={actionMovies}
              icon={<Compass size={18} />}
            />

            {/* Ocean Expeditions & Documentaries */}
            <RowSlider 
              title="Ocean Expeditions & Nature Documentaries" 
              movies={docMovies}
              icon={<Globe size={18} />}
            />

            {/* Comedy & Island Vibes */}
            <RowSlider 
              title="Island Comedy & Feel-Good Stories" 
              movies={comedyMovies}
            />
          </>
        )}
      </div>

      {/* ═══ Netflix Style Movie Details Modal ═══ */}
      <AnimatePresence>
        {selectedMovie && (
          <div
            onClick={() => setSelectedMovie(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ duration: 0.25 }}
              style={{
                width: '100%',
                maxWidth: '850px',
                maxHeight: '92vh',
                background: '#121820',
                borderRadius: '12px',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
                border: '1px solid rgba(255,255,255,0.12)',
                position: 'relative'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMovie(null)}
                aria-label="Close"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 20
                }}
              >
                <X size={18} />
              </button>

              {/* Modal Hero Banner */}
              <div style={{ position: 'relative', width: '100%', height: '380px' }}>
                <img
                  src={selectedMovie.backdropUrl}
                  alt={selectedMovie.title}
                  onError={(e) => handleImageError(e, selectedMovie)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, #121820 5%, transparent 60%)'
                }} />

                {/* Modal Title & Primary Actions */}
                <div style={{ position: 'absolute', bottom: '24px', left: '32px', right: '32px' }}>
                  <span style={{ fontSize: '11px', color: accent, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    📍 Filmed in {selectedMovie.islandLocation}
                  </span>
                  <h2 style={{
                    fontSize: '40px',
                    fontWeight: 900,
                    margin: '4px 0 16px 0',
                    color: '#fff',
                    fontFamily: "'Anton', 'Outfit', sans-serif",
                    textTransform: 'uppercase',
                    textShadow: '0 4px 16px rgba(0,0,0,0.8)'
                  }}>
                    {selectedMovie.title}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <button
                      onClick={() => { setSelectedMovie(null); handlePlay(selectedMovie); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#ffffff',
                        color: '#000000',
                        border: 'none',
                        padding: '10px 26px',
                        borderRadius: '6px',
                        fontSize: '15px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      <Play size={18} fill="#000" color="#000" /> Play
                    </button>

                    <button
                      onClick={() => toggleMyList(selectedMovie.id)}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1.5px solid rgba(255,255,255,0.4)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      {myList.includes(selectedMovie.id) ? <Check size={18} color={accent} /> : <Plus size={18} />}
                    </button>

                    <button
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: '1.5px solid rgba(255,255,255,0.4)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <ThumbsUp size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Body Info */}
              <div style={{ padding: '24px 32px 36px', display: 'flex', gap: '32px' }}>
                {/* Left Column: Synopsis */}
                <div style={{ flex: 1.6, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                    <span style={{ color: '#46d369', fontWeight: 800 }}>{selectedMovie.matchScore}% Match</span>
                    <span>{selectedMovie.releaseYear}</span>
                    <span style={{ border: '1px solid rgba(255,255,255,0.3)', padding: '0 5px', borderRadius: '3px', fontSize: '11px' }}>
                      {selectedMovie.rating}
                    </span>
                    <span>{selectedMovie.duration}</span>
                    <span style={{ border: `1px solid ${accent}66`, color: accent, padding: '0 5px', borderRadius: '3px', fontSize: '10px' }}>
                      {selectedMovie.quality}
                    </span>
                  </div>

                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#e5e5e5', margin: 0 }}>
                    {selectedMovie.synopsisLong || selectedMovie.description}
                  </p>

                  {/* Multi-lingual Caribbean Audio & Subtitles Banner */}
                  <div style={{
                    background: 'rgba(0, 245, 212, 0.06)',
                    border: `1px solid ${accent}33`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginTop: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: accent, fontWeight: 700, marginBottom: '6px' }}>
                      <Globe size={14} /> Caribbean Multilingual Audio & Subtitles
                    </div>
                    <div style={{ fontSize: '12px', color: '#ccc', lineHeight: 1.5 }}>
                      <b>Spoken Audio:</b> {selectedMovie.audioLanguages.join(', ')}<br />
                      <b>Subtitles:</b> {selectedMovie.subtitleLanguages.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Right Column: Cast, Director, Genres */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Director: </span>
                    <span style={{ color: '#fff' }}>{selectedMovie.director}</span>
                  </div>

                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Cast: </span>
                    <span style={{ color: '#fff' }}>{selectedMovie.cast.join(', ')}</span>
                  </div>

                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Genres: </span>
                    <span style={{ color: '#fff' }}>{selectedMovie.genres.join(', ')}</span>
                  </div>

                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Island Setting: </span>
                    <span style={{ color: accent, fontWeight: 600 }}>{selectedMovie.islandLocation}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ In-Browser Cinematic Video Player Modal ═══ */}
      <AnimatePresence>
        {playingMovie && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: '#000000',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Top Player Bar */}
            <div style={{
              padding: '16px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)',
              zIndex: 10
            }}>
              <button
                onClick={() => setPlayingMovie(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={24} /> Back to Browse
              </button>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{playingMovie.title}</div>
                <div style={{ fontSize: '11px', color: accent }}>{playingMovie.quality} • {playingMovie.audioFormat}</div>
              </div>

              {/* Subtitle & Audio Track Selectors */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <span style={{ color: '#aaa' }}>Subtitles:</span>
                  <select
                    value={selectedSubtitle}
                    onChange={(e) => setSelectedSubtitle(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer'
                    }}
                  >
                    {playingMovie.subtitleLanguages.map(sub => (
                      <option key={sub} value={sub} style={{ background: '#111', color: '#fff' }}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Video Player Display */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {(() => {
                const rawUrl = playingMovie.videoUrl || playingMovie.trailerUrl || '';
                const match = rawUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                const ytId = (match && match[2].length === 11) ? match[2] : (rawUrl.length === 11 ? rawUrl : '3-JjF1c-N8A');
                
                return (
                  <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&controls=1&enablejsapi=1&playsinline=1&modestbranding=1&rel=0&showinfo=0${typeof window !== 'undefined' ? `&origin=${encodeURIComponent(window.location.origin)}` : ''}`}
                      title={playingMovie.title}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                    />

                    {/* WWTC Language & Translation Overlay (Multi-language subtitles & voiceover) */}
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30 }}>
                      <VideoTranslationOverlay 
                        videoUrl={playingMovie.videoUrl || `https://www.youtube.com/watch?v=${ytId}`}
                        videoId={ytId}
                        accent={accent}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
