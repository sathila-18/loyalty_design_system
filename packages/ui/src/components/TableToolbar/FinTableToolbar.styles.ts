/*
 * FinTableToolbar classes (DESIGN.md §9, §3.11). Figma Table header: a row, bottom aligned, the two sides apart. Left:
 * the Search, 343 wide (Size-343, generated for it 22 Oct 2026), shrinking when there isn't room. Right: the Filter
 * slot and the button, 12 (Space-L) apart, centred, never shrinking. The parts bring their own look.
 */

export const toolbar = 'fin:flex fin:gap-l fin:items-end fin:justify-between fin:w-full';

export const start = 'fin:flex fin:flex-auto fin:min-w-0';

/*
 * The search field's width, over FinSearchField's own full width: both are in @layer fin, so `placement:` (in
 * tailwind.css) lets this one win, as the toolbar's CSS Module did before stage 3e.
 */
export const search = 'fin:placement:w-343 fin:max-w-full';

export const end = 'fin:flex fin:flex-none fin:gap-l fin:items-center';

/* Figma Filter slot: its chips, 4 (Space-XS) apart (Figma Chips-group). */
export const filters = 'fin:flex fin:gap-xs fin:items-center';
