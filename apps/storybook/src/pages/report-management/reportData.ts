import type { Activity, ActivityType, Customer, Segment, Tier } from './reportModel';

/** `days` before an ISO date (YYYY-MM-DD). */
const daysBefore = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
};

/** Fake data for the Reports stories: Figma's ten customers first (`435:90575`), Fatima Khan's history as `440:94624`. */

/** Figma's history for Fatima Khan, newest first: type, description, points, balance after, lifetime after. */
const FATIMA: [ActivityType, string, number, number, number][] = [
  ['Reward redemption', 'Transfer fee waiver', -450, 5900, 12400],
  ['Reward earn', 'Card spend LKR 620', 1240, 6350, 12400],
  ['Learning', 'Avoiding late payment fee', 50, 5110, 11160],
  ['Cash conversion', '2,000 pts to account credit', -2000, 5060, 11110],
  ['Expiry', 'Points expired (36-month policy)', -120, 6160, 10210],
  ['Reward earn', 'Referral bonus', 500, 6660, 10710],
  ['Reward redemption', 'Gift card redemption', -750, 5910, 10710],
  ['Reward earn', 'Travel booking reward', 320, 6230, 11030],
  ['Adjustment', 'Manual points correction', 80, 6310, 11110],
  ['Expiry', 'Points expired (36-month policy)', -100, 6210, 11110],
];

const EARN = ['Card spend LKR 1,200', 'Bill payment', 'Referral bonus', 'Travel booking reward', 'Online shopping', 'Fuel purchase'];
const SPEND = ['Gift card redemption', 'Transfer fee waiver', 'Movie tickets', 'Coffee voucher'];

/** A plausible history for another customer: `n` activities ending at their balance and lifetime, newest first. */
function historyFor(c: Omit<Customer, 'history'>, n: number): Activity[] {
  const out: Activity[] = [];
  let balance = c.earned - c.redeemed - c.converted - c.expired;
  let lifetime = c.earned;
  for (let i = 0; i < n; i += 1) {
    const kind = i % 5;
    const type: ActivityType = kind === 0 || kind === 3 ? 'Reward earn' : kind === 1 ? 'Reward redemption' : kind === 2 ? 'Learning' : 'Cash conversion';
    const points = type === 'Reward earn' ? 200 + ((i * 137) % 900) : type === 'Learning' ? 50 : type === 'Reward redemption' ? -(150 + ((i * 89) % 600)) : -1000;
    const description = type === 'Reward earn' ? EARN[i % EARN.length]! : type === 'Learning' ? 'Lesson completed' : type === 'Reward redemption' ? SPEND[i % SPEND.length]! : '1,000 pts to account credit';
    // Newest on the last activity's date, then every 4 to 15 days back.
    out.push({ id: i + 1, date: daysBefore(c.lastActivity, i * (4 + (i % 12))), type, description, points, balance, lifetime });
    // Going back in time: before this activity.
    balance -= points;
    if (points > 0) lifetime -= points;
  }
  return out;
}

/** Figma's ten (`435:90575`): name, tier, earned, redeemed, converted, expired, last activity. */
const FIGMA: [string, Tier, number, number, number, number, string][] = [
  ['Fatima Khan', 'Gold', 12400, 4500, 2000, 0, '2026-09-28'],
  ['Marcus Chen', 'Platinum', 18250, 6800, 1500, 0, '2026-10-12'],
  ['Sofia Patel', 'Silver', 9800, 3200, 1100, 0, '2026-11-05'],
  ['Noah Brooks', 'Bronze', 4150, 1800, 0, 0, '2026-11-18'],
  ['Ava Moretti', 'Gold', 14700, 5400, 2300, 0, '2026-12-02'],
  ['Ethan Kim', 'Platinum', 22100, 8900, 3200, 0, '2026-12-15'],
  ['Liam Nguyen', 'Silver', 11300, 4100, 1400, 0, '2026-12-22'],
  ['Emma Davis', 'Bronze', 3900, 1200, 0, 0, '2027-01-05'],
  ['Olivia Brown', 'Gold', 16500, 6200, 2100, 0, '2027-01-12'],
  ['Mason Lee', 'Platinum', 25800, 10400, 4000, 0, '2027-01-28'],
];

const MORE = [
  'Amara Perera',
  'Kasun Fernando',
  'Nimali Jayasinghe',
  'Ruwan de Silva',
  'Dilini Wickramasinghe',
  'Tharindu Bandara',
  'Ishara Gunawardena',
  'Chamari Rathnayake',
  'Sanjeewa Herath',
  'Anushka Senanayake-Wijesekera de Alwis',
  'Malith Karunaratne',
  'Hiruni Dissanayake',
  'Pradeep Kumara',
  'Sachini Abeysekara',
  'Lahiru Mendis',
];
const TIER_LIST: Tier[] = ['Bronze', 'Silver', 'Gold', 'Platinum'];
const SEGMENT_LIST: Segment[] = ['Regular', 'VIP', 'Staff'];

export const ALL_CUSTOMERS: Customer[] = [
  ...FIGMA.map(([name, tier, earned, redeemed, converted, expired, lastActivity], i) => ({ name, tier, earned, redeemed, converted, expired, lastActivity, i })),
  ...MORE.map((name, j) => {
    const i = FIGMA.length + j;
    const earned = j === 4 ? 0 : 2500 + ((j * 3571) % 30000);
    return {
      name,
      tier: TIER_LIST[j % 4]!,
      earned,
      redeemed: Math.round(earned * 0.3),
      converted: j % 3 === 0 ? 0 : Math.round(earned * 0.1),
      expired: j % 4 === 1 ? 300 : 0,
      lastActivity: `2027-0${1 + (j % 3)}-${String(3 + j).padStart(2, '0')}`,
      i,
    };
  }),
].map(({ i, ...c }): Customer => {
  const base = { id: i + 1, segment: SEGMENT_LIST[i % 3]!, ...c, ...(c.earned > 0 ? { nextExpiry: { points: 200 + ((i * 113) % 1500), date: '2026-10-31' } } : {}) };
  const history: Activity[] =
    i === 0
      ? FATIMA.map(([type, description, points, balance, lifetime], k) => ({ id: k + 1, date: daysBefore(c.lastActivity, k * 11), type, description, points, balance, lifetime }))
      : c.earned === 0
        ? []
        : historyFor(base, 6 + (i % 18));
  return { ...base, history, ...(i === 0 ? { nextExpiry: { points: 1200, date: '2026-10-31' } } : {}) };
});

export const FIGMA_CUSTOMERS = ALL_CUSTOMERS.slice(0, 10);
