/** Customers' points, and each customer's points history (DESIGN.md §8.6, Report management → Reports). */

export const SEGMENTS = ['Staff', 'VIP', 'Regular'] as const;
export type Segment = (typeof SEGMENTS)[number];
export const TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum'] as const;
export type Tier = (typeof TIERS)[number];
export const ACTIVITY_TYPES = ['Reward earn', 'Reward redemption', 'Learning', 'Cash conversion', 'Expiry', 'Adjustment'] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

/** One change to a customer's points: earned (+) or spent, converted or expired (−). */
export interface Activity {
  id: number;
  type: ActivityType;
  description: string;
  /** Signed: +1240 earned, −450 spent. */
  points: number;
  /** The active balance after it. */
  balance: number;
  /** Lifetime points after it (all points ever earned). */
  lifetime: number;
}

export interface Customer {
  id: number;
  name: string;
  segment: Segment;
  tier: Tier;
  earned: number;
  redeemed: number;
  converted: number;
  expired: number;
  /** The last activity's date, YYYY-MM-DD. */
  lastActivity: string;
  /** The next points to expire, if any. */
  nextExpiry?: { points: number; date: string };
  /** Newest first. */
  history: Activity[];
}

/** Points still to use: earned less redeemed, converted and expired (Figma's first row: 12,400 − 4,500 − 2,000 − 0 = 5,900). */
export const activeBalance = (c: Customer) => c.earned - c.redeemed - c.converted - c.expired;

/** "806,400". */
export const number = (n: number) => n.toLocaleString('en-US');

/** "+1,240", "−450" (a real minus sign). */
export const signed = (n: number) => (n > 0 ? `+${number(n)}` : n < 0 ? `−${number(-n)}` : '0');

/** YYYY-MM-DD → DD/MM/YYYY, as the date fields (the screens: 28.09.2026). */
export const shortDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
