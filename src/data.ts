export const ASSETS = {
  logo: 'https://vibenetwork.tv/wp-content/uploads/2026/02/white-vibe-black-tv-.png',
  heroMain: 'https://vibenetwork.tv/wp-content/uploads/2026/02/silhouette-dj-playing-music_1230721-3514.webp',
  heroAlt: 'https://vibenetwork.tv/wp-content/uploads/2026/02/headphones-displayed-against-dark-background_11zon.jpg',
};

// Array of actual scraped images from the user's original WordPress deployment
const REAL_IMAGES = [
  'https://vibenetwork.tv/wp-content/uploads/2026/02/silhouette-dj-playing-music_1230721-3514.webp',
  'https://vibenetwork.tv/wp-content/uploads/2026/02/mukap-vibe-tv-networkk_11zon.png',
  'https://vibenetwork.tv/wp-content/uploads/2026/02/music-background-vector-girl-listens-music-cartoon-illustration-isolated-white.webp',
  'https://vibenetwork.tv/wp-content/uploads/2026/02/headphones-displayed-against-dark-background_11zon.jpg'
];

// Helper function to cycle through the real images safely
const getRealImg = (idx: number) => REAL_IMAGES[idx % REAL_IMAGES.length];

// Generic placeholder video to demonstrate 45-second hover playback
export const MOCK_VIDEO = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

export const SCHEDULE_ITEMS = [
  { id: 101, title: 'Mainstage DJ Set - DJ Neon', time: '8:00 PM EST', image: getRealImg(0), tags: ['Live', 'Electronic'] },
  { id: 102, title: 'Fashion Week Exclusives', time: '9:30 PM EST', image: getRealImg(1), tags: ['Lifestyle', 'Premiere'] },
  { id: 103, title: 'Midnight Synthwave Mix', time: '11:00 PM EST', image: getRealImg(2), tags: ['Synthwave'] },
  { id: 104, title: 'After Hours Chill', time: '1:00 AM EST', image: getRealImg(3), tags: ['Lo-Fi', 'Relax'] },
  { id: 105, title: 'Sunrise Sessions', time: '4:00 AM EST', image: getRealImg(4), tags: ['Deep House'] },
];

export const GENRE_CATEGORIES = [
  {
    title: 'Vibe Favorites',
    items: [
      { id: 1, title: 'I Am David Jordan Live Set', image: getRealImg(0), tags: ['Live', 'Las Vegas'], videoUrl: MOCK_VIDEO },
      { id: 2, title: 'Futuristic DJ Vibes', image: getRealImg(1), tags: ['Electronic'], videoUrl: MOCK_VIDEO },
      { id: 3, title: 'Virtual Reality Sets', image: getRealImg(2), tags: ['VR', 'Party'], videoUrl: MOCK_VIDEO },
      { id: 4, title: 'Watch Live Now', image: getRealImg(3), tags: ['Live Stream'], videoUrl: MOCK_VIDEO },
      { id: 5, title: 'Deep House Flow', image: getRealImg(4), tags: ['Deep House'], videoUrl: MOCK_VIDEO },
      { id: 51, title: 'Morning Chill Sessions', image: getRealImg(5), tags: ['Chill'], videoUrl: MOCK_VIDEO },
      { id: 52, title: 'Top 40 Remixes Weekly', image: getRealImg(8), tags: ['Pop', 'Remix'], videoUrl: MOCK_VIDEO },
      { id: 53, title: 'Sunset Ibiza Mix', image: getRealImg(9), tags: ['Ibiza', 'Live'], videoUrl: MOCK_VIDEO },
      { id: 54, title: 'Techno Bunker', image: getRealImg(10), tags: ['Techno', 'Underground'], videoUrl: MOCK_VIDEO },
      { id: 55, title: 'Festival Mainstage', image: getRealImg(11), tags: ['Festival', 'EDM'], videoUrl: MOCK_VIDEO },
    ]
  },
  {
    title: 'Vibe Artists & DJs',
    items: [
      { id: 6, title: 'David Jordan', image: getRealImg(4), tags: ['Featured'], videoUrl: MOCK_VIDEO },
      { id: 7, title: 'DJ Neon', image: getRealImg(5), tags: ['Resident'], videoUrl: MOCK_VIDEO },
      { id: 8, title: 'VR Maestro', image: getRealImg(0), tags: ['Exclusive'], videoUrl: MOCK_VIDEO },
      { id: 9, title: 'Miss Beats', image: getRealImg(1), tags: ['New Artist'], videoUrl: MOCK_VIDEO },
      { id: 91, title: 'Synthia Core', image: getRealImg(2), tags: ['Synthwave'], videoUrl: MOCK_VIDEO },
      { id: 92, title: 'Bass Phantom', image: getRealImg(3), tags: ['Dubstep'], videoUrl: MOCK_VIDEO },
      { id: 93, title: 'DJ Kronic', image: getRealImg(4), tags: ['Hip Hop'], videoUrl: MOCK_VIDEO },
      { id: 94, title: 'Lumina', image: getRealImg(5), tags: ['Trance'], videoUrl: MOCK_VIDEO },
      { id: 95, title: 'The Architect', image: getRealImg(6), tags: ['Producer'], videoUrl: MOCK_VIDEO },
    ]
  },
  {
    title: 'New to the Network',
    items: [
      { id: 10, title: 'Global Beats S2', image: getRealImg(7), tags: ['Series'], videoUrl: MOCK_VIDEO },
      { id: 11, title: 'Fashion & Music', image: getRealImg(8), tags: ['Lifestyle'], videoUrl: MOCK_VIDEO },
      { id: 12, title: 'I Am David Jordan', image: getRealImg(9), tags: ['Live Set'], videoUrl: MOCK_VIDEO },
      { id: 13, title: 'Night Life VR', image: getRealImg(10), tags: ['Immersive'], videoUrl: MOCK_VIDEO },
      { id: 14, title: 'Festival Recaps', image: getRealImg(1), tags: ['Docuseries'], videoUrl: MOCK_VIDEO },
      { id: 15, title: 'Studio Sessions', image: getRealImg(2), tags: ['Behind The Scenes'], videoUrl: MOCK_VIDEO },
      { id: 16, title: 'Backstage Pass', image: getRealImg(3), tags: ['Interviews'], videoUrl: MOCK_VIDEO },
      { id: 17, title: 'DJs In Cars', image: getRealImg(4), tags: ['Comedy'], videoUrl: MOCK_VIDEO },
      { id: 18, title: 'Beat Making 101', image: getRealImg(5), tags: ['Tutorial'], videoUrl: MOCK_VIDEO },
    ]
  }
];
