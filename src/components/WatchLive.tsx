import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, Tv, X, ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

interface VideoClip {
  id: string;
  headline: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  source: string;
  sport: string;
  articleUrl?: string;
  published?: Date;
}

const FEEDS = [
  { key: 'cfb', label: '🏈 Football', sport: 'football', league: 'college-football' },
  { key: 'cbb', label: '🏀 Basketball', sport: 'basketball', league: 'mens-college-basketball' },
  { key: 'base', label: '⚾ Baseball', sport: 'baseball', league: 'college-baseball' },
];

const OLYMPIAN_FEEDS = [
  { key: 'olympiatv', label: '🏆 OlympiaTV', channelId: 'UCYukge4AuskD8xPjfrSoiBg' },
  { key: 'nicksnp', label: '💪 Nick\'s Strength & Power', channelId: 'UClfyDMfX-RhmExpVm-nCl4Q' },
  { key: 'jaycutler', label: '👑 Jay Cutler', channelId: 'UCiq2MIlqqeOcEvj9cP9f1bA' },
];

const B2K_FEEDS = [
  { key: 'b2k_group', label: '👥 B2K Group' },
  { key: 'omarion', label: '🎤 Omarion' },
  { key: 'fizz', label: "🎧 Lil' Fizz" },
  { key: 'jboog', label: '🎸 J-Boog' },
];

const VIBE_FEEDS = [
  { key: 'news', label: '📰 CNN News', source: 'YouTube', channelId: 'UCupvZG-5ko_eiXAupbDfxWw' },
  { key: 'foxnews', label: '🦊 Fox News', source: 'YouTube', channelId: 'UCXIJgqnII2ZOINSWNOGFThA' },
  { key: 'politics', label: '⚖️ MSNBC Politics', source: 'YouTube', channelId: 'UCaXkIU1QidjPwiAYu6GcHjg' },
  { key: 'entertainment', label: '🎭 People Weekly', source: 'YouTube', channelId: 'UCGbQJy-531_5vfphay-rChQ' },
  { key: 'money', label: '💵 CNBC Business', source: 'YouTube', channelId: 'UCvJJ_dzjViJCoLf5uKUTwoA' },
  { key: 'sports', label: '🏈 ESPN Sports', source: 'YouTube', channelId: 'UCiWLfSweyRNmLpgEHekhoAg' },
];

const KPLE_FEEDS = [
  { key: 'tct_network', label: '📺 TCT Network', channelId: 'UCQjstwROWgM16K9V7HNH0vA' },
  { key: 'act_local', label: '🎥 ACT Local', channelId: 'UCdorw7uL4mZnPby7T78bT7A' },
  { key: 'the_walk', label: '🚶 The Walk TV', channelId: 'UCdorw7uL4mZnPby7T78bT7A' },
  { key: 'enlace_usa', label: '🌎 Enlace USA', channelId: 'UCdorw7uL4mZnPby7T78bT7A' },
  { key: 'positiv_movies', label: '🎬 Positiv Family', channelId: 'UCdorw7uL4mZnPby7T78bT7A' },
  { key: 'smile_kids', label: '👶 Smile of a Child', channelId: 'UCmkgg5el8Fg3IX_baZyfSaQ' },
];

