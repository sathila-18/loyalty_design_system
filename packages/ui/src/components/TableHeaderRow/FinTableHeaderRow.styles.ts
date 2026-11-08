/*
 * FinTableHeaderRow classes (DESIGN.md §9, §3.11). Figma: a 40-tall row (was 48; 29 Oct 2026), no gap; the select cell
 * is a Grey Table header cell with only the checkbox (56 wide: 16 padding, 24 checkbox, 16 padding; Figma 72, narrow
 * since 29 Oct 2026), then the Slot's cells share the rest. The cells draw themselves (FinTableHeaderCell); the row
 * adds no fill or spacing.
 */

/* Shrink the select column to its checkbox; the other columns take the rest of the table's width. */
export const select = 'fin:w-0';
