import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import { getSafeUserMedia } from '../lib/mediaUtils';

// STUN-only ICE config (TURN requires paid credentials — add yours here when ready)
const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

const PEERJS_DEBUG_LEVEL = 2; // Show warnings + errors for diagnostics

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
  const [streamSource, setStreamSource] = useState<StreamSource>('camera');
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
  const [pinnedProducts, setPinnedProducts] = useState<any[]>([]);

  // ── UI State ──
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState<number | ''>('');
  const [showExitScreen, setShowExitScreen] = useState(false);

  // ── Refs ──
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const activeCallsRef = useRef<Set<any>>(new Set());
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
  const [isCameraRequested, setIsCameraRequested] = useState(false);
  const isCameraActive = isPlayingLive || liveCountdown !== null || isCameraRequested;
  const isPreviewExpired = !isOwnProfile && isPlayingLive && !hasPaidForLive && previewTimeLeft === 0;

  // Auto-reset camera request when live streaming is turned off
  useEffect(() => {
    if (!isPlayingLive && liveCountdown === null) {
      setIsCameraRequested(false);
    }
  }, [isPlayingLive, liveCountdown]);

  // ── Countdown Timer (guarded against double-start) ──
  const startLiveStream = useCallback(() => {
    if (countdownRef.current !== null || liveCountdown !== null || isPlayingLive) return;
    setIsCameraRequested(true);
  }, [liveCountdown, isPlayingLive]);

  const stopLiveStream = useCallback(() => {
    setIsPlayingLive(false);
    setIsPubliclyLive(false);
    setIsCameraRequested(false);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setLiveCountdown(null);
  }, []);

  // ── Auto-start countdown once camera is active ──
  useEffect(() => {
    if (isOwnProfile && isCameraRequested && cameraStatus === 'active' && liveCountdown === null && !isPlayingLive && countdownRef.current === null) {
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
    }
  }, [isOwnProfile, isCameraRequested, cameraStatus, liveCountdown, isPlayingLive]);

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
  // PeerJS Host Lifetime Effect
  // Keeps the host peer ID registered stable on PeerJS signaling
  // server as long as the broadcaster remains on the page,
  // preventing "unavailable-id" collisions when starting/stopping.
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isOwnProfile || !profileId || typeof window === 'undefined') return;

    const peerId = `vibe-host-${profileId}`;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    let hostPeer: Peer | null = null;
    let aborted = false;

    const createPeer = (id: string) => {
      if (aborted) return;
      console.log(`[PeerJS Host] Initializing Peer with ID: ${id}`);
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
            const vTracks = currentStream.getVideoTracks();
            const aTracks = currentStream.getAudioTracks();
            console.log(`[WebRTC] Answering with stream: video=${vTracks.length} (${vTracks[0]?.readyState || 'none'}) audio=${aTracks.length} (${aTracks[0]?.readyState || 'none'})`);
            call.answer(currentStream);
            activeCallsRef.current.add(call);
            call.on('close', () => {
              activeCallsRef.current.delete(call);
            });
            call.on('error', () => {
              activeCallsRef.current.delete(call);
            });
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

    return () => {
      aborted = true;
      if (hostPeer) {
        console.log(`[PeerJS Host] Destroying Peer connection for: ${peerId}`);
        hostPeer.destroy();
      }
      peerRef.current = null;
    };
  }, [isOwnProfile, profileId, user?.id]);

  // ══════════════════════════════════════════════════════════════
  // Camera Media Stream Effect
  // Handles webcam state acquisition and track release dynamically.
  // ══════════════════════════════════════════════════════════════
  useEffect(() => {
    let aborted = false;
    let acquiredStream: MediaStream | null = null;

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

      // Close all active viewer calls since camera is turned off
      activeCallsRef.current.forEach(call => {
        try { call.close(); } catch (_) {}
      });
      activeCallsRef.current.clear();
    };
  }, [isCameraActive, streamSource, presenterMode, isOwnProfile]);
  // NOTE: `guests.length` is intentionally REMOVED from deps — guest changes
  // should NOT tear down the camera or PeerJS host. guestsRef handles auth.

  // ── Supabase Channel: Stream Status Sync ──
  useEffect(() => {
    if (!supabase || !profileId) return;

    console.log("[useStreaming sync effect] Setting up channel for profileId:", profileId, "isOwnProfile:", isOwnProfile);
    const channel = supabase.channel(`stream-room-${profileId}`);
    channelRef.current = channel;

    // Listen for live stream status announcements
    channel.on('broadcast', { event: 'stream_status' }, (payload: any) => {
      if (isOwnProfile) return;
      console.log("[useStreaming broadcast receive] payload:", payload.payload);
      const { 
        isPlayingLive: hostIsPlaying, 
        isPubliclyLive: hostIsPublic, 
        streamSource: hostSource, 
        liveEmbedUrl: hostUrl, 
        pinnedProducts: hostPinnedProducts,
        pinnedProduct: hostPinnedProduct
      } = payload.payload;
      setIsPlayingLive(hostIsPlaying);
      setIsPubliclyLive(hostIsPublic);
      if (hostSource) setStreamSource(hostSource);
      if (hostUrl !== undefined) setLiveEmbedUrl(hostUrl);
      
      if (hostPinnedProducts !== undefined) {
        setPinnedProducts(Array.isArray(hostPinnedProducts) ? hostPinnedProducts : (hostPinnedProducts ? [hostPinnedProducts] : []));
      } else if (hostPinnedProduct !== undefined) {
        setPinnedProducts(hostPinnedProduct ? [hostPinnedProduct] : []);
      }
    });

    // Listen for guest list sync from host
    channel.on('broadcast', { event: 'host_sync_guests' }, (payload: any) => {
      if (isOwnProfile) return;
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
      console.log("[useStreaming channel subscription status] status:", status, "for room:", profileId);
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
          payload: { isPlayingLive: false, isPubliclyLive: false, pinnedProducts: [] },
        });
      }
      return;
    }

    const broadcastStatus = () => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'stream_status',
          payload: { isPlayingLive, isPubliclyLive, streamSource, liveEmbedUrl, pinnedProducts },
        });
      }
    };
    broadcastStatus();

    const interval = setInterval(broadcastStatus, 3000);
    return () => clearInterval(interval);
  }, [isOwnProfile, isPlayingLive, isPubliclyLive, streamSource, liveEmbedUrl, pinnedProducts]);

  // ── Stream Recording Effect (Host Only) ──
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!isOwnProfile || typeof window === 'undefined') return;

    if (isPlayingLive) {
      const stream = localStreamRef.current;
      if (!stream) {
        console.warn("[Recording] Cannot start recording: local stream not available.");
        return;
      }

      console.log("[Recording] Live stream started. Initializing MediaRecorder...");
      recordedChunksRef.current = [];

      let options: any = {};
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      
      for (const mime of mimeTypes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
          options = { mimeType: mime };
          console.log(`[Recording] Selected MIME type: ${mime}`);
          break;
        }
      }

      try {
        const recorder = new MediaRecorder(stream, options);
        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = async () => {
          console.log("[Recording] Recorder stopped. Compiling file...");
          const blob = new Blob(recordedChunksRef.current, { type: options.mimeType || 'video/webm' });
          if (blob.size === 0) {
            console.warn("[Recording] Recorded file is empty, aborting upload.");
            return;
          }

          const fileExt = (options.mimeType && options.mimeType.includes('mp4')) ? 'mp4' : 'webm';
          const fileName = `past-streams/${profileId || user?.id}/${Date.now()}.${fileExt}`;
          console.log(`[Recording] Uploading ${blob.size} bytes to videos bucket at ${fileName}...`);

          try {
            const { data: uploadData, error: uploadErr } = await supabase.storage
              .from('videos')
              .upload(fileName, blob, {
                contentType: options.mimeType || 'video/webm',
                cacheControl: '3600',
              });

            if (uploadErr) {
              console.error("[Recording] Upload failed:", uploadErr.message);
              return;
            }

            const { data: { publicUrl } } = supabase.storage
              .from('videos')
              .getPublicUrl(fileName);

            console.log("[Recording] Upload complete. Public URL:", publicUrl);

            // Add record to videos database table
            const streamPrice = parseFloat(livePrice || '5.00') || 5.00;
            const { data: insertedVideo, error: insertErr } = await supabase
              .from('videos')
              .insert({
                title: `Live Stream - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                video_url: publicUrl,
                image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
                creator_id: profileId || user?.id,
                tags: ['Past Stream', 'Recorded'],
                price: streamPrice,
                preview_duration: 30
              })
              .select()
              .single();

            if (insertErr) {
              console.error("[Recording] Failed to insert video record:", insertErr.message);
            } else {
              console.log("[Recording] Video record inserted successfully:", insertedVideo);
              window.dispatchEvent(new CustomEvent('vibe_past_streams_updated'));
            }
          } catch (uploadCatchErr) {
            console.error("[Recording] Upload process error:", uploadCatchErr);
          }
        };

        recorder.start(1000); // chunk every 1s
        mediaRecorderRef.current = recorder;
      } catch (err) {
        console.error("[Recording] Failed to create MediaRecorder:", err);
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        console.log("[Recording] Stopping MediaRecorder because stream ended...");
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
    }

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
    };
  }, [isPlayingLive, isOwnProfile, profileId, user?.id, livePrice]);

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
    pinnedProducts, setPinnedProducts,

    // UI
    showTipModal, setShowTipModal,
    tipAmount, setTipAmount,
    showExitScreen, setShowExitScreen,

    // Derived
    isCameraActive,
    isPreviewExpired,

    // Actions
    startLiveStream,
    stopLiveStream,
  };
}
