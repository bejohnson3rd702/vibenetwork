import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { AiTextArea } from './AiComponents';

export const PagesTab = ({ wlConfig }: { wlConfig: any }) => {
  const [enableWatchLive, setEnableWatchLive] = useState(wlConfig?.enableWatchLive ?? true);
  const [enableBooking, setEnableBooking] = useState(wlConfig?.enableBooking ?? false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const executeSave = async () => {
    try {
      setUploadStatus('uploading');
      
      const updatedTheme = {
        ...wlConfig.theme,
        enableWatchLive,
        enableBooking
      };

      const { error } = await supabase.from('whitelabel_configs').update({
        theme: updatedTheme
      }).eq('id', wlConfig.id);
      
      if (error) throw error;

      const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
      const index = localNetworks.findIndex((n: any) => n.id === wlConfig.id);
      if (index >= 0) {
        localNetworks[index].theme = updatedTheme;
        localNetworks[index].enableWatchLive = enableWatchLive;
        localNetworks[index].enableBooking = enableBooking;
        localStorage.setItem('vibe_local_networks', JSON.stringify(localNetworks));
      }

      setUploadStatus('success');
      setTimeout(() => setUploadStatus(null), 3000);
      alert('Features Successfully Deployed!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      alert('Save failed: ' + e.message);
      setUploadStatus(null);
    }
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
         <div>
           <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Global Structural Pages</h1>
           <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>Add or edit underlying dynamic pages mapped into your master loop.</p>
         </div>
         <button style={{ padding: '16px 24px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>+ Spawn New Section</button>
      </div>
      
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
         <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Watch Live Feature</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>Enable or disable the Watch Live player and broadcast sections on the network.</p>
         </div>
         <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.5)', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', gap: '12px' }}>
            <input type="checkbox" checked={enableWatchLive} onChange={(e) => setEnableWatchLive(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: wlConfig.accent }} />
            <span style={{ fontWeight: 'bold' }}>{enableWatchLive ? 'Enabled' : 'Disabled'}</span>
         </label>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
         <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Booking Feature</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>Enable or disable the hourly Booking button on the header.</p>
         </div>
         <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.5)', padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', gap: '12px' }}>
            <input type="checkbox" checked={enableBooking} onChange={(e) => setEnableBooking(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: wlConfig.accent }} />
            <span style={{ fontWeight: 'bold' }}>{enableBooking ? 'Enabled' : 'Disabled'}</span>
         </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
         <button onClick={executeSave} disabled={uploadStatus === 'uploading'} style={{ padding: '14px 32px', background: wlConfig.accent || '#0055ff', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: `0 8px 25px ${wlConfig.accent || '#0055ff'}44` }}>
            {uploadStatus === 'uploading' ? 'Saving...' : 'Save & Deploy Features'}
         </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
         {(wlConfig.customSections ? wlConfig.customSections.split(',') : ['Default About Base']).map((sec: string, idx: number) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '24px', color: wlConfig.accent }}>[Live] {sec.trim()}</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Load Editor</button>
                     <button style={{ padding: '8px 16px', background: 'rgba(255,50,50,0.1)', color: '#ff3333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Disconnect</button>
                  </div>
               </div>
               <AiTextArea defaultValue="" accent={wlConfig.accent} />
            </div>
         ))}
      </div>
    </div>
  );
};
