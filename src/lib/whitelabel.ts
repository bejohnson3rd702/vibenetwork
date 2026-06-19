import { MASTER_DOMAIN, DEFAULT_PLATFORM_NAME, FALLBACK_HERO_COPY } from '../constants';

export interface WlConfig {
  id: string;
  name: string;
  domain: string;
  accent: string;
  bg: string;
  heroCopy: string;
  btnPrimary: string;
  sliderCount: number;
  customSections: string;
  heroImage: string | null;
  logoImage: string | null;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  owner_id: string;
  enableWatchLive: boolean;
  enableBooking: boolean;
  heroLayoutMode: string;
  heroVideoUrl: string;
  heroVideoTitle: string;
  platform_fee_percentage?: number;
  theme: any;
  faviconImage?: string;
  logo?: string;
  n2n_enabled: boolean;
  parent_network_id: string | null;
  shopifyUrl?: string | null;
}

export function isOlympianConfig(config: any): boolean {
  if (!config) return false;
  const name = config.name?.toLowerCase() || '';
  const domain = config.domain?.toLowerCase() || '';
  return name.includes('olympia') || domain.includes('mrolympia.com') || name.includes('muscle') || name.includes('fitness');
}

export function isB2kConfig(config: any): boolean {
  if (!config) return false;
  const name = config.name?.toLowerCase() || '';
  const domain = config.domain?.toLowerCase() || '';
  return name.includes('b2k') || domain.includes('b2k.vibenetwork.tv');
}

export function isKpleConfig(config: any): boolean {
  if (!config) return false;
  const id = config.id || '';
  const name = config.name?.toLowerCase() || '';
  const domain = config.domain?.toLowerCase() || '';
  const parentId = config.parent_network_id || '';
  return id === '33742e2f-430b-4c2d-9cba-42507891ef02' ||
         parentId === '33742e2f-430b-4c2d-9cba-42507891ef02' ||
         name.includes('kple') ||
         name.includes('christian revival') ||
         domain.includes('kpletv.org');
}

export function normalizeWlConfig(
  raw: any,
  overrides?: Partial<WlConfig>
): WlConfig {
  const isKple = isKpleConfig(raw) || isKpleConfig(overrides);
  const isOlympian = isOlympianConfig(raw) || isOlympianConfig(overrides);
  const isB2k = isB2kConfig(raw) || isB2kConfig(overrides);

  const defaultAccent = isKple ? '#004e98' : (isOlympian ? '#E31B23' : (isB2k ? '#FF2A54' : '#D35400'));

  const theme = {
    ...(raw?.theme || {}),
    ...(isKple ? {
      heroCopy: 'Christian Revival Network — Come All Revival. Class A Christian Broadcasting.',
      logoImage: 'https://ui-avatars.com/api/?name=Christian+Revival+Network&background=004e98&color=fff'
    } : {})
  };
  const base = {
    id: raw?.id || 'master',
    name: isKple ? 'Christian Revival Network' : (raw?.name || DEFAULT_PLATFORM_NAME),
    domain: raw?.domain || MASTER_DOMAIN,
    accent: raw?.accent || theme.accent || defaultAccent,
    bg: theme.bg || raw?.bg || 'var(--bg-color)',
    heroCopy: theme.heroCopy || raw?.heroCopy || FALLBACK_HERO_COPY,
    btnPrimary: theme.btnPrimary || raw?.btnPrimary || 'Explore Content',
    sliderCount: theme.sliderCount || raw?.sliderCount || 4,
    customSections: theme.customSections || raw?.customSections || '',
    heroImage: theme.heroImage || raw?.heroImage || null,
    logoImage: raw?.logo || theme.logoImage || raw?.logoImage || null,
    contactEmail: theme.contactEmail || raw?.contactEmail,
    contactPhone: theme.contactPhone || raw?.contactPhone,
    contactAddress: theme.contactAddress || raw?.contactAddress,
    owner_id: raw?.owner_id || '',
    enableWatchLive: theme.enableWatchLive !== undefined ? theme.enableWatchLive : (raw?.enableWatchLive !== undefined ? raw.enableWatchLive : true),
    enableBooking: theme.enableBooking !== undefined ? theme.enableBooking : (raw?.enableBooking !== undefined ? raw.enableBooking : true),
    heroLayoutMode: theme.heroLayoutMode || raw?.heroLayoutMode || 'verbiage',
    heroVideoUrl: theme.heroVideoUrl || raw?.heroVideoUrl || '',
    heroVideoTitle: theme.heroVideoTitle || raw?.heroVideoTitle || '',
    platform_fee_percentage: raw?.platform_fee_percentage || 0,
    n2n_enabled: !!(raw?.n2n_enabled || theme.n2n_enabled || raw?.id === 'adb92e36-5ebc-4dc3-ae96-429f3dc1bb30' || raw?.domain === 'vibenetwork.tv'),
    parent_network_id: raw?.parent_network_id ?? theme.parent_network_id ?? null,
    theme: theme,
    shopifyUrl: raw?.shopifyUrl || theme.shopifyUrl || null,
    ...overrides,
  };

  if (isKple) {
    base.name = 'Christian Revival Network';
    base.logoImage = 'https://ui-avatars.com/api/?name=Christian+Revival+Network&background=004e98&color=fff';
    base.heroCopy = 'Christian Revival Network — Come All Revival. Class A Christian Broadcasting.';
  }

  // Ensure default accent is correct if none exists
  if (!base.accent || base.accent === '#D35400') {
    base.accent = defaultAccent;
  }

  return base;
}
