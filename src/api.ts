import { supabase } from './supabaseClient';

export async function getCategoriesWithVideos() {
  if (!supabase) return [];
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      *,
      videos (*)
    `)
    .neq('title', 'Live Network Schedule')
    .order('sort_order', { ascending: true });
    
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'influencer');

  const mappedCreators = (profiles || []).map((inf: any) => ({
    id: inf.id,      // UUID
    title: inf.username || 'Creator', // If username is bjohnson3rd, it shows as title!
    image: inf.homepage_image_url || inf.avatar_url || `https://picsum.photos/seed/${inf.username || 'default'}/512/512`,
    tags: ['Influencer Channel'],
    videoUrl: '' 
  }));

  return categories.map(cat => {
    let items = cat.videos.map((vid: any) => ({
      id: vid.id,
      title: vid.title,
      image: vid.image_url,
      tags: vid.tags || [],
      videoUrl: vid.video_url
    }));

    if (cat.title === 'New to the Network') {
      items = [...mappedCreators, ...items];
    }

    return {
      title: cat.title,
      aspectRatio: cat.aspect_ratio,
      items: items
    };
  });
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
