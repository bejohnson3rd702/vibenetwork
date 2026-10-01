/**
 * N2N (Network-to-Network) Utility Functions
 * 
 * All data access for the N2N feature is centralized here.
 * Any network with n2n_enabled=true becomes a parent.
 * Child networks link back via parent_network_id.
 */

import { supabase } from '../supabaseClient';
import type { WlConfig } from './whitelabel';
import { normalizeWlConfig } from './whitelabel';

// ─── Official AVO College Networks (21 Licensed Universities) ──
export const AVO_COLLEGE_NETWORKS: WlConfig[] = [
  normalizeWlConfig({
    id: 'be124de3-82be-4017-b6d0-58b0132f5550',
    name: 'Alabama',
    domain: 'alabama.shopavo.la',
    logo: '/n2n/alabama.png',
    accent: '#9E1B32',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#9E1B32',
      heroCopy: 'Roll Tide! Official Alabama Crimson Tide Apparel & NIL Gear by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820',
      logoImage: '/n2n/alabama.png',
      shopifyUrl: 'https://shopavo.la/pages/avo-x-bama',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-arkansas-tenant-id',
    name: 'Arkansas',
    domain: 'arkansas.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/8.png',
    accent: '#9D2235',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#9D2235',
      heroCopy: 'Woo Pig Sooie! Official Arkansas Razorbacks Apparel & NIL Collection by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/8.png',
      shopifyUrl: 'https://shopavo.la/collections/arkansas',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-auburn-tenant-id',
    name: 'Auburn',
    domain: 'auburn.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2.png',
    accent: '#0C2340',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#0C2340',
      heroCopy: 'War Eagle! Official Auburn Tigers Apparel & Tailgate Collection by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2.png',
      shopifyUrl: 'https://shopavo.la/collections/auburn',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'e86c5900-0d27-420b-98f7-922213540ec2',
    name: 'Baylor',
    domain: 'baylor.shopavo.la',
    logo: '/n2n/baylor.png',
    accent: '#154734',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#154734',
      heroCopy: "Sic 'Em Bears! Official Baylor Bears Campus Apparel & NIL Gear by AVO.",
      heroImage: 'https://shopavo.la/cdn/shop/files/msu-hp-hero_1500x.jpg?v=1775144388',
      logoImage: '/n2n/baylor.png',
      shopifyUrl: 'https://shopavo.la/collections/baylor',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'd0fd9b57-d8af-474b-a011-aa8babeadb34',
    name: 'Colorado',
    domain: 'colorado.shopavo.la',
    logo: '/n2n/colorado.png',
    accent: '#CFB87C',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#CFB87C',
      heroCopy: 'Sko Buffs! Official Colorado Buffaloes Campus Apparel & Lifestyle Gear by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/co-desktop2_4230eb90-9553-4d72-b205-30e62658bcce_1500x.jpg?v=1776445128',
      logoImage: '/n2n/colorado.png',
      shopifyUrl: 'https://shopavo.la/collections/colorado',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: '83b21eac-0f37-4b66-b7e0-1320105e82f1',
    name: 'Georgia',
    domain: 'georgia.shopavo.la',
    logo: '/n2n/georgia.png',
    accent: '#BA0C2F',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#BA0C2F',
      heroCopy: 'Go Dawgs! Official Georgia Bulldogs Red & Black Tailgate Collection by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/UGA_Collections_Desktop_1500x.jpg?v=1776210559',
      logoImage: '/n2n/georgia.png',
      shopifyUrl: 'https://shopavo.la/collections/georgia',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-georgia-tech-tenant-id',
    name: 'Georgia Tech',
    domain: 'gatech.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/59.png',
    accent: '#B3A369',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#B3A369',
      heroCopy: 'Go Jackets! Official Georgia Tech Yellow Jackets Apparel & NIL Gear by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/UGA_Collections_Desktop_1500x.jpg?v=1776210559',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/59.png',
      shopifyUrl: 'https://shopavo.la/collections/georgia-tech',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-indiana-tenant-id',
    name: 'Indiana',
    domain: 'indiana.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/84.png',
    accent: '#990000',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#990000',
      heroCopy: 'Go Hoosiers! Official Indiana Hoosiers Cream & Crimson Collection by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/84.png',
      shopifyUrl: 'https://shopavo.la/collections/indiana',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-lsu-tenant-id',
    name: 'LSU',
    domain: 'lsu.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png',
    accent: '#461D7C',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#461D7C',
      heroCopy: 'Geaux Tigers! Official LSU Tigers Purple & Gold Game Day Apparel by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png',
      shopifyUrl: 'https://shopavo.la/collections/lsu',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'b7f74446-403b-4f9b-8be1-1bd2df35df54',
    name: 'Mississippi State',
    domain: 'mississippistate.shopavo.la',
    logo: '/n2n/mississippi-state.png',
    accent: '#660000',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#660000',
      heroCopy: 'Hail State! Official Mississippi State Bulldogs Maroon & White Apparel by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/MSU_Homepage_Desktop_1500x.jpg?v=1776105569',
      logoImage: '/n2n/mississippi-state.png',
      shopifyUrl: 'https://shopavo.la/collections/mississippi-state',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-missouri-tenant-id',
    name: 'Missouri',
    domain: 'missouri.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/142.png',
    accent: '#F1B82D',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#F1B82D',
      heroCopy: 'Mizzou! Official Missouri Tigers Black & Gold Campus Collection by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/MSU_Homepage_Desktop_1500x.jpg?v=1776105569',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/142.png',
      shopifyUrl: 'https://shopavo.la/collections/missouri',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-nebraska-tenant-id',
    name: 'Nebraska',
    domain: 'nebraska.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/158.png',
    accent: '#E41C38',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#E41C38',
      heroCopy: 'Go Big Red! Official Nebraska Cornhuskers Scarlet & Cream Collection by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/158.png',
      shopifyUrl: 'https://shopavo.la/collections/nebraska',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'eb2428a2-87e2-46ed-b7c5-c1f5e6c4cf1b',
    name: 'Ole Miss',
    domain: 'olemiss.shopavo.la',
    logo: '/n2n/ole-miss.png',
    accent: '#CE1126',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#CE1126',
      heroCopy: 'Hotty Toddy! Official Ole Miss Rebels Oxford-Inspired Campus Apparel by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/desk-ole-miss-hp_1500x.jpg?v=1774210006',
      logoImage: '/n2n/ole-miss.png',
      shopifyUrl: 'https://shopavo.la/collections/ole-miss',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: '16e37654-6a62-490c-bb55-aee61558eee4',
    name: 'Penn State',
    domain: 'pennstate.shopavo.la',
    logo: '/n2n/penn-state.png',
    accent: '#041E42',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#041E42',
      heroCopy: 'We Are! Official Penn State Nittany Lions Happy Valley Gear by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/PSU_Homepage_Banner_Desktop2_1500x.jpg?v=1776375978',
      logoImage: '/n2n/penn-state.png',
      shopifyUrl: 'https://shopavo.la/collections/penn-state',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-rutgers-tenant-id',
    name: 'Rutgers',
    domain: 'rutgers.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/164.png',
    accent: '#CC0033',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#CC0033',
      heroCopy: 'Scarlet Knights! Official Rutgers University Apparel & NIL Collection by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/bama-desk-hp-1_1500x.jpg?v=1774210820',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/164.png',
      shopifyUrl: 'https://shopavo.la/collections/rutgers',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-tcu-tenant-id',
    name: 'TCU',
    domain: 'tcu.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png',
    accent: '#4D1979',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#4D1979',
      heroCopy: 'Go Frogs! Official TCU Horned Frogs Purple & White Collection by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/msu-hp-hero_1500x.jpg?v=1775144388',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png',
      shopifyUrl: 'https://shopavo.la/collections/tcu',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-texas-am-tenant-id',
    name: 'Texas A&M',
    domain: 'texasam.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/245.png',
    accent: '#500000',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#500000',
      heroCopy: "Gig 'Em Aggies! Official Texas A&M Maroon & White Apparel by AVO.",
      heroImage: 'https://shopavo.la/cdn/shop/files/MSU_Homepage_Desktop_1500x.jpg?v=1776105569',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/245.png',
      shopifyUrl: 'https://shopavo.la/collections/texas-am',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: '6b797710-bec0-4887-8336-d1eaf76cd307',
    name: 'Vanderbilt',
    domain: 'vanderbilt.shopavo.la',
    logo: '/n2n/vanderbilt.png',
    accent: '#866D4B',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#866D4B',
      heroCopy: 'Anchor Down! Official Vanderbilt Commodores Campus Wear by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/Homepage_Vanderbilt_Desktop_1500x.jpg?v=1776284269',
      logoImage: '/n2n/vanderbilt.png',
      shopifyUrl: 'https://shopavo.la/collections/vanderbilt',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-virginia-tenant-id',
    name: 'Virginia',
    domain: 'virginia.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/258.png',
    accent: '#232D4B',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#232D4B',
      heroCopy: 'Wahoowa! Official Virginia Cavaliers Navy & Orange Collection by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/Homepage_Vanderbilt_Desktop_1500x.jpg?v=1776284269',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/258.png',
      shopifyUrl: 'https://shopavo.la/collections/virginia',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-virginia-tech-tenant-id',
    name: 'Virginia Tech',
    domain: 'virginiatech.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/259.png',
    accent: '#861F41',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#861F41',
      heroCopy: 'Hokie Nation! Official Virginia Tech Hokies Maroon & Orange Apparel by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/MSU_Homepage_Desktop_1500x.jpg?v=1776105569',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/259.png',
      shopifyUrl: 'https://shopavo.la/collections/virginia-tech',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  }),
  normalizeWlConfig({
    id: 'avo-wake-forest-tenant-id',
    name: 'Wake Forest',
    domain: 'wakeforest.shopavo.la',
    logo: 'https://a.espncdn.com/i/teamlogos/ncaa/500/154.png',
    accent: '#9E7E38',
    parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7',
    is_active: true,
    theme: {
      accent: '#9E7E38',
      heroCopy: 'Go Deacs! Official Wake Forest Demon Deacons Old Gold & Black Collection by AVO.',
      heroImage: 'https://shopavo.la/cdn/shop/files/msu-hp-hero_1500x.jpg?v=1775144388',
      logoImage: 'https://a.espncdn.com/i/teamlogos/ncaa/500/154.png',
      shopifyUrl: 'https://shopavo.la/collections/wake-forest',
      sliderCount: 4,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      enableWatchLive: false,
      parent_network_id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
    }
  })
];

