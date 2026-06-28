import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Camera, Lock, Unlock, Image as ImageIcon, Star, ShieldCheck, Eye, Edit2, Trash2, Wand, Calendar, Edit3, Clock, CheckCircle, Heart, MessageCircle, Wallet, ArrowUpRight, ArrowDownLeft, Activity, Monitor, Settings, Video, DollarSign, Share2, Pin, ChevronLeft, ChevronRight, AlertCircle, Users, Folder, File, FileText, Download, UploadCloud, Search, Plus, X, Globe, EyeOff, Copy } from 'lucide-react';
import { DictationButton } from './DictationButton';
import { EmojiPickerButton } from './EmojiPickerButton';
import EndUserAuthModal from './EndUserAuthModal';
import { ProfileLive } from './ProfileLive';
import { ErrorBoundary } from './ErrorBoundary';
const LiveChat = React.lazy(() => import('./LiveChat'));
const ShopifyStore = React.lazy(() => import('./ShopifyStore'));
const AiReportTab = React.lazy(() => import('./admin/AiReportTab').then(m => ({ default: m.AiReportTab })));
import { SecuritySettingsForm } from './admin/SecuritySettingsForm';
import Community from '../pages/Community';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useStreaming } from '../hooks/useStreaming';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { Helmet } from 'react-helmet-async';
import { useToast } from '../context/ToastContext';
import { processAndEnhanceImage } from '../lib/imageProcessor';
import { syncContactToExternalCrms } from '../lib/crmSync';

let stripePromise: Promise<any> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = import('@stripe/stripe-js').then(({ loadStripe }) =>
      loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder')
    );
  }
  return stripePromise;
};

interface BookingFormInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  icon?: any;
  accent?: string;
}

const BookingFormInput: React.FC<BookingFormInputProps> = ({ label, value, onChange, placeholder, type = 'text', icon: Icon, accent = '#00ff88' }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#ccc' }}>{label}</label>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.4)',
        border: '1.5px solid',
        borderColor: isFocused ? accent : 'rgba(255,255,255,0.08)',
        borderRadius: '12px',
        padding: '2px 14px',
        transition: 'all 0.2s ease',
        boxShadow: isFocused ? `0 0 12px ${accent}25` : 'none'
      }}>
        {Icon && <Icon size={16} style={{ color: isFocused ? accent : '#888', marginRight: '8px', transition: 'color 0.2s' }} />}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '12px 0',
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: '14px',
            width: '100%'
          }}
        />
      </div>
    </div>
  );
};

const BookingRateInput: React.FC<{ value: string; onChange: (val: string) => void; accent?: string }> = ({ value, onChange, accent = '#00ff88' }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ccc' }}>Hourly Rate ($ USD)</span>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.4)',
        border: '1.5px solid',
        borderColor: isFocused ? accent : 'rgba(255,255,255,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        boxShadow: isFocused ? `0 0 12px ${accent}25` : 'none'
      }}>
        <span style={{
          padding: '12px 16px',
          color: isFocused ? accent : 'var(--text-muted)',
          background: 'rgba(255,255,255,0.02)',
          borderRight: '1.5px solid',
          borderColor: isFocused ? accent : 'rgba(255,255,255,0.08)',
          fontSize: '15px',
          fontWeight: 'bold',
          transition: 'all 0.2s ease'
        }}>$</span>
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '12px 16px',
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: '15px',
            width: '100%'
          }}
        />
      </div>
    </div>
  );
};

