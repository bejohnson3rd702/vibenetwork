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
    supabase.from('whitelabel_configs').select('id, name, domain, logo').limit(7),
    profilesQuery,
    supabase.from('videos').select('id, title, image_url, tags, video_url').order('created_at', { ascending: false }).limit(7)
  ]);

  const mappedNetworks = (whitelabels || []).map((wl: any) => ({
    id: 'wl_' + wl.id,
    title: wl.name || wl.domain || 'Tenant Platform',
    image: wl.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(wl.name || 'W')}&background=0D8ABC&color=fff`,
    tags: ['Firm'],
    linkUrl: `/?tenant=${wl.id}`
  }));

  // Mix in local test networks safely
  if (typeof window !== 'undefined') {
    const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
    localNetworks.forEach((n: any) => {
      mappedNetworks.unshift({
        id: 'wl_' + n.id,
        title: n.name || 'Tenant Platform',
        image: n.logoImage || n.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(n.name || 'W')}&background=0D8ABC&color=fff`,
        tags: ['Firm', 'Test'],
        linkUrl: `/?tenant=${n.id}`
      });
    });
  }


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

  // Dynamically load custom categories and their assigned videos!
  const { data: dbCategories } = await supabase.from('categories').select('*');
  const { data: allVideos } = await supabase.from('videos').select('*');

  let addedCustom = false;

  if (dbCategories) {
    dbCategories.forEach(cat => {
      if (cat.title === 'Live Network Schedule') return;
      
      const catVideos = (allVideos || []).filter((v: any) => v.category_id === cat.id);
      
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
