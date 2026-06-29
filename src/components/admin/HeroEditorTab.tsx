import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useToast } from '../../context/ToastContext';
import { processAndEnhanceImage } from '../../lib/imageProcessor';
import { AiTextArea, AiInput } from './AiComponents';
import { DictationButton } from '../DictationButton';
import { moderateVideoContent } from '../../lib/videoModerator';
import { VideoModerationScanner } from './VideoModerationScanner';
import { isOlympianConfig, isB2kConfig, isKpleConfig } from '../../lib/whitelabel';
import { ASSETS } from '../../data';

export const HeroEditorTab = ({ wlConfig }: { wlConfig: any }) => {
  const toast = useToast();
  const [heroCopy, setHeroCopy] = useState(wlConfig?.theme?.heroCopy || wlConfig?.heroCopy || '');
  const [heroTitle, setHeroTitle] = useState(wlConfig?.theme?.heroTitle || wlConfig?.name || '');
  const [heroLayoutMode, setHeroLayoutMode] = useState<'verbiage' | 'video' | 'slider'>(wlConfig?.theme?.heroLayoutMode || wlConfig?.heroLayoutMode || 'verbiage');
  const [heroVideoUrl, setHeroVideoUrl] = useState(wlConfig?.theme?.heroVideoUrl || wlConfig?.heroVideoUrl || '');
  const [heroVideoTitle, setHeroVideoTitle] = useState(wlConfig?.theme?.heroVideoTitle || wlConfig?.heroVideoTitle || '');
  const [heroImage, setHeroImage] = useState(wlConfig?.theme?.heroImage || wlConfig?.heroImage || ASSETS.heroMain || '');
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const getInitialSlider = () => {
    if (wlConfig?.theme?.heroSlider && wlConfig.theme.heroSlider.length > 0) {
      return wlConfig.theme.heroSlider;
    }
    
    const isOlympian = isOlympianConfig(wlConfig);
    const isB2k = isB2kConfig(wlConfig);
    const isKple = isKpleConfig(wlConfig);
    const isVibe100 = wlConfig?.name?.toLowerCase().includes('vibe 100') || wlConfig?.domain?.toLowerCase().includes('vibe100');
    const isVibe = wlConfig?.id === 'master' || wlConfig?.domain?.includes('vibenetwork.tv') || wlConfig?.domain?.includes('vibenetwork.com');

    if (isVibe) {
      return [
        {
          id: 'vibe-1',
          title: 'Entertainment',
          short: 'Entertainment',
          subtitle: 'LATEST LIVE SETS & SHOWS',
          copy: 'Experience top DJ sets, live concerts, and exclusive music releases streaming 24/7 on the network.',
          imageUrl: '/n2n/vibe_entertainment.png',
          videoUrl: ''
        },
        {
          id: 'vibe-2',
          title: 'News',
          short: 'News',
          subtitle: 'GLOBAL REPORTS & UPDATES',
          copy: 'Get real-time updates, deep-dive investigative journalism, and breaking stories from around the globe.',
          imageUrl: '/n2n/vibe_newsroom.png',
          videoUrl: ''
        },
        {
          id: 'vibe-3',
          title: 'Sports',
          short: 'Sports',
          subtitle: 'LIVE ACTION & EXPERT ANALYSIS',
          copy: 'Catch game highlights, athlete interviews, and live coverage of collegiate and professional sports.',
          imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200',
          videoUrl: ''
        },
        {
          id: 'vibe-4',
          title: 'Money',
          short: 'Money',
          subtitle: 'FINANCIAL INSIGHTS & MARKETS',
          copy: 'Stay ahead with market analytics, personal finance tips, and investment strategies from leading experts.',
          imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
          videoUrl: ''
        }
      ];
    }

    if (isOlympian) {
      return [
        { id: 'olympia-1', title: 'Olympia Finals', short: 'Finals', subtitle: 'The Sandow Trophy', copy: 'Watch the historic battle of the titans live from Las Vegas. Witness bodybuilding history.', imageUrl: '/n2n/mr_olympia_hero.png', videoUrl: 'https://mrolympia.com/weekend-schedule' },
        { id: 'olympia-2', title: 'Meet the Olympians', short: 'Expo & Fan Experience', subtitle: 'Expo Weekend', copy: 'Connect with legendary fitness icons, explore world-class brands, and discover new supplements.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1500', videoUrl: 'https://mrolympia.com/weekend-schedule' },
        { id: 'olympia-3', title: 'Press Conference', short: 'Press Conf.', subtitle: 'Face‑offs & Predictions', copy: 'Hear from the world\'s best athletes as they face off before taking the stage.', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1500', videoUrl: 'https://mrolympia.com/weekend-schedule' }
      ];
    }
    if (isB2k) {
      return [
        { id: 'b2k-1', title: 'The Millennium Tour', short: 'Boys 4 Life Tour', subtitle: '25th Anniversary Reunion', copy: 'B2K and Bow Wow live, featuring Jeremih, Pretty Ricky, Amerie, and more. Celebrate 25 years of the boy band legacy.', imageUrl: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-5-1557518926.jpg', videoUrl: 'https://b2kofficial.com/tour' },
        { id: 'b2k-2', title: 'New Studio Album', short: 'New Album', subtitle: 'First Album in Over 20 Years', copy: 'Pre-order the new Boys 4 Life album, capturing the classic B2K R&B harmonies and modern beats.', imageUrl: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-6-1557518986-e1660607966438.jpg', videoUrl: '/shop' },
        { id: 'b2k-3', title: 'B2K Members', short: 'The Members', subtitle: 'Omarion, Lil Fizz, J-Boog & Raz-B', copy: 'Explore individual child networks to get exclusive updates, behind-the-scenes content, and solo releases from all four members.', imageUrl: 'https://www.vibe.com/wp-content/uploads/2019/05/B2K-vibe-magazine-digital-cover-1557942120.jpg', videoUrl: '#child-networks-slider' }
      ];
    }
    if (isKple) {
      return [
        { id: 'kple-1', title: 'TCT Network', short: 'TCT', subtitle: 'Share the Word of God', copy: 'TCT Network provides quality Christian television programming 24 hours a day, featuring teaching, music, and ministries.', imageUrl: '/n2n/kple_hero_tct.png', videoUrl: '/?tenant=05b1ac75-a8ed-42d2-a147-c139f389cc35' },
        { id: 'kple-2', title: 'Smile of a Child', short: 'Smile', subtitle: 'Faith-filled Children', copy: 'Inspiring children with faith-filled programs, cartoon series, Bible lessons, and positive, educational entertainment.', imageUrl: '/n2n/kple_hero_smile.png', videoUrl: '/?tenant=ffa6fa1b-9597-4734-a086-32b113959c8a' },
        { id: 'kple-3', title: 'Positiv', short: 'Positiv', subtitle: 'Family Movies & Stories', copy: 'Good stories and positive family-friendly movies that inspire hope, encourage values, and bring families together.', imageUrl: '/n2n/kple_hero_positiv.png', videoUrl: '/?tenant=3de7bfde-e4e4-4d80-88ca-9f4724bd0c85' },
        { id: 'kple-4', title: 'The Walk TV', short: 'The Walk', subtitle: 'Christian Lifestyle', copy: 'Walk in faith every day with practical Christian living programming, outdoor shows, talk programs, and ministry feeds.', imageUrl: '/n2n/kple_hero_thewalk.png', videoUrl: '/?tenant=273a7d16-0533-4a98-92cb-62ad90f08ffa' },
        { id: 'kple-5', title: 'Enlace USA', short: 'Enlace', subtitle: 'Inspirando tu Vida', copy: 'Programación en español de alta calidad que transmite esperanza, fe y valores para la comunidad hispana en EE.UU.', imageUrl: '/n2n/kple_hero_enlace.png', videoUrl: '/?tenant=5699e417-4b64-4a95-90e2-f813223fdd32' },
        { id: 'kple-6', title: 'Attention Central Texas', short: 'ACT', subtitle: 'Local Community News', copy: 'Christian Revival Network\'s flagship local program featuring interviews from local churches, non-profit organizations, and community events.', imageUrl: '/n2n/kple_hero_act.png', videoUrl: '/?tenant=0421af68-56cb-4735-b7ee-f72454963bdd' }
      ];
    }
    if (isVibe100) {
      return [
        { id: 'vibe100-1', title: 'AVO Channel', short: 'AVO', subtitle: 'VIBE 100', copy: 'Premium college lifestyle and gameday apparel.', imageUrl: '/n2n/baylor.png', videoUrl: '/?tenant=100a0000-c08f-4260-8540-a0cc8bed4e11' },
        { id: 'vibe100-2', title: 'Muscle & Fitness Channel', short: 'Muscle & Fitness', subtitle: 'VIBE 100', copy: 'The ultimate resource for bodybuilding, workouts, nutrition, and fitness.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200', videoUrl: '/?tenant=100b0000-c08f-4260-8540-a0cc8bed4e11' },
        { id: 'vibe100-3', title: 'B2K Channel', short: 'B2K', subtitle: 'VIBE 100', copy: 'Celebrate 25 years of multi-platinum hits and boy band legacy.', imageUrl: 'https://www.vibe.com/wp-content/uploads/2019/05/VIBE-B2K-5-1557518926.jpg', videoUrl: '/?tenant=100c0000-c08f-4260-8540-a0cc8bed4e11' },
        { id: 'vibe100-4', title: 'Christian Revival Channel', short: 'Christian Revival', subtitle: 'VIBE 100', copy: 'Inspirational programming, local community news, and sermons.', imageUrl: '/kple_network_thumbnail.png', videoUrl: '/?tenant=100d0000-c08f-4260-8540-a0cc8bed4e11' }
      ];
    }
    const isAvo = wlConfig?.name?.toLowerCase().includes('avo') || wlConfig?.domain?.toLowerCase().includes('avo');
    if (isAvo) {
      return [
        { id: 'avo-1', title: 'Baylor', short: 'Baylor', subtitle: 'New Collection', copy: 'Represent the Bears with our newest campus essentials.', imageUrl: 'https://shopavo.la/cdn/shop/files/msu-hp-hero_1500x.jpg?v=1775144388', videoUrl: 'https://shopavo.la/collections/baylor' },
        { id: 'avo-2', title: 'Mississippi State', short: 'Miss. State', subtitle: 'Hail State', copy: 'Maroon and white — gear up for every tailgate and beyond.', imageUrl: 'https://shopavo.la/cdn/shop/files/MSU_Homepage_Desktop_1500x.jpg?v=1776105569', videoUrl: 'https://shopavo.la/collections/mississippi-state' },
        { id: 'avo-3', title: 'Vanderbilt', short: 'Vanderbilt', subtitle: 'Anchor Down', copy: 'Premium campus wear for the Commodores faithful.', imageUrl: 'https://shopavo.la/cdn/shop/files/Homepage_Vanderbilt_Desktop_1500x.jpg?v=1776284269', videoUrl: 'https://shopavo.la/collections/vanderbilt' },
        { id: 'avo-4', title: 'Penn State', short: 'Penn State', subtitle: 'We Are', copy: 'Nittany Lions gear crafted for the Happy Valley lifestyle.', imageUrl: 'https://shopavo.la/cdn/shop/files/PSU_Homepage_Banner_Desktop2_1500x.jpg?v=1776375978', videoUrl: 'https://shopavo.la/collections/penn-state' },
        { id: 'avo-5', title: 'Alabama', short: 'Alabama', subtitle: 'Roll Tide', copy: 'Crimson and cream essentials for the Crimson Tide.', imageUrl: 'https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820', videoUrl: 'https://shopavo.la/pages/avo-x-bama' },
        { id: 'avo-6', title: 'Ole Miss', short: 'Ole Miss', subtitle: 'Hotty Toddy', copy: 'Oxford-inspired style meets college spirit.', imageUrl: 'https://shopavo.la/cdn/shop/files/desk-ole-miss-hp_1500x.jpg?v=1774210006', videoUrl: 'https://shopavo.la/collections/ole-miss' },
        { id: 'avo-7', title: 'Colorado', short: 'Colorado', subtitle: 'Sko Buffs', copy: 'Boulder vibes and mountain-ready campus apparel.', imageUrl: 'https://shopavo.la/cdn/shop/files/co-desktop2_4230eb90-9553-4d72-b205-30e62658bcce_1500x.jpg?v=1776445128', videoUrl: 'https://shopavo.la/collections/colorado' },
        { id: 'avo-8', title: 'Georgia', short: 'Georgia', subtitle: 'Go Dawgs', copy: 'Red and black essentials for the Bulldog nation.', imageUrl: 'https://shopavo.la/cdn/shop/files/UGA_Collections_Desktop_1500x.jpg?v=1776210559', videoUrl: 'https://shopavo.la/collections/georgia' }
      ];
    }

    return [
      { id: 'default-1', title: 'Featured Content 1', short: 'Featured 1', subtitle: 'New Feature', copy: 'Explore premium content from the global network.', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: 'default-2', title: 'Featured Content 2', short: 'Featured 2', subtitle: 'Spotlight', copy: 'Catch the latest releases and live streams.', imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: 'default-3', title: 'Featured Content 3', short: 'Featured 3', subtitle: 'Trending', copy: 'What\'s popular on the platform today.', imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
    ];
  };

  // Slider State
  const [heroSlider, setHeroSlider] = useState<Array<{ id: string, title: string, imageUrl: string, videoUrl: string, short?: string, subtitle?: string, copy?: string }>>(
    getInitialSlider()
  );
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideShort, setSlideShort] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideCopy, setSlideCopy] = useState('');
  const [slideImageUrl, setSlideImageUrl] = useState('');
  const [slideVideoUrl, setSlideVideoUrl] = useState('');
  const [uploadingSlideImage, setUploadingSlideImage] = useState(false);
  const [uploadingSlideVideo, setUploadingSlideVideo] = useState(false);

  // AI Video Shield States
  const [showScanner, setShowScanner] = useState(false);
  const [scannerLogs, setScannerLogs] = useState<string[]>([]);
  const [scannerFrames, setScannerFrames] = useState<string[]>([]);
  const [scannerStatus, setScannerStatus] = useState<'scanning' | 'passed' | 'failed'>('scanning');
  const [scannerReason, setScannerReason] = useState('');
  const [abortUpload, setAbortUpload] = useState<(() => void) | null>(null);

  // Drag and drop states
  const [dragActiveHeroImage, setDragActiveHeroImage] = useState(false);
  const [dragActiveHeroVideo, setDragActiveHeroVideo] = useState(false);

  const handleHeroVideoUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;

      // 1. Verify file size limit (50MB)
      const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
      if (file.size > MAX_VIDEO_SIZE) {
        toast.error('Video file size exceeds the 50MB limit. Please upload a compressed clip.');
        return;
      }

      // 2. Verify mimetype starts with video/
      if (!file.type.startsWith('video/')) {
        toast.error('Invalid file format. Please upload a valid video file.');
        return;
      }

      // 3. Start Moderation Scan
      setUploadingHeroVideo(true);
      setScannerLogs([]);
      setScannerFrames([]);
      setScannerStatus('scanning');
      setScannerReason('');
      setShowScanner(true);

      let isCancelled = false;
      setAbortUpload(() => () => {
        isCancelled = true;
        setShowScanner(false);
        setUploadingHeroVideo(false);
        toast.info('Video upload cancelled by user.');
      });

      const result = await moderateVideoContent(
        file,
        (log) => {
          if (isCancelled) return;
          setScannerLogs(prev => [...prev, log]);
        },
        (frame) => {
          if (isCancelled) return;
          setScannerFrames(prev => [...prev, frame]);
        }
      );

      if (isCancelled) return;

      if (!result.safe) {
        setScannerStatus('failed');
        setScannerReason(result.reason || 'Adult content keywords matched.');
        toast.error('Vibes Shield: Video contains unsafe/restricted content and was blocked!');
        return;
      }

      setScannerStatus('passed');
      setScannerLogs(prev => [...prev, '[Vibes Shield] ✔ Visual safety confirmed. Uploading to storage...']);

      // 4. Proceed with Storage upload
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('videos').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setHeroVideoUrl(data.publicUrl);
        setScannerLogs(prev => [...prev, `[Vibes Shield] ✔ Success! Public URL: ${data.publicUrl}`]);
        toast.success('Video uploaded successfully!');
      }
    } catch (err: any) {
      setScannerStatus('failed');
      setScannerReason(err.message || 'Verification or upload failed.');
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploadingHeroVideo(false);
    }
  };

  const handleHeroImageUpload = async (eventOrFile: React.ChangeEvent<HTMLInputElement> | File) => {
    try {
      let file: File | undefined;
      if (eventOrFile instanceof File) {
        file = eventOrFile;
      } else if (eventOrFile.target?.files && eventOrFile.target.files.length > 0) {
        file = eventOrFile.target.files[0];
      }
      if (!file) return;
      setUploadingHeroImage(true);

      toast.info("✨ Vibe is enhancing and auto-cropping your hero banner...");
      const enhancedFile = await processAndEnhanceImage(file, 'hero');

      const fileExt = enhancedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, enhancedFile);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      if (data?.publicUrl) {
        setHeroImage(data.publicUrl);
        toast.success('Image uploaded successfully!');
      }
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const executeSave = async () => {
    try {
      setUploadStatus('uploading');
      
      const updatedTheme = {
        ...wlConfig.theme,
        heroCopy,
        heroTitle,
        heroLayoutMode,
        heroVideoUrl,
        heroVideoTitle,
        heroImage,
        heroSlider
      };

      if (wlConfig.id === 'master') {
        const { data: existing } = await supabase.from('whitelabel_configs').select('id, theme').eq('domain', 'vibenetwork.tv').limit(1);
        if (existing && existing.length > 0) {
          const { error } = await supabase.from('whitelabel_configs').update({
            theme: { ...(existing[0].theme || {}), ...updatedTheme }
          }).eq('id', existing[0].id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('whitelabel_configs').insert([{
            name: 'Vibe Network',
            domain: 'vibenetwork.tv',
            theme: updatedTheme
          }]);
          if (error) throw error;
        }
      } else {
        const { error } = await supabase.from('whitelabel_configs').update({
          theme: updatedTheme
        }).eq('id', wlConfig.id);
        if (error) throw error;
      }

      // Sync local storage
      const localNetworks = JSON.parse(localStorage.getItem('vibe_local_networks') || '[]');
      const index = localNetworks.findIndex((n: any) => n.id === wlConfig.id || (wlConfig.id === 'master' && n.domain === 'vibenetwork.tv'));
      if (index >= 0) {
        localNetworks[index].theme = updatedTheme;
        localNetworks[index].heroCopy = heroCopy;
        localStorage.setItem('vibe_local_networks', JSON.stringify(localNetworks));
      }

      setUploadStatus('success');
      setTimeout(() => setUploadStatus(null), 3000);
      toast.success('Live Architecture Successfully Deployed to Master Server!');
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      toast.error('Save failed: ' + e.message);
      setUploadStatus(null);
    }
  };

  return (
    <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1 style={{ fontSize: '36px', marginBottom: '12px', fontWeight: '900', letterSpacing: '-1px' }}>Hero Billboard OS</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1.5 }}>Tune the primary verbiage, dynamic CTA buttons, and background master layers of the main site entry point.</p>
      </div>
      
      {!(wlConfig.n2n_enabled || wlConfig.id === 'master') ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Hero Layout Mode</h3>
           <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', marginBottom: '10px' }}>Choose the primary format for the center of the hero section.</p>
           <select value={heroLayoutMode} onChange={(e: any) => setHeroLayoutMode(e.target.value)} style={{ padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none' }}>
              <option value="verbiage">Verbiage (Standard Title & Subtext)</option>
              <option value="video">Welcome Video (Embedded Player)</option>
              <option value="slider">Video Slider (Mini Carousel)</option>
           </select>
           
           {heroLayoutMode === 'verbiage' && (
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                 <AiInput label="Hero Title" defaultValue={heroTitle} placeholder="e.g. Vibe Network" accent={wlConfig.accent} onChange={(v) => setHeroTitle(v)} />
                 <AiTextArea label="Hero Marketing Verbiage" defaultValue={heroCopy} accent={wlConfig.accent} onChange={(v) => setHeroCopy(v)} />
              </div>
           )}
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px' }}>
           <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Hero Layout Mode</h3>
           <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>
              This network is configured with a high-impact multi-slide hero layout. You can manage, add, or replace individual slides in the section below.
           </p>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
         <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Hero Background Image</h3>
         <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', marginBottom: '10px' }}>Upload a custom image to serve as the atmospheric background for the hero section.</p>
         
         {heroImage && <img src={heroImage} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} alt="Hero Preview" />}
         
         <div style={{ display: 'flex', gap: '12px' }}>
            <input type="text" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="e.g. https://images.unsplash.com/..." style={{ flex: 1, padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
            <label 
               onDragOver={(e) => { e.preventDefault(); setDragActiveHeroImage(true); }}
               onDragLeave={() => setDragActiveHeroImage(false)}
               onDrop={(e) => {
                  e.preventDefault();
                  setDragActiveHeroImage(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                     handleHeroImageUpload(e.dataTransfer.files[0]);
                  }
               }}
               style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '12px 24px', 
                  background: dragActiveHeroImage ? 'rgba(0, 255, 136, 0.05)' : 'var(--bg-surface)', 
                  border: dragActiveHeroImage ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '12px', 
                  cursor: uploadingHeroImage ? 'not-allowed' : 'pointer', 
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  minWidth: '180px',
                  textAlign: 'center'
               }}
            >
               <span>{uploadingHeroImage ? 'Uploading...' : dragActiveHeroImage ? 'Drop it here!' : 'Upload Image (Drag & Drop)'}</span>
               <input type="file" accept="image/*" onChange={handleHeroImageUpload} style={{ display: 'none' }} disabled={uploadingHeroImage} />
            </label>
         </div>
      </div>

      {heroLayoutMode === 'video' && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Welcome Video Source</h3>
           <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', marginBottom: '10px' }}>Enter a YouTube URL OR directly upload a video file to embed in the center of the hero section.</p>
           
           <div style={{ display: 'flex', gap: '12px' }}>
              <input type="text" value={heroVideoUrl} onChange={(e) => setHeroVideoUrl(e.target.value)} placeholder="e.g. https://youtube.com/watch?v=..." style={{ flex: 1, padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none' }} />
              <label 
                 onDragOver={(e) => { e.preventDefault(); setDragActiveHeroVideo(true); }}
                 onDragLeave={() => setDragActiveHeroVideo(false)}
                 onDrop={(e) => {
                    e.preventDefault();
                    setDragActiveHeroVideo(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                       handleHeroVideoUpload(e.dataTransfer.files[0]);
                    }
                 }}
                 style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '12px 24px', 
                    background: dragActiveHeroVideo ? 'rgba(0, 255, 136, 0.05)' : 'var(--bg-surface)', 
                    border: dragActiveHeroVideo ? '2px dashed #00ff88' : '1px solid rgba(255,255,255,0.2)', 
                    borderRadius: '12px', 
                    cursor: uploadingHeroVideo ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    minWidth: '220px',
                    textAlign: 'center'
                 }}
              >
                 <span>{uploadingHeroVideo ? 'Uploading...' : dragActiveHeroVideo ? 'Drop Video here!' : 'Upload Video File (Drag & Drop)'}</span>
                 <input type="file" accept="video/*" onChange={handleHeroVideoUpload} style={{ display: 'none' }} disabled={uploadingHeroVideo} />
              </label>
           </div>
           <input type="text" value={heroVideoTitle} onChange={(e) => setHeroVideoTitle(e.target.value)} placeholder="e.g. Welcome to the Vibe Network" style={{ width: '100%', padding: '14px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '16px', outline: 'none', marginTop: '10px' }} />
        </div>
      )}


      {(heroLayoutMode === 'slider' || wlConfig.n2n_enabled || wlConfig.id === 'master') && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px 30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Hero Video Slider Management</h3>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>Configure custom slider video banners shown on the home page.</p>
            </div>
            {editingSlideId === null && (
              <button 
                onClick={() => {
                  setEditingSlideId('new');
                  setSlideTitle('');
                  setSlideShort('');
                  setSlideSubtitle('');
                  setSlideCopy('');
                  setSlideImageUrl('');
                  setSlideVideoUrl('');
                }}
                style={{ padding: '10px 20px', background: wlConfig.accent, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              >
                + Add Slide Banner
              </button>
            )}
          </div>

          {editingSlideId !== null && (
            <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ margin: 0 }}>{editingSlideId === 'new' ? 'Add New Slider Banner' : 'Edit Slider Banner'}</h4>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>Slide Title (Main Headline)</label>
                <input 
                  type="text" 
                  value={slideTitle} 
                  onChange={(e) => setSlideTitle(e.target.value)} 
                  placeholder="e.g. Entertainment" 
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '15px', outline: 'none' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>Tab Label / Short Title (Appears in bottom bar buttons)</label>
                <input 
                  type="text" 
                  value={slideShort} 
                  onChange={(e) => setSlideShort(e.target.value)} 
                  placeholder="e.g. Entertainment" 
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '15px', outline: 'none' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>Overhead Subtitle</label>
                <input 
                  type="text" 
                  value={slideSubtitle} 
                  onChange={(e) => setSlideSubtitle(e.target.value)} 
                  placeholder="e.g. LATEST LIVE SETS & SHOWS" 
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '15px', outline: 'none' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>Description Copy / Paragraph</label>
                <textarea 
                  value={slideCopy} 
                  onChange={(e) => setSlideCopy(e.target.value)} 
                  placeholder="e.g. Experience top DJ sets, live concerts, and exclusive music releases streaming 24/7." 
                  rows={3}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '15px', outline: 'none', resize: 'vertical' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>Slide Preview Image (16:9 Banner)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={slideImageUrl} 
                    onChange={(e) => setSlideImageUrl(e.target.value)} 
                    placeholder="e.g. https://images.unsplash.com/..." 
                    style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '15px', outline: 'none' }} 
                  />
                  <label style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', cursor: uploadingSlideImage ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {uploadingSlideImage ? 'Uploading...' : 'Upload'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          try {
                            setUploadingSlideImage(true);
                            const enhancedFile = await processAndEnhanceImage(e.target.files[0], 'hero');
                            const fileExt = enhancedFile.name.split('.').pop();
                            const fileName = `${Date.now()}_slide_${Math.random()}.${fileExt}`;
                            const filePath = `hero/${fileName}`;
                            const { error: uploadError } = await supabase.storage.from('images').upload(filePath, enhancedFile);
                            if (uploadError) throw uploadError;
                            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
                            if (data?.publicUrl) {
                              setSlideImageUrl(data.publicUrl);
                              toast.success('Slide preview image uploaded!');
                            }
                          } catch (err: any) {
                            toast.error('Image upload failed: ' + err.message);
                          } finally {
                            setUploadingSlideImage(false);
                          }
                        }
                      }} 
                      style={{ display: 'none' }} 
                      disabled={uploadingSlideImage} 
                    />
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-muted)' }}>Slide Video Link (YouTube or Direct File - Optional)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={slideVideoUrl} 
                    onChange={(e) => setSlideVideoUrl(e.target.value)} 
                    placeholder="e.g. https://youtube.com/watch?v=..." 
                    style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontSize: '15px', outline: 'none' }} 
                  />
                  <label style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', cursor: uploadingSlideVideo ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                    {uploadingSlideVideo ? 'Uploading...' : 'Upload'}
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.size > 50 * 1024 * 1024) {
                            toast.error('Video file size exceeds the 50MB limit.');
                            return;
                          }
                          try {
                            setUploadingSlideVideo(true);
                            const fileExt = file.name.split('.').pop();
                            const fileName = `${Date.now()}_slide_${Math.random()}.${fileExt}`;
                            const filePath = `hero/${fileName}`;
                            const { error: uploadError } = await supabase.storage.from('videos').upload(filePath, file);
                            if (uploadError) throw uploadError;
                            const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
                            if (data?.publicUrl) {
                              setSlideVideoUrl(data.publicUrl);
                              toast.success('Slide video uploaded!');
                            }
                          } catch (err: any) {
                            toast.error('Video upload failed: ' + err.message);
                          } finally {
                            setUploadingSlideVideo(false);
                          }
                        }
                      }} 
                      style={{ display: 'none' }} 
                      disabled={uploadingSlideVideo} 
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button 
                  onClick={() => setEditingSlideId(null)}
                  style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (!slideTitle || !slideImageUrl) {
                      toast.error('Please enter all required fields (Title and Image URL).');
                      return;
                    }
                    const newSlide = {
                      id: editingSlideId === 'new' ? Date.now().toString() : editingSlideId,
                      title: slideTitle,
                      short: slideShort || slideTitle,
                      subtitle: slideSubtitle || 'Featured',
                      copy: slideCopy || '',
                      imageUrl: slideImageUrl,
                      videoUrl: slideVideoUrl || ''
                    };
                    if (editingSlideId === 'new') {
                      setHeroSlider([...heroSlider, newSlide]);
                    } else {
                      setHeroSlider(heroSlider.map(s => s.id === editingSlideId ? newSlide : s));
                    }
                    setEditingSlideId(null);
                    toast.success('Slide temporarily saved! Save configurations to publish.');
                  }}
                  style={{ padding: '8px 16px', background: wlConfig.accent, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save Slide Settings
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {heroSlider.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                No custom slides configured yet. The site will display standard fallback slides.
              </div>
            ) : (
              heroSlider.map((slide, idx) => (
                <div key={slide.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px' }}>
                  <img src={slide.imageUrl} style={{ width: '100px', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} alt="" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px' }}>{slide.title}</h4>
                      {slide.short && slide.short !== slide.title && (
                        <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>Tab: {slide.short}</span>
                      )}
                    </div>
                    {slide.subtitle && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: wlConfig.accent, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{slide.subtitle}</p>
                    )}
                    {slide.copy && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{slide.copy}</p>
                    )}
                    {slide.videoUrl && (
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all', display: 'block', marginTop: '4px' }}>Link: {slide.videoUrl}</span>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        if (idx > 0) {
                          const copy = [...heroSlider];
                          const temp = copy[idx - 1];
                          copy[idx - 1] = copy[idx];
                          copy[idx] = temp;
                          setHeroSlider(copy);
                        }
                      }}
                      disabled={idx === 0}
                      style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#fff', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => {
                        if (idx < heroSlider.length - 1) {
                          const copy = [...heroSlider];
                          const temp = copy[idx + 1];
                          copy[idx + 1] = copy[idx];
                          copy[idx] = temp;
                          setHeroSlider(copy);
                        }
                      }}
                      disabled={idx === heroSlider.length - 1}
                      style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#fff', cursor: idx === heroSlider.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === heroSlider.length - 1 ? 0.3 : 1 }}
                    >
                      ▼
                    </button>
                    <button 
                      onClick={() => {
                        setEditingSlideId(slide.id);
                        setSlideTitle(slide.title || '');
                        setSlideShort(slide.short || '');
                        setSlideSubtitle(slide.subtitle || '');
                        setSlideCopy(slide.copy || '');
                        setSlideImageUrl(slide.imageUrl || '');
                        setSlideVideoUrl(slide.videoUrl || '');
                      }}
                      style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Delete this slide?')) {
                          setHeroSlider(heroSlider.filter(s => s.id !== slide.id));
                        }
                      }}
                      style={{ padding: '6px 12px', background: 'rgba(255,77,133,0.1)', border: 'none', borderRadius: '6px', color: '#ff4d85', cursor: 'pointer' }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}


      <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)' }} />
      <button onClick={executeSave} disabled={uploadStatus === 'uploading'} style={{ padding: '18px 40px', background: wlConfig.accent, color: 'var(--text-primary)', fontWeight: 'bold', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', maxWidth: '300px', boxShadow: `0 8px 30px ${wlConfig.accent}44` }}>
        {uploadStatus === 'uploading' ? 'Saving...' : 'Save & Deploy to Live Site'}
      </button>

      <VideoModerationScanner
        isOpen={showScanner}
        logs={scannerLogs}
        frames={scannerFrames}
        status={scannerStatus}
        reason={scannerReason}
        onClose={abortUpload || (() => setShowScanner(false))}
        accentColor={wlConfig?.accent || '#ff4d85'}
      />
    </div>
  );
};
