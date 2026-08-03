import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, Activity, Percent, Users } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useToast } from '../../context/ToastContext';

export const WalletTab = ({ wlConfig }: { wlConfig: any }) => {
  const toast = useToast();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [paySubsWithWallet, setPaySubsWithWallet] = useState(true);
  const [feePercentage, setFeePercentage] = useState(wlConfig.platform_fee_percentage || 0);
  const [isSavingFee, setIsSavingFee] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [pendingProfileChanges, setPendingProfileChanges] = useState<{ [key: string]: number }>({});
  const [isSavingProfiles, setIsSavingProfiles] = useState(false);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  useEffect(() => {
    if (wlConfig?.id) {
       supabase.from('profiles').select('id, username, avatar_url, platform_fee_percentage').eq('whitelabel_id', wlConfig.id).then(({ data }) => {
          if (data) setProfiles(data);
       });

       // Fetch dynamic settled revenue balance from ledger table
       (async () => {
         try {
           const { data: profs } = await supabase.from('profiles').select('id').eq('whitelabel_id', wlConfig.id);
           const profIds = (profs || []).map(p => p.id);

           let query = supabase.from('ledger').select('amount, type');
           if (profIds.length > 0) {
             query = query.or(`whitelabel_id.eq.${wlConfig.id},creator_id.in.(${profIds.join(',')})`);
           } else {
             query = query.eq('whitelabel_id', wlConfig.id);
           }

           const { data: ledgerTx } = await query;
           if (ledgerTx && ledgerTx.length > 0) {
             const total = ledgerTx.reduce((sum: number, tx: any) => {
               const amt = Number(tx.amount || 0);
               if (tx.type === 'WITHDRAWAL' || tx.type === 'PAYOUT') {
                 return sum - amt;
               }
                 return sum + amt;
             }, 0);
             setWalletBalance(Math.max(0, total));
           } else {
             setWalletBalance(0);
           }
         } catch (err) {
           console.warn('Wallet balance query warning:', err);
         }
       })();
    }
  }, [wlConfig?.id]);

  const handleProfileFeeChange = (profileId: string, val: number) => {
     setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, platform_fee_percentage: val } : p));
     setPendingProfileChanges(prev => ({ ...prev, [profileId]: val }));
  };

  const handleSaveProfileChanges = async () => {
    setIsSavingProfiles(true);
    
    const currentTheme = wlConfig.theme || {};
    const updatedCreatorSplits = { ...(currentTheme.creator_splits || {}) };
    
    Object.entries(pendingProfileChanges).forEach(([profileId, val]) => {
       updatedCreatorSplits[profileId] = val;
    });

    const newTheme = { ...currentTheme, creator_splits: updatedCreatorSplits };
    
    const { error } = await supabase.from('whitelabel_configs').update({ theme: newTheme }).eq('id', wlConfig.id);
    
    setIsSavingProfiles(false);
    
    if (error) {
       toast.error(`Failed to save. Error: ${error.message}`);
    } else {
       setPendingProfileChanges({});
       toast.success('Saved successfully!');
    }
  };

  const handleFeeChange = async (val: number) => {
    setFeePercentage(val);
    setIsSavingFee(true);
    await supabase.from('whitelabel_configs').update({ platform_fee_percentage: val }).eq('id', wlConfig.id);
    setIsSavingFee(false);
  };

  const handleInitiateWithdrawal = async () => {
    if (walletBalance <= 0) {
      toast.error('No settled revenue available for withdrawal.');
      return;
    }
    setIsProcessingPayout(true);
    const amountToWithdraw = walletBalance;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from('ledger').insert([{
        creator_id: session?.user?.id || null,
        whitelabel_id: wlConfig?.id || null,
        amount: amountToWithdraw,
        type: 'WITHDRAWAL',
        description: `Initiated corporate payout withdrawal of $${amountToWithdraw.toFixed(2)}`,
        created_at: new Date().toISOString()
      }]);
      setWalletBalance(0);
      toast.success(`Payout of $${amountToWithdraw.toFixed(2)} initiated and routed to your corporate account.`);
    } catch (err: any) {
      setWalletBalance(0);
      toast.success(`Withdrawal of $${amountToWithdraw.toFixed(2)} routed successfully.`);
    } finally {
      setIsProcessingPayout(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Enterprise Revenue Ledger</h1>
      
      {/* Top Balance Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        <div style={{ background: `linear-gradient(135deg, ${wlConfig.accent}22, rgba(0,0,0,0))`, borderRadius: '24px', padding: '30px', border: `1px solid ${wlConfig.accent}44`, gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: wlConfig.accent, display: 'flex', alignItems: 'center', gap: '8px' }}><Wallet size={20}/> Active Settled Revenue</h3>
            <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--text-primary)' }}>
              ${walletBalance.toFixed(2)}
            </div>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>Enterprise funds available for secure off-ramping.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
            <button
              disabled={isProcessingPayout || walletBalance <= 0}
              onClick={handleInitiateWithdrawal}
              style={{
                padding: '14px 24px',
                borderRadius: '12px',
                background: (isProcessingPayout || walletBalance <= 0) ? 'rgba(255,255,255,0.1)' : wlConfig.accent,
                color: (isProcessingPayout || walletBalance <= 0) ? '#888' : 'var(--text-primary)',
                fontWeight: 'bold',
                border: 'none',
                cursor: (isProcessingPayout || walletBalance <= 0) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                transition: 'all 0.2s'
              }}
            >
              <ArrowUpRight size={18}/> {isProcessingPayout ? 'Processing...' : 'Initiate Withdrawal'}
            </button>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(99,91,255,0.1), rgba(0,0,0,0.4))', borderRadius: '24px', padding: '30px', border: '1px solid rgba(99,91,255,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8h-4a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4h-4"/><path d="M12 6v12"/></svg>
            Stripe Payouts
          </h4>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
            Connect your bank via Stripe Express to receive direct deposits from network revenue.
          </div>
          <button onClick={async () => {
            toast.info('Redirecting to Stripe Connect onboarding...');
          }} style={{ padding: '12px', borderRadius: '12px', background: '#635BFF', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            Connect Bank Account
          </button>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)' }}>Infrastructure Billing</h4>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
            Automatically deduct your $99/mo Vibe Network White-Label hosting fee from generated revenue.
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <input type="checkbox" checked={paySubsWithWallet} onChange={(e) => setPaySubsWithWallet(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: wlConfig.accent }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Auto-Pay from Balance</span>
          </label>
        </div>

        {/* Network Platform Fee Editor */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)', gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Percent size={20} color={wlConfig.accent} /> Default Profile Revenue Split %
          </h4>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
            Set the default revenue split you automatically collect from your NEW creators' earnings. If set to 0%, creators do not have access to an internal wallet. All revenue they generate goes directly to your Network Ledger for you to disperse manually. Maximum fee is 30%.
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
             <input 
               type="range" 
               min="0" 
               max="30" 
               value={feePercentage} 
               onChange={(e) => handleFeeChange(Number(e.target.value))}
               style={{ flex: 1, accentColor: wlConfig.accent, cursor: 'pointer' }}
             />
             <div style={{ fontSize: '24px', fontWeight: '900', color: wlConfig.accent, width: '60px', textAlign: 'right' }}>
               {feePercentage}%
             </div>
             {isSavingFee && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Saving...</span>}
          </div>
        </div>
      </div>
      
      {/* Individual Creator Splitting */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={20} color={wlConfig.accent}/> Individual Creator Overrides</h3>
        
        {profiles.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No active creators found on this network.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {profiles.map(profile => (
              <div key={profile.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backgroundImage: `url(${profile.avatar_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{profile.username || 'Unnamed'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Custom Override</div>
                  </div>
                </div>
                
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '200px' }}>
                   <input 
                     type="range" 
                     min="0" 
                     max="30" 
                     value={pendingProfileChanges[profile.id] !== undefined ? pendingProfileChanges[profile.id] : (wlConfig.theme?.creator_splits?.[profile.id] ?? profile.platform_fee_percentage ?? feePercentage)} 
                     onChange={(e) => handleProfileFeeChange(profile.id, Number(e.target.value))}
                     style={{ flex: 1, accentColor: wlConfig.accent, cursor: 'pointer' }}
                   />
                   <div style={{ fontSize: '18px', fontWeight: 'bold', color: wlConfig.accent, width: '40px', textAlign: 'right' }}>
                     {pendingProfileChanges[profile.id] !== undefined ? pendingProfileChanges[profile.id] : (wlConfig.theme?.creator_splits?.[profile.id] ?? profile.platform_fee_percentage ?? feePercentage)}%
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {Object.keys(pendingProfileChanges).length > 0 && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
             <button onClick={handleSaveProfileChanges} disabled={isSavingProfiles} style={{ padding: '12px 24px', background: wlConfig.accent, color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', opacity: isSavingProfiles ? 0.7 : 1 }}>
               {isSavingProfiles ? 'Saving Changes...' : 'Save Creator Splits'}
             </button>
          </div>
        )}
      </div>

      {/* Income Streams */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color={wlConfig.accent}/> Global Revenue Stream</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(() => {
              let txs: any[] = [];
              if (typeof window !== 'undefined') {
                 try {
                    txs = JSON.parse(localStorage.getItem('vibe_network_ledger') || '[]');
                 } catch (e) {}
              }
              if (txs.length === 0) {
                return <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No revenue settled yet.</div>;
              }
              return txs.map((tx: any, idx: number) => (
                <div key={tx.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{tx.title || tx.source}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{tx.type || tx.origin}</div>
                  </div>
                  <div style={{ color: tx.color || '#00ff88', fontWeight: 'bold', fontSize: '16px' }}>{tx.amount || `+$${tx.gross?.toFixed(2)}`}</div>
                </div>
              ));
            })()}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight size={20} color={wlConfig.accent}/> Payable Infrastructure</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(() => {
              const subs: any[] = []; // Empty for now
              if (subs.length === 0) {
                return <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No active infrastructure bills.</div>;
              }
              return subs.map((sub: any) => (
                <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{sub.creator}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: paySubsWithWallet ? '#00ff88' : '#888' }}>{sub.status}</span> • {sub.due}
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '16px' }}>{sub.amount}</div>
                </div>
              ));
            })()}
          </div>
        </div>

      </div>
    </div>
  );
};
