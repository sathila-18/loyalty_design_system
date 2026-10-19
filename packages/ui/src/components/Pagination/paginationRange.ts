/**
 * Which pages a pagination shows (DESIGN.md §9, decided 19 Oct 2026): every page when there are 7 or fewer;
 * otherwise always 7 items: the first and last page, the current page with one neighbour on each side, and dots
 * for the gaps (1 2 3 4 5 … 10, 1 … 4 5 6 … 10, 1 … 6 7 8 9 10). The count stays the same, so the control
 * doesn't change width as the page moves.
 */
export type PaginationRangeItem = number | 'dots-start' | 'dots-end';

const MAX_ITEMS = 7;

const run = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export function paginationRange(page: number, pageCount: number): PaginationRangeItem[] {
  if (pageCount <= MAX_ITEMS) return run(1, pageCount);
  const nearStart = page <= 4;
  const nearEnd = page >= pageCount - 3;
  if (nearStart) return [...run(1, 5), 'dots-end', pageCount];
  if (nearEnd) return [1, 'dots-start', ...run(pageCount - 4, pageCount)];
  return [1, 'dots-start', page - 1, page, page + 1, 'dots-end', pageCount];
}
