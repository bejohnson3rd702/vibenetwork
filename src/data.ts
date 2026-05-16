export const ASSETS = {
  logo: 'https://vibenetwork.tv/wp-content/uploads/2026/02/white-vibe-black-tv-.png',
  heroMain: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=2500',
  heroAlt: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
};

const DJ_IMAGES = [
  'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1493225457124-a1a2a5f275bd?auto=format&fit=crop&w=800&q=80'
];

const getRealImg = (idx: number) => DJ_IMAGES[idx % DJ_IMAGES.length];

export const MOCK_VIDEO = 'https://www.youtube.com/watch?v=c0-hvjV2A5Y';

export const SCHEDULE_ITEMS = [
  { id: 101, title: 'Boiler Room London Live', time: '8:00 PM EST', image: getRealImg(3), tags: ['Live', 'House'] },
  { id: 102, title: 'Ultra Music Festival Main Stage', time: '10:30 PM EST', image: getRealImg(1), tags: ['Festival', 'EDM'] },
  { id: 103, title: 'Defected Records Ibiza Mix', time: '1:00 AM EST', image: getRealImg(2), tags: ['Deep House', 'Ibiza'] },
  { id: 104, title: 'Hip Hop All Stars Concert', time: '3:00 AM EST', image: getRealImg(5), tags: ['Live', 'Hip Hop'] },
  { id: 105, title: 'Afterhours Techno Set', time: '5:00 AM EST', image: getRealImg(0), tags: ['Techno', 'Underground'] },
];

export const GENRE_CATEGORIES = [
  {
    title: 'Featured DJ Sets',
    items: [
      { id: 1, title: 'Fred Again.. Boiler Room', image: getRealImg(4), tags: ['House', 'Live'], videoUrl: 'https://www.youtube.com/watch?v=3gh3eLGVQX0' },
      { id: 2, title: 'Peggy Gou Sunset Mix', image: getRealImg(6), tags: ['Deep House', 'Sunset'], videoUrl: 'https://www.youtube.com/watch?v=ODpLPXCAKDA' },
      { id: 3, title: 'Ben Böhmer Cercle', image: getRealImg(2), tags: ['Deep House', 'Live'], videoUrl: 'https://www.youtube.com/watch?v=RvRhUHTV_8k' },
      { id: 4, title: 'Solomun Boiler Room', image: getRealImg(7), tags: ['Techno', 'Live Set'], videoUrl: 'https://www.youtube.com/watch?v=bk6Xst6euQk' },
      { id: 5, title: 'Disclosure Boiler Room', image: getRealImg(0), tags: ['Electronic', 'Club'], videoUrl: 'https://www.youtube.com/watch?v=DSna6V9QOxo' }
    ]
  },
  {
    title: 'Live Concerts & Festivals',
    items: [
      { id: 6, title: 'BICEP Live Printworks', image: getRealImg(1), tags: ['Electronica', 'Concert'], videoUrl: 'https://www.youtube.com/watch?v=treSXuhsjyc' },
      { id: 7, title: 'Fatboy Slim Boiler Room', image: getRealImg(5), tags: ['Big Beat', 'Classic'], videoUrl: 'https://www.youtube.com/watch?v=MeOs4TdH08Y' },
      { id: 8, title: 'Boris Brejcha Cercle', image: getRealImg(2), tags: ['Minimal Techno', 'Festival'], videoUrl: 'https://www.youtube.com/watch?v=dEBkiLIwYFs' },
      { id: 9, title: 'Amelie Lens Atomium', image: getRealImg(3), tags: ['Acid Techno', 'Live'], videoUrl: 'https://www.youtube.com/watch?v=rwzOqYKKIU8' }
    ]
  },
  {
    title: 'Underground Mixes',
    items: [
      { id: 10, title: 'Carl Cox Boiler Room', image: getRealImg(7), tags: ['Techno', 'Classic'], videoUrl: 'https://www.youtube.com/watch?v=IvPdwoppGw4' },
      { id: 11, title: 'Black Coffee Cercle', image: getRealImg(6), tags: ['Afro House'], videoUrl: 'https://www.youtube.com/watch?v=BKdb1xNEGoY' },
      { id: 12, title: 'David Guetta Club Mix', image: getRealImg(5), tags: ['House', 'Club'], videoUrl: 'https://www.youtube.com/watch?v=I4QIqm8hCvo' },
      { id: 13, title: 'Tale of Us Afterlife', image: getRealImg(0), tags: ['Melodic Techno'], videoUrl: 'https://www.youtube.com/watch?v=3gh3eLGVQX0' }
    ]
  }
];
