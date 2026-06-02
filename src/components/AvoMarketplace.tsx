import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ExternalLink } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  handle: string;
  price: string;
  comparePrice: string;
  image: string;
  images: string[];
  school: string;
  collection: string;
  vendor: string;
}

const COLLECTIONS = [
  { handle: 'baylor', label: 'Baylor', color: '#154734' },
  { handle: 'colorado', label: 'Colorado', color: '#CFB87C' },
  { handle: 'georgia', label: 'Georgia', color: '#BA0C2F' },
  { handle: 'mississippi-state', label: 'Mississippi State', color: '#660000' },
  { handle: 'ole-miss', label: 'Ole Miss', color: '#CE1126' },
  { handle: 'vanderbilt', label: 'Vanderbilt', color: '#866D4B' },
  { handle: 'penn-state', label: 'Penn State', color: '#041E42' },
];

export default function AvoMarketplace({ accent = '#D35400' }: { accent?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      const all: Product[] = [];

      await Promise.all(
        COLLECTIONS.map(async (col) => {
          try {
            const res = await fetch(`/api/shop/collections/${col.handle}/products.json?limit=10`);
            if (!res.ok) return;
            const data = await res.json();
            for (const p of (data.products || [])) {
              all.push({
                id: p.id,
                title: p.title,
                handle: p.handle,
                price: p.variants?.[0]?.price || '0',
                comparePrice: p.variants?.[0]?.compare_at_price || '',
                image: p.images?.[0]?.src || '',
                images: (p.images || []).map((img: any) => img.src),
                school: col.label,
                collection: col.handle,
                vendor: p.vendor || 'AVO',
              });
            }
          } catch { /* skip failed collection */ }
        })
      );

      // Shuffle for variety
      const shuffled = all.sort(() => Math.random() - 0.5);
      setProducts(shuffled);
      setLoading(false);
    };

    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedProduct) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  const filtered = filter === 'all' ? products : products.filter(p => p.collection === filter);
  const displayed = filtered.slice(0, 10);

  const schoolColor = (collection: string) =>
    COLLECTIONS.find(c => c.handle === collection)?.color || accent;

  if (loading) {
    return (
      <div id="marketplace" style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <ShoppingBag size={24} color={accent} />
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>Shop</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ borderRadius: '8px', background: 'rgba(255,255,255,0.03)', aspectRatio: '3/4', animation: 'avoPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        <style>{`@keyframes avoPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.08; } }`}</style>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <>
      <div id="marketplace" style={{ padding: '80px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${accent}, #000)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingBag size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px', color: '#fff' }}>Shop All Programs</h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>{products.length} items across {COLLECTIONS.length} schools</p>
            </div>
          </div>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('all')} style={{
              padding: '7px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
              border: filter === 'all' ? `1.5px solid ${accent}` : '1.5px solid rgba(255,255,255,0.06)',
              background: filter === 'all' ? `${accent}18` : 'transparent',
              color: filter === 'all' ? accent : 'rgba(255,255,255,0.4)', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.2s',
            }}>All</button>
            {COLLECTIONS.map(col => (
              <button key={col.handle} onClick={() => setFilter(col.handle)} style={{
                padding: '7px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                border: filter === col.handle ? `1.5px solid ${col.color}` : '1.5px solid rgba(255,255,255,0.06)',
                background: filter === col.handle ? `${col.color}22` : 'transparent',
                color: filter === col.handle ? col.color : 'rgba(255,255,255,0.4)', cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.2s',
              }}>{col.label}</button>
            ))}
          </div>
        </div>

        {/* Product Grid — 5 per row on desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
          {displayed.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              onClick={() => { setSelectedProduct(product); setSelectedImage(0); }}
              style={{
                borderRadius: '6px', overflow: 'hidden', cursor: 'pointer',
                background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.04)',
                transition: 'all 0.25s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Product Image */}
              <div style={{ width: '100%', aspectRatio: '3/4', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <img src={product.image} alt={product.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px', transition: 'transform 0.4s' }}
                  onMouseOver={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.06)'; }}
                  onMouseOut={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
                {/* School badge */}
                <span style={{
                  position: 'absolute', top: '8px', left: '8px',
                  padding: '3px 8px', borderRadius: '3px', fontSize: '8px', fontWeight: 900,
                  background: schoolColor(product.collection), color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  {product.school}
                </span>
                {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
                  <span style={{
                    position: 'absolute', top: '8px', right: '8px',
                    padding: '3px 6px', borderRadius: '3px', fontSize: '8px', fontWeight: 900,
                    background: '#ff3b30', color: '#fff',
                  }}>
                    SALE
                  </span>
                )}
              </div>
              {/* Product Info */}
              <div style={{ padding: '12px 14px 16px' }}>
                <p style={{
                  margin: '0 0 6px 0', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.35, height: '32px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {product.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>${product.price}</span>
                  {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>${product.comparePrice}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a
            href="https://shopavo.la"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 40px', fontSize: '11px', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '2.5px',
              background: 'transparent', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.15)', textDecoration: 'none',
              transition: 'all 0.25s',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
          >
            View All on shopavo.la <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* ═══ Product Detail Overlay ═══ */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '900px', maxHeight: '85vh',
                borderRadius: '16px', overflow: 'hidden',
                background: '#111', border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', position: 'relative',
              }}
            >
              {/* Close */}
              <button onClick={() => setSelectedProduct(null)} style={{
                position: 'absolute', top: '16px', right: '16px', zIndex: 10,
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={16} />
              </button>

              {/* Image gallery */}
              <div style={{ flex: '0 0 50%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', minHeight: '350px' }}>
                  <img
                    src={selectedProduct.images[selectedImage] || selectedProduct.image}
                    alt={selectedProduct.title}
                    style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                  />
                </div>
                {selectedProduct.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '6px', padding: '10px 20px 16px', overflowX: 'auto', justifyContent: 'center' }}>
                    {selectedProduct.images.slice(0, 5).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        onClick={() => setSelectedImage(i)}
                        style={{
                          width: '56px', height: '56px', objectFit: 'contain', borderRadius: '6px',
                          border: selectedImage === i ? `2px solid ${accent}` : '2px solid #eee',
                          cursor: 'pointer', background: '#fff', padding: '4px',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product details */}
              <div style={{ flex: '0 0 50%', padding: '40px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  display: 'inline-block', padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 900,
                  background: schoolColor(selectedProduct.collection), color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', alignSelf: 'flex-start',
                }}>
                  {selectedProduct.school}
                </span>

                <h2 style={{ margin: '0 0 16px 0', fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                  {selectedProduct.title}
                </h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#fff' }}>${selectedProduct.price}</span>
                  {selectedProduct.comparePrice && parseFloat(selectedProduct.comparePrice) > parseFloat(selectedProduct.price) && (
                    <span style={{ fontSize: '16px', color: '#666', textDecoration: 'line-through' }}>${selectedProduct.comparePrice}</span>
                  )}
                </div>

                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '20px' }}>
                  Premium quality apparel by {selectedProduct.vendor}. Designed for the {selectedProduct.school} community — perfect for game days, campus life, and everyday wear.
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Brand</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{selectedProduct.vendor}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Collection</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{selectedProduct.school}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a
                    href={`https://shopavo.la/products/${selectedProduct.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '15px', fontSize: '12px', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '2px',
                      background: '#fff', color: '#000', textDecoration: 'none',
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
                  >
                    <ShoppingBag size={14} /> Buy on shopavo.la
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
