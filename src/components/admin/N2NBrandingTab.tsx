import { useState, useEffect } from 'react';
import { Palette, Save, Eye, Type, Image, Link, ChevronDown, Upload } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getChildNetworks, updateChildBranding } from '../../lib/n2n';
import { supabase } from '../../supabaseClient';
import { processAndEnhanceImage } from '../../lib/imageProcessor';

export const N2NBrandingTab = ({ wlConfig }: { wlConfig: any }) => {
  const toast = useToast();
  const accent = wlConfig?.accent || '#D35400';

  const [children, setChildren] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [childAccent, setChildAccent] = useState('#D35400');
  const [heroCopy, setHeroCopy] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [defaultBio, setDefaultBio] = useState('');

  // Upload/Drag states
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [dragActiveLogo, setDragActiveLogo] = useState(false);
  const [dragActiveHeroImage, setDragActiveHeroImage] = useState(false);

  const handleImageUpload = async (
    eventOrFile: React.ChangeEvent<HTMLInputElement> | File,
    setUrl: (url: string) => void,
    setUploading: (u: boolean) => void,
    aspectMode: 'logo' | 'homepage'
  ) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;

      setUploading(true);
      toast.info(`✨ Vibe is enhancing and auto-cropping your image...`);
      const enhancedFile = await processAndEnhanceImage(file, aspectMode);

      const fileExt = enhancedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `brand/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, enhancedFile);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setUrl(data.publicUrl);
        toast.success('Image processed and uploaded successfully!');
      }
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const applyChild = (child: any) => {
    setName(child.name || '');
    setChildAccent(child.theme?.accent || child.accent || '#D35400');
    setHeroCopy(child.theme?.heroCopy || '');
    setLogoUrl(child.logo || '');
    setHeroImageUrl(child.theme?.heroImage || '');
    setDefaultBio(child.theme?.defaultBio || '');
  };

  useEffect(() => {
    if (!wlConfig?.id) return;
    const load = async () => {
      setLoading(true);
      const nets = await getChildNetworks(wlConfig.id, true);
      setChildren(nets);
      if (nets.length > 0) {
        setSelectedId(nets[0].id);
        applyChild(nets[0]);
      }
      setLoading(false);
    };
    load();
  }, [wlConfig?.id]);

  const handleSelectChild = (id: string) => {
    setSelectedId(id);
    const child = children.find(c => c.id === id);
    if (child) applyChild(child);
  };

  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    const ok = await updateChildBranding(selectedId, {
      name,
      accent: childAccent,
      heroCopy,
      logo: logoUrl,
      heroImage: heroImageUrl,
      defaultBio,
    });
    setSaving(false);
    if (ok) {
      setChildren(prev => prev.map(c => c.id === selectedId ? {
        ...c,
        name,
        logo: logoUrl,
        theme: { ...c.theme, accent: childAccent, heroCopy, heroImage: heroImageUrl, defaultBio },
      } : c));
      toast.success('Branding saved successfully!');
    } else {
      toast.error('Failed to save branding');
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '20px',
    padding: '30px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelTextStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const selectedChild = children.find(c => c.id === selectedId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>
          Child Branding Editor
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>
          Customize the look and feel of each child network.
        </p>
      </div>

      {/* Network Selector */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <ChevronDown size={18} color={accent} />
          <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Select Child Network</span>
        </div>
        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '12px' }}>Loading networks...</div>
        ) : children.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: '12px' }}>No child networks found.</div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => handleSelectChild(child.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: selectedId === child.id ? `2px solid ${child.theme?.accent || accent}` : '1px solid rgba(255,255,255,0.08)',
                  background: selectedId === child.id ? `${child.theme?.accent || accent}18` : 'rgba(0,0,0,0.3)',
                  color: selectedId === child.id ? (child.theme?.accent || accent) : 'var(--text-secondary)',
                  fontWeight: selectedId === child.id ? '700' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: child.theme?.accent || child.accent || accent }} />
                {child.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedChild && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Editor Panel */}
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Palette size={20} color={childAccent} />
              Branding Fields
            </h3>

            <div style={labelStyle}>
              <span style={labelTextStyle}><Type size={14} /> Network Name</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                placeholder="Enter network name..."
              />
            </div>

            <div style={labelStyle}>
              <span style={labelTextStyle}><Palette size={14} /> Accent Color</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input
                  type="color"
                  value={childAccent}
                  onChange={e => setChildAccent(e.target.value)}
                  style={{ width: '56px', height: '56px', padding: 0, border: 'none', borderRadius: '12px', cursor: 'pointer', background: 'transparent' }}
                />
                <span style={{ fontFamily: 'monospace', fontSize: '16px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}>
                  {childAccent.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={labelStyle}>
              <span style={labelTextStyle}><Type size={14} /> Hero Copy</span>
              <textarea
                value={heroCopy}
                onChange={e => setHeroCopy(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                placeholder="Welcome headline or hero text..."
              />
            </div>

            <div style={labelStyle}>
              <span style={labelTextStyle}><Type size={14} /> Default Channel Bio</span>
              <textarea
                value={defaultBio}
                onChange={e => setDefaultBio(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                placeholder="e.g. Welcome to my official channel!"
              />
            </div>

            <div style={labelStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={labelTextStyle}><Link size={14} /> Logo Graphic</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#00ff88', background: 'rgba(0,255,136,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(0,255,136,0.2)' }}>
                  📏 512 × 512 px (1:1 Ratio)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  style={inputStyle}
                  placeholder="https://..."
                />
                <label 
                  onDragOver={(e) => { e.preventDefault(); setDragActiveLogo(true); }}
                  onDragLeave={() => setDragActiveLogo(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActiveLogo(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleImageUpload(e.dataTransfer.files[0], setLogoUrl, setUploadingLogo, 'logo');
                    }
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '12px 20px', 
                    background: dragActiveLogo ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.02)', 
                    border: dragActiveLogo ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px', 
                    cursor: uploadingLogo ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    minWidth: '140px',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>{uploadingLogo ? 'Uploading...' : dragActiveLogo ? 'Drop!' : 'Upload Logo'}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLogoUrl, setUploadingLogo, 'logo')} style={{ display: 'none' }} disabled={uploadingLogo} />
                </label>
              </div>
            </div>

            <div style={labelStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={labelTextStyle}><Image size={14} /> Hero Background Image</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#00ff88', background: 'rgba(0,255,136,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(0,255,136,0.2)' }}>
                  📏 1920 × 1080 px (16:9 Ratio)
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={heroImageUrl}
                  onChange={e => setHeroImageUrl(e.target.value)}
                  style={inputStyle}
                  placeholder="https://..."
                />
                <label 
                  onDragOver={(e) => { e.preventDefault(); setDragActiveHeroImage(true); }}
                  onDragLeave={() => setDragActiveHeroImage(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActiveHeroImage(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleImageUpload(e.dataTransfer.files[0], setHeroImageUrl, setUploadingHeroImage, 'homepage');
                    }
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '12px 20px', 
                    background: dragActiveHeroImage ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.02)', 
                    border: dragActiveHeroImage ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '12px', 
                    cursor: uploadingHeroImage ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    minWidth: '140px',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>{uploadingHeroImage ? 'Uploading...' : dragActiveHeroImage ? 'Drop!' : 'Upload Banner'}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setHeroImageUrl, setUploadingHeroImage, 'homepage')} style={{ display: 'none' }} disabled={uploadingHeroImage} />
                </label>
              </div>
            </div>


            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '16px 32px',
                background: childAccent,
                color: '#fff',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: `0 8px 30px ${childAccent}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: saving ? 0.7 : 1,
                transition: 'all 0.2s',
                alignSelf: 'flex-start',
              }}
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Branding'}
            </button>
          </div>

          {/* Live Preview Panel */}
          <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={20} color={childAccent} />
              Live Preview
            </h3>

            {/* Mini preview card */}
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: `1px solid ${childAccent}33`,
              background: 'rgba(0,0,0,0.5)',
            }}>
              {/* Hero area */}
              <div style={{
                height: '180px',
                background: heroImageUrl
                  ? `linear-gradient(to bottom, transparent, rgba(0,0,0,0.8)), url(${heroImageUrl}) center/cover no-repeat`
                  : `linear-gradient(135deg, ${childAccent}33, rgba(0,0,0,0.6))`,
                display: 'flex',
                alignItems: 'flex-end',
                padding: '24px',
              }}>
                <div>
                  {logoUrl && (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      style={{ height: '32px', objectFit: 'contain', marginBottom: '12px', display: 'block' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div style={{ fontSize: '22px', fontWeight: '900', color: '#fff', lineHeight: 1.3 }}>
                    {heroCopy || name || 'Hero Copy Preview'}
                  </div>
                </div>
              </div>

              {/* Bottom info bar */}
              <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>{name || 'Network Name'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Child Network</div>
                </div>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: childAccent,
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '700',
                }}>
                  Explore
                </div>
              </div>
            </div>

            {/* Color Swatch */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: childAccent, flexShrink: 0, boxShadow: `0 4px 20px ${childAccent}44` }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>Accent Color</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '4px' }}>{childAccent.toUpperCase()}</div>
              </div>
            </div>

            {/* Typography Preview */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Typography Preview</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{name || 'Heading'}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{heroCopy || 'Body text will appear here with the applied styling.'}</div>
              <span style={{ color: childAccent, fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Accent Link →</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
