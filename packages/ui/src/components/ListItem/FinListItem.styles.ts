/*
 * FinListItem classes (DESIGN.md §9, §3.11). Figma List-base: padding 16 (Space-XL) top and sides, 0 bottom; the
 * content row and the divider 16 apart. Content: gap 12 (Space-L), top aligned; text column gap 4 (Space-XS); title
 * row gap 8 (Space-M). Large: title Headline Small-H6, body Body/Medium. Small: title Label/Medium, body Body/Small
 * (Figma binds the Small title to the H6 variables at 14/21; mapped to Label/Medium, decided 20 Oct 2026). Title
 * text-primary, body text-secondary; both wrap. No states: a base (decided 20 Oct 2026). Without a body the row is
 * centred, and the last item of a group has no divider but 16 of bottom padding (both decided 20 Oct 2026).
 *
 * The item is marked fin:group/list-item for the last-of-many variants in tailwind.css: when several items are shown
 * together, the last one (not a single item) has no divider and gets the 16 bottom padding.
 */
import type { FinListItemSize } from './FinListItem';

/*
 * Rule: an item without a divider gets 16 (Space-XL) of bottom padding, so it doesn't end flush with its content
 * (decided 22 Oct 2026; extends the rule of 20 Oct 2026). A component that sets its own padding (the side nav's user
 * row, the filled card) does it with `placement:`.
 */
const itemBase = 'fin:group/list-item fin:flex fin:flex-col fin:gap-xl fin:m-none fin:list-none fin:pt-xl fin:px-xl';

export const item = {
  divider: `${itemBase} fin:pb-none fin:last-of-many:pb-xl`,
  none: `${itemBase} fin:pb-xl`,
};

export const divider = 'fin:list-item-last:hidden';

/* No body: the title (and the trailing accessory) centred on the leading accessory. */
export const content = {
  body: 'fin:flex fin:gap-l fin:items-start',
  title: 'fin:flex fin:gap-l fin:items-center',
};

export const leadingContent = {
  body: 'fin:flex fin:flex-1 fin:gap-l fin:items-start fin:min-w-0',
  title: 'fin:flex fin:flex-1 fin:gap-l fin:items-center fin:min-w-0',
};

export const leading = 'fin:flex fin:flex-none fin:items-center';

export const trailing = 'fin:flex fin:flex-none fin:items-center';

export const text = 'fin:flex fin:flex-1 fin:flex-col fin:gap-xs fin:min-w-0';

export const titleRow = 'fin:flex fin:gap-m fin:items-center';

const titleBase = 'fin:flex-1 fin:min-w-0 fin:text-primary fin:wrap-break-word';

export const title: Record<FinListItemSize, string> = {
  large: `${titleBase} fin:font-headline-small-h6`,
  small: `${titleBase} fin:font-label-medium`,
};

export const body = 'fin:flex fin:flex-col fin:gap-m';

const descriptionBase = 'fin:m-none fin:text-secondary fin:wrap-break-word';

export const description: Record<FinListItemSize, string> = {
  large: `${descriptionBase} fin:font-body-medium`,
  small: `${descriptionBase} fin:font-body-small`,
};
