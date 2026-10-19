import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinWhiteButton } from './FinWhiteButton';

const icons = (root: Element) => [...root.querySelectorAll('[translate="no"]')] as HTMLElement[];

describe('FinWhiteButton', () => {
  it('is the base button with the white variant, large by default, and does not submit forms', () => {
    render(<FinWhiteButton>Text here</FinWhiteButton>);
    const button = screen.getByRole('button', { name: 'Text here' });
    expect(button).toHaveAttribute('data-variant', 'white');
    expect(button).toHaveAttribute('data-size', 'large');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('passes size and icons to the base', () => {
    render(
      <FinWhiteButton size="xsmall" leadingIcon="person" trailingIcon="check">
        Text here
      </FinWhiteButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-size', 'xsmall');
    const [lead, trail] = icons(button);
    expect(lead).toHaveTextContent('person');
    expect(trail).toHaveTextContent('check');
    for (const i of [lead, trail]) expect(i).toHaveAttribute('data-size', '20');
  });

  it('still names the button when the label is hidden', () => {
    render(
      <FinWhiteButton leadingIcon="person" showLabel={false}>
        Profile
      </FinWhiteButton>,
    );
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
  });

  it('is pressed with a click, Enter or Space, and not when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<FinWhiteButton onClick={onClick}>Text here</FinWhiteButton>);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
    rerender(
      <FinWhiteButton onClick={onClick} disabled>
        Text here
      </FinWhiteButton>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('forwards ref, className and other attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <FinWhiteButton ref={ref} className="extra" type="submit" aria-describedby="hint">
        Text here
      </FinWhiteButton>,
    );
    const button = screen.getByRole('button');
    expect(ref.current).toBe(button);
    expect(button).toHaveClass('extra');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-describedby', 'hint');
  });
});
