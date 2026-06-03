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
export async function getChildNetworks(parentId: string): Promise<WlConfig[]> {
  let data;
  const { data: initialData, error } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('parent_network_id', parentId)
    .order('created_at', { ascending: true });
  data = initialData;

  // If the column doesn't exist or no results, fallback to theme JSONB
  if ((error || !data || data.length === 0)) {
    const { data: allConfigs } = await supabase
      .from('whitelabel_configs')
      .select('*')
      .order('created_at', { ascending: true });

    if (allConfigs) {
      data = allConfigs.filter((row: any) => row.theme?.parent_network_id === parentId);
    }
  }

  if (!data) return [];
  return data.map((row: any) => normalizeWlConfig(row));
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
    .order('created_at', { ascending: false });

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
    .order('created_at', { ascending: false });

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
  },
  ownerId: string
): Promise<WlConfig | null> {
  const { data, error } = await supabase
    .from('whitelabel_configs')
    .insert({
      owner_id: ownerId,
      name: config.name,
      domain: config.domain,
      logo: config.logo || null,
      parent_network_id: parentId,
      n2n_enabled: false,
      platform_fee_percentage: 30,
      theme: {
        accent: config.accent || '#D35400',
        heroCopy: config.heroCopy || `Welcome to ${config.name}`,
        heroImage: config.heroImage || null,
        enableWatchLive: true,
        enableBooking: false,
        heroLayoutMode: 'verbiage',
        sliderCount: 4,
      },
    })
    .select()
    .single();

  if (error) {
    console.error('N2N: Failed to create child network', error);
    return null;
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



