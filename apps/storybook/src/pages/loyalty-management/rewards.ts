import type { RewardDetails } from './rewardDetails';

/** A reward's status, as Figma's badges (decided 27 Oct 2026: Figma's words and colours). */
export const REWARD_STATUSES = ['Draft', 'Published', 'Limit exceed', 'Expired'] as const;
export type RewardStatus = (typeof REWARD_STATUSES)[number];

/** One reward in the catalog. */
export interface Reward {
  id: number;
  name: string;
  /** The partner that provides it; none for the bank's own rewards ("N/A"). */
  partner?: string;
  /** How many members can redeem it; none means no limit ("N/A", decided 27 Oct 2026). */
  userLimit?: number;
  /** How many members have redeemed it; none yet shows "N/A". */
  users?: number;
  status: RewardStatus;
  /** Everything the Add reward form holds, kept so Edit starts from it (rewards added in the stories). */
  details?: RewardDetails;
}
