/*
 * FinStatCard classes (DESIGN.md §9, §3.11; code first, measured from the Reports screens `435:90575`, `440:94624`):
 * bg-active, Radius-L (16), Space-2XL (20) padding, the label then the value with no gap (Figma's Text Box:
 * Label/Medium 21 tall over Headline Large-H4 33.6, so 95 tall with Figma's text). Fills its container.
 */

export const card = 'fin:flex fin:box-border fin:flex-col fin:justify-center fin:min-w-0 fin:p-2xl fin:rounded-l fin:bg-active';

/*
 * Label/Medium, one line, "…" when narrow, as FinLabel; but text-secondary, not the screens' text-tertiary, which is
 * 4.48:1 on Dark bg-active (under 4.5; decided by design 28 Oct 2026). It's the card's own text, as FinLabel has no
 * colour option (Figma's Label has none).
 */
export const label = 'fin:truncate fin:m-none fin:text-secondary fin:font-label-medium';

/* Headline Large-H4, text-primary; a long value wraps rather than overflowing. */
export const value = 'fin:m-none fin:text-primary fin:font-headline-large-h4 fin:wrap-anywhere';
