import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinCountrySelector } from './FinCountrySelector';

describe('FinCountrySelector', () => {
  it('is a button named by what it chooses and the chosen country, with a decorative Small flag and down arrow', () => {
    const { container } = render(<FinCountrySelector country="LK" />);
    const trigger = screen.getByRole('button', { name: 'Country, Sri Lanka' });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).not.toHaveAttribute('aria-expanded');
    const flag = container.querySelector('[data-shape]')!;
    expect(flag).toHaveAttribute('data-size', 'small');
    expect(flag).toHaveAttribute('aria-hidden', 'true');
    expect(trigger.querySelector('[translate="no"]')).toHaveTextContent('keyboard_arrow_down');
  });

  it('takes another label and announces when its menu is open', () => {
    render(<FinCountrySelector country="AE" label="Phone country" expanded />);
    const trigger = screen.getByRole('button', { name: 'Phone country, United Arab Emirates' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('reports clicks, Enter and Space (the menu will open on them)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<FinCountrySelector country="LK" onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('when disabled, dims the flag, is skipped by Tab and ignores clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(<FinCountrySelector country="LK" disabled onClick={onClick} />);
    expect(container.querySelector('[data-shape]')).toHaveAttribute('data-disabled');
    await user.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref, className and attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<FinCountrySelector ref={ref} country="LK" className="extra" aria-controls="menu" />);
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveClass('extra');
    expect(ref.current).toHaveAttribute('aria-controls', 'menu');
  });
});
