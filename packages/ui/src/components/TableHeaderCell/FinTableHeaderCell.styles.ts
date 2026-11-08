/*
 * FinTableHeaderCell classes (DESIGN.md §9, §3.11). Figma: 40 tall (was 48; 29 Oct 2026), padding 0 / 24 (Space-3XL),
 * gap 12 (Space-L), centred; Grey fills bg-tertiary, White has none. The checkbox is FinCheckboxBase, the title FinLabel
 * (Label/Medium, text-tertiary). The trailing arrow is fg-secondary (Figma raw #626262, the same colour in Light).
 * No hover.
 */
import type { FinTableHeaderCellType } from './FinTableHeaderCell';

/* A <th> keeps its row's text (not the browser's bold or centring); font-weight-inherit in tailwind.css. */
const cellBase = 'fin:p-none fin:font-weight-inherit fin:text-start fin:align-middle';

export const cell: Record<FinTableHeaderCellType, string> = {
  white: cellBase,
  grey: `${cellBase} fin:bg-tertiary`,
};

/* The checkbox and ⋮ columns (code only, 29 Oct 2026): 16 either side. */
const contentBase = 'fin:relative fin:flex fin:gap-l fin:items-center fin:h-40 fin:py-none';

export const content = {
  default: `${contentBase} fin:px-3xl`,
  narrow: `${contentBase} fin:px-xl`,
};

/*
 * The title can shrink, so a long one ends in "…" instead of widening the column. Figma Show title off: hidden on
 * screen, still the column's name for screen readers.
 */
export const slot = {
  shown: 'fin:flex fin:min-w-0',
  hidden: 'fin:flex fin:min-w-0 fin:sr-only',
};

export const trailing = 'fin:flex fin:flex-none fin:fg-secondary';

/*
 * Sortable (code first, 22 Oct 2026): the title and its 20 sort icon as one button, 4 apart. The title keeps its
 * colour (font-inherit in tailwind.css). No Focused design: the default ring, 2px border-focused, 2px out (§10 #6).
 */
export const sort =
  'fin:group/sort fin:inline-flex fin:gap-xs fin:items-center fin:min-w-0 fin:m-none fin:p-none fin:border-none fin:border-current ' +
  'fin:rounded-xs fin:bg-transparent fin:text-inherit fin:font-inherit fin:text-start fin:cursor-pointer ' +
  'fin:focus-visible:outline-2 fin:focus-visible:outline-offset-2 fin:focus-visible:outline-focused';

/* The sort icon: fg-secondary (hover fg-hovered, pressed fg-pressed), and purple (fg-action) once sorted, with no change. */
export const sortIcon = {
  unsorted:
    'fin:flex fin:flex-none fin:fg-secondary fin:group-hover/sort:fg-hovered fin:group-active/sort:fg-pressed',
  sorted: 'fin:flex fin:flex-none fin:fg-action',
};
