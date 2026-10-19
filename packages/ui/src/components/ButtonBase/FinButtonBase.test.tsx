import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinButtonBase } from './FinButtonBase';

const icons = (root: Element) => [...root.querySelectorAll('[translate="no"]')] as HTMLElement[];

describe('FinButtonBase', () => {
  it('defaults to a large primary native button that does not submit forms', () => {
    render(<FinButtonBase>Text here</FinButtonBase>);
    const button = screen.getByRole('button', { name: 'Text here' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'large');
    expect(icons(button)).toHaveLength(0);
  });

  it('keeps the native type when set', () => {
    render(<FinButtonBase type="submit">Save</FinButtonBase>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it.each([
    ['large', '24'],
    ['medium', '24'],
    ['small', '20'],
    ['xsmall', '20'],
  ] as const)('a %s button uses %spx icons', (size, iconSize) => {
    render(
      <FinButtonBase size={size} leadingIcon="person" trailingIcon="check">
        Text here
      </FinButtonBase>,
    );
    const [lead, trail] = icons(screen.getByRole('button'));
    expect(lead).toHaveTextContent('person');
    expect(trail).toHaveTextContent('check');
    for (const i of [lead, trail]) expect(i).toHaveAttribute('data-size', iconSize);
  });

  it('places the icons before and after the label, and shows only the ones set', () => {
    const { rerender } = render(
      <FinButtonBase leadingIcon="person" trailingIcon="check">
        Text here
      </FinButtonBase>,
    );
    const parts = () => [...screen.getByRole('button').children].map((c) => c.textContent);
    expect(parts()).toEqual(['person', 'Text here', 'check']);
    rerender(<FinButtonBase trailingIcon="check">Text here</FinButtonBase>);
    expect(parts()).toEqual(['Text here', 'check']);
  });

  it('keeps icons decorative, so the button is named by its label only', () => {
    render(
      <FinButtonBase leadingIcon="person" trailingIcon="check">
        Text here
      </FinButtonBase>,
    );
    const button = screen.getByRole('button', { name: 'Text here' });
    for (const i of icons(button)) {
      expect(i).toHaveAttribute('aria-hidden', 'true');
      expect(i.style.getPropertyValue('--icon-color')).toBe('');
    }
  });

  it('still names the button when the label is hidden', () => {
    render(
      <FinButtonBase leadingIcon="person" showLabel={false}>
        Profile
      </FinButtonBase>,
    );
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
  });

  it('is pressed with a click, Enter or Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<FinButtonBase onClick={onClick}>Text here</FinButtonBase>);
    await user.click(screen.getByRole('button'));
    await user.tab();
    await user.tab({ shift: true });
    expect(screen.getByRole('button')).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('when disabled, is skipped by Tab and does not respond', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <FinButtonBase disabled onClick={onClick}>
        Text here
      </FinButtonBase>,
    );
    await user.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref, className and other attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <FinButtonBase ref={ref} className="extra" aria-describedby="hint" variant="secondary" size="xsmall">
        Text here
      </FinButtonBase>,
    );
    const button = screen.getByRole('button');
    expect(ref.current).toBe(button);
    expect(button).toHaveClass('extra');
    expect(button).toHaveAttribute('aria-describedby', 'hint');
    expect(button).toHaveAttribute('data-variant', 'secondary');
    expect(button).toHaveAttribute('data-size', 'xsmall');
  });
});
