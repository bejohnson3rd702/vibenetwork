const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('/Volumes/Dev/vibe-network-ui/.env', 'utf8');
const lines = envContent.split('\n');
let url = '';
let key = '';
for (const line of lines) {
  if (line.trim().startsWith('VITE_SUPABASE_URL=')) {
    url = line.split('=')[1].replace(/"/g, '').trim();
  }
  if (line.trim().startsWith('VITE_SUPABASE_ANON_KEY=')) {
    key = line.split('=')[1].replace(/"/g, '').trim();
  }
}

const supabase = createClient(url, key);

const SEED_TRANSCRIPTS = [
  {
    video_id: 'SV7JP7y80UM',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Bob Cicherillo', text: 'Welcome back to OlympiaTV. Today we are having the ultimate debate on the 212 division.' },
      { time: '00:15', seconds: 15, speaker: 'Shawn Ray', text: 'This division has grown so much. We have seen champions like Flex Lewis dominate in the past.' },
      { time: '00:32', seconds: 32, speaker: 'Bob Cicherillo', text: 'Exactly, Shawn. But this year, the competition is closer than ever. Who is your pick?' },
      { time: '00:48', seconds: 48, speaker: 'Shawn Ray', text: 'I think conditioning is going to be the deciding factor. You cannot hide any flaws on the Olympia stage.' },
      { time: '01:05', seconds: 65, speaker: 'Dennis James', text: 'Don\'t count out the newcomers. We have some guys coming in with incredible thickness and roundness.' },
      { time: '01:22', seconds: 82, speaker: 'Bob Cicherillo', text: 'Let\'s take a look at the side chest comparison and break down the top contenders.' }
    ]
  },
  {
    video_id: 'MzWgJtFIxg8',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Narrator', text: 'Throughout history, only a handful of athletes have truly redefined the sport of bodybuilding.' },
      { time: '00:18', seconds: 18, speaker: 'Arnold Schwarzenegger', text: 'When I came to America, my goal was not just to win Mr. Olympia, but to make bodybuilding popular worldwide.' },
      { time: '00:35', seconds: 35, speaker: 'Dorian Yates', text: 'In the nineties, I knew I had to bring something completely different. High-intensity training and pure density.' },
      { time: '00:52', seconds: 52, speaker: 'Phil Heath', text: 'Bodybuilding is about evolution. Arnold brought the aesthetics, Dorian brought the mass, and we continue to push those boundaries.' },
      { time: '01:10', seconds: 70, speaker: 'Narrator', text: 'These game changers paved the way for the modern legends we see on stage today.' }
    ]
  },
  {
    video_id: 'NMjCB0Y2rh4',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Host', text: 'The year is 2007. The venue is the Orleans Arena in Las Vegas. Mr. Olympia is underway.' },
      { time: '00:14', seconds: 14, speaker: 'Victor Martinez', text: 'I felt like I was in the best shape of my life. The details, the separation—everything came together.' },
      { time: '00:29', seconds: 29, speaker: 'Jay Cutler', text: 'It was a battle. Victor came in sharp and full. I had to fight for every single pose.' },
      { time: '00:44', seconds: 44, speaker: 'Chris Aceto', text: 'Many experts and fans to this day believe Victor should have taken the Sandow home that night.' },
      { time: '01:02', seconds: 62, speaker: 'Victor Martinez', text: 'In bodybuilding, you respect the judges\' decision, but the support from the fans that year was unforgettable.' }
    ]
  }
];

async function run() {
  console.log("Seeding video transcripts...");
  for (const item of SEED_TRANSCRIPTS) {
    const { data, error } = await supabase
      .from('video_transcripts')
      .upsert(item, { onConflict: 'video_id' });
    if (error) {
      console.error(`❌ Error seeding ${item.video_id}:`, error.message);
    } else {
      console.log(`✅ Seeded transcript for video_id: ${item.video_id}`);
    }
  }
}

run();
