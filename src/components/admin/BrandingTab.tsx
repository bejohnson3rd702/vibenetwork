import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export const BrandingTab = ({ wlConfig }: { wlConfig: any }) => {
  const [logoImage, setLogoImage] = useState(wlConfig?.logoImage || wlConfig?.logo || '');
  const [faviconImage, setFaviconImage] = useState(wlConfig?.theme?.faviconImage || '');
  const [accentColor, setAccentColor] = useState(wlConfig?.accent || '#D35400');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

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

  const executeSave = async () => {
    try {
      setUploadStatus('uploading');
      const { error } = await supabase.from('whitelabel_configs').update({
        logo: logoImage,
        accent: accentColor,
        theme: { ...wlConfig.theme, accent: accentColor, faviconImage: faviconImage }
      }).eq('id', wlConfig.id);
      
      if (error) throw error;
      
      const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
      const index = localNetworks.findIndex((n: any) => n.id === wlConfig.id);
      if (index >= 0) {
        localNetworks[index].logo = logoImage;
        if (!localNetworks[index].theme) localNetworks[index].theme = {};
        localNetworks[index].theme.accent = accentColor;
        localNetworks[index].theme.faviconImage = faviconImage;
        localStorage.setItem('vibe_local_networks', JSON.stringify(localNetworks));
      }
      
      setUploadStatus('success');
      setTimeout(() => setUploadStatus(null), 3000);
      alert('Branding Successfully Deployed!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      alert('Save failed: ' + e.message);
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
      <button onClick={executeSave} disabled={uploadStatus === 'uploading'} style={{ padding: '18px 40px', background: accentColor, color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', maxWidth: '300px', boxShadow: `0 8px 30px ${accentColor}44` }}>
        {uploadStatus === 'uploading' ? 'Saving...' : 'Save & Deploy to Live Site'}
      </button>
    </div>
  );
};
