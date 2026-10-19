import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinInputChip } from './FinInputChip';

describe('FinInputChip', () => {
  it('shows the value with a ✕ button named "Remove {value}"; the chip itself is not a button', () => {
    const { container } = render(<FinInputChip onRemove={() => {}}>Gold</FinInputChip>);
    const chip = container.firstElementChild!;
    expect(chip.tagName).toBe('SPAN');
    expect(chip).toHaveAttribute('data-variant', 'unselected');
    expect(chip).toHaveTextContent('Gold');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Remove Gold' })).toHaveAttribute('type', 'button');
  });

  it('removes on a click on the ✕, and on Delete or Backspace there', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<FinInputChip onRemove={onRemove}>Gold</FinInputChip>);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Delete}');
    await user.keyboard('{Backspace}');
    expect(onRemove).toHaveBeenCalledTimes(3);
  });

  it('takes a custom remove label', () => {
    render(
      <FinInputChip onRemove={() => {}} removeLabel="Remove the Gold tier">
        Gold
      </FinInputChip>,
    );
    expect(screen.getByRole('button', { name: 'Remove the Gold tier' })).toBeInTheDocument();
  });

  it('when disabled, the ✕ is skipped by Tab and does nothing', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const { container } = render(
      <FinInputChip onRemove={onRemove} disabled>
        Gold
      </FinInputChip>,
    );
    await user.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
    await user.click(screen.getByRole('button'));
    expect(onRemove).not.toHaveBeenCalled();
    expect(container.firstElementChild).toHaveAttribute('data-disabled');
  });

  it('forwards ref to the ✕ button, className and attributes to the chip', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <FinInputChip ref={ref} onRemove={() => {}} size="xsmall" className="extra" title="Gold tier">
        Gold
      </FinInputChip>,
    );
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(container.firstElementChild).toHaveClass('extra');
    expect(container.firstElementChild).toHaveAttribute('title', 'Gold tier');
    expect(container.firstElementChild).toHaveAttribute('data-size', 'xsmall');
  });
});
