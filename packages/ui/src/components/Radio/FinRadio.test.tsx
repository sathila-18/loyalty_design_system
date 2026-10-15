import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinRadio } from './FinRadio';

function Group({ onChange }: { onChange?: (value: string) => void }) {
  return (
    <fieldset>
      <legend>Billing period</legend>
      {['monthly', 'quarterly', 'yearly'].map((v, i) => (
        <FinRadio key={v} name="billing" value={v} label={v} defaultChecked={i === 0} onChange={(e) => onChange?.(e.target.value)} />
      ))}
    </fieldset>
  );
}

describe('FinRadio', () => {
  it('is a radio named by its visually hidden label, unselected by default', () => {
    render(<FinRadio name="a" label="Monthly" />);
    const radio = screen.getByRole('radio', { name: 'Monthly' });
    expect(radio).not.toBeChecked();
    expect(radio).toHaveAttribute('type', 'radio');
  });

  it('selects on click, and only one in a group is selected', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Group onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'yearly' }));
    expect(screen.getByRole('radio', { name: 'yearly' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'monthly' })).not.toBeChecked();
    expect(onChange).toHaveBeenCalledWith('yearly');
  });

  it('selects when the visible ring is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<FinRadio name="a" label="Monthly" />);
    await user.click(container.querySelector('[aria-hidden="true"]')!);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('is one tab stop per group; the arrow keys move and select', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Group />
        <button type="button">Next</button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole('radio', { name: 'monthly' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'quarterly' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'quarterly' })).toBeChecked();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it('is skipped and inert when disabled', async () => {
    const user = userEvent.setup();
    render(<FinRadio name="a" label="Locked" disabled />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeDisabled();
    await user.click(radio);
    expect(radio).not.toBeChecked();
  });

  it('works controlled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<FinRadio name="a" label="Monthly" checked={false} onChange={onChange} />);
    await user.click(screen.getByRole('radio'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('forwards ref and native attributes to the input; className to the wrapper', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<FinRadio ref={ref} name="plan" value="pro" label="Pro" className="extra" />);
    expect(ref.current).toBe(screen.getByRole('radio'));
    expect(ref.current).toHaveAttribute('name', 'plan');
    expect(ref.current).toHaveAttribute('value', 'pro');
    expect(container.firstElementChild).toHaveClass('extra');
  });
});
