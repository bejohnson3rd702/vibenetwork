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
  // Mr. Olympia Network
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
  },
  {
    video_id: 'P0Ivio8Onew',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Nick', text: 'Hey guys, Nick here from Nick\'s Strength and Power. Today we are talking about the Toronto Pro.' },
      { time: '00:10', seconds: 10, speaker: 'Nick', text: 'Hassan Mostafa was in incredible shape, but some bodybuilders are saying he was robbed of first place.' },
      { time: '00:22', seconds: 22, speaker: 'Nick', text: 'If you look at the side-by-side comparison, his size and fullness are absolutely undeniable.' },
      { time: '00:35', seconds: 35, speaker: 'Nick', text: 'Let me know in the comments: do you think Hassan should have won the Sandow qualification here?' }
    ]
  },
  {
    video_id: 'GJkBAbzrhkQ',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Nick', text: 'Welcome back. Today we are focusing on Hassan Mostafa\'s side chest pose, which is absolutely insane.' },
      { time: '00:08', seconds: 8, speaker: 'Nick', text: 'The sheer thickness of his chest and the detail in his delts and hamstrings is mind-blowing.' },
      { time: '00:15', seconds: 15, speaker: 'Nick', text: 'He has some of the best muscle bellies in the game right now. Let\'s break down his posing routine.' }
    ]
  },
  {
    video_id: 'dTqpdNacxYM',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Jay Cutler', text: 'Hey everyone, Jay Cutler here. Welcome to another Cutler Nutrition Q and A session.' },
      { time: '00:10', seconds: 10, speaker: 'Jay Cutler', text: 'Today we are talking about off-season training, sets and reps, and how to build a championship chest.' },
      { time: '00:20', seconds: 20, speaker: 'Jay Cutler', text: 'Consistency in the gym and proper supplementation are key. Let\'s answer your top questions.' }
    ]
  },
  {
    video_id: 'fxl8zZId73g',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'DT Roth', text: 'Hey guys, DT Roth here. Today we are breaking down Prevail Focus from Cutler Nutrition.' },
      { time: '00:08', seconds: 8, speaker: 'DT Roth', text: 'This pre-workout is designed for maximum mental focus, energy, and clean pumps without the crash.' },
      { time: '00:16', seconds: 16, speaker: 'DT Roth', text: 'Let\'s look at the key ingredients and how it compares to other focus supplements on the market.' }
    ]
  },

  // Christian Revival Network (KPLE TV)
  {
    video_id: '5BFZ5rg1ZLc',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Pastor James', text: 'Welcome to TCT Network. Today we are discussing walking in faith and living the Word of God daily.' },
      { time: '00:12', seconds: 12, speaker: 'Pastor James', text: 'God doesn\'t want robotic, repetitive prayers. He wants your heart, your sincerity, and your trust.' },
      { time: '00:25', seconds: 25, speaker: 'Pastor James', text: 'Let\'s turn our Bibles to the Book of Psalms and study what it means to seek Him with our whole soul.' }
    ]
  },
  {
    video_id: 'vwmCBGEmpY0',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Pastor James', text: 'Welcome back. Today Pastor James is preaching on Ephesians chapter two, highlighting God\'s unmerited favor.' },
      { time: '00:12', seconds: 12, speaker: 'Pastor James', text: 'Even when you cannot see it, God is working behind the scenes, fighting battles you know nothing about.' },
      { time: '00:24', seconds: 24, speaker: 'Pastor James', text: 'Rest in His promises and trust that His grace is sufficient for every trial you face.' }
    ]
  },
  {
    video_id: 'Z5q63JNeAZs',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Speaker', text: 'Thanks for tuning in. Our message today is about the power in the name of Jesus and building strong families.' },
      { time: '00:12', seconds: 12, speaker: 'Speaker', text: 'When the storms of life hit, we must stand firm on the rock of Christ. Our children need that foundation.' },
      { time: '00:25', seconds: 25, speaker: 'Speaker', text: 'Let\'s pray together for our households and invite His presence to guide our daily lives.' }
    ]
  },
  {
    video_id: 'x2bt6n_Xkq8',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Pastor Frank', text: 'Welcome to Frankly Speaking. I am Pastor Frank, and today I want to encourage you to fulfill your divine purpose.' },
      { time: '00:10', seconds: 10, speaker: 'Pastor Frank', text: 'Life will throw challenges at you, but with faith and determination, you can overcome every obstacle.' },
      { time: '00:20', seconds: 20, speaker: 'Pastor Frank', text: 'Let\'s look at scripture to find strength for the week ahead and learn how to walk in victory.' }
    ]
  },
  {
    video_id: 'vdHg6fe8P5Y',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Anchor', text: 'This is the Attention Central Texas public service bulletin. Highlighting community events and local initiatives.' },
      { time: '00:10', seconds: 10, speaker: 'Anchor', text: 'We also look at critical resources available for our local veterans, including counseling and housing support.' },
      { time: '00:22', seconds: 22, speaker: 'Anchor', text: 'Stay tuned to find out how you can volunteer, get involved, and support our community projects.' }
    ]
  },
  {
    video_id: 'EWGs1CV8g_s',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Teacher', text: 'Welcome to The Walk TV and The Word of Life. Today we are studying the temptation of Jesus in the wilderness.' },
      { time: '00:12', seconds: 12, speaker: 'Teacher', text: 'How did Jesus respond to the enemy? By quoting Scripture. This teaches us the power of knowing God\'s Word.' },
      { time: '00:25', seconds: 25, speaker: 'Teacher', text: 'We will also dive into Biblical prophecy and messages to the seven churches in the Book of Revelation.' }
    ]
  },
  {
    video_id: '9drtdb9zqy4',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Host', text: 'Welcome to Men of Integrity. Today we have a roundtable discussion on honor, strength, and spiritual leadership.' },
      { time: '00:10', seconds: 10, speaker: 'Host', text: 'As men, how do we lead our families with humility and strength in a world that constantly changes?' },
      { time: '00:20', seconds: 20, speaker: 'Host', text: 'Let\'s discuss practical ways to build integrity in our workplaces, homes, and relationships.' }
    ]
  },
  {
    video_id: 'e5PyPssFC5U',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Reverenda Mitzi', text: 'Bienvenidos a La Palabra de Vida con la Reverenda Mitzi Gibson. Hoy hablaremos sobre nuestra nueva identidad en Cristo.' },
      { time: '00:12', seconds: 12, speaker: 'Reverenda Mitzi', text: 'Las cosas viejas pasaron; he aquí todas son hechas nuevas. Dios tiene un propósito maravilloso para tu vida.' },
      { time: '00:25', seconds: 25, speaker: 'Reverenda Mitzi', text: 'Abramos nuestros corazones para recibir este mensaje inspiracional en español.' }
    ]
  },
  {
    video_id: 'p1k8H32aB_w',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Host', text: 'Welcome to Positiv Family. Tonight on our Family Movie Night Spotlight, we are reviewing uplifting cinema.' },
      { time: '00:10', seconds: 10, speaker: 'Host', text: 'These family-friendly movies bring hope, laughter, and encouragement straight to your living room.' },
      { time: '00:20', seconds: 20, speaker: 'Host', text: 'Let\'s preview some of our top picks that you can watch with your children tonight.' }
    ]
  },
  {
    video_id: 'TvJHIFotb3s',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Narrator', text: 'Welcome to Smile of a Child. Today we are embarking on a Giant Adventure with Superbook: David and Goliath.' },
      { time: '00:10', seconds: 10, speaker: 'Narrator', text: 'Watch how a young shepherd boy with simple stones defeats a giant Philistine because he trusts in God.' },
      { time: '00:22', seconds: 22, speaker: 'Narrator', text: 'This animated journey teaches children that with God, no giant in life is ever too big to face.' }
    ]
  },

  // VIBE Network
  {
    video_id: '4cqcl3Jy_hw',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Reporter', text: 'This is CNN News. The FAA is pushing to replace a decades-old system in busy air traffic control towers.' },
      { time: '00:10', seconds: 10, speaker: 'Reporter', text: 'Many controllers still rely on paper flight strips to track aircraft movements on the runways.' },
      { time: '00:20', seconds: 20, speaker: 'Reporter', text: 'We look at the new digital technologies being tested to improve efficiency and air safety.' }
    ]
  },
  {
    video_id: '-d4T5ruaGeA',
    transcript: [
  {
    "time": "00:00",
    "seconds": 0,
    "speaker": "Fox Anchor",
    "text": "All right, meantime, here and here to the mayor's word, Mamdani, is ramping up his radical rhetoric after border czar Tom Homan suggested deploying more ICE agents.",
    "isRecorded": true
  },
  {
    "time": "00:10",
    "seconds": 10,
    "speaker": "Zohran Mamdani",
    "text": "These kinds of threats, as you've said, from Tom Homan and the Federal Administration, they're not new.",
    "isRecorded": true
  },
  {
    "time": "00:14",
    "seconds": 14,
    "speaker": "Zohran Mamdani",
    "text": "And neither will our response be.",
    "isRecorded": true
  },
  {
    "time": "00:15",
    "seconds": 15,
    "speaker": "Zohran Mamdani",
    "text": "We continue to be proud of being a sanctuary city.",
    "isRecorded": true
  },
  {
    "time": "00:18",
    "seconds": 18,
    "speaker": "Zohran Mamdani",
    "text": "We continue to be ready to stand up for our immigrant neighbors, and we continue to be ready to use every single tool at our disposal.",
    "isRecorded": true
  },
  {
    "time": "00:24",
    "seconds": 24,
    "speaker": "Fox Anchor",
    "text": "And I've said to the President directly that I believe that ICE raids are cruel, and they do nothing to serve in the interests of public safety.",
    "isRecorded": true
  },
  {
    "time": "00:31",
    "seconds": 31,
    "speaker": "Fox Anchor",
    "text": "And I do believe it's a rogue agency that should be abolished because we need an approach to immigration in this country that has more humanity at the heart of it.",
    "isRecorded": true
  },
  {
    "time": "00:39",
    "seconds": 39,
    "speaker": "Fox Anchor",
    "text": "Former ICE Director and DHS Deputy Assistant Secretary Jonathan Fehi joins me now, Jonathan.",
    "isRecorded": true
  },
  {
    "time": "00:44",
    "seconds": 44,
    "speaker": "Fox Anchor",
    "text": "Thank you for joining us this morning.",
    "isRecorded": true
  },
  {
    "time": "00:46",
    "seconds": 46,
    "speaker": "Jonathan Fahey",
    "text": "You know, we've heard the mayor say things like this before he's doubling down once again.",
    "isRecorded": true
  },
  {
    "time": "00:50",
    "seconds": 50,
    "speaker": "Jonathan Fahey",
    "text": "So let's live in a world for a moment where he gets his wish and ICE is abolished in cities and states across the country.",
    "isRecorded": true
  },
  {
    "time": "00:57",
    "seconds": 57,
    "speaker": "Jonathan Fahey",
    "text": "What would that actually look like in practice?",
    "isRecorded": true
  },
  {
    "time": "01:01",
    "seconds": 61,
    "speaker": "Jonathan Fahey",
    "text": "Would we live in a more humane society as the way the mayor is predicting?",
    "isRecorded": true
  },
  {
    "time": "01:07",
    "seconds": 67,
    "speaker": "Jonathan Fahey",
    "text": "We would live in a society that is significantly less safe.",
    "isRecorded": true
  },
  {
    "time": "01:12",
    "seconds": 72,
    "speaker": "Jonathan Fahey",
    "text": "Places like New York would be utterly bankrupt because remember under the Biden administration with the open borders policies",
    "isRecorded": true
  },
  {
    "time": "01:20",
    "seconds": 80,
    "speaker": "Jonathan Fahey",
    "text": "that only were four years, New York City was going broke.",
    "isRecorded": true
  },
  {
    "time": "01:24",
    "seconds": 84,
    "speaker": "Jonathan Fahey",
    "text": "They were mayor Adams was asking for $12 billion from the federal government to pay for all the services that illegal aliens were costing the city.",
    "isRecorded": true
  },
  {
    "time": "01:33",
    "seconds": 93,
    "speaker": "Jonathan Fahey",
    "text": "And that was just on a short period of time.",
    "isRecorded": true
  },
  {
    "time": "01:36",
    "seconds": 96,
    "speaker": "Jonathan Fahey",
    "text": "So if you actually got rid of ICE, we would see murder skyrocket.",
    "isRecorded": true
  },
  {
    "time": "01:41",
    "seconds": 101,
    "speaker": "Jonathan Fahey",
    "text": "We'd see crime skyrocket.",
    "isRecorded": true
  },
  {
    "time": "01:42",
    "seconds": 102,
    "speaker": "Jonathan Fahey",
    "text": "We would all be poor or less safe.",
    "isRecorded": true
  },
  {
    "time": "01:45",
    "seconds": 105,
    "speaker": "Jonathan Fahey",
    "text": "And it would be a devastating effect because you cannot have ICE and the border go hand in hand.",
    "isRecorded": true
  },
  {
    "time": "01:52",
    "seconds": 112,
    "speaker": "Jonathan Fahey",
    "text": "If you stop enforcing internal immigration laws, the border will be overrun again because part of the deterrence is the fact that people once they get in here aren't getting to stay anymore,",
    "isRecorded": true
  },
  {
    "time": "02:03",
    "seconds": 123,
    "speaker": "Jonathan Fahey",
    "text": "which we didn't have under sort of the open border Biden policy.",
    "isRecorded": true
  },
  {
    "time": "02:06",
    "seconds": 126,
    "speaker": "Jonathan Fahey",
    "text": "So it's a complete joke because he says this under the umbrella of protection that Donald Trump is providing New York by by shutting the border",
    "isRecorded": true
  },
  {
    "time": "02:16",
    "seconds": 136,
    "speaker": "Jonathan Fahey",
    "text": "and deporting the bad guys.",
    "isRecorded": true
  },
  {
    "time": "02:18",
    "seconds": 138,
    "speaker": "Jonathan Fahey",
    "text": "And remember since Trump took office, crime in New York has dropped dramatically and a lot of it is because he's getting rid of the bad guys that were allowed to stay",
    "isRecorded": true
  },
  {
    "time": "02:27",
    "seconds": 147,
    "speaker": "Jonathan Fahey",
    "text": "during the previous administration.",
    "isRecorded": true
  },
  {
    "time": "02:29",
    "seconds": 149,
    "speaker": "Jonathan Fahey",
    "text": "It's a total joke under my dummies side.",
    "isRecorded": true
  },
  {
    "time": "02:33",
    "seconds": 153,
    "speaker": "Jonathan Fahey",
    "text": "He knows it is, but it's completely self-serving today for him and today's Democratic Party.",
    "isRecorded": true
  },
  {
    "time": "02:38",
    "seconds": 158,
    "speaker": "Jonathan Fahey",
    "text": "You know, Jonathan, I think that's some of the things Mayor Mom Dami said in that little sound bite we played bare repeating.",
    "isRecorded": true
  },
  {
    "time": "02:43",
    "seconds": 163,
    "speaker": "Jonathan Fahey",
    "text": "One of them is we continue to be ready to stand up for our immigrant neighbors.",
    "isRecorded": true
  },
  {
    "time": "02:49",
    "seconds": 169,
    "speaker": "Jonathan Fahey",
    "text": "We also said I believe that ice raids are cruel and they do nothing to serve the interest of public safety.",
    "isRecorded": true
  },
  {
    "time": "02:56",
    "seconds": 176,
    "speaker": "Jonathan Fahey",
    "text": "I wonder what he would say to the parents of Sheridan Gorman in his desire to not turn over illegal immigrants to federal law enforcement when their daughter was allegedly killed by",
    "isRecorded": true
  },
  {
    "time": "03:06",
    "seconds": 186,
    "speaker": "Jonathan Fahey",
    "text": "an illegal immigrant with a criminal record.",
    "isRecorded": true
  },
  {
    "time": "03:09",
    "seconds": 189,
    "speaker": "Jonathan Fahey",
    "text": "Maybe there's nothing you can say to a family like that and that's the point.",
    "isRecorded": true
  },
  {
    "time": "03:12",
    "seconds": 192,
    "speaker": "Jonathan Fahey",
    "text": "That's part of the story when you talk about cruel and inhumane, don't those families matter.",
    "isRecorded": true
  },
  {
    "time": "03:19",
    "seconds": 199,
    "speaker": "Jonathan Fahey",
    "text": "Right, exactly.",
    "isRecorded": true
  },
  {
    "time": "03:20",
    "seconds": 200,
    "speaker": "Jonathan Fahey",
    "text": "And our politicians here are supposed to be representing American citizens, not illegal aliens.",
    "isRecorded": true
  },
  {
    "time": "03:26",
    "seconds": 206,
    "speaker": "Jonathan Fahey",
    "text": "And you go back, you have Sheridan Gorman in Chicago, but you also have Lake and Riley in Georgia and remember, her killer was arrested",
    "isRecorded": true
  },
  {
    "time": "03:34",
    "seconds": 214,
    "speaker": "Jonathan Fahey",
    "text": "in New York City released under their sanctuary policies albeit the DHS under mayorkers wasn't even trying to arrest him, but it just shows there's the cruelty",
    "isRecorded": true
  },
  {
    "time": "03:45",
    "seconds": 225,
    "speaker": "Jonathan Fahey",
    "text": "and your responsibility as a mayor, as an elected official in America is to defend American citizens.",
    "isRecorded": true
  },
  {
    "time": "03:52",
    "seconds": 232,
    "speaker": "Jonathan Fahey",
    "text": "And there's such an indifference.",
    "isRecorded": true
  },
  {
    "time": "03:54",
    "seconds": 234,
    "speaker": "Jonathan Fahey",
    "text": "It's not, it's cruelty and just indifference to American suffering because you see it every day and when Donald Trump is trying to enforce",
    "isRecorded": true
  },
  {
    "time": "04:03",
    "seconds": 243,
    "speaker": "Jonathan Fahey",
    "text": "the immigration laws, he's making us safer and the Democrats stand in the way every step of the way when he's simply trying to enforce the laws passed by Congress.",
    "isRecorded": true
  },
  {
    "time": "04:13",
    "seconds": 253,
    "speaker": "Jonathan Fahey",
    "text": "That's back and forth isn't going anywhere.",
    "isRecorded": true
  },
  {
    "time": "04:15",
    "seconds": 255,
    "speaker": "Fox Anchor",
    "text": "It continues into today.",
    "isRecorded": true
  },
  {
    "time": "04:16",
    "seconds": 256,
    "speaker": "Fox Anchor",
    "text": "Thank you so much for joining us. We appreciate it.",
    "isRecorded": true
  },
  {
    "time": "04:19",
    "seconds": 259,
    "speaker": "Fox Anchor",
    "text": "Be sure to like and subscribe for all the Fox News latest on YouTube and catch full shows streaming now on Fox One.",
    "isRecorded": true
  }
]
  },
  {
    video_id: 'ciq7HeiJCOE',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Anchor', text: 'Thanks for watching MSNBC Politics. President Trump hosted a UFC event on the White House south lawn.' },
      { time: '00:10', seconds: 10, speaker: 'Ashley Parker', text: 'This event, marking America\'s 250th anniversary, has raised several ethical and political questions.' },
      { time: '00:20', seconds: 20, speaker: 'Ashley Parker', text: 'Ashley Parker joins us to analyze the sense of corruption and grift surrounding this decision.' }
    ]
  },
  {
    video_id: 'HPiqxMrKMKQ',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Reporter', text: 'This is People Weekly. We reveal the surprising story of how Elizabeth Hurley and Billy Ray Cyrus started dating.' },
      { time: '00:10', seconds: 10, speaker: 'Billy Ray Cyrus', text: 'The country star shares details about their unexpected romance and what brought the two icons together.' },
      { time: '00:20', seconds: 20, speaker: 'Reporter', text: 'Let\'s take a look at the timeline of their relationship and fan reactions worldwide.' }
    ]
  },
  {
    video_id: 'vwOxJJ80t3k',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Analyst', text: 'Welcome to CNBC Business. Today we analyze corporate strategy and why KFC has fallen behind in the U.S.' },
      { time: '00:10', seconds: 10, speaker: 'Analyst', text: 'Chains like Chick-fil-A and Raising Cane\'s have taken over as Americans crave premium chicken options.' },
      { time: '00:22', seconds: 22, speaker: 'Analyst', text: 'We look at brand dilution, menu choices, and real estate portfolios of fast food franchises.' }
    ]
  },
  {
    video_id: 'vyqy7PcDGLM',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Pat McAfee', text: 'Welcome to the Pat McAfee Show on ESPN. Today we talk about the Men\'s College World Series in Omaha.' },
      { time: '00:10', seconds: 10, speaker: 'Karl Ravech', text: 'Karl Ravech joins us to describe the incredible gameday tailgating experience and fan atmosphere.' },
      { time: '00:22', seconds: 22, speaker: 'Karl Ravech', text: 'We also highlight the star players to watch as the teams battle for the national title.' }
    ]
  },

  // B2K Network
  {
    video_id: 'lgyEYMxzVpw',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Host', text: 'What\'s up, everybody? Welcome to B2K Channel. Watch our reunion tour performance live on stage.' },
      { time: '00:08', seconds: 8, speaker: 'Omarion', text: 'Performing our platinum hit Bump, Bump, Bump featuring P. Diddy. The crowd energy is absolutely insane.' },
      { time: '00:17', seconds: 17, speaker: 'Lil\' Fizz', text: 'Turn up the volume and experience the choreography and classic early 2000s R and B vibes.' }
    ]
  },
  {
    video_id: 'CgiX53hjAPc',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Host', text: 'Welcome back. Rewind to the debut hit single Uh Huh off our self-titled debut B2K album.' },
      { time: '00:08', seconds: 8, speaker: 'J-Boog', text: 'This track went straight to the top of the R&B charts and defined our sound. Check out the music video.' },
      { time: '00:16', seconds: 16, speaker: 'Omarion', text: 'Sing along with Omarion, Fizz, J-Boog, and Raz-B in this classic throwback performance.' }
    ]
  },
  {
    video_id: 'd8BFf32yDWQ',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'B2K', text: 'Hey guys, this is B2K. Let\'s take a look at the official music video for Gots Ta Be.' },
      { time: '00:08', seconds: 8, speaker: 'Omarion', text: 'This is one of our favorite smooth R and B love ballads from the first record.' },
      { time: '00:16', seconds: 16, speaker: 'J-Boog', text: 'We hope you enjoy the harmonies and smooth styling of this classic video.' }
    ]
  },
  {
    video_id: '6OihwykYdBc',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'B2K', text: 'You\'re watching B2K. This is the official music video for Girlfriend, off our album Pandemonium.' },
      { time: '00:08', seconds: 8, speaker: 'Omarion', text: 'With choreography by Dave Meyers, this video won viewer\'s choice awards and defined the boyband era.' },
      { time: '00:17', seconds: 17, speaker: 'Lil\' Fizz', text: 'Let\'s jump into the music video and look at those classic dance moves.' }
    ]
  },
  {
    video_id: '_Z_5lpErdyM',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Omarion', text: 'Hey everyone, Omarion here. Welcome to the official music video for my solo single Touch.' },
      { time: '00:08', seconds: 8, speaker: 'Omarion', text: 'Off my debut solo album O, this track features iconic choreography and street-style dancing.' },
      { time: '00:16', seconds: 16, speaker: 'Omarion', text: 'Let\'s watch and feel the rhythm. Don\'t forget to leave your comments in the chat.' }
    ]
  },
  {
    video_id: 'AdJEg47RTZ4',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Lil\' Fizz', text: 'Welcome back. This is Lil\' Fizz, showing you the official video for my solo track Fluid.' },
      { time: '00:08', seconds: 8, speaker: 'Missez', text: 'Featuring the amazing vocals of Missez, this single is a club banger with heavy beats.' },
      { time: '00:16', seconds: 16, speaker: 'Lil\' Fizz', text: 'Check out the performance and let me know if you are vibing with it.' }
    ]
  },
  {
    video_id: 'JwIHOk7b5sQ',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Big Boy', text: 'Welcome to Big Boy TV. Today we sit down with J-Boog and the group to talk about B2K\'s history.' },
      { time: '00:09', seconds: 9, speaker: 'J-Boog', text: 'We talk about the Millennium reunion tour, the brotherhood, and what it\'s like performing together again.' },
      { time: '00:18', seconds: 18, speaker: 'Big Boy', text: 'It\'s a candid conversation about the highs and lows of being one of the biggest R and B groups.' }
    ]
  },
  {
    video_id: 'OJl-628FyIk',
    transcript: [
      { time: '00:00', seconds: 0, speaker: 'Omarion', text: 'Hey guys, Omarion here. Let\'s watch the official music video for Ice Box, produced by Timbaland.' },
      { time: '00:08', seconds: 8, speaker: 'Omarion', text: 'This platinum single is about the struggles of love and has a very deep, emotional vibe.' },
      { time: '00:16', seconds: 16, speaker: 'Timbaland', text: 'The visual effects and choreography in this video are some of my best work.' }
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
