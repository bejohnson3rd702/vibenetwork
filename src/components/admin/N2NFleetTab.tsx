import { useState, useEffect } from 'react';
import { Network, Users, Globe, Trash2, ExternalLink, Shield, Activity, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getChildNetworks, getN2NProfiles, updateChildFee, deleteChildNetwork, createChildNetwork } from '../../lib/n2n';
import { supabase } from '../../supabaseClient';
import { processAndEnhanceImage } from '../../lib/imageProcessor';

export const N2NFleetTab = ({ wlConfig }: { wlConfig: any }) => {
  const toast = useToast();
  const accent = wlConfig?.accent || '#D35400';

  const [children, setChildren] = useState<any[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFee, setEditingFee] = useState<string | null>(null);
  const [feeValue, setFeeValue] = useState<number>(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [whitelabelsList, setWhitelabelsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  // Image Upload States
  const [logoUrl, setLogoUrl] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');
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

  useEffect(() => {
    if (!wlConfig?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        const [nets, profiles, allConfigs, allProfiles] = await Promise.all([
          getChildNetworks(wlConfig.id, true),
          getN2NProfiles(wlConfig.id),
          supabase.from('whitelabel_configs').select('*'),
          supabase.from('profiles').select('*').limit(50)
        ]);
        setChildren(nets);
        setAllProfiles(profiles);
        if (allConfigs.data) setWhitelabelsList(allConfigs.data);
        if (allProfiles.data) setUsersList(allProfiles.data);
      } catch (err) {
        console.error("N2NFleetTab: Error loading lists", err);
      }
      setLoading(false);
    };
    load();
  }, [wlConfig?.id]);

  const getUserCount = (networkId: string) =>
    allProfiles.filter(p => p.whitelabel_id === networkId).length;

  const totalUsers = allProfiles.length;
  const activeCount = children.filter(c => !c.theme?._n2n_disabled).length;
  const disabledCount = children.length - activeCount;

  const handleSaveFee = async (childId: string) => {
    const ok = await updateChildFee(childId, feeValue);
    if (ok) {
      setChildren(prev => prev.map(c => c.id === childId ? { ...c, platform_fee_percentage: feeValue } : c));
      toast.success('Fee updated successfully');
    } else {
      toast.error('Failed to update fee');
    }
    setEditingFee(null);
  };

  const handleDelete = async (childId: string, name: string) => {
    const ok = await deleteChildNetwork(childId);
    if (ok) {
      setChildren(prev => prev.filter(c => c.id !== childId));
      toast.success(`${name} has been removed`);
    } else {
      toast.error('Failed to delete network');
    }
    setDeleteConfirm(null);
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '20px',
    padding: '30px',
  };

  const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const statCardStyle = (gradient: string): React.CSSProperties => ({
    background: gradient,
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    flex: 1,
    minWidth: '180px',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>
          Fleet Command Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>
          Manage all child networks under the {wlConfig?.name || 'N2N'} umbrella.
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={statCardStyle(`linear-gradient(135deg, ${accent}18, rgba(0,0,0,0))`)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Network size={18} color={accent} />
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Children</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)' }}>{children.length}</div>
        </div>
        <div style={statCardStyle('linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,0,0,0))')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Users size={18} color="#00ff88" />
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Users</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)' }}>{totalUsers}</div>
        </div>
        <div style={statCardStyle('linear-gradient(135deg, rgba(99,91,255,0.08), rgba(0,0,0,0))')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Activity size={18} color="#635BFF" />
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Active</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: '#00ff88' }}>{activeCount}</div>
        </div>
        <div style={statCardStyle('linear-gradient(135deg, rgba(255,59,48,0.06), rgba(0,0,0,0))')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Shield size={18} color="#FF3B30" />
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Disabled</span>
          </div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: disabledCount > 0 ? '#FF3B30' : 'var(--text-primary)' }}>{disabledCount}</div>
        </div>
      </div>

      {/* Fleet Table */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Globe size={20} color={accent} />
            Child Network Fleet
          </h3>
          <button 
            onClick={() => setShowCreateForm(prev => !prev)}
            style={{ padding: '8px 16px', background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', letterSpacing: '0.5px' }}
          >
            {showCreateForm ? 'Hide Form' : '+ Add Child Network'}
          </button>
        </div>

        {showCreateForm && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: `1px solid ${accent}44` }}>
            <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', color: accent, textTransform: 'uppercase', letterSpacing: '1px' }}>Create New Child Network</h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input id="n2n-child-name-fleet" placeholder="Network Name (e.g. Baylor University)" style={inputStyle} />
              <input id="n2n-child-domain-fleet" placeholder="Domain (e.g. baylor.avoclothing.com)" style={inputStyle} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>Accent:</label>
                <input id="n2n-child-accent-fleet" type="color" defaultValue={accent} style={{ width: '40px', height: '36px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }} />
              </div>
              <input id="n2n-child-hero-fleet" placeholder="Hero Copy (e.g. Sic 'Em Bears)" style={inputStyle} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>Logo URL / Upload:</label>
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <input id="n2n-child-logo-fleet" placeholder="Logo URL (or upload)" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} style={inputStyle} />
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
                      padding: '8px 16px', 
                      background: dragActiveLogo ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.02)', 
                      border: dragActiveLogo ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px', 
                      cursor: uploadingLogo ? 'not-allowed' : 'pointer', 
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      minWidth: '100px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span>{uploadingLogo ? '...' : dragActiveLogo ? 'Drop!' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setLogoUrl, setUploadingLogo, 'logo')} style={{ display: 'none' }} disabled={uploadingLogo} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600' }}>Hero Image URL / Upload:</label>
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <input id="n2n-child-heroimage-fleet" placeholder="Hero Image URL (or upload)" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} style={inputStyle} />
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
                      padding: '8px 16px', 
                      background: dragActiveHeroImage ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.02)', 
                      border: dragActiveHeroImage ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '12px', 
                      cursor: uploadingHeroImage ? 'not-allowed' : 'pointer', 
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease',
                      minWidth: '100px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span>{uploadingHeroImage ? '...' : dragActiveHeroImage ? 'Drop!' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setHeroImageUrl, setUploadingHeroImage, 'homepage')} style={{ display: 'none' }} disabled={uploadingHeroImage} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>Template:</label>
                <select id="n2n-child-template-fleet" style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">None (Standard Default)</option>
                  {whitelabelsList.filter(wl => !wl.parent_network_id && !wl.theme?.parent_network_id).map(wl => (
                    <option key={wl.id} value={wl.id}>{wl.name}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' }}>Owner:</label>
                <select id="n2n-child-owner-fleet" style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">No Owner (Unassigned)</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name || u.username || u.id.slice(0, 8)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button 
                onClick={async () => {
                  const nameEl = document.getElementById('n2n-child-name-fleet') as HTMLInputElement;
                  const domainEl = document.getElementById('n2n-child-domain-fleet') as HTMLInputElement;
                  const accentEl = document.getElementById('n2n-child-accent-fleet') as HTMLInputElement;
                  const heroEl = document.getElementById('n2n-child-hero-fleet') as HTMLInputElement;
                  const templateEl = document.getElementById('n2n-child-template-fleet') as HTMLSelectElement;
                  const ownerEl = document.getElementById('n2n-child-owner-fleet') as HTMLSelectElement;
                  
                  const name = nameEl?.value?.trim();
                  if (!name) { toast.error('Network name is required'); return; }
                  
                  const spawned = await createChildNetwork(wlConfig.id, {
                    name,
                    domain: domainEl?.value?.trim() || '',
                    accent: accentEl?.value,
                    heroCopy: heroEl?.value,
                    logo: logoUrl || undefined,
                    heroImage: heroImageUrl || undefined,
                    templateId: templateEl?.value || undefined
                  }, ownerEl?.value || '');
                  
                  if (!spawned) {
                    toast.error('Failed to create child network');
                    return;
                  }
                  
                  setChildren(prev => [...prev, spawned]);
                  toast.success(`${name} created successfully!`);
                  
                  if (nameEl) nameEl.value = '';
                  if (domainEl) domainEl.value = '';
                  if (heroEl) heroEl.value = '';
                  if (templateEl) templateEl.value = '';
                  if (ownerEl) ownerEl.value = '';
                  setLogoUrl('');
                  setHeroImageUrl('');
                  
                  setShowCreateForm(false);
                }}
                style={{ padding: '10px 24px', background: accent, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
              >
                Create Child
              </button>
              <button 
                onClick={() => {
                  setShowCreateForm(false);
                  setLogoUrl('');
                  setHeroImageUrl('');
                }} 
                style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading fleet data...</div>
        ) : children.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No child networks found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Domain', 'Owner', 'Users', 'Fee %', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {children.map((child, idx) => {
                  const isDisabled = child.theme?._n2n_disabled;
                  return (
                    <tr key={child.id} style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: child.accent || accent, flexShrink: 0 }} />
                          {child.name}
                        </div>
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)', fontSize: '14px', fontFamily: 'monospace' }}>
                        {child.domain || '—'}
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {child.owner_id ? child.owner_id.slice(0, 8) + '...' : '—'}
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px' }}>
                        {getUserCount(child.id)}
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        {editingFee === child.id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={feeValue}
                              onChange={e => setFeeValue(Number(e.target.value))}
                              style={{ width: '60px', padding: '6px 10px', background: 'rgba(0,0,0,0.4)', border: `1px solid ${accent}66`, borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '700', outline: 'none' }}
                            />
                            <button onClick={() => handleSaveFee(child.id)} style={{ padding: '6px 12px', background: accent, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                              Save
                            </button>
                            <button onClick={() => setEditingFee(null)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => { setEditingFee(child.id); setFeeValue(child.platform_fee_percentage || 0); }}
                            style={{ color: accent, fontWeight: '700', fontSize: '15px', cursor: 'pointer', padding: '4px 10px', background: `${accent}15`, borderRadius: '8px' }}
                          >
                            {child.platform_fee_percentage ?? 0}%
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: isDisabled ? 'rgba(255,59,48,0.12)' : 'rgba(0,255,136,0.12)', color: isDisabled ? '#FF3B30' : '#00ff88' }}>
                          {isDisabled ? 'Disabled' : 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {child.domain && (
                            <a href={`https://${child.domain}`} target="_blank" rel="noopener noreferrer" style={{ padding: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                              <ExternalLink size={16} />
                            </a>
                          )}
                          {deleteConfirm === child.id ? (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button onClick={() => handleDelete(child.id, child.name)} style={{ padding: '6px 10px', borderRadius: '8px', background: '#FF3B30', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
                                Confirm
                              </button>
                              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(child.id)} style={{ padding: '6px', borderRadius: '8px', background: 'rgba(255,59,48,0.08)', border: 'none', color: '#FF3B30', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
