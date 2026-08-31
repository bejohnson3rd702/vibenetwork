import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { ShoppingBag, Search, Filter, ShoppingCart, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AVO_COLLECTIONS = [
  { handle: 'baylor', label: 'Baylor', wlId: 'e86c5900-0d27-420b-98f7-922213540ec2', color: '#154734' },
  { handle: 'colorado', label: 'Colorado', wlId: 'd0fd9b57-d8af-474b-a011-aa8babeadb34', color: '#CFB87C' },
  { handle: 'georgia', label: 'Georgia', wlId: '83b21eac-0f37-4b66-b7e0-1320105e82f1', color: '#BA0C2F' },
  { handle: 'mississippi-state', label: 'Mississippi State', wlId: 'b7f74446-403b-4f9b-8be1-1bd2df35df54', color: '#660000' },
  { handle: 'ole-miss', label: 'Ole Miss', wlId: 'eb2428a2-87e2-46ed-b7c5-c1f5e6c4cf1b', color: '#CE1126' },
  { handle: 'vanderbilt', label: 'Vanderbilt', wlId: '6b797710-bec0-4887-8336-d1eaf76cd307', color: '#866D4B' },
  { handle: 'penn-state', label: 'Penn State', wlId: '16e37654-6a62-490c-bb55-aee61558eee4', color: '#041E42' },
  { handle: 'avo-x-bama', label: 'Alabama', wlId: 'be124de3-82be-4017-b6d0-58b0132f5550', color: '#9E1B32' }
];

const Marketplace: React.FC = () => {
  const { wlConfig } = useWhiteLabel();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedNetwork, setSelectedNetwork] = useState('All');
  const [networksMap, setNetworksMap] = useState<Record<string, { name: string; parentId: string | null; parentName: string }>>({});
  const [selectedShopifyProduct, setSelectedShopifyProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMasterPlatform = !wlConfig || wlConfig.id === 'master' || wlConfig.domain === 'vibenetwork.tv' || wlConfig.domain === 'vibenetwork.com' || wlConfig.domain?.includes('vercel.app');
  const isBonaireTenant = wlConfig?.id === 'b0ea0000-c08f-4260-8540-a0cc8bed4e11' || wlConfig?.parent_network_id === 'b0ea0000-c08f-4260-8540-a0cc8bed4e11';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const net = params.get('network');
    if (net) {
      const netLower = net.toLowerCase();
      if (netLower.includes('olympia') || netLower.includes('mr. olympia') || netLower.includes('muscle') || netLower.includes('fitness')) {
        setSelectedNetwork('Muscle & Fitness');
      } else if (netLower.includes('avo')) {
        setSelectedNetwork('AVO');
      } else if (netLower.includes('b2k')) {
        setSelectedNetwork('B2K');
      } else if (netLower.includes('revival') || netLower.includes('kple')) {
        setSelectedNetwork('Christian Revival Network');
      }
    }
  }, []);

  useEffect(() => {
    const fetchMarketplace = async () => {
      setLoading(true);
      // Fetch products, joining with the profile so we can filter by whitelabel_id
      const query = supabase
        .from('products')
        .select('*, creator:profiles!inner(username, avatar_url, whitelabel_id)');

      if (wlConfig?.domain && !isMasterPlatform) {
        const parentId = wlConfig.parent_network_id || wlConfig.id;
        const { data: children } = await supabase
          .from('whitelabel_configs')
          .select('id')
          .eq('parent_network_id', parentId);
        
        const tenantIds = [parentId];
        if (children && children.length > 0) {
          tenantIds.push(...children.map((c: any) => c.id));
        }
        query.in('creator.whitelabel_id', tenantIds);
      }

      const fetchAvoShopify = async () => {
        if (!isMasterPlatform) return [];
        const all: any[] = [];
        await Promise.all(
          AVO_COLLECTIONS.map(async (col) => {
            try {
              const isBama = col.handle === 'avo-x-bama';
              const url = isBama
                ? `/api/bama/api/v1/shopify/products?status=active&limit=10&vendor=AVO`
                : `/api/shop/collections/${col.handle}/products.json?limit=10`;
              
              const headers: Record<string, string> = {};
              if (isBama) {
                headers['x-tenant-subdomain'] = 'alabama';
              }

              const res = await fetch(url, { headers });
              if (!res.ok) return;
              const data = await res.json();
              
              if (isBama) {
                for (const p of (data.data || [])) {
                  const numericId = parseInt(p.id?.split('/').pop() || '0') || Math.floor(Math.random() * 1000000);
                  all.push({
                    id: `avo-shopify-${numericId}`,
                    title: p.title,
                    price: parseFloat(p.priceRangeV2?.minVariantPrice?.amount || '0'),
                    type: 'physical',
                    image_url: p.images?.[0]?.src || '',
                    images: (p.images || []).map((img: any) => img.src),
                    creator: {
                      username: col.label,
                      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(col.label)}&background=000&color=fff`,
                      whitelabel_id: col.wlId
                    },
                    isShopify: true,
                    handle: p.handle,
                    schoolHandle: col.handle,
                    schoolName: col.label,
                    schoolColor: col.color,
                    vendor: p.vendor || 'AVO'
                  });
                }
              } else {
                for (const p of (data.products || [])) {
                  all.push({
                    id: `avo-shopify-${p.id}`,
                    title: p.title,
                    price: parseFloat(p.variants?.[0]?.price || '0'),
                    comparePrice: p.variants?.[0]?.compare_at_price || '',
                    type: 'physical',
                    image_url: p.images?.[0]?.src || '',
                    images: (p.images || []).map((img: any) => img.src),
                    creator: {
                      username: col.label,
                      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(col.label)}&background=000&color=fff`,
                      whitelabel_id: col.wlId
                    },
                    isShopify: true,
                    handle: p.handle,
                    schoolHandle: col.handle,
                    schoolName: col.label,
                    schoolColor: col.color,
                    vendor: p.vendor || 'AVO'
                  });
                }
              }
            } catch (e) {
              console.error("Failed to fetch AVO Shopify products for", col.handle, e);
            }
          })
        );
        return all;
      };

      const [productsRes, wlConfigsRes, avoShopifyProducts] = await Promise.all([
        query.order('created_at', { ascending: false }),
        isMasterPlatform ? supabase.from('whitelabel_configs').select('id, name, parent_network_id') : Promise.resolve({ data: null, error: null }),
        fetchAvoShopify()
      ]);
      
      let mergedProducts = productsRes.data || [];
      if (avoShopifyProducts && avoShopifyProducts.length > 0) {
        mergedProducts = [...mergedProducts, ...avoShopifyProducts];
      }
      setProducts(mergedProducts);

      if (isMasterPlatform && wlConfigsRes.data) {
        const wlMap: Record<string, { name: string; parentId: string | null; parentName: string }> = {};
        wlConfigsRes.data.forEach((wl: any) => {
          // Normalize KPLE TV to Christian Revival Network
          const isKple = wl.id === '33742e2f-430b-4c2d-9cba-42507891ef02' || wl.name === 'KPLE TV';
          const resolvedName = isKple ? 'Christian Revival Network' : wl.name;
          wlMap[wl.id] = {
            name: resolvedName,
            parentId: wl.parent_network_id,
            parentName: resolvedName
          };
        });
        wlConfigsRes.data.forEach((wl: any) => {
          if (wl.parent_network_id && wlMap[wl.parent_network_id]) {
            wlMap[wl.id].parentName = wlMap[wl.parent_network_id].name;
          }
        });
        setNetworksMap(wlMap);
      }

      setLoading(false);
    };

    fetchMarketplace();
  }, [wlConfig]);

  const filteredProducts = React.useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.creator?.username?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || p.type === activeFilter.toLowerCase();
      
      let matchesNetwork = true;
      if (isMasterPlatform) {
        const pWlId = p.creator?.whitelabel_id;
        const wlInfo = pWlId ? networksMap[pWlId] : null;
        const parentName = wlInfo ? (wlInfo.parentName || wlInfo.name) : '';
        const parentNameLower = parentName.toLowerCase();

        const isAvo = parentNameLower.includes('avo');
        const isOlympia = parentNameLower.includes('olympia') || parentNameLower.includes('muscle') || parentNameLower.includes('fitness');

        // Exclude anything that is NOT AVO and NOT Mr. Olympia
        if (!isAvo && !isOlympia) {
          return false;
        }

        if (selectedNetwork !== 'All') {
          if (selectedNetwork === 'AVO') {
            matchesNetwork = isAvo;
          } else if (selectedNetwork === 'Muscle & Fitness') {
            matchesNetwork = isOlympia;
          } else {
            matchesNetwork = false;
          }
        }
      }

      return matchesSearch && matchesFilter && matchesNetwork;
    });
  }, [products, searchQuery, activeFilter, selectedNetwork, networksMap, isMasterPlatform]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '100px', paddingBottom: '80px', color: 'var(--text-primary)' }}>
      {/* Marketplace Header */}
      <div style={{ textAlign: 'center', marginBottom: '60px', padding: '0 20px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', marginBottom: '16px', border: `1px solid ${wlConfig?.accent || 'var(--accent-primary)'}44` }}>
             <ShoppingBag size={16} color={wlConfig?.accent || 'var(--accent-primary)'} />
             <span style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', color: wlConfig?.accent || 'var(--accent-primary)', textTransform: 'uppercase' }}>
               {isBonaireTenant ? "Bonaire Chamber Marketplace" : "Network Marketplace"}
             </span>
          </div>
          <h1 style={{ fontSize: '48px', margin: '0 0 16px 0', fontWeight: 900 }}>
            {isBonaireTenant ? "Support Local Bonaire Merchants" : "Discover & Collect"}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            {isBonaireTenant 
              ? "Discover premium handcrafted sea salts, authentic Caribbean diving gear, guided mangrove snorkeling tickets, and authentic cactus spirits."
              : "Support creators directly. Purchase exclusive digital downloads, physical merch, beats, and premium courses."}
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
                 style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 16px 16px 48px', borderRadius: '16px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
               />
             </div>
           </div>

           {isMasterPlatform && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
               <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-secondary)' }}>
                 Filter by Network
               </span>
               <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                 {['All', 'AVO', 'Muscle & Fitness'].map(net => (
                   <button
                     key={net}
                     onClick={() => setSelectedNetwork(net)}
                     style={{
                       padding: '10px 20px',
                       background: selectedNetwork === net ? (wlConfig?.accent || 'var(--accent-primary)') : 'rgba(255,255,255,0.05)',
                       color: selectedNetwork === net ? '#000' : 'var(--text-primary)',
                       border: 'none',
                       borderRadius: '10px',
                       fontWeight: 'bold',
                       fontSize: '13px',
                       cursor: 'pointer',
                       whiteSpace: 'nowrap',
                       transition: 'all 0.2s',
                       boxShadow: selectedNetwork === net ? `0 0 12px ${(wlConfig?.accent || 'var(--accent-primary)')}44` : 'none',
                     }}
                     onMouseOver={(e) => {
                       if (selectedNetwork !== net) {
                         e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                         e.currentTarget.style.color = 'var(--text-primary)';
                       }
                     }}
                     onMouseOut={(e) => {
                       if (selectedNetwork !== net) {
                         e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                         e.currentTarget.style.color = 'var(--text-primary)';
                       }
                     }}
                   >
                     {net}
                   </button>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>Loading marketplace...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <ShoppingBag size={48} color="#444" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>No Products Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="vibe-product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: isMobile ? '12px' : '28px' }}>
            {filteredProducts.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: isMobile ? '14px' : '20px', 
                  overflow: 'hidden', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  display: 'flex',
                  flexDirection: 'column'
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
                onClick={() => {
                  if (product.isShopify) {
                    setSelectedShopifyProduct(product);
                    setSelectedImage(0);
                  } else {
                    navigate(`/product/${product.id}${window.location.search}`);
                  }
                }}
              >
                <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {product.image_url ? (
                     <img src={product.image_url} alt={product.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                   ) : (
                     <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)' }}>
                       <ShoppingBag size={isMobile ? 32 : 48} color="#333" />
                     </div>
                   )}
                   <div style={{ 
                     position: 'absolute', 
                     top: isMobile ? 8 : 14, 
                     right: isMobile ? 8 : 14, 
                     background: 'rgba(0,0,0,0.8)', 
                     backdropFilter: 'blur(10px)', 
                     padding: isMobile ? '3px 8px' : '6px 12px', 
                     borderRadius: '20px', 
                     fontSize: isMobile ? '10px' : '12px', 
                     fontWeight: 'bold', 
                     textTransform: 'uppercase', 
                     color: product.isShopify ? (product.schoolColor || 'var(--accent-primary)') : (wlConfig?.accent || 'var(--accent-primary)'), 
                     border: `1px solid ${product.isShopify ? (product.schoolColor || 'var(--accent-primary)') : (wlConfig?.accent || 'var(--accent-primary)')}44` 
                   }}>
                     {product.isShopify ? product.schoolName : product.type}
                   </div>
                </div>

                {/* Product Info */}
                <div style={{ padding: isMobile ? '12px' : '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isMobile ? '8px' : '12px' }}>
                     <img 
                       src={product.creator?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.creator?.username || 'C')}&background=random`} 
                       alt={product.creator?.username} 
                       loading="lazy"
                       style={{ width: isMobile ? '20px' : '26px', height: isMobile ? '20px' : '26px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} 
                     />
                     <span style={{ color: 'var(--text-secondary)', fontSize: isMobile ? '11px' : '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                       @{product.creator?.username}
                     </span>
                   </div>
                   
                   <h3 style={{ 
                     margin: '0 0 10px 0', 
                     fontSize: isMobile ? '14px' : '18px', 
                     fontWeight: 'bold', 
                     display: '-webkit-box', 
                     WebkitLineClamp: 2, 
                     WebkitBoxOrient: 'vertical', 
                     overflow: 'hidden', 
                     minHeight: isMobile ? '36px' : '44px',
                     lineHeight: 1.3
                   }}>
                     {product.title}
                   </h3>

                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: isMobile ? '8px' : '14px', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
                      <div style={{ fontSize: isMobile ? '16px' : '22px', fontWeight: 900, color: 'var(--text-primary)' }}>
                        ${Number(product.price).toFixed(2)}
                      </div>
                      <button 
                        style={{ 
                          width: isMobile ? '32px' : '38px', 
                          height: isMobile ? '32px' : '38px', 
                          borderRadius: '50%', 
                          background: wlConfig?.accent || 'var(--accent-primary)', 
                          border: 'none', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          cursor: 'pointer', 
                          color: '#000' 
                        }}
                      >
                        <ShoppingCart size={isMobile ? 14 : 16} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ Shopify Product Detail Overlay ═══ */}
      <AnimatePresence>
        {selectedShopifyProduct && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedShopifyProduct(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              padding: isMobile ? '16px' : '40px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '900px', maxHeight: '90vh',
                borderRadius: '16px', overflow: 'hidden',
                background: '#111', border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                position: 'relative',
                overflowY: 'auto'
              }}
            >
              {/* Close */}
              <button onClick={() => setSelectedShopifyProduct(null)} style={{
                position: 'absolute', top: '14px', right: '14px', zIndex: 10,
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={16} />
              </button>

              {/* Image gallery */}
              <div style={{ flex: isMobile ? 'none' : '0 0 50%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '16px' : '30px', minHeight: isMobile ? '240px' : '350px' }}>
                  <img
                    src={(selectedShopifyProduct.images && selectedShopifyProduct.images[selectedImage]) || selectedShopifyProduct.image_url}
                    alt={selectedShopifyProduct.title}
                    style={{ maxWidth: '100%', maxHeight: isMobile ? '220px' : '400px', objectFit: 'contain' }}
                  />
                </div>
                {selectedShopifyProduct.images && selectedShopifyProduct.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '6px', padding: '10px 16px', overflowX: 'auto', justifyContent: 'center' }}>
                    {selectedShopifyProduct.images.slice(0, 5).map((img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        onClick={() => setSelectedImage(i)}
                        style={{
                          width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px',
                          border: selectedImage === i ? `2px solid ${wlConfig?.accent || 'var(--accent-primary)'}` : '2px solid #eee',
                          cursor: 'pointer', background: '#fff', padding: '3px',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product details */}
              <div style={{ flex: isMobile ? 'none' : '0 0 50%', padding: isMobile ? '24px 20px' : '40px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 900,
                  background: selectedShopifyProduct.schoolColor || 'var(--accent-primary)', color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', alignSelf: 'flex-start',
                }}>
                  {selectedShopifyProduct.schoolName || 'AVO'}
                </span>

                <h2 style={{ margin: '0 0 16px 0', fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                  {selectedShopifyProduct.title}
                </h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#fff' }}>${selectedShopifyProduct.price}</span>
                  {selectedShopifyProduct.comparePrice && parseFloat(selectedShopifyProduct.comparePrice) > parseFloat(selectedShopifyProduct.price) && (
                    <span style={{ fontSize: '16px', color: '#666', textDecoration: 'line-through' }}>${selectedShopifyProduct.comparePrice}</span>
                  )}
                </div>

                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '20px' }}>
                  Premium quality apparel by {selectedShopifyProduct.vendor || 'AVO'}. Designed for the {selectedShopifyProduct.schoolName || 'AVO'} community — perfect for game days, campus life, and everyday wear.
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Brand</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{selectedShopifyProduct.vendor || 'AVO'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Collection</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{selectedShopifyProduct.schoolName || 'AVO'}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href={selectedShopifyProduct.schoolHandle === 'avo-x-bama'
                      ? `https://store.yea-alabama.com/products/${selectedShopifyProduct.handle}`
                      : `https://shopavo.la/products/${selectedShopifyProduct.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '15px', fontSize: '12px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '2px',
                      background: '#fff', color: '#000', textDecoration: 'none',
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = wlConfig?.accent || 'var(--accent-primary)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                  >
                    <ShoppingBag size={14} /> Buy on {selectedShopifyProduct.schoolHandle === 'avo-x-bama' ? 'yea-alabama.com' : 'shopavo.la'}
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(Marketplace);
