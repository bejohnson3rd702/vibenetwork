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
}

export function normalizeWlConfig(
  raw: any,
  overrides?: Partial<WlConfig>
): WlConfig {
  const theme = raw?.theme || {};
  return {
    id: raw?.id || 'master',
    name: raw?.name || DEFAULT_PLATFORM_NAME,
    domain: raw?.domain || MASTER_DOMAIN,
    accent: raw?.accent || theme.accent || '#0055ff',
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
    enableBooking: theme.enableBooking !== undefined ? theme.enableBooking : (raw?.enableBooking !== undefined ? raw.enableBooking : false),
    heroLayoutMode: theme.heroLayoutMode || raw?.heroLayoutMode || 'verbiage',
    heroVideoUrl: theme.heroVideoUrl || raw?.heroVideoUrl || '',
    heroVideoTitle: theme.heroVideoTitle || raw?.heroVideoTitle || '',
    platform_fee_percentage: raw?.platform_fee_percentage || 0,
    theme: theme,
    ...overrides,
  };
}