const STATIC_KPLE_CLIPS: VideoClip[] = [
  {
    id: '5BFZ5rg1ZLc',
    headline: 'God doesn’t want robotic prayers—He wants your heart.',
    description: 'Join TCT Network for a deep Bible study on walking in faith and living the Word of God daily.',
    thumbnail: 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=5BFZ5rg1ZLc',
    duration: 2450,
    source: 'TCT Network',
    sport: 'tct_network'
  },
  {
    id: 'vwmCBGEmpY0',
    headline: 'God is fighting for you in ways you may not even see.',
    description: 'An in-depth look at Ephesians 2 and the unmerited favor of God that sustains us.',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=vwmCBGEmpY0',
    duration: 2120,
    source: 'TCT Network',
    sport: 'tct_network'
  },
  {
    id: 'Z5q63JNeAZs',
    headline: 'There is power in the name of Jesus.',
    description: 'A powerful sermon on building families that stand strong on the Rock of Christ.',
    thumbnail: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=Z5q63JNeAZs',
    duration: 2850,
    source: 'TCT Network',
    sport: 'tct_network'
  },
  {
    id: 'x2bt6n_Xkq8',
    headline: 'Frankly Speaking with Pastor Frank',
    description: 'Be empowered to fulfill your divine purpose and overcome life\'s challenges with this weekly message.',
    thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=x2bt6n_Xkq8',
    duration: 1840,
    source: 'TCT Network',
    sport: 'tct_network'
  },
  {
    id: 'vdHg6fe8P5Y-bulletin',
    headline: 'Attention Central Texas - Local Public Service Bulletin',
    description: 'Highlighting community events, news, and volunteer opportunities across Central Texas.',
    thumbnail: 'https://images.unsplash.com/photo-1492534513006-37715f336a39?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=vdHg6fe8P5Y',
    duration: 645,
    source: 'Attention Central Texas',
    sport: 'act_local'
  },
  {
    id: 'vdHg6fe8P5Y-veterans',
    headline: 'Veterans Resources Show - Accessing Local Support',
    description: 'Important information about benefits, counseling, and housing resources for local veterans.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=vdHg6fe8P5Y',
    duration: 1230,
    source: 'Attention Central Texas',
    sport: 'act_local'
  },
  {
    id: 'EWGs1CV8g_s',
    headline: 'The Word Of Life - The Temptation Of Jesus',
    description: 'Unlocking Biblical prophecy and understanding the messages to the seven churches.',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=EWGs1CV8g_s',
    duration: 1950,
    source: 'The Walk TV',
    sport: 'the_walk'
  },
  {
    id: '9drtdb9zqy4',
    headline: 'Men of Integrity - Honor and Strength',
    description: 'Discussion on integrity, family, and spiritual leadership for men.',
    thumbnail: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=9drtdb9zqy4',
    duration: 1530,
    source: 'The Walk TV',
    sport: 'the_walk'
  },
  {
    id: 'e5PyPssFC5U',
    headline: 'La Palabra de Vida - Una Nueva Identidad',
    description: 'Mensaje inspiracional en español con la Reverenda Mitzi Gibson.',
    thumbnail: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=e5PyPssFC5U',
    duration: 1820,
    source: 'Enlace USA',
    sport: 'enlace_usa'
  },
  {
    id: 'p1k8H32aB_w',
    headline: 'Positiv Cinema - Family Movie Night Spotlight',
    description: 'Uplifting and family-friendly movies that bring encouragement and entertainment.',
    thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=p1k8H32aB_w',
    duration: 1845,
    source: 'Positiv',
    sport: 'positiv_movies'
  },
  {
    id: 'TvJHIFotb3s',
    headline: 'Superbook - David and Goliath (A Giant Adventure)',
    description: 'An exciting animated journey through scripture teaching kids that with God, no giant is too big.',
    thumbnail: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/watch?v=TvJHIFotb3s',
    duration: 1560,
    source: 'Smile of a Child',
    sport: 'smile_kids'
  }
];

const B2K_CLIPS: VideoClip[] = [
  {
    id: 'lgyEYMxzVpw',
    headline: "B2K - Bump, Bump, Bump (Official Music Video) ft. P. Diddy",
    description: "Watch the official music video for B2K's smash hit 'Bump, Bump, Bump' featuring P. Diddy.",
    thumbnail: 'https://i.ytimg.com/vi/lgyEYMxzVpw/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=lgyEYMxzVpw',
    duration: 238,
    source: 'YouTube',
    sport: 'b2k_group'
  },
  {
    id: 'CgiX53hjAPc',
    headline: "B2K - Uh Huh (Official Music Video)",
    description: "Watch B2K's debut hit single 'Uh Huh' off their self-titled debut album.",
    thumbnail: 'https://i.ytimg.com/vi/CgiX53hjAPc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=CgiX53hjAPc',
    duration: 253,
    source: 'YouTube',
    sport: 'b2k_group'
  },
  {
    id: 'd8BFf32yDWQ',
    headline: "B2K - Gots Ta Be (Official Music Video)",
    description: "Experience the official music video for B2K's classic smooth R&B ballad 'Gots Ta Be'.",
    thumbnail: 'https://i.ytimg.com/vi/d8BFf32yDWQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=d8BFf32yDWQ',
    duration: 261,
    source: 'YouTube',
    sport: 'b2k_group'
  },
  {
    id: '6OihwykYdBc',
    headline: "B2K - Girlfriend (Official Music Video)",
    description: "The official music video for B2K's hit single 'Girlfriend' off the album Pandemonium!.",
    thumbnail: 'https://i.ytimg.com/vi/6OihwykYdBc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=6OihwykYdBc',
    duration: 204,
    source: 'YouTube',
    sport: 'b2k_group'
  },
  {
    id: '_Z_5lpErdyM',
    headline: "Omarion - 'Touch' (Official Music Video)",
    description: "Watch the official music video for Omarion's smash solo hit 'Touch' off his debut album O.",
    thumbnail: 'https://i.ytimg.com/vi/_Z_5lpErdyM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=_Z_5lpErdyM',
    duration: 254,
    source: 'YouTube',
    sport: 'omarion'
  },
  {
    id: 'AdJEg47RTZ4',
    headline: "Lil' Fizz - 'Fluid' (Official Music Video) ft. Missez",
    description: "Watch the official music video for Lil' Fizz's solo single 'Fluid' featuring Missez.",
    thumbnail: 'https://i.ytimg.com/vi/AdJEg47RTZ4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=AdJEg47RTZ4',
    duration: 210,
    source: 'YouTube',
    sport: 'fizz'
  },
  {
    id: 'JwIHOk7b5sQ',
    headline: "B2K - Big Boy TV Reunion Interview ft. J-Boog",
    description: "J-Boog, Raz-B and the group sit down at Big Boy TV to talk about the Millennium reunion tour and history.",
    thumbnail: 'https://i.ytimg.com/vi/JwIHOk7b5sQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=JwIHOk7b5sQ',
    duration: 1845,
    source: 'YouTube',
    sport: 'jboog'
  },
  {
    id: 'OJl-628FyIk',
    headline: "Omarion - 'Ice Box' (Official Music Video)",
    description: "Watch the official music video for Omarion's chart-topping platinum solo single 'Ice Box'.",
    thumbnail: 'https://i.ytimg.com/vi/OJl-628FyIk/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=OJl-628FyIk',
    duration: 260,
    source: 'YouTube',
    sport: 'omarion'
  }
];

