import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Play, Tv, X, ChevronLeft, ChevronRight, Clock, ExternalLink, Video, VideoOff, Mic, MicOff, Copy, Check, Send, Globe, Lock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { isOlympianConfig, isB2kConfig, isKpleConfig } from '../lib/whitelabel';

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

const VIBE_100_FEEDS = [
  { key: 'avo', label: '🎒 AVO Channel' },
  { key: 'olympia', label: '🏆 Muscle & Fitness' },
  { key: 'b2k', label: '🎤 B2K Channel' },
  { key: 'kple', label: '📺 Christian Revival' },
  { key: 'finfire', label: '💵 FINFIRE Channel' },
];

const VIBE_100_CLIPS: VideoClip[] = [
  // AVO Channel
  {
    id: 'vyqy7PcDGLM',
    headline: 'AVO Campus Tour Highlight Reel',
    description: 'Explore the campus lifestyle and exclusive tailgate essentials with the official AVO team tour.',
    thumbnail: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=vyqy7PcDGLM',
    duration: 540,
    source: 'AVO Channel',
    sport: 'avo'
  },
  {
    id: 'MCWS-experience',
    headline: "Men's College World Series Tailgate Gear Showcase",
    description: 'AVO breaks down the ultimate collegiate tailgate essentials and new arrivals for the championship season.',
    thumbnail: 'https://i3.ytimg.com/vi/vyqy7PcDGLM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=vyqy7PcDGLM',
    duration: 320,
    source: 'AVO Channel',
    sport: 'avo'
  },
  {
    id: 'avo-lifestyle',
    headline: 'AVO Premium College Apparel Style Guide',
    description: 'From campus to gameday: how to style the latest AVO collections and represent your school in style.',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=vyqy7PcDGLM',
    duration: 210,
    source: 'AVO Channel',
    sport: 'avo'
  },

  // Mr. Olympia Channel
  {
    id: 'SV7JP7y80UM',
    headline: 'Mr. Olympia 2024 Men’s Open Prejudging Analysis',
    description: 'Expert bodybuilding commentators break down the top contenders and side-by-side pose comparisons from the main stage.',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=SV7JP7y80UM',
    duration: 1845,
    source: 'Mr. Olympia Channel',
    sport: 'olympia'
  },
  {
    id: 'MzWgJtFIxg8',
    headline: 'The Bodybuilding Legends That Changed the Sport',
    description: 'A look back at how Arnold Schwarzenegger, Lee Haney, Dorian Yates and Ronnie Coleman redefined muscular perfection.',
    thumbnail: 'https://i.ytimg.com/vi/MzWgJtFIxg8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=MzWgJtFIxg8',
    duration: 780,
    source: 'Mr. Olympia Channel',
    sport: 'olympia'
  },
  {
    id: 'dTqpdNacxYM',
    headline: 'Cutler Nutrition Q&A with 4x Mr. Olympia Jay Cutler',
    description: 'Jay Cutler answers fan questions about his training routines, nutrition strategies, and championship mindset.',
    thumbnail: 'https://i.ytimg.com/vi/dTqpdNacxYM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dTqpdNacxYM',
    duration: 645,
    source: 'Mr. Olympia Channel',
    sport: 'olympia'
  },

  // B2K Channel
  {
    id: 'lgyEYMxzVpw',
    headline: 'B2K Reunion Tour Live Performance',
    description: 'Watch the highlights and full-bleed stage footage of B2K performing their greatest hits live on tour.',
    thumbnail: '/n2n/b2k_tour.png',
    videoUrl: 'https://www.youtube.com/watch?v=lgyEYMxzVpw',
    duration: 238,
    source: 'B2K Channel',
    sport: 'b2k'
  },
  {
    id: 'CgiX53hjAPc',
    headline: 'B2K - Uh Huh (Official Music Video)',
    description: "Rewind to the platinum-selling debut single 'Uh Huh' off B2K's self-titled record.",
    thumbnail: 'https://i.ytimg.com/vi/CgiX53hjAPc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=CgiX53hjAPc',
    duration: 253,
    source: 'B2K Channel',
    sport: 'b2k'
  },
  {
    id: '6OihwykYdBc',
    headline: 'B2K - Girlfriend (Official Music Video)',
    description: "Experience the iconic choreography and vocals in the official video for 'Girlfriend'.",
    thumbnail: 'https://i.ytimg.com/vi/6OihwykYdBc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=6OihwykYdBc',
    duration: 204,
    source: 'B2K Channel',
    sport: 'b2k'
  },

  // Christian Revival Channel
  {
    id: '5BFZ5rg1ZLc',
    headline: 'Walking in Faith — Daily Gospel Message',
    description: 'An inspiring and empowering sermon on relying on God through times of spiritual drought and challenge.',
    thumbnail: 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=5BFZ5rg1ZLc',
    duration: 2450,
    source: 'Christian Revival Channel',
    sport: 'kple'
  },
  {
    id: 'vwmCBGEmpY0',
    headline: 'God is Fighting For You in Hidden Ways',
    description: 'Pastor James breaks down the promises of Ephesians 2 and how God works behind the scenes in our lives.',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=vwmCBGEmpY0',
    duration: 2120,
    source: 'Christian Revival Channel',
    sport: 'kple'
  },
  {
    id: 'vdHg6fe8P5Y',
    headline: 'Attention Central Texas - Local Public Service Bulletin',
    description: 'Highlighting community initiatives, church schedules, and non-profit projects in Central Texas.',
    thumbnail: 'https://images.unsplash.com/photo-1492534513006-37715f336a39?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=vdHg6fe8P5Y',
    duration: 645,
    source: 'Christian Revival Channel',
    sport: 'kple'
  },

  // FINFIRE Channel
  {
    id: 'vwOxJJ80t3k',
    headline: 'Index Fund Investing Explained in 10 Minutes',
    description: 'A beginner-friendly guide to passive index fund investing, asset allocation, and building generational wealth.',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=vwOxJJ80t3k',
    duration: 600,
    source: 'FINFIRE Channel',
    sport: 'finfire'
  },
  {
    id: 'finfire-realestate',
    headline: 'Why KFC Has Fallen Behind In The U.S. (Market Analysis)',
    description: 'An analysis of corporate strategy, brand dilution, and real estate portfolios of fast food franchises.',
    thumbnail: 'https://i3.ytimg.com/vi/vwOxJJ80t3k/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=vwOxJJ80t3k',
    duration: 540,
    source: 'FINFIRE Channel',
    sport: 'finfire'
  },
  {
    id: 'finfire-passive',
    headline: 'Passive Income Streams: 7 Ideas to Start Today',
    description: 'Learn how to generate cash flow through dividend investing, rental real estate, and digital properties.',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.youtube.com/watch?v=vwOxJJ80t3k',
    duration: 480,
    source: 'FINFIRE Channel',
    sport: 'finfire'
  }
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
  ctx: { isOlympian?: boolean; isB2K?: boolean; isVibe?: boolean; isKple?: boolean; isVibe100?: boolean }
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
  } else if (ctx.isVibe100) {
    genrePrompt = 'premium lifestyle and entertainment coverage, modern neon aesthetic, high-end broadcast studio';
  } else {
    // AVO / College Sports fallback
    genrePrompt = 'college sports action shot, dynamic college athletic photography, high energy action scene, stadium background';
  }

  const prompt = `${genrePrompt}: ${cleanHeadline}, photorealistic, 16:9 aspect ratio`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=960&height=540&nologo=true&seed=${seed}`;
};

export default function WatchLive({ accent = '#D35400', isOlympian = false, isB2K = false, isVibe = false, isKple = false, isVibe100 = false }: { accent?: string; isOlympian?: boolean; isB2K?: boolean; isVibe?: boolean; isKple?: boolean; isVibe100?: boolean }) {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoClip | null>(null);
  const [filter, setFilter] = useState('all');
  const [lastChecked, setLastChecked] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Fan Zone & Co-watching state
  const [showFanZone, setShowFanZone] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; user: string; text: string; avatar: string; time: string; isSelf?: boolean }[]>([]);
  const [reactions, setReactions] = useState<{ id: number; char: string; left: number }[]>([]);
  const [coWatchers, setCoWatchers] = useState([
    { id: '1', name: 'Alex', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', speaking: true, hasVideo: true },
    { id: '2', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', speaking: false, hasVideo: true },
    { id: '3', name: 'Jordan', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop', speaking: true, hasVideo: false },
  ]);

  // Authenticated User / Session Guest Sync
  const [currentUser, setCurrentUser] = useState<{ name: string; avatar: string }>({
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();

          if (profile) {
            setCurrentUser({
              name: profile.username || 'User',
              avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username || 'U')}&background=000&color=fff`,
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Error fetching user auth/profile:', err);
      }

      // Guest fallback with sessionStorage persistence
      let guestName = sessionStorage.getItem('vibe_guest_name');
      let guestAvatar = sessionStorage.getItem('vibe_guest_avatar');
      if (!guestName) {
        const randId = Math.floor(100 + Math.random() * 900);
        guestName = `Guest #${randId}`;
        guestAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randId}`;
        sessionStorage.setItem('vibe_guest_name', guestName);
        sessionStorage.setItem('vibe_guest_avatar', guestAvatar);
      }
      setCurrentUser({ name: guestName, avatar: guestAvatar });
    };

    fetchUser();
  }, []);

  const channelRef = useRef<any>(null);

  // Reaction addition with optional broadcast trigger
  const addReaction = (char: string, broadcast = false) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      char,
      left: 10 + Math.random() * 80,
    };
    setReactions(prev => [...prev, newReaction]);

    if (broadcast && channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'reaction',
        payload: { char }
      });
    }

    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2500);
  };

  // Supabase Realtime Channel Registration & Broadcast listeners
  useEffect(() => {
    if (!activeVideo || !showFanZone) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const roomChannel = supabase.channel(`room:${activeVideo.id}`, {
      config: {
        broadcast: { self: false }
      }
    });

    roomChannel
      .on('broadcast', { event: 'chat' }, (payload: any) => {
        setChatMessages(prev => [
          ...prev,
          {
            id: payload.payload.id,
            user: payload.payload.user,
            text: payload.payload.text,
            avatar: payload.payload.avatar,
            time: payload.payload.time,
            isSelf: false
          }
        ]);
      })
      .on('broadcast', { event: 'reaction' }, (payload: any) => {
        addReaction(payload.payload.char, false);
      })
      .subscribe((status) => {
        console.log(`Supabase Realtime Channel: room:${activeVideo.id} status is ${status}`);
      });

    channelRef.current = roomChannel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [activeVideo, showFanZone]);

  // Simulate speaking indicator changes for other watch members
  useEffect(() => {
    if (!activeVideo || !showFanZone) return;
    const talkInterval = setInterval(() => {
      setCoWatchers(prev =>
        prev.map(w => {
          if (Math.random() < 0.4) {
            return { ...w, speaking: !w.speaking };
          }
          return w;
        })
      );
    }, 2800);
    return () => clearInterval(talkInterval);
  }, [activeVideo, showFanZone]);

  // Simulated live chat scrolling
  useEffect(() => {
    if (!activeVideo || !showFanZone) return;

    // Load initial messages
    const initialMsgs = [
      { id: 'm1', user: 'Alex', text: isOlympian ? 'This physique is absolutely stacked!' : isB2K ? 'B2K Uh Huh is an all-time classic.' : isKple ? 'Such a powerful word this evening.' : 'So hyped for this stream!', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', time: '10:04 PM' },
      { id: 'm2', user: 'Sarah', text: isOlympian ? 'Check out the vascularity on stage. Wow.' : isB2K ? 'I remember trying to learn this dance in my living room 😂' : isKple ? 'Inspirational. Amen.' : 'This layout looks amazing.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', time: '10:05 PM' }
    ];
    setChatMessages(initialMsgs);

    const messagePool = isOlympian
      ? [
          { user: 'Sarah', text: 'Classic physique is stacked this year!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
          { user: 'Jordan', text: 'Look at the side chest pose, crazy conditioning!', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
          { user: 'Alex', text: 'Who do you guys think takes the Sandow?', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
          { user: 'Mike', text: 'Back double biceps is unreal.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
          { user: 'Emma', text: 'Jay Cutler looking massive here!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
        ]
      : isB2K
      ? [
          { user: 'Jordan', text: 'Omarion\'s choreography is legendary.', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
          { user: 'Alex', text: 'That R&B sound holds up so well.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
          { user: 'Sarah', text: 'Gots Ta Be is my favorite track honestly!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
          { user: 'Devin', text: 'Millennium Tour was crazy.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
          { user: 'Keisha', text: 'Can we talk about the baggy jeans? Iconic.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' },
        ]
      : isKple
      ? [
          { user: 'Sarah', text: 'Amen! Praise God.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
          { user: 'Jordan', text: 'Beautiful message this morning.', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
          { user: 'Alex', text: 'So blessed to be tuning in live.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
          { user: 'Pastor John', text: 'Walking in faith is a daily walk.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
          { user: 'Grace', text: 'God is good all the time. 🙏', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
        ]
      : [
          { user: 'Sarah', text: 'This stream is super crisp!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
          { user: 'Jordan', text: 'Wow, check that highlight out!', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop' },
          { user: 'Alex', text: 'Let\'s gooo! Insane timing.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
          { user: 'Chris', text: 'Unbelievable play right there.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop' },
          { user: 'Jessica', text: 'Avonistas assemble! 😂', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' },
        ];

    const chatTimer = setInterval(() => {
      const randomMsg = messagePool[Math.floor(Math.random() * messagePool.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          user: randomMsg.user,
          text: randomMsg.text,
          avatar: randomMsg.avatar,
          time: timeStr
        }
      ]);
    }, 4500);

    return () => clearInterval(chatTimer);
  }, [activeVideo, showFanZone, isOlympian, isB2K, isKple]);

  // Scroll chat bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const feedsToUse = isOlympian ? OLYMPIAN_FEEDS : (isB2K ? B2K_FEEDS : (isVibe100 ? VIBE_100_FEEDS : (isVibe ? VIBE_FEEDS : (isKple ? KPLE_FEEDS : FEEDS))));

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
      } else if (isVibe100) {
        const dynamicClips: VideoClip[] = [];
        
        // 1. Fetch child network videos from Supabase
        try {
          const { data: vidsData, error: vidsErr } = await supabase
            .from('videos')
            .select('*, creator:profiles!inner(whitelabel_id, whitelabel:whitelabel_configs!inner(name, parent_network_id))')
            .eq('creator.whitelabel.parent_network_id', 'e5c100aa-c08f-4260-8540-a0cc8bed4e11')
            .order('created_at', { ascending: false });

          if (!vidsErr && vidsData) {
            for (const v of vidsData) {
              const netName = v.creator?.whitelabel?.name || '';
              let feedKey = 'avo';
              const mockWl = { name: netName };
              if (isOlympianConfig(mockWl)) {
                feedKey = 'olympia';
              } else if (isB2kConfig(mockWl)) {
                feedKey = 'b2k';
              } else if (isKpleConfig(mockWl)) {
                feedKey = 'kple';
              } else if (netName.toLowerCase().includes('finfire')) {
                feedKey = 'finfire';
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
          console.warn("Failed to load dynamic VIBE 100 clips:", err);
        }
        
        // Sort dynamic clips by date descending
        dynamicClips.sort((a, b) => (b.published?.getTime() || 0) - (a.published?.getTime() || 0));
        allClips.push(...dynamicClips);
        
        // 2. Append static fallback clips for VIBE 100
        for (const item of VIBE_100_CLIPS) {
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
  }, [isOlympian, isB2K, isVibe, isKple, isVibe100]);

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
          <div className="filter-slider-container">
            {[{ key: 'all', label: 'All' }, ...feedsToUse.map(f => ({ key: f.key, label: f.label }))].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                flexShrink: 0,
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
                src={featured.thumbnail || getAiThumbnail(featured.headline, { isOlympian, isB2K, isVibe, isKple, isVibe100 })} 
                alt={featured.headline} 
                onError={(e) => {
                  e.currentTarget.src = getAiThumbnail(featured.headline, { isOlympian, isB2K, isVibe, isKple, isVibe100 });
                }}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (!img.src.includes('image.pollinations.ai') && img.naturalWidth < 480) {
                    img.src = getAiThumbnail(featured.headline, { isOlympian, isB2K, isVibe, isKple, isVibe100 });
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
                      : (isB2K ? '🎤 R&B Music' : (isKple ? (featured.sport === 'tct_network' ? '📺 TCT Network' : featured.sport === 'act_local' ? '🎥 ACT Local' : featured.sport === 'the_walk' ? '🚶 The Walk TV' : featured.sport === 'enlace_usa' ? '🌎 Enlace USA' : featured.sport === 'positiv_movies' ? '🎬 Positiv Family' : '👶 Smile of a Child') : (isVibe ? (featured.sport === 'news' ? '📰 News' : featured.sport === 'foxnews' ? '🦊 Fox News' : featured.sport === 'politics' ? '⚖️ Politics' : featured.sport === 'entertainment' ? '🎭 Entertainment' : featured.sport === 'money' ? '💵 Money' : '🏈 Sports') : (isVibe100 ? (featured.sport === 'avo' ? '🎒 AVO Channel' : featured.sport === 'olympia' ? '🏆 Muscle & Fitness' : featured.sport === 'b2k' ? '🎤 B2K Channel' : featured.sport === 'kple' ? '📺 Christian Revival' : '💵 FINFIRE Channel') : (featured.sport === 'cfb' ? '🏈 Football' : featured.sport === 'cbb' ? '🏀 Basketball' : '⚾ Baseball')))))}
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
                      src={clip.thumbnail || getAiThumbnail(clip.headline, { isOlympian, isB2K, isVibe, isKple, isVibe100 })} 
                      alt={clip.headline} 
                      onError={(e) => {
                        e.currentTarget.src = getAiThumbnail(clip.headline, { isOlympian, isB2K, isVibe, isKple, isVibe100 });
                      }}
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        if (!img.src.includes('image.pollinations.ai') && img.naturalWidth < 480) {
                          img.src = getAiThumbnail(clip.headline, { isOlympian, isB2K, isVibe, isKple, isVibe100 });
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
                        : (isB2K ? 'Music' : (isKple ? (clip.sport === 'tct_network' ? 'TCT Network' : clip.sport === 'act_local' ? 'ACT Local' : clip.sport === 'the_walk' ? 'The Walk TV' : clip.sport === 'enlace_usa' ? 'Enlace USA' : clip.sport === 'positiv_movies' ? 'Positiv' : 'Smile of a Child') : (isVibe ? (clip.sport === 'news' ? 'News' : clip.sport === 'foxnews' ? 'Fox News' : clip.sport === 'politics' ? 'Politics' : clip.sport === 'entertainment' ? 'Entertainment' : clip.sport === 'money' ? 'Money' : 'Sports') : (isVibe100 ? (clip.sport === 'avo' ? 'AVO Channel' : clip.sport === 'olympia' ? 'Muscle & Fitness' : clip.sport === 'b2k' ? 'B2K Channel' : clip.sport === 'kple' ? 'Christian Revival' : 'FINFIRE Channel') : (clip.sport === 'cfb' ? 'Football' : clip.sport === 'cbb' ? 'Basketball' : 'Baseball')))))} · {clip.source}
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
              className="watch-live-modal"
              style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
                overflowY: 'auto',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                flexDirection: 'column', padding: '80px 40px 40px 40px',
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: showFanZone ? '1280px' : '960px',
                  position: 'relative',
                  transition: 'max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Close Button */}
                <button onClick={() => { setActiveVideo(null); setShowFanZone(false); }}
                  style={{
                    position: 'absolute', 
                    top: '-50px', 
                    right: '0', 
                    zIndex: 100,
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

                <div className="watch-live-content-row" style={{ display: 'flex', gap: '20px', alignItems: 'stretch', width: '100%', flexWrap: 'wrap' }}>
                  {/* Left Column: Video player, title & description */}
                  <div className={showFanZone ? "watch-live-left-col-fanzone" : "watch-live-left-col"} style={{ flex: showFanZone ? '0 0 65%' : '1 1 100%', minWidth: '320px', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#000', aspectRatio: '16/9', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
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

                      {/* Floating Reactions overlay */}
                      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 20 }}>
                        <AnimatePresence>
                          {reactions.map(r => (
                            <motion.div
                              key={r.id}
                              initial={{ y: '100%', x: `${r.left}%`, opacity: 0, scale: 0.6 }}
                              animate={{ 
                                y: '-20%', 
                                x: [`${r.left}%`, `${r.left + (Math.random() * 16 - 8)}%`, `${r.left + (Math.random() * 24 - 12)}%`],
                                opacity: [0, 1, 1, 0],
                                scale: [0.6, 1.2, 1.2, 0.8]
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 2.2, ease: 'easeOut' }}
                              style={{
                                position: 'absolute',
                                bottom: '20px',
                                fontSize: '36px',
                                textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                              }}
                            >
                              {r.char}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: 800, color: '#fff' }}>{activeVideo.headline}</h3>
                        <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: 1.5 }}>{activeVideo.description}</p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                        {/* Fan Zone Toggle Button */}
                        <button
                          onClick={() => setShowFanZone(!showFanZone)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 22px',
                            borderRadius: '30px',
                            background: showFanZone 
                              ? 'rgba(255,255,255,0.08)' 
                              : `linear-gradient(135deg, ${accent}, #ff0050)`,
                            border: showFanZone ? '1px solid rgba(255,255,255,0.2)' : 'none',
                            color: '#fff',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: showFanZone ? 'none' : `0 4px 15px ${accent}44`,
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseOver={e => {
                            if (!showFanZone) {
                              e.currentTarget.style.transform = 'scale(1.03)';
                              e.currentTarget.style.boxShadow = `0 6px 20px ${accent}66`;
                            } else {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                            }
                          }}
                          onMouseOut={e => {
                            if (!showFanZone) {
                              e.currentTarget.style.transform = 'none';
                              e.currentTarget.style.boxShadow = `0 4px 15px ${accent}44`;
                            } else {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            }
                          }}
                        >
                          <Sparkles size={14} fill={showFanZone ? 'none' : '#fff'} />
                          {showFanZone ? 'Leave Fan Zone' : '🎉 Join Fan Zone'}
                        </button>

                        {activeVideo.articleUrl && (
                          <a
                            href={activeVideo.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '10px 22px',
                              borderRadius: '30px',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: '#fff',
                              fontSize: '12px',
                              fontWeight: 800,
                              textDecoration: 'none',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.2s',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          >
                            Read Story <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Fan Zone Panel */}
                  <AnimatePresence>
                    {showFanZone && (
                      <motion.div
                        initial={{ opacity: 0, x: 30, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: '33%' }}
                        exit={{ opacity: 0, x: 30, width: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="watch-live-right-col"
                        style={{
                          minWidth: '350px',
                          height: 'auto',
                          minHeight: '400px',
                          maxHeight: 'calc(960px * 9 / 16 + 56px)',
                          background: 'rgba(15, 15, 20, 0.65)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          backdropFilter: 'blur(20px)',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        }}
                      >
                        {/* Header */}
                        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff3b30' }} />
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>Fan Zone Room</h4>
                          </div>
                          <span style={{ fontSize: '11px', color: '#ff3b30', fontWeight: 700, background: 'rgba(255, 59, 48, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>LIVE</span>
                        </div>

                        {/* Co-Watchers Grid */}
                        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Watch Party</span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => setIsCameraOn(!isCameraOn)}
                                style={{
                                  width: '28px', height: '28px', borderRadius: '50%',
                                  background: isCameraOn ? `${accent}dd` : 'rgba(255,255,255,0.08)',
                                  border: 'none', color: '#fff', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'all 0.2s',
                                }}
                              >
                                {isCameraOn ? <Video size={13} /> : <VideoOff size={13} />}
                              </button>
                              <button
                                onClick={() => setIsMuted(!isMuted)}
                                style={{
                                  width: '28px', height: '28px', borderRadius: '50%',
                                  background: isMuted ? '#ff3b30' : 'rgba(255,255,255,0.08)',
                                  border: 'none', color: '#fff', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'all 0.2s',
                                }}
                              >
                                {isMuted ? <MicOff size={13} /> : <Mic size={13} />}
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflowX: 'auto', padding: '4px 0', scrollbarWidth: 'none' }}>
                            {/* Local User */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <div style={{ position: 'relative' }}>
                                <motion.div
                                  animate={{
                                    boxShadow: (!isMuted && !isCameraOn)
                                      ? [`0 0 0 0px ${accent}66`, `0 0 0 8px ${accent}00`]
                                      : '0 0 0 0px transparent'
                                  }}
                                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                  style={{
                                    width: '44px', height: '44px', borderRadius: '50%',
                                    border: `2px solid ${!isMuted ? accent : 'rgba(255,255,255,0.2)'}`,
                                    padding: '2px', background: '#000',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden'
                                  }}
                                >
                                  {isCameraOn ? (
                                    <div style={{ width: '100%', height: '100%', background: '#1c1c1e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                      <motion.div
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4cd964', position: 'absolute', top: '4px', right: '4px' }}
                                      />
                                      <span style={{ fontSize: '9px', fontWeight: 900, color: accent }}>CAM</span>
                                    </div>
                                  ) : (
                                    <img 
                                      src={currentUser.avatar} 
                                      alt={currentUser.name} 
                                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                                    />
                                  )}
                                </motion.div>
                                {isMuted && (
                                  <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#ff3b30', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000' }}>
                                    <MicOff size={8} color="#fff" />
                                  </div>
                                )}
                              </div>
                              <span style={{ fontSize: '9px', color: '#fff', fontWeight: 600 }}>{currentUser.name.split(' ')[0]}</span>
                            </div>

                            {/* Co-watchers */}
                            {coWatchers.map(w => (
                              <div key={w.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ position: 'relative' }}>
                                  <motion.div
                                    animate={{
                                      boxShadow: w.speaking 
                                        ? [`0 0 0 0px ${accent}55`, `0 0 0 8px ${accent}00`] 
                                        : '0 0 0 0px transparent'
                                    }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                                    style={{
                                      width: '44px', height: '44px', borderRadius: '50%',
                                      border: `2px solid ${w.speaking ? accent : 'rgba(255,255,255,0.1)'}`,
                                      padding: '2px', background: '#000',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    <img src={w.avatar} alt={w.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                  </motion.div>
                                  {w.speaking && (
                                    <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: accent, borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000' }}>
                                      <span style={{ fontSize: '7px', fontWeight: 900, color: '#000' }}>🎙️</span>
                                    </div>
                                  )}
                                </div>
                                <span style={{ fontSize: '9px', color: '#888' }}>{w.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Room link */}
                        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                          <button
                            onClick={() => setIsPrivate(!isPrivate)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '4px',
                              padding: '4px 8px', borderRadius: '4px',
                              background: isPrivate ? 'rgba(255, 59, 48, 0.1)' : 'rgba(76, 217, 100, 0.1)',
                              border: `1px solid ${isPrivate ? 'rgba(255, 59, 48, 0.3)' : 'rgba(76, 217, 100, 0.3)'}`,
                              color: isPrivate ? '#ff3b30' : '#4cd964',
                              fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                            }}
                          >
                            {isPrivate ? <Lock size={10} /> : <Globe size={10} />}
                            {isPrivate ? 'Private Room' : 'Public Lobby'}
                          </button>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '10px', color: '#555' }}>Invite:</span>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', padding: '2px 4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <input 
                                readOnly 
                                value={`vibe.network/room/${activeVideo.id.substring(0,6)}`} 
                                style={{ background: 'none', border: 'none', color: '#666', fontSize: '9px', width: '90px', outline: 'none' }} 
                              />
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`https://vibe.network/room/${activeVideo.id}`);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                style={{ background: 'none', border: 'none', color: copied ? accent : '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                {copied ? <Check size={10} /> : <Copy size={10} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Scrolling Chat */}
                        <div ref={chatScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {chatMessages.map(msg => (
                            <div key={msg.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                              <img src={msg.avatar} alt={msg.user} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', marginTop: '2px' }} />
                              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 800, color: msg.isSelf ? accent : '#eee' }}>{msg.user}</span>
                                  <span style={{ fontSize: '8px', color: '#444' }}>{msg.time}</span>
                                </div>
                                <span style={{ fontSize: '12px', color: '#ccc', lineHeight: 1.4, wordBreak: 'break-word' }}>{msg.text}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Reaction Bar & Message Input */}
                        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
                          {/* Emoji Reactions */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', background: 'rgba(255,255,255,0.02)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            {['🔥', '😮', '😂', '👏', '💯'].map(emoji => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(emoji, true)}
                                style={{
                                  background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer',
                                  transition: 'transform 0.1s',
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.3)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>

                          {/* Message Input */}
                          <form
                            onSubmit={e => {
                              e.preventDefault();
                              if (!chatInput.trim()) return;
                              const msgId = Math.random().toString();
                              const now = new Date();
                              const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                              const newMsg = {
                                id: msgId,
                                user: currentUser.name,
                                text: chatInput,
                                avatar: currentUser.avatar,
                                time: timeStr,
                                isSelf: true,
                              };
                              setChatMessages(prev => [...prev, newMsg]);

                              if (channelRef.current) {
                                channelRef.current.send({
                                  type: 'broadcast',
                                  event: 'chat',
                                  payload: {
                                    id: msgId,
                                    user: currentUser.name,
                                    text: chatInput,
                                    avatar: currentUser.avatar,
                                    time: timeStr
                                  }
                                });
                              }

                              setChatInput('');
                            }}
                            style={{ display: 'flex', gap: '8px' }}
                          >
                            <input
                              type="text"
                              value={chatInput}
                              onChange={e => setChatInput(e.target.value)}
                              placeholder="Say something..."
                              style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                padding: '8px 16px',
                                color: '#fff',
                                fontSize: '12px',
                                outline: 'none',
                              }}
                            />
                            <button
                              type="submit"
                              style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: accent, border: 'none', color: '#000',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'opacity 0.2s',
                              }}
                              onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                              onMouseOut={e => e.currentTarget.style.opacity = '1'}
                            >
                              <Send size={12} />
                            </button>
                          </form>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
