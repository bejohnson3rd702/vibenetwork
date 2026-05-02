import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Camera, Lock, Unlock, Image as ImageIcon, Star, ShieldCheck, Eye, Edit2, Wand, Calendar, Edit3, Clock, CheckCircle, Heart, MessageCircle, Wallet, ArrowUpRight, ArrowDownLeft, Activity, Monitor, Settings, Video, DollarSign } from 'lucide-react';
import LiveChat from './LiveChat';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Peer from 'peerjs';
import { loadStripe } from '@stripe/stripe-js';
import { useWhiteLabel } from '../context/WhiteLabelContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const ProfileDashboard: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { wlConfig } = useWhiteLabel();
  
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
  const [activeTab, setActiveTab] = useState<'feed' | 'store' | 'live' | 'booking' | 'series' | 'courses' | 'wallet' | 'flipbook' | 'appearance' | 'my_bookings'>('feed');
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
         alert(`[STRIPE READY]\n\nThe frontend is wired up! To complete the payment for:\n${itemName} ($${amount.toFixed(2)})\n\nyou just need to deploy the Supabase Edge Function to return a sessionId.`);
       }
     } catch (error) {
       console.error("Stripe Checkout Error:", error);
       alert(`[STRIPE READY]\n\nThe frontend is wired up! To complete the payment for:\n${itemName} ($${amount.toFixed(2)})\n\nyou just need to deploy the Supabase Edge Function to return a sessionId.`);
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
      color: '#fff'
    }, ...scheduledPosts]);
  };
  
  // UI States
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageTarget, setImageTarget] = useState<'avatar' | 'homepage'>('avatar');
  
  // New Post States
  const [postTitle, setPostTitle] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [requestFeature, setRequestFeature] = useState(false);

  // Store internal state MUST be above early returns!
  const [newProduct, setNewProduct] = useState({ title: '', price: '19.99', type: 'digital', image_url: '', sizes: '', colors: '' });
  const [courses, setCourses] = useState<any[]>([]);
  const [purchasedBookings, setPurchasedBookings] = useState<any[]>([]);
  const [receivedBookings, setReceivedBookings] = useState<any[]>([]);
  const [newCourse, setNewCourse] = useState({ title: '', price: '', modules: '', hours: '', img: '' });
  const [uploadingProductImg, setUploadingProductImg] = useState(false);

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
      const { data, error } = await supabase!
        .from('profiles')
        .select('*')
        .eq('id', targetProfileId)
        .single();
      
      if (!error && data) {
        setProfile(data);
        setBio(data.bio || 'Welcome to my official channel!');
        setAvatarUrl(data.avatar_url || '');
        const baseMockImages = [
          'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&q=80&w=1200',
          'https://images.unsplash.com/photo-1598866594230-a7018322ca21?auto=format&fit=crop&q=80&w=1200'
        ];
        const pastaMockImages = Array.from({length: 20}).map((_, i) => baseMockImages[i % 5]).join(',');
        setHomepageImageUrl(data.homepage_image_url || baseMockImages[0]);
        setFlipbookImages(data.flipbook_images || pastaMockImages);
        if (data.genre) setSelectedGenre(data.genre);
        if (data.sub_price) setSubPrice(data.sub_price);
        
        // Also load products for this creator
        const { data: prodData } = await supabase!.from('products').select('*').eq('creator_id', targetProfileId);
        if (prodData && prodData.length > 0) {
          setProducts(prodData);
        } else {
          setProducts([]);
        }
        
        // Load Feed Posts
        const { data: postsData } = await supabase!.from('posts').select('*').eq('creator_id', targetProfileId).order('created_at', { ascending: false });
        if (postsData && postsData.length > 0) {
          setFeed(postsData.map((p: any) => ({
            id: p.id,
            title: p.content || p.title,
            locked: p.is_locked || false,
            likes: p.likes || 0,
            date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Just now',
            img: p.image_url || null
          })));
        } else {
          setFeed([]);
        }

        // Load Series with Episodes
        const { data: seriesData } = await supabase!.from('series').select('*, episodes(*)').eq('creator_id', targetProfileId);
        if (seriesData && seriesData.length > 0) {
          setSeriesList(seriesData);
        } else {
          setSeriesList([]);
        }

        // Load Courses
        const { data: coursesData } = await supabase!.from('courses').select('*').eq('creator_id', targetProfileId);
        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
        } else {
          setCourses([]);
        }

        // Load Bookings
        if (isOwnProfile && user) {
           const { data: pBookings } = await supabase!.from('bookings').select('*, creator:profiles!creator_id(username, full_name, avatar_url)').eq('buyer_id', user.id);
           setPurchasedBookings(pBookings || []);

           const { data: rBookings } = await supabase!.from('bookings').select('*, buyer:profiles!buyer_id(username, full_name, avatar_url)').eq('creator_id', user.id);
           setReceivedBookings(rBookings || []);
        }
      } else if (isOwnProfile) {
        // Auto-create profile if missing!
        const { data: newProfile, error: insertError } = await supabase!.from('profiles').insert({
           id: targetProfileId,
           username: user?.email?.split('@')[0] || 'NewCreator',
           full_name: 'New Creator',
           bio: 'Welcome to my official channel!',
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
      }
      setLoading(false);
    }
    loadProfile();
  }, [user, creatorId, navigate, isOwnProfile]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading Profile...</div>;
  const isGuestInvite = new URLSearchParams(location.search).get('guest_invite') === 'true';
  if (!profile && !isGuestInvite) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#050505' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Profile Not Found</h2>
      <p style={{ color: '#888', marginBottom: '30px' }}>This channel doesn't exist, or the user hasn't set up their profile yet.</p>
      <button onClick={() => navigate({ pathname: '/', search: location.search })} style={{ padding: '12px 30px', background: '#ff4d85', color: '#fff', border: 'none', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>Return to Home</button>
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
      } else if (imageTarget === 'homepage') {
        setHomepageImageUrl(prev => prev ? prev + ',' + data.publicUrl : data.publicUrl);
      }
      setShowImageModal(false);
    } catch (error: any) {
      alert('Error uploading image: ' + error.message + '\n\nDid you run the storage_buckets.sql script?');
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
    alert('Profile successfully saved to network database!');
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
      alert('Upload failed. Did you run the storage buckets script?');
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

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;
    
    const newPost = {
      creator_id: targetProfileId,
      content: postTitle,
      is_locked: isLocked,
      likes: 0,
      image_url: 'https://vibenetwork.tv/wp-content/uploads/2026/02/mukap-vibe-tv-networkk_11zon.png'
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
    alert(requestFeature ? 'Post Submitted & Feature Requested to Admins!' : 'Content Published Successfully!');
  };

  const enhanceText = async (field: 'bio' | 'post') => {
    const originalText = field === 'bio' ? bio : postTitle;
    if (!originalText || originalText.length < 5) {
      alert("Please type a few words first so the AI has something to work with!");
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
      alert("AI Enhancer simulation failed.");
    }
    setSaving(false);
  };

  if (loading || !profile) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#050505', color: '#888', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading Profile Network Data...</p>
      </div>
    );
  }

  if (showExitScreen) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '500px' }}>
           <h1 style={{ margin: '0 0 10px 0', fontSize: '36px', background: 'linear-gradient(45deg, #00ff88, #00bbff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
             Thank You!
           </h1>
           <p style={{ color: '#888', fontSize: '18px', lineHeight: '1.6', marginBottom: '30px' }}>
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
  
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', position: 'relative' }}>
      
      {/* Immersive Hero Banner */}
      {!isGuestMode && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', zIndex: 0 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${(homepageImageUrl ? homepageImageUrl.split(',')[currentBgIndex] : null) || profile?.avatar_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2500'})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.6) saturate(1.2)', transition: 'background-image 1s ease-in-out' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, #050505 100%)' }} />
          {/* Dynamic Glowing Accent */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255, 77, 133, 0.2), transparent 70%)', mixBlendMode: 'screen' }} />
        </div>
      )}

      {/* Main Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: isGuestMode ? '80px' : '200px' }}>
      
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
                style={{ padding: '8px 24px', borderRadius: '30px', border: 'none', background: viewMode === 'public' ? 'rgba(255,0,85,1)' : 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }}
              >
                <Eye size={16} /> Public Preview
              </button>
            </div>
          </div>
        )}

        {/* Feed Layout Container */}
        <div style={{ maxWidth: isGuestMode ? '1400px' : '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '100px' }}>
          
          {!isGuestMode && (
            <>
          {/* Glassmorphic Creator Header */}
          <div style={{ background: 'rgba(15, 15, 15, 0.4)', backdropFilter: 'blur(24px)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            
            {isOwnProfile && (
              <button onClick={async () => { await supabase!.auth.signOut(); window.location.href = '/' + window.location.search; }} style={{ position: 'absolute', top: 30, right: 30, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
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
                  background: avatarUrl ? `url(${avatarUrl})` : 'linear-gradient(135deg, #FF0055, #8A2BE2)',
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
                          <select aria-label="genre selector" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontSize: '13px', outline: 'none', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
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
                          <span style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontSize: '13px', backdropFilter: 'blur(10px)' }}>{selectedGenre}</span>
                          {!isOwnProfile && (
                            <button 
                              onClick={() => {
                                if (!user) { alert('Please log in to subscribe.'); return; }
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
                            style={{ width: '100%', minHeight: '100px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', color: '#fff', resize: 'vertical', fontSize: '15px', outline: 'none', backdropFilter: 'blur(10px)' }}
                          />
                          <button type="button" onClick={() => enhanceText('bio')} disabled={saving} style={{ position: 'absolute', right: '16px', bottom: '20px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: '#fff', border: 'none', borderRadius: '12px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(255,77,133,0.4)' }}>
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
                  <p style={{ color: '#aaa', fontSize: '16px' }}>Standard Viewer Account</p>
                )}
              </div>
            </div>
          </div>

          {/* Modern Pill Navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', backdropFilter: 'blur(20px)' }}>
              {[
                { id: 'feed', label: 'Content Feed' },
                { id: 'store', label: 'Store' },
                { id: 'live', label: 'Live Stream' },
                { id: 'booking', label: 'Booking' },
                { id: 'series', label: 'Episodes' },
                { id: 'courses', label: 'Masterclasses' },
                { id: 'flipbook', label: 'Flip Book' }
              ].concat((isOwnProfile && viewMode === 'edit') ? [{ id: 'my_bookings', label: 'My Bookings' }] : []).map(tab => (
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

              {isOwnProfile && (
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

              {isOwnProfile && viewMode === 'edit' && (
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

            </>
          )}
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
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', outline: 'none', paddingRight: '100px' }}
                />
                <button type="button" onClick={() => enhanceText('post')} disabled={saving} style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: '#fff', border: 'none', borderRadius: '12px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wand size={14} /> AI Boost
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                  <ImageIcon size={18} /> Media
                </button>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isLocked ? '#FFD700' : '#4CAF50', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={isLocked} onChange={(e) => setIsLocked(e.target.checked)} style={{ display: 'none' }} />
                  {isLocked ? <><Lock size={16} /> Sub. Only</> : <><Unlock size={16} /> Free</>}
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: requestFeature ? '#ff4d85' : '#888', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={requestFeature} onChange={(e) => setRequestFeature(e.target.checked)} style={{ display: 'none' }} />
                  <Star size={16} /> Request HP Feature
                </label>
              </div>
              
              <button disabled={!postTitle.trim()} type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: postTitle.trim() ? '#fff' : 'rgba(255,255,255,0.1)', color: postTitle.trim() ? '#000' : '#888', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: postTitle.trim() ? 'pointer' : 'not-allowed' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ff4d85' }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px' }}>{profile.username || 'Creator'} <ShieldCheck size={14} color="#ff4d85" style={{ display: 'inline', marginLeft: '4px' }} /></h4>
                    <span style={{ fontSize: '12px', color: '#888' }}>{post.date}</span>
                  </div>
                </div>
                {post.locked && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#FFD700', background: 'rgba(255,215,0,0.1)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                    <Lock size={12} /> Subscriber Only
                  </div>
                )}
              </div>

              {/* Post Content / Title */}
              <div style={{ padding: '0 20px 20px 20px', fontSize: '16px', lineHeight: 1.5 }}>
                {post.title}
              </div>

              {/* Post Payload (Image/Video) */}
              <div style={{ width: '100%', aspectRatio: '16/9', background: `url(${post.img})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                {post.locked && !isOwnProfile && !isSubscribed && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={48} color="#FFD700" style={{ marginBottom: '16px' }} />
                    <button 
                      onClick={() => {
                        if (!user) { alert('Please log in to subscribe.'); return; }
                        handleStripeCheckout('Monthly Subscription', Number(subPrice));
                        setIsSubscribed(true);
                      }}
                      style={{ padding: '12px 30px', background: '#FFD700', border: 'none', borderRadius: '20px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
                    >
                      Subscribe for ${subPrice}/mo to unlock
                    </button>
                  </div>
                )}
              </div>

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
                  <input type="text" placeholder="Product Title (e.g. VIP Meet & Greet, Drum Kit Vol 1)" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                </div>
                
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                  <span style={{ padding: '14px', color: '#888', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>$</span>
                  <input type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                </div>
                
                <select value={newProduct.type} onChange={e => setNewProduct({...newProduct, type: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px', cursor: 'pointer' }}>
                  <option value="digital">Digital Download / Ticket</option>
                  <option value="physical">Physical Merch (Ships)</option>
                </select>

                {newProduct.type === 'physical' && (
                  <div style={{ gridColumn: '1 / -1', display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#ccc' }}>Available Sizes (comma separated)</label>
                      <input type="text" placeholder="e.g. S, M, L, XL" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '14px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#ccc' }}>Available Colors (comma separated)</label>
                      <input type="text" placeholder="e.g. Black, White, Red" value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '14px' }} />
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
          {products.length === 0 ? (
             <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <h3 style={{ fontSize: '20px', marginTop: 0, color: '#888' }}>Store is Empty</h3>
               <p style={{ color: '#555', marginBottom: 0 }}>This creator hasn't listed any products yet.</p>
             </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {products.map(product => (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={product.id} className="store-card" style={{ background: '#111', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                  <div style={{ width: '100%', aspectRatio: '1/1', background: `url("${product.image_url}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: product.type === 'physical' ? '#ff4d85' : '#8A2BE2', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>
                      {product.type === 'physical' ? 'Physical Merch' : 'Digital Release'}
                    </div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', lineHeight: 1.4, flex: 1 }}>{product.title}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>${parseFloat(product.price).toFixed(2)}</span>
                      {viewMode === 'edit' ? (
                        <button style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                      ) : (
                        <button style={{ padding: '8px 16px', background: '#fff', border: 'none', borderRadius: '20px', color: '#000', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Buy Now</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        )}

        {activeTab === 'live' && (
        /* ----------- LIVE STREAM TAB ----------- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {isSubscribed || isOwnProfile || localGuestData !== null ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#111', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', width: '100%', background: '#000', position: 'relative' }}>
                   <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', aspectRatio: '16/9' }}>
                  {isPlayingLive && (
                     <>
                        {isPubliclyLive ? (
                           <div style={{ position: 'absolute', top: 20, left: 20, background: '#ff0055', color: '#fff', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(255,0,85,0.4)' }}>
                             <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }}/> LIVE
                           </div>
                        ) : (
                           <div style={{ position: 'absolute', top: 20, left: 20, background: '#0055ff', color: '#fff', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, textTransform: 'uppercase', boxShadow: '0 4px 15px rgba(0,85,255,0.4)' }}>
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
                         <iframe 
                           src={liveEmbedUrl} 
                           title="Live Stream Broadcast"
                           frameBorder="0" 
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                           referrerPolicy="strict-origin-when-cross-origin" 
                           allowFullScreen
                           style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 5 }}
                         />
                       )}
                       {!isOwnProfile && isPlayingLive && !isSubscribed && !hasPaidForLive ? (
                         isPreviewExpired ? (
                           <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', padding: '40px', textAlign: 'center' }}>
                             <Lock size={48} color="#ff4d85" style={{ marginBottom: '16px' }} />
                             <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', color: '#fff' }}>Preview Ended</h2>
                             <p style={{ color: '#aaa', fontSize: '16px', maxWidth: '400px', marginBottom: '24px', lineHeight: 1.5 }}>
                               Your free 90-second preview has expired. Subscribe to {profile?.username} for full access, or purchase a one-time pass to continue watching.
                             </p>
                             <div style={{ display: 'flex', gap: '16px' }}>
                               <button onClick={handleUnlockLive} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #0055ff, #00ff88)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,85,255,0.3)' }}>
                                 Unlock for ${livePrice}
                               </button>
                               <button onClick={handleSubscribe} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                                 Subscribe Now
                               </button>
                             </div>
                           </div>
                         ) : (
                           <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 30, background: 'rgba(255,0,85,0.8)', padding: '6px 12px', borderRadius: '8px', color: '#fff', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
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
                             inset: 0, background: '#000', display: 'grid', gap: '2px',
                             gridTemplateColumns: (totalSlots === 1) ? '1fr' : (totalSlots <= 4) ? '1fr 1fr' : '1fr 1fr 1fr',
                             gridTemplateRows: (totalSlots <= 2) ? '1fr' : '1fr 1fr'
                           })
                         }}>
                           {/* Main Host Webcam Slot */}
                           {showHost && (
                             <div style={{ position: 'relative', background: '#111', flexShrink: 0, pointerEvents: 'auto', ...(streamSource === 'url' ? { width: 'min(20%, 200px)', aspectRatio: '16/9', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' } : { width: '100%', height: '100%' }) }}>
                               
                               {cameraStatus === 'loading' && (
                                 <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', zIndex: 5 }}>
                                    <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#00ff88', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 15 }} />
                                    <p style={{ margin: 0, color: '#fff', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>INITIALIZING HARDWARE...</p>
                                    <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '12px' }}>Please allow access to your camera and microphone</p>
                                 </div>
                               )}
                               {cameraStatus === 'error' && (
                                 <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', zIndex: 5 }}>
                                    <div style={{ padding: '15px', borderRadius: '50%', background: 'rgba(255,0,85,0.1)', color: '#ff0055', marginBottom: 15 }}>
                                       <Video size={30} />
                                    </div>
                                    <p style={{ margin: 0, color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>CAMERA ACCESS DENIED</p>
                                    <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '12px', maxWidth: '300px', textAlign: 'center' }}>Check your browser settings to ensure the platform has hardware permissions.</p>
                                    <button onClick={() => setIsPlayingLive(false)} style={{ marginTop: '15px', padding: '8px 20px', background: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: '20px', cursor: 'pointer' }}>Close Mode</button>
                                 </div>
                               )}


                               <video 
                                 ref={videoRef} 
                                 autoPlay 
                                 playsInline 
                                 muted 
                                 style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: cameraStatus === 'active' ? 1 : 0, transition: 'opacity 0.3s' }} 
                               />
                               <div style={{ position: 'absolute', bottom: streamSource==='url'?4:10, right: streamSource==='url'?4:10, background: 'rgba(0,0,0,0.7)', padding: streamSource==='url'?'4px 8px':'6px 12px', borderRadius: '8px', textAlign: 'right', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                 <div style={{ fontWeight: 'bold', fontSize: streamSource==='url'?'11px':'14px', color: '#fff' }}>{localGuestData ? localGuestData.name : profile?.username || 'Host'}</div>
                                 <div style={{ fontSize: streamSource==='url'?'9px':'11px', color: '#00ff88', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{localGuestData ? localGuestData.title : (profile?.industry || 'Live Streamer')}</div>
                               </div>
                             </div>
                           )}
                           
                           {/* Simulated Guests Webcams Slot */}
                           {visibleGuests.map((g, i) => (
                             <div key={i} style={{ position: 'relative', background: '#222', flexShrink: 0, pointerEvents: 'auto', ...(streamSource === 'url' ? { width: 'min(20%, 200px)', aspectRatio: '16/9', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' } : { width: '100%', height: '100%' }) }}>
                               <img src={`https://images.unsplash.com/photo-${1550000000000 + (i * 1000)}?auto=format&fit=crop&w=800&q=80`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.5)' }} alt="Guest Feed" />
                               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <span style={{ background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: '20px', fontSize: '10px' }}>Guest Feed</span>
                               </div>
                               <div style={{ position: 'absolute', bottom: streamSource==='url'?4:10, right: streamSource==='url'?4:10, background: 'rgba(0,0,0,0.7)', padding: streamSource==='url'?'4px 8px':'6px 12px', borderRadius: '8px', textAlign: 'right', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                                 <div style={{ fontWeight: 'bold', fontSize: streamSource==='url'?'11px':'14px', color: '#fff' }}>{g.name}</div>
                                 <div style={{ fontSize: streamSource==='url'?'9px':'11px', color: '#00ff88', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{g.title}</div>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}

                       {/* Directed Lower Thirds Overlay */}
                       <AnimatePresence>
                          {directorLowerThirds.active && isPlayingLive && (
                             <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} style={{ position: 'absolute', bottom: 40, left: 40, zIndex: 90, pointerEvents: 'none' }}>
                                <div style={{ background: '#00ff88', color: '#000', padding: '10px 20px', fontWeight: '900', fontSize: '20px', display: 'inline-block', boxShadow: '5px 5px 0px rgba(0,0,0,0.3)' }}>
                                  {directorLowerThirds.text}
                                </div>
                                <br />
                                {directorLowerThirds.sub && (
                                  <div style={{ background: '#000', color: '#fff', padding: '6px 20px', display: 'inline-block', fontSize: '14px', borderLeft: '4px solid #00ff88', marginTop: '4px' }}>
                                     {directorLowerThirds.sub}
                                  </div>
                                )}
                             </motion.div>
                          )}
                       </AnimatePresence>
                     </>
                  ) : (
                    <>
                      <img src={homepageImageUrl || "https://vibenetwork.tv/wp-content/uploads/2026/02/silhouette-dj-playing-music_1230721-3514.webp"} alt="Live Stream Thumbnail" style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, filter: 'blur(2px)' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <button onClick={() => setIsPlayingLive(true)} style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,77,133,0.9)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(255,77,133,0.5)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.1)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
                 <div style={{ flexShrink: 0 }}>
                    <LiveChat streamId={profile?.username || 'profile'} />
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
                  }} style={{ width: '100%', padding: '16px 24px', background: 'rgba(229,9,20,0.9)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '15px', letterSpacing: '2px', boxShadow: '0 4px 20px rgba(229,9,20,0.3)' }}>
                      🛑 Disconnect & Leave Stream
                  </button>
                </div>
              )}
              <div style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>VIP Backstage Broadcast</h3>
                  <p style={{ margin: 0, color: '#888' }}>
                    {isOwnProfile ? 'Configure your live stream settings below.' : 
                     isSubscribed ? 'Live stream is free since you are subscribed!' : 
                     'Streaming live now. Subscribe for free access, or unlock this broadcast below.'}
                  </p>
                  
                  {isOwnProfile && viewMode === 'edit' && (
                    <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', background: 'rgba(0,0,0,0.4)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <label style={{ color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          Pay-Per-View Price: $
                        </label>
                        <input type="number" value={livePrice} onChange={e => setLivePrice(e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '6px', width: '80px', fontSize: '15px' }} />
                        <span style={{ color: '#888', fontSize: '13px' }}>(Free for subscribers)</span>
                      </div>
                      
                      <label style={{ display: 'block', marginBottom: '12px', color: '#ff4d85', fontWeight: 'bold', fontSize: '15px' }}>Configure Live Stream Origin</label>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                         <button onClick={() => { setStreamSource('url'); setIsPlayingLive(false); }} style={{ padding: '10px 20px', background: streamSource === 'url' ? '#0055ff' : 'rgba(255,255,255,0.05)', color: streamSource === 'url' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>External URL / RTMP</button>
                         <button onClick={() => { setStreamSource('camera'); setIsPlayingLive(false); }} style={{ padding: '10px 20px', background: streamSource === 'camera' ? '#0055ff' : 'rgba(255,255,255,0.05)', color: streamSource === 'camera' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={16}/> Direct Webcam</button>
                         
                         {/* streamSource === 'camera' && (
                            <>
                               <div style={{ flex: 1 }} />
                               <button onClick={() => {
                                  const inviteUrl = `${window.location.origin}/director?stream=${targetProfileId}`;
                                  navigator.clipboard.writeText(inviteUrl);
                                  alert('Director Protocol Activated! The Director Studio URL has been copied to your clipboard. Send this to your producer.');
                               }} style={{ padding: '10px 20px', background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', border: '1px solid currentColor', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Monitor size={16} /> Hire Director
                               </button>
                            </>
                         ) */}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {streamSource === 'url' && (
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <input type="text" value={liveEmbedUrl} onChange={e => setLiveEmbedUrl(e.target.value)} placeholder="Embed URL (e.g. YouTube, Twitch)" style={{ flex: 1, padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '15px', outline: 'none' }}/>
                            {isPlayingLive ? (
                              <button onClick={() => setIsPlayingLive(false)} style={{ padding: '14px 24px', background: 'rgba(229, 9, 20, 0.1)', color: '#e50914', border: '1px solid #e50914', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>Stop Streaming</button>
                            ) : liveCountdown !== null ? (
                              <button disabled style={{ padding: '14px 24px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>Going Live in {liveCountdown}...</button>
                            ) : (
                              <button onClick={startLiveStream} style={{ padding: '14px 24px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={18}/> Start Streaming</button>
                            )}
                          </div>
                        )}
                        
                        {streamSource === 'camera' && (
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                             <p style={{ margin: 0, color: '#aaa', flex: 1, minWidth: '200px' }}>Using your local hardware as the broadcast origin server. Press "Start Streaming" to ignite the feed.</p>
                             {isPlayingLive ? (
                               <>
                                 {!isPubliclyLive && (
                                   <button onClick={() => setIsPubliclyLive(true)} style={{ padding: '14px 24px', background: '#00ff88', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      Push Publicly Live
                                   </button>
                                 )}
                                 <button onClick={() => { setIsPlayingLive(false); setIsPubliclyLive(false); }} style={{ padding: '14px 24px', background: 'rgba(229, 9, 20, 0.1)', color: '#e50914', border: '1px solid #e50914', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Stop Streaming
                                 </button>
                               </>
                             ) : liveCountdown !== null ? (
                               <button disabled style={{ padding: '14px 24px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>Going Live in {liveCountdown}...</button>
                             ) : (
                               <button onClick={startLiveStream} style={{ padding: '14px 24px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={18}/> Start Streaming</button>
                             )}
                          </div>
                        )}

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                               <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>WebRTC Overlays & Guests</p>
                               <p style={{ margin: '4px 0 0 0', color: '#aaa', fontSize: '12px' }}>Enable your webcam and invite up to 4 guests {streamSource === 'url' ? 'over your broadcast frame' : 'to join the primary grid'}.</p>
                            </div>
                            {isPlayingLive && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {streamSource === 'url' && (
                                  <button onClick={() => setPresenterMode(!presenterMode)} style={{ padding: '8px 14px', background: presenterMode ? '#ff0055' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                                    {presenterMode ? 'Stop Presenting' : 'Show My Webcam'}
                                  </button>
                                )}
                                <button onClick={() => {
                                  const profileIdPath = creatorId || profile?.id || user?.id || 'public';
                                  const guestUrl = `${window.location.origin}/profile/${profileIdPath}?guest_invite=true`;
                                  navigator.clipboard.writeText(guestUrl).catch(()=>console.log('Clipboard skipped'));
                                  alert('Guest Invite Link copied: ' + guestUrl);
                                }} style={{ padding: '8px 14px', background: '#0055ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                                  🔗 Copy Guest Link
                                </button>

                              </div>

                              {guests.length > 0 && (
                                <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px' }}>
                                   {guests.map((g, i) => (
                                     <div key={g.id || i} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                                       <div>
                                         <div style={{color: '#fff', fontSize: '13px'}}>{g.name} <span style={{color: '#00ff88', fontSize: '10px'}}>{g.title}</span></div>
                                       </div>
                                       <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                         <button onClick={() => {
                                            const newG = [...guests];
                                            newG[i].isLive = !newG[i].isLive;
                                            setGuests(newG);
                                            localStorage.setItem('vibe_host_guests_session', JSON.stringify(newG));
                                            window.dispatchEvent(new Event('vibe_guests_updated'));
                                         }} style={{ padding: '4px 10px', background: g.isLive ? '#ff0055' : '#0055ff', color: '#fff', borderRadius: '6px', fontSize: '11px', border: 'none', cursor: 'pointer' }}>
                                           {g.isLive ? 'Remove from Stream' : 'Allow in Stream'}
                                         </button>
                                         <button onClick={() => {
                                            const newG = guests.filter((_, idx) => idx !== i);
                                            setGuests(newG);
                                            localStorage.setItem('vibe_host_guests_session', JSON.stringify(newG));
                                            window.dispatchEvent(new Event('vibe_guests_updated'));
                                         }} style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #888', color: '#888', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Disconnect</button>
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
                      
                      <p style={{ margin: '15px 0 0 0', color: '#666', fontSize: '12px' }}>This feed dictates what your active subscribers consume during live events in real-time.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'linear-gradient(135deg, rgba(255,0,85,0.1), rgba(138,43,226,0.1))', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', textAlign: 'center', padding: '80px 20px', position: 'relative' }}>
                <Lock size={56} color="#FFD700" style={{ marginBottom: '24px' }} />
                <h3 style={{ fontSize: '28px', margin: '0 0 16px 0', color: '#fff' }}>Exclusive Live Broadcast</h3>
                <p style={{ color: '#aaa', fontSize: '18px', maxWidth: '450px', margin: '0 auto 40px', lineHeight: 1.5 }}>Subscribe to {profile.username || 'this creator'} to instantly unlock their live streams and premium restricted vault content.</p>
                <button 
                  onClick={() => {
                    if (!user) { alert('Please log in to subscribe.'); return; }
                    handleStripeCheckout('Monthly Subscription', Number(subPrice));
                    setIsSubscribed(true);
                  }} 
                  style={{ padding: '16px 40px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,77,133,0.3)', transition: 'transform 0.2s' }} 
                  onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} 
                  onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                >
                  Subscribe for ${subPrice}/mo
                </button>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'booking' && (
        /* ----------- BOOKING TAB ----------- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Book {profile?.username || 'this Creator'}</h3>
              <p style={{ color: '#aaa', margin: '0 0 40px 0', fontSize: '16px' }}>Schedule a 1-on-1 session, studio consultation, or collaboration meeting.</p>
              
              {isOwnProfile && viewMode === 'edit' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.15)', marginBottom: '30px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>Creator Booking Settings</h3>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                      <span style={{ padding: '14px', color: '#888', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>Hourly Rate ($)</span>
                      <input type="number" step="0.01" value={bookingPrice} onChange={e => setBookingPrice(e.target.value)} style={{ background: 'transparent', border: 'none', padding: '14px', color: '#fff', outline: 'none', fontSize: '15px', width: '120px' }} />
                    </div>
                    <p style={{ color: '#aaa', fontSize: '14px', margin: 0, flex: 1 }}>Select dates on the calendar below to add or remove your available timeslots.</p>
                    <button onClick={() => window.location.href = `/call/room_${profile?.id || 'demo'}`} style={{ padding: '12px 24px', background: 'rgba(138,43,226,0.2)', color: '#fff', border: '1px solid #8A2BE2', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Enter Virtual Room</button>
                  </div>
                </motion.div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
                {/* Calendar View */}
                <div>
                  <h4 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '18px' }}>1. Select a Date (April)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day, i) => (
                      <div key={i} style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', padding: '10px 0', textTransform: 'uppercase' }}>{day}</div>
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
                  <h4 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '18px' }}>2. Available Times</h4>
                  
                  {isOwnProfile && viewMode === 'edit' && selectedDate ? (
                    <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#aaa' }}>Add Timeslot for April {selectedDate}</h5>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="time" value={newTimeInput} onChange={e => setNewTimeInput(e.target.value)} style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', outline: 'none' }} />
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
                          style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
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
                            style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid', borderColor: selectedTime === time ? '#8A2BE2' : 'rgba(255,255,255,0.05)', background: selectedTime === time ? 'rgba(138,43,226,0.1)' : 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
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
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No times available on this date.</p>
                  )}

                  {/* Payment/Confirmation section (Only for Guests) */}
                  {selectedTime && (!isOwnProfile || viewMode !== 'edit') && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '30px', background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h4 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '18px' }}>3. Confirm Booking</h4>
                      
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
                          <select value={bookingDuration} onChange={e => setBookingDuration(Number(e.target.value))} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: '#fff', outline: 'none', appearance: 'none', fontSize: '15px' }}>
                            <option value={1}>1 Hour Duration</option>
                            <option value={2}>2 Hours Duration</option>
                            <option value={3}>3 Hours Duration</option>
                            <option value={4}>4 Hours Duration</option>
                            <option value={8}>8 Hours (Full Day)</option>
                          </select>
                          <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888' }}>▼</div>
                        </div>
                      </div>
                      <input type="text" placeholder="Your Name" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: '#fff', marginBottom: '12px', outline: 'none' }} />
                      <input type="text" placeholder="Purpose of Meeting (e.g. Mixing Advice)" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: '#fff', marginBottom: '20px', outline: 'none' }} />
                      <button onClick={() => { handleStripeCheckout(`${bookingType === 'virtual' ? `1-on-1 Virtual Call (${virtualCallType === 'video' ? 'Video' : 'Audio'})` : 'Physical Meeting'} (April ${selectedDate} at ${selectedTime}) - ${bookingDuration} Hour(s)`, Number(bookingPrice) * bookingDuration, { is_booking: true, date: `April ${selectedDate}`, time: selectedTime, duration: bookingDuration, meeting_type: bookingType === 'virtual' ? `virtual_${virtualCallType}` : 'physical' }); setSelectedTime(null); setSelectedDate(null); }} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(138,43,226,0.3)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
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
                    <input type="text" placeholder="Series Title (e.g. Neon Nights)" value={newSeries.title} onChange={e => setNewSeries({...newSeries, title: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <textarea placeholder="Series Description..." value={newSeries.description} onChange={e => setNewSeries({...newSeries, description: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px', minHeight: '80px', resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                    <span style={{ padding: '14px', color: '#888', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>Full Season $</span>
                    <input type="number" step="0.01" placeholder="Price" value={newSeries.price} onChange={e => setNewSeries({...newSeries, price: e.target.value})} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                  </div>
                  <input type="text" placeholder="Cover Image URL (optional)" value={newSeries.img} onChange={e => setNewSeries({...newSeries, img: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={!newSeries.title || !newSeries.price} style={{ padding: '12px 24px', background: (!newSeries.title || !newSeries.price) ? 'rgba(255,255,255,0.1)' : '#ff4d85', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: (!newSeries.title || !newSeries.price) ? 'not-allowed' : 'pointer' }}>Publish Series</button>
                  </div>
                </form>
              </motion.div>
            )}

            {seriesList.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p style={{ color: '#888', fontSize: '16px', margin: 0 }}>No original series published yet.</p>
              </div>
            ) : (
              seriesList.map((series) => (
                <motion.div key={series.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#111', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  
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
                        <button onClick={() => setActiveSeriesIdForEp(activeSeriesIdForEp === series.id ? null : series.id)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                          {activeSeriesIdForEp === series.id ? 'Cancel' : '+ Add Episode'}
                        </button>
                      )}
                    </div>
                    
                    {/* Add Episode Form */}
                    {activeSeriesIdForEp === series.id && (
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#aaa' }}>New Episode for {series.title}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <input type="text" placeholder="Episode Title" value={newEpisode.title} onChange={e=>setNewEpisode({...newEpisode, title: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                          <input type="text" placeholder="Length (e.g. 45 min)" value={newEpisode.length} onChange={e=>setNewEpisode({...newEpisode, length: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                          <div style={{ gridColumn: '1 / -1' }}>
                            <textarea placeholder="Description..." value={newEpisode.description} onChange={e=>setNewEpisode({...newEpisode, description: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', outline: 'none', minHeight: '60px' }} />
                          </div>
                          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ color: '#888' }}>Price $</span>
                            <input type="number" step="0.01" placeholder="9.99" value={newEpisode.price} onChange={e=>setNewEpisode({...newEpisode, price: e.target.value})} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                            <button onClick={() => handleAddEpisode(series.id)} disabled={!newEpisode.title} style={{ padding: '10px 20px', background: newEpisode.title ? '#00ff88' : 'rgba(255,255,255,0.1)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: newEpisode.title ? 'pointer' : 'not-allowed' }}>Save</button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(!series.episodes || series.episodes.length === 0) ? (
                        <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>No episodes added to this series yet.</p>
                      ) : (
                        series.episodes.map((episode: any, idx: number) => (
                          <div key={episode.id} style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                            <div style={{ width: '160px', height: '90px', borderRadius: '8px', background: `url(https://picsum.photos/seed/ep${idx+1}/300/150) center/cover`, position: 'relative', flexShrink: 0 }}>
                              <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{episode.length || 'TBD'}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Episode {idx + 1}</div>
                              <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{episode.title}</h4>
                              <p style={{ margin: 0, color: '#aaa', fontSize: '14px', lineHeight: 1.4 }}>{episode.description}</p>
                            </div>
                            <button onClick={()=>handleStripeCheckout(`Episode: ${episode.title}`, Number(episode.price || 0))} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
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
                    <input type="text" placeholder="Masterclass Title (e.g. Advanced Beatmaking)" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                    <span style={{ padding: '14px', color: '#888', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>$</span>
                    <input type="number" step="0.01" placeholder="Price" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="number" placeholder="Modules (e.g. 12)" value={newCourse.modules} onChange={e => setNewCourse({...newCourse, modules: e.target.value})} style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                    <input type="number" step="0.5" placeholder="Hours" value={newCourse.hours} onChange={e => setNewCourse({...newCourse, hours: e.target.value})} style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', gridColumn: '1 / -1', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={saving || !newCourse.title} style={{ padding: '14px 30px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', opacity: (!newCourse.title || saving) ? 0.5 : 1 }}>
                      {saving ? 'Publishing...' : 'Publish Masterclass'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {courses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '20px', marginTop: 0, color: '#888' }}>No Masterclasses</h3>
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
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '20px', fontWeight: 'bold' }}>{course.progress}% Completed</div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>${course.price}</span>
                        {viewMode === 'edit' ? (
                          <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Edit
                          </button>
                        ) : (
                          <button onClick={() => handleStripeCheckout(`Course: ${course.title}`, course.price)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
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
              <h3 style={{ fontSize: '28px', marginBottom: '16px', color: '#fff' }}>Platform Agency Services</h3>
              <p style={{ color: '#888', fontSize: '16px', maxWidth: '600px', margin: '0 auto 30px' }}>
                Partner with our dedicated team of creative professionals. We offer full-service production, branding, and career management for elite creators.
              </p>
              <button style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #0055ff, #00d2ff)', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
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
                  <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>Upload custom images from your computer or use our AI Generator to explicitly build your Flip Book.</p>
                  
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
                    <button onClick={() => { setImageTarget('flipbook'); setShowImageModal(true); }} style={{ width: '100%', padding: '40px', background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.15)', color: '#fff', fontSize: '15px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
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
                <div style={{ padding: '60px', textAlign: 'center', color: '#666', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.05)' }}>
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
                <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>Upload images to cycle through in the background of your channel.</p>
                
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
                        setHomepageImageUrl(arr.join(','));
                        setCurrentBgIndex(0);
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
                  <button onClick={() => { setImageTarget('homepage'); setShowImageModal(true); }} style={{ width: '100%', padding: '40px', background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.15)', color: '#fff', fontSize: '15px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                    + Select or Generate Background Image
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- MY BOOKINGS TAB --- */}
        {activeTab === 'my_bookings' && isOwnProfile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '24px', margin: '0 0 20px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={24} color="#ff4d85" /> Upcoming Calls (Purchased)
              </h2>
              {purchasedBookings.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic' }}>You have not booked any calls yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {purchasedBookings.map((b, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ff4d85', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                           {b.creator?.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontWeight: 'bold' }}>{b.creator?.full_name}</div>
                          <div style={{ color: '#888', fontSize: '13px' }}>@{b.creator?.username}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        <div style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} color="#aaa" /> {b.date}</div>
                        <div style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} color="#aaa" /> {b.time}</div>
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
                <h2 style={{ fontSize: '24px', margin: '0 0 20px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={24} color="#00ff88" /> Incoming Bookings (Your Schedule)
                </h2>
                {receivedBookings.length === 0 ? (
                  <p style={{ color: '#888', fontStyle: 'italic' }}>No one has booked a call with you yet.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {receivedBookings.map((b, i) => (
                      <div key={i} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                             {b.buyer?.full_name?.charAt(0) || b.guest_name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ color: '#fff', fontWeight: 'bold' }}>{b.buyer?.full_name || b.guest_name}</div>
                            <div style={{ color: '#888', fontSize: '13px' }}>Paid: ${b.price}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                          <div style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} color="#aaa" /> {b.date}</div>
                          <div style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} color="#aaa" /> {b.time}</div>
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

        {/* --- WALLET SUBSCRIPTION & EARNINGS TAB --- */}
        {activeTab === 'wallet' && isOwnProfile && viewMode === 'edit' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Balance Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              
              <div style={{ background: 'rgba(0, 255, 136, 0.05)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(0, 255, 136, 0.2)', gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#00ff88', display: 'flex', alignItems: 'center', gap: '8px' }}><Wallet size={20}/> Available Network Balance</h3>
                  <div style={{ fontSize: '48px', fontWeight: 900, color: '#fff' }}>
                    ${walletBalance.toFixed(2)}
                  </div>
                  <p style={{ margin: '8px 0 0 0', color: '#888', fontSize: '14px' }}>Available to withdraw, or use for platform subscriptions.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                  <button style={{ padding: '14px 24px', borderRadius: '12px', background: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', transition: 'all 0.2s' }} onClick={() => { alert('Funds securely routed to your connected bank account.'); setWalletBalance(0); }}>
                    <ArrowUpRight size={18}/> Withdraw Funds
                  </button>
                  <button style={{ padding: '14px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }} onClick={() => setWalletBalance(prev => prev + 100)}>
                    <ArrowDownLeft size={18}/> Deposit $100
                  </button>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, rgba(99,91,255,0.1), rgba(0,0,0,0.4))', borderRadius: '24px', padding: '30px', border: '1px solid rgba(99,91,255,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8h-4a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4h-4"/><path d="M12 6v12"/></svg>
                  Stripe Payouts
                </h4>
                <div style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                  {profile?.stripe_account_id 
                    ? "Your channel is securely connected to Stripe. Payouts are routed directly to your bank." 
                    : "Connect your bank via Stripe Express to receive direct deposits from subscribers, tips, and bookings."}
                </div>
                
                {profile?.stripe_account_id ? (
                  <button style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
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
                      alert('Failed to connect to Stripe. Please ensure your backend is running.');
                      btn.innerHTML = ogText;
                      btn.style.opacity = '1';
                    }
                  }} style={{ padding: '14px 24px', background: '#635BFF', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <ArrowUpRight size={18} /> Setup Stripe Payouts
                  </button>
                )}
              </div>

            </div>

            {/* Income Streams */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color="#ff4d85"/> Recent Collections</h3>
                
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
                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{tx.title}</div>
                        <div style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{tx.type}</div>
                      </div>
                      <div style={{ color: tx.color, fontWeight: 'bold', fontSize: '16px' }}>{tx.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight size={20} color="#ff4d85"/> Payable Subscriptions</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[].length > 0 ? [].map((sub: any) => (
                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{sub.creator}</div>
                        <div style={{ color: '#888', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: paySubsWithWallet ? '#00ff88' : '#888' }}>{sub.status}</span> • {sub.due}
                        </div>
                      </div>
                      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>{sub.amount}</div>
                    </div>
                  )) : (
                    <div style={{ color: '#888', fontStyle: 'italic', padding: '16px 0' }}>No active payable subscriptions.</div>
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
                  <input type="text" id="ai-prompt-input" placeholder="e.g. Cyberpunk DJ with neon glasses..." style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: '#fff', outline: 'none', fontSize: '15px' }} />
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
                  }} style={{ padding: '0 24px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Dream Engine</button>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: '#888', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', margin: '6px 0', opacity: 0.5 }}>— OR —</div>

              {/* Option 2: Upload from Computer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ color: '#ccc', fontSize: '14px', fontWeight: 'bold' }}>Upload Direct File via Network</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textAlign: 'center', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' }}>
                    {saving ? 'Uploading to Supabase...' : 'Choose Image File off Computer...'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={saving} />
                  </label>
                </div>
              </div>
              
              <button onClick={() => setShowImageModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', outline: 'none' }}>✕</button>
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
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>💰 Send a Tip</h2>
              <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Support the live stream. Tokens are transferred via your internal active wallet balance.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[5, 10, 20, 50].map(amt => (
                  <button key={amt} onClick={() => setTipAmount(amt)} style={{ padding: '12px', background: tipAmount === amt ? '#00ff88' : 'rgba(255,255,255,0.05)', color: tipAmount === amt ? '#000' : '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    ${amt}
                  </button>
                ))}
              </div>
              <input type="number" placeholder="Custom Amount" value={tipAmount} onChange={e => setTipAmount(Number(e.target.value))} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
              
              <button onClick={() => {
                const stored = JSON.parse(localStorage.getItem('vibe_network_ledger') || '[]');
                stored.unshift({ time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), source: 'Host Streamer Dashboard', origin: 'Direct Vibe', gross: Number(tipAmount) });
                localStorage.setItem('vibe_network_ledger', JSON.stringify(stored));
                
                const newBalance = walletBalance + Number(tipAmount);
                setWalletBalance(newBalance);
                localStorage.setItem('vibe_host_wallet', String(newBalance));

                alert(`Successfully tipped $${tipAmount}! View progress in Wallet.`);
                setShowTipModal(false);
                setTipAmount('');
              }} style={{ padding: '16px', background: 'linear-gradient(45deg, #00ff88, #00bbff)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }} disabled={!tipAmount}>
                Confirm Tip &rarr;
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
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 20px 100px rgba(0,0,255,0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,85,255,0.2)', color: '#0055ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Camera size={30} /></div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Join the Stream</h2>
                <p style={{ margin: 0, color: '#aaa', fontSize: '14px', lineHeight: 1.5 }}>You've been invited to join the broadcast. Please enter your display info so the audience knows who you are.</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Your Full Name</label>
                  <input type="text" placeholder="e.g. Jane Doe" value={guestSetup.name} onChange={e => setGuestSetup({...guestSetup, name: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', fontSize: '15px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Professional Title</label>
                  <input type="text" placeholder="e.g. Chief Marketing Officer" value={guestSetup.title} onChange={e => setGuestSetup({...guestSetup, title: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', fontSize: '15px', outline: 'none' }} />
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
                  alert('Please fill out both your Name and Title to join.');
                }
              }} style={{ padding: '16px', background: '#0055ff', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', transition: '0.2s', marginTop: '10px' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
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

export default ProfileDashboard;
