import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, ShieldCheck, Download, Package, Music, CreditCard } from 'lucide-react';
import { syncContactToExternalCrms } from '../lib/crmSync';

const ProductPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { wlConfig } = useWhiteLabel();
  const toast = useToast();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  
  // Physical Product Variants & Multi-Image Gallery
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  
  const defaultSizes = ['S', 'M', 'L', 'XL', '2XL'];
  const defaultColors = ['Black', 'White', 'Navy', 'Red'];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      let targetProduct: any = null;

      try {
        const { data } = await supabase
          .from('products')
          .select('*, creator:profiles(id, username, avatar_url, full_name)')
          .eq('id', productId)
          .maybeSingle();

        if (data) targetProduct = data;
      } catch {}
        
      if (!targetProduct) {
        // Fallback: Check local storage cache for newly added products
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('vibe_added_products_') || key.startsWith('vibe_user_added_products_'))) {
              const items = JSON.parse(localStorage.getItem(key) || '[]');
              const found = items.find((item: any) => String(item.id) === String(productId));
              if (found) {
                targetProduct = found;
                break;
              }
            }
          }
        } catch {}
      }

      if (targetProduct) {
        // If creator profile object is missing username/full_name, attempt lookup by creator_id
        if ((!targetProduct.creator || (!targetProduct.creator.username && !targetProduct.creator.full_name)) && targetProduct.creator_id) {
          try {
            const { data: profData } = await supabase
              .from('profiles')
              .select('id, username, avatar_url, full_name')
              .eq('id', targetProduct.creator_id)
              .maybeSingle();
            if (profData) {
              targetProduct.creator = profData;
            }
          } catch {}
        }

        // If creator is still missing, fallback to active session user if creator_id matches
        if (!targetProduct.creator?.username && !targetProduct.creator?.full_name) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            const currUser = session?.user;
            if (currUser && (!targetProduct.creator_id || targetProduct.creator_id === currUser.id)) {
              targetProduct.creator = {
                id: currUser.id,
                username: currUser.user_metadata?.username || currUser.user_metadata?.display_name || currUser.email?.split('@')[0] || 'Seller',
                full_name: currUser.user_metadata?.full_name || currUser.user_metadata?.display_name || currUser.email?.split('@')[0] || 'Seller',
                avatar_url: currUser.user_metadata?.avatar_url || ''
              };
            }
          } catch {}
        }

        setProduct(targetProduct);
        const shouldShowSizesProduct = targetProduct.type?.toLowerCase() === 'physical' && (
          targetProduct.variants?.is_clothing === true || 
          targetProduct.variants?.sizes?.length > 0 ||
          (targetProduct.variants?.is_clothing !== false && 
            /shirt|tee|hoodie|hoody|sweatshirt|sweater|jacket|pants|shorts|socks|apparel|clothing/i.test(targetProduct.title || '')
          )
        );
        const initialSizes = targetProduct.variants?.sizes?.length ? targetProduct.variants.sizes : defaultSizes;
        const initialColors = targetProduct.variants?.colors?.length ? targetProduct.variants.colors : defaultColors;
        setSelectedSize(shouldShowSizesProduct ? (initialSizes[0] || '') : '');
        setSelectedColor(initialColors[0] || '');
      } else {
        setError('Product not found or unavailable.');
      }
      setLoading(false);
    };

    if (productId) fetchProduct();
  }, [productId]);

  const shouldShowSizes = product?.type?.toLowerCase() === 'physical' && (
    product.variants?.is_clothing === true || 
    product.variants?.sizes?.length > 0 ||
    (product.variants?.is_clothing !== false && 
      /shirt|tee|hoodie|hoody|sweatshirt|sweater|jacket|pants|shorts|socks|apparel|clothing/i.test(product.title || '')
    )
  );

  const handlePurchase = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.dispatchEvent(new CustomEvent('open_auth', { detail: { isLogin: true } }));
      return;
    }

    // Auto-save buyer as a contact in Vibe CRM
    try {
      const email = session.user?.email;
      const username = session.user?.user_metadata?.username || '';
      if (email && product) {
        const nameParts = (username || '').trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const wlId = (!wlConfig?.id || wlConfig.id === 'master') ? null : wlConfig.id;

        const { data: contact } = await supabase
          .from('crm_contacts')
          .insert({
            whitelabel_id: wlId,
            creator_id: product.creator?.id || wlConfig?.owner_id || null,
            first_name: firstName,
            last_name: lastName,
            email: email,
            source: 'checkout'
          })
          .select()
          .single();

        if (contact) {
          syncContactToExternalCrms(contact);
        }
      }
    } catch (crmErr) {
      console.error("Auto-save CRM contact failed on purchase checkout:", crmErr);
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
          creatorId: product.creator?.id || product.creator_id || wlConfig?.owner_id || '',
          amount: product.price,
          productTitle: product.title,
          returnUrl: window.location.href,
          extraMetadata: {
            product_id: product.id,
            product_type: product.type,
            ...(product.type?.toLowerCase() === 'physical' ? {
              ...(shouldShowSizes ? { size: selectedSize } : {}),
              color: selectedColor
            } : {})
          }
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('Checkout failed: ' + err.message);
    }
    setPurchasing(false);
  };

  if (loading) return <div style={{ paddingTop: '120px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading product...</div>;
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '100px', paddingBottom: '80px', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
        
        {(() => {
          const sellerName = product?.creator?.full_name || product?.creator?.username || wlConfig?.name || '';
          const backLabel = sellerName ? `Back to ${sellerName}'s Store` : 'Back to Store';

          return (
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '40px', fontSize: '16px', fontWeight: 600 }}>
              <ArrowLeft size={20} /> {backLabel}
            </button>
          );
        })()}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px' }}>
          
          {/* Left: Multi-Image Viewer */}
          {(() => {
            const productImages: string[] = Array.isArray(product?.variants?.image_urls) && product.variants.image_urls.length > 0
              ? product.variants.image_urls
              : (Array.isArray(product?.image_urls) && product.image_urls.length > 0
                ? product.image_urls
                : (product?.image_url ? [product.image_url] : []));

            const currentMainImage = productImages[selectedImgIndex] || product?.image_url;

            return (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1 1 500px', minWidth: '300px' }}>
                <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {currentMainImage ? (
                    <img src={currentMainImage} alt={product.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'all 0.3s ease' }} />
                  ) : (
                    <ShoppingBag size={64} color="#333" />
                  )}
                </div>

                {productImages.length > 1 && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {productImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImgIndex(idx)}
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          border: selectedImgIndex === idx ? `2px solid ${wlConfig?.accent || 'var(--accent-primary)'}` : '1px solid rgba(255,255,255,0.1)',
                          background: '#000',
                          cursor: 'pointer',
                          padding: 0,
                          opacity: selectedImgIndex === idx ? 1 : 0.5,
                          transition: 'all 0.2s ease',
                          flexShrink: 0
                        }}
                      >
                        <img src={imgUrl} alt={`${product.title} thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })()}

          {/* Right: Product Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1 1 400px', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ padding: '6px 14px', background: `${wlConfig?.accent || 'var(--accent-primary)'}15`, color: wlConfig?.accent || 'var(--accent-primary)', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {getTypeIcon()}
                {product.type}
              </span>
            </div>

            <h1 style={{ fontSize: '48px', margin: '0 0 16px 0', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px' }}>
              {product.title}
            </h1>

            {(() => {
              const sellerName = product?.creator?.full_name || product?.creator?.username || wlConfig?.name || 'Seller';
              const sellerHandle = product?.creator?.username ? `@${product.creator.username}` : '';
              const sellerAvatar = product?.creator?.avatar_url || wlConfig?.logoImage || wlConfig?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=random`;

              return (
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', cursor: (product?.creator?.id || product?.creator_id) ? 'pointer' : 'default' }} 
                  onClick={() => (product?.creator?.id || product?.creator_id) && navigate(`/profile/${product.creator?.id || product.creator_id}${window.location.search}`)}
                >
                  <img 
                    src={sellerAvatar} 
                    alt={sellerName}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)', objectFit: 'cover' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>By {sellerName}</span>
                    {sellerHandle && sellerHandle !== `@${sellerName}` && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500 }}>{sellerHandle}</span>
                    )}
                  </div>
                </div>
              );
            })()}

             <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}>
               
               {product.type?.toLowerCase() === 'physical' && (
                 <div style={{ marginBottom: '32px' }}>
                   {/* Color Selection */}
                   <div style={{ marginBottom: '24px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                       <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Color</span>
                       <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{selectedColor}</span>
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
                             color: selectedColor === c ? 'var(--text-primary)' : 'var(--text-secondary)',
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
                    {shouldShowSizes && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Size</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }}>Size Guide</span>
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
                                color: selectedSize === s ? '#000' : 'var(--text-primary)',
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
                    )}
                 </div>
               )}

               <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
                 ${Number(product.price).toFixed(2)}
               </div>
               <div style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
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

              <div style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', marginBottom: '12px' }}>Description</h3>
                <p>
                  Purchase this premium {product.type?.toLowerCase()} securely. Upon successful payment, you will receive full access or tracking information directly to your registered email address. 
                </p>
              </div>

              <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '16px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>🛡️ Store Refund Policy</h4>
                <p style={{ margin: 0, fontStyle: 'italic' }}>
                  {product.creator?.refund_policy || 'All sales are final. No refunds are provided for digital downloads or virtual bookings. For physical merchandise, please contact the creator directly.'}
                </p>
              </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
