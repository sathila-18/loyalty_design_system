import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinListCheckbox, FinListCheckboxGroup } from './FinListCheckbox';

function Channels({ onValueChange }: { onValueChange?: (value: string[]) => void }) {
  const [value, setValue] = useState(['email']);
  return (
    <FinListCheckboxGroup
      label="Notifications"
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    >
      <FinListCheckbox value="email" title="Email" description="Weekly summary" />
      <FinListCheckbox value="sms" title="SMS" />
      <FinListCheckbox value="push" title="Push" disabled />
    </FinListCheckboxGroup>
  );
}

describe('FinListCheckbox', () => {
  it('is a named group of checkboxes, each named by its title and described by its description', () => {
    render(<Channels />);
    expect(screen.getByRole('group', { name: 'Notifications' })).toBeInTheDocument();
    const email = screen.getByRole('checkbox', { name: 'Email' });
    expect(email).toBeChecked();
    expect(email).toHaveAccessibleDescription('Weekly summary');
    expect(screen.getByRole('checkbox', { name: 'Push' })).toBeDisabled();
  });

  it('ticks and unticks rows when any part of them is clicked, keeping the others', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<Channels onValueChange={onValueChange} />);
    await user.click(screen.getByText('SMS'));
    expect(onValueChange).toHaveBeenLastCalledWith(['email', 'sms']);
    expect(container.querySelectorAll('[data-control]')[1]).toHaveAttribute('data-selected');
    await user.click(screen.getByText('Email'));
    expect(onValueChange).toHaveBeenLastCalledWith(['sms']);
  });

  it('is one Tab stop per checkbox, ticked with Space; disabled rows are skipped', async () => {
    const user = userEvent.setup();
    render(<Channels />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveFocus();
    await user.keyboard(' ');
    expect(screen.getByRole('checkbox', { name: 'SMS' })).toBeChecked();
    await user.tab();
    expect(screen.getByRole('checkbox', { name: 'Push' })).not.toHaveFocus();
  });

  it('shows the dash for a mixed row, and works outside a group', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<FinListCheckbox value="all" title="Select all" indeterminate checked={false} onCheckedChange={onCheckedChange} />);
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveProperty('indeterminate', true);
    await user.click(screen.getByText('Select all'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('shows the country and payment items', () => {
    render(
      <FinListCheckboxGroup label="Cards">
        <FinListCheckbox value="visa" title="Visa" type="payment" paymentMethod="visa" itemSide="trailing" />
        <FinListCheckbox value="lk" title="Sri Lanka" type="country" country="LK" />
      </FinListCheckboxGroup>,
    );
    expect(document.querySelector('[data-shape="rectangle"]')).not.toBeNull();
    expect(document.querySelectorAll('[data-size="medium"]').length).toBeGreaterThan(0);
  });
});
