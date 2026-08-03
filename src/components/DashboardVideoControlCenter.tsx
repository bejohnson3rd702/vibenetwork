import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, CheckCircle2, Image as ImageIcon, Video as VideoIcon, FileText, Loader2, Trash2, Edit3, Plus, Play } from 'lucide-react';
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

export const DashboardVideoControlCenter: React.FC<DashboardVideoControlCenterProps> = ({
  whitelabelId = '100d0000-c08f-4260-8540-a0cc8bed4e01',
  accent = '#004e98',
  onVideoPublished
}) => {
  const [mode, setMode] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [transcript, setTranscript] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [videoFileUrl, setVideoFileUrl] = useState('');

  const [loadingYt, setLoadingYt] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [publishedVideos, setPublishedVideos] = useState<any[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  // Fetch all videos published to this network
  const fetchPublishedVideos = async () => {
    setLoadingVideos(true);
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('whitelabel_id', whitelabelId)
      .order('created_at', { ascending: false });

    if (data) {
      setPublishedVideos(data);
    }
    setLoadingVideos(false);
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

  // Upload video file to storage
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setErrorMsg('');
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `kple_videos/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadErr } = await supabase.storage.from('videos').upload(filePath, file);

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setVideoFileUrl(data.publicUrl);
      }
    } catch (err: any) {
      setErrorMsg('Failed to upload video file: ' + err.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  // Generate transcript draft
  const handleGenerateTranscriptDraft = () => {
    const draftTitle = title || 'Broadcast Episode';
    setTranscript(`[00:00] Welcome to ${draftTitle}\n[01:15] Key Scripture & Opening Prayer\n[04:30] Sermon Teaching & Message\n[09:00] Community Announcements & Benediction`);
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
      setErrorMsg(mode === 'youtube' ? 'Please provide a valid YouTube URL.' : 'Please upload a video file or enter a video URL.');
      return;
    }
    if (!coverImageUrl.trim()) {
      setErrorMsg('Please upload or provide a Box Cover Image.');
      return;
    }

    setPublishing(true);

    try {
      const { data, error } = await supabase.from('videos').insert({
        title: title.trim(),
        description: description.trim(),
        transcript: transcript.trim(),
        image_url: coverImageUrl.trim(),
        video_url: finalVideoUrl.trim(),
        whitelabel_id: whitelabelId,
        tags: ['KPLE-TV', mode === 'youtube' ? 'YouTube Import' : 'Uploaded Broadcast']
      }).select().single();

      if (error) throw error;

      setSuccessMsg('✨ Video successfully published to KPLE-TV Network!');
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
                  <input type="file" accept="video/*" onChange={handleVideoFileUpload} style={{ display: 'none' }} />
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

          {/* Transcript Editor & Draft Generator */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.85)' }}>
                Video Transcript (Timestamped)
              </label>

              <button
                type="button"
                onClick={handleGenerateTranscriptDraft}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '6px 14px',
                  borderRadius: '14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} style={{ color: accent }} />
                <span>✨ Generate Transcript Draft</span>
              </button>
            </div>

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
            {publishedVideos.map((vid) => (
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
                  justifyContent: 'space-between',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                  <div style={{ width: '100px', height: '60px', borderRadius: '10px', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                    <img src={vid.image_url} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>{vid.title}</h4>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {vid.description || 'No description provided'}
                    </p>
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
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardVideoControlCenter;
