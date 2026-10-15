import { FinBadgeBase, type FinBadgeBaseProps, type FinBadgeTone } from '../BadgeBase';

export interface FinBadgeProps extends Omit<FinBadgeBaseProps, 'size'> {
  /** Figma `State` (Primary…Neutral; only changes colors, so `tone`, DESIGN.md §7.3). */
  tone?: FinBadgeTone;
}

/**
 * A status badge (Figma Badge-primary; DESIGN.md §9). Mapped from FinBadgeBase: always Small, everything else
 * (tone, label, leading and trailing icon) passes straight through. No markup or CSS of its own (§7.2).
 */
export function FinBadge(props: FinBadgeProps) {
  return <FinBadgeBase {...props} size="small" />;
}
