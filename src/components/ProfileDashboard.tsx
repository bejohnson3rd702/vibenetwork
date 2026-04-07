import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Camera, Lock, Unlock, Image as ImageIcon, Star, ShieldCheck, Eye, Edit2, Wand, Calendar, Edit3, Clock, CheckCircle, Heart, MessageCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ProfileDashboard: React.FC<{ user: any }> = ({ user }) => {
  const navigate = useNavigate();
  const { creatorId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'store' | 'live' | 'booking' | 'series' | 'courses' | 'vibe_agency' | 'scheduler'>('feed');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Live Stream State
  const [isPlayingLive, setIsPlayingLive] = useState(false);
  const [liveEmbedUrl, setLiveEmbedUrl] = useState('https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0');
  const [streamSource, setStreamSource] = useState<'url' | 'camera'>('url');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
     let currentStream: MediaStream | null = null;

     if (isPlayingLive && streamSource === 'camera') {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
           .then(stream => {
              currentStream = stream;
              if (videoRef.current) {
                 videoRef.current.srcObject = stream;
                 // Explicitly fire play in case autoPlay fails on dynamic srcObject
                 videoRef.current.play().catch(e => console.warn("Video play interrupted:", e));
              }
           })
           .catch(err => {
              console.error("Camera access denied or unavailable", err);
              alert("Could not access camera/microphone.");
              setIsPlayingLive(false);
           });
     }
     
     // Cleanup function to strictly stop hardware tracks
     return () => {
        if (currentStream) {
           currentStream.getTracks().forEach(track => track.stop());
        }
     };
  }, [isPlayingLive, streamSource]);
  
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
  const [newProduct, setNewProduct] = useState({ title: '', price: '19.99', type: 'digital', image_url: '' });
  const [uploadingProductImg, setUploadingProductImg] = useState(false);

  // Mock Feed Data
  const [feed, setFeed] = useState([
    { id: 1, title: 'Live from the Global Tech Alliance Summit', locked: true, likes: 304, date: '2 hours ago', img: 'https://image.pollinations.ai/prompt/business%20executives%20shaking%20hands%20modern%20office' },
    { id: 2, title: 'Scaling Your SaaS Infrastructure', locked: false, likes: 112, date: '1 day ago', img: 'https://image.pollinations.ai/prompt/modern%20corporate%20server%20room%20glowing%20blue%20lights' },
  ]);

  useEffect(() => {
    if (!targetProfileId) {
      navigate('/');
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
        setBio(data.bio || 'Welcome to my official Vibe Network channel!');
        setAvatarUrl(data.avatar_url || '');
        setHomepageImageUrl(data.homepage_image_url || '');
        if (data.genre) setSelectedGenre(data.genre);
        if (data.sub_price) setSubPrice(data.sub_price);
        
        // Also load products for this creator
        const { data: prodData } = await supabase!.from('products').select('*').eq('creator_id', targetProfileId);
        if (prodData && prodData.length > 0) {
          setProducts(prodData);
        } else {
          // Provide 10 premium mock products to instantly showcase the storefront UI
          setProducts([
            { id: 'm1', title: 'Priority API Access (1M Calls)', price: '299.99', type: 'digital', image_url: 'https://image.pollinations.ai/prompt/hologram%20api%20keys' },
            { id: 'm2', title: 'White-glove Onboarding Call', price: '499.00', type: 'digital', image_url: 'https://image.pollinations.ai/prompt/business%20zoom%20call' },
            { id: 'm3', title: 'Dedicated Support Account Manager', price: '1499.00', type: 'digital', image_url: 'https://image.pollinations.ai/prompt/customer%20support%20agent%20headset' },
            { id: 'm4', title: 'Custom Analytics Dashboard Add-on', price: '500.00', type: 'digital', image_url: 'https://image.pollinations.ai/prompt/data%20analytics%20dashboard' },
            { id: 'm5', title: 'Enterprise SLA Contract Upgrades', price: '2500.00', type: 'digital', image_url: 'https://image.pollinations.ai/prompt/legal%20contract%20signature' },
          ]);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [user, creatorId, navigate, isOwnProfile]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading Profile...</div>;
  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#050505' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Profile Not Found</h2>
      <p style={{ color: '#888', marginBottom: '30px' }}>This channel doesn't exist, or the user hasn't set up their profile yet.</p>
      <button onClick={() => navigate('/')} style={{ padding: '12px 30px', background: '#ff4d85', color: '#fff', border: 'none', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>Return to Home</button>
    </div>
  );

  const isInfluencer = profile?.role === 'influencer';

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
        setHomepageImageUrl(data.publicUrl);
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
      homepage_image_url: homepageImageUrl
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
    } catch(err) {
      alert('Upload failed. Did you run the storage buckets script?');
    } finally {
      setUploadingProductImg(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;
    
    // Incase the user hasn't run the products.sql script yet, we mock add it locally too
    setSaving(true);
    const mockProduct = {
      id: Math.random().toString(),
      creator_id: profile.id,
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      type: newProduct.type,
      image_url: newProduct.image_url || 'https://picsum.photos/400/400'
    };

    try {
      const { data, error } = await supabase!.from('products').insert([mockProduct]).select();
      if (!error && data) {
        setProducts(prev => [...prev, data[0]]);
      } else {
        // Fallback for demo purposes if SQL isn't run
        setProducts(prev => [...prev, mockProduct]);
      }
    } catch(e) {
      setProducts(prev => [...prev, mockProduct]);
    }

    setNewProduct({ title: '', price: '19.99', type: 'digital', image_url: '' });
    setSaving(false);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;
    
    // Add to top of mock feed
    setFeed([{ 
      id: Date.now(), title: postTitle, locked: isLocked, likes: 0, date: 'Just now', 
      img: 'https://vibenetwork.tv/wp-content/uploads/2026/02/mukap-vibe-tv-networkk_11zon.png'
    }, ...feed]);
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

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#050505', color: '#fff' }}>
      
      {/* View Toggle Bar (Only for account owner) */}
      {isOwnProfile && profile?.role === 'influencer' && (
        <div style={{ background: '#111', padding: '12px', display: 'flex', justifyContent: 'center', position: 'sticky', top: '80px', zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '30px', padding: '4px' }}>
            <button 
              onClick={() => setViewMode('edit')}
              style={{ padding: '8px 24px', borderRadius: '30px', border: 'none', background: viewMode === 'edit' ? '#fff' : 'transparent', color: viewMode === 'edit' ? '#000' : '#888', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Edit2 size={16} /> Edit Profile
            </button>
            <button 
              onClick={() => setViewMode('public')}
              style={{ padding: '8px 24px', borderRadius: '30px', border: 'none', background: viewMode === 'public' ? 'rgba(255,0,85,1)' : 'transparent', color: viewMode === 'public' ? '#fff' : '#888', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Eye size={16} /> Public Preview
            </button>
          </div>
        </div>
      )}

      {/* Feed Layout Container */}
      <div style={{ maxWidth: '800px', margin: '40px auto 0', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '100px' }}>
        
        {/* Creator Header (Editable) */}
        <div style={{ background: 'rgba(15,15,15,0.8)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          
          {isOwnProfile && (
            <button onClick={() => { supabase!.auth.signOut(); navigate('/'); }} style={{ position: 'absolute', top: 30, right: 30, background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={16} /> Logout
            </button>
          )}

          <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
            
            {/* Editable Profile Picture */}
            <div className="group" style={{ position: 'relative', cursor: 'pointer' }} onClick={handleImageClick}>
              <div style={{ 
                width: '120px', height: '120px', borderRadius: '50%', 
                background: avatarUrl ? `url(${avatarUrl})` : 'linear-gradient(135deg, #FF0055, #8A2BE2)',
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '48px', fontWeight: 'bold', border: '3px solid rgba(255,255,255,0.1)'
              }}>
                {!avatarUrl && (profile?.username ? profile.username[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'V'))}
              </div>
              {/* Camera Overlay only on Edit Mode */}
              {viewMode === 'edit' && (
                <div className="camera-overlay" style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s'
                }}>
                  <Camera size={30} color="#fff" />
                </div>
              )}
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" />
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '36px', margin: '0 0 10px 0' }}>{profile.username || 'Anonymous Creator'}</h1>
              
              {isInfluencer ? (
                <>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <span style={{ padding: '6px 14px', background: 'rgba(0,85,255,0.2)', color: '#0055ff', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Enterprise Account Node</span>
                    
                    {viewMode === 'edit' ? (
                      <>
                        <select aria-label="genre selector" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                          <option>SaaS Platform</option>
                          <option>Fintech API</option>
                          <option>AI Automation</option>
                          <option>B2B Marketplace</option>
                        </select>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(255,215,0,0.1)', color: '#FFD700', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                          $<input type="number" value={subPrice} step="0.50" onChange={(e) => setSubPrice(parseFloat(e.target.value))} style={{ width: '40px', background: 'none', border: 'none', color: '#FFD700', outline: 'none', fontWeight: 'bold' }} />/month
                        </div>
                      </>
                    ) : (
                      <>
                        <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '20px', fontSize: '12px' }}>{selectedGenre}</span>
                        {!isOwnProfile && (
                          <button style={{ background: '#FFD700', color: '#000', border: 'none', padding: '6px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Subscribe ${subPrice}/mo</button>
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
                          style={{ width: '100%', minHeight: '80px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: '#ccc', resize: 'vertical', fontSize: '14px', outline: 'none' }}
                        />
                        <button type="button" onClick={() => enhanceText('bio')} disabled={saving} style={{ position: 'absolute', right: '12px', bottom: '16px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: '#fff', border: 'none', borderRadius: '12px', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Wand size={14} /> AI Boost
                        </button>
                      </div>

                      <div style={{ marginTop: '20px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ff4d85', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ImageIcon size={16} /> Featured Homepage Banner
                        </h4>
                        <p style={{ color: '#888', fontSize: '12px', marginBottom: '10px' }}>Upload a custom image from your computer or use our AI Generator to explicitly build a hero image when your channel is featured on the homepage slider. (Overrides avatar)</p>
                        
                        {homepageImageUrl ? (
                          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', backgroundImage: `url("${homepageImageUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                            <button onClick={() => { setImageTarget('homepage'); setShowImageModal(true); }} style={{ position: 'absolute', bottom: 12, right: 12, padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', color: 'white', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                              Update Banner Image
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => { setImageTarget('homepage'); setShowImageModal(true); }} style={{ width: '100%', padding: '30px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.15)', color: '#ccc', fontSize: '14px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 'bold' }}>
                            + Select or Generate Banner Image
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                        <button onClick={saveProfile} disabled={saving} style={{ padding: '8px 20px', background: '#fff', color: '#000', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                          {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <p style={{ color: '#ccc', fontSize: '14px', lineHeight: 1.6 }}>{bio}</p>
                  )}
                </>
              ) : (
                <p style={{ color: '#888' }}>Standard Viewer Account</p>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
          <button 
            onClick={() => setActiveTab('feed')}
            style={{ background: 'none', border: 'none', color: activeTab === 'feed' ? '#fff' : '#888', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', position: 'relative' }}
          >
            Content Feed
            {activeTab === 'feed' && <motion.div layoutId="activetab" style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', background: '#ff4d85', borderRadius: '3px' }} />}
          </button>
          <button 
            onClick={() => setActiveTab('store')}
            style={{ background: 'none', border: 'none', color: activeTab === 'store' ? '#fff' : '#888', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Store
            {activeTab === 'store' && <motion.div layoutId="activetab" style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', background: '#ff4d85', borderRadius: '3px' }} />}
          </button>
          <button 
            onClick={() => setActiveTab('live')}
            style={{ background: 'none', border: 'none', color: activeTab === 'live' ? '#fff' : '#888', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Live Stream
            {activeTab === 'live' && <motion.div layoutId="activetab" style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', background: '#ff4d85', borderRadius: '3px' }} />}
          </button>
          <button 
            onClick={() => setActiveTab('booking')}
            style={{ background: 'none', border: 'none', color: activeTab === 'booking' ? '#fff' : '#888', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Booking
            {activeTab === 'booking' && <motion.div layoutId="activetab" style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', background: '#ff4d85', borderRadius: '3px' }} />}
          </button>
          <button 
            onClick={() => setActiveTab('series')}
            style={{ background: 'none', border: 'none', color: activeTab === 'series' ? '#fff' : '#888', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            TV Series
            {activeTab === 'series' && <motion.div layoutId="activetab" style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', background: '#ff4d85', borderRadius: '3px' }} />}
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            style={{ background: 'none', border: 'none', color: activeTab === 'courses' ? '#fff' : '#888', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Masterclasses
            {activeTab === 'courses' && <motion.div layoutId="activetab" style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', background: '#ff4d85', borderRadius: '3px' }} />}
          </button>
          <button 
            onClick={() => setActiveTab('vibe_agency')}
            style={{ background: 'none', border: 'none', color: activeTab === 'vibe_agency' ? '#fff' : '#888', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Vibe Agency
            {activeTab === 'vibe_agency' && <motion.div layoutId="activetab" style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', background: '#ff4d85', borderRadius: '3px' }} />}
          </button>
          
          {isOwnProfile && (
            <button 
              onClick={() => setActiveTab('scheduler')}
              style={{ background: 'none', border: 'none', color: activeTab === 'scheduler' ? '#ff4d85' : '#888', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Calendar size={18} /> Scheduler
              {activeTab === 'scheduler' && <motion.div layoutId="activetab" style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '3px', background: '#ff4d85', borderRadius: '3px' }} />}
            </button>
          )}
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
                {post.locked && !isOwnProfile && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={48} color="#FFD700" style={{ marginBottom: '16px' }} />
                    <button style={{ padding: '12px 30px', background: '#FFD700', border: 'none', borderRadius: '20px', color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
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
            {isSubscribed || isOwnProfile ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#111', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', top: 20, left: 20, background: '#ff0055', color: '#fff', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }}/> LIVE
                  </div>
                  
                  {isPlayingLive ? (
                     streamSource === 'url' ? (
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
                         ref={videoRef} 
                         autoPlay 
                         playsInline 
                         muted // Mute locally to prevent feedback loop
                         style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 5, objectFit: 'cover' }} 
                       />
                     )
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
                <div style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>VIP Backstage Broadcast</h3>
                  <p style={{ margin: 0, color: '#888' }}>Streaming live now. Uncensored and ad-free exclusively for premium subscribers.</p>
                  
                  {isOwnProfile && viewMode === 'edit' && (
                    <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.2)' }}>
                      <label style={{ display: 'block', marginBottom: '12px', color: '#ff4d85', fontWeight: 'bold', fontSize: '15px' }}>Configure Live Stream Origin</label>
                      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                         <button onClick={() => { setStreamSource('url'); setIsPlayingLive(false); }} style={{ padding: '10px 20px', background: streamSource === 'url' ? '#0055ff' : 'rgba(255,255,255,0.05)', color: streamSource === 'url' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>External URL / RTMP</button>
                         <button onClick={() => { setStreamSource('camera'); setIsPlayingLive(false); }} style={{ padding: '10px 20px', background: streamSource === 'camera' ? '#0055ff' : 'rgba(255,255,255,0.05)', color: streamSource === 'camera' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={16}/> Direct Webcam</button>
                      </div>
                      
                      {streamSource === 'url' ? (
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <input type="text" value={liveEmbedUrl} onChange={e => setLiveEmbedUrl(e.target.value)} placeholder="Embed URL (e.g. YouTube, Twitch)" style={{ flex: 1, padding: '14px', borderRadius: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '15px', outline: 'none' }}/>
                          <button onClick={() => { setIsPlayingLive(false); setTimeout(() => setIsPlayingLive(true), 300); }} style={{ padding: '14px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s' }}>Update Stream</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <p style={{ margin: 0, color: '#aaa', flex: 1 }}>Using your local hardware as the broadcast origin server. Press "Start Streaming" to ignite the feed.</p>
                          {isPlayingLive ? (
                             <button onClick={() => setIsPlayingLive(false)} style={{ padding: '14px 24px', background: 'rgba(229, 9, 20, 0.1)', color: '#e50914', border: '1px solid #e50914', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>Stop Streaming</button>
                          ) : (
                             <button onClick={() => setIsPlayingLive(true)} style={{ padding: '14px 24px', background: '#e50914', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={18}/> Start Streaming</button>
                          )}
                        </div>
                      )}
                      
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
                <button onClick={() => { alert('Stripe Checkout Flow Initiated for $' + subPrice + '/mo!'); setIsSubscribed(true); }} style={{ padding: '16px 40px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(255,77,133,0.3)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
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
                      const isPast = date < 15; // mock past dates
                      const isSelected = selectedDate === date;
                      return (
                        <button 
                          key={i} 
                          disabled={isPast}
                          onClick={() => setSelectedDate(date)}
                          style={{ 
                            aspectRatio: '1', borderRadius: '12px', border: '1px solid',
                            borderColor: isSelected ? '#ff4d85' : 'rgba(255,255,255,0.05)',
                            background: isSelected ? 'rgba(255,77,133,0.1)' : 'rgba(0,0,0,0.3)',
                            color: isPast ? '#444' : '#fff',
                            cursor: isPast ? 'not-allowed' : 'pointer',
                            fontSize: '15px', fontWeight: 'bold', transition: 'all 0.2s',
                          }}
                        >
                          {date}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                <div style={{ opacity: selectedDate ? 1 : 0.4, pointerEvents: selectedDate ? 'auto' : 'none', transition: 'all 0.3s' }}>
                  <h4 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '18px' }}>2. Available Times</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {['10:00 AM', '1:30 PM', '4:00 PM', '6:30 PM', '8:00 PM', '10:30 PM'].map(time => (
                      <button 
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        style={{ padding: '16px', borderRadius: '12px', border: '1px solid', borderColor: selectedTime === time ? '#8A2BE2' : 'rgba(255,255,255,0.05)', background: selectedTime === time ? 'rgba(138,43,226,0.1)' : 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  {/* Payment/Confirmation section */}
                  {selectedTime && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '30px', background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <h4 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '18px' }}>3. Confirm Booking</h4>
                      <input type="text" placeholder="Your Name" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: '#fff', marginBottom: '12px', outline: 'none' }} />
                      <input type="text" placeholder="Purpose of Meeting (e.g. Mixing Advice)" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '8px', color: '#fff', marginBottom: '20px', outline: 'none' }} />
                      <button onClick={() => { alert('Booking Confirmed for $' + 49 + '! Confirmation sent to your email.'); setSelectedTime(null); setSelectedDate(null); }} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(138,43,226,0.3)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                        Book Now ($49.00)
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#111', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              
              {/* Series Hero Panel */}
              <div style={{ width: '100%', height: '300px', background: 'url(https://picsum.photos/seed/cybercity/1200/500) center/cover', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.3))' }} />
                <div style={{ position: 'absolute', bottom: '30px', left: '30px', maxWidth: '500px' }}>
                  <div style={{ background: 'rgba(255,77,133,0.2)', color: '#ff4d85', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '12px', border: '1px solid #ff4d85' }}>ORIGINAL SERIES</div>
                  <h2 style={{ fontSize: '36px', margin: '0 0 10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Neon Nights: The Underground</h2>
                  <p style={{ color: '#ccc', margin: '0 0 20px 0', lineHeight: 1.5 }}>Follow the rise of the underground cyber-synth scene in the year 2026. Explicit and uncensored.</p>
                  <button onClick={() => alert('Purchasing Full Season Pass ($49.99)!')} style={{ padding: '14px 28px', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(255,255,255,0.2)' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                    Buy Full Season ($49.99)
                  </button>
                </div>
              </div>

              {/* Episodes List */}
              <div style={{ padding: '30px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Episodes (Season 1)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { ep: 1, title: 'Pilot: The Grid Offline', len: '45 min' },
                    { ep: 2, title: 'Bass Drops & Heartbeats', len: '42 min' },
                    { ep: 3, title: 'Virtual Reality Syndicates', len: '50 min' },
                    { ep: 4, title: 'The Silent Code', len: '48 min' },
                    { ep: 5, title: 'Signal Inteference', len: '41 min' },
                  ].map(episode => (
                    <div key={episode.ep} style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                      <div style={{ width: '160px', height: '90px', borderRadius: '8px', background: `url(https://picsum.photos/seed/ep${episode.ep}/300/150) center/cover`, position: 'relative', flexShrink: 0 }}>
                        <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{episode.len}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#888', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Episode {episode.ep}</div>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{episode.title}</h4>
                        <p style={{ margin: 0, color: '#aaa', fontSize: '14px', lineHeight: 1.4 }}>When the servers crash, the underground comes alive. Follow the intense journey into the dark web.</p>
                      </div>
                      <button onClick={()=>alert(`Purchased Episode ${episode.ep} for $9.99!`)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                        Buy ($9.99)
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        )}

        {activeTab === 'courses' && (
        /* ----------- COURSES TAB ----------- */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {[
              { id: 'c1', title: 'The Complete DJ Masterclass: Zero to Festival', price: 199.99, modules: 24, hours: '12.5', img: 'https://picsum.photos/seed/djcourse/400/250', progress: 0 },
              { id: 'c2', title: 'Viral Growth Secrets: Dominate TikTok', price: 99.99, modules: 14, hours: '5.0', img: 'https://picsum.photos/seed/tiktokcourse/400/250', progress: 0 },
              { id: 'c3', title: 'Ableton Live 12 Studio Deep Dive', price: 149.99, modules: 32, hours: '18.0', img: 'https://picsum.photos/seed/abletoncourse/400/250', progress: 0 },
              { id: 'c4', title: 'The Ultimate Guide to Independent Vibe Networks', price: 299.99, modules: 40, hours: '22.0', img: 'https://picsum.photos/seed/networkcourse/400/250', progress: 0 },
            ].map((course) => (
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
                    <button onClick={() => alert(`Purchasing Course: ${course.title} for $${course.price}`)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                      Enroll Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'vibe_agency' && (
        /* ----------- VIBE AGENCY TAB ----------- */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '28px', marginBottom: '16px', color: '#fff' }}>Vibe Agency Services</h3>
              <p style={{ color: '#888', fontSize: '16px', maxWidth: '600px', margin: '0 auto 30px' }}>
                Partner with our dedicated team of creative professionals. We offer full-service production, branding, and career management for elite creators.
              </p>
              <button style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #0055ff, #00d2ff)', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                Inquire for Management
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'scheduler' && isOwnProfile && (
        /* ----------- SCHEDULER TAB ----------- */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>Content Scheduler</h3>
                <p style={{ margin: 0, color: '#888', fontSize: '16px' }}>Automate your content pipeline across Vibe Network.</p>
              </div>
              <button onClick={handleNewSchedule} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(138,43,226,0.3)' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                <Edit3 size={18} /> Schedule New Post
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
              
              {/* Drafts Column */}
              <div 
                onDrop={(e) => handleDrop(e, 'draft')}
                onDragOver={handleDragOver}
                style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '400px' }}
              >
                <h4 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width:12, height:12, borderRadius:'50%', background:'#888' }}/> 
                  Drafts ({scheduledPosts.filter(p => p.status === 'draft').length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {scheduledPosts.filter(p => p.status === 'draft').map(post => (
                     <div key={post.id} draggable onDragStart={(e) => handleDragStart(e, post.id)} style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'grab' }}>
                       <div style={{ fontSize: '12px', color: post.color, fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{post.type}</div>
                       <p style={{ margin: '0 0 16px 0', fontSize: '15px', lineHeight: 1.5 }}>{post.content}</p>
                       <div style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12}/> {post.date}</div>
                     </div>
                  ))}
                </div>
              </div>

              {/* Scheduled Column */}
              <div 
                onDrop={(e) => handleDrop(e, 'scheduled')}
                onDragOver={handleDragOver}
                style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '400px' }}
              >
                <h4 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width:12, height:12, borderRadius:'50%', background:'#FFD700', boxShadow: '0 0 10px rgba(255,215,0,0.5)' }}/> 
                  Scheduled ({scheduledPosts.filter(p => p.status === 'scheduled').length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {scheduledPosts.filter(p => p.status === 'scheduled').map(post => (
                     <div key={post.id} draggable onDragStart={(e) => handleDragStart(e, post.id)} style={{ background: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,215,0,0.3)', cursor: 'grab', position: 'relative', overflow: 'hidden' }}>
                       <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#FFD700' }} />
                       <div style={{ fontSize: '12px', color: '#FFD700', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap:'6px' }}><Clock size={14}/> {post.date}</div>
                       <p style={{ margin: '0 0 16px 0', fontSize: '15px', lineHeight: 1.5 }}>{post.content}</p>
                       {post.image && <img src={post.image} alt="preview" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px' }}/>}
                     </div>
                  ))}
                </div>
              </div>

              {/* Published Column */}
              <div 
                onDrop={(e) => handleDrop(e, 'published')}
                onDragOver={handleDragOver}
                style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '400px' }}
              >
                <h4 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width:12, height:12, borderRadius:'50%', background:'#00ff88' }}/> 
                  Published ({scheduledPosts.filter(p => p.status === 'published').length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {scheduledPosts.filter(p => p.status === 'published').map(post => (
                     <div key={post.id} draggable onDragStart={(e) => handleDragStart(e, post.id)} style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', opacity: 0.6, cursor: 'grab' }}>
                       <div style={{ fontSize: '12px', color: '#00ff88', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap:'6px' }}><CheckCircle size={14}/> {post.date}</div>
                       <p style={{ margin: '0 0 16px 0', fontSize: '15px', lineHeight: 1.5 }}>{post.content}</p>
                       {post.likes && (
                         <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                           <div style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap:'4px' }}><Heart size={14}/> {post.likes}</div>
                           <div style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap:'4px' }}><MessageCircle size={14}/> {post.comments}</div>
                         </div>
                       )}
                     </div>
                  ))}
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
                      const computedUrl = `https://picsum.photos/seed/${encodeURIComponent(prompt)}/512/512`;
                      if (imageTarget === 'avatar') setAvatarUrl(computedUrl);
                      else setHomepageImageUrl(computedUrl);
                      
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
    </div>
  );
};

export default ProfileDashboard;
