import { useState, useEffect } from 'react';
import { Film, Plus, Trash2, Tag, Video, Image, Link, CheckCircle, FolderPlus } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useToast } from '../../context/ToastContext';

import { isKpleOnlyConfig } from '../../lib/whitelabel';
import { DashboardVideoControlCenter } from '../DashboardVideoControlCenter';

export const VideosTab = ({ wlConfig }: { wlConfig: any }) => {
  const accent = wlConfig?.theme?.accent || wlConfig?.accent || '#004e98';
  const { toast } = useToast();

  const [categories, setCategories] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states - Video
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [savingVideo, setSavingVideo] = useState(false);

  // Form states - Category
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  const loadData = async (userId: string) => {
    setLoading(true);
    try {
      let videosQuery = supabase
        .from('videos')
        .select('*, categories(title)')
        .order('created_at', { ascending: false });

      if (wlConfig?.id && wlConfig.id !== 'master') {
        videosQuery = videosQuery.eq('whitelabel_id', wlConfig.id);
      } else {
        videosQuery = videosQuery.eq('creator_id', userId);
      }

      const [catResult, vidResult] = await Promise.all([
        supabase.from('categories').select('*').order('title', { ascending: true }),
        videosQuery
      ]);

      if (catResult.data) {
        setCategories(catResult.data);
        if (catResult.data.length > 0 && !categoryId) {
          setCategoryId(catResult.data[0].id);
        }
      }
      if (vidResult.data) {
        setVideos(vidResult.data);
      }
    } catch (e) {
      console.error("Failed to load videos dashboard data", e);
      toast.error("Error loading dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        loadData(session.user.id);
      }
    });
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const titleTrimmed = newCategoryTitle.trim();
    if (!titleTrimmed) return;

    setSavingCategory(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ title: titleTrimmed })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error("A category with this title already exists.");
        } else {
          toast.error("Failed to create category: " + error.message);
        }
        return;
      }

      setCategories(prev => [...prev, data].sort((a, b) => a.title.localeCompare(b.title)));
      setCategoryId(data.id);
      setNewCategoryTitle('');
      toast.success(`Category "${titleTrimmed}" created successfully!`);
    } catch (err: any) {
      toast.error("Error creating category");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim() || !categoryId) {
      toast.error("Please fill in the title, URL, and category.");
      return;
    }

    setSavingVideo(true);
    try {
      const payload = {
        title: title.trim(),
        video_url: videoUrl.trim(),
        image_url: imageUrl.trim() || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800',
        category_id: categoryId,
        creator_id: currentUser.id,
        whitelabel_id: wlConfig?.id && wlConfig.id !== 'master' ? wlConfig.id : null,
        tags: ['Custom', wlConfig?.name || 'White Label']
      };

      const { data, error } = await supabase
        .from('videos')
        .insert(payload)
        .select('*, categories(title)')
        .single();

      if (error) {
        toast.error("Failed to save video: " + error.message);
        return;
      }

      setVideos(prev => [data, ...prev]);
      setTitle('');
      setVideoUrl('');
      setImageUrl('');
      toast.success(`Video "${payload.title}" added to playlist!`);
    } catch (err: any) {
      toast.error("Error saving video");
    } finally {
      setSavingVideo(false);
    }
  };

  const handleDeleteVideo = async (vidId: string, vidTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${vidTitle}" from your channel?`)) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', vidId);

      if (error) {
        toast.error("Failed to delete video: " + error.message);
        return;
      }

      setVideos(prev => prev.filter(v => v.id !== vidId));
      toast.success("Video deleted");
    } catch (err) {
      toast.error("Error deleting video");
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '20px',
    padding: '30px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  };

  const labelTextStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px' }}>Loading Video Dashboard...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1200px' }}>
      <div>
        <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>
          Video & Playlist Deployment
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>
          Create sliders on your channel by adding custom categories and inserting video feeds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '32px' }} className="flex-col-mobile">
        {/* Left Form: Add Video */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video size={20} color={accent} />
            Publish New Video
          </h3>

          <form onSubmit={handleCreateVideo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={labelStyle}>
              <span style={labelTextStyle}><Tag size={14} /> Video Title</span>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Live DJ Mix Summer 2026..."
                required
              />
            </div>

            <div style={labelStyle}>
              <span style={labelTextStyle}><Link size={14} /> Video Stream URL</span>
              <input
                type="url"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                style={inputStyle}
                placeholder="YouTube link (e.g. https://www.youtube.com/watch?v=...) or MP4 link"
                required
              />
            </div>

            <div style={labelStyle}>
              <span style={labelTextStyle}><Image size={14} /> Cover Image / Thumbnail URL</span>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                style={inputStyle}
                placeholder="https://... (Optional: leave blank for default image)"
              />
            </div>

            <div style={labelStyle}>
              <span style={labelTextStyle}><FolderPlus size={14} /> Assign to Category</span>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={savingVideo}
              style={{
                padding: '16px 32px',
                background: accent,
                color: '#fff',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                cursor: savingVideo ? 'not-allowed' : 'pointer',
                boxShadow: `0 8px 30px ${accent}44`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: savingVideo ? 0.7 : 1,
                alignSelf: 'flex-start',
                transition: 'all 0.2s',
              }}
            >
              <Plus size={18} />
              {savingVideo ? 'Publishing...' : 'Publish Video'}
            </button>
          </form>
        </div>

        {/* Right Form: Add Category */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '24px', alignSelf: 'start' }}>
          <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderPlus size={20} color={accent} />
            Create Category
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
            Creating a category enables a brand new horizontal slider on your homepage layout.
          </p>

          <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={labelStyle}>
              <span style={labelTextStyle}><Tag size={14} /> Category Name</span>
              <input
                type="text"
                value={newCategoryTitle}
                onChange={e => setNewCategoryTitle(e.target.value)}
                style={inputStyle}
                placeholder="e.g. Highlights, Studio Sets..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={savingCategory}
              style={{
                padding: '16px 32px',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontWeight: 'bold',
                borderRadius: '12px',
                fontSize: '15px',
                cursor: savingCategory ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: savingCategory ? 0.7 : 1,
                alignSelf: 'flex-start',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => { if(!savingCategory) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseOut={e => { if(!savingCategory) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              <Plus size={18} />
              {savingCategory ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>
      </div>

      {/* Videos List Grid */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Film size={20} color={accent} />
          Your Channel Videos ({videos.length})
        </h3>

        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No videos uploaded yet. Use the form above to deploy your first content slider.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {videos.map(vid => (
              <div
                key={vid.id}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Thumbnail */}
                  <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={vid.image_url}
                      alt={vid.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'; }}
                    />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.75)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', color: accent, border: `1px solid ${accent}44` }}>
                      {vid.categories?.title || 'Video'}
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div style={{ padding: '16px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '700', color: '#fff', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '42px' }}>
                      {vid.title}
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {vid.video_url}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.1)' }}>
                  <button
                    onClick={() => handleDeleteVideo(vid.id, vid.title)}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(255,59,48,0.08)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FF3B30',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: '700',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#FF3B30'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,59,48,0.08)'; e.currentTarget.style.color = '#FF3B30'; }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
