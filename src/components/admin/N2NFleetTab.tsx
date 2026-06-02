import { useState, useEffect } from 'react';
import { Network, Users, Globe, Trash2, ExternalLink, Shield, Activity } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getChildNetworks, getN2NProfiles, updateChildFee, deleteChildNetwork } from '../../lib/n2n';

export const N2NFleetTab = ({ wlConfig }: { wlConfig: any }) => {
  const toast = useToast();
  const accent = wlConfig?.accent || '#D35400';

  const [children, setChildren] = useState<any[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFee, setEditingFee] = useState<string | null>(null);
  const [feeValue, setFeeValue] = useState<number>(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!wlConfig?.id) return;
    const load = async () => {
      setLoading(true);
      const [nets, profiles] = await Promise.all([
        getChildNetworks(wlConfig.id),
        getN2NProfiles(wlConfig.id),
      ]);
      setChildren(nets);
      setAllProfiles(profiles);
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
        <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Globe size={20} color={accent} />
          Child Network Fleet
        </h3>

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
