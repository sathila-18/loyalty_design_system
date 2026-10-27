import type { Reward, RewardStatus } from './rewards';

/** Fake data for the Reward catalog stories. */

/** Figma's ten rows (`349:18532`), as the screen has them. */
export const FIGMA_REWARDS: Reward[] = [
  { id: 1, name: 'Cash back', status: 'Draft' },
  { id: 2, name: 'Transaction fee', partner: 'SLT', userLimit: 20, users: 20, status: 'Published' },
  { id: 3, name: 'Tech Shop reward', partner: 'Tech Shop', userLimit: 100, users: 100, status: 'Published' },
  { id: 4, name: 'Biometric reward', status: 'Published' },
  { id: 5, name: 'Bonus', userLimit: 5, users: 10, status: 'Published' },
  { id: 6, name: 'Ring', partner: 'E-Commerce', userLimit: 50, users: 50, status: 'Limit exceed' },
  { id: 7, name: 'Points', partner: 'Grocery', userLimit: 30, users: 30, status: 'Published' },
  { id: 8, name: 'Discount', partner: 'Fashion Store', userLimit: 200, users: 200, status: 'Expired' },
  { id: 9, name: 'On groceries discount', status: 'Limit exceed' },
  { id: 10, name: 'Travel reward', partner: 'Travel Agency', userLimit: 150, users: 150, status: 'Published' },
];

const MORE: [string, string | undefined][] = [
  ['Movie tickets for two', 'Scope Cinemas'],
  ['Fuel voucher LKR 2,000', 'Lanka Fuel'],
  ['Airport lounge access', 'Colombo Airport Lounges'],
  ['Free annual card fee', undefined],
  ['Double points weekend', undefined],
  ['Coffee on us', 'Barista'],
  ['Hotel night stay (two adults, breakfast included, weekdays only)', 'Cinnamon Hotels & Resorts'],
  ['Online shopping 10% off', 'Daraz'],
  ['Supermarket voucher', 'Keells'],
  ['Mobile reload LKR 500', 'Dialog'],
  ['Pharmacy discount', 'Healthguard'],
  ['Book voucher', 'Sarasavi'],
  ['Spa day', 'Spa Ceylon'],
  ['Restaurant dinner for two', 'The Gallery Café'],
  ['Free ATM withdrawals', undefined],
  ['Gym membership month', 'Power World'],
  ['Electronics 5% off', 'Abans'],
  ['Taxi rides credit', 'PickMe'],
  ['School fees cashback', undefined],
  ['Insurance premium discount', 'Ceylinco Insurance'],
  ['Clothing voucher', 'Odel'],
  ['Birthday bonus points', undefined],
  ['Charity donation match', 'Sarvodaya'],
  ['Train ticket upgrade', 'Sri Lanka Railways'],
  ['Home appliance trade-in', 'Singer'],
  ['Welcome reward', undefined],
  ['Grocery delivery free for a month', 'Uber Eats'],
  ['Concert tickets', 'Nelum Pokuna'],
  ['Tea estate tour', 'Dilmah'],
  ['Legacy reward (migrated)', undefined],
];
const STATUSES: RewardStatus[] = ['Published', 'Published', 'Draft', 'Published', 'Limit exceed', 'Expired', 'Published'];

/** Up to 40 rewards: Figma's ten, then more with long names, no partner, no limit and large numbers. */
export const ALL_REWARDS: Reward[] = [
  ...FIGMA_REWARDS,
  ...MORE.map(([name, partner], i): Reward => {
    const status = STATUSES[i % STATUSES.length]!;
    const userLimit = i % 5 === 3 ? undefined : [25, 100, 250, 1000, 5000, 12500][i % 6]!;
    const users = status === 'Draft' ? undefined : userLimit === undefined ? 1240 + i * 37 : status === 'Limit exceed' ? userLimit : Math.round(userLimit * 0.6);
    return {
      id: FIGMA_REWARDS.length + i + 1,
      name,
      status,
      ...(partner ? { partner } : {}),
      ...(userLimit === undefined ? {} : { userLimit }),
      ...(users === undefined ? {} : { users }),
    };
  }),
];
