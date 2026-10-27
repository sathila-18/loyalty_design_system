/** The tier levels, lowest first (Figma's Level menu, `347:15784`); several tiers can share a level (decided 27 Oct 2026). */
export const TIER_LEVELS = ['Entry', 'Intermediate', 'Advanced', 'Highest'] as const;
export type TierLevel = (typeof TIER_LEVELS)[number];

/** One tier: the points that move members up to it and down from it, and how fast they earn there. Common to every segment. */
export interface Tier {
  id: number;
  name: string;
  level: TierLevel;
  /** Points needed to reach this tier. */
  upgradeThreshold: number;
  /** Members below this drop a tier. 0 for the Entry tier. */
  downgradeThreshold: number;
  /** Points earned per point of spend at this tier ("2.00×"). */
  earnMultiplier: number;
  active: boolean;
}
