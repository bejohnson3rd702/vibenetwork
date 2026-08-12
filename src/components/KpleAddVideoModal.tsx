import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Sparkles, CheckCircle2, Image as ImageIcon, Video as VideoIcon, FileText, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

const YoutubeIcon = ({ size = 20, color = "#FF0000" }: { size?: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface KpleAddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  accent?: string;
  onVideoAdded?: (newVid: any) => void;
  whitelabelId?: string;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const KpleAddVideoModal: React.FC<KpleAddVideoModalProps> = ({
  isOpen,
  onClose,
  accent = '#004e98',
  onVideoAdded,
  whitelabelId = '100d0000-c08f-4260-8540-a0cc8bed4e01'
}) => {
  const [mode, setMode] = useState<'youtube' | 'upload'>('youtube');

  // YouTube Mode State
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [fetchingYt, setFetchingYt] = useState(false);

  // Common Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [transcript, setTranscript] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('KPLE-TV, Ministry');

  // File Upload State
  const [directVideoUrl, setDirectVideoUrl] = useState('');
  const [uploadingVideoFile, setUploadingVideoFile] = useState(false);
  const [uploadingCoverFile, setUploadingCoverFile] = useState(false);

  // Status & Saving State
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Station Broadcast Airtime Scheduling State
  const [scheduledAirDate, setScheduledAirDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduledAirTime, setScheduledAirTime] = useState('20:00');
  const [airTimeSlot, setAirTimeSlot] = useState('1 Hour');
  const [recurrence, setRecurrence] = useState('Once');

  // Commercial & Ad Break State
  const [enableCommercials, setEnableCommercials] = useState(false);
  const [commercialFrequency, setCommercialFrequency] = useState('Every 15 Minutes');
  const [commercialMediaUrl, setCommercialMediaUrl] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [duration, setDuration] = useState('30 mins');
  const [uploadingCommercialFile, setUploadingCommercialFile] = useState(false);

  // ── Handle Commercial File Upload ─────────────────────────────────────
  const handleCommercialFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCommercialFile(true);
    setErrorMsg('');

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `kple_commercials/ad_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { error: uploadError } = await supabase!.storage.from('videos').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase!.storage.from('videos').getPublicUrl(filePath);
      setCommercialMediaUrl(data.publicUrl);
      setSuccessMsg('✅ Commercial video clip uploaded!');
    } catch (err: any) {
      console.error('Commercial upload failed:', err);
      setErrorMsg('Failed to upload commercial clip: ' + (err.message || 'Storage error'));
    } finally {
      setUploadingCommercialFile(false);
    }
  };

  // ── Auto-fetch YouTube Video Data ──────────────────────────────────────
  const handleFetchYouTubeData = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || youtubeUrl;
    const ytId = extractYouTubeId(targetUrl);
    if (!ytId) {
      setErrorMsg('Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)');
      return;
    }

    setErrorMsg('');
    setFetchingYt(true);

    try {
      // 1. Auto Cover Image (Thumbnail)
      const thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      setCoverImage(thumbnail);

      // 2. Fetch oEmbed metadata (Title & Description)
      const oembedRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
      if (oembedRes.ok) {
        const data = await oembedRes.json();
        if (data.title && !title) {
          setTitle(data.title);
        }
        if (data.author_name && !description) {
          setDescription(`Broadcasted by ${data.author_name}. Shared on KPLE-TV Network.`);
        }
      }

      // 3. Auto-generate initial timestamped Transcript template
      const fetchedTitle = title || 'YouTube Broadcast Episode';
      const autoTranscript = `[00:00] Introduction & Welcome to KPLE-TV
[01:15] Opening Prayer & Scripture Reading
[03:40] Main Sermon & Message: ${fetchedTitle}
[12:30] Key Life Applications & Reflection
[18:00] Closing Prayer & Blessing`;
      
      if (!transcript) {
        setTranscript(autoTranscript);
      }

      setSuccessMsg('✅ YouTube details, cover image, and transcript template loaded!');
    } catch (err: any) {
      console.warn('YouTube fetch error:', err);
      // Fallback cover image
      setCoverImage(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
    } finally {
      setFetchingYt(false);
    }
  };

  // ── Handle Video File Upload ──────────────────────────────────────────
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideoFile(true);
    setErrorMsg('');

    // Auto-detect runtime duration using temporary video element
    try {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.onloadedmetadata = () => {
        window.URL.revokeObjectURL(tempVideo.src);
        const durationSec = Math.round(tempVideo.duration);
        if (durationSec && !isNaN(durationSec)) {
          const hrs = Math.floor(durationSec / 3600);
          const mins = Math.floor((durationSec % 3600) / 60);
          const secs = durationSec % 60;
          const formattedDuration = hrs > 0 
            ? `${hrs}h ${mins}m` 
            : `${mins}:${secs < 10 ? '0' : ''}${secs}`;
          setDuration(formattedDuration);
        }
      };
      tempVideo.src = URL.createObjectURL(file);
    } catch (detErr) {
      console.warn("Could not auto-detect video duration:", detErr);
    }

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `kple_videos/video_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { error: uploadError } = await supabase!.storage.from('videos').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase!.storage.from('videos').getPublicUrl(filePath);
      setDirectVideoUrl(data.publicUrl);
      setSuccessMsg('✅ Video file uploaded successfully!');
    } catch (err: any) {
      console.error('Video upload failed:', err);
      setErrorMsg('Failed to upload video file: ' + (err.message || 'Storage error'));
    } finally {
      setUploadingVideoFile(false);
    }
  };

  // ── Handle Cover Image Upload ──────────────────────────────────────────
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCoverFile(true);
    setErrorMsg('');

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `kple_covers/cover_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { error: uploadError } = await supabase!.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase!.storage.from('images').getPublicUrl(filePath);
      setCoverImage(data.publicUrl);
      setSuccessMsg('✅ Cover image uploaded successfully!');
    } catch (err: any) {
      console.error('Cover image upload failed:', err);
      setErrorMsg('Failed to upload cover image: ' + (err.message || 'Storage error'));
    } finally {
      setUploadingCoverFile(false);
    }
  };

  // ── Generate AI Transcript Helper ────────────────────────────────────
  const handleCreateTranscriptDraft = () => {
    const videoTitle = title.trim() || 'KPLE-TV Special Broadcast';
    const descExcerpt = description.trim() ? description.slice(0, 120) + '...' : 'In-depth message and teaching.';
    
    const draft = `[00:00] Welcome & Introduction - KPLE-TV Network
[00:45] Opening Reflection: ${videoTitle}
[02:15] Key Scripture & Teaching: ${descExcerpt}
[08:30] In-Depth Discussion & Testimonial
[15:00] Closing Prayer & Announcements`;

    setTranscript(draft);
    setSuccessMsg('✨ Created structured transcript draft!');
  };

  // ── Save Video to Supabase ───────────────────────────────────────────
  const handleSaveVideo = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    let finalVideoUrl = '';

    if (mode === 'youtube') {
      const ytId = extractYouTubeId(youtubeUrl);
      if (!ytId) {
        setErrorMsg('Please provide a valid YouTube Video URL');
        return;
      }
      finalVideoUrl = `https://www.youtube.com/watch?v=${ytId}`;
    } else {
      if (!directVideoUrl.trim()) {
        setErrorMsg('Please upload a video file or enter a valid video URL');
        return;
      }
      finalVideoUrl = directVideoUrl.trim();
    }

    if (!title.trim()) {
      setErrorMsg('Please enter a Video Title');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please enter a Video Description');
      return;
    }

    if (!coverImage.trim()) {
      setErrorMsg('Please upload or provide a Box Cover Image URL');
      return;
    }

    setSaving(true);

    try {
      const { data: userSession } = await supabase!.auth.getSession();
      const currentUserId = userSession?.session?.user?.id || '5d54709a-969e-4fca-a745-118af5cc501d';

      const tagArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const scheduleTags = [
        ...tagArray,
        `air_date:${scheduledAirDate}`,
        `air_time:${scheduledAirTime}`,
        `slot:${airTimeSlot}`,
        `recurrence:${recurrence}`,
        ...(enableCommercials ? [
          `commercials:true`,
          `ad_freq:${commercialFrequency}`,
          `ad_url:${commercialMediaUrl}`,
          `ad_sponsor:${sponsorName}`
        ] : [])
      ];

      const videoPayload = {
        title: title.trim(),
        description: description.trim(),
        transcript: transcript.trim(),
        image_url: coverImage.trim(),
        video_url: finalVideoUrl,
        whitelabel_id: whitelabelId,
        creator_id: currentUserId,
        tags: scheduleTags,
        created_at: new Date().toISOString()
      };

      const { data: insertedVideo, error: insertError } = await supabase!
        .from('videos')
        .insert(videoPayload)
        .select()
        .single();

      if (insertError) throw insertError;

      setSuccessMsg('🎉 Video successfully added to KPLE-TV Network!');
      
      if (onVideoAdded && insertedVideo) {
        onVideoAdded(insertedVideo);
      }

      // Reset form after short delay and close
      setTimeout(() => {
        setYoutubeUrl('');
        setTitle('');
        setDescription('');
        setTranscript('');
        setCoverImage('');
        setDirectVideoUrl('');
        setSuccessMsg('');
        onClose();
      }, 1200);

    } catch (err: any) {
      console.error('Failed to save video:', err);
      setErrorMsg('Failed to save video to network: ' + (err.message || 'Database error'));
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(20px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '24px'
        }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '900px',
            maxHeight: '92vh',
            background: '#0d0e15',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.9)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: accent }}>
                KPLE-TV Network Video Publisher
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '4px 0 0', letterSpacing: '-0.5px' }}>
                Add New Video to KPLE Network
              </h2>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ padding: '20px 32px 0 32px', display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { setMode('youtube'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '16px',
                border: mode === 'youtube' ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.1)',
                background: mode === 'youtube' ? 'rgba(0, 78, 152, 0.25)' : 'rgba(255,255,255,0.03)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
            >
              <YoutubeIcon size={20} color={mode === 'youtube' ? '#FF0000' : 'rgba(255,255,255,0.6)'} />
              <span>Import YouTube Link</span>
            </button>

            <button
              onClick={() => { setMode('upload'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '16px',
                border: mode === 'upload' ? `2px solid ${accent}` : '1px solid rgba(255,255,255,0.1)',
                background: mode === 'upload' ? 'rgba(0, 78, 152, 0.25)' : 'rgba(255,255,255,0.03)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
            >
              <Upload size={20} style={{ color: mode === 'upload' ? accent : 'rgba(255,255,255,0.6)' }} />
              <span>Direct Video Upload</span>
            </button>
          </div>

          {/* Form Content Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 32px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {errorMsg && (
              <div style={{ background: 'rgba(255, 59, 48, 0.15)', border: '1px solid rgba(255, 59, 48, 0.3)', color: '#ff453a', padding: '12px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ background: 'rgba(48, 209, 88, 0.15)', border: '1px solid rgba(48, 209, 88, 0.3)', color: '#30d158', padding: '12px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>
                {successMsg}
              </div>
            )}

            {/* ── MODE 1: YOUTUBE LINK IMPORT ────────────────────────── */}
            {mode === 'youtube' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block' }}>
                  YouTube Video Link <span style={{ color: '#ff453a' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={e => {
                      setYoutubeUrl(e.target.value);
                      if (extractYouTubeId(e.target.value)) {
                        handleFetchYouTubeData(e.target.value);
                      }
                    }}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#fff',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => handleFetchYouTubeData()}
                    disabled={fetchingYt || !youtubeUrl.trim()}
                    style={{
                      background: accent,
                      color: '#fff',
                      border: 'none',
                      padding: '0 20px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: fetchingYt ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {fetchingYt ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    <span>Fetch Details</span>
                  </button>
                </div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Entering a YouTube link will automatically extract the video title, description, cover image thumbnail, and transcript template.
                </span>
              </div>
            )}

            {/* ── MODE 2: DIRECT VIDEO UPLOAD ────────────────────────── */}
            {mode === 'upload' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block' }}>
                  Video Source (Upload File or Enter Direct URL) <span style={{ color: '#ff453a' }}>*</span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* File Upload Box */}
                  <label style={{
                    border: '2px dashed rgba(255,255,255,0.18)',
                    borderRadius: '14px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.03)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <VideoIcon size={28} style={{ color: accent }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                      {uploadingVideoFile ? 'Uploading Video...' : directVideoUrl ? 'Video Uploaded ✓' : 'Upload Video File (.mp4)'}
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Click to browse computer</span>
                    <input type="file" accept="video/*,video/quicktime,video/mov,.mov,.mp4" onChange={handleVideoFileUpload} style={{ display: 'none' }} />
                  </label>

                  {/* Direct URL input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Or Direct Video URL:</span>
                    <input
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      value={directVideoUrl}
                      onChange={e => setDirectVideoUrl(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── COMMON FIELDS: TITLE & TAGS ────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                  Video Title <span style={{ color: '#ff453a' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sunday Morning Sermon & Teaching"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="KPLE-TV, Sermon, Faith"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* ── DESCRIPTION FIELD ─────────────────────────────────── */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                Video Description <span style={{ color: '#ff453a' }}>*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Provide a detailed description of the broadcast..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* ── BOX COVER IMAGE FIELD ──────────────────────────────── */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                Box Cover Image <span style={{ color: '#ff453a' }}>*</span>
              </label>
              
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center' }}>
                {/* Preview */}
                <div style={{
                  width: '120px',
                  height: '68px',
                  borderRadius: '10px',
                  background: '#000',
                  border: '1px solid rgba(255,255,255,0.2)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  {coverImage ? (
                    <img src={coverImage} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={24} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="url"
                      placeholder="Image URL (e.g. https://img.youtube.com/...)"
                      value={coverImage}
                      onChange={e => setCoverImage(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                    <label style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}>
                      <Upload size={14} />
                      <span>{uploadingCoverFile ? 'Uploading...' : 'Upload Image'}</span>
                      <input type="file" accept="image/*" onChange={handleCoverFileUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* ── TV STATION BROADCAST AIRTIME SCHEDULER ───────────── */}
            <div style={{ background: 'rgba(0, 78, 152, 0.15)', border: '1px solid rgba(0, 78, 152, 0.35)', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '14px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📺 KPLE-TV Station Airtime Scheduler</span>
                </label>
                <span style={{ fontSize: '11px', background: accent, color: '#fff', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  Station Airtime Controls
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
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
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '6px' }}>
                    Airtime (EST)
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
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '6px' }}>
                    Time Slot
                  </label>
                  <select
                    value={airTimeSlot}
                    onChange={e => setAirTimeSlot(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#fff',
                      padding: '10px 12px',
                      borderRadius: '10px',
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

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'block', marginBottom: '6px' }}>
                    Recurrence
                  </label>
                  <select
                    value={recurrence}
                    onChange={e => setRecurrence(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#fff',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Once" style={{ background: '#000' }}>Once (Single)</option>
                    <option value="Daily" style={{ background: '#000' }}>Daily Broadcast</option>
                    <option value="Weekly Sunday Service" style={{ background: '#000' }}>Weekly Sunday</option>
                    <option value="Weekly Midweek" style={{ background: '#000' }}>Weekly Midweek</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── COMMERCIAL & AD BREAK MANAGER ─────────────────────── */}
            <div style={{ background: enableCommercials ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255,255,255,0.02)', border: enableCommercials ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '14px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={enableCommercials}
                    onChange={e => setEnableCommercials(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#00ff88', cursor: 'pointer' }}
                  />
                  <span>📣 Enable Commercial Ad Breaks & Sponsor Overlays</span>
                </label>
                <span style={{ fontSize: '11px', color: enableCommercials ? '#00ff88' : 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
                  {enableCommercials ? 'Ad Breaks Active' : 'Off (Default)'}
                </span>
              </div>

              {enableCommercials && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Commercial Frequency
                      </label>
                      <select
                        value={commercialFrequency}
                        onChange={e => setCommercialFrequency(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.18)',
                          color: '#fff',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Every 15 Minutes" style={{ background: '#000' }}>Every 15 Minutes</option>
                        <option value="Pre-Roll & Post-Roll" style={{ background: '#000' }}>Pre-Roll & Post-Roll</option>
                        <option value="Mid-Roll (50%)" style={{ background: '#000' }}>Mid-Roll at 50% Runtime</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                        Sponsor / Advertiser Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kingdom Media Partners"
                        value={sponsorName}
                        onChange={e => setSponsorName(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.18)',
                          color: '#fff',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                      Commercial Video Clip (File Upload or Direct URL)
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="url"
                        placeholder="Commercial Clip URL (e.g. https://example.com/ad.mp4)"
                        value={commercialMediaUrl}
                        onChange={e => setCommercialMediaUrl(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.18)',
                          color: '#fff',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                      <label style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                      }}>
                        <Upload size={14} />
                        <span>{uploadingCommercialFile ? 'Uploading...' : 'Upload Ad Clip'}</span>
                        <input type="file" accept="video/*" onChange={handleCommercialFileUpload} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── TRANSCRIPT EDITOR FIELD ("we will create the transcript") ── */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} style={{ color: accent }} />
                  <span>Video Transcript Editor</span>
                </label>

                <button
                  type="button"
                  onClick={handleCreateTranscriptDraft}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = accent}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  <Sparkles size={14} />
                  <span>✨ Create Transcript Draft</span>
                </button>
              </div>

              <textarea
                rows={5}
                placeholder="[00:00] Enter transcript text, timestamps, or sermon notes here..."
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  fontFamily: 'monospace',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{
            padding: '20px 32px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justify: 'flex-end',
            gap: '12px',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSaveVideo}
              disabled={saving}
              style={{
                background: accent,
                color: '#fff',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: `0 4px 20px ${accent}66`
              }}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              <span>{saving ? 'Publishing to KPLE...' : 'Publish Video to KPLE-TV'}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default KpleAddVideoModal;