// ─── Child Network Queries ───────────────────────────────────────

/** Fetch all child networks under a parent */
export async function getChildNetworks(parentId: string, includeInactive: boolean = false): Promise<WlConfig[]> {
  let data;
  const { data: initialData, error } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('parent_network_id', parentId)
    .order('created_at', { ascending: true });
  data = initialData;

  // If the column doesn't exist (indicated by database error), fallback to theme JSONB
  if (error) {
    const { data: allConfigs } = await supabase
      .from('whitelabel_configs')
      .select('*')
      .order('created_at', { ascending: true });

    if (allConfigs) {
      data = allConfigs.filter((row: any) => row.theme?.parent_network_id === parentId);
    }
  }

  if (!data) {
    data = [];
  }

  // AVO Network Colleges (All 21 Official Licensed Universities)
  if (parentId === '3915f1e5-4c79-4b2a-ad41-7029ce8052d7') {
    const existingMap = new Map(data.map((row: any) => [row.name?.toLowerCase(), row]));
    const result: WlConfig[] = [];
    
    for (const college of AVO_COLLEGE_NETWORKS) {
      const match = existingMap.get(college.name.toLowerCase()) || data.find((row: any) => row.id === college.id);
      if (match) {
        result.push(normalizeWlConfig({
          ...match,
          accent: match.accent || college.accent,
          logoImage: match.logoImage || match.theme?.logoImage || college.theme?.logoImage,
          theme: {
            ...match.theme,
            accent: match.theme?.accent || match.accent || college.accent,
            logoImage: match.theme?.logoImage || match.logoImage || college.theme?.logoImage,
            heroImage: match.theme?.heroImage || college.theme?.heroImage,
            shopifyUrl: match.theme?.shopifyUrl || college.theme?.shopifyUrl
          }
        }));
      } else {
        result.push(college);
      }
    }
    data = result;
  }

  // Dynamically append Mr. Olympia, Wings of Strength, M&F Hers, and Flex Online for Muscle & Fitness parent if not already present
  if (parentId === '7a017c4d-c08f-4260-8540-a0cc8bed4e11') {
    const hasOlympia = data.some((row: any) => (row.name || '').toLowerCase().includes('olympia') || row.id === '7a017c4d-c08f-4260-8540-a0cc8bed4e12');
    if (!hasOlympia) {
      data.unshift({
        id: '7a017c4d-c08f-4260-8540-a0cc8bed4e12',
        name: 'Mr. Olympia',
        domain: 'mrolympia.com',
        logo: '/n2n/mr_olympia_logo.png',
        parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11',
        platform_fee_percentage: 30,
        is_active: true,
        theme: {
          accent: '#D4AF37',
          heroCopy: "Joe Weider's Mr. Olympia Fitness & Performance Weekend — The Pinnacle of Bodybuilding.",
          heroImage: '/n2n/mr_olympia_hero.png',
          logoImage: '/n2n/mr_olympia_logo.png',
          shopifyUrl: 'https://mrolympia.com/weekend-schedule',
          sliderCount: 4,
          enableBooking: false,
          heroLayoutMode: 'verbiage',
          enableWatchLive: true,
          parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11'
        }
      });
    }

    const hasWings = data.some((row: any) => row.name === 'Wings of Strength' || row.id === 'wings-of-strength-tenant-id');
    if (!hasWings) {
      data.push({
        id: 'wings-of-strength-tenant-id',
        name: 'Wings of Strength',
        domain: 'wingsofstrength.net',
        logo: 'https://wingsofstrength.net/wp-content/uploads/2025/02/27/inner-page-logo-min-1.png',
        parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11',
        platform_fee_percentage: 30,
        is_active: true,
        theme: {
          accent: '#FF9D00',
          heroCopy: 'The Premier Global Promoter for Elite Female Bodybuilding and Professional Strength Sports.',
          heroImage: '/n2n/wings_home_banner.jpg',
          logoImage: 'https://wingsofstrength.net/wp-content/uploads/2025/02/27/inner-page-logo-min-1.png',
          shopifyUrl: 'https://wingsofstrength.net/',
          sliderCount: 4,
          enableBooking: false,
          heroLayoutMode: 'verbiage',
          enableWatchLive: true,
          parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11',
          heroSlider: [
            {
              id: 'wos-slide-2',
              title: 'Alina Popa Classic',
              subtitle: 'IFBB Pro League Contest',
              copy: 'Celebrate strength, muscle, and dedication at the annual Alina Popa Classic featuring elite professional athletes.',
              imageUrl: '/n2n/wings_alina_popa_classic.jpg',
              videoUrl: 'https://wingsofstrength.net/'
            },
            {
              id: 'wos-slide-3',
              title: 'Arizona Women\'s Pro',
              subtitle: 'Rising Phoenix Arizona Pro',
              copy: 'The road to the Rising Phoenix World Championships continues in Phoenix. Discover ticket releases and schedules.',
              imageUrl: '/n2n/wings_rising_phoenix_poster.jpg',
              videoUrl: 'https://wingsofstrength.net/'
            },
            {
              id: 'wos-slide-4',
              title: 'Phoenix Iron Games',
              subtitle: 'IFBB Pro & NPC Amateur',
              copy: 'A premier fitness weekend featuring both professional face-offs and national NPC amateur qualifiers.',
              imageUrl: '/n2n/wings_phoenix_iron_games.jpg',
              videoUrl: 'https://wingsofstrength.net/'
            }
          ]
        }
      });
    }

    const hasHers = data.some((row: any) => row.id === 'mf-hers-tenant-id');
    if (!hasHers) {
      data.push({
        id: 'mf-hers-tenant-id',
        name: 'M&F Hers',
        domain: 'muscleandfitness.com/hers',
        logo: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2024/04/MF-Circle-Blk-Wht.jpg',
        parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11',
        platform_fee_percentage: 30,
        is_active: true,
        theme: {
          accent: '#E31B23',
          heroCopy: 'M&F Hers — Workouts, Nutrition, Tips, and Guides Tailored for Active Women.',
          heroImage: '/n2n/mf_hers_bodybuilder.jpg',
          logoImage: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2024/04/MF-Circle-Blk-Wht.jpg',
          shopifyUrl: 'https://www.muscleandfitness.com/hers/',
          sliderCount: 4,
          enableBooking: false,
          heroLayoutMode: 'verbiage',
          enableWatchLive: true,
          parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11'
        }
      });
    }

    const hasFlex = data.some((row: any) => row.id === 'flex-online-tenant-id');
    if (!hasFlex) {
      data.push({
        id: 'flex-online-tenant-id',
        name: 'Flex Online',
        domain: 'muscleandfitness.com/flexonline',
        logo: 'https://www.muscleandfitness.com/wp-content/themes/muscle-and-fitness/assets/source/images/logo.png',
        parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11',
        platform_fee_percentage: 30,
        is_active: true,
        theme: {
          accent: '#E31B23',
          heroCopy: 'Flex Online — The Ultimate Source for Hardcore Bodybuilding, Athlete Contests, and Classic Strength Coaching.',
          heroImage: 'https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2026/06/Bodybuilders-Mike-Mentzer-and-Dorian-Yates-training-and-mentoring-the-young-bodybuilder-on-the-Maximum-Results-training-method.jpg',
          logoImage: 'https://www.muscleandfitness.com/wp-content/themes/muscle-and-fitness/assets/source/images/logo.png',
          shopifyUrl: 'https://www.muscleandfitness.com/flexonline/',
          sliderCount: 4,
          enableBooking: false,
          heroLayoutMode: 'verbiage',
          enableWatchLive: true,
          parent_network_id: '7a017c4d-c08f-4260-8540-a0cc8bed4e11'
        }
      });
    }
  }

  // Courtney Bee Parent Network Channels
  if (parentId === 'cb000000-c08f-4260-8540-a0cc8bed4e11' || parentId === 'courtney-bee-tenant-id' || parentId === 'courtney-bee-network-id' || parentId?.toLowerCase().includes('courtney')) {
    return [
      normalizeWlConfig({
        id: 'courtney-bee-tenant-id',
        name: 'The Real Courtney Bee',
        domain: 'therealcourtneybee.com',
        logo: 'https://static.wixstatic.com/media/066ffc_bb9bdff854db4b56bb3f6b58ee1ce532~mv2.png/v1/crop/x_0,y_261,w_1242,h_763/fill/w_860,h_528,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/image%20(1).png',
        shopifyUrl: 'https://f5c4e7-3.myshopify.com',
        parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
        platform_fee_percentage: 30,
        is_active: true,
        accent: '#ff4d85',
        theme: {
          accent: '#ff4d85',
          heroCopy: 'Welcome to The Real Courtney Bee — Official Media, Broadcasts & Culture Stream.',
          heroImage: '/n2n/comedy_club_bg.jpg',
          logoImage: 'https://static.wixstatic.com/media/066ffc_bb9bdff854db4b56bb3f6b58ee1ce532~mv2.png/v1/crop/x_0,y_261,w_1242,h_763/fill/w_860,h_528,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/image%20(1).png',
          shopifyUrl: 'https://f5c4e7-3.myshopify.com',
          sliderCount: 4,
          enableBooking: true,
          heroLayoutMode: 'verbiage',
          enableWatchLive: false,
          parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11'
        }
      }),


      // ── Wild 'N Out Cast Channels ──────────────────────────────────
      normalizeWlConfig({
        id: 'wno-dc-young-fly',
        name: 'DC Young Fly',
        domain: 'dcyoungfly.wildnout.vibenetwork.tv',
        logo: '/n2n/wno_dc_young_fly.jpg',
        parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
        platform_fee_percentage: 30,
        is_active: true,
        accent: '#00C2FF',
        theme: {
          accent: '#00C2FF',
          heroCopy: "DC Young Fly — Atlanta's funniest, wildest rapper-comedian. Catch his best Wild 'N Out moments, stand-up clips & exclusive content.",
          heroImage: '/n2n/wno_dc_young_fly.jpg',
          logoImage: '/n2n/wno_dc_young_fly.jpg',
          sliderCount: 4,
          enableBooking: true,
          heroLayoutMode: 'verbiage',
          enableWatchLive: false,
          parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11'
        }
      }),
      normalizeWlConfig({
        id: 'wno-conceited',
        name: 'Conceited',
        domain: 'conceited.wildnout.vibenetwork.tv',
        logo: '/n2n/wno_conceited.jpg',
        parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
        platform_fee_percentage: 30,
        is_active: true,
        accent: '#FFD600',
        theme: {
          accent: '#FFD600',
          heroCopy: "Conceited — New York's sharpest battle rapper. Watch him dismantle opponents with precision bars on Wild 'N Out & beyond.",
          heroImage: '/n2n/wno_conceited.jpg',
          logoImage: '/n2n/wno_conceited.jpg',
          sliderCount: 4,
          enableBooking: true,
          heroLayoutMode: 'verbiage',
          enableWatchLive: false,
          parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11'
        }
      }),
      normalizeWlConfig({
        id: 'wno-chico-bean',
        name: 'Chico Bean',
        domain: 'chicobean.wildnout.vibenetwork.tv',
        logo: '/n2n/wno_chico_bean.jpg',
        parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
        platform_fee_percentage: 30,
        is_active: true,
        accent: '#FF6B00',
        theme: {
          accent: '#FF6B00',
          heroCopy: "Chico Bean — The king of Wildstyle. Non-stop laughs, savage roasts, and unmatched energy straight from the Wild 'N Out stage.",
          heroImage: '/n2n/wno_chico_bean.jpg',
          logoImage: '/n2n/wno_chico_bean.jpg',
          sliderCount: 4,
          enableBooking: true,
          heroLayoutMode: 'verbiage',
          enableWatchLive: false,
          parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11'
        }
      }),
      normalizeWlConfig({
        id: 'wno-justina-valentine',
        name: 'Justina Valentine',
        domain: 'justinavalentine.wildnout.vibenetwork.tv',
        logo: '/n2n/wno_justina_valentine.jpg',
        parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
        platform_fee_percentage: 30,
        is_active: true,
        accent: '#E91E8C',
        theme: {
          accent: '#E91E8C',
          heroCopy: "Justina Valentine — Rapper, singer, and Wild 'N Out fan favorite. Fire bars, bold fashion & unfiltered personality.",
          heroImage: '/n2n/wno_justina_valentine.jpg',
          logoImage: '/n2n/wno_justina_valentine.jpg',
          sliderCount: 4,
          enableBooking: true,
          heroLayoutMode: 'verbiage',
          enableWatchLive: false,
          parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11'
        }
      }),
      normalizeWlConfig({
        id: 'wno-timothy-delaghetto',
        name: 'Timothy DeLaGhetto',
        domain: 'timothydelaghetto.wildnout.vibenetwork.tv',
        logo: '/n2n/wno_timothy_delaghetto.jpg',
        parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11',
        platform_fee_percentage: 30,
        is_active: true,
        accent: '#7C4DFF',
        theme: {
          accent: '#7C4DFF',
          heroCopy: "Timothy DeLaGhetto — YouTube legend turned Wild 'N Out OG. Comedy, rap battles & Asian-American culture collide.",
          heroImage: '/n2n/wno_timothy_delaghetto.jpg',
          logoImage: '/n2n/wno_timothy_delaghetto.jpg',
          sliderCount: 4,
          enableBooking: true,
          heroLayoutMode: 'verbiage',
          enableWatchLive: false,
          parent_network_id: 'cb000000-c08f-4260-8540-a0cc8bed4e11'
        }
      })
    ];
  }

  // Dynamically append The Real Courtney Bee under Vibe parent network
  const isOtherParent = parentId === 'cb000000-c08f-4260-8540-a0cc8bed4e11' || parentId === '7a017c4d-c08f-4260-8540-a0cc8bed4e11' || parentId === '100d0000-c08f-4260-8540-a0cc8bed4e01' || parentId === '33742e2f-430b-4c2d-9cba-42507891ef02' || parentId === 'b0ea0000-c08f-4260-8540-a0cc8bed4e11';
  if (!isOtherParent) {
    const hasCourtney = data.some((row: any) => row.id === 'courtney-bee-tenant-id' || row.domain?.includes('therealcourtneybee') || row.name?.toLowerCase().includes('courtney bee'));
    if (!hasCourtney) {
      data.push({
        id: 'courtney-bee-tenant-id',
        name: 'The Real Courtney Bee',
        domain: 'therealcourtneybee.com',
        logo: 'https://static.wixstatic.com/media/066ffc_bb9bdff854db4b56bb3f6b58ee1ce532~mv2.png/v1/crop/x_0,y_261,w_1242,h_763/fill/w_860,h_528,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/image%20(1).png',
        shopifyUrl: 'https://f5c4e7-3.myshopify.com',
        parent_network_id: 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30',
        platform_fee_percentage: 30,
        is_active: true,
        accent: '#ff4d85',
        theme: {
          accent: '#ff4d85',
          heroCopy: 'Welcome to The Real Courtney Bee — Official Media, Broadcasts & Culture Stream.',
          heroImage: '/n2n/comedy_club_bg.jpg',
          logoImage: 'https://static.wixstatic.com/media/066ffc_bb9bdff854db4b56bb3f6b58ee1ce532~mv2.png/v1/crop/x_0,y_261,w_1242,h_763/fill/w_860,h_528,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/image%20(1).png',
          shopifyUrl: 'https://f5c4e7-3.myshopify.com',
          sliderCount: 4,
          enableBooking: true,
          heroLayoutMode: 'verbiage',
          enableWatchLive: true,
          parent_network_id: 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30'
        }
      });
    }
  }

  if (!data) return [];
  
  // Filter out test networks (Noelani, Bennie, Leilani, Leiloe, etc.)
  const filtered = data.filter((row: any) => {
    if (!includeInactive) {
      if (row.is_active === false || row.is_active === 'false' || row.theme?.is_active === false || row.theme?.is_active === 'false') {
        return false;
      }
    }
    const domainLower = (row.domain || '').toLowerCase();
    const nameLower = (row.name || '').toLowerCase();
    if (
      nameLower.includes('noelani') || 
      nameLower.includes('leilani') || nameLower.includes('leiloe') ||
      nameLower.includes('deleted') || nameLower.includes('finfire') ||
      domainLower.includes('noelani') ||
      domainLower.includes('leilani') || domainLower.includes('leiloe') ||
      domainLower.includes('deleted') || domainLower.includes('finfire')
    ) {
      return false;
    }
    return true;
  });

  const mapped = filtered.map((row: any) => normalizeWlConfig(row));

  // Apply local branding overrides if present
  try {
    const localOverrides = JSON.parse(localStorage.getItem('vibe_child_branding_overrides') || '{}');
    mapped.forEach((item: any) => {
      if (localOverrides[item.id]) {
        const ov = localOverrides[item.id];
        if (ov.name) item.name = ov.name;
        if (ov.logo !== undefined && ov.logo !== '') {
          item.logo = ov.logo;
          item.logoImage = ov.logo;
          if (!item.theme) item.theme = {};
          item.theme.logo = ov.logo;
          item.theme.logoImage = ov.logo;
        }
        if (ov.accent) {
          item.accent = ov.accent;
          if (!item.theme) item.theme = {};
          item.theme.accent = ov.accent;
        }
        if (ov.heroCopy) {
          if (!item.theme) item.theme = {};
          item.theme.heroCopy = ov.heroCopy;
        }
        if (ov.heroImage) {
          if (!item.theme) item.theme = {};
          item.theme.heroImage = ov.heroImage;
        }
        if (ov.defaultBio !== undefined) {
          if (!item.theme) item.theme = {};
          item.theme.defaultBio = ov.defaultBio;
        }
      }
    });
  } catch (e) {
    console.warn('N2N: Failed to merge local branding overrides', e);
  }

  const uniqueMap = new Map();
  mapped.forEach((item: any) => {
    if (!uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    }
  });
  return Array.from(uniqueMap.values());
}

