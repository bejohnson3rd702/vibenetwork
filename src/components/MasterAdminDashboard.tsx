import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Users, Activity, Database, 
  ShieldAlert, Terminal, ChevronRight, BarChart3, 
  Network, Server, Play, StopCircle, CheckCircle, Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useEffect } from 'react';

export default function MasterAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const [dbStats, setDbStats] = useState({
      whitelabels: 0,
      nodes: 0,
      revenue: '$1.2M',
      load: '42%'
  });
  
  const [whitelabelsList, setWhitelabelsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isRestarting, setIsRestarting] = useState(false);
  const [ledgerFilter, setLedgerFilter] = useState('ALL');

  useEffect(() => {
     async function fetchGlobalMetrics() {
        const { data: usersData, count: usersCount } = await supabase!.from('profiles').select('*', { count: 'exact' }).limit(50);
        const { data: configs } = await supabase!.from('whitelabel_configs').select('*');
        
        setWhitelabelsList(configs || []);
        setUsersList(usersData || []);
        
        setDbStats(prev => ({
           ...prev,
           nodes: usersCount || 0,
           whitelabels: configs?.length || 0,
        }));
     }
     fetchGlobalMetrics();
  }, []);

  const stats = [
    { label: 'Active Whitelabels', value: dbStats.whitelabels.toString(), icon: <Network />, color: '#0055ff' },
    { label: 'Global Registered Nodes', value: dbStats.nodes.toString(), icon: <Users />, color: '#00ff88' },
    { label: 'Monthly Sustained MRR', value: dbStats.revenue, icon: <BarChart3 />, color: '#FFD700' },
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
            { id: 'overview', icon: <Globe size={18} />, label: 'Global Overview' },
            { id: 'live-now', icon: <Play size={18} />, label: 'Live Now TV' },
            { id: 'networks', icon: <Network size={18} />, label: 'Whitelabel Fleet' },
            { id: 'users', icon: <Users size={18} />, label: 'Node Directory' },
            { id: 'database', icon: <Database size={18} />, label: 'Data Clusters' },
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
                         <div style={{ width: '60px', height: '60px', background: brandConfig.accent || `linear-gradient(135deg, #005${i}ff, #ff${i}0ff)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                            {brandConfig.name?.substring(0,2).toUpperCase() || 'WL'}
                         </div>
                         <div>
                           <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{brandConfig.name}</h4>
                           <span style={{ color: brandConfig.accent || '#0055ff', fontSize: '13px', background: brandConfig.accent ? `${brandConfig.accent}11` : 'rgba(0,85,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>{brandConfig.domain}</span>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                         <button onClick={(e) => {
                            const btn = e.currentTarget;
                            const isAllowed = btn.innerText.includes('Allowed');
                            btn.innerText = isAllowed ? 'Block Global' : 'Allowed Global';
                            btn.style.background = isAllowed ? 'rgba(255,255,255,0.05)' : 'rgba(0,85,255,0.2)';
                            btn.style.color = isAllowed ? '#fff' : '#0055ff';
                            alert(`Whitelabel Global Directory Access has been ${isAllowed ? 'Disabled' : 'Granted'}.`);
                         }} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                            Allow Global
                         </button>
                         <button style={{ padding: '10px 20px', background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Play size={16}/> Active</button>
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
                  
                  <div style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', color: '#4CAF50', height: '200px' }}>
                     root@vibe-network-db:~# _<br/>
                     {isRestarting && <span style={{ color: '#ffaa00' }}>{">>>"} SYSTEM RESTART INITIATED...</span>}
                  </div>
                  <button onClick={() => setIsRestarting(true)} style={{ marginTop: '20px', padding: '16px 32px', background: isRestarting ? '#333' : '#ff0000', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                     {isRestarting ? <CheckCircle size={20} /> : <StopCircle size={20} />} 
                     {isRestarting ? 'Cluster Queued for Restart' : 'Force Cluster Restart'}
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
                 <h4 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Inject YouTube Broadcast</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input type="text" placeholder="YouTube Video URL (e.g. https://youtube.com/watch...)" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="yt-url" />
                    <input type="text" placeholder="Broadcast Title" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="yt-title" />
                    <input type="text" placeholder="Broadcast Time (e.g. LIVE, UP NEXT, 2:00 PM)" style={{ background: '#000', border: '1px solid #333', padding: '16px', borderRadius: '8px', color: '#fff', fontSize: '15px' }} id="yt-time" />
                    <button onClick={async () => {
                       const url = (document.getElementById('yt-url') as HTMLInputElement).value;
                       const title = (document.getElementById('yt-title') as HTMLInputElement).value;
                       const time = (document.getElementById('yt-time') as HTMLInputElement).value;
                       if(!url || !title) return alert('Enter URL and Title');
                       const { data: cat } = await supabase!.from('categories').select('id').eq('title', 'Live Network Schedule').single();
                       if (!cat) return alert('Live Network Schedule category not found in DB!');
                       await supabase!.from('videos').insert({
                         title, video_url: url, stream_time: time || 'LIVE', category_id: cat.id,
                         image_url: `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800`
                       });
                       alert('Successfully injected broadcast into global live slate!');
                       (document.getElementById('yt-url') as HTMLInputElement).value = '';
                       (document.getElementById('yt-title') as HTMLInputElement).value = '';
                       (document.getElementById('yt-time') as HTMLInputElement).value = '';
                    }} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', padding: '16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                       Deploy Broadcast
                    </button>
                 </div>
               </div>
             </motion.div>
          )}

          {activeTab === 'users' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                 <h3 style={{ margin: 0, fontSize: '24px' }}>System Node Directory</h3>
                 <button style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Auditor Review</button>
               </div>
               <div style={{ background: '#111', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ color: '#888', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ padding: '16px 12px' }}>Node ID</th>
                        <th style={{ padding: '16px 12px' }}>Designation</th>
                        <th style={{ padding: '16px 12px' }}>Status</th>
                        <th style={{ padding: '16px 12px' }}>Role</th>
                        <th style={{ padding: '16px 12px' }}>Vibe Indexing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.length === 0 ? (
                        <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#888' }}>Initializing node fetch pattern...</td></tr>
                      ) : usersList.map((user, i) => (
                        <tr key={user.id} style={{ borderBottom: i !== usersList.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                          <td style={{ padding: '16px 12px', fontFamily: 'monospace', color: '#0055ff', fontSize: '12px' }}>{user.id.split('-')[0]}</td>
                          <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{user.username || 'Unassigned User'}</td>
                          <td style={{ padding: '16px 12px' }}>
                            <span style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>ACTIVE</span>
                          </td>
                          <td style={{ padding: '16px 12px', color: '#ccc', fontSize: '14px', textTransform: 'capitalize' }}>{user.role || 'Member'}</td>
                          <td style={{ padding: '16px 12px' }}>
                             <button onClick={(e) => {
                                const btn = e.currentTarget;
                                const isGlobal = btn.innerText === 'Global';
                                btn.innerText = isGlobal ? 'Hidden' : 'Global';
                                btn.style.background = isGlobal ? 'rgba(255,255,255,0.05)' : 'rgba(255,215,0,0.1)';
                                btn.style.color = isGlobal ? '#888' : '#FFD700';
                                alert(`Profile global indexing visibility has been ${isGlobal ? 'revoked' : 'granted'}.`);
                             }} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', color: '#888', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', transition: '0.2s' }}>
                                Hidden
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
                <div style={{ fontFamily: 'monospace', color: '#00ff88', fontSize: '13px', lineHeight: 1.8, height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>[2026-04-06T10:14:02Z] INFO: Initializing B2B router matrix... OK.</div>
                  <div>[2026-04-06T10:14:03Z] WARN: Legacy music profiles intercepted at layer 4.</div>
                  <div>[2026-04-06T10:14:05Z] INFO: Executing role demotion on DJ partitions.</div>
                  <div>[2026-04-06T10:14:07Z] INFO: Database seeder node successfully connected via service role.</div>
                  <div style={{ color: '#fff' }}>[2026-04-06T10:14:09Z] SYNC: Provisioning 3 new whitelabel tenants across us-east regions.</div>
                  <div style={{ color: '#ffcc00' }}>[2026-04-06T10:14:15Z] ALERT: Master CPU spiking above 80% during node migration. Autoresizing pool.</div>
                  <div>[2026-04-06T10:14:16Z] INFO: Target state converged. Resuming normal operations.</div>
                  <div className="blink" style={{ marginTop: '20px' }}>_</div>
                </div>
                <style>{`
                  @keyframes blinker { 50% { opacity: 0; } }
                  .blink { animation: blinker 1s linear infinite; }
                `}</style>
             </motion.div>
          )}

          {activeTab === 'accounting' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '24px' }}>Automated Global Ledger & Payout Splits</h3>
                  <button style={{ background: '#FFD700', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Commit Ledger Sync</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                   
                   {/* Direct Node Tier */}
                   <div style={{ background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                     <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#fff' }}>1. Main Root Node Architecture</h4>
                     <p style={{ color: '#888', margin: '0 0 24px 0', fontSize: '14px', lineHeight: 1.5 }}>
                       For all creators directly registered and transacting on the core Vibe Network. No intermediaries.
                     </p>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ color: '#aaa', fontWeight: 'bold' }}>Creator / Profile Split</span>
                           <span style={{ fontSize: '24px', color: '#00ff88', fontWeight: 900 }}>70%</span>
                        </div>
                        <div style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ color: '#aaa', fontWeight: 'bold' }}>Vibe Network (Platform Fee)</span>
                           <span style={{ fontSize: '24px', color: '#FFD700', fontWeight: 900 }}>30%</span>
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
                           <span style={{ fontSize: '24px', color: '#00ff88', fontWeight: 900 }}>70%</span>
                        </div>
                        <div style={{ background: 'rgba(0,85,255,0.05)', border: '1px solid rgba(0,85,255,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ color: '#aaa', fontWeight: 'bold' }}>Enterprise Whitelabel Fee</span>
                           <span style={{ fontSize: '24px', color: '#0055ff', fontWeight: 900 }}>15%</span>
                        </div>
                        <div style={{ background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <span style={{ color: '#aaa', fontWeight: 'bold' }}>Vibe Network (Gateway Fee)</span>
                           <span style={{ fontSize: '24px', color: '#FFD700', fontWeight: 900 }}>15%</span>
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
                        <th style={{ padding: '16px 12px' }}>Timestamp</th>
                        <th style={{ padding: '16px 12px' }}>Source Node</th>
                        <th style={{ padding: '16px 12px' }}>Type</th>
                        <th style={{ padding: '16px 12px' }}>Gross Sub</th>
                        <th style={{ padding: '16px 12px', color: '#0055ff' }}>WL Cut (15%)</th>
                        <th style={{ padding: '16px 12px', color: '#FFD700' }}>Vibe Cut (15-30%)</th>
                        <th style={{ padding: '16px 12px', color: '#00ff88' }}>Creator (70%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ...(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vibe_network_ledger') || '[]') : []),
                        { time: 'Just now', source: 'Acme Corp Systems', origin: 'Whitelabel', gross: 49.99 },
                        { time: '2 min ago', source: 'Nexus Tech Global', origin: 'Whitelabel', gross: 9.99 },
                        { time: '14 min ago', source: 'DJ Tech Live', origin: 'Direct Vibe', gross: 14.99 },
                        { time: '1 hr ago', source: 'Vertex Media', origin: 'Whitelabel', gross: 199.99 },
                        { time: '2 hrs ago', source: 'SaaS Innovators', origin: 'Direct Vibe', gross: 29.99 },
                      ].filter(tx => ledgerFilter === 'ALL' || tx.origin === ledgerFilter).map((tx, i, arr) => {
                         const creatorCut = (Number(tx.gross) * 0.70).toFixed(2);
                         const isDirect = tx.origin === 'Direct Vibe';
                         const vibeCut = isDirect ? (Number(tx.gross) * 0.30).toFixed(2) : (Number(tx.gross) * 0.15).toFixed(2);
                         const wlCut = isDirect ? 'N/A' : '$' + (Number(tx.gross) * 0.15).toFixed(2);
                         
                         return (
                           <tr key={i} style={{ borderBottom: i !== arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                             <td style={{ padding: '16px 12px', color: '#888', fontSize: '13px' }}>{tx.time}</td>
                             <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>{tx.source}</td>
                             <td style={{ padding: '16px 12px' }}>
                               <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', background: isDirect ? 'rgba(255,215,0,0.1)' : 'rgba(0,85,255,0.1)', color: isDirect ? '#FFD700' : '#0055ff' }}>{tx.origin}</span>
                             </td>
                             <td style={{ padding: '16px 12px', fontWeight: 'bold' }}>${Number(tx.gross).toFixed(2)}</td>
                             <td style={{ padding: '16px 12px', color: '#888' }}>{wlCut}</td>
                             <td style={{ padding: '16px 12px', color: '#FFD700', fontWeight: 'bold' }}>+${vibeCut}</td>
                             <td style={{ padding: '16px 12px', color: '#00ff88', fontWeight: 'bold' }}>${creatorCut}</td>
                           </tr>
                         )
                      })}
                      {ledgerFilter !== 'ALL' && [1].map(() => {
                         const matchCount = [
                           { origin: 'Whitelabel' }, { origin: 'Whitelabel' }, { origin: 'Direct Vibe' }, { origin: 'Whitelabel' }, { origin: 'Direct Vibe' }
                         ].filter(tx => tx.origin === ledgerFilter).length;
                         if (matchCount === 0) return (
                            <tr><td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#888' }}>No recent traffic detected for this filter tier.</td></tr>
                         );
                         return null;
                      })}
                    </tbody>
                  </table>
                </div>
             </motion.div>
          )}
          
        </div>
      </div>
    </div>
  );
}
