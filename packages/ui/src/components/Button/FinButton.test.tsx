import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, forwardRef, type AnchorHTMLAttributes } from 'react';
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

  it('places the icon before or after the label, with less padding on the icon side', () => {
    const { rerender } = render(
      <FinButton icon="leading" iconName="check">
        Save
      </FinButton>,
    );
    const parts = () => [...screen.getByRole('button').children].map((c) => c.textContent);
    expect(parts()).toEqual(['check', 'Save']);
    expect(screen.getByRole('button')).toHaveAttribute('data-icon-side', 'leading');
    rerender(
      <FinButton icon="trailing" iconName="check">
        Save
      </FinButton>,
    );
    expect(parts()).toEqual(['Save', 'check']);
    expect(screen.getByRole('button')).toHaveAttribute('data-icon-side', 'trailing');
    rerender(<FinButton>Save</FinButton>);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-icon-side');
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

  it('marks a grey Tertiary icon with iconTone', () => {
    render(
      <>
        <FinButton variant="tertiary" iconTone="secondary" icon="only-icon" iconName="close">
          Close
        </FinButton>
        <FinButton variant="tertiary" icon="only-icon" iconName="arrow_back">
          Back
        </FinButton>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('data-icon-tone', 'secondary');
    expect(screen.getByRole('button', { name: 'Back' })).not.toHaveAttribute('data-icon-tone');
  });

  it('marks a Tertiary button with contentTone (the Snackbar colours)', () => {
    render(
      <>
        <FinButton variant="tertiary" contentTone="inverse">
          Undo
        </FinButton>
        <FinButton variant="tertiary" size="small">
          Retry
        </FinButton>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveAttribute('data-content-tone', 'inverse');
    expect(screen.getByRole('button', { name: 'Retry' })).not.toHaveAttribute('data-content-tone');
  });
});

describe('FinButton as a link (href)', () => {
  it('renders a real link with the href, not a button, and no type or disabled', () => {
    render(<FinButton variant="tertiary" href="/forgot-password">Forgot password</FinButton>);
    const link = screen.getByRole('link', { name: 'Forgot password' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/forgot-password');
    expect(link).not.toHaveAttribute('type');
    expect(link).not.toHaveAttribute('disabled');
    expect(link).toHaveAttribute('data-link', '');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('keeps the variant and size hooks and the same classes as the button, except the link reset', () => {
    const { rerender } = render(<FinButton variant="secondary" size="small">Open</FinButton>);
    const buttonClasses = screen.getByRole('button').className.split(' ');
    rerender(<FinButton variant="secondary" size="small" href="/open">Open</FinButton>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-variant', 'secondary');
    expect(link).toHaveAttribute('data-size', 'small');
    const linkClasses = link.className.split(' ');
    expect(linkClasses.filter((c) => !buttonClasses.includes(c))).toEqual(['fin:no-underline']);
  });

  it('drops the side padding on a Tertiary link only (its text lines up with the content around it)', () => {
    render(
      <>
        <FinButton variant="tertiary" size="xsmall" href="/a">Tertiary</FinButton>
        <FinButton variant="primary" size="xsmall" href="/b">Primary</FinButton>
        <FinButton variant="tertiary" size="xsmall">Tertiary button</FinButton>
        <FinButton variant="tertiary" size="xsmall" href="/c" icon="only-icon" iconName="close">Close</FinButton>
      </>,
    );
    expect(screen.getByRole('link', { name: 'Tertiary' }).className).toContain('fin:px-none');
    expect(screen.getByRole('link', { name: 'Primary' }).className).toContain('fin:px-xl');
    expect(screen.getByRole('button', { name: 'Tertiary button' }).className).toContain('fin:px-xl');
    expect(screen.getByRole('link', { name: 'Close' }).className).toContain('fin:p-s');
  });

  it('is reached with Tab, shows focus, and follows with Enter (not Space, as links do)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(<FinButton href="/next" onClick={onClick}>Next</FinButton>);
    await user.tab();
    const link = screen.getByRole('link', { name: 'Next' });
    expect(link).toHaveFocus();
    await user.keyboard(' ');
    expect(onClick).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders through linkAs (a router link), passing href, the classes and the ref', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function RouterLink({ children, ...props }, ref) {
      return (
        <a {...props} ref={ref} data-router="">
          {children}
        </a>
      );
    });
    const ref = createRef<HTMLAnchorElement>();
    render(<FinButton variant="tertiary" href="/forgot-password" linkAs={RouterLink} ref={ref}>Forgot password</FinButton>);
    const link = screen.getByRole('link', { name: 'Forgot password' });
    expect(link).toHaveAttribute('data-router', '');
    expect(link).toHaveAttribute('href', '/forgot-password');
    expect(link.className).toContain('fin:no-underline');
    expect(ref.current).toBe(link);
  });

  it('shows icons and hides the label for an icon-only link, which is still named', () => {
    render(<FinButton variant="tertiary" href="/" icon="only-icon" iconName="close">Close</FinButton>);
    expect(screen.getByRole('link', { name: 'Close' })).toBeInTheDocument();
  });

  it('rejects disabled and type on a link (types only)', () => {
    // @ts-expect-error a link can't be disabled
    const disabledLink = <FinButton href="/" disabled>Nope</FinButton>;
    // @ts-expect-error a link has no button type
    const typedLink = <FinButton href="/" type="submit">Nope</FinButton>;
    expect([disabledLink, typedLink]).toHaveLength(2);
  });

  it('stays a button without href', () => {
    render(<FinButton>Save</FinButton>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
    expect(screen.queryByRole('link')).toBeNull();
  });
});