/** Fetch all network IDs in the N2N tree (parent + children) */
export async function getN2NNetworkIds(parentId: string): Promise<string[]> {
  const children = await getChildNetworks(parentId);
  return [parentId, ...children.map(c => c.id)];
}

// ─── Profile Queries ─────────────────────────────────────────────

export async function getN2NProfiles(parentId: string): Promise<any[]> {
  const networkIds = await getN2NNetworkIds(parentId);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('whitelabel_id', networkIds)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('N2N: Failed to fetch profiles', error);
    return [];
  }
  return data || [];
}

// ─── Ledger / Revenue ────────────────────────────────────────────

/** Fetch aggregated ledger for the N2N tree */
export async function getN2NLedger(parentId: string): Promise<any[]> {
  const networkIds = await getN2NNetworkIds(parentId);
  
  // Get all creator IDs in the N2N tree
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .in('whitelabel_id', networkIds);

  const creatorIds = (profiles || []).map((p: any) => p.id);

  let query = supabase.from('ledger').select('*');
  if (creatorIds.length > 0) {
    query = query.or(`whitelabel_id.in.(${networkIds.join(',')}),creator_id.in.(${creatorIds.join(',')})`);
  } else {
    query = query.in('whitelabel_id', networkIds);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('N2N: Failed to fetch ledger', error);
    return [];
  }
  return data || [];
}

