import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Settings, Camera, Video } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Peer from 'peerjs';

// We import LiveChat dynamically
const LiveChat = React.lazy(() => import('./LiveChat').catch(() => ({ default: () => <div/> })));

export interface ProfileLiveProps {
  isSubscribed: boolean;
  isOwnProfile: boolean;
  localGuestData: any;
  isPlayingLive: boolean;
  isPubliclyLive: boolean;
  streamSource: string;
  isPreviewExpired: boolean;
  liveEmbedUrl: string;
  hasPaidForLive: boolean;
  livePrice: string | number;
  previewTimeLeft: number;
  presenterMode: boolean;
  activeGuests: any[];
  totalSlots: number;
  showHost: boolean;
  cameraStatus: string;
  videoRef: any;
  profile: any;
  visibleGuests: any[];

  homepageImageUrl: string;
  channelRef: any;
  setShowExitScreen: (b: boolean) => void;
  viewMode: string;
  creatorId: string;
  user: any;
  guests: any[];
  subPrice: string | number;
  setLivePrice: (p: string) => void;
  setStreamSource: (s: string) => void;
  setLiveEmbedUrl: (u: string) => void;
  setIsPlayingLive: (b: boolean) => void;
  setIsPubliclyLive: (b: boolean) => void;
  setPresenterMode: (b: boolean) => void;
  setGuests: (g: any[]) => void;
  setLocalGuestData: (d: any) => void;
  handleStripeCheckout: (title: string, amount: number) => void;
  handleUnlockLive: () => void;
  handleSubscribe: () => void;
  startLiveStream: () => void;
  setShowTipModal: (b: boolean) => void;
  localStream?: MediaStream | null;
  liveCountdown?: number | null;
}

