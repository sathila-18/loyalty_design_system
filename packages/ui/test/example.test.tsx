import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// Shows the test setup works, using a native <button> (there are no components yet).
// Component tests follow the same pattern: find by role and name, drive with the keyboard.
describe('test setup', () => {
  it('finds an element by role and name, and the keyboard reaches it', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<button onClick={onClick}>Save</button>);

    const button = screen.getByRole('button', { name: 'Save' });
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('ignores clicks on a disabled control', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <button onClick={onClick} disabled>
        Save
      </button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
