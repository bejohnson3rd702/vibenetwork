import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(ROOT, '.env') });
const DUMP_PATH = process.env.VIBE_SUPABASE_DUMP || '';
const OUT_DIR = path.join(ROOT, 'nalu-kb');

async function loadDump() {
  if (DUMP_PATH && fs.existsSync(DUMP_PATH)) {
    return JSON.parse(fs.readFileSync(DUMP_PATH, 'utf8'));
  }
  const url = process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
  const key = process.env.VITE_SUPABASE_ANON_KEY || '';
  const sb = createClient(url, key);
  const out = {};
  for (const t of ['whitelabel_configs', 'profiles', 'videos', 'products', 'posts', 'video_transcripts', 'series', 'episodes']) {
    const { data } = await sb.from(t).select('*').limit(500);
    out[t] = { rows: data || [] };
  }
  return out;
}

const dump = await loadDump();

// Helper: check deactivated network (matches src/api.ts & ChannelDirectory.tsx)
function isDeactivatedWl(w) {
  if (!w) return true;
  if (w.is_active === false || w.is_active === 'false') return true;
  if (w.theme?.is_active === false || w.theme?.is_active === 'false') return true;
  const n = (w.name || '').toLowerCase();
  const d = (w.domain || '').toLowerCase();
  const bad = ['noelani', 'leilani', 'leiloe', 'deleted', 'finfire', 'test', 'bennie johnson preview', 'bennielife', 'bennie.vibenetwork'];
  if (bad.some(b => n.includes(b) || d.includes(b))) return true;
  return false;
}

function isTestString(s) {
  if (!s) return true;
  const t = String(s).trim().toLowerCase();
  if (!t || t.length <= 1) return true;
  const exactBad = new Set([
    'test', 'testing', 'yolo', 'rrrr', 'hhhh', 'do it', 'we are', 'my tttt', 'null', '-',
    'this is in english', 'dit is een boek over de bijbel'
  ]);
  if (exactBad.has(t)) return true;
  if (
    /^test(\s|\d|_|-|$)/i.test(t) ||
    t.includes('testing 123') ||
    t.includes('testing the tester') ||
    t.includes('test product') ||
    t.includes('dashboard control test') ||
    t.includes('finfire')
  ) {
    return true;
  }
  return false;
}

const wlRows = dump.whitelabel_configs?.rows || [];
const wlMap = new Map(wlRows.map(w => [w.id, w]));
const profileRows = dump.profiles?.rows || [];
const profMap = new Map(profileRows.map(p => [p.id, p]));

