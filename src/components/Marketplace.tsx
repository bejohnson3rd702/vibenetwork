import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { ShoppingBag, Search, Filter, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchMarketplace = async () => {
      setLoading(true);
      // Fetch products, joining with the profile so we can filter by whitelabel_id
      const query = supabase
        .from('products')
        .select('*, creator:profiles!inner(username, avatar_url, whitelabel_id)');

      // If wlConfig exists and is not vibenetwork.tv, filter by tenant ID
      if (wlConfig?.domain && wlConfig.domain !== 'vibenetwork.tv') {
        query.eq('creator.whitelabel_id', wlConfig.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchMarketplace();
  }, [wlConfig]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.creator?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || p.type === activeFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '100px', paddingBottom: '80px', color: '#fff' }}>
      {/* Marketplace Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px', padding: '0 20px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', marginBottom: '16px', border: `1px solid ${wlConfig?.accent || 'var(--accent-primary)'}44` }}>
             <ShoppingBag size={16} color={wlConfig?.accent || 'var(--accent-primary)'} />
             <span style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', color: wlConfig?.accent || 'var(--accent-primary)', textTransform: 'uppercase' }}>Network Marketplace</span>
          </div>
          <h1 style={{ fontSize: '48px', margin: '0 0 16px 0', fontWeight: 900 }}>Discover & Collect</h1>
          <p style={{ color: '#aaa', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Support creators directly. Purchase exclusive digital downloads, physical merch, beats, and premium courses.
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5%' }}>
        
        {/* Search & Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
           <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
             <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
               <Search size={20} color="#888" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
               <input 
                 type="text" 
                 placeholder="Search products, beats, creators..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 16px 16px 48px', borderRadius: '16px', color: '#fff', fontSize: '16px', outline: 'none' }}
               />
             </div>
             <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {['All', 'Digital', 'Physical', 'Beat'].map(filter => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    style={{ 
                      padding: '12px 24px', 
                      background: activeFilter === filter ? (wlConfig?.accent || 'var(--accent-primary)') : 'rgba(255,255,255,0.05)', 
                      color: activeFilter === filter ? '#000' : '#fff', 
                      border: 'none', 
                      borderRadius: '12px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                  >
                    {filter}
                  </button>
                ))}
             </div>
           </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#888' }}>Loading marketplace...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <ShoppingBag size={48} color="#444" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>No Products Found</h3>
            <p style={{ color: '#888' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {filteredProducts.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '20px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 10px 30px rgba(0,0,0,0.5)`;
                  e.currentTarget.style.borderColor = `rgba(255,255,255,0.1)`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = `rgba(255,255,255,0.05)`;
                }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Product Image */}
                <div style={{ width: '100%', aspectRatio: '1/1', background: '#111', position: 'relative', overflow: 'hidden' }}>
                   {product.image_url ? (
                     <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   ) : (
                     <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)' }}>
                       <ShoppingBag size={48} color="#333" />
                     </div>
                   )}
                   <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: wlConfig?.accent || 'var(--accent-primary)', border: `1px solid ${wlConfig?.accent || 'var(--accent-primary)'}44` }}>
                     {product.type}
                   </div>
                </div>

                {/* Product Info */}
                <div style={{ padding: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                     <img 
                       src={product.creator?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.creator?.username || 'C')}&background=random`} 
                       alt={product.creator?.username} 
                       style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} 
                     />
                     <span style={{ color: '#aaa', fontSize: '14px', fontWeight: 500 }}>@{product.creator?.username}</span>
                   </div>
                   
                   <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '48px' }}>
                     {product.title}
                   </h3>

                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>
                        ${Number(product.price).toFixed(2)}
                      </div>
                      <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: wlConfig?.accent || 'var(--accent-primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#000' }}>
                        <ShoppingCart size={18} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
