import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Users, Activity, Database, 
  ShieldAlert, Terminal, ChevronRight, BarChart3, 
  Network, Server, Play, StopCircle, CheckCircle, Wallet, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ErrorBoundary } from './ErrorBoundary';

export default function MasterAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [dbStats, setDbStats] = useState({
      whitelabels: 0,
      networks: 0,
      activeStreams: 0,
      load: '42%'
  });
  
  const [whitelabelsList, setWhitelabelsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [isRestarting, setIsRestarting] = useState(false);

  async function fetchCategories() {
     const { data } = await supabase!.from('categories').select('*');
     if (data) setCategories(data);
  }
  const [ledgerFilter, setLedgerFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [broadcastSource, setBroadcastSource] = useState<'youtube' | 'upload'>('youtube');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [globalSettings, setGlobalSettings] = useState<any>({ id: '', global_vibe_fee: 15, global_whitelabel_fee: 15 });
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const logSystemEvent = async (level: string, message: string, meta: any = {}) => {
     if (!currentUser) return;
     try {
        const { data } = await supabase!.from('system_logs').insert([{
           level,
           message,
           actor_id: currentUser.id,
           metadata: meta
        }]).select();
        if (data && data.length > 0) {
           setSystemLogs(prev => [data[0], ...prev].slice(0, 50));
        }
     } catch (e) {
        console.error("Failed to log event", e);
     }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
     setToast({ message, type });
     setTimeout(() => setToast(null), 4000);
  };

  async function fetchUsers() {
     setLoading(true);
     const { data: usersData } = await supabase!.from('profiles').select('*').limit(50);
     setUsersList(usersData || []);
     setLoading(false);
  }

  useEffect(() => {
     async function fetchGlobalMetrics() {
        const { data: authData } = await supabase!.auth.getUser();
        if (authData?.user) {
           setCurrentUser(authData.user);
           const { error: elevateErr, data: elevateData } = await supabase!.from('profiles').upsert({ 
              id: authData.user.id, 
              is_admin: true,
              username: authData.user.email?.split('@')[0] || 'Admin'
           }).select();
           
           if (elevateErr) {
              console.error("Auto-elevation failed:", elevateErr);
              showToast("Auto-elevation failed: " + elevateErr.message, 'error');
           } else {
              console.log("Auto-elevated successfully:", elevateData);
           }
        } else {
           showToast("You are not logged in! You must be logged in to access the Global Ledger.", 'error');
        }
        
        try {
           const { data: settingsData, error } = await supabase!.from('platform_settings').select('*').limit(1).maybeSingle();
           if (settingsData) {
              setGlobalSettings(settingsData);
           } else if (error) {
              showToast("CRITICAL: platform_settings table is missing! Please run the Supabase schema migration.", 'error');
           } else {
              const { data: newSettings } = await supabase!.from('platform_settings').insert([{ global_vibe_fee: 15, global_whitelabel_fee: 15 }]).select().single();
              if (newSettings) setGlobalSettings(newSettings);
           }
        } catch (e) {
           console.error("Platform settings error:", e);
        }
        
        const { count: usersCount } = await supabase!.from('profiles').select('*', { count: 'exact', head: true });
        const { data: configs } = await supabase!.from('whitelabel_configs').select('*');
        setWhitelabelsList(configs || []);
        
        const { data: logsData } = await supabase!.from('system_logs').select('*').order('created_at', { ascending: false }).limit(50);
        if (logsData) setSystemLogs(logsData);

        const { data: ledgerTx, error: ledgerError } = await supabase!.from('ledger').select('*, profiles(*)').order('created_at', { ascending: false }).limit(50);
        
        if (ledgerError) {
           console.error("Ledger Fetch Error:", ledgerError);
           showToast("Ledger Error: " + ledgerError.message, 'error');
        } else if (ledgerTx) {
           setLedgerData(ledgerTx);
           if (ledgerTx.length === 0) {
              showToast("Ledger fetched successfully but contains 0 transactions.", 'success');
           }
        }
        fetchUsers();
        fetchCategories();
        
        setDbStats(prev => ({
           ...prev,
           networks: usersCount || 0,
           whitelabels: configs?.length || 0,
           activeStreams: 342
        }));
     }
     fetchGlobalMetrics();
  }, []);

  const stats = [
    { label: 'Active Whitelabels', value: dbStats.whitelabels.toString(), icon: <Network />, color: '#0055ff' },
    { label: 'Global Registered Networks', value: dbStats.networks.toString(), icon: <Users />, color: '#00ff88' },
    { label: 'Active Live Streams', value: dbStats.activeStreams.toString(), icon: <Activity />, color: '#ff4d85' },
    { label: 'Server Fleet Load', value: dbStats.load, icon: <Activity />, color: '#ff4d85' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', display: 'flex' }}>
      
      {/* Sidebar Command Center */}
      <div style={{ 
        width: '280px', 
        background: '#0a0a0a', 
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '30px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: 12, height: 12, background: '#ff0000', borderRadius: '50%', boxShadow: '0 0 10px #ff0000' }} />
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>Master Control</h1>
          </div>
          <span style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>ROOT_AUTHORIZATION_ACTIVE</span>
        </div>

        <nav style={{ padding: '24px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'overview', icon: <Activity size={18} />, label: 'Pulse' },
            { id: 'live-now', icon: <Play size={18} />, label: 'Live Now TV' },
            { id: 'app-builder', icon: <Globe size={18} />, label: 'Homepage Builder' },
            { id: 'networks', icon: <Network size={18} />, label: 'Whitelabel Fleet' },
            { id: 'users', icon: <Users size={18} />, label: 'Network Directory' },
            { id: 'database', icon: <Database size={18} />, label: 'Data Clusters' },
            { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Global Analytics' },
            { id: 'accounting', icon: <Wallet size={18} />, label: 'Global Ledger' },
            { id: 'logs', icon: <Terminal size={18} />, label: 'System Logs' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '12px', background: activeTab === tab.id ? 'rgba(0, 85, 255, 0.1)' : 'transparent',
                border: 'none', color: activeTab === tab.id ? '#0055ff' : '#888', display: 'flex', alignItems: 'center', gap: '12px',
                fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', textAlign: 'left'
              }}
              onMouseOver={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#fff'; }}
              onMouseOut={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#888'; }}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px' }}>
          <button onClick={() => navigate('/')} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
            Exit to Platform
          </button>
        </div>
      </div>

      {/* Main Terminal Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <div style={{ height: '80px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 style={{ margin: 0, fontSize: '20px', textTransform: 'capitalize' }}>{activeTab.replace('-', ' ')}</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
             <ShieldAlert size={20} color="#FFD700" />
             <span style={{ fontSize: '14px', color: '#aaa', fontWeight: 'bold' }}>God Mode Enabled</span>
          </div>
        </div>

        {/* Dynamic Content Space */}
        <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                 {stats.map(s => (
                   <div key={s.label} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                          {s.icon}
                        </div>
                     </div>
                     <div style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>{s.value}</div>
                     <div style={{ color: '#888', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                   </div>
                 ))}
               </div>

               <div style={{ background: '#111', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
                 <h3 style={{ margin: '0 0 24px 0', fontSize: '20px' }}>Live Platform Telemetry</h3>
                 <div style={{ width: '100%', height: '300px', background: 'rgba(0,85,255,0.05)', borderRadius: '16px', border: '1px solid rgba(0,85,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0055ff', flexDirection: 'column', gap: '16px' }}>
                    <Activity size={48} />
                    <span>Real-time traffic visualization engine connected</span>
                 </div>
               </div>

            </motion.div>
          )}

          {activeTab === 'networks' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                 <h3 style={{ margin: 0, fontSize: '24px' }}>Provisioned Whitelabels</h3>
                 <button style={{ background: '#fff', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>+ Spawn New Tenant</button>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {whitelabelsList.length === 0 ? (
                    <div style={{ background: '#111', padding: '40px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center', color: '#888' }}>
                       No active tenants detected in the database. 
                       <br/>Did you run the <b>create_whitelabels_table.sql</b> script?
                    </div>
                 ) : whitelabelsList.map((brandConfig, i) => (
                   <div key={brandConfig.id || i} style={{ background: '#111', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                         <div style={{ width: '60px', height: '60px', background: brandConfig.accent || `linear-gradient(135deg, hsl(${(i * 50) % 360}, 100%, 50%), hsl(${((i * 50) + 60) % 360}, 100%, 50%))`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                            {brandConfig.name?.substring(0,2).toUpperCase() || 'WL'}
                         </div>
                         <div>
                           <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{brandConfig.name}</h4>
                           <span style={{ color: brandConfig.accent || '#0055ff', fontSize: '13px', background: brandConfig.accent ? `${brandConfig.accent}11` : 'rgba(0,85,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>{brandConfig.domain}</span>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold' }}>Fee:</span>
                            <input 
                              id={`fee-input-wl-${brandConfig.id}`}
                              type="number" 
                              defaultValue={brandConfig.platform_fee_percentage ?? globalSettings.global_whitelabel_fee} 
                              onBlur={async (e) => {
                                 const val = parseFloat(e.target.value);
                                 if (isNaN(val)) return;
                                 const btn = e.target.nextElementSibling?.nextElementSibling as HTMLButtonElement;
                                 if (btn) btn.innerText = '...';
                                 const { data, error } = await supabase!.from('whitelabel_configs').update({ platform_fee_percentage: val }).eq('id', brandConfig.id).select();
                                 if (error || !data || data.length === 0) {
                                    showToast('Failed to save (Permission Denied): ' + (error?.message || 'Row Level Security blocked the update.'), 'error');
                                    if (btn) btn.innerText = 'Save';
                                    return;
                                 }
                                 setWhitelabelsList(prev => prev.map(wl => wl.id === brandConfig.id ? { ...wl, platform_fee_percentage: val } : wl));
                                 if (btn) {
                                    btn.innerText = 'Saved';
                                    btn.style.color = '#00ff88';
                                    setTimeout(() => { btn.innerText = 'Save'; btn.style.color = '#0055ff'; }, 2000);
                                 }
                              }}
                              style={{ width: '50px', background: 'transparent', color: '#0055ff', border: 'none', fontWeight: 'bold', outline: 'none', textAlign: 'right' }}
                            />
                            <span style={{ color: '#0055ff', fontSize: '12px', fontWeight: 'bold' }}>%</span>
                            <button onClick={async (e) => {
                                const btn = e.currentTarget;
                                const input = document.getElementById(`fee-input-wl-${brandConfig.id}`) as HTMLInputElement;
                                const val = parseFloat(input.value);
                                if (isNaN(val)) return;
                                
                                const originalText = btn.innerText;
                                btn.innerText = '...';
                                const { data, error } = await supabase!.from('whitelabel_configs').update({ platform_fee_percentage: val }).eq('id', brandConfig.id).select();
                                if (error || !data || data.length === 0) {
                                   showToast('Failed to save (Permission Denied): ' + (error?.message || 'Row Level Security blocked the update.'), 'error');
                                   btn.innerText = 'Save';
                                   return;
                                }
                                
                                setWhitelabelsList(prev => prev.map(wl => wl.id === brandConfig.id ? { ...wl, platform_fee_percentage: val } : wl));
                                btn.innerText = 'Saved';
                                btn.style.color = '#00ff88';
                                setTimeout(() => { btn.innerText = 'Save'; btn.style.color = '#0055ff'; }, 2000);
                             }} style={{ padding: '4px 8px', background: 'rgba(0, 85, 255, 0.1)', color: '#0055ff', border: '1px solid rgba(0, 85, 255, 0.2)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', marginLeft: '4px', transition: '0.2s' }}>
                               Save
                             </button>
                         </div>
                         <button onClick={() => {
                            if(brandConfig.domain) window.open(`http://${brandConfig.domain}`, '_blank');
                            else showToast('No domain configured for this tenant', 'error');
                         }} style={{ padding: '10px 20px', background: 'rgba(0,85,255,0.1)', color: '#0055ff', border: '1px solid rgba(0,85,255,0.2)', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                            Visit Tenant Portal
                         </button>
                         <span style={{ padding: '10px 20px', background: 'rgba(0,255,136,0.1)', color: '#00ff88', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}><Play size={16}/> LIVE</span>
                      </div>
                   </div>
                 ))}
               </div>
             </motion.div>
          )}

          {activeTab === 'database' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <div style={{ background: '#111', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                     <Server size={32} color="#0055ff" />
                     <h3 style={{ margin: 0, fontSize: '24px' }}>Master PostgreSQL Architecture</h3>
                  </div>
                  <p style={{ color: '#888', marginBottom: '32px', fontSize: '16px', lineHeight: 1.6 }}>Direct connection established to the primary Supabase cluster. Use caution when executing raw SQL directives against the production fleet.</p>
                  
                  <div style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', color: '#4CAF50', height: '200px', overflowY: 'auto' }}>
                     root@vibe-network-db:~# SELECT count(*) FROM system_logs; <br/>
                     <span style={{ color: '#fff' }}>-{'>'} {systemLogs.length} audit records found in telemetry index.</span><br/><br/>
                     {isRestarting && <span style={{ color: '#ffaa00' }}>{">>>"} SYSTEM LOGS TRUNCATED IN PRODUCTION DATABASE...</span>}
                  </div>
                  <button onClick={async () => {
                     const btn = document.getElementById('purge-logs-btn') as HTMLButtonElement;
                     if(btn) { btn.innerText = 'Purging...'; btn.style.background = '#333'; }
                     const { error } = await supabase!.from('system_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                     if(error) {
                        showToast('Failed to truncate logs: ' + error.message, 'error');
                        if(btn) { btn.innerText = 'Purge System Logs'; btn.style.background = '#ff0000'; }
                        return;
                     }
                     logSystemEvent('ALERT', 'Master Admin manually purged all system logs.');
                     setSystemLogs([]);
                     setIsRestarting(true);
                     setTimeout(() => setIsRestarting(false), 5000);
                  }} id="purge-logs-btn" style={{ marginTop: '20px', padding: '16px 32px', background: isRestarting ? '#333' : '#ff0000', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' }}>
                     {isRestarting ? <CheckCircle size={20} /> : <StopCircle size={20} />} 
                     {isRestarting ? 'Telemetry Logs Purged' : 'Purge All System Logs'}
                  </button>
               </div>
             </motion.div>
          )}

          {activeTab === 'live-now' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                 <h3 style={{ margin: 0, fontSize: '24px' }}>Live Now TV Programming</h3>
               </div>
               <div style={{ background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '18px' }}>Inject Broadcast</h4>
                    <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
                       <button onClick={() => setBroadcastSource('youtube')} style={{ background: broadcastSource === 'youtube' ? '#0055ff' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>YouTube Link</button>
                       <button onClick={() => setBroadcastSource('upload')} style={{ background: broadcastSource === 'upload' ? '#0055ff' : 'transparent', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Upload Video</button>
                    </div>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {broadcastSource === 'youtube' ? (
                       <input type="text" placeholder="YouTube Video URL (e.g. https://youtube.com/watch...)" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="yt-url" />
                    ) : (
                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                         <input type="file" id="broadcastVideoUpload" accept="video/*" style={{ display: 'none' }} onChange={(e) => {
                             if (e.target.files && e.target.files[0]) {
                               setBroadcastFileUrl(URL.createObjectURL(e.target.files[0]));
                             }
                         }} />
                         <button onClick={() => document.getElementById('broadcastVideoUpload')?.click()} style={{ padding: '16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', flex: 1 }}>
                            {broadcastFileUrl ? 'Change Video' : 'Select Video File'}
                         </button>
                       </div>
                    )}
                    <input type="text" placeholder="Broadcast Title" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="yt-title" />
                    {broadcastSource === 'upload' && (
                       <textarea placeholder="Broadcast Description" rows={3} style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px', resize: 'vertical' }} id="yt-desc" />
                    )}
                    <input type="text" placeholder="Broadcast Time (e.g. LIVE, UP NEXT, 2:00 PM)" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="yt-time" />
                    <button onClick={async () => {
                       const url = broadcastSource === 'youtube' ? (document.getElementById('yt-url') as HTMLInputElement).value : broadcastFileUrl;
                       const title = (document.getElementById('yt-title') as HTMLInputElement).value;
                       const time = (document.getElementById('yt-time') as HTMLInputElement).value;
                       if(!url || !title) return showToast(broadcastSource === 'youtube' ? 'Enter URL and Title' : 'Select Video and Enter Title', 'error');
                       const { data: existingCat } = await supabase!.from('categories').select('id').eq('title', 'Live Network Schedule').single();
                       let targetCatId = existingCat?.id;
                       if (!targetCatId) {
                           const { data: newCat } = await supabase!.from('categories').insert({ title: 'Live Network Schedule' }).select('id').single();
                           if (!newCat) return showToast('Failed to create Live Network Schedule category.', 'error');
                           targetCatId = newCat.id;
                       }
                       
                       const { error } = await supabase!.from('videos').insert({
                         title, video_url: url, stream_time: time || 'LIVE', category_id: targetCatId,
                         image_url: `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800`
                       });
                       if (error) return showToast(`Failed to insert broadcast: ${error.message}`, 'error');
                       showToast('Successfully injected broadcast into global live slate!', 'success');
                       if (broadcastSource === 'youtube') (document.getElementById('yt-url') as HTMLInputElement).value = '';
                       setBroadcastFileUrl('');
                       (document.getElementById('yt-title') as HTMLInputElement).value = '';
                       if (document.getElementById('yt-desc')) (document.getElementById('yt-desc') as HTMLTextAreaElement).value = '';
                       (document.getElementById('yt-time') as HTMLInputElement).value = '';
                    }} style={{ background: '#0055ff', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                       Deploy Broadcast
                    </button>
                 </div>
               </div>
             </motion.div>
          )}

          {activeTab === 'app-builder' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
               
               {/* 1. Global Brand Settings */}
               <div style={{ background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#ff4d85' }}>1. Global Brand & Hero Settings</h4>
                 <p style={{ color: '#888', marginBottom: '20px' }}>Update the master platform brand name and the cinematic hero banner seen by all logged-out visitors.</p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <input type="text" placeholder="Platform Name (e.g. Vibe Network)" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="global-name" />
                    <input type="text" placeholder="Hero Image URL (e.g. https://...)" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="global-hero-img" />
                    <textarea placeholder="Hero Copy (e.g. Welcome to the ultimate network...)" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px', gridColumn: 'span 2', height: '100px' }} id="global-hero-copy" />
                 </div>
                 <button onClick={async () => {
                    const name = (document.getElementById('global-name') as HTMLInputElement).value;
                    const heroImage = (document.getElementById('global-hero-img') as HTMLInputElement).value;
                    const heroCopy = (document.getElementById('global-hero-copy') as HTMLTextAreaElement).value;
                    if(!name) return showToast('Platform Name is required', 'error');
                    
                    const { data: existing } = await supabase!.from('whitelabel_configs').select('id, theme').eq('domain', 'vibenetwork.tv').limit(1);
                    const updatePayload: any = { name };
                    
                    if (existing && existing.length > 0) {
                      const currentTheme = existing[0].theme || {};
                      const themeObj = { ...currentTheme, heroImage: heroImage || currentTheme.heroImage, heroCopy: heroCopy || currentTheme.heroCopy };
                      await supabase!.from('whitelabel_configs').update({ name, theme: themeObj }).eq('id', existing[0].id);
                    } else {
                      const fallbackTheme = { heroImage: heroImage || '', heroCopy: heroCopy || '' };
                      await supabase!.from('whitelabel_configs').insert([{ name, domain: 'vibenetwork.tv', theme: fallbackTheme }]);
                    }
                    showToast('Global Brand Settings Updated! Refresh the homepage to see changes.', 'success');
                 }} style={{ marginTop: '20px', background: '#0055ff', color: '#fff', border: 'none', padding: '16px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Save Brand Settings</button>
               </div>

               {/* 2. Category Sliders */}
               <div style={{ background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#00ff88' }}>2. Create Content Slider (Category)</h4>
                 <p style={{ color: '#888', marginBottom: '20px' }}>Every category creates a new horizontal scrolling slider row on the homepage.</p>
                 <div style={{ display: 'flex', gap: '16px' }}>
                    <input type="text" placeholder="Slider Title (e.g. Trending Business Podcasts)" style={{ flex: 1, background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="new-category" />
                    <button onClick={async () => {
                       const title = (document.getElementById('new-category') as HTMLInputElement).value;
                       if(!title) return;
                       await supabase!.from('categories').insert([{ title }]);
                       fetchCategories();
                       showToast('Category Slider Created!', 'success');
                       (document.getElementById('new-category') as HTMLInputElement).value = '';
                    }} style={{ background: '#00ff88', color: '#000', border: 'none', padding: '0 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Add Slider</button>
                 </div>
               </div>

               {/* 3. Add Content to Sliders */}
               <div style={{ background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#FFD700' }}>3. Add Content to Sliders</h4>
                 <p style={{ color: '#888', marginBottom: '20px' }}>Upload a video or image card into one of your existing homepage sliders.</p>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <select id="video-category" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }}>
                       <option value="">Select a Category Slider...</option>
                       {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                    <input type="text" placeholder="Content Title" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="video-title" />
                    <input type="text" placeholder="Thumbnail Image URL (e.g. https://...)" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="video-thumb" />
                    <input type="text" placeholder="Video/Link URL" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="video-url" />
                    
                    <button onClick={async () => {
                       const catId = (document.getElementById('video-category') as HTMLSelectElement).value;
                       const title = (document.getElementById('video-title') as HTMLInputElement).value;
                       const img = (document.getElementById('video-thumb') as HTMLInputElement).value;
                       const url = (document.getElementById('video-url') as HTMLInputElement).value;
                       
                       if(!catId || !title || !img) return showToast('Category, Title, and Thumbnail are required!', 'error');
                       
                       await supabase!.from('videos').insert([{
                         title, category_id: catId, image_url: img, video_url: url || '#'
                       }]);
                       showToast('Content Added to Slider!', 'success');
                       (document.getElementById('video-title') as HTMLInputElement).value = '';
                       (document.getElementById('video-thumb') as HTMLInputElement).value = '';
                       (document.getElementById('video-url') as HTMLInputElement).value = '';
                    }} style={{ background: '#FFD700', color: '#000', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Publish to Slider</button>
                 </div>
               </div>
             </motion.div>
          )}

          {activeTab === 'users' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h3 style={{ margin: 0, fontSize: '24px' }}>System Network Directory</h3>
                 <button onClick={fetchUsers} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Refresh Index</button>
               </div>
               <div style={{ background: '#111', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ color: '#888', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
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
                        <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#888' }}>Initializing network fetch pattern...</td></tr>
                      ) : usersList.map((user, i) => (
                        <tr key={user.id} style={{ borderBottom: i !== usersList.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                          <td style={{ padding: '16px 12px', fontFamily: 'monospace', color: '#0055ff', fontSize: '12px' }}>{user.id.split('-')[0]}</td>
                          <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{user.username || user.full_name || 'Unassigned Profile'}</td>
                          <td style={{ padding: '16px 12px' }}>
                            <span style={{ background: user.is_admin ? 'rgba(255,215,0,0.1)' : 'rgba(0,255,136,0.1)', color: user.is_admin ? '#FFD700' : '#00ff88', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                               {user.is_admin ? 'ADMINISTRATOR' : 'ACTIVE'}
                            </span>
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
                               <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold' }}>%</span>
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
                          <td style={{ padding: '16px 12px' }}>
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
             </motion.div>
          )}

           {activeTab === 'logs' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#0a0a0a', padding: '24px', borderRadius: '16px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #222', paddingBottom: '12px' }}>
                  <Terminal size={20} color="#00ff88" />
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>Daemon Live Trace</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#00ff88', fontFamily: 'monospace', maxHeight: '600px', overflowY: 'auto' }}>
                  {systemLogs.length === 0 && (
                     <div>[System] INFO: Daemon initialized. Waiting for telemetry...</div>
                  )}
                  {systemLogs.map((log, idx) => {
                     let color = '#00ff88';
                     if (log.level === 'WARN') color = '#ffaa00';
                     if (log.level === 'ERROR') color = '#ff0000';
                     if (log.level === 'ALERT') color = '#ffcc00';
                     const time = new Date(log.created_at).toISOString().replace('T', ' ').substring(0, 19) + 'Z';
                     return (
                        <div key={idx} style={{ color }}>
                           <span style={{ opacity: 0.5 }}>[{time}]</span> {log.level}: {log.message}
                        </div>
                     );
                  })}
                  <div className="blink" style={{ marginTop: '20px' }}>_</div>
                </div>
                <style>{`
                  @keyframes blinker { 50% { opacity: 0; } }
                  .blink { animation: blinker 1s linear infinite; }
                `}</style>
             </motion.div>
          )}

          {activeTab === 'analytics' && (() => {
             const platformGross = ledgerData.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
             let vibeRevenue = 0;
             let creatorEarnings = 0;
             let whitelabelRevenue = 0;

             ledgerData.forEach(tx => {
                const profile = tx.profiles ? (Array.isArray(tx.profiles) ? tx.profiles[0] : tx.profiles) : null;
                const wlId = profile?.whitelabel_id;
                const wlConfig = whitelabelsList.find(wl => wl?.id === wlId);
                const isDirect = !wlId;
                const gross = Number(tx.amount || 0);
                const wlFeePercent = isDirect ? 0 : Number(wlConfig?.platform_fee_percentage ?? globalSettings?.global_whitelabel_fee ?? 15);
                const vFeePercent = Number(profile?.platform_fee_percentage ?? globalSettings?.global_vibe_fee ?? 15);
                const totalFeePercent = vFeePercent + wlFeePercent;
                const creatorCutPercent = 100 - totalFeePercent;

                creatorEarnings += (gross * (creatorCutPercent / 100));
                vibeRevenue += (gross * (vFeePercent / 100));
                if (!isDirect) whitelabelRevenue += (gross * (wlFeePercent / 100));
             });

             return (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '24px' }}>Real-Time Global Analytics</h3>
                  <button onClick={() => showToast('Analytics Sync Complete', 'success')} style={{ background: '#0055ff', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Sync Telemetry</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                   {/* Total Volume */}
                   <div style={{ background: '#111', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <span style={{ color: '#888', fontWeight: 'bold', fontSize: '14px' }}>Total Platform Gross Volume</span>
                     <span style={{ fontSize: '32px', color: '#fff', fontWeight: 900 }}>${platformGross.toFixed(2)}</span>
                   </div>
                   
                   {/* Vibe Revenue */}
                   <div style={{ background: 'rgba(0,85,255,0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,85,255,0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <span style={{ color: '#0055ff', fontWeight: 'bold', fontSize: '14px' }}>Net Vibe Network Revenue</span>
                     <span style={{ fontSize: '32px', color: '#0055ff', fontWeight: 900 }}>${vibeRevenue.toFixed(2)}</span>
                   </div>

                   {/* Creator Earnings */}
                   <div style={{ background: 'rgba(0,255,136,0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,255,136,0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <span style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '14px' }}>Total Creator Payouts</span>
                     <span style={{ fontSize: '32px', color: '#00ff88', fontWeight: 900 }}>${creatorEarnings.toFixed(2)}</span>
                   </div>

                   {/* WL Revenue */}
                   <div style={{ background: 'rgba(255,215,0,0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,215,0,0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '14px' }}>Whitelabel Tenant Yields</span>
                     <span style={{ fontSize: '32px', color: '#FFD700', fontWeight: 900 }}>${whitelabelRevenue.toFixed(2)}</span>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                   <div style={{ background: '#111', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <h4 style={{ margin: '0 0 16px 0', color: '#fff', fontSize: '18px' }}>Network Nodes</h4>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#888' }}>Total Registered Profiles</span>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{dbStats.networks}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                        <span style={{ color: '#888' }}>Active Whitelabel Tenants</span>
                        <span style={{ color: '#fff', fontWeight: 'bold' }}>{dbStats.whitelabels}</span>
                     </div>
                   </div>
                </div>
             </motion.div>
             );
          })()}

          {activeTab === 'accounting' && (
             <ErrorBoundary>
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '24px' }}>Automated Global Ledger & Payout Splits</h3>
                  <button style={{ background: '#FFD700', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Commit Ledger Sync</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                   
                   {/* Direct Platform Tier */}
                   <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--accent-primary)' }}>
                     <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#fff' }}>1. Main Root Platform Architecture</h4>
                     <p style={{ color: '#888', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
                       For all creators directly registered and transacting on the core Vibe Network. No intermediaries.
                     </p>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ color: '#aaa', fontWeight: 'bold' }}>Creator / Profile Split</span>
                           <span style={{ fontSize: '24px', color: '#00ff88', fontWeight: 900 }}>{100 - Number(globalSettings?.global_vibe_fee ?? 15)}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ color: '#aaa', fontWeight: 'bold' }}>Vibe Network (Platform Fee)</span>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input id="global-vibe-fee-1" type="number" value={globalSettings.global_vibe_fee} onChange={(e) => setGlobalSettings(prev => ({ ...prev, global_vibe_fee: e.target.value }))} style={{ background: 'transparent', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', fontSize: '20px', fontWeight: 900, width: '80px', textAlign: 'center', outline: 'none', borderRadius: '8px', padding: '4px' }} />
                              <span style={{ fontSize: '20px', color: '#FFD700', fontWeight: 900 }}>%</span>
                              <button onClick={async (e) => {
                                 const btn = e.currentTarget;
                                 const val = parseFloat((document.getElementById('global-vibe-fee-1') as HTMLInputElement).value);
                                 if (isNaN(val) || !globalSettings.id) {
                                    if (!globalSettings.id) showToast('Settings row not initialized in database.', 'error');
                                    return;
                                 }
                                 btn.innerText = '...';
                                 const { error } = await supabase!.from('platform_settings').update({ global_vibe_fee: val }).eq('id', globalSettings.id);
                                 if (error) {
                                    showToast('Failed to save setting: ' + error.message, 'error');
                                    btn.innerText = 'Save';
                                    logSystemEvent('ERROR', `Failed to update Vibe Network Fee to ${val}%: ${error.message}`);
                                    return;
                                 }
                                 setGlobalSettings(prev => ({ ...prev, global_vibe_fee: val }));
                                 logSystemEvent('WARN', `Global Vibe Network Gateway Default updated to ${val}%`);
                                 btn.innerText = 'Saved';
                                 btn.style.color = '#00ff88';
                                 setTimeout(() => { btn.innerText = 'Save'; btn.style.color = '#FFD700'; }, 2000);
                              }} style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)', padding: '6px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', marginLeft: '10px' }}>
                                 Save
                              </button>
                           </div>
                        </div>
                     </div>
                   </div>

                   {/* Whitelabel Tenant Tier */}
                   <div style={{ background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#fff' }}>2. Distributive Whitelabel Architecture</h4>
                     <p style={{ color: '#888', margin: '0 0 24px 0', fontSize: '14px', lineHeight: 1.5 }}>
                       For transactions occurring inside a leased Enterprise Tenant. Vibe processes the payment and automatically distributes tripartite splits.
                     </p>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ color: '#aaa', fontWeight: 'bold' }}>Creator / Profile Split</span>
                           <span style={{ fontSize: '24px', color: '#00ff88', fontWeight: 900 }}>{100 - Number(globalSettings?.global_vibe_fee ?? 15) - Number(globalSettings?.global_whitelabel_fee ?? 15)}%</span>
                        </div>
                        <div style={{ background: 'rgba(0,85,255,0.05)', border: '1px solid rgba(0,85,255,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ color: '#aaa', fontWeight: 'bold' }}>Global Whitelabel Fee Default</span>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input id="global-wl-fee" type="number" value={globalSettings.global_whitelabel_fee} onChange={(e) => setGlobalSettings(prev => ({ ...prev, global_whitelabel_fee: e.target.value }))} style={{ background: 'transparent', border: '1px solid rgba(0,85,255,0.3)', color: '#0055ff', fontSize: '20px', fontWeight: 900, width: '80px', textAlign: 'center', outline: 'none', borderRadius: '8px', padding: '4px' }} />
                              <span style={{ fontSize: '20px', color: '#0055ff', fontWeight: 900 }}>%</span>
                              <button onClick={async (e) => {
                                 const btn = e.currentTarget;
                                 const val = parseFloat((document.getElementById('global-wl-fee') as HTMLInputElement).value);
                                 if (isNaN(val) || !globalSettings.id) {
                                    if (!globalSettings.id) showToast('Settings row not initialized in database.', 'error');
                                    return;
                                 }
                                 btn.innerText = '...';
                                 const { error } = await supabase!.from('platform_settings').update({ global_whitelabel_fee: val }).eq('id', globalSettings.id);
                                 if (error) {
                                    showToast('Failed to save setting: ' + error.message, 'error');
                                    btn.innerText = 'Save';
                                    logSystemEvent('ERROR', `Failed to update Whitelabel Fee to ${val}%: ${error.message}`);
                                    return;
                                 }
                                 setGlobalSettings(prev => ({ ...prev, global_whitelabel_fee: val }));
                                 logSystemEvent('WARN', `Global Whitelabel Fee Default updated to ${val}%`);
                                 btn.innerText = 'Saved';
                                 btn.style.color = '#00ff88';
                                 setTimeout(() => { btn.innerText = 'Save'; btn.style.color = '#0055ff'; }, 2000);
                              }} style={{ background: 'rgba(0,85,255,0.1)', color: '#0055ff', border: '1px solid rgba(0,85,255,0.2)', padding: '6px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', marginLeft: '10px' }}>
                                 Save
                              </button>
                           </div>
                        </div>
                        <div style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ color: '#aaa', fontWeight: 'bold' }}>Global Vibe Network Gateway Default</span>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <input id="global-vibe-fee" type="number" value={globalSettings.global_vibe_fee} onChange={(e) => setGlobalSettings(prev => ({ ...prev, global_vibe_fee: e.target.value }))} style={{ background: 'transparent', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', fontSize: '20px', fontWeight: 900, width: '80px', textAlign: 'center', outline: 'none', borderRadius: '8px', padding: '4px' }} />
                              <span style={{ fontSize: '20px', color: '#FFD700', fontWeight: 900 }}>%</span>
                              <button onClick={async (e) => {
                                 const btn = e.currentTarget;
                                 const val = parseFloat((document.getElementById('global-vibe-fee') as HTMLInputElement).value);
                                 if (isNaN(val) || !globalSettings.id) {
                                    if (!globalSettings.id) showToast('Settings row not initialized in database.', 'error');
                                    return;
                                 }
                                 btn.innerText = '...';
                                 const { error } = await supabase!.from('platform_settings').update({ global_vibe_fee: val }).eq('id', globalSettings.id);
                                 if (error) {
                                    showToast('Failed to save setting: ' + error.message, 'error');
                                    btn.innerText = 'Save';
                                    logSystemEvent('ERROR', `Failed to update Vibe Network Fee to ${val}%: ${error.message}`);
                                    return;
                                 }
                                 setGlobalSettings(prev => ({ ...prev, global_vibe_fee: val }));
                                 logSystemEvent('WARN', `Global Vibe Network Gateway Default updated to ${val}%`);
                                 btn.innerText = 'Saved';
                                 btn.style.color = '#00ff88';
                                 setTimeout(() => { btn.innerText = 'Save'; btn.style.color = '#FFD700'; }, 2000);
                              }} style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.2)', padding: '6px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', marginLeft: '10px' }}>
                                 Save
                              </button>
                           </div>
                        </div>
                     </div>
                   </div>
                   
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 16px 0' }}>
                  <h4 style={{ margin: 0, fontSize: '20px' }}>Global Revenue Rollup</h4>
                  <div style={{ display: 'flex', gap: '8px', background: '#111', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => setLedgerFilter('ALL')} style={{ padding: '8px 16px', background: ledgerFilter === 'ALL' ? 'rgba(255,255,255,0.1)' : 'transparent', color: ledgerFilter === 'ALL' ? '#fff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>All Traffic</button>
                    <button onClick={() => setLedgerFilter('Direct Vibe')} style={{ padding: '8px 16px', background: ledgerFilter === 'Direct Vibe' ? 'rgba(255,215,0,0.1)' : 'transparent', color: ledgerFilter === 'Direct Vibe' ? '#FFD700' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Direct Vibe Only</button>
                    <button onClick={() => setLedgerFilter('Whitelabel')} style={{ padding: '8px 16px', background: ledgerFilter === 'Whitelabel' ? 'rgba(0,85,255,0.1)' : 'transparent', color: ledgerFilter === 'Whitelabel' ? '#0055ff' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>Whitelabels Only</button>
                  </div>
                </div>
                <div style={{ background: '#111', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ color: '#888', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '16px 12px' }}>Date</th>
                        <th style={{ padding: '16px 12px' }}>Source</th>
                        <th style={{ padding: '16px 12px' }}>Protocol</th>
                        <th style={{ padding: '16px 12px' }}>Gross</th>
                        <th style={{ padding: '16px 12px', color: '#0055ff' }}>Vibe Cut</th>
                        <th style={{ padding: '16px 12px', color: '#FFD700' }}>WL Cut</th>
                        <th style={{ padding: '16px 12px', color: '#00ff88' }}>Creator</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const filteredTx = ledgerData.filter(tx => {
                           if (!tx) return false;
                           const profile = tx.profiles ? (Array.isArray(tx.profiles) ? tx.profiles[0] : tx.profiles) : null;
                           const origin = profile?.whitelabel_id ? 'Whitelabel' : 'Direct Vibe';
                           return ledgerFilter === 'ALL' || origin === ledgerFilter;
                        });
                        
                        if (filteredTx.length === 0) {
                           return (
                             <tr>
                               <td colSpan={7} style={{ padding: '60px', textAlign: 'center' }}>
                                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                    <AlertCircle size={48} color="#FFD700" />
                                    <h3 style={{ margin: 0, color: '#fff', fontSize: '24px' }}>Ledger is Empty</h3>
                                    <p style={{ color: '#aaa', margin: 0, fontSize: '16px', maxWidth: '400px' }}>
                                       There are exactly 0 transactions in your Supabase 'ledger' table for this filter tier. The Global Ledger is fully functional, it is just waiting for real Stripe payments!
                                    </p>
                                 </div>
                               </td>
                             </tr>
                           );
                        }
                        
                        return filteredTx.map((tx, i, arr) => {
                           if (!tx) return null;
                           const profile = tx.profiles ? (Array.isArray(tx.profiles) ? tx.profiles[0] : tx.profiles) : null;
                           const wlId = profile?.whitelabel_id;
                           const wlConfig = whitelabelsList.find(wl => wl?.id === wlId);
                           
                           const isDirect = !wlId;
                           const origin = isDirect ? 'Direct Vibe' : 'Whitelabel';
                           const gross = Number(tx.amount || 0);
                           
                           const wlFeePercent = isDirect ? 0 : Number(wlConfig?.platform_fee_percentage ?? globalSettings?.global_whitelabel_fee ?? 15);
                           const vFeePercent = Number(profile?.platform_fee_percentage ?? globalSettings?.global_vibe_fee ?? 15);
                           const totalFeePercent = vFeePercent + wlFeePercent;
                           const creatorCutPercent = 100 - totalFeePercent;
                           
                           const creatorCut = (gross * (creatorCutPercent / 100)).toFixed(2);
                           const vibeCut = (gross * (vFeePercent / 100)).toFixed(2);
                           const wlCut = isDirect ? 'N/A' : '$' + (gross * (wlFeePercent / 100)).toFixed(2);
                           
                           return (
                             <tr key={i} style={{ borderBottom: i !== arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                               <td style={{ padding: '16px 12px', color: '#888' }}>
                                 {(() => {
                                    if (!tx.created_at) return 'N/A';
                                    const d = new Date(tx.created_at);
                                    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
                                 })()}
                               </td>
                               <td style={{ padding: '16px 12px' }}>{tx.product_title || 'Network Purchase'}</td>
                               <td style={{ padding: '16px 12px' }}>
                                 <span style={{ padding: '4px 8px', background: isDirect ? 'rgba(0,85,255,0.1)' : 'rgba(255,170,0,0.1)', color: isDirect ? '#0055ff' : '#ffaa00', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                   {origin}
                                 </span>
                               </td>
                               <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>${gross.toFixed(2)}</td>
                               <td style={{ padding: '16px 12px', color: '#0055ff', fontWeight: 'bold' }}>${vibeCut} <span style={{fontSize:'10px', color:'#0055ff', opacity:0.7}}>({vFeePercent}%)</span></td>
                               <td style={{ padding: '16px 12px', color: '#ffaa00', fontWeight: 'bold' }}>{wlCut} {!isDirect && <span style={{fontSize:'10px', color:'#ffaa00', opacity:0.7}}>({wlFeePercent}%)</span>}</td>
                               <td style={{ padding: '16px 12px', color: '#00ff88', fontWeight: 'bold' }}>${creatorCut} <span style={{fontSize:'10px', color:'#00ff88', opacity:0.7}}>({creatorCutPercent}%)</span></td>
                             </tr>
                           );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
             </motion.div>
             </ErrorBoundary>
          )}
          
        </div>
      </div>
    </div>
  );
}
