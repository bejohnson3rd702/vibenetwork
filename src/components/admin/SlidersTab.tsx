import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';

export const SlidersTab = ({ wlConfig }: { wlConfig: any }) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const executeUploadBind = () => {
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('success');
      setTimeout(() => setUploadStatus(null), 3000);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Content Grid Deployment</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px', lineHeight: 1.5 }}>Upload high-definition visuals, bind routing links, and inject media payloads into your operational carousels.</p>
      
      <div style={{ border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '24px', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: '0.3s ease' }} onMouseOver={e=>e.currentTarget.style.borderColor = wlConfig.accent} onMouseOut={e=>e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}>
         <div style={{ background: `${wlConfig.accent}22`, padding: '24px', borderRadius: '50%' }}>
            <Upload size={48} color={wlConfig.accent} />
         </div>
         <div>
           <h3 style={{ fontSize: '24px', margin: '0 0 12px 0', fontWeight: 'bold' }}>Drop Slider Assets Here</h3>
           <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '16px' }}>Attach images or video files directly to any slot</p>
         </div>
         <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
           <select style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}>
              <option>Target: Slider Row 1</option>
              <option>Target: Slider Row 2</option>
              <option>Target: Slider Row 3</option>
              <option>Target: Slider Row 4</option>
           </select>
           <input type="text" placeholder="URL Route on click (e.g. /video/1)" style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', minWidth: '250px' }} />
         </div>
         <button onClick={executeUploadBind} style={{ marginTop: '24px', padding: '18px 40px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer' }}>
            Execute Upload Bind
         </button>
      </div>
      
      {uploadStatus === 'uploading' && (
        <div style={{ marginTop: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '48px', height: '48px', border: `4px solid ${wlConfig.accent}44`, borderTopColor: wlConfig.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '18px' }}>Ingesting payload architecture...</p>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
               <div style={{ width: '65%', height: '100%', background: wlConfig.accent, transition: 'width 2s linear' }} />
            </div>
          </div>
        </div>
      )}
      {uploadStatus === 'success' && (
        <div style={{ marginTop: '40px', background: 'rgba(0,255,100,0.1)', border: '1px solid rgba(0,255,100,0.3)', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <CheckCircle size={40} color="#00ff88" />
          <div>
            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#00ff88', fontSize: '18px' }}>Injection Bound to Slider</p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>The asset and routing logic is now live on the global grid.</p>
          </div>
        </div>
      )}
    </div>
  );
};
