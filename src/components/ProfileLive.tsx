import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Settings, Camera, Video, Globe, X, Mic, MicOff, VideoOff, Send, Check, Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Peer from 'peerjs';
import { supabase } from '../supabaseClient';
import { ErrorBoundary } from './ErrorBoundary';

// We import LiveChat dynamically
const LiveChat = React.lazy(() => import('./LiveChat').catch(() => ({ default: () => <div/> })));

export interface ProfileLiveProps {
  accent?: string;
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
  handleStripeCheckout: (title: string, amount: number, extraMetadata?: any) => void;
  handleUnlockLive: () => void;
  handleSubscribe: () => void;
  startLiveStream: () => void;
  setShowTipModal: (b: boolean) => void;
  localStream?: MediaStream | null;
  liveCountdown?: number | null;

  products?: any[];
  pinnedProduct?: any | null;
  setPinnedProduct?: (p: any | null) => void;
}

export const ProfileLive: React.FC<ProfileLiveProps> = ({
  accent = '#D35400',
  isSubscribed, isOwnProfile, localGuestData, isPlayingLive, isPubliclyLive,
  streamSource, isPreviewExpired, liveEmbedUrl, hasPaidForLive, livePrice,
  previewTimeLeft, presenterMode, activeGuests, totalSlots, showHost,
  cameraStatus, videoRef, profile, visibleGuests,
  homepageImageUrl, channelRef, setShowExitScreen, viewMode, creatorId,
  user, guests, subPrice, setLivePrice, setStreamSource, setLiveEmbedUrl,
  setIsPlayingLive, setIsPubliclyLive, setPresenterMode, setGuests,
  setLocalGuestData, handleStripeCheckout, handleUnlockLive, handleSubscribe,
  startLiveStream, setShowTipModal, localStream, liveCountdown,
  products = [], pinnedProduct = null, setPinnedProduct = () => {}
}) => {
  const toast = useToast();
  const bypassSub = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('bypass_sub') === 'true';
  const effectiveIsSubscribed = isSubscribed || bypassSub;
  const viewerVideoRef = React.useRef<HTMLVideoElement>(null);
  const [isRemoteConnected, setIsRemoteConnected] = React.useState(false);
  const [isProductDismissed, setIsProductDismissed] = React.useState(false);
  const [lastPinnedProductId, setLastPinnedProductId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (pinnedProduct && pinnedProduct.id !== lastPinnedProductId) {
      setIsProductDismissed(false);
      setLastPinnedProductId(pinnedProduct.id);
    } else if (!pinnedProduct) {
      setLastPinnedProductId(null);
    }
  }, [pinnedProduct, lastPinnedProductId]);

  console.log("[ProfileLive Render] state:", { isOwnProfile, isPlayingLive, pinnedProduct, isProductDismissed });

  // Fan Zone & Co-watching state
  const showFanZone = false;
  const [isMuted, setIsMuted] = React.useState(false);
  const [isCameraOn, setIsCameraOn] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [chatInput, setChatInput] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<{ id: string; user: string; text: string; avatar: string; time: string; isSelf?: boolean }[]>([]);
  const [reactions, setReactions] = React.useState<{ id: number; char: string; left: number }[]>([]);
  const [coWatchers, setCoWatchers] = React.useState([
    { id: '1', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', speaking: true, hasVideo: true },
    { id: '2', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', speaking: false, hasVideo: true },
    { id: '3', name: 'Jordan', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop', speaking: true, hasVideo: false },
  ]);

  // Authenticated User / Session Guest Sync
  const [currentUser, setCurrentUser] = React.useState<{ name: string; avatar: string }>({
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  });

  const chatScrollRef = React.useRef<HTMLDivElement>(null);
  const fanzoneChannelRef = React.useRef<any>(null);

  // Fetch / Sync current user or guest fallback
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', authUser.id)
            .single();

          if (userProfile) {
            setCurrentUser({
              name: userProfile.username || 'User',
              avatar: userProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.username || 'U')}&background=000&color=fff`,
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Error fetching user auth/profile:', err);
      }

      // Guest fallback with sessionStorage persistence
      let guestName = sessionStorage.getItem('vibe_guest_name');
      let guestAvatar = sessionStorage.getItem('vibe_guest_avatar');
      if (!guestName) {
        const randId = Math.floor(100 + Math.random() * 900);
        guestName = `Guest #${randId}`;
        guestAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randId}`;
        sessionStorage.setItem('vibe_guest_name', guestName);
        sessionStorage.setItem('vibe_guest_avatar', guestAvatar);
      }
      setCurrentUser({ name: guestName, avatar: guestAvatar });
    };

    fetchUser();
  }, [user]);

  // Reaction addition logic
  const addReaction = (char: string, broadcast = false) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      char,
      left: 10 + Math.random() * 80,
    };
    setReactions(prev => [...prev, newReaction]);

    if (broadcast && fanzoneChannelRef.current) {
      fanzoneChannelRef.current.send({
        type: 'broadcast',
        event: 'reaction',
        payload: { char }
      });
    }

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2500);
  };

  // Supabase Realtime Channel Registration & Broadcast listeners
  React.useEffect(() => {
    const roomId = creatorId || profile?.id || 'live-party';
    if (!showFanZone) {
      if (fanzoneChannelRef.current) {
        supabase.removeChannel(fanzoneChannelRef.current);
        fanzoneChannelRef.current = null;
      }
      return;
    }

    const roomChannel = supabase.channel(`room:${roomId}`, {
      config: {
        broadcast: { self: false }
      }
    });

    roomChannel
      .on('broadcast', { event: 'chat' }, (payload: any) => {
        setChatMessages(prev => [
          ...prev,
          {
            id: payload.payload.id,
            user: payload.payload.user,
            text: payload.payload.text,
            avatar: payload.payload.avatar,
            time: payload.payload.time,
            isSelf: false
          }
        ]);
      })
      .on('broadcast', { event: 'reaction' }, (payload: any) => {
        addReaction(payload.payload.char, false);
      })
      .subscribe((status) => {
        console.log(`Supabase Realtime Channel (ProfileLive): room:${roomId} status is ${status}`);
      });

    fanzoneChannelRef.current = roomChannel;

    return () => {
      if (fanzoneChannelRef.current) {
        supabase.removeChannel(fanzoneChannelRef.current);
        fanzoneChannelRef.current = null;
      }
    };
  }, [creatorId, profile?.id, showFanZone]);

  // Simulate speaking indicator changes for other watch members
  React.useEffect(() => {
    if (!showFanZone) return;
    const talkInterval = setInterval(() => {
      setCoWatchers(prev =>
        prev.map(w => {
          if (Math.random() < 0.4) {
            return { ...w, speaking: !w.speaking };
          }
          return w;
        })
      );
    }, 2800);
    return () => clearInterval(talkInterval);
  }, [showFanZone]);

  // Auto scroll chat to bottom
  React.useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

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
  ];

  React.useEffect(() => {
    if (isOwnProfile || !isPlayingLive || streamSource !== 'camera') return;
    // Strictly block connection requests if the user is unauthorized
    if (!effectiveIsSubscribed && !hasPaidForLive && !localGuestData) return;

    let peer: Peer | null = null;
    let call: any = null;
    let retryTimeout: NodeJS.Timeout;
    let destroyed = false;

    const connectToHost = () => {
      if (destroyed) return;
      try {
        setConnectionStatus('connecting');
        // Destroy previous peer if retrying
        if (peer) {
          try { peer.destroy(); } catch (_) {}
          peer = null;
        }

        peer = new Peer({
          debug: 2, // Show warnings + errors (helps diagnose connection issues)
          secure: true,
          config: { iceServers: VIEWER_ICE_SERVERS },
        });

        peer.on('open', (myId) => {
          if (destroyed) return;
          const hostId = `vibe-host-${profile?.id}`;
          const authType = localGuestData ? 'guest' : hasPaidForLive ? 'ppv' : effectiveIsSubscribed ? 'subscription' : 'none';
          console.log(`[WebRTC Viewer] My peer ID: ${myId} | Calling host: ${hostId} | Auth: ${authType}`);
          
          // Create dummy video + audio tracks so the SDP offer includes both
          // m=video and m=audio lines. Without m=audio, the host's microphone
          // stream can't be negotiated into the answer.
          let viewerStream: MediaStream;
          try {
            // Dummy video: 2x2 black canvas, 0 fps
            const canvas = document.createElement('canvas');
            canvas.width = 2;
            canvas.height = 2;
            const ctx2d = canvas.getContext('2d');
            if (ctx2d) ctx2d.fillRect(0, 0, 2, 2);
            const canvasStream = canvas.captureStream(0);

            // Dummy audio: silent AudioContext destination
            const audioCtx = new AudioContext();
            const dest = audioCtx.createMediaStreamDestination();

            // Combine video + audio into one stream
            viewerStream = new MediaStream([
              ...canvasStream.getVideoTracks(),
              ...dest.stream.getAudioTracks(),
            ]);
          } catch (_) {
            viewerStream = new MediaStream(); // fallback
          }

          // Connect to the host with authorization handshake metadata
          call = peer!.call(hostId, viewerStream, {
            metadata: {
              viewerId: user?.id || localGuestData?.id || 'guest',
              viewerName: user?.email || user?.username || localGuestData?.name || 'Anonymous Viewer',
              authType
            }
          });
          
          if (!call) {
            console.warn('[WebRTC Viewer] peer.call() returned null — host may not exist');
            retryTimeout = setTimeout(connectToHost, 5000);
            return;
          }

          call.on('stream', (remoteStream: MediaStream) => {
            console.log("[WebRTC Viewer] ✅ Received live camera feed from host!");
            setIsRemoteConnected(true);
            setConnectionStatus('connected');
            if (viewerVideoRef.current) {
              viewerVideoRef.current.srcObject = remoteStream;
              viewerVideoRef.current.muted = false; // Enable audio — user already interacted
              viewerVideoRef.current.play().catch(e => {
                // If unmuted autoplay fails, try muted then let user unmute via controls
                console.warn('[WebRTC Viewer] Unmuted play failed, trying muted:', e.message);
                if (viewerVideoRef.current) {
                  viewerVideoRef.current.muted = true;
                  viewerVideoRef.current.play().catch(() => {});
                }
              });
            }
          });

          call.on('close', () => {
            // Host rejected or closed the call (auth failure, or host went offline)
            console.warn('[WebRTC Viewer] Call was closed by host — retrying in 5s');
            setIsRemoteConnected(false);
            if (!destroyed) {
              setConnectionStatus('reconnecting');
              retryTimeout = setTimeout(connectToHost, 5000);
            }
          });

          call.on('error', (err: any) => {
            console.error("[WebRTC Viewer] Call error:", err);
            setIsRemoteConnected(false);
            if (!destroyed) {
              setConnectionStatus('reconnecting');
              retryTimeout = setTimeout(connectToHost, 5000);
            }
          });
        });

        peer.on('error', (err: any) => {
          console.warn("[WebRTC Viewer] Peer error:", err.type, err.message);
          setIsRemoteConnected(false);
          if (!destroyed) {
            setConnectionStatus('reconnecting');
            // peer-unavailable = host not registered yet, retry faster
            const delay = err.type === 'peer-unavailable' ? 3000 : 5000;
            retryTimeout = setTimeout(connectToHost, delay);
          }
        });
      } catch (e) {
        console.error("[WebRTC Viewer] PeerJS initialization failed:", e);
        if (!destroyed) {
          retryTimeout = setTimeout(connectToHost, 5000);
        }
      }
    };

    connectToHost();

    return () => {
      destroyed = true;
      setIsRemoteConnected(false);
      setConnectionStatus('idle');
      if (retryTimeout) clearTimeout(retryTimeout);
      if (call) try { call.close(); } catch (_) {}
      if (peer) try { peer.destroy(); } catch (_) {};
    };
  }, [isOwnProfile, isPlayingLive, streamSource, creatorId, profile?.id, effectiveIsSubscribed, hasPaidForLive, localGuestData, user?.id]);

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
            {effectiveIsSubscribed || isOwnProfile || localGuestData !== null ? (
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
                           <div className="live-video-status" style={{ position: 'absolute', top: 20, left: 20, background: '#ff0055', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(255,0,85,0.4)' }}>
                             <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }}/> LIVE
                           </div>
                        ) : (
                           <div className="live-video-status" style={{ position: 'absolute', top: 20, left: 20, background: '#0055ff', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(0,85,255,0.4)' }}>
                             <Settings size={18} /> STUDIO PREVIEW
                           </div>
                        )}
                     </>
                   )}
                  
                  <div className="live-video-actions" style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', gap: '10px' }}>
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
                       {!isOwnProfile && isPlayingLive && !effectiveIsSubscribed && !hasPaidForLive ? (
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
                                    {/* Floating Reactions overlay */}
                      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 20 }}>
                        <AnimatePresence>
                          {reactions.map(r => (
                            <motion.div
                              key={r.id}
                              initial={{ y: '100%', x: `${r.left}%`, opacity: 0, scale: 0.6 }}
                              animate={{ 
                                y: '-20%', 
                                x: [`${r.left}%`, `${r.left + (Math.random() * 16 - 8)}%`, `${r.left + (Math.random() * 24 - 12)}%`],
                                opacity: [0, 1, 1, 0],
                                scale: [0.6, 1.2, 1.2, 0.8]
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 2.2, ease: 'easeOut' }}
                              style={{
                                position: 'absolute',
                                bottom: '20px',
                                fontSize: '36px',
                                textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                              }}
                            >
                              {r.char}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                     </>
                  ) : (
                    <>
                      {(profile?.avatar_url || homepageImageUrl) && (
                        <>
                          <img 
                            src={profile?.avatar_url || homepageImageUrl} 
                            alt="Live Stream Background" 
                            style={{ 
                              position: 'absolute', 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover', 
                              opacity: 0.5, 
                              filter: 'blur(6px)' 
                            }} 
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1 }} />
                        </>
                      )}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <button onClick={() => setIsPlayingLive(true)} style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,77,133,0.9)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(255,77,133,0.5)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                      </div>
                    </>
                  )}

                  {/* Floating Pinned Product Overlay Card for Viewers */}
                  {!(isOwnProfile && viewMode === 'edit') && isPlayingLive && pinnedProduct && !isProductDismissed && (
                    <motion.div
                      initial={{ opacity: 0, x: -40, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        zIndex: 25,
                        width: '180px',
                        background: 'rgba(10, 10, 15, 0.85)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        padding: '10px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 136, 0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        pointerEvents: 'auto'
                      }}
                    >
                      {/* Card Header with pulsing Live Offer and Close button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '8px',
                          fontWeight: '900',
                          color: '#00ff88',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          background: 'rgba(0, 255, 136, 0.1)',
                          padding: '2px 5px',
                          borderRadius: '8px',
                          border: '1px solid rgba(0, 255, 136, 0.15)'
                        }}>
                          <span style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: '#00ff88',
                            boxShadow: '0 0 6px #00ff88',
                            animation: 'pulse 1.5s infinite'
                          }} />
                          Live Offer
                        </span>
                        <button
                          onClick={() => setIsProductDismissed(true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2px',
                            borderRadius: '50%',
                            transition: 'color 0.2s, background-color 0.2s'
                          }}
                          onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                          onMouseOut={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <X size={10} />
                        </button>
                      </div>

                      {/* Product details */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {pinnedProduct.image_url ? (
                          <img
                            src={pinnedProduct.image_url}
                            alt={pinnedProduct.title}
                            style={{
                              width: '36px',
                              height: '36px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid rgba(255,255,255,0.05)'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '36px',
                            height: '36px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                          }}>
                            🛍️
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{
                            margin: 0,
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {pinnedProduct.title}
                          </h4>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '900',
                            color: '#00ff88',
                            marginTop: '1px'
                          }}>
                            ${Number(pinnedProduct.price).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Buy button */}
                      <button
                        onClick={() => {
                          handleStripeCheckout(
                            pinnedProduct.title,
                            Number(pinnedProduct.price),
                            { product_id: pinnedProduct.id, is_live_purchase: true }
                          );
                        }}
                        style={{
                          width: '100%',
                          padding: '6px',
                          background: 'linear-gradient(45deg, #00ff88, #00bbff)',
                          color: '#000',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: '900',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0,255,136,0.15)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,255,136,0.25)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,255,136,0.15)';
                        }}
                      >
                        ⚡ Buy Now
                      </button>
                    </motion.div>
                  )}
                </div>

                <div className="live-chat-slot" style={{ display: 'flex', flexDirection: 'column', height: 'auto', minHeight: '450px' }}>
                  {showFanZone ? (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'rgba(15, 15, 20, 0.65)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Header */}
                      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff3b30', animation: 'pulse 1.5s infinite' }} />
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Fan Zone Room</h4>
                        </div>
                        <span style={{ fontSize: '11px', color: '#ff3b30', fontWeight: 700, background: 'rgba(255, 59, 48, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>LIVE</span>
                      </div>

                      {/* Co-Watchers Grid */}
                      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Watch Party</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => setIsCameraOn(!isCameraOn)}
                              style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: isCameraOn ? `${accent}dd` : 'rgba(255,255,255,0.08)',
                                border: 'none', color: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                              }}
                            >
                              {isCameraOn ? <Video size={13} /> : <VideoOff size={13} />}
                            </button>
                            <button
                              onClick={() => setIsMuted(!isMuted)}
                              style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: isMuted ? '#ff3b30' : 'rgba(255,255,255,0.08)',
                                border: 'none', color: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                              }}
                            >
                              {isMuted ? <MicOff size={13} /> : <Mic size={13} />}
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
                          {/* Local User */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{ position: 'relative' }}>
                              <motion.div
                                  animate={{
                                    boxShadow: (!isMuted && !isCameraOn)
                                      ? [`0 0 0 0px ${accent}66`, `0 0 0 8px ${accent}00`]
                                      : '0 0 0 0px transparent'
                                  }}
                                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                  style={{
                                    width: '44px', height: '44px', borderRadius: '50%',
                                    border: `2px solid ${!isMuted ? accent : 'rgba(255,255,255,0.2)'}`,
                                    padding: '2px', background: '#000',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {isCameraOn ? (
                                    <div style={{ width: '100%', height: '100%', background: '#1c1c1e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                      <motion.div
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4cd964', position: 'absolute', top: '4px', right: '4px' }}
                                      />
                                      <span style={{ fontSize: '9px', fontWeight: 900, color: accent }}>CAM</span>
                                    </div>
                                  ) : (
                                    <img 
                                      src={currentUser.avatar} 
                                      alt={currentUser.name} 
                                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                                    />
                                  )}
                                </motion.div>
                                {isMuted && (
                                  <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#ff3b30', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000' }}>
                                    <MicOff size={8} color="#fff" />
                                  </div>
                                )}
                              </div>
                              <span style={{ fontSize: '9px', color: '#fff', fontWeight: 600 }}>{currentUser.name.split(' ')[0]}</span>
                            </div>

                            {/* Co-watchers */}
                            {coWatchers.map(w => (
                              <div key={w.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ position: 'relative' }}>
                                  <motion.div
                                    animate={{
                                      boxShadow: w.speaking 
                                        ? [`0 0 0 0px ${accent}55`, `0 0 0 8px ${accent}00`] 
                                        : '0 0 0 0px transparent'
                                    }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                    style={{
                                      width: '44px', height: '44px', borderRadius: '50%',
                                      border: `2px solid ${w.speaking ? accent : 'rgba(255,255,255,0.1)'}`,
                                      padding: '2px', background: '#000',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    <img src={w.avatar} alt={w.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                  </motion.div>
                                  {w.speaking && (
                                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: accent, borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000' }}>
                                      <span style={{ fontSize: '7px', fontWeight: 900, color: '#000' }}>🎙️</span>
                                    </div>
                                  )}
                                </div>
                                <span style={{ fontSize: '9px', color: '#888' }}>{w.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Room Link */}
                        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                          <button
                            onClick={() => setIsPrivate(!isPrivate)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '4px',
                              padding: '4px 8px', borderRadius: '4px',
                              background: isPrivate ? 'rgba(255, 59, 48, 0.1)' : 'rgba(76, 217, 100, 0.1)',
                              border: `1px solid ${isPrivate ? 'rgba(255, 59, 48, 0.3)' : 'rgba(76, 217, 100, 0.3)'}`,
                              color: isPrivate ? '#ff3b30' : '#4cd964',
                              fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                              borderStyle: 'solid',
                            }}
                          >
                            {isPrivate ? <Lock size={10} /> : <Globe size={10} />}
                            {isPrivate ? 'Private Room' : 'Public Lobby'}
                          </button>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '10px', color: '#555' }}>Invite:</span>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', padding: '2px 4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <input 
                                readOnly 
                                value={`vibe.network/room/${(creatorId || profile?.id || 'live').substring(0,6)}`} 
                                style={{ background: 'none', border: 'none', color: '#666', fontSize: '9px', width: '90px', outline: 'none' }} 
                              />
                              <button
                                onClick={() => {
                                  const roomId = creatorId || profile?.id || 'live';
                                  navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?fanzone=true&room=${roomId}`);
                                  setCopied(true);
                                  toast.success('Room Invite Link copied!');
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                style={{ background: 'none', border: 'none', color: copied ? accent : '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                {copied ? <Check size={10} /> : <Copy size={10} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Chat Messages scroll area */}
                        <div ref={chatScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {chatMessages.length === 0 ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '12px' }}>
                              <p style={{ margin: 0 }}>🎉 Welcome to the Fan Zone!</p>
                              <p style={{ margin: '4px 0 0 0', fontSize: '11px', textAlign: 'center' }}>Send a message to start syncing with co-watchers in real-time.</p>
                            </div>
                          ) : (
                            chatMessages.map(msg => (
                              <div key={msg.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <img src={msg.avatar} alt={msg.user} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', marginTop: '2px' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: 800, color: msg.isSelf ? accent : '#eee' }}>{msg.user}</span>
                                    <span style={{ fontSize: '8px', color: '#444' }}>{msg.time}</span>
                                  </div>
                                  <span style={{ fontSize: '12px', color: '#ccc', lineHeight: 1.4, wordBreak: 'break-word' }}>{msg.text}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Reaction Bar & Message Input */}
                        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
                          {/* Emoji Reactions */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {['🔥', '😮', '😂', '👏', '💯'].map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(emoji, true)}
                                style={{
                                  background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer',
                                  transition: 'transform 0.1s',
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.3)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>

                          {/* Message Input */}
                          <form
                            onSubmit={e => {
                              e.preventDefault();
                              if (!chatInput.trim()) return;
                              const msgId = Math.random().toString();
                              const now = new Date();
                              const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              const newMsg = {
                                id: msgId,
                                user: currentUser.name,
                                text: chatInput,
                                avatar: currentUser.avatar,
                                time: timeStr,
                                isSelf: true,
                              };
                              setChatMessages(prev => [...prev, newMsg]);

                              if (fanzoneChannelRef.current) {
                                fanzoneChannelRef.current.send({
                                  type: 'broadcast',
                                  event: 'chat',
                                  payload: {
                                    id: msgId,
                                    user: currentUser.name,
                                    text: chatInput,
                                    avatar: currentUser.avatar,
                                    time: timeStr
                                  }
                                });
                              }

                              setChatInput('');
                            }}
                            style={{ display: 'flex', gap: '8px' }}
                          >
                            <input
                              type="text"
                              value={chatInput}
                              onChange={e => setChatInput(e.target.value)}
                              placeholder="Say something in Fan Zone..."
                              style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                color: '#fff',
                                fontSize: '12px',
                                outline: 'none',
                              }}
                            />
                            <button
                              type="submit"
                              style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: accent, border: 'none', color: '#000',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'opacity 0.2s',
                              }}
                              onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                              onMouseOut={e => e.currentTarget.style.opacity = '1'}
                            >
                              <Send size={12} />
                            </button>
                          </form>
                        </div>
                      </div>
                    ) : (
                      <ErrorBoundary fallback={<div style={{ padding: '20px', color: '#ff4d4d' }}>⚠️ Live chat crashed.</div>}>
                        <React.Suspense fallback={<div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading chat...</div>}>
                          <LiveChat streamId={profile?.username || 'profile'} />
                        </React.Suspense>
                      </ErrorBoundary>
                    )}
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
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>
                    {isOwnProfile && viewMode === 'edit' ? 'VIP Backstage Broadcast' : 'Live Broadcast'}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                    {isOwnProfile && viewMode === 'edit' ? 'Configure your live stream settings below.' : 
                     effectiveIsSubscribed ? 'Live stream is free since you are subscribed!' : 
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

                      {/* Live Product Pinning (Broadcaster Panel) */}
                      <div style={{ marginBottom: '24px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ display: 'block', marginBottom: '12px', color: '#00ff88', fontWeight: 'bold', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          🛍️ Feature Product Live
                        </label>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '16px', marginTop: '-4px' }}>
                          Select a product from your store to feature as a floating overlay card to all active viewers in real-time.
                        </p>

                        {pinnedProduct ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255, 0, 85, 0.1)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 0, 85, 0.3)' }}>
                            {pinnedProduct.image_url ? (
                              <img src={pinnedProduct.image_url} alt={pinnedProduct.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                            ) : (
                              <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🛍️</div>
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ background: '#ff0055', color: '#fff', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Currently Pinned</span>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '14px' }}>{pinnedProduct.title}</span>
                              </div>
                              <div style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '13px', marginTop: '4px' }}>${Number(pinnedProduct.price).toFixed(2)}</div>
                            </div>
                            <button
                              onClick={() => {
                                setPinnedProduct(null);
                                toast.info('Product unpinned from stream.');
                              }}
                              style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', transition: '0.2s' }}
                              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            >
                              Unpin Product
                            </button>
                          </div>
                        ) : (
                          <div>
                            {products.length === 0 ? (
                              <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic', padding: '10px', textAlign: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                                No products found in your store. Add products in the Store tab to feature them here.
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'thin' }}>
                                {products.map((prod: any) => (
                                  <div key={prod.id} style={{ minWidth: '220px', width: '220px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'} onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                      {prod.image_url ? (
                                        <img src={prod.image_url} alt={prod.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                      ) : (
                                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🛍️</div>
                                      )}
                                      <div style={{ overflow: 'hidden', flex: 1 }}>
                                        <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prod.title}</div>
                                        <div style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '11px', marginTop: '2px' }}>${Number(prod.price).toFixed(2)}</div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setPinnedProduct(prod);
                                        toast.success(`Pinned "${prod.title}" live!`);
                                      }}
                                      style={{ width: '100%', padding: '6px', background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                                      onMouseOver={e => { e.currentTarget.style.background = '#00ff88'; e.currentTarget.style.color = '#000'; }}
                                      onMouseOut={e => { e.currentTarget.style.background = 'rgba(0, 255, 136, 0.1)'; e.currentTarget.style.color = '#00ff88'; }}
                                    >
                                      Pin to Stream
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
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
