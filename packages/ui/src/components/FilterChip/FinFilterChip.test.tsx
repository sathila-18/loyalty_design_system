import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinFilterChip } from './FinFilterChip';

describe('FinFilterChip', () => {
  it('is a toggle button, off by default, with the Unselected look', () => {
    render(<FinFilterChip>Gold</FinFilterChip>);
    const chip = screen.getByRole('button', { name: 'Gold', pressed: false });
    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('data-variant', 'unselected');
  });

  it('uncontrolled: toggles on click and with Space, and reports each change', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(<FinFilterChip onSelectedChange={onSelectedChange}>Gold</FinFilterChip>);
    const chip = screen.getByRole('button');
    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveAttribute('data-variant', 'selected');
    await user.keyboard(' ');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    expect(onSelectedChange.mock.calls).toEqual([[true], [false]]);
  });

  it('starts selected with defaultSelected', () => {
    render(<FinFilterChip defaultSelected>Gold</FinFilterChip>);
    expect(screen.getByRole('button', { pressed: true })).toBeInTheDocument();
  });

  it('controlled: shows the given value and asks the parent to change it', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <FinFilterChip selected onSelectedChange={onSelectedChange}>
        Gold
      </FinFilterChip>,
    );
    await user.click(screen.getByRole('button'));
    expect(onSelectedChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('lets onClick cancel the toggle', async () => {
    const user = userEvent.setup();
    render(<FinFilterChip onClick={(e) => e.preventDefault()}>Gold</FinFilterChip>);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('when disabled, cannot be toggled and keeps its value', async () => {
    const user = userEvent.setup();
    render(
      <FinFilterChip disabled defaultSelected>
        Gold
      </FinFilterChip>,
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button')).toHaveAttribute('data-disabled');
  });

  it('forwards ref and attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <FinFilterChip ref={ref} size="large" leadingIcon="person" className="extra">
        Gold
      </FinFilterChip>,
    );
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveClass('extra');
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'large');
  });
});
