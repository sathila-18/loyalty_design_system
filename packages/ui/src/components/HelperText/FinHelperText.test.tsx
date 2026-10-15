import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinHelperText } from './FinHelperText';

const glyph = (root: Element) => root.querySelector('[translate="no"]') as HTMLElement | null;

describe('FinHelperText', () => {
  it('defaults to the default tone with its info icon', () => {
    const { container } = render(<FinHelperText>Helper text here</FinHelperText>);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-tone', 'default');
    expect(root).toHaveTextContent('Helper text here');
    expect(glyph(root)).toHaveTextContent('info');
    expect(glyph(root)).toHaveAttribute('data-size', '20');
    expect(glyph(root)).toHaveAttribute('aria-hidden', 'true');
    expect(glyph(root)!.style.getPropertyValue('--icon-color')).toBe('var(--fin-fg-secondary)');
  });

  it.each([
    ['success', 'check_circle', 'var(--fin-fg-success)'],
    ['warning', 'warning', 'var(--fin-fg-warning)'],
    ['error', 'warning', 'var(--fin-fg-error)'],
    ['disabled', 'info', 'var(--fin-fg-disabled)'],
  ] as const)('the %s tone uses the Figma icon %s in %s', (tone, icon, color) => {
    const { container } = render(<FinHelperText tone={tone}>Text</FinHelperText>);
    expect(container.firstElementChild).toHaveAttribute('data-tone', tone);
    expect(glyph(container.firstElementChild!)).toHaveTextContent(icon);
    expect(glyph(container.firstElementChild!)!.style.getPropertyValue('--icon-color')).toBe(color);
  });

  it('hides the icon with showIcon={false}, in every tone (also success)', () => {
    const { container } = render(
      <FinHelperText tone="success" showIcon={false}>
        Saved
      </FinHelperText>,
    );
    expect(glyph(container.firstElementChild!)).toBeNull();
  });

  it('takes another icon', () => {
    const { container } = render(<FinHelperText icon="cloud_upload">Uploading</FinHelperText>);
    expect(glyph(container.firstElementChild!)).toHaveTextContent('cloud_upload');
  });

  it('is described by the field via its id, and is not announced by default', () => {
    render(
      <>
        <input aria-label="Card number" aria-describedby="help" />
        <FinHelperText id="help" tone="error">
          Enter all 16 digits
        </FinHelperText>
      </>,
    );
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Enter all 16 digits');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('is announced with announce', () => {
    render(
      <FinHelperText tone="error" announce>
        Payment failed
      </FinHelperText>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed');
  });

  it('passes className and other attributes to the root', () => {
    render(
      <FinHelperText className="extra" data-testid="h">
        Text
      </FinHelperText>,
    );
    expect(screen.getByTestId('h')).toHaveClass('extra');
  });
});
