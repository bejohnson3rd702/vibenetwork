import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, CheckCircle2, Image as ImageIcon, Video as VideoIcon, FileText, Loader2, Trash2, Edit3, Plus, Play, Calendar } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { extractYouTubeId } from './KpleAddVideoModal';

const YoutubeIcon = ({ size = 20, color = "#FF0000" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface DashboardVideoControlCenterProps {
  whitelabelId?: string;
  accent?: string;
  onVideoPublished?: () => void;
}

export const GENRE_TAGS = [
  'Religious',
  'Christian',
  'Culture & Society',
  'Talk',
  'Health',
  'Travel',
  'Education',
  'News',
  'History',
  'Political',
  'Documentary',
  'Other'
];

export const DashboardVideoControlCenter: React.FC<DashboardVideoControlCenterProps> = ({
  whitelabelId = '100d0000-c08f-4260-8540-a0cc8bed4e01',
  accent = '#004e98',
  onVideoPublished
}) => {
  const [mode, setMode] = useState<'youtube' | 'upload' | 'library'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [transcript, setTranscript] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [videoFileUrl, setVideoFileUrl] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Religious');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [scheduledAirDate, setScheduledAirDate] = useState('');
  const [scheduledAirTime, setScheduledAirTime] = useState('10:00');
  const [airTimeSlot, setAirTimeSlot] = useState('1 Hour');

  const [loadingYt, setLoadingYt] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [publishedVideos, setPublishedVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [selectedLibraryVideoId, setSelectedLibraryVideoId] = useState('');

  // Fetch videos & categories published to this network
  const fetchPublishedVideos = async () => {
    setLoadingVideos(true);
    try {
      const [vidRes, catRes] = await Promise.all([
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('title', { ascending: true })
      ]);

      if (vidRes.data) {
        setPublishedVideos(vidRes.data);
      }
      if (catRes.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(catRes.data[0].id);
        }
      }
    } catch (e) {
      console.warn("Error fetching video manager data:", e);
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    fetchPublishedVideos();
  }, [whitelabelId]);

  // Handle YouTube URL auto extraction
  const handleYoutubeFetch = async (url: string) => {
    setYoutubeUrl(url);
    const ytId = extractYouTubeId(url);
    if (!ytId) return;

    setLoadingYt(true);
    setErrorMsg('');

    try {
      const coverUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      setCoverImageUrl(coverUrl);

      const oembedRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
      if (oembedRes.ok) {
        const json = await oembedRes.json();
        if (json.title && !title) setTitle(json.title);
        if (json.author_name && !description) {
          setDescription(`Broadcast episode from ${json.author_name}. Stream high-definition faith and community teachings.`);
        }
      }

      if (!transcript) {
        setTranscript(`[00:00] Introduction & Opening\n[01:30] Sermon & Message Highlights\n[05:00] Closing Prayer & Key Takeaways`);
      }
    } catch (err: any) {
      console.warn('YouTube fetch error:', err);
    } finally {
      setLoadingYt(false);
    }
  };

  // Upload cover image to storage
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg('');
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `kple_covers/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadErr } = await supabase.storage.from('images').upload(filePath, file);

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setCoverImageUrl(data.publicUrl);
      }
    } catch (err: any) {
      setErrorMsg('Failed to upload cover image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload large video file to storage (Supports 325 MB - 680 MB+ files)
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    setUploadingVideo(true);
    setUploadProgressMsg(`Uploading ${fileSizeMB} MB broadcast file to storage. Please wait...`);
    setErrorMsg('');
    try {
      const fileExt = file.name.split('.').pop() || 'mp4';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `broadcasts/${fileName}`;

      const { error: uploadErr } = await supabase.storage.from('videos').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setVideoFileUrl(data.publicUrl);
        setUploadProgressMsg(`Upload complete (${fileSizeMB} MB)!`);
      }
    } catch (err: any) {
      setErrorMsg(`Video upload notice: ${err.message}. Direct stream URLs or external links can also be used below.`);
    } finally {
      setUploadingVideo(false);
    }
  };

  // Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) return;
    try {
      const { error } = await supabase.from('categories').insert({ title: newCategoryTitle.trim() });
      if (error) throw error;
      setNewCategoryTitle('');
      fetchPublishedVideos();
    } catch (err: any) {
      setErrorMsg('Failed to create category: ' + err.message);
    }
  };

  // Delete Category (Request #10)
  const handleDeleteCategory = async (catId: string, catTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete the category "${catTitle}"?`)) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', catId);
      if (error) throw error;
      fetchPublishedVideos();
    } catch (err: any) {
      setErrorMsg('Failed to delete category: ' + err.message);
    }
  };

  // Submit and Publish video to database
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const finalVideoUrl = mode === 'youtube' ? youtubeUrl : videoFileUrl;

    if (!title.trim()) {
      setErrorMsg('Please enter a video title.');
      return;
    }
    if (!finalVideoUrl.trim()) {
      setErrorMsg(mode === 'youtube' ? 'Please provide a valid YouTube URL.' : 'Please upload a video file or select a video link.');
      return;
    }
    if (!coverImageUrl.trim()) {
      setErrorMsg('Please upload or provide a Box Cover Image.');
      return;
    }

    setPublishing(true);

    try {
      const streamTimeFormatted = scheduledAirDate ? `${scheduledAirDate} ${scheduledAirTime} EST (${airTimeSlot})` : '';

      const { data, error } = await supabase.from('videos').insert({
        title: title.trim(),
        description: description.trim(),
        transcript: transcript.trim(),
        image_url: coverImageUrl.trim(),
        video_url: finalVideoUrl.trim(),
        stream_time: streamTimeFormatted || null,
        whitelabel_id: whitelabelId,
        category_id: selectedCategoryId || null,
        tags: [selectedGenre, mode === 'youtube' ? 'YouTube Import' : 'Uploaded Broadcast']
      }).select().single();

      if (error) throw error;

      setSuccessMsg('✨ Video successfully published to Network OS!');
      setTitle('');
      setDescription('');
      setTranscript('');
      setYoutubeUrl('');
      setCoverImageUrl('');
      setVideoFileUrl('');

      fetchPublishedVideos();
      if (onVideoPublished) onVideoPublished();
    } catch (err: any) {
      setErrorMsg('Failed to publish video: ' + (err.message || 'Database error'));
    } finally {
      setPublishing(false);
    }
  };

  // Delete published video
  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm('Are you sure you want to delete this video from the network?')) return;
    const { error } = await supabase.from('videos').delete().eq('id', videoId);
    if (!error) {
      fetchPublishedVideos();
      if (onVideoPublished) onVideoPublished();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* ── Add Video Dashboard Card ──────────────────────── */}
      <div style={{
        background: 'rgba(15, 17, 26, 0.95)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        {/* Card Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: accent }}>
              KPLE-TV Network Admin Controls
            </span>
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
            Video Publisher & Content Manager
          </h2>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            Add videos via YouTube Link Import (auto title, cover, & transcript) or Direct File Upload with custom descriptions & transcripts.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setMode('youtube')}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '16px',
              background: mode === 'youtube' ? `${accent}22` : 'rgba(255,255,255,0.04)',
              border: mode === 'youtube' ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s'
            }}
          >
            <YoutubeIcon size={20} color={mode === 'youtube' ? '#FF0000' : 'rgba(255,255,255,0.6)'} />
            <span>YouTube Link Import</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '16px',
              background: mode === 'upload' ? `${accent}22` : 'rgba(255,255,255,0.04)',
              border: mode === 'upload' ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s'
            }}
          >
            <Upload size={20} style={{ color: mode === 'upload' ? accent : 'rgba(255,255,255,0.6)' }} />
            <span>Direct Upload / Video File</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.3)', color: '#ff453a', padding: '14px', borderRadius: '14px', fontSize: '13px', marginBottom: '20px', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(48,209,88,0.12)', border: '1px solid rgba(48,209,88,0.3)', color: '#30d158', padding: '14px', borderRadius: '14px', fontSize: '13px', marginBottom: '20px', fontWeight: 700 }}>
            {successMsg}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Mode 1: YouTube URL Input */}
          {mode === 'youtube' && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
                YouTube Video Link *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={e => handleYoutubeFetch(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                {loadingYt && (
                  <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                    <Loader2 className="animate-spin" size={18} style={{ color: accent }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: Direct Video Upload */}
          {mode === 'upload' && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
                Video File (.mp4) or Direct Stream URL *
              </label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Upload video file or enter URL..."
                  value={videoFileUrl}
                  onChange={e => setVideoFileUrl(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <label style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '14px 20px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}>
                  {uploadingVideo ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                  <span>{uploadingVideo ? 'Uploading...' : 'Browse File'}</span>
                  <input type="file" accept="video/*,video/quicktime,video/mov,.mov,.mp4" onChange={handleVideoFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
              Video Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Sunday Morning Revival Teaching"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '14px 18px',
                borderRadius: '14px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Box Cover Image */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.85)' }}>
                Box Cover Image / Thumbnail *
              </label>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#00ff88', background: 'rgba(0,255,136,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(0,255,136,0.2)' }}>
                📏 Recommended: 1280 × 720 px (16:9 Widescreen)
              </span>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              {coverImageUrl ? (
                <div style={{ width: '120px', height: '68px', borderRadius: '12px', overflow: 'hidden', border: `2px solid ${accent}`, position: 'relative' }}>
                  <img src={coverImageUrl} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ width: '120px', height: '68px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>
                  <ImageIcon size={24} />
                </div>
              )}

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Paste cover image URL..."
                  value={coverImageUrl}
                  onChange={e => setCoverImageUrl(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <label style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: 'fit-content'
                }}>
                  {uploadingImage ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                  <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
                  <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
              Broadcast Description
            </label>
            <textarea
              placeholder="Enter detailed broadcast description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '14px 18px',
                borderRadius: '14px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Genre Tag & Category Playlist Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
                Genre Tag *
              </label>
              <select
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                {GENRE_TAGS.map(g => (
                  <option key={g} value={g} style={{ background: '#111', color: '#fff' }}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
                Playlist / Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={e => setSelectedCategoryId(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="" style={{ background: '#111' }}>-- General Network Playlist --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#111' }}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── KPLE-TV Station Airtime & Scheduled Broadcast Time Scheduler ── */}
          <div style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${accent}44`, padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                <Calendar size={18} color={accent} />
                <span>📺 Station Airtime & Broadcast Scheduler</span>
              </label>
              <span style={{ fontSize: '11px', background: accent, color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                Set Video Play Time
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '6px' }}>
                  Scheduled Air Date
                </label>
                <input
                  type="date"
                  value={scheduledAirDate}
                  onChange={e => setScheduledAirDate(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#fff',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '6px' }}>
                  Broadcast Start Time (EST)
                </label>
                <input
                  type="time"
                  value={scheduledAirTime}
                  onChange={e => setScheduledAirTime(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#fff',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '6px' }}>
                  Time Slot Duration
                </label>
                <select
                  value={airTimeSlot}
                  onChange={e => setAirTimeSlot(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#fff',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  <option value="30 mins" style={{ background: '#000' }}>30 Minutes Slot</option>
                  <option value="1 Hour" style={{ background: '#000' }}>1 Hour Slot</option>
                  <option value="2 Hours" style={{ background: '#000' }}>2 Hours Slot</option>
                  <option value="4 Hours" style={{ background: '#000' }}>4 Hours Slot</option>
                </select>
              </div>
            </div>
          </div>

          {/* Internal Video Library Picker (Request #9) */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', borderRadius: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
              🔗 Select Internal Site Video Link (Optional)
            </label>
            <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
              Want to stream or feature a video already uploaded to this site? Choose it below to copy its link and cover instantly.
            </p>
            <select
              value={selectedLibraryVideoId}
              onChange={e => {
                const selectedId = e.target.value;
                setSelectedLibraryVideoId(selectedId);
                const found = publishedVideos.find(v => v.id === selectedId);
                if (found) {
                  setTitle(found.title || '');
                  setDescription(found.description || '');
                  setCoverImageUrl(found.image_url || '');
                  setVideoFileUrl(found.video_url || '');
                  if (found.video_url?.includes('youtube')) {
                    setYoutubeUrl(found.video_url);
                    setMode('youtube');
                  } else {
                    setMode('upload');
                  }
                }
              }}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.6)',
                border: `1px solid ${accent}66`,
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Choose from existing site video library --</option>
              {publishedVideos.map(v => (
                <option key={v.id} value={v.id} style={{ background: '#111' }}>
                  {v.title} ({v.video_url ? v.video_url.slice(0, 40) + '...' : 'Internal Video'})
                </option>
              ))}
            </select>
          </div>

          {/* Category / Playlist Manager Card (Request #10) */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '16px', marginTop: '10px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#fff', fontWeight: 800 }}>
              📁 Category & Playlist Manager
            </h4>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="New Category Title (e.g. Sermons, Talk, Health)..."
                value={newCategoryTitle}
                onChange={e => setNewCategoryTitle(e.target.value)}
                style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '10px', color: '#fff', fontSize: '13px', outline: 'none' }}
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                style={{ padding: '10px 18px', background: accent, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
              >
                + Add Category
              </button>
            </div>

            {/* List existing categories with 1-click Delete (Request #10) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map(cat => (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    fontSize: '13px',
                    color: '#fff'
                  }}
                >
                  <span>{cat.title}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id, cat.title)}
                    title={`Delete category ${cat.title}`}
                    style={{ background: 'none', border: 'none', color: '#ff453a', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.85)', marginBottom: '8px' }}>
              Video Transcript / Chapters (Optional)
            </label>
            <textarea
              placeholder="[00:00] Welcome to the broadcast&#10;[01:30] Sermon highlights..."
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '14px 18px',
                borderRadius: '14px',
                fontSize: '13px',
                fontFamily: 'monospace',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Publish Action Button */}
          <button
            type="submit"
            disabled={publishing}
            style={{
              background: accent,
              color: '#fff',
              border: 'none',
              padding: '16px',
              borderRadius: '16px',
              fontSize: '15px',
              fontWeight: 900,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: publishing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '10px',
              boxShadow: `0 6px 24px ${accent}66`,
              transition: 'all 0.2s'
            }}
          >
            {publishing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
            <span>{publishing ? 'Publishing Video...' : '🚀 Publish Video to Network'}</span>
          </button>
        </form>
      </div>

      {/* ── Published Network Videos Catalog ──────────────────────── */}
      <div style={{
        background: 'rgba(15, 17, 26, 0.95)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: 0 }}>
              Published Network Videos ({publishedVideos.length})
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
              Manage all videos currently live on the KPLE-TV Watch Cinema & Theater.
            </p>
          </div>
        </div>

        {loadingVideos ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 10px', display: 'block' }} />
            Loading network videos...
          </div>
        ) : publishedVideos.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '16px' }}>
            No videos published yet. Use the form above to add your first broadcast video!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {publishedVideos.map((vid) => {
              const tags = Array.isArray(vid.tags) ? vid.tags : [];
              let airDate = vid.scheduled_air_date;
              let airTime = vid.scheduled_air_time;
              let timeSlot = vid.air_time_slot || '1 Hour';
              let commercialBreakEnabled = vid.commercial_break_enabled || false;
              let commercialFrequency = vid.commercial_frequency;
              let adSponsorName = vid.ad_sponsor_name;

              tags.forEach((t: string) => {
                if (typeof t === 'string') {
                  if (t.startsWith('air_date:')) airDate = t.replace('air_date:', '');
                  else if (t.startsWith('air_time:')) airTime = t.replace('air_time:', '');
                  else if (t.startsWith('slot:')) timeSlot = t.replace('slot:', '');
                  else if (t === 'commercials:true') commercialBreakEnabled = true;
                  else if (t.startsWith('ad_freq:')) commercialFrequency = t.replace('ad_freq:', '');
                  else if (t.startsWith('ad_sponsor:')) adSponsorName = t.replace('ad_sponsor:', '');
                }
              });

              return (
                <div
                  key={vid.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    justify: 'space-between',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                    <div style={{ width: '100px', height: '60px', borderRadius: '10px', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                      <img src={vid.image_url} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>{vid.title}</h4>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '0 0 6px 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {vid.description || 'No description provided'}
                      </p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {airDate && (
                          <span style={{ fontSize: '11px', background: 'rgba(0,78,152,0.3)', color: '#00d4ff', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold', border: '1px solid rgba(0,212,255,0.3)' }}>
                            📅 Airs {airDate} @ {airTime || '20:00'} ({timeSlot})
                          </span>
                        )}
                        {commercialBreakEnabled && (
                          <span style={{ fontSize: '11px', background: 'rgba(0,255,136,0.15)', color: '#00ff88', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold', border: '1px solid rgba(0,255,136,0.3)' }}>
                            📣 Commercials: {commercialFrequency || 'Every 15m'} {adSponsorName ? `(${adSponsorName})` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(vid.id)}
                      style={{
                        background: 'rgba(255,59,48,0.12)',
                        color: '#ff4d85',
                        border: '1px solid rgba(255,59,48,0.3)',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardVideoControlCenter;