// Parse WatchLive.tsx & CourtneyBeeWatchSection.tsx clip metadata (id -> { title, source, category, description, videoUrl })
function extractWatchClips() {
  const clipMeta = new Map();
  const files = [
    path.join(ROOT, 'src/components/WatchLive.tsx'),
    path.join(ROOT, 'src/components/CourtneyBeeWatchSection.tsx')
  ];
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, 'utf8');
    const objRegex = /\{[^{}]*?id:\s*['"]([^'"]+)['"][^{}]*?\}/gs;
    let m;
    while ((m = objRegex.exec(src)) !== null) {
      const block = m[0];
      const id = m[1];
      const titleM = block.match(/title:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
      const sourceM = block.match(/(?:source|show|channelName):\s*(['"`])((?:\\.|(?!\1).)*)\1/);
      const descM = block.match(/description:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
      const catM = block.match(/category:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
      const urlM = block.match(/videoUrl:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
      const ytM = block.match(/youtubeId:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
      if (titleM) {
        const entry = {
          id,
          title: titleM[2].replace(/\\'/g, "'").replace(/\\"/g, '"'),
          source: sourceM ? sourceM[2].replace(/\\'/g, "'") : '',
          description: descM ? descM[2].replace(/\\'/g, "'").replace(/\\"/g, '"') : '',
          category: catM ? catM[2] : '',
          videoUrl: urlM ? urlM[2] : (ytM ? `https://www.youtube.com/watch?v=${ytM[2]}` : '')
        };
        clipMeta.set(id, entry);
        if (ytM) clipMeta.set(ytM[2], entry);
        if (urlM) {
          const ytUrlM = urlM[2].match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
          if (ytUrlM) clipMeta.set(ytUrlM[1], entry);
        }
      }
    }
  }
  return clipMeta;
}

// Also collect official seeded transcript video_ids from seed_all_transcripts.cjs & seed_transcripts.cjs
function extractOfficialSeededIds() {
  const ids = new Set();
  for (const rel of ['supabase/seed_all_transcripts.cjs', 'supabase/seed_transcripts.cjs']) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, 'utf8');
    for (const m of src.matchAll(/video_id:\s*['"]([^'"]+)['"]/g)) {
      ids.add(m[1]);
    }
  }
  return ids;
}

const clipMeta = extractWatchClips();
const officialSeededIds = extractOfficialSeededIds();

// Map DB videos into clipMeta
for (const v of (dump.videos?.rows || [])) {
  if (isTestString(v.title)) continue;
  const prof = profMap.get(v.creator_id);
  const wl = v.whitelabel_id ? wlMap.get(v.whitelabel_id) : (prof?.whitelabel_id ? wlMap.get(prof.whitelabel_id) : null);
  const entry = {
    id: v.id,
    title: v.title,
    source: prof?.full_name || prof?.username || wl?.name || 'Vibe Network',
    description: Array.isArray(v.tags) ? `Tags: ${v.tags.join(', ')}` : '',
    category: wl?.name || 'Vibe VOD',
    videoUrl: v.video_url || '',
    price: v.price
  };
  clipMeta.set(v.id, entry);
  if (v.video_url) {
    clipMeta.set(v.video_url, entry);
    const base = v.video_url.split('/').pop();
    if (base) clipMeta.set(base, entry);
    const ytM = v.video_url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
    if (ytM && !clipMeta.has(ytM[1])) clipMeta.set(ytM[1], entry);
  }
}

// ============================================================================
// FILE 07: ACTIVE NETWORKS, SUB-NETWORKS & AVO 21-UNIVERSITY NIL DIRECTORY
// ============================================================================
const avoColleges = [
  { name: 'Alabama (Crimson Tide)', domain: 'alabama.shopavo.la', shop: 'https://shopavo.la/pages/avo-x-bama', slogan: 'Roll Tide! Official Alabama Crimson Tide Apparel & NIL Gear by AVO.' },
  { name: 'Arkansas (Razorbacks)', domain: 'arkansas.shopavo.la', shop: 'https://shopavo.la/collections/arkansas', slogan: 'Woo Pig Sooie! Official Arkansas Razorbacks Apparel & NIL Collection by AVO.' },
  { name: 'Auburn (Tigers)', domain: 'auburn.shopavo.la', shop: 'https://shopavo.la/collections/auburn', slogan: 'War Eagle! Official Auburn Tigers Apparel & Tailgate Collection by AVO.' },
  { name: 'Baylor (Bears)', domain: 'baylor.shopavo.la', shop: 'https://shopavo.la/collections/baylor', slogan: "Sic 'Em Bears! Official Baylor Bears Campus Apparel & NIL Gear by AVO." },
  { name: 'Colorado (Buffaloes)', domain: 'colorado.shopavo.la', shop: 'https://shopavo.la/collections/colorado', slogan: 'Sko Buffs! Official Colorado Buffaloes Campus Apparel & Lifestyle Gear by AVO.' },
  { name: 'Georgia (Bulldogs)', domain: 'georgia.shopavo.la', shop: 'https://shopavo.la/collections/georgia', slogan: 'Go Dawgs! Official Georgia Bulldogs Red & Black Tailgate Collection by AVO.' },
  { name: 'Georgia Tech (Yellow Jackets)', domain: 'gatech.shopavo.la', shop: 'https://shopavo.la/collections/georgia-tech', slogan: 'Go Jackets! Official Georgia Tech Yellow Jackets Apparel & NIL Gear by AVO.' },
  { name: 'Indiana (Hoosiers)', domain: 'indiana.shopavo.la', shop: 'https://shopavo.la/collections/indiana', slogan: 'Go Hoosiers! Official Indiana Hoosiers Cream & Crimson Collection by AVO.' },
  { name: 'LSU (Tigers)', domain: 'lsu.shopavo.la', shop: 'https://shopavo.la/collections/lsu', slogan: 'Geaux Tigers! Official LSU Tigers Purple & Gold Game Day Apparel by AVO.' },
  { name: 'Mississippi State (Bulldogs)', domain: 'mississippistate.shopavo.la', shop: 'https://shopavo.la/collections/mississippi-state', slogan: 'Hail State! Official Mississippi State Bulldogs Maroon & White Apparel by AVO.' },
  { name: 'Missouri (Tigers)', domain: 'missouri.shopavo.la', shop: 'https://shopavo.la/collections/missouri', slogan: 'Mizzou! Official Missouri Tigers Black & Gold Campus Collection by AVO.' },
  { name: 'Nebraska (Cornhuskers)', domain: 'nebraska.shopavo.la', shop: 'https://shopavo.la/collections/nebraska', slogan: 'Go Big Red! Official Nebraska Cornhuskers Scarlet & Cream Collection by AVO.' },
  { name: 'Ole Miss (Rebels)', domain: 'olemiss.shopavo.la', shop: 'https://shopavo.la/collections/ole-miss', slogan: 'Hotty Toddy! Official Ole Miss Rebels Oxford-Inspired Campus Apparel by AVO.' },
  { name: 'Penn State (Nittany Lions)', domain: 'pennstate.shopavo.la', shop: 'https://shopavo.la/collections/penn-state', slogan: 'We Are! Official Penn State Nittany Lions Happy Valley Gear by AVO.' },
  { name: 'Rutgers (Scarlet Knights)', domain: 'rutgers.shopavo.la', shop: 'https://shopavo.la/collections/rutgers', slogan: 'Scarlet Knights! Official Rutgers University Apparel & NIL Collection by AVO.' },
  { name: 'TCU (Horned Frogs)', domain: 'tcu.shopavo.la', shop: 'https://shopavo.la/collections/tcu', slogan: 'Go Frogs! Official TCU Horned Frogs Purple & White Collection by AVO.' },
  { name: 'Texas A&M (Aggies)', domain: 'texasam.shopavo.la', shop: 'https://shopavo.la/collections/texas-am', slogan: "Gig 'Em Aggies! Official Texas A&M Maroon & White Apparel by AVO." },
  { name: 'Vanderbilt (Commodores)', domain: 'vanderbilt.shopavo.la', shop: 'https://shopavo.la/collections/vanderbilt', slogan: 'Anchor Down! Official Vanderbilt Commodores Campus Wear by AVO.' },
  { name: 'Virginia (Cavaliers)', domain: 'virginia.shopavo.la', shop: 'https://shopavo.la/collections/virginia', slogan: 'Wahoowa! Official Virginia Cavaliers Navy & Orange Collection by AVO.' },
  { name: 'Virginia Tech (Hokies)', domain: 'virginiatech.shopavo.la', shop: 'https://shopavo.la/collections/virginia-tech', slogan: 'Hokie Nation! Official Virginia Tech Hokies Maroon & Orange Apparel by AVO.' },
  { name: 'Wake Forest (Demon Deacons)', domain: 'wakeforest.shopavo.la', shop: 'https://shopavo.la/collections/wake-forest', slogan: 'Go Deacs! Official Wake Forest Demon Deacons Old Gold & Black Collection by AVO.' }
];

const activeWls = wlRows.filter(w => !isDeactivatedWl(w));

let doc07 = `================================================================================
VIBE NETWORK KNOWLEDGE BASE — DOCUMENT 07
TITLE: Complete Active Networks, Child Networks & AVO 21-University NIL Catalog
================================================================================

SECTION 1: AVO NETWORK & ALL 21 LICENSED COLLEGIATE NIL NETWORKS
--------------------------------------------------------------------------------
Parent Network: AVO Network (Domain: shopavo.la | Vibe Route: /?tenant=3915f1e5-4c79-4b2a-ad41-7029ce8052d7 | Directory: /channels?filter=colleges)
NIL Mission: 20% of every AVO order is donated directly to the university's female student-athlete NIL (Name, Image, and Likeness) fund.

Licensed University Child Networks on Vibe (21 Schools):
` + avoColleges.map((c, i) => `${i + 1}. ${c.name} — Subdomain: ${c.domain} | Store: ${c.shop} | ${c.slogan}`).join('\n') + `


SECTION 2: MUSCLE & FITNESS / MR. OLYMPIA N2N ECOSYSTEM
--------------------------------------------------------------------------------
Parent Network: Muscle & Fitness (Domain: muscleandfitness.com | Vibe Route: /?tenant=7a017c4d-c08f-4260-8540-a0cc8bed4e11)
Child & Partner Networks Hosted Under Muscle & Fitness:
- Mr. Olympia (mrolympia.com | /?tenant=7a017c4d-c08f-4260-8540-a0cc8bed4e12): Joe Weider's Mr. Olympia Fitness & Performance Weekend — The Pinnacle of Bodybuilding.
- Wings of Strength (wingsofstrength.net | /?tenant=wings-of-strength-tenant-id): Premier global promoter for elite female bodybuilding and professional strength sports, featuring the Alina Popa Classic (IFBB Pro League), Rising Phoenix Arizona Women's Pro, and Phoenix Iron Games (IFBB Pro & NPC Amateur).
- M&F Hers (muscleandfitness.com/hers | /?tenant=mf-hers-tenant-id): Workouts, nutrition, tips, and guides tailored for active women.
- Flex Online (muscleandfitness.com/flexonline | /?tenant=flex-online-tenant-id): Hardcore bodybuilding, athlete contests, and classic strength coaching (including Dorian Yates & Mike Mentzer Maximum Results training).
- Gold's Gym (golds.avoclothing.com | /?tenant=ad821853-9f01-4645-89dc-18bf828e1790): Iconic strength & bodybuilding partner network.
- Gaspari Nutrition (gaspari.avoclothing.com | /?tenant=58f06680-2308-4ea3-b290-db8564f2b875): Sports nutrition partner network.
- Rogue Fitness (rogue.avoclothing.com | /?tenant=d5a15986-a473-4935-a43a-ce4c467e555d): Strength equipment & training partner network.
- Redcon1 (redcon1.avoclothing.com | /?tenant=62c698d8-fc87-4fc5-96a0-9940d9e8f607): High-performance sports supplement partner network.
- Gymshark (gymshark.avoclothing.com | /?tenant=b59515ac-e997-47ab-b0b2-e25cff596d97): Fitness apparel & athlete community partner network.


SECTION 3: B2K R&B NETWORK & SOLO MEMBER NETWORKS
--------------------------------------------------------------------------------
Parent Network: B2K Network (b2k.vibenetwork.tv | /?tenant=4d16dae7-518d-440e-bb21-b6f3a7cfcd64)
Syndicated Artist Child Networks:
- Omarion Network (omarion.vibenetwork.tv | /?tenant=f8ffc4d8-b0b0-4e27-ab16-6d9e804542aa)
- Lil Fizz Network (fizz.vibenetwork.tv | /?tenant=8b60e724-a9a6-4180-9d94-413b01f3e6a6)
- J-Boog Network (jboog.vibenetwork.tv | /?tenant=87bb46a5-80b0-4f4e-bc8d-4e32d277217c)
- Raz-B Network (razb.vibenetwork.tv | /?tenant=698afd65-1722-4146-a876-d94c2acedf41)


SECTION 4: BONAIRE CHAMBER OF COMMERCE (KvK BONAIRE) & ISLAND MERCHANTS
--------------------------------------------------------------------------------
Parent Network: Bonaire Chamber of Commerce (/?tenant=b0ea0000-c08f-4260-8540-a0cc8bed4e11)
Syndicated Island Merchant Networks:
- Bonaire Dive Gear (bonairedive.vibenetwork.tv): Reef-safe dive rashguards, snorkeling sets, and ocean dry bags.
- Flamingo Eco Tours (bonairetours.vibenetwork.tv): Guided mangrove snorkeling tours and sustainable eco-souvenirs.
- Cadushy Distillery Shop (cadushyshop.vibenetwork.tv): Rom Rincon aged rum, Cadushy cactus liqueur gift sets, and distillery merch.
- Bonaire Salt Shop (bonairesalt.vibenetwork.tv): Gourmet Caribbean sea salt, lavender bath salt crystals, and wooden salt mills.


SECTION 5: CHRISTIAN REVIVAL NETWORK (KPLE-TV) & FAITH CHANNELS
--------------------------------------------------------------------------------
Parent Network: Christian Revival Network / KPLE-TV (kple.kpletv.org | /?tenant=33742e2f-430b-4c2d-9cba-42507891ef02)
- Broadcast Location: 502 E. Elms Rd., Killeen, Texas (Toll-Free: 877-640-5673).
- Killeen Healing Rooms Schedule: Open at the KPLE-TV building (502 E. Elms Rd., Killeen) on the 2nd Saturday of each month from 9:30 AM – 11:30 AM and the last Tuesday of each month from 6:45 PM – 8:00 PM, with prayer teams available based on Mark 16:17–18.
- Local Community Events Calendar: Non-profits and community ministries can submit plain-text event announcements via email at least two weeks in advance.
- Featured Faith Sub-Network: Doc Wales Diaries (docwales.kpletv.org) — Medical mission documentaries hosted by Dr. Steve "Doc Wales" Price.


SECTION 6: ENTERTAINMENT, COMBAT, TATTOO & SPECIALTY NETWORKS ON VIBE
--------------------------------------------------------------------------------
- Global Combat Collective / GCC (/gcc or /global-combat-collective | globalcombatcollective.com): Live multi-camera combat sports PPV & arena ticketing network.
- The Real Courtney Bee Network (therealcourtneybee.com | /?tenant=cb000000-c08f-4260-8540-a0cc8bed4e11): Comedy & culture network hosting *We Playin' Spades* (with Nick Cannon), stand-up comedy, and Wild 'N Out cast channels (DC Young Fly, Conceited, Chico Bean, Justina Valentine, Timothy DeLaGhetto).
- Sacred Serpent Network (/?tenant=c8c4084d-56b4-4c45-94f6-e4b1821dad75): Tattoo artistry collective featuring resident tattoo creators and booking portfolios.
- Vibe 100 Broadcast Hub (/?tenant=e5c100aa-c08f-4260-8540-a0cc8bed4e11): Curated 24/7 cross-network showcase featuring AVO Channel, Muscle & Fitness Channel, B2K Channel, and Christian Revival Channel.
- Destinito Cinema: Boutique Caribbean resort & island cinema catalog featuring 4K Dolby Atmos films and documentaries with multilingual audio/subtitles (English, Spanish, French, Dutch, Papiamento).
- Las Vegas Food Truck Hub (/food-truck): Live location tracker & order-ahead menu in Las Vegas (Fremont Street Experience near the Mantis, 8:00 PM – 2:00 AM; First Friday Arts District 5:00 PM – 11:00 PM; featuring Birria Tacos $14 and Loaded Asada Fries $16).

Full Active Supabase White-Label Network Records (${activeWls.length} verified active tenants):
` + activeWls.map(w => {
  const parent = w.parent_network_id ? wlMap.get(w.parent_network_id)?.name : null;
  const copy = w.theme?.heroCopy || w.theme?.defaultBio || '';
  return `- ${w.name} | Domain: ${w.domain || 'vibenetwork.tv'} | Route: /?tenant=${w.id}${parent ? ` | Parent: ${parent}` : ''}${copy ? ` | Summary: ${copy}` : ''}`;
}).join('\n') + '\n';

fs.writeFileSync(path.join(OUT_DIR, '07_active_networks_and_avo_colleges_catalog.txt'), doc07);


// ============================================================================
// FILE 08: CREATOR CHANNELS, PRO ATHLETES, AMBASSADORS & COMMUNITY POSTS
// ============================================================================
const olympiaChamps = [
  { name: 'Samson Dauda', id: '84071a35-5f73-4927-a0a7-828800245096', title: '2024 Mr. Olympia Champion' },
  { name: 'Derek Lunsford', id: 'c88adb24-5d9e-4886-9be0-e79f03f3d79e', title: '2023 Mr. Olympia Champion (First 2-Division Olympia Winner)' },
  { name: 'Hadi Choopan', id: 'b4537110-f393-4fde-9f94-6885391589d8', title: '2022 Mr. Olympia Champion ("The Persian Wolf")' },
  { name: 'Chris Bumstead (CBum)', id: '7fb2a325-d877-4daf-a308-bd0089d888f1', title: '6x Classic Physique Olympia Champion' },
  { name: 'Big Ramy (Mamdouh Elssbiay)', id: 'f92fad9e-ab7e-44d6-818c-0527000810eb', title: '2x Mr. Olympia Champion (2020, 2021)' },
  { name: 'Brandon Curry', id: '6d0b723d-c5ba-4991-8a89-b1466ed3b3ef', title: '2019 Mr. Olympia Champion' },
  { name: 'Shawn Rhoden', id: '59e9f92c-c712-4676-bb07-40a4c394dfab', title: '2018 Mr. Olympia Champion' },
  { name: 'Phil Heath', id: 'b6013ed0-5bd4-412d-9a42-d256a5ba9fc3', title: '7x Mr. Olympia Champion ("The Gift")' },
  { name: 'Andrea Shaw', id: 'a7f353ba-6281-4b33-aff4-977325a1ebe8', title: '6x Ms. Olympia Champion' },
  { name: 'Iris Kyle', id: '0efb86ee-ab84-4e95-8d27-51c7368915e3', title: '10x Ms. Olympia Champion (All-Time Record Holder)' }
];

const wingsAthletes = ['Aisling Hickey', 'Alana Shipp', 'Amanda Aivaliotis', 'Amanda Machado', 'Amanda Ptak', 'Amanda Slinker', 'Amanda Smith', 'Amberly Plaski', 'Anastasia Korableva', 'Anca Ioana Bergen'];
const wingsLegends = ['Alina Popa (Hall of Fame)', 'Andrulla Blanchette (Ms. Olympia)', 'Carla Dunlap (Ms. Olympia)', 'Dayana Cadeau (Ms. Olympia)', 'Helle Trevino (Rising Phoenix Champion)', 'Iris Kyle (10x Ms. Olympia)', 'Kike Elomaa (Ms. Olympia)', 'Lenda Murray (8x Ms. Olympia)', 'Margie Martin (Rising Phoenix Champion)', 'Yaxeni Oriquen (Ms. Olympia)'];

const cleanProfiles = profileRows.filter(p => {
  if (p.is_active === false) return false;
  const label = p.full_name || p.username || '';
  if (isTestString(label)) return false;
  const ll = label.toLowerCase();
  if (ll.includes('@mdhmx.com') || ll.includes('ipad') || ll.includes('jamies_model') || ll === 'alexmercer' || ll === 'bernardes' || ll.includes('lifelessons')) return false;
  if (p.role === 'viewer') return false;
  return true;
});

// Gather recent public posts per creator (cleaned)
const postsByCreator = new Map();
for (const post of (dump.posts?.rows || [])) {
  if (post.is_locked) continue;
  const txt = (post.content || '').trim();
  if (!txt || isTestString(txt) || txt.length < 15) continue;
  if (!postsByCreator.has(post.creator_id)) postsByCreator.set(post.creator_id, []);
  const arr = postsByCreator.get(post.creator_id);
  if (arr.length < 3) arr.push(txt.replace(/\s+/g, ' '));
}

let doc08 = `================================================================================
VIBE NETWORK KNOWLEDGE BASE — DOCUMENT 08
TITLE: Complete Creator Channels, Pro Athletes, Campus Ambassadors & Artists
DIRECTORY ROUTE: /channels (or /profile/:creatorId)
================================================================================

SECTION 1: MR. & MS. OLYMPIA CHAMPION CHANNELS (MUSCLE & FITNESS N2N)
--------------------------------------------------------------------------------
` + olympiaChamps.map(c => {
  const dbProf = profMap.get(c.id);
  const bio = dbProf?.bio ? ` | Bio: ${dbProf.bio.replace(/\s+/g, ' ')}` : '';
  const sub = dbProf?.sub_price ? ` | Monthly Subscription: $${dbProf.sub_price}` : '';
  return `- ${c.name} (${c.title}) — Profile: /profile/${c.id}${sub}${bio}`;
}).join('\n') + `


SECTION 2: WINGS OF STRENGTH PRO ATHLETES & HALL OF FAME LEGENDS
--------------------------------------------------------------------------------
Wings of Strength Featured Pro Athletes:
- ${wingsAthletes.join(', ')}

Wings of Strength Bodybuilding Legends & Ms. Olympia Icons:
- ${wingsLegends.join(', ')}


SECTION 3: COMEDY & WILD 'N OUT CREATOR CHANNELS
--------------------------------------------------------------------------------
- The Real Courtney Bee (@courtneybee | /profile/courtney-bee-tenant-id): Wild 'N Out star, HBO Max comedian, live stand-up headliner, and co-host of *We Playin' Spades* alongside Nick Cannon.
- DC Young Fly (/profile/wno-dc-young-fly | dcyoungfly.wildnout.vibenetwork.tv): Atlanta rapper-comedian, Wild 'N Out veteran, actor, and stand-up star. (Full channel catalog also indexed in Ask Nalu.)
- Conceited (/profile/wno-conceited | conceited.wildnout.vibenetwork.tv): New York battle rap icon and Wild 'N Out Wildstyle champion. (Full channel catalog also indexed in Ask Nalu.)
- Chico Bean (/profile/wno-chico-bean | chicobean.wildnout.vibenetwork.tv): King of Wildstyle, stand-up comedian, and 85 South Show co-creator. (Full channel catalog also indexed in Ask Nalu.)
- Justina Valentine (/profile/wno-justina-valentine | justinavalentine.wildnout.vibenetwork.tv): Singer, freestyler, and Wild 'N Out fan favorite. (Full channel catalog also indexed in Ask Nalu.)
- Timothy DeLaGhetto (/profile/wno-timothy-delaghetto | timothydelaghetto.wildnout.vibenetwork.tv): YouTube comedy pioneer and Wild 'N Out OG. (Full channel catalog also indexed in Ask Nalu.)


SECTION 4: ALL ACTIVE VIBE CREATOR, ARTIST & CAMPUS AMBASSADOR PROFILES (${cleanProfiles.length} Channels)
--------------------------------------------------------------------------------
` + cleanProfiles.map(p => {
  const name = p.full_name || p.username;
  const wl = p.whitelabel_id ? wlMap.get(p.whitelabel_id)?.name : 'Vibe Network';
  let cleanBio = (p.bio || '').replace(/\s+/g, ' ').trim();
  if (cleanBio.length > 220) cleanBio = cleanBio.slice(0, 220) + '...';
  const bio = cleanBio ? ` | Bio: ${cleanBio}` : '';
  const sub = p.sub_price !== undefined && p.sub_price !== null ? ` | Sub: ${Number(p.sub_price) > 0 ? `$${p.sub_price}/mo` : 'Free'}` : '';
  const posts = postsByCreator.get(p.id);
  const postStr = posts && posts.length ? `\n  Recent Channel Posts: "${posts.join('" | "')}"` : '';
  return `- ${name} (@${p.username || name}) — Profile: /profile/${p.id} | Network: ${wl || 'Vibe Network'}${sub}${bio}${postStr}`;
}).join('\n') + '\n';

fs.writeFileSync(path.join(OUT_DIR, '08_creator_channels_and_athletes_directory.txt'), doc08);


// ============================================================================
// FILE 09: COMPLETE MARKETPLACE & MERCHANDISE PRODUCT CATALOG
// ============================================================================
const validProducts = (dump.products?.rows || []).filter(p => {
  if (isTestString(p.title)) return false;
  const prof = profMap.get(p.creator_id);
  const uName = (prof?.username || prof?.full_name || '').toLowerCase();
  if (uName === 'alexmercer' || uName === 'bernardes') return false;
  return true;
});

const prodGroups = new Map();
for (const p of validProducts) {
  const prof = profMap.get(p.creator_id);
  const wl = prof?.whitelabel_id ? wlMap.get(prof.whitelabel_id) : null;
  const creatorName = prof?.full_name || prof?.username || 'Vibe Official Store';
  let netName = wl?.name || 'Vibe Global Marketplace';
  if (creatorName === 'The Real Courtney Bee') netName = 'The Real Courtney Bee Network';
  const groupKey = `${netName} — ${creatorName}`;
  if (!prodGroups.has(groupKey)) prodGroups.set(groupKey, []);
  prodGroups.get(groupKey).push(p);
}

let doc09 = `================================================================================
VIBE NETWORK KNOWLEDGE BASE — DOCUMENT 09
TITLE: Complete Vibe Marketplace, Creator Merch, Tickets & Store Catalog
MARKETPLACE ROUTES: /marketplace and /shop (Individual items: /product/:productId)
================================================================================

Visitors can shop official merchandise, digital downloads, vinyl records, fitness equipment, Caribbean artisanal goods, and live event VIP passes at /marketplace (or /shop on any white-label network).

SECTION 1: DIRECT STORE CATALOG BY NETWORK & CREATOR (${validProducts.length} Verified Products)
--------------------------------------------------------------------------------
` + Array.from(prodGroups.entries()).map(([group, items]) => {
  const lines = items.map(item => {
    const cleanTitle = item.title.replace(/\s+/g, ' ').trim();
    return `  * ${cleanTitle} — Price: $${Number(item.price).toFixed(2)} USD | Type: ${item.type} | Link: /product/${item.id}`;
  }).join('\n');
  return `### ${group}\n${lines}`;
}).join('\n\n') + `


SECTION 2: AVO COLLEGIATE SHOPIFY STOREFRONTS (21 UNIVERSITIES)
--------------------------------------------------------------------------------
Every AVO Collegiate Network (/shop or /marketplace?network=avo) syncs live licensed campus apparel (hoodies, baby tees, crewnecks, tailgate tops, sweatpants, hats) from shopavo.la across all 21 partner schools (Alabama, Arkansas, Auburn, Baylor, Colorado, Georgia, Georgia Tech, Indiana, LSU, Mississippi State, Missouri, Nebraska, Ole Miss, Penn State, Rutgers, TCU, Texas A&M, Vanderbilt, Virginia, Virginia Tech, Wake Forest), donating 20% of every order to that school's female student-athlete NIL fund.


SECTION 3: GLOBAL COMBAT COLLECTIVE (GCC) LIVE EVENT TICKET TIERS (/gcc)
--------------------------------------------------------------------------------
- Ringside VIP Experience: $499 USD (Rows 1–3 direct ringside seating, VIP lounge & complimentary catering, fighter walkout tunnel proximity, commemorative laminate & poster, dedicated VIP express entrance).
- Lower Bowl Premier: $179 USD (Lower bowl center-ring padded stadium seating, fast-track concourse entry, official GCC event program).
- General Admission Bleachers: $69 USD (Upper-tier unobstructed arena seating, full concourse & merchandise pavilion access, live jumbotron commentary).
(Standard $12.50 arena facility fee applies at ticket checkout.)
`;

fs.writeFileSync(path.join(OUT_DIR, '09_marketplace_and_merchandise_catalog.txt'), doc09);


// ============================================================================
// FILE 10: TV SERIES, EPISODES, DESTINITO MOVIES & VOD VIDEO CATALOG
// ============================================================================
const validSeries = (dump.series?.rows || []).filter(s => !isTestString(s.title));
const episodesBySeries = new Map();
for (const ep of (dump.episodes?.rows || [])) {
  if (!episodesBySeries.has(ep.series_id)) episodesBySeries.set(ep.series_id, []);
  episodesBySeries.get(ep.series_id).push(ep);
}
const validVideos = (dump.videos?.rows || []).filter(v => !isTestString(v.title) && !v.title.startsWith('Live Stream - '));

const destinitoSrc = fs.readFileSync(path.join(ROOT, 'src/data/destinitoMovies.ts'), 'utf8');
const movieBlocks = [...destinitoSrc.matchAll(/\{\s*id:\s*'([^']+)',[\s\S]*?category:\s*'([^']+)'\s*\}/g)];
const moviesList = movieBlocks.map(m => {
  const b = m[0];
  const get = (k) => (b.match(new RegExp(`${k}:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`)) || [])[2] || '';
  const year = (b.match(/releaseYear:\s*(\d+)/) || [])[1] || '';
  const rating = get('rating');
  const dur = get('duration');
  return `- ${get('title')} (${year}, ${rating}, ${dur}) — Setting/Spotlight: ${get('islandLocation')} | Director: ${get('director')} | Synopsis: ${get('description')}`;
});

const uniqueClips = new Map();
for (const c of clipMeta.values()) {
  if (!c.title || isTestString(c.title) || c.title.startsWith('Live Stream - ')) continue;
  const key = `${c.title}::${c.source}`;
  if (!uniqueClips.has(key)) uniqueClips.set(key, c);
}

let doc10 = `================================================================================
VIBE NETWORK KNOWLEDGE BASE — DOCUMENT 10
TITLE: Complete TV Series, Episodes, VOD Videos, Curated Broadcast Clips & Films
================================================================================

SECTION 1: BROADCAST SERIES & FULL EPISODES (${validSeries.length} Series, ${(dump.episodes?.rows || []).length} Episodes)
--------------------------------------------------------------------------------
` + validSeries.map(s => {
  const eps = episodesBySeries.get(s.id) || [];
  const epText = eps.length > 0
    ? '\n' + eps.map(ep => {
        let trSummary = '';
        if (ep.transcript) {
          try {
            const parsed = typeof ep.transcript === 'string' ? JSON.parse(ep.transcript) : ep.transcript;
            if (Array.isArray(parsed)) {
              trSummary = ' | Dialogue: ' + parsed.map(x => `${x.speaker}: "${x.text}"`).join(' ');
            }
          } catch {}
        }
        return `  * Episode: ${ep.title} (${ep.length || 'VOD'}, Rating: ${ep.rating || 'All Audiences'}, Genre: ${ep.genre || 'Inspirational'}) — ${(ep.description || '').replace(/\s+/g, ' ')}${trSummary}`;
      }).join('\n')
    : '';
  return `- Series: ${s.title} — ${(s.description || 'Official Vibe / KPLE-TV Broadcast Series.').replace(/\s+/g, ' ')}${epText}`;
}).join('\n') + `


SECTION 2: FEATURED ON-DEMAND VIDEOS & MUSIC VIDEOS (${validVideos.length} Titles)
--------------------------------------------------------------------------------
` + validVideos.map(v => {
  const prof = profMap.get(v.creator_id);
  const wl = v.whitelabel_id ? wlMap.get(v.whitelabel_id) : null;
  return `- "${v.title}" — Creator/Channel: ${prof?.full_name || prof?.username || wl?.name || 'Vibe Network'} | Access: ${Number(v.price) > 0 ? `$${v.price} PPV` : 'Free Stream'} | Tags: ${(v.tags || []).join(', ')}`;
}).join('\n') + `


SECTION 3: CURATED WATCH LIVE & NETWORK VIDEO LIBRARY (${uniqueClips.size} Clips)
--------------------------------------------------------------------------------
` + Array.from(uniqueClips.values()).map(c => {
  return `- "${c.title}"${c.source ? ` [${c.source}]` : ''}${c.category ? ` (Category: ${c.category})` : ''}${c.description ? ` — ${c.description.replace(/\s+/g, ' ')}` : ''}`;
}).join('\n') + `


SECTION 4: DESTINITO CINEMA — FEATURE FILMS & DOCUMENTARIES (${moviesList.length} Titles)
--------------------------------------------------------------------------------
` + moviesList.join('\n') + '\n';

fs.writeFileSync(path.join(OUT_DIR, '10_shows_series_episodes_and_vod_catalog.txt'), doc10);


// ============================================================================
// FILE 11: CURATED VIBE & PARTNER NETWORK VIDEO TRANSCRIPTS
// ============================================================================
const testVidBlacklist = new Set(['dQw4w9WgXcQ', 'jNQXAC9IVRw']);
const seenNorm = new Set();
const cleanTranscripts = [];

for (const row of (dump.video_transcripts?.rows || [])) {
  const vid = String(row.video_id || '');
  if (testVidBlacklist.has(vid)) continue;

  const meta = clipMeta.get(vid);
  const isOfficial = Boolean(meta?.title) || officialSeededIds.has(vid) || vid.includes('bonaire') || vid.includes('veterans') || vid.includes('bulletin');
  if (!isOfficial) continue;

  const segs = Array.isArray(row.transcript) ? row.transcript : [];
  if (segs.length === 0) continue;

  const merged = [];
  for (const s of segs) {
    const sp = (s.speaker || 'Speaker').trim();
    const tx = (s.text || '').replace(/\s+/g, ' ').trim();
    if (!tx || tx === '[music]') continue;
    if (merged.length > 0 && merged[merged.length - 1].speaker === sp) {
      merged[merged.length - 1].text += ' ' + tx;
    } else {
      merged.push({ speaker: sp, text: tx });
    }
  }
  if (merged.length === 0) continue;

  const fullDialogue = merged.map(m => `${m.speaker}: ${m.text}`).join('\n');
  if (
    /Live Stream -\s*\d/i.test(fullDialogue) ||
    fullDialogue.includes('Today we are tuning in to watch') ||
    fullDialogue.includes('KPLE-TV Network Admin Dashboard live broadcast test') ||
    fullDialogue.includes('the boy reggie yeah the boy reggie')
  ) {
    continue;
  }

  const normKey = fullDialogue.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 180);
  if (normKey.length < 30 || seenNorm.has(normKey)) continue;
  seenNorm.add(normKey);

  const title = meta?.title || vid.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const source = meta?.source || (merged[0]?.speaker !== 'Speaker' ? merged[0]?.speaker : 'Vibe Network Broadcast');
  const trimmedDialogue = fullDialogue.length > 2000
    ? fullDialogue.slice(0, 2000).replace(/\s+\S*$/, '') + ' ... [transcript excerpt]'
    : fullDialogue;

  cleanTranscripts.push({ vid, title, source, dialogue: trimmedDialogue });
}

// Remove old split transcript files if they exist
for (const old of ['11_video_transcripts_part1_featured_shows.txt', '12_video_transcripts_part2_broadcast_archive.txt']) {
  const oldPath = path.join(OUT_DIR, old);
  if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
}

const doc11 = `================================================================================
VIBE NETWORK KNOWLEDGE BASE — DOCUMENT 11
TITLE: Official Vibe & Partner Network Video Transcripts (${cleanTranscripts.length} Curated Broadcasts)
================================================================================

Below are the official spoken transcripts and dialogue summaries from Vibe Network broadcasts, B2K & solo artist music videos, Mr. Olympia & Wings of Strength athlete coverage, Bonaire diving & travel guides, Courtney Bee & We Playin' Spades episodes, AVO collegiate highlights, and Christian Revival Network / KPLE-TV inspirational programs.

` + cleanTranscripts.map((item, idx) => `--------------------------------------------------------------------------------
VIDEO ${idx + 1}: "${item.title}"
CHANNEL / SOURCE: ${item.source} | VIDEO ID: ${item.vid}
--------------------------------------------------------------------------------
${item.dialogue}
`).join('\n');

fs.writeFileSync(path.join(OUT_DIR, '11_vibe_video_transcripts_and_dialogue.txt'), doc11);

console.log('Generated clean KB catalog files successfully:');
for (const f of fs.readdirSync(OUT_DIR).filter(x => !x.startsWith('._')).sort()) {
  const stat = fs.statSync(path.join(OUT_DIR, f));
  console.log(`  ${f}: ${(stat.size / 1024).toFixed(1)} KB`);
}
console.log(`Stats: ${activeWls.length} active WLs, ${cleanProfiles.length} creator profiles, ${validProducts.length} products, ${validSeries.length} series, ${cleanTranscripts.length} curated transcripts`);