const STATIC_OLYMPIAN_CLIPS: VideoClip[] = [
  {
    id: 'SV7JP7y80UM',
    headline: 'Official OlympiaTV - The 212 Debate',
    description: 'Watch the official debate and analysis of the 212 division ahead of the Mr. Olympia contest.',
    thumbnail: 'https://i.ytimg.com/vi/SV7JP7y80UM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=SV7JP7y80UM',
    duration: 1845,
    source: 'YouTube',
    sport: 'olympiatv'
  },
  {
    id: 'MzWgJtFIxg8',
    headline: 'The Athletes that Changed the Game',
    description: 'Arnold made bodybuilding popular and Dorian brought the mass monster era. The experts discuss the iconic transitions.',
    thumbnail: 'https://i.ytimg.com/vi/MzWgJtFIxg8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=MzWgJtFIxg8',
    duration: 780,
    source: 'YouTube',
    sport: 'olympiatv'
  },
  {
    id: 'NMjCB0Y2rh4',
    headline: 'The Victor Martinez Moment!',
    description: 'The 2007 Mr. Olympia has been considered one of the most controversial moments in bodybuilding history.',
    thumbnail: 'https://i.ytimg.com/vi/NMjCB0Y2rh4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=NMjCB0Y2rh4',
    duration: 915,
    source: 'YouTube',
    sport: 'olympiatv'
  },
  {
    id: 'P0Ivio8Onew',
    headline: 'Was Hassan Robbed At The Toronto Pro?',
    description: 'Nick\'s Strength and Power breaks down the prejudging comparisons and predicts who will take home the Sandow Trophy.',
    thumbnail: 'https://i.ytimg.com/vi/P0Ivio8Onew/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=P0Ivio8Onew',
    duration: 812,
    source: 'YouTube',
    sport: 'nicksnp'
  },
  {
    id: 'GJkBAbzrhkQ',
    headline: 'Hassan Mostafa’s Side Chest is INSANE!!!',
    description: 'Nick\'s Strength and Power breaks down Hassan Mostafa\'s mind-blowing side chest pose and his performance in recent contests.',
    thumbnail: 'https://i.ytimg.com/vi/GJkBAbzrhkQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=GJkBAbzrhkQ',
    duration: 345,
    source: 'YouTube',
    sport: 'nicksnp'
  },
  {
    id: 'dTqpdNacxYM',
    headline: 'New Cutler Nutrition Q&A with DT Roth!',
    description: '4x Mr. Olympia Jay Cutler takes us through his intense off-season chest workout, explaining his set/rep selection and training volume.',
    thumbnail: 'https://i.ytimg.com/vi/dTqpdNacxYM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dTqpdNacxYM',
    duration: 645,
    source: 'YouTube',
    sport: 'jaycutler'
  },
  {
    id: 'fxl8zZId73g',
    headline: 'Prevail Focus: Cutler Nutrition Performance',
    description: 'DT Roth breaks down what separates Prevail Focus pre-workout from the competition and how it can help your performance.',
    thumbnail: 'https://i.ytimg.com/vi/fxl8zZId73g/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=fxl8zZId73g',
    duration: 490,
    source: 'YouTube',
    sport: 'jaycutler'
  }
];

const STATIC_VIBE_CLIPS: VideoClip[] = [
  {
    id: '4cqcl3Jy_hw',
    headline: 'FAA wants to change this old system',
    description: "Many of America's busiest air traffic control towers still rely on paper flight strips to track aircraft movements. Now, the FAA is pushing to replace...",
    thumbnail: '/n2n/air_traffic_control.png',
    videoUrl: 'https://www.youtube.com/watch?v=4cqcl3Jy_hw',
    duration: 0,
    source: 'YouTube',
    sport: 'news'
  },
  {
    id: '-d4T5ruaGeA',
    headline: "'COMPLETE JOKE': Mamdani RIPPED for 'self-serving' ICE demand",
    description: "Former Acting ICE Director Jonathan Fahey joined 'Fox & Friends First' to discuss Zohran Mamdani's doubling down on calls to abolish the 'rogue ag...",
    thumbnail: 'https://i2.ytimg.com/vi/-d4T5ruaGeA/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=-d4T5ruaGeA',
    duration: 0,
    source: 'YouTube',
    sport: 'foxnews'
  },
  {
    id: 'ciq7HeiJCOE',
    headline: "'Sense of grift, corruption, only caring about himself' after UFC event: Ashley Parker",
    description: "President Trump hosted a UFC event on the White House's south lawn this weekend for America's 250th anniversary. Now, many questions are being raised ...",
    thumbnail: 'https://i4.ytimg.com/vi/ciq7HeiJCOE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ciq7HeiJCOE',
    duration: 0,
    source: 'YouTube',
    sport: 'politics'
  },
  {
    id: 'HPiqxMrKMKQ',
    headline: 'The Surprising Way Elizabeth Hurley & Billy Ray Cyrus Started Dating',
    description: 'Billy Ray Cyrus reveals how his unexpected romance with Elizabeth Hurley began and what brought the two stars together.',
    thumbnail: 'https://i1.ytimg.com/vi/HPiqxMrKMKQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=HPiqxMrKMKQ',
    duration: 0,
    source: 'YouTube',
    sport: 'entertainment'
  },
  {
    id: 'vwOxJJ80t3k',
    headline: 'Why KFC Has Fallen Behind In The U.S.',
    description: 'Chains like Chick-fil-A and Raising Cane\'s have become fast food mainstays as Americans continue to crave chicken. Yet KFC has become the fourth-large...',
    thumbnail: 'https://i3.ytimg.com/vi/vwOxJJ80t3k/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=vwOxJJ80t3k',
    duration: 0,
    source: 'YouTube',
    sport: 'money'
  },
  {
    id: 'vyqy7PcDGLM',
    headline: 'Describing the Men\'s College World Series experience + Star players to watch',
    description: 'Karl Ravech joins The Pat McAfee Show to talk about the 2026 Men\'s College World Series in Omaha, Nebraska.',
    thumbnail: 'https://i3.ytimg.com/vi/vyqy7PcDGLM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=vyqy7PcDGLM',
    duration: 0,
    source: 'YouTube',
    sport: 'sports'
  }
];

