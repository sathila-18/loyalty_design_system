import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinButton } from './FinButton';

const icons = (root: Element) => [...root.querySelectorAll('[translate="no"]')] as HTMLElement[];

describe('FinButton', () => {
  it('defaults to a large normal primary button with no icon that does not submit forms', () => {
    render(<FinButton>Save</FinButton>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'large');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toHaveAttribute('data-icon-only');
    expect(icons(button)).toHaveLength(0);
  });

  it.each([
    [{ variant: 'secondary' }, 'secondary'],
    [{ variant: 'tertiary' }, 'tertiary'],
    [{ tone: 'white' }, 'white'],
    [{ tone: 'destructive' }, 'destructive'],
    [{ tone: 'destructive', variant: 'secondary' }, 'destructive-secondary'],
  ] as const)('maps Tone and Type %o to the base look %s', (props, look) => {
    render(<FinButton {...props}>Save</FinButton>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', look);
  });

  it('places the icon before or after the label', () => {
    const { rerender } = render(
      <FinButton icon="leading" iconName="check">
        Save
      </FinButton>,
    );
    const parts = () => [...screen.getByRole('button').children].map((c) => c.textContent);
    expect(parts()).toEqual(['check', 'Save']);
    rerender(
      <FinButton icon="trailing" iconName="check">
        Save
      </FinButton>,
    );
    expect(parts()).toEqual(['Save', 'check']);
  });

  it('as icon only, is square, shows just the icon and is still named by its label', () => {
    render(
      <FinButton icon="only-icon" iconName="edit" size="small">
        Edit profile
      </FinButton>,
    );
    const button = screen.getByRole('button', { name: 'Edit profile' });
    expect(button).toHaveAttribute('data-icon-only');
    const [icon] = icons(button);
    expect(icon).toHaveTextContent('edit');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('data-size', '20');
  });

  it('is pressed with a click, Enter or Space, and not when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { unmount } = render(<FinButton onClick={onClick}>Save</FinButton>);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
    unmount();
    render(
      <FinButton onClick={onClick} disabled>
        Save
      </FinButton>,
    );
    await user.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('forwards ref, className and other attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <FinButton ref={ref} className="extra" type="submit" aria-describedby="hint">
        Save
      </FinButton>,
    );
    const button = screen.getByRole('button');
    expect(ref.current).toBe(button);
    expect(button).toHaveClass('extra');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-describedby', 'hint');
  });

  it('rejects combinations Figma does not have (checked by the type checker)', () => {
    const invalid = (
      <>
        {/* @ts-expect-error White has one look */}
        <FinButton tone="white" variant="secondary">x</FinButton>
        {/* @ts-expect-error Destructive has no Tertiary */}
        <FinButton tone="destructive" variant="tertiary">x</FinButton>
        {/* @ts-expect-error an icon needs its name */}
        <FinButton icon="leading">x</FinButton>
        {/* @ts-expect-error no icon name without an icon */}
        <FinButton iconName="check">x</FinButton>
      </>
    );
    expect(invalid).toBeTruthy();
  });
});
