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
  /** When it happened, YYYY-MM-DD. */
  date: string;
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

/** "Today" for the stories' fake data, so the Duration ranges give the same rows every time. */
export const REPORT_TODAY = '2027-01-31';

/** The Duration chip's ranges (decided 28 Oct 2026; a custom date range comes later, from design). */
export const DURATIONS = [
  { value: 'all', label: 'All', months: 0, days: 0 },
  { value: '7d', label: 'Last 7 days', months: 0, days: 7 },
  { value: '30d', label: 'Last 30 days', months: 0, days: 30 },
  { value: '3m', label: 'Last 3 months', months: 3, days: 0 },
  { value: '12m', label: 'Last 12 months', months: 12, days: 0 },
] as const;
export type Duration = (typeof DURATIONS)[number]['value'];

/** The first day a range includes (YYYY-MM-DD), counted back from REPORT_TODAY; none for All. */
export function rangeStart(duration: Duration): string | null {
  const range = DURATIONS.find((d) => d.value === duration)!;
  if (!range.months && !range.days) return null;
  const d = new Date(`${REPORT_TODAY}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() - range.months);
  d.setUTCDate(d.getUTCDate() - range.days);
  return d.toISOString().slice(0, 10);
}

/** "806,400". */
export const number = (n: number) => n.toLocaleString('en-US');

/** "+1,240", "−450" (a real minus sign). */
export const signed = (n: number) => (n > 0 ? `+${number(n)}` : n < 0 ? `−${number(-n)}` : '0');

/** YYYY-MM-DD → DD/MM/YYYY, as the date fields (the screens: 28.09.2026). */
export const shortDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