const getAiThumbnail = (
  headline: string,
  ctx: { isOlympian?: boolean; isB2K?: boolean; isVibe?: boolean; isKple?: boolean }
) => {
  const cleanHeadline = (headline || '').replace(/[#]/g, '').trim().substring(0, 150);
  let hash = 0;
  for (let i = 0; i < cleanHeadline.length; i++) {
    hash = (hash << 5) - hash + cleanHeadline.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);

  let genrePrompt = 'breaking news broadcast style coverage';
  if (ctx.isOlympian) {
    genrePrompt = 'Mr. Olympia bodybuilding competition coverage, professional bodybuilding stage photography, dramatic spotlighting, muscular bodybuilders';
  } else if (ctx.isB2K) {
    genrePrompt = 'B2K R&B music group style, music video scene, 90s/2000s boyband aesthetic, stage lighting, cinematic music broadcast';
  } else if (ctx.isKple) {
    genrePrompt = 'inspirational Christian gospel broadcast style, warm welcoming TV studio, hope and faith theme, professional television studio';
  } else if (ctx.isVibe) {
    genrePrompt = 'breaking news broadcast style coverage, professional news anchor desk, news studio background, cinematic lighting';
  } else {
    // AVO / College Sports fallback
    genrePrompt = 'college sports action shot, dynamic college athletic photography, high energy action scene, stadium background';
  }

  const prompt = `${genrePrompt}: ${cleanHeadline}, photorealistic, 16:9 aspect ratio`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=960&height=540&nologo=true&seed=${seed}`;
};

export default function WatchLive({ accent = '#D35400', isOlympian = false, isB2K = false, isVibe = false, isKple = false }: { accent?: string; isOlympian?: boolean; isB2K?: boolean; isVibe?: boolean; isKple?: boolean }) {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoClip | null>(null);
  const [filter, setFilter] = useState('all');
  const [lastChecked, setLastChecked] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const feedsToUse = isOlympian ? OLYMPIAN_FEEDS : (isB2K ? B2K_FEEDS : (isVibe ? VIBE_FEEDS : (isKple ? KPLE_FEEDS : FEEDS)));

  const handleClipClick = (clip: VideoClip) => {
    const isYouTube = clip.videoUrl.includes('youtube.com') || clip.videoUrl.includes('youtu.be');
    const isDailymotion = clip.videoUrl.includes('dailymotion.com') || clip.videoUrl.includes('dai.ly') || clip.source === 'Dailymotion';
    const isMp4 = clip.videoUrl.toLowerCase().endsWith('.mp4');
    if (!isYouTube && !isDailymotion && !isMp4) {
      window.open(clip.videoUrl, '_blank');
    } else {
      setActiveVideo(clip);
    }
  };

  useEffect(() => {
    const fetchClips = async (silent = false) => {
      if (!silent) setLoading(true);
      const allClips: VideoClip[] = [];
      const seen = new Set<string>();

      if (isOlympian) {
        const dynamicClips: VideoClip[] = [];
        for (const feed of OLYMPIAN_FEEDS) {
          try {
            const res = await fetch(`/api/yt-rss/${feed.channelId}`);
            if (!res.ok) continue;
            const xmlText = await res.text();
            
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlText, 'text/xml');
            const entries = xml.getElementsByTagName('entry');
            
            for (let i = 0; i < entries.length; i++) {
              const entry = entries[i];
              const id = entry.getElementsByTagName('yt:videoId')[0]?.textContent 
                || entry.getElementsByTagName('id')[0]?.textContent?.split(':').pop() 
                || '';
              const headline = entry.getElementsByTagName('title')[0]?.textContent || '';
              
              const mediaGroup = entry.getElementsByTagName('media:group')[0];
              const description = mediaGroup?.getElementsByTagName('media:description')[0]?.textContent 
                || entry.getElementsByTagName('summary')[0]?.textContent 
                || '';
              
              const thumbnail = mediaGroup?.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url')
                || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
              
              const videoUrl = `https://www.youtube.com/watch?v=${id}`;
              const publishedText = entry.getElementsByTagName('published')[0]?.textContent || '';
              const published = publishedText ? new Date(publishedText) : new Date(0);
              
              if (id && !seen.has(id)) {
                seen.add(id);
                dynamicClips.push({
                  id,
                  headline,
                  description,
                  thumbnail,
                  videoUrl,
                  duration: 0,
                  source: 'YouTube',
                  sport: feed.key,
                  published,
                });
              }
            }
          } catch (err) {
            console.warn(`WatchLive: failed to fetch YouTube RSS for ${feed.label}`, err);
          }
        }
        
        // Sort dynamic clips by date descending
        dynamicClips.sort((a, b) => (b.published?.getTime() || 0) - (a.published?.getTime() || 0));
        allClips.push(...dynamicClips);
        
        // Append static fallbacks
        for (const item of STATIC_OLYMPIAN_CLIPS) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            allClips.push(item);
          }
        }
      } else if (isB2K) {
        allClips.push(...B2K_CLIPS);
      } else if (isKple) {
        const dynamicClips: VideoClip[] = [];
        
        // 1. Fetch YouTube RSS feeds
        for (const feed of KPLE_FEEDS) {
          if (feed.channelId) {
            try {
              const res = await fetch(`/api/yt-rss/${feed.channelId}`);
              if (res.ok) {
                const xmlText = await res.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlText, 'text/xml');
                const entries = xml.getElementsByTagName('entry');
                
                for (let i = 0; i < entries.length; i++) {
                  const entry = entries[i];
                  const id = entry.getElementsByTagName('yt:videoId')[0]?.textContent 
                    || entry.getElementsByTagName('id')[0]?.textContent?.split(':').pop() 
                    || '';
                  
                  let matchedFeedKey = feed.key;
                  const headline = entry.getElementsByTagName('title')[0]?.textContent || '';
                  
                  if (feed.channelId === 'UCdorw7uL4mZnPby7T78bT7A') {
                    const lowerHeadline = headline.toLowerCase();
                    if (lowerHeadline.includes('integrity') || lowerHeadline.includes('men of')) {
                      matchedFeedKey = 'the_walk';
                    } else if (lowerHeadline.includes('identidad') || lowerHeadline.includes('palabra de') || lowerHeadline.includes('enlace')) {
                      matchedFeedKey = 'enlace_usa';
                    } else if (lowerHeadline.includes('temptation') || lowerHeadline.includes('walk') || lowerHeadline.includes('bible study')) {
                      matchedFeedKey = 'the_walk';
                    } else if (lowerHeadline.includes('veteran') || lowerHeadline.includes('act') || lowerHeadline.includes('attention')) {
                      matchedFeedKey = 'act_local';
                    } else {
                      matchedFeedKey = 'act_local';
                    }
                  }
                  
                  const mediaGroup = entry.getElementsByTagName('media:group')[0];
                  const description = mediaGroup?.getElementsByTagName('media:description')[0]?.textContent 
                    || entry.getElementsByTagName('summary')[0]?.textContent 
                    || '';
                  
                  const thumbnail = mediaGroup?.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url')
                    || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
                  
                  const videoUrl = `https://www.youtube.com/watch?v=${id}`;
                  const publishedText = entry.getElementsByTagName('published')[0]?.textContent || '';
                  const published = publishedText ? new Date(publishedText) : new Date(0);
                  
                  if (id && !seen.has(id)) {
                    seen.add(id);
                    dynamicClips.push({
                      id,
                      headline,
                      description,
                      thumbnail,
                      videoUrl,
                      duration: 0,
                      source: 'YouTube',
                      sport: matchedFeedKey,
                      published,
                    });
                  }
                }
              }
            } catch (err) {
              console.warn(`WatchLive: failed to fetch YouTube RSS for ${feed.label}`, err);
            }
          }
        }
        
        // 2. Fetch KPLE child network videos from Supabase
        try {
          const { data: vidsData, error: vidsErr } = await supabase
            .from('videos')
            .select('*, creator:profiles!inner(whitelabel_id, whitelabel:whitelabel_configs!inner(name, parent_network_id))')
            .eq('creator.whitelabel.parent_network_id', '33742e2f-430b-4c2d-9cba-42507891ef02')
            .order('created_at', { ascending: false });

          if (!vidsErr && vidsData) {
            for (const v of vidsData) {
              const netName = v.creator?.whitelabel?.name || '';
              let feedKey = 'tct_network';
              if (netName.toLowerCase().includes('attention') || netName.toLowerCase().includes('act')) {
                feedKey = 'act_local';
              } else if (netName.toLowerCase().includes('positiv')) {
                feedKey = 'positiv_movies';
              } else if (netName.toLowerCase().includes('smile')) {
                feedKey = 'smile_kids';
              } else if (netName.toLowerCase().includes('enlace')) {
                feedKey = 'enlace_usa';
              } else if (netName.toLowerCase().includes('walk')) {
                feedKey = 'the_walk';
              }
              
              if (!seen.has(v.id)) {
                seen.add(v.id);
                dynamicClips.push({
                  id: v.id,
                  headline: v.title,
                  description: v.title || '',
                  thumbnail: v.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(v.title)}`,
                  videoUrl: v.video_url,
                  duration: v.preview_duration || 0,
                  source: netName,
                  sport: feedKey,
                  published: v.created_at ? new Date(v.created_at) : new Date(0),
                });
              }
            }
          }
        } catch (err) {
          console.warn("Failed to load dynamic KPLE clips:", err);
        }
        
        // Sort dynamic clips by date descending
        dynamicClips.sort((a, b) => (b.published?.getTime() || 0) - (a.published?.getTime() || 0));
        allClips.push(...dynamicClips);
        
        // Append static KPLE fallbacks
        for (const item of STATIC_KPLE_CLIPS) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            allClips.push(item);
          }
        }
      } else if (isVibe) {
        const dynamicClips: VideoClip[] = [];
        
        for (const feed of VIBE_FEEDS) {
          try {
            if (feed.source === 'Dailymotion' && feed.query) {
              const res = await fetch(`https://api.dailymotion.com/videos?search=${encodeURIComponent(feed.query)}&languages=en&flags=verified&limit=10&fields=id,title,description,thumbnail_720_url,duration,url,created_time&t=${Date.now()}`);
              if (res.ok) {
                const json = await res.json();
                for (const item of (json.list || [])) {
                  if (item.id && !seen.has(item.id)) {
                    seen.add(item.id);
                    dynamicClips.push({
                      id: item.id,
                      headline: item.title || '',
                      description: item.description || '',
                      thumbnail: item.thumbnail_720_url || `https://s1.dmcdn.net/v/${item.id}/x720`,
                      videoUrl: `https://www.dailymotion.com/video/${item.id}`,
                      duration: item.duration || 0,
                      source: 'Dailymotion',
                      sport: feed.key,
                      published: item.created_time ? new Date(item.created_time * 1000) : new Date(0),
                    });
                  }
                }
              }
            } else if (feed.source === 'YouTube' && feed.channelId) {
              const res = await fetch(`/api/yt-rss/${feed.channelId}`);
              if (res.ok) {
                const xmlText = await res.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlText, 'text/xml');
                const entries = xml.getElementsByTagName('entry');
                for (let i = 0; i < entries.length; i++) {
                  const entry = entries[i];
                  const id = entry.getElementsByTagName('yt:videoId')[0]?.textContent 
                    || entry.getElementsByTagName('id')[0]?.textContent?.split(':').pop() 
                    || '';
                  const headline = entry.getElementsByTagName('title')[0]?.textContent || '';
                  const mediaGroup = entry.getElementsByTagName('media:group')[0];
                  const description = mediaGroup?.getElementsByTagName('media:description')[0]?.textContent 
                    || entry.getElementsByTagName('summary')[0]?.textContent 
                    || '';
                  const thumbnail = mediaGroup?.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url')
                    || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
                  const videoUrl = `https://www.youtube.com/watch?v=${id}`;
                  const publishedText = entry.getElementsByTagName('published')[0]?.textContent || '';
                  const published = publishedText ? new Date(publishedText) : new Date(0);
                  
                  if (id && !seen.has(id)) {
                    seen.add(id);
                    dynamicClips.push({
                      id,
                      headline,
                      description,
                      thumbnail,
                      videoUrl,
                      duration: 0,
                      source: 'YouTube',
                      sport: feed.key,
                      published,
                    });
                  }
                }
              }
            }
          } catch (err) {
            console.warn(`WatchLive: failed to fetch video feed for ${feed.label}`, err);
          }
        }
        
        // Sort dynamic clips by date descending
        dynamicClips.sort((a, b) => (b.published?.getTime() || 0) - (a.published?.getTime() || 0));
        allClips.push(...dynamicClips);
        
        // Append static fallbacks
        for (const item of STATIC_VIBE_CLIPS) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            allClips.push(item);
          }
        }
      } else {
        const NCAA_KEYWORDS = ['college', 'ncaa'];

        for (const feed of FEEDS) {
          try {
            const res = await fetch(`/api/story?sport=${feed.sport}&league=${feed.league}&limit=30`);
            if (!res.ok) continue;
            const data = await res.json();
            for (const h of (data.headlines || [])) {
              const leagues = (h.categories || [])
                .filter((c: any) => c.type === 'league')
                .map((c: any) => (c.description || '').toLowerCase());
              const isCollege = leagues.some((l: string) =>
                NCAA_KEYWORDS.some(kw => l.includes(kw))
              );
              if (!isCollege) continue;

              const vids = h.video || [];
              if (vids.length > 0) {
                const v = vids[0];
                const clipId = String(v.id || h.id || Math.random());
                const mp4 = v.links?.source?.mezzanine?.href
                  || v.links?.source?.HD?.href
                  || v.links?.source?.full?.href
                  || v.links?.source?.href
                  || '';
                if (!mp4) continue;
                if (seen.has(clipId) || seen.has(mp4)) continue;
                seen.add(clipId);
                seen.add(mp4);

                allClips.push({
                  id: clipId,
                  headline: v.headline || h.headline || '',
                  description: v.description || h.description || '',
                  thumbnail: v.thumbnail || '',
                  videoUrl: mp4,
                  duration: v.duration || 0,
                  source: 'ESPN',
                  sport: feed.key,
                  published: h.published ? new Date(h.published) : new Date(0),
                });
              }
            }
          } catch (err) {
            console.warn(`WatchLive: failed to fetch ${feed.key}`, err);
          }
        }
        // NCAA clips can also be sorted by date
        allClips.sort((a, b) => (b.published?.getTime() || 0) - (a.published?.getTime() || 0));
      }

      setClips(allClips);
      setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setLoading(false);
    };

    fetchClips(false);
    const interval = setInterval(() => fetchClips(true), 3600000); // refresh silently every hour
    return () => clearInterval(interval);
  }, [isOlympian, isB2K, isVibe, isKple]);

  useEffect(() => {
    if (activeVideo) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeVideo]);

  useEffect(() => {
    if (activeVideo && activeVideo.source !== 'YouTube' && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.warn("WatchLive: Playback was prevented or failed:", err);
      });
    }
  }, [activeVideo]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const filtered = filter === 'all' ? clips : clips.filter(c => c.sport === filter);

  if (loading) {
    return (
      <section style={{ padding: '20px 0', width: '100%', overflow: 'hidden' }}>
        <div className="px-mobile-sm" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Tv size={24} color={accent} />
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>Watch</h2>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', color: '#555', fontSize: '14px' }}>Loading clips...</div>
        </div>
      </section>
    );
  }

  if (clips.length === 0) return null;

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <section style={{ padding: '20px 0', width: '100%', overflow: 'hidden' }}>
        <div className="px-mobile-sm" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${accent}, #ff0050)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Tv size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 900, letterSpacing: '-1px' }}>Watch</h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#555', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Analysis, highlights & recaps
                {lastChecked && (
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    • <Clock size={10} /> hourly checks (Last: {lastChecked})
                  </span>
                )}
              </p>
            </div>
          </div>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ key: 'all', label: 'All' }, ...feedsToUse.map(f => ({ key: f.key, label: f.label }))].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: '6px 16px', borderRadius: '20px',
                border: `1px solid ${filter === f.key ? accent : 'rgba(255,255,255,0.08)'}`,
                background: filter === f.key ? `${accent}20` : 'rgba(255,255,255,0.03)',
                color: filter === f.key ? accent : '#888',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured video */}
        {featured && (
          <div
            onClick={() => handleClipClick(featured)}
            style={{
              position: 'relative', borderRadius: '20px', overflow: 'hidden',
              marginBottom: '24px', cursor: 'pointer', transition: 'transform 0.3s',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.003)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div className="watch-featured-container" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
              <img 
                src={featured.thumbnail || getAiThumbnail(featured.headline, { isOlympian, isB2K, isVibe, isKple })} 
                alt={featured.headline} 
                onError={(e) => {
                  e.currentTarget.src = getAiThumbnail(featured.headline, { isOlympian, isB2K, isVibe, isKple });
                }}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.includes('image.pollinations.ai') && img.naturalWidth < 480) {
                    img.src = getAiThumbnail(featured.headline, { isOlympian, isB2K, isVibe, isKple });
                  }
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent 70%)' }} />
              {/* Play / Link button */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="watch-play-button" style={{
                  borderRadius: '50%',
                  background: `${accent}dd`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 30px ${accent}55`, transition: 'transform 0.2s',
                }}>
                  {(!featured.videoUrl.includes('youtube.com') && !featured.videoUrl.includes('youtu.be') && !featured.videoUrl.toLowerCase().endsWith('.mp4')) ? (
                    <ExternalLink className="watch-play-icon" size={28} color="#fff" />
                  ) : (
                    <Play className="watch-play-icon" size={28} color="#fff" fill="#fff" style={{ marginLeft: '3px' }} />
                  )}
                </div>
              </div>
              <div className="watch-featured-content" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '6px', background: accent, color: '#000', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {isOlympian 
                      ? '💪 Fitness' 
                      : (isB2K ? '🎤 R&B Music' : (isKple ? (featured.sport === 'tct_network' ? '📺 TCT Network' : featured.sport === 'act_local' ? '🎥 ACT Local' : featured.sport === 'the_walk' ? '🚶 The Walk TV' : featured.sport === 'enlace_usa' ? '🌎 Enlace USA' : featured.sport === 'positiv_movies' ? '🎬 Positiv Family' : '👶 Smile of a Child') : (isVibe ? (featured.sport === 'news' ? '📰 News' : featured.sport === 'foxnews' ? '🦊 Fox News' : featured.sport === 'politics' ? '⚖️ Politics' : featured.sport === 'entertainment' ? '🎭 Entertainment' : featured.sport === 'money' ? '💵 Money' : '🏈 Sports') : (featured.sport === 'cfb' ? '🏈 Football' : featured.sport === 'cbb' ? '🏀 Basketball' : '⚾ Baseball'))))
                    }
                  </span>
                  {featured.duration > 0 && (
                    <span style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {formatDuration(featured.duration)}
                    </span>
                  )}
                </div>
                <h3 className="watch-featured-title" style={{ margin: '0', fontWeight: 900, lineHeight: 1.2, maxWidth: '700px' }}>{featured.headline}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable clips */}
        {rest.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#666', margin: 0 }}>
                More Clips
              </h3>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => scroll('left')} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={16} /></button>
                <button onClick={() => scroll('right')} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={16} /></button>
              </div>
            </div>
            <div ref={scrollRef} style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '8px', scrollbarWidth: 'none' }}>
              {rest.map(clip => (
                <div
                  key={clip.id}
                  onClick={() => handleClipClick(clip)}
                  className="watch-clip-card"
                  style={{
                    flexShrink: 0, borderRadius: '14px', overflow: 'hidden', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = `${accent}44`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                    <img 
                      src={clip.thumbnail || getAiThumbnail(clip.headline, { isOlympian, isB2K, isVibe, isKple })} 
                      alt={clip.headline} 
                      onError={(e) => {
                        e.currentTarget.src = getAiThumbnail(clip.headline, { isOlympian, isB2K, isVibe, isKple });
                      }}
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (!img.src.includes('image.pollinations.ai') && img.naturalWidth < 480) {
                          img.src = getAiThumbnail(clip.headline, { isOlympian, isB2K, isVibe, isKple });
                        }
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${accent}bb`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {(!clip.videoUrl.includes('youtube.com') && !clip.videoUrl.includes('youtu.be') && !clip.videoUrl.toLowerCase().endsWith('.mp4')) ? (
                          <ExternalLink size={18} color="#fff" />
                        ) : (
                          <Play size={18} color="#fff" fill="#fff" style={{ marginLeft: '2px' }} />
                        )}
                      </div>
                    </div>
                    {clip.duration > 0 && (
                      <span style={{ position: 'absolute', bottom: '8px', right: '8px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.8)', fontSize: '10px', fontWeight: 700, color: '#ddd' }}>
                        {formatDuration(clip.duration)}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      {isOlympian 
                        ? 'Bodybuilding' 
                        : (isB2K ? 'Music' : (isKple ? (clip.sport === 'tct_network' ? 'TCT Network' : clip.sport === 'act_local' ? 'ACT Local' : clip.sport === 'the_walk' ? 'The Walk TV' : clip.sport === 'enlace_usa' ? 'Enlace USA' : clip.sport === 'positiv_movies' ? 'Positiv' : 'Smile of a Child') : (isVibe ? (clip.sport === 'news' ? 'News' : clip.sport === 'foxnews' ? 'Fox News' : clip.sport === 'politics' ? 'Politics' : clip.sport === 'entertainment' ? 'Entertainment' : clip.sport === 'money' ? 'Money' : 'Sports') : (clip.sport === 'cfb' ? 'Football' : clip.sport === 'cbb' ? 'Basketball' : 'Baseball'))))
                      } · {clip.source}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4, color: '#ccc', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {clip.headline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        </div>
      </section>

      {/* ═══ Video Player Overlay ═══ */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeVideo && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', padding: '60px 40px',
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '100%', maxWidth: '960px', position: 'relative' }}
              >
                <button onClick={() => setActiveVideo(null)}
                  style={{
                    position: 'absolute', 
                    top: '16px', 
                    right: '16px', 
                    zIndex: 10,
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.5)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.5)'; e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <X size={20} />
                </button>
                <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#000', aspectRatio: '16/9', position: 'relative' }}>
                  {(() => {
                    const isYouTube = activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be') || activeVideo.source === 'YouTube';
                    const isDailymotion = activeVideo.videoUrl.includes('dailymotion.com') || activeVideo.videoUrl.includes('dai.ly') || activeVideo.source === 'Dailymotion';
                    
                    if (isYouTube) {
                      const match = activeVideo.videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                      const ytId = (match && match[2].length === 11) ? match[2] : (activeVideo.id.length === 11 ? activeVideo.id : '');
                      
                      return (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&controls=1&rel=0`}
                          title={activeVideo.headline}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, border: 'none' }}
                        />
                      );
                    } else if (isDailymotion) {
                      const match = activeVideo.videoUrl.match(/\/video\/([a-zA-Z0-9]+)/);
                      const dmId = match ? match[1] : activeVideo.id;
                      return (
                        <iframe
                          src={`https://www.dailymotion.com/embed/video/${dmId}?autoplay=1`}
                          title={activeVideo.headline}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, border: 'none' }}
                        />
                      );
                    } else {
                      return (
                        <video
                          key={activeVideo.videoUrl}
                          ref={videoRef}
                          src={activeVideo.videoUrl}
                          controls
                          autoPlay
                          playsInline
                          preload="auto"
                          style={{ width: '100%', display: 'block', height: '100%', objectFit: 'contain' }}
                          poster={activeVideo.thumbnail}
                        >
                          <source src={activeVideo.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      );
                    }
                  })()}
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#fff' }}>{activeVideo.headline}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{activeVideo.description}</p>
                  </div>
                  {activeVideo.articleUrl && (
                    <a
                      href={activeVideo.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        background: accent,
                        color: '#000',
                        fontSize: '12px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                      Read Story <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
