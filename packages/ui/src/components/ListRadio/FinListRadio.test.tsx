import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinListRadio, FinListRadioGroup } from './FinListRadio';

function Countries({ onValueChange }: { onValueChange?: (value: string) => void }) {
  const [value, setValue] = useState('LK');
  return (
    <FinListRadioGroup
      label="Country"
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    >
      <FinListRadio value="LK" title="Sri Lanka" description="LKR" type="country" country="LK" />
      <FinListRadio value="IN" title="India" type="country" country="IN" itemSide="trailing" />
      <FinListRadio value="MV" title="Maldives" disabled />
    </FinListRadioGroup>
  );
}

describe('FinListRadio', () => {
  it('is a named radio group of rows, each radio named by its title and described by its description', () => {
    render(<Countries />);
    expect(screen.getByRole('radiogroup', { name: 'Country' })).toBeInTheDocument();
    const lk = screen.getByRole('radio', { name: 'Sri Lanka' });
    expect(lk).toBeChecked();
    expect(lk).toHaveAccessibleDescription('LKR');
    expect(screen.getByRole('radio', { name: 'India' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Maldives' })).toBeDisabled();
  });

  it('chooses a row when any part of it is clicked, and shows it as selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<Countries onValueChange={onValueChange} />);
    await user.click(screen.getByText('India'));
    expect(onValueChange).toHaveBeenLastCalledWith('IN');
    expect(screen.getByRole('radio', { name: 'India' })).toBeChecked();
    const rows = container.querySelectorAll('[data-control]');
    expect(rows[1]).toHaveAttribute('data-selected');
    expect(rows[0]).not.toHaveAttribute('data-selected');
  });

  it('moves the choice with the arrow keys, skipping disabled rows', async () => {
    const user = userEvent.setup();
    render(<Countries />);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Sri Lanka' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'India' })).toBeChecked();
  });

  it('does not choose a disabled row', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Countries onValueChange={onValueChange} />);
    await user.click(screen.getByText('Maldives'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shows the payment logo and other items on the chosen side', () => {
    render(
      <FinListRadioGroup label="Card">
        <FinListRadio value="visa" title="Visa ending 4242" type="payment" paymentMethod="visa" />
        <FinListRadio value="other" title="Other" item={<span>Item</span>} itemSide="trailing" />
      </FinListRadioGroup>,
    );
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(document.querySelector('[data-default]')).toBeNull();
  });

  it('works outside a group with checked, name and onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinListRadio value="a" title="Alone" name="solo" checked={false} onChange={onChange} />);
    await user.click(screen.getByText('Alone'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
