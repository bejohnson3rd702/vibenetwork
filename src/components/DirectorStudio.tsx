import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Square, Mic, MicOff, Volume2, Monitor, Video, Music, Layers, Type, Users, LayoutDashboard, Copy, Check, Hash } from 'lucide-react';

const MOCK_GUESTS = [
  { id: '1', name: 'Sarah Jenkins', title: 'Tech Analyst', isLive: true, micActive: true, volume: 80, feed: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Mike Ross', title: 'Legal Counsel', isLive: false, micActive: true, volume: 65, feed: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'Elena Chen', title: 'Product Lead', isLive: true, micActive: false, volume: 0, feed: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
];

export default function DirectorStudio() {
  const [isLive, setIsLive] = useState(false);
  const [guests, setGuests] = useState<any[]>([]);
  const channelRef = useRef<any>(null);
  const [layoutStyle, setLayoutStyle] = useState<'split' | 'isolate_host' | 'isolate_guest'>('split');
  const [lowerThirds, setLowerThirds] = useState({ active: false, text: 'Vibe Network Exclusive Broadcast', sub: 'Live from the Studio' });
  const [bgMusic, setBgMusic] = useState({ active: false, track: 'Lofi Chilled Beats', volume: 40 });
  const [copied, setCopied] = useState(false);

  // Mock connecting to WebRTC room
  const [studioStatus, setStudioStatus] = useState('Initializing master signaling servers...');

  useEffect(() => {
     const streamId = new URLSearchParams(window.location.search).get('stream');
     if (!streamId) {
        setStudioStatus('No stream ID provided. URL must contain ?stream=ID');
        return;
     }

     const channel = supabase.channel(`stream-room-${streamId}`);
     channelRef.current = channel;

     channel.on('broadcast', { event: 'host_sync_guests' }, (payload) => {
        // Hydrate green room visually for director
        setGuests(payload.payload.map((g: any) => ({ ...g, feed: `https://images.unsplash.com/photo-${1550000000000 + (Math.random() * 1000)}?auto=format&fit=crop&w=400&q=80`, volume: 80, micActive: true })));
     }).subscribe((status) => {
        if (status === 'SUBSCRIBED') {
           setStudioStatus('Connected');
           // If we're debugging without a real host, fall back to mock guests after 2s
           setTimeout(() => { if (guests.length === 0) setGuests(MOCK_GUESTS); }, 2000);
        }
     });

     return () => { channel.unsubscribe(); };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleGuestLive = (id: string) => {
    if (channelRef.current) {
       channelRef.current.send({ type: 'broadcast', event: 'director_command', payload: { action: 'toggle_guest', guestId: id } });
    }
    setGuests(prev => prev.map(g => g.id === id ? { ...g, isLive: !g.isLive } : g));
  };

  const updateGuestVolume = (id: string, vol: number) => {
    setGuests(prev => prev.map(g => g.id === id ? { ...g, volume: vol, micActive: vol > 0 } : g));
  };

  const activeGuests = guests.filter(g => g.isLive);

  if (studioStatus !== 'Connected') {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
         <div style={{ width: 40, height: 40, border: '3px solid rgba(0,255,136,0.2)', borderTopColor: '#00ff88', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
         <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
         <div style={{ fontFamily: 'monospace', color: '#00ff88' }}>{studioStatus}</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Navbar */}
      <div style={{ height: '60px', background: '#111', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <Monitor size={24} color="#00ff88" />
           <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>VIBE DIRECTOR STUDIO</h1>
           <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '20px' }}>
             <Users size={14} /> Room: VIBE-7329
           </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
           <button onClick={handleCopyLink} style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {copied ? <Check size={14} color="#00ff88"/> : <Copy size={14} />} {copied ? 'Copied URL' : 'Copy Director URL'}
           </button>
           <div style={{ width: '1px', height: '30px', background: '#333' }} />
           <button onClick={() => setIsLive(!isLive)} style={{ background: isLive ? '#ff0055' : '#00ff88', color: isLive ? '#fff' : '#000', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s', boxShadow: isLive ? '0 0 15px rgba(255,0,85,0.4)' : '0 0 15px rgba(0,255,136,0.2)' }}>
              {isLive ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {isLive ? 'END BROADCAST' : 'GO LIVE'}
           </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* Left Column: Guest Management & Green Room */}
        <div style={{ width: '300px', background: '#0d0d0d', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
           <div style={{ padding: '15px', borderBottom: '1px solid #222', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
             <span>Green Room ({guests.length})</span>
             <Mic size={16} color="#888" />
           </div>
           
           <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              {guests.map(guest => (
                 <div key={guest.id} style={{ background: '#1a1a1a', borderRadius: '8px', padding: '10px', marginBottom: '10px', border: guest.isLive ? '1px solid #00ff88' : '1px solid #333' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                       <img src={guest.feed} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                       <div style={{ flex: 1, overflow: 'hidden' }}>
                          <h4 style={{ margin: 0, fontSize: '13px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{guest.name}</h4>
                          <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{guest.title}</p>
                       </div>
                       {guest.isLive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 5px #00ff88' }} />}
                    </div>
                    
                    <div style={{ margin: '10px 0', height: '1px', background: '#333' }} />
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button onClick={() => updateGuestVolume(guest.id, guest.volume === 0 ? 80 : 0)} style={{ background: 'none', border: 'none', color: guest.micActive ? '#fff' : '#ff0055', cursor: 'pointer', padding: 0 }}>
                             {guest.micActive ? <Mic size={14} /> : <MicOff size={14} />}
                          </button>
                          <input 
                            type="range" min="0" max="100" value={guest.volume} 
                            onChange={(e) => updateGuestVolume(guest.id, parseInt(e.target.value))}
                            style={{ flex: 1, accentColor: '#00ff88', height: '4px' }}
                          />
                          <span style={{ fontSize: '10px', color: '#888', width: '24px' }}>{guest.volume}%</span>
                       </div>
                       
                       <div style={{ display: 'flex', gap: '5px' }}>
                          <button onClick={() => toggleGuestLive(guest.id)} style={{ flex: 1, padding: '6px', background: guest.isLive ? 'rgba(255,0,85,0.2)' : 'rgba(0,255,136,0.1)', color: guest.isLive ? '#ff0055' : '#00ff88', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {guest.isLive ? 'Remove from Stream' : 'Send to Stream'}
                          </button>
                          <button style={{ flex: 1, padding: '6px', background: '#222', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                             <Mic size={12} /> Talk
                          </button>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Center Canvas: Program Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
           
           {/* Scene Controls */}
           <div style={{ position: 'absolute', top: 20, left: 20, right: 20, zIndex: 50, display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button onClick={() => {
                setLayoutStyle('split');
                if (channelRef.current) channelRef.current.send({ type: 'broadcast', event: 'director_command', payload: { action: 'update_layout', layout: 'split' } });
              }} style={{ background: layoutStyle === 'split' ? '#fff' : 'rgba(0,0,0,0.5)', color: layoutStyle === 'split' ? '#000' : '#fff', border: '1px solid #333', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '6px' }}><LayoutDashboard size={14}/> Split Grid</button>
              
              <button onClick={() => {
                setLayoutStyle('isolate_host');
                if (channelRef.current) channelRef.current.send({ type: 'broadcast', event: 'director_command', payload: { action: 'update_layout', layout: 'isolate_host' } });
              }} style={{ background: layoutStyle === 'isolate_host' ? '#fff' : 'rgba(0,0,0,0.5)', color: layoutStyle === 'isolate_host' ? '#000' : '#fff', border: '1px solid #333', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '6px' }}><Monitor size={14}/> Host Only</button>
              
              <button onClick={() => {
                setLayoutStyle('isolate_guest');
                if (channelRef.current) channelRef.current.send({ type: 'broadcast', event: 'director_command', payload: { action: 'update_layout', layout: 'isolate_guest' } });
              }} style={{ background: layoutStyle === 'isolate_guest' ? '#fff' : 'rgba(0,0,0,0.5)', color: layoutStyle === 'isolate_guest' ? '#000' : '#fff', border: '1px solid #333', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14}/> Primary Guest</button>
           </div>

           {/* Live Program Monitor */}
           <div style={{ flex: 1, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#111', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: isLive ? '2px solid #ff0055' : '2px solid #333' }}>
                 
                 {isLive && <div style={{ position: 'absolute', top: 15, right: 15, background: '#ff0055', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', zIndex: 100, display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: 6, height: 6, background: '#fff', borderRadius: '50%', animation: 'pulse 1.5s infinite'}} />PROGRAM</div>}
                 
                 {/* Feed Matrix Container */}
                 <div style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap' }}>
                    
                    {/* Host Block */}
                    {layoutStyle !== 'isolate_guest' && (
                       <div style={{ flex: layoutStyle === 'isolate_host' || activeGuests.length === 0 ? '1 1 100%' : '1 1 50%', height: activeGuests.length > 0 && layoutStyle === 'split' ? '100%' : '100%', position: 'relative' }}>
                          <img src="https://images.unsplash.com/photo-1516280440502-86927dccab74?auto=format&fit=crop&q=80&w=1200" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', bottom: 15, left: 15, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px' }}>Studio Host Cam</div>
                       </div>
                    )}

                    {/* Guest Blocks */}
                    {layoutStyle !== 'isolate_host' && activeGuests.length > 0 && (
                       <div style={{ flex: layoutStyle === 'isolate_guest' ? '1 1 100%' : '1 1 50%', height: '100%', display: 'flex', flexDirection: layoutStyle === 'isolate_guest' ? 'row' : 'column' }}>
                          {activeGuests.map(g => (
                            <div key={g.id} style={{ flex: 1, position: 'relative', borderLeft: '1px solid #000', borderBottom: '1px solid #000' }}>
                               <img src={g.feed} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                               <div style={{ position: 'absolute', bottom: 15, left: 15, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                  {g.name} {!g.micActive && <MicOff size={10} color="#ff0055" />}
                               </div>
                            </div>
                          ))}
                       </div>
                    )}

                 </div>

                 {/* Lower Thirds Overlay */}
                 <AnimatePresence>
                    {lowerThirds.active && (
                       <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} style={{ position: 'absolute', bottom: 40, left: 40, zIndex: 90 }}>
                          <div style={{ background: '#00ff88', color: '#000', padding: '10px 20px', fontWeight: '900', fontSize: '20px', display: 'inline-block', boxShadow: '5px 5px 0px rgba(0,0,0,0.3)' }}>
                            {lowerThirds.text}
                          </div>
                          <br />
                          {lowerThirds.sub && (
                            <div style={{ background: '#000', color: '#fff', padding: '6px 20px', display: 'inline-block', fontSize: '14px', borderLeft: '4px solid #00ff88', marginTop: '4px' }}>
                               {lowerThirds.sub}
                            </div>
                          )}
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>

        {/* Right Column: Assets & Graphics */}
        <div style={{ width: '300px', background: '#0d0d0d', borderLeft: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
           <div style={{ padding: '15px', borderBottom: '1px solid #222', fontWeight: 'bold', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
             <Layers size={16} /> Graphics & Media
           </div>
           
           <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px', overflowY: 'auto' }}>
              
              {/* Lower Thirds Control */}
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>
                    <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><Type size={14}/> Lower Thirds</span>
                 </div>
                    <input 
                      type="text" 
                      value={lowerThirds.text} 
                      onChange={e => {
                        const next = {...lowerThirds, text: e.target.value};
                        setLowerThirds(next);
                        if (channelRef.current) channelRef.current.send({ type: 'broadcast', event: 'director_command', payload: { action: 'update_lower_thirds', lowerThirds: next } });
                      }} 
                      style={{ width: '100%', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '4px', marginBottom: '10px', fontSize: '12px' }} 
                      placeholder="Headline"
                    />
                    <input 
                      type="text" 
                      value={lowerThirds.sub} 
                      onChange={e => {
                        const next = {...lowerThirds, sub: e.target.value};
                        setLowerThirds(next);
                        if (channelRef.current) channelRef.current.send({ type: 'broadcast', event: 'director_command', payload: { action: 'update_lower_thirds', lowerThirds: next } });
                      }} 
                      style={{ width: '100%', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '4px', marginBottom: '15px', fontSize: '12px' }} 
                      placeholder="Subtext"
                    />
                    <button 
                      onClick={() => {
                        const next = {...lowerThirds, active: !lowerThirds.active};
                        setLowerThirds(next);
                        if (channelRef.current) channelRef.current.send({ type: 'broadcast', event: 'director_command', payload: { action: 'update_lower_thirds', lowerThirds: next } });
                      }}
                      style={{ width: '100%', padding: '8px', background: lowerThirds.active ? '#ff0055' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', transition: '0.2s' }}
                    >
                      {lowerThirds.active ? 'Hide Graphic' : 'Show Graphic'}
                    </button>
                 </div>
              </div>

              {/* Background Music */}
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>
                    <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><Music size={14}/> Music & SFX</span>
                 </div>
                 <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                    <select style={{ width: '100%', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '4px', marginBottom: '15px', fontSize: '12px' }}>
                       <option>Lofi Chilled Beats</option>
                       <option>Corporate Uplifting</option>
                       <option>Club Electronic</option>
                       <option>Ambient Drone</option>
                    </select>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                       <Volume2 size={14} color="#888" />
                       <input type="range" min="0" max="100" value={bgMusic.volume} onChange={e=>setBgMusic({...bgMusic, volume: parseInt(e.target.value)})} style={{ flex: 1, accentColor: '#00ff88', height: '4px' }} />
                       <span style={{ fontSize: '11px', width: '25px', textAlign: 'right' }}>{bgMusic.volume}%</span>
                    </div>

                    <button 
                      onClick={() => setBgMusic({...bgMusic, active: !bgMusic.active})}
                      style={{ width: '100%', padding: '8px', background: bgMusic.active ? '#ff0055' : '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', transition: '0.2s' }}
                    >
                      {bgMusic.active ? 'Stop Loop' : 'Play Audio Loop'}
                    </button>
                 </div>
              </div>

              {/* Video Feed Injection */}
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>
                    <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><Video size={14}/> Inject External Video</span>
                 </div>
                 <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px dashed #444', textAlign: 'center', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.borderColor='#00ff88'} onMouseOut={e=>e.currentTarget.style.borderColor='#444'}>
                    <Video size={24} color="#888" style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>Upload or Link MP4</div>
                    <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>Takes over full screen when pushed</div>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
