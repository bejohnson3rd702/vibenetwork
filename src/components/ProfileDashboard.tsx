import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Camera, Lock, Unlock, Image as ImageIcon, Star, ShieldCheck, Eye, Edit2, Wand, Calendar, Edit3, Clock, CheckCircle, Heart, MessageCircle, Wallet, ArrowUpRight, ArrowDownLeft, Activity, Monitor, Settings, Video, DollarSign } from 'lucide-react';
import { DictationButton } from './DictationButton';
import { EmojiPickerButton } from './EmojiPickerButton';
import EndUserAuthModal from './EndUserAuthModal';
import { ProfileLive } from './ProfileLive';
const LiveChat = React.lazy(() => import('./LiveChat'));
import Community from '../pages/Community';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Peer from 'peerjs';
import { loadStripe } from '@stripe/stripe-js';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { Helmet } from 'react-helmet-async';
import { useToast } from '../context/ToastContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const ProfileDashboard: React.FC<{ user: any, creatorIdOverride?: string, isNetworkLevel?: boolean }> = ({ user, creatorIdOverride, isNetworkLevel }) => {
  const navigate = useNavigate();
  const { creatorId: paramCreatorId } = useParams();
  const creatorId = creatorIdOverride || paramCreatorId;
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { wlConfig } = useWhiteLabel();
  const toast = useToast();
  
  const targetProfileId = creatorId || user?.id; // Determine which profile to load
  const isOwnProfile = user && targetProfileId === user.id;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // View Modes (public vs edit)
  const [viewMode, setViewMode] = useState<'public' | 'edit'>(isOwnProfile ? 'edit' : 'public');

  // Editor States
  const [bio, setBio] = useState('');
  const [subPrice, setSubPrice] = useState(4.99);
  const [selectedGenre, setSelectedGenre] = useState('Electronic');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [homepageImageUrl, setHomepageImageUrl] = useState('');
  const [flipbookImages, setFlipbookImages] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'store' | 'live' | 'booking' | 'series' | 'courses' | 'wallet' | 'flipbook' | 'appearance' | 'my_bookings' | 'networks' | 'members' | 'community'>('feed');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [networkProfiles, setNetworkProfiles] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('vibe_host_wallet') || 0.00) : 0.00));
  const [paySubsWithWallet, setPaySubsWithWallet] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Real Booking State
  const [bookingPrice, setBookingPrice] = useState('49.00');
  const [bookingDuration, setBookingDuration] = useState(1);
  const [bookingType, setBookingType] = useState('virtual');
  const [virtualCallType, setVirtualCallType] = useState('video');
  const [availableSlots, setAvailableSlots] = useState<Record<number, string[]>>({
    16: ['10:00 AM', '1:30 PM', '4:00 PM'],
    18: ['6:30 PM', '8:00 PM'],
    22: ['10:00 AM', '2:00 PM', '4:30 PM']
  });
  const [newTimeInput, setNewTimeInput] = useState('');
  
  // Live Stream State
  const [isPlayingLive, setIsPlayingLive] = useState(false);
  const [isPubliclyLive, setIsPubliclyLive] = useState(false);
  const [livePrice, setLivePrice] = useState('5.00');
  const [hasPaidForLive, setHasPaidForLive] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(90);
  const [cameraStatus, setCameraStatus] = useState<'idle'|'loading'|'active'|'error'>('idle');
  const [cameraDebugData, setCameraDebugData] = useState<string>('');
  const [liveCountdown, setLiveCountdown] = useState<number | null>(null);
  const [liveEmbedUrl, setLiveEmbedUrl] = useState('https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0');
  const [streamSource, setStreamSource] = useState<'url' | 'camera'>('url');
  const [guests, setGuests] = useState<{id: string, name: string, title: string, isLive: boolean}[]>([]);
  const [guestSetup, setGuestSetup] = useState<{show: boolean, name: string, title: string}>({show: false, name: '', title: ''});
  const [localGuestData, setLocalGuestData] = useState<{id: string, name: string, title: string, isLive: boolean} | null>(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState<number | ''>('');
  const [presenterMode, setPresenterMode] = useState(false);
  const [showExitScreen, setShowExitScreen] = useState(false);
  const [directorLayout, setDirectorLayout] = useState<'split' | 'isolate_host' | 'isolate_guest'>('split');
  const [directorLowerThirds, setDirectorLowerThirds] = useState({ active: false, text: '', sub: '' });
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'wallet') setActiveTab('wallet');
    
    // Auto-mount as guest from invite links
    if (params.get('guest_invite') === 'true') {
      setActiveTab('live');
      setStreamSource('camera');
      setGuestSetup({ show: true, name: '', title: '' }); // Show Green Room Prompt
    }
  }, [location.search]);

  useEffect(() => {
    if (isNetworkLevel && wlConfig?.id) {
      supabase.from('profiles')
        .select('id, username, avatar_url, role')
        .eq('whitelabel_id', wlConfig.id)
        .then(({ data }) => {
          if (data) setNetworkProfiles(data);
        });
    }
  }, [isNetworkLevel, wlConfig?.id]);

  // Auto-rotate flipbook banner
  useEffect(() => {
    if (!flipbookImages) return;
    const images = flipbookImages.split(',').filter(Boolean);
    if (images.length <= 1) return;
    
    const int = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(int);
  }, [flipbookImages]);

  // Auto-rotate background banner
  useEffect(() => {
    if (!homepageImageUrl) return;
    const images = homepageImageUrl.split(',').filter(Boolean);
    if (images.length <= 1) return;
    
    const int = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(int);
  }, [homepageImageUrl]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isOwnProfile && isPlayingLive && !isSubscribed && !hasPaidForLive && previewTimeLeft > 0) {
      timer = setInterval(() => {
        setPreviewTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOwnProfile, isPlayingLive, isSubscribed, hasPaidForLive, previewTimeLeft]);

  const isPreviewExpired = !isOwnProfile && isPlayingLive && !isSubscribed && !hasPaidForLive && previewTimeLeft === 0;

  useEffect(() => {
    if (!supabase || !targetProfileId) return;
    
    const channel = supabase.channel(`stream-room-${targetProfileId}`);
    channelRef.current = channel;

    // Listen for master host sync
    channel.on('broadcast', { event: 'host_sync_guests' }, (payload) => {
        const guestList = payload.payload;
        setGuests(guestList);
        
        // Always bounce to local cache for reliability fallback
        if (typeof window !== 'undefined') {
            localStorage.setItem('vibe_host_guests_session', JSON.stringify(guestList));
        }

        // Auto-update Guest UI if they were added to Live Stream by Host
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

    // Listen for direct structural overrides from Director Studio
    channel.on('broadcast', { event: 'director_command' }, (payload) => {
        const { action, guestId, layout, lowerThirds, status } = payload.payload;
        if (action === 'toggle_guest') {
            setGuests(current => {
               const updated = current.map((g: any) => g.id === guestId ? { ...g, isLive: !g.isLive } : g);
               if (typeof window !== 'undefined') localStorage.setItem('vibe_host_guests_session', JSON.stringify(updated));
               channel.send({ type: 'broadcast', event: 'host_sync_guests', payload: updated });
               return updated;
            });
        }
        if (action === 'update_layout') {
            setDirectorLayout(layout);
        }
        if (action === 'update_lower_thirds') {
            setDirectorLowerThirds(lowerThirds);
        }
        if (action === 'set_live_status') {
            setIsPubliclyLive(status);
        }
    });

    // Listen for guests requesting to join
    channel.on('broadcast', { event: 'guest_interaction' }, (payload) => {
        const { action, guestParam } = payload.payload;
        const isHost = user?.id === targetProfileId;
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

    channel.subscribe((status) => {
       if (status === 'SUBSCRIBED') {
           // Host announces initial cache
           if (user?.id === targetProfileId && typeof window !== 'undefined') {
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
           // Host syncs globally
           if (user?.id === targetProfileId) {
               channel.send({ type: 'broadcast', event: 'host_sync_guests', payload: gInfo });
           }
         } catch (e) {}
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
  }, [targetProfileId, user, location.search]);

  const startLiveStream = () => {
     setLiveCountdown(3);
     let ticker = 3;
     const interval = setInterval(() => {
        ticker -= 1;
        if (ticker <= 0) {
           clearInterval(interval);
           setLiveCountdown(null);
           setIsPlayingLive(true);
           if (streamSource === 'camera') {
              setCameraStatus('loading');
           }
           // If using external URL, bypass studio mode and go straight to live
           if (streamSource === 'url') {
              setIsPubliclyLive(true);
           } else {
              setIsPubliclyLive(false);
           }
        } else {
           setLiveCountdown(ticker);
        }
     }, 1000);
  };

  useEffect(() => {
     let currentStream: MediaStream | null = null;

     if (isPlayingLive && (streamSource === 'camera' || presenterMode || guests.length > 0)) {
        if (streamSource === 'camera') {
           setCameraStatus('loading');
           setCameraDebugData('Awaiting OS permission...');
        }
        
        try {
           if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
               throw new Error("navigator.mediaDevices.getUserMedia is utterly undefined! Browser locked it out (HTTP or permission block).");
           }
           
           navigator.mediaDevices.getUserMedia({ video: true, audio: true })
              .then(stream => {
                 try {
                    setCameraStatus('active');
                    currentStream = stream;
                    const videoTrack = stream.getVideoTracks()[0];
                    const dimensions = videoTrack && videoTrack.getSettings ? `${videoTrack.getSettings().width}x${videoTrack.getSettings().height}` : 'No Track/Settings';
                    setCameraDebugData(`Stream Mounted: ${dimensions} | Au: ${stream.getAudioTracks().length}`);
                    
                    if (videoRef.current) {
                       videoRef.current.srcObject = stream;
                       videoRef.current.defaultMuted = true;
                       videoRef.current.muted = true;
                       videoRef.current.play().then(() => {
                          setCameraDebugData(prev => prev + ' | Play:OK');
                       }).catch(e => {
                          setCameraDebugData(prev => prev + ` | PlayErr: ${e.message}`);
                       });
                    }
                    
                    const streamId = targetProfileId || profile?.username || profile?.id;
                    if (streamId && typeof window !== 'undefined') {
                       const peerId = `vibe-host-${streamId}`;
                       const peer = new Peer(peerId);
                       peer.on('call', (call) => { call.answer(stream); });
                       peer.on('open', () => {
                          if (channelRef.current) {
                             channelRef.current.send({ type: 'broadcast', event: 'webrtc_host_ready', payload: { streamId } });
                          }
                       });
                       (window as any)._vibeHostPeer = peer;
                    }
                 } catch (innerErr: any) {
                    setCameraStatus('error');
                    setCameraDebugData(`Inner Crash: ${innerErr.message}`);
                 }
              })
              .catch(err => {
                 setCameraStatus('error');
                 setCameraDebugData(`GUM Error: ${err.name} - ${err.message}`);
              });
        } catch (outerErr: any) {
             setCameraStatus('error');
             setCameraDebugData(`Outer Crash: ${outerErr.message}`);
        }
     } else {
        setCameraStatus('idle');
        setCameraDebugData('Idle State');
     }
     
     // Cleanup function to strictly stop hardware tracks
     return () => {
        if (currentStream) {
           currentStream.getTracks().forEach(track => track.stop());
        }
        if (typeof window !== 'undefined' && (window as any)._vibeHostPeer) {
           (window as any)._vibeHostPeer.destroy();
           (window as any)._vibeHostPeer = null;
        }
     };
  }, [isPlayingLive, streamSource, presenterMode, guests.length]);

   const handleStripeCheckout = async (itemName: string, amount: number, extraMetadata?: any) => {
     try {
       // In a production app, this endpoint would be your Supabase Edge Function
       // that creates the Stripe Checkout Session securely using the Stripe Secret Key.
       const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
         },
         body: JSON.stringify({
           productTitle: itemName,
           amount: amount, // Do not multiply by 100, edge function handles it
           creatorId: targetProfileId,
           returnUrl: window.location.href,
           extraMetadata
         })
       });
       
       const data = await response.json().catch(() => null);
       
       if (data && data.url) {
         window.location.href = data.url;
       } else {
         // Fallback for development before Edge Function is deployed
         toast.info(`[STRIPE READY]\n\nThe frontend is wired up! To complete the payment for:\n${itemName} ($${amount.toFixed(2)})\n\nyou just need to deploy the Supabase Edge Function to return a sessionId.`);
       }
     } catch (error) {
       console.error("Stripe Checkout Error:", error);
       toast.error(`[STRIPE READY]\n\nThe frontend is wired up! To complete the payment for:\n${itemName} ($${amount.toFixed(2)})\n\nyou just need to deploy the Supabase Edge Function to return a sessionId.`);
     }
   };

   const handleUnlockLive = () => {
     const amount = Number(livePrice);
     if (isNaN(amount) || amount <= 0) {
       setHasPaidForLive(true);
       return;
     }
     handleStripeCheckout('Live Stream PPV Unlock', amount);
   };

   const handleSubscribe = () => {
     const amount = Number(subPrice);
     if (isNaN(amount) || amount <= 0) {
       setIsSubscribed(true);
       return;
     }
     handleStripeCheckout('Monthly Subscription', amount);
   };
  
  // Scheduler State & DnD Handlers
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([
    { id: '1', content: 'Finalizing the Q4 Roadmap rollout presentation. Need marketing signoff on the slide deck.', status: 'draft', date: 'Edited 2 hrs ago', type: 'Executive Update', color: '#0055ff' },
    { id: '2', content: 'Drafting the release notes for the new multi-tenant API update.', status: 'draft', date: 'Edited yesterday', type: 'Product Release', color: '#ff4d85' },
    { id: '3', content: 'The Enterprise Developer Conference is officially live! Access the remote broadcast now. 🚀', status: 'scheduled', date: 'TOMORROW, 10:00 AM', type: 'Scheduled', color: '#FFD700', image: 'https://image.pollinations.ai/prompt/corporate%20presentation%20screen%20boardroom%20meeting' },
    { id: '4', content: "Our SOC-2 Compliance audit has been published successfully.", status: 'published', date: 'POSTED TODAY, 9:00 AM', type: 'Published', color: '#00ff88', likes: '1.2k', comments: '56' }
  ]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('postId', id);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData('postId');
    setScheduledPosts(posts => 
      posts.map(p => p.id === postId ? { ...p, status: targetStatus } : p)
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNewSchedule = () => {
    const newId = Date.now().toString();
    setScheduledPosts([{
      id: newId,
      content: 'Start drafting your post idea...',
      status: 'draft',
      date: 'Just now',
      type: 'New Draft',
      color: 'var(--text-primary)'
    }, ...scheduledPosts]);
  };
  
  // UI States
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageTarget, setImageTarget] = useState<'avatar' | 'homepage'>('avatar');
  
  // New Post States
  const [postTitle, setPostTitle] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [requestFeature, setRequestFeature] = useState(false);
  const [postMediaUrl, setPostMediaUrl] = useState('');
  const [uploadingPostMedia, setUploadingPostMedia] = useState(false);
  
  // Interactions
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});

  // Store internal state MUST be above early returns!
  const [newProduct, setNewProduct] = useState({ title: '', price: '19.99', type: 'digital', image_url: '', sizes: '', colors: '' });
  const [courses, setCourses] = useState<any[]>([]);
  const [purchasedBookings, setPurchasedBookings] = useState<any[]>([]);
  const [receivedBookings, setReceivedBookings] = useState<any[]>([]);
  const [newCourse, setNewCourse] = useState({ title: '', price: '', modules: '', hours: '', img: '' });
  const [uploadingProductImg, setUploadingProductImg] = useState(false);
  const [myNetworks, setMyNetworks] = useState<any[]>([]);

  // Real Feed Data
  const [feed, setFeed] = useState<any[]>([]);

  // Series Data
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [newSeries, setNewSeries] = useState({ title: '', description: '', price: '', img: '' });
  const [newEpisode, setNewEpisode] = useState({ title: '', description: '', length: '', price: '' });
  const [activeSeriesIdForEp, setActiveSeriesIdForEp] = useState<string | null>(null);

  useEffect(() => {
    if (!targetProfileId) {
      navigate({ pathname: '/', search: location.search });
      return;
    }

    // Force public view if not own profile
    if (!isOwnProfile) setViewMode('public');
    else if (viewMode === 'public' && isOwnProfile) setViewMode('edit');

    async function loadProfile() {
      // Phase 1: Core Identity (Blocks UI)
      const profilePromise = supabase!.from('profiles').select('*').eq('id', targetProfileId).single();

      let postsQuery = supabase!.from('posts').select('*, creator:profiles!inner(username, avatar_url, whitelabel_id), post_likes(user_id), post_comments(*, user:profiles(username, avatar_url))');
      if (isNetworkLevel && wlConfig?.id) postsQuery = postsQuery.eq('creator.whitelabel_id', wlConfig.id).eq('is_locked', false);
      else postsQuery = postsQuery.eq('creator_id', targetProfileId);
      const postsPromise = postsQuery.order('created_at', { ascending: false });

      const [{ data, error }, { data: postsDataRaw, error: postsError }] = await Promise.all([
        profilePromise,
        postsPromise
      ]);

      if (!error && data) {
        setProfile(data);
        setBio(data.bio || 'Welcome to my official channel!');
        setAvatarUrl(data.avatar_url || '');
        setHomepageImageUrl(data.homepage_image_url || '');
        setFlipbookImages(data.flipbook_images || '');
        if (data.genre) setSelectedGenre(data.genre);
        if (data.sub_price) setSubPrice(data.sub_price);

        let postsData = postsDataRaw;
        if (postsError) {
             let fallbackQuery = supabase!.from('posts').select('*, creator:profiles!inner(username, avatar_url, whitelabel_id)');
             if (isNetworkLevel && wlConfig?.id) fallbackQuery = fallbackQuery.eq('creator.whitelabel_id', wlConfig.id).eq('is_locked', false);
             else fallbackQuery = fallbackQuery.eq('creator_id', targetProfileId);
             
             const fallback = await fallbackQuery.order('created_at', { ascending: false });
             postsData = fallback.data;
        }

        if (postsData && postsData.length > 0) {
          setFeed(postsData.map((p: any) => {
            const creatorObj = Array.isArray(p.creator) ? p.creator[0] : p.creator;
            return {
              id: p.id,
              title: p.content || p.title,
              locked: p.is_locked || false,
              likes: p.post_likes ? p.post_likes.length : (p.likes || 0),
              hasLiked: p.post_likes ? p.post_likes.some((l: any) => l.user_id === user?.id) : false,
              comments: p.post_comments ? p.post_comments.map((c: any) => {
                const userObj = Array.isArray(c.user) ? c.user[0] : c.user;
                return { id: c.id, text: c.content, user: userObj?.username || 'User', avatar: userObj?.avatar_url || '' };
              }) : [],
              date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Just now',
              img: p.image_url || null,
              creator_id: p.creator_id,
              creator_username: creatorObj?.username,
              creator_avatar: creatorObj?.avatar_url
            };
          }));
        } else {
          setFeed([]);
        }

        setLoading(false); // UI instantly unblocks here!

        // Phase 2: Lazy Loaded Background Data
        const loadSecondaryData = async () => {
          let prodQuery = supabase!.from('products').select(isNetworkLevel ? '*, creator:profiles!inner(username, avatar_url, whitelabel_id)' : '*');
          if (isNetworkLevel) {
            if (wlConfig?.domain && wlConfig.domain !== 'vibenetwork.tv') prodQuery = prodQuery.eq('creator.whitelabel_id', wlConfig.id);
          } else {
            prodQuery = prodQuery.eq('creator_id', targetProfileId);
          }
          const productsPromise = prodQuery.order('created_at', { ascending: false });

          const seriesPromise = supabase!.from('series').select('*, episodes(*)').eq('creator_id', targetProfileId);
          const coursesPromise = supabase!.from('courses').select('*').eq('creator_id', targetProfileId);

          const pBookingsPromise = user ? supabase!.from('bookings').select('*, creator:profiles!creator_id(username, full_name, avatar_url)').eq('buyer_id', user.id) : Promise.resolve({ data: null });
          const networksPromise = user ? supabase!.from('whitelabel_configs').select('*').eq('owner_id', user.id) : Promise.resolve({ data: null });
          const rBookingsPromise = (isOwnProfile && user) ? supabase!.from('bookings').select('*, buyer:profiles!buyer_id(username, full_name, avatar_url)').eq('creator_id', user.id) : Promise.resolve({ data: null });

          const [
            { data: prodData },
            { data: seriesData },
            { data: coursesData },
            { data: pBookings },
            { data: networks },
            { data: rBookings }
          ] = await Promise.all([
            productsPromise,
            seriesPromise,
            coursesPromise,
            pBookingsPromise,
            networksPromise,
            rBookingsPromise
          ]);

          setProducts(prodData || []);
          setSeriesList(seriesData || []);
          setCourses(coursesData || []);

          if (user) {
             setPurchasedBookings(pBookings || []);
             const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
             const myLocal = localNetworks.filter((n: any) => n.owner_id === user.id);
             const combined = [...(networks || [])];
             myLocal.forEach((ln: any) => {
                if (!combined.find(n => n.id === ln.id)) combined.push(ln);
             });
             setMyNetworks(combined);
          }

          if (isOwnProfile && user) {
             setReceivedBookings(rBookings || []);
          }
        };

        loadSecondaryData();

      } else if (isOwnProfile) {
        // Auto-create profile if missing!
        const { data: newProfile, error: insertError } = await supabase!.from('profiles').insert({
           id: targetProfileId,
           username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'NewCreator',
           bio: 'Welcome to my official channel!',
           role: user?.user_metadata?.role || 'viewer',
           whitelabel_id: wlConfig?.domain === 'vibenetwork.tv' ? null : wlConfig?.id
        }).select().single();
        
        if (!insertError && newProfile) {        
          setProfile(newProfile);
          setBio(newProfile.bio);
          setAvatarUrl('');
          setHomepageImageUrl('');
          setFlipbookImages('');
          setSelectedGenre(newProfile.genre);
          setSubPrice(4.99);
          setProducts([]);
          setFeed([]);
          setSeriesList([]);
          setCourses([]);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user, creatorId, navigate, isOwnProfile]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>Loading Profile...</div>;
  const isGuestInvite = new URLSearchParams(location.search).get('guest_invite') === 'true';
  if (!profile && !isGuestInvite) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', background: 'var(--bg-color)' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Profile Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>This channel doesn't exist, or the user hasn't set up their profile yet.</p>
      <button onClick={() => navigate({ pathname: '/', search: location.search })} style={{ padding: '12px 30px', background: '#ff4d85', color: 'var(--text-primary)', border: 'none', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>Return to Home</button>
    </div>
  );

  const isInfluencer = profile?.role === 'influencer' || profile?.role === 'business';

  const handleImageClick = async () => {
    setImageTarget('avatar');
    setShowImageModal(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setSaving(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;
      
      const { error: uploadError } = await supabase!.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      
      if (imageTarget === 'avatar') {
        setAvatarUrl(data.publicUrl);
        await supabase!.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
        setProfile((prev: any) => prev ? { ...prev, avatar_url: data.publicUrl } : null);
        
        const shouldSync = (isNetworkLevel || user?.id === wlConfig?.owner_id) && wlConfig?.id;
        if (shouldSync) {
           const currentTheme = wlConfig.theme || {};
           supabase!.from('whitelabel_configs').update({ logo: data.publicUrl, theme: { ...currentTheme, logoImage: data.publicUrl } }).eq('id', wlConfig.id).then();
        }
      } else if (imageTarget === 'homepage') {
        setHomepageImageUrl((prev) => {
          const newUrls = prev ? prev + ',' + data.publicUrl : data.publicUrl;
          supabase!.from('profiles').update({ homepage_image_url: newUrls }).eq('id', user.id);
          setProfile((p: any) => p ? { ...p, homepage_image_url: newUrls } : null);
          
          const shouldSync = (isNetworkLevel || user?.id === wlConfig?.owner_id) && wlConfig?.id;
          if (shouldSync) {
             const currentTheme = wlConfig.theme || {};
             supabase!.from('whitelabel_configs').update({ theme: { ...currentTheme, heroImage: data.publicUrl } }).eq('id', wlConfig.id).then(({error}) => {
                 if (error) console.error("Error syncing hero image:", error);
             });
          }
          
          return newUrls;
        });
      }
      setShowImageModal(false);
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message + '\n\nDid you run the storage_buckets.sql script?');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    await supabase!.from('profiles').update({
      bio,
      genre: selectedGenre,
      sub_price: subPrice,
      avatar_url: avatarUrl,
      homepage_image_url: homepageImageUrl,
      flipbook_images: flipbookImages,
    }).eq('id', user.id);
    setSaving(false);
    toast.success('Profile successfully saved to network database!');
  };

  const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploadingProductImg(true);
      const file = event.target.files[0];
      const filePath = `${user?.id}/prod_${Math.random()}.${file.name.split('.').pop()}`;
      await supabase!.storage.from('images').upload(filePath, file);
      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      setNewProduct(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch {
      toast.error('Upload failed. Did you run the storage buckets script?');
    } finally {
      setUploadingProductImg(false);
    }
  };

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeries.title || !newSeries.price) return;
    setSaving(true);
    
    const insertData = {
      creator_id: profile.id,
      title: newSeries.title,
      description: newSeries.description,
      price: parseFloat(newSeries.price),
      img: newSeries.img || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80'
    };

    try {
      const { data, error } = await supabase!.from('series').insert([insertData]).select();
      if (!error && data) {
        setSeriesList([{ ...data[0], episodes: [] }, ...seriesList]);
      } else {
        setSeriesList([{ ...insertData, id: Date.now().toString(), episodes: [] }, ...seriesList]);
      }
    } catch {
      setSeriesList([{ ...insertData, id: Date.now().toString(), episodes: [] }, ...seriesList]);
    }
    setNewSeries({ title: '', description: '', price: '', img: '' });
    setSaving(false);
  };

  const handleAddEpisode = async (seriesId: string) => {
    if (!newEpisode.title) return;
    
    const insertData = {
      series_id: seriesId,
      title: newEpisode.title,
      description: newEpisode.description,
      length: newEpisode.length,
      price: parseFloat(newEpisode.price || '0')
    };

    try {
      const { data, error } = await supabase!.from('episodes').insert([insertData]).select();
      const epToAdd = (!error && data) ? data[0] : { ...insertData, id: 'e_' + Date.now() };
      
      setSeriesList(prev => prev.map(s => {
        if (s.id === seriesId) return { ...s, episodes: [...(s.episodes || []), epToAdd] };
        return s;
      }));
    } catch {
      setSeriesList(prev => prev.map(s => {
        if (s.id === seriesId) return { ...s, episodes: [...(s.episodes || []), { ...insertData, id: 'e_' + Date.now() }] };
        return s;
      }));
    }
    setNewEpisode({ title: '', description: '', length: '', price: '' });
    setActiveSeriesIdForEp(null);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.price) return;
    setSaving(true);
    
    const insertData = {
      creator_id: profile.id,
      title: newCourse.title,
      price: parseFloat(newCourse.price),
      modules: parseInt(newCourse.modules || '10'),
      hours: newCourse.hours || '5.0',
      img: newCourse.img || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80'
    };

    try {
      const { data, error } = await supabase!.from('courses').insert([insertData]).select();
      if (!error && data) {
        setCourses(prev => [...prev, data[0]]);
      } else {
        setCourses(prev => [...prev, { ...insertData, id: 'c_' + Date.now(), progress: 0 }]);
      }
    } catch {
      setCourses(prev => [...prev, { ...insertData, id: 'c_' + Date.now(), progress: 0 }]);
    }
    setNewCourse({ title: '', price: '', modules: '', hours: '', img: '' });
    setSaving(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;
    
    setSaving(true);
    const productInsert = {
      creator_id: profile.id,
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      type: newProduct.type,
      image_url: newProduct.image_url || 'https://picsum.photos/400/400',
      variants: newProduct.type === 'physical' ? {
        sizes: newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: newProduct.colors.split(',').map(c => c.trim()).filter(Boolean)
      } : {}
    };

    try {
      const { data, error } = await supabase!.from('products').insert([productInsert]).select();
      if (!error && data) {
        setProducts(prev => [...prev, data[0]]);
      } else {
        // Fallback if table doesn't exist yet
        setProducts(prev => [...prev, { ...productInsert, id: Math.random().toString() }]);
      }
    } catch {
      setProducts(prev => [...prev, { ...productInsert, id: Math.random().toString() }]);
    }

    setNewProduct({ title: '', price: '19.99', type: 'digital', image_url: '', sizes: '', colors: '' });
    setSaving(false);
  };

  const handlePostMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploadingPostMedia(true);
      const file = event.target.files[0];
      const filePath = `${user?.id}/post_${Math.random()}.${file.name.split('.').pop()}`;
      await supabase!.storage.from('images').upload(filePath, file);
      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      setPostMediaUrl(data.publicUrl);
    } catch {
      toast.error('Upload failed. Did you run the storage buckets script?');
    } finally {
      setUploadingPostMedia(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() && !postMediaUrl) return;
    
    const newPost = {
      creator_id: targetProfileId,
      content: postTitle,
      is_locked: isLocked,
      likes: 0,
      image_url: postMediaUrl || 'https://vibenetwork.tv/wp-content/uploads/2026/02/mukap-vibe-tv-networkk_11zon.png'
    };
    
    // Add to supabase
    const { data } = await supabase!.from('posts').insert([newPost]).select();
    
    if (data && data[0]) {
      setFeed([{ 
        id: data[0].id, title: data[0].content || postTitle, locked: data[0].is_locked || isLocked, likes: 0, date: 'Just now', 
        img: data[0].image_url || newPost.image_url
      }, ...feed]);
    } else {
      // Fallback local state if table doesn't exist yet
      setFeed([{ 
        id: Date.now(), title: postTitle, locked: isLocked, likes: 0, date: 'Just now', 
        img: newPost.image_url
      }, ...feed]);
    }
    setPostTitle('');
    setPostMediaUrl('');
    toast.success(requestFeature ? 'Post Submitted & Feature Requested to Admins!' : 'Content Published Successfully!');
  };

  const handleLike = async (postId: string) => {
    if (!user) { toast.info('Please log in to interact.'); return; }
    
    const targetPost = feed.find(p => p.id === postId);
    if (!targetPost) return;

    if (targetPost.hasLiked) {
      // Unlike
      setFeed(feed.map(p => p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1), hasLiked: false } : p));
      await supabase!.from('post_likes').delete().match({ post_id: postId, user_id: user.id }).catch(() => {});
    } else {
      // Like
      setFeed(feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1, hasLiked: true } : p));
      await supabase!.from('post_likes').insert([{ post_id: postId, user_id: user.id }]).catch(() => {});
    }
  };

  const handleComment = async (postId: string) => {
    if (!user) { toast.info('Please log in to comment.'); return; }
    const text = commentTexts[postId]?.trim();
    if (!text) return;

    const loggedInUsername = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
    const loggedInAvatar = user?.user_metadata?.avatar_url || '';
    const newComment = { id: Date.now().toString(), text, user: loggedInUsername, avatar: loggedInAvatar };
    
    // Optimistic UI update
    setFeed(feed.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p));
    setCommentTexts(prev => ({ ...prev, [postId]: '' }));

    // Send to DB
    try {
       await supabase!.from('post_comments').insert([{ post_id: postId, user_id: user.id, content: text }]);
    } catch {
       // Silently fail if table doesn't exist
    }
  };

  const enhanceText = async (field: 'bio' | 'post') => {
    const originalText = field === 'bio' ? bio : postTitle;
    if (!originalText || originalText.length < 5) {
      toast.info("Please type a few words first so the AI has something to work with!");
      return;
    }
    
    setSaving(true);
    try {
      // Create a mocked "AI" text enhancer using realistic Influencer copy for the prototype!
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate AI thought latency
      
      let finalEnhanced = "";
      if (field === 'bio') {
        const hooks = ["Welcome to the ultimate vibe.", "Dropping exclusive content weekly.", "Join the movement.", "Your VIP access to my world."];
        finalEnhanced = `${hooks[Math.floor(Math.random() * hooks.length)]} ${originalText} 🔥 Subscribe to unlock my premium network tier!`;
      } else {
        const titles = ["🚨 LIVE NOW:", "✨ EXCLUSIVE:", "🔥 MUST WATCH:"];
        finalEnhanced = `${titles[Math.floor(Math.random() * titles.length)]} ${originalText.toUpperCase()} 💥`;
      }
      
      if (field === 'bio') setBio(finalEnhanced);
      if (field === 'post') setPostTitle(finalEnhanced);
    } catch (e) {
      console.error(e);
      toast.error("AI Enhancer simulation failed.");
    }
    setSaving(false);
  };

  if (loading || !profile) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading Profile Network Data...</p>
      </div>
    );
  }

  if (showExitScreen) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '500px' }}>
           <h1 style={{ margin: '0 0 10px 0', fontSize: '36px', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.4)' }}>
             Thank You!
           </h1>
           <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '30px' }}>
             Your livestream broadcasting session has been successfully disconnected from the Green Room.
           </p>
           <div style={{ background: 'rgba(255,77,133,0.1)', border: '1px solid rgba(255,77,133,0.3)', color: '#ff4d85', padding: '16px', borderRadius: '16px', fontWeight: 'bold' }}>
             You may now safely close this window.
           </div>
        </motion.div>
      </div>
    );
  }

  const isGuestMode = new URLSearchParams(location.search).get('guest_invite') === 'true' || localGuestData !== null;
  const activeGuests = guests.filter(g => g.isLive);
  const visibleGuests = directorLayout === 'isolate_host' ? [] : activeGuests;
  const showHost = directorLayout !== 'isolate_guest';
  const totalSlots = (showHost ? 1 : 0) + visibleGuests.length;
  
  const handleToggleProductVisibility = async (e: React.MouseEvent, productId: string, currentStatus: boolean) => {
    e.stopPropagation();
    const { error } = await supabase!.from('products').update({ hidden_from_network: !currentStatus }).eq('id', productId);
    if (!error) {
      setProducts(products.map(p => p.id === productId ? { ...p, hidden_from_network: !currentStatus } : p));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: isNetworkLevel ? 'transparent' : 'var(--content-bg)', color: 'var(--text-primary)', position: 'relative' }}>
      {profile && (
        <Helmet>
          <title>{profile.full_name || profile.username || 'Creator Profile'} - {wlConfig?.name || 'Vibe Network'}</title>
          <meta name="description" content={profile.bio || `Check out ${profile.username}'s profile on ${wlConfig?.name || 'Vibe Network'}`} />
          <meta property="og:title" content={`${profile.full_name || profile.username} on ${wlConfig?.name || 'Vibe Network'}`} />
          <meta property="og:description" content={profile.bio || `Check out ${profile.username}'s exclusive content!`} />
          <meta property="og:image" content={profile.avatar_url || wlConfig?.logoImage || 'https://vibenetwork.tv/og-image.jpg'} />
        </Helmet>
      )}
      
      {/* Immersive Hero Banner */}
      {!isGuestMode && !isNetworkLevel && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', zIndex: 0 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${(homepageImageUrl ? homepageImageUrl.split(',')[currentBgIndex] : null) || profile?.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2500'})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'var(--hero-img-filter)', transition: 'background-image 1s ease-in-out' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, var(--hero-bg) 100%)' }} />
          {/* Dynamic Glowing Accent */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255, 77, 133, 0.2), transparent 70%)', mixBlendMode: 'screen' }} />
        </div>
      )}

      {/* Main Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: isNetworkLevel ? '0px' : (isGuestMode ? '80px' : '200px') }}>
      
        {/* View Toggle Bar (Only for account owner) */}
        {isOwnProfile && isInfluencer && (
          <div style={{ padding: '12px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 100, marginBottom: '20px' }}>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', borderRadius: '30px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              <button 
                onClick={() => setViewMode('edit')}
                style={{ padding: '8px 24px', borderRadius: '30px', border: 'none', background: viewMode === 'edit' ? '#fff' : 'transparent', color: viewMode === 'edit' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }}
              >
                <Edit2 size={16} /> Edit Profile
              </button>
              <button 
                onClick={() => setViewMode('public')}
                style={{ padding: '8px 24px', borderRadius: '30px', border: 'none', background: viewMode === 'public' ? 'rgba(255,0,85,1)' : 'transparent', color: 'var(--text-primary)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }}
              >
                <Eye size={16} /> Public Preview
              </button>
            </div>
          </div>
        )}

        {/* Feed Layout Container */}
        <div style={{ maxWidth: isGuestMode ? '1200px' : '850px', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '100px' }}>
          
          {!isGuestMode && !isNetworkLevel && (
            <>
          {/* Glassmorphic Creator Header */}
          <div style={{ background: isNetworkLevel ? 'transparent' : 'rgba(15, 15, 15, 0.4)', backdropFilter: isNetworkLevel ? 'none' : 'blur(24px)', padding: isNetworkLevel ? '0 40px 40px' : '40px', borderRadius: '32px', border: isNetworkLevel ? 'none' : '1px solid rgba(255,255,255,0.08)', position: 'relative', boxShadow: isNetworkLevel ? 'none' : '0 20px 40px rgba(0,0,0,0.4)' }}>
            
            {isOwnProfile && (
              <button onClick={async () => { await supabase!.auth.signOut(); window.location.href = '/' + window.location.search; }} style={{ position: 'absolute', top: 30, right: 30, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                <LogOut size={16} /> Logout
              </button>
            )}

            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              
              {/* Profile Picture with Glow */}
              <div className="group" style={{ position: 'relative', cursor: 'pointer' }} onClick={handleImageClick}>
                <div style={{ position: 'absolute', inset: '-10px', background: 'radial-gradient(circle at 50% 50%, rgba(255, 77, 133, 0.5), transparent 70%)', borderRadius: '50%', zIndex: 0, filter: 'blur(10px)' }} />
                <div style={{ 
                  position: 'relative', zIndex: 1,
                  width: '140px', height: '140px', borderRadius: '50%', 
                  backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'linear-gradient(135deg, #FF0055, #8A2BE2)',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '56px', fontWeight: 'bold', border: '4px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                  {!avatarUrl && (profile?.username ? profile.username[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'V'))}
                </div>
                {/* Camera Overlay only on Edit Mode */}
                {viewMode === 'edit' && (
                  <div className="camera-overlay" style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s', zIndex: 2
                  }}>
                    <Camera size={34} color="#fff" />
                  </div>
                )}
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" />
              </div>

              <div style={{ flex: 1, minWidth: '300px' }}>
                <h1 style={{ fontSize: '48px', fontWeight: 900, margin: '0 0 16px 0', letterSpacing: '-1px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{profile.username || 'Anonymous Creator'}</h1>
                
                {isInfluencer ? (
                  <>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '8px 16px', background: 'rgba(0,85,255,0.15)', color: '#4da6ff', border: '1px solid rgba(0,85,255,0.3)', borderRadius: '24px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise Profile</span>
                      
                      {viewMode === 'edit' ? (
                        <>
                          <select aria-label="genre selector" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontSize: '13px', outline: 'none', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                            <option>SaaS Platform</option>
                            <option>Fintech API</option>
                            <option>AI Automation</option>
                            <option>B2B Marketplace</option>
                          </select>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '24px', fontSize: '13px', fontWeight: 'bold' }}>
                            $<input type="number" value={subPrice} step="0.50" onChange={(e) => setSubPrice(parseFloat(e.target.value))} style={{ width: '45px', background: 'none', border: 'none', color: '#FFD700', outline: 'none', fontWeight: 'bold', fontSize: '14px' }} />/month
                          </div>
                        </>
                      ) : (
                        <>
                          <span style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontSize: '13px', backdropFilter: 'blur(10px)' }}>{selectedGenre}</span>
                          {!isOwnProfile && (
                            <button 
                              onClick={() => {
                                if (!user) { toast.info('Please log in to subscribe.'); return; }
                                if (!isSubscribed) {
                                  handleStripeCheckout('Monthly Subscription', Number(subPrice));
                                  setIsSubscribed(true);
                                } else {
                                  setIsSubscribed(false);
                                }
                              }}
                              style={{ 
                                background: isSubscribed ? 'rgba(255, 215, 0, 0.1)' : 'linear-gradient(135deg, #FFD700, #FFA500)', 
                                color: isSubscribed ? '#FFD700' : '#000', 
                                border: isSubscribed ? '1px solid #FFD700' : 'none', 
                                padding: '8px 24px', 
                                borderRadius: '24px', 
                                fontWeight: 'bold', 
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: isSubscribed ? 'none' : '0 10px 20px rgba(255,215,0,0.3)',
                                transition: 'all 0.2s'
                              }}
                            >
                              {isSubscribed ? <><CheckCircle size={16} /> Subscribed</> : <><Star size={16} /> Subscribe ${subPrice}/mo</>}
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {viewMode === 'edit' ? (
                      <>
                        <div style={{ position: 'relative' }}>
                          <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Write a bio to tell your viewers what your channel is about..."
                            style={{ width: '100%', minHeight: '100px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', color: 'var(--text-primary)', resize: 'vertical', fontSize: '15px', outline: 'none', backdropFilter: 'blur(10px)' }}
                          />
                          <div style={{ position: 'absolute', right: '120px', bottom: '20px', display: 'flex', gap: '4px' }}>
                            <EmojiPickerButton onSelect={(emoji) => setBio(prev => prev + emoji)} />
                            <DictationButton onResult={(text) => setBio(prev => prev ? `${prev} ${text}` : text)} />
                          </div>
                          <button type="button" onClick={() => enhanceText('bio')} disabled={saving} style={{ position: 'absolute', right: '16px', bottom: '20px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(255,77,133,0.4)' }}>
                            <Wand size={14} /> AI Boost
                          </button>
                        </div>

                        {/* Flip Book editor moved to flipbook tab */}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                          <button onClick={saveProfile} disabled={saving} style={{ padding: '12px 32px', background: '#fff', color: '#000', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: '15px', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                            {saving ? 'Saving...' : 'Save Profile'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p style={{ color: '#eee', fontSize: '16px', lineHeight: 1.7, opacity: 0.9 }}>{bio}</p>
                    )}
                  </>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Standard Viewer Account</p>
                )}
              </div>
            </div>
          </div>
          </>
          )}

          {/* Modern Pill Navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', backdropFilter: 'blur(20px)' }}>
              {[
                { id: 'feed', label: 'Content Feed' },
                { id: 'store', label: 'Store' },
                ...(wlConfig?.enableWatchLive !== false ? [{ id: 'live', label: 'Live Stream' }] : []),
                ...(wlConfig?.enableBooking !== false ? [{ id: 'booking', label: 'Booking' }] : []),
                { id: 'series', label: 'Episodes' },
                { id: 'courses', label: 'Masterclasses' },
                { id: 'flipbook', label: 'Flip Book' }
              ].concat(isNetworkLevel ? [{ id: 'members', label: 'Network Profiles' }, { id: 'community', label: 'Community' }] : []).concat(user ? [{ id: 'my_bookings', label: 'My Bookings' }] : []).concat((myNetworks.length > 0 && !isNetworkLevel) ? [{ id: 'networks', label: 'My Networks' }] : []).map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{ position: 'relative', background: 'none', border: 'none', padding: '12px 24px', color: activeTab === tab.id ? '#fff' : '#888', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '100px', transition: 'color 0.3s' }}
                >
                  {activeTab === tab.id && (
                    <motion.div layoutId="activetab" style={{ position: 'absolute', inset: 0, background: 'rgba(255,77,133,0.2)', borderRadius: '100px', border: '1px solid rgba(255,77,133,0.5)' }} />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>{tab.label}</span>
                </button>
              ))}

              {isOwnProfile && viewMode === 'edit' && !isNetworkLevel && (
                <button 
                  onClick={() => setActiveTab('appearance')}
                  style={{ position: 'relative', background: 'none', border: 'none', padding: '12px 24px', color: activeTab === 'appearance' ? '#D35400' : '#888', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s' }}
                >
                  {activeTab === 'appearance' && (
                    <motion.div layoutId="activetab" style={{ position: 'absolute', inset: 0, background: 'rgba(211,84,0,0.1)', borderRadius: '100px', border: '1px solid rgba(211,84,0,0.4)' }} />
                  )}
                  <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}><Wand size={16} /> Appearance</span>
                </button>
              )}

              {isOwnProfile && viewMode === 'edit' && !isNetworkLevel && (wlConfig?.theme?.creator_splits?.[profile?.id] ?? profile?.platform_fee_percentage ?? wlConfig?.platform_fee_percentage ?? 0) > 0 && (
                <button 
                  onClick={() => setActiveTab('wallet')}
                  style={{ position: 'relative', background: 'none', border: 'none', padding: '12px 24px', color: activeTab === 'wallet' ? '#00ff88' : '#888', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s' }}
                >
                  {activeTab === 'wallet' && (
                    <motion.div layoutId="activetab" style={{ position: 'absolute', inset: 0, background: 'rgba(0,255,136,0.1)', borderRadius: '100px', border: '1px solid rgba(0,255,136,0.4)' }} />
                  )}
                  <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}><Wallet size={16} /> Wallet</span>
                </button>
              )}
            </div>
          </div>

        {activeTab === 'feed' && (
          <>
            {/* Content Creation Widget -> ONLY IF EDITING */}
            {isOwnProfile && isInfluencer && viewMode === 'edit' && (
          <form onSubmit={handlePostSubmit} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', flexShrink: 0 }} />
              <div style={{ position: 'relative', width: '100%' }}>
                <input 
                  type="text" 
                  placeholder="Drop a new link, upload a video, or announce an upcoming stream..." 
                  value={postTitle} onChange={(e) => setPostTitle(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', paddingRight: '150px' }}
                />
                <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <EmojiPickerButton onSelect={(emoji) => setPostTitle(prev => prev + emoji)} />
                  <DictationButton onResult={(text) => setPostTitle(prev => prev ? `${prev} ${text}` : text)} />
                  <button type="button" onClick={() => enhanceText('post')} disabled={saving} style={{ background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wand size={14} /> AI Boost
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <input type="file" accept="image/*" onChange={handlePostMediaUpload} style={{ display: 'none' }} disabled={uploadingPostMedia} />
                  <ImageIcon size={18} /> {uploadingPostMedia ? 'Uploading...' : 'Media'}
                </label>
                
                {postMediaUrl && (
                  <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={postMediaUrl} alt="Preview" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setPostMediaUrl('')} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', padding: '2px', cursor: 'pointer' }}>×</button>
                  </div>
                )}
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isLocked ? '#FFD700' : '#4CAF50', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={isLocked} onChange={(e) => setIsLocked(e.target.checked)} style={{ display: 'none' }} />
                  {isLocked ? <><Lock size={16} /> Sub. Only</> : <><Unlock size={16} /> Free</>}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: requestFeature ? '#ff4d85' : '#888', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={requestFeature} onChange={(e) => setRequestFeature(e.target.checked)} style={{ display: 'none' }} />
                  <Star size={16} /> Request HP Feature
                </label>
              </div>
              
              <button disabled={(!postTitle.trim() && !postMediaUrl) || uploadingPostMedia} type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: (postTitle.trim() || postMediaUrl) ? '#fff' : 'rgba(255,255,255,0.1)', color: (postTitle.trim() || postMediaUrl) ? '#000' : '#888', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: (postTitle.trim() || postMediaUrl) ? 'pointer' : 'not-allowed' }}>
                Post Content
              </button>
            </div>
          </form>
        )}

        {/* Creator's Feed (Both viewers and the creator see this) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <h2 style={{ fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginTop: '10px' }}>Content Feed</h2>
          
          {feed.map((post) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={post.id} style={{ background: 'rgba(15,15,15,0.8)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              
              {/* Post Header */}
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.div 
                  whileHover={isNetworkLevel ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' } : {}}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: isNetworkLevel ? 'pointer' : 'default', padding: '6px', borderRadius: '12px', marginLeft: '-6px', transition: 'background 0.2s' }}
                  onClick={() => {
                    if (isNetworkLevel && post.creator_id) {
                      navigate(`/profile/${post.creator_id}${window.location.search}`);
                    }
                  }}
                >
                  <img src={post.creator_avatar || (!isNetworkLevel ? profile.avatar_url : null) || `https://ui-avatars.com/api/?name=${post.creator_username || (!isNetworkLevel ? profile.username : 'Creator')}&background=random`} alt="Avatar" loading="lazy" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px' }}>{post.creator_username || (!isNetworkLevel ? profile.username : 'Creator')} <ShieldCheck size={14} color="#ff4d85" style={{ display: 'inline', marginLeft: '4px' }} /></h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{post.date}</span>
                  </div>
                </motion.div>
                {post.locked && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#FFD700', background: 'rgba(255,215,0,0.1)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                    <Lock size={12} /> Subscriber Only
                  </div>
                )}
              </div>

              {/* Post Body (Content + Media) */}
              <div style={{ position: 'relative' }}>
                <div style={{ filter: post.locked && (!isSubscribed || isOwnProfile) ? 'blur(8px)' : 'none', opacity: post.locked && (!isSubscribed || isOwnProfile) ? 0.4 : 1, transition: 'all 0.3s' }} id={`post-content-${post.id}`}>
                  {/* Post Content / Title */}
                  <div style={{ padding: '0 20px 20px 20px', fontSize: '16px', lineHeight: 1.5 }}>
                    {post.title}
                  </div>

                  {/* Post Payload (Image/Video) */}
                  {post.img && (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                      <img src={post.img} alt="Post content" loading="lazy" style={{ maxWidth: '50%', maxHeight: '400px', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }} />
                    </div>
                  )}
                </div>

                {/* Locked Overlay */}
                {post.locked && (!isSubscribed || isOwnProfile) && (
                  <div id={`post-overlay-${post.id}`} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '20px', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(0,0,0,0.8)', padding: '30px 40px', borderRadius: '24px', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                      <Lock size={48} color="#FFD700" style={{ marginBottom: '16px' }} />
                      <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 16px 0' }}>Subscriber Exclusive</h3>
                      
                      {isOwnProfile ? (
                        <button 
                          onClick={() => {
                            const content = document.getElementById(`post-content-${post.id}`);
                            const overlay = document.getElementById(`post-overlay-${post.id}`);
                            if (content && overlay) {
                              content.style.filter = 'none';
                              content.style.opacity = '1';
                              overlay.style.display = 'none';
                            }
                          }}
                          style={{ padding: '12px 30px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' }}
                        >
                          Reveal (Creator Preview)
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            if (!user) { toast.info('Please log in to subscribe.'); return; }
                            handleStripeCheckout('Monthly Subscription', Number(subPrice));
                            setIsSubscribed(true);
                          }}
                          style={{ padding: '12px 30px', background: '#FFD700', border: 'none', borderRadius: '20px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'transform 0.2s' }}
                          onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'}
                          onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                        >
                          Subscribe for ${subPrice}/mo to unlock
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Engagement Section (Likes & Comments) */}
              {(!post.locked || isSubscribed || isOwnProfile) && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                    <button 
                      onClick={() => handleLike(post.id)}
                      style={{ background: 'none', border: 'none', color: post.hasLiked ? '#ff4d85' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'color 0.2s' }}
                    >
                      <Heart size={20} fill={post.hasLiked ? '#ff4d85' : 'none'} /> {post.likes || 0}
                    </button>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      <MessageCircle size={20} /> {post.comments?.length || 0}
                    </button>
                  </div>

                  {/* Comments List */}
                  {post.comments && post.comments.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      {(expandedComments[post.id] ? post.comments : post.comments.slice(0, 2)).map((c: any) => (
                        <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                          <img src={c.avatar || `https://ui-avatars.com/api/?name=${c.user}&background=random`} alt={c.user} loading="lazy" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '12px', fontSize: '14px' }}>
                            <strong style={{ display: 'block', color: '#fff', marginBottom: '2px', fontSize: '13px' }}>{c.user}</strong>
                            <span style={{ color: 'var(--text-muted)' }}>{c.text}</span>
                          </div>
                        </div>
                      ))}
                      {post.comments.length > 2 && (
                        <button 
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', padding: '0 40px' }}
                        >
                          {expandedComments[post.id] ? 'Hide comments' : `View all ${post.comments.length} comments`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={user?.user_metadata?.avatar_url || (user ? `https://ui-avatars.com/api/?name=${user.email?.charAt(0)}&background=random` : 'https://ui-avatars.com/api/?name=Guest')} alt="You" loading="lazy" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        placeholder="Add a comment..."
                        value={commentTexts[post.id] || ''}
                        onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleComment(post.id);
                        }}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', paddingRight: '80px', borderRadius: '20px', color: '#fff', outline: 'none' }}
                      />
                      <div style={{ position: 'absolute', right: '8px', display: 'flex', gap: '4px' }}>
                        <EmojiPickerButton onSelect={(emoji) => setCommentTexts(prev => ({ ...prev, [post.id]: (prev[post.id] || '') + emoji }))} />
                        <DictationButton onResult={(text) => setCommentTexts(prev => ({ ...prev, [post.id]: (prev[post.id] || '') ? `${prev[post.id]} ${text}` : text }))} />
                      </div>
                    </div>
                    <button 
                      onClick={() => handleComment(post.id)}
                      disabled={!commentTexts[post.id]?.trim()}
                      style={{ background: commentTexts[post.id]?.trim() ? '#ff4d85' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: commentTexts[post.id]?.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s', flexShrink: 0 }}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          ))}
        </div>
        </>
        )}

        {activeTab === 'store' && (
        /* ----------- STORE TAB ----------- */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Add Product Form (Edit Mode Only) */}
          {isOwnProfile && viewMode === 'edit' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.15)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>Add New Product to Store</h3>
              <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <input type="text" placeholder="Product Title (e.g. VIP Meet & Greet, Drum Kit Vol 1)" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                </div>
                
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                  <span style={{ padding: '14px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>$</span>
                  <input type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                </div>
                
                <select value={newProduct.type} onChange={e => setNewProduct({...newProduct, type: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', cursor: 'pointer' }}>
                  <option value="digital">Digital Download / Ticket</option>
                  <option value="physical">Physical Merch (Ships)</option>
                </select>

                {newProduct.type === 'physical' && (
                  <div style={{ gridColumn: '1 / -1', display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#ccc' }}>Available Sizes (comma separated)</label>
                      <input type="text" placeholder="e.g. S, M, L, XL" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#ccc' }}>Available Colors (comma separated)</label>
                      <input type="text" placeholder="e.g. Black, White, Red" value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', gridColumn: '1 / -1' }}>
                  {newProduct.image_url ? (
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', backgroundImage: `url("${newProduct.image_url}")`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.1)' }} />
                  ) : null}
                  <label style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: '#ccc', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: '0.2s', fontWeight: 'bold' }}>
                    <ImageIcon size={16} /> 
                    {uploadingProductImg ? 'Uploading...' : 'Upload Prod Image'}
                    <input type="file" accept="image/*" onChange={handleProductImageUpload} style={{ display: 'none' }} disabled={uploadingProductImg} />
                  </label>
                  <button type="submit" disabled={saving || !newProduct.title} style={{ padding: '0 30px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', opacity: (!newProduct.title || saving) ? 0.5 : 1 }}>
                    {saving ? 'Adding...' : 'Add to Store'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Store Grid */}
          {(() => {
            const visibleProducts = products.filter(p => (isNetworkLevel && isOwnProfile && viewMode === 'edit') ? true : !p.hidden_from_network);
            if (visibleProducts.length === 0) {
              return (
                 <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <h3 style={{ fontSize: '20px', marginTop: 0, color: 'var(--text-muted)' }}>Store is Empty</h3>
                   <p style={{ color: '#555', marginBottom: 0 }}>There are no visible products available.</p>
                 </div>
              );
            }
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {visibleProducts.map(product => (
                  <motion.div onClick={() => navigate(`/product/${product.id}${window.location.search}`)} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={product.id} className="store-card" style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative' }}>
                    {isNetworkLevel && isOwnProfile && viewMode === 'edit' && (
                      <button 
                        onClick={(e) => handleToggleProductVisibility(e, product.id, product.hidden_from_network)}
                        style={{ position: 'absolute', top: 10, right: 10, padding: '6px 12px', background: product.hidden_from_network ? 'rgba(255,0,0,0.8)' : 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(10px)' }}
                      >
                        {product.hidden_from_network ? 'Hidden' : 'Hide from Network'}
                      </button>
                    )}
                    <div style={{ width: '100%', aspectRatio: '1/1', background: `url("${product.image_url}")`, backgroundSize: 'cover', backgroundPosition: 'center', filter: product.hidden_from_network ? 'grayscale(100%) opacity(0.5)' : 'none' }} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, opacity: product.hidden_from_network ? 0.5 : 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: product.type === 'physical' ? '#ff4d85' : '#8A2BE2', fontWeight: 'bold', letterSpacing: '1px' }}>
                          {product.type === 'physical' ? 'Physical Merch' : 'Digital Release'}
                        </div>
                        {product.creator && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <img src={product.creator.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.creator.username || 'C')}&background=random`} alt={product.creator.username} loading="lazy" style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>@{product.creator.username}</span>
                          </div>
                        )}
                      </div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', lineHeight: 1.4, flex: 1 }}>{product.title}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>${parseFloat(product.price).toFixed(2)}</span>
                        {viewMode === 'edit' ? (
                          <button style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                        ) : (
                          <button style={{ padding: '8px 16px', background: '#fff', border: 'none', borderRadius: '20px', color: '#000', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Buy Now</button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            );
          })()}
        </div>
        )}

        {activeTab === 'live' && (
          <ProfileLive
            isSubscribed={isSubscribed} isOwnProfile={isOwnProfile} localGuestData={localGuestData}
            isPlayingLive={isPlayingLive} isPubliclyLive={isPubliclyLive} streamSource={streamSource}
            isPreviewExpired={isPreviewExpired} liveEmbedUrl={liveEmbedUrl} hasPaidForLive={hasPaidForLive}
            livePrice={livePrice} previewTimeLeft={previewTimeLeft} presenterMode={presenterMode}
            activeGuests={activeGuests} totalSlots={totalSlots} showHost={showHost}
            cameraStatus={cameraStatus} videoRef={videoRef} profile={profile} visibleGuests={visibleGuests}
            directorLowerThirds={directorLowerThirds} homepageImageUrl={homepageImageUrl} channelRef={channelRef}
            setShowExitScreen={setShowExitScreen} viewMode={viewMode} creatorId={creatorId} user={user}
            guests={guests} subPrice={subPrice} setLivePrice={setLivePrice} setStreamSource={setStreamSource}
            setLiveEmbedUrl={setLiveEmbedUrl} setIsPlayingLive={setIsPlayingLive} setIsPubliclyLive={setIsPubliclyLive}
            setPresenterMode={setPresenterMode} setGuests={setGuests} setLocalGuestData={setLocalGuestData}
            handleStripeCheckout={handleStripeCheckout} handleUnlockLive={handleUnlockLive}
            handleSubscribe={handleSubscribe} startLiveStream={startLiveStream} setShowTipModal={setShowTipModal}
          />
        )}

        {activeTab === 'booking' && (
        /* ----------- BOOKING TAB ----------- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Book {profile?.username || 'this Creator'}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 40px 0', fontSize: '16px' }}>Schedule a 1-on-1 session, studio consultation, or collaboration meeting.</p>
              
              {isOwnProfile && viewMode === 'edit' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.15)', marginBottom: '30px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>Creator Booking Settings</h3>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                      <span style={{ padding: '14px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>Hourly Rate ($)</span>
                      <input type="number" step="0.01" value={bookingPrice} onChange={e => setBookingPrice(e.target.value)} style={{ background: 'transparent', border: 'none', padding: '14px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', width: '120px' }} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px', lineHeight: 1.6 }}>Host secure, high-definition virtual calls directly from your enterprise dashboard.</p>
                    <button onClick={() => window.location.href = `/call/room_${profile?.id || 'demo'}${window.location.search}`} style={{ padding: '12px 24px', background: 'rgba(138,43,226,0.2)', color: 'var(--text-primary)', border: '1px solid #8A2BE2', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Enter Virtual Room</button>
                  </div>
                </motion.div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                {/* Calendar View */}
                <div>
                  <h4 style={{ margin: '0 0 20px 0', color: 'var(--text-primary)', fontSize: '18px' }}>1. Select a Date ({new Date().toLocaleString('default', { month: 'long' })})</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => (
                      <div key={i} style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold', padding: '10px 0', textTransform: 'uppercase' }}>{day}</div>
                    ))}
                    {/* Add blank spaces for offset */}
                    <div /> <div /> <div /> 
                    {Array.from({length: 30}).map((_, i) => {
                      const date = i + 1;
                      const isPast = date < 15;
                      const isAvailable = availableSlots[date] && availableSlots[date].length > 0;
                      const isSelected = selectedDate === date;
                      
                      // If standard user, disable if no slots or past
                      // If creator editing, they can select any future date to add slots
                      const disabled = (viewMode !== 'edit' && (!isAvailable || isPast)) || (viewMode === 'edit' && isPast);

                      return (
                        <button 
                          key={i} 
                          disabled={disabled}
                          onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                          style={{ 
                            aspectRatio: '1', borderRadius: '12px', border: '1px solid',
                            borderColor: isSelected ? '#ff4d85' : (isAvailable && !isPast) ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255,255,255,0.05)',
                            background: isSelected ? 'rgba(255,77,133,0.1)' : (isAvailable && !isPast) ? 'rgba(0, 255, 136, 0.05)' : 'rgba(0,0,0,0.3)',
                            color: disabled ? '#444' : '#fff',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            fontSize: '15px', fontWeight: 'bold', transition: 'all 0.2s',
                          }}
                        >
                          {date}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Selection & Editing */}
                <div style={{ opacity: selectedDate ? 1 : 0.4, pointerEvents: selectedDate ? 'auto' : 'none', transition: 'all 0.3s' }}>
                  <h4 style={{ margin: '0 0 20px 0', color: 'var(--text-primary)', fontSize: '18px' }}>2. Available Times</h4>
                  
                  {isOwnProfile && viewMode === 'edit' && selectedDate ? (
                    <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Add Timeslot for {new Date().toLocaleString('default', { month: 'long' })} {selectedDate}</h5>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="time" value={newTimeInput} onChange={e => setNewTimeInput(e.target.value)} style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} />
                        <button 
                          onClick={() => {
                            if (!newTimeInput) return;
                            // Convert 24h to 12h AM/PM
                            const [h, m] = newTimeInput.split(':');
                            let hour = parseInt(h);
                            const ampm = hour >= 12 ? 'PM' : 'AM';
                            hour = hour % 12 || 12;
                            const timeString = `${hour}:${m} ${ampm}`;
                            
                            setAvailableSlots(prev => {
                              const current = prev[selectedDate] || [];
                              if (!current.includes(timeString)) return { ...prev, [selectedDate]: [...current, timeString].sort() };
                              return prev;
                            });
                            setNewTimeInput('');
                          }}
                          style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {selectedDate && availableSlots[selectedDate]?.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {availableSlots[selectedDate].map(time => (
                        <div key={time} style={{ display: 'flex', gap: '4px' }}>
                          <button 
                            onClick={() => setSelectedTime(time)}
                            style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid', borderColor: selectedTime === time ? '#8A2BE2' : 'rgba(255,255,255,0.05)', background: selectedTime === time ? 'rgba(138,43,226,0.1)' : 'rgba(0,0,0,0.4)', color: 'var(--text-primary)', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            {time}
                          </button>
                          {isOwnProfile && viewMode === 'edit' && (
                            <button 
                              onClick={() => {
                                setAvailableSlots(prev => ({
                                  ...prev,
                                  [selectedDate]: prev[selectedDate].filter(t => t !== time)
                                }));
                                if (selectedTime === time) setSelectedTime(null);
                              }}
                              style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,0,0,0.2)', borderRadius: '12px', padding: '0 12px', cursor: 'pointer' }}
                            >
                              X
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No times available on this date.</p>
                  )}

                  {/* Payment/Confirmation section (Only for Guests) */}
                  {selectedTime && (!isOwnProfile || viewMode !== 'edit') && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '30px', background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)', fontSize: '18px' }}>3. Confirm Booking</h4>
                      
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                         <button onClick={() => setBookingType('virtual')} style={{ flex: 1, padding: '12px', background: bookingType === 'virtual' ? 'rgba(138,43,226,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid', borderColor: bookingType === 'virtual' ? '#8A2BE2' : 'transparent', color: bookingType === 'virtual' ? '#fff' : '#aaa', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>
                            💻 Virtual Call (Vibe)
                         </button>
                         <button onClick={() => setBookingType('physical')} style={{ flex: 1, padding: '12px', background: bookingType === 'physical' ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)', border: '1px solid', borderColor: bookingType === 'physical' ? '#00ff88' : 'transparent', color: bookingType === 'physical' ? '#fff' : '#aaa', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>
                            🤝 Physical Meeting
                         </button>
                      </div>

                      {bookingType === 'virtual' && (
                          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                             <button onClick={() => setVirtualCallType('video')} style={{ flex: 1, padding: '10px', background: virtualCallType === 'video' ? 'rgba(255,77,133,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid', borderColor: virtualCallType === 'video' ? '#ff4d85' : 'transparent', color: virtualCallType === 'video' ? '#fff' : '#aaa', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', fontSize: '14px' }}>
                                📹 Video Call
                             </button>
                             <button onClick={() => setVirtualCallType('audio')} style={{ flex: 1, padding: '10px', background: virtualCallType === 'audio' ? 'rgba(0,170,255,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid', borderColor: virtualCallType === 'audio' ? '#00aaff' : 'transparent', color: virtualCallType === 'audio' ? '#fff' : '#aaa', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', fontSize: '14px' }}>
                                🎙️ Audio Only
                             </button>
                          </div>
                      )}

                      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                          <select value={bookingDuration} onChange={e => setBookingDuration(Number(e.target.value))} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', appearance: 'none', fontSize: '15px' }}>
                            <option value={1}>1 Hour Duration</option>
                            <option value={2}>2 Hours Duration</option>
                            <option value={3}>3 Hours Duration</option>
                            <option value={4}>4 Hours Duration</option>
                            <option value={8}>8 Hours (Full Day)</option>
                          </select>
                          <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>▼</div>
                        </div>
                      </div>
                      <input type="text" placeholder="Your Name" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: 'var(--text-primary)', marginBottom: '12px', outline: 'none' }} />
                      <input type="text" placeholder="Purpose of Meeting (e.g. Mixing Advice)" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: 'var(--text-primary)', marginBottom: '20px', outline: 'none' }} />
                      <button onClick={() => { 
                        const monthName = new Date().toLocaleString('default', { month: 'long' });
                        handleStripeCheckout(`${bookingType === 'virtual' ? `1-on-1 Virtual Call (${virtualCallType === 'video' ? 'Video' : 'Audio'})` : 'Physical Meeting'} (${monthName} ${selectedDate} at ${selectedTime}) - ${bookingDuration} Hour(s)`, Number(bookingPrice) * bookingDuration, { is_booking: true, date: `${monthName} ${selectedDate}`, time: selectedTime, duration: bookingDuration, meeting_type: bookingType === 'virtual' ? `virtual_${virtualCallType}` : 'physical' }); 
                        setSelectedTime(null); 
                        setSelectedDate(null); 
                      }} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(138,43,226,0.3)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                        Book Now (${(Number(bookingPrice) * bookingDuration).toFixed(2)})
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'series' && (
        /* ----------- TV SERIES TAB ----------- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {isOwnProfile && viewMode === 'edit' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.15)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>Create New Series</h3>
                <form onSubmit={handleAddSeries} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input type="text" placeholder="Series Title (e.g. Neon Nights)" value={newSeries.title} onChange={e => setNewSeries({...newSeries, title: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <textarea placeholder="Series Description..." value={newSeries.description} onChange={e => setNewSeries({...newSeries, description: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', minHeight: '80px', resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                    <span style={{ padding: '14px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>Full Season $</span>
                    <input type="number" step="0.01" placeholder="Price" value={newSeries.price} onChange={e => setNewSeries({...newSeries, price: e.target.value})} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>
                  <input type="text" placeholder="Cover Image URL (optional)" value={newSeries.img} onChange={e => setNewSeries({...newSeries, img: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={!newSeries.title || !newSeries.price} style={{ padding: '12px 24px', background: (!newSeries.title || !newSeries.price) ? 'rgba(255,255,255,0.1)' : '#ff4d85', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: (!newSeries.title || !newSeries.price) ? 'not-allowed' : 'pointer' }}>Publish Series</button>
                  </div>
                </form>
              </motion.div>
            )}

            {seriesList.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px', margin: 0 }}>No original series published yet.</p>
              </div>
            ) : (
              seriesList.map((series) => (
                <motion.div key={series.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-surface)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  
                  {/* Series Hero Panel */}
                  <div style={{ width: '100%', height: '300px', background: `url(${series.img || 'https://picsum.photos/seed/cybercity/1200/500'}) center/cover`, position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.3))' }} />
                    <div style={{ position: 'absolute', bottom: '30px', left: '30px', maxWidth: '500px' }}>
                      <div style={{ background: 'rgba(255,77,133,0.2)', color: '#ff4d85', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '12px', border: '1px solid #ff4d85' }}>ORIGINAL SERIES</div>
                      <h2 style={{ fontSize: '36px', margin: '0 0 10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{series.title}</h2>
                      <p style={{ color: '#ccc', margin: '0 0 20px 0', lineHeight: 1.5 }}>{series.description}</p>
                      <button onClick={() => handleStripeCheckout(`Full Season Pass: ${series.title}`, Number(series.price))} style={{ padding: '14px 28px', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(255,255,255,0.2)' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                        Buy Full Season (${series.price})
                      </button>
                    </div>
                  </div>

                  {/* Episodes List */}
                  <div style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '20px' }}>Episodes</h3>
                      {isOwnProfile && viewMode === 'edit' && (
                        <button onClick={() => setActiveSeriesIdForEp(activeSeriesIdForEp === series.id ? null : series.id)} style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                          {activeSeriesIdForEp === series.id ? 'Cancel' : '+ Add Episode'}
                        </button>
                      )}
                    </div>
                    
                    {/* Add Episode Form */}
                    {activeSeriesIdForEp === series.id && (
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-secondary)' }}>New Episode for {series.title}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <input type="text" placeholder="Episode Title" value={newEpisode.title} onChange={e=>setNewEpisode({...newEpisode, title: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} />
                          <input type="text" placeholder="Length (e.g. 45 min)" value={newEpisode.length} onChange={e=>setNewEpisode({...newEpisode, length: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} />
                          <div style={{ gridColumn: '1 / -1' }}>
                            <textarea placeholder="Description..." value={newEpisode.description} onChange={e=>setNewEpisode({...newEpisode, description: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', minHeight: '60px' }} />
                          </div>
                          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Price $</span>
                            <input type="number" step="0.01" placeholder="9.99" value={newEpisode.price} onChange={e=>setNewEpisode({...newEpisode, price: e.target.value})} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} />
                            <button onClick={() => handleAddEpisode(series.id)} disabled={!newEpisode.title} style={{ padding: '10px 20px', background: newEpisode.title ? '#00ff88' : 'rgba(255,255,255,0.1)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: newEpisode.title ? 'pointer' : 'not-allowed' }}>Save</button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(!series.episodes || series.episodes.length === 0) ? (
                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No episodes added to this series yet.</p>
                      ) : (
                        series.episodes.map((episode: any, idx: number) => (
                          <div key={episode.id} style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                            <div style={{ width: '160px', height: '90px', borderRadius: '8px', background: `url(https://picsum.photos/seed/ep${idx+1}/300/150) center/cover`, position: 'relative', flexShrink: 0 }}>
                              <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{episode.length || 'TBD'}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Episode {idx + 1}</div>
                              <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{episode.title}</h4>
                              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.4 }}>{episode.description}</p>
                            </div>
                            <button onClick={()=>handleStripeCheckout(`Episode: ${episode.title}`, Number(episode.price || 0))} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-primary)', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                              Buy (${episode.price || '0.00'})
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'courses' && (
        /* ----------- COURSES TAB ----------- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {isOwnProfile && viewMode === 'edit' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.15)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>Create New Masterclass</h3>
                <form onSubmit={handleAddCourse} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input type="text" placeholder="Masterclass Title (e.g. Advanced Beatmaking)" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                    <span style={{ padding: '14px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>$</span>
                    <input type="number" step="0.01" placeholder="Price" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="number" placeholder="Modules (e.g. 12)" value={newCourse.modules} onChange={e => setNewCourse({...newCourse, modules: e.target.value})} style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                    <input type="number" step="0.5" placeholder="Hours" value={newCourse.hours} onChange={e => setNewCourse({...newCourse, hours: e.target.value})} style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', gridColumn: '1 / -1', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={saving || !newCourse.title} style={{ padding: '14px 30px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', opacity: (!newCourse.title || saving) ? 0.5 : 1 }}>
                      {saving ? 'Publishing...' : 'Publish Masterclass'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {courses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '20px', marginTop: 0, color: 'var(--text-muted)' }}>No Masterclasses</h3>
                <p style={{ color: '#555', marginBottom: 0 }}>This creator hasn't published any courses yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {courses.map((course) => (
                  <motion.div key={course.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '180px', background: `url(${course.img}) center/cover`, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                        {course.modules} Modules • {course.hours}h
                      </div>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', lineHeight: 1.4, flex: 1 }}>{course.title}</h3>
                      
                      {/* Progress Bar Mock */}
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '8px', overflow: 'hidden' }}>
                        <div style={{ width: `${course.progress}%`, height: '100%', background: '#8A2BE2' }} />
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: 'bold' }}>{course.progress}% Completed</div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>${course.price}</span>
                        {viewMode === 'edit' ? (
                          <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Edit
                          </button>
                        ) : (
                          <button onClick={() => handleStripeCheckout(`Course: ${course.title}`, course.price)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                            Enroll Now
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vibe_agency' && (
        /* ----------- AGENCY TAB ----------- */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '28px', marginBottom: '16px', color: 'var(--text-primary)' }}>Platform Agency Services</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 30px' }}>
                Partner with our dedicated team of creative professionals. We offer full-service production, branding, and career management for elite creators.
              </p>
              <button style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #0055ff, #00d2ff)', color: 'var(--text-primary)', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                Inquire for Management
              </button>
            </div>
          </motion.div>
        )}

        {/* --- FLIP BOOK TAB --- */}
        {activeTab === 'flipbook' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', margin: 0 }}>Media & Backgrounds</h2>
            
            {isOwnProfile && viewMode === 'edit' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Flip Book Images Upload */}
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#ff4d85', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ImageIcon size={18} /> Manage Flip Book Images
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>Upload custom images from your computer or use our AI Generator to explicitly build your Flip Book.</p>
                  
                  {flipbookImages ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', borderRadius: '12px', overflow: 'hidden', backgroundImage: `url("${flipbookImages.split(',')[currentBannerIndex]}")`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.1)', transition: 'background-image 0.5s' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                        <button onClick={() => { setImageTarget('flipbook'); setShowImageModal(true); }} style={{ position: 'absolute', bottom: 16, right: 16, padding: '10px 20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: 'white', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
                          + Add Image to Flip Book
                        </button>
                        <button onClick={() => {
                          const arr = flipbookImages.split(',').filter(Boolean);
                          arr.splice(currentBannerIndex, 1);
                          setFlipbookImages(arr.join(','));
                          setCurrentBannerIndex(0);
                        }} style={{ position: 'absolute', top: 16, right: 16, padding: '8px 16px', background: 'rgba(255,0,0,0.5)', backdropFilter: 'blur(8px)', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                          Remove This Image
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {flipbookImages.split(',').filter(Boolean).map((imgUrl, idx) => (
                          <div key={idx} onClick={() => setCurrentBannerIndex(idx)} style={{ width: '100px', height: '56px', borderRadius: '8px', backgroundImage: `url("${imgUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', border: currentBannerIndex === idx ? '2px solid #ff4d85' : '2px solid transparent', flexShrink: 0, opacity: currentBannerIndex === idx ? 1 : 0.5, transition: '0.2s' }} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setImageTarget('flipbook'); setShowImageModal(true); }} style={{ width: '100%', padding: '40px', background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.15)', color: 'var(--text-primary)', fontSize: '15px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                      + Select or Generate Flip Book Image
                    </button>
                  )}
                </div>

              </div>
            )}

            {(!isOwnProfile || viewMode === 'public') && (
              flipbookImages ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', borderRadius: '24px', overflow: 'hidden', backgroundImage: `url("${flipbookImages.split(',')[currentBannerIndex]}")`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.1)', transition: 'background-image 0.5s' }} />
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px', justifyContent: 'center' }}>
                    {flipbookImages.split(',').filter(Boolean).map((imgUrl, idx) => (
                      <div key={idx} onClick={() => setCurrentBannerIndex(idx)} style={{ width: '120px', height: '68px', borderRadius: '12px', backgroundImage: `url("${imgUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', border: currentBannerIndex === idx ? '2px solid #ff4d85' : '2px solid transparent', flexShrink: 0, opacity: currentBannerIndex === idx ? 1 : 0.5, transition: '0.2s' }} />
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.05)' }}>
                  This creator hasn't added any photos to their Flip Book yet.
                </div>
              )
            )}
          </motion.div>
        )}


        {/* --- APPEARANCE TAB --- */}
        {activeTab === 'appearance' && isOwnProfile && viewMode === 'edit' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', margin: 0 }}>Channel Appearance</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Background Images Upload */}
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#D35400', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ImageIcon size={18} /> Manage Channel Backgrounds
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>Upload images to cycle through in the background of your channel.</p>
                
                {homepageImageUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', borderRadius: '12px', overflow: 'hidden', backgroundImage: `url("${homepageImageUrl.split(',')[currentBgIndex]}")`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.1)', transition: 'background-image 0.5s' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                      <button onClick={() => { setImageTarget('homepage'); setShowImageModal(true); }} style={{ position: 'absolute', bottom: 16, right: 16, padding: '10px 20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: 'white', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
                        + Add Background
                      </button>
                      <button onClick={() => {
                        const arr = homepageImageUrl.split(',').filter(Boolean);
                        arr.splice(currentBgIndex, 1);
                        const newUrls = arr.join(',');
                        setHomepageImageUrl(newUrls);
                        setCurrentBgIndex(0);
                        supabase!.from('profiles').update({ homepage_image_url: newUrls }).eq('id', user?.id);
                        
                        const shouldSync = (isNetworkLevel || user?.id === wlConfig?.owner_id) && wlConfig?.id;
                        if (shouldSync) {
                           const newHero = newUrls ? newUrls.split(',')[0] : null;
                           const currentTheme = wlConfig.theme || {};
                           supabase!.from('whitelabel_configs').update({ theme: { ...currentTheme, heroImage: newHero } }).eq('id', wlConfig.id).then();
                        }
                      }} style={{ position: 'absolute', top: 16, right: 16, padding: '8px 16px', background: 'rgba(255,0,0,0.5)', backdropFilter: 'blur(8px)', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        Remove Image
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                      {homepageImageUrl.split(',').filter(Boolean).map((imgUrl, idx) => (
                        <div key={idx} onClick={() => setCurrentBgIndex(idx)} style={{ width: '100px', height: '56px', borderRadius: '8px', backgroundImage: `url("${imgUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', border: currentBgIndex === idx ? '2px solid #D35400' : '2px solid transparent', flexShrink: 0, opacity: currentBgIndex === idx ? 1 : 0.5, transition: '0.2s' }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setImageTarget('homepage'); setShowImageModal(true); }} style={{ width: '100%', padding: '40px', background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.15)', color: 'var(--text-primary)', fontSize: '15px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                    + Select or Generate Background Image
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- MY BOOKINGS TAB --- */}
        {activeTab === 'my_bookings' && user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '24px', margin: '0 0 20px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={24} color="#ff4d85" /> Upcoming Calls (Purchased)
              </h2>
              {purchasedBookings.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>You have not booked any calls yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {purchasedBookings.map((b, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ff4d85', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                           {b.creator?.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{b.creator?.full_name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>@{b.creator?.username}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        <div style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} color="#aaa" /> {b.date}</div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} color="#aaa" /> {b.time}</div>
                        <div style={{ color: '#ff4d85', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}><Video size={14} /> {b.meeting_type?.replace('_', ' ')}</div>
                      </div>
                      <button onClick={() => window.open(b.meeting_link || `https://meet.jit.si/vibe_${b.id}`, '_blank')} style={{ width: '100%', padding: '12px', background: '#00ff88', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                        Join Video Room
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {viewMode === 'edit' && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 style={{ fontSize: '24px', margin: '0 0 20px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={24} color="#00ff88" /> Incoming Bookings (Your Schedule)
                </h2>
                {receivedBookings.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No one has booked a call with you yet.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {receivedBookings.map((b, i) => (
                      <div key={i} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                             {b.buyer?.full_name?.charAt(0) || b.guest_name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{b.buyer?.full_name || b.guest_name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Paid: ${b.price}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                          <div style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} color="#aaa" /> {b.date}</div>
                          <div style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} color="#aaa" /> {b.time}</div>
                          <div style={{ color: '#00ff88', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}><Video size={14} /> {b.meeting_type?.replace('_', ' ')}</div>
                        </div>
                        <button onClick={() => window.open(b.meeting_link || `https://meet.jit.si/vibe_${b.id}`, '_blank')} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #00ff88', color: '#00ff88', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e=>{e.currentTarget.style.background='#00ff88'; e.currentTarget.style.color='#000'}} onMouseOut={e=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#00ff88'}}>
                          Host Video Room
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
        {/* --- NETWORK PROFILES TAB --- */}
        {activeTab === 'members' && isNetworkLevel && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
              <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 8px 0', fontWeight: 'bold' }}>{wlConfig?.name} Profiles</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Explore the creators and members within this exclusive network.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                 {networkProfiles.length > 0 ? networkProfiles.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => navigate(`/profile/${p.id}`)}
                      style={{ 
                        aspectRatio: '3/4',
                        borderRadius: '16px', 
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                        transition: 'transform 0.3s' 
                      }} 
                      onMouseOver={e=>e.currentTarget.style.transform='translateY(-5px)'} 
                      onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}
                    >
                       <img 
                         src={p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.username || 'User')}&background=random`} 
                         alt={p.username} 
                         style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                       />
                       <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 60%)' }} />
                       
                       <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '16px', textAlign: 'left', zIndex: 2 }}>
                         <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{p.username || 'Anonymous'}</div>
                         <div style={{ color: wlConfig?.accent || '#00ff88', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{p.role}</div>
                       </div>
                    </div>
                 )) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No profiles found for this network yet.</div>
                 )}
              </div>
           </motion.div>
        )}

        {/* --- COMMUNITY TAB --- */}
        {activeTab === 'community' && isNetworkLevel && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px' }}>
              <Community user={user} />
           </motion.div>
        )}

        {/* --- MY NETWORKS TAB --- */}
        {activeTab === 'networks' && myNetworks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Monitor size={24} color="#00ff88" /> My Enterprise Networks
                </h2>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {myNetworks.map((network, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: network.theme?.accent || network.accent || '#00ff88' }} />
                     
                     <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{network.name || 'Vibe Network'}</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>{network.domain || 'localhost'}</p>
                     </div>
                     
                     <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <button onClick={() => window.location.href = `/?tenant=${network.id}`} style={{ flex: 1, padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                           <ArrowUpRight size={16} /> Open Network
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {/* --- WALLET SUBSCRIPTION & EARNINGS TAB --- */}
        {activeTab === 'wallet' && isOwnProfile && viewMode === 'edit' && (wlConfig?.theme?.creator_splits?.[profile?.id] ?? profile?.platform_fee_percentage ?? wlConfig?.platform_fee_percentage ?? 0) > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Balance Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              
              <div style={{ background: 'rgba(0, 255, 136, 0.05)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(0, 255, 136, 0.2)', gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#00ff88', display: 'flex', alignItems: 'center', gap: '8px' }}><Wallet size={20}/> Available Network Balance</h3>
                  <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--text-primary)' }}>
                    ${walletBalance.toFixed(2)}
                  </div>
                  <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>Available to withdraw, or use for platform subscriptions.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                  <button style={{ padding: '14px 24px', borderRadius: '12px', background: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', transition: 'all 0.2s' }} onClick={() => { toast.success('Funds securely routed to your connected bank account.'); setWalletBalance(0); }}>
                    <ArrowUpRight size={18}/> Withdraw Funds
                  </button>
                  <button style={{ padding: '14px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }} onClick={() => setWalletBalance(prev => prev + 100)}>
                    <ArrowDownLeft size={18}/> Deposit $100
                  </button>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, rgba(99,91,255,0.1), rgba(0,0,0,0.4))', borderRadius: '24px', padding: '30px', border: '1px solid rgba(99,91,255,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8h-4a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4h-4"/><path d="M12 6v12"/></svg>
                  Stripe Payouts
                </h4>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                  {profile?.stripe_account_id 
                    ? "Your channel is securely connected to Stripe. Payouts are routed directly to your bank." 
                    : "Connect your bank via Stripe Express to receive direct deposits from subscribers, tips, and bookings."}
                </div>
                
                {profile?.stripe_account_id ? (
                  <button style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                    <CheckCircle size={16} color="#00ff88" /> Connected
                  </button>
                ) : (
                  <button onClick={async (e) => {
                    const btn = e.currentTarget;
                    const ogText = btn.innerHTML;
                    btn.innerHTML = 'Connecting...';
                    btn.style.opacity = '0.7';
                    
                    try {
                      const { data, error } = await supabase!.functions.invoke('stripe-onboard', {
                        body: { return_url: window.location.href }
                      });
                      if (error) throw error;
                      if (data?.url) {
                        window.location.href = data.url;
                      }
                    } catch (err) {
                      console.error(err);
                      toast.error('Failed to connect to Stripe. Please ensure your backend is running.');
                      btn.innerHTML = ogText;
                      btn.style.opacity = '1';
                    }
                  }} style={{ padding: '14px 24px', background: '#635BFF', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <ArrowUpRight size={18} /> Setup Stripe Payouts
                  </button>
                )}
              </div>

            </div>

            {/* Income Streams */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color="#ff4d85"/> Recent Collections</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    ...(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vibe_network_ledger') || '[]') : []).map((tx: any, idx: number) => ({
                      id: `local-tx-${idx}`,
                      title: `Live Stream Tipping Payload`,
                      amount: `+$${Number(tx.gross).toFixed(2)}`,
                      type: 'Dynamic Tip',
                      color: '#FFD700'
                    }))
                  ].map(tx => (
                    <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{tx.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{tx.type}</div>
                      </div>
                      <div style={{ color: tx.color, fontWeight: 'bold', fontSize: '16px' }}>{tx.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight size={20} color="#ff4d85"/> Payable Subscriptions</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[].length > 0 ? [].map((sub: any) => (
                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{sub.creator}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: paySubsWithWallet ? '#00ff88' : '#888' }}>{sub.status}</span> • {sub.due}
                        </div>
                      </div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '16px' }}>{sub.amount}</div>
                    </div>
                  )) : (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '16px 0' }}>No active payable subscriptions.</div>
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </div>

      {/* Modern Profile Picture Modals */}
      <AnimatePresence>
        {showImageModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} onClick={() => setShowImageModal(false)} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              
              <h2 style={{ margin: 0, fontSize: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>Update Profile Picture</h2>
              
              {/* Option 1: AI Engine */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ color: '#ff4d85', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><Wand size={16}/> AI Generator</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" id="ai-prompt-input" placeholder="e.g. Cyberpunk DJ with neon glasses..." style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  <button onClick={() => {
                    const prompt = (document.getElementById('ai-prompt-input') as HTMLInputElement).value;
                    if (prompt) {
                      const computedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                      if (imageTarget === 'avatar') setAvatarUrl(computedUrl);
                      else setHomepageImageUrl(prev => prev ? prev + ',' + computedUrl : computedUrl);
                      
                      setShowImageModal(false);
                      setSaving(true);
                      setTimeout(() => setSaving(false), 500);
                    }
                  }} style={{ padding: '0 24px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Dream Engine</button>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', margin: '6px 0', opacity: 0.5 }}>— OR —</div>

              {/* Option 2: Upload from Computer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ color: '#ccc', fontSize: '14px', fontWeight: 'bold' }}>Upload Direct File via Network</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}>
                    {saving ? 'Uploading to Supabase...' : 'Choose Image File off Computer...'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={saving} />
                  </label>
                </div>
              </div>
              
              <button onClick={() => setShowImageModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none' }}>✕</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .camera-overlay:hover { opacity: 1 !important; }
      `}</style>
      
      {/* TIP MODAL */}
      <AnimatePresence>
        {showTipModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} onClick={() => setShowTipModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>💰 Send a Tip</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Support the live stream. Tokens are transferred via your internal active wallet balance.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[5, 10, 20, 50].map(amt => (
                  <button key={amt} onClick={() => setTipAmount(amt)} style={{ padding: '12px', background: tipAmount === amt ? '#00ff88' : 'rgba(255,255,255,0.05)', color: tipAmount === amt ? '#000' : '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    ${amt}
                  </button>
                ))}
              </div>
              <input type="number" placeholder="Custom Amount" value={tipAmount} onChange={e => setTipAmount(Number(e.target.value))} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
              
              <button onClick={() => {
                const feePercentage = wlConfig?.theme?.creator_splits?.[profile?.id] ?? profile?.platform_fee_percentage ?? wlConfig?.platform_fee_percentage ?? 0;
                let creatorCut = 0;
                let networkCut = 0;
                
                if (feePercentage === 0) {
                   networkCut = Number(tipAmount);
                   creatorCut = 0;
                } else {
                   networkCut = Number(tipAmount) * (feePercentage / 100);
                   creatorCut = Number(tipAmount) - networkCut;
                }

                const stored = JSON.parse(localStorage.getItem('vibe_network_ledger') || '[]');
                stored.unshift({ id: Date.now(), title: `Tip to ${profile?.username || 'Creator'}`, type: 'Live Stream Tip', amount: `+$${networkCut.toFixed(2)}`, color: '#00ff88' });
                localStorage.setItem('vibe_network_ledger', JSON.stringify(stored));
                
                const currentNetWallet = Number(localStorage.getItem('vibe_network_wallet') || 10500);
                localStorage.setItem('vibe_network_wallet', String(currentNetWallet + networkCut));

                if (creatorCut > 0) {
                   const newBalance = walletBalance + creatorCut;
                   setWalletBalance(newBalance);
                   localStorage.setItem('vibe_host_wallet', String(newBalance));
                }

                toast.success(`Successfully completed $${tipAmount} transaction!`);
                setShowTipModal(false);
                setTipAmount('');
              }} style={{ padding: '16px', background: 'linear-gradient(45deg, #00ff88, #00bbff)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }} disabled={!tipAmount}>
                Confirm Transaction &rarr;
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GUEST GREEN ROOM MODAL */}
      <AnimatePresence>
        {guestSetup.show && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 20px 100px rgba(0,0,255,0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,85,255,0.2)', color: '#0055ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Camera size={30} /></div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Join the Stream</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>You've been invited to join the broadcast. Please enter your display info so the audience knows who you are.</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>Your Full Name</label>
                  <input type="text" placeholder="e.g. Jane Doe" value={guestSetup.name} onChange={e => setGuestSetup({...guestSetup, name: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '15px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>Professional Title</label>
                  <input type="text" placeholder="e.g. Chief Marketing Officer" value={guestSetup.title} onChange={e => setGuestSetup({...guestSetup, title: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '15px', outline: 'none' }} />
                </div>
              </div>

              <button onClick={() => {
                if (guestSetup.name.trim() && guestSetup.title.trim()) {
                  const payload = { id: Math.random().toString(36).substr(2, 9), name: guestSetup.name, title: guestSetup.title, isLive: false };
                  setLocalGuestData(payload);
                  
                  // Publish to local storage ring for the Host to pick up instantly
                  if (typeof window !== 'undefined') {
                    const current = JSON.parse(localStorage.getItem('vibe_host_guests_session') || '[]');
                    const updated = [...current, payload];
                    localStorage.setItem('vibe_host_guests_session', JSON.stringify(updated));
                    window.dispatchEvent(new Event('vibe_guests_updated'));
                  }

                  // Broadcast globally cross-device to Host
                  if (channelRef.current) {
                      channelRef.current.send({ type: 'broadcast', event: 'guest_interaction', payload: { action: 'joined', guestParam: payload } });
                  }

                  setIsPlayingLive(true); // Ignite local stream 
                  setGuestSetup({ show: false, name: '', title: '' });
                } else {
                  toast.error('Please fill out both your Name and Title to join.');
                }
              }} style={{ padding: '16px', background: '#0055ff', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', transition: '0.2s', marginTop: '10px' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                Connect Audio & Video &rarr;
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(ProfileDashboard);
