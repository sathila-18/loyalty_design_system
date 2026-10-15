import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FinLabel } from './FinLabel';

describe('FinLabel', () => {
  it('is plain text (a span) by default, medium, with no badge', () => {
    const { container } = render(<FinLabel>Label text</FinLabel>);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('SPAN');
    expect(root).toHaveAttribute('data-size', 'medium');
    expect(root).toHaveTextContent('Label text');
    expect(root.querySelector('[data-shape]')).toBeNull();
  });

  it('renders the small size', () => {
    const { container } = render(<FinLabel size="small">Label text</FinLabel>);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'small');
  });

  it('becomes a <label> linked to its field with htmlFor; clicking it focuses the field', async () => {
    const user = userEvent.setup();
    render(
      <>
        <FinLabel htmlFor="email">Email address</FinLabel>
        <input id="email" />
      </>,
    );
    const field = screen.getByRole('textbox', { name: 'Email address' });
    await user.click(screen.getByText('Email address'));
    expect(field).toHaveFocus();
  });

  it('shows a small red dot before the text, decorative, and reads its meaning after the text', () => {
    const { container } = render(
      <>
        <FinLabel htmlFor="email" badge badgeLabel="Required">
          Email address
        </FinLabel>
        <input id="email" />
      </>,
    );
    const root = container.firstElementChild!;
    const dot = root.firstElementChild!;
    expect(dot).toHaveAttribute('data-shape', 'dot');
    expect(dot).toHaveAttribute('data-size', 'small');
    expect(dot).toHaveAttribute('data-tone', 'error');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Email address, Required');
  });

  it('passes className and other attributes to the root', () => {
    render(
      <FinLabel className="extra" data-testid="l" id="caption">
        Caption
      </FinLabel>,
    );
    const l = screen.getByTestId('l');
    expect(l).toHaveClass('extra');
    expect(l).toHaveAttribute('id', 'caption');
  });

  it('requires badgeLabel with badge (types)', () => {
    // @ts-expect-error badgeLabel is required when badge is on
    const missing = <FinLabel badge>Text</FinLabel>;
    // @ts-expect-error badgeLabel can't be set without badge
    const stray = <FinLabel badgeLabel="New">Text</FinLabel>;
    expect(missing && stray).toBeTruthy();
  });
});
