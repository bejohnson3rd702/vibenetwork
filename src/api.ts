import { supabase } from './supabaseClient';

export async function getCategoriesWithVideos(tenantId?: string) {
  if (!supabase) return [];

  // Fetch Profiles dynamically scoped by tenant
  let profilesQuery = supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(7);
  if (tenantId) {
    profilesQuery = profilesQuery.eq('whitelabel_id', tenantId);
  } else {
    // Vibe Root sees only unassigned profiles and parent users
    profilesQuery = profilesQuery.is('whitelabel_id', null);
  }

  // Fetch all core domain objects concurrently to maximize network efficiency
  const [
    { data: whitelabels },
    { data: profiles },
    { data: videos }
  ] = await Promise.all([
    supabase.from('whitelabel_configs').select('id, name, domain, logo, theme, parent_network_id').order('created_at', { ascending: false }).limit(100),
    profilesQuery,
    supabase.from('videos').select('id, title, image_url, tags, video_url').order('created_at', { ascending: false }).limit(20)
  ]);

  const APPROVED_N2N_PARENT_IDS = [
    '3915f1e5-4c79-4b2a-ad41-7029ce8052d7', // AVO NETWORK
    '4d16dae7-518d-440e-bb21-b6f3a7cfcd64', // B2K Network
    '7a017c4d-c08f-4260-8540-a0cc8bed4e11', // Muscle & Fitness | Mr. Olympian
  ];

  const mappedNetworks = (whitelabels || []).filter((wl: any) => {
    const domainLower = (wl.domain || '').toLowerCase();
    const nameLower = (wl.name || '').toLowerCase();
    
    // Filter out main site domains
    if (domainLower === 'vibenetwork.tv' || domainLower === 'vibenetwork.com') return false;
    
    // Filter out child networks
    if (wl.parent_network_id || wl.theme?.parent_network_id) return false;
    
    // Filter out test networks (Noelani, Bennie, Leilani, Leiloe, etc.)
    if (
      nameLower.includes('bennie') || nameLower.includes('noelani') || 
      nameLower.includes('leilani') || nameLower.includes('leiloe') ||
      domainLower.includes('bennie') || domainLower.includes('noelani')
    ) {
      return false;
    }

    // Filter out parent networks not yet approved for production (unless in local development mode)
    const isApproved = APPROVED_N2N_PARENT_IDS.includes(wl.id);
    const isDevMode = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
    if (!isApproved && !isDevMode) {
      return false;
    }
    
    return true;
  }).map((wl: any) => ({
    id: 'wl_' + wl.id,
    title: wl.name || wl.domain || 'Tenant Platform',
    image: wl.theme?.heroImage || wl.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(wl.name || 'W')}&background=0D8ABC&color=fff`,
    tags: ['Firm'],
    linkUrl: `/?tenant=${wl.id}`
  }));




  const mappedProfiles = (profiles || []).map((p: any) => ({
    id: p.id,
    title: p.username || 'Creator Profile',
    image: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.username || 'U')}`,
    tags: [p.role === 'influencer' ? 'Creator' : 'Member'],
    linkUrl: `/profile/${p.id}`
  }));

  const mappedContent = (videos || []).map((vid: any) => ({
    id: vid.id,
    title: vid.title,
    image: vid.image_url,
    tags: vid.tags || [],
    videoUrl: vid.video_url
  }));

  const categoriesToReturn = [];
  
  if (!tenantId) {
    categoriesToReturn.push({
      title: 'New Networks',
      aspectRatio: '16/9',
      items: mappedNetworks
    });
  }

  categoriesToReturn.push({
    title: 'New Profiles',
    aspectRatio: '1/1',
    items: mappedProfiles
  });

  // Dynamically load custom categories and their assigned videos using an optimized join
  let categoriesQuery = supabase
    .from('categories')
    .select('*, videos(id, title, image_url, tags, video_url, creator:profiles!inner(whitelabel_id))');

  if (tenantId) {
    categoriesQuery = categoriesQuery.eq('videos.creator.whitelabel_id', tenantId);
  } else {
    categoriesQuery = categoriesQuery.is('videos.creator.whitelabel_id', null);
  }

  const { data: dbCategories } = await categoriesQuery.limit(10); // Limit to top 10 custom categories to prevent massive payload sizes

  let addedCustom = false;

  if (dbCategories) {
    dbCategories.forEach(cat => {
      const title = cat.title?.trim().toLowerCase() || '';
      if (['live network schedule', 'featured dj sets', 'underground mixes'].includes(title)) return;
      if (!tenantId && ['music videos', 'bts & interviews'].includes(title)) return;
      
      const catVideos = cat.videos || [];
      
      if (catVideos.length > 0) {
        addedCustom = true;
        // Prevent duplicate sliders if the database has duplicate categories
        if (!categoriesToReturn.find(c => c.title === cat.title)) {
          categoriesToReturn.push({
            title: cat.title,
            aspectRatio: '16/9',
            items: catVideos.map((vid: any) => ({
              id: vid.id,
              title: vid.title,
              image: vid.image_url,
              tags: vid.tags || [],
              videoUrl: vid.video_url
            }))
          });
        }
      }
    });
  }

  // Fallback if no custom categories have videos yet
  if (!addedCustom) {
    categoriesToReturn.push({
      title: 'New Content',
      aspectRatio: '16/9',
      items: mappedContent
    });
  }

  return categoriesToReturn;
}

/** Fetch categories scoped to all child networks of an N2N parent */
export async function getN2NCategories(parentId: string, childNetworkIds: string[]) {
  if (!supabase || childNetworkIds.length === 0) return [];

  // Fetch profiles and videos concurrently
  const [profilesResult, videosResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .in('whitelabel_id', childNetworkIds)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('videos')
      .select('id, title, image_url, tags, video_url, creator:profiles!inner(whitelabel_id)')
      .in('creator.whitelabel_id', childNetworkIds)
      .order('created_at', { ascending: false })
      .limit(20)
  ]);

  const profiles = profilesResult.data || [];
  const videos = videosResult.data || [];

  const mappedProfiles = profiles.map((p: any) => ({
    id: p.id,
    title: p.username || 'Creator Profile',
    image: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.username || 'U')}`,
    tags: [p.role === 'influencer' ? 'Creator' : 'Member'],
    linkUrl: `/profile/${p.id}`
  }));

  const mappedContent = videos.map((vid: any) => ({
    id: vid.id,
    title: vid.title,
    image: vid.image_url,
    tags: vid.tags || [],
    videoUrl: vid.video_url
  }));

  const categories = [];

  if (mappedProfiles.length > 0) {
    categories.push({
      title: 'Network Creators',
      aspectRatio: '1/1',
      items: mappedProfiles
    });
  }

  if (mappedContent.length > 0) {
    categories.push({
      title: 'New Content',
      aspectRatio: '16/9',
      items: mappedContent
    });
  }

  return categories;
}

export async function getLiveSchedule() {
  if (!supabase) return [];

  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('id')
    .eq('title', 'Live Network Schedule')
    .single();

  if (catError || !category) return [];

  const { data: videos, error: vidError } = await supabase
    .from('videos')
    .select('id, title, stream_time, image_url, tags, video_url')
    .eq('category_id', category.id)
    .order('stream_time', { ascending: true }); // Can sort chronologically in real apps

  if (vidError) return [];

  return videos.map(vid => ({
    id: vid.id,
    title: vid.title,
    time: vid.stream_time || 'Just Added',
    image: vid.image_url,
    tags: vid.tags || [],
    video_url: vid.video_url
  }));
}
