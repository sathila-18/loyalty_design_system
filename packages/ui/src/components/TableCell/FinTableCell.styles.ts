/*
 * FinTableCell classes (DESIGN.md §9, §3.11). Figma: 40 tall (was 56; 29 Oct 2026), padding 0 / 24 (Space-3XL), gap 8
 * (Space-M), centred, no fill (the row draws fill and hover). Default text is Body/Medium text-secondary. The action
 * is FinButton's icon button (XSmall Tertiary, icon only, 22 Oct 2026): its own states and ring.
 */

export const cell = 'fin:p-none fin:align-middle';

/* The checkbox and ⋮ columns (code only, 29 Oct 2026): 16 either side. */
export const inner = {
  default: 'fin:flex fin:gap-m fin:items-center fin:h-40 fin:py-none fin:px-3xl',
  narrow: 'fin:flex fin:gap-m fin:items-center fin:h-40 fin:py-none fin:px-xl',
};

export const leading = 'fin:flex fin:flex-none fin:items-center';

/* The content can shrink, so long text ends in "…" instead of widening the column. */
export const content = 'fin:flex fin:min-w-0 fin:items-center';

export const text = 'fin:truncate fin:font-body-medium fin:text-secondary';

/*
 * Link: the all-button XSmall Tertiary look with an underline (Button/Medium, text-action), with no side padding so its
 * text lines up with the header's and the other cells' (decided by design 22 Oct 2026); 6 above and below keep it 36
 * tall. No hover or focus design: text-hovered, and the buttons' ring (§10 #6).
 */
export const link =
  'fin:truncate fin:py-s fin:px-none fin:rounded-s fin:font-button-medium fin:text-action fin:underline fin:underline-from-font ' +
  'fin:hover:text-hovered fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-1 fin:focus-visible:outline-focused';
