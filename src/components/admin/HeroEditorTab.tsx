import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { AiTextArea } from './AiComponents';

export const HeroEditorTab = ({ wlConfig }: { wlConfig: any }) => {
  const [heroCopy, setHeroCopy] = useState(wlConfig.heroCopy || '');
  const [heroLayoutMode, setHeroLayoutMode] = useState<'verbiage' | 'video' | 'slider'>(wlConfig?.heroLayoutMode || 'verbiage');
  const [heroVideoUrl, setHeroVideoUrl] = useState(wlConfig?.heroVideoUrl || '');
  const [heroVideoTitle, setHeroVideoTitle] = useState(wlConfig?.theme?.heroVideoTitle || wlConfig?.heroVideoTitle || '');
  const [heroImage, setHeroImage] = useState(wlConfig?.theme?.heroImage || '');
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [aiBgPrompt, setAiBgPrompt] = useState('');
  const [generatingAiBg, setGeneratingAiBg] = useState(false);

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
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingHeroVideo(false);
    }
  };

  const handleHeroImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setUploadingHeroImage(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setHeroImage(data.publicUrl);
        alert('Image uploaded successfully!');
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const executeSave = async () => {
    try {
      setUploadStatus('uploading');
      
      const updatedTheme = {
        ...wlConfig.theme,
        heroCopy,
        heroLayoutMode,
        heroVideoUrl,
        heroVideoTitle,
        heroImage
      };

      const { error } = await supabase.from('whitelabel_configs').update({
        theme: updatedTheme
      }).eq('id', wlConfig.id);
      
      if (error) throw error;

      // Sync local storage
      const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
      const index = localNetworks.findIndex((n: any) => n.id === wlConfig.id);
      if (index >= 0) {
        localNetworks[index].theme = updatedTheme;
        localNetworks[index].heroCopy = heroCopy;
        localStorage.setItem('vibe_local_networks', JSON.stringify(localNetworks));
      }

      setUploadStatus('success');
      setTimeout(() => setUploadStatus(null), 3000);
      alert('Live Architecture Successfully Deployed to Master Server!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      alert('Save failed: ' + e.message);
      setUploadStatus(null);
    }
  };

  return (
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

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
         <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Hero Background Image</h3>
         <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', marginBottom: '10px' }}>Upload a custom image to serve as the atmospheric background for the hero section.</p>
         
         {heroImage && <img src={heroImage} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} alt="Hero Preview" />}
         
         <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Generate with AI</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
               <input type="text" value={aiBgPrompt} onChange={(e) => setAiBgPrompt(e.target.value)} placeholder="e.g. A cyberpunk city skyline at night with neon pink lights..." style={{ flex: 1, minWidth: '300px', padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
               <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: uploadingHeroImage ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                  {uploadingHeroImage ? 'Uploading...' : 'Upload & Remix Image'}
                  <input type="file" accept="image/*" onChange={async (e) => {
                     try {
                        if (!e.target.files || e.target.files.length === 0) return;
                        setUploadingHeroImage(true);
                        const file = e.target.files[0];
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
                        const filePath = `hero/${fileName}`;
                        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
                        if (uploadError) throw uploadError;
                        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
                        if (data?.publicUrl) {
                           setAiBgPrompt(`Remix and enhance this image into a high quality masterpiece: ${data.publicUrl}`);
                        }
                     } catch (err: any) { alert('Upload failed: ' + err.message); } 
                     finally { setUploadingHeroImage(false); }
                  }} style={{ display: 'none' }} disabled={uploadingHeroImage} />
               </label>
               <button 
                  onClick={() => {
                     if (!aiBgPrompt.trim()) return;
                     setGeneratingAiBg(true);
                     const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiBgPrompt)}?width=1920&height=1080&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                     setTimeout(() => {
                        setHeroImage(imageUrl);
                        setGeneratingAiBg(false);
                     }, 1500);
                  }}
                  disabled={generatingAiBg || !aiBgPrompt.trim()}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', background: `linear-gradient(135deg, ${wlConfig?.accent || 'var(--accent-primary)'}, rgba(0,0,0,0.8))`, border: `1px solid ${wlConfig?.accent || 'var(--accent-primary)'}44`, borderRadius: '12px', cursor: (generatingAiBg || !aiBgPrompt.trim()) ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: '#fff' }}
               >
                  {generatingAiBg ? 'Generating...' : 'Generate Image'}
               </button>
            </div>
         </div>

         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold' }}>OR USE EXISTING</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
         </div>

         <div style={{ display: 'flex', gap: '12px' }}>
            <input type="text" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="e.g. https://images.unsplash.com/..." style={{ flex: 1, padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: uploadingHeroImage ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
               {uploadingHeroImage ? 'Uploading...' : 'Upload Image'}
               <input type="file" accept="image/*" onChange={handleHeroImageUpload} style={{ display: 'none' }} disabled={uploadingHeroImage} />
            </label>
         </div>
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
        <AiTextArea label="Hero Marketing Verbiage" defaultValue={heroCopy} accent={wlConfig.accent} onChange={(v) => setHeroCopy(v)} />
      )}

      <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }} />
      <button onClick={executeSave} disabled={uploadStatus === 'uploading'} style={{ padding: '18px 40px', background: wlConfig.accent, color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', maxWidth: '300px', boxShadow: `0 8px 30px ${wlConfig.accent}44` }}>
        {uploadStatus === 'uploading' ? 'Saving...' : 'Save & Deploy to Live Site'}
      </button>
    </div>
  );
};
