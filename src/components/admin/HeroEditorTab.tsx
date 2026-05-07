import { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { AiTextArea } from './AiComponents';

export const HeroEditorTab = ({ wlConfig }: { wlConfig: any }) => {
  const [heroCopy, setHeroCopy] = useState(wlConfig.heroCopy || '');
  const [heroLayoutMode, setHeroLayoutMode] = useState<'verbiage' | 'video' | 'slider'>(wlConfig?.heroLayoutMode || 'verbiage');
  const [heroVideoUrl, setHeroVideoUrl] = useState(wlConfig?.heroVideoUrl || '');
  const [heroVideoTitle, setHeroVideoTitle] = useState(wlConfig?.heroVideoTitle || '');
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

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

  const executeSave = async () => {
    try {
      setUploadStatus('uploading');
      
      const updatedTheme = {
        ...wlConfig.theme,
        heroCopy,
        heroLayoutMode,
        heroVideoUrl,
        heroVideoTitle
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
