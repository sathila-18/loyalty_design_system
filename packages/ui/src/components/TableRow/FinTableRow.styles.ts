/*
 * FinTableRow classes (DESIGN.md §9, §3.11). Figma: the cells (40; were 56 until 29 Oct 2026) and a 1px border-default
 * line under them (41). State: Hovered bg-secondary, Selected bg-active, Selected - Hovered bg-active-hover; the fill
 * covers the whole row. The select cell is a Table cell with only the checkbox (56 wide: 16 padding, narrow; Figma 72).
 * The cells draw their own content (FinTableCell).
 *
 * The line is the row's border, so the table needs border-collapse: collapse (FinTable sets it); the last row never
 * has one (decided 20 Oct 2026). Line and fill are also `--fin-table-row-line` / `--fin-table-row-bg`, so a cell that
 * stays put while the table scrolls sideways (FinTable's row actions) can paint the row's colour over what passes
 * under it (22 Oct 2026). Named utilities in tailwind.css (table-row-*), one per state.
 */

/* With onRowClick: a pointer, and a ring inside the row when it has keyboard focus (§10 #6). */
const rowBase =
  'fin:table-row-line fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-2 fin:focus-visible:outline-focused';

const clickableBase = `${rowBase} fin:cursor-pointer`;

/* No Hovered fill with `hover` off. */
export const row = {
  still: {
    none: rowBase,
    hover: `${rowBase} fin:table-row-hover`,
    selected: `${rowBase} fin:table-row-selected`,
    selectedHover: `${rowBase} fin:table-row-selected-hover`,
  },
  clickable: {
    none: clickableBase,
    hover: `${clickableBase} fin:table-row-hover`,
    selected: `${clickableBase} fin:table-row-selected`,
    selectedHover: `${clickableBase} fin:table-row-selected-hover`,
  },
};

/* Shrink the select column to its checkbox; the other columns take the rest of the table's width. */
export const select = 'fin:w-0';
