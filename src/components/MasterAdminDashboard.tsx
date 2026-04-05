import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Users, Activity, Settings, Database, 
  ShieldAlert, Terminal, ChevronRight, BarChart3, 
  Network, Server, Play, StopCircle, CheckCircle 
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
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
     async function fetchGlobalMetrics() {
        const { count: usersCount } = await supabase!.from('profiles').select('*', { count: 'exact', head: true });
        const { data: configs } = await supabase!.from('whitelabel_configs').select('*');
        
        setWhitelabelsList(configs || []);
        
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
            { id: 'networks', icon: <Network size={18} />, label: 'Whitelabel Fleet' },
            { id: 'users', icon: <Users size={18} />, label: 'Node Directory' },
            { id: 'database', icon: <Database size={18} />, label: 'Data Clusters' },
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
                           <span style={{ color: brandConfig.accent || '#0055ff', fontSize: '13px', background: `${brandConfig.accent}11` || 'rgba(0,85,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>{brandConfig.domain}</span>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                         <button style={{ padding: '10px 20px', background: 'rgba(0,255,136,0.1)', color: '#00ff88', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Play size={16}/> Active</button>
                         <button style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Manage Config</button>
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
          
        </div>
      </div>
    </div>
  );
}
