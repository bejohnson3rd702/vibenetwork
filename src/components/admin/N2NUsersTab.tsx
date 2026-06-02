import { useState, useEffect, useMemo } from 'react';
import { Users, Search, UserCheck, Briefcase, Eye } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getChildNetworks, getN2NProfiles, updateN2NUserRole } from '../../lib/n2n';

export const N2NUsersTab = ({ wlConfig }: { wlConfig: any }) => {
  const toast = useToast();
  const accent = wlConfig?.accent || '#D35400';

  const [profiles, setProfiles] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState('all');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  useEffect(() => {
    if (!wlConfig?.id) return;
    const load = async () => {
      setLoading(true);
      const [nets, profs] = await Promise.all([
        getChildNetworks(wlConfig.id),
        getN2NProfiles(wlConfig.id),
      ]);
      setChildren(nets);
      setProfiles(profs);
      setLoading(false);
    };
    load();
  }, [wlConfig?.id]);

  const networkMap = useMemo(() => {
    const map: Record<string, string> = {};
    map[wlConfig.id] = wlConfig.name || 'Parent Network';
    children.forEach(c => { map[c.id] = c.name; });
    return map;
  }, [children, wlConfig]);

  const filtered = useMemo(() => {
    let list = profiles;
    if (networkFilter !== 'all') {
      list = list.filter(p => p.whitelabel_id === networkFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => (p.username || '').toLowerCase().includes(q));
    }
    return list;
  }, [profiles, networkFilter, search]);

  const roleCounts = useMemo(() => {
    const counts = { viewer: 0, influencer: 0, business: 0, admin: 0 };
    profiles.forEach(p => {
      const r = (p.role || 'viewer') as keyof typeof counts;
      if (counts[r] !== undefined) counts[r]++;
    });
    return counts;
  }, [profiles]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    const ok = await updateN2NUserRole(userId, newRole);
    if (ok) {
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));
      toast.success('Role updated');
    } else {
      toast.error('Failed to update role');
    }
    setUpdatingRole(null);
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 16px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
  };

  const statCardStyle = (gradient: string): React.CSSProperties => ({
    background: gradient,
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    flex: 1,
    minWidth: '160px',
  });

  const roleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#FF3B30';
      case 'business': return '#635BFF';
      case 'influencer': return '#00ff88';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>
          Network User Directory
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>
          Cross-network profiles across all child networks.
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={statCardStyle(`linear-gradient(135deg, ${accent}18, rgba(0,0,0,0))`)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Users size={18} color={accent} />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Users</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)' }}>{profiles.length}</div>
        </div>
        <div style={statCardStyle('linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,0,0,0))')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Eye size={18} color="var(--text-muted)" />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Viewers</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)' }}>{roleCounts.viewer}</div>
        </div>
        <div style={statCardStyle('linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,0,0,0))')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <UserCheck size={18} color="#00ff88" />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Influencers</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#00ff88' }}>{roleCounts.influencer}</div>
        </div>
        <div style={statCardStyle('linear-gradient(135deg, rgba(99,91,255,0.08), rgba(0,0,0,0))')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Briefcase size={18} color="#635BFF" />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Business</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#635BFF' }}>{roleCounts.business}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, width: '100%', paddingLeft: '40px' }}
          />
        </div>
        <select
          value={networkFilter}
          onChange={e => setNetworkFilter(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer', minWidth: '200px' }}
        >
          <option value="all">All Networks</option>
          <option value={wlConfig.id}>{wlConfig.name || 'Parent Network'}</option>
          {children.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '30px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading user directory...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No users found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['', 'Username', 'Email', 'Role', 'Network', 'Joined'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, idx) => (
                  <tr key={user.id} style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', width: '48px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', backgroundImage: user.avatar_url ? `url(${user.avatar_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)' }}>
                      {user.username || 'Anonymous'}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {user.email || user.user_metadata?.email || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <select
                        value={user.role || 'viewer'}
                        disabled={updatingRole === user.id}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          background: 'rgba(0,0,0,0.4)',
                          border: `1px solid ${roleColor(user.role || 'viewer')}44`,
                          borderRadius: '8px',
                          color: roleColor(user.role || 'viewer'),
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          outline: 'none',
                          opacity: updatingRole === user.id ? 0.5 : 1,
                        }}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="influencer">Influencer</option>
                        <option value="business">Business</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {networkMap[user.whitelabel_id] || user.whitelabel_id?.slice(0, 8) + '...'}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-muted)', fontSize: '13px' }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'right' }}>
          Showing {filtered.length} of {profiles.length} users
        </div>
      </div>
    </div>
  );
};
