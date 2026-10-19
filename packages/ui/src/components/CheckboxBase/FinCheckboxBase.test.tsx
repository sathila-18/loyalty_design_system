import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinCheckboxBase } from './FinCheckboxBase';

describe('FinCheckboxBase', () => {
  it('is a native checkbox named by its hidden label, unchecked by default', () => {
    render(<FinCheckboxBase label="Select row" />);
    const box = screen.getByRole('checkbox', { name: 'Select row' });
    expect(box).toHaveAttribute('type', 'checkbox');
    expect(box).not.toBeChecked();
  });

  it('toggles with a click and with Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinCheckboxBase label="Select row" onChange={onChange} />);
    const box = screen.getByRole('checkbox');
    await user.click(box);
    expect(box).toBeChecked();
    await user.keyboard(' ');
    expect(box).not.toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('sets indeterminate on the input, so it is announced as mixed', () => {
    const { rerender } = render(<FinCheckboxBase label="Select all" indeterminate />);
    const box = screen.getByRole<HTMLInputElement>('checkbox');
    expect(box.indeterminate).toBe(true);
    expect(box).toBePartiallyChecked();
    rerender(<FinCheckboxBase label="Select all" />);
    expect(box.indeterminate).toBe(false);
  });

  it('works controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinCheckboxBase label="Select row" checked onChange={onChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('when disabled, is skipped by Tab and does not change', async () => {
    const user = userEvent.setup();
    render(<FinCheckboxBase label="Select row" disabled />);
    await user.tab();
    expect(screen.getByRole('checkbox')).not.toHaveFocus();
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('keeps the box and icons out of the accessibility tree', () => {
    const { container } = render(<FinCheckboxBase label="Select row" defaultChecked />);
    const icons = container.querySelectorAll('[translate="no"]');
    expect([...icons].map((i) => i.textContent)).toEqual(['check', 'remove']);
    for (const i of icons) expect(i.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('forwards ref and input attributes to the input, className to the wrapper', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<FinCheckboxBase ref={ref} label="Select row" name="rows" value="7" className="extra" />);
    const box = screen.getByRole('checkbox');
    expect(ref.current).toBe(box);
    expect(box).toHaveAttribute('name', 'rows');
    expect(box).toHaveAttribute('value', '7');
    expect(container.firstElementChild).toHaveClass('extra');
  });
});
