export const ASSETS = {
  logo: 'https://vibenetwork.tv/wp-content/uploads/2026/02/white-vibe-black-tv-.png',
  heroMain: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=2500',
  heroAlt: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
};

// Generative AI B2B Images
const B2B_IMAGES = [
  'https://image.pollinations.ai/prompt/modern%20corporate%20server%20room%20glowing%20blue%20lights?width=800&height=600&nologo=true',
  'https://image.pollinations.ai/prompt/business%20executives%20shaking%20hands%20modern%20office?width=800&height=600&nologo=true',
  'https://image.pollinations.ai/prompt/saas%20dashboard%20analytics%20glowing%20hologram?width=800&height=600&nologo=true',
  'https://image.pollinations.ai/prompt/corporate%20presentation%20screen%20boardroom%20meeting?width=800&height=600&nologo=true',
  'https://image.pollinations.ai/prompt/cloud%20architecture%20network%20diagram%20high%20tech?width=800&height=600&nologo=true',
  'https://image.pollinations.ai/prompt/business%20woman%20smiling%20laptop%20startup?width=800&height=600&nologo=true',
  'https://image.pollinations.ai/prompt/global%20network%20connection%20earth%20hologram%20corporate?width=800&height=600&nologo=true',
  'https://image.pollinations.ai/prompt/programmers%20working%20in%20dark%20mode%20office?width=800&height=600&nologo=true'
];

// Helper function to cycle through the real images safely
const getRealImg = (idx: number) => B2B_IMAGES[idx % B2B_IMAGES.length];

// Generic placeholder video to demonstrate 45-second hover playback
export const MOCK_VIDEO = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

export const SCHEDULE_ITEMS = [
  { id: 101, title: 'Live Corporate Board Meeting', time: '8:00 AM EST', image: getRealImg(3), tags: ['Live', 'Corporate'] },
  { id: 102, title: 'Q3 Earnings Call Broadcast', time: '10:30 AM EST', image: getRealImg(1), tags: ['Finance', 'Investor Relations'] },
  { id: 103, title: 'SaaS Platform 2.0 Unveil', time: '1:00 PM EST', image: getRealImg(2), tags: ['Product Launch'] },
  { id: 104, title: 'Global All-Hands Meeting', time: '3:00 PM EST', image: getRealImg(5), tags: ['Internal', 'All-Hands'] },
  { id: 105, title: 'Technical Server Maintenance', time: '11:00 PM EST', image: getRealImg(0), tags: ['Engineering'] },
];

export const GENRE_CATEGORIES = [
  {
    title: 'Platform Features & Architecture',
    items: [
      { id: 1, title: 'Enterprise Streaming Logic', image: getRealImg(4), tags: ['Architecture'], videoUrl: MOCK_VIDEO },
      { id: 2, title: 'Analytics Dashboard', image: getRealImg(2), tags: ['Data', 'SaaS'], videoUrl: MOCK_VIDEO },
      { id: 3, title: 'Global CDN Delivery', image: getRealImg(6), tags: ['Network'], videoUrl: MOCK_VIDEO },
      { id: 4, title: 'White Label Integrations', image: getRealImg(7), tags: ['API'], videoUrl: MOCK_VIDEO },
      { id: 5, title: 'Server Infrastructure', image: getRealImg(0), tags: ['Ops'], videoUrl: MOCK_VIDEO }
    ]
  },
  {
    title: 'Business Use Cases',
    items: [
      { id: 6, title: 'Investor Relations Live', image: getRealImg(1), tags: ['Finance'], videoUrl: MOCK_VIDEO },
      { id: 7, title: 'Corporate Townhalls', image: getRealImg(5), tags: ['Internal'], videoUrl: MOCK_VIDEO },
      { id: 8, title: 'Product Demos', image: getRealImg(2), tags: ['Sales'], videoUrl: MOCK_VIDEO },
      { id: 9, title: 'Boardroom Boardcasts', image: getRealImg(3), tags: ['Executive'], videoUrl: MOCK_VIDEO }
    ]
  },
  {
    title: 'Success Stories',
    items: [
      { id: 10, title: 'TechCorp Summit 2026', image: getRealImg(7), tags: ['Case Study'], videoUrl: MOCK_VIDEO },
      { id: 11, title: 'Global Bank Expansion', image: getRealImg(6), tags: ['Finance'], videoUrl: MOCK_VIDEO },
      { id: 12, title: 'Startup Pitch Demo', image: getRealImg(5), tags: ['Venture'], videoUrl: MOCK_VIDEO },
      { id: 13, title: 'Engineering Deep Dive', image: getRealImg(0), tags: ['Technical'], videoUrl: MOCK_VIDEO }
    ]
  }
];
