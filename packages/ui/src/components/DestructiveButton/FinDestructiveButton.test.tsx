import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinDestructiveButton } from './FinDestructiveButton';

const icons = (root: Element) => [...root.querySelectorAll('[translate="no"]')] as HTMLElement[];

describe('FinDestructiveButton', () => {
  it('is the base button with the destructive variant, large by default, and does not submit forms', () => {
    render(<FinDestructiveButton>Delete</FinDestructiveButton>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveAttribute('data-variant', 'destructive');
    expect(button).toHaveAttribute('data-size', 'large');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('maps Figma Type Secondary to the destructive-secondary base variant', () => {
    render(<FinDestructiveButton variant="secondary">Delete</FinDestructiveButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'destructive-secondary');
  });

  it('passes size and icons to the base, and is text only without icons', () => {
    const { rerender } = render(
      <FinDestructiveButton size="small" leadingIcon="person" trailingIcon="check">
        Delete
      </FinDestructiveButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'small');
    const [lead, trail] = icons(button);
    expect(lead).toHaveTextContent('person');
    expect(trail).toHaveTextContent('check');
    for (const i of [lead, trail]) expect(i).toHaveAttribute('data-size', '20');
    rerender(<FinDestructiveButton>Delete</FinDestructiveButton>);
    expect(icons(screen.getByRole('button'))).toHaveLength(0);
  });

  it('still names the button when the label is hidden', () => {
    render(
      <FinDestructiveButton leadingIcon="person" showLabel={false}>
        Remove person
      </FinDestructiveButton>,
    );
    expect(screen.getByRole('button', { name: 'Remove person' })).toBeInTheDocument();
  });

  it('is pressed with a click, Enter or Space, and not when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<FinDestructiveButton onClick={onClick}>Delete</FinDestructiveButton>);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
    rerender(
      <FinDestructiveButton onClick={onClick} disabled>
        Delete
      </FinDestructiveButton>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('forwards ref, className and other attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <FinDestructiveButton ref={ref} className="extra" type="submit" aria-describedby="hint">
        Delete
      </FinDestructiveButton>,
    );
    const button = screen.getByRole('button');
    expect(ref.current).toBe(button);
    expect(button).toHaveClass('extra');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-describedby', 'hint');
  });
});