export const ProfileLive: React.FC<ProfileLiveProps> = ({
  isSubscribed, isOwnProfile, localGuestData, isPlayingLive, isPubliclyLive,
  streamSource, isPreviewExpired, liveEmbedUrl, hasPaidForLive, livePrice,
  previewTimeLeft, presenterMode, activeGuests, totalSlots, showHost,
  cameraStatus, videoRef, profile, visibleGuests,
  homepageImageUrl, channelRef, setShowExitScreen, viewMode, creatorId,
  user, guests, subPrice, setLivePrice, setStreamSource, setLiveEmbedUrl,
  setIsPlayingLive, setIsPubliclyLive, setPresenterMode, setGuests,
  setLocalGuestData, handleStripeCheckout, handleUnlockLive, handleSubscribe,
  startLiveStream, setShowTipModal, localStream, liveCountdown
}) => {
  const toast = useToast();
  const viewerVideoRef = React.useRef<HTMLVideoElement>(null);
  const [isRemoteConnected, setIsRemoteConnected] = React.useState(false);

  React.useEffect(() => {
    if (isOwnProfile && localStream && videoRef.current) {
      console.log("WebRTC: Attaching localStream to host video element.");
      videoRef.current.srcObject = localStream;
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.warn("Local video play warning:", e));
    }
  }, [isOwnProfile, localStream, videoRef, cameraStatus, isPlayingLive]);

  const [connectionStatus, setConnectionStatus] = React.useState<'idle' | 'connecting' | 'connected' | 'reconnecting'>('idle');

  const VIEWER_ICE_SERVERS: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
    { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' },
    { urls: 'turn:openrelay.metered.ca:443?transport=tcp', username: 'openrelayproject', credential: 'openrelayproject' },
  ];
  const VIEWER_DEBUG = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true') ? 3 : 0;

  React.useEffect(() => {
    if (isOwnProfile || !isPlayingLive || streamSource !== 'camera') return;
    // Strictly block connection requests if the user is unauthorized
    if (!isSubscribed && !hasPaidForLive && !localGuestData) return;

    let peer: Peer | null = null;
    let call: any = null;
    let retryTimeout: NodeJS.Timeout;
    let retryCount = 0;
    const MAX_RETRIES = 5;

    const connectToHost = () => {
      try {
        setConnectionStatus(retryCount > 0 ? 'reconnecting' : 'connecting');
        peer = new Peer({
          debug: VIEWER_DEBUG,
          secure: true,
          config: { iceServers: VIEWER_ICE_SERVERS },
        });
        peer.on('open', () => {
          const hostId = `vibe-host-${profile?.id}`;
          console.log("WebRTC: Connecting to host live stream:", hostId);
          
          // Connect to the host with authorization handshake metadata
          call = peer!.call(hostId, new MediaStream(), {
            metadata: {
              viewerId: user?.id || localGuestData?.id || 'guest',
              viewerName: user?.email || user?.username || localGuestData?.name || 'Anonymous Viewer',
              authType: localGuestData ? 'guest' : hasPaidForLive ? 'ppv' : isSubscribed ? 'subscription' : 'none'
            }
          });
          
          call.on('stream', (remoteStream: MediaStream) => {
            console.log("WebRTC: Received live camera feed from host!");
            setIsRemoteConnected(true);
            setConnectionStatus('connected');
            retryCount = 0;
            if (viewerVideoRef.current) {
              viewerVideoRef.current.srcObject = remoteStream;
              viewerVideoRef.current.play().catch(e => console.warn("Video play error:", e));
            }
          });

          call.on('error', (err: any) => {
            console.error("WebRTC call error, retrying...", err);
            setIsRemoteConnected(false);
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              setConnectionStatus('reconnecting');
              retryTimeout = setTimeout(connectToHost, 3000 + retryCount * 2000);
            } else {
              setConnectionStatus('idle');
            }
          });
        });

        peer.on('error', (err: any) => {
          console.warn("Peer connection error, retrying...", err);
          setIsRemoteConnected(false);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setConnectionStatus('reconnecting');
            retryTimeout = setTimeout(connectToHost, 3000 + retryCount * 2000);
          } else {
            setConnectionStatus('idle');
          }
        });
      } catch (e) {
        console.error("PeerJS initialization failed:", e);
        setConnectionStatus('idle');
      }
    };

    connectToHost();

    return () => {
      setIsRemoteConnected(false);
      setConnectionStatus('idle');
      if (retryTimeout) clearTimeout(retryTimeout);
      if (call) call.close();
      if (peer) peer.destroy();
    };
  }, [isOwnProfile, isPlayingLive, streamSource, creatorId, profile?.id, isSubscribed, hasPaidForLive, localGuestData, user?.id]);

  return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <style>{`
              .live-stream-container {
                display: flex;
                flex-direction: row;
                width: 100%;
                background: var(--bg-color);
                position: relative;
              }
              .live-video-slot {
                flex: 1;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                aspect-ratio: 16/9;
              }
              .live-chat-slot {
                width: 380px;
                flex-shrink: 0;
                border-left: 1px solid rgba(255,255,255,0.05);
                display: flex;
                flex-direction: column;
              }
              @media (max-width: 1024px) {
                .live-stream-container {
                  flex-direction: column;
                }
                .live-chat-slot {
                  width: 100%;
                  border-left: none;
                  border-top: 1px solid rgba(255,255,255,0.05);
                  height: 450px;
                }
              }
            `}</style>
            {isSubscribed || isOwnProfile || localGuestData !== null ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-surface)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="live-stream-container">
                   <div className="live-video-slot">
                  {liveCountdown !== null && liveCountdown !== undefined && (
                     <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 40 }}>
                        <motion.div 
                           key={liveCountdown}
                           initial={{ scale: 0.3, opacity: 0 }}
                           animate={{ scale: 1.2, opacity: 1 }}
                           exit={{ scale: 2, opacity: 0 }}
                           transition={{ duration: 0.8, ease: 'easeOut' }}
                           style={{ 
                              fontSize: '120px', 
                              fontWeight: '900', 
                              background: 'linear-gradient(135deg, #ff0055, #00ff88)', 
                              WebkitBackgroundClip: 'text', 
                              WebkitTextFillColor: 'transparent',
                              textShadow: '0 0 40px rgba(0,255,136,0.3)',
                              fontFamily: 'system-ui, sans-serif'
                           }}
                        >
                           {liveCountdown}
                        </motion.div>
                        <p style={{ margin: '20px 0 0 0', color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px' }}>
                           Preparing Broadcast...
                        </p>
                     </div>
                  )}
                  {isPlayingLive && (
                     <>
                        {isPubliclyLive ? (
                           <div style={{ position: 'absolute', top: 20, left: 20, background: '#ff0055', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(255,0,85,0.4)' }}>
                             <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }}/> LIVE
                           </div>
                        ) : (
                           <div style={{ position: 'absolute', top: 20, left: 20, background: '#0055ff', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(0,85,255,0.4)' }}>
                             <Settings size={18} /> STUDIO PREVIEW
                           </div>
                        )}
                     </>
                   )}
                  
                  <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', gap: '10px' }}>
                    {!localGuestData && (
                       <button onClick={() => setShowTipModal(true)} style={{ padding: '8px 16px', background: 'linear-gradient(45deg, #00ff88, #00bbff)', color: '#000', border: 'none', borderRadius: '20px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,255,136,0.3)', textTransform: 'uppercase', fontSize: '13px', letterSpacing: '1px' }}>
                          💰 Support Stream
                       </button>
                    )}
                  </div>
                  
                  {isPlayingLive ? (
                     <>
                       {streamSource === 'url' && !isPreviewExpired && (
                          liveEmbedUrl ? (
                            <iframe 
                              src={liveEmbedUrl} 
                              title="Live Stream Broadcast"
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                              referrerPolicy="strict-origin-when-cross-origin" 
                              allowFullScreen
                              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 5 }}
                            />
                          ) : (
                            <video
                              src="/videos/tiesto.mp4"
                              autoPlay
                              loop
                              muted
                              playsInline
                              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 5 }}
                            />
                          )
                        )}
                        {streamSource === 'obs' && !isPreviewExpired && (
                          profile?.mux_playback_id ? (
                            <iframe 
                              src={`https://stream.mux.com/${profile.mux_playback_id}/embed?autoplay=true&muted=false`} 
                              title="Live Stream Broadcast"
                              frameBorder="0" 
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                              allowFullScreen
                              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, border: 'none', zIndex: 5 }}
                            />
                          ) : (
                            <video
                              src="/videos/tiesto.mp4"
                              autoPlay
                              loop
                              muted
                              playsInline
                              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 5 }}
                            />
                          )
                        )}
                       {!isOwnProfile && isPlayingLive && !isSubscribed && !hasPaidForLive ? (
                         isPreviewExpired ? (
                           <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', padding: '40px', textAlign: 'center' }}>
                             <Lock size={48} color="#ff4d85" style={{ marginBottom: '16px' }} />
                             <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', color: 'var(--text-primary)' }}>Preview Ended</h2>
                             <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '400px', marginBottom: '24px', lineHeight: 1.5 }}>
                               Your free 90-second preview has expired. Subscribe to {profile?.username} for full access, or purchase a one-time pass to continue watching.
                             </p>
                             <div style={{ display: 'flex', gap: '16px' }}>
                               <button onClick={handleUnlockLive} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #0055ff, #00ff88)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,85,255,0.3)' }}>
                                 Unlock for ${livePrice}
                               </button>
                               <button onClick={handleSubscribe} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                                 Subscribe Now
                               </button>
                             </div>
                           </div>
                         ) : (
                           <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 30, background: 'rgba(255,0,85,0.8)', padding: '6px 12px', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                             FREE PREVIEW: {Math.floor(previewTimeLeft / 60)}:{(previewTimeLeft % 60).toString().padStart(2, '0')} REMAINING
                           </div>
                         )
                       ) : null}
                       {/* Host AND Guest PIP/Grid Layer */}
                       {!isPreviewExpired && (streamSource === 'camera' || presenterMode || activeGuests.length > 0) && (
                         <div style={{
                           position: 'absolute', zIndex: 15,
                           ...(streamSource === 'url' ? {
                              bottom: 20, left: 20, right: 20, display: 'flex', gap: '10px', justifyContent: 'flex-start', alignItems: 'flex-end', pointerEvents: 'none'
                           } : {
                             inset: 0, background: 'var(--bg-color)', display: 'grid', gap: '2px',
                             gridTemplateColumns: (totalSlots === 1) ? '1fr' : (totalSlots <= 4) ? '1fr 1fr' : '1fr 1fr 1fr',
                             gridTemplateRows: (totalSlots <= 2) ? '1fr' : '1fr 1fr'
                           })
                         }}>
                           {/* Main Host Webcam Slot */}
                           {showHost && (
                             <div style={{ position: 'relative', background: 'var(--bg-surface)', flexShrink: 0, pointerEvents: 'auto', ...(streamSource === 'url' ? { width: 'min(20%, 200px)', aspectRatio: '16/9', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' } : { width: '100%', height: '100%' }) }}>
                               
                               {cameraStatus === 'loading' && (
                                 <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', zIndex: 5 }}>
                                    <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#00ff88', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 15 }} />
                                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>INITIALIZING HARDWARE...</p>
                                    <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>Please allow access to your camera and microphone</p>
                                 </div>
                               )}
                               {cameraStatus === 'error' && (
                                 <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)', zIndex: 5 }}>
                                    <div style={{ padding: '15px', borderRadius: '50%', background: 'rgba(255,0,85,0.1)', color: '#ff0055', marginBottom: 15 }}>
                                       <Video size={30} />
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>CAMERA ACCESS DENIED</p>
                                    <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)', fontSize: '12px', maxWidth: '300px', textAlign: 'center' }}>Check your browser settings to ensure the platform has hardware permissions.</p>
                                    <button onClick={() => setIsPlayingLive(false)} style={{ marginTop: '15px', padding: '8px 20px', background: 'transparent', border: '1px solid var(--bg-surface-hover)', color: 'var(--text-primary)', borderRadius: '20px', cursor: 'pointer' }}>Close Mode</button>
                                 </div>
                               )}


                                {!isOwnProfile ? (
                                  streamSource === 'camera' ? (
                                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                      {/* WebRTC Host Camera Stream */}
                                      <video
                                        ref={viewerVideoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        controls
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', border: 'none', display: isRemoteConnected ? 'block' : 'none' }}
                                      />
                                      {/* Connection Status Overlay */}
                                      {!isRemoteConnected && (connectionStatus === 'connecting' || connectionStatus === 'reconnecting') && (
                                        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.7)', padding: '6px 14px', borderRadius: '20px', backdropFilter: 'blur(10px)', zIndex: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
                                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: connectionStatus === 'reconnecting' ? '#ff9900' : '#00ff88', animation: 'pulse 1.5s ease-in-out infinite' }} />
                                          <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                            {connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Connecting...'}
                                          </span>
                                        </div>
                                      )}
                                      {/* Direct Fallback Loop while connecting/blocked */}
                                      {!isRemoteConnected && (
                                        <video
                                          src="/videos/tiesto.mp4"
                                          autoPlay
                                          loop
                                          muted
                                          playsInline
                                          style={{ width: '100%', height: '100%', objectFit: 'cover', border: 'none' }}
                                        />
                                      )}
                                    </div>
                                  ) : (
                                    <video
                                      src="/videos/tiesto.mp4"
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                      style={{ width: '100%', height: '100%', objectFit: 'cover', border: 'none' }}
                                    />
                                  )
                                ) : (
                                  <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: cameraStatus === 'active' ? 1 : 0, transition: 'opacity 0.3s' }} 
                                  />
                                )}
                               <div style={{ position: 'absolute', bottom: streamSource==='url'?4:10, right: streamSource==='url'?4:10, background: 'rgba(0,0,0,0.7)', padding: streamSource==='url'?'4px 8px':'6px 12px', borderRadius: '8px', textAlign: 'right', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                 <div style={{ fontWeight: 'bold', fontSize: streamSource==='url'?'11px':'14px', color: 'var(--text-primary)' }}>{localGuestData ? localGuestData.name : profile?.username || 'Host'}</div>
                                 <div style={{ fontSize: streamSource==='url'?'9px':'11px', color: '#00ff88', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{localGuestData ? localGuestData.title : (profile?.industry || 'Live Streamer')}</div>
                               </div>
                             </div>
                           )}
                           
                           {/* Simulated Guests Webcams Slot */}
                           {visibleGuests.map((g, i) => (
                             <div key={i} style={{ position: 'relative', background: 'var(--bg-surface-hover)', flexShrink: 0, pointerEvents: 'auto', ...(streamSource === 'url' ? { width: 'min(20%, 200px)', aspectRatio: '16/9', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' } : { width: '100%', height: '100%' }) }}>
                               <img loading="lazy" src={`https://images.unsplash.com/photo-${1550000000000 + (i * 1000)}?auto=format&fit=crop&w=800&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.5)' }} alt="Guest Feed" />
                               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <span style={{ background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: '20px', fontSize: '10px' }}>Guest Feed</span>
                               </div>
                               <div style={{ position: 'absolute', bottom: streamSource==='url'?4:10, right: streamSource==='url'?4:10, background: 'rgba(0,0,0,0.7)', padding: streamSource==='url'?'4px 8px':'6px 12px', borderRadius: '8px', textAlign: 'right', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                 <div style={{ fontWeight: 'bold', fontSize: streamSource==='url'?'11px':'14px', color: 'var(--text-primary)' }}>{g.name}</div>
                                 <div style={{ fontSize: streamSource==='url'?'9px':'11px', color: '#00ff88', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{g.title}</div>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}


                     </>
                  ) : (
                    <>
                      {homepageImageUrl && <img src={homepageImageUrl} alt="Live Stream Thumbnail" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, filter: 'blur(2px)' }} />}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <button onClick={() => setIsPlayingLive(true)} style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,77,133,0.9)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(255,77,133,0.5)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
                 <div className="live-chat-slot">
                    <React.Suspense fallback={<div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading chat...</div>}>
                      <LiveChat streamId={profile?.username || 'profile'} />
                    </React.Suspense>
                 </div>
              </div>
              {localGuestData && (
                <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button onClick={() => {
                      if (typeof window !== 'undefined') {
                        const current = JSON.parse(localStorage.getItem('vibe_host_guests_session') || '[]');
                        const updated = current.filter((g: {id: string}) => g.id !== localGuestData.id);
                        localStorage.setItem('vibe_host_guests_session', JSON.stringify(updated));
                        window.dispatchEvent(new Event('vibe_guests_updated'));
                      }

                      if (channelRef.current) {
                         channelRef.current.send({ type: 'broadcast', event: 'guest_interaction', payload: { action: 'left', guestParam: { id: localGuestData.id } } });
                      }
                      setLocalGuestData(null);
                      setIsPlayingLive(false);
                      setShowExitScreen(true);
                  }} style={{ width: '100%', padding: '16px 24px', background: 'rgba(229,9,20,0.9)', color: 'var(--text-primary)', border: 'none', borderRadius: '16px', fontWeight: '900', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '15px', letterSpacing: '2px', boxShadow: '0 4px 20px rgba(229,9,20,0.3)' }}>
                      🛑 Disconnect & Leave Stream
                  </button>
                </div>
              )}
              <div style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>VIP Backstage Broadcast</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                    {isOwnProfile ? 'Configure your live stream settings below.' : 
                     isSubscribed ? 'Live stream is free since you are subscribed!' : 
                     'Streaming live now. Subscribe for free access, or unlock this broadcast below.'}
                  </p>
                  
                  {isOwnProfile && viewMode === 'edit' && (
                    <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', background: 'rgba(0,0,0,0.4)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          Pay-Per-View Price: $
                        </label>
                        <input type="number" value={livePrice} onChange={e => setLivePrice(e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', width: '80px', fontSize: '15px' }} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>(Free for subscribers)</span>
                      </div>
                      
                      <label style={{ display: 'block', marginBottom: '12px', color: '#ff4d85', fontWeight: 'bold', fontSize: '15px' }}>Configure Live Stream Origin</label>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                         <button onClick={() => { setStreamSource('camera'); setIsPlayingLive(false); }} style={{ padding: '10px 20px', background: streamSource === 'camera' ? '#0055ff' : 'rgba(255,255,255,0.05)', color: streamSource === 'camera' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={16}/> Direct Webcam</button>
                         <button onClick={() => { setStreamSource('obs'); setIsPlayingLive(false); }} style={{ padding: '10px 20px', background: streamSource === 'obs' ? '#0055ff' : 'rgba(255,255,255,0.05)', color: streamSource === 'obs' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🎙️ OBS / Streamlabs</button>
                         <button onClick={() => { setStreamSource('url'); setIsPlayingLive(false); }} style={{ padding: '10px 20px', background: streamSource === 'url' ? '#0055ff' : 'rgba(255,255,255,0.05)', color: streamSource === 'url' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>External URL / RTMP</button>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {streamSource === 'url' && (
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <input type="text" value={liveEmbedUrl} onChange={e => setLiveEmbedUrl(e.target.value)} placeholder="Direct Stream URL (e.g. RTMP, HLS, .m3u8, .mp4)" style={{ flex: 1, padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none' }}/>
                            {isPlayingLive ? (
                              <button onClick={() => setIsPlayingLive(false)} style={{ padding: '14px 24px', background: 'rgba(229, 9, 20, 0.1)', color: '#e50914', border: '1px solid #e50914', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>Stop Streaming</button>
                            ) : (
                              <button onClick={startLiveStream} style={{ padding: '14px 24px', background: '#e50914', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={18}/> Start Streaming</button>
                            )}
                          </div>
                        )}
                        {streamSource === 'obs' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>RTMP Server Ingest URL</label>
                              <div style={{ display: 'flex', gap: '12px' }}>
                                <input type="text" readOnly value="rtmps://global-live.mux.com:443/app" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}/>
                                <button type="button" onClick={() => { navigator.clipboard.writeText("rtmps://global-live.mux.com:443/app"); toast.success("RTMP Server URL copied!"); }} style={{ padding: '12px 20px', background: '#0055ff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Copy</button>
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Secret Stream Key</label>
                              <div style={{ display: 'flex', gap: '12px' }}>
                                <input type="password" readOnly value={profile?.mux_stream_key || "vibe_stream_key_placeholder"} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}/>
                                <button type="button" onClick={() => { navigator.clipboard.writeText(profile?.mux_stream_key || "vibe_stream_key_placeholder"); toast.success("Stream key copied!"); }} style={{ padding: '12px 20px', background: '#0055ff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Copy Key</button>
                              </div>
                            </div>
                            <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.5 }}>
                              💡 <strong>Broadcasting Instructions:</strong> Open your encoding software (e.g. OBS Studio, Streamlabs). Navigate to Settings → Stream, select <strong>Custom Service</strong>, paste the Server Ingest URL and Secret Stream Key above, and hit <strong>"Start Streaming"</strong>!
                            </p>
                          </div>
                        )}
                        
                        {streamSource === 'camera' && (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                             <p style={{ margin: 0, color: 'var(--text-secondary)', flex: 1, minWidth: '200px' }}>Using your local hardware as the broadcast origin server. Press "Start Streaming" to ignite the feed.</p>
                             {isPlayingLive ? (
                               <button onClick={() => { setIsPlayingLive(false); }} style={{ padding: '14px 24px', background: 'rgba(229, 9, 20, 0.1)', color: '#e50914', border: '1px solid #e50914', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  Stop Streaming
                               </button>
                             ) : (
                               <button onClick={startLiveStream} style={{ padding: '14px 24px', background: '#e50914', color: 'var(--text-primary)', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={18}/> Start Streaming</button>
                             )}
                          </div>
                        )}

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                               <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '14px' }}>WebRTC Overlays & Guests</p>
                               <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '12px' }}>Enable your webcam and invite up to 4 guests {streamSource === 'url' ? 'over your broadcast frame' : 'to join the primary grid'}.</p>
                            </div>
                            {isPlayingLive && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {streamSource === 'url' && (
                                  <button onClick={() => setPresenterMode(!presenterMode)} style={{ padding: '8px 14px', background: presenterMode ? '#ff0055' : 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                                    {presenterMode ? 'Stop Presenting' : 'Show My Webcam'}
                                  </button>
                                )}
                                <button onClick={() => {
                                  const profileIdPath = creatorId || profile?.id || user?.id || 'public';
                                  const guestUrl = `${window.location.origin}/profile/${profileIdPath}?guest_invite=true`;
                                  navigator.clipboard.writeText(guestUrl).catch(()=>console.log('Clipboard skipped'));
                                  toast.success('Guest Invite Link copied: ' + guestUrl);
                                }} style={{ padding: '8px 14px', background: '#0055ff', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                                  🔗 Copy Guest Link
                                </button>

                              </div>

                              {guests.length > 0 && (
                                <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px' }}>
                                   {guests.map((g, i) => (
                                     <div key={g.id || i} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                                       <div>
                                         <div style={{color: 'var(--text-primary)', fontSize: '13px'}}>{g.name} <span style={{color: '#00ff88', fontSize: '10px'}}>{g.title}</span></div>
                                       </div>
                                       <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                         <button onClick={() => {
                                            const newG = [...guests];
                                            newG[i].isLive = !newG[i].isLive;
                                            setGuests(newG);
                                            localStorage.setItem('vibe_host_guests_session', JSON.stringify(newG));
                                            window.dispatchEvent(new Event('vibe_guests_updated'));
                                         }} style={{ padding: '4px 10px', background: g.isLive ? '#ff0055' : '#0055ff', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '11px', border: 'none', cursor: 'pointer' }}>
                                           {g.isLive ? 'Remove from Stream' : 'Allow in Stream'}
                                         </button>
                                         <button onClick={() => {
                                            const newG = guests.filter((_, idx) => idx !== i);
                                            setGuests(newG);
                                            localStorage.setItem('vibe_host_guests_session', JSON.stringify(newG));
                                            window.dispatchEvent(new Event('vibe_guests_updated'));
                                         }} style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #888', color: 'var(--text-muted)', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Disconnect</button>
                                       </div>
                                     </div>
                                   ))}
                                </div>
                              )}
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                      
                      <p style={{ margin: '15px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>This feed dictates what your active subscribers consume during live events in real-time.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'linear-gradient(135deg, rgba(255,0,85,0.1), rgba(138,43,226,0.1))', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', textAlign: 'center', padding: '80px 20px', position: 'relative' }}>
                <Lock size={56} color="#FFD700" style={{ marginBottom: '24px' }} />
                <h3 style={{ fontSize: '28px', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Exclusive Live Broadcast</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '450px', margin: '0 auto 40px', lineHeight: 1.5 }}>Subscribe to {profile.username || 'this creator'} to instantly unlock their live streams and premium restricted vault content.</p>
                <button 
                  onClick={handleSubscribe} 
                  style={{ padding: '16px 40px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: 'var(--text-primary)', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,77,133,0.3)', transition: 'transform 0.2s' }} 
                  onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} 
                  onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                >
                  Subscribe for ${subPrice}/mo
                </button>
              </motion.div>
            )}
          </div>
  );
};
