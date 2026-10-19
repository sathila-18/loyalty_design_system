import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinTableFooter } from './FinTableFooter';

describe('FinTableFooter', () => {
  it('shows the summary, the row count and the pages worked out from the rows', () => {
    render(<FinTableFooter totalRows={45} rowsPerPage={10} />);
    expect(screen.getByText('Showing 1–10 of 45 entries in page 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Rows per page:\s*10$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Page 6' })).toBeNull();
  });

  it('updates the summary on a page change, in a polite live region', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<FinTableFooter totalRows={45} rowsPerPage={10} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Page 5' }));
    const summary = screen.getByText('Showing 41–45 of 45 entries in page 5');
    expect(summary).toHaveAttribute('aria-live', 'polite');
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('with no rows, shows 0 of 0 and a single page with both arrows disabled', () => {
    render(<FinTableFooter totalRows={0} rowsPerPage={10} />);
    expect(screen.getByText('Showing 0 of 0 entries')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('controlled: shows the given page, kept in range', () => {
    const { rerender } = render(<FinTableFooter totalRows={45} rowsPerPage={10} page={3} />);
    expect(screen.getByText('Showing 21–30 of 45 entries in page 3')).toBeInTheDocument();
    rerender(<FinTableFooter totalRows={45} rowsPerPage={25} page={3} />);
    expect(screen.getByText('Showing 26–45 of 45 entries in page 2')).toBeInTheDocument();
  });

  it('reports Row count clicks and its open state', async () => {
    const user = userEvent.setup();
    const onRowsPerPageClick = vi.fn();
    render(<FinTableFooter totalRows={45} rowsPerPage={10} rowsPerPageExpanded={false} onRowsPerPageClick={onRowsPerPageClick} />);
    const select = screen.getByRole('button', { name: /^Rows per page:\s*10$/ });
    expect(select).toHaveAttribute('aria-expanded', 'false');
    await user.click(select);
    expect(onRowsPerPageClick).toHaveBeenCalledOnce();
  });

  it('takes translated text, and forwards ref and attributes to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FinTableFooter
        ref={ref}
        className="extra"
        totalRows={45}
        rowsPerPage={10}
        summary={({ from, to, total }) => `${from}–${to} de ${total}`}
        rowsPerPageLabel="Filas por página:"
        paginationLabels={{ label: 'Paginación', pageLabel: (n) => `Página ${n}` }}
      />,
    );
    expect(ref.current).toHaveClass('extra');
    expect(screen.getByText('1–10 de 45')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Filas por página:\s*10$/ })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Paginación' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Página 2' })).toBeInTheDocument();
  });
});
