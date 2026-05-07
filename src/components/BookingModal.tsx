import React, { useState } from 'react';
import { X, Calendar, Clock, Upload, Image as ImageIcon } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

export default function BookingModal({ onClose }: { onClose: () => void }) {
  const { wlConfig } = useWhiteLabel();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hours, setHours] = useState(1);
  const [image, setImage] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
       setSubmitted(true);
       setTimeout(() => onClose(), 2000);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
      <div style={{ background: 'var(--bg-color)', width: '100%', maxWidth: '500px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
        
        <div style={{ padding: '24px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Book Studio Time</h2>
           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px' }}>
              <X size={24} />
           </button>
        </div>

        {submitted ? (
           <div style={{ padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0,255,136,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                 <Calendar color="#00ff88" size={30} />
              </div>
              <h3 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>Request Submitted</h3>
              <p style={{ color: 'var(--text-muted)' }}>We have received your booking request. We will confirm your hourly slot shortly.</p>
           </div>
        ) : (
           <form onSubmit={handleSubmit} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                 <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#ccc' }}>Date</label>
                    <div style={{ position: 'relative' }}>
                       <Calendar size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#888' }} />
                       <input type="date" required value={date} onChange={e=>setDate(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }} />
                    </div>
                 </div>
                 <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#ccc' }}>Time</label>
                    <div style={{ position: 'relative' }}>
                       <Clock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#888' }} />
                       <input type="time" required value={time} onChange={e=>setTime(e.target.value)} style={{ width: '100%', padding: '14px 16px 14px 44px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }} />
                    </div>
                 </div>
              </div>

              <div>
                 <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#ccc' }}>Duration (Hours)</label>
                 <select value={hours} onChange={e=>setHours(Number(e.target.value))} style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', cursor: 'pointer' }}>
                    <option value={1}>1 Hour</option>
                    <option value={2}>2 Hours</option>
                    <option value={3}>3 Hours</option>
                    <option value={4}>4 Hours</option>
                    <option value={8}>8 Hours (Full Day)</option>
                 </select>
              </div>

              <div style={{ marginTop: '10px' }}>
                 <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#ccc' }}>Would you like to add an image for your booking reference?</label>
                 <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {image ? (
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff' }}>
                          <ImageIcon color={wlConfig?.accent || '#00ff88'} />
                          <span style={{ fontWeight: 'bold' }}>{image.name}</span>
                       </div>
                    ) : (
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                          <Upload size={28} />
                          <span>Click to upload an optional image</span>
                       </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => { if(e.target.files && e.target.files[0]) setImage(e.target.files[0]); }} style={{ display: 'none' }} />
                 </label>
              </div>

              <button type="submit" style={{ marginTop: '10px', padding: '18px', background: wlConfig?.accent || '#0055ff', color: '#fff', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: `0 8px 25px ${wlConfig?.accent || '#0055ff'}44` }}>
                 Confirm Request
              </button>
           </form>
        )}
      </div>
    </div>
  );
}
