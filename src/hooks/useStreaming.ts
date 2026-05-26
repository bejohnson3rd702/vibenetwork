import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import { getSafeUserMedia } from '../lib/mediaUtils';

// STUN-only ICE config (TURN requires paid credentials — add yours here when ready)
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

const PEERJS_DEBUG_LEVEL = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === 'true') ? 3 : 0;

export type StreamSource = 'url' | 'camera' | 'obs';
export type CameraStatus = 'idle' | 'loading' | 'active' | 'error';

interface UseStreamingOptions {
  profileId: string | undefined;
  isOwnProfile: boolean;
  user: any;
  supabase: any;
  channelRef: React.MutableRefObject<any>;
}

export function useStreaming({ profileId, isOwnProfile, user, supabase, channelRef }: UseStreamingOptions) {
  // ── Core Live State ──
  const [isPlayingLive, setIsPlayingLive] = useState(false);
  const [isPubliclyLive, setIsPubliclyLive] = useState(false);
  const [liveCountdown, setLiveCountdown] = useState<number | null>(null);
  const [streamSource, setStreamSource] = useState<StreamSource>('url');
  const [liveEmbedUrl, setLiveEmbedUrl] = useState('');

  // ── Camera State ──
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('idle');
  const [cameraDebugData, setCameraDebugData] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // ── Guest State ──
  const [guests, setGuests] = useState<{ id: string; name: string; title: string; isLive: boolean }[]>([]);
  const [localGuestData, setLocalGuestData] = useState<{ id: string; name: string; title: string; isLive: boolean } | null>(null);
  const [guestSetup, setGuestSetup] = useState<{ show: boolean; name: string; title: string }>({ show: false, name: '', title: '' });
  const [presenterMode, setPresenterMode] = useState(false);
  const [directorLayout, setDirectorLayout] = useState('grid');

  // ── Monetization State ──
  const [livePrice, setLivePrice] = useState('5.00');
  const [hasPaidForLive, setHasPaidForLive] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(90);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subPrice, setSubPrice] = useState('9.99');

  // ── UI State ──
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState<number | ''>('');
  const [showExitScreen, setShowExitScreen] = useState(false);

  // ── Refs ──
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const guestsRef = useRef(guests);

  // Keep guestsRef always in sync (fixes stale closure in PeerJS callback)
  useEffect(() => {
    guestsRef.current = guests;
  }, [guests]);

  // Keep localStreamRef in sync for PeerJS access
  useEffect(() => {
    localStreamRef.current = localStream;
  }, [localStream]);

  // ── Derived Values ──
  const isCameraActive = isPlayingLive || liveCountdown !== null;
  const isPreviewExpired = !isOwnProfile && isPlayingLive && !hasPaidForLive && previewTimeLeft === 0;

  // ── Countdown Timer (guarded against double-start) ──
  const startLiveStream = useCallback(() => {
    // Prevent double-start
    if (countdownRef.current !== null || liveCountdown !== null) return;

    setLiveCountdown(3);
    let ticker = 3;
    const interval = setInterval(() => {
      ticker -= 1;
      if (ticker <= 0) {
        clearInterval(interval);
        countdownRef.current = null;
        setLiveCountdown(null);
        setIsPlayingLive(true);
        setIsPubliclyLive(true);
      } else {
        setLiveCountdown(ticker);
      }
    }, 1000);
    countdownRef.current = interval;
  }, [liveCountdown]);

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, []);

  // ── Free Preview Countdown ──
  useEffect(() => {
    if (!isOwnProfile && isPlayingLive && !hasPaidForLive && previewTimeLeft > 0) {
      const timer = setInterval(() => {
        setPreviewTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOwnProfile, isPlayingLive, hasPaidForLive, previewTimeLeft]);

  // ══════════════════════════════════════════════════════════════
  // COMBINED Camera + PeerJS Effect
  // Keeping these together prevents the race condition where:
  //   1. Camera cleanup sets localStream=null
  //   2. PeerJS effect tears down (destroying the peer ID on PeerJS cloud)
  //   3. Camera re-acquires, sets localStream=newStream
  //   4. PeerJS effect tries to re-register same ID → "unavailable-id"
  // By keeping them in one effect, the peer is only created once with
  // the stream available, and destroyed only when the camera truly stops.
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    let aborted = false;
    let acquiredStream: MediaStream | null = null;
    let hostPeer: Peer | null = null;

    const shouldActivateCamera = isOwnProfile && isCameraActive && (streamSource === 'camera' || presenterMode || guests.length > 0);

    if (shouldActivateCamera) {
      if (streamSource === 'camera') {
        setCameraStatus('loading');
        setCameraDebugData('Awaiting OS permission...');
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus('error');
        setCameraDebugData('getUserMedia not available (HTTP or browser block)');
        return;
      }

      getSafeUserMedia(true, true)
        .then(stream => {
          if (aborted) {
            stream.getTracks().forEach(t => t.stop());
            return;
          }
          acquiredStream = stream;
          localStreamRef.current = stream;
          setCameraStatus('active');
          setLocalStream(stream);

          const videoTrack = stream.getVideoTracks()[0];
          const dims = videoTrack?.getSettings
            ? `${videoTrack.getSettings().width}x${videoTrack.getSettings().height}`
            : 'No Track';
          setCameraDebugData(`Stream: ${dims} | Audio: ${stream.getAudioTracks().length}`);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.defaultMuted = true;
            videoRef.current.muted = true;
            videoRef.current.play().catch(e => {
              setCameraDebugData(prev => prev + ` | PlayErr: ${e.message}`);
            });
          }

          // ── Create PeerJS Host (same effect, after stream is ready) ──
          if (profileId && typeof window !== 'undefined') {
            const peerId = `vibe-host-${profileId}`;
            let retryCount = 0;
            const MAX_RETRIES = 3;

            const createPeer = (id: string) => {
              if (aborted) return;
              hostPeer = new Peer(id, {
                debug: PEERJS_DEBUG_LEVEL,
                secure: true,
                config: { iceServers: ICE_SERVERS },
              });

              hostPeer.on('open', () => {
                retryCount = 0;
                console.log(`[PeerJS Host] Registered as: ${id}`);
                if (channelRef.current) {
                  channelRef.current.send({
                    type: 'broadcast',
                    event: 'webrtc_host_ready',
                    payload: { streamId: profileId },
                  });
                }
              });

              hostPeer.on('call', (call) => {
                const meta = call.metadata || {};
                const currentGuests = guestsRef.current;
                const isGuest = currentGuests.some((g) => g.id === meta.viewerId);
                const isSubscriber = meta.authType === 'subscription' || meta.authType === 'ppv';
                const isSelf = meta.viewerId === user?.id;

                if (isSubscriber || isGuest || isSelf) {
                  console.log(`[WebRTC] Authorized: ${meta.viewerName || 'Viewer'} (${meta.authType})`);
                  // Always use the ref — it's always the freshest stream
                  const currentStream = localStreamRef.current;
                  if (currentStream) {
                    call.answer(currentStream);
                  } else {
                    console.warn('[WebRTC] No local stream to answer with');
                    call.close();
                  }
                } else {
                  console.warn(`[WebRTC] Blocked: ${meta.viewerName || 'Unknown'} (${meta.authType || 'none'})`);
                  call.close();
                }
              });

              hostPeer.on('error', (err: any) => {
                console.error('[PeerJS Host Error]', err.type, err.message);
                if (err.type === 'unavailable-id' && retryCount < MAX_RETRIES) {
                  retryCount++;
                  const suffixedId = `${peerId}-${Date.now()}`;
                  console.log(`[PeerJS] ID collision, retrying with: ${suffixedId}`);
                  hostPeer?.destroy();
                  createPeer(suffixedId);
                }
              });
            };

            createPeer(peerId);
            peerRef.current = hostPeer;
          }
        })
        .catch(err => {
          if (aborted) return;
          setCameraStatus('error');
          setCameraDebugData(`GUM Error: ${err.name} - ${err.message}`);
        });
    } else {
      setCameraStatus('idle');
      setCameraDebugData('Idle');
    }

    return () => {
      aborted = true;
      if (acquiredStream) {
        acquiredStream.getTracks().forEach(t => t.stop());
      }
      setLocalStream(null);
      localStreamRef.current = null;
      if (hostPeer) {
        hostPeer.destroy();
      }
      peerRef.current = null;
    };
  }, [isCameraActive, streamSource, presenterMode, isOwnProfile, profileId, user?.id]);
  // NOTE: `guests.length` is intentionally REMOVED from deps — guest changes
  // should NOT tear down the camera or PeerJS host. guestsRef handles auth.

  // ── Supabase Channel: Stream Status Sync ──
  useEffect(() => {
    if (!supabase || !profileId) return;

    const channel = supabase.channel(`stream-room-${profileId}`);
    channelRef.current = channel;

    // Listen for live stream status announcements
    channel.on('broadcast', { event: 'stream_status' }, (payload: any) => {
      const { isPlayingLive: hostIsPlaying, isPubliclyLive: hostIsPublic, streamSource: hostSource, liveEmbedUrl: hostUrl } = payload.payload;
      setIsPlayingLive(hostIsPlaying);
      setIsPubliclyLive(hostIsPublic);
      if (hostSource) setStreamSource(hostSource);
      if (hostUrl !== undefined) setLiveEmbedUrl(hostUrl);
    });

    // Listen for guest list sync from host
    channel.on('broadcast', { event: 'host_sync_guests' }, (payload: any) => {
      const guestList = payload.payload;
      setGuests(guestList);

      if (typeof window !== 'undefined') {
        localStorage.setItem('vibe_host_guests_session', JSON.stringify(guestList));
      }

      setLocalGuestData(currentLocalGuest => {
        if (currentLocalGuest) {
          const myState = guestList.find((g: any) => g.id === currentLocalGuest.id);
          if (myState && myState.isLive !== currentLocalGuest.isLive) {
            return { ...currentLocalGuest, isLive: myState.isLive };
          }
        }
        return currentLocalGuest;
      });
    });

    // Listen for guest join/leave
    channel.on('broadcast', { event: 'guest_interaction' }, (payload: any) => {
      const { action, guestParam } = payload.payload;
      const isHost = user?.id === profileId;
      if (isHost && typeof window !== 'undefined') {
        const current = JSON.parse(localStorage.getItem('vibe_host_guests_session') || '[]');
        let updated = [...current];
        if (action === 'joined') {
          if (!updated.find((g: any) => g.id === guestParam.id)) {
            updated.push(guestParam);
          }
        } else if (action === 'left') {
          updated = updated.filter((g: any) => g.id !== guestParam.id);
        }
        localStorage.setItem('vibe_host_guests_session', JSON.stringify(updated));
        window.dispatchEvent(new Event('vibe_guests_updated'));
      }
    });

    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        if (user?.id === profileId && typeof window !== 'undefined') {
          const current = JSON.parse(localStorage.getItem('vibe_host_guests_session') || '[]');
          if (current.length > 0) {
            channel.send({ type: 'broadcast', event: 'host_sync_guests', payload: current });
          }
        }
      }
    });

    const handleGuestSync = () => {
      if (typeof window !== 'undefined') {
        try {
          const gInfo = JSON.parse(localStorage.getItem('vibe_host_guests_session') || '[]');
          setGuests(gInfo);
          if (user?.id === profileId) {
            channel.send({ type: 'broadcast', event: 'host_sync_guests', payload: gInfo });
          }
        } catch (e) { /* ignore parse errors */ }
      }
    };
    handleGuestSync();

    window.addEventListener('storage', handleGuestSync);
    window.addEventListener('vibe_guests_updated', handleGuestSync);

    return () => {
      window.removeEventListener('storage', handleGuestSync);
      window.removeEventListener('vibe_guests_updated', handleGuestSync);
      supabase.removeChannel(channel);
    };
  }, [profileId, user, supabase]);

  // ── Heartbeat Broadcast (host only) ──
  useEffect(() => {
    if (!isOwnProfile || !isPlayingLive) {
      // Send one "stopped" signal when going offline
      if (isOwnProfile && !isPlayingLive && channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'stream_status',
          payload: { isPlayingLive: false, isPubliclyLive: false },
        });
      }
      return;
    }

    const broadcastStatus = () => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'stream_status',
          payload: { isPlayingLive, isPubliclyLive, streamSource, liveEmbedUrl },
        });
      }
    };
    broadcastStatus();

    const interval = setInterval(broadcastStatus, 3000);
    return () => clearInterval(interval);
  }, [isOwnProfile, isPlayingLive, isPubliclyLive, streamSource, liveEmbedUrl]);

  return {
    // Core live state
    isPlayingLive, setIsPlayingLive,
    isPubliclyLive, setIsPubliclyLive,
    liveCountdown,
    streamSource, setStreamSource,
    liveEmbedUrl, setLiveEmbedUrl,

    // Camera
    cameraStatus,
    cameraDebugData,
    localStream,
    videoRef,

    // Guests
    guests, setGuests,
    localGuestData, setLocalGuestData,
    guestSetup, setGuestSetup,
    presenterMode, setPresenterMode,
    directorLayout, setDirectorLayout,

    // Monetization
    livePrice, setLivePrice,
    hasPaidForLive, setHasPaidForLive,
    previewTimeLeft,
    isSubscribed, setIsSubscribed,
    subPrice, setSubPrice,

    // UI
    showTipModal, setShowTipModal,
    tipAmount, setTipAmount,
    showExitScreen, setShowExitScreen,

    // Derived
    isCameraActive,
    isPreviewExpired,

    // Actions
    startLiveStream,
  };
}
