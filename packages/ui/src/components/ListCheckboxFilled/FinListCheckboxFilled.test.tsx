import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { FinListCheckboxGroup } from '../ListCheckbox';
import { FinListCheckboxFilled } from './FinListCheckboxFilled';

function Channels() {
  const [value, setValue] = useState(['email']);
  return (
    <FinListCheckboxGroup label="Notifications" value={value} onValueChange={setValue}>
      <FinListCheckboxFilled value="email" title="Email" />
      <FinListCheckboxFilled value="sms" title="SMS" />
    </FinListCheckboxGroup>
  );
}

describe('FinListCheckboxFilled', () => {
  it('works in the checkbox group as cards: clicking a card ticks it and marks it selected', async () => {
    const user = userEvent.setup();
    const { container } = render(<Channels />);
    expect(container.querySelectorAll('[data-filled]')[0]).toHaveAttribute('data-selected');
    await user.click(screen.getByText('SMS'));
    expect(screen.getByRole('checkbox', { name: 'SMS' })).toBeChecked();
    expect(container.querySelectorAll('[data-filled]')[1]).toHaveAttribute('data-selected');
  });
});
