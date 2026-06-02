import { useState, useEffect } from 'react';
import { ShoppingBag, ExternalLink, Tag } from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  images: { src: string }[];
  variants: { price: string; available: boolean }[];
  product_type: string;
  tags: string[];
}

export default function ShopifyStore() {
  const { wlConfig } = useWhiteLabel();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const shopifyUrl = wlConfig?.theme?.shopifyUrl || wlConfig?.shopifyUrl || '';
  const accent = wlConfig?.accent || '#D35400';

  useEffect(() => {
    if (!shopifyUrl) { setLoading(false); return; }

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        // Shopify public JSON API: /collections/{handle}/products.json
        // For /pages/ URLs, we try /products.json with tag filter
        let jsonUrl = '';
        if (shopifyUrl.includes('/collections/')) {
          jsonUrl = shopifyUrl.replace(/\/$/, '') + '/products.json';
        } else if (shopifyUrl.includes('/pages/')) {
          // For pages like avo-x-bama, try the main products endpoint with tag
          const slug = shopifyUrl.split('/pages/')[1]?.replace(/\/$/, '');
          jsonUrl = `https://shopavo.la/products.json?tag=${slug}`;
        }

        if (!jsonUrl) { setLoading(false); return; }

        const res = await fetch(jsonUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err: any) {
        console.error('Shopify fetch error:', err);
        setError('Could not load products');
      }
      setLoading(false);
    };

    fetchProducts();
  }, [shopifyUrl]);

  // Build the product link back to Shopify
  const getProductUrl = (product: ShopifyProduct) => {
    const storeDomain = shopifyUrl.split('/collections/')[0] || shopifyUrl.split('/pages/')[0] || 'https://shopavo.la';
    return `${storeDomain}/products/${product.handle}`;
  };

  const getPrice = (product: ShopifyProduct) => {
    if (!product.variants?.length) return null;
    const prices = product.variants.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
    if (prices.length === 0) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} – $${max.toFixed(2)}`;
  };

  const isAvailable = (product: ShopifyProduct) => {
    return product.variants?.some(v => v.available);
  };

  if (!shopifyUrl) return null;

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '60px 40px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ShoppingBag size={28} color={accent} />
          <h2 style={{ margin: 0, fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>
            Official Store
          </h2>
        </div>
        <a
          href={shopifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', background: `${accent}15`, color: accent,
            border: `1px solid ${accent}33`, borderRadius: '12px',
            fontWeight: 700, fontSize: '13px', textDecoration: 'none',
            textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.background = `${accent}25`; }}
          onMouseOut={e => { e.currentTarget.style.background = `${accent}15`; }}
        >
          Visit Full Store <ExternalLink size={14} />
        </a>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div style={{ width: '40px', height: '40px', border: `3px solid ${accent}33`, borderTop: `3px solid ${accent}`, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          Loading products...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          {error}
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {products.map(product => (
            <a
              key={product.id}
              href={getProductUrl(product)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '20px',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${accent}22`;
                e.currentTarget.style.borderColor = `${accent}44`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {/* Product Image */}
              <div style={{
                width: '100%',
                aspectRatio: '1/1',
                background: '#111',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {product.images?.[0]?.src ? (
                  <img
                    src={product.images[0].src}
                    alt={product.title}
                    loading="lazy"
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <ShoppingBag size={40} />
                  </div>
                )}

                {/* Availability Badge */}
                {!isAvailable(product) && (
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'rgba(255,59,48,0.9)', color: '#fff',
                    padding: '4px 12px', borderRadius: '20px',
                    fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'
                  }}>
                    Sold Out
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700,
                  lineHeight: 1.4, color: 'var(--text-primary)',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '18px', fontWeight: 900, color: accent
                  }}>
                    {getPrice(product) || 'Price TBD'}
                  </span>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', background: `${accent}12`,
                    borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                    color: accent, textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    <Tag size={12} /> Shop Now
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <p>No products available yet.</p>
        </div>
      )}
    </div>
  );
}
