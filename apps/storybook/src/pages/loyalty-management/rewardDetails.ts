import type { Reward } from './rewards';

/** Fake options for the form's selects and lists (the screens' values first). */
export const EVENTS = ['QR payment - TXN fee', 'Fund transfer', 'Bill payment', 'Card purchase', 'Account opening'];
export const PROVIDERS = ['SLT Mobitel', 'Dialog', 'Tech Shop', 'Keells', 'Cinnamon Hotels & Resorts'];
export const CLAIM_DURATIONS = ['Per day', 'Per week', 'Per month', 'Per year', 'For the whole campaign'];
export const TIERS = ['Basic', 'Silver', 'Gold', 'Platinum'];
export const SEGMENTS = ['Staff', 'VIP', 'Regular'];
export const ALL_SEGMENTS = 'All segments';
export const ALL_TIERS = 'All tiers';
export const BADGES = ['Budget builder', 'Big spender', 'Early adopter', 'Loyal member'];

export const STEPS = ['Reward', 'Rules', 'Eligibility', 'UX'];

export type RewardType = 'discount' | 'cashback';
export type ValueType = 'fixed' | 'percentage';
export type GiveOn = 'every' | 'nth';
export type Eligibility = 'all' | 'tiers' | 'segments' | 'rules';

export interface Rule {
  id: number;
  segment: string;
  tier: string;
}

/** Everything the form holds; the page keeps it with the reward, so Edit starts from it. */
export interface RewardDetails {
  name: string;
  event: string | null;
  provider: string | null;
  lifetime: boolean;
  start: string | null;
  end: string | null;
  type: RewardType;
  valueType: ValueType;
  amount: string;
  maxCapacity: string;
  minTransaction: string;
  giveOn: GiveOn;
  count: string;
  pointsCost: string;
  promo: boolean;
  promoCode: string;
  claimDuration: string | null;
  claimsPerCustomer: string;
  maxUses: string;
  eligibility: Eligibility;
  tiers: string[];
  segments: string[];
  rules: Rule[];
  badge: string | null;
  headline: string;
  description: string;
  push: boolean;
}

/** An empty form (Add). */
export const EMPTY: RewardDetails = {
  name: '',
  event: null,
  provider: null,
  lifetime: false,
  start: null,
  end: null,
  type: 'discount',
  valueType: 'fixed',
  amount: '',
  maxCapacity: '',
  minTransaction: '',
  giveOn: 'every',
  count: '',
  pointsCost: '',
  promo: false,
  promoCode: '',
  claimDuration: null,
  claimsPerCustomer: '',
  maxUses: '',
  eligibility: 'all',
  tiers: [],
  segments: [],
  rules: [],
  badge: null,
  headline: '',
  description: '',
  push: false,
};

/**
 * Edit for a reward the form didn't make (the stories' fake rows): the list's values (name, partner, user limit) and
 * plausible fake ones for the rest.
 */
export function rewardDetailsFrom(reward: Reward): RewardDetails {
  return {
    ...EMPTY,
    name: reward.name,
    event: EVENTS[reward.id % EVENTS.length]!,
    provider: reward.partner ?? null,
    start: '2026-08-01',
    end: '2027-07-31',
    amount: '50.00',
    minTransaction: '500.00',
    pointsCost: '450',
    claimDuration: 'Per month',
    claimsPerCustomer: '1',
    maxUses: reward.userLimit === undefined ? '' : String(reward.userLimit),
    headline: reward.name,
    description: `Redeem ${reward.name.toLowerCase()} with your points.`,
  };
}
