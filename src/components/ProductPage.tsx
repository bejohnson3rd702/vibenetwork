import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ShieldCheck, Download, Package, Music, CreditCard } from 'lucide-react';

const ProductPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { wlConfig } = useWhiteLabel();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  
  // Physical Product Variants
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  const defaultSizes = ['S', 'M', 'L', 'XL', '2XL'];
  const defaultColors = ['Black', 'White', 'Navy', 'Red'];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, creator:profiles!inner(id, username, avatar_url)')
        .eq('id', productId)
        .single();
        
      if (data && !error) {
        setProduct(data);
        const initialSizes = data.variants?.sizes?.length ? data.variants.sizes : defaultSizes;
        const initialColors = data.variants?.colors?.length ? data.variants.colors : defaultColors;
        setSelectedSize(initialSizes[0] || '');
        setSelectedColor(initialColors[0] || '');
      } else {
        setError('Product not found or unavailable.');
      }
      setLoading(false);
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handlePurchase = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.dispatchEvent(new CustomEvent('open_auth', { detail: { isLogin: true } }));
      return;
    }

    setPurchasing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          creatorId: product.creator.id,
          amount: product.price,
          productTitle: product.title,
          returnUrl: window.location.href,
          extraMetadata: {
            product_id: product.id,
            product_type: product.type,
            ...(product.type?.toLowerCase() === 'physical' ? {
              size: selectedSize,
              color: selectedColor
            } : {})
          }
        })
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Checkout failed: ' + err.message);
    }
    setPurchasing(false);
  };

  if (loading) return <div style={{ paddingTop: '120px', textAlign: 'center', color: '#888' }}>Loading product...</div>;
  if (error || !product) return <div style={{ paddingTop: '120px', textAlign: 'center', color: '#ff4444' }}>{error}</div>;

  const getTypeIcon = () => {
    switch (product.type?.toLowerCase()) {
      case 'beat': return <Music size={20} />;
      case 'digital': return <Download size={20} />;
      case 'physical': return <Package size={20} />;
      default: return <ShoppingBag size={20} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '100px', paddingBottom: '80px', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
        
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', marginBottom: '40px', fontSize: '16px', fontWeight: 600 }}>
          <ArrowLeft size={20} /> Back to Marketplace
        </button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px' }}>
          
          {/* Left: Image Viewer */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1 1 500px', minWidth: '300px' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ShoppingBag size={64} color="#333" />
              )}
            </div>
          </motion.div>

          {/* Right: Product Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1 1 400px', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
             
             <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', marginBottom: '24px', border: `1px solid ${wlConfig?.accent || 'var(--accent-primary)'}44`, width: 'fit-content' }}>
               {getTypeIcon()}
               <span style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', color: wlConfig?.accent || 'var(--accent-primary)', textTransform: 'uppercase' }}>
                 {product.type}
               </span>
             </div>

             <h1 style={{ fontSize: '48px', margin: '0 0 16px 0', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px' }}>
               {product.title}
             </h1>

             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', cursor: 'pointer' }} onClick={() => navigate(`/profile/${product.creator.id}`)}>
               <img 
                 src={product.creator.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.creator.username || 'C')}&background=random`} 
                 alt={product.creator.username}
                 style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }}
               />
               <span style={{ color: '#aaa', fontSize: '16px', fontWeight: 500 }}>By @{product.creator.username}</span>
             </div>

             <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}>
               
               {product.type?.toLowerCase() === 'physical' && (
                 <div style={{ marginBottom: '32px' }}>
                   {/* Color Selection */}
                   <div style={{ marginBottom: '24px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                       <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Color</span>
                       <span style={{ color: '#aaa', fontSize: '14px' }}>{selectedColor}</span>
                     </div>
                     <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                       {(product.variants?.colors?.length ? product.variants.colors : defaultColors).map((c: string) => (
                         <button 
                           key={c}
                           onClick={() => setSelectedColor(c)}
                           style={{ 
                             padding: '10px 20px', 
                             borderRadius: '20px', 
                             background: selectedColor === c ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)', 
                             border: selectedColor === c ? `2px solid ${wlConfig?.accent || 'var(--accent-primary)'}` : '1px solid rgba(255,255,255,0.1)',
                             color: selectedColor === c ? '#fff' : '#ccc',
                             cursor: 'pointer',
                             boxShadow: selectedColor === c ? `0 0 15px ${wlConfig?.accent || 'var(--accent-primary)'}66` : 'none',
                             transition: 'all 0.2s',
                             fontWeight: 'bold'
                           }}
                         >
                           {c}
                         </button>
                       ))}
                     </div>
                   </div>

                   {/* Size Selection */}
                   <div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                       <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Size</span>
                       <span style={{ color: '#aaa', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }}>Size Guide</span>
                     </div>
                     <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                       {(product.variants?.sizes?.length ? product.variants.sizes : defaultSizes).map((s: string) => (
                         <button
                           key={s}
                           onClick={() => setSelectedSize(s)}
                           style={{
                             flex: '1 1 calc(20% - 8px)',
                             padding: '12px 0',
                             background: selectedSize === s ? (wlConfig?.accent || 'var(--accent-primary)') : 'rgba(255,255,255,0.05)',
                             color: selectedSize === s ? '#000' : '#fff',
                             border: '1px solid',
                             borderColor: selectedSize === s ? (wlConfig?.accent || 'var(--accent-primary)') : 'rgba(255,255,255,0.1)',
                             borderRadius: '12px',
                             fontWeight: 'bold',
                             cursor: 'pointer',
                             transition: 'all 0.2s'
                           }}
                         >
                           {s}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>
               )}

               <div style={{ fontSize: '48px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
                 ${Number(product.price).toFixed(2)}
               </div>
               <div style={{ color: '#888', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <ShieldCheck size={16} color="#4CAF50" /> Secure transaction via Stripe
               </div>

               <button 
                 onClick={handlePurchase}
                 disabled={purchasing}
                 style={{ 
                   width: '100%', 
                   padding: '20px', 
                   marginTop: '32px', 
                   background: purchasing ? '#444' : (wlConfig?.accent || 'var(--accent-primary)'), 
                   color: purchasing ? '#aaa' : '#000', 
                   border: 'none', 
                   borderRadius: '16px', 
                   fontSize: '18px', 
                   fontWeight: 900, 
                   letterSpacing: '1px',
                   cursor: purchasing ? 'not-allowed' : 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '12px',
                   boxShadow: purchasing ? 'none' : `0 10px 30px ${wlConfig?.accent || 'var(--accent-primary)'}66`,
                   transition: 'all 0.3s ease'
                 }}
               >
                 {purchasing ? 'Processing...' : (
                   <>
                     <CreditCard size={24} /> Purchase Now
                   </>
                 )}
               </button>
             </div>

             <div style={{ color: '#888', fontSize: '15px', lineHeight: 1.6 }}>
               <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>Description</h3>
               <p>
                 Purchase this premium {product.type?.toLowerCase()} securely. Upon successful payment, you will receive full access or tracking information directly to your registered email address. 
               </p>
             </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