// ─── Child Network Management ────────────────────────────────────

/** Create a child network under a parent */
export async function createChildNetwork(
  parentId: string,
  config: {
    name: string;
    domain: string;
    logo?: string;
    accent?: string;
    heroCopy?: string;
    heroImage?: string;
    templateId?: string;
  },
  ownerId: string
): Promise<WlConfig | null> {
  let templateTheme = {};
  let templateLogo = null;
  let templateFee = 30;

  if (config.templateId) {
    try {
      const { data: templateData } = await supabase
        .from('whitelabel_configs')
        .select('*')
        .eq('id', config.templateId)
        .limit(1)
        .single();
        
      if (templateData) {
        templateTheme = templateData.theme || {};
        templateLogo = templateData.logo || null;
        templateFee = templateData.platform_fee_percentage ?? 30;
      }
    } catch (e) {
      console.warn("N2N: Failed to fetch template config, falling back to defaults", e);
    }
  }

  const childPayload: any = {
    owner_id: ownerId,
    name: config.name,
    domain: config.domain,
    logo: config.logo || templateLogo || null,
    parent_network_id: parentId,
    n2n_enabled: false,
    platform_fee_percentage: templateFee,
    theme: {
      accent: config.accent || '#D35400',
      heroCopy: config.heroCopy || `Welcome to ${config.name}`,
      heroImage: config.heroImage || null,
      enableWatchLive: true,
      enableBooking: false,
      heroLayoutMode: 'verbiage',
      sliderCount: 4,
      ...templateTheme,
      ...(config.accent && { accent: config.accent }),
      ...(config.heroCopy && { heroCopy: config.heroCopy }),
      ...(config.heroImage && { heroImage: config.heroImage }),
      parent_network_id: parentId,
    },
  };

  const { data, error } = await supabase
    .from('whitelabel_configs')
    .insert(childPayload)
    .select()
    .single();

  if (error) {
    // Fallback: If parent_network_id column doesn't exist, store in theme only
    console.warn('N2N: DB insert failed, trying fallback payload', error);
    delete childPayload.parent_network_id;
    delete childPayload.n2n_enabled;
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('whitelabel_configs')
      .insert(childPayload)
      .select()
      .single();

    if (fallbackError) {
      console.error('N2N: Fallback insert failed', fallbackError);
      return null;
    }
    return normalizeWlConfig(fallbackData);
  }
  return normalizeWlConfig(data);
}

