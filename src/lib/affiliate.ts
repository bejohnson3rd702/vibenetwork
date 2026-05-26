// ─── Vibe Affiliate Program ───────────────────────────────────────────────
// Tracks ?ref= referrals via localStorage and records 5% commissions.
// Built to mirror the existing localStorage wallet pattern so it migrates
// cleanly to Supabase ledger once Stripe webhooks are live.

const REFERRER_KEY = 'vibe_referrer';
const LEDGER_KEY = 'vibe_affiliate_ledger';
const COMMISSION_RATE = 0.05; // 5% flat
const COOKIE_WINDOW_DAYS = 30;

export type SaleType = 'subscription' | 'product' | 'booking' | 'tip';

export interface AffiliateCommission {
  id: string;
  referrerId: string;
  buyerId: string;
  earnedAmount: number;
  grossAmount: number;
  saleType: SaleType;
  timestamp: string;
}

interface StoredReferrer {
  referrerId: string;
  capturedAt: string; // ISO
}

// ── Capture referrer from URL ─────────────────────────────────────────────
// Call this on every app mount. Reads ?ref=userId and stores it if fresh.
export function captureReferrer(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (!ref) return;

    const entry: StoredReferrer = { referrerId: ref, capturedAt: new Date().toISOString() };
    localStorage.setItem(REFERRER_KEY, JSON.stringify(entry));
  } catch {
    // silently ignore — localStorage may be blocked in some browsers
  }
}

// ── Get the active referrer (if within the 30-day window) ─────────────────
export function getReferrer(): string | null {
  try {
    const raw = localStorage.getItem(REFERRER_KEY);
    if (!raw) return null;

    const stored: StoredReferrer = JSON.parse(raw);
    const capturedAt = new Date(stored.capturedAt).getTime();
    const now = Date.now();
    const windowMs = COOKIE_WINDOW_DAYS * 24 * 60 * 60 * 1000;

    if (now - capturedAt > windowMs) {
      localStorage.removeItem(REFERRER_KEY);
      return null;
    }

    return stored.referrerId;
  } catch {
    return null;
  }
}

// ── Record a commission ───────────────────────────────────────────────────
// Call this after every successful purchase. Skips self-referrals.
// Instantly credits the referrer's vibe_host_wallet (same as creator wallet).
export function recordAffiliateCommission(
  referrerId: string,
  buyerId: string,
  grossAmount: number,
  saleType: SaleType
): number {
  // Prevent self-referral
  if (referrerId === buyerId) return 0;

  const earned = parseFloat((grossAmount * COMMISSION_RATE).toFixed(2));
  if (earned <= 0) return 0;

  // Append to ledger
  const commission: AffiliateCommission = {
    id: `aff_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    referrerId,
    buyerId,
    earnedAmount: earned,
    grossAmount,
    saleType,
    timestamp: new Date().toISOString(),
  };

  try {
    const existing: AffiliateCommission[] = JSON.parse(
      localStorage.getItem(LEDGER_KEY) || '[]'
    );
    existing.push(commission);
    localStorage.setItem(LEDGER_KEY, JSON.stringify(existing));

    // Credit the referrer's wallet in localStorage
    // NOTE: This credits the referrerId's wallet key.
    // In production, a Supabase Edge Function / webhook handles this instead.
    const walletKey = `vibe_host_wallet_${referrerId}`;
    const current = parseFloat(localStorage.getItem(walletKey) || '0');
    localStorage.setItem(walletKey, String((current + earned).toFixed(2)));
  } catch {
    // silently ignore
  }

  return earned;
}

// ── Get affiliate stats for a given user ─────────────────────────────────
export interface AffiliateStats {
  totalEarned: number;
  commissionCount: number;
  uniqueBuyers: number;
  recentCommissions: AffiliateCommission[];
}

export function getAffiliateStats(userId: string): AffiliateStats {
  try {
    const all: AffiliateCommission[] = JSON.parse(
      localStorage.getItem(LEDGER_KEY) || '[]'
    );
    const mine = all.filter(c => c.referrerId === userId);

    const totalEarned = parseFloat(
      mine.reduce((sum, c) => sum + c.earnedAmount, 0).toFixed(2)
    );
    const uniqueBuyers = new Set(mine.map(c => c.buyerId)).size;
    const recentCommissions = [...mine]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    return { totalEarned, commissionCount: mine.length, uniqueBuyers, recentCommissions };
  } catch {
    return { totalEarned: 0, commissionCount: 0, uniqueBuyers: 0, recentCommissions: [] };
  }
}

// ── Get commission rate (allows B2B override in future) ───────────────────
export function getCommissionRate(overrideRate?: number): number {
  return overrideRate ?? COMMISSION_RATE;
}
