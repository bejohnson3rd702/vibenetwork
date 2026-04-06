import { supabase } from './supabaseClient';

export async function getCategoriesWithVideos(tenantId?: string) {
  if (!supabase) return [];

  // Fetch Whitelabels for New Networks (Existent only on root, or sibling networks)
  const { data: whitelabels } = await supabase.from('whitelabel_configs').select('*').limit(7);
  
  // Fetch Profiles dynamically scoped by tenant
  let profilesQuery = supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(7);
  if (tenantId) {
    profilesQuery = profilesQuery.eq('whitelabel_id', tenantId);
  } else {
    // Vibe Root sees only unassigned profiles and parent users
    profilesQuery = profilesQuery.is('whitelabel_id', null);
  }
  const { data: profiles } = await profilesQuery;

  // Fetch Videos (In a full scale platform, we would scope videos to tenantId too!)
  const { data: videos } = await supabase.from('videos').select('*').limit(7);

  const mappedNetworks = (whitelabels || []).map((wl: any) => ({
    id: 'wl_' + wl.id,
    title: wl.name || wl.domain || 'Tenant Node',
    image: wl.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(wl.name || 'W')}&background=0D8ABC&color=fff`,
    tags: ['Enterprise Node'],
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

  categoriesToReturn.push({
    title: 'New Content',
    aspectRatio: '16/9',
    items: mappedContent
  });

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
    .select('*')
    .eq('category_id', category.id)
    .order('stream_time', { ascending: true }); // Can sort chronologically in real apps

  if (vidError) return [];

  return videos.map(vid => ({
    id: vid.id,
    title: vid.title,
    time: vid.stream_time,
    image: vid.image_url,
    tags: vid.tags || []
  }));
}
