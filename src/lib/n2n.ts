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

  // Dynamically append Wings of Strength, M&F Hers, and Flex Online for Muscle & Fitness parent if not already present
  if (parentId === '7a017c4d-c08f-4260-8540-a0cc8bed4e11') {
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

  if (!data) return [];
  
  // Filter out test networks (Noelani, Bennie, Leilani, Leiloe, etc.)
  const filtered = data.filter((row: any) => {
    if (!includeInactive && row.is_active === false) {
      return false;
    }
    const domainLower = (row.domain || '').toLowerCase();
    const nameLower = (row.name || '').toLowerCase();
    if (
      nameLower.includes('bennie') || nameLower.includes('noelani') || 
      nameLower.includes('leilani') || nameLower.includes('leiloe') ||
      nameLower.includes('deleted') || nameLower.includes('finfire') ||
      domainLower.includes('bennie') || domainLower.includes('noelani') ||
      domainLower.includes('leilani') || domainLower.includes('leiloe') ||
      domainLower.includes('deleted') || domainLower.includes('finfire')
    ) {
      return false;
    }
    return true;
  });

  return filtered.map((row: any) => normalizeWlConfig(row));
}

/** Fetch all network IDs in the N2N tree (parent + children) */
export async function getN2NNetworkIds(parentId: string): Promise<string[]> {
  const children = await getChildNetworks(parentId);
  return [parentId, ...children.map(c => c.id)];
}

// ─── Profile Queries ─────────────────────────────────────────────

/** Fetch profiles across the entire N2N tree */
export async function getN2NProfiles(parentId: string): Promise<any[]> {
  const networkIds = await getN2NNetworkIds(parentId);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('whitelabel_id', networkIds)
    .neq('is_active', false)
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

  if (!profiles || profiles.length === 0) return [];

  const creatorIds = profiles.map((p: any) => p.id);
  const { data, error } = await supabase
    .from('ledger')
    .select('*')
    .in('creator_id', creatorIds)
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
  // First get current config to merge theme
  const { data: current } = await supabase
    .from('whitelabel_configs')
    .select('theme')
    .eq('id', childId)
    .single();

  const existingTheme = current?.theme || {};

  const payload: any = {};
  if (updates.name) payload.name = updates.name;
  if (updates.logo) payload.logo = updates.logo;

  payload.theme = {
    ...existingTheme,
    ...(updates.accent && { accent: updates.accent }),
    ...(updates.heroCopy && { heroCopy: updates.heroCopy }),
    ...(updates.heroImage && { heroImage: updates.heroImage }),
    ...(updates.bg && { bg: updates.bg }),
    ...(updates.defaultBio !== undefined && { defaultBio: updates.defaultBio }),
  };


  const { error } = await supabase
    .from('whitelabel_configs')
    .update(payload)
    .eq('id', childId);

  if (error) {
    console.error('N2N: Failed to update child branding', error);
    return false;
  }
  return true;
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
    console.error('N2N: Failed to delete child network', error);
    return false;
  }
  return true;
}

/** Update a user's role (scoped to N2N tree) */
export async function updateN2NUserRole(
  userId: string,
  role: string
): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) {
    console.error('N2N: Failed to update user role', error);
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
  
  currentParams.forEach((value, key) => {
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
    id: 'c1a0110c-5bd4-412d-9a42-d256a5ba9fc3',
    title: 'Chris Bumstead',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    tags: ['6x Champion', 'Classic Physique'],
  },
  {
    id: 'k2a0110d-5bd4-412d-9a42-d256a5ba9fc4',
    title: 'Keone Pearson',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    tags: ['2024 Champion', '212 Olympia'],
  },
  {
    id: 'r3a0110e-5bd4-412d-9a42-d256a5ba9fc5',
    title: 'Ryan Terry',
    image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?auto=format&fit=crop&q=80&w=800',
    tags: ['2024 Champion', 'Men\'s Physique'],
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
  {
    id: 'c4a0110f-5bd4-412d-9a42-d256a5ba9fc6',
    title: 'Cydney Gillon',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
    tags: ['8x Champion', 'Figure Olympia'],
  },
  {
    id: 'l5a01110-5bd4-412d-9a42-d256a5ba9fc7',
    title: 'Lauralie Chapados',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800',
    tags: ['3x Champion', 'Bikini Olympia'],
  },
  {
    id: 'i6a01111-5bd4-412d-9a42-d256a5ba9fc8',
    title: 'Isabelle Nunes',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800',
    tags: ['2024 Champion', 'Wellness Olympia'],
  },
  {
    id: 's7a01112-5bd4-412d-9a42-d256a5ba9fc9',
    title: 'Sarah Villegas',
    image: 'https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?auto=format&fit=crop&q=80&w=800',
    tags: ['4x Champion', 'Women\'s Physique'],
  },
  {
    id: 'm8a01113-5bd4-412d-9a42-d256a5ba9fca',
    title: 'Missy Truscott',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800',
    tags: ['2x Champion', 'Fitness Olympia'],
  },
];



