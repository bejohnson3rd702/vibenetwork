import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export const InboxTab = ({ wlConfig }: { wlConfig: any }) => {
  const [contactEmail, setContactEmail] = useState(wlConfig.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(wlConfig.contactPhone || '');
  const [contactAddress, setContactAddress] = useState(wlConfig.contactAddress || '');
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
     const loadLeads = async () => {
         const { data } = await supabase.from('network_leads').select('*').eq('whitelabel_id', wlConfig.id).order('created_at', { ascending: false });
         if (data) setLeads(data);
     };
     loadLeads();
     window.addEventListener('new_lead_received', loadLeads);
     return () => window.removeEventListener('new_lead_received', loadLeads);
  }, [wlConfig.id]);

  const executeSave = async () => {
    try {
      setUploadStatus('uploading');
      
      const updatedTheme = {
        ...wlConfig.theme,
        contactEmail,
        contactPhone,
        contactAddress
      };

      const { error } = await supabase.from('whitelabel_configs').update({
        theme: updatedTheme
      }).eq('id', wlConfig.id);
      
      if (error) throw error;

      const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
      const index = localNetworks.findIndex((n: any) => n.id === wlConfig.id);
      if (index >= 0) {
        localNetworks[index].theme = updatedTheme;
        localNetworks[index].contactEmail = contactEmail;
        localStorage.setItem('vibe_local_networks', JSON.stringify(localNetworks));
      }

      setUploadStatus('success');
      setTimeout(() => setUploadStatus(null), 3000);
      alert('Routing Table Successfully Deployed!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      alert('Save failed: ' + e.message);
      setUploadStatus(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ padding: '40px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
           <div>
             <h3 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Contact Destination Parameters</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '18px', margin: 0, lineHeight: 1.5 }}>Configure where inquiries from your network's Contact Us form are routed.</p>
           </div>
           <button onClick={executeSave} disabled={uploadStatus === 'uploading'} style={{ padding: '12px 24px', background: wlConfig.accent, color: 'var(--text-primary)', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
              {uploadStatus === 'uploading' ? 'Deploying...' : 'Deploy Routing Table'}
           </button>
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
           <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>Primary Ingestion Email</label>
              <input type="text" value={contactEmail} onChange={e=>setContactEmail(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }} />
           </div>
           <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>Corporate Phone Pipeline</label>
              <input type="text" value={contactPhone} onChange={e=>setContactPhone(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }} />
           </div>
           <div style={{ flex: 1, minWidth: '250px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>Physical Operations Node</label>
              <input type="text" value={contactAddress} onChange={e=>setContactAddress(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }} />
           </div>
        </div>
      </div>

      <div style={{ padding: '40px', background: 'rgba(0,0,0,0.3)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>Lead Inbox</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px', lineHeight: 1.5 }}>View encrypted payloads transmitted directly from your network's Contact Us forms.</p>
        
        {selectedLead ? (
           <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setSelectedLead(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>← Back to Triage</button>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Sender: {selectedLead.email}</h2>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 30px 0' }}>Received: {new Date(selectedLead.created_at).toLocaleString()}</p>
              <div style={{ background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', color: '#ccc', lineHeight: 1.6, fontSize: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 {selectedLead.message}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
                 <button style={{ padding: '12px 24px', background: wlConfig.accent, color: 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Forward to Sales CRM</button>
                 <button onClick={async () => {
                    await supabase.from('network_leads').delete().eq('id', selectedLead.id);
                    setLeads(leads.filter(l => l.id !== selectedLead.id));
                    setSelectedLead(null);
                 }} style={{ padding: '12px 24px', background: 'rgba(255,0,0,0.1)', color: '#ff0000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Archive Lead</button>
              </div>
           </div>
        ) : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'table', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                 <div style={{ display: 'table-row', background: 'rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                    <div style={{ display: 'table-cell', padding: '16px 20px' }}>Date</div>
                    <div style={{ display: 'table-cell', padding: '16px 20px' }}>Entity</div>
                    <div style={{ display: 'table-cell', padding: '16px 20px' }}>Payload Preview</div>
                    <div style={{ display: 'table-cell', padding: '16px 20px' }}>Action</div>
                 </div>
                 
                 {leads.length === 0 ? (
                    <div style={{ display: 'table-row' }}>
                       <div style={{ display: 'table-cell', padding: '30px 20px', color: 'var(--text-muted)', textAlign: 'center' }} colSpan={4}>No leads have been ingested into this pipeline yet.</div>
                    </div>
                 ) : (
                    leads.map((lead: any, i: number) => (
                       <div key={i} style={{ display: 'table-row', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'table-cell', padding: '16px 20px', color: 'var(--text-muted)' }}>{new Date(lead.created_at).toLocaleDateString()}</div>
                          <div style={{ display: 'table-cell', padding: '16px 20px', fontWeight: 'bold' }}>{lead.email}</div>
                          <div style={{ display: 'table-cell', padding: '16px 20px', color: '#ccc' }}>{lead.message.substring(0, 60)}...</div>
                          <div style={{ display: 'table-cell', padding: '16px 20px' }}>
                             <button onClick={() => setSelectedLead(lead)} style={{ padding: '8px 16px', background: wlConfig.accent, color: 'var(--text-primary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>View Full</button>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
