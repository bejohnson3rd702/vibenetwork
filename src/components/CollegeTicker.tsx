import { useState, useEffect, useRef } from 'react';

interface GameScore {
  id: string;
  away: { name: string; score: string; logo?: string };
  home: { name: string; score: string; logo?: string };
  status: string;
  sport: string;
}

const SPORTS = [
  { key: 'football', label: '🏈 CFB', endpoint: 'football/fbs' },
  { key: 'basketball-men', label: '🏀 MBB', endpoint: 'basketball-men/d1' },
  { key: 'baseball', label: '⚾ BASE', endpoint: 'baseball/d1' },
];

const API_BASE = '/api/ncaa';

// Team colors for AVO schools
const SCHOOL_COLORS: Record<string, string> = {
  'alabama': '#9E1B32', 'ole-miss': '#CE1126', 'colorado': '#CFB87C',
  'vanderbilt': '#866D4B', 'georgia': '#BA0C2F', 'mississippi-st': '#660000',
  'baylor': '#154734', 'penn-st': '#041E42',
};

export default function CollegeTicker({ accent = '#D35400' }: { accent?: string }) {
  const [games, setGames] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const fetchScores = async () => {
      const allGames: GameScore[] = [];

      for (const sport of SPORTS) {
        try {
          const res = await fetch(`${API_BASE}/scoreboard/${sport.endpoint}`);
          if (!res.ok) continue;
          const data = await res.json();
          const rawGames = data?.games || [];
          // Take up to 8 games per sport
          rawGames.slice(0, 8).forEach((g: any) => {
            const game = g.game || g;
            allGames.push({
              id: `${sport.key}-${game.gameID || Math.random()}`,
              away: {
                name: game.away?.names?.short || game.away?.names?.char6 || 'Away',
                score: String(game.away?.score ?? ''),
                logo: game.away?.names?.seo
                  ? `https://www.ncaa.com/sites/default/files/images/logos/schools/bgd/${game.away.names.seo}.svg`
                  : undefined,
              },
              home: {
                name: game.home?.names?.short || game.home?.names?.char6 || 'Home',
                score: String(game.home?.score ?? ''),
                logo: game.home?.names?.seo
                  ? `https://www.ncaa.com/sites/default/files/images/logos/schools/bgd/${game.home.names.seo}.svg`
                  : undefined,
              },
              status: game.gameState === 'live'
                ? (game.currentPeriod || 'LIVE')
                : game.gameState === 'final'
                  ? 'FINAL'
                  : game.startTime || 'TBD',
              sport: sport.label,
            });
          });
        } catch (err) {
          console.warn(`Ticker: could not fetch ${sport.key}`, err);
        }
      }

      if (allGames.length > 0) setGames(allGames);
      setLoading(false);
    };

    fetchScores();
    const interval = setInterval(fetchScores, 90000);
    return () => clearInterval(interval);
  }, []);

  // Marquee animation
  useEffect(() => {
    if (!scrollRef.current || paused || games.length === 0) return;

    const el = scrollRef.current;
    let animId: number;
    let pos = el.scrollLeft || 0;

    const step = () => {
      pos += 0.6;
      // Reset when we've scrolled through the first set
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [paused, games]);

  // Don't render anything while loading
  if (loading) {
    return (
      <div style={{
        width: '100%', height: '54px', background: '#050505',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', color: '#444', letterSpacing: '2px', textTransform: 'uppercase',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        ● NCAA SCOREBOARD LOADING
      </div>
    );
  }

  if (games.length === 0) return null;

  // Duplicate for seamless loop
  const tickerGames = [...games, ...games];

  return (
    <div
      style={{
        width: '100%',
        background: '#050505',
        borderBottom: `1px solid ${accent}15`,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1000,
        fontFamily: "'Inter', system-ui, sans-serif",
        userSelect: 'none',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Edge fades */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px',
        background: 'linear-gradient(to right, #050505, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px',
        background: 'linear-gradient(to left, #050505, transparent)', zIndex: 2, pointerEvents: 'none' }} />

      {/* NCAA label */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 3,
        display: 'flex', alignItems: 'center', paddingLeft: '12px', paddingRight: '16px',
        background: 'linear-gradient(to right, #050505 70%, transparent)',
        fontSize: '13px', fontWeight: 900, letterSpacing: '2px', color: accent,
        textTransform: 'uppercase',
      }}>
        NCAA
      </div>

      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          height: '54px',
          paddingLeft: '50px',
        }}
      >
        {tickerGames.map((game, i) => {
          const isLive = game.status.includes('LIVE') || game.status.includes('Half')
            || game.status.includes('Quarter') || game.status.includes('Period');
          const isFinal = game.status === 'FINAL';

          return (
            <div
              key={`${game.id}-${i}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 24px',
                borderRight: '1px solid rgba(255,255,255,0.04)',
                flexShrink: 0,
                height: '100%',
              }}
            >
              {/* Sport icon */}
              <span style={{ fontSize: '14px' }}>{game.sport.split(' ')[0]}</span>

              {/* Away */}
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#999' }}>
                {game.away.name}
              </span>
              <span style={{
                fontSize: '17px', fontWeight: 900,
                color: isFinal && parseInt(game.away.score) > parseInt(game.home.score) ? '#fff' : '#666',
                minWidth: '16px', textAlign: 'right',
              }}>
                {game.away.score || '-'}
              </span>

              <span style={{ fontSize: '13px', color: '#333', fontWeight: 700 }}>vs</span>

              {/* Home */}
              <span style={{
                fontSize: '17px', fontWeight: 900,
                color: isFinal && parseInt(game.home.score) > parseInt(game.away.score) ? '#fff' : '#666',
                minWidth: '16px',
              }}>
                {game.home.score || '-'}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#999' }}>
                {game.home.name}
              </span>

              {/* Status */}
              <span style={{
                fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase',
                color: isLive ? '#FF3B30' : isFinal ? '#555' : accent,
                ...(isLive ? { animation: 'tickerPulse 1.5s ease-in-out infinite' } : {}),
              }}>
                {game.status}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes tickerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