/** Toggle a child network's disabled status */
export async function toggleChildNetwork(
  childId: string,
  disabled: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from('whitelabel_configs')
    .update({
      theme: disabled
        ? { _n2n_disabled: true }
        : { _n2n_disabled: false },
    })
    .eq('id', childId);

  if (error) {
    console.error('N2N: Failed to toggle child network', error);
    return false;
  }
  return true;
}

/** Update a child network's branding */
export async function updateChildBranding(
  childId: string,
  updates: {
    name?: string;
    logo?: string;
    accent?: string;
    heroCopy?: string;
    heroImage?: string;
    bg?: string;
    defaultBio?: string;
  }
): Promise<boolean> {
  let dbSuccess = false;

  try {
    // First get current config to merge theme
    const { data: current } = await supabase
      .from('whitelabel_configs')
      .select('theme')
      .eq('id', childId)
      .single();

    const existingTheme = current?.theme || {};

    const payload: any = {};
    if (updates.name) payload.name = updates.name;
    if (updates.logo !== undefined) payload.logo = updates.logo;
    if (updates.accent) payload.accent = updates.accent;

    payload.theme = {
      ...existingTheme,
      ...(updates.accent && { accent: updates.accent }),
      ...(updates.logo !== undefined && { logo: updates.logo, logoImage: updates.logo }),
      ...(updates.heroCopy && { heroCopy: updates.heroCopy }),
      ...(updates.heroImage && { heroImage: updates.heroImage }),
      ...(updates.bg && { bg: updates.bg }),
      ...(updates.defaultBio !== undefined && { defaultBio: updates.defaultBio }),
    };

    const { error } = await supabase
      .from('whitelabel_configs')
      .update(payload)
      .eq('id', childId);

    if (!error) {
      dbSuccess = true;
    } else {
      console.warn('N2N DB update note (using local override fallback):', error.message);
    }
  } catch (err) {
    console.warn('N2N: DB updateChildBranding skipped for virtual network ID', err);
  }

  // Always save to localStorage overrides so hardcoded/virtual networks & DB networks persist local changes
  try {
    const existingOverrides = JSON.parse(localStorage.getItem('vibe_child_branding_overrides') || '{}');
    existingOverrides[childId] = {
      ...(existingOverrides[childId] || {}),
      ...updates,
      updated_at: Date.now()
    };
    localStorage.setItem('vibe_child_branding_overrides', JSON.stringify(existingOverrides));
    return true;
  } catch (e) {
    console.error('N2N: Failed to save child branding to localStorage', e);
    return dbSuccess;
  }
}

