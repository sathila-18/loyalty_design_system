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
    expect(select).not.toHaveAttribute('aria-expanded');
    expect(select.querySelector('[translate="no"]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('takes a translated label and announces when its menu is open', () => {
    render(<FinRowCountSelect value={25} label="Filas por página:" expanded />);
    const select = screen.getByRole('button', { name: /^Filas por página:\s*25$/ });
    expect(select).toHaveAttribute('aria-expanded', 'true');
  });

  it('reports clicks, Enter and Space (the menu will open on them)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<FinRowCountSelect value={10} onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('forwards ref, className and attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<FinRowCountSelect ref={ref} value={10} className="extra" aria-controls="rows-menu" />);
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveClass('extra');
    expect(ref.current).toHaveAttribute('aria-controls', 'rows-menu');
  });
});
