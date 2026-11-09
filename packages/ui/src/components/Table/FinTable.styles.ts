/*
 * FinTable classes (DESIGN.md §9, §3.11). Code only: the Header row, Table rows and Table footer, with no outer
 * border, background or radius. Fixed table layout: fixed columns take their width, flexible ones share the rest
 * equally, and long text ends in "…". Below the columns' minimum the table scrolls sideways. 16 (Space-XL) below the
 * toolbar and above the footer (the toolbar's gap changed from 32 to 16, 3 Nov 2026). The column widths, the fixed
 * cells' fill and shadow are named utilities in tailwind.css (table-*).
 */
import type { FinTableVariant } from './FinTable';

/*
 * `empty` (code first, 27 Oct 2026): in place of the table and footer. In a column layout the table grows to fill the
 * height left and the empty content fills this area, so a FinEmptyState sits in its middle; elsewhere it's as tall as
 * its content, with Space-12XL above and below.
 */
const rootBase = 'fin:flex fin:flex-col fin:gap-xl fin:min-w-0';

export const root = { shown: rootBase, empty: `${rootBase} fin:flex-auto` };

/*
 * `variant="bordered"` (code only, 3 Nov 2026): a 1px border-subtle line round the header and rows, Radius-S (8). The
 * scroll area draws it and clips to its corners, so the header's grey and the rows' fills follow the curve; the
 * fixed columns and their shadows stay inside it. The empty state gets the same frame. The toolbar and footer are
 * outside it. The last row has no line, so the bottom isn't doubled.
 */
const frame = 'fin:border fin:border-subtle fin:rounded-s';

/* The scroll area is the marker the fixed columns' shadows read data-hidden-start / data-hidden-end from. */
const scrollBase = 'fin:group/table-scroll fin:overflow-x-auto';

export const scroll: Record<FinTableVariant, string> = {
  default: scrollBase,
  bordered: `${scrollBase} ${frame}`,
};

const emptyBase = 'fin:flex fin:flex-auto fin:py-12xl';

export const empty: Record<FinTableVariant, string> = {
  default: emptyBase,
  bordered: `${emptyBase} ${frame}`,
};

/*
 * The row's line is its border, so borders are collapsed. Min width comes from the columns (set in TSX), plus the
 * select column (a 24 checkbox with 16 either side: 56) and the ⋮ column (a 32 button with 16 either side: 64); both
 * narrow, 16 instead of the cells' 24 (decided by design 29 Oct 2026; were 72 and 80).
 */
const tableBase = 'fin:table-grid fin:table-min-w fin:w-full fin:border-collapse fin:table-fixed';

export const table = {
  plain: tableBase,
  select: `${tableBase} fin:table-select-column`,
  actions: `${tableBase} fin:table-actions-column`,
  selectActions: `${tableBase} fin:table-select-column fin:table-actions-column`,
};

/* The select column: the checkbox and its padding either side (16 + 24 + 16 = 56). */
export const selectColumn = 'fin:table-narrow-w';

/* The ⋮ column (row actions, code first 22 Oct 2026): the 32 icon button with 16 either side (64). */
export const actionsColumn = 'fin:table-actions-w';

export const fixedColumn = 'fin:table-column-w';

/*
 * Kept in place while the table scrolls sideways: the ⋮ column on the right (end), or on the left after the select
 * column (start, which then stays too). A body cell's fill is the row's (`--fin-table-row-bg`, set by FinTableRow on
 * hover and selection; bg-primary otherwise), half a pixel short at the top and bottom so the table's own 1px line
 * between two rows shows through (23 Oct 2026: a separate line drawn by the cell snapped to different pixels than the
 * table's and showed 2px tall). A header cell keeps its own (Grey) fill; the header has no line.
 * While content passes under the fixed column, it casts Shadow/Sticky sideways (decided by design 22 Oct 2026), only
 * once the table is scrolled sideways (29 Oct 2026): on the left of a column fixed at the end, on the right of one
 * fixed at the start.
 */
const sticky = 'fin:sticky fin:z-1';

const stickyHeader = {
  end: `${sticky} fin:right-none fin:table-scrolled-both:table-sticky-shadow-end`,
  start: `${sticky} fin:left-none fin:table-scrolled:table-sticky-shadow-start`,
  startAfterSelect: `${sticky} fin:table-sticky-after-select fin:table-scrolled:table-sticky-shadow-start`,
  select: `${sticky} fin:left-none`,
};

export const stickyCell = {
  header: stickyHeader,
  body: {
    end: `${stickyHeader.end} fin:table-sticky-fill`,
    start: `${stickyHeader.start} fin:table-sticky-fill`,
    startAfterSelect: `${stickyHeader.startAfterSelect} fin:table-sticky-fill`,
    select: `${stickyHeader.select} fin:table-sticky-fill`,
  },
};

/* The loading status: read by screen readers, not shown. */
export const status = 'fin:sr-only';