/** Update fee percentage for a child network */
export async function updateChildFee(
  childId: string,
  fee: number
): Promise<boolean> {
  const { error } = await supabase
    .from('whitelabel_configs')
    .update({ platform_fee_percentage: fee })
    .eq('id', childId);

  if (error) {
    console.error('N2N: Failed to update child fee', error);
    return false;
  }
  return true;
}

/** Delete a child network */
export async function deleteChildNetwork(childId: string): Promise<boolean> {
  const { error } = await supabase
    .from('whitelabel_configs')
    .delete()
    .eq('id', childId);

  if (error) {
    console.warn('N2N: Hard delete blocked, performing soft archive update', error);
    const { error: softError } = await supabase
      .from('whitelabel_configs')
      .update({ is_active: false, theme: { _n2n_disabled: true, is_active: false } })
      .eq('id', childId);

    if (softError) {
      console.error('N2N: Failed to archive child network', softError);
      return false;
    }
  }
  return true;
}

export async function updateN2NUserRole(
  userId: string,
  role: string
): Promise<boolean> {
  const isAdmin = role === 'admin' || role === 'business_admin';

  const sql = `
    UPDATE public.profiles
    SET role = '${role}',
        is_admin = ${isAdmin}
    WHERE id = '${userId}';

    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "${role}"}'::jsonb
    WHERE id = '${userId}';
  `;

  const { error } = await supabase.rpc('execute_sql', { sql });

  if (error) {
    console.error('N2N: Failed to update user role', error);
    return false;
  }
  return true;
}

