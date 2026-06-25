import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useToast } from '../../context/ToastContext';
import { processAndEnhanceImage } from '../../lib/imageProcessor';
import { AiTextArea, AiInput } from './AiComponents';
import { DictationButton } from '../DictationButton';
import { moderateVideoContent } from '../../lib/videoModerator';
import { VideoModerationScanner } from './VideoModerationScanner';

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

  // Slider State
  const [heroSlider, setHeroSlider] = useState<Array<{ id: string, title: string, imageUrl: string, videoUrl: string }>>(
    wlConfig?.theme?.heroSlider || []
  );
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideImageUrl, setSlideImageUrl] = useState('');
  const [slideVideoUrl, setSlideVideoUrl] = useState('');
  const [uploadingSlideImage, setUploadingSlideImage] = useState(false);
  const [uploadingSlideVideo, setUploadingSlideVideo] = useState(false);

  // AI Video Shield States
  const [showScanner, setShowScanner] = useState(false);
  const [scannerLogs, setScannerLogs] = useState<string[]>([]);
  const [scannerFrames, setScannerFrames] = useState<string[]>([]);
  const [scannerStatus, setScannerStatus] = useState<'scanning' | 'passed' | 'failed'>('scanning');
  const [scannerReason, setScannerReason] = useState('');
  const [abortUpload, setAbortUpload] = useState<(() => void) | null>(null);

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

      // 1. Verify file size limit (50MB)
      const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
      if (file.size > MAX_VIDEO_SIZE) {
        toast.error('Video file size exceeds the 50MB limit. Please upload a compressed clip.');
        return;
      }

      // 2. Verify mimetype starts with video/
      if (!file.type.startsWith('video/')) {
        toast.error('Invalid file format. Please upload a valid video file.');
        return;
      }

      // 3. Start Moderation Scan
      setUploadingHeroVideo(true);
      setScannerLogs([]);
      setScannerFrames([]);
      setScannerStatus('scanning');
      setScannerReason('');
      setShowScanner(true);

      let isCancelled = false;
      setAbortUpload(() => () => {
        isCancelled = true;
        setShowScanner(false);
        setUploadingHeroVideo(false);
        toast.info('Video upload cancelled by user.');
      });

      const result = await moderateVideoContent(
        file,
        (log) => {
          if (isCancelled) return;
          setScannerLogs(prev => [...prev, log]);
        },
        (frame) => {
          if (isCancelled) return;
          setScannerFrames(prev => [...prev, frame]);
        }
      );

      if (isCancelled) return;

      if (!result.safe) {
        setScannerStatus('failed');
        setScannerReason(result.reason || 'Adult content keywords matched.');
        toast.error('Vibes Shield: Video contains unsafe/restricted content and was blocked!');
        return;
      }

      setScannerStatus('passed');
      setScannerLogs(prev => [...prev, '[Vibes Shield] ✔ Visual safety confirmed. Uploading to storage...']);

      // 4. Proceed with Storage upload
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('videos').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setHeroVideoUrl(data.publicUrl);
        setScannerLogs(prev => [...prev, `[Vibes Shield] ✔ Success! Public URL: ${data.publicUrl}`]);
        toast.success('Video uploaded successfully!');
      }
    } catch (err: any) {
      setScannerStatus('failed');
      setScannerReason(err.message || 'Verification or upload failed.');
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

      toast.info("✨ Nalu AI is enhancing and auto-cropping your hero banner...");
      const enhancedFile = await processAndEnhanceImage(file, 'hero');

      const fileExt = enhancedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, enhancedFile);
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
        heroImage,
        heroSlider
      };

      if (wlConfig.id === 'master') {
        const { data: existing } = await supabase.from('whitelabel_configs').select('id, theme').eq('domain', 'vibenetwork.tv').limit(1);
        if (existing && existing.length > 0) {
          const { error } = await supabase.from('whitelabel_configs').update({
            theme: { ...(existing[0].theme || {}), ...updatedTheme }
          }).eq('id', existing[0].id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('whitelabel_configs').insert([{
            name: 'Vibe Network',
            domain: 'vibenetwork.tv',
            theme: updatedTheme
          }]);
          if (error) throw error;
        }
      } else {
        const { error } = await supabase.from('whitelabel_configs').update({
          theme: updatedTheme
        }).eq('id', wlConfig.id);
        if (error) throw error;
      }

      // Sync local storage
      const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
      const index = localNetworks.findIndex((n: any) => n.id === wlConfig.id || (wlConfig.id === 'master' && n.domain === 'vibenetwork.tv'));
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


      {heroLayoutMode === 'slider' && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Hero Video Slider Management</h3>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>Configure custom slider video banners shown on the home page.</p>
            </div>
            {editingSlideId === null && (
              <button 
                onClick={() => {
                  setEditingSlideId('new');
                  setSlideTitle('');
                  setSlideImageUrl('');
                  setSlideVideoUrl('');
                }}
                style={{ padding: '10px 20px', background: wlConfig.accent, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                + Add Slide Banner
              </button>
            )}
          </div>

          {editingSlideId !== null && (
            <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ margin: 0 }}>{editingSlideId === 'new' ? 'Add New Slider Banner' : 'Edit Slider Banner'}</h4>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>Slide Title</label>
                <input 
                  type="text" 
                  value={slideTitle} 
                  onChange={(e) => setSlideTitle(e.target.value)} 
                  placeholder="e.g. Action Packed Trailer" 
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '15px', outline: 'none' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>Slide Preview Image (16:9 Banner)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={slideImageUrl} 
                    onChange={(e) => setSlideImageUrl(e.target.value)} 
                    placeholder="e.g. https://images.unsplash.com/..." 
                    style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '15px', outline: 'none' }} 
                  />
                  <label style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', cursor: uploadingSlideImage ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {uploadingSlideImage ? 'Uploading...' : 'Upload'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          try {
                            setUploadingSlideImage(true);
                            const enhancedFile = await processAndEnhanceImage(e.target.files[0], 'hero');
                            const fileExt = enhancedFile.name.split('.').pop();
                            const fileName = `${Date.now()}_slide_${Math.random()}.${fileExt}`;
                            const filePath = `hero/${fileName}`;
                            const { error: uploadError } = await supabase.storage.from('images').upload(filePath, enhancedFile);
                            if (uploadError) throw uploadError;
                            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
                            if (data?.publicUrl) {
                              setSlideImageUrl(data.publicUrl);
                              toast.success('Slide preview image uploaded!');
                            }
                          } catch (err: any) {
                            toast.error('Image upload failed: ' + err.message);
                          } finally {
                            setUploadingSlideImage(false);
                          }
                        }
                      }} 
                      style={{ display: 'none' }} 
                      disabled={uploadingSlideImage} 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>Slide Video Link (YouTube or Direct File)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={slideVideoUrl} 
                    onChange={(e) => setSlideVideoUrl(e.target.value)} 
                    placeholder="e.g. https://youtube.com/watch?v=..." 
                    style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '15px', outline: 'none' }} 
                  />
                  <label style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', cursor: uploadingSlideVideo ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {uploadingSlideVideo ? 'Uploading...' : 'Upload'}
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.size > 50 * 1024 * 1024) {
                            toast.error('Video file size exceeds the 50MB limit.');
                            return;
                          }
                          try {
                            setUploadingSlideVideo(true);
                            const fileExt = file.name.split('.').pop();
                            const fileName = `${Date.now()}_slide_${Math.random()}.${fileExt}`;
                            const filePath = `hero/${fileName}`;
                            const { error: uploadError } = await supabase.storage.from('videos').upload(filePath, file);
                            if (uploadError) throw uploadError;
                            const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
                            if (data?.publicUrl) {
                              setSlideVideoUrl(data.publicUrl);
                              toast.success('Slide video uploaded!');
                            }
                          } catch (err: any) {
                            toast.error('Video upload failed: ' + err.message);
                          } finally {
                            setUploadingSlideVideo(false);
                          }
                        }
                      }} 
                      style={{ display: 'none' }} 
                      disabled={uploadingSlideVideo} 
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  onClick={() => setEditingSlideId(null)}
                  style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (!slideTitle || !slideImageUrl || !slideVideoUrl) {
                      toast.error('Please enter all fields (Title, Image, and Video URL).');
                      return;
                    }
                    if (editingSlideId === 'new') {
                      const newSlide = { id: Date.now().toString(), title: slideTitle, imageUrl: slideImageUrl, videoUrl: slideVideoUrl };
                      setHeroSlider([...heroSlider, newSlide]);
                    } else {
                      setHeroSlider(heroSlider.map(s => s.id === editingSlideId ? { ...s, title: slideTitle, imageUrl: slideImageUrl, videoUrl: slideVideoUrl } : s));
                    }
                    setEditingSlideId(null);
                    toast.success('Slide temporarily saved! Save configurations to publish.');
                  }}
                  style={{ padding: '8px 16px', background: wlConfig.accent, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save Slide Settings
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {heroSlider.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                No custom slides configured yet. The site will display standard fallback slides.
              </div>
            ) : (
              heroSlider.map((slide, idx) => (
                <div key={slide.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px' }}>
                  <img src={slide.imageUrl} style={{ width: '100px', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} alt="" />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '16px' }}>{slide.title}</h4>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{slide.videoUrl}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        if (idx > 0) {
                          const copy = [...heroSlider];
                          const temp = copy[idx - 1];
                          copy[idx - 1] = copy[idx];
                          copy[idx] = temp;
                          setHeroSlider(copy);
                        }
                      }}
                      disabled={idx === 0}
                      style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#fff', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => {
                        if (idx < heroSlider.length - 1) {
                          const copy = [...heroSlider];
                          const temp = copy[idx + 1];
                          copy[idx + 1] = copy[idx];
                          copy[idx] = temp;
                          setHeroSlider(copy);
                        }
                      }}
                      disabled={idx === heroSlider.length - 1}
                      style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#fff', cursor: idx === heroSlider.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === heroSlider.length - 1 ? 0.3 : 1 }}
                    >
                      ▼
                    </button>
                    <button 
                      onClick={() => {
                        setEditingSlideId(slide.id);
                        setSlideTitle(slide.title);
                        setSlideImageUrl(slide.imageUrl);
                        setSlideVideoUrl(slide.videoUrl);
                      }}
                      style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Delete this slide?')) {
                          setHeroSlider(heroSlider.filter(s => s.id !== slide.id));
                        }
                      }}
                      style={{ padding: '6px 12px', background: 'rgba(255,77,133,0.1)', border: 'none', borderRadius: '6px', color: '#ff4d85', cursor: 'pointer' }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}


      <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }} />
      <button onClick={executeSave} disabled={uploadStatus === 'uploading'} style={{ padding: '18px 40px', background: wlConfig.accent, color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', maxWidth: '300px', boxShadow: `0 8px 30px ${wlConfig.accent}44` }}>
        {uploadStatus === 'uploading' ? 'Saving...' : 'Save & Deploy to Live Site'}
      </button>

      <VideoModerationScanner
        isOpen={showScanner}
        logs={scannerLogs}
        frames={scannerFrames}
        status={scannerStatus}
        reason={scannerReason}
        onClose={abortUpload || (() => setShowScanner(false))}
        accentColor={wlConfig?.accent || '#ff4d85'}
      />
    </div>
  );
};
