import { supabase } from './supabaseClient';

export async function getCategoriesWithVideos() {
  if (!supabase) return [];

  // Fetch Whitelabels for New Networks
  const { data: whitelabels } = await supabase.from('whitelabel_configs').select('*').limit(7);
  
  // Fetch Profiles for New Profiles
  const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(7);

  // Fetch Videos for New Content
  const { data: videos } = await supabase.from('videos').select('*').limit(7);

  const mappedNetworks = (whitelabels || []).map((wl: any) => ({
    id: 'wl_' + wl.id,
    title: wl.name || wl.domain || 'Tenant Node',
    image: wl.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(wl.name || 'W')}&background=0D8ABC&color=fff`,
    tags: ['Enterprise Node'],
    linkUrl: wl.domain ? (wl.domain.startsWith('http') ? wl.domain : `https://${wl.domain}`) : null
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

  return [
    {
      title: 'New Networks',
      aspectRatio: '16/9',
      items: mappedNetworks
    },
    {
      title: 'New Profiles',
      aspectRatio: '1/1',
      items: mappedProfiles
    },
    {
      title: 'New Content',
      aspectRatio: '16/9',
      items: mappedContent
    }
  ];
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