/** Enable or disable a user profile */
export async function updateN2NUserActive(
  userId: string,
  isActive: boolean
): Promise<boolean> {
  const sql = `
    UPDATE public.profiles
    SET is_active = ${isActive}
    WHERE id = '${userId}';
  `;

  const { error } = await supabase.rpc('execute_sql', { sql });

  if (error) {
    console.error('N2N: Failed to update user active status', error);
    return false;
  }
  return true;
}

/** Log an N2N action to system_logs */
export async function logN2NAction(
  actorId: string,
  message: string,
  metadata?: any
): Promise<void> {
  await supabase.from('system_logs').insert({
    level: 'INFO',
    message: `[N2N] ${message}`,
    actor_id: actorId,
    metadata: metadata || {},
  });
}

/** Merge current query parameters into a target URL, preserving target parameters on conflict */
export function mergeQueryParams(targetUrl: string, currentSearch: string): string {
  const [path, targetSearch] = targetUrl.split('?');
  const targetParams = new URLSearchParams(targetSearch || '');
  const currentParams = new URLSearchParams(currentSearch || '');
  
  const isProfileRoute = path.startsWith('/profile') || path.startsWith('/channel');

  currentParams.forEach((value, key) => {
    if (isProfileRoute && key === 'tenant' && !targetParams.has('tenant')) {
      return; // Profile routes manage their own creator identity and tenant context
    }
    if (!targetParams.has(key)) {
      targetParams.set(key, value);
    }
  });
  
  const mergedSearch = targetParams.toString();
  return mergedSearch ? `${path}?${mergedSearch}` : path;
}

