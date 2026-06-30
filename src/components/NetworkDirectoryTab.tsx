import React from 'react';
import { motion } from 'framer-motion';
import { Play, StopCircle, CheckCircle } from 'lucide-react';

interface NetworkDirectoryTabProps {
  isMobile: boolean;
  loading: boolean;
  usersList: any[];
  setUsersList: React.Dispatch<React.SetStateAction<any[]>>;
  whitelabelsList: any[];
  setWhitelabelsList: React.Dispatch<React.SetStateAction<any[]>>;
  globalSettings: any;
  fetchUsers: () => void;
  supabase: any;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  logSystemEvent: (level: string, message: string, meta?: any) => void;
  MASTER_DOMAIN: string;
}

export const NetworkDirectoryTab: React.FC<NetworkDirectoryTabProps> = ({
  isMobile,
  loading,
  usersList,
  setUsersList,
  whitelabelsList,
  setWhitelabelsList,
  globalSettings,
  fetchUsers,
  supabase,
  showToast,
  logSystemEvent,
  MASTER_DOMAIN,
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between', 
        marginBottom: '24px',
        gap: isMobile ? '12px' : '0'
      }}>
        <h3 style={{ margin: 0, fontSize: '24px', textAlign: isMobile ? 'center' : 'left' }}>System Network Directory</h3>
        <button onClick={fetchUsers} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Refresh Index</button>
      </div>
      
      <div style={{ background: 'var(--bg-surface)', padding: isMobile ? '12px' : '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
         {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Initializing network fetch pattern...</div>
              ) : usersList.map((user, i) => {
                const userWl = whitelabelsList.find(wl => wl.id === user.whitelabel_id) || whitelabelsList.find(wl => wl.domain === MASTER_DOMAIN || wl.domain === 'vibenetwork.tv' || wl.domain === 'vibenetwork.com');
                const isUserDeactivated = user.is_active === false || userWl?.theme?.deactivated_creators?.includes(user.id);
                const currentActive = !isUserDeactivated;
                return (
                  <div key={user.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--text-primary)' }}>{user.username || user.full_name || 'Unassigned Profile'}</span>
                      <span style={{ fontFamily: 'monospace', color: '#0055ff', fontSize: '12px' }}>{user.id.split('-')[0]}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Status:</span>
                      {isUserDeactivated ? (
                        <span style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>DEACTIVATED</span>
                      ) : (
                        <span style={{ background: user.is_admin ? 'rgba(255,215,0,0.1)' : 'rgba(0,255,136,0.1)', color: user.is_admin ? '#FFD700' : '#00ff88', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                           {user.is_admin ? 'ADMINISTRATOR' : 'ACTIVE'}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Tier:</span>
                      <span style={{ color: user.whitelabel_id ? '#0055ff' : '#ccc', fontSize: '13px', fontWeight: 'bold' }}>{user.whitelabel_id ? 'Enterprise Tenant' : 'Platform Creator'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Platform Fee:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input 
                          id={`fee-input-mobile-${user.id}`}
                          type="number" 
                          defaultValue={user.platform_fee_percentage ?? globalSettings.global_vibe_fee} 
                          onBlur={async (e) => {
                             const val = parseFloat(e.target.value);
                             if (isNaN(val)) return;
                             const btn = e.target.nextElementSibling?.nextElementSibling as HTMLButtonElement;
                             if (btn) btn.innerText = '...';
                             const { data, error } = await supabase!.from('profiles').update({ platform_fee_percentage: val }).eq('id', user.id).select();
                             if (error || !data || data.length === 0) {
                                showToast('Failed to save (Permission Denied): ' + (error?.message || 'RLS Blocked'), 'error');
                                if (btn) btn.innerText = 'Save';
                                return;
                             }
                             setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, platform_fee_percentage: val } : u));
                             if (btn) {
                                btn.innerText = 'Saved';
                                btn.style.color = '#00ff88';
                                setTimeout(() => { btn.innerText = 'Save'; btn.style.color = '#0055ff'; }, 2000);
                             }
                          }}
                          style={{ width: '60px', padding: '6px', background: 'rgba(255,255,255,0.05)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '6px', fontWeight: 'bold', outline: 'none', textAlign: 'center', fontSize: '13px' }}
                        />
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold' }}>%</span>
                        <button onClick={async (e) => {
                           const btn = e.currentTarget;
                           const input = document.getElementById(`fee-input-mobile-${user.id}`) as HTMLInputElement;
                           const val = parseFloat(input.value);
                           if (isNaN(val)) return;
                           btn.innerText = '...';
                           const { data, error } = await supabase!.from('profiles').update({ platform_fee_percentage: val }).eq('id', user.id).select();
                           if (error || !data || data.length === 0) {
                              showToast('Failed to save (Permission Denied): ' + (error?.message || 'RLS Blocked'), 'error');
                              btn.innerText = 'Save';
                              return;
                           }
                           setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, platform_fee_percentage: val } : u));
                           btn.innerText = 'Saved';
                           btn.style.color = '#00ff88';
                           setTimeout(() => { btn.innerText = 'Save'; btn.style.color = '#0055ff'; }, 2000);
                        }} style={{ padding: '6px 12px', background: 'rgba(0, 85, 255, 0.1)', color: '#0055ff', border: '1px solid rgba(0, 85, 255, 0.2)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                          Save
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                       <button onClick={async (e) => {
                          const btn = e.currentTarget;
                          const willBeAdmin = !user.is_admin;
                          btn.innerText = '...';
                          const { error } = await supabase!.from('profiles').update({ is_admin: willBeAdmin }).eq('id', user.id);
                          if (error) {
                             showToast('Failed to update admin status', 'error');
                             btn.innerText = willBeAdmin ? 'Grant Admin' : 'Revoke Admin';
                             return;
                          }
                          setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, is_admin: willBeAdmin } : u));
                          showToast(`${user.username || 'User'} is ${willBeAdmin ? 'now an Admin' : 'no longer an Admin'}.`, 'success');
                          logSystemEvent('WARN', `Master Admin changed privileges for ${user.id} to is_admin=${willBeAdmin}`);
                          btn.innerText = willBeAdmin ? 'Revoke Admin' : 'Grant Admin';
                       }} style={{ flex: 1, padding: '10px', background: user.is_admin ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,136,0.1)', color: user.is_admin ? '#ff0000' : '#00ff88', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                          {user.is_admin ? 'Revoke Admin' : 'Grant Admin'}
                       </button>

                       <button onClick={async (e) => {
                           const btn = e.currentTarget;
                           const newVal = !currentActive;
                           if (!confirm(`${newVal ? 'Activate' : 'Deactivate'} channel "${user.username || user.full_name || user.id}"?`)) return;
                           btn.innerText = '...';
                           const { error } = await supabase!.from('profiles').update({ is_active: newVal }).eq('id', user.id);
                           if (error) {
                              const targetWlId = user.whitelabel_id || whitelabelsList.find(wl => wl.domain === MASTER_DOMAIN || wl.domain === 'vibenetwork.tv' || wl.domain === 'vibenetwork.com')?.id;
                              if (targetWlId) {
                                 const targetWl = whitelabelsList.find(wl => wl.id === targetWlId);
                                 if (targetWl) {
                                    const currentTheme = targetWl.theme || {};
                                    let deactivatedList = Array.isArray(currentTheme.deactivated_creators) ? [...currentTheme.deactivated_creators] : [];
                                    if (newVal === false) {
                                       if (!deactivatedList.includes(user.id)) deactivatedList.push(user.id);
                                    } else {
                                       deactivatedList = deactivatedList.filter(id => id !== user.id);
                                    }
                                    const { error: err2 } = await supabase!.from('whitelabel_configs').update({
                                       theme: { ...currentTheme, deactivated_creators: deactivatedList }
                                    }).eq('id', targetWlId);
                                    if (err2) {
                                       showToast('Failed to toggle status: ' + err2.message, 'error');
                                       btn.innerText = currentActive ? 'Deactivate' : 'Activate';
                                       return;
                                    }
                                    setWhitelabelsList(prev => prev.map(wl => wl.id === targetWlId ? { ...wl, theme: { ...wl.theme, deactivated_creators: deactivatedList } } : wl));
                                 }
                              } else {
                                 showToast('Failed to toggle status: ' + error.message, 'error');
                                 btn.innerText = currentActive ? 'Deactivate' : 'Activate';
                                 return;
                              }
                           }
                           setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, is_active: newVal } : u));
                           showToast(`Channel "${user.username || 'User'}" ${newVal ? 'Activated' : 'Deactivated'}.`, 'success');
                           logSystemEvent('ALERT', `Master Admin changed channel status for ${user.username || user.id} to is_active=${newVal}`);
                           btn.innerText = newVal ? 'Deactivate' : 'Activate';
                       }} style={{ flex: 1, padding: '10px', background: currentActive ? 'rgba(255,59,48,0.1)' : 'rgba(0,255,136,0.1)', color: currentActive ? '#FF3B30' : '#00ff88', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                           {currentActive ? 'Deactivate' : 'Activate'}
                       </button>
                    </div>
                  </div>
                );
              })}
            </div>
         ) : (
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '16px 12px' }}>Network ID</th>
                    <th style={{ padding: '16px 12px' }}>Profile Name</th>
                    <th style={{ padding: '16px 12px' }}>Status</th>
                    <th style={{ padding: '16px 12px' }}>Network Tier</th>
                    <th style={{ padding: '16px 12px' }}>Platform Fee %</th>
                    <th style={{ padding: '16px 12px' }}>System Privileges</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Initializing network fetch pattern...</td></tr>
                  ) : usersList.map((user, i) => {
                    const userWl = whitelabelsList.find(wl => wl.id === user.whitelabel_id) || whitelabelsList.find(wl => wl.domain === MASTER_DOMAIN || wl.domain === 'vibenetwork.tv' || wl.domain === 'vibenetwork.com');
                    const isUserDeactivated = user.is_active === false || userWl?.theme?.deactivated_creators?.includes(user.id);
                    const currentActive = !isUserDeactivated;
                    return (
                    <tr key={user.id} style={{ borderBottom: i !== usersList.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <td style={{ padding: '16px 12px', fontFamily: 'monospace', color: '#0055ff', fontSize: '12px' }}>{user.id.split('-')[0]}</td>
                      <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{user.username || user.full_name || 'Unassigned Profile'}</td>
                      <td style={{ padding: '16px 12px' }}>
                        {isUserDeactivated ? (
                          <span style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                             DEACTIVATED
                          </span>
                        ) : (
                          <span style={{ background: user.is_admin ? 'rgba(255,215,0,0.1)' : 'rgba(0,255,136,0.1)', color: user.is_admin ? '#FFD700' : '#00ff88', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                             {user.is_admin ? 'ADMINISTRATOR' : 'ACTIVE'}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 12px', color: user.whitelabel_id ? '#0055ff' : '#ccc', fontSize: '14px', fontWeight: 'bold' }}>{user.whitelabel_id ? 'Enterprise Tenant' : 'Platform Creator'}</td>
                      <td style={{ padding: '16px 12px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <input 
                             id={`fee-input-${user.id}`}
                             type="number" 
                             defaultValue={user.platform_fee_percentage ?? globalSettings.global_vibe_fee} 
                             onBlur={async (e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                const btn = e.target.nextElementSibling?.nextElementSibling as HTMLButtonElement;
                                if (btn) btn.innerText = '...';
                                const { data, error } = await supabase!.from('profiles').update({ platform_fee_percentage: val }).eq('id', user.id).select();
                                if (error || !data || data.length === 0) {
                                   showToast('Failed to save (Permission Denied): ' + (error?.message || 'Row Level Security blocked the update.'), 'error');
                                   if (btn) btn.innerText = 'Save';
                                   return;
                                }
                                setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, platform_fee_percentage: val } : u));
                                if (btn) {
                                   btn.innerText = 'Saved';
                                   btn.style.color = '#00ff88';
                                   setTimeout(() => { btn.innerText = 'Save'; btn.style.color = '#0055ff'; }, 2000);
                                }
                             }}
                             style={{ width: '60px', padding: '6px', background: 'rgba(255,255,255,0.05)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '6px', fontWeight: 'bold', outline: 'none' }}
                           />
                           <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold' }}>%</span>
                           <button onClick={async (e) => {
                              const btn = e.currentTarget;
                              const input = document.getElementById(`fee-input-${user.id}`) as HTMLInputElement;
                              const val = parseFloat(input.value);
                              if (isNaN(val)) return;
                              
                              const originalText = btn.innerText;
                              btn.innerText = '...';
                              const { data, error } = await supabase!.from('profiles').update({ platform_fee_percentage: val }).eq('id', user.id).select();
                              if (error || !data || data.length === 0) {
                                 showToast('Failed to save (Permission Denied): ' + (error?.message || 'Row Level Security blocked the update.'), 'error');
                                 btn.innerText = 'Save';
                                 return;
                              }
                              
                              setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, platform_fee_percentage: val } : u));
                              btn.innerText = 'Saved';
                              btn.style.color = '#00ff88';
                              setTimeout(() => { btn.innerText = 'Save'; btn.style.color = '#0055ff'; }, 2000);
                           }} style={{ padding: '4px 8px', background: 'rgba(0, 85, 255, 0.1)', color: '#0055ff', border: '1px solid rgba(0, 85, 255, 0.2)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', marginLeft: '4px', transition: '0.2s' }}>
                             Save
                           </button>
                         </div>
                      </td>
                      <td style={{ padding: '16px 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                         <button onClick={async (e) => {
                            const btn = e.currentTarget;
                            const willBeAdmin = !user.is_admin;
                            btn.innerText = '...';
                            const { error } = await supabase!.from('profiles').update({ is_admin: willBeAdmin }).eq('id', user.id);
                            if (error) {
                               showToast('Failed to update admin status', 'error');
                               btn.innerText = willBeAdmin ? 'Grant Admin' : 'Revoke Admin';
                               return;
                            }
                            setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, is_admin: willBeAdmin } : u));
                            showToast(`${user.username || 'User'} is ${willBeAdmin ? 'now an Admin' : 'no longer an Admin'}.`, 'success');
                            logSystemEvent('WARN', `Master Admin changed privileges for ${user.id} to is_admin=${willBeAdmin}`);
                         }} style={{ padding: '6px 12px', background: user.is_admin ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,136,0.1)', color: user.is_admin ? '#ff0000' : '#00ff88', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: '0.2s' }}>
                            {user.is_admin ? 'Revoke Admin' : 'Grant Admin'}
                         </button>

                         <button onClick={async (e) => {
                             const btn = e.currentTarget;
                             const newVal = !currentActive;
                             if (!confirm(`${newVal ? 'Activate' : 'Deactivate'} channel "${user.username || user.full_name || user.id}"?`)) return;
                             
                             btn.innerText = '...';
                             const { error } = await supabase!.from('profiles').update({ is_active: newVal }).eq('id', user.id);
                             if (error) {
                                const targetWlId = user.whitelabel_id || whitelabelsList.find(wl => wl.domain === MASTER_DOMAIN || wl.domain === 'vibenetwork.tv' || wl.domain === 'vibenetwork.com')?.id;
                                if (targetWlId) {
                                   const targetWl = whitelabelsList.find(wl => wl.id === targetWlId);
                                   if (targetWl) {
                                      const currentTheme = targetWl.theme || {};
                                      let deactivatedList = Array.isArray(currentTheme.deactivated_creators) ? [...currentTheme.deactivated_creators] : [];
                                      if (newVal === false) {
                                         if (!deactivatedList.includes(user.id)) deactivatedList.push(user.id);
                                      } else {
                                         deactivatedList = deactivatedList.filter(id => id !== user.id);
                                      }
                                      const { error: err2 } = await supabase!.from('whitelabel_configs').update({
                                         theme: { ...currentTheme, deactivated_creators: deactivatedList }
                                      }).eq('id', targetWlId);
                                      if (err2) {
                                         showToast('Failed to toggle status: ' + err2.message, 'error');
                                         btn.innerText = currentActive ? 'Deactivate' : 'Activate';
                                         return;
                                      }
                                      setWhitelabelsList(prev => prev.map(wl => wl.id === targetWlId ? { ...wl, theme: { ...wl.theme, deactivated_creators: deactivatedList } } : wl));
                                   }
                                } else {
                                   showToast('Failed to toggle status: ' + error.message, 'error');
                                   btn.innerText = currentActive ? 'Deactivate' : 'Activate';
                                   return;
                                }
                             }
                             
                             setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, is_active: newVal } : u));
                             showToast(`Channel "${user.username || 'User'}" ${newVal ? 'Activated' : 'Deactivated'}.`, 'success');
                             logSystemEvent('ALERT', `Master Admin changed channel status for ${user.username || user.id} to is_active=${newVal}`);
                          }} style={{ padding: '6px 12px', background: currentActive ? 'rgba(255,59,48,0.1)' : 'rgba(0,255,136,0.1)', color: currentActive ? '#FF3B30' : '#00ff88', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: '0.2s' }}>
                             {currentActive ? 'Deactivate' : 'Activate'}
                          </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
         )}
      </div>
    </motion.div>
  );
};
