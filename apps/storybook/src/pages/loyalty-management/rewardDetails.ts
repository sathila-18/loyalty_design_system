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
  /** The providers (Figma `367:19964`: a multi-select since 11 Nov 2026; was one, optional). */
  providers: string[];
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
  providers: [],
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

/** The fake row whose Edit opens with "Rules - segments & tiers" and added rules (story "Edit reward, rules"). */
export const RULES_REWARD = 'Tech Shop reward';

/** Its eligibility, as Figma `402:33879` (whose two "VIP, Platinum" rows are one here: a rule can't be added twice). */
const RULES_ELIGIBILITY: Partial<RewardDetails> = {
  eligibility: 'rules',
  rules: [
    { id: 1, segment: 'Staff', tier: 'Silver' },
    { id: 2, segment: 'Staff', tier: 'Gold' },
    { id: 3, segment: 'VIP', tier: 'Gold' },
    { id: 4, segment: 'VIP', tier: 'Platinum' },
    { id: 5, segment: 'Regular', tier: 'Platinum' },
  ],
  badge: 'Budget builder',
};

/**
 * Edit for a reward the form didn't make (the stories' fake rows): the list's values (name, partner, user limit) and
 * plausible fake ones for the rest.
 */
export function rewardDetailsFrom(reward: Reward): RewardDetails {
  return {
    ...EMPTY,
    ...(reward.name === RULES_REWARD ? RULES_ELIGIBILITY : {}),
    name: reward.name,
    event: EVENTS[reward.id % EVENTS.length]!,
    providers: reward.partner ? [reward.partner] : [],
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
