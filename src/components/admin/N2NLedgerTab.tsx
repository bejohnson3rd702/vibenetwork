import { useState, useEffect, useMemo } from 'react';
import { DollarSign, TrendingUp, Hash, ArrowUpDown, Calendar } from 'lucide-react';
import { getN2NLedger } from '../../lib/n2n';

export const N2NLedgerTab = ({ wlConfig }: { wlConfig: any }) => {
  const accent = wlConfig?.accent || '#D35400';

  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [monthFilter, setMonthFilter] = useState('all');

  useEffect(() => {
    if (!wlConfig?.id) return;
    const load = async () => {
      setLoading(true);
      const data = await getN2NLedger(wlConfig.id);
      setLedger(data);
      setLoading(false);
    };
    load();
  }, [wlConfig?.id]);

  const months = useMemo(() => {
    const set = new Set<string>();
    ledger.forEach(row => {
      if (row.created_at) {
        const d = new Date(row.created_at);
        set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
      }
    });
    return Array.from(set).sort().reverse();
  }, [ledger]);

  const filtered = useMemo(() => {
    let list = [...ledger];
    if (monthFilter !== 'all') {
      list = list.filter(row => {
        if (!row.created_at) return false;
        const d = new Date(row.created_at);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return ym === monthFilter;
      });
    }
    list.sort((a, b) => {
      if (sortBy === 'amount') {
        const diff = (a.amount || 0) - (b.amount || 0);
        return sortDir === 'asc' ? diff : -diff;
      }
      const diff = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      return sortDir === 'asc' ? diff : -diff;
    });
    return list;
  }, [ledger, monthFilter, sortBy, sortDir]);

  const totalRevenue = ledger.reduce((sum, r) => sum + (r.amount || 0), 0);
  const txCount = ledger.length;
  const avgTx = txCount > 0 ? totalRevenue / txCount : 0;

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  const formatCurrency = (val: number) => `$${val.toFixed(2)}`;
  const truncateId = (id: string) => id ? id.slice(0, 8) + '...' : '—';

  const statCardStyle = (gradient: string): React.CSSProperties => ({
    background: gradient,
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(255,255,255,0.06)',
    flex: 1,
    minWidth: '200px',
  });

  const inputStyle: React.CSSProperties = {
    padding: '10px 16px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  };

  const monthLabel = (ym: string) => {
    const [y, m] = ym.split('-');
    const date = new Date(Number(y), Number(m) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>
          Revenue Ledger
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>
          Aggregated transaction data across the entire network tree.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={statCardStyle(`linear-gradient(135deg, ${accent}18, rgba(0,0,0,0))`)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <DollarSign size={20} color={accent} />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Revenue</span>
          </div>
          <div style={{ fontSize: '40px', fontWeight: '900', color: 'var(--text-primary)' }}>{formatCurrency(totalRevenue)}</div>
        </div>
        <div style={statCardStyle('linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,0,0,0))')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Hash size={20} color="#00ff88" />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Transactions</span>
          </div>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#00ff88' }}>{txCount}</div>
        </div>
        <div style={statCardStyle('linear-gradient(135deg, rgba(99,91,255,0.08), rgba(0,0,0,0))')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <TrendingUp size={20} color="#635BFF" />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Transaction</span>
          </div>
          <div style={{ fontSize: '40px', fontWeight: '900', color: '#635BFF' }}>{formatCurrency(avgTx)}</div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} color="var(--text-muted)" />
          <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} style={inputStyle}>
            <option value="all">All Time</option>
            {months.map(m => (
              <option key={m} value={m}>{monthLabel(m)}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => toggleSort('date')}
            style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '6px', background: sortBy === 'date' ? `${accent}22` : 'rgba(0,0,0,0.4)', borderColor: sortBy === 'date' ? `${accent}44` : 'rgba(255,255,255,0.1)', fontWeight: sortBy === 'date' ? '700' : '400' }}
          >
            <ArrowUpDown size={14} /> Date {sortBy === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
          </button>
          <button
            onClick={() => toggleSort('amount')}
            style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '6px', background: sortBy === 'amount' ? `${accent}22` : 'rgba(0,0,0,0.4)', borderColor: sortBy === 'amount' ? `${accent}44` : 'rgba(255,255,255,0.1)', fontWeight: sortBy === 'amount' ? '700' : '400' }}
          >
            <ArrowUpDown size={14} /> Amount {sortBy === 'amount' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '30px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading ledger data...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No transactions found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Date', 'Product', 'Buyer', 'Creator', 'Amount', 'Type'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id || idx} style={{ background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {row.created_at ? new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {row.product_title || row.title || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'monospace' }}>
                      {truncateId(row.buyer_id)}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'monospace' }}>
                      {truncateId(row.creator_id)}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: '700', fontSize: '15px', color: '#00ff88' }}>
                      {formatCurrency(row.amount || 0)}
                    </td>
                    <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                        {row.type || row.transaction_type || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && (
          <div style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'right' }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}{monthFilter !== 'all' ? ` in ${monthLabel(monthFilter)}` : ''}
          </div>
        )}
      </div>
    </div>
  );
};
