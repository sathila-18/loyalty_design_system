import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinNotificationBanner } from './FinNotificationBanner';

const glyph = (root: Element) => root.querySelector('[translate="no"]') as HTMLElement | null;

describe('FinNotificationBanner', () => {
  it("defaults to Figma's Info, with the info icon, the description only, no buttons and no live role", () => {
    const { container } = render(<FinNotificationBanner>Points are added overnight.</FinNotificationBanner>);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-tone', 'info');
    expect(root).not.toHaveAttribute('role');
    expect(root).toHaveTextContent('Points are added overnight.');
    expect(root.querySelectorAll('p')).toHaveLength(1);
    expect(glyph(root)).toHaveTextContent('info');
    expect(glyph(root)).toHaveAttribute('data-size', '20');
    expect(glyph(root)!.style.getPropertyValue('--icon-color')).toBe('var(--fin-fg-info)');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it.each([
    ['success', 'check_circle', 'var(--fin-fg-success)'],
    ['error', 'warning', 'var(--fin-fg-error)'],
    ['warning', 'warning', 'var(--fin-fg-warning)'],
    ['neutral', 'info', 'var(--fin-fg-secondary)'],
  ] as const)('the %s tone uses the Figma icon %s in %s', (tone, icon, color) => {
    const { container } = render(<FinNotificationBanner tone={tone}>Text</FinNotificationBanner>);
    expect(container.firstElementChild).toHaveAttribute('data-tone', tone);
    expect(glyph(container.firstElementChild!)).toHaveTextContent(icon);
    expect(glyph(container.firstElementChild!)!.style.getPropertyValue('--icon-color')).toBe(color);
  });

  it('takes another Neutral icon, and hides the icon with showIcon={false}', () => {
    const { container, rerender } = render(
      <FinNotificationBanner tone="neutral" icon="settings">
        Text
      </FinNotificationBanner>,
    );
    expect(glyph(container.firstElementChild!)).toHaveTextContent('settings');
    rerender(<FinNotificationBanner showIcon={false}>Text</FinNotificationBanner>);
    expect(glyph(container.firstElementChild!)).toBeNull();
  });

  it('shows a title above the description when passed, as text (not a heading)', () => {
    const { container } = render(<FinNotificationBanner title="Conversion paused">Members can still earn points.</FinNotificationBanner>);
    const [title, description] = container.querySelectorAll('p');
    expect(title).toHaveTextContent('Conversion paused');
    expect(description).toHaveTextContent('Members can still earn points.');
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('colours the action and close buttons in the tone (Neutral: primary and secondary)', () => {
    const { rerender } = render(
      <FinNotificationBanner tone="success" action={{ label: 'View', onClick: () => undefined }} onClose={() => undefined}>
        Text
      </FinNotificationBanner>,
    );
    expect(screen.getByRole('button', { name: 'View' })).toHaveAttribute('data-content-tone', 'success');
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('data-content-tone', 'success');
    rerender(
      <FinNotificationBanner tone="neutral" action={{ label: 'View', onClick: () => undefined }} onClose={() => undefined}>
        Text
      </FinNotificationBanner>,
    );
    expect(screen.getByRole('button', { name: 'View' })).toHaveAttribute('data-content-tone', 'primary');
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('data-content-tone', 'secondary');
  });

  it('runs the action and closes with a click, Enter or Space', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onClose = vi.fn();
    render(
      <FinNotificationBanner action={{ label: 'Retry', onClick: onAction }} onClose={onClose} closeLabel="Dismiss">
        Couldn&apos;t load the tiers.
      </FinNotificationBanner>,
    );
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('takes a live role and other attributes from the page', () => {
    render(
      <FinNotificationBanner role="alert" tone="error" id="banner" className="extra">
        Couldn&apos;t save
      </FinNotificationBanner>,
    );
    const banner = screen.getByRole('alert');
    expect(banner).toHaveTextContent("Couldn't save");
    expect(banner).toHaveAttribute('id', 'banner');
    expect(banner).toHaveClass('extra');
  });
});
