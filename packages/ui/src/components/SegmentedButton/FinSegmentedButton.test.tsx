import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinSegmentedButton, type FinSegmentedButtonProps } from './FinSegmentedButton';

const PERIODS: FinSegmentedButtonProps['options'] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

const checked = () => screen.getByRole('radio', { checked: true });

describe('FinSegmentedButton', () => {
  it('is a named radio group of segments, the first selected by default', () => {
    render(<FinSegmentedButton label="Billing period" options={PERIODS} />);
    expect(screen.getByRole('radiogroup', { name: 'Billing period' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio').map((r) => r.textContent)).toEqual(['Monthly', 'Quarterly', 'Yearly']);
    expect(checked()).toHaveTextContent('Monthly');
    expect(checked()).toHaveAttribute('data-selected');
  });

  it('has one tab stop, the selected segment', async () => {
    const user = userEvent.setup();
    render(<FinSegmentedButton label="Billing period" options={PERIODS} defaultValue="quarterly" />);
    expect(screen.getAllByRole('radio').map((r) => r.tabIndex)).toEqual([-1, 0, -1]);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Quarterly' })).toHaveFocus();
  });

  it('selects on click and reports the new value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FinSegmentedButton label="Billing period" options={PERIODS} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('radio', { name: 'Yearly' }));
    expect(checked()).toHaveTextContent('Yearly');
    expect(onValueChange).toHaveBeenCalledWith('yearly');
  });

  it('arrow keys move and select, wrapping; Home and End jump to the ends', async () => {
    const user = userEvent.setup();
    render(<FinSegmentedButton label="Billing period" options={PERIODS} />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(checked()).toHaveTextContent('Quarterly');
    expect(checked()).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(checked()).toHaveTextContent('Monthly');
    await user.keyboard('{ArrowLeft}');
    expect(checked()).toHaveTextContent('Yearly');
    await user.keyboard('{Home}');
    expect(checked()).toHaveTextContent('Monthly');
    await user.keyboard('{End}');
    expect(checked()).toHaveTextContent('Yearly');
  });

  it('skips a disabled segment, by click and by keys', async () => {
    const user = userEvent.setup();
    const options: FinSegmentedButtonProps['options'] = [
      { value: 'monthly', label: 'Monthly' },
      { value: 'quarterly', label: 'Quarterly', disabled: true },
      { value: 'yearly', label: 'Yearly' },
    ];
    render(<FinSegmentedButton label="Billing period" options={options} />);
    expect(screen.getByRole('radio', { name: 'Quarterly' })).toBeDisabled();
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(checked()).toHaveTextContent('Yearly');
  });

  it('controlled: shows the given value and asks the parent to change it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<FinSegmentedButton label="Billing period" options={PERIODS} value="quarterly" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('radio', { name: 'Yearly' }));
    expect(onValueChange).toHaveBeenCalledWith('yearly');
    expect(checked()).toHaveTextContent('Quarterly');
  });

  it('when disabled, every segment is disabled and none is a tab stop', async () => {
    const user = userEvent.setup();
    const { container } = render(<FinSegmentedButton label="Billing period" options={PERIODS} disabled />);
    for (const r of screen.getAllByRole('radio')) expect(r).toBeDisabled();
    expect(container.firstElementChild).toHaveAttribute('data-disabled');
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it('takes its name from a visible label, shows icons, and submits the value under a name', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <>
        <span id="lbl">Theme</span>
        <FinSegmentedButton
          ref={ref}
          aria-labelledby="lbl"
          name="theme"
          className="extra"
          options={[
            { value: 'light', label: 'Light', icon: 'visibility' },
            { value: 'dark', label: 'Dark', icon: 'visibility_off' },
          ]}
        />
      </>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBe(ref.current);
    expect(ref.current).toHaveClass('extra');
    expect(screen.getByRole('radio', { name: 'Light' }).querySelector('[translate="no"]')).toHaveTextContent('visibility');
    expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('value', 'light');
    expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('name', 'theme');
  });
});
