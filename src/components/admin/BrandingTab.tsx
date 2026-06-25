import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useToast } from '../../context/ToastContext';
import { processAndEnhanceImage } from '../../lib/imageProcessor';

export const BrandingTab = ({ wlConfig }: { wlConfig: any }) => {
  const toast = useToast();
  const [logoImage, setLogoImage] = useState(wlConfig?.logoImage || wlConfig?.logo || '');
  const [faviconImage, setFaviconImage] = useState(wlConfig?.theme?.faviconImage || '');
  const [accentColor, setAccentColor] = useState(wlConfig?.accent || '#D35400');
  const [defaultBio, setDefaultBio] = useState(wlConfig?.theme?.defaultBio || '');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
  // Drag and drop states
  const [dragActiveLogo, setDragActiveLogo] = useState(false);
  const [dragActiveFavicon, setDragActiveFavicon] = useState(false);

  const handleImageUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File, setUrl: (url: string) => void, setUploading: (u: boolean) => void) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      
      setUploading(true);
      const isLogo = setUploading === setUploadingLogo;
      toast.info(`✨ Nalu AI is enhancing and auto-cropping your branding ${isLogo ? 'logo' : 'favicon'}...`);
      const enhancedFile = await processAndEnhanceImage(file, isLogo ? 'logo' : 'favicon');

      const fileExt = enhancedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `brand/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, enhancedFile);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setUrl(data.publicUrl);
        toast.success(`${isLogo ? 'Logo' : 'Favicon'} processed and uploaded!`);
      }
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const executeSave = async () => {
    try {
      setUploadStatus('uploading');
      
      if (wlConfig.id === 'master') {
        const { data: existing } = await supabase.from('whitelabel_configs').select('id, theme').eq('domain', 'vibenetwork.tv').limit(1);
        if (existing && existing.length > 0) {
          const { error } = await supabase.from('whitelabel_configs').update({
            logo: logoImage,
            accent: accentColor,
            theme: { ...(existing[0].theme || {}), accent: accentColor, faviconImage: faviconImage, defaultBio }
          }).eq('id', existing[0].id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('whitelabel_configs').insert([{
            name: 'Vibe Network',
            domain: 'vibenetwork.tv',
            logo: logoImage,
            accent: accentColor,
            theme: { accent: accentColor, faviconImage: faviconImage, defaultBio }
          }]);
          if (error) throw error;
        }
      } else {
        const { error } = await supabase.from('whitelabel_configs').update({
          logo: logoImage,
          accent: accentColor,
          theme: { ...wlConfig.theme, accent: accentColor, faviconImage: faviconImage, defaultBio }
        }).eq('id', wlConfig.id);
        if (error) throw error;
      }
      
      const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
      const index = localNetworks.findIndex((n: any) => n.id === wlConfig.id);
      if (index >= 0) {
        localNetworks[index].logo = logoImage;
        if (!localNetworks[index].theme) localNetworks[index].theme = {};
        localNetworks[index].theme.accent = accentColor;
        localNetworks[index].theme.faviconImage = faviconImage;
        localNetworks[index].theme.defaultBio = defaultBio;
        localStorage.setItem('vibe_local_networks', JSON.stringify(localNetworks));
      }
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus(null), 3000);
      toast.success('Branding Successfully Deployed!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      toast.error('Save failed: ' + e.message);
      setUploadStatus(null);
    }
  };

  return (
    <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Global Branding</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>Manage your primary logo, browser favicon, and network colors.</p>
      </div>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
         <h3 style={{ margin: 0, fontSize: '20px' }}>Brand Accent Color</h3>
         <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>This color determines the primary buttons, lettered logo text, and active highlights across the platform.</p>
         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: '60px', height: '60px', padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
           <span style={{ fontFamily: 'monospace', fontSize: '18px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>{accentColor.toUpperCase()}</span>
         </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
         <h3 style={{ margin: 0, fontSize: '20px' }}>Default Channel Bio</h3>
         <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>The default bio copy shown on newly created channels/profiles under this network.</p>
         <textarea 
            value={defaultBio} 
            onChange={(e) => setDefaultBio(e.target.value)} 
            placeholder="e.g. Welcome to my official channel!"
            rows={4}
            style={{
              padding: '12px 16px',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              fontSize: '15px',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: 'inherit',
              lineHeight: 1.6
            }}
         />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
         <h3 style={{ margin: 0, fontSize: '20px' }}>Primary Logo</h3>
         <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>This is the main logo shown in the navigation bar.</p>
         {logoImage && <img src={logoImage} style={{ height: '60px', objectFit: 'contain', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px' }} alt="Logo Preview" />}
         <label 
            onDragOver={(e) => { e.preventDefault(); setDragActiveLogo(true); }}
            onDragLeave={() => setDragActiveLogo(false)}
            onDrop={(e) => {
               e.preventDefault();
               setDragActiveLogo(false);
               if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleImageUpload(e.dataTransfer.files[0], setLogoImage, setUploadingLogo);
               }
            }}
            style={{ 
               alignSelf: 'flex-start', 
               padding: '24px 32px', 
               background: dragActiveLogo ? 'rgba(0, 255, 136, 0.05)' : 'var(--bg-surface)', 
               border: dragActiveLogo ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.2)', 
               borderRadius: '12px', 
               cursor: uploadingLogo ? 'not-allowed' : 'pointer', 
               fontWeight: 'bold',
               transition: 'all 0.2s ease',
               textAlign: 'center',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               gap: '8px'
            }}
         >
            <span>{uploadingLogo ? 'Uploading...' : dragActiveLogo ? 'Drop Logo here!' : 'Upload Logo (Drag & Drop)'}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal' }}>Drag & Drop or click to browse</span>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLogoImage, setUploadingLogo)} style={{ display: 'none' }} disabled={uploadingLogo} />
         </label>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
         <h3 style={{ margin: 0, fontSize: '20px' }}>Browser Favicon</h3>
         <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>This small square icon appears in the browser tab. If empty, the primary logo is used.</p>
         {faviconImage && <img src={faviconImage} style={{ width: '48px', height: '48px', objectFit: 'contain', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '8px' }} alt="Favicon Preview" />}
         <label 
            onDragOver={(e) => { e.preventDefault(); setDragActiveFavicon(true); }}
            onDragLeave={() => setDragActiveFavicon(false)}
            onDrop={(e) => {
               e.preventDefault();
               setDragActiveFavicon(false);
               if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleImageUpload(e.dataTransfer.files[0], setFaviconImage, setUploadingFavicon);
               }
            }}
            style={{ 
               alignSelf: 'flex-start', 
               padding: '24px 32px', 
               background: dragActiveFavicon ? 'rgba(0, 255, 136, 0.05)' : 'var(--bg-surface)', 
               border: dragActiveFavicon ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.2)', 
               borderRadius: '12px', 
               cursor: uploadingFavicon ? 'not-allowed' : 'pointer', 
               fontWeight: 'bold',
               transition: 'all 0.2s ease',
               textAlign: 'center',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               gap: '8px'
            }}
         >
            <span>{uploadingFavicon ? 'Uploading...' : dragActiveFavicon ? 'Drop Favicon here!' : 'Upload Favicon (Drag & Drop)'}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal' }}>Drag & Drop or click to browse</span>
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setFaviconImage, setUploadingFavicon)} style={{ display: 'none' }} disabled={uploadingFavicon} />
         </label>
      </div>

      <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }} />
      <button onClick={executeSave} disabled={uploadStatus === 'uploading'} style={{ padding: '18px 40px', background: accentColor, color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', maxWidth: '300px', boxShadow: `0 8px 30px ${accentColor}44` }}>
        {uploadStatus === 'uploading' ? 'Saving...' : 'Save & Deploy to Live Site'}
      </button>
    </div>
  );
};
