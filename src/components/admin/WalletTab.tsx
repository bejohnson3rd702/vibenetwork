import { useState } from 'react';
import { Wallet, ArrowUpRight, Activity, Percent } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export const WalletTab = ({ wlConfig }: { wlConfig: any }) => {
  const [walletBalance, setWalletBalance] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('vibe_network_wallet') || 10500.00) : 10500.00));
  const [paySubsWithWallet, setPaySubsWithWallet] = useState(true);
  const [feePercentage, setFeePercentage] = useState(wlConfig.platform_fee_percentage || 0);
  const [isSavingFee, setIsSavingFee] = useState(false);

  const handleFeeChange = async (val: number) => {
    setFeePercentage(val);
    setIsSavingFee(true);
    await supabase.from('whitelabel_configs').update({ platform_fee_percentage: val }).eq('id', wlConfig.id);
    setIsSavingFee(false);
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
            <button style={{ padding: '14px 24px', borderRadius: '12px', background: wlConfig.accent, color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', transition: 'all 0.2s' }} onClick={() => { alert('Funds securely routed to your connected corporate account.'); setWalletBalance(0); localStorage.setItem('vibe_network_wallet', '0'); }}>
              <ArrowUpRight size={18}/> Initiate Withdrawal
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
            alert('Redirecting to Stripe Connect onboarding...');
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
            <Percent size={20} color={wlConfig.accent} /> Network Platform Fee
          </h4>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
            Set the revenue split you automatically collect from your creators' earnings. If set to 0%, the wallet features are completely disabled/hidden on their profiles, making your platform completely free for them to use. Maximum fee is 30%.
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

      {/* Income Streams */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color={wlConfig.accent}/> Global Revenue Stream</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(() => {
              const txs: any[] = []; // Empty for now, fetch from ledger DB later
              if (txs.length === 0) {
                return <div style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No revenue settled yet.</div>;
              }
              return txs.map((tx: any) => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{tx.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{tx.type}</div>
                  </div>
                  <div style={{ color: tx.color, fontWeight: 'bold', fontSize: '16px' }}>{tx.amount}</div>
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
