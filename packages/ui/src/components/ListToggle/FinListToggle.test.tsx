import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinListToggle } from './FinListToggle';

function Setting({ onCheckedChange }: { onCheckedChange?: (on: boolean) => void }) {
  const [on, setOn] = useState(false);
  return (
    <FinListToggle
      title="Email alerts"
      description="When a member reaches a new tier"
      leadingAccessory="icon"
      icon="person"
      checked={on}
      onCheckedChange={(next) => {
        setOn(next);
        onCheckedChange?.(next);
      }}
    />
  );
}

describe('FinListToggle', () => {
  it('is a switch named by the title and described by the description, with the icon', () => {
    const { container } = render(<Setting />);
    const toggle = screen.getByRole('switch', { name: 'Email alerts' });
    expect(toggle).not.toBeChecked();
    expect(toggle).toHaveAccessibleDescription('When a member reaches a new tier');
    expect(container.firstElementChild).toHaveTextContent('person');
  });

  it('switches when any part of the row is clicked, with no Selected fill when on', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { container } = render(<Setting onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByText('Email alerts'));
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('switch')).toBeChecked();
    expect(container.firstElementChild).not.toHaveAttribute('data-selected');
  });

  it('switches with Space from the keyboard, and not when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(<FinListToggle title="Push" onCheckedChange={onCheckedChange} />);
    await user.tab();
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    rerender(<FinListToggle title="Push" onCheckedChange={onCheckedChange} disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('can be uncontrolled and a list item', () => {
    render(
      <ul>
        <FinListToggle as="li" title="One" defaultChecked />
        <FinListToggle as="li" title="Two" />
      </ul>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('switch', { name: 'One' })).toBeChecked();
  });

  it('hides its line with divider={false}', () => {
    const { container } = render(<FinListToggle title="Email" divider={false} />);
    expect(container.querySelector('hr')).toBeNull();
  });
});
