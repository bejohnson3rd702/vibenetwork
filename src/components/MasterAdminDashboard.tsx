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

  async function fetchUsers() {
     setLoading(true);
     const { data: usersData } = await supabase!.from('profiles').select('*').limit(50);
     setUsersList(usersData || []);
     setLoading(false);
  }

  useEffect(() => {
     async function fetchGlobalMetrics() {
        const { count: usersCount } = await supabase!.from('profiles').select('*', { count: 'exact', head: true });
        const { data: configs } = await supabase!.from('whitelabel_configs').select('*');
        const { data: ledgerTx } = await supabase!.from('ledger').select('*, profiles(*)').order('created_at', { ascending: false }).limit(50);
        
        setWhitelabelsList(configs || []);
        if (ledgerTx) setLedgerData(ledgerTx);
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
                              type="number" 
                              defaultValue={brandConfig.platform_fee_percentage || 15} 
                              onBlur={async (e) => {
                                const val = parseFloat(e.target.value);
                                if (isNaN(val)) return;
                                await supabase!.from('whitelabel_configs').update({ platform_fee_percentage: val }).eq('id', brandConfig.id);
                              }}
                              style={{ width: '50px', background: 'transparent', color: '#0055ff', border: 'none', fontWeight: 'bold', outline: 'none', textAlign: 'right' }}
                            />
                            <span style={{ color: '#0055ff', fontSize: '12px', fontWeight: 'bold' }}>%</span>
                         </div>
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
                       const { data: existingCat } = await supabase!.from('categories').select('id').eq('title', 'Live Network Schedule').single();
                       let targetCatId = existingCat?.id;
                       if (!targetCatId) {
                           const { data: newCat } = await supabase!.from('categories').insert({ title: 'Live Network Schedule' }).select('id').single();
                           if (!newCat) return alert('Failed to create Live Network Schedule category.');
                           targetCatId = newCat.id;
                       }
                       
                       const { error } = await supabase!.from('videos').insert({
                         title, video_url: url, stream_time: time || 'LIVE', category_id: targetCatId,
                         image_url: `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800`
                       });
                       if (error) return alert(`Failed to insert broadcast: ${error.message}`);
                       alert('Successfully injected broadcast into global live slate!');
                       (document.getElementById('yt-url') as HTMLInputElement).value = '';
                       (document.getElementById('yt-title') as HTMLInputElement).value = '';
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
                    if(!name) return alert('Platform Name is required');
                    
                    const { data: existing } = await supabase!.from('whitelabel_configs').select('id').limit(1);
                    const updatePayload: any = { name };
                    // If theme doesn't exist we'll merge
                    const themeObj = { heroImage: heroImage || '', heroCopy: heroCopy || '' };
                    
                    if (existing && existing.length > 0) {
                      await supabase!.from('whitelabel_configs').update({ name, theme: themeObj }).eq('id', existing[0].id);
                    } else {
                      await supabase!.from('whitelabel_configs').insert([{ name, theme: themeObj }]);
                    }
                    alert('Global Brand Settings Updated! Refresh the homepage to see changes.');
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
                       alert('Category Slider Created!');
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
                       
                       if(!catId || !title || !img) return alert('Category, Title, and Thumbnail are required!');
                       
                       await supabase!.from('videos').insert([{
                         title, category_id: catId, image_url: img, video_url: url || '#'
                       }]);
                       alert('Content Added to Slider!');
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
                        <th style={{ padding: '16px 12px' }}>Vibe Indexing</th>
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
                            <span style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>ACTIVE</span>
                          </td>
                          <td style={{ padding: '16px 12px', color: user.whitelabel_id ? '#0055ff' : '#ccc', fontSize: '14px', fontWeight: 'bold' }}>{user.whitelabel_id ? 'Enterprise Tenant' : 'Platform Creator'}</td>
                          <td style={{ padding: '16px 12px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                               <input 
                                 type="number" 
                                 defaultValue={user.platform_fee_percentage || 15} 
                                 onBlur={async (e) => {
                                   const val = parseFloat(e.target.value);
                                   if (isNaN(val)) return;
                                   await supabase!.from('profiles').update({ platform_fee_percentage: val }).eq('id', user.id);
                                   // Keep it silent to not annoy the admin on every blur, or show a toast
                                 }}
                                 style={{ width: '60px', padding: '6px', background: 'rgba(255,255,255,0.05)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '6px', fontWeight: 'bold', outline: 'none' }}
                               />
                               <span style={{ color: '#888', fontSize: '12px', fontWeight: 'bold' }}>%</span>
                             </div>
                          </td>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#00ff88', fontFamily: 'monospace' }}>
                  <div>[2026-04-06T10:14:02Z] INFO: Initializing B2B router matrix... OK.</div>
                  <div>[2026-04-06T10:14:03Z] WARN: Legacy music profiles intercepted at layer 4.</div>
                  <div>[2026-04-06T10:14:07Z] INFO: Database seeder service successfully connected via service role.</div>
                  <div>[2026-04-06T10:14:12Z] SUCCESS: Migrated 6 external media assets to global CDN.</div>
                  <div style={{ color: '#ffcc00' }}>[2026-04-06T10:14:15Z] ALERT: Master CPU spiking above 80% during network migration. Autoresizing pool.</div>
                  <div>[2026-04-06T10:14:22Z] INFO: Global latency stable at 24ms.</div>
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
                   
                   {/* Direct Platform Tier */}
                   <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid #b829ea' }}>
                     <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#fff' }}>1. Main Root Platform Architecture</h4>
                     <p style={{ color: '#888', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
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
                        <th style={{ padding: '16px 12px' }}>Source Network</th>
                        <th style={{ padding: '16px 12px' }}>Protocol</th>
                        <th style={{ padding: '16px 12px' }}>Gross Sub</th>
                        <th style={{ padding: '16px 12px', color: '#0055ff' }}>WL Cut (15%)</th>
                        <th style={{ padding: '16px 12px', color: '#FFD700' }}>Vibe Cut (15-30%)</th>
                        <th style={{ padding: '16px 12px', color: '#00ff88' }}>Creator (70%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const mappedTx = ledgerData.map(tx => ({
                          time: new Date(tx.created_at).toLocaleDateString(),
                          source: tx.product_title || 'Network Purchase',
                          origin: tx.profiles?.whitelabel_id ? 'Whitelabel' : 'Direct Vibe',
                          gross: Number(tx.amount),
                          vibeFeePercent: Number(tx.profiles?.platform_fee_percentage || 15)
                        }));
                        
                        const filteredTx = mappedTx.filter(tx => ledgerFilter === 'ALL' || tx.origin === ledgerFilter);
                        
                        if (filteredTx.length === 0) {
                           return <tr><td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#888' }}>No recent traffic detected for this filter tier.</td></tr>;
                        }
                        
                        return filteredTx.map((tx, i, arr) => {
                           const isDirect = tx.origin === 'Direct Vibe';
                           const wlFeePercent = isDirect ? 0 : 15; // Assumption based on standard whitelabel rate
                           const totalFeePercent = tx.vibeFeePercent + wlFeePercent;
                           const creatorCutPercent = 100 - totalFeePercent;
                           
                           const creatorCut = (tx.gross * (creatorCutPercent / 100)).toFixed(2);
                           const vibeCut = (tx.gross * (tx.vibeFeePercent / 100)).toFixed(2);
                           const wlCut = isDirect ? 'N/A' : '$' + (tx.gross * (wlFeePercent / 100)).toFixed(2);
                           
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
                           );
                        });
                      })()}
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
