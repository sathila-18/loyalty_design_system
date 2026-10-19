import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinPagination } from './FinPagination';
import { paginationRange } from './paginationRange';

const shown = () =>
  within(screen.getByRole('list'))
    .getAllByRole('listitem', { hidden: true })
    .map((li) => (li.getAttribute('aria-hidden') ? '…' : li.textContent?.replace(/chevron_(left|right)/, '') || ''))
    .filter(Boolean);

describe('paginationRange', () => {
  it('shows every page up to 7', () => {
    expect(paginationRange(1, 1)).toEqual([1]);
    expect(paginationRange(2, 4)).toEqual([1, 2, 3, 4]);
    expect(paginationRange(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('keeps 7 items with dots beyond that: near the start, in the middle, near the end', () => {
    expect(paginationRange(1, 10)).toEqual([1, 2, 3, 4, 5, 'dots-end', 10]);
    expect(paginationRange(4, 10)).toEqual([1, 2, 3, 4, 5, 'dots-end', 10]);
    expect(paginationRange(5, 10)).toEqual([1, 'dots-start', 4, 5, 6, 'dots-end', 10]);
    expect(paginationRange(7, 10)).toEqual([1, 'dots-start', 6, 7, 8, 9, 10]);
    expect(paginationRange(10, 10)).toEqual([1, 'dots-start', 6, 7, 8, 9, 10]);
  });
});

describe('FinPagination', () => {
  it('is a named navigation with a list: arrows, pages and the current page marked', () => {
    render(<FinPagination pageCount={4} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(shown()).toEqual(['1', '2', '3', '4']);
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeEnabled();
  });

  it('shows dots for the gaps, hidden from screen readers', () => {
    render(<FinPagination pageCount={10} defaultPage={5} />);
    expect(shown()).toEqual(['1', '…', '4', '5', '6', '…', '10']);
    for (const dots of screen.getAllByText('…')) expect(dots.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('moves with a page click and the arrows, and reports each change', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<FinPagination pageCount={10} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange.mock.calls).toEqual([[3], [4], [3]]);
  });

  it('with one page, shows it with both arrows disabled (Figma "Only one")', () => {
    render(<FinPagination pageCount={1} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('controlled: shows the given page and asks the parent to change it', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<FinPagination pageCount={10} page={2} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('keeps the page in range', () => {
    render(<FinPagination pageCount={5} page={9} />);
    expect(screen.getByRole('button', { name: 'Page 5' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('when an arrow becomes disabled at an end, moves focus to the current page', async () => {
    const user = userEvent.setup();
    render(<FinPagination pageCount={3} defaultPage={2} />);
    screen.getByRole('button', { name: 'Next page' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveFocus();
  });

  it('takes translated names, and forwards ref and attributes to the nav', () => {
    const ref = createRef<HTMLElement>();
    render(
      <FinPagination
        ref={ref}
        pageCount={3}
        label="Paginación"
        previousLabel="Anterior"
        nextLabel="Siguiente"
        pageLabel={(n) => `Página ${n}`}
        className="extra"
      />,
    );
    expect(screen.getByRole('navigation', { name: 'Paginación' })).toBe(ref.current);
    expect(ref.current).toHaveClass('extra');
    expect(screen.getByRole('button', { name: 'Página 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeInTheDocument();
  });
});
