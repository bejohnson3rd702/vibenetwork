import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useToast } from '../../context/ToastContext';
import { AiTextArea, AiInput } from './AiComponents';
import { DictationButton } from '../DictationButton';

export const HeroEditorTab = ({ wlConfig }: { wlConfig: any }) => {
  const toast = useToast();
  const [heroCopy, setHeroCopy] = useState(wlConfig.heroCopy || '');
  const [heroTitle, setHeroTitle] = useState(wlConfig?.theme?.heroTitle || wlConfig?.name || '');
  const [heroLayoutMode, setHeroLayoutMode] = useState<'verbiage' | 'video' | 'slider'>(wlConfig?.heroLayoutMode || 'verbiage');
  const [heroVideoUrl, setHeroVideoUrl] = useState(wlConfig?.heroVideoUrl || '');
  const [heroVideoTitle, setHeroVideoTitle] = useState(wlConfig?.theme?.heroVideoTitle || wlConfig?.heroVideoTitle || '');
  const [heroImage, setHeroImage] = useState(wlConfig?.theme?.heroImage || '');
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Drag and drop states
  const [dragActiveHeroImage, setDragActiveHeroImage] = useState(false);
  const [dragActiveHeroVideo, setDragActiveHeroVideo] = useState(false);

  const handleHeroVideoUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      setUploadingHeroVideo(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('videos').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setHeroVideoUrl(data.publicUrl);
        toast.success('Video uploaded successfully!');
      }
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploadingHeroVideo(false);
    }
  };

  const handleHeroImageUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      setUploadingHeroImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setHeroImage(data.publicUrl);
        toast.success('Image uploaded successfully!');
      }
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
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
        heroTitle,
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
      toast.success('Live Architecture Successfully Deployed to Master Server!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      toast.error('Save failed: ' + e.message);
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
         
         {heroLayoutMode === 'verbiage' && (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
               <AiInput label="Hero Title" defaultValue={heroTitle} placeholder="e.g. Vibe Network" accent={wlConfig.accent} onChange={(v) => setHeroTitle(v)} />
               <AiTextArea label="Hero Marketing Verbiage" defaultValue={heroCopy} accent={wlConfig.accent} onChange={(v) => setHeroCopy(v)} />
            </div>
         )}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
         <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Hero Background Image</h3>
         <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', marginBottom: '10px' }}>Upload a custom image to serve as the atmospheric background for the hero section.</p>
         
         {heroImage && <img src={heroImage} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} alt="Hero Preview" />}
         
         <div style={{ display: 'flex', gap: '12px' }}>
            <input type="text" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="e.g. https://images.unsplash.com/..." style={{ flex: 1, padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
            <label 
               onDragOver={(e) => { e.preventDefault(); setDragActiveHeroImage(true); }}
               onDragLeave={() => setDragActiveHeroImage(false)}
               onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveHeroImage(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                     handleHeroImageUpload(e.dataTransfer.files[0]);
                  }
               }}
               style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '12px 24px', 
                  background: dragActiveHeroImage ? 'rgba(0, 255, 136, 0.05)' : 'var(--bg-surface)', 
                  border: dragActiveHeroImage ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '12px', 
                  cursor: uploadingHeroImage ? 'not-allowed' : 'pointer', 
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  minWidth: '180px',
                  textAlign: 'center'
               }}
            >
               <span>{uploadingHeroImage ? 'Uploading...' : dragActiveHeroImage ? 'Drop it here!' : 'Upload Image (Drag & Drop)'}</span>
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
              <label 
                 onDragOver={(e) => { e.preventDefault(); setDragActiveHeroVideo(true); }}
                 onDragLeave={() => setDragActiveHeroVideo(false)}
                 onDrop={(e) => {
                    e.preventDefault();
                    setDragActiveHeroVideo(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                       handleHeroVideoUpload(e.dataTransfer.files[0]);
                    }
                 }}
                 style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '12px 24px', 
                    background: dragActiveHeroVideo ? 'rgba(0, 255, 136, 0.05)' : 'var(--bg-surface)', 
                    border: dragActiveHeroVideo ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.2)', 
                    borderRadius: '12px', 
                    cursor: uploadingHeroVideo ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    minWidth: '220px',
                    textAlign: 'center'
                 }}
              >
                 <span>{uploadingHeroVideo ? 'Uploading...' : dragActiveHeroVideo ? 'Drop Video here!' : 'Upload Video File (Drag & Drop)'}</span>
                 <input type="file" accept="video/*" onChange={handleHeroVideoUpload} style={{ display: 'none' }} disabled={uploadingHeroVideo} />
              </label>
           </div>
           <input type="text" value={heroVideoTitle} onChange={(e) => setHeroVideoTitle(e.target.value)} placeholder="e.g. Welcome to the Vibe Network" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none', marginTop: '10px' }} />
        </div>
      )}


      <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }} />
      <button onClick={executeSave} disabled={uploadStatus === 'uploading'} style={{ padding: '18px 40px', background: wlConfig.accent, color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', maxWidth: '300px', boxShadow: `0 8px 30px ${wlConfig.accent}44` }}>
        {uploadStatus === 'uploading' ? 'Saving...' : 'Save & Deploy to Live Site'}
      </button>
    </div>
  );
};
