import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Settings, Camera, Video, Globe, X, Mic, MicOff, VideoOff, Send, Check, Copy, Play, Trash2, Plus } from 'lucide-react';
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
  stopLiveStream?: () => void;
  setShowTipModal: (b: boolean) => void;
  localStream?: MediaStream | null;
  liveCountdown?: number | null;

  products?: any[];
  pinnedProducts?: any[];
  setPinnedProducts?: (products: any[]) => void;
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
  startLiveStream, stopLiveStream, setShowTipModal, localStream, liveCountdown,
  products = [], pinnedProducts = [], setPinnedProducts = () => {}
}) => {
  const toast = useToast();
  const bypassSub = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('bypass_sub') === 'true';
  const effectiveIsSubscribed = isSubscribed || bypassSub;
  const viewerVideoRef = React.useRef<HTMLVideoElement>(null);
  const [isRemoteConnected, setIsRemoteConnected] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [lastPinnedCount, setLastPinnedCount] = React.useState(0);

  // ── Past Streams States & Actions ──
  const [pastStreams, setPastStreams] = React.useState<any[]>([]);
  const [activeUploads, setActiveUploads] = React.useState<any[]>([]);
  const [loadingPastStreams, setLoadingPastStreams] = React.useState(false);
  const [activePastStream, setActivePastStream] = React.useState<any | null>(null);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [isPastStreamPreviewExpired, setIsPastStreamPreviewExpired] = React.useState<boolean>(false);
  const [pastStreamPreviewTimeLeft, setPastStreamPreviewTimeLeft] = React.useState<number>(30);
  const pastStreamVideoRef = React.useRef<HTMLVideoElement>(null);
  const [purchasedVideoIds, setPurchasedVideoIds] = React.useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vibe_purchased_videos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (_) {
          return [];
        }
      }
    }
    return [];
  });

  const fetchPastStreams = React.useCallback(async () => {
    const targetId = creatorId || profile?.id || user?.id;
    if (!targetId) {
      setLoadingPastStreams(false);
      return;
    }
    try {
      setLoadingPastStreams(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('creator_id', targetId)
        .contains('tags', ['Past Stream'])
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPastStreams(data);
      }
    } catch (err) {
      console.warn("Error fetching past streams:", err);
    } finally {
      setLoadingPastStreams(false);
    }
  }, [creatorId, profile?.id, user?.id]);

  React.useEffect(() => {
    fetchPastStreams();
  }, [fetchPastStreams]);

  React.useEffect(() => {
    window.addEventListener('vibe_past_streams_updated', fetchPastStreams);
    return () => {
      window.removeEventListener('vibe_past_streams_updated', fetchPastStreams);
    };
  }, [fetchPastStreams]);

  // Countdown timer for YouTube/Dailymotion past stream previews
  React.useEffect(() => {
    let interval: any = null;
    const isYouTube = activePastStream?.video_url?.includes('youtube.com') || activePastStream?.video_url?.includes('youtu.be');
    const isDailymotion = activePastStream?.video_url?.includes('dailymotion.com') || activePastStream?.video_url?.includes('dai.ly');
    
    if (
      activePastStream &&
      (isYouTube || isDailymotion) &&
      !isOwnProfile &&
      !effectiveIsSubscribed &&
      !purchasedVideoIds.includes(activePastStream.id) &&
      activePastStream.price > 0 &&
      !isPastStreamPreviewExpired
    ) {
      interval = setInterval(() => {
        setPastStreamPreviewTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPastStreamPreviewExpired(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activePastStream, isOwnProfile, effectiveIsSubscribed, purchasedVideoIds, isPastStreamPreviewExpired]);

  const handleBuyVideo = async (video: any) => {
    const priceVal = Number(video.price) || 0;
    if (priceVal <= 0 || effectiveIsSubscribed) {
      // Free or subscribed
      const updated = [...purchasedVideoIds, video.id];
      setPurchasedVideoIds(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vibe_purchased_videos', JSON.stringify(updated));
      }
      toast.success(`Successfully unlocked "${video.title}"!`);
      return;
    }

    toast.info(`Opening checkout for "${video.title}" ($${priceVal.toFixed(2)})...`);
    try {
      await handleStripeCheckout('Past Stream: ' + video.title, priceVal, { video_id: video.id });
    } catch (err) {
      console.warn("Stripe checkout error:", err);
    }

    // Mock immediate purchase simulation for instant gratification and easy testing
    const updated = [...purchasedVideoIds, video.id];
    setPurchasedVideoIds(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibe_purchased_videos', JSON.stringify(updated));
    }
    toast.success(`Successfully purchased Past Stream: ${video.title} ($${priceVal.toFixed(2)})! 🎥`);
  };

  // ── CRUD States for Replay Vault ──
  const [isCrudModalOpen, setIsCrudModalOpen] = React.useState(false);
  const [editingVideo, setEditingVideo] = React.useState<any | null>(null);
  const [crudTitle, setCrudTitle] = React.useState('');
  const [crudPrice, setCrudPrice] = React.useState('5.00');
  const [crudPreviewDuration, setCrudPreviewDuration] = React.useState('30');
  const [crudVideoSourceType, setCrudVideoSourceType] = React.useState<'upload' | 'url'>('upload');
  const [crudVideoUrl, setCrudVideoUrl] = React.useState('');
  const [crudImageUrl, setCrudImageUrl] = React.useState('');
  const [crudVideoFile, setCrudVideoFile] = React.useState<File | null>(null);
  const [crudImageFile, setCrudImageFile] = React.useState<File | null>(null);
  const [crudUploading, setCrudUploading] = React.useState(false);
  const [crudUploadProgress, setCrudUploadProgress] = React.useState('');

  const handleOpenAddModal = () => {
    setEditingVideo(null);
    setCrudTitle('');
    setCrudPrice('5.00');
    setCrudPreviewDuration('30');
    setCrudVideoSourceType('upload');
    setCrudVideoUrl('');
    setCrudImageUrl('');
    setCrudVideoFile(null);
    setCrudImageFile(null);
    setCrudUploadProgress('');
    setIsCrudModalOpen(true);
  };

  const handleOpenEditModal = (video: any) => {
    setEditingVideo(video);
    setCrudTitle(video.title || '');
    setCrudPrice(String(video.price || '0.00'));
    setCrudPreviewDuration(String(video.preview_duration || '30'));
    setCrudVideoSourceType(video.video_url?.includes('supabase') ? 'upload' : 'url');
    setCrudVideoUrl(video.video_url || '');
    setCrudImageUrl(video.image_url || '');
    setCrudVideoFile(null);
    setCrudImageFile(null);
    setCrudUploadProgress('');
    setIsCrudModalOpen(true);
  };

  const runBackgroundUpload = async (task: {
    id: string;
    title: string;
    videoSourceType: 'upload' | 'url';
    videoFile: File | null;
    imageFile: File | null;
    videoUrl: string;
    imageUrl: string;
    price: string;
    previewDuration: string;
    editingVideo: any;
  }) => {
    try {
      let finalVideoUrl = task.videoUrl;
      let finalImageUrl = task.imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800';

      // 1. Upload Video File if selected
      if (task.videoSourceType === 'upload' && task.videoFile) {
        setActiveUploads(prev => prev.map(u => u.id === task.id ? { ...u, progress: `Uploading Video: ${task.videoFile!.name} (Please wait)...` } : u));
        const videoPath = `past-streams-manual/${creatorId}/${Date.now()}_${task.videoFile.name}`;
        const { error: videoErr } = await supabase.storage
          .from('videos')
          .upload(videoPath, task.videoFile, { cacheControl: '3600' });
        
        if (videoErr) {
          toast.error("Failed to upload video: " + videoErr.message);
          return;
        }

        const { data: { publicUrl: vUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(videoPath);
        finalVideoUrl = vUrl;
      }

      // 2. Upload Image File if selected
      if (task.imageFile) {
        setActiveUploads(prev => prev.map(u => u.id === task.id ? { ...u, progress: `Uploading Cover Image: ${task.imageFile!.name}...` } : u));
        const imagePath = `past-streams-manual/${creatorId}/${Date.now()}_${task.imageFile.name}`;
        const { error: imageErr } = await supabase.storage
          .from('videos')
          .upload(imagePath, task.imageFile, { cacheControl: '3600' });

        if (imageErr) {
          toast.error("Failed to upload image: " + imageErr.message);
          return;
        }

        const { data: { publicUrl: iUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(imagePath);
        finalImageUrl = iUrl;
      }

      if (!finalVideoUrl) {
        toast.error("Please provide a video file or direct video URL.");
        return;
      }

      // 3. Insert or Update row in public.videos table
      const priceVal = parseFloat(task.price) || 0;
      const previewDur = parseInt(task.previewDuration) || 30;

      if (task.editingVideo) {
        setActiveUploads(prev => prev.map(u => u.id === task.id ? { ...u, progress: 'Updating replay details...' } : u));
        const { error: updateErr } = await supabase
          .from('videos')
          .update({
            title: task.title,
            video_url: finalVideoUrl,
            image_url: finalImageUrl,
            price: priceVal,
            preview_duration: previewDur
          })
          .eq('id', task.editingVideo.id);

        if (updateErr) {
          toast.error("Failed to update video: " + updateErr.message);
        } else {
          toast.success(`Successfully updated replay details!`);
          fetchPastStreams();
        }
      } else {
        setActiveUploads(prev => prev.map(u => u.id === task.id ? { ...u, progress: 'Publishing replay...' } : u));
        const { error: insertErr } = await supabase
          .from('videos')
          .insert({
            title: task.title,
            video_url: finalVideoUrl,
            image_url: finalImageUrl,
            creator_id: creatorId,
            tags: ['Past Stream', 'Recorded'],
            price: priceVal,
            preview_duration: previewDur
          });

        if (insertErr) {
          toast.error("Failed to add past stream replay: " + insertErr.message);
        } else {
          toast.success(`Successfully published new replay!`);
          fetchPastStreams();
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error("An unexpected error occurred: " + err.message);
    } finally {
      setActiveUploads(prev => prev.filter(u => u.id !== task.id));
    }
  };

  const handleSaveCrud = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorId) return;

    const uploadId = crypto.randomUUID();
    const task = {
      id: uploadId,
      title: crudTitle.trim(),
      videoSourceType: crudVideoSourceType,
      videoFile: crudVideoFile,
      imageFile: crudImageFile,
      videoUrl: crudVideoUrl,
      imageUrl: crudImageUrl,
      price: crudPrice,
      previewDuration: crudPreviewDuration,
      editingVideo: editingVideo,
      progress: 'Initializing...'
    };

    setIsCrudModalOpen(false);
    
    // Reset modal form state
    setCrudTitle('');
    setCrudVideoUrl('');
    setCrudImageUrl('');
    setCrudPrice('');
    setCrudPreviewDuration('30');
    setCrudVideoFile(null);
    setCrudImageFile(null);

    // Add to active uploads & trigger background execution
    setActiveUploads(prev => [...prev, task]);
    runBackgroundUpload(task);
  };

  const safePinnedProducts = Array.isArray(pinnedProducts) ? pinnedProducts : [];

  React.useEffect(() => {
    if (safePinnedProducts.length > lastPinnedCount) {
      setIsDrawerOpen(true);
    }
    setLastPinnedCount(safePinnedProducts.length);
  }, [safePinnedProducts, lastPinnedCount]);

  console.log("[ProfileLive Render] state:", { isOwnProfile, isPlayingLive, pinnedProductsCount: safePinnedProducts.length, isDrawerOpen });

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
      if (videoRef.current.srcObject !== localStream) {
        videoRef.current.srcObject = localStream;
      }
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
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-surface)', borderRadius: '24px', overflow: 'hidden', border: `1px solid ${accent}22` }}>
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
                           <div className="live-video-status" style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(255, 0, 85, 0.25)', border: '1px solid rgba(255, 0, 85, 0.4)', backdropFilter: 'blur(12px)', color: '#fff', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 15px rgba(255,0,85,0.25)' }}>
                             <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }}/> LIVE
                           </div>
                        ) : (
                           <div className="live-video-status" style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(0, 85, 255, 0.25)', border: '1px solid rgba(0, 85, 255, 0.4)', backdropFilter: 'blur(12px)', color: '#fff', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 15px rgba(0,85,255,0.25)' }}>
                             <Settings size={16} /> STUDIO PREVIEW
                           </div>
                        )}
                     </>
                   )}
                  
                  <div className="live-video-actions" style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', gap: '10px' }}>
                    {!localGuestData && (
                      <button onClick={() => setShowTipModal(true)} style={{ padding: '8px 18px', background: 'rgba(255, 255, 255, 0.08)', border: `1px solid ${accent}44`, backdropFilter: 'blur(12px)', color: '#fff', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.borderColor=accent;}} onMouseOut={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor=`${accent}44`;}}>
                         💰 Support Stream
                      </button>
                    )}
                  </div>
                  
                  {isPlayingLive || (isOwnProfile && cameraStatus !== 'idle') ? (
                     <>
                       {!isOwnProfile && isPlayingLive && !effectiveIsSubscribed && !hasPaidForLive ? (
                         isPreviewExpired ? (
                           <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10, 10, 12, 0.45)', backdropFilter: 'blur(30px)', padding: '40px', textAlign: 'center', border: `1px solid ${accent}22`, boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
                             <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(255, 77, 133, 0.05)', border: '1px solid rgba(255, 77, 133, 0.15)', marginBottom: '16px', filter: 'drop-shadow(0 0 12px rgba(255,77,133,0.3))' }}>
                                <Lock size={40} color="#ff4d85" />
                             </div>
                             <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', color: 'var(--text-primary)', fontWeight: '900', letterSpacing: '-0.5px' }}>Preview Ended</h2>
                             <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '380px', marginBottom: '32px', lineHeight: 1.6 }}>
                               Your free 90-second preview has expired. Subscribe to {profile?.username} for full access, or purchase a one-time pass to continue watching.
                             </p>
                             <div style={{ display: 'flex', gap: '16px' }}>
                               <button onClick={handleUnlockLive} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: `0 8px 24px ${accent}44`, transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.transform='scale(1.05)';}} onMouseOut={e=>{e.currentTarget.style.transform='none';}}>
                                 Unlock for ${livePrice}
                               </button>
                               <button onClick={handleSubscribe} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';}} onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';}}>
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
                                      <video
                                        ref={viewerVideoRef}
                                        autoPlay
                                        playsInline
                                        controls
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', border: 'none', display: isRemoteConnected ? 'block' : 'none' }}
                                      />
                                      {!isRemoteConnected && (connectionStatus === 'connecting' || connectionStatus === 'reconnecting') && (
                                        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.7)', padding: '6px 14px', borderRadius: '20px', backdropFilter: 'blur(10px)', zIndex: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
                                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: connectionStatus === 'reconnecting' ? '#ff9900' : '#00ff88', animation: 'pulse 1.5s ease-in-out infinite' }} />
                                          <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                            {connectionStatus === 'reconnecting' ? 'Reconnecting...' : 'Connecting...'}
                                          </span>
                                        </div>
                                      )}
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
                         </div>
                       )}
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
                        <button onClick={() => { if (isOwnProfile) { startLiveStream(); } else { setIsPlayingLive(true); } }} style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,77,133,0.9)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(255,77,133,0.5)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                      </div>
                    </>
                  )}

                  {!(isOwnProfile && viewMode === 'edit') && isPlayingLive && safePinnedProducts.length > 0 && (
                    <AnimatePresence>
                      {!isDrawerOpen ? (
                        <motion.button
                          key="capsule"
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          onClick={() => setIsDrawerOpen(true)}
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            zIndex: 25,
                            background: 'rgba(10, 10, 15, 0.85)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            borderRadius: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '8px 16px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 136, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                            color: '#fff',
                            transition: 'all 0.2s'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span style={{ fontSize: '14px' }}>🛍️</span>
                          <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {safePinnedProducts.length} {safePinnedProducts.length === 1 ? 'Live Offer' : 'Live Offers'}
                          </span>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#00ff88',
                            boxShadow: '0 0 6px #00ff88',
                            animation: 'pulse 1.5s infinite',
                            marginLeft: '2px'
                          }} />
                        </motion.button>
                      ) : (
                        <motion.div
                          key="drawer"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.95 }}
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            zIndex: 30,
                            width: '240px',
                            background: 'rgba(10, 10, 15, 0.9)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderRadius: '14px',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            padding: '12px',
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 255, 136, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            pointerEvents: 'auto'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span style={{ fontSize: '14px' }}>🛍️</span>
                              <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#00ff88' }}>
                                Live Offers ({safePinnedProducts.length})
                              </span>
                            </div>
                            <button
                              onClick={() => setIsDrawerOpen(false)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#888',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onMouseOver={e => e.currentTarget.style.color = '#fff'}
                              onMouseOut={e => e.currentTarget.style.color = '#888'}
                            >
                              <X size={12} />
                            </button>
                          </div>

                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            overflowY: 'auto',
                            maxHeight: '180px',
                            paddingRight: '2px',
                            scrollbarWidth: 'thin'
                          }}>
                            {safePinnedProducts.map((prod: any) => (
                              <div
                                key={prod.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  background: 'rgba(255, 255, 255, 0.03)',
                                  border: '1px solid rgba(255, 255, 255, 0.05)',
                                  borderRadius: '8px',
                                  padding: '6px'
                                }}
                              >
                                {prod.image_url ? (
                                  <img src={prod.image_url} alt={prod.title} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                                ) : (
                                  <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🛍️</div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {prod.title}
                                  </div>
                                  <div style={{ color: '#00ff88', fontWeight: '900', fontSize: '11px', marginTop: '1px' }}>
                                    ${Number(prod.price).toFixed(2)}
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    handleStripeCheckout(
                                      prod.title,
                                      Number(prod.price),
                                      { product_id: prod.id, is_live_purchase: true }
                                    );
                                  }}
                                  style={{
                                    padding: '4px 8px',
                                    background: 'linear-gradient(45deg, #00ff88, #00bbff)',
                                    color: '#000',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '9px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseOver={e => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                  }}
                                  onMouseOut={e => {
                                    e.currentTarget.style.transform = 'none';
                                  }}
                                >
                                  Buy
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                      <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff3b30', animation: 'pulse 1.5s infinite' }} />
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Fan Zone Room</h4>
                        </div>
                        <span style={{ fontSize: '11px', color: '#ff3b30', fontWeight: 700, background: 'rgba(255, 59, 48, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>LIVE</span>
                      </div>

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

                        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
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
                     <div style={{ marginTop: '24px', background: 'rgba(15, 15, 15, 0.45)', backdropFilter: 'blur(20px)', padding: '24px', borderRadius: '24px', border: `1px solid ${accent}22`, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }}>
                       <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.02)', padding: '16px 20px', borderRadius: '16px', border: `1px solid ${accent}15` }}>
                         <label style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                           Pay-Per-View Price: $
                         </label>
                         <input type="number" value={livePrice} onChange={e => setLivePrice(e.target.value)} onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 10px ${accent}44`; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.boxShadow = 'none'; }} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', padding: '8px 14px', borderRadius: '8px', width: '90px', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }} />
                         <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>(Free for subscribers)</span>
                       </div>

                       <div style={{ marginBottom: '24px', background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '16px', border: `1px solid ${accent}15` }}>
                         <label style={{ display: 'block', marginBottom: '12px', color: accent, fontWeight: 'bold', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                           🛍️ Feature Product Live
                         </label>
                         <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '16px', marginTop: '-4px' }}>
                           Select a product from your store to feature as a floating overlay card to all active viewers in real-time.
                         </p>

                           <div>
                             {products.length === 0 ? (
                               <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic', padding: '10px', textAlign: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                                 No products found in your store. Add products in the Store tab to feature them here.
                               </div>
                             ) : (
                               <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'thin' }}>
                                 {products.map((prod: any) => {
                                   const isPinned = safePinnedProducts.some((p: any) => p.id === prod.id);
                                   return (
                                     <div key={prod.id} style={{ minWidth: '220px', width: '220px', background: isPinned ? 'rgba(255, 0, 85, 0.08)' : 'rgba(15,15,15,0.3)', border: isPinned ? '1px solid #ff0055' : `1px solid ${accent}22`, borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: isPinned ? '0 8px 24px rgba(255,0,85,0.15)' : 'none' }} onMouseOver={e=>{e.currentTarget.style.borderColor=isPinned ? '#ff0055' : accent; e.currentTarget.style.transform='translateY(-4px)';}} onMouseOut={e=>{e.currentTarget.style.borderColor=isPinned ? '#ff0055' : `${accent}22`; e.currentTarget.style.transform='none';}}>
                                       <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                         {prod.image_url ? (
                                           <img src={prod.image_url} alt={prod.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                         ) : (
                                           <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🛍️</div>
                                         )}
                                         <div style={{ overflow: 'hidden', flex: 1 }}>
                                           <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                                             {isPinned && (
                                               <span style={{ background: '#ff0055', color: '#fff', fontSize: '8px', fontWeight: 'bold', padding: '1px 4px', borderRadius: '3px', textTransform: 'uppercase' }}>Live</span>
                                             )}
                                             <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{prod.title}</div>
                                           </div>
                                           <div style={{ color: accent, fontWeight: 'bold', fontSize: '11px', marginTop: '2px' }}>${Number(prod.price).toFixed(2)}</div>
                                         </div>
                                       </div>
                                       <button
                                         onClick={() => {
                                           if (isPinned) {
                                             setPinnedProducts(safePinnedProducts.filter((p: any) => p.id !== prod.id));
                                             toast.info(`Unpinned "${prod.title}" from stream.`);
                                           } else {
                                             setPinnedProducts([...safePinnedProducts, prod]);
                                             toast.success(`Pinned "${prod.title}" live!`);
                                           }
                                         }}
                                         style={{
                                           width: '100%',
                                           padding: '8px',
                                           background: isPinned ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                                           color: isPinned ? 'var(--text-primary)' : accent,
                                           border: isPinned ? '1px solid rgba(255, 255, 255, 0.15)' : `1px solid ${accent}44`,
                                           borderRadius: '8px',
                                           fontSize: '12px',
                                           fontWeight: 'bold',
                                           cursor: 'pointer',
                                           transition: 'all 0.2s'
                                         }}
                                         onMouseOver={e => {
                                           if (isPinned) {
                                             e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                                           } else {
                                             e.currentTarget.style.background = accent;
                                             e.currentTarget.style.color = '#000';
                                           }
                                         }}
                                         onMouseOut={e => {
                                           if (isPinned) {
                                             e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                           } else {
                                             e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                                             e.currentTarget.style.color = accent;
                                           }
                                         }}
                                       >
                                         {isPinned ? 'Unpin Product' : 'Pin to Stream'}
                                       </button>
                                     </div>
                                   );
                                 })}
                               </div>
                             )}
                           </div>
                       </div>
                      <label style={{ display: 'block', marginBottom: '12px', color: '#ff4d85', fontWeight: 'bold', fontSize: '15px' }}>Configure Live Stream Origin</label>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                         <button onClick={() => { setStreamSource('camera'); setIsPlayingLive(false); }} style={{ padding: '10px 20px', background: streamSource === 'camera' ? '#0055ff' : 'rgba(255,255,255,0.05)', color: streamSource === 'camera' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={16}/> Direct Webcam</button>
                         {/* OBS and External URL stream sources are disabled
                         <button onClick={() => { setStreamSource('obs'); setIsPlayingLive(false); }} style={{ padding: '10px 20px', background: streamSource === 'obs' ? '#0055ff' : 'rgba(255,255,255,0.05)', color: streamSource === 'obs' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>🎙️ OBS / Streamlabs</button>
                         <button onClick={() => { setStreamSource('url'); setIsPlayingLive(false); }} style={{ padding: '10px 20px', background: streamSource === 'url' ? '#0055ff' : 'rgba(255,255,255,0.05)', color: streamSource === 'url' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>External URL / RTMP</button>
                         */}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Setup panels for External URL and OBS are disabled
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
                        */}
                        
                        {streamSource === 'camera' && (
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '16px', border: `1px solid ${accent}15` }}>
                             <div style={{ flex: 1, minWidth: '200px' }}>
                                <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '15px' }}>Direct Broadcast Server</p>
                                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.4' }}>Using your local hardware camera and microphone as the live stream origin. Press "Start Streaming" to ignite the feed.</p>
                             </div>
                             {isPlayingLive ? (
                               <button onClick={() => { if (stopLiveStream) { stopLiveStream(); } else { setIsPlayingLive(false); } }} style={{ padding: '14px 28px', background: 'rgba(229, 9, 20, 0.12)', color: '#ff3b30', border: '1px solid rgba(229, 9, 20, 0.3)', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(229,9,20,0.1)' }} onMouseOver={e=>e.currentTarget.style.background='rgba(229, 9, 20, 0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(229, 9, 20, 0.12)'}>
                                  🛑 Stop Streaming
                               </button>
                             ) : (
                               <button onClick={startLiveStream} style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${accent}, #8A2BE2)`, color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 8px 24px rgba(138,43,226,0.3)` }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='none'}><Camera size={18}/> Start Streaming</button>
                             )}
                          </div>
                        )}

                        {/* WebRTC Overlays & Guests configuration block is disabled
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
                        */}

                      </div>

                      {/* Uploads in Progress / Live Vault Uploads Card */}
                      {isOwnProfile && viewMode === 'edit' && activeUploads.length > 0 && (
                        <div style={{ marginTop: '24px', padding: '20px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.02)', border: `1px solid ${accent}15` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                              <label style={{ display: 'block', color: accent, fontWeight: 'bold', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                🎬 Upload content to Live vault
                              </label>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '4px 0 0 0' }}>
                                Active uploads in progress. These will automatically save to your Live vault once complete.
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activeUploads.map((task) => (
                              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                                <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                <div style={{ flex: 1 }}>
                                  <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '14px' }}>
                                    {task.title}
                                  </div>
                                  <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
                                    {task.progress}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <p style={{ margin: '15px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>This feed dictates what your active subscribers consume during live events in real-time.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                style={{ 
                  background: 'rgba(15, 15, 20, 0.45)', 
                  backdropFilter: 'blur(40px)', 
                  borderRadius: '32px', 
                  border: `1px solid ${accent}22`, 
                  overflow: 'hidden', 
                  textAlign: 'center', 
                  padding: '80px 40px', 
                  position: 'relative',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.15)', marginBottom: '24px', filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.25))' }}>
                  <Lock size={52} color="#FFD700" />
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Exclusive Live Broadcast</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '420px', margin: '0 auto 40px', lineHeight: 1.6 }}>Subscribe to {profile.username || 'this creator'} to instantly unlock their live streams and premium restricted vault content.</p>
                <button 
                  onClick={handleSubscribe} 
                  style={{ 
                    padding: '16px 48px', 
                    background: `linear-gradient(135deg, ${accent}, #8A2BE2)`, 
                    color: 'var(--text-primary)', 
                    border: 'none', 
                    borderRadius: '30px', 
                    fontWeight: 'bold', 
                    fontSize: '17px', 
                    cursor: 'pointer', 
                    boxShadow: `0 10px 25px rgba(138,43,226,0.35)`, 
                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' 
                  }} 
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'scale(1.04) translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 15px 35px rgba(138,43,226,0.5)`;
                  }} 
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = `0 10px 25px rgba(138,43,226,0.35)`;
                  }}
                >
                  Subscribe for ${subPrice}/mo
                </button>
              </motion.div>
            )}

            {/* ── Past Streams Section ── */}
            <div style={{ marginTop: '48px', padding: '0 4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px', margin: 0, color: 'var(--text-primary)' }}>Past Streams</h2>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Replay and watch previous live streams and broadcasts.
                  </p>
                </div>
                {isOwnProfile && viewMode === 'edit' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handleOpenAddModal}
                      style={{
                        padding: '6px 12px',
                        background: `linear-gradient(135deg, ${accent}, #8A2BE2)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: `0 4px 12px ${accent}25`,
                        transition: 'transform 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'none'}
                    >
                      <Plus size={12} /> Add Replay
                    </button>
                    <span style={{ fontSize: '11px', color: accent, background: `${accent}15`, padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', border: `1px solid ${accent}33`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Broadcaster Dashboard
                    </span>
                  </div>
                )}
              </div>

              {loadingPastStreams ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', color: 'var(--text-muted)', gap: '12px' }}>
                  <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span>Loading recorded streams...</span>
                </div>
              ) : pastStreams.length === 0 ? (
                <div style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px dashed rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                  padding: '56px 24px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ fontSize: '36px', marginBottom: '16px', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.1))' }}>🎬</div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px', color: 'var(--text-primary)' }}>No Past Streams Available</p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.5' }}>
                    {isOwnProfile && viewMode === 'edit' 
                      ? 'Replays of your direct webcam broadcasts will automatically be saved and displayed here for subscribers and viewers.' 
                      : 'No recorded broadcasts found for this creator.'}
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '28px'
                }}>
                  {pastStreams.map((video) => {
                    const isLocked = !isOwnProfile && !effectiveIsSubscribed && !purchasedVideoIds.includes(video.id) && video.price > 0;
                    
                    return (
                      <motion.div
                        key={video.id}
                        whileHover={{ y: -6 }}
                        style={{
                          background: 'rgba(15, 15, 20, 0.45)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '20px',
                          border: `1px solid ${isLocked ? 'rgba(255, 255, 255, 0.05)' : `${accent}22`}`,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                          position: 'relative',
                          transition: 'border-color 0.2s ease'
                        }}
                      >
                        {/* Thumbnail Wrapper */}
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
                          <img
                            src={video.image_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'}
                            alt={video.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isLocked ? 0.35 : 0.8 }}
                          />
                          
                          {/* Play / Lock Overlay */}
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isLocked ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'
                          }}>
                            {isLocked ? (
                              <button
                                onClick={() => handleBuyVideo(video)}
                                style={{
                                  background: 'rgba(10, 10, 15, 0.85)',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  borderRadius: '50%',
                                  width: '52px',
                                  height: '52px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#FFD700',
                                  cursor: 'pointer',
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                                  transition: 'all 0.2s'
                                }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.borderColor = '#FFD700'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                              >
                                <Lock size={22} />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setActivePastStream(video);
                                  setIsPastStreamPreviewExpired(false);
                                  setPastStreamPreviewTimeLeft(video.preview_duration ? Number(video.preview_duration) : 30);
                                  setCurrentTime(0);
                                }}
                                style={{
                                  background: accent,
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '52px',
                                  height: '52px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#000',
                                  cursor: 'pointer',
                                  boxShadow: `0 8px 24px ${accent}66`,
                                  transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'none'}
                              >
                                <Play size={22} fill="currentColor" style={{ marginLeft: '4px' }} />
                              </button>
                            )}
                          </div>

                          {/* Price Tag Badge */}
                          <div style={{
                            position: 'absolute',
                            bottom: 12,
                            left: 12,
                            background: video.price > 0 ? 'rgba(10, 10, 15, 0.85)' : 'rgba(76, 217, 100, 0.85)',
                            border: video.price > 0 ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(76, 217, 100, 0.3)',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            backdropFilter: 'blur(8px)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {video.price > 0 ? `$${Number(video.price).toFixed(2)}` : 'FREE'}
                          </div>

                          {/* Preview Badge Indicator */}
                          {isLocked && (
                            <div style={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                              background: 'rgba(255, 0, 85, 0.85)',
                              padding: '4px 10px',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase',
                              border: '1px solid rgba(255,255,255,0.15)',
                              backdropFilter: 'blur(8px)'
                            }}>
                              30s Free Preview
                            </div>
                          )}
                        </div>

                        {/* Video Info Content */}
                        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '42px' }}>
                              {video.title}
                            </h4>
                            {isOwnProfile && viewMode === 'edit' && (
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditModal(video);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Edit Replay Details"
                                  onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                  onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'none'; }}
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteVideo(video);
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.3)',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    borderRadius: '6px',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                  title="Delete Replay"
                                  onMouseOver={e => { e.currentTarget.style.color = '#ff3b30'; e.currentTarget.style.background = 'rgba(255,59,48,0.1)'; }}
                                  onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'none'; }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )}
                          </div>

                          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '12px' }}>
                            Recorded {new Date(video.created_at).toLocaleDateString()}
                          </p>

                          {/* Action CTA Button */}
                          <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                            {isLocked ? (
                              <button
                                onClick={() => handleBuyVideo(video)}
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  background: `linear-gradient(45deg, ${accent}, #8A2BE2)`,
                                  color: 'var(--text-primary)',
                                  border: 'none',
                                  borderRadius: '10px',
                                  fontSize: '13px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  boxShadow: `0 4px 15px ${accent}25`
                                }}
                                onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                                onMouseOut={e => e.currentTarget.style.opacity = '1'}
                              >
                                Unlock Replay
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setActivePastStream(video);
                                  setIsPastStreamPreviewExpired(false);
                                  setPastStreamPreviewTimeLeft(video.preview_duration ? Number(video.preview_duration) : 30);
                                  setCurrentTime(0);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '10px',
                                  background: 'rgba(255,255,255,0.05)',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  color: 'var(--text-primary)',
                                  borderRadius: '10px',
                                  fontSize: '13px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                              >
                                <Play size={14} fill="currentColor" /> Play Replay
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Immersive Cinema Modal for Replay Playback */}
            <AnimatePresence>
              {activePastStream && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    background: 'rgba(5, 5, 8, 0.95)',
                    backdropFilter: 'blur(30px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                  }}
                >
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '960px',
                    background: '#0a0a0c',
                    borderRadius: '24px',
                    border: `1px solid ${accent}33`,
                    boxShadow: `0 30px 100px rgba(0,0,0,0.8), 0 0 50px ${accent}11`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    aspectRatio: '16/10'
                  }}>
                    {/* Header */}
                    <div style={{
                      padding: '16px 24px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(0,0,0,0.3)'
                    }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{activePastStream.title}</h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                          Recorded on {new Date(activePastStream.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActivePastStream(null);
                          setIsPastStreamPreviewExpired(false);
                          setPastStreamPreviewTimeLeft(30);
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Replay Player Window */}
                    <div style={{ flex: 1, position: 'relative', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isPastStreamPreviewExpired ? (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          zIndex: 10,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(10, 10, 12, 0.85)',
                          backdropFilter: 'blur(20px)',
                          padding: '40px',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            display: 'inline-flex',
                            padding: '16px',
                            borderRadius: '50%',
                            background: 'rgba(255, 77, 133, 0.05)',
                            border: '1px solid rgba(255, 77, 133, 0.15)',
                            marginBottom: '16px',
                            filter: 'drop-shadow(0 0 12px rgba(255,77,133,0.3))'
                          }}>
                            <Lock size={40} color="#ff4d85" />
                          </div>
                          <h3 style={{ margin: '0 0 12px 0', fontSize: '26px', color: 'var(--text-primary)', fontWeight: '900' }}>Replay Preview Ended</h3>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '420px', marginBottom: '32px', lineHeight: 1.6 }}>
                            Unlock this past stream replay for lifetime access, or subscribe to {profile?.username || 'this creator'} to get access to all archives.
                          </p>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                              onClick={() => {
                                handleBuyVideo(activePastStream);
                                setIsPastStreamPreviewExpired(false);
                                setPastStreamPreviewTimeLeft(activePastStream.preview_duration ? Number(activePastStream.preview_duration) : 30);
                              }}
                              style={{
                                padding: '14px 28px',
                                background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                                color: 'var(--text-primary)',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                cursor: 'pointer',
                                boxShadow: `0 8px 24px ${accent}44`
                              }}
                            >
                              Unlock Replay for ${Number(activePastStream.price).toFixed(2)}
                            </button>
                            <button
                              onClick={handleSubscribe}
                              style={{
                                padding: '14px 28px',
                                background: 'rgba(255,255,255,0.06)',
                                color: 'var(--text-primary)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                cursor: 'pointer'
                              }}
                            >
                              Subscribe
                            </button>
                          </div>
                        </div>
                      ) : (
                        (() => {
                          const videoUrl = activePastStream.video_url || '';
                          const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
                          const isDailymotion = videoUrl.includes('dailymotion.com') || videoUrl.includes('dai.ly');

                          if (isYouTube) {
                            const match = videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                            const ytId = (match && match[2].length === 11) ? match[2] : '';
                            return (
                              <iframe
                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&controls=1&rel=0`}
                                title={activePastStream.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ width: '100%', height: '100%', border: 'none' }}
                              />
                            );
                          } else if (isDailymotion) {
                            const match = videoUrl.match(/\/video\/([a-zA-Z0-9]+)/);
                            const dmId = match ? match[1] : '';
                            return (
                              <iframe
                                src={`https://www.dailymotion.com/embed/video/${dmId}?autoplay=1`}
                                title={activePastStream.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ width: '100%', height: '100%', border: 'none' }}
                              />
                            );
                          } else {
                            return (
                              <video
                                ref={pastStreamVideoRef}
                                src={activePastStream.video_url}
                                controls
                                autoPlay
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onTimeUpdate={(e) => {
                                  const videoEl = e.currentTarget;
                                  setCurrentTime(videoEl.currentTime);
                                  const limit = activePastStream.preview_duration ? Number(activePastStream.preview_duration) : 30;
                                  if (
                                    !isOwnProfile &&
                                    !effectiveIsSubscribed &&
                                    !purchasedVideoIds.includes(activePastStream.id) &&
                                    activePastStream.price > 0 &&
                                    videoEl.currentTime >= limit
                                  ) {
                                    videoEl.pause();
                                    setIsPastStreamPreviewExpired(true);
                                  }
                                }}
                              />
                            );
                          }
                        })()
                      )}

                      {/* Preview Overlay Indicator */}
                      {!isOwnProfile &&
                       !effectiveIsSubscribed &&
                       !purchasedVideoIds.includes(activePastStream.id) &&
                       activePastStream.price > 0 &&
                       !isPastStreamPreviewExpired && (
                         <div style={{
                           position: 'absolute',
                           top: 20,
                           left: 20,
                           background: 'rgba(255, 0, 85, 0.85)',
                           padding: '6px 14px',
                           borderRadius: '8px',
                           color: '#fff',
                           fontWeight: 'bold',
                           fontSize: '12px',
                           zIndex: 5,
                           border: '1px solid rgba(255,255,255,0.2)',
                           backdropFilter: 'blur(10px)'
                         }}>
                           {(() => {
                             const videoUrl = activePastStream.video_url || '';
                             const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
                             const isDailymotion = videoUrl.includes('dailymotion.com') || videoUrl.includes('dai.ly');
                             const isIframe = isYouTube || isDailymotion;
                             const limit = activePastStream.preview_duration ? Number(activePastStream.preview_duration) : 30;
                             const displayTime = isIframe
                               ? pastStreamPreviewTimeLeft
                               : Math.max(0, limit - Math.floor(currentTime));
                             return `PREVIEW PLAYING: ${displayTime}s REMAINING`;
                           })()}
                         </div>
                       )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Add/Edit Replay CRUD Modal ── */}
            <AnimatePresence>
              {isCrudModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: 'rgba(5, 5, 8, 0.85)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    style={{
                      width: '100%',
                      maxWidth: '520px',
                      background: '#0c0c0e',
                      borderRadius: '24px',
                      border: `1px solid ${accent}33`,
                      boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 40px ${accent}0b`,
                      overflow: 'hidden'
                    }}
                  >
                    <form onSubmit={handleSaveCrud} style={{ display: 'flex', flexDirection: 'column' }}>
                      {/* Modal Header */}
                      <div style={{
                        padding: '18px 24px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.2)'
                      }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>
                          {editingVideo ? 'Edit Replay Details' : 'Add Past Stream Replay'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsCrudModalOpen(false)}
                          style={{
                            background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px'
                          }}
                          onMouseOver={e => e.currentTarget.style.color = '#fff'}
                          onMouseOut={e => e.currentTarget.style.color = '#888'}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Modal Body */}
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
                        
                        {/* Title */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Replay Title</label>
                          <input
                            type="text"
                            required
                            value={crudTitle}
                            onChange={e => setCrudTitle(e.target.value)}
                            placeholder="e.g. Live Stream Replay - DJ Set #12"
                            style={{
                              padding: '12px 14px',
                              background: 'rgba(0,0,0,0.4)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '10px',
                              color: '#fff',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                        </div>

                        {/* Price & Preview Duration Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>PPV Price ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={crudPrice}
                              onChange={e => setCrudPrice(e.target.value)}
                              placeholder="5.00"
                              style={{
                                padding: '12px 14px',
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Free Preview Limit (s)</label>
                            <input
                              type="number"
                              required
                              value={crudPreviewDuration}
                              onChange={e => setCrudPreviewDuration(e.target.value)}
                              placeholder="30"
                              style={{
                                padding: '12px 14px',
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>

                        {/* Video Source Type Selector */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Video Source Type</label>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              type="button"
                              onClick={() => setCrudVideoSourceType('upload')}
                              style={{
                                flex: 1,
                                padding: '10px',
                                background: crudVideoSourceType === 'upload' ? `${accent}22` : 'rgba(0,0,0,0.3)',
                                border: `1px solid ${crudVideoSourceType === 'upload' ? accent : 'rgba(255,255,255,0.1)'}`,
                                color: crudVideoSourceType === 'upload' ? '#fff' : 'var(--text-secondary)',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}
                            >
                              Upload File
                            </button>
                            <button
                              type="button"
                              onClick={() => setCrudVideoSourceType('url')}
                              style={{
                                flex: 1,
                                padding: '10px',
                                background: crudVideoSourceType === 'url' ? `${accent}22` : 'rgba(0,0,0,0.3)',
                                border: `1px solid ${crudVideoSourceType === 'url' ? accent : 'rgba(255,255,255,0.1)'}`,
                                color: crudVideoSourceType === 'url' ? '#fff' : 'var(--text-secondary)',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}
                            >
                              URL Link
                            </button>
                          </div>
                        </div>

                        {/* Video Input depending on source type */}
                        {crudVideoSourceType === 'upload' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                              {editingVideo && !crudVideoFile ? 'Replace Video File (Optional)' : 'Select Video File'}
                            </label>
                            <input
                              type="file"
                              accept="video/*"
                              required={!editingVideo}
                              onChange={e => setCrudVideoFile(e.target.files?.[0] || null)}
                              style={{
                                padding: '10px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px dashed rgba(255,255,255,0.15)',
                                borderRadius: '10px',
                                color: 'var(--text-secondary)',
                                fontSize: '13px',
                                cursor: 'pointer'
                              }}
                            />
                            {editingVideo && !crudVideoFile && (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Currently: {editingVideo.video_url?.split('/').pop()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Video Stream / Embed URL</label>
                            <input
                              type="url"
                              required
                              value={crudVideoUrl}
                              onChange={e => setCrudVideoUrl(e.target.value)}
                              placeholder="https://cdn.example.com/stream.mp4 or YouTube link"
                              style={{
                                padding: '12px 14px',
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                            />
                          </div>
                        )}

                        {/* Cover Thumbnail Input */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Replay Cover Image (File Upload)</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => setCrudImageFile(e.target.files?.[0] || null)}
                              style={{
                                padding: '10px',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px dashed rgba(255,255,255,0.15)',
                                borderRadius: '10px',
                                color: 'var(--text-secondary)',
                                fontSize: '13px',
                                cursor: 'pointer'
                              }}
                            />
                          </div>
                          
                          {/* Fallback URL for Cover Image */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Cover Image URL (Optional Fallback)</label>
                            <input
                              type="url"
                              value={crudImageUrl}
                              onChange={e => setCrudImageUrl(e.target.value)}
                              placeholder="https://images.unsplash.com/... or keep blank for default"
                              style={{
                                padding: '12px 14px',
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>

                        {/* Upload Progress Indicator */}
                        {crudUploadProgress && (
                          <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '8px',
                            padding: '12px',
                            fontSize: '13px',
                            color: accent,
                            fontWeight: 'bold',
                            textAlign: 'center'
                          }}>
                            {crudUploadProgress}
                          </div>
                        )}

                      </div>

                      {/* Modal Footer */}
                      <div style={{
                        padding: '18px 24px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px',
                        background: 'rgba(0,0,0,0.2)'
                      }}>
                        <button
                          type="button"
                          onClick={() => setIsCrudModalOpen(false)}
                          disabled={crudUploading}
                          style={{
                            padding: '10px 20px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '10px',
                            color: 'var(--text-secondary)',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={crudUploading}
                          style={{
                            padding: '10px 24px',
                            background: crudUploading ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${accent}, #8A2BE2)`,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            cursor: crudUploading ? 'not-allowed' : 'pointer',
                            boxShadow: crudUploading ? 'none' : `0 4px 15px rgba(138,43,226,0.3)`
                          }}
                        >
                          {crudUploading ? 'Processing...' : editingVideo ? 'Save Changes' : 'Publish Replay'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
  );
};
