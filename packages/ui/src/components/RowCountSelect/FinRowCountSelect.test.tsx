import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinRowCountSelect } from './FinRowCountSelect';

describe('FinRowCountSelect', () => {
  it('is a button named by its label and value, with a decorative down arrow', () => {
    render(<FinRowCountSelect value={10} />);
    const select = screen.getByRole('button', { name: /^Rows per page:\s*10$/ });
    expect(select).toHaveAttribute('type', 'button');
    expect(select).toHaveAttribute('aria-haspopup', 'listbox');
    expect(select).toHaveAttribute('aria-expanded', 'false');
    expect(select.querySelector('[translate="no"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('opens a list box of row counts, the current one selected, named by the label', async () => {
    const user = userEvent.setup();
    render(<FinRowCountSelect value={25} label="Filas por página:" />);
    const select = screen.getByRole('button', { name: /^Filas por página:\s*25$/ });
    await user.click(select);
    expect(select).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox', { name: 'Filas por página' });
    expect(listbox).toHaveFocus();
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['10', '25', '50', '100']);
    expect(screen.getByRole('option', { name: '25' })).toHaveAttribute('aria-selected', 'true');
  });

  it('chooses with a click: reports the count, closes and returns focus', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FinRowCountSelect value={10} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('option', { name: '50' }));
    expect(onValueChange).toHaveBeenCalledWith(50);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('works with the keyboard: Enter opens on the current count, arrows move, Enter or Space chooses', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FinRowCountSelect value={25} onValueChange={onValueChange} />);
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('option', { name: '25' })).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith(100);
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('option', { name: '25' })).toHaveFocus();
    await user.keyboard('{Home} ');
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it('jumps to a count by typing, and takes its own options', async () => {
    const user = userEvent.setup();
    render(<FinRowCountSelect value={20} options={[5, 20, 200]} />);
    screen.getByRole('button').focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('2');
    expect(screen.getByRole('option', { name: '200' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('forwards ref, className and attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<FinRowCountSelect ref={ref} value={10} className="extra" data-testid="rows" />);
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveClass('extra');
    expect(ref.current).toHaveAttribute('data-testid', 'rows');
  });
});
