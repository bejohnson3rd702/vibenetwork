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
    title: wl.name || wl.domain || 'Tenant Node',
    image: wl.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(wl.name || 'W')}&background=0D8ABC&color=fff`,
    tags: ['Firm'],
    linkUrl: `/?tenant=${wl.id}`
  }));

  // Backfill with incredibly premium AI generative logos to complete a 6-tile slider
  const mockWhitelabels = [
      { id: 'mock_wl1', title: 'Nexus Tech Global', image: 'https://image.pollinations.ai/prompt/blue%20neon%20nexus%20tech%20logo%20cinematic?width=800&height=600&nologo=true', tags: ['Tech'], linkUrl: '#' },
      { id: 'mock_wl2', title: 'Acme Corp Systems', image: 'https://image.pollinations.ai/prompt/red%20acme%20corp%20logo%20modern%20building%20glass?width=800&height=600&nologo=true', tags: ['Industrial'], linkUrl: '#' },
      { id: 'mock_wl3', title: 'Horizon Cloud', image: 'https://image.pollinations.ai/prompt/horizon%20cloud%20sky%20logo%20minimalist%20blue?width=800&height=600&nologo=true', tags: ['SaaS'], linkUrl: '#' },
      { id: 'mock_wl4', title: 'Quantum Logistics', image: 'https://image.pollinations.ai/prompt/quantum%20logistics%20modern%20truck%20hologram%20logo?width=800&height=600&nologo=true', tags: ['Logistics'], linkUrl: '#' },
      { id: 'mock_wl5', title: 'Aegis Security', image: 'https://image.pollinations.ai/prompt/aegis%20security%20shield%20logo%20silver%203d?width=800&height=600&nologo=true', tags: ['Cyber'], linkUrl: '#' },
      { id: 'mock_wl6', title: 'Vertex Media', image: 'https://image.pollinations.ai/prompt/purple%20vertex%20media%20play%20button%20glow%20logo?width=800&height=600&nologo=true', tags: ['Agency'], linkUrl: '#' }
  ];

  while (mappedNetworks.length < 6) {
    mappedNetworks.push(mockWhitelabels[mappedNetworks.length]);
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