export const OLYMPIA_CHAMPIONS = [
  {
    id: '84071a35-5f73-4927-a0a7-828800245096',
    title: 'Samson Dauda',
    image: '/n2n/samson.jpeg',
    tags: ['2024 Champion', 'Mr. Olympia'],
  },
  {
    id: 'c88adb24-5d9e-4886-9be0-e79f03f3d79e',
    title: 'Derek Lunsford',
    image: '/n2n/derek.jpeg',
    tags: ['2023 Champion', 'Mr. Olympia'],
  },
  {
    id: 'b4537110-f393-4fde-9f94-6885391589d8',
    title: 'Hadi Choopan',
    image: '/n2n/hadi.jpg',
    tags: ['2022 Champion', 'Mr. Olympia'],
  },
  {
    id: '7fb2a325-d877-4daf-a308-bd0089d888f1',
    title: 'Chris Bumstead',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    tags: ['6x Champion', 'Classic Physique'],
  },
  {
    id: 'f92fad9e-ab7e-44d6-818c-0527000810eb',
    title: 'Big Ramy',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Big_Ramy2.png',
    tags: ['2x Champion', 'Mr. Olympia'],
  },
  {
    id: '6d0b723d-c5ba-4991-8a89-b1466ed3b3ef',
    title: 'Brandon Curry',
    image: '/n2n/brandon.jpeg',
    tags: ['2019 Champion', 'Mr. Olympia'],
  },
  {
    id: '59e9f92c-c712-4676-bb07-40a4c394dfab',
    title: 'Shawn Rhoden',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Shawn_Rhoden.jpg',
    tags: ['2018 Champion', 'Mr. Olympia'],
  },
  {
    id: 'b6013ed0-5bd4-412d-9a42-d256a5ba9fc3',
    title: 'Phil Heath',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Philheath.jpg',
    tags: ['7x Champion', 'Mr. Olympia'],
  },
  {
    id: 'a7f353ba-6281-4b33-aff4-977325a1ebe8',
    title: 'Andrea Shaw',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Andrea_Shaw_at_the_2023_IFBB_Pro_League_New_York_Pro.png',
    tags: ['6x Champion', 'Ms. Olympia'],
  },
  {
    id: '0efb86ee-ab84-4e95-8d27-51c7368915e3',
    title: 'Iris Kyle',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Iris_Kyle_posing_at_2008_Ms._Olympia_%28cropped%29.jpg',
    tags: ['10x Champion', 'Ms. Olympia'],
  },
];

export const WINGS_ATHLETES = [
  {
    id: 'wos-ath-1',
    title: 'Aisling Hickey',
    image: '/n2n/wos_ath_1.jpg',
    tags: ['Wings Athlete'],
  },
  {
    id: 'wos-ath-2',
    title: 'Alana Shipp',
    image: '/n2n/wos_ath_2.jpg',
    tags: ['Wings Athlete'],
  },
  {
    id: 'wos-ath-3',
    title: 'Amanda Aivaliotis',
    image: '/n2n/wos_ath_3.jpg',
    tags: ['Wings Athlete'],
  },
  {
    id: 'wos-ath-4',
    title: 'Amanda Machado',
    image: '/n2n/wos_ath_4.jpg',
    tags: ['Wings Athlete'],
  },
  {
    id: 'wos-ath-5',
    title: 'Amanda Ptak',
    image: '/n2n/wos_ath_5.jpg',
    tags: ['Wings Athlete'],
  },
  {
    id: 'wos-ath-6',
    title: 'Amanda Slinker',
    image: '/n2n/wos_ath_6.jpg',
    tags: ['Wings Athlete'],
  },
  {
    id: 'wos-ath-7',
    title: 'Amanda Smith',
    image: '/n2n/wos_ath_7.jpg',
    tags: ['Wings Athlete'],
  },
  {
    id: 'wos-ath-8',
    title: 'Amberly Plaski',
    image: '/n2n/wos_ath_8.jpg',
    tags: ['Wings Athlete'],
  },
  {
    id: 'wos-ath-9',
    title: 'Anastasia Korableva',
    image: '/n2n/wos_ath_9.jpg',
    tags: ['Wings Athlete'],
  },
  {
    id: 'wos-ath-10',
    title: 'Anca Ioana Bergen',
    image: '/n2n/wos_ath_10.jpg',
    tags: ['Wings Athlete'],
  },
];

export const WINGS_LEGENDS = [
  {
    id: 'wos-leg-1',
    title: 'Alina Popa',
    image: '/n2n/wos_leg_1.jpg',
    tags: ['Hall of Fame', 'Legend'],
  },
  {
    id: 'wos-leg-2',
    title: 'Andrulla Blanchette',
    image: '/n2n/wos_leg_2.jpg',
    tags: ['Ms. Olympia', 'Legend'],
  },
  {
    id: 'wos-leg-3',
    title: 'Carla Dunlap',
    image: '/n2n/wos_leg_3.jpg',
    tags: ['Ms. Olympia', 'Legend'],
  },
  {
    id: 'wos-leg-4',
    title: 'Dayana Cadeau',
    image: '/n2n/wos_leg_4.jpg',
    tags: ['Ms. Olympia', 'Legend'],
  },
  {
    id: 'wos-leg-5',
    title: 'Helle Trevino',
    image: '/n2n/wos_leg_5.jpg',
    tags: ['Rising Phoenix', 'Legend'],
  },
  {
    id: 'wos-leg-6',
    title: 'Iris Kyle',
    image: '/n2n/wos_leg_6.jpg',
    tags: ['10x Ms. Olympia', 'Legend'],
  },
  {
    id: 'wos-leg-7',
    title: 'Kike Elomaa',
    image: '/n2n/wos_leg_7.jpg',
    tags: ['Ms. Olympia', 'Legend'],
  },
  {
    id: 'wos-leg-8',
    title: 'Lenda Murray',
    image: '/n2n/wos_leg_8.jpg',
    tags: ['8x Ms. Olympia', 'Legend'],
  },
  {
    id: 'wos-leg-9',
    title: 'Margie Martin',
    image: '/n2n/wos_leg_9.jpg',
    tags: ['Rising Phoenix', 'Legend'],
  },
  {
    id: 'wos-leg-10',
    title: 'Yaxeni Oriquen',
    image: '/n2n/wos_leg_10.jpg',
    tags: ['Ms. Olympia', 'Legend'],
  },
];




