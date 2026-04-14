import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Square, Mic, MicOff, Volume2, Monitor, Video, Music, Layers, Type, Users, LayoutDashboard, Copy, Check, Hash } from 'lucide-react';
import Peer from 'peerjs';

export default function DirectorStudio() {
  const [isLive, setIsLive] = useState(false);
  const [guests, setGuests] = useState<any[]>([]);
  const channelRef = useRef<any>(null);
  const [layoutStyle, setLayoutStyle] = useState<'split' | 'isolate_host' | 'isolate_guest'>('split');
  const [lowerThirds, setLowerThirds] = useState({ active: false, text: 'Vibe Network Exclusive Broadcast', sub: 'Live from the Studio' });
  const [bgMusic, setBgMusic] = useState({ active: false, track: 'Lofi Chilled Beats', volume: 40 });
  const [copied, setCopied] = useState(false);
  const hostVideoRef = useRef<HTMLVideoElement>(null);

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

     const connectToHost = (peerInstance: any) => {
        if (!streamId) return;
        console.log("[WebRTC] Dialing host:", streamId);
        
        // Use a dummy canvas stream to ensure PeerJS sets SDP offerToReceiveVideo flag
        const canvas = document.createElement('canvas');
        canvas.width = 1; canvas.height = 1;
        const dummyStream = canvas.captureStream();

        const call = peerInstance.call(`vibe-host-${streamId}`, dummyStream);
        
        if (call) {
          call.on('stream', (remoteStream: any) => {
             console.log("[WebRTC] Receiving host stream via PeerJS!");
             if (hostVideoRef.current) {
                hostVideoRef.current.srcObject = remoteStream;
                hostVideoRef.current.play().catch((e: any) => console.error("Playback failed:", e));
             }
          });
        }
     };

     channel.on('broadcast', { event: 'host_sync_guests' }, (payload) => {
        // Hydrate green room visually for director
        setGuests(payload.payload.map((g: any) => ({ ...g, feed: `https://images.unsplash.com/photo-${1550000000000 + (Math.random() * 1000)}?auto=format&fit=crop&w=400&q=80`, volume: 80, micActive: true })));
     }).on('broadcast', { event: 'webrtc_host_ready' }, () => {
        console.log("[WebRTC] Host signaled ready! Redialing...");
        if (typeof window !== 'undefined' && (window as any)._vibeDirectorPeer) {
           connectToHost((window as any)._vibeDirectorPeer);
        }
     }).subscribe((status) => {
        if (status === 'SUBSCRIBED') {
           setStudioStatus('Connected');
           
           if (typeof window !== 'undefined' && streamId) {
             const peer = new Peer();
             (window as any)._vibeDirectorPeer = peer;
             peer.on('open', () => {
                 connectToHost(peer);
             });
           }
        }
     });

     return () => { 
        channel.unsubscribe(); 
        if (typeof window !== 'undefined' && (window as any)._vibeDirectorPeer) {
           (window as any)._vibeDirectorPeer.destroy();
        }
     };
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
      
      <style>{`
        .director-navbar {
          height: 60px;
          background: #111;
          border-bottom: 1px solid #222;
          display: flex;
          align-items: center;
          padding: 0 20px;
          justify-content: space-between;
        }
        .director-nav-left { display: flex; align-items: center; gap: 15px; }
        .director-nav-right { display: flex; align-items: center; gap: 15px; }

        .director-workspace {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        
        .director-panel-left {
          width: 300px;
          background: #0d0d0d;
          border-right: 1px solid #222;
          display: flex;
          flex-direction: column;
        }
        
        .director-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #000;
          position: relative;
        }
        
        .director-panel-right {
          width: 300px;
          background: #0d0d0d;
          border-left: 1px solid #222;
          display: flex;
          flex-direction: column;
        }

        .scene-controls {
          position: absolute;
          top: 20px; left: 20px; right: 20px;
          z-index: 50;
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        @media (max-width: 1024px) {
          .director-navbar {
            flex-direction: column;
            height: auto;
            padding: 15px;
            gap: 15px;
          }
          .director-nav-left h1 { font-size: 16px !important; }
          .director-nav-right button { font-size: 11px !important; padding: 6px 12px !important; }
          
          .director-workspace {
            flex-direction: column;
            overflow-y: auto;
            position: relative;
          }
          
          .director-center {
            order: 1;
            min-height: 500px;
            overflow: visible;
          }
          
          .director-panel-left {
            order: 2;
            width: 100%;
            height: 400px;
            border-right: none;
            border-bottom: 1px solid #222;
          }
          
          .director-panel-right {
            order: 3;
            width: 100%;
            height: auto;
            min-height: 300px;
            border-left: none;
          }

          .scene-controls {
            flex-wrap: wrap;
          }
        }
      `}</style>
      
      {/* Top Navbar */}
      <div className="director-navbar">
        <div className="director-nav-left">
           <Monitor size={24} color="#00ff88" />
           <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>VIBE DIRECTOR STUDIO</h1>
           <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '20px' }}>
             <Users size={14} /> Room: VIBE-7329
           </div>
        </div>
        
        <div className="director-nav-right">
           <button onClick={handleCopyLink} style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {copied ? <Check size={14} color="#00ff88"/> : <Copy size={14} />} {copied ? 'Copied URL' : 'Copy Director URL'}
           </button>
           <div style={{ width: '1px', height: '30px', background: '#333' }} />
           <button onClick={() => {
              const nextStatus = !isLive;
              setIsLive(nextStatus);
              if (channelRef.current) {
                 channelRef.current.send({ type: 'broadcast', event: 'director_command', payload: { action: 'set_live_status', status: nextStatus } });
              }
           }} style={{ background: isLive ? '#ff0055' : '#00ff88', color: isLive ? '#fff' : '#000', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s', boxShadow: isLive ? '0 0 15px rgba(255,0,85,0.4)' : '0 0 15px rgba(0,255,136,0.2)' }}>
              {isLive ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {isLive ? 'END BROADCAST' : 'GO LIVE'}
           </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="director-workspace">
        
        {/* Left Column: Guest Management & Green Room */}
        <div className="director-panel-left">
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
        <div className="director-center">
           
           {/* Scene Controls */}
           <div className="scene-controls">
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
                       <div style={{ flex: layoutStyle === 'isolate_host' || activeGuests.length === 0 ? '1 1 100%' : '1 1 50%', height: activeGuests.length > 0 && layoutStyle === 'split' ? '100%' : '100%', position: 'relative', background: '#111' }}>
                          <video ref={hostVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
        <div className="director-panel-right">
           <div style={{ padding: '15px', borderBottom: '1px solid #222', fontWeight: 'bold', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '14px' }}>
             <Layers size={16} /> Graphics & Media
           </div>
           
           <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '30px', overflowY: 'auto' }}>
              
              {/* Lower Thirds Control */}
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px', color: '#aaa', fontWeight: 'bold' }}>
                    <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><Type size={14}/> Lower Thirds</span>
                 </div>
                 <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
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