const ProfileDashboard: React.FC<{ user: any, creatorIdOverride?: string, isNetworkLevel?: boolean }> = ({ user, creatorIdOverride, isNetworkLevel }) => {
  const navigate = useNavigate();
  const { creatorId: paramCreatorId } = useParams();
  const creatorId = creatorIdOverride || paramCreatorId;
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { wlConfig } = useWhiteLabel();
  const toast = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const targetProfileId = profile?.id || creatorId || user?.id; // Determine which profile to load
  const isOwnProfile = user && targetProfileId === user.id;

  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState<any[]>([]);
  
  // View Modes (public vs edit)
  const [viewMode, setViewMode] = useState<'public' | 'edit'>('public');

  // Editor States
  const [bio, setBio] = useState('');

  const [selectedGenre, setSelectedGenre] = useState('Electronic');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [homepageImageUrl, setHomepageImageUrl] = useState('');
  const [flipbookImages, setFlipbookImages] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  
  // Vibe Drive States
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [driveSearchQuery, setDriveSearchQuery] = useState('');
  const [driveViewMode, setDriveViewMode] = useState<'grid' | 'list'>('grid');
  const [showDriveUploadModal, setShowDriveUploadModal] = useState(false);
  const [uploadingDriveFile, setUploadingDriveFile] = useState(false);
  const [driveUrls, setDriveUrls] = useState<Record<string, string>>({});
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [driveUploadAccessLevel, setDriveUploadAccessLevel] = useState<'public' | 'subscribers'>('public');
  const [driveUploadFile, setDriveUploadFile] = useState<File | null>(null);
  const [driveUploadName, setDriveUploadName] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'store' | 'live' | 'booking' | 'series' | 'courses' | 'wallet' | 'flipbook' | 'appearance' | 'my_bookings' | 'networks' | 'members' | 'community' | 'security' | 'crm' | 'subscriptions'>('feed');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [networkProfiles, setNetworkProfiles] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('vibe_host_wallet') || 0.00) : 0.00));
  const [paySubsWithWallet, setPaySubsWithWallet] = useState(true);



  const [products, setProducts] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Upgrade 1: Masterclasses / Courses Progress
  const [courseProgressMap, setCourseProgressMap] = useState<Record<string, number[]>>({});
  const [activeCoursePlayer, setActiveCoursePlayer] = useState<any | null>(null);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vibe_purchased_courses');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});
  const [selectedSeriesForViewer, setSelectedSeriesForViewer] = useState<any | null>(null);

  // Upgrade 2: Store / Product Editing
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Upgrade 3: TV Series Cinema Theater
  const [activeCinemaSeries, setActiveCinemaSeries] = useState<any | null>(null);
  const [activeCinemaEpisode, setActiveCinemaEpisode] = useState<any | null>(null);
  const [showCinemaModal, setShowCinemaModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // CRM Integration States
  const [crmSubTab, setCrmSubTab] = useState<'contacts' | 'pipelines' | 'integrations'>('contacts');
  const [crmContacts, setCrmContacts] = useState<any[]>([]);
  const [crmPipelines, setCrmPipelines] = useState<any[]>([]);
  const [crmStages, setCrmStages] = useState<any[]>([]);
  const [crmOpportunities, setCrmOpportunities] = useState<any[]>([]);
  const [crmIntegrations, setCrmIntegrations] = useState<any[]>([]);
  const [crmLoading, setCrmLoading] = useState(false);

  // Follows & Subscriptions States
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [myConnections, setMyConnections] = useState<any[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(false);

  const loadMyConnections = async () => {
    if (!user) return;
    setLoadingConnections(true);
    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('*, target_profile:profiles(*), whitelabel:whitelabel_configs(*)')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error loading connections:", error);
      } else {
        setMyConnections(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConnections(false);
    }
  };

  const handleUnfollowFromDashboard = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;
      toast.success("Connection removed successfully.");
      loadMyConnections();
    } catch (err: any) {
      toast.error("Failed to remove connection: " + err.message);
    }
  };

  const handleToggleFollow = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.dispatchEvent(new CustomEvent('open_auth', { detail: { isLogin: true } }));
      return;
    }

    setFollowLoading(true);
    try {
      const wlId = (!wlConfig?.id || wlConfig.id === 'master') ? null : wlConfig.id;
      if (isFollowing) {
        // Unfollow
        let deleteErr;
        if (wlId) {
          const { error } = await supabase
            .from('user_follows')
            .delete()
            .eq('user_id', session.user.id)
            .eq('type', 'follow')
            .or(`target_profile_id.eq.${targetProfileId},whitelabel_id.eq.${wlId}`);
          deleteErr = error;
        } else {
          const { error } = await supabase
            .from('user_follows')
            .delete()
            .eq('user_id', session.user.id)
            .eq('type', 'follow')
            .eq('target_profile_id', targetProfileId);
          deleteErr = error;
        }

        if (deleteErr) throw deleteErr;
        setIsFollowing(false);
        toast.success("Unfollowed successfully.");
      } else {
        // Follow
        const insertData: any = {
          user_id: session.user.id,
          type: 'follow'
        };
        if (wlId && targetProfileId === wlConfig?.owner_id) {
          insertData.whitelabel_id = wlId;
        } else {
          insertData.target_profile_id = targetProfileId;
        }

        const { error: insertErr } = await supabase
          .from('user_follows')
          .insert(insertData);

        if (insertErr) throw insertErr;
        setIsFollowing(true);
        toast.success("Following successfully!");
        
        // Also auto-save follower to CRM contacts
        try {
          const { data: contact } = await supabase
            .from('crm_contacts')
            .insert({
              whitelabel_id: wlId,
              creator_id: targetProfileId,
              first_name: session.user.user_metadata?.username || 'Follower',
              last_name: '',
              email: session.user.email,
              source: 'follow'
            })
            .select()
            .single();

          if (contact) {
            syncContactToExternalCrms(contact);
          }
        } catch (crmErr) {
          console.error("Auto-save CRM contact failed on follow:", crmErr);
        }
      }
    } catch (err: any) {
      toast.error("Failed to update follow status: " + err.message);
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    const checkFollowStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !targetProfileId) return;

      const wlId = (!wlConfig?.id || wlConfig.id === 'master') ? null : wlConfig.id;
      let query = supabase
        .from('user_follows')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('type', 'follow');

      if (wlId) {
        query = query.or(`target_profile_id.eq.${targetProfileId},whitelabel_id.eq.${wlId}`);
      } else {
        query = query.eq('target_profile_id', targetProfileId);
      }

      const { data } = await query;
      
      setIsFollowing(!!(data && data.length > 0));
    };

    if (user?.id) {
      checkFollowStatus();
    }
  }, [user?.id, targetProfileId, wlConfig?.id]);

  useEffect(() => {
    if (activeTab === 'subscriptions') {
      loadMyConnections();
    }
  }, [activeTab]);

  // Forms for adding CRM records
  const [newContact, setNewContact] = useState({ first_name: '', last_name: '', email: '', phone: '', source: 'manual', tagString: '' });
  const [newOpportunity, setNewOpportunity] = useState({ title: '', value: '', contact_id: '', stage_id: '', status: 'open' });
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');

  const loadCrmData = async () => {
    if (!targetProfileId) return;
    setCrmLoading(true);
    try {
      // 1. Fetch contacts
      const { data: contacts, error: contactErr } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('creator_id', targetProfileId)
        .order('created_at', { ascending: false });

      if (contactErr) {
        console.error("Error fetching CRM contacts:", contactErr);
      } else {
        // Fetch tags for these contacts
        const contactIds = (contacts || []).map(c => c.id);
        let tagsMap = {};
        if (contactIds.length > 0) {
          const { data: tagsData } = await supabase
            .from('crm_contact_tags')
            .select('*')
            .in('contact_id', contactIds);
          (tagsData || []).forEach(t => {
            if (!tagsMap[t.contact_id]) tagsMap[t.contact_id] = [];
            tagsMap[t.contact_id].push(t.tag);
          });
        }
        const enrichedContacts = (contacts || []).map(c => ({
          ...c,
          tags: tagsMap[c.id] || []
        }));
        setCrmContacts(enrichedContacts);
      }

      // 2. Fetch pipelines
      const { data: pipelines, error: pipeErr } = await supabase
        .from('crm_pipelines')
        .select('*')
        .eq('creator_id', targetProfileId);

      if (pipeErr) {
        console.error("Error fetching CRM pipelines:", pipeErr);
      } else {
        setCrmPipelines(pipelines || []);
        if (pipelines && pipelines.length > 0 && !selectedPipelineId) {
          setSelectedPipelineId(pipelines[0].id);
        }
      }

      // 3. Fetch stages
      const { data: stages, error: stageErr } = await supabase
        .from('crm_pipeline_stages')
        .select('*')
        .order('sort_order', { ascending: true });

      if (stageErr) {
        console.error("Error fetching CRM pipeline stages:", stageErr);
      } else {
        setCrmStages(stages || []);
      }

      // 4. Fetch opportunities
      const { data: opportunities, error: oppErr } = await supabase
        .from('crm_opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (oppErr) {
        console.error("Error fetching CRM opportunities:", oppErr);
      } else {
        setCrmOpportunities(opportunities || []);
      }

      // 5. Fetch integrations
      const { data: integrations, error: intErr } = await supabase
        .from('crm_integrations')
        .select('*')
        .eq('creator_id', targetProfileId);

      if (intErr) {
        console.error("Error fetching CRM integrations:", intErr);
      } else {
        setCrmIntegrations(integrations || []);
      }

      // Auto-initialize a default pipeline if none exists
      if (!pipeErr && (!pipelines || pipelines.length === 0)) {
        console.log("Initializing default pipeline...");
        const wlId = (!wlConfig?.id || wlConfig.id === 'master') ? null : wlConfig.id;
        const { data: defaultPipe, error: defaultPipeErr } = await supabase
          .from('crm_pipelines')
          .insert({
            whitelabel_id: wlId,
            creator_id: targetProfileId,
            name: 'Standard Deal Pipeline'
          })
          .select()
          .single();

        if (!defaultPipeErr && defaultPipe) {
          const defaultStages = [
            { name: 'Lead Ingested', sort_order: 1 },
            { name: 'Contacted', sort_order: 2 },
            { name: 'Meeting Booked', sort_order: 3 },
            { name: 'Won', sort_order: 4 },
            { name: 'Lost', sort_order: 5 }
          ];

          await supabase.from('crm_pipeline_stages').insert(
            defaultStages.map(s => ({
              pipeline_id: defaultPipe.id,
              name: s.name,
              sort_order: s.sort_order
            }))
          );

          // Refresh tables
          const { data: repipelines } = await supabase
            .from('crm_pipelines')
            .select('*')
            .eq('creator_id', targetProfileId);
          setCrmPipelines(repipelines || []);
          if (repipelines && repipelines.length > 0) {
            setSelectedPipelineId(repipelines[0].id);
          }
          const { data: restages } = await supabase
            .from('crm_pipeline_stages')
            .select('*')
            .order('sort_order', { ascending: true });
          setCrmStages(restages || []);
        }
      }
    } catch (err) {
      console.error("CRM loading general error:", err);
    } finally {
      setCrmLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'crm') {
      loadCrmData();
    }
  }, [activeTab]);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.email) {
      toast.error("Email is required.");
      return;
    }
    try {
      const wlId = (!wlConfig?.id || wlConfig.id === 'master') ? null : wlConfig.id;
      const { data: contact, error } = await supabase
        .from('crm_contacts')
        .insert({
          whitelabel_id: wlId,
          creator_id: targetProfileId,
          first_name: newContact.first_name,
          last_name: newContact.last_name,
          email: newContact.email,
          phone: newContact.phone,
          source: newContact.source
        })
        .select()
        .single();

      if (error) {
        toast.error("Failed to add contact: " + error.message);
        return;
      }

      if (newContact.tagString && contact) {
        const tags = newContact.tagString.split(',').map(t => t.trim()).filter(Boolean);
        if (tags.length > 0) {
          await supabase.from('crm_contact_tags').insert(
            tags.map(t => ({ contact_id: contact.id, tag: t }))
          );
        }
      }

      // Sync contact to external CRM services asynchronously
      if (contact) {
        syncContactToExternalCrms({
          ...contact,
          tags: newContact.tagString ? newContact.tagString.split(',').map(t => t.trim()).filter(Boolean) : []
        });
      }

      toast.success("Contact created successfully!");
      setNewContact({ first_name: '', last_name: '', email: '', phone: '', source: 'manual', tagString: '' });
      loadCrmData();
    } catch (err: any) {
      toast.error("Error creating contact: " + err.message);
    }
  };

  const handleAddOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpportunity.title || !newOpportunity.contact_id || !newOpportunity.stage_id) {
      toast.error("Please fill out all required deal fields.");
      return;
    }
    try {
      const { error } = await supabase
        .from('crm_opportunities')
        .insert({
          stage_id: newOpportunity.stage_id,
          contact_id: newOpportunity.contact_id,
          title: newOpportunity.title,
          value: parseFloat(newOpportunity.value || '0'),
          status: newOpportunity.status
        });

      if (error) {
        toast.error("Failed to create opportunity: " + error.message);
        return;
      }

      toast.success("Opportunity created!");
      setNewOpportunity({ title: '', value: '', contact_id: '', stage_id: '', status: 'open' });
      loadCrmData();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const handleMoveOpportunity = async (oppId: string, targetStageId: string) => {
    try {
      const { error } = await supabase
        .from('crm_opportunities')
        .update({ stage_id: targetStageId })
        .eq('id', oppId);

      if (error) {
        toast.error("Failed to move deal: " + error.message);
        return;
      }
      loadCrmData();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSaveIntegration = async (provider: string, credentialsJson: any) => {
    try {
      const existing = crmIntegrations.find(i => i.provider_name === provider);
      let error;
      if (existing) {
        ({ error } = await supabase
          .from('crm_integrations')
          .update({ credentials: credentialsJson })
          .eq('id', existing.id));
      } else {
        const wlId = (!wlConfig?.id || wlConfig.id === 'master') ? null : wlConfig.id;
        ({ error } = await supabase
          .from('crm_integrations')
          .insert({
            whitelabel_id: wlId,
            creator_id: targetProfileId,
            provider_name: provider,
            credentials: credentialsJson,
            is_active: true
          }));
      }

      if (error) {
        toast.error(`Failed to update ${provider} integration: ` + error.message);
        return;
      }

      toast.success(`${provider} integration credentials saved!`);
      loadCrmData();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const [purchasedSeasons, setPurchasedSeasons] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vibe_purchased_seasons');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [purchasedEpisodes, setPurchasedEpisodes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vibe_purchased_episodes');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Real Booking State
  const [bookingPrice, setBookingPrice] = useState('49.00');
  const [bookingDuration, setBookingDuration] = useState(1);
  const [bookingType, setBookingType] = useState('virtual');
  const [virtualCallType, setVirtualCallType] = useState('video');
  const [availableSlots, setAvailableSlots] = useState<Record<number, string[]>>({});
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0); // 0: current, 1: next
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number | null>(null);
  const [newTimeInput, setNewTimeInput] = useState('');
  const [refundPolicy, setRefundPolicy] = useState('');
  const [bookingAvailability, setBookingAvailability] = useState<any>({
    Mon: { start: '09:00', end: '17:00', active: true },
    Tue: { start: '09:00', end: '17:00', active: true },
    Wed: { start: '09:00', end: '17:00', active: true },
    Thu: { start: '09:00', end: '17:00', active: true },
    Fri: { start: '09:00', end: '17:00', active: true },
    Sat: { start: '09:00', end: '17:00', active: false },
    Sun: { start: '09:00', end: '17:00', active: false },
    duration: 60
  });
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [smsPhone, setSmsPhone] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [meetingPurpose, setMeetingPurpose] = useState('');
  const [recordCall, setRecordCall] = useState(false);
  
  const [deletePostId, setDeletePostId] = useState<string | number | null>(null);
  const [editPostData, setEditPostData] = useState<{ id: string | number, content: string } | null>(null);

  const channelRef = useRef<any>(null);

  // ── Live Streaming (extracted to hook) ──
  const streaming = useStreaming({
    profileId: targetProfileId,
    isOwnProfile: !!isOwnProfile,
    user,
    supabase,
    channelRef,
  });
  const {
    isPlayingLive, setIsPlayingLive,
    isPubliclyLive, setIsPubliclyLive,
    liveCountdown,
    streamSource, setStreamSource,
    liveEmbedUrl, setLiveEmbedUrl,
    cameraStatus, cameraDebugData, localStream, videoRef,
    guests, setGuests,
    localGuestData, setLocalGuestData,
    guestSetup, setGuestSetup,
    presenterMode, setPresenterMode,
    directorLayout,
    livePrice, setLivePrice,
    hasPaidForLive, setHasPaidForLive,
    previewTimeLeft,
    isSubscribed, setIsSubscribed,
    subPrice, setSubPrice,
    pinnedProducts, setPinnedProducts,
    showTipModal, setShowTipModal,
    tipAmount, setTipAmount,
    showExitScreen, setShowExitScreen,
    isPreviewExpired,
    startLiveStream,
    stopLiveStream,
  } = streaming;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const postParam = params.get('post');

    if (postParam) {
      setActiveTab('feed');
    } else if (tabParam) {
      const validTabs = ['feed', 'store', 'live', 'booking', 'series', 'courses', 'wallet', 'flipbook', 'appearance', 'my_bookings', 'networks', 'members', 'community', 'security', 'crm', 'subscriptions'];
      if (validTabs.includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
    
    // Auto-mount as guest from invite links
    if (params.get('guest_invite') === 'true') {
      setActiveTab('live');
      setStreamSource('camera');
      setGuestSetup({ show: true, name: '', title: '' }); // Show Green Room Prompt
    }
  }, [location.search]);

  useEffect(() => {
    if (isNetworkLevel && wlConfig?.id) {
      const isMasterVibe = wlConfig.id === 'master' || wlConfig.domain === 'vibenetwork.tv' || wlConfig.domain === 'vibenetwork.com' || wlConfig.domain?.includes('vercel.app');
      
      const fetchProfiles = async () => {
        let currentWlProfiles: any[] = [];
        if (!isMasterVibe) {
          const { data } = await supabase.from('profiles')
            .select('id, username, avatar_url, role, created_at, whitelabel_id')
            .eq('whitelabel_id', wlConfig.id)
            .in('role', ['influencer', 'business']);
          if (data) currentWlProfiles = data;
        }

        const { data: vibeChannels } = await supabase.from('profiles')
          .select('id, username, avatar_url, role, created_at, whitelabel_id')
          .is('whitelabel_id', null)
          .in('role', ['influencer', 'business'])
          .order('created_at', { ascending: false })
          .limit(20);

        const vibeList = vibeChannels || [];

        // Combine them, making sure there are no duplicates by id
        const combined = [...currentWlProfiles];
        vibeList.forEach(p => {
          if (!combined.some(c => c.id === p.id)) {
            combined.push(p);
          }
        });

        setNetworkProfiles(combined);
      };

      fetchProfiles();
    }
  }, [isNetworkLevel, wlConfig?.id]);

  // Auto-rotate flipbook banner
  useEffect(() => {
    if (!flipbookImages) return;
    const images = flipbookImages.split(',').filter(Boolean);
    if (images.length <= 1) return;
    
    const int = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(int);
  }, [flipbookImages]);

  // Auto-rotate background banner
  useEffect(() => {
    if (!homepageImageUrl) return;
    const images = homepageImageUrl.split(',').filter(Boolean);
    if (images.length <= 1) return;
    
    const int = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(int);
  }, [homepageImageUrl]);

  // NOTE: Preview countdown, Supabase channel, heartbeat, camera init, PeerJS host,
  // and startLiveStream are all managed by the useStreaming hook above.

   const handleStripeCheckout = async (itemName: string, amount: number, extraMetadata?: any) => {
     try {
       // Pre-warm / load Stripe SDK lazily on checkout
       await getStripe();

       // In a production app, this endpoint would be your Supabase Edge Function
       // that creates the Stripe Checkout Session securely using the Stripe Secret Key.
       const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
         },
         body: JSON.stringify({
           productTitle: itemName,
           amount: amount, // Do not multiply by 100, edge function handles it
           creatorId: targetProfileId,
           returnUrl: window.location.href,
           extraMetadata
         })
       });
       
       const data = await response.json().catch(() => null);
       
       if (data && data.url) {
         window.location.href = data.url;
       } else {
         // Fallback for development before Edge Function is deployed
         toast.info(`[STRIPE READY]\n\nThe frontend is wired up! To complete the payment for:\n${itemName} ($${amount.toFixed(2)})\n\nyou just need to deploy the Supabase Edge Function to return a sessionId.`);
       }
     } catch (error) {
       console.error("Stripe Checkout Error:", error);
       toast.error(`[STRIPE READY]\n\nThe frontend is wired up! To complete the payment for:\n${itemName} ($${amount.toFixed(2)})\n\nyou just need to deploy the Supabase Edge Function to return a sessionId.`);
     }
   };

   const handleUnlockLive = () => {
     const amount = Number(livePrice);
     if (isNaN(amount) || amount <= 0) {
       setHasPaidForLive(true);
       return;
     }
     handleStripeCheckout('Live Stream PPV Unlock', amount);
   };

   const handleSubscribe = async () => {
     if (!user) {
       toast.info('Please log in or create an account to subscribe.');
       window.dispatchEvent(new CustomEvent('open_auth'));
       return;
     }
     setIsSubscribed(true);
     // Persist to Supabase (server-side) so it survives cache clears
     if (supabase && user && targetProfileId) {
       const { error } = await supabase.from('subscriptions').upsert({
         subscriber_id: user.id,
         creator_id: targetProfileId,
         status: 'active',
         price: Number(subPrice) || 0,
         created_at: new Date().toISOString(),
       }, { onConflict: 'subscriber_id,creator_id' });
       if (error) {
         console.warn('[Subscribe] Supabase upsert failed, using localStorage fallback:', error.message);
       }

       // ALSO save to user_follows table with type = 'subscribe'
       try {
         const wlId = (!wlConfig?.id || wlConfig.id === 'master') ? null : wlConfig.id;
         const insertData: any = {
           user_id: user.id,
           type: 'subscribe'
         };
         if (wlId && targetProfileId === wlConfig?.owner_id) {
           insertData.whitelabel_id = wlId;
         } else {
           insertData.target_profile_id = targetProfileId;
         }
         await supabase.from('user_follows').insert(insertData);

         // Auto-save subscriber as contact in Vibe CRM
         const { data: contact } = await supabase
           .from('crm_contacts')
           .insert({
             whitelabel_id: wlId,
             creator_id: targetProfileId,
             first_name: user.user_metadata?.username || 'Subscriber',
             last_name: '',
             email: user.email,
             source: 'subscription'
           })
           .select()
           .single();

         if (contact) {
           syncContactToExternalCrms(contact);
         }
       } catch (crmErr) {
         console.error("Auto-save CRM contact failed on subscribe:", crmErr);
       }
     }
     // Keep localStorage as fast local cache
     if (user && targetProfileId) {
       localStorage.setItem(`vibe_sub_${user.id}_${targetProfileId}`, 'true');
     }
     toast.success('Subscription activated!');
   };
  
  // Scheduler State & DnD Handlers
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('postId', id);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData('postId');
    setScheduledPosts(posts => 
      posts.map(p => p.id === postId ? { ...p, status: targetStatus } : p)
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNewSchedule = () => {
    const newId = Date.now().toString();
    setScheduledPosts([{
      id: newId,
      content: 'Start drafting your post idea...',
      status: 'draft',
      date: 'Just now',
      type: 'New Draft',
      color: 'var(--text-primary)'
    }, ...scheduledPosts]);
  };
  
  // UI States
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageTarget, setImageTarget] = useState<'avatar' | 'homepage'>('avatar');
  
  // Drag and Drop States
  const [isDraggingPostMedia, setIsDraggingPostMedia] = useState(false);
  const [isDraggingProductImg, setIsDraggingProductImg] = useState(false);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [isDraggingDirectAvatar, setIsDraggingDirectAvatar] = useState(false);
  const [isDraggingPostForm, setIsDraggingPostForm] = useState(false);

  // Scroll to shared post on mount/load
  useEffect(() => {
    if (!loading && feed.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const targetPostId = params.get('post');
      if (targetPostId) {
        let attempts = 0;
        const maxAttempts = 20; // Check every 250ms for up to 5 seconds
        
        const scrollInterval = setInterval(() => {
          const element = document.getElementById(`post-${targetPostId}`);
          attempts++;
          
          if (element) {
            clearInterval(scrollInterval);
            // Element found! Ensure it's rendered, and execute scroll
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Premium neon green dashed highlight animation!
              element.style.outline = '2px dashed #00ff88';
              element.style.boxShadow = '0 0 35px rgba(0, 255, 136, 0.4)';
              element.style.transition = 'all 0.3s ease';
              
              setTimeout(() => {
                element.style.outline = 'none';
                element.style.boxShadow = 'none';
              }, 3000);
            }, 100); // Tiny buffer to ensure layout is stable
          } else if (attempts >= maxAttempts) {
            clearInterval(scrollInterval);
            console.warn(`Could not locate target post element post-${targetPostId} after 5 seconds`);
          }
        }, 250);
        
        return () => clearInterval(scrollInterval);
      }
    }
  }, [loading, feed]);

  // Scroll and highlight storefront when shared
  useEffect(() => {
    if (!loading) {
      const params = new URLSearchParams(window.location.search);
      const isStoreTab = params.get('tab') === 'store';
      if (isStoreTab && activeTab === 'store') {
        setTimeout(() => {
          const element = document.getElementById('profile-storefront');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Premium neon gold highlight animation for storefront!
            element.style.outline = '2px dashed #FFD700';
            element.style.boxShadow = '0 0 35px rgba(255, 215, 0, 0.4)';
            element.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
              element.style.outline = 'none';
              element.style.boxShadow = 'none';
            }, 3000);
          }
        }, 800);
      }
    }
  }, [loading, activeTab]);

  useEffect(() => {
    if (activeTab !== 'series') {
      setSelectedSeriesForViewer(null);
    }
  }, [activeTab]);
  
  // New Post States
  const [postTitle, setPostTitle] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [requestFeature, setRequestFeature] = useState(false);
  const [postMediaUrls, setPostMediaUrls] = useState<string[]>([]);
  const [uploadingPostMedia, setUploadingPostMedia] = useState(false);
  const [postImageIndexes, setPostImageIndexes] = useState<Record<string | number, number>>({});
  
  // Interactions
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});

  // Store internal state MUST be above early returns!
  const [newProduct, setNewProduct] = useState({ title: '', price: '19.99', type: 'digital', image_url: '', sizes: '', colors: '', is_clothing: false });
  const [courses, setCourses] = useState<any[]>([]);
  const [purchasedBookings, setPurchasedBookings] = useState<any[]>([]);
  const [receivedBookings, setReceivedBookings] = useState<any[]>([]);
  const [newCourse, setNewCourse] = useState({ title: '', price: '', modules: '', hours: '', img: '' });
  const [uploadingProductImg, setUploadingProductImg] = useState(false);
  const [myNetworks, setMyNetworks] = useState<any[]>([]);



  // Series Data
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [newSeries, setNewSeries] = useState({ title: '', description: '', price: '', img: '', billing_level: 'series', subscriber_free: false, subscriber_price: '' });
  const [newEpisode, setNewEpisode] = useState({ title: '', description: '', length: '', price: '', video_url: '', thumbnail_url: '', genre: '', rating: '', subscriber_free: false, subscriber_price: '' });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [uploadingSeriesImg, setUploadingSeriesImg] = useState(false);
  const [isDraggingSeriesImg, setIsDraggingSeriesImg] = useState(false);
  const [uploadingEpisodeImg, setUploadingEpisodeImg] = useState(false);
  const [isDraggingEpisodeImg, setIsDraggingEpisodeImg] = useState(false);
  const [activeSeriesIdForEp, setActiveSeriesIdForEp] = useState<string | null>(null);
  const [editingSeries, setEditingSeries] = useState<any | null>(null);
  const [showEditSeriesModal, setShowEditSeriesModal] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<any | null>(null);
  const [showEditEpisodeModal, setShowEditEpisodeModal] = useState(false);
  const [uploadingEditSeriesImg, setUploadingEditSeriesImg] = useState(false);
  const [uploadingEditEpisodeImg, setUploadingEditEpisodeImg] = useState(false);
  const [uploadingEditEpisodeVideo, setUploadingEditEpisodeVideo] = useState(false);

  // Slow Upload Loader State & Effect
  const [showUploadLoader, setShowUploadLoader] = useState(false);

  useEffect(() => {
    const isUploading = uploadingPostMedia || uploadingProductImg || uploadingVideo || uploadingSeriesImg || uploadingEpisodeImg || saving;
    if (!isUploading) {
      setShowUploadLoader(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowUploadLoader(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [uploadingPostMedia, uploadingProductImg, uploadingVideo, uploadingSeriesImg, uploadingEpisodeImg, saving]);

  useEffect(() => {
    if (!targetProfileId && !isNetworkLevel) {
      navigate({ pathname: '/', search: location.search });
      return;
    }

    async function loadProfile() {
      // Phase 1: Core Identity (Blocks UI)
      // If isNetworkLevel is true and we have a wlConfig.id, load the profile associated with this whitelabel config
      let profilePromise;
      if (isNetworkLevel && wlConfig?.id) {
        profilePromise = supabase!.from('profiles')
          .select('*')
          .eq('whitelabel_id', wlConfig.id)
          .eq('role', 'influencer')
          .maybeSingle()
          .then(async ({ data: infData, error: infErr }) => {
            if (!infErr && infData) return { data: infData, error: null };
            return supabase!.from('profiles').select('*').eq('whitelabel_id', wlConfig.id).limit(1).single();
          });
      } else if (targetProfileId) {
        profilePromise = supabase!.from('profiles').select('*').eq('id', targetProfileId).single();
      } else {
        profilePromise = supabase!.from('profiles').select('*').eq('id', 'none').single();
      }

      let postsQuery = supabase!.from('posts').select('*, creator:profiles!inner(username, avatar_url, whitelabel_id), post_likes(user_id), post_comments(*, user:profiles(username, avatar_url))');
      if (isNetworkLevel && wlConfig?.id) postsQuery = postsQuery.eq('creator.whitelabel_id', wlConfig.id).eq('is_locked', false);
      else postsQuery = postsQuery.eq('creator_id', targetProfileId);
      const postsPromise = postsQuery
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);

      const [{ data, error }, { data: postsDataRaw, error: postsError }] = await Promise.all([
        profilePromise,
        postsPromise
      ]);

      if (!error && data) {
        const loadedProfileId = data.id;
        const isOwn = user && loadedProfileId === user.id;
        setViewMode(isOwn ? 'edit' : 'public');

        setProfile(data);
        setBio(data.bio !== null && data.bio !== undefined ? data.bio : (wlConfig?.theme?.defaultBio || 'Welcome to my official channel!'));
        setAvatarUrl(data.avatar_url || '');
        setHomepageImageUrl(data.homepage_image_url || '');
        setFlipbookImages(data.flipbook_images || wlConfig?.theme?.flipbook_images || '');
        setRefundPolicy(data.refund_policy || wlConfig?.theme?.refund_policy || 'All sales are final. No refunds are provided for digital downloads or virtual bookings. For physical merchandise, please contact the creator directly.');
        if (data.genre) setSelectedGenre(data.genre);
        if (data.sub_price != null) setSubPrice(String(data.sub_price));
        if (data.booking_price !== undefined && data.booking_price !== null) setBookingPrice(String(data.booking_price));
        if (data.booking_availability) setBookingAvailability(data.booking_availability);
        if (data.sms_enabled !== undefined && data.sms_enabled !== null) setSmsEnabled(data.sms_enabled);
        if (data.sms_phone !== undefined && data.sms_phone !== null) setSmsPhone(data.sms_phone);
        if (user) {
          // Check Supabase first (survives cache clears), localStorage as fallback
          const localSub = localStorage.getItem(`vibe_sub_${user.id}_${loadedProfileId}`) === 'true';
          setIsSubscribed(localSub); // Fast local cache while Supabase loads
          if (supabase) {
            supabase.from('subscriptions')
              .select('status')
              .eq('subscriber_id', user.id)
              .eq('creator_id', loadedProfileId)
              .eq('status', 'active')
              .maybeSingle()
              .then(({ data: subData }: any) => {
                const isActive = !!subData;
                setIsSubscribed(isActive);
                // Sync localStorage cache with server truth
                if (isActive) {
                  localStorage.setItem(`vibe_sub_${user.id}_${loadedProfileId}`, 'true');
                } else {
                  localStorage.removeItem(`vibe_sub_${user.id}_${loadedProfileId}`);
                }
              });
          }
        } else {
          setIsSubscribed(false);
        }


        let postsData = postsDataRaw;
        if (postsError) {
             let fallbackQuery = supabase!.from('posts').select('*, creator:profiles!inner(username, avatar_url, whitelabel_id)');
             if (isNetworkLevel && wlConfig?.id) fallbackQuery = fallbackQuery.eq('creator.whitelabel_id', wlConfig.id).eq('is_locked', false);
             else fallbackQuery = fallbackQuery.eq('creator_id', loadedProfileId);
             
             const fallback = await fallbackQuery
               .order('is_pinned', { ascending: false })
               .order('created_at', { ascending: false });
             postsData = fallback.data;
        }

        if (postsData && postsData.length > 0) {
          setFeed(postsData.map((p: any) => {
            const creatorObj = Array.isArray(p.creator) ? p.creator[0] : p.creator;
            
            // Handle multiple images stored as JSON array string or comma separated
            let imgsList: string[] = [];
            if (p.image_url) {
              if (p.image_url.startsWith('[') && p.image_url.endsWith(']')) {
                try {
                  imgsList = JSON.parse(p.image_url);
                } catch {
                  imgsList = [p.image_url];
                }
              } else if (p.image_url.includes(',')) {
                imgsList = p.image_url.split(',').map((url: string) => url.trim());
              } else {
                imgsList = [p.image_url];
              }
            }

            return {
              id: p.id,
              title: p.content || p.title,
              locked: p.is_locked || false,
              likes: p.post_likes ? p.post_likes.length : (p.likes || 0),
              hasLiked: p.post_likes ? p.post_likes.some((l: any) => l.user_id === user?.id) : false,
              comments: p.post_comments ? p.post_comments.map((c: any) => {
                const userObj = Array.isArray(c.user) ? c.user[0] : c.user;
                return { id: c.id, text: c.content, user: userObj?.username || 'User', avatar: userObj?.avatar_url || '' };
              }) : [],
              date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Just now',
              img: imgsList[0] || null,
              imgs: imgsList,
              creator_id: p.creator_id,
              creator_username: creatorObj?.username,
              creator_avatar: creatorObj?.avatar_url,
              is_pinned: p.is_pinned || false
            };
          }));
        } else {
          setFeed([]);
        }

        setLoading(false); // UI instantly unblocks here!

        // Phase 2: Lazy Loaded Background Data
        const loadSecondaryData = async () => {
          let userProfileWlId = null;
          if (user) {
            try {
              const { data: userProf } = await supabase!.from('profiles').select('whitelabel_id').eq('id', user.id).maybeSingle();
              if (userProf?.whitelabel_id) {
                userProfileWlId = userProf.whitelabel_id;
              }
            } catch (err) {
              console.warn('Failed to load user whitelabel_id for networks filter', err);
            }
          }

          let prodQuery = supabase!.from('products').select(isNetworkLevel ? '*, creator:profiles!inner(username, avatar_url, whitelabel_id)' : '*');
          if (isNetworkLevel) {
            const isMasterPlatform = !wlConfig || wlConfig.id === 'master' || wlConfig.domain === 'vibenetwork.tv' || wlConfig.domain === 'vibenetwork.com' || wlConfig.domain?.includes('vercel.app');
            if (wlConfig?.domain && !isMasterPlatform) prodQuery = prodQuery.eq('creator.whitelabel_id', wlConfig.id);
          } else {
            prodQuery = prodQuery.eq('creator_id', loadedProfileId);
          }
          const productsPromise = prodQuery.order('created_at', { ascending: false });

          const seriesPromise = supabase!.from('series').select('*, episodes(*)').eq('creator_id', loadedProfileId);
          const coursesPromise = supabase!.from('courses').select('*').eq('creator_id', loadedProfileId);
          const slotsPromise = supabase!.from('available_slots').select('*').eq('creator_id', loadedProfileId).eq('is_booked', false);

          const pBookingsPromise = user ? supabase!.from('bookings').select('*, creator:profiles!creator_id(username, full_name, avatar_url)').eq('buyer_id', user.id) : Promise.resolve({ data: null });
          
          let networksPromise;
          if (user) {
            let q = supabase!.from('whitelabel_configs').select('*');
            if (userProfileWlId) {
              q = q.or(`owner_id.eq.${user.id},id.eq.${userProfileWlId}`);
            } else {
              q = q.eq('owner_id', user.id);
            }
            networksPromise = q;
          } else {
            networksPromise = Promise.resolve({ data: null });
          }

          const rBookingsPromise = (isOwn && user) ? supabase!.from('bookings').select('*, buyer:profiles!buyer_id(username, full_name, avatar_url)').eq('creator_id', user.id) : Promise.resolve({ data: null });
          const progressPromise = user ? supabase!.from('user_course_progress').select('*').eq('user_id', user.id) : Promise.resolve({ data: null });

          const [
            { data: prodData },
            { data: seriesData },
            { data: coursesData },
            { data: pBookings },
            { data: networks },
            { data: rBookings },
            { data: slotsData },
            { data: progressData }
          ] = await Promise.all([
            productsPromise,
            seriesPromise,
            coursesPromise,
            pBookingsPromise,
            networksPromise,
            rBookingsPromise,
            slotsPromise,
            progressPromise
          ]);

          setProducts(prodData || []);
          setSeriesList(seriesData || []);
          setCourses(coursesData || []);

          if (progressData) {
            const map: Record<string, number[]> = {};
            progressData.forEach((row: any) => {
              map[row.course_id] = row.completed_modules || [];
            });
            setCourseProgressMap(map);
          }

          const formattedSlots: Record<number, string[]> = {};
          if (slotsData) {
            slotsData.forEach((row: any) => {
              const d = row.date;
              if (!formattedSlots[d]) {
                formattedSlots[d] = [];
              }
              formattedSlots[d].push(row.time);
            });
            // Sort times for each date to maintain a neat visual structure
            Object.keys(formattedSlots).forEach((k: any) => {
              formattedSlots[k].sort();
            });
          }
          setAvailableSlots(formattedSlots);

          if (user) {
             setPurchasedBookings(pBookings || []);
             const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
             const myLocal = localNetworks.filter((n: any) => n.owner_id === user.id);
             const combined = [...(networks || [])];
             myLocal.forEach((ln: any) => {
                if (!combined.find(n => n.id === ln.id)) combined.push(ln);
             });
             const activeOnly = combined.filter((n: any) => n.is_active !== false && n.theme?.is_active !== false);
             setMyNetworks(activeOnly);
          }

          if (isOwn && user) {
             setReceivedBookings(rBookings || []);
          }
        };

        loadSecondaryData();

      } else if (user && targetProfileId === user.id) {
        // Auto-create profile if missing!
        const { data: newProfile, error: insertError } = await supabase!.from('profiles').insert({
           id: targetProfileId,
           username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'NewCreator',
           bio: wlConfig?.theme?.defaultBio || 'Welcome to my official channel!',
           role: user?.user_metadata?.role || 'viewer',
           whitelabel_id: (!wlConfig || wlConfig.id === 'master' || wlConfig.domain === 'vibenetwork.tv' || wlConfig.domain === 'vibenetwork.com' || wlConfig.domain?.includes('vercel.app')) ? null : wlConfig?.id
        }).select().single();
        
        if (!insertError && newProfile) {        
          setProfile(newProfile);
          setBio(newProfile.bio);
          setAvatarUrl('');
          setHomepageImageUrl('');
          setFlipbookImages('');
          setSelectedGenre(newProfile.genre);
          setSubPrice(4.99);
          setProducts([]);
          setFeed([]);
          setSeriesList([]);
          setCourses([]);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user, creatorId, navigate]);

  // Vibe Drive Helpers
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const fetchDriveFiles = async () => {
    if (!profile?.id) return;
    const { data, error } = await supabase!
      .from('drive_files')
      .select('*')
      .eq('creator_id', profile.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setDriveFiles(data);
      try {
        const filePaths = data.map((f: any) => f.file_path);
        if (filePaths.length > 0) {
          const { data: signedData, error: signedError } = await supabase!
            .storage
            .from('vibe-drive')
            .createSignedUrls(filePaths, 3600);
          if (!signedError && signedData) {
            const urlMap: Record<string, string> = {};
            signedData.forEach((item: any) => {
              if (item.signedUrl) {
                urlMap[item.path] = item.signedUrl;
              }
            });
            setDriveUrls(urlMap);
          }
        }
      } catch (err) {
        console.warn("Failed to batch fetch signed URLs:", err);
      }
    }
  };

  const handleViewDriveFile = async (file: any) => {
    try {
      if (driveUrls[file.file_path]) {
        setPreviewUrl(driveUrls[file.file_path]);
        setPreviewFile(file);
        return;
      }
      
      const { data, error } = await supabase!
        .storage
        .from('vibe-drive')
        .createSignedUrl(file.file_path, 3600);
      
      if (error || !data?.signedUrl) {
        throw error || new Error("Failed to generate preview URL");
      }
      
      setPreviewUrl(data.signedUrl);
      setPreviewFile(file);
    } catch (err: any) {
      console.error("Preview error:", err);
      toast.error(`Preview failed: ${err.message || "Unauthorized"}`);
    }
  };

  const handleDownloadDriveFile = async (file: any) => {
    try {
      const { data, error } = await supabase!
        .storage
        .from('vibe-drive')
        .createSignedUrl(file.file_path, 3600);
      
      if (error || !data?.signedUrl) {
        throw error || new Error("Failed to generate download URL");
      }
      
      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = file.name;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(`Downloading ${file.name}...`);
    } catch (err: any) {
      console.error("Download error:", err);
      toast.error(`Download failed: ${err.message || "Unauthorized"}`);
    }
  };

  const handleDeleteDriveFile = async (file: any) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;
    
    try {
      const { error: storageError } = await supabase!
        .storage
        .from('vibe-drive')
        .remove([file.file_path]);
      
      if (storageError) {
        console.warn("Storage deletion warning:", storageError.message);
      }
      
      const { error: dbError } = await supabase!
        .from('drive_files')
        .delete()
        .eq('id', file.id);
      
      if (dbError) throw dbError;
      
      const newUsed = Math.max(0, (profile?.storage_used_bytes || 0) - file.size_bytes);
      await supabase!
        .from('profiles')
        .update({ storage_used_bytes: newUsed })
        .eq('id', profile.id);
      
      setProfile((prev: any) => prev ? { ...prev, storage_used_bytes: newUsed } : null);
      
      toast.success("File deleted successfully");
      fetchDriveFiles();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(`Failed to delete file: ${err.message}`);
    }
  };

  const handleUploadDriveFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUploadFile || !profile?.id) return;
    
    const fileSize = driveUploadFile.size;
    const currentUsed = profile.storage_used_bytes || 0;
    const limit = profile.storage_limit_bytes || 10737418240; // 10 GB
    
    if (currentUsed + fileSize > limit) {
      toast.error("Upload blocked: This file exceeds your storage limit. Please upgrade your plan!");
      return;
    }
    
    setUploadingDriveFile(true);
    
    try {
      const fileExt = driveUploadFile.name.split('.').pop() || 'bin';
      const fileId = crypto.randomUUID();
      const sanitizedName = driveUploadName.trim() || driveUploadFile.name;
      const dbFileName = sanitizedName.endsWith('.' + fileExt) ? sanitizedName : `${sanitizedName}.${fileExt}`;
      const filePath = `${profile.id}/${fileId}.${fileExt}`;
      
      const { error: uploadError } = await supabase!
        .storage
        .from('vibe-drive')
        .upload(filePath, driveUploadFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      let catType = 'other';
      const mime = driveUploadFile.type.toLowerCase();
      if (mime.startsWith('image/')) catType = 'image';
      else if (mime.startsWith('video/')) catType = 'video';
      else if (mime.startsWith('audio/')) catType = 'audio';
      else if (mime.includes('pdf')) catType = 'pdf';
      else if (mime.includes('zip') || mime.includes('tar') || mime.includes('rar')) catType = 'archive';
      else if (mime.includes('text') || mime.includes('word') || mime.includes('excel') || mime.includes('powerpoint')) catType = 'document';
      
      const { error: dbError } = await supabase!
        .from('drive_files')
        .insert({
          id: fileId,
          name: dbFileName,
          file_path: filePath,
          file_type: catType,
          size_bytes: fileSize,
          creator_id: profile.id,
          whitelabel_id: (!wlConfig || wlConfig.id === 'master') ? null : wlConfig.id,
          access_level: driveUploadAccessLevel
        });
      
      if (dbError) throw dbError;
      
      const newUsed = currentUsed + fileSize;
      await supabase!
        .from('profiles')
        .update({ storage_used_bytes: newUsed })
        .eq('id', profile.id);
      
      setProfile((prev: any) => prev ? { ...prev, storage_used_bytes: newUsed } : null);
      
      toast.success("File uploaded successfully!");
      setShowDriveUploadModal(false);
      setDriveUploadFile(null);
      setDriveUploadName('');
      fetchDriveFiles();
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploadingDriveFile(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'flipbook' && profile?.id) {
      fetchDriveFiles();
    }
  }, [activeTab, profile?.id]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>Loading Profile...</div>;
  const isGuestInvite = new URLSearchParams(location.search).get('guest_invite') === 'true';
  if (!profile && !isGuestInvite && !isNetworkLevel) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', background: 'var(--bg-color)' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Profile Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>This channel doesn't exist, or the user hasn't set up their profile yet.</p>
      <button onClick={() => navigate({ pathname: '/', search: location.search })} style={{ padding: '12px 30px', background: '#ff4d85', color: 'var(--text-primary)', border: 'none', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}>Return to Home</button>
    </div>
  );

  const isProfileDeactivated = profile && (profile.is_active === false || wlConfig?.theme?.deactivated_creators?.includes(profile.id));

  if (isProfileDeactivated && !isOwnProfile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', background: 'var(--bg-color)', textAlign: 'center', padding: '20px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <AlertCircle size={32} />
        </div>
        <h2 style={{ fontSize: '32px', marginBottom: '10px', fontWeight: 800 }}>Channel Suspended</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '400px', lineHeight: 1.6 }}>This channel has been deactivated by the platform administrator.</p>
        <button onClick={() => navigate({ pathname: '/', search: location.search })} style={{ padding: '12px 30px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Return to Home</button>
      </div>
    );
  }

  const isInfluencer = profile?.role === 'influencer' || profile?.role === 'business';

  const handleImageClick = async () => {
    setImageTarget('avatar');
    setShowImageModal(true);
  };

  const handleFileUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      setSaving(true);
      
      // AI aspect ratio crop and enhance
      toast.info(`✨ Nalu AI is enhancing and auto-cropping your ${imageTarget === 'avatar' ? 'avatar/logo' : 'background banner'}...`);
      const enhancedFile = await processAndEnhanceImage(file, imageTarget === 'avatar' ? 'avatar' : 'homepage');

      const fileExt = enhancedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;
      
      const { error: uploadError } = await supabase!.storage.from('images').upload(filePath, enhancedFile);
      if (uploadError) throw uploadError;
      
      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      
      if (imageTarget === 'avatar') {
        setAvatarUrl(data.publicUrl);
        await supabase!.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user.id);
        setProfile((prev: any) => prev ? { ...prev, avatar_url: data.publicUrl } : null);
        
        const shouldSync = (isNetworkLevel || user?.id === wlConfig?.owner_id) && wlConfig?.id;
        if (shouldSync) {
           const currentTheme = wlConfig.theme || {};
           supabase!.from('whitelabel_configs').update({ logo: data.publicUrl, theme: { ...currentTheme, logoImage: data.publicUrl } }).eq('id', wlConfig.id).then();
        }
      } else if (imageTarget === 'homepage') {
        const newUrls = homepageImageUrl ? homepageImageUrl + ',' + data.publicUrl : data.publicUrl;
        await supabase!.from('profiles').update({ homepage_image_url: newUrls }).eq('id', user.id);
        setHomepageImageUrl(newUrls);
        setProfile((p: any) => p ? { ...p, homepage_image_url: newUrls } : null);
        
        const shouldSync = (isNetworkLevel || user?.id === wlConfig?.owner_id) && wlConfig?.id;
        if (shouldSync) {
           const currentTheme = wlConfig.theme || {};
           await supabase!.from('whitelabel_configs').update({ theme: { ...currentTheme, heroImage: data.publicUrl } }).eq('id', wlConfig.id);
        }
      }
      setShowImageModal(false);
    } catch (error: any) {
      toast.error('Error uploading image: ' + error.message + '\n\nDid you run the storage_buckets.sql script?');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    
    const updatePayload = {
      bio,
      avatar_url: avatarUrl,
      homepage_image_url: homepageImageUrl,
    };

    // Attempt to update all fields on profiles table (handles migrated DBs)
    const { error: initialError } = await supabase!.from('profiles').update({
      ...updatePayload,
      flipbook_images: flipbookImages,
      refund_policy: refundPolicy,
    }).eq('id', user.id);

    let error = initialError;
    let fallbackUsed = false;

    // If it failed because columns don't exist, fallback to only existing columns
    if (initialError && (initialError.message.includes('column') || initialError.message.includes('schema cache'))) {
      console.warn("Retrying profile update without flipbook_images and refund_policy columns...");
      const { error: retryError } = await supabase!.from('profiles').update(updatePayload).eq('id', user.id);
      error = retryError;
      fallbackUsed = !retryError;
    }

    // Sync flipbook_images and refund_policy to whitelabel_configs.theme if user is WL owner or network level
    let wlError = null;
    if (!error) {
      const isWlOwner = wlConfig && (user.id === wlConfig.owner_id || isNetworkLevel);
      if (isWlOwner && wlConfig.id) {
        const updatedTheme = {
          ...(wlConfig.theme || {}),
          flipbook_images: flipbookImages,
          refund_policy: refundPolicy,
        };
        const { error: themeError } = await supabase!.from('whitelabel_configs').update({
          theme: updatedTheme
        }).eq('id', wlConfig.id);
        
        if (themeError) {
          console.warn("Failed to sync branding settings to whitelabel config:", themeError.message);
          wlError = themeError;
        } else {
          wlConfig.theme = updatedTheme;
        }
      }
    }

    setSaving(false);
    
    if (error) {
      console.error("Save profile error:", error);
      toast.error(`Failed to save profile: ${error.message}`);
    } else {
      toast.success('Profile successfully saved to network database!');
      if (wlError) {
        toast.warning('Note: Custom branding and refund policy could not be synced.');
      }
    }
  };

  const saveBookingSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase!.from('profiles').update({
        booking_price: Number(bookingPrice),
        booking_availability: bookingAvailability,
        sms_enabled: smsEnabled,
        sms_phone: smsPhone
      }).eq('id', user.id);

      if (error) {
        toast.error(`Failed to save booking settings: ${error.message}`);
      } else {
        toast.success("Booking settings saved successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save booking settings");
    } finally {
      setSaving(false);
    }
  };

  const getScheduledAtISO = (slotDate: number, slotTime: string): string => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth(); // 0-indexed
    
    // If the slot date is less than today's date, it must be for next month!
    if (slotDate < now.getDate()) {
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
    }

    // Parse time: "10:00 AM" or "2:30 PM"
    const [timePart, ampm] = slotTime.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const scheduledDate = new Date(year, month, slotDate, hours, minutes, 0);
    return scheduledDate.toISOString();
  };

  const handleProductImageUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      setUploadingProductImg(true);
      
      toast.info("✨ Nalu AI is enhancing and auto-cropping your product photo...");
      const enhancedFile = await processAndEnhanceImage(file, 'product');

      const filePath = `${user?.id}/prod_${Math.random()}.${enhancedFile.name.split('.').pop()}`;
      await supabase!.storage.from('images').upload(filePath, enhancedFile);
      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      setNewProduct(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch {
      toast.error('Upload failed. Did you run the storage buckets script?');
    } finally {
      setUploadingProductImg(false);
    }
  };

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeries.title) return;
    setSaving(true);
    
    const priceVal = (newSeries.billing_level === 'series' && newSeries.price) ? parseFloat(newSeries.price) : 0;
    const insertData = {
      creator_id: profile.id,
      title: newSeries.title,
      description: newSeries.description,
      price: priceVal,
      img: newSeries.img || '',
      billing_level: newSeries.billing_level,
      subscriber_free: priceVal === 0 ? true : newSeries.subscriber_free,
      subscriber_price: (newSeries.billing_level === 'series' && newSeries.subscriber_price) ? parseFloat(newSeries.subscriber_price) : null
    };

    try {
      const { data, error } = await supabase!.from('series').insert([insertData]).select();
      if (!error && data) {
        setSeriesList([{ ...data[0], episodes: [] }, ...seriesList]);
      } else {
        setSeriesList([{ ...insertData, id: Date.now().toString(), episodes: [] }, ...seriesList]);
      }
    } catch {
      setSeriesList([{ ...insertData, id: Date.now().toString(), episodes: [] }, ...seriesList]);
    }
    setNewSeries({ title: '', description: '', price: '', img: '', billing_level: 'series', subscriber_free: false, subscriber_price: '' });
    setSaving(false);
  };

  const handleSeriesCoverUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      setUploadingSeriesImg(true);
      
      toast.info("✨ Nalu AI is enhancing and auto-cropping your series cover...");
      const enhancedFile = await processAndEnhanceImage(file, 'hero'); // 16:9 aspect ratio

      const filePath = `${user?.id}/series_${Math.random()}.${enhancedFile.name.split('.').pop()}`;
      await supabase!.storage.from('images').upload(filePath, enhancedFile);
      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      setNewSeries(prev => ({ ...prev, img: data.publicUrl }));
      toast.success('Series cover uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Series cover upload failed: ' + (err.message || 'Storage error'));
    } finally {
      setUploadingSeriesImg(false);
    }
  };

  const handleEpisodeCoverUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      setUploadingEpisodeImg(true);
      
      toast.info("✨ Nalu AI is enhancing and auto-cropping your episode cover...");
      const enhancedFile = await processAndEnhanceImage(file, 'hero'); // 16:9 aspect ratio

      const filePath = `${user?.id}/ep_cover_${Math.random()}.${enhancedFile.name.split('.').pop()}`;
      await supabase!.storage.from('images').upload(filePath, enhancedFile);
      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      setNewEpisode(prev => ({ ...prev, thumbnail_url: data.publicUrl }));
      toast.success('Episode cover uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Episode cover upload failed: ' + (err.message || 'Storage error'));
    } finally {
      setUploadingEpisodeImg(false);
    }
  };

  const handleVideoFileUpload = async (file: File) => {
    if (!file) return;
    setUploadingVideo(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `episodes/video_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase!.storage.from('videos').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase!.storage.from('videos').getPublicUrl(filePath);
      if (data && data.publicUrl) {
        setNewEpisode(prev => ({ ...prev, video_url: data.publicUrl }));
        toast.success('Video uploaded successfully!');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Video upload failed: ' + (err.message || 'Storage error'));
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleAddEpisode = async (seriesId: string) => {
    if (!newEpisode.title || !newEpisode.video_url) {
      toast.error('Episode Title and Video are required.');
      return;
    }
    
    const insertData = {
      series_id: seriesId,
      title: newEpisode.title,
      description: newEpisode.description,
      length: newEpisode.length,
      price: parseFloat(newEpisode.price || '0'),
      video_url: newEpisode.video_url || '',
      thumbnail_url: newEpisode.thumbnail_url || '',
      genre: newEpisode.genre || '',
      rating: newEpisode.rating || '',
      subscriber_free: newEpisode.subscriber_free,
      subscriber_price: newEpisode.subscriber_price ? parseFloat(newEpisode.subscriber_price) : null
    };

    try {
      const { data, error } = await supabase!.from('episodes').insert([insertData]).select();
      if (error) {
        console.error('Error inserting episode:', error);
        toast.error('Failed to save episode to database: ' + error.message);
        return;
      }
      if (!data || data.length === 0) {
        toast.error('No data returned from database insert.');
        return;
      }
      
      const epToAdd = data[0];
      
      setSeriesList(prev => prev.map(s => {
        if (s.id === seriesId) return { ...s, episodes: [...(s.episodes || []), epToAdd] };
        return s;
      }));

      if (epToAdd && epToAdd.id && epToAdd.video_url) {
        supabase!.functions.invoke('transcode-video', {
          body: { episodeId: epToAdd.id, videoUrl: epToAdd.video_url }
        }).then(({ data: tcData, error: tcErr }) => {
          if (tcErr) {
            console.error('Transcode trigger error:', tcErr);
          } else if (tcData && tcData.video_url) {
            setSeriesList(prev => prev.map(s => {
              if (s.id === seriesId) {
                return {
                  ...s,
                  episodes: (s.episodes || []).map((ep: any) => 
                    ep.id === epToAdd.id ? { ...ep, video_url: tcData.video_url } : ep
                  )
                };
              }
              return s;
            }));
            if (tcData.message && tcData.message.includes('Mux')) {
              toast.success('Video sent for MP4 transcoding successfully! 🎬');
            }
          }
        });
      }
    } catch (err: any) {
      console.error('Unexpected error inserting episode:', err);
      toast.error('An unexpected error occurred: ' + (err.message || 'Unknown error'));
    }
    setNewEpisode({ title: '', description: '', length: '', price: '', video_url: '', thumbnail_url: '', genre: '', rating: '', subscriber_free: false, subscriber_price: '' });
    setActiveSeriesIdForEp(null);
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.price) return;
    setSaving(true);
    
    const insertData = {
      creator_id: profile.id,
      title: newCourse.title,
      price: parseFloat(newCourse.price),
      modules: parseInt(newCourse.modules || '10'),
      hours: newCourse.hours || '5.0',
      img: newCourse.img || ''
    };

    try {
      const { data, error } = await supabase!.from('courses').insert([insertData]).select();
      if (!error && data) {
        setCourses(prev => [...prev, data[0]]);
      } else {
        setCourses(prev => [...prev, { ...insertData, id: 'c_' + Date.now(), progress: 0 }]);
      }
    } catch {
      setCourses(prev => [...prev, { ...insertData, id: 'c_' + Date.now(), progress: 0 }]);
    }
    setNewCourse({ title: '', price: '', modules: '', hours: '', img: '' });
    setSaving(false);
  };

  // Upgrades Helper Handlers
  const handleEnrollSimulation = (course: any) => {
    const updatedPurchases = [...purchasedCourseIds, course.id];
    setPurchasedCourseIds(updatedPurchases);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibe_purchased_courses', JSON.stringify(updatedPurchases));
    }
    toast.success(`Successfully enrolled in ${course.title}!`);
    setActiveCoursePlayer(course);
  };

  const handleToggleModuleProgress = async (courseId: string, moduleIndex: number) => {
    if (!user) {
      toast.error('You must be logged in to save progress.');
      return;
    }
    const currentCompleted = courseProgressMap[courseId] || [];
    let updatedCompleted: number[];

    if (currentCompleted.includes(moduleIndex)) {
      updatedCompleted = currentCompleted.filter(m => m !== moduleIndex);
    } else {
      updatedCompleted = [...currentCompleted, moduleIndex];
    }

    setCourseProgressMap(prev => ({
      ...prev,
      [courseId]: updatedCompleted
    }));

    try {
      const { error } = await supabase!
        .from('user_course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          completed_modules: updatedCompleted,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,course_id' });

      if (error) {
        console.error('Progress upsert error:', error);
        toast.error('Stored progress locally.');
      } else {
        toast.success(updatedCompleted.includes(moduleIndex) ? `Module ${moduleIndex} completed! 🎉` : `Module ${moduleIndex} unchecked.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuySeasonSimulation = (series: any) => {
    let finalPrice = parseFloat(series.price || '0');
    let discountMsg = '';

    if (isSubscribed) {
      if (series.subscriber_free) {
        finalPrice = 0;
        discountMsg = ' (Free Subscriber Access!)';
      } else if (series.subscriber_price !== null && series.subscriber_price !== undefined && series.subscriber_price !== '') {
        finalPrice = parseFloat(series.subscriber_price);
        discountMsg = ` (Subscriber Discount Applied! Saved $${(parseFloat(series.price || '0') - finalPrice).toFixed(2)})`;
      }
    }

    const updated = [...purchasedSeasons, series.id];
    setPurchasedSeasons(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibe_purchased_seasons', JSON.stringify(updated));
    }
    toast.success(`Successfully purchased Season Pass for ${series.title} for $${finalPrice.toFixed(2)}${discountMsg}! 🎉`);
    setActiveCinemaSeries(series);
    setActiveCinemaEpisode(series.episodes?.[0] || null);
    setShowCinemaModal(true);
  };

  const handleBuyEpisodeSimulation = (episode: any, series: any) => {
    let finalPrice = parseFloat(episode.price || '0');
    let discountMsg = '';

    if (isSubscribed) {
      if (episode.subscriber_free) {
        finalPrice = 0;
        discountMsg = ' (Free Subscriber Access!)';
      } else if (episode.subscriber_price !== null && episode.subscriber_price !== undefined && episode.subscriber_price !== '') {
        finalPrice = parseFloat(episode.subscriber_price);
        discountMsg = ` (Subscriber Discount Applied! Saved $${(parseFloat(episode.price || '0') - finalPrice).toFixed(2)})`;
      }
    }

    const updated = [...purchasedEpisodes, episode.id];
    setPurchasedEpisodes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vibe_purchased_episodes', JSON.stringify(updated));
    }
    toast.success(`Successfully purchased Episode: ${episode.title} for $${finalPrice.toFixed(2)}${discountMsg}! 🎬`);
    setActiveCinemaSeries(series);
    setActiveCinemaEpisode(episode);
    setShowCinemaModal(true);
  };

  const handleUpdateSeries = async (updatedSeries: any) => {
    setSaving(true);
    try {
      const billingLevel = updatedSeries.billing_level || 'series';
      const isSeriesLevel = billingLevel === 'series';
      const { error } = await supabase!
        .from('series')
        .update({
          title: updatedSeries.title,
          description: updatedSeries.description,
          price: isSeriesLevel ? parseFloat(updatedSeries.price || '0') : 0,
          img: updatedSeries.img,
          billing_level: billingLevel,
          subscriber_free: updatedSeries.subscriber_free,
          subscriber_price: (isSeriesLevel && updatedSeries.subscriber_price) ? parseFloat(updatedSeries.subscriber_price) : null
        })
        .eq('id', updatedSeries.id);

      if (error) {
        toast.error('Error updating series: ' + error.message);
      } else {
        toast.success('Series updated successfully!');
        
        setSeriesList(prev => prev.map(s => {
          if (s.id === updatedSeries.id) {
            return {
              ...s,
              title: updatedSeries.title,
              description: updatedSeries.description,
              price: isSeriesLevel ? parseFloat(updatedSeries.price || '0') : 0,
              img: updatedSeries.img,
              billing_level: billingLevel,
              subscriber_free: updatedSeries.subscriber_free,
              subscriber_price: (isSeriesLevel && updatedSeries.subscriber_price) ? parseFloat(updatedSeries.subscriber_price) : null
            };
          }
          return s;
        }));
        
        if (selectedSeriesForViewer && selectedSeriesForViewer.id === updatedSeries.id) {
          setSelectedSeriesForViewer(prev => {
            if (!prev) return null;
            return {
              ...prev,
              title: updatedSeries.title,
              description: updatedSeries.description,
              price: isSeriesLevel ? parseFloat(updatedSeries.price || '0') : 0,
              img: updatedSeries.img,
              billing_level: billingLevel,
              subscriber_free: updatedSeries.subscriber_free,
              subscriber_price: (isSeriesLevel && updatedSeries.subscriber_price) ? parseFloat(updatedSeries.subscriber_price) : null
            };
          });
        }

        setShowEditSeriesModal(false);
        setEditingSeries(null);
      }
    } catch (err: any) {
      toast.error('Failed to update series: ' + err.message);
    }
    setSaving(false);
  };

  const handleDeleteSeries = async (seriesId: string) => {
    if (!window.confirm('Are you sure you want to delete this series? All episodes inside it will also be deleted. This action cannot be undone.')) {
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase!
        .from('series')
        .delete()
        .eq('id', seriesId);

      if (error) {
        toast.error('Error deleting series: ' + error.message);
      } else {
        toast.success('Series deleted successfully!');
        setSeriesList(prev => prev.filter(s => s.id !== seriesId));
        if (selectedSeriesForViewer && selectedSeriesForViewer.id === seriesId) {
          setSelectedSeriesForViewer(null);
        }
        setShowEditSeriesModal(false);
        setEditingSeries(null);
      }
    } catch (err: any) {
      toast.error('Failed to delete series: ' + err.message);
    }
    setSaving(false);
  };

  const handleUpdateEpisode = async (updatedEpisode: any) => {
    setSaving(true);
    try {
      const { error } = await supabase!
        .from('episodes')
        .update({
          title: updatedEpisode.title,
          description: updatedEpisode.description,
          length: updatedEpisode.length,
          price: parseFloat(updatedEpisode.price || '0'),
          video_url: updatedEpisode.video_url,
          thumbnail_url: updatedEpisode.thumbnail_url,
          genre: updatedEpisode.genre,
          rating: updatedEpisode.rating,
          subscriber_free: updatedEpisode.subscriber_free,
          subscriber_price: updatedEpisode.subscriber_price ? parseFloat(updatedEpisode.subscriber_price) : null
        })
        .eq('id', updatedEpisode.id);

      if (error) {
        toast.error('Error updating episode: ' + error.message);
      } else {
        toast.success('Episode updated successfully!');
        
        const updater = (s: any) => {
          if (s.id === updatedEpisode.series_id) {
            return {
              ...s,
              episodes: (s.episodes || []).map((ep: any) => ep.id === updatedEpisode.id ? { 
                ...ep, 
                ...updatedEpisode, 
                price: parseFloat(updatedEpisode.price || '0'), 
                subscriber_price: updatedEpisode.subscriber_price ? parseFloat(updatedEpisode.subscriber_price) : null 
              } : ep)
            };
          }
          return s;
        };

        setSeriesList(prev => prev.map(updater));
        if (selectedSeriesForViewer && selectedSeriesForViewer.id === updatedEpisode.series_id) {
          setSelectedSeriesForViewer(prev => {
            if (!prev) return null;
            return updater(prev);
          });
        }

        if (activeCinemaSeries && activeCinemaSeries.id === updatedEpisode.series_id) {
          setActiveCinemaSeries(prev => {
            if (!prev) return null;
            return updater(prev);
          });
          if (activeCinemaEpisode && activeCinemaEpisode.id === updatedEpisode.id) {
            setActiveCinemaEpisode({
              ...activeCinemaEpisode,
              ...updatedEpisode,
              price: parseFloat(updatedEpisode.price || '0'),
              subscriber_price: updatedEpisode.subscriber_price ? parseFloat(updatedEpisode.subscriber_price) : null
            });
          }
        }

        setShowEditEpisodeModal(false);
        setEditingEpisode(null);
      }
    } catch (err: any) {
      toast.error('Failed to update episode: ' + err.message);
    }
    setSaving(false);
  };

  const handleDeleteEpisode = async (episodeId: string, seriesId: string) => {
    if (!window.confirm('Are you sure you want to delete this episode? This action cannot be undone.')) {
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase!
        .from('episodes')
        .delete()
        .eq('id', episodeId);

      if (error) {
        toast.error('Error deleting episode: ' + error.message);
      } else {
        toast.success('Episode deleted successfully!');
        
        const filterer = (s: any) => {
          if (s.id === seriesId) {
            return {
              ...s,
              episodes: (s.episodes || []).filter((ep: any) => ep.id !== episodeId)
            };
          }
          return s;
        };

        setSeriesList(prev => prev.map(filterer));
        if (selectedSeriesForViewer && selectedSeriesForViewer.id === seriesId) {
          setSelectedSeriesForViewer(prev => {
            if (!prev) return null;
            return filterer(prev);
          });
        }

        if (activeCinemaSeries && activeCinemaSeries.id === seriesId) {
          setActiveCinemaSeries(prev => {
            if (!prev) return null;
            return filterer(prev);
          });
          if (activeCinemaEpisode && activeCinemaEpisode.id === episodeId) {
            setActiveCinemaEpisode(null);
          }
        }

        setShowEditEpisodeModal(false);
        setEditingEpisode(null);
      }
    } catch (err: any) {
      toast.error('Failed to delete episode: ' + err.message);
    }
    setSaving(false);
  };

  const handleEditSeriesCoverUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      setUploadingEditSeriesImg(true);
      
      toast.info("✨ Nalu AI is enhancing and auto-cropping your series cover...");
      const enhancedFile = await processAndEnhanceImage(file, 'hero'); // 16:9 aspect ratio

      const filePath = `${user?.id}/series_edit_${Math.random()}.${enhancedFile.name.split('.').pop()}`;
      await supabase!.storage.from('images').upload(filePath, enhancedFile);
      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      setEditingSeries((prev: any) => ({ ...prev, img: data.publicUrl }));
      toast.success('Series cover uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Series cover upload failed: ' + (err.message || 'Storage error'));
    } finally {
      setUploadingEditSeriesImg(false);
    }
  };

  const handleEditEpisodeCoverUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      setUploadingEditEpisodeImg(true);
      
      toast.info("✨ Nalu AI is enhancing and auto-cropping your episode cover...");
      const enhancedFile = await processAndEnhanceImage(file, 'hero'); // 16:9 aspect ratio

      const filePath = `${user?.id}/ep_edit_${Math.random()}.${enhancedFile.name.split('.').pop()}`;
      await supabase!.storage.from('images').upload(filePath, enhancedFile);
      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      setEditingEpisode((prev: any) => ({ ...prev, thumbnail_url: data.publicUrl }));
      toast.success('Episode cover uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Episode cover upload failed: ' + (err.message || 'Storage error'));
    } finally {
      setUploadingEditEpisodeImg(false);
    }
  };

  const handleEditEpisodeVideoUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      setUploadingEditEpisodeVideo(true);
      toast.info('Uploading video file to videos storage bucket...');

      const fileExt = file.name.split('.').pop();
      const fileName = `video_${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase!.storage.from('videos').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase!.storage.from('videos').getPublicUrl(filePath);
      setEditingEpisode((prev: any) => ({ ...prev, video_url: data.publicUrl }));
      toast.success('Video uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error('Video upload failed: ' + (err.message || 'Storage error'));
    } finally {
      setUploadingEditEpisodeVideo(false);
    }
  };

  const handleUpdateProduct = async (updatedProduct: any) => {
    setSaving(true);
    try {
      const colorsArr = typeof updatedProduct.colors === 'string'
        ? updatedProduct.colors.split(',').map((c: string) => c.trim()).filter(Boolean)
        : updatedProduct.colors;
      const sizesArr = typeof updatedProduct.sizes === 'string'
        ? updatedProduct.sizes.split(',').map((s: string) => s.trim()).filter(Boolean)
        : updatedProduct.sizes;

      const { error } = await supabase!
        .from('products')
        .update({
          title: updatedProduct.title,
          price: parseFloat(updatedProduct.price),
          image_url: updatedProduct.image_url,
          type: updatedProduct.type,
          variants: {
            is_clothing: updatedProduct.is_clothing,
            colors: colorsArr,
            sizes: sizesArr
          }
        })
        .eq('id', updatedProduct.id);

      if (error) {
        toast.error('Error updating product: ' + error.message);
      } else {
        toast.success('Product updated successfully!');
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? {
          ...p,
          title: updatedProduct.title,
          price: parseFloat(updatedProduct.price),
          image_url: updatedProduct.image_url,
          type: updatedProduct.type,
          variants: {
            is_clothing: updatedProduct.is_clothing,
            colors: colorsArr,
            sizes: sizesArr
          }
        } : p));
        setShowEditModal(false);
        setEditingProduct(null);
      }
    } catch (err: any) {
      toast.error('Failed to update product: ' + err.message);
    }
    setSaving(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase!
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        toast.error('Error deleting product: ' + error.message);
      } else {
        toast.success('Product deleted successfully!');
        setProducts(prev => prev.filter(p => p.id !== productId));
        setShowEditModal(false);
        setEditingProduct(null);
      }
    } catch (err: any) {
      toast.error('Failed to delete product: ' + err.message);
    }
    setSaving(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;
    
    setSaving(true);
    const productInsert = {
      creator_id: profile.id,
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      type: newProduct.type,
      image_url: newProduct.image_url || 'https://picsum.photos/400/400',
      variants: newProduct.type === 'physical' ? {
        sizes: newProduct.is_clothing ? newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: newProduct.colors.split(',').map(c => c.trim()).filter(Boolean),
        is_clothing: newProduct.is_clothing
      } : {}
    };

    try {
      const { data, error } = await supabase!.from('products').insert([productInsert]).select();
      if (!error && data) {
        setProducts(prev => [...prev, data[0]]);
      } else {
        // Fallback if table doesn't exist yet
        setProducts(prev => [...prev, { ...productInsert, id: Math.random().toString() }]);
      }
    } catch {
      setProducts(prev => [...prev, { ...productInsert, id: Math.random().toString() }]);
    }

    setNewProduct({ title: '', price: '19.99', type: 'digital', image_url: '', sizes: '', colors: '', is_clothing: false });
    setSaving(false);
  };

  const handlePrevImage = (postId: string | number, maxImages: number) => {
    setPostImageIndexes(prev => ({
      ...prev,
      [postId]: (prev[postId] ? prev[postId] - 1 : maxImages - 1 + maxImages) % maxImages
    }));
  };

  const handleNextImage = (postId: string | number, maxImages: number) => {
    setPostImageIndexes(prev => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % maxImages
    }));
  };

  const handlePostMediaUpload = async (eventOrFiles: React.ChangeEvent<HTMLInputElement> | FileList | File) => {
    try {
      let filesToUpload: File[] = [];
      if (eventOrFiles instanceof File) {
        filesToUpload = [eventOrFiles];
      } else if (eventOrFiles instanceof FileList) {
        filesToUpload = Array.from(eventOrFiles);
      } else if (eventOrFiles && 'target' in eventOrFiles && eventOrFiles.target?.files) {
        filesToUpload = Array.from(eventOrFiles.target.files);
      }
      if (filesToUpload.length === 0) return;
      setUploadingPostMedia(true);
      
      const newUrls: string[] = [];
      for (const file of filesToUpload) {
        toast.info(`✨ Nalu AI is enhancing and auto-cropping your post media: ${file.name}...`);
        const enhancedFile = await processAndEnhanceImage(file, 'post');

        const filePath = `${user?.id}/post_${Math.random()}.${enhancedFile.name.split('.').pop()}`;
        await supabase!.storage.from('images').upload(filePath, enhancedFile);
        const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
        newUrls.push(data.publicUrl);
      }
      
      setPostMediaUrls(prev => [...prev, ...newUrls]);
    } catch {
      toast.error('Upload failed. Did you run the storage buckets script?');
    } finally {
      setUploadingPostMedia(false);
    }
  };

  const handleDeletePost = (postId: string | number) => {
    setDeletePostId(postId);
  };

  const confirmDeletePost = async () => {
    if (!deletePostId) return;
    const postId = deletePostId;
    setDeletePostId(null);
    
    // Optimistic delete
    setFeed(feed.filter(p => p.id !== postId));
    
    try {
      await supabase!.from('posts').delete().eq('id', postId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditPost = (postId: string | number, currentContent: string) => {
    setEditPostData({ id: postId, content: currentContent });
  };

  const confirmEditPost = async (newContent: string) => {
    if (!editPostData) return;
    const postId = editPostData.id;
    setEditPostData(null);
    
    if (!newContent || newContent === editPostData.content) return;

    // Optimistic update
    setFeed(feed.map(p => p.id === postId ? { ...p, title: newContent } : p));

    try {
      await supabase!.from('posts').update({ content: newContent }).eq('id', postId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePin = async (postId: string | number, currentPinned: boolean) => {
    const targetState = !currentPinned;
    const creatorId = targetProfileId || user?.id;
    if (!creatorId) return;

    // Optimistically update local state
    setFeed(prev => {
      const updated = prev.map(p => {
        if (targetState) {
          // If pinning this post, unpin all other posts for this creator
          return {
            ...p,
            is_pinned: p.id === postId
          };
        } else {
          // If unpinning, only unpin this one
          return p.id === postId ? { ...p, is_pinned: false } : p;
        }
      });

      // Re-sort feed: pinned posts first, then the rest
      const pinned = updated.filter(p => p.is_pinned);
      const unpinned = updated.filter(p => !p.is_pinned);
      return [...pinned, ...unpinned];
    });

    try {
      if (targetState) {
        // Enforce single-pinned post behavior by unpinning all other posts for this creator in DB
        await supabase!.from('posts').update({ is_pinned: false }).eq('creator_id', creatorId);
      }
      
      const { error } = await supabase!
        .from('posts')
        .update({ is_pinned: targetState })
        .eq('id', postId);
      
      if (error) throw error;
      toast.success(targetState ? 'Post pinned to top!' : 'Post unpinned');
    } catch (e: any) {
      console.error('Error toggling pin:', e);
      toast.error('Failed to update pin: ' + e.message);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent, isLockedVal?: boolean) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!postTitle.trim()) {
      toast.error('Please enter a description for your post!');
      return;
    }
    
    const lockedStatus = isLockedVal !== undefined ? isLockedVal : isLocked;
    
    const newPost = {
      creator_id: targetProfileId,
      content: postTitle,
      is_locked: lockedStatus,
      likes: 0,
      image_url: postMediaUrls.length > 0 
        ? JSON.stringify(postMediaUrls) 
        : 'https://vibenetwork.tv/wp-content/uploads/2026/02/mukap-vibe-tv-networkk_11zon.png'
    };
    
    // Parse images list for the feed state
    let localImgs: string[] = [];
    if (newPost.image_url.startsWith('[') && newPost.image_url.endsWith(']')) {
      try {
        localImgs = JSON.parse(newPost.image_url);
      } catch {
        localImgs = [newPost.image_url];
      }
    } else {
      localImgs = [newPost.image_url];
    }
    
    // Add to supabase
    const { data } = await supabase!.from('posts').insert([newPost]).select();
    
     if (data && data[0]) {
       setFeed([{ 
         id: data[0].id, title: data[0].content || postTitle, locked: data[0].is_locked || lockedStatus, likes: 0, date: 'Just now', 
         img: localImgs[0] || null,
         imgs: localImgs,
         is_pinned: false
       }, ...feed]);
     } else {
       // Fallback local state if table doesn't exist yet
       setFeed([{ 
         id: Date.now(), title: postTitle, locked: lockedStatus, likes: 0, date: 'Just now', 
         img: localImgs[0] || null,
         imgs: localImgs,
         is_pinned: false
       }, ...feed]);
     }
    setPostTitle('');
    setPostMediaUrls([]);
    toast.success('Content Published Successfully!');
  };

  const copyToClipboardFallback = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          resolve();
        } else {
          reject(new Error('copy command failed'));
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleSharePost = async (post: any) => {
    const cleanParams = new URLSearchParams(window.location.search);
    cleanParams.delete('post');
    cleanParams.delete('tab');
    const paramString = cleanParams.toString();
    const profilePath = profile?.id ? `/profile/${profile.id}` : window.location.pathname;
    const shareUrl = `${window.location.origin}${profilePath}?post=${post.id}${paramString ? '&' + paramString : ''}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${profile?.username || 'Creator'} on ${wlConfig?.name || 'Vibe Network'}`,
          text: `${post.title || 'Check out this post!'}\n\n${shareUrl}`,
          url: shareUrl
        });
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Native share failed, falling back to clipboard copy:', err);
        } else {
          return; // User cancelled
        }
      }
    }

    const copyPromise = navigator.clipboard && navigator.clipboard.writeText 
      ? navigator.clipboard.writeText(shareUrl) 
      : copyToClipboardFallback(shareUrl);

    copyPromise.then(() => {
      toast.success('Share link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link.');
    });
  };

  const handleShareStore = async () => {
    const cleanParams = new URLSearchParams(window.location.search);
    cleanParams.delete('post');
    cleanParams.delete('tab');
    const paramString = cleanParams.toString();
    const profilePath = profile?.id ? `/profile/${profile.id}` : window.location.pathname;
    const shareUrl = `${window.location.origin}${profilePath}?tab=store${paramString ? '&' + paramString : ''}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.username || 'Creator'}'s Storefront | ${wlConfig?.name || 'Vibe Network'}`,
          text: `Explore physical merchandise and digital downloads for sale by ${profile?.username || 'Creator'}!\n\n${shareUrl}`,
          url: shareUrl
        });
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('Native share failed, falling back to clipboard copy:', err);
        } else {
          return; // User cancelled
        }
      }
    }

    const copyPromise = navigator.clipboard && navigator.clipboard.writeText 
      ? navigator.clipboard.writeText(shareUrl) 
      : copyToClipboardFallback(shareUrl);

    copyPromise.then(() => {
      toast.success('Storefront link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy storefront link.');
    });
  };

  const handleOpenNetwork = (network: any) => {
    const hostname = window.location.hostname;
    const isLocalOrPreview = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('vercel.app') || hostname.includes('.local');
    
    if (network.domain && !isLocalOrPreview) {
      const protocol = window.location.protocol;
      window.location.href = `${protocol}//${network.domain}`;
    } else {
      window.location.href = `${window.location.origin}/?tenant=${network.id}`;
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) { toast.info('Please log in to interact.'); return; }
    
    const targetPost = feed.find(p => p.id === postId);
    if (!targetPost) return;

    if (targetPost.hasLiked) {
      // Unlike
      setFeed(feed.map(p => p.id === postId ? { ...p, likes: Math.max(0, p.likes - 1), hasLiked: false } : p));
      await supabase!.from('post_likes').delete().match({ post_id: postId, user_id: user.id }).catch(() => {});
    } else {
      // Like
      setFeed(feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1, hasLiked: true } : p));
      await supabase!.from('post_likes').insert([{ post_id: postId, user_id: user.id }]).catch(() => {});
    }
  };

  const handleComment = async (postId: string) => {
    if (!user) { toast.info('Please log in to comment.'); return; }
    const text = commentTexts[postId]?.trim();
    if (!text) return;

    const loggedInUsername = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
    const loggedInAvatar = user?.user_metadata?.avatar_url || '';
    const newComment = { id: Date.now().toString(), text, user: loggedInUsername, avatar: loggedInAvatar };
    
    // Optimistic UI update
    setFeed(feed.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p));
    setCommentTexts(prev => ({ ...prev, [postId]: '' }));

    // Send to DB
    try {
       await supabase!.from('post_comments').insert([{ post_id: postId, user_id: user.id, content: text }]);
    } catch {
       // Silently fail if table doesn't exist
    }
  };

  const enhanceText = async (field: 'bio' | 'post' | 'refund_policy') => {
    const originalText = field === 'bio' ? bio : (field === 'post' ? postTitle : refundPolicy);
    if (!originalText || originalText.length < 5) {
      toast.info("Please type a few words first so the AI has something to work with!");
      return;
    }
    
    setSaving(true);
    try {
      // Create a mocked "AI" text enhancer using realistic Influencer copy for the prototype!
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate AI thought latency
      
      let finalEnhanced = "";
      if (field === 'bio') {
        const hooks = ["Welcome to the ultimate vibe.", "Dropping exclusive content weekly.", "Join the movement.", "Your VIP access to my world."];
        finalEnhanced = `${hooks[Math.floor(Math.random() * hooks.length)]} ${originalText} 🔥 Subscribe to unlock my premium network tier!`;
      } else if (field === 'post') {
        const titles = ["🚨 LIVE NOW:", "✨ EXCLUSIVE:", "🔥 MUST WATCH:"];
        finalEnhanced = `${titles[Math.floor(Math.random() * titles.length)]} ${originalText.toUpperCase()} 💥`;
      } else if (field === 'refund_policy') {
        const templates = [
          `All sales are final. Since our store delivers instant digital downloads, live-stream access, and custom bookings, refunds are not offered. For physical items, please contact support within 14 days for damaged goods or size exchanges: ${originalText}`,
          `Shop with confidence! Physical product returns or size exchanges are accepted within 30 days of purchase in original packaging. Please note that digital files, live courses, and booking sessions are strictly non-refundable: ${originalText}`,
          `Store Policy: We strive for 100% satisfaction. While virtual bookings and downloads are non-refundable once accessed, we process refunds/exchanges for physical apparel within 14 days if unused. Note: ${originalText}`
        ];
        finalEnhanced = templates[Math.floor(Math.random() * templates.length)];
      }
      
      if (field === 'bio') setBio(finalEnhanced);
      if (field === 'post') setPostTitle(finalEnhanced);
      if (field === 'refund_policy') setRefundPolicy(finalEnhanced);
    } catch (e) {
      console.error(e);
      toast.error("AI Enhancer simulation failed.");
    }
    setSaving(false);
  };

  if (loading || !profile) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Loading Profile Network Data...</p>
      </div>
    );
  }

  if (showExitScreen) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', borderRadius: '30px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '500px' }}>
           <h1 style={{ margin: '0 0 10px 0', fontSize: '36px', color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.4)' }}>
             Thank You!
           </h1>
           <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.6', marginBottom: '30px' }}>
             Your livestream broadcasting session has been successfully disconnected from the Green Room.
           </p>
           <div style={{ background: 'rgba(255,77,133,0.1)', border: '1px solid rgba(255,77,133,0.3)', color: '#ff4d85', padding: '16px', borderRadius: '16px', fontWeight: 'bold' }}>
             You may now safely close this window.
           </div>
        </motion.div>
      </div>
    );
  }

  const isGuestMode = new URLSearchParams(location.search).get('guest_invite') === 'true' || localGuestData !== null;
  const activeGuests = guests.filter(g => g.isLive);
  const visibleGuests = directorLayout === 'isolate_host' ? [] : activeGuests;
  const showHost = directorLayout !== 'isolate_guest';
  const totalSlots = (showHost ? 1 : 0) + visibleGuests.length;
  
  const handleToggleProductVisibility = async (e: React.MouseEvent, productId: string, currentStatus: boolean) => {
    e.stopPropagation();
    const { error } = await supabase!.from('products').update({ hidden_from_network: !currentStatus }).eq('id', productId);
    if (!error) {
      setProducts(products.map(p => p.id === productId ? { ...p, hidden_from_network: !currentStatus } : p));
    }
  };

  // Dynamic SEO sharing overrides
  const searchParams = new URLSearchParams(location.search);
  const sharedPostId = searchParams.get('post');
  const sharedPost = sharedPostId ? feed.find(p => String(p.id) === String(sharedPostId)) : null;
  const isStoreTabShared = searchParams.get('tab') === 'store';

  let helmetTitle = `${profile?.full_name || profile?.username || 'Creator Profile'} - ${wlConfig?.name || 'Vibe Network'}`;
  let helmetDesc = profile?.bio || `Check out ${profile?.username || 'this creator'}'s profile on ${wlConfig?.name || 'Vibe Network'}`;
  let helmetImage = profile?.avatar_url || wlConfig?.logoImage || 'https://vibenetwork.tv/og-image.jpg';

  if (sharedPost) {
    helmetTitle = `${sharedPost.title?.substring(0, 50) || 'Post'} | ${profile?.username || profile?.full_name || 'Creator'} on ${wlConfig?.name || 'Vibe Network'}`;
    helmetDesc = sharedPost.title || 'Check out this exclusive post!';
    helmetImage = sharedPost.img || profile?.avatar_url || wlConfig?.logoImage || 'https://vibenetwork.tv/og-image.jpg';
  } else if (isStoreTabShared) {
    helmetTitle = `Shop ${profile?.username || profile?.full_name || 'Creator'}'s Storefront | ${wlConfig?.name || 'Vibe Network'}`;
    helmetDesc = `Explore physical merchandise, digital downloads, and exclusive products for sale by ${profile?.username || profile?.full_name || 'Creator'}!`;
    const firstProductImg = products.find(p => !p.hidden_from_network)?.image_url;
    helmetImage = firstProductImg || profile?.avatar_url || wlConfig?.logoImage || 'https://vibenetwork.tv/og-image.jpg';
  }

  return (
    <div style={{ minHeight: '100vh', background: isNetworkLevel ? 'transparent' : 'var(--content-bg)', color: 'var(--text-primary)', position: 'relative' }}>
      {profile && (
        <Helmet>
          <title>{helmetTitle}</title>
          <meta name="description" content={helmetDesc} />
          <meta property="og:title" content={helmetTitle} />
          <meta property="og:description" content={helmetDesc} />
          <meta property="og:image" content={helmetImage} />
        </Helmet>
      )}
      
      {/* Immersive Hero Banner */}
      {!isGuestMode && !isNetworkLevel && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', zIndex: 0, overflow: 'hidden' }}>
          <AnimatePresence initial={false} mode="popLayout">
            {homepageImageUrl && (
              <motion.div
                key={`hero-bg-${currentBgIndex}`}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${homepageImageUrl.split(',')[currentBgIndex]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'var(--hero-img-filter)'
                }}
              />
            )}
          </AnimatePresence>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, var(--hero-bg) 100%)', zIndex: 1 }} />
          {/* Dynamic Glowing Accent */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(255, 77, 133, 0.2), transparent 70%)', mixBlendMode: 'screen', zIndex: 2 }} />
        </div>
      )}

      {/* Main Content Wrapper */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: isNetworkLevel ? '0px' : (isGuestMode ? '80px' : '200px') }}>
      
        {/* View Toggle Bar (Only for account owner) */}
        {isOwnProfile && isInfluencer && (
          <div style={{ padding: '12px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 100, marginBottom: '20px' }}>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', borderRadius: '30px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
              <button 
                onClick={() => setViewMode('edit')}
                style={{ padding: '8px 24px', borderRadius: '30px', border: 'none', background: viewMode === 'edit' ? '#fff' : 'transparent', color: viewMode === 'edit' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }}
              >
                <Edit2 size={16} /> Edit Profile
              </button>
              <button 
                onClick={() => {
                  setViewMode('public');
                  setActiveTab('feed');
                }}
                style={{ padding: '8px 24px', borderRadius: '30px', border: 'none', background: viewMode === 'public' ? 'rgba(255,0,85,1)' : 'transparent', color: 'var(--text-primary)', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease' }}
              >
                <Eye size={16} /> Public Preview
              </button>
            </div>
          </div>
        )}

        {/* Feed Layout Container */}
        <div style={{ maxWidth: isGuestMode ? '1200px' : '850px', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '100px' }}>
          
          {!isGuestMode && !isNetworkLevel && (
            <>
              {wlConfig?.parent_network_id && (
                <button
                  onClick={() => navigate({ pathname: '/', search: location.search })}
                  style={{
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '8px 20px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: '-10px',
                    zIndex: 10
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = wlConfig?.accent || 'var(--accent-primary)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  <span>← Back to {wlConfig.name}</span>
                </button>
              )}

              {isProfileDeactivated && (
                <div style={{ background: 'rgba(255, 59, 48, 0.15)', border: '1px solid rgba(255, 59, 48, 0.3)', borderRadius: '16px', padding: '16px', color: '#ff6b6b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontWeight: 'bold' }}>
                  <AlertCircle size={18} />
                  <span>Your channel has been suspended by the platform administrator and is not visible to the public.</span>
                </div>
              )}

              {/* Glassmorphic Creator Header */}
              <div className="profile-header-card" style={{ background: isNetworkLevel ? 'transparent' : 'rgba(15, 15, 15, 0.4)', backdropFilter: isNetworkLevel ? 'none' : 'blur(24px)', padding: isNetworkLevel ? '0 40px 40px' : '40px', borderRadius: '32px', border: isNetworkLevel ? 'none' : `1px solid ${wlConfig?.accent || '#00ff88'}22`, position: 'relative', boxShadow: isNetworkLevel ? 'none' : '0 20px 40px rgba(0,0,0,0.4)' }}>
            
            {!isOwnProfile && (
              <div style={{ position: 'absolute', top: '30px', right: '30px', display: 'flex', gap: '12px', zIndex: 20 }}>
                {/* Follow Button */}
                <button
                  onClick={handleToggleFollow}
                  disabled={followLoading}
                  style={{
                    padding: '10px 24px',
                    background: isFollowing ? 'rgba(255,255,255,0.08)' : 'rgba(255, 204, 0, 0.15)',
                    color: isFollowing ? '#aaa' : '#ffcc00',
                    border: '1px solid',
                    borderColor: isFollowing ? 'rgba(255,255,255,0.15)' : 'rgba(255, 204, 0, 0.4)',
                    borderRadius: '100px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Star size={14} fill={isFollowing ? '#aaa' : 'transparent'} />
                  {isFollowing ? 'Following' : 'Follow'}
                </button>

                {/* Subscribe Button */}
                <button
                  className="profile-subscribe-btn"
                  onClick={handleSubscribe}
                  style={{
                    padding: '10px 24px',
                    background: isSubscribed
                      ? 'rgba(255,255,255,0.08)'
                      : 'linear-gradient(135deg, #FF0055, #8A2BE2)',
                    color: '#fff',
                    border: isSubscribed ? '1px solid rgba(255,255,255,0.15)' : 'none',
                    borderRadius: '100px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isSubscribed ? 'none' : '0 8px 20px rgba(255,0,85,0.3)',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isSubscribed ? (
                    <>
                      <CheckCircle size={14} color="#00ff88" />
                      <span style={{ color: '#00ff88' }}>Subscribed</span>
                    </>
                  ) : (
                    <span>
                      {Number(subPrice) > 0 ? `Subscribe $${Number(subPrice).toFixed(2)}/mo` : 'Subscribe Free'}
                    </span>
                  )}
                </button>
              </div>
            )}

            {isOwnProfile && (
              <button className="profile-logout-btn" onClick={async () => { await supabase!.auth.signOut(); window.location.href = '/' + window.location.search; }} style={{ position: 'absolute', top: 30, right: 30, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                <LogOut size={16} /> Logout
              </button>
            )}

            <div className="profile-header-layout">
              
              {/* Profile Picture with Glow */}
              <div 
                className="group" 
                onDragOver={(e) => {
                  if (isOwnProfile && viewMode === 'edit') {
                    e.preventDefault();
                    setIsDraggingDirectAvatar(true);
                  }
                }}
                onDragLeave={() => setIsDraggingDirectAvatar(false)}
                onDrop={(e) => {
                  if (isOwnProfile && viewMode === 'edit') {
                    e.preventDefault();
                    setIsDraggingDirectAvatar(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      setImageTarget('avatar');
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }
                }}
                onClick={() => { if (isOwnProfile && viewMode === 'edit') handleImageClick(); }}
                style={{ 
                  position: 'relative', 
                  cursor: isOwnProfile && viewMode === 'edit' ? 'pointer' : 'default',
                  transition: 'all 0.3s ease'
                }} 
              >
                <div style={{ position: 'absolute', inset: '-10px', background: isDraggingDirectAvatar ? 'radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.6), transparent 70%)' : 'radial-gradient(circle at 50% 50%, rgba(255, 77, 133, 0.5), transparent 70%)', borderRadius: '50%', zIndex: 0, filter: 'blur(10px)', transition: 'all 0.3s ease' }} />
                <div style={{ 
                  position: 'relative', zIndex: 1,
                  width: '140px', height: '140px', borderRadius: '50%', 
                  backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'linear-gradient(135deg, #FF0055, #8A2BE2)',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '56px', fontWeight: 'bold', 
                  border: isDraggingDirectAvatar ? '4px dashed #00ff88' : '4px solid rgba(255,255,255,0.2)', 
                  boxShadow: isDraggingDirectAvatar ? '0 0 35px rgba(0,255,136,0.6)' : '0 10px 30px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease'
                }}>
                  {!avatarUrl && (profile?.username ? profile.username[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'V'))}
                </div>
                {/* Camera Overlay only on Edit Mode */}
                {viewMode === 'edit' && (
                  <div className="camera-overlay" style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isDraggingDirectAvatar ? 1 : 0, transition: '0.2s', zIndex: 2
                  }}>
                    {isDraggingDirectAvatar ? (
                      <span style={{ color: '#00ff88', fontWeight: 'black', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Drop Pic!</span>
                    ) : (
                      <Camera size={34} color="#fff" />
                    )}
                  </div>
                )}
                {/* Camera Badge/Icon on Edit Mode */}
                {viewMode === 'edit' && !isDraggingDirectAvatar && (
                  <div 
                    className="camera-badge" 
                    style={{
                      position: 'absolute',
                      bottom: '0px',
                      right: '0px',
                      background: wlConfig?.accent || 'var(--accent-primary)',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid #0d0d0d',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      zIndex: 3,
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <Camera size={18} color="#fff" />
                  </div>
                )}
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" />
              </div>

              <div style={{ flex: 1, minWidth: '300px' }}>
                <h1 className="profile-title" style={{ fontSize: '48px', fontWeight: 900, margin: '0 0 16px 0', letterSpacing: '-1px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>{profile.username || 'Anonymous Creator'}</h1>
                
                {isInfluencer ? (
                  <>
                    <div className="profile-badge-container">
                      <span style={{ padding: '8px 16px', background: 'rgba(0,85,255,0.15)', color: '#4da6ff', border: '1px solid rgba(0,85,255,0.3)', borderRadius: '24px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise Profile</span>
                      
                      {/* {viewMode === 'edit' ? (
                        <>
                          <select aria-label="genre selector" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontSize: '13px', outline: 'none', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                            <option>SaaS Platform</option>
                            <option>Fintech API</option>
                            <option>AI Automation</option>
                            <option>B2B Marketplace</option>
                          </select>
                        </>
                      ) : (
                        <>
                          <span style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', fontSize: '13px', backdropFilter: 'blur(10px)' }}>{selectedGenre}</span>

                        </>
                      )} */}
                    </div>

                    {viewMode === 'edit' ? (
                      <>
                        <div style={{ position: 'relative' }}>
                          <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Write a bio to tell your viewers what your channel is about..."
                            style={{ 
                              width: '100%', 
                              minHeight: '105px', 
                              background: 'rgba(0,0,0,0.5)', 
                              border: '1px solid rgba(255,255,255,0.1)', 
                              borderRadius: '16px', 
                              padding: '16px 16px 64px 16px', 
                              color: 'var(--text-primary)', 
                              resize: 'vertical', 
                              fontSize: '15px', 
                              outline: 'none', 
                              backdropFilter: 'blur(10px)',
                              boxSizing: 'border-box'
                            }}
                          />
                          <div style={{ position: 'absolute', right: '120px', bottom: '20px', display: 'flex', gap: '4px' }}>
                            <EmojiPickerButton onSelect={(emoji) => setBio(prev => prev + emoji)} />
                            <DictationButton onResult={(text) => setBio(prev => prev ? `${prev} ${text}` : text)} />
                          </div>
                          <button type="button" onClick={() => enhanceText('bio')} disabled={saving} style={{ position: 'absolute', right: '16px', bottom: '20px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(255,77,133,0.4)' }}>
                            <Wand size={14} /> AI Boost
                          </button>
                        </div>

                        {/* Flip Book editor moved to flipbook tab */}

                        <div className="profile-save-container">
                          <button onClick={saveProfile} disabled={saving} style={{ padding: '12px 32px', background: '#fff', color: '#000', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: '15px', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                            {saving ? 'Saving...' : 'Save Profile'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p style={{ color: '#eee', fontSize: '16px', lineHeight: 1.7, opacity: 0.9 }}>{bio}</p>
                    )}
                  </>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Standard Viewer Account</p>
                )}
              </div>
            </div>
          </div>
          </>
          )}

          {/* Public Channel Sections Panel */}
          <div className="creator-tools-panel" style={{ marginTop: '16px' }}>
            <div className="creator-tools-card">
              <div className="creator-tools-header">
                <Monitor size={14} color={wlConfig?.accent || '#ff4d85'} style={{ opacity: 0.8 }} />
                <span>Channel Sections</span>
              </div>
              <div className="creator-tools-list">
                {[
                  { id: 'feed', label: 'Content Feed', icon: <Activity size={16} /> },
                  { id: 'store', label: 'Store', icon: <DollarSign size={16} /> },
                  { id: 'live', label: 'Live Stream', icon: <Video size={16} /> },
                  ...(wlConfig?.enableBooking !== false ? [{ id: 'booking', label: 'Booking', icon: <Calendar size={16} /> }] : []),
                  { id: 'series', label: 'Episodes', icon: <Video size={16} /> },
                  { id: 'courses', label: 'Sessions', icon: <CheckCircle size={16} /> },
                  ...(isOwnProfile && viewMode === 'edit' ? [{ id: 'flipbook', label: 'Vibe Drive', icon: <Folder size={16} /> }] : [])
                ]
                  .concat(isNetworkLevel ? [
                    { id: 'members', label: 'Network Profiles', icon: <Monitor size={16} /> },
                    { id: 'community', label: 'Community', icon: <MessageCircle size={16} /> }
                  ] : [])
                  .concat((myNetworks.length > 0 && !isNetworkLevel) ? [{ id: 'networks', label: 'My Networks', icon: <Monitor size={16} /> }] : [])
                  .map(tab => {
                    const isActive = activeTab === tab.id;
                    const accentColor = wlConfig?.accent || '#ff4d85';
                    return (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{ 
                          position: 'relative', 
                          background: 'none',
                          border: 'none', 
                          padding: '12px 20px', 
                          color: isActive ? accentColor : '#888', 
                          fontSize: '14px', 
                          fontWeight: 'bold', 
                          cursor: 'pointer', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = '#fff';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = '#888';
                          }
                        }}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="activepublictab" 
                            style={{ 
                              position: 'absolute', 
                              inset: 0, 
                              background: `${accentColor}26`, 
                              borderRadius: '12px', 
                              border: `1px solid ${accentColor}7f`,
                              zIndex: 0
                            }} 
                          />
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', color: isActive ? accentColor : 'inherit', position: 'relative', zIndex: 1 }}>
                          {tab.icon}
                        </span>
                        <span style={{ position: 'relative', zIndex: 1 }}>{tab.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Creator Control Panel */}
          {isOwnProfile && viewMode === 'edit' && (
            <div className="creator-tools-panel">
              <div className="creator-tools-card">
                <div className="creator-tools-header">
                  <Settings size={14} color={wlConfig?.accent || '#ff4d85'} style={{ opacity: 0.8 }} />
                  <span>{isInfluencer ? 'Creator Control Panel' : 'User Control Panel'}</span>
                </div>
                <div className="creator-tools-list">
                  {[
                    { id: 'my_bookings', label: 'My Bookings', icon: <Calendar size={16} />, color: '#b380ff', bg: 'rgba(179,128,255,0.12)', border: 'rgba(179,128,255,0.4)', show: !!user },
                    { id: 'subscriptions', label: 'Following & Subs', icon: <Star size={16} />, color: '#ffcc00', bg: 'rgba(255,204,0,0.12)', border: 'rgba(255,204,0,0.4)', show: !!user },
                    { id: 'ai_report', label: 'AI Creator Report', icon: <Activity size={16} />, color: '#3399ff', bg: 'rgba(51,153,255,0.12)', border: 'rgba(51,153,255,0.4)', show: isInfluencer },
                    { id: 'crm', label: 'Vibe CRM', icon: <Users size={16} />, color: '#00ffcc', bg: 'rgba(0,255,204,0.12)', border: 'rgba(0,255,204,0.4)', show: isInfluencer },
                    { id: 'appearance', label: 'Appearance', icon: <Wand size={16} />, color: '#ff9933', bg: 'rgba(255,153,51,0.12)', border: 'rgba(255,153,51,0.4)', show: isInfluencer && !isNetworkLevel },
                    { 
                      id: 'wallet', 
                      label: 'Wallet', 
                      icon: <Wallet size={16} />, 
                      color: '#00ff88', 
                      bg: 'rgba(0,255,136,0.12)', 
                      border: 'rgba(0,255,136,0.4)', 
                      show: isInfluencer && !isNetworkLevel && (wlConfig?.theme?.creator_splits?.[profile?.id] ?? profile?.platform_fee_percentage ?? wlConfig?.platform_fee_percentage ?? 0) > 0 
                    },
                    { id: 'security', label: 'Security', icon: <Lock size={16} />, color: '#ff4d85', bg: 'rgba(255,77,133,0.12)', border: 'rgba(255,77,133,0.4)', show: true }
                  ].filter(tool => tool.show).map(tool => {
                    const isActive = activeTab === tool.id;
                    return (
                      <button 
                        key={tool.id}
                        onClick={() => setActiveTab(tool.id as any)}
                        style={{ 
                          position: 'relative', 
                          background: isActive ? tool.bg : 'rgba(255,255,255,0.02)', 
                          border: isActive ? `1px solid ${tool.border}` : '1px solid transparent', 
                          padding: '12px 20px', 
                          color: isActive ? tool.color : '#888', 
                          fontSize: '14px', 
                          fontWeight: 'bold', 
                          cursor: 'pointer', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          transition: 'color 0.2s, background-color 0.2s, border-color 0.2s' 
                        }}
                        onMouseOver={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = '#888';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                          }
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', color: isActive ? tool.color : 'inherit' }}>
                          {tool.icon}
                        </span>
                        <span>{tool.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}


        {activeTab === 'feed' && (
          <>
            {/* Content Creation Widget -> ONLY IF EDITING */}
            {isOwnProfile && isInfluencer && viewMode === 'edit' && (
          <form 
            onSubmit={handlePostSubmit} 
            onDragOver={(e) => { e.preventDefault(); setIsDraggingPostForm(true); }}
            onDragLeave={() => setIsDraggingPostForm(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingPostForm(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handlePostMediaUpload(e.dataTransfer.files);
              }
            }}
            style={{ 
              background: isDraggingPostForm ? `${wlConfig?.accent || '#00ff88'}0c` : 'rgba(20,20,20,0.6)', 
              padding: '28px', 
              borderRadius: '24px', 
              border: isDraggingPostForm ? `1px dashed ${wlConfig?.accent || '#00ff88'}` : `1px solid ${wlConfig?.accent || '#00ff88'}22`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              marginBottom: '32px'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: `${wlConfig?.accent || '#ff4d85'}15`, padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Edit3 size={20} color={wlConfig?.accent || '#ff4d85'} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Create a New Post</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Publish text, images, or videos directly to your feed.</p>
              </div>
            </div>

            {/* Input Area */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div 
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'linear-gradient(135deg, #FF0055, #8A2BE2)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                  border: '2px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }} 
              />
              <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea 
                  placeholder="What would you like to share with your audience? Write updates, drop links, or describe new content..." 
                  value={postTitle} 
                  onChange={(e) => setPostTitle(e.target.value)}
                  style={{ 
                    width: '100%', 
                    minHeight: '95px',
                    background: 'rgba(0,0,0,0.3)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: '16px',
                    color: 'var(--text-primary)', 
                    fontSize: '15px', 
                    outline: 'none', 
                    padding: '16px 16px 54px 16px',
                    resize: 'none',
                    lineHeight: 1.5,
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                
                {/* Floating Tools in Textarea */}
                <div style={{ position: 'absolute', right: '120px', bottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <EmojiPickerButton onSelect={(emoji) => setPostTitle(prev => prev + emoji)} />
                  <DictationButton onResult={(text) => setPostTitle(prev => prev ? `${prev} ${text}` : text)} />
                </div>
                <button 
                  type="button" 
                  onClick={() => enhanceText('post')} 
                  disabled={saving} 
                  style={{ 
                    position: 'absolute',
                    right: '12px', 
                    bottom: '12px',
                    background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', 
                    color: 'var(--text-primary)', 
                    border: 'none', 
                    borderRadius: '10px', 
                    padding: '6px 12px', 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(138,43,226,0.3)'
                  }}
                >
                  <Wand size={12} /> AI Boost
                </button>
              </div>
            </div>
            
            {/* Footer Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '16px' }}>
              
              {/* Media Upload Area */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <label 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingPostMedia(true); }}
                  onDragLeave={() => setIsDraggingPostMedia(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingPostMedia(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handlePostMediaUpload(e.dataTransfer.files);
                    }
                  }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: isDraggingPostMedia ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255,255,255,0.04)', 
                    border: isDraggingPostMedia ? '1px dashed #00ff88' : '1px solid rgba(255,255,255,0.1)', 
                    padding: '10px 20px',
                    borderRadius: '12px',
                    color: isDraggingPostMedia ? '#00ff88' : 'var(--text-primary)', 
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={e => { if(!isDraggingPostMedia) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseOut={e => { if(!isDraggingPostMedia) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  <input type="file" accept="image/*" multiple onChange={handlePostMediaUpload} style={{ display: 'none' }} disabled={uploadingPostMedia} />
                  <ImageIcon size={18} color={wlConfig?.accent || '#ff4d85'} /> {uploadingPostMedia ? 'Uploading...' : isDraggingPostMedia ? 'Drop Here!' : 'Attach Images/Video'}
                </label>
                
                {postMediaUrls.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {postMediaUrls.map((url, index) => (
                      <div key={`preview-${index}`} style={{ position: 'relative', width: '44px', height: '44px', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                        <img src={url} alt={`Preview ${index}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          type="button" 
                          onClick={() => setPostMediaUrls(prev => prev.filter((_, i) => i !== index))} 
                          style={{ 
                            position: 'absolute', top: 2, right: 2, 
                            background: 'rgba(0,0,0,0.8)', color: '#fff', 
                            border: 'none', borderRadius: '50%', 
                            width: '18px', height: '18px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' 
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Privacy and Actions */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {/* Post Privacy Selector */}
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '24px', padding: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <button 
                    type="button"
                    onClick={() => setIsLocked(false)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '8px 16px', 
                      background: !isLocked ? 'rgba(76, 175, 80, 0.15)' : 'transparent', 
                      color: !isLocked ? '#4CAF50' : '#888', 
                      border: !isLocked ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid transparent', 
                      borderRadius: '20px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Unlock size={14} /> Free
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsLocked(true)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '8px 16px', 
                      background: isLocked ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'transparent', 
                      color: isLocked ? '#000' : '#888', 
                      border: 'none', 
                      borderRadius: '20px', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Lock size={14} /> Subs Only
                  </button>
                </div>

                {/* Submit button */}
                <button 
                  type="submit"
                  disabled={uploadingPostMedia || !postTitle.trim()} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '12px 28px', 
                    background: (uploadingPostMedia || !postTitle.trim()) ? 'rgba(255,255,255,0.1)' : (wlConfig?.accent || 'var(--accent-primary)'), 
                    color: (uploadingPostMedia || !postTitle.trim()) ? 'rgba(255,255,255,0.3)' : '#fff', 
                    border: 'none', 
                    borderRadius: '24px', 
                    fontWeight: 900, 
                    cursor: (uploadingPostMedia || !postTitle.trim()) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: (uploadingPostMedia || !postTitle.trim()) ? 'none' : `0 4px 15px ${(wlConfig?.accent || '#ff4d85')}44`
                  }}
                  onMouseOver={e => {
                    if (!uploadingPostMedia && postTitle.trim()) {
                      e.currentTarget.style.filter = 'brightness(1.1)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseOut={e => {
                    if (!uploadingPostMedia && postTitle.trim()) {
                      e.currentTarget.style.filter = 'none';
                      e.currentTarget.style.transform = 'none';
                    }
                  }}
                >
                  Publish Post
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Creator's Feed (Both viewers and the creator see this) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <h2 style={{ fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginTop: '10px' }}>Content Feed</h2>

          {feed.map((post) => (
            <motion.div id={`post-${post.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={post.id} style={{ background: 'rgba(15,15,15,0.8)', borderRadius: '20px', border: `1px solid ${wlConfig?.accent || '#00ff88'}22`, overflow: 'hidden' }}>
              {post.is_pinned && (
                <div style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                  padding: '8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#ffd700'
                }}>
                  <Pin size={12} fill="#ffd700" />
                  <span>Pinned Post</span>
                </div>
              )}
              
              {/* Post Header */}
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.div 
                  whileHover={isNetworkLevel ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' } : {}}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: isNetworkLevel ? 'pointer' : 'default', padding: '6px', borderRadius: '12px', marginLeft: '-6px', transition: 'background 0.2s' }}
                  onClick={() => {
                    if (isNetworkLevel && post.creator_id) {
                      navigate(`/profile/${post.creator_id}${window.location.search}`);
                    }
                  }}
                >
                  <img src={post.creator_avatar || (!isNetworkLevel ? profile.avatar_url : null) || `https://ui-avatars.com/api/?name=${post.creator_username || (!isNetworkLevel ? profile.username : 'Creator')}&background=random`} alt="Avatar" loading="lazy" referrerPolicy="no-referrer" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px' }}>{post.creator_username || (!isNetworkLevel ? profile.username : 'Creator')} <ShieldCheck size={14} color="#ff4d85" style={{ display: 'inline', marginLeft: '4px' }} /></h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{post.date}</span>
                  </div>
                </motion.div>

                {((post.creator_id === user?.id) || (isOwnProfile && !isNetworkLevel) || (isNetworkLevel && targetProfileId === user?.id)) && viewMode === 'edit' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleTogglePin(post.id, post.is_pinned)} style={{ background: post.is_pinned ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255,255,255,0.05)', border: 'none', color: post.is_pinned ? '#ffd700' : 'var(--text-primary)', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background=post.is_pinned ? 'rgba(255, 215, 0, 0.25)' : 'rgba(255,255,255,0.1)'} onMouseOut={e=>e.currentTarget.style.background=post.is_pinned ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255,255,255,0.05)'} title={post.is_pinned ? "Unpin Post" : "Pin Post"}>
                      <Pin size={16} fill={post.is_pinned ? "#ffd700" : "none"} />
                    </button>
                    <button onClick={() => handleEditPost(post.id, post.title)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} title="Edit Post">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeletePost(post.id)} style={{ background: 'rgba(255,50,50,0.1)', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,50,50,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,50,50,0.1)'} title="Delete Post">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Post Body (Content + Media) */}
              <div style={{ position: 'relative' }}>
                <div style={{ transition: 'all 0.3s' }} id={`post-content-${post.id}`}>
                  {/* Post Content / Title */}
                  <div style={{ padding: '0 20px 20px 20px', fontSize: '16px', lineHeight: 1.5 }}>
                    {post.title}
                  </div>

                  {/* Post Payload (Image/Video) */}
                  {post.imgs && post.imgs.length > 0 && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)', position: 'relative' }}>
                      {post.imgs.length === 1 ? (
                        <img src={post.imgs[0]} alt="Post content" loading="lazy" style={{ maxWidth: '100%', width: 'auto', height: 'auto', maxHeight: '550px', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', padding: '0 16px' }} />
                      ) : (
                        <div style={{ position: 'relative', width: '100%', maxWidth: '100%', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {/* Slide Container */}
                          <div style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '12px', background: 'rgba(0,0,0,0.2)' }}>
                            <img src={post.imgs[postImageIndexes[post.id] || 0]} alt={`Post content ${(postImageIndexes[post.id] || 0) + 1}`} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }} />
                          </div>

                          {/* Left Arrow Button */}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handlePrevImage(post.id, post.imgs.length); }}
                            style={{
                              position: 'absolute',
                              left: '12px',
                              background: 'rgba(0,0,0,0.5)',
                              border: '1px solid rgba(255,255,255,0.15)',
                              backdropFilter: 'blur(5px)',
                              color: '#fff',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                              zIndex: 10
                            }}
                          >
                            <ChevronLeft size={18} />
                          </button>

                          {/* Right Arrow Button */}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleNextImage(post.id, post.imgs.length); }}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              background: 'rgba(0,0,0,0.5)',
                              border: '1px solid rgba(255,255,255,0.15)',
                              backdropFilter: 'blur(5px)',
                              color: '#fff',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                              zIndex: 10
                            }}
                          >
                            <ChevronRight size={18} />
                          </button>

                          {/* Pagination Dots Overlay */}
                          <div style={{ position: 'absolute', bottom: '15px', display: 'flex', gap: '6px', zIndex: 10, background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '10px' }}>
                            {post.imgs.map((_, idx) => (
                              <div
                                key={`dot-${idx}`}
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: idx === (postImageIndexes[post.id] || 0) ? '#00ff88' : 'rgba(255,255,255,0.4)',
                                  transition: 'background 0.2s'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Engagement Section (Likes & Comments) */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                    <button 
                      onClick={() => handleLike(post.id)}
                      style={{ background: 'none', border: 'none', color: post.hasLiked ? '#ff4d85' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'color 0.2s' }}
                    >
                      <Heart size={20} fill={post.hasLiked ? '#ff4d85' : 'none'} /> {post.likes || 0}
                    </button>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      <MessageCircle size={20} /> {post.comments?.length || 0}
                    </button>
                    <button 
                      onClick={() => handleSharePost(post)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'color 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.color = '#fff'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                      title="Share Post"
                    >
                      <Share2 size={20} /> Share
                    </button>
                  </div>

                  {/* Comments List */}
                  {post.comments && post.comments.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      {(expandedComments[post.id] ? post.comments : post.comments.slice(0, 2)).map((c: any) => (
                        <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                          <img src={c.avatar || `https://ui-avatars.com/api/?name=${c.user}&background=random`} alt={c.user} loading="lazy" referrerPolicy="no-referrer" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '12px', fontSize: '14px' }}>
                            <strong style={{ display: 'block', color: '#fff', marginBottom: '2px', fontSize: '13px' }}>{c.user}</strong>
                            <span style={{ color: 'var(--text-muted)' }}>{c.text}</span>
                          </div>
                        </div>
                      ))}
                      {post.comments.length > 2 && (
                        <button 
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', padding: '0 40px' }}
                        >
                          {expandedComments[post.id] ? 'Hide comments' : `View all ${post.comments.length} comments`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={user?.user_metadata?.avatar_url || (user ? `https://ui-avatars.com/api/?name=${user.email?.charAt(0)}&background=random` : 'https://ui-avatars.com/api/?name=Guest')} alt="You" loading="lazy" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        placeholder="Add a comment..."
                        value={commentTexts[post.id] || ''}
                        onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleComment(post.id);
                        }}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', paddingRight: '80px', borderRadius: '20px', color: '#fff', outline: 'none' }}
                      />
                      <div style={{ position: 'absolute', right: '8px', display: 'flex', gap: '4px' }}>
                        <EmojiPickerButton onSelect={(emoji) => setCommentTexts(prev => ({ ...prev, [post.id]: (prev[post.id] || '') + emoji }))} />
                        <DictationButton onResult={(text) => setCommentTexts(prev => ({ ...prev, [post.id]: (prev[post.id] || '') ? `${prev[post.id]} ${text}` : text }))} />
                      </div>
                    </div>
                    <button 
                      onClick={() => handleComment(post.id)}
                      disabled={!commentTexts[post.id]?.trim()}
                      style={{ background: commentTexts[post.id]?.trim() ? '#ff4d85' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: commentTexts[post.id]?.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s', flexShrink: 0 }}
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>

            </motion.div>
          ))}
        </div>
        </>
        )}

        {activeTab === 'store' && (
        /* ----------- STORE TAB ----------- */
        <div id="profile-storefront" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Shopify Products (fetched from child network's Shopify store) */}
          {wlConfig?.theme?.shopifyUrl && (
            <ErrorBoundary fallback={<div style={{ padding: '40px', color: '#ff4d4d', textAlign: 'center' }}>⚠️ Storefront failed to load.</div>}>
              <React.Suspense fallback={<div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading store...</div>}>
                <ShopifyStore />
              </React.Suspense>
            </ErrorBoundary>
          )}
          {/* Storefront Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '10px' }}>
            <div>
              <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🛍️ Storefront
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                Browse physical merchandise and exclusive digital releases for sale
              </p>
            </div>
            <button
              onClick={handleShareStore}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}
              title="Share Storefront"
            >
              <Share2 size={16} /> Share Storefront
            </button>
          </div>
          {/* Add Product Form (Edit Mode Only) */}
          {isOwnProfile && viewMode === 'edit' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.15)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>Add New Product to Store</h3>
              <form onSubmit={handleAddProduct} className="responsive-form-two-col">
                <div style={{ gridColumn: '1 / -1' }}>
                  <input type="text" placeholder="Product Title (e.g. VIP Meet & Greet, Drum Kit Vol 1)" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                </div>
                
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                  <span style={{ padding: '14px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>$</span>
                  <input type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                </div>
                
                <select value={newProduct.type} onChange={e => setNewProduct({...newProduct, type: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', cursor: 'pointer' }}>
                  <option value="digital">Digital Download / Ticket</option>
                  <option value="physical">Physical Merch (Ships)</option>
                </select>

                {newProduct.type === 'physical' && (
                  <div className="responsive-form-two-col" style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <input 
                        type="checkbox" 
                        id="isClothingProduct"
                        checked={newProduct.is_clothing} 
                        onChange={e => setNewProduct({...newProduct, is_clothing: e.target.checked, sizes: e.target.checked ? newProduct.sizes : ''})} 
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ff4d85' }} 
                      />
                      <label htmlFor="isClothingProduct" style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                        👕 This is a clothing product (enable size selection)
                      </label>
                    </div>
                    {newProduct.is_clothing && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#ccc' }}>Available Sizes (comma separated)</label>
                        <input type="text" placeholder="e.g. S, M, L, XL" value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }} />
                      </div>
                    )}
                    <div style={{ gridColumn: newProduct.is_clothing ? 'auto' : '1 / -1' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#ccc' }}>Available Colors (comma separated)</label>
                      <input type="text" placeholder="e.g. Black, White, Red" value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }} />
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', gridColumn: '1 / -1' }}>
                  {newProduct.image_url ? (
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', backgroundImage: `url("${newProduct.image_url}")`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.1)' }} />
                  ) : null}
                  <label 
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingProductImg(true); }}
                    onDragLeave={() => setIsDraggingProductImg(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingProductImg(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleProductImageUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    style={{ 
                      flex: 1, 
                      background: isDraggingProductImg ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.05)', 
                      border: isDraggingProductImg ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.1)', 
                      padding: '14px', 
                      borderRadius: '12px', 
                      color: isDraggingProductImg ? '#00ff88' : '#ccc', 
                      textAlign: 'center', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px', 
                      transition: 'all 0.2s ease', 
                      fontWeight: 'bold' 
                    }}
                  >
                    <ImageIcon size={16} /> 
                    {uploadingProductImg ? 'Uploading...' : isDraggingProductImg ? 'Drop here!' : 'Upload Prod Image (Drag & Drop)'}
                    <input type="file" accept="image/*" onChange={handleProductImageUpload} style={{ display: 'none' }} disabled={uploadingProductImg} />
                  </label>
                  <button type="submit" disabled={saving || !newProduct.title} style={{ padding: '0 30px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', opacity: (!newProduct.title || saving) ? 0.5 : 1 }}>
                    {saving ? 'Adding...' : 'Add to Store'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {isOwnProfile && viewMode === 'edit' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>Store Settings & Refund Policy</h3>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Set your custom refund policy displayed to all buyers. Leaving it empty will display the default policy.
              </p>
              <div style={{ position: 'relative' }}>
                <textarea 
                  placeholder="e.g. All digital download sales are final. For apparel refunds, returns are accepted within 14 days of delivery in unused condition."
                  value={refundPolicy}
                  onChange={e => setRefundPolicy(e.target.value)}
                  style={{ 
                    width: '100%', 
                    minHeight: '120px', 
                    background: 'rgba(0,0,0,0.5)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px', 
                    padding: '16px 16px 64px 16px', 
                    color: 'var(--text-primary)', 
                    outline: 'none', 
                    fontSize: '15px', 
                    resize: 'vertical', 
                    backdropFilter: 'blur(10px)',
                    boxSizing: 'border-box'
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => enhanceText('refund_policy')} 
                  disabled={saving} 
                  style={{ position: 'absolute', right: '16px', bottom: '20px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', padding: '8px 16px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(255,77,133,0.4)' }}
                >
                  <Wand size={14} /> AI Boost
                </button>
              </div>
              <button 
                onClick={saveProfile} 
                disabled={saving} 
                style={{ alignSelf: 'flex-end', padding: '10px 24px', background: '#fff', color: '#000', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', opacity: saving ? 0.7 : 1, fontSize: '14px' }}
              >
                {saving ? 'Saving...' : 'Save Store Policy'}
              </button>
            </motion.div>
          )}

          {/* Store Grid */}
          {(() => {
            const visibleProducts = products.filter(p => (isNetworkLevel && isOwnProfile && viewMode === 'edit') ? true : !p.hidden_from_network);
            if (visibleProducts.length === 0) {
              return (
                 <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: `1px solid ${wlConfig?.accent || '#00ff88'}22` }}>
                   <h3 style={{ fontSize: '20px', marginTop: 0, color: 'var(--text-muted)' }}>Store is Empty</h3>
                   <p style={{ color: '#555', marginBottom: 0 }}>There are no visible products available.</p>
                 </div>
              );
            }
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {visibleProducts.map(product => (
                  <motion.div onClick={() => navigate(`/product/${product.id}${window.location.search}`)} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={product.id} className="store-card" style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: `1px solid ${wlConfig?.accent || '#00ff88'}22`, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative' }}>
                    {isNetworkLevel && isOwnProfile && viewMode === 'edit' && (
                      <button 
                        onClick={(e) => handleToggleProductVisibility(e, product.id, product.hidden_from_network)}
                        style={{ position: 'absolute', top: 10, right: 10, padding: '6px 12px', background: product.hidden_from_network ? 'rgba(255,0,0,0.8)' : 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(10px)' }}
                      >
                        {product.hidden_from_network ? 'Hidden' : 'Hide from Network'}
                      </button>
                    )}
                    <div style={{ width: '100%', aspectRatio: '1/1', background: `url("${product.image_url}")`, backgroundSize: 'cover', backgroundPosition: 'center', filter: product.hidden_from_network ? 'grayscale(100%) opacity(0.5)' : 'none' }} />
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, opacity: product.hidden_from_network ? 0.5 : 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', color: product.type === 'physical' ? '#ff4d85' : '#8A2BE2', fontWeight: 'bold', letterSpacing: '1px' }}>
                          {product.type === 'physical' ? 'Physical Merch' : 'Digital Release'}
                        </div>
                        {product.creator && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <img src={product.creator.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.creator.username || 'C')}&background=random`} alt={product.creator.username} loading="lazy" style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>@{product.creator.username}</span>
                          </div>
                        )}
                      </div>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', lineHeight: 1.4, flex: 1 }}>{product.title}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>${parseFloat(product.price).toFixed(2)}</span>
                        {viewMode === 'edit' ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProduct(product);
                              setShowEditModal(true);
                            }} 
                            style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                        ) : (
                          <button style={{ padding: '8px 16px', background: '#fff', border: 'none', borderRadius: '20px', color: '#000', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>Buy Now</button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            );
          })()}

          {/* Public Store Refund Policy Banner */}
          {(!isOwnProfile || viewMode === 'public') && (
            <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '15px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>🛡️ Store Refund Policy</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                {refundPolicy || 'All sales are final. No refunds are provided for digital downloads or virtual bookings. For physical merchandise, please contact the creator directly.'}
              </p>
            </div>
          )}
        </div>
        )}

        {activeTab === 'live' && (
          <ProfileLive
            accent={wlConfig?.accent || 'var(--accent-primary)'}
            isSubscribed={isSubscribed} isOwnProfile={isOwnProfile} localGuestData={localGuestData}
            isPlayingLive={isPlayingLive} isPubliclyLive={isPubliclyLive} streamSource={streamSource}
            isPreviewExpired={isPreviewExpired} liveEmbedUrl={liveEmbedUrl} hasPaidForLive={hasPaidForLive}
            livePrice={livePrice} previewTimeLeft={previewTimeLeft} presenterMode={presenterMode}
            activeGuests={activeGuests} totalSlots={totalSlots} showHost={showHost}
            cameraStatus={cameraStatus} videoRef={videoRef} profile={profile} visibleGuests={visibleGuests}
            homepageImageUrl={homepageImageUrl} channelRef={channelRef}
            setShowExitScreen={setShowExitScreen} viewMode={viewMode} creatorId={creatorId} user={user}
            guests={guests} subPrice={subPrice} setLivePrice={setLivePrice} setStreamSource={setStreamSource}
            setLiveEmbedUrl={setLiveEmbedUrl} setIsPlayingLive={setIsPlayingLive} setIsPubliclyLive={setIsPubliclyLive}
            setPresenterMode={setPresenterMode} setGuests={setGuests} setLocalGuestData={setLocalGuestData}
            handleStripeCheckout={handleStripeCheckout} handleUnlockLive={handleUnlockLive}
            handleSubscribe={handleSubscribe} startLiveStream={startLiveStream} stopLiveStream={stopLiveStream} setShowTipModal={setShowTipModal}
            localStream={localStream}
            liveCountdown={liveCountdown}
            products={products}
            pinnedProducts={pinnedProducts}
            setPinnedProducts={setPinnedProducts}
          />
        )}

        {activeTab === 'booking' && (() => {
          // Dynamic calendar calculations
          const now = new Date();
          const todayDate = now.getDate();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const displayYear = calendarMonthOffset === 0 ? currentYear : (currentMonth === 11 ? currentYear + 1 : currentYear);
          const displayMonth = calendarMonthOffset === 0 ? currentMonth : (currentMonth === 11 ? 0 : currentMonth + 1);
          
          const displayMonthDateObj = new Date(displayYear, displayMonth, 1);
          const displayMonthName = displayMonthDateObj.toLocaleString('default', { month: 'long' });
          const displayYearName = displayMonthDateObj.getFullYear();
          const firstDayIndex = displayMonthDateObj.getDay(); // 0 = Sun, 1 = Mon ...
          const totalDaysInDisplayMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
          const totalDaysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

          const maxDaysInNextMonth = 30 - (totalDaysInCurrentMonth - todayDate + 1);

          const isDayDisabled = (day: number) => {
            if (viewMode === 'edit') {
              if (calendarMonthOffset === 0) {
                return day < todayDate;
              } else {
                return day > maxDaysInNextMonth;
              }
            } else {
              if (calendarMonthOffset === 0) {
                if (day < todayDate) return true;
              } else {
                if (day > maxDaysInNextMonth) return true;
              }
              const isAvailable = availableSlots[day] && availableSlots[day].length > 0;
              return !isAvailable;
            }
          };

          const isDaySelected = (day: number) => {
            return selectedDate === day && selectedMonthOffset === calendarMonthOffset;
          };

          const isDayAvailable = (day: number) => {
            return availableSlots[day] && availableSlots[day].length > 0;
          };

          const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
          
          const daysGrid = [];
          for (let s = 0; s < firstDayIndex; s++) {
            daysGrid.push(<div key={`empty-${s}`} />);
          }
          
          for (let d = 1; d <= totalDaysInDisplayMonth; d++) {
            const disabled = isDayDisabled(d);
            const selected = isDaySelected(d);
            const available = isDayAvailable(d);
            
            daysGrid.push(
              <button
                key={`day-${d}`}
                disabled={disabled}
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedMonthOffset(calendarMonthOffset);
                  setSelectedTime(null);
                }}
                style={{
                  aspectRatio: '1',
                  borderRadius: '50%',
                  border: selected
                    ? `2.5px solid ${wlConfig?.accent || '#00ff88'}`
                    : available && !disabled
                    ? `1px solid ${(wlConfig?.accent || '#00ff88')}66`
                    : '1px solid rgba(255,255,255,0.05)',
                  background: selected
                    ? `${wlConfig?.accent || '#00ff88'}22`
                    : available && !disabled
                    ? `${wlConfig?.accent || '#00ff88'}0c`
                    : 'rgba(255,255,255,0.01)',
                  color: selected
                    ? '#fff'
                    : disabled
                    ? 'rgba(255,255,255,0.15)'
                    : available
                    ? (wlConfig?.accent || '#00ff88')
                    : '#fff',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: selected || available ? 'bold' : 'normal',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: selected ? `0 0 12px ${wlConfig?.accent || '#00ff88'}33` : 'none',
                }}
                onMouseOver={(e) => {
                  if (!disabled && !selected) {
                    e.currentTarget.style.borderColor = wlConfig?.accent || '#00ff88';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!disabled && !selected) {
                    e.currentTarget.style.borderColor = available ? `${wlConfig?.accent || '#00ff88'}66` : 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.background = available ? `${wlConfig?.accent || '#00ff88'}0c` : 'rgba(255, 255, 255, 0.01)';
                  }
                }}
              >
                {d}
                {available && !disabled && (
                  <span style={{
                    position: 'absolute',
                    bottom: '4px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: wlConfig?.accent || '#00ff88',
                    boxShadow: `0 0 4px ${wlConfig?.accent || '#00ff88'}`
                  }} />
                )}
              </button>
            );
          }

          const directMeetingLink = `${window.location.origin}/call/room_${profile?.id || 'demo'}${window.location.search}`;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}>
                
                {/* Dashboard Header */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '24px', marginBottom: '30px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 800, background: 'linear-gradient(90deg, #fff, var(--text-muted))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar size={32} color={wlConfig?.accent || '#00ff88'} /> Book {profile?.username || 'this Creator'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px' }}>Schedule a 1-on-1 session, studio consultation, or collaboration meeting.</p>
                </div>

                {/* Creator Booking Settings Panel */}
                {isOwnProfile && viewMode === 'edit' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.01)', padding: '28px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '30px', backdropFilter: 'blur(20px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '20px', marginBottom: '24px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: wlConfig?.accent || '#00ff88', fontWeight: 'bold' }}>
                          <Settings size={20} /> Creator Booking Settings
                        </h4>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>Configure template weekly hours, pricing rates, and SMS notification alerts.</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                      {/* Left Block: Price & Call Link */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <BookingRateInput 
                          value={bookingPrice} 
                          onChange={setBookingPrice} 
                          accent={wlConfig?.accent} 
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ccc' }}>Virtual Meeting Room Link</span>
                          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', alignItems: 'center' }}>
                            <input type="text" readOnly value={directMeetingLink} style={{ background: 'transparent', border: 'none', padding: '12px 14px', color: 'var(--text-muted)', outline: 'none', fontSize: '13px', flex: 1 }} />
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(directMeetingLink);
                                toast.success("Meeting link copied to clipboard!");
                              }} 
                              style={{
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.04)',
                                color: '#fff',
                                border: 'none',
                                borderLeft: '1px solid rgba(255,255,255,0.08)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                            >
                              <Copy size={14} /> Copy
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Block: SMS Notifications */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.01)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h5 style={{ margin: 0, fontSize: '14px', color: wlConfig?.accent || '#00ff88', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            💬 SMS Alerts & Notifications
                          </h5>
                          <input type="checkbox" checked={smsEnabled} onChange={e => setSmsEnabled(e.target.checked)} style={{ width: '36px', height: '18px', cursor: 'pointer', accentColor: wlConfig?.accent || '#00ff88' }} />
                        </div>
                        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '12px', lineHeight: 1.4 }}>Receive automated reminders and booking confirmations straight to your phone.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mobile Phone Number (e.g. +11234567890)</span>
                          <input type="tel" placeholder="+11234567890" value={smsPhone} onChange={e => setSmsPhone(e.target.value)} disabled={!smsEnabled} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px', opacity: smsEnabled ? 1 : 0.5, transition: 'all 0.2s' }} />
                        </div>
                      </div>
                    </div>

                    {/* Weekly availability template */}
                    <div style={{ marginBottom: '28px' }}>
                      <h5 style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#ccc', fontWeight: 'bold' }}>Weekly Working Hours (Template)</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                          const dayConfig = bookingAvailability[day] || { start: '09:00', end: '17:00', active: false };
                          const isActive = !!dayConfig.active;
                          return (
                            <div key={day} style={{ background: isActive ? `${wlConfig?.accent || '#00ff88'}08` : 'rgba(0,0,0,0.3)', padding: '14px 12px', borderRadius: '14px', border: '1.5px solid', borderColor: isActive ? (wlConfig?.accent || '#00ff88') : 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'all 0.25s ease', boxShadow: isActive ? `0 4px 15px ${wlConfig?.accent || '#00ff88'}0c` : 'none' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', color: isActive ? '#fff' : '#aaa' }}>
                                <input type="checkbox" checked={isActive} onChange={e => {
                                  setBookingAvailability(prev => ({
                                    ...prev,
                                    [day]: { ...dayConfig, active: e.target.checked }
                                  }));
                                }} style={{ width: '18px', height: '18px', accentColor: wlConfig?.accent || '#00ff88', cursor: 'pointer' }} />
                                {day}
                              </label>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: isActive ? 1 : 0.3, pointerEvents: isActive ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                                <input type="time" value={dayConfig.start || '09:00'} onChange={e => {
                                  setBookingAvailability(prev => ({
                                    ...prev,
                                    [day]: { ...dayConfig, start: e.target.value }
                                  }));
                                }} style={{ flex: 1, minWidth: '0', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 4px', borderRadius: '8px', color: '#fff', fontSize: '12px', outline: 'none', textAlign: 'center' }} />
                                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>to</span>
                                <input type="time" value={dayConfig.end || '17:00'} onChange={e => {
                                  setBookingAvailability(prev => ({
                                    ...prev,
                                    [day]: { ...dayConfig, end: e.target.value }
                                  }));
                                }} style={{ flex: 1, minWidth: '0', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 4px', borderRadius: '8px', color: '#fff', fontSize: '12px', outline: 'none', textAlign: 'center' }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Settings Action Buttons */}
                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button 
                        onClick={async () => {
                          setSaving(true);
                          try {
                            const today = new Date();
                            const slotsToInsert = [];
                            
                            const { error: deleteError } = await supabase!
                              .from('available_slots')
                              .delete()
                              .eq('creator_id', user.id)
                              .eq('is_booked', false);
                              
                            if (deleteError) {
                              throw new Error(`Failed to clear old slots: ${deleteError.message}`);
                            }

                            for (let offset = 0; offset < 30; offset++) {
                              const currentTarget = new Date();
                              currentTarget.setDate(today.getDate() + offset);
                              const dayName = currentTarget.toLocaleString('default', { weekday: 'short' });
                              const dayConfig = bookingAvailability[dayName];
                              
                              if (dayConfig && dayConfig.active) {
                                const dateVal = currentTarget.getDate();
                                const [startH, startM] = dayConfig.start.split(':').map(Number);
                                const [endH, endM] = dayConfig.end.split(':').map(Number);
                                
                                let currentHour = startH;
                                while (currentHour < endH) {
                                  const ampm = currentHour >= 12 ? 'PM' : 'AM';
                                  const displayHour = currentHour % 12 || 12;
                                  const timeStr = `${displayHour}:00 ${ampm}`;
                                  
                                  slotsToInsert.push({
                                    creator_id: user.id,
                                    date: dateVal,
                                    time: timeStr,
                                    is_booked: false
                                  });
                                  currentHour += 1;
                                }
                              }
                            }
                            
                            if (slotsToInsert.length === 0) {
                              toast.info("No active days configured in availability template. No slots generated.");
                              return;
                            }

                            const { error: insertError } = await supabase!
                              .from('available_slots')
                              .insert(slotsToInsert);

                            if (insertError) {
                              throw new Error(`Bulk insert failed: ${insertError.message}`);
                            }

                            const { data: refreshedSlots } = await supabase!
                              .from('available_slots')
                              .select('*')
                              .eq('creator_id', user.id)
                              .eq('is_booked', false);
                              
                            const refreshedMap: Record<number, string[]> = {};
                            if (refreshedSlots) {
                              refreshedSlots.forEach((slot: any) => {
                                const day = slot.date;
                                refreshedMap[day] = refreshedMap[day] || [];
                                refreshedMap[day].push(slot.time);
                              });
                              Object.keys(refreshedMap).forEach((day: any) => {
                                refreshedMap[day].sort();
                              });
                            }
                            setAvailableSlots(refreshedMap);
                            toast.success(`Successfully generated ${slotsToInsert.length} availability slots for the next 30 days!`);
                          } catch (err: any) {
                            console.error("Slot generation error:", err);
                            toast.error(err.message || "Failed to generate slots");
                          } finally {
                            setSaving(false);
                          }
                        }}
                        style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' }}
                        onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
                        onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                      >
                        🔄 Generate Slots (Next 30 Days)
                      </button>
                      
                      <button 
                        onClick={saveBookingSettings}
                        style={{ padding: '12px 24px', background: `linear-gradient(135deg, ${wlConfig?.accent || '#00ff88'}, #8A2BE2)`, color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 4px 15px rgba(138,43,226,0.25)', transition: 'all 0.2s' }}
                        onMouseOver={e=>e.currentTarget.style.opacity='0.9'}
                        onMouseOut={e=>e.currentTarget.style.opacity='1'}
                      >
                        💾 Save Booking Settings
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Main Client/Guest Booking Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
                  
                  {/* Left Column: Calendar & Time Slots */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Calendar Card */}
                    <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '28px', backdropFilter: 'blur(20px)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          1. Select a Date
                        </h4>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', marginRight: '6px' }}>
                            {displayMonthName} {displayYearName}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button 
                              disabled={calendarMonthOffset === 0} 
                              onClick={() => setCalendarMonthOffset(0)}
                              style={{
                                background: calendarMonthOffset === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                                border: 'none',
                                color: calendarMonthOffset === 0 ? 'rgba(255,255,255,0.15)' : '#fff',
                                cursor: calendarMonthOffset === 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={e => {
                                if (calendarMonthOffset !== 0) e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                              }}
                              onMouseOut={e => {
                                if (calendarMonthOffset !== 0) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                              }}
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <button 
                              disabled={calendarMonthOffset === 1} 
                              onClick={() => setCalendarMonthOffset(1)}
                              style={{
                                background: calendarMonthOffset === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)',
                                border: 'none',
                                color: calendarMonthOffset === 1 ? 'rgba(255,255,255,0.15)' : '#fff',
                                cursor: calendarMonthOffset === 1 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={e => {
                                if (calendarMonthOffset !== 1) e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                              }}
                              onMouseOut={e => {
                                if (calendarMonthOffset !== 1) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                              }}
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Day Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
                        {weekdays.map((day, i) => (
                          <div key={i} style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 'bold', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{day}</div>
                        ))}
                        {daysGrid}
                      </div>
                    </div>

                    {/* Time Selection Card */}
                    <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '28px', minHeight: '180px', backdropFilter: 'blur(20px)' }}>
                      <h4 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        2. Available Slots
                      </h4>

                      {/* Add Slot Block for Creator Edit View */}
                      {isOwnProfile && viewMode === 'edit' && selectedDate ? (
                        <div style={{ marginBottom: '20px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Add manual slot for {displayMonthName} {selectedDate}:</span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="time" value={newTimeInput} onChange={e => setNewTimeInput(e.target.value)} style={{ flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }} />
                            <button 
                              onClick={async () => {
                                if (!newTimeInput) return;
                                const [h, m] = newTimeInput.split(':');
                                let hour = parseInt(h);
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                hour = hour % 12 || 12;
                                const timeString = `${hour}:${m} ${ampm}`;
                                
                                try {
                                  const { error } = await supabase!.from('available_slots').insert({
                                    creator_id: targetProfileId,
                                    date: selectedDate,
                                    time: timeString
                                  });
                                  
                                  if (error) {
                                    if (error.code === '23505') {
                                      toast.error('This timeslot is already added.');
                                    } else {
                                      toast.error(`Error adding slot: ${error.message}`);
                                    }
                                    return;
                                  }
                                  
                                  setAvailableSlots(prev => {
                                    const current = prev[selectedDate] || [];
                                    if (!current.includes(timeString)) return { ...prev, [selectedDate]: [...current, timeString].sort() };
                                    return prev;
                                  });
                                  toast.success('Timeslot added successfully!');
                                } catch (err: any) {
                                  toast.error(err.message || 'Failed to add timeslot');
                                }
                                setNewTimeInput('');
                              }}
                              style={{ padding: '10px 20px', background: wlConfig?.accent || '#00ff88', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', transition: 'opacity 0.2s' }}
                              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                              onMouseOut={e => e.currentTarget.style.opacity = '1'}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {selectedDate ? (
                        availableSlots[selectedDate]?.length > 0 ? (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                            {availableSlots[selectedDate].map(time => {
                              const isTimeSelected = selectedTime === time;
                              return (
                                <div key={time} style={{ display: 'flex', gap: '6px' }}>
                                  <button 
                                    onClick={() => setSelectedTime(time)}
                                    style={{ 
                                      flex: 1, 
                                      padding: '14px 10px', 
                                      borderRadius: '12px', 
                                      border: '1.5px solid', 
                                      borderColor: isTimeSelected ? (wlConfig?.accent || '#00ff88') : 'transparent', 
                                      background: isTimeSelected 
                                        ? `${wlConfig?.accent || '#00ff88'}1c` 
                                        : 'rgba(255,255,255,0.02)', 
                                      color: isTimeSelected ? (wlConfig?.accent || '#00ff88') : '#fff', 
                                      fontSize: '13px', 
                                      fontWeight: 'bold', 
                                      cursor: 'pointer', 
                                      transition: 'all 0.2s ease',
                                      textAlign: 'center',
                                      boxShadow: isTimeSelected ? `0 0 12px ${wlConfig?.accent || '#00ff88'}1c` : 'none'
                                    }}
                                    onMouseOver={e => {
                                      if (!isTimeSelected) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                      }
                                    }}
                                    onMouseOut={e => {
                                      if (!isTimeSelected) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                      }
                                    }}
                                  >
                                    {time}
                                  </button>
                                  {isOwnProfile && viewMode === 'edit' && (
                                    <button 
                                      onClick={async () => {
                                        try {
                                          const { error } = await supabase!
                                            .from('available_slots')
                                            .delete()
                                            .match({
                                              creator_id: targetProfileId,
                                              date: selectedDate,
                                              time: time
                                            });

                                          if (error) {
                                            toast.error(`Failed to delete timeslot: ${error.message}`);
                                            return;
                                          }

                                          setAvailableSlots(prev => ({
                                            ...prev,
                                            [selectedDate!]: prev[selectedDate!].filter(t => t !== time)
                                          }));
                                          if (selectedTime === time) setSelectedTime(null);
                                          toast.success('Slot removed.');
                                        } catch (err: any) {
                                          toast.error(err.message || 'Failed to remove slot');
                                        }
                                      }}
                                      style={{ 
                                        background: 'rgba(255,0,0,0.08)', 
                                        color: '#ff4d4d', 
                                        border: '1px solid rgba(255,0,0,0.15)', 
                                        borderRadius: '12px', 
                                        padding: '0 12px', 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s'
                                      }}
                                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,0,0,0.15)'}
                                      onMouseOut={e => e.currentTarget.style.background = 'rgba(255,0,0,0.08)'}
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '10px', color: 'var(--text-muted)' }}>
                            <Clock size={32} style={{ opacity: 0.5, color: wlConfig?.accent || '#00ff88' }} />
                            <span style={{ fontSize: '13px', fontStyle: 'italic' }}>No times available on this date.</span>
                          </div>
                        )
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '10px', color: 'var(--text-muted)' }}>
                          <Calendar size={32} style={{ opacity: 0.5, color: wlConfig?.accent || '#00ff88' }} />
                          <span style={{ fontSize: '13px', fontStyle: 'italic' }}>Please select a date on the calendar.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Confirmation Form & Checkout */}
                  <div>
                    {!selectedTime ? (
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: '24px', padding: '50px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', minHeight: '320px', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Clock size={28} style={{ color: wlConfig?.accent || '#00ff88', opacity: 0.8 }} />
                        </div>
                        <div style={{ maxWidth: '280px' }}>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Configure Your Session</h4>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>Choose an available date and timeslot from the scheduler on the left to configure your meeting details.</p>
                        </div>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '28px', backdropFilter: 'blur(20px)' }}>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          3. Meeting Details
                        </h4>

                        {/* Selected Slot Receipt Header */}
                        <div style={{ background: `${wlConfig?.accent || '#00ff88'}08`, border: `1.5px solid ${wlConfig?.accent || '#00ff88'}2a`, borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: `0 4px 15px ${wlConfig?.accent || '#00ff88'}08` }}>
                          <CheckCircle size={22} color={wlConfig?.accent || '#00ff88'} style={{ flexShrink: 0 }} />
                          <div>
                            <span style={{ fontSize: '11px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', fontWeight: 'bold' }}>Selected Appointment</span>
                            <strong style={{ fontSize: '14px', color: '#fff' }}>
                              {displayMonthName} {selectedDate}, {displayYearName} at {selectedTime}
                            </strong>
                          </div>
                        </div>



                        {/* Call Mode Selection (Only if virtual) */}
                        {bookingType === 'virtual' && (
                          <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#ccc', marginBottom: '8px' }}>Call Modality</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button 
                                onClick={() => setVirtualCallType('video')} 
                                style={{ 
                                  flex: 1, 
                                  padding: '12px', 
                                  background: virtualCallType === 'video' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.3)', 
                                  border: '1.5px solid', 
                                  borderColor: virtualCallType === 'video' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', 
                                  color: virtualCallType === 'video' ? '#fff' : '#888', 
                                  borderRadius: '10px', 
                                  cursor: 'pointer', 
                                  fontWeight: 'bold', 
                                  fontSize: '13px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  transition: 'all 0.2s' 
                                }}
                              >
                                <Video size={14} style={{ color: virtualCallType === 'video' ? (wlConfig?.accent || '#00ff88') : '#888' }} />
                                <span>Video WebRTC</span>
                              </button>
                              <button 
                                onClick={() => setVirtualCallType('audio')} 
                                style={{ 
                                  flex: 1, 
                                  padding: '12px', 
                                  background: virtualCallType === 'audio' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.3)', 
                                  border: '1.5px solid', 
                                  borderColor: virtualCallType === 'audio' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', 
                                  color: virtualCallType === 'audio' ? '#fff' : '#888', 
                                  borderRadius: '10px', 
                                  cursor: 'pointer', 
                                  fontWeight: 'bold', 
                                  fontSize: '13px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  transition: 'all 0.2s' 
                                }}
                              >
                                🎙️ Audio Only
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Duration dropdown */}
                        <div style={{ marginBottom: '20px' }}>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#ccc', marginBottom: '8px' }}>Duration</label>
                          <div style={{ position: 'relative' }}>
                            <select 
                              value={bookingDuration} 
                              onChange={e => setBookingDuration(Number(e.target.value))} 
                              style={{ 
                                width: '100%', 
                                background: 'rgba(0,0,0,0.4)', 
                                border: '1.5px solid rgba(255,255,255,0.08)', 
                                padding: '14px', 
                                borderRadius: '12px', 
                                color: '#fff', 
                                outline: 'none', 
                                appearance: 'none', 
                                fontSize: '14px',
                                cursor: 'pointer' 
                              }}
                            >
                              <option value={1} style={{ background: '#111' }}>1 Hour Session</option>
                              <option value={2} style={{ background: '#111' }}>2 Hours Session</option>
                              <option value={3} style={{ background: '#111' }}>3 Hours Session</option>
                              <option value={4} style={{ background: '#111' }}>4 Hours Session</option>
                              <option value={8} style={{ background: '#111' }}>8 Hours (Full Day)</option>
                            </select>
                            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888', fontSize: '12px' }}>▼</div>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                          <BookingFormInput 
                            label="Your Full Name" 
                            value={guestName} 
                            onChange={setGuestName} 
                            placeholder="e.g. John Doe" 
                            icon={Users} 
                            accent={wlConfig?.accent} 
                          />
                          <BookingFormInput 
                            label="Mobile Phone Number (SMS Updates)" 
                            value={guestPhone} 
                            onChange={setGuestPhone} 
                            placeholder="e.g. +11234567890" 
                            icon={Clock} 
                            accent={wlConfig?.accent} 
                          />
                          <BookingFormInput 
                            label="Topic / Purpose of Meeting" 
                            value={meetingPurpose} 
                            onChange={setMeetingPurpose} 
                            placeholder="e.g. Brand design consultation" 
                            icon={Edit3} 
                            accent={wlConfig?.accent} 
                          />
                        </div>

                        {/* Recording Addon toggle card */}
                        {bookingType === 'virtual' && (
                          <div 
                            onClick={() => setRecordCall(!recordCall)}
                            style={{ 
                              marginBottom: '24px', 
                              padding: '16px', 
                              background: recordCall ? `${wlConfig?.accent || '#00ff88'}0a` : 'rgba(255,255,255,0.01)', 
                              borderRadius: '14px', 
                              border: '1.5px solid',
                              borderColor: recordCall ? (wlConfig?.accent || '#00ff88') : 'rgba(255,255,255,0.05)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              userSelect: 'none',
                              transition: 'all 0.2s ease',
                              boxShadow: recordCall ? `0 4px 15px ${wlConfig?.accent || '#00ff88'}0c` : 'none'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <input type="checkbox" checked={recordCall} onChange={() => {}} style={{ width: '18px', height: '18px', accentColor: wlConfig?.accent || '#00ff88', cursor: 'pointer' }} />
                              <div>
                                <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#fff', display: 'block' }}>📹 Record Session & Archive</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Delivers full copy to your User Library.</span>
                              </div>
                            </div>
                            <span style={{ fontWeight: 'bold', color: wlConfig?.accent || '#00ff88', fontSize: '14px', padding: '4px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                              {virtualCallType === 'audio' ? '+$10.00' : '+$15.00'}
                            </span>
                          </div>
                        )}

                        {/* Cost Receipt Breakdown */}
                        <div style={{
                          background: 'rgba(0,0,0,0.4)',
                          borderRadius: '16px',
                          padding: '20px',
                          border: '1px solid rgba(255,255,255,0.06)',
                          marginBottom: '24px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          {/* A decorative ticket-cut on the sides */}
                          <div style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: '#09090b', borderRight: '1px solid rgba(255,255,255,0.06)' }} />
                          <div style={{ position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: '#09090b', borderLeft: '1px solid rgba(255,255,255,0.06)' }} />
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                            <span>Consultation Fee ({bookingDuration}hr x ${Number(bookingPrice).toFixed(2)}/hr)</span>
                            <span style={{ color: '#fff', fontWeight: '500' }}>${(Number(bookingPrice) * bookingDuration).toFixed(2)}</span>
                          </div>
                          
                          {recordCall && bookingType === 'virtual' && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                              <span>Add-on: Session Recording</span>
                              <span style={{ color: '#fff', fontWeight: '500' }}>${(virtualCallType === 'audio' ? 10 : 15).toFixed(2)}</span>
                            </div>
                          )}

                          <div style={{ height: '1px', borderTop: '1px dashed rgba(255,255,255,0.15)', margin: '16px 0' }} />

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold' }}>Total Amount</span>
                            <strong style={{ fontSize: '22px', color: wlConfig?.accent || '#00ff88', textShadow: `0 0 15px ${(wlConfig?.accent || '#00ff88')}33`, fontFamily: 'monospace' }}>
                              ${((Number(bookingPrice) * bookingDuration) + (recordCall && bookingType === 'virtual' ? (virtualCallType === 'audio' ? 10 : 15) : 0)).toFixed(2)}
                            </strong>
                          </div>
                        </div>

                        {/* Book CTA Button */}
                        <button 
                          onClick={async () => { 
                            if (!guestName) {
                              toast.error('Please enter your name.');
                              return;
                            }
                            const monthName = displayMonthName;
                            const slotDate = selectedDate;
                            const slotTime = selectedTime;
                            if (!slotDate || !slotTime) return;

                            try {
                              const { error } = await supabase!
                                .from('available_slots')
                                .update({ is_booked: true })
                                .match({
                                  creator_id: targetProfileId,
                                  date: slotDate,
                                  time: slotTime
                                });

                              if (error) {
                                console.error("Error setting slot is_booked:", error);
                              } else {
                                setAvailableSlots(prev => ({
                                  ...prev,
                                  [slotDate]: (prev[slotDate] || []).filter(t => t !== slotTime)
                                }));
                              }
                            } catch (err) {
                              console.error("Booking db error:", err);
                            }

                            const recordingFee = recordCall && bookingType === 'virtual' ? (virtualCallType === 'audio' ? 10 : 15) : 0;
                            const finalPrice = (Number(bookingPrice) * bookingDuration) + recordingFee;
                            const scheduledAtISO = getScheduledAtISO(slotDate, slotTime);

                            handleStripeCheckout(
                              `${bookingType === 'virtual' ? `1-on-1 Virtual ${virtualCallType === 'audio' ? 'Audio' : 'Video'} Call` : 'Physical Meeting'} (${monthName} ${slotDate} at ${slotTime}) - ${bookingDuration} Hour(s)`,
                              finalPrice,
                              { 
                                is_booking: true, 
                                date: `${monthName} ${slotDate}`, 
                                time: slotTime, 
                                duration: bookingDuration, 
                                meeting_type: bookingType === 'virtual' ? `virtual_${virtualCallType}` : 'physical',
                                guest_name: guestName,
                                guest_phone: guestPhone,
                                meeting_purpose: meetingPurpose,
                                scheduled_at: scheduledAtISO,
                                record_call: recordCall && bookingType === 'virtual',
                                recording_price: recordingFee
                              }
                            ); 
                            
                            setSelectedTime(null); 
                            setSelectedDate(null); 
                            setSelectedMonthOffset(null);
                            setGuestName('');
                            setGuestPhone('');
                            setMeetingPurpose('');
                            setRecordCall(false);
                          }} 
                          style={{ width: '100%', padding: '18px', background: `linear-gradient(135deg, ${wlConfig?.accent || '#00ff88'}, #8A2BE2)`, color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: `0 8px 25px ${(wlConfig?.accent || '#00ff88')}33`, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                          onMouseOver={e=>{
                            e.currentTarget.style.transform='translateY(-1px)';
                            e.currentTarget.style.boxShadow=`0 10px 30px ${(wlConfig?.accent || '#00ff88')}44`;
                          }} 
                          onMouseOut={e=>{
                            e.currentTarget.style.transform='none';
                            e.currentTarget.style.boxShadow=`0 8px 25px ${(wlConfig?.accent || '#00ff88')}33`;
                          }}
                        >
                          💳 Confirm & Pay Session
                        </button>
                        
                        {/* Booking Refund Policy Disclaimer */}
                        <div style={{ marginTop: '16px', padding: '10px 14px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.4 }}>
                            🛡️ Booking Terms: {refundPolicy || 'All bookings are final. Rescheduling requests must be received at least 24 hours prior to the session start.'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                </div>
              </motion.div>
            </div>
          );
        })()}

        {activeTab === 'series' && (
        /* ----------- TV SERIES TAB ----------- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {isOwnProfile && viewMode === 'edit' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.15)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>Create New Series</h3>
                <form onSubmit={handleAddSeries} className="responsive-form-two-col">
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input type="text" placeholder="Series Title (e.g. Neon Nights)" value={newSeries.title} onChange={e => setNewSeries({...newSeries, title: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <textarea placeholder="Series Description..." value={newSeries.description} onChange={e => setNewSeries({...newSeries, description: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', minHeight: '80px', resize: 'vertical' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', color: '#ccc', fontWeight: 'bold' }}>Billing Model</label>
                    <select 
                      value={newSeries.billing_level} 
                      onChange={e => setNewSeries({...newSeries, billing_level: e.target.value, price: e.target.value === 'episode' ? '' : newSeries.price })}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', cursor: 'pointer' }}
                    >
                      <option value="series">Charge Per Series (Season Pass)</option>
                      <option value="episode">Charge Per Episode (Pay Per Episode)</option>
                    </select>
                  </div>

                  {newSeries.billing_level === 'series' && (
                    <>
                      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                        <span style={{ padding: '14px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>Full Season $</span>
                        <input type="number" step="0.01" placeholder="Price" value={newSeries.price} onChange={e => setNewSeries({...newSeries, price: e.target.value})} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                      </div>

                      {/* Subscriber Pricing Rules for Series */}
                      <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🔒 Subscriber Access Rules (Series)</span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="checkbox" 
                            id="seriesSubFree" 
                            checked={newSeries.subscriber_free} 
                            onChange={e => setNewSeries({ ...newSeries, subscriber_free: e.target.checked, subscriber_price: e.target.checked ? '' : newSeries.subscriber_price })}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ff4d85' }}
                          />
                          <label htmlFor="seriesSubFree" style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                            🎁 Allow active subscribers to view this full series for free
                          </label>
                        </div>

                        {!newSeries.subscriber_free && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ color: '#ccc', fontSize: '13px' }}>Subscriber Discounted Price (Optional)</label>
                            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', width: '200px' }}>
                              <span style={{ padding: '12px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}>$</span>
                              <input 
                                type="number" 
                                step="0.01" 
                                placeholder="Discounted Price" 
                                value={newSeries.subscriber_price} 
                                onChange={e => setNewSeries({ ...newSeries, subscriber_price: e.target.value })} 
                                style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }} 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    {newSeries.img ? (
                      <div style={{ width: '100px', height: '56px', borderRadius: '8px', backgroundImage: `url("${newSeries.img}")`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
                    ) : null}
                    <label 
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingSeriesImg(true); }}
                      onDragLeave={() => setIsDraggingSeriesImg(false)}
                      onDrop={async (e) => {
                        e.preventDefault();
                        setIsDraggingSeriesImg(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          await handleSeriesCoverUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      style={{
                        flex: 1,
                        background: isDraggingSeriesImg ? 'rgba(255,77,133,0.05)' : 'rgba(0,0,0,0.5)',
                        border: isDraggingSeriesImg ? '2px dashed #ff4d85' : '1px solid rgba(255,255,255,0.1)',
                        padding: '14px',
                        borderRadius: '12px',
                        color: isDraggingSeriesImg ? '#ff4d85' : '#ccc',
                        textAlign: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '15px',
                        transition: 'all 0.2s ease',
                        fontWeight: 'bold'
                      }}
                    >
                      <ImageIcon size={16} />
                      {uploadingSeriesImg ? 'Uploading Cover...' : isDraggingSeriesImg ? 'Drop here!' : newSeries.img ? 'Cover Uploaded ✓' : 'Upload Series Cover (Drag & Drop)'}
                      <input type="file" accept="image/*" onChange={handleSeriesCoverUpload} style={{ display: 'none' }} disabled={uploadingSeriesImg} />
                    </label>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={!newSeries.title || uploadingSeriesImg} style={{ padding: '12px 24px', background: (!newSeries.title || uploadingSeriesImg) ? 'rgba(255,255,255,0.1)' : '#ff4d85', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: (!newSeries.title || uploadingSeriesImg) ? 'not-allowed' : 'pointer' }}>Publish Series</button>
                  </div>
                </form>
              </motion.div>
            )}

            {seriesList.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px', margin: 0 }}>No original series published yet.</p>
              </div>
            ) : (!isOwnProfile || viewMode === 'public') ? (
              selectedSeriesForViewer ? (
                /* ----------- DETAILED SERIES VIEW ----------- */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Navigation row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button 
                      onClick={() => setSelectedSeriesForViewer(null)} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        padding: '10px 18px', 
                        borderRadius: '12px', 
                        color: 'var(--text-primary)', 
                        fontWeight: 'bold', 
                        cursor: 'pointer', 
                        fontSize: '14px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    >
                      <ChevronLeft size={16} /> Back to Episodes
                    </button>
                  </div>

                  {/* Hero Card for Selected Series */}
                  <div 
                    style={{ 
                      display: 'flex', 
                      gap: '30px', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      backdropFilter: 'blur(20px)', 
                      padding: '30px', 
                      borderRadius: '24px', 
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      flexDirection: 'row',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div 
                      style={{ 
                        width: '300px',
                        maxWidth: '100%',
                        aspectRatio: '1/1', 
                        borderRadius: '16px', 
                        backgroundImage: `url(${selectedSeriesForViewer.img || 'https://picsum.photos/seed/cybercity/600/300'})`, 
                        backgroundSize: 'cover', 
                        backgroundPosition: 'center',
                        flexShrink: 0
                      }} 
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 300px', gap: '16px', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ background: 'rgba(255,77,133,0.2)', color: '#ff4d85', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: '1px solid #ff4d85', textTransform: 'uppercase' }}>
                          Original Series
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {selectedSeriesForViewer.episodes?.length || 0} {selectedSeriesForViewer.episodes?.length === 1 ? 'Episode' : 'Episodes'}
                        </span>
                      </div>
                      <h2 style={{ fontSize: '32px', margin: 0, fontWeight: 'bold', color: 'var(--text-primary)' }}>{selectedSeriesForViewer.title}</h2>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>{selectedSeriesForViewer.description}</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                        {(() => {
                          const isSeasonUnlocked = isOwnProfile || (
                            selectedSeriesForViewer.billing_level !== 'episode' && (
                              purchasedSeasons.includes(selectedSeriesForViewer.id) ||
                              (isSubscribed && selectedSeriesForViewer.subscriber_free) ||
                              parseFloat(selectedSeriesForViewer.price || '0') === 0
                            )
                          );
                          
                          if (selectedSeriesForViewer.billing_level === 'episode') {
                            return (
                              <span style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                color: '#ccc', 
                                padding: '10px 20px', 
                                borderRadius: '12px', 
                                fontSize: '14px', 
                                fontWeight: 'bold',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }}>
                                🎫 Pay-Per-Episode Series
                              </span>
                            );
                          }

                          if (isSeasonUnlocked) {
                            return (
                              <button 
                                onClick={() => {
                                  setActiveCinemaSeries(selectedSeriesForViewer);
                                  setActiveCinemaEpisode(selectedSeriesForViewer.episodes?.[0] || null);
                                  setShowCinemaModal(true);
                                }}
                                style={{ 
                                  padding: '14px 28px', 
                                  background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', 
                                  color: '#fff', 
                                  border: 'none', 
                                  borderRadius: '14px', 
                                  fontWeight: 'bold', 
                                  fontSize: '15px', 
                                  cursor: 'pointer', 
                                  transition: 'all 0.2s', 
                                  boxShadow: '0 4px 15px rgba(138,43,226,0.3)' 
                                }}
                                onMouseOver={e=>e.currentTarget.style.transform='scale(1.03)'}
                                onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                              >
                                Stream Season 🍿
                              </button>
                            );
                          } else {
                            let displayPrice = parseFloat(selectedSeriesForViewer.price || '0');
                            let priceText = `$${displayPrice.toFixed(2)}`;
                            if (isSubscribed) {
                              if (selectedSeriesForViewer.subscriber_free) {
                                priceText = 'FREE for Subscribers';
                              } else if (selectedSeriesForViewer.subscriber_price !== null && selectedSeriesForViewer.subscriber_price !== undefined && selectedSeriesForViewer.subscriber_price !== '') {
                                priceText = `$${parseFloat(selectedSeriesForViewer.subscriber_price).toFixed(2)} (Subscriber Discount)`;
                              }
                            }
                            return (
                              <button 
                                onClick={() => handleBuySeasonSimulation(selectedSeriesForViewer)}
                                style={{ 
                                  padding: '14px 28px', 
                                  background: '#fff', 
                                  color: '#000', 
                                  border: 'none', 
                                  borderRadius: '14px', 
                                  fontWeight: 'bold', 
                                  fontSize: '15px', 
                                  cursor: 'pointer', 
                                  transition: 'all 0.2s', 
                                  boxShadow: '0 4px 15px rgba(255,255,255,0.15)' 
                                }}
                                onMouseOver={e=>e.currentTarget.style.transform='scale(1.03)'}
                                onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                              >
                                Buy Full Season ({priceText})
                              </button>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Episode Listing Section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '10px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Episodes List
                    </h3>

                    {!selectedSeriesForViewer.episodes || selectedSeriesForViewer.episodes.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>No episodes added to this series yet.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {selectedSeriesForViewer.episodes.map((episode: any, idx: number) => {
                          const isSeasonUnlocked = isOwnProfile || (
                            selectedSeriesForViewer.billing_level !== 'episode' && (
                              purchasedSeasons.includes(selectedSeriesForViewer.id) ||
                              (isSubscribed && selectedSeriesForViewer.subscriber_free) ||
                              parseFloat(selectedSeriesForViewer.price || '0') === 0
                            )
                          );
                          const isEpUnlocked = isOwnProfile || 
                            isSeasonUnlocked || 
                            purchasedEpisodes.includes(episode.id) || 
                            (isSubscribed && episode.subscriber_free) ||
                            parseFloat(episode.price || '0') === 0;

                          return (
                            <div 
                              key={episode.id}
                              style={{ 
                                display: 'flex', 
                                gap: '20px', 
                                background: 'rgba(255, 255, 255, 0.02)', 
                                border: '1px solid rgba(255, 255, 255, 0.05)', 
                                padding: '20px', 
                                borderRadius: '16px', 
                                alignItems: 'center',
                                flexWrap: 'wrap'
                              }}
                            >
                              {/* Episode Image */}
                              <div 
                                style={{ 
                                  width: '180px', 
                                  aspectRatio: '16/9', 
                                  borderRadius: '10px', 
                                  background: `url(${episode.thumbnail_url || `https://picsum.photos/seed/ep${idx+1}/300/170`}) center/cover`,
                                  position: 'relative',
                                  flexShrink: 0
                                }}
                              >
                                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.85)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                                  {episode.length || 'TBD'}
                                </div>
                              </div>

                              {/* Episode Details */}
                              <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ff4d85', textTransform: 'uppercase' }}>
                                    Episode {idx + 1}
                                  </span>
                                  {episode.rating && (
                                    <span style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                                      {episode.rating}
                                    </span>
                                  )}
                                  {episode.genre && (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                      • {episode.genre}
                                    </span>
                                  )}
                                </div>
                                <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>
                                  {episode.title}
                                </h4>
                                {episode.description && (
                                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                    {episode.description}
                                  </p>
                                )}
                              </div>

                              {/* Action button */}
                              <div style={{ flexShrink: 0 }}>
                                {isEpUnlocked ? (
                                  <button 
                                    onClick={() => {
                                      setActiveCinemaSeries(selectedSeriesForViewer);
                                      setActiveCinemaEpisode(episode);
                                      setShowCinemaModal(true);
                                    }}
                                    style={{ 
                                      padding: '10px 24px', 
                                      background: 'linear-gradient(135deg, #00ff88, #00bbff)', 
                                      border: 'none', 
                                      color: '#000', 
                                      borderRadius: '12px', 
                                      fontWeight: 'bold', 
                                      fontSize: '13px', 
                                      cursor: 'pointer',
                                      transition: 'transform 0.1s'
                                    }}
                                    onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'}
                                    onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                                  >
                                    Play Episode 🍿
                                  </button>
                                ) : (
                                  (() => {
                                    let displayPrice = parseFloat(episode.price || '0');
                                    let priceText = `$${displayPrice.toFixed(2)}`;
                                    if (isSubscribed) {
                                      if (episode.subscriber_free) {
                                        priceText = 'FREE';
                                      } else if (episode.subscriber_price !== null && episode.subscriber_price !== undefined && episode.subscriber_price !== '') {
                                        priceText = `$${parseFloat(episode.subscriber_price).toFixed(2)}`;
                                      }
                                    }
                                    return (
                                      <button 
                                        onClick={() => handleBuyEpisodeSimulation(episode, selectedSeriesForViewer)}
                                        style={{ 
                                          padding: '10px 24px', 
                                          background: 'rgba(255,255,255,0.08)', 
                                          border: '1px solid rgba(255,255,255,0.1)', 
                                          color: 'var(--text-primary)', 
                                          borderRadius: '12px', 
                                          fontWeight: 'bold', 
                                          fontSize: '13px', 
                                          cursor: 'pointer',
                                          transition: 'transform 0.1s'
                                        }}
                                        onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'}
                                        onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                                      >
                                        Unlock Ep ({priceText})
                                      </button>
                                    );
                                  })()
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ----------- STOREFRONT-STYLE SERIES GRID ----------- */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                  {seriesList.map((series) => {
                    const isSeasonUnlocked = isOwnProfile || (
                      series.billing_level !== 'episode' && (
                        purchasedSeasons.includes(series.id) ||
                        (isSubscribed && series.subscriber_free) ||
                        parseFloat(series.price || '0') === 0
                      )
                    );
                    return (
                      <motion.div
                        onClick={() => setSelectedSeriesForViewer(series)}
                        key={series.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="store-card"
                        style={{
                          background: 'var(--bg-surface)',
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        {/* Cover Image in 1:1 Aspect Ratio */}
                        <div 
                          style={{ 
                            width: '100%', 
                            aspectRatio: '1/1', 
                            background: `url(${series.img || 'https://picsum.photos/seed/cybercity/600/300'})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center' 
                          }} 
                        />
                        
                        {/* Content section section */}
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#ff4d85', fontWeight: 'bold', letterSpacing: '1px' }}>
                              Original Series
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 'bold' }}>
                              🎬 {series.episodes?.length || 0} {series.episodes?.length === 1 ? 'Ep' : 'Eps'}
                            </div>
                          </div>
                          
                          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', lineHeight: 1.4, flex: 1, color: 'var(--text-primary)' }}>
                            {series.title}
                          </h4>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                              {series.billing_level === 'episode' ? (
                                'Pay Per Episode'
                              ) : (
                                isSubscribed && series.subscriber_free ? (
                                  <span style={{ color: '#00ff88' }}>FREE for Sub</span>
                                ) : isSubscribed && series.subscriber_price !== null && series.subscriber_price !== undefined && series.subscriber_price !== '' ? (
                                  <span>
                                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: '8px', fontSize: '14px' }}>
                                      ${parseFloat(series.price || '0').toFixed(2)}
                                    </span>
                                    <span style={{ color: '#00ff88' }}>
                                      ${parseFloat(series.subscriber_price).toFixed(2)}
                                    </span>
                                  </span>
                                ) : (
                                  parseFloat(series.price || '0') > 0 ? `$${parseFloat(series.price).toFixed(2)}` : 'FREE'
                                )
                              )}
                            </span>
                            {series.billing_level === 'episode' ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedSeriesForViewer(series); }}
                                style={{ padding: '8px 16px', background: '#fff', border: 'none', borderRadius: '20px', color: '#000', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                View Series
                              </button>
                            ) : isSeasonUnlocked ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedSeriesForViewer(series); }}
                                style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', border: 'none', borderRadius: '20px', color: '#fff', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                Stream 🍿
                              </button>
                            ) : (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedSeriesForViewer(series); }}
                                style={{ padding: '8px 16px', background: '#fff', border: 'none', borderRadius: '20px', color: '#000', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                View Season
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            ) : (
              seriesList.map((series) => (
                <motion.div key={series.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-surface)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                  
                  {/* Series Hero Panel */}
                  <div style={{ width: '100%', height: '300px', background: `url(${series.img || 'https://picsum.photos/seed/cybercity/1200/500'}) center/cover`, position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.3))' }} />
                    <div style={{ position: 'absolute', bottom: '30px', left: '30px', maxWidth: '500px' }}>
                      <div style={{ background: 'rgba(255,77,133,0.2)', color: '#ff4d85', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '12px', border: '1px solid #ff4d85' }}>ORIGINAL SERIES</div>
                      <h2 style={{ fontSize: '36px', margin: '0 0 10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{series.title}</h2>
                      <p style={{ color: '#ccc', margin: '0 0 20px 0', lineHeight: 1.5 }}>{series.description}</p>
                      {(() => {
                        const isSeasonUnlocked = isOwnProfile || (
                          series.billing_level !== 'episode' && (
                            purchasedSeasons.includes(series.id) ||
                            (isSubscribed && series.subscriber_free) ||
                            parseFloat(series.price || '0') === 0
                          )
                        );

                        if (series.billing_level === 'episode') {
                          return (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <span style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                color: '#ccc', 
                                padding: '10px 20px', 
                                borderRadius: '12px', 
                                fontSize: '14px', 
                                fontWeight: 'bold',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'inline-block'
                              }}>
                                🎫 Pay-Per-Episode Series
                              </span>
                              {isOwnProfile && viewMode === 'edit' && (
                                <button onClick={() => {
                                  setEditingSeries(series);
                                  setShowEditSeriesModal(true);
                                }} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                                  Edit Series ⚙️
                                </button>
                              )}
                            </div>
                          );
                        }

                        if (isSeasonUnlocked) {
                          return (
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                              <button onClick={() => {
                                setActiveCinemaSeries(series);
                                setActiveCinemaEpisode(series.episodes?.[0] || null);
                                setShowCinemaModal(true);
                              }} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(138,43,226,0.3)' }}>
                                Stream Season 🍿
                              </button>
                              {isOwnProfile && viewMode === 'edit' && (
                                <button onClick={() => {
                                  setEditingSeries(series);
                                  setShowEditSeriesModal(true);
                                }} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                                  Edit Series ⚙️
                                </button>
                              )}
                            </div>
                          );
                        } else {
                          let displayPrice = parseFloat(series.price || '0');
                          let priceText = `$${displayPrice.toFixed(2)}`;
                          if (isSubscribed) {
                            if (series.subscriber_free) {
                              priceText = 'FREE';
                            } else if (series.subscriber_price !== null && series.subscriber_price !== undefined && series.subscriber_price !== '') {
                              priceText = `$${parseFloat(series.subscriber_price).toFixed(2)} (Subscriber Discount)`;
                            }
                          }
                          return (
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                              <button onClick={() => handleBuySeasonSimulation(series)} style={{ padding: '14px 28px', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(255,255,255,0.2)' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                                Buy Full Season ({priceText})
                              </button>
                              {isOwnProfile && viewMode === 'edit' && (
                                <button onClick={() => {
                                  setEditingSeries(series);
                                  setShowEditSeriesModal(true);
                                }} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                                  Edit Series ⚙️
                                </button>
                              )}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  {/* Episodes List */}
                  <div style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '20px' }}>Episodes</h3>
                      {isOwnProfile && viewMode === 'edit' && (
                        <button onClick={() => setActiveSeriesIdForEp(activeSeriesIdForEp === series.id ? null : series.id)} style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                          {activeSeriesIdForEp === series.id ? 'Cancel' : '+ Add Episode'}
                        </button>
                      )}
                    </div>
                    
                    {/* Add Episode Form */}
                    {activeSeriesIdForEp === series.id && (
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-secondary)' }}>New Episode for {series.title}</h4>
                        <div className="responsive-form-two-col" style={{ gap: '12px' }}>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <input type="text" placeholder="Episode Title" value={newEpisode.title} onChange={e=>setNewEpisode({...newEpisode, title: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} />
                          </div>
                          <input type="text" placeholder="Runtime (e.g. 45 min)" value={newEpisode.length} onChange={e=>setNewEpisode({...newEpisode, length: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} />
                          <select 
                            value={newEpisode.rating} 
                            onChange={e=>setNewEpisode({...newEpisode, rating: e.target.value})} 
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                          >
                            <option value="" style={{ background: '#111', color: '#888' }}>Content Rating (Optional)</option>
                            <option value="G" style={{ background: '#111' }}>G</option>
                            <option value="PG" style={{ background: '#111' }}>PG</option>
                            <option value="PG-13" style={{ background: '#111' }}>PG-13</option>
                            <option value="R" style={{ background: '#111' }}>R</option>
                            <option value="NC-17" style={{ background: '#111' }}>NC-17</option>
                            <option value="TV-Y" style={{ background: '#111' }}>TV-Y (All Children)</option>
                            <option value="TV-Y7" style={{ background: '#111' }}>TV-Y7 (Older Children)</option>
                            <option value="TV-G" style={{ background: '#111' }}>TV-G (General Audience)</option>
                            <option value="TV-PG" style={{ background: '#111' }}>TV-PG (Parental Guidance)</option>
                            <option value="TV-14" style={{ background: '#111' }}>TV-14 (Parents Cautioned)</option>
                            <option value="TV-MA" style={{ background: '#111' }}>TV-MA (Mature Audience Only)</option>
                          </select>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <textarea placeholder="Description..." value={newEpisode.description} onChange={e=>setNewEpisode({...newEpisode, description: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', minHeight: '60px' }} />
                          </div>

                          {/* Genre Tags Selector */}
                          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                            <label style={{ fontSize: '13px', color: '#ccc', fontWeight: 'bold' }}>Genre Tags</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {['Action', 'Adventure', 'Podcast', 'Docuseries', 'Comedy', 'Drama', 'Thriller', 'Talk Show', 'Music', 'Sports'].map((g) => {
                                const activeGenres = newEpisode.genre ? newEpisode.genre.split(',').map(s=>s.trim()) : [];
                                const isSelected = activeGenres.includes(g);
                                return (
                                  <button
                                    type="button"
                                    key={g}
                                    onClick={() => {
                                      let updated;
                                      if (isSelected) {
                                        updated = activeGenres.filter(x => x !== g).join(', ');
                                      } else {
                                        updated = [...activeGenres, g].join(', ');
                                      }
                                      setNewEpisode({ ...newEpisode, genre: updated });
                                    }}
                                    style={{
                                      padding: '6px 14px',
                                      borderRadius: '20px',
                                      border: isSelected ? '1px solid #ff4d85' : '1px solid rgba(255,255,255,0.1)',
                                      background: isSelected ? 'rgba(255,77,133,0.2)' : 'rgba(255,255,255,0.02)',
                                      color: isSelected ? '#ff4d85' : '#ccc',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease'
                                    }}
                                  >
                                    {g}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Box Cover image upload section */}
                          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', color: '#ccc', fontWeight: 'bold' }}>Episode Box Cover</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                              {newEpisode.thumbnail_url ? (
                                <div style={{ width: '96px', height: '54px', borderRadius: '8px', backgroundImage: `url("${newEpisode.thumbnail_url}")`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }} />
                              ) : null}
                              <label 
                                onDragOver={(e) => { e.preventDefault(); setIsDraggingEpisodeImg(true); }}
                                onDragLeave={() => setIsDraggingEpisodeImg(false)}
                                onDrop={async (e) => {
                                  e.preventDefault();
                                  setIsDraggingEpisodeImg(false);
                                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    await handleEpisodeCoverUpload(e.dataTransfer.files[0]);
                                  }
                                }}
                                style={{
                                  flex: 1,
                                  background: isDraggingEpisodeImg ? 'rgba(255,77,133,0.05)' : 'rgba(255,255,255,0.05)',
                                  border: isDraggingEpisodeImg ? '2px dashed #ff4d85' : '1px solid rgba(255,255,255,0.1)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  color: isDraggingEpisodeImg ? '#ff4d85' : '#ccc',
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  fontSize: '13px',
                                  fontWeight: 'bold',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <ImageIcon size={16} />
                                {uploadingEpisodeImg ? 'Uploading Cover...' : isDraggingEpisodeImg ? 'Drop here!' : newEpisode.thumbnail_url ? 'Cover Uploaded ✓' : 'Upload Episode Box Cover (Drag & Drop)'}
                                <input type="file" accept="image/*" onChange={handleEpisodeCoverUpload} style={{ display: 'none' }} disabled={uploadingEpisodeImg} />
                              </label>
                            </div>
                          </div>

                          {/* Video Content & Video Source Link section */}
                          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                            <label style={{ fontSize: '13px', color: '#ccc', fontWeight: 'bold' }}>Episode Video Content <span style={{ color: '#ff4d85' }}>*</span></label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'stretch' }}>
                              
                              {/* Drag & drop video file upload */}
                              <label 
                                onDragOver={(e) => { e.preventDefault(); setIsDraggingVideo(true); }}
                                onDragLeave={() => setIsDraggingVideo(false)}
                                onDrop={async (e) => {
                                  e.preventDefault();
                                  setIsDraggingVideo(false);
                                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    await handleVideoFileUpload(e.dataTransfer.files[0]);
                                  }
                                }}
                                style={{
                                  flex: '1 1 240px',
                                  background: isDraggingVideo ? 'rgba(255,77,133,0.05)' : 'rgba(255,255,255,0.05)',
                                  border: isDraggingVideo ? '2px dashed #ff4d85' : '1px solid rgba(255,255,255,0.1)',
                                  padding: '16px 12px',
                                  borderRadius: '8px',
                                  color: isDraggingVideo ? '#ff4d85' : '#ccc',
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px',
                                  fontSize: '13px',
                                  fontWeight: 'bold',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Video size={20} />
                                <div>
                                  {uploadingVideo ? 'Uploading Video...' : isDraggingVideo ? 'Drop here!' : (newEpisode.video_url && newEpisode.video_url.includes("episodes/video_")) ? 'Video File Uploaded ✓' : 'Upload Video File (Drag & Drop)'}
                                </div>
                                <input type="file" accept="video/*" onChange={async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    await handleVideoFileUpload(e.target.files[0]);
                                  }
                                }} style={{ display: 'none' }} disabled={uploadingVideo} />
                              </label>

                              {/* Input for other video sources */}
                              <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Other Video Sources (External)</span>
                                <input 
                                  type="text" 
                                  placeholder="Paste YouTube, Vimeo, or direct video URL" 
                                  value={(newEpisode.video_url && !newEpisode.video_url.includes("episodes/video_")) ? newEpisode.video_url : ''} 
                                  onChange={e=>setNewEpisode({...newEpisode, video_url: e.target.value})} 
                                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }} 
                                />
                              </div>

                            </div>
                          </div>

                          {/* Subscriber Pricing Rules for Episode */}
                          <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🔒 Subscriber Access Rules (Episode)</span>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <input 
                                type="checkbox" 
                                id="epSubFree" 
                                checked={newEpisode.subscriber_free} 
                                onChange={e => setNewEpisode({ ...newEpisode, subscriber_free: e.target.checked, subscriber_price: e.target.checked ? '' : newEpisode.subscriber_price })}
                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ff4d85' }}
                              />
                              <label htmlFor="epSubFree" style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                                🎁 Allow active subscribers to view this episode for free
                              </label>
                            </div>

                            {!newEpisode.subscriber_free && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ color: '#ccc', fontSize: '13px' }}>Subscriber Discounted Price (Optional)</label>
                                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden', width: '200px' }}>
                                  <span style={{ padding: '12px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)', fontSize: '14px' }}>$</span>
                                  <input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="Discounted Price" 
                                    value={newEpisode.subscriber_price} 
                                    onChange={e => setNewEpisode({ ...newEpisode, subscriber_price: e.target.value })} 
                                    style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }} 
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Price $</span>
                            <input type="number" step="0.01" placeholder="9.99" value={newEpisode.price} onChange={e=>setNewEpisode({...newEpisode, price: e.target.value})} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }} />
                            <button onClick={() => handleAddEpisode(series.id)} disabled={!newEpisode.title || !newEpisode.video_url || uploadingVideo || uploadingEpisodeImg} style={{ padding: '10px 20px', background: (newEpisode.title && newEpisode.video_url && !uploadingVideo && !uploadingEpisodeImg) ? '#00ff88' : 'rgba(255,255,255,0.1)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: (newEpisode.title && newEpisode.video_url && !uploadingVideo && !uploadingEpisodeImg) ? 'pointer' : 'not-allowed' }}>Save</button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(!series.episodes || series.episodes.length === 0) ? (
                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>No episodes added to this series yet.</p>
                      ) : (
                        series.episodes.map((episode: any, idx: number) => (
                          <div key={episode.id} style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                            <div style={{ width: '160px', height: '90px', borderRadius: '8px', background: `url(${episode.thumbnail_url || `https://picsum.photos/seed/ep${idx+1}/300/150`}) center/cover`, position: 'relative', flexShrink: 0 }}>
                              <div style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>{episode.length || 'TBD'}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                                <span>Episode {idx + 1}</span>
                                {episode.rating && (
                                  <span style={{ padding: '1px 6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', fontSize: '10px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {episode.rating}
                                  </span>
                                )}
                              </div>
                              <h4 style={{ margin: '0 0 6px 0', fontSize: '18px' }}>{episode.title}</h4>
                              {episode.genre && (
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                  {episode.genre.split(',').map((tag: string) => (
                                    <span key={tag} style={{ background: 'rgba(255, 77, 133, 0.08)', color: '#ff4d85', border: '1px solid rgba(255, 77, 133, 0.15)', padding: '1px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>
                                      {tag.trim()}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.4 }}>{episode.description}</p>
                            </div>
                            {(() => {
                              const isSeasonUnlocked = isOwnProfile || (
                                series.billing_level !== 'episode' && (
                                  purchasedSeasons.includes(series.id) ||
                                  (isSubscribed && series.subscriber_free) ||
                                  parseFloat(series.price || '0') === 0
                                )
                              );
                              const isEpUnlocked = isOwnProfile || 
                                isSeasonUnlocked || 
                                purchasedEpisodes.includes(episode.id) || 
                                (isSubscribed && episode.subscriber_free) ||
                                parseFloat(episode.price || '0') === 0;

                              if (isEpUnlocked) {
                                return (
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button onClick={() => {
                                      setActiveCinemaSeries(series);
                                      setActiveCinemaEpisode(episode);
                                      setShowCinemaModal(true);
                                    }} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #00ff88, #00bbff)', border: 'none', color: '#000', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                                      Play Episode ▶️
                                    </button>
                                    {isOwnProfile && viewMode === 'edit' && (
                                      <button onClick={() => {
                                        setEditingEpisode(episode);
                                        setShowEditEpisodeModal(true);
                                      }} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
                                        Edit Episode ⚙️
                                      </button>
                                    )}
                                  </div>
                                );
                              } else {
                                let displayPrice = parseFloat(episode.price || '0');
                                let priceText = `$${displayPrice.toFixed(2)}`;
                                if (isSubscribed) {
                                  if (episode.subscriber_free) {
                                    priceText = 'FREE';
                                  } else if (episode.subscriber_price !== null && episode.subscriber_price !== undefined && episode.subscriber_price !== '') {
                                    priceText = `$${parseFloat(episode.subscriber_price).toFixed(2)}`;
                                  }
                                }
                                return (
                                  <button onClick={()=>handleBuyEpisodeSimulation(episode, series)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-primary)', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                                    Buy ({priceText})
                                  </button>
                                );
                              }
                            })()}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {/* Series Refund Policy Disclaimer */}
            {(!isOwnProfile || viewMode === 'public') && (
              <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '15px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>🛡️ Store Refund Policy</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {refundPolicy || 'All season passes and single episode sales are final. No refunds are provided once streaming has commenced.'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
        /* ----------- COURSES TAB ----------- */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {isOwnProfile && viewMode === 'edit' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.15)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>Create New Session</h3>
                <form onSubmit={handleAddCourse} className="responsive-form-two-col">
                  <div style={{ gridColumn: '1 / -1' }}>
                    <input type="text" placeholder="Session Title (e.g. Advanced Beatmaking)" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                    <span style={{ padding: '14px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>$</span>
                    <input type="number" step="0.01" placeholder="Price" value={newCourse.price} onChange={e => setNewCourse({...newCourse, price: e.target.value})} style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="number" placeholder="Modules (e.g. 12)" value={newCourse.modules} onChange={e => setNewCourse({...newCourse, modules: e.target.value})} style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                    <input type="number" step="0.5" placeholder="Hours" value={newCourse.hours} onChange={e => setNewCourse({...newCourse, hours: e.target.value})} style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', gridColumn: '1 / -1', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={saving || !newCourse.title} style={{ padding: '14px 30px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', opacity: (!newCourse.title || saving) ? 0.5 : 1 }}>
                      {saving ? 'Publishing...' : 'Publish Session'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {courses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '20px', marginTop: 0, color: 'var(--text-muted)' }}>No Sessions</h3>
                <p style={{ color: '#555', marginBottom: 0 }}>This creator hasn't published any courses yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {courses.map((course) => {
                  const completed = courseProgressMap[course.id] || [];
                  const progressPercent = course.modules ? Math.round((completed.length / course.modules) * 100) : 0;
                  const isPurchased = isOwnProfile || purchasedCourseIds.includes(course.id) || Number(course.price) === 0;

                  return (
                    <motion.div key={course.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '180px', background: `url(${course.img || 'https://picsum.photos/seed/course' + course.id.slice(0,4) + '/600/300'}) center/cover`, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                          {course.modules} Modules • {course.hours}h
                        </div>
                      </div>
                      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', lineHeight: 1.4, flex: 1 }}>{course.title}</h3>
                        
                        {/* Dynamic Progress Bar */}
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '8px', overflow: 'hidden' }}>
                          <div style={{ width: `${progressPercent}%`, height: '100%', background: '#8A2BE2', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: 'bold' }}>{progressPercent}% Completed</div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '24px', fontWeight: 'bold' }}>${course.price}</span>
                          {viewMode === 'edit' ? (
                            <button onClick={() => { setActiveCoursePlayer(course); }} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                              Preview Player
                            </button>
                          ) : isPurchased ? (
                            <button onClick={() => { setActiveCoursePlayer(course); }} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                              Resume Lesson 🚀
                            </button>
                          ) : (
                            <button onClick={() => handleEnrollSimulation(course)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #00ff88, #00d2ff)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                              Enroll Now
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Courses Refund Policy Disclaimer */}
            {(!isOwnProfile || viewMode === 'public') && (
              <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '15px', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>🛡️ Store Refund Policy</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {refundPolicy || 'All masterclass and course sales are final. No refunds are provided once video content has been accessed.'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vibe_agency' && (
        /* ----------- AGENCY TAB ----------- */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '28px', marginBottom: '16px', color: 'var(--text-primary)' }}>Platform Agency Services</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 30px' }}>
                Partner with our dedicated team of creative professionals. We offer full-service production, branding, and career management for elite creators.
              </p>
              <button style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #0055ff, #00d2ff)', color: 'var(--text-primary)', border: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                Inquire for Management
              </button>
            </div>
          </motion.div>
        )}

        {/* --- FLIP BOOK TAB --- */}
        {/* --- VIBE DRIVE TAB (EDIT MODE ONLY) --- */}
        {activeTab === 'flipbook' && isOwnProfile && viewMode === 'edit' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Folder size={24} color={wlConfig?.accent || '#ff4d85'} /> Vibe Drive</h2>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>A secure digital vault to upload and share your documents, media, and files.</p>
              </div>
              <button 
                onClick={() => setShowDriveUploadModal(true)} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #00ff88, #00b0ff)', color: '#000', border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(0,255,136,0.2)' }}
                onMouseOver={e=>e.currentTarget.style.transform='scale(1.03)'}
                onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
              >
                <Plus size={16} /> Upload New File
              </button>
            </div>

            {/* Storage Progress Bar */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  Storage Space Usage
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {formatBytes(profile?.storage_used_bytes || 0)} used of {formatBytes(profile?.storage_limit_bytes || 10737418240)}
                </span>
              </div>
              
              <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ 
                  width: `${Math.min(100, (((profile?.storage_used_bytes || 0) / (profile?.storage_limit_bytes || 10737418240)) * 100))}%`, 
                  height: '100%', 
                  background: ((profile?.storage_used_bytes || 0) / (profile?.storage_limit_bytes || 10737418240)) > 0.9 ? 'linear-gradient(90deg, #ff4d85, #ff0055)' : 'linear-gradient(90deg, #00ff88, #00b0ff)',
                  borderRadius: '5px',
                  transition: 'width 0.5s ease-out'
                }} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '4px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Need more space? Upgrade your storage plan to upload larger files and video catalogs.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => {
                      if (confirm("Would you like to upgrade to the Vibe Drive Pro Plan (+100 GB for $9.99/mo)?")) {
                        handleStripeCheckout('Vibe Drive Pro Plan (100 GB)', 9.99, { storage_tier: 'pro_100gb' });
                      }
                    }}
                    style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                    onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                  >
                    +100 GB ($9.99/mo)
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm("Would you like to upgrade to the Vibe Drive Studio Plan (+500 GB for $29.99/mo)?")) {
                        handleStripeCheckout('Vibe Drive Studio Plan (500 GB)', 29.99, { storage_tier: 'studio_500gb' });
                      }
                    }}
                    style={{ padding: '8px 16px', background: 'linear-gradient(135deg, rgba(138,43,226,0.2), rgba(0,176,255,0.2))', border: '1px solid rgba(0,176,255,0.3)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseOver={e=>e.currentTarget.style.opacity='0.9'}
                    onMouseOut={e=>e.currentTarget.style.opacity='1'}
                  >
                    +500 GB ($29.99/mo)
                  </button>
                </div>
              </div>
            </div>

            {/* Toolbar: Search & Views */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search files by name..." 
                  value={driveSearchQuery} 
                  onChange={e => setDriveSearchQuery(e.target.value)} 
                  style={{ width: '100%', padding: '12px 16px 12px 44px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <button 
                  onClick={() => setDriveViewMode('grid')}
                  style={{ padding: '6px 12px', background: driveViewMode === 'grid' ? 'rgba(255,255,255,0.08)' : 'transparent', border: 'none', color: driveViewMode === 'grid' ? '#fff' : 'var(--text-muted)', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Grid
                </button>
                <button 
                  onClick={() => setDriveViewMode('list')}
                  style={{ padding: '6px 12px', background: driveViewMode === 'list' ? 'rgba(255,255,255,0.08)' : 'transparent', border: 'none', color: driveViewMode === 'list' ? '#fff' : 'var(--text-muted)', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  List
                </button>
              </div>
            </div>

            {/* Files List / Grid Explorer */}
            {(() => {
              const filtered = driveFiles.filter(f => f.name.toLowerCase().includes(driveSearchQuery.toLowerCase()));
              if (filtered.length === 0) {
                return (
                  <div style={{ padding: '80px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                    <Folder size={40} style={{ opacity: 0.2, marginBottom: '16px' }} />
                    <p style={{ margin: 0, fontSize: '15px' }}>{driveSearchQuery ? "No files match your search" : "Your Vibe Drive is empty"}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>{driveSearchQuery ? "Try a different search query" : "Click 'Upload New File' to get started"}</p>
                  </div>
                );
              }

              return driveViewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                  {filtered.map(file => {
                    const iconColor = file.file_type === 'image' ? '#ffb300' : file.file_type === 'video' ? '#00b0ff' : file.file_type === 'pdf' ? '#ff5252' : '#90a4ae';
                    return (
                      <div key={file.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', transition: 'border-color 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', padding: '4px 8px', borderRadius: '20px', fontWeight: 'bold', background: file.access_level === 'public' ? 'rgba(0,255,136,0.1)' : 'rgba(179,128,255,0.1)', color: file.access_level === 'public' ? '#00ff88' : '#b380ff', border: file.access_level === 'public' ? '1px solid rgba(0,255,136,0.2)' : '1px solid rgba(179,128,255,0.2)' }}>
                            {file.access_level}
                          </span>
                        </div>

                        {file.file_type === 'image' && driveUrls[file.file_path] ? (
                          <div style={{ width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }} onClick={() => handleViewDriveFile(file)}>
                            <img src={driveUrls[file.file_path]} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ) : (
                          <div onClick={() => handleViewDriveFile(file)} style={{ width: '100%', height: '140px', borderRadius: '12px', background: `${iconColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.05)' }}>
                            {file.file_type === 'video' && <Video size={36} style={{ color: iconColor }} />}
                            {file.file_type === 'pdf' && <FileText size={36} style={{ color: iconColor }} />}
                            {file.file_type !== 'image' && file.file_type !== 'video' && file.file_type !== 'pdf' && <File size={36} style={{ color: iconColor }} />}
                            {file.file_type === 'image' && <ImageIcon size={36} style={{ color: iconColor }} />}
                          </div>
                        )}
                        
                        <div style={{ minWidth: 0 }}>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }} title={file.name}>
                            {file.name}
                          </h4>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                            {formatBytes(file.size_bytes)}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', marginTop: '4px' }}>
                          <button 
                            onClick={() => handleViewDriveFile(file)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 12px', background: 'linear-gradient(135deg, #00ff88, #00b0ff)', border: 'none', borderRadius: '8px', color: '#000', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'opacity 0.2s' }}
                            onMouseOver={e=>e.currentTarget.style.opacity='0.9'}
                            onMouseOut={e=>e.currentTarget.style.opacity='1'}
                          >
                            <Play size={13} fill="#000" /> View
                          </button>

                          <button 
                            onClick={() => handleDownloadDriveFile(file)}
                            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                            onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                            title="Download File"
                          >
                            <Download size={13} />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteDriveFile(file)}
                            style={{ padding: '8px', background: 'rgba(255,0,0,0.1)', border: 'none', borderRadius: '8px', color: '#ff4d4d', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseOver={e=>e.currentTarget.style.background='rgba(255,0,0,0.2)'}
                            onMouseOut={e=>e.currentTarget.style.background='rgba(255,0,0,0.1)'}
                            title="Delete File"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                        <th style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Name</th>
                        <th style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Size</th>
                        <th style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Type</th>
                        <th style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Access</th>
                        <th style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Date Added</th>
                        <th style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(file => {
                        const iconColor = file.file_type === 'image' ? '#ffb300' : file.file_type === 'video' ? '#00b0ff' : file.file_type === 'pdf' ? '#ff5252' : '#90a4ae';
                        return (
                          <tr key={file.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.01)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                            <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
                              <span style={{ padding: '6px', borderRadius: '6px', background: `${iconColor}15`, display: 'inline-flex' }}>
                                {file.file_type === 'image' && <ImageIcon size={16} style={{ color: iconColor }} />}
                                {file.file_type === 'video' && <Video size={16} style={{ color: iconColor }} />}
                                {file.file_type === 'pdf' && <FileText size={16} style={{ color: iconColor }} />}
                                {file.file_type !== 'image' && file.file_type !== 'video' && file.file_type !== 'pdf' && <File size={16} style={{ color: iconColor }} />}
                              </span>
                              <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={file.name}>
                                {file.name}
                              </span>
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-secondary)' }}>{formatBytes(file.size_bytes)}</td>
                            <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{file.file_type}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <span style={{ fontSize: '10px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '10px', fontWeight: 'bold', background: file.access_level === 'public' ? 'rgba(0,255,136,0.1)' : 'rgba(179,128,255,0.1)', color: file.access_level === 'public' ? '#00ff88' : '#b380ff', border: file.access_level === 'public' ? '1px solid rgba(0,255,136,0.2)' : '1px solid rgba(179,128,255,0.2)' }}>
                                {file.access_level}
                              </span>
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(file.created_at).toLocaleDateString()}</td>
                            <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button onClick={() => handleViewDriveFile(file)} style={{ padding: '6px 12px', background: 'linear-gradient(135deg, #00ff88, #00b0ff)', border: 'none', borderRadius: '6px', color: '#000', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                                  View
                                </button>
                                <button onClick={() => handleDownloadDriveFile(file)} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                                  Get
                                </button>
                                <button onClick={() => handleDeleteDriveFile(file)} style={{ padding: '6px', background: 'rgba(255,0,0,0.1)', border: 'none', borderRadius: '6px', color: '#ff4d4d', cursor: 'pointer' }} title="Delete">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            {/* Custom Upload Modal */}
            <AnimatePresence>
              {showDriveUploadModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDriveUploadModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} />
                  
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '450px', background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><UploadCloud size={20} color="#00ff88" /> Upload to Vibe Drive</h3>
                      <button onClick={() => setShowDriveUploadModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                    </div>
                    
                    <form onSubmit={handleUploadDriveFile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', textAlign: 'center', position: 'relative', background: 'rgba(255,255,255,0.01)' }}>
                        <input 
                          type="file" 
                          required
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setDriveUploadFile(file);
                            if (file) {
                              setDriveUploadName(file.name.split('.').slice(0, -1).join('.'));
                            }
                          }}
                          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                        />
                        <UploadCloud size={32} style={{ opacity: 0.5, margin: '0 auto 10px', color: '#00ff88' }} />
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                          {driveUploadFile ? driveUploadFile.name : "Click or Drag File to Upload"}
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                          {driveUploadFile ? formatBytes(driveUploadFile.size) : "Supports PDFs, Audio, Video, Archives up to limit"}
                        </p>
                      </div>
                      
                      {driveUploadFile && (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>File Display Name</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Enter customized file name..." 
                              value={driveUploadName}
                              onChange={e => setDriveUploadName(e.target.value)}
                              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                            />
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Access Permission</label>
                            <select 
                              value={driveUploadAccessLevel}
                              onChange={e => setDriveUploadAccessLevel(e.target.value as any)}
                              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                            >
                              <option value="public">🔓 Public (Anyone can download)</option>
                              <option value="subscribers">⭐️ Subscriber-Only (Free for active subs)</option>
                            </select>
                          </div>
                        </>
                      )}

                      {/* Upgrade Banner in Modal if Limit is Exceeded */}
                      {driveUploadFile && (profile.storage_used_bytes + driveUploadFile.size) > (profile.storage_limit_bytes || 10737418240) && (
                        <div style={{ background: 'rgba(255,0,85,0.1)', border: '1px solid rgba(255,0,85,0.2)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <p style={{ margin: 0, fontSize: '12px', color: '#ff4d85', fontWeight: 'bold' }}>
                            ⚠️ Insufficient space: Uploading this file ({formatBytes(driveUploadFile.size)}) will exceed your {formatBytes(profile.storage_limit_bytes || 10737418240)} limit.
                          </p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              type="button"
                              onClick={() => {
                                handleStripeCheckout('Vibe Drive Pro Plan (100 GB)', 9.99, { storage_tier: 'pro_100gb' });
                              }}
                              style={{ flex: 1, padding: '8px', background: '#ff4d85', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Upgrade to Pro (100 GB)
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <button 
                        type="submit" 
                        disabled={uploadingDriveFile || !driveUploadFile || (profile.storage_used_bytes + driveUploadFile.size) > (profile.storage_limit_bytes || 10737418240)}
                        style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #00ff88, #00b0ff)', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'opacity 0.2s', opacity: (uploadingDriveFile || !driveUploadFile || (profile.storage_used_bytes + driveUploadFile.size) > (profile.storage_limit_bytes || 10737418240)) ? 0.5 : 1 }}
                      >
                        {uploadingDriveFile ? "Uploading..." : "Start Upload"}
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Custom File Preview Modal */}
            <AnimatePresence>
              {previewFile && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setPreviewFile(null); setPreviewUrl(''); }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }} />
                  
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: '800px', background: 'rgba(15,15,15,0.98)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.7)', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={previewFile.name}>
                        {previewFile.file_type === 'image' && <ImageIcon size={20} color="#ffb300" />}
                        {previewFile.file_type === 'video' && <Video size={20} color="#00b0ff" />}
                        {previewFile.file_type === 'pdf' && <FileText size={20} color="#ff5252" />}
                        {previewFile.file_type !== 'image' && previewFile.file_type !== 'video' && previewFile.file_type !== 'pdf' && <File size={20} color="#90a4ae" />}
                        {previewFile.name}
                      </h3>
                      <button onClick={() => { setPreviewFile(null); setPreviewUrl(''); }} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}><X size={16} /></button>
                    </div>

                    <div style={{ width: '100%', background: '#000', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', maxHeight: '60vh', position: 'relative' }}>
                      {previewUrl ? (
                        <>
                          {previewFile.file_type === 'image' && (
                            <img src={previewUrl} alt={previewFile.name} style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} />
                          )}
                          
                          {previewFile.file_type === 'video' && (
                            <video src={previewUrl} controls autoPlay style={{ width: '100%', maxHeight: '60vh', background: '#000' }} />
                          )}

                          {previewFile.file_type === 'pdf' && (
                            <iframe src={`${previewUrl}#toolbar=0`} title={previewFile.name} style={{ width: '100%', height: '50vh', border: 'none' }} />
                          )}

                          {previewFile.file_type !== 'image' && previewFile.file_type !== 'video' && previewFile.file_type !== 'pdf' && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px', textAlign: 'center' }}>
                              <File size={64} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                              <div>
                                <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>No direct viewer available for this file type</p>
                                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>Click 'Download File' below to download and view on your device.</p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="animate-pulse">Loading preview...</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '4px' }}>
                      <span style={{ marginRight: 'auto', alignSelf: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                        Size: {formatBytes(previewFile.size_bytes)} | Uploaded: {new Date(previewFile.created_at).toLocaleDateString()}
                      </span>
                      
                      <button 
                        onClick={() => { setPreviewFile(null); setPreviewUrl(''); }}
                        style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                        onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                      >
                        Close
                      </button>

                      <button 
                        onClick={() => handleDownloadDriveFile(previewFile)}
                        style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #00ff88, #00b0ff)', color: '#000', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s' }}
                        onMouseOver={e=>e.currentTarget.style.opacity='0.9'}
                        onMouseOut={e=>e.currentTarget.style.opacity='1'}
                      >
                        <Download size={15} /> Download File
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}


        {/* --- APPEARANCE TAB --- */}
        {activeTab === 'appearance' && isOwnProfile && viewMode === 'edit' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', margin: 0 }}>Channel Appearance</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Background Images Upload */}
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#D35400', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ImageIcon size={18} /> Manage Channel Backgrounds
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>Upload images to cycle through in the background of your channel.</p>
                
                {homepageImageUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '21/9', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.div
                          key={`preview-bg-${currentBgIndex}`}
                          initial={{ x: '100%' }}
                          animate={{ x: 0 }}
                          exit={{ x: '-100%' }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url("${homepageImageUrl.split(',')[currentBgIndex]}")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      </AnimatePresence>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', zIndex: 1 }} />
                      <button onClick={() => { setImageTarget('homepage'); setShowImageModal(true); }} style={{ position: 'absolute', bottom: 16, right: 16, padding: '10px 20px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: 'white', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', transition: 'background 0.2s', zIndex: 2 }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
                        + Add Background
                      </button>
                      <button onClick={() => {
                        const arr = homepageImageUrl.split(',').filter(Boolean);
                        arr.splice(currentBgIndex, 1);
                        const newUrls = arr.join(',');
                        setHomepageImageUrl(newUrls);
                        setCurrentBgIndex(0);
                        supabase!.from('profiles').update({ homepage_image_url: newUrls }).eq('id', user?.id);
                        
                        const shouldSync = (isNetworkLevel || user?.id === wlConfig?.owner_id) && wlConfig?.id;
                        if (shouldSync) {
                           const newHero = newUrls ? newUrls.split(',')[0] : null;
                           const currentTheme = wlConfig.theme || {};
                           supabase!.from('whitelabel_configs').update({ theme: { ...currentTheme, heroImage: newHero } }).eq('id', wlConfig.id).then();
                        }
                      }} style={{ position: 'absolute', top: 16, right: 16, padding: '8px 16px', background: 'rgba(255,0,0,0.5)', backdropFilter: 'blur(8px)', color: 'white', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', zIndex: 2 }}>
                        Remove Image
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
                      {homepageImageUrl.split(',').filter(Boolean).map((imgUrl, idx) => (
                        <div key={idx} onClick={() => setCurrentBgIndex(idx)} style={{ width: '100px', height: '56px', borderRadius: '8px', backgroundImage: `url("${imgUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer', border: currentBgIndex === idx ? '2px solid #D35400' : '2px solid transparent', flexShrink: 0, opacity: currentBgIndex === idx ? 1 : 0.5, transition: '0.2s' }} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <button onClick={() => { setImageTarget('homepage'); setShowImageModal(true); }} style={{ width: '100%', padding: '40px', background: 'rgba(255,255,255,0.03)', border: '2px dashed rgba(255,255,255,0.15)', color: 'var(--text-primary)', fontSize: '15px', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s', fontWeight: 'bold' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                    + Select or Generate Background Image
                  </button>
                )}
              </div>

              {/* ── Subscription Price ── */}
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#D35400', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  💳 Monthly Subscription Price
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>Set the monthly price fans pay to subscribe to your channel. Leave at $0 for a free channel.</p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '16px', fontWeight: 'bold' }}>$</span>
                    <input
                      id="sub-price-input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={subPrice}
                      onChange={e => setSubPrice(e.target.value)}
                      placeholder="9.99"
                      style={{ width: '100%', paddingLeft: '32px', padding: '14px 14px 14px 32px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button
                    onClick={async () => {
                      const price = parseFloat(subPrice) || 0;
                      const { error } = await supabase!.from('profiles').update({ sub_price: price }).eq('id', user?.id);
                      if (!error) showToast('Subscription price saved!', 'success');
                      else showToast('Failed to save price.', 'error');
                    }}
                    style={{ padding: '14px 24px', background: 'linear-gradient(135deg, #D35400, #ff6b35)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap', transition: 'opacity 0.2s' }}
                    onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
                    onMouseOut={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Save Price
                  </button>
                </div>
                <p style={{ margin: '10px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>
                  Current price: <strong style={{ color: Number(subPrice) > 0 ? '#00ff88' : 'var(--text-muted)' }}>{Number(subPrice) > 0 ? `$${Number(subPrice).toFixed(2)}/mo` : 'Free'}</strong>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- MY BOOKINGS TAB --- */}
        {activeTab === 'my_bookings' && user && viewMode === 'edit' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: '24px', margin: '0 0 20px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={24} color="#ff4d85" /> Upcoming Calls (Purchased)
              </h2>
              {purchasedBookings.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>You have not booked any calls yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {purchasedBookings.map((b, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ff4d85', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                           {b.creator?.full_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{b.creator?.full_name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>@{b.creator?.username}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        <div style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} color="#aaa" /> {b.date}</div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} color="#aaa" /> {b.time}</div>
                        <div style={{ color: '#ff4d85', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}><Video size={14} /> {b.meeting_type?.replace('_', ' ')}</div>
                      </div>
                      {b.meeting_type?.includes('virtual') && (
                        <button 
                          onClick={() => {
                            window.open(`/call/${b.id}?type=${b.meeting_type?.includes('audio') ? 'audio' : 'video'}`, '_blank');
                          }} 
                          style={{ width: '100%', padding: '12px', background: '#00ff88', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', marginBottom: b.record_call ? '12px' : '0' }}
                          onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                        >
                          Join {b.meeting_type?.includes('audio') ? 'Audio' : 'Video'} Call
                        </button>
                      )}
                      
                      {b.record_call && (
                        <div style={{ marginTop: '10px' }}>
                          {b.recording_url ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '12px', color: '#00ff88', fontWeight: 'bold', display: 'block' }}>✅ Recording Available:</span>
                              <video src={b.recording_url} controls style={{ width: '100%', borderRadius: '8px', background: '#000', height: b.meeting_type?.includes('audio') ? '50px' : 'auto' }} />
                              <a href={b.recording_url} download target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                                📥 Download Recording
                              </a>
                            </div>
                          ) : (
                            <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                              ⏳ Call recording will be delivered here after the session.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {viewMode === 'edit' && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 style={{ fontSize: '24px', margin: '0 0 20px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={24} color="#00ff88" /> Incoming Bookings (Your Schedule)
                </h2>
                {receivedBookings.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No one has booked a call with you yet.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {receivedBookings.map((b, i) => (
                      <div key={i} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                             {b.buyer?.full_name?.charAt(0) || b.guest_name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{b.buyer?.full_name || b.guest_name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Paid: ${b.price}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                          <div style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} color="#aaa" /> {b.date}</div>
                          <div style={{ color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} color="#aaa" /> {b.time}</div>
                          <div style={{ color: '#00ff88', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}><Video size={14} /> {b.meeting_type?.replace('_', ' ')}</div>
                        </div>
                      {b.meeting_type?.includes('virtual') && (
                        <button 
                          onClick={() => {
                            window.open(`/call/${b.id}?type=${b.meeting_type?.includes('audio') ? 'audio' : 'video'}`, '_blank');
                          }} 
                          style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #00ff88', color: '#00ff88', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', marginBottom: b.record_call ? '12px' : '0' }}
                          onMouseOver={e=>{e.currentTarget.style.background='#00ff88'; e.currentTarget.style.color='#000'}} 
                          onMouseOut={e=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#00ff88'}}
                        >
                          Host {b.meeting_type?.includes('audio') ? 'Audio' : 'Video'} Call
                        </button>
                      )}
                      
                      {b.record_call && (
                        <div style={{ marginTop: '10px' }}>
                          {b.recording_url ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '12px', color: '#00ff88', fontWeight: 'bold', display: 'block' }}>✅ Call Recording:</span>
                              <video src={b.recording_url} controls style={{ width: '100%', borderRadius: '8px', background: '#000', height: b.meeting_type?.includes('audio') ? '50px' : 'auto' }} />
                            </div>
                          ) : (
                            <div style={{ padding: '8px 12px', background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '8px', fontSize: '12px', color: '#ff4d4d', fontWeight: 'bold', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                              <span>🔴 Recording requested by customer</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
        {/* --- NETWORK PROFILES TAB --- */}
        {activeTab === 'members' && isNetworkLevel && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
              <h2 style={{ fontSize: '28px', color: 'var(--text-primary)', margin: '0 0 8px 0', fontWeight: 'bold' }}>{wlConfig?.name} Profiles</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Explore the creators and members within this exclusive network.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' }}>
                 {networkProfiles.length > 0 ? networkProfiles.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => navigate(`/profile/${p.id}`)}
                      style={{ 
                        aspectRatio: '3/4',
                        borderRadius: '16px', 
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                        transition: 'transform 0.3s' 
                      }} 
                      onMouseOver={e=>e.currentTarget.style.transform='translateY(-5px)'} 
                      onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}
                    >
                       <img 
                         src={p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.username || 'User')}&background=random`} 
                         alt={p.username} 
                         style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                       />
                       <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 60%)' }} />
                       
                       <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '16px', textAlign: 'left', zIndex: 2 }}>
                         <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{p.username || 'Anonymous'}</div>
                         <div style={{ color: (p.whitelabel_id === null || p.whitelabel_id === 'master') ? '#ff4d85' : (wlConfig?.accent || '#00ff88'), fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                           {(p.whitelabel_id === null || p.whitelabel_id === 'master') ? 'Vibe Creator' : p.role}
                         </div>
                       </div>
                    </div>
                 )) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No profiles found for this network yet.</div>
                 )}
              </div>
           </motion.div>
        )}

        {/* --- COMMUNITY TAB --- */}
        {activeTab === 'community' && isNetworkLevel && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px' }}>
              <Community user={user} />
           </motion.div>
        )}

        {/* --- MY NETWORKS TAB --- */}
        {activeTab === 'networks' && myNetworks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Monitor size={24} color="#00ff88" /> My Enterprise Networks
                </h2>
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {myNetworks.map((network, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleOpenNetwork(network)}
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '20px', 
                      padding: '24px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '16px', 
                      position: 'relative', 
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                     <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: network.theme?.accent || network.accent || '#00ff88' }} />
                     
                     <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{network.name || 'Vibe Network'}</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>{network.domain || 'localhost'}</p>
                     </div>
                     
                     <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <button style={{ flex: 1, padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                           <ArrowUpRight size={16} /> Open Network
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {/* --- WALLET SUBSCRIPTION & EARNINGS TAB --- */}
        {activeTab === 'wallet' && isOwnProfile && viewMode === 'edit' && (wlConfig?.theme?.creator_splits?.[profile?.id] ?? profile?.platform_fee_percentage ?? wlConfig?.platform_fee_percentage ?? 0) > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Balance Row */}
            <div className="wallet-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              
              <div style={{ background: 'rgba(0, 255, 136, 0.05)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(0, 255, 136, 0.2)', gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#00ff88', display: 'flex', alignItems: 'center', gap: '8px' }}><Wallet size={20}/> Available Network Balance</h3>
                  <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--text-primary)' }}>
                    ${walletBalance.toFixed(2)}
                  </div>
                  <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>Available to withdraw, or use for platform subscriptions.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                  <button style={{ padding: '14px 24px', borderRadius: '12px', background: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', transition: 'all 0.2s' }} onClick={() => { toast.success('Funds securely routed to your connected bank account.'); setWalletBalance(0); }}>
                    <ArrowUpRight size={18}/> Withdraw Funds
                  </button>
                  <button style={{ padding: '14px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }} onClick={() => setWalletBalance(prev => prev + 100)}>
                    <ArrowDownLeft size={18}/> Deposit $100
                  </button>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, rgba(99,91,255,0.1), rgba(0,0,0,0.4))', borderRadius: '24px', padding: '30px', border: '1px solid rgba(99,91,255,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#635BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8h-4a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4h-4"/><path d="M12 6v12"/></svg>
                  Stripe Payouts
                </h4>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5, marginBottom: '20px' }}>
                  {profile?.stripe_account_id 
                    ? "Your channel is securely connected to Stripe. Payouts are routed directly to your bank." 
                    : "Connect your bank via Stripe Express to receive direct deposits from subscribers, tips, and bookings."}
                </div>
                
                {profile?.stripe_account_id ? (
                  <button style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                    <CheckCircle size={16} color="#00ff88" /> Connected
                  </button>
                ) : (
                  <button onClick={async (e) => {
                    const btn = e.currentTarget;
                    const ogText = btn.innerHTML;
                    btn.innerHTML = 'Connecting...';
                    btn.style.opacity = '0.7';
                    
                    try {
                      const { data, error } = await supabase!.functions.invoke('stripe-onboard', {
                        body: { return_url: window.location.href }
                      });
                      if (error) throw error;
                      if (data?.url) {
                        window.location.href = data.url;
                      }
                    } catch (err) {
                      console.error(err);
                      toast.error('Failed to connect to Stripe. Please ensure your backend is running.');
                      btn.innerHTML = ogText;
                      btn.style.opacity = '1';
                    }
                  }} style={{ padding: '14px 24px', background: '#635BFF', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                    <ArrowUpRight size={18} /> Setup Stripe Payouts
                  </button>
                )}
              </div>

            </div>

            {/* Income Streams */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color="#ff4d85"/> Recent Collections</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    ...(typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vibe_network_ledger') || '[]') : []).map((tx: any, idx: number) => ({
                      id: `local-tx-${idx}`,
                      title: `Live Stream Tipping Payload`,
                      amount: `+$${Number(tx.gross).toFixed(2)}`,
                      type: 'Dynamic Tip',
                      color: '#FFD700'
                    }))
                  ].map(tx => (
                    <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{tx.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{tx.type}</div>
                      </div>
                      <div style={{ color: tx.color, fontWeight: 'bold', fontSize: '16px' }}>{tx.amount}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight size={20} color="#ff4d85"/> Payable Subscriptions</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[].length > 0 ? [].map((sub: any) => (
                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{sub.creator}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: paySubsWithWallet ? '#00ff88' : '#888' }}>{sub.status}</span> • {sub.due}
                        </div>
                      </div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '16px' }}>{sub.amount}</div>
                    </div>
                  )) : (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '16px 0' }}>No active payable subscriptions.</div>
                  )}
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* --- SECURITY (PASSWORD UPDATE) TAB --- */}
        {activeTab === 'security' && isOwnProfile && viewMode === 'edit' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', margin: 0 }}>Security Settings</h2>
            <SecuritySettingsForm accentColor={wlConfig?.theme?.accent || wlConfig?.accent || '#ff4d85'} />
          </motion.div>
        )}

        {activeTab === 'ai_report' && isOwnProfile && viewMode === 'edit' && (
          <ErrorBoundary fallback={<div style={{ padding: '40px', color: '#ff4d4d', textAlign: 'center' }}>⚠️ Vibes Creator Report failed to load.</div>}>
            <React.Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Analyzing feed & fan metrics...</div>}>
              <AiReportTab wlConfig={wlConfig} profile={profile} accentColor={wlConfig?.theme?.accent || wlConfig?.accent || '#ff4d85'} />
            </React.Suspense>
          </ErrorBoundary>
        )}

        {/* --- VIBE CRM TAB --- */}
        {activeTab === 'crm' && isOwnProfile && viewMode === 'edit' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header / Navigation */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={28} color={wlConfig?.accent || '#ff4d85'} /> Vibe CRM Dashboard
                </h2>
                <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '14px' }}>Manage your lead relationships, sales pipelines, and API integrations.</p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {(['contacts', 'pipelines', 'integrations'] as const).map((sub) => {
                  const isActive = crmSubTab === sub;
                  const accentColor = wlConfig?.accent || '#ff4d85';
                  return (
                    <button
                      key={sub}
                      onClick={() => setCrmSubTab(sub)}
                      style={{
                        padding: '8px 16px',
                        background: isActive ? accentColor : 'transparent',
                        color: isActive ? '#000' : '#888',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {crmLoading ? (
              <div style={{ padding: '80px', textAlign: 'center', color: '#888' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: wlConfig?.accent || '#ff4d85', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
                Synchronizing CRM settings & data...
              </div>
            ) : (
              <>
                {/* 1. CONTACTS DIRECTORY */}
                {crmSubTab === 'contacts' && (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: '24px', alignItems: 'start' }}>
                    
                    {/* Contacts Table List */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Contact Leads Directory ({crmContacts.length})</h3>
                      
                      {crmContacts.length === 0 ? (
                        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
                          No leads or contacts registered. Use the form on the right or sync via API.
                        </div>
                      ) : (
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <th style={{ padding: '12px', color: '#888', fontWeight: 600 }}>Name</th>
                                <th style={{ padding: '12px', color: '#888', fontWeight: 600 }}>Email</th>
                                <th style={{ padding: '12px', color: '#888', fontWeight: 600 }}>Source</th>
                                <th style={{ padding: '12px', color: '#888', fontWeight: 600 }}>Tags</th>
                              </tr>
                            </thead>
                            <tbody>
                              {crmContacts.map((c) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }} className="table-row-hover">
                                  <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#fff' }}>
                                    {c.first_name || c.last_name ? `${c.first_name || ''} ${c.last_name || ''}` : 'Unnamed Contact'}
                                  </td>
                                  <td style={{ padding: '14px 12px', color: '#ccc' }}>{c.email}</td>
                                  <td style={{ padding: '14px 12px' }}>
                                    <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.05)', color: '#aaa', padding: '3px 8px', borderRadius: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                      {c.source}
                                    </span>
                                  </td>
                                  <td style={{ padding: '14px 12px' }}>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                      {(c.tags || []).map((t: string) => (
                                        <span key={t} style={{ fontSize: '10px', background: 'rgba(0,255,204,0.12)', color: '#00ffcc', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                                          {t}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Add Contact Sidebar Panel */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '24px' }}>
                      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }}>Add Lead Manually</h3>
                      <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <input
                            type="text"
                            placeholder="First Name"
                            value={newContact.first_name}
                            onChange={e => setNewContact({ ...newContact, first_name: e.target.value })}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '10px', color: '#fff', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={newContact.last_name}
                            onChange={e => setNewContact({ ...newContact, last_name: e.target.value })}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '10px', color: '#fff', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            required
                            placeholder="Email Address *"
                            value={newContact.email}
                            onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '10px', color: '#fff', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Phone Number"
                            value={newContact.phone}
                            onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '10px', color: '#fff', outline: 'none' }}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Tags (comma-separated, e.g. lead, vip)"
                            value={newContact.tagString}
                            onChange={e => setNewContact({ ...newContact, tagString: e.target.value })}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '10px', color: '#fff', outline: 'none', fontSize: '13px' }}
                          />
                        </div>
                        <button
                          type="submit"
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: wlConfig?.accent || '#ff4d85',
                            color: '#000',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '8px'
                          }}
                        >
                          Save Contact Lead
                        </button>
                      </form>
                    </div>

                  </div>
                )}

                {/* 2. PIPELINES (KANBAN OPPORTUNITIES) BOARD */}
                {crmSubTab === 'pipelines' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Pipeline Selector / Add Opportunity Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: 'rgba(255,255,255,0.01)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#888', fontSize: '14px', fontWeight: 'bold' }}>Active Board:</span>
                        <select
                          value={selectedPipelineId}
                          onChange={e => setSelectedPipelineId(e.target.value)}
                          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px', color: '#fff', outline: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          {crmPipelines.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Simple Inline Quick Add Opportunity Form */}
                      <form onSubmit={handleAddOpportunity} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input
                          type="text"
                          required
                          placeholder="Deal Title (e.g. Agency Signup)"
                          value={newOpportunity.title}
                          onChange={e => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '13px' }}
                        />
                        <select
                          required
                          value={newOpportunity.contact_id}
                          onChange={e => setNewOpportunity({ ...newOpportunity, contact_id: e.target.value })}
                          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '13px', cursor: 'pointer' }}
                        >
                          <option value="">-- Select Contact --</option>
                          {crmContacts.map(c => (
                            <option key={c.id} value={c.id}>{c.first_name || c.last_name ? `${c.first_name || ''} ${c.last_name || ''}` : c.email}</option>
                          ))}
                        </select>
                        <select
                          required
                          value={newOpportunity.stage_id}
                          onChange={e => setNewOpportunity({ ...newOpportunity, stage_id: e.target.value })}
                          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '13px', cursor: 'pointer' }}
                        >
                          <option value="">-- Select Stage --</option>
                          {crmStages.filter(s => s.pipeline_id === selectedPipelineId).map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Value $"
                          value={newOpportunity.value}
                          onChange={e => setNewOpportunity({ ...newOpportunity, value: e.target.value })}
                          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '13px', width: '100px' }}
                        />
                        <button type="submit" style={{ padding: '8px 16px', background: wlConfig?.accent || '#ff4d85', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                          + Add Deal
                        </button>
                      </form>
                    </div>

                    {/* Kanban Board columns container */}
                    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', alignItems: 'stretch' }}>
                      {crmStages.filter(stage => stage.pipeline_id === selectedPipelineId).map((stage) => {
                        const stageOpps = crmOpportunities.filter(o => o.stage_id === stage.id);
                        const columnTotal = stageOpps.reduce((sum, o) => sum + parseFloat(o.value || 0), 0);
                        
                        return (
                          <div key={stage.id} style={{ flex: '0 0 280px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', minHeight: '400px' }}>
                            
                            {/* Column Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
                              <div>
                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{stage.name}</h4>
                                <span style={{ fontSize: '11px', color: '#888' }}>{stageOpps.length} {stageOpps.length === 1 ? 'deal' : 'deals'}</span>
                              </div>
                              <span style={{ fontSize: '12px', color: '#00ffcc', fontWeight: 'bold' }}>
                                ${columnTotal.toFixed(2)}
                              </span>
                            </div>

                            {/* Column Opportunities Stack */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                              {stageOpps.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: '12px', border: '1px dashed rgba(255,255,255,0.02)', borderRadius: '10px', padding: '20px' }}>
                                  Empty Stage
                                </div>
                              ) : (
                                stageOpps.map((opp) => {
                                  const contact = crmContacts.find(c => c.id === opp.contact_id);
                                  const cName = contact ? (contact.first_name || contact.last_name ? `${contact.first_name || ''} ${contact.last_name || ''}` : contact.email) : 'Unknown Contact';
                                  
                                  // Get adjacent stages for navigation
                                  const pipelineStages = crmStages.filter(s => s.pipeline_id === selectedPipelineId);
                                  const currentIdx = pipelineStages.findIndex(s => s.id === stage.id);
                                  const prevStage = currentIdx > 0 ? pipelineStages[currentIdx - 1] : null;
                                  const nextStage = currentIdx < pipelineStages.length - 1 ? pipelineStages[currentIdx + 1] : null;

                                  return (
                                    <div key={opp.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', transition: 'all 0.2s' }}>
                                      <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>{opp.title}</h5>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#aaa' }}>
                                        <span>👤 {cName}</span>
                                        <span style={{ color: '#00ffcc', fontWeight: 'bold' }}>${parseFloat(opp.value || 0).toFixed(2)}</span>
                                      </div>

                                      {/* Move stages action buttons */}
                                      <div style={{ display: 'flex', justifySelf: 'flex-end', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px', marginTop: '4px' }}>
                                        <button
                                          disabled={!prevStage}
                                          onClick={() => prevStage && handleMoveOpportunity(opp.id, prevStage.id)}
                                          style={{ background: 'none', border: 'none', color: prevStage ? '#aaa' : '#444', cursor: prevStage ? 'pointer' : 'default', fontSize: '14px' }}
                                        >
                                          ◀
                                        </button>
                                        <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#888' }}>
                                          {opp.status}
                                        </span>
                                        <button
                                          disabled={!nextStage}
                                          onClick={() => nextStage && handleMoveOpportunity(opp.id, nextStage.id)}
                                          style={{ background: 'none', border: 'none', color: nextStage ? '#aaa' : '#444', cursor: nextStage ? 'pointer' : 'default', fontSize: '14px' }}
                                        >
                                          ▶
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>
                )}

                {/* 3. INTEGRATIONS (API CONNECTORS) VIEW */}
                {crmSubTab === 'integrations' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '24px' }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>API Integration Gateways</h3>
                      <p style={{ margin: '0 0 24px 0', color: '#888', fontSize: '14px' }}>Integrate third-party CRM systems to automatically sync contacts and leads captured on this network.</p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {[
                          { id: 'gohighlevel', name: 'GoHighLevel CRM', desc: 'Sync leads to GHL sub-accounts, trigger automations, and manage funnels.', keyPlaceholder: 'Paste GHL API v2 Access Token...' },
                          { id: 'hubspot', name: 'HubSpot Integration', desc: 'Sync customer events, purchase details, and profile contacts with HubSpot.', keyPlaceholder: 'Paste HubSpot private app token...' },
                          { id: 'zapier', name: 'Zapier / Webhooks', desc: 'Send real-time JSON webhooks to any custom integration or automation hook.', keyPlaceholder: 'Paste destination URL (https://...)' }
                        ].map((provider) => {
                          const config = crmIntegrations.find(i => i.provider_name === provider.id);
                          const isConnected = !!config?.credentials?.apiKey;
                          const currentKey = config?.credentials?.apiKey || '';
                          
                          return (
                            <div key={provider.id} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{provider.name}</h4>
                                <span style={{
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                  borderRadius: '20px',
                                  fontWeight: 'bold',
                                  background: isConnected ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)',
                                  color: isConnected ? '#00ff88' : '#888'
                                }}>
                                  {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.4 }}>{provider.desc}</p>
                              
                              {/* Form to update credentials */}
                              <form onSubmit={(e) => {
                                e.preventDefault();
                                const inputVal = (e.currentTarget.elements.namedItem('apiKey') as HTMLInputElement).value;
                                handleSaveIntegration(provider.id, { apiKey: inputVal });
                              }} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                                <input
                                  type="text"
                                  name="apiKey"
                                  placeholder={provider.keyPlaceholder}
                                  defaultValue={currentKey}
                                  style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '12px' }}
                                />
                                <button
                                  type="submit"
                                  style={{
                                    alignSelf: 'flex-end',
                                    padding: '8px 16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                  }}
                                  onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                                  onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                                >
                                  Save Credentials
                                </button>
                              </form>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                )}
              </>
            )}

          </motion.div>
        )}

        {/* --- SUBSCRIPTIONS & FOLLOWS TAB --- */}
        {activeTab === 'subscriptions' && isOwnProfile && viewMode === 'edit' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Star size={28} color={wlConfig?.accent || '#ffcc00'} /> Following & Subscriptions
              </h2>
              <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '14px' }}>Manage all the channels, networks, and creator profiles you follow or subscribe to.</p>
            </div>

            {loadingConnections ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading your connections...</div>
            ) : myConnections.length === 0 ? (
              <div style={{ padding: '60px 40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Star size={40} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 8px 0', color: '#fff' }}>No Active Subscriptions or Follows</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>Explore the platform to follow creators and subscribe to networks.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* 1. Subscribed / Followed Channels & Networks */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Channels & Networks</h3>
                  {myConnections.filter(c => c.whitelabel).length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>You are not following any channels or networks yet.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                      {myConnections.filter(c => c.whitelabel).map((conn) => {
                        const wl = conn.whitelabel;
                        return (
                          <div key={conn.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <img 
                                src={wl.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(wl.name)}&background=random`} 
                                style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)' }} 
                                alt={wl.name} 
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h4 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>{wl.name}</h4>
                                <span style={{ fontSize: '11px', color: '#888' }}>{wl.domain || 'vibenetwork.tv'}</span>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', background: conn.type === 'subscribe' ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)', color: conn.type === 'subscribe' ? '#00ff88' : '#aaa' }}>
                                {conn.type.toUpperCase()}
                              </span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  onClick={() => window.open(wl.domain ? `https://${wl.domain}` : '/', '_blank')}
                                  style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  Visit
                                </button>
                                <button 
                                  onClick={() => handleUnfollowFromDashboard(conn.id)}
                                  style={{ padding: '6px 12px', background: 'rgba(255,0,0,0.1)', border: 'none', color: '#ff4d4d', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Subscribed / Followed Creator Profiles */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Creators & Profiles</h3>
                  {myConnections.filter(c => c.target_profile).length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>You are not following any creators yet.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                      {myConnections.filter(c => c.target_profile).map((conn) => {
                        const prof = conn.target_profile;
                        return (
                          <div key={conn.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <img 
                                src={prof.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(prof.username || 'User')}&background=random`} 
                                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                                alt={prof.username} 
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <h4 style={{ margin: 0, fontSize: '16px', color: '#fff' }}>{prof.full_name || prof.username}</h4>
                                <span style={{ fontSize: '11px', color: '#888' }}>@{prof.username}</span>
                              </div>
                            </div>
                            
                            <p style={{ margin: 0, fontSize: '12px', color: '#888', minHeight: '34px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>
                              {prof.bio || 'No bio provided.'}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold', background: conn.type === 'subscribe' ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)', color: conn.type === 'subscribe' ? '#00ff88' : '#aaa' }}>
                                {conn.type.toUpperCase()}
                              </span>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  onClick={() => navigate({ pathname: `/profile/${prof.id}`, search: location.search })}
                                  style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  Profile
                                </button>
                                <button 
                                  onClick={() => handleUnfollowFromDashboard(conn.id)}
                                  style={{ padding: '6px 12px', background: 'rgba(255,0,0,0.1)', border: 'none', color: '#ff4d4d', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}
          </motion.div>
        )}

      </div>

      {/* Modern Profile Picture Modals */}
      <AnimatePresence>
        {showImageModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} onClick={() => setShowImageModal(false)} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              
              <h2 style={{ margin: 0, fontSize: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>Update Profile Picture</h2>
              
              {/* Option 1: AI Engine */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ color: '#ff4d85', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}><Wand size={16}/> AI Generator</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" id="ai-prompt-input" placeholder="e.g. Cyberpunk DJ with neon glasses..." style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  <button onClick={() => {
                    const prompt = (document.getElementById('ai-prompt-input') as HTMLInputElement).value;
                    if (prompt) {
                      const computedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                      if (imageTarget === 'avatar') setAvatarUrl(computedUrl);
                      else setHomepageImageUrl(prev => prev ? prev + ',' + computedUrl : computedUrl);
                      
                      setShowImageModal(false);
                      setSaving(true);
                      setTimeout(() => setSaving(false), 500);
                    }
                  }} style={{ padding: '0 24px', background: 'linear-gradient(135deg, #8A2BE2, #ff4d85)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Dream Engine</button>
                </div>
              </div>

              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', margin: '6px 0', opacity: 0.5 }}>— OR —</div>

              {/* Option 2: Upload from Computer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label 
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingAvatar(true); }}
                    onDragLeave={() => setIsDraggingAvatar(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingAvatar(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    style={{ 
                      flex: 1, 
                      padding: '24px 14px', 
                      background: isDraggingAvatar ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.05)', 
                      border: isDraggingAvatar ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.1)', 
                      color: isDraggingAvatar ? '#00ff88' : 'var(--text-primary)', 
                      textAlign: 'center', 
                      borderRadius: '12px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold', 
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{saving ? 'Uploading to Supabase...' : isDraggingAvatar ? 'Drop file here!' : 'Choose Image File off Computer...'}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal' }}>Drag & Drop or click to browse</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={saving} />
                  </label>
                </div>
              </div>
              
              <button onClick={() => setShowImageModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', outline: 'none' }}>✕</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      <style>{`
        .camera-overlay:hover { opacity: 1 !important; }
        .group:hover .camera-badge {
          transform: scale(1.1);
          filter: brightness(1.1);
        }
      `}</style>
      
      {/* TIP MODAL */}
      <AnimatePresence>
        {showTipModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} onClick={() => setShowTipModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>💰 Send a Tip</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Support the live stream. Tokens are transferred via your internal active wallet balance.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[5, 10, 20, 50].map(amt => (
                  <button key={amt} onClick={() => setTipAmount(amt)} style={{ padding: '12px', background: tipAmount === amt ? '#00ff88' : 'rgba(255,255,255,0.05)', color: tipAmount === amt ? '#000' : '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    ${amt}
                  </button>
                ))}
              </div>
              <input type="number" placeholder="Custom Amount" value={tipAmount} onChange={e => setTipAmount(Number(e.target.value))} style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
              
              <button onClick={() => {
                const feePercentage = wlConfig?.theme?.creator_splits?.[profile?.id] ?? profile?.platform_fee_percentage ?? wlConfig?.platform_fee_percentage ?? 0;
                let creatorCut = 0;
                let networkCut = 0;
                
                if (feePercentage === 0) {
                   networkCut = Number(tipAmount);
                   creatorCut = 0;
                } else {
                   networkCut = Number(tipAmount) * (feePercentage / 100);
                   creatorCut = Number(tipAmount) - networkCut;
                }

                const stored = JSON.parse(localStorage.getItem('vibe_network_ledger') || '[]');
                stored.unshift({ id: Date.now(), title: `Tip to ${profile?.username || 'Creator'}`, type: 'Live Stream Tip', amount: `+$${networkCut.toFixed(2)}`, color: '#00ff88' });
                localStorage.setItem('vibe_network_ledger', JSON.stringify(stored));
                
                const currentNetWallet = Number(localStorage.getItem('vibe_network_wallet') || 10500);
                localStorage.setItem('vibe_network_wallet', String(currentNetWallet + networkCut));

                if (creatorCut > 0) {
                   const newBalance = walletBalance + creatorCut;
                   setWalletBalance(newBalance);
                   localStorage.setItem('vibe_host_wallet', String(newBalance));
                }

                toast.success(`Successfully completed $${tipAmount} transaction!`);
                setShowTipModal(false);
                setTipAmount('');
              }} style={{ padding: '16px', background: 'linear-gradient(45deg, #00ff88, #00bbff)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }} disabled={!tipAmount}>
                Confirm Transaction &rarr;
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GUEST GREEN ROOM MODAL */}
      <AnimatePresence>
        {guestSetup.show && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'var(--bg-color)', border: '1px solid rgba(255,255,255,0.1)', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 20px 100px rgba(0,0,255,0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,85,255,0.2)', color: '#0055ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Camera size={30} /></div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Join the Stream</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>You've been invited to join the broadcast. Please enter your display info so the audience knows who you are.</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>Your Full Name</label>
                  <input type="text" placeholder="e.g. Jane Doe" value={guestSetup.name} onChange={e => setGuestSetup({...guestSetup, name: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '15px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 'bold' }}>Professional Title</label>
                  <input type="text" placeholder="e.g. Chief Marketing Officer" value={guestSetup.title} onChange={e => setGuestSetup({...guestSetup, title: e.target.value})} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '12px', fontSize: '15px', outline: 'none' }} />
                </div>
              </div>

              <button onClick={() => {
                if (guestSetup.name.trim() && guestSetup.title.trim()) {
                  const payload = { id: Math.random().toString(36).substr(2, 9), name: guestSetup.name, title: guestSetup.title, isLive: false };
                  setLocalGuestData(payload);
                  
                  // Publish to local storage ring for the Host to pick up instantly
                  if (typeof window !== 'undefined') {
                    const current = JSON.parse(localStorage.getItem('vibe_host_guests_session') || '[]');
                    const updated = [...current, payload];
                    localStorage.setItem('vibe_host_guests_session', JSON.stringify(updated));
                    window.dispatchEvent(new Event('vibe_guests_updated'));
                  }

                  // Broadcast globally cross-device to Host
                  if (channelRef.current) {
                      channelRef.current.send({ type: 'broadcast', event: 'guest_interaction', payload: { action: 'joined', guestParam: payload } });
                  }

                  setIsPlayingLive(true); // Ignite local stream 
                  setGuestSetup({ show: false, name: '', title: '' });
                } else {
                  toast.error('Please fill out both your Name and Title to join.');
                }
              }} style={{ padding: '16px', background: '#0055ff', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '16px', cursor: 'pointer', transition: '0.2s', marginTop: '10px' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                Connect Audio & Video &rarr;
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Post Modal */}
      <AnimatePresence>
        {deletePostId && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} onClick={() => setDeletePostId(null)} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'rgba(20,20,20,0.95)', border: `1px solid ${wlConfig?.accent || 'var(--accent-primary)'}44`, padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: `0 20px 40px ${wlConfig?.accent || 'var(--accent-primary)'}22` }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: '#ff4444' }}>Delete Post</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '15px' }}>Are you sure you want to permanently delete this post? This action cannot be undone.</p>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button onClick={() => setDeletePostId(null)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>Cancel</button>
                <button onClick={confirmDeletePost} style={{ flex: 1, padding: '12px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#ff6666'} onMouseOut={e=>e.currentTarget.style.background='#ff4444'}>Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Post Modal */}
      <AnimatePresence>
        {editPostData && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} onClick={() => setEditPostData(null)} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'rgba(20,20,20,0.95)', border: `1px solid ${wlConfig?.accent || 'var(--accent-primary)'}44`, padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: `0 20px 40px ${wlConfig?.accent || 'var(--accent-primary)'}22` }}>
              <h2 style={{ margin: 0, fontSize: '22px' }}>Edit Post</h2>
              <textarea 
                id="edit-post-textarea"
                defaultValue={editPostData.content} 
                style={{ width: '100%', minHeight: '120px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '15px', resize: 'vertical', fontFamily: 'inherit' }}
                onFocus={e=>e.currentTarget.style.borderColor = wlConfig?.accent || 'var(--accent-primary)'}
                onBlur={e=>e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button onClick={() => setEditPostData(null)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>Cancel</button>
                <button onClick={() => confirmEditPost((document.getElementById('edit-post-textarea') as HTMLTextAreaElement).value)} style={{ flex: 1, padding: '12px', background: wlConfig?.accent || 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MASTERCLASS COURSE PLAYER MODAL */}
      <AnimatePresence>
        {activeCoursePlayer && (() => {
          const completed = courseProgressMap[activeCoursePlayer.id] || [];
          const progressPercent = activeCoursePlayer.modules ? Math.round((completed.length / activeCoursePlayer.modules) * 100) : 0;
          const modulesArray = Array.from({ length: activeCoursePlayer.modules || 10 }, (_, i) => i + 1);

          return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 8, 0.95)', backdropFilter: 'blur(30px)' }} onClick={() => setActiveCoursePlayer(null)} />
              
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }} style={{ position: 'relative', background: 'rgba(15, 15, 20, 0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', width: '95vw', height: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 80px rgba(138,43,226,0.3)', backdropFilter: 'blur(40px)' }}>
                
                {/* Modal Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                  <div>
                    <span style={{ background: 'rgba(138,43,226,0.2)', color: '#a855f7', border: '1px solid rgba(138,43,226,0.4)', padding: '4px 12px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '6px' }}>MASTERCLASS ACADEMY</span>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>{activeCoursePlayer.title}</h2>
                  </div>
                  <button onClick={() => setActiveCoursePlayer(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 44, height: 44, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,0,0,0.2)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>&times;</button>
                </div>

                {/* Progress Strip */}
                <div style={{ padding: '12px 32px', background: 'rgba(138,43,226,0.05)', borderBottom: '1px solid rgba(138,43,226,0.15)', display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #8A2BE2, #ff4d85)', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#ff4d85', fontSize: '14px', whiteSpace: 'nowrap' }}>{progressPercent}% COMPLETE ({completed.length}/{activeCoursePlayer.modules} MODULES)</span>
                </div>

                {/* Modal Main Content (Split View) */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                  
                  {/* Left Side: Mock Video Player */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#050508', position: 'relative', overflowY: 'auto' }}>
                    <div style={{ width: '100%', aspectRatio: '16/9', background: 'radial-gradient(circle, #1e0b36 0%, #030107 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      
                      {/* Interactive visual equalizer / waves representation */}
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '40px', marginBottom: '24px' }}>
                        {Array.from({ length: 12 }).map((_, i) => (
                          <motion.div 
                            key={i} 
                            animate={{ height: [8, Math.random() * 35 + 8, 8] }} 
                            transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: 'easeInOut' }} 
                            style={{ width: '4px', background: '#8A2BE2', borderRadius: '2px' }} 
                          />
                        ))}
                      </div>

                      <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#fff', textAlign: 'center', letterSpacing: '1px' }}>LESSON MEDIA STREAM ACTIVE</h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>Currently streaming Module {completed[0] || 1} core concepts.</p>
                      
                      {/* Premium Player Overlay UI Mock */}
                      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.6)', padding: '12px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '18px' }}>▶</button>
                          <div style={{ fontSize: '12px', color: '#fff' }}>04:12 / 18:45</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>1080p HD</span>
                          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>🔊</button>
                          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>⛶</button>
                        </div>
                      </div>
                    </div>

                    {/* Lesson Description Details */}
                    <div style={{ padding: '32px' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#fff' }}>Module Overview & Reference Materials</h4>
                      <p style={{ margin: '0 0 20px 0', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '15px' }}>
                        This masterclass provides step-by-step practical guides. Check off each module checklist item on the right sidebar as you progress through lessons to update your permanent learning scores. Download worksheets, code templates, and high-fidelity beat samples from your host account.
                      </p>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <a href="#" onClick={(e) => { e.preventDefault(); toast.success('Downloaded course resource package!'); }} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          📁 Reference Samples (.ZIP)
                        </a>
                        <a href="#" onClick={(e) => { e.preventDefault(); toast.success('Downloaded course guidebook PDF!'); }} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          📄 Study Syllabus (.PDF)
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Modules Playlist Checklist */}
                  <div style={{ width: '380px', borderLeft: '1px solid rgba(255,255,255,0.08)', background: '#0a0a0f', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>MODULE PROGRESS PLAN</h4>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {modulesArray.map((idx) => {
                        const isDone = completed.includes(idx);
                        return (
                          <div 
                            key={idx} 
                            onClick={() => handleToggleModuleProgress(activeCoursePlayer.id, idx)}
                            style={{ 
                              padding: '16px 20px', 
                              borderRadius: '16px', 
                              background: isDone ? 'rgba(138,43,226,0.1)' : 'rgba(255,255,255,0.02)', 
                              border: `1px solid ${isDone ? 'rgba(138,43,226,0.3)' : 'rgba(255,255,255,0.05)'}`, 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{ 
                                width: '24px', height: '24px', borderRadius: '6px', 
                                border: '2px solid', borderColor: isDone ? '#8A2BE2' : 'rgba(255,255,255,0.2)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                background: isDone ? '#8A2BE2' : 'transparent',
                                color: '#000', fontSize: '14px', fontWeight: 'bold'
                              }}>
                                {isDone ? '✓' : ''}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 'bold', color: isDone ? '#fff' : '#ccc', fontSize: '14px' }}>Module {idx} Checkpoint</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Interactive Lesson Video</span>
                              </div>
                            </div>
                            <span style={{ fontSize: '12px', color: isDone ? '#ff4d85' : 'var(--text-muted)', fontWeight: 'bold' }}>
                              {isDone ? 'COMPLETE' : 'INCOMPLETE'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* EDIT PRODUCT INVENTORY MODAL */}
      <AnimatePresence>
        {showEditModal && editingProduct && (() => {
          return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }} onClick={() => { setShowEditModal(false); setEditingProduct(null); }} />
              
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'rgba(15, 15, 20, 0.95)', border: `1px solid rgba(255,255,255,0.1)`, padding: '32px', borderRadius: '28px', width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>⚙️ Edit Store Product</h3>
                  <button onClick={() => { setShowEditModal(false); setEditingProduct(null); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '22px' }}>&times;</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>Product Title</label>
                    <input type="text" value={editingProduct.title} onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>Price ($)</label>
                      <input type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>Product Type</label>
                      <select value={editingProduct.type} onChange={e => setEditingProduct({ ...editingProduct, type: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                        <option value="digital">Digital Release</option>
                        <option value="physical">Physical Merch</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>Product Image URL</label>
                    <input type="text" value={editingProduct.image_url || ''} onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>

                  {editingProduct.type === 'physical' && (() => {
                    const variantsObj = editingProduct.variants || {};
                    const isClothing = variantsObj.is_clothing || false;
                    const colorStr = Array.isArray(variantsObj.colors) ? variantsObj.colors.join(', ') : (variantsObj.colors || '');
                    const sizeStr = Array.isArray(variantsObj.sizes) ? variantsObj.sizes.join(', ') : (variantsObj.sizes || '');

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="checkbox" 
                            id="editIsClothing"
                            checked={isClothing}
                            onChange={e => setEditingProduct({
                              ...editingProduct,
                              is_clothing: e.target.checked,
                              variants: { ...variantsObj, is_clothing: e.target.checked, sizes: e.target.checked ? variantsObj.sizes : [] }
                            })}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ff4d85' }} 
                          />
                          <label htmlFor="editIsClothing" style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>👕 This is a clothing product (enable sizes)</label>
                        </div>

                        {isClothing && (
                          <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Available Sizes (comma separated)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. S, M, L, XL" 
                              value={sizeStr} 
                              onChange={e => setEditingProduct({
                                ...editingProduct,
                                sizes: e.target.value,
                                variants: { ...variantsObj, sizes: e.target.value }
                              })} 
                              style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }} 
                            />
                          </div>
                        )}

                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Available Colors (comma separated)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Black, White, Red" 
                            value={colorStr} 
                            onChange={e => setEditingProduct({
                              ...editingProduct,
                              colors: e.target.value,
                              variants: { ...variantsObj, colors: e.target.value }
                            })} 
                            style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }} 
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                  <button 
                    onClick={() => handleDeleteProduct(editingProduct.id)}
                    style={{ padding: '12px 20px', background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,0,0,0.4)', color: '#ff4444', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    🗑️ Delete Product
                  </button>
                  <div style={{ flex: 1 }} />
                  <button 
                    onClick={() => { setShowEditModal(false); setEditingProduct(null); }}
                    style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleUpdateProduct(editingProduct)}
                    style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* EDIT SERIES MODAL */}
      <AnimatePresence>
        {showEditSeriesModal && editingSeries && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }} onClick={() => { setShowEditSeriesModal(false); setEditingSeries(null); }} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'rgba(15, 15, 20, 0.95)', border: `1px solid rgba(255,255,255,0.1)`, padding: '32px', borderRadius: '28px', width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>⚙️ Edit TV Series</h3>
                <button onClick={() => { setShowEditSeriesModal(false); setEditingSeries(null); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '22px' }}>&times;</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Series Title</label>
                  <input type="text" value={editingSeries.title} onChange={e => setEditingSeries({ ...editingSeries, title: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Description</label>
                  <textarea value={editingSeries.description || ''} onChange={e => setEditingSeries({ ...editingSeries, description: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', minHeight: '80px', resize: 'vertical' }} />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Billing Model</label>
                  <select 
                    value={editingSeries.billing_level || 'series'} 
                    onChange={e => setEditingSeries({ ...editingSeries, billing_level: e.target.value, price: e.target.value === 'episode' ? '' : editingSeries.price })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="series">Charge Per Series (Season Pass)</option>
                    <option value="episode">Charge Per Episode (Pay Per Episode)</option>
                  </select>
                </div>

                {(editingSeries.billing_level === 'series' || !editingSeries.billing_level) && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Full Season Price ($)</label>
                      <input type="number" step="0.01" value={editingSeries.price} onChange={e => setEditingSeries({ ...editingSeries, price: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }} />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>🔒 Subscriber Access Rules</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input 
                          type="checkbox" 
                          id="editSeriesSubFree" 
                          checked={editingSeries.subscriber_free} 
                          onChange={e => setEditingSeries({ ...editingSeries, subscriber_free: e.target.checked, subscriber_price: e.target.checked ? '' : editingSeries.subscriber_price })}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <label htmlFor="editSeriesSubFree" style={{ color: '#fff', fontSize: '13px', cursor: 'pointer' }}>Allow active subscribers to view this full series for free</label>
                      </div>

                      {!editingSeries.subscriber_free && (
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Subscriber Discounted Price (Optional)</label>
                          <input 
                            type="number" 
                            step="0.01" 
                            placeholder="Discount Price" 
                            value={editingSeries.subscriber_price || ''} 
                            onChange={e => setEditingSeries({ ...editingSeries, subscriber_price: e.target.value })}
                            style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }} 
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Series Cover Image</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {editingSeries.img && (
                      <img src={editingSeries.img} alt="Series Cover" style={{ width: '120px', aspectRatio: '16/9', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                    )}
                    <label style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: '#ccc', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                      {uploadingEditSeriesImg ? 'Uploading Cover...' : 'Change Cover Photo'}
                      <input type="file" accept="image/*" onChange={handleEditSeriesCoverUpload} style={{ display: 'none' }} disabled={uploadingEditSeriesImg} />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                <button 
                  onClick={() => handleDeleteSeries(editingSeries.id)}
                  style={{ padding: '12px 20px', background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,0,0,0.4)', color: '#ff4444', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🗑️ Delete Series
                </button>
                <div style={{ flex: 1 }} />
                <button 
                  onClick={() => { setShowEditSeriesModal(false); setEditingSeries(null); }}
                  style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleUpdateSeries(editingSeries)}
                  disabled={!editingSeries.title || (editingSeries.billing_level === 'series' && !editingSeries.price) || uploadingEditSeriesImg}
                  style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT EPISODE MODAL */}
      <AnimatePresence>
        {showEditEpisodeModal && editingEpisode && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)' }} onClick={() => { setShowEditEpisodeModal(false); setEditingEpisode(null); }} />
            
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ position: 'relative', background: 'rgba(15, 15, 20, 0.95)', border: `1px solid rgba(255,255,255,0.1)`, padding: '32px', borderRadius: '28px', width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>⚙️ Edit Episode</h3>
                <button onClick={() => { setShowEditEpisodeModal(false); setEditingEpisode(null); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '22px' }}>&times;</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Episode Title</label>
                  <input type="text" value={editingEpisode.title} onChange={e => setEditingEpisode({ ...editingEpisode, title: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Runtime (e.g. 45 min)</label>
                    <input type="text" value={editingEpisode.length || ''} onChange={e => setEditingEpisode({ ...editingEpisode, length: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Content Rating</label>
                    <select 
                      value={editingEpisode.rating || ''} 
                      onChange={e=>setEditingEpisode({...editingEpisode, rating: e.target.value})} 
                      style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="" style={{ background: '#111', color: '#888' }}>Content Rating (Optional)</option>
                      <option value="G" style={{ background: '#111' }}>G</option>
                      <option value="PG" style={{ background: '#111' }}>PG</option>
                      <option value="PG-13" style={{ background: '#111' }}>PG-13</option>
                      <option value="R" style={{ background: '#111' }}>R</option>
                      <option value="NC-17" style={{ background: '#111' }}>NC-17</option>
                      <option value="TV-Y" style={{ background: '#111' }}>TV-Y</option>
                      <option value="TV-Y7" style={{ background: '#111' }}>TV-Y7</option>
                      <option value="TV-G" style={{ background: '#111' }}>TV-G</option>
                      <option value="TV-PG" style={{ background: '#111' }}>TV-PG</option>
                      <option value="TV-14" style={{ background: '#111' }}>TV-14</option>
                      <option value="TV-MA" style={{ background: '#111' }}>TV-MA</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Description</label>
                  <textarea value={editingEpisode.description || ''} onChange={e => setEditingEpisode({ ...editingEpisode, description: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', minHeight: '60px', resize: 'vertical' }} />
                </div>

                {/* Genre Tags */}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Genre Tags</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    {['Action', 'Adventure', 'Podcast', 'Docuseries', 'Comedy', 'Drama', 'Thriller', 'Talk Show', 'Music', 'Sports'].map((g) => {
                      const activeGenres = editingEpisode.genre ? editingEpisode.genre.split(',').map((s: string)=>s.trim()) : [];
                      const isSelected = activeGenres.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            let updatedGenres;
                            if (isSelected) {
                              updatedGenres = activeGenres.filter((x: string) => x !== g).join(', ');
                            } else {
                              updatedGenres = [...activeGenres, g].join(', ');
                            }
                            setEditingEpisode({ ...editingEpisode, genre: updatedGenres });
                          }}
                          style={{
                            padding: '6px 12px',
                            background: isSelected ? 'rgba(255,77,133,0.2)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isSelected ? '#ff4d85' : 'rgba(255,255,255,0.1)'}`,
                            color: isSelected ? '#ff4d85' : '#ccc',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Video Content */}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Episode Video Content <span style={{ color: '#ff4d85' }}>*</span></label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: '#ccc', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                      {uploadingEditEpisodeVideo ? 'Uploading Video...' : (editingEpisode.video_url && editingEpisode.video_url.includes('videos/')) ? 'Video File Uploaded ✓' : 'Upload Video File'}
                      <input type="file" accept="video/*" onChange={handleEditEpisodeVideoUpload} style={{ display: 'none' }} disabled={uploadingEditEpisodeVideo} />
                    </label>
                    <input 
                      type="text" 
                      placeholder="Or paste external YouTube, Vimeo or video URL" 
                      value={editingEpisode.video_url || ''} 
                      onChange={e => setEditingEpisode({ ...editingEpisode, video_url: e.target.value })}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }} 
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Episode Cover Image</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {editingEpisode.thumbnail_url && (
                      <img src={editingEpisode.thumbnail_url} alt="Episode Cover" style={{ width: '120px', aspectRatio: '16/9', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                    )}
                    <label style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: '#ccc', textAlign: 'center', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                      {uploadingEditEpisodeImg ? 'Uploading Cover...' : 'Change Cover Photo'}
                      <input type="file" accept="image/*" onChange={handleEditEpisodeCoverUpload} style={{ display: 'none' }} disabled={uploadingEditEpisodeImg} />
                    </label>
                  </div>
                </div>

                {/* Standard Price */}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Standard Price ($)</label>
                  <input type="number" step="0.01" value={editingEpisode.price} onChange={e => setEditingEpisode({ ...editingEpisode, price: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }} />
                </div>

                {/* Subscriber Access Rules */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>🔒 Subscriber Access Rules</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      id="editEpSubFree" 
                      checked={editingEpisode.subscriber_free} 
                      onChange={e => setEditingEpisode({ ...editingEpisode, subscriber_free: e.target.checked, subscriber_price: e.target.checked ? '' : editingEpisode.subscriber_price })}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="editEpSubFree" style={{ color: '#fff', fontSize: '13px', cursor: 'pointer' }}>Allow active subscribers to view this episode for free</label>
                  </div>

                  {!editingEpisode.subscriber_free && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>Subscriber Discounted Price (Optional)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="Discount Price" 
                        value={editingEpisode.subscriber_price || ''} 
                        onChange={e => setEditingEpisode({ ...editingEpisode, subscriber_price: e.target.value })}
                        style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }} 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
                <button 
                  onClick={() => handleDeleteEpisode(editingEpisode.id, editingEpisode.series_id)}
                  style={{ padding: '12px 20px', background: 'rgba(255,0,0,0.15)', border: '1px solid rgba(255,0,0,0.4)', color: '#ff4444', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  🗑️ Delete Episode
                </button>
                <div style={{ flex: 1 }} />
                <button 
                  onClick={() => { setShowEditEpisodeModal(false); setEditingEpisode(null); }}
                  style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleUpdateEpisode(editingEpisode)}
                  disabled={!editingEpisode.title || !editingEpisode.video_url || uploadingEditEpisodeVideo || uploadingEditEpisodeImg}
                  style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #00ff88, #00bbff)', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TV SERIES CINEMA THEATER OVERLAY */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showCinemaModal && activeCinemaSeries && activeCinemaEpisode && (() => {
          const renderCinemaPlayer = () => {
            const url = activeCinemaEpisode.video_url || '';
            if (!url) {
              const bgImg = activeCinemaEpisode.thumbnail_url || activeCinemaSeries.img || '';
              return (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  position: 'relative',
                  backgroundImage: bgImg ? `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url("${bgImg}")` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  {/* Interactive sound visualizer or waves representation */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '60px', marginBottom: '20px' }}>
                    {Array.from({ length: 18 }).map((_, i) => (
                      <motion.div 
                        key={i} 
                        animate={{ scaleY: [0.2, Math.random() * 1.5 + 0.2, 0.2] }} 
                        transition={{ repeat: Infinity, duration: 0.8 + Math.random(), ease: 'easeInOut' }} 
                        style={{ width: '3px', height: '40px', background: '#ff4d85', borderRadius: '2px', transformOrigin: 'center' }} 
                      />
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,77,133,0.1)', color: '#ff4d85', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(255,77,133,0.3)', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff4d85', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                    CINEMA THEATER STREAMING ACTIVE
                  </div>
                  <span style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>Playing: {activeCinemaEpisode.title}</span>
                  
                  {/* Player controls overlay */}
                  <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.7)', padding: '12px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <button style={{ background: 'none', border: 'none', color: '#ff4d85', cursor: 'pointer', fontSize: '20px' }}>▶</button>
                      <div style={{ fontSize: '12px', color: '#fff' }}>08:45 / {activeCinemaEpisode.length || '45 min'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,77,133,0.8)', fontWeight: 'bold', letterSpacing: '1px' }}>PREVIEW ACTIVE</span>
                      <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>🔊</button>
                      <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>⛶</button>
                    </div>
                  </div>
                </div>
              );
            }

            // Check for YouTube
            const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
            if (ytMatch && ytMatch[1]) {
              const embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
              return (
                <iframe 
                  title={activeCinemaEpisode.title}
                  src={embedUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              );
            }

            // Check for Vimeo
            const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
            if (vimeoMatch && vimeoMatch[1]) {
              const embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
              return (
                <iframe 
                  title={activeCinemaEpisode.title}
                  src={embedUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              );
            }

            // Check for Lightcast/Embed players
            if (url.includes('lightcast.com/embed') || url.includes('embed/player.php') || url.includes('/embed/')) {
              return (
                <iframe 
                  title={activeCinemaEpisode.title}
                  src={url}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  allowFullScreen
                />
              );
            }

            // Native HTML5 video player
            return (
              <video 
                src={url}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
              />
            );
          };

          return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '0' : '20px' }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(5, 5, 7, 0.97)', backdropFilter: 'blur(30px)' }} onClick={() => { setShowCinemaModal(false); setActiveCinemaSeries(null); }} />
              
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }} style={{ position: 'relative', background: 'rgba(10, 10, 14, 0.9)', border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.08)', borderRadius: isMobile ? '0' : '32px', width: isMobile ? '100vw' : '95vw', height: isMobile ? '100dvh' : '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 80px rgba(255,77,133,0.3)', backdropFilter: 'blur(40px)' }}>
                
                {/* Cinema Header */}
                <div style={{ padding: isMobile ? '16px 20px' : '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                  <div>
                    <span style={{ background: 'rgba(255,77,133,0.2)', color: '#ff4d85', border: '1px solid rgba(255,77,133,0.4)', padding: '4px 12px', borderRadius: '30px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block', marginBottom: '6px' }}>CINEMA MULTIPLEX ORIGINAL</span>
                    <h2 style={{ margin: 0, fontSize: isMobile ? '18px' : '22px', fontWeight: 900 }}>{activeCinemaSeries.title}</h2>
                  </div>
                  <button onClick={() => { setShowCinemaModal(false); setActiveCinemaSeries(null); }} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 44, height: 44, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>&times;</button>
                </div>

                {/* Cinema Main Workspace */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflowY: isMobile ? 'auto' : 'hidden', overflowX: 'hidden' }}>
                  
                  {/* Streaming Theater (Left Side) */}
                  <div style={{ flex: isMobile ? 'none' : 1, display: 'flex', flexDirection: 'column', background: '#020204', position: 'relative', overflowY: isMobile ? 'visible' : 'auto' }}>
                    
                    {/* Simulated High-Fidelity Video Screen */}
                    <div style={{ width: '100%', aspectRatio: '16/9', background: 'radial-gradient(circle, #250917 0%, #030103 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {renderCinemaPlayer()}
                    </div>

                    {/* Synopsis & Synopsis metadata */}
                    <div style={{ padding: isMobile ? '20px' : '32px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>EPISODE PLAYING</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#fff' }}>{activeCinemaEpisode.title}</h3>
                        {activeCinemaEpisode.rating && (
                          <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', fontSize: '11px', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 'bold' }}>
                            {activeCinemaEpisode.rating}
                          </span>
                        )}
                      </div>
                      {activeCinemaEpisode.genre && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                          {activeCinemaEpisode.genre.split(',').map((tag: string) => (
                            <span key={tag} style={{ background: 'rgba(255, 77, 133, 0.12)', color: '#ff4d85', border: '1px solid rgba(255, 77, 133, 0.2)', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '15px' }}>
                        {activeCinemaEpisode.description || 'Welcome to this premium cinema segment. Watch exclusive multi-angle episodes produced explicitly for White-Label networks.'}
                      </p>
                    </div>

                  </div>

                  {/* Episodes Sidebar Playlist Checklist (Right Side) */}
                  <div style={{ width: isMobile ? '100%' : '360px', borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.08)', borderTop: isMobile ? '1px solid rgba(255,255,255,0.08)' : 'none', background: '#0a0a0d', display: 'flex', flexDirection: 'column', flexShrink: 0, flex: isMobile ? 'none' : 1, overflowY: isMobile ? 'visible' : 'auto' }}>
                    <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>EPISODE SELECTION</h4>
                    </div>
                    <div style={{ flex: isMobile ? 'none' : 1, overflowY: isMobile ? 'visible' : 'auto', padding: isMobile ? '16px' : '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(activeCinemaSeries.episodes || []).map((ep: any, idx: number) => {
                        const isActive = activeCinemaEpisode.id === ep.id;
                        const isSeasonUnlocked = isOwnProfile || (
                          activeCinemaSeries.billing_level !== 'episode' && (
                            purchasedSeasons.includes(activeCinemaSeries.id) ||
                            (isSubscribed && activeCinemaSeries.subscriber_free) ||
                            parseFloat(activeCinemaSeries.price || '0') === 0
                          )
                        );
                        const isUnlocked = isOwnProfile || 
                          isSeasonUnlocked || 
                          purchasedEpisodes.includes(ep.id) || 
                          (isSubscribed && ep.subscriber_free) ||
                          parseFloat(ep.price || '0') === 0;
                        
                        let displayPrice = parseFloat(ep.price || '0');
                        let priceText = `$${displayPrice.toFixed(2)}`;
                        if (isSubscribed) {
                          if (ep.subscriber_free) {
                            priceText = 'FREE';
                          } else if (ep.subscriber_price !== null && ep.subscriber_price !== undefined && ep.subscriber_price !== '') {
                            priceText = `$${parseFloat(ep.subscriber_price).toFixed(2)}`;
                          }
                        }

                        return (
                          <div 
                            key={ep.id} 
                            onClick={() => {
                              if (isUnlocked) {
                                setActiveCinemaEpisode(ep);
                              } else {
                                handleBuyEpisodeSimulation(ep, activeCinemaSeries);
                              }
                            }}
                            style={{ 
                              padding: '16px', 
                              borderRadius: '16px', 
                              background: isActive ? 'rgba(255,77,133,0.1)' : 'rgba(255,255,255,0.02)', 
                              border: `1px solid ${isActive ? 'rgba(255,77,133,0.3)' : 'rgba(255,255,255,0.05)'}`, 
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <span style={{ fontSize: '11px', color: isActive ? '#ff4d85' : 'var(--text-muted)', fontWeight: 'bold' }}>EPISODE {idx + 1}</span>
                              <span style={{ fontSize: '11px', background: isUnlocked ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)', color: isUnlocked ? '#00ff88' : '#888', padding: '2px 8px', borderRadius: '20px', fontWeight: 'bold' }}>
                                {isUnlocked ? 'UNLOCKED' : priceText}
                              </span>
                            </div>
                            <h4 style={{ margin: 0, fontSize: '15px', color: isActive ? '#fff' : '#ccc' }}>{ep.title}</h4>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Length: {ep.length || 'TBD'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>,
      document.body
    )}

      {/* Uploading progress indicator overlay */}
      <AnimatePresence>
        {showUploadLoader && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5, 5, 8, 0.85)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999
            }}
          >
            {/* Concentric rotating loaders */}
            <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              {/* Outer Halo ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '4px solid transparent',
                  borderTopColor: '#ff4d85',
                  borderBottomColor: '#8A2BE2'
                }}
              />

              {/* Middle Inner ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: '75%',
                  height: '75%',
                  borderRadius: '50%',
                  border: '4px solid transparent',
                  borderLeftColor: '#00ff88',
                  borderRightColor: '#00bbff'
                }}
              />

              {/* Center glowing core */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff4d85, #8A2BE2)',
                  boxShadow: '0 0 20px #ff4d85'
                }}
              />
            </div>

            {/* Message & Status */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                marginTop: '24px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#fff',
                letterSpacing: '0.5px'
              }}
            >
              Processing Upload...
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: '8px',
                fontSize: '14px',
                color: '#888',
                maxWidth: '280px',
                textAlign: 'center',
                lineHeight: 1.5
              }}
            >
              Encoding and storing your media files. Please keep this page open.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
};

export default React.memo(ProfileDashboard);
