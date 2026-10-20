import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FinListToggleFilled } from './FinListToggleFilled';

describe('FinListToggleFilled', () => {
  it('is a card that switches when clicked, with no selected edge when on', async () => {
    const user = userEvent.setup();
    const { container } = render(<FinListToggleFilled title="Email alerts" leadingAccessory="icon" />);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveAttribute('data-filled');
    await user.click(screen.getByText('Email alerts'));
    expect(screen.getByRole('switch', { name: 'Email alerts' })).toBeChecked();
    expect(card).not.toHaveAttribute('data-selected');
  });
});
