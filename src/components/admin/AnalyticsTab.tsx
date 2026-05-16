import React from 'react';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const mrrData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 5200 },
  { month: 'Mar', revenue: 7800 },
  { month: 'Apr', revenue: 9500 },
  { month: 'May', revenue: 14200 },
  { month: 'Jun', revenue: 18500 },
];

const viewershipData = [
  { day: 'Mon', viewers: 1200 },
  { day: 'Tue', viewers: 1500 },
  { day: 'Wed', viewers: 2200 },
  { day: 'Thu', viewers: 1800 },
  { day: 'Fri', viewers: 2800 },
  { day: 'Sat', viewers: 3500 },
  { day: 'Sun', viewers: 4200 },
];

export function AnalyticsTab({ wlConfig }: { wlConfig: any }) {
  const accent = wlConfig?.accent || '#0055ff';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', letterSpacing: '-1px' }}>Network Analytics</h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '16px' }}>Real-time revenue, viewership, and engagement tracking.</p>
      </div>

      {/* Top Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <MetricCard icon={<DollarSign size={24} color={accent} />} title="Monthly Recurring Revenue" value="$18,500" trend="+30% from last month" />
        <MetricCard icon={<Users size={24} color={accent} />} title="Active Subscribers" value="1,245" trend="+12% from last month" />
        <MetricCard icon={<Activity size={24} color={accent} />} title="Live Viewership (Peak)" value="4.2k" trend="+55% from last month" />
        <MetricCard icon={<TrendingUp size={24} color={accent} />} title="Conversion Rate" value="8.4%" trend="+2% from last month" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
        
        {/* MRR Growth Chart (Native CSS Bar Chart) */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <DollarSign size={20} color={accent} /> Revenue Growth (MRR)
          </h3>
          <div style={{ height: 250, width: '100%', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingTop: '20px' }}>
            {mrrData.map((d, i) => {
               const height = (d.revenue / 18500) * 100;
               return (
                 <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                       <div style={{ width: '100%', height: `${height}%`, background: `linear-gradient(to top, ${accent}33, ${accent})`, borderRadius: '4px', transition: 'height 1s ease-out' }}></div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{d.month}</span>
                 </div>
               )
            })}
          </div>
        </div>

        {/* Viewership Chart (Native CSS Bar Chart) */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Activity size={20} color={accent} /> Viewer Retention (7 Days)
          </h3>
          <div style={{ height: 250, width: '100%', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingTop: '20px' }}>
             {viewershipData.map((d, i) => {
               const height = (d.viewers / 4200) * 100;
               return (
                 <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                       <div style={{ width: '100%', height: `${height}%`, background: '#fff', borderRadius: '4px', transition: 'height 1s ease-out', opacity: 0.8 }}></div>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{d.day}</span>
                 </div>
               )
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, trend }: any) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
           {icon}
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>{title}</span>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '-1px' }}>{value}</div>
      <div style={{ color: '#00cc66', fontSize: '13px', fontWeight: 'bold' }}>{trend}</div>
    </div>
  );
}
