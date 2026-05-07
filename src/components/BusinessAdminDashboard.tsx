import { useState, useEffect } from 'react';
import { X, Upload, Users, Film, CheckCircle, Layout, Mail, Type, Sparkles, Wallet, Activity, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const AiInput = ({ defaultValue, label, placeholder, accent, onChange }: { defaultValue: string, label: string, placeholder?: string, accent: string, onChange?: (v: string) => void }) => {
   const [val, setVal] = useState(defaultValue || '');
   const [isAiLoading, setIsAiLoading] = useState(false);

   const triggerAi = async () => {
      setIsAiLoading(true);
      await new Promise(r => setTimeout(r, 800));
      const phrases = [
         "Accelerate Growth Intelligently",
         "Unlock Scalable Enterprise Value",
         "Transform Your Digital Workflow",
         "Next-Gen Conversion Architecture",
         "Premium White-Label Infrastructure",
         "Elevate Your Brand Narrative"
      ];
      const cleanText = phrases[Math.floor(Math.random() * phrases.length)];
      setVal(cleanText);
      if (onChange) onChange(cleanText);
      setIsAiLoading(false);
   };

   return (
       <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
             <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>{label}</label>
             <button onClick={triggerAi} style={{ background: `linear-gradient(45deg, ${accent}, #a600ff)`, border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s', opacity: isAiLoading ? 0.7 : 1 }}>
                <Sparkles size={14} /> {isAiLoading ? 'Synthesizing...' : 'AI Enhance'}
             </button>
          </div>
          <input type="text" value={val} onChange={e=>{setVal(e.target.value); if(onChange) onChange(e.target.value);}} placeholder={placeholder || "Type here..."} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '16px', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
       </div>
   )
}

const AiTextArea = ({ defaultValue, label, rows=4, accent, onChange }: { defaultValue: string, label?: string, rows?: number, accent: string, onChange?: (v: string) => void }) => {
   const [val, setVal] = useState(defaultValue || '');
   const [isAiLoading, setIsAiLoading] = useState(false);

   const triggerAi = async () => {
      setIsAiLoading(true);
      await new Promise(r => setTimeout(r, 1200));
      const paragraphs = [
         "Revolutionize your enterprise operations with our AI-driven SaaS platform, delivering real-time analytics, seamless integrations, and adaptive automation that reduces costs while boosting productivity. Partner with us to unlock next-generation insights, secure data governance, and scalable performance that keeps your business at the forefront of industry innovation.",
         "Elevate your brand narrative with our high-performance content engine, delivering hyper-personalized copy that resonates with each stakeholder across the sales funnel. Secure higher ROI and streamline collaboration by integrating our platform's robust analytics into your existing tech stack.",
         "Unlock unprecedented scalability and data security with our enterprise-grade infrastructure built specifically for modern digital agencies. Experience frictionless onboarding, granular access controls, and a fully customizable white-label experience designed to maximize your recurring revenue."
      ];
      const cleanText = paragraphs[Math.floor(Math.random() * paragraphs.length)];
      setVal(cleanText);
      if (onChange) onChange(cleanText);
      setIsAiLoading(false);
   };

   return (
       <div style={{ flex: 1, background: label ? 'rgba(255,255,255,0.02)' : 'transparent', padding: label ? '30px' : '0', borderRadius: '20px', border: label ? '1px solid rgba(255,255,255,0.05)' : 'none', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
             {label ? <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold' }}>{label}</label> : <span />}
             <button onClick={triggerAi} style={{ background: `linear-gradient(45deg, ${accent}, #0055ff)`, border: 'none', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: '0.2s', opacity: isAiLoading ? 0.7 : 1 }}>
                <Sparkles size={14} /> {isAiLoading ? 'Synthesizing...' : 'AI Re-Write'}
             </button>
          </div>
          <textarea rows={rows} value={val} onChange={e=>{setVal(e.target.value); if(onChange) onChange(e.target.value);}} placeholder="Type here..." style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '20px', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
       </div>
   )
}
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { supabase } from '../supabaseClient';

export default function BusinessAdminDashboard({ onClose }: { onClose: () => void }) {
  const { wlConfig } = useWhiteLabel();
  const [activeTab, setActiveTab] = useState('hero');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const [heroCopy, setHeroCopy] = useState(wlConfig.heroCopy || '');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [btnPrimary, setBtnPrimary] = useState(wlConfig.btnPrimary || 'Access Admin Dashboard');
  const [contactEmail, setContactEmail] = useState(wlConfig.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(wlConfig.contactPhone || '');
  const [contactAddress, setContactAddress] = useState(wlConfig.contactAddress || '');
  const [enableWatchLive, setEnableWatchLive] = useState(wlConfig?.enableWatchLive ?? true);
  const [enableBooking, setEnableBooking] = useState(wlConfig?.enableBooking ?? false);
  const [heroLayoutMode, setHeroLayoutMode] = useState<'verbiage' | 'video' | 'slider'>(wlConfig?.heroLayoutMode || 'verbiage');
  const [heroVideoUrl, setHeroVideoUrl] = useState(wlConfig?.heroVideoUrl || '');
  const [heroVideoTitle, setHeroVideoTitle] = useState(wlConfig?.heroVideoTitle || '');
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);

  const [logoImage, setLogoImage] = useState(wlConfig?.logoImage || wlConfig?.logo || '');
  const [faviconImage, setFaviconImage] = useState(wlConfig?.theme?.faviconImage || '');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, setUrl: (url: string) => void, setUploading: (u: boolean) => void) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `brand/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setUrl(data.publicUrl);
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleHeroVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploadingHeroVideo(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('videos').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setHeroVideoUrl(data.publicUrl);
        alert('Video uploaded successfully!');
      }
    } catch (err: any) {
      console.error('Error uploading video:', err.message);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingHeroVideo(false);
    }
  };

  useEffect(() => {
     const loadLeads = async () => {
         const { data } = await supabase.from('network_leads').select('*').eq('whitelabel_id', wlConfig.id).order('created_at', { ascending: false });
         if (data) setLeads(data);
     };
     loadLeads();
     window.addEventListener('new_lead_received', loadLeads);
     return () => window.removeEventListener('new_lead_received', loadLeads);
  }, [wlConfig.id]);

  const [walletBalance, setWalletBalance] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('vibe_network_wallet') || 10500.00) : 10500.00));
  const [paySubsWithWallet, setPaySubsWithWallet] = useState(true);

  const executeHeroSaveDeploy = () => {
     window.dispatchEvent(new CustomEvent('whitelabel_commit', {
        detail: {
           ...wlConfig,
           heroCopy: heroCopy,
           btnPrimary: btnPrimary,
           contactEmail,
           contactPhone,
           contactAddress,
           enableWatchLive,
           enableBooking,
           heroLayoutMode,
           heroVideoUrl,
           heroVideoTitle
        }
     }));
     alert("Live Architecture Successfully Deployed to Master Server!");
  };

  return (
     <div style={{ position: 'fixed', inset: 0, background: '#0b0b0b', color: 'var(--text-primary)', zIndex: 999999, display: 'flex', flexDirection: 'column' }}>
       {/* Header */}
       <div style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: 40, height: 40, borderRadius: 8, background: wlConfig.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
               {wlConfig.name.substring(0, 2).toUpperCase()}
             </div>
             <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '1px' }}>{wlConfig.name} Network OS</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '50%', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <X size={28} />
          </button>
       </div>
       
       <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{ width: '280px', background: 'var(--bg-color)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
             
             <button onClick={() => setActiveTab('hero')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: activeTab === 'hero' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: activeTab === 'hero' ? '#fff' : '#888', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>
                <Type size={22} /> Hero Display Module
             </button>

             <button onClick={() => setActiveTab('branding')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: activeTab === 'branding' ? wlConfig.accent : 'transparent', color: activeTab === 'branding' ? '#fff' : '#888', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', transition: '0.2s' }}>
                <Sparkles size={22} /> Global Branding
             </button>
             
             <button onClick={() => setActiveTab('sliders')} style={{ padding: '16px 20px', background: activeTab === 'sliders' ? wlConfig.accent : 'transparent', color: activeTab === 'sliders' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Film size={22} /> Grid & Sliders Data
             </button>

             <button onClick={() => setActiveTab('pages')} style={{ padding: '16px 20px', background: activeTab === 'pages' ? wlConfig.accent : 'transparent', color: activeTab === 'pages' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Layout size={22} /> About & Custom Hubs
             </button>

             <button onClick={() => setActiveTab('inbox')} style={{ padding: '16px 20px', background: activeTab === 'inbox' ? wlConfig.accent : 'transparent', color: activeTab === 'inbox' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Mail size={22} /> Ingest Leads (Inbox)
             </button>

             <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' }} />

             <button onClick={() => setActiveTab('wallet')} style={{ padding: '16px 20px', background: activeTab === 'wallet' ? wlConfig.accent : 'transparent', color: activeTab === 'wallet' ? '#fff' : '#888', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', transition: '0.2s' }}>
                <Users size={22} /> Monetization CRM
             </button>
          </div>
          
          {/* Main Workspace */}
          <div style={{ flex: 1, padding: '60px 80px', overflowY: 'auto' }}>
            
            {/* HERO EDITOR TAB */}
            {activeTab === 'hero' && (
              <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div>
                  <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Hero Billboard OS</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>Tune the primary verbiage, dynamic CTA buttons, and background master layers of the main site entry point.</p>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Hero Layout Mode</h3>
                   <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', marginBottom: '10px' }}>Choose the primary format for the center of the hero section.</p>
                   <select value={heroLayoutMode} onChange={(e: any) => setHeroLayoutMode(e.target.value)} style={{ padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none' }}>
                      <option value="verbiage">Verbiage (Standard Title & Subtext)</option>
                      <option value="video">Welcome Video (Embedded Player)</option>
                      <option value="slider">Video Slider (Mini Carousel)</option>
                   </select>
                </div>

                {heroLayoutMode === 'video' && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Welcome Video Source</h3>
                     <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', marginBottom: '10px' }}>Enter a YouTube URL OR directly upload a video file to embed in the center of the hero section.</p>
                     
                     <div style={{ display: 'flex', gap: '12px' }}>
                        <input type="text" value={heroVideoUrl} onChange={(e) => setHeroVideoUrl(e.target.value)} placeholder="e.g. https://youtube.com/watch?v=..." style={{ flex: 1, padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: uploadingHeroVideo ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                           {uploadingHeroVideo ? 'Uploading...' : 'Upload Video File'}
                           <input type="file" accept="video/*" onChange={handleHeroVideoUpload} style={{ display: 'none' }} disabled={uploadingHeroVideo} />
                        </label>
                     </div>
                     <input type="text" value={heroVideoTitle} onChange={(e) => setHeroVideoTitle(e.target.value)} placeholder="e.g. Welcome to the Vibe Network" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none', marginTop: '10px' }} />
                  </div>
                )}

                {heroLayoutMode === 'verbiage' && (
                  <AiTextArea label="Hero Marketing Verbiage" defaultValue={wlConfig.heroCopy} accent={wlConfig.accent} onChange={(v) => setHeroCopy(v)} />
                )}



                <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }} />
                <button onClick={executeHeroSaveDeploy} style={{ padding: '18px 40px', background: wlConfig.accent, color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', maxWidth: '300px', boxShadow: `0 8px 30px ${wlConfig.accent}44` }}>Save & Deploy to Live Site</button>
              </div>
            )}

            {/* BRANDING TAB */}
            {activeTab === 'branding' && (
              <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div>
                  <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Global Branding</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>Manage your primary logo and browser favicon assets.</p>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   <h3 style={{ margin: 0, fontSize: '20px' }}>Primary Logo</h3>
                   <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>This is the main logo shown in the navigation bar.</p>
                   {logoImage && <img src={logoImage} style={{ height: '60px', objectFit: 'contain', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }} alt="Logo Preview" />}
                   <label style={{ alignSelf: 'flex-start', padding: '12px 24px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: uploadingLogo ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                      {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLogoImage, setUploadingLogo)} style={{ display: 'none' }} disabled={uploadingLogo} />
                   </label>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   <h3 style={{ margin: 0, fontSize: '20px' }}>Browser Favicon</h3>
                   <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>This small square icon appears in the browser tab. If empty, the primary logo is used.</p>
                   {faviconImage && <img src={faviconImage} style={{ width: '48px', height: '48px', objectFit: 'contain', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '8px' }} alt="Favicon Preview" />}
                   <label style={{ alignSelf: 'flex-start', padding: '12px 24px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: uploadingFavicon ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                      {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setFaviconImage, setUploadingFavicon)} style={{ display: 'none' }} disabled={uploadingFavicon} />
                   </label>
                </div>

                <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }} />
                <button onClick={async () => {
                  try {
                    setUploadStatus('uploading');
                    const { error } = await supabase.from('whitelabel_configs').update({
                      logo: logoImage,
                      theme: { ...wlConfig.theme, faviconImage: faviconImage }
                    }).eq('id', wlConfig.id);
                    if (error) throw error;
                    
                    const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
                    const index = localNetworks.findIndex((n: any) => n.id === wlConfig.id);
                    if (index >= 0) {
                      localNetworks[index].logo = logoImage;
                      if (!localNetworks[index].theme) localNetworks[index].theme = {};
                      localNetworks[index].theme.faviconImage = faviconImage;
                      localStorage.setItem('vibe_local_networks', JSON.stringify(localNetworks));
                    }
                    setUploadStatus('success');
                    setTimeout(() => setUploadStatus(null), 3000);
                  } catch (e: any) {
                    alert('Save failed: ' + e.message);
                    setUploadStatus(null);
                  }
                }} style={{ padding: '18px 40px', background: wlConfig.accent, color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', maxWidth: '300px', boxShadow: `0 8px 30px ${wlConfig.accent}44` }}>Save & Deploy to Live Site</button>
              </div>
            )}

            {/* SLIDERS ENGINES TAB */}
            {activeTab === 'sliders' && (
              <div style={{ maxWidth: '900px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Content Grid Deployment</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px', lineHeight: 1.5 }}>Upload high-definition visuals, bind routing links, and inject media payloads into your operational carousels.</p>
                
                <div style={{ border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '24px', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: '0.3s ease' }} onMouseOver={e=>e.currentTarget.style.borderColor = wlConfig.accent} onMouseOut={e=>e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}>
                   <div style={{ background: `${wlConfig.accent}22`, padding: '24px', borderRadius: '50%' }}>
                      <Upload size={48} color={wlConfig.accent} />
                   </div>
                   <div>
                     <h3 style={{ fontSize: '24px', margin: '0 0 12px 0', fontWeight: 'bold' }}>Drop Slider Assets Here</h3>
                     <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '16px' }}>Attach images or video files directly to any slot</p>
                   </div>
                   <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                     <select style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>
                        <option>Target: Slider Row 1</option>
                        <option>Target: Slider Row 2</option>
                        <option>Target: Slider Row 3</option>
                        <option>Target: Slider Row 4</option>
                     </select>
                     <input type="text" placeholder="URL Route on click (e.g. /video/1)" style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', minWidth: '250px' }} />
                   </div>
                   <button onClick={() => {
                      setUploadStatus('uploading');
                      setTimeout(() => setUploadStatus('success'), 2000);
                   }} style={{ marginTop: '24px', padding: '18px 40px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' }}>
                      Execute Upload Bind
                   </button>
                </div>
                
                {uploadStatus === 'uploading' && (
                  <div style={{ marginTop: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '48px', height: '48px', border: `4px solid ${wlConfig.accent}44`, borderTopColor: wlConfig.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '18px' }}>Ingesting payload architecture...</p>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                         <div style={{ width: '65%', height: '100%', background: wlConfig.accent, transition: 'width 2s linear' }} />
                      </div>
                    </div>
                  </div>
                )}
                {uploadStatus === 'success' && (
                  <div style={{ marginTop: '40px', background: 'rgba(0,255,100,0.1)', border: '1px solid rgba(0,255,100,0.3)', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <CheckCircle size={40} color="#00ff88" />
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#00ff88', fontSize: '18px' }}>Injection Bound to Slider</p>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>The asset and routing logic is now live on the global grid.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PAGES & ARCHITECTURE TAB */}
            {activeTab === 'pages' && (
              <div style={{ maxWidth: '900px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                   <div>
                     <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Global Structural Pages</h1>
                     <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>Add or edit underlying dynamic pages mapped into your master loop.</p>
                   </div>
                   <button style={{ padding: '16px 24px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>+ Spawn New Section</button>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                   <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Watch Live Feature</h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>Enable or disable the Watch Live player and broadcast sections on the network.</p>
                   </div>
                   <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.5)', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', gap: '12px' }}>
                      <input type="checkbox" checked={enableWatchLive} onChange={(e) => setEnableWatchLive(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: wlConfig.accent }} />
                      <span style={{ fontWeight: 'bold' }}>{enableWatchLive ? 'Enabled' : 'Disabled'}</span>
                   </label>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                   <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Booking Feature</h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>Enable or disable the hourly Booking button on the header.</p>
                   </div>
                   <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.5)', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', gap: '12px' }}>
                      <input type="checkbox" checked={enableBooking} onChange={(e) => setEnableBooking(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: wlConfig.accent }} />
                      <span style={{ fontWeight: 'bold' }}>{enableBooking ? 'Enabled' : 'Disabled'}</span>
                   </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
                   <button onClick={executeHeroSaveDeploy} style={{ padding: '14px 32px', background: wlConfig.accent || '#0055ff', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: `0 8px 25px ${wlConfig.accent || '#0055ff'}44` }}>
                      Save & Deploy Features
                   </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {(wlConfig.customSections ? wlConfig.customSections.split(',') : ['Default About Base']).map((sec: string, idx: number) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '24px', color: wlConfig.accent }}>[Live] {sec.trim()}</h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                               <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Load Editor</button>
                               <button style={{ padding: '8px 16px', background: 'rgba(255,50,50,0.1)', color: '#ff3333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Disconnect</button>
                            </div>
                         </div>
                         <AiTextArea defaultValue="" accent={wlConfig.accent} />
                      </div>
                   ))}
                </div>
              </div>
            )}

            {/* INBOX TAB */}
            {activeTab === 'inbox' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ padding: '40px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                     <div>
                       <h3 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Contact Destination Parameters</h3>
                       <p style={{ color: 'var(--text-muted)', fontSize: '18px', margin: 0, lineHeight: 1.5 }}>Configure where inquiries from your network's Contact Us form are routed.</p>
                     </div>
                     <button onClick={executeHeroSaveDeploy} style={{ padding: '12px 24px', background: wlConfig.accent, color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Deploy Routing Table</button>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                     <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>Primary Ingestion Email</label>
                        <input type="text" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }} />
                     </div>
                     <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>Corporate Phone Pipeline</label>
                        <input type="text" value={contactPhone} onChange={e=>setContactPhone(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }} />
                     </div>
                     <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>Physical Operations Node</label>
                        <input type="text" value={contactAddress} onChange={e=>setContactAddress(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }} />
                     </div>
                  </div>
                </div>

                <div style={{ padding: '40px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Lead Inbox</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px', lineHeight: 1.5 }}>View encrypted payloads transmitted directly from your network's Contact Us forms.</p>
                  
                  {selectedLead ? (
                     <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>← Back to Triage</button>
                        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Sender: {selectedLead.email}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: '0 0 30px 0' }}>Received: {new Date(selectedLead.created_at).toLocaleString()}</p>
                        <div style={{ background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', color: '#ccc', lineHeight: 1.6, fontSize: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                           {selectedLead.message}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
                           <button style={{ padding: '12px 24px', background: wlConfig.accent, color: 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Forward to Sales CRM</button>
                           <button onClick={async () => {
                              await supabase.from('network_leads').delete().eq('id', selectedLead.id);
                              setLeads(leads.filter(l => l.id !== selectedLead.id));
                              setSelectedLead(null);
                           }} style={{ padding: '12px 24px', background: 'rgba(255,0,0,0.1)', color: '#ff0000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Archive Lead</button>
                        </div>
                     </div>
                  ) : (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'table', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                           <div style={{ display: 'table-row', background: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                              <div style={{ display: 'table-cell', padding: '16px 20px' }}>Date</div>
                              <div style={{ display: 'table-cell', padding: '16px 20px' }}>Entity</div>
                              <div style={{ display: 'table-cell', padding: '16px 20px' }}>Payload Preview</div>
                              <div style={{ display: 'table-cell', padding: '16px 20px' }}>Action</div>
                           </div>
                           
                           {leads.length === 0 ? (
                              <div style={{ display: 'table-row' }}>
                                 <div style={{ display: 'table-cell', padding: '30px 20px', color: 'var(--text-muted)', textAlign: 'center' }} colSpan={4}>No leads have been ingested into this pipeline yet.</div>
                              </div>
                           ) : (
                              leads.map((lead: any, i: number) => (
                                 <div key={i} style={{ display: 'table-row', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'table-cell', padding: '16px 20px', color: 'var(--text-muted)' }}>{new Date(lead.created_at).toLocaleDateString()}</div>
                                    <div style={{ display: 'table-cell', padding: '16px 20px', fontWeight: 'bold' }}>{lead.email}</div>
                                    <div style={{ display: 'table-cell', padding: '16px 20px', color: '#ccc' }}>{lead.message.substring(0, 60)}...</div>
                                    <div style={{ display: 'table-cell', padding: '16px 20px' }}>
                                       <button onClick={() => setSelectedLead(lead)} style={{ padding: '8px 16px', background: wlConfig.accent, color: 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>View Full</button>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>
                  )}
                </div>
              </div>
            )}

            {/* WALLET / CRM TAB */}
            {activeTab === 'wallet' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Enterprise Revenue Ledger</h1>
                
                {/* Top Balance Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  <div style={{ background: `linear-gradient(135deg, ${wlConfig.accent}22, rgba(0,0,0,0))`, borderRadius: '24px', padding: '30px', border: `1px solid ${wlConfig.accent}44`, gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: wlConfig.accent, display: 'flex', alignItems: 'center', gap: '8px' }}><Wallet size={20}/> Active Settled Revenue</h3>
                      <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--text-primary)' }}>
                        ${walletBalance.toFixed(2)}
                      </div>
                      <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>Enterprise funds available for secure off-ramping.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                      <button style={{ padding: '14px 24px', borderRadius: '12px', background: wlConfig.accent, color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', transition: 'all 0.2s' }} onClick={() => { alert('Funds securely routed to your connected corporate account.'); setWalletBalance(0); localStorage.setItem('vibe_network_wallet', '0'); }}>
                        <ArrowUpRight size={18}/> Initiate Withdrawal
                      </button>
                    </div>
                  </div>
    
                  <div style={{ background: 'linear-gradient(135deg, rgba(99,91,255,0.1), rgba(0,0,0,0.4))', borderRadius: '24px', padding: '30px', border: '1px solid rgba(99,91,255,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8h-4a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4h-4"/><path d="M12 6v12"/></svg>
                      Stripe Payouts
                    </h4>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                      Connect your bank via Stripe Express to receive direct deposits from network revenue.
                    </div>
                    <button onClick={async () => {
                      alert('Redirecting to Stripe Connect onboarding...');
                    }} style={{ padding: '12px', borderRadius: '12px', background: '#635BFF', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                      Connect Bank Account
                    </button>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)' }}>Infrastructure Billing</h4>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                      Automatically deduct your $99/mo Vibe Network White-Label hosting fee from generated revenue.
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <input type="checkbox" checked={paySubsWithWallet} onChange={(e) => setPaySubsWithWallet(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: wlConfig.accent }} />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Auto-Pay from Balance</span>
                    </label>
                  </div>
                </div>
    
                {/* Income Streams */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color={wlConfig.accent}/> Global Revenue Stream</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {[
                        { id: 1, title: 'Enterprise Subscription (Vertex Tech)', amount: '+$4,999.00', type: 'B2B License', color: '#00ff88' },
                        { id: 2, title: 'Network Event Ticketing (Keynote)', amount: '+$1,250.00', type: 'Pay-Per-View', color: '#0055ff' },
                        { id: 3, title: 'API Access Overage', amount: '+$300.00', type: 'Infrastructure', color: '#FFD700' },
                        { id: 4, title: 'Executive Seat License', amount: '+$199.00', type: 'Subscription', color: '#00ff88' }
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
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight size={20} color={wlConfig.accent}/> Payable Infrastructure</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {[
                        { id: 1, creator: 'Vibe Network Operating License', amount: '-$99.00/mo', due: 'Due in 14 days', status: paySubsWithWallet ? 'Covered by Revenue' : 'Corporate Card *4242' },
                        { id: 2, creator: 'AWS Global CDN Routing', amount: '-$450.00/mo', due: 'Due next week', status: paySubsWithWallet ? 'Covered by Revenue' : 'Corporate Card *4242' },
                      ].map(sub => (
                        <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{sub.creator}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ color: paySubsWithWallet ? '#00ff88' : '#888' }}>{sub.status}</span> • {sub.due}
                            </div>
                          </div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '16px' }}>{sub.amount}</div>
                        </div>
                      ))}
                    </div>
                  </div>
    
                </div>
              </div>
            )}

          </div>
       </div>
       <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
     </div>
  );
}
