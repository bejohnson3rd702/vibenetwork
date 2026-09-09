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
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vibe_purchased_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const markAsPurchased = (id: string) => {
    setPurchasedProductIds(prev => {
      if (!prev.includes(String(id))) {
        const updated = [...prev, String(id)];
        localStorage.setItem('vibe_purchased_products', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('stripe_success') === 'true' && productId) {
      markAsPurchased(productId);
      toast.success('🎉 Payment verified! Your digital download is ready below.');
    }
  }, [productId]);
  
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
        const creatorIdToFetch = targetProduct.creator_id || targetProduct.creator?.id;
        if (creatorIdToFetch && (!targetProduct.creator?.username && !targetProduct.creator?.full_name)) {
          try {
            const { data: profData } = await supabase
              .from('profiles')
              .select('id, username, avatar_url, full_name')
              .eq('id', creatorIdToFetch)
              .maybeSingle();
            if (profData) {
              targetProduct.creator = profData;
            }
          } catch {}
        }

        // Apply known creator profile aliases for Bennie and Joe
        if (creatorIdToFetch === '8c409557-a48c-41d4-8133-9d9788aebe0d' || String(creatorIdToFetch).toLowerCase().includes('bennie')) {
          targetProduct.creator = {
            id: '8c409557-a48c-41d4-8133-9d9788aebe0d',
            username: 'Rev Bennie Johnson (BJ)',
            full_name: 'Rev Bennie Johnson',
            avatar_url: targetProduct.creator?.avatar_url || 'https://fimzetmvrmbmdggvqzpr.supabase.co/storage/v1/object/public/images/whitelabel/kple_logo_1782369339776.png'
          };
        } else if (creatorIdToFetch === 'db7af833-2f7a-40b0-ad46-57ff8fbd4744' || String(creatorIdToFetch).toLowerCase().includes('joe')) {
          targetProduct.creator = {
            id: 'db7af833-2f7a-40b0-ad46-57ff8fbd4744',
            username: 'Joe VIBE',
            full_name: 'Joe VIBE',
            avatar_url: targetProduct.creator?.avatar_url || 'https://fimzetmvrmbmdggvqzpr.supabase.co/storage/v1/object/public/images/db7af833-2f7a-40b0-ad46-57ff8fbd4744/0.11923008118112288.jpeg'
          };
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
    setPurchasing(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      // Auto-save buyer as a contact in Vibe CRM if logged in
      if (session?.user?.email && product) {
        try {
          const email = session.user.email;
          const username = session.user.user_metadata?.username || '';
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
        } catch (crmErr) {
          console.warn("Auto-save CRM contact failed on purchase checkout:", crmErr);
        }
      }

      toast.info(`Preparing secure Checkout for ${product.title}...`);

      if (session?.access_token) {
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

        const data = await response.json().catch(() => null);
        if (data && data.url) {
          window.location.href = data.url;
          return;
        } else if (data?.error) {
          throw new Error(data.error);
        }
      }

      throw new Error('Could not establish checkout connection.');
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('Checkout error: ' + (err.message || 'Payment initiation failed.'));
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '90px', paddingBottom: '60px', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 4%' }}>
        
        {(() => {
          const sellerName = product?.creator?.full_name || product?.creator?.username || product?.creator_name || 'Store Creator';
          const backLabel = sellerName && sellerName !== 'Store Creator' ? `Back to ${sellerName}'s Store` : 'Back to Store';

          const handleBackToStore = () => {
            const creatorId = product?.creator?.id || product?.creator_id;
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.set('tab', 'store');
            currentParams.set('view', 'public');

            if (creatorId) {
              navigate(`/profile/${creatorId}?${currentParams.toString()}`);
            } else {
              navigate(`/profile?${currentParams.toString()}`);
            }
          };

          return (
            <button onClick={handleBackToStore} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px', fontSize: '15px', fontWeight: 600 }}>
              <ArrowLeft size={18} /> {backLabel}
            </button>
          );
        })()}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '36px' }}>
          
          {/* Left: Multi-Image Viewer */}
          {(() => {
            const productImages: string[] = Array.isArray(product?.variants?.image_urls) && product.variants.image_urls.length > 0
              ? product.variants.image_urls
              : (Array.isArray(product?.image_urls) && product.image_urls.length > 0
                ? product.image_urls
                : (product?.image_url ? [product.image_url] : []));

            const currentMainImage = productImages[selectedImgIndex] || product?.image_url;

            return (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1 1 340px', minWidth: '280px' }}>
                <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {currentMainImage ? (
                    <img src={currentMainImage} alt={product.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'all 0.3s ease' }} />
                  ) : (
                    <ShoppingBag size={64} color="#333" />
                  )}
                </div>

                {productImages.length > 1 && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {productImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImgIndex(idx)}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '12px',
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
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ flex: '1 1 340px', minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ padding: '5px 12px', background: `${wlConfig?.accent || 'var(--accent-primary)'}15`, color: wlConfig?.accent || 'var(--accent-primary)', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {getTypeIcon()}
                {product.type}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', margin: '0 0 14px 0', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.5px' }}>
              {product.title}
            </h1>

            {(() => {
              const sellerName = product?.creator?.full_name || product?.creator?.username || product?.creator_name || 'Store Creator';
              const sellerHandle = product?.creator?.username ? `@${product.creator.username}` : '';
              const sellerAvatar = product?.creator?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=random`;

              return (
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', cursor: (product?.creator?.id || product?.creator_id) ? 'pointer' : 'default' }} 
                  onClick={() => (product?.creator?.id || product?.creator_id) && navigate(`/profile/${product.creator?.id || product.creator_id}${window.location.search}`)}
                >
                  <img 
                    src={sellerAvatar} 
                    alt={sellerName}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)', objectFit: 'cover' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>By {sellerName}</span>
                    {sellerHandle && sellerHandle !== `@${sellerName}` && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500 }}>{sellerHandle}</span>
                    )}
                  </div>
                </div>
              );
            })()}

             <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '24px' }}>
               
               {product.type?.toLowerCase() === 'physical' && (
                 <div style={{ marginBottom: '24px' }}>
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

                {(() => {
                  const isPurchased = product && purchasedProductIds.includes(String(product.id));
                  const effectiveDownloadUrl = product?.digital_file_url || product?.variants?.digital_file_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564';

                  if (isPurchased) {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '28px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 18px',
                          background: 'rgba(0, 255, 136, 0.1)',
                          border: '1px solid rgba(0, 255, 136, 0.4)',
                          borderRadius: '12px',
                          color: '#00ff88',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={18} /> Digital Product Purchased & Verified
                          </span>
                          <span style={{ fontSize: '11px', background: 'rgba(0,255,136,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                            UNLOCKED
                          </span>
                        </div>

                        <a 
                          href={effectiveDownloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          style={{ 
                            width: '100%', 
                            padding: '20px', 
                            background: 'linear-gradient(135deg, #00ff88, #00e5ff)', 
                            color: '#000', 
                            border: 'none', 
                            borderRadius: '16px', 
                            fontSize: '18px', 
                            fontWeight: 900, 
                            letterSpacing: '1px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            textDecoration: 'none',
                            boxShadow: '0 10px 30px rgba(0, 255, 136, 0.4)',
                            transition: 'all 0.3s ease',
                            boxSizing: 'border-box'
                          }}
                        >
                          <Download size={24} /> Download {product.title} Now
                        </a>
                      </div>
                    );
                  }

                  return (
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
                  );
                })()}
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
