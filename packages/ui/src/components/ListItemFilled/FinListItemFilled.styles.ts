/*
 * FinListItemFilled classes (DESIGN.md §9, §3.11). Figma List_fill-base: FinListItem in a frame, bg-primary, 1px
 * border-subtle, radius L, padding 16 (Space-XL) all round; no divider. Filled items shown together sit 12 (Space-L)
 * apart (decided 20 Oct 2026; after-list-filled in tailwind.css, each card marked fin:group/list-filled). The padding
 * replaces FinListItem's own, so it's `placement:` (both in @layer fin). The border is an inset ring, inside the frame
 * as in Figma (an outside border would make it 2px taller), as Badge and Chip.
 */
import type { FinListItemDensity } from '../ListItem';

const filledBase =
  'fin:group/list-filled fin:inset-ring fin:inset-ring-subtle fin:rounded-l fin:bg-primary fin:after-list-filled:mt-l';

/* Density (code first, 16 Nov 2026): Default 16 (Space-XL) all round, Compact 8 (Space-M). Cards stay 12 apart. */
export const filled: Record<FinListItemDensity, string> = {
  default: `${filledBase} fin:placement:p-xl`,
  compact: `${filledBase} fin:placement:p-m`,
};
