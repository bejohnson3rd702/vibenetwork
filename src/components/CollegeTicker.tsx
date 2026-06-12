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

const OLYMPIA_EVENTS = [
  { sport: '🎙️ PRESS CONF', away: { name: 'Press Conference' }, home: { name: 'Orleans Arena' }, status: 'THUR OCT 8 · 12:00 PM' },
  { sport: '🤝 FAN MEET', away: { name: 'Meet the Olympians' }, home: { name: 'VIP Fan Experience' }, status: 'THUR OCT 8 · 7:00 PM' },
  { sport: '💪 EXPO', away: { name: 'World Fitness Expo' }, home: { name: 'Convention Center' }, status: 'FRI & SAT · 9:00 AM' },
  { sport: '🏆 FRIDAY FINALS', away: { name: 'Friday Finals' }, home: { name: 'Fitness, Figure, Classic' }, status: 'FRI OCT 9 · 6:00 PM' },
  { sport: '🔥 PRE-JUDGING', away: { name: 'Saturday Pre-Judging' }, home: { name: 'Mr. Olympia, Bikini' }, status: 'SAT OCT 10 · 9:30 AM' },
  { sport: '👑 SATURDAY FINALS', away: { name: 'Saturday Finals' }, home: { name: 'Mr. Olympia Finals' }, status: 'SAT OCT 10 · 6:00 PM' },
];

const B2K_EVENTS = [
  { sport: '🎤 TOUR STARTS', away: { name: 'Columbia, SC' }, home: { name: 'Colonial Life Arena' }, status: 'FEB 12 · 7:30 PM' },
  { sport: '🔥 REUNION', away: { name: 'Atlanta, GA' }, home: { name: 'State Farm Arena' }, status: 'FEB 13 · 8:00 PM' },
  { sport: '🎧 LIVE SHOW', away: { name: 'Chicago, IL' }, home: { name: 'United Center' }, status: 'FEB 22 · 8:00 PM' },
  { sport: '👑 LEGENDS', away: { name: 'Brooklyn, NY' }, home: { name: 'Barclays Center' }, status: 'MAR 20 · 8:00 PM' },
  { sport: '💫 TOUR LIVE', away: { name: 'Los Angeles, CA' }, home: { name: 'The Forum' }, status: 'MAR 15 · 7:30 PM' },
  { sport: '✨ FINALE', away: { name: 'Hampton, VA' }, home: { name: 'Hampton Coliseum' }, status: 'APR 19 · 7:00 PM' },
];

const KPLE_EVENTS = [
  { sport: '📢 HEALING ROOMS', away: { name: 'The Killeen Healing Rooms' }, home: { name: 'KPLE-TV Building (502 E. Elms Rd., Killeen)' }, status: '2nd Sat (9:30-11:30 AM) & Last Tue (6:45-8:00 PM)' },
  { sport: '🙏 PRAYER LINE', away: { name: 'Need Prayer? We are here for you' }, home: { name: 'Toll-Free Prayer Request Line' }, status: 'Call (877) 640-5673' },
  { sport: '✝️ MEMBER SUPPORT', away: { name: 'KKCBC 501(c)3 Media Mission' }, home: { name: 'Become a Partner / Monthly Member' }, status: 'members.kple-tv.org' },
];

const API_BASE = '/api/ncaa';

export default function CollegeTicker({ accent = '#D35400', isOlympian = false, isB2K = false, isKple = false }: { accent?: string; isOlympian?: boolean; isB2K?: boolean; isKple?: boolean }) {
  const [games, setGames] = useState<GameScore[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (isOlympian) {
      const allGames: GameScore[] = OLYMPIA_EVENTS.map((e, idx) => ({
        id: `olympia-${idx}`,
        away: { name: e.away.name, score: '' },
        home: { name: e.home.name, score: '' },
        status: e.status,
        sport: e.sport,
      }));
      setGames(allGames);
      setLoading(false);
      return;
    }

    if (isB2K) {
      const allGames: GameScore[] = B2K_EVENTS.map((e, idx) => ({
        id: `b2k-${idx}`,
        away: { name: e.away.name, score: '' },
        home: { name: e.home.name, score: '' },
        status: e.status,
        sport: e.sport,
      }));
      setGames(allGames);
      setLoading(false);
      return;
    }

    if (isKple) {
      const allGames: GameScore[] = KPLE_EVENTS.map((e, idx) => ({
        id: `kple-${idx}`,
        away: { name: e.away.name, score: '' },
        home: { name: e.home.name, score: '' },
        status: e.status,
        sport: e.sport,
      }));
      setGames(allGames);
      setLoading(false);
      return;
    }

    const fetchScores = async () => {
      const allGames: GameScore[] = [];

      for (const sport of SPORTS) {
        try {
          const res = await fetch(`${API_BASE}/scoreboard/${sport.endpoint}`);
          if (!res.ok) continue;
          const data = await res.json();
          const rawGames = data?.games || [];
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
  }, [isOlympian, isB2K, isKple]);

  useEffect(() => {
    if (!scrollRef.current || paused || games.length === 0) return;

    const el = scrollRef.current;
    let animId: number;
    let pos = el.scrollLeft || 0;

    const step = () => {
      pos += 0.6;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [paused, games]);

  if (loading) {
    return (
      <div style={{
        width: '100%', height: '54px', background: '#050505',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', color: '#444', letterSpacing: '2px', textTransform: 'uppercase',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        ● {isOlympian ? 'OLYMPIA SCHEDULE LOADING' : (isB2K ? 'B2K TOUR DATES LOADING' : (isKple ? 'KPLE LOCAL EVENTS LOADING' : 'NCAA SCOREBOARD LOADING'))}
      </div>
    );
  }

  if (games.length === 0) return null;

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
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px',
        background: 'linear-gradient(to right, #050505, transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px',
        background: 'linear-gradient(to left, #050505, transparent)', zIndex: 2, pointerEvents: 'none' }} />

      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 3,
        display: 'flex', alignItems: 'center', paddingLeft: '12px', paddingRight: '16px',
        background: 'linear-gradient(to right, #050505 70%, transparent)',
        fontSize: '13px', fontWeight: 900, letterSpacing: '2px', color: accent,
        textTransform: 'uppercase',
      }}>
        {isOlympian ? 'OLYMPIA' : (isB2K ? 'B2K TOUR' : (isKple ? 'LOCAL EVENTS' : 'NCAA'))}
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
          const hasScore = game.away.score !== '';

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
              <span style={{ fontSize: '14px' }}>{game.sport.split(' ')[0]}</span>

              <span style={{ fontSize: '15px', fontWeight: 600, color: '#999' }}>
                {game.away.name}
              </span>
              
              {hasScore && (
                <>
                  <span style={{
                    fontSize: '17px', fontWeight: 900,
                    color: isFinal && parseInt(game.away.score) > parseInt(game.home.score) ? '#fff' : '#666',
                    minWidth: '16px', textAlign: 'right',
                  }}>
                    {game.away.score}
                  </span>
                  <span style={{ fontSize: '13px', color: '#333', fontWeight: 700 }}>vs</span>
                  <span style={{
                    fontSize: '17px', fontWeight: 900,
                    color: isFinal && parseInt(game.home.score) > parseInt(game.away.score) ? '#fff' : '#666',
                    minWidth: '16px',
                  }}>
                    {game.home.score}
                  </span>
                </>
              )}
              
              {!hasScore && (
                <span style={{ fontSize: '13px', color: '#333', fontWeight: 900 }}>👉</span>
              )}

              <span style={{ fontSize: '15px', fontWeight: 600, color: '#999' }}>
                {game.home.name}
              </span>

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
