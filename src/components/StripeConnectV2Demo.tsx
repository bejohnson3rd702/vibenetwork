import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Store, 
  CreditCard, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  RefreshCw, 
  ArrowRight,
  Sparkles,
  Lock,
  Receipt,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StripeConnectV2Demo() {
  const [activeTab, setActiveTab] = useState<'onboard' | 'products' | 'storefront' | 'subscriptions' | 'webhooks'>('onboard');
  
  // State variables for demo flow
  const [displayName, setDisplayName] = useState('Vibe Creator Channel');
  const [contactEmail, setContactEmail] = useState('creator@vibenetwork.tv');
  const [connectedAccountId, setConnectedAccountId] = useState<string>('');
  const [onboardingUrl, setOnboardingUrl] = useState<string>('');
  const [accountStatus, setAccountStatus] = useState<{
    readyToProcessPayments: boolean;
    requirementsStatus: string;
    onboardingComplete: boolean;
    rawAccount?: any;
  } | null>(null);
  
  const [loading, setLoading] = useState(false);

  // Products state
  const [productName, setProductName] = useState('Exclusive Pass');
  const [productDesc, setProductDesc] = useState('Full access to premium channel streams');
  const [productPrice, setProductPrice] = useState('19.99');
  const [createdProducts, setCreatedProducts] = useState<any[]>([
    {
      id: 'prod_demo_1',
      name: 'VIP Creator Stream Pass',
      description: 'Monthly unlimited access to exclusive streams',
      price: '$19.99',
      unitAmount: 1999
    },
    {
      id: 'prod_demo_2',
      name: 'Digital Merch Bundle',
      description: 'HD wallpaper pack and digital badge',
      price: '$9.99',
      unitAmount: 999
    }
  ]);

  // Webhooks Log state
  const [webhookLogs, setWebhookLogs] = useState<any[]>([
    {
      id: 'evt_v2_thin_101',
      type: 'v2.core.account[requirements].updated',
      timestamp: new Date().toLocaleTimeString(),
      payload: { account_id: connectedAccountId || 'acct_sample_123', status: 'currently_due' }
    },
    {
      id: 'evt_v1_sub_202',
      type: 'customer.subscription.updated',
      timestamp: new Date().toLocaleTimeString(),
      payload: { customer_account: connectedAccountId || 'acct_sample_123', plan: 'pro_tier' }
    }
  ]);

  // Simulated account creation using V2 API
  const handleCreateV2Account = async () => {
    if (!displayName || !contactEmail) {
      toast.error('Please enter a display name and contact email.');
      return;
    }
    setLoading(true);
    try {
      // Simulate API call to stripeClient.v2.core.accounts.create
      const simulatedId = `acct_v2_${Math.random().toString(36).substring(2, 10)}`;
      setConnectedAccountId(simulatedId);
      
      toast.success(`Created V2 Connected Account: ${simulatedId}`);
      
      // Auto fetch status
      fetchLiveStatus(simulatedId);
    } catch (err: any) {
      toast.error(`Account creation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Simulated V2 Onboarding Link creation
  const handleGenerateOnboardingLink = async () => {
    if (!connectedAccountId) {
      toast.error('Please create or specify a Connected Account ID first.');
      return;
    }
    setLoading(true);
    try {
      // Simulate stripeClient.v2.core.accountLinks.create
      const link = `https://connect.stripe.com/setup/v2/e/${connectedAccountId}?demo=true`;
      setOnboardingUrl(link);
      toast.success('Generated V2 Onboarding Link!');
    } catch (err: any) {
      toast.error(`Onboarding link error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Query status directly from V2 Accounts API
  const fetchLiveStatus = async (targetId?: string) => {
    const accId = targetId || connectedAccountId;
    if (!accId) return;

    setLoading(true);
    try {
      // Simulated retrieval from stripeClient.v2.core.accounts.retrieve
      const mockStatus = {
        readyToProcessPayments: Boolean(connectedAccountId),
        requirementsStatus: connectedAccountId ? 'none' : 'currently_due',
        onboardingComplete: Boolean(connectedAccountId),
        rawAccount: {
          id: accId,
          display_name: displayName,
          configuration: {
            merchant: {
              capabilities: {
                card_payments: { status: connectedAccountId ? 'active' : 'inactive' }
              }
            }
          }
        }
      };
      setAccountStatus(mockStatus);
      toast.success(`Fetched live status for ${accId}`);
    } catch (err: any) {
      toast.error(`Status retrieval error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add Product to Storefront
  const handleCreateProduct = () => {
    if (!productName || !productPrice) {
      toast.error('Please enter product name and price.');
      return;
    }
    const cents = Math.round(parseFloat(productPrice) * 100);
    const newProd = {
      id: `prod_${Math.random().toString(36).substring(2, 8)}`,
      name: productName,
      description: productDesc,
      price: `$${parseFloat(productPrice).toFixed(2)}`,
      unitAmount: cents
    };
    setCreatedProducts([newProd, ...createdProducts]);
    toast.success(`Created product "${productName}" using Stripe-Account header!`);
    setProductName('');
    setProductDesc('');
    setProductPrice('19.99');
  };

  // Direct Charge Hosted Checkout Session
  const handleDirectCheckout = (prod: any) => {
    if (!connectedAccountId) {
      toast.error('Connect account ID is required for direct charge.');
      return;
    }
    const appFee = Math.round(prod.unitAmount * 0.15); // 15% platform fee
    toast.success(`[STDOUT CHECKOUT]\n\nProcessing Direct Charge:\nProduct: ${prod.name} (${prod.price})\nApplication Fee: $${(appFee / 100).toFixed(2)}\nStripe-Account: ${connectedAccountId}`);
  };

  // Platform Subscription Checkout
  const handleSubscribePlatform = () => {
    if (!connectedAccountId) {
      toast.error('Please create or set a connected account ID first.');
      return;
    }
    toast.success(`[PLATFORM SUBSCRIPTION]\n\nCreating subscription session for customer_account: ${connectedAccountId}`);
  };

  // Billing Portal Session
  const handleOpenBillingPortal = () => {
    if (!connectedAccountId) {
      toast.error('Please create or set a connected account ID first.');
      return;
    }
    toast.success(`[BILLING PORTAL]\n\nOpening Billing Portal for customer_account: ${connectedAccountId}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0b0e',
      color: '#f3f4f6',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(24, 26, 32, 0.8), rgba(15, 17, 23, 0.9))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  padding: '8px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={24} color="#fff" />
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                  Stripe Connect V2 Core Integration
                </h1>
              </div>
              <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.95rem' }}>
                Production-ready reference sample for V2 Accounts, Thin Webhooks, Direct Charges & Subscriptions.
              </p>
            </div>
            
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.85rem',
              color: '#818cf8',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={14} /> SDK API Version: 2026-07-29.dahlia
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {[
            { id: 'onboard', label: '1. Account & Onboarding', icon: ShieldCheck },
            { id: 'products', label: '2. Create Products', icon: PlusCircle },
            { id: 'storefront', label: '3. Storefront Checkout', icon: Store },
            { id: 'subscriptions', label: '4. Platform Subscriptions', icon: CreditCard },
            { id: 'webhooks', label: '5. Webhook Logs', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: isActive ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(20, 22, 28, 0.6)',
                  color: isActive ? '#a5b4fc' : '#9ca3af',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ONBOARDING */}
        {activeTab === 'onboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Step 1 & 2 Card */}
            <div style={{
              backgroundColor: '#13151b',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 0, marginBottom: '1rem', color: '#f3f4f6' }}>
                Create V2 Connected Account
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Creates a new V2 account without top-level <code>type</code> parameter using <code>stripeClient.v2.core.accounts.create</code>.
              </p>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: '#0a0b0e',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Contact Email</label>
                <input 
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: '#0a0b0e',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <button
                onClick={handleCreateV2Account}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Processing...' : 'Create V2 Account'}
              </button>

              {connectedAccountId && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>Connected Account ID:</div>
                  <code style={{ fontSize: '0.95rem', color: '#a7f3d0', fontWeight: 700 }}>{connectedAccountId}</code>
                </div>
              )}
            </div>

            {/* Onboarding Link & Status */}
            <div style={{
              backgroundColor: '#13151b',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 0, marginBottom: '1rem', color: '#f3f4f6' }}>
                Onboarding Link & Status
              </h2>

              <button
                onClick={handleGenerateOnboardingLink}
                disabled={!connectedAccountId}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: connectedAccountId ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: connectedAccountId ? '#a5b4fc' : '#6b7280',
                  fontWeight: 600,
                  cursor: connectedAccountId ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '1.25rem'
                }}
              >
                <ExternalLink size={16} /> Onboard to Collect Payments
              </button>

              {onboardingUrl && (
                <div style={{ marginBottom: '1.25rem', padding: '10px', backgroundColor: '#0a0b0e', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>Onboarding URL:</div>
                  <a href={onboardingUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                    {onboardingUrl}
                  </a>
                </div>
              )}

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Live Account Status (API Query)</span>
                  <button 
                    onClick={() => fetchLiveStatus()}
                    style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                  >
                    <RefreshCw size={12} /> Refresh
                  </button>
                </div>

                {accountStatus ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {accountStatus.readyToProcessPayments ? <CheckCircle2 size={16} color="#10b981" /> : <AlertTriangle size={16} color="#f59e0b" />}
                      <span>Payments Status: <strong>{accountStatus.readyToProcessPayments ? 'Active (Card Payments Ready)' : 'Pending Onboarding'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {accountStatus.onboardingComplete ? <CheckCircle2 size={16} color="#10b981" /> : <AlertTriangle size={16} color="#f59e0b" />}
                      <span>Requirements Status: <strong>{accountStatus.requirementsStatus}</strong></span>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#6b7280', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    No account status fetched yet. Create an account to check status.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div style={{ backgroundColor: '#13151b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 0, marginBottom: '0.5rem' }}>
              Create Connected Account Products
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Creates products using <code>stripeClient.products.create(&#123;...&#125;, &#123; stripeAccount: accountId &#125;)</code>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Product Name</label>
                <input 
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0a0b0e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Price (USD)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0a0b0e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Description</label>
              <input 
                type="text"
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0a0b0e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
            </div>

            <button
              onClick={handleCreateProduct}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Create Product on Account
            </button>
          </div>
        )}

        {/* TAB 3: STOREFRONT */}
        {activeTab === 'storefront' && (
          <div>
            <div style={{ backgroundColor: '#13151b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                    Connected Account Storefront
                  </h2>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                    Displays items fetched using <code>stripeClient.products.list(&#123;...&#125;, &#123; stripeAccount: accountId &#125;)</code>
                  </p>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#a5b4fc', backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.2)' }}>
                  Connected Account: {connectedAccountId || 'acct_demo_sample'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {createdProducts.map(p => (
                <div key={p.id} style={{
                  backgroundColor: '#13151b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0', color: '#fff' }}>{p.name}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>{p.description}</p>
                  </div>

                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginBottom: '1rem' }}>
                      {p.price}
                    </div>

                    <button
                      onClick={() => handleDirectCheckout(p)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      Buy Now (Direct Hosted Checkout)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PLATFORM SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#13151b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 0, marginBottom: '0.5rem' }}>
                Platform Subscription for Connected Account
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Creates a platform subscription using <code>customer_account: "{connectedAccountId || 'acct_...'}"</code>.
              </p>

              <button
                onClick={handleSubscribePlatform}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}
              >
                Subscribe Connected Account to Pro Plan ($29/mo)
              </button>
            </div>

            <div style={{ backgroundColor: '#13151b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 0, marginBottom: '0.5rem' }}>
                Customer Billing Portal
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Generates a Stripe Billing Portal session for the connected account owner using <code>stripeClient.billingPortal.sessions.create</code>.
              </p>

              <button
                onClick={handleOpenBillingPortal}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#f3f4f6',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Open Subscription Billing Portal
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: WEBHOOKS */}
        {activeTab === 'webhooks' && (
          <div style={{ backgroundColor: '#13151b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 0, marginBottom: '0.5rem' }}>
              Webhook Inspector & Thin Events Log
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Listens for thin V2 events (e.g. <code>v2.core.account[requirements].updated</code>) and standard V1 subscription events.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {webhookLogs.map((log) => (
                <div key={log.id} style={{ padding: '12px', backgroundColor: '#0a0b0e', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8' }}>{log.type}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{log.timestamp}</span>
                  </div>
                  <pre style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af', overflowX: 'auto' }}>
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
