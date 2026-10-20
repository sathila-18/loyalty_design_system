import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinPaymentIcon } from './FinPaymentIcon';
import { finPaymentMethods, type FinPaymentMethod, type FinPaymentMethodEntry } from './finPaymentMethods';

const here = dirname(fileURLToPath(import.meta.url));

describe('finPaymentMethods', () => {
  it('has a logo file for every registered method (run `pnpm payment-icons` after adding a library brand)', () => {
    const missing = Object.entries(finPaymentMethods as Record<string, FinPaymentMethodEntry>)
      .map(([method, entry]) => [method, entry.custom ? `custom/${entry.custom}.svg` : entry.library ? `library/${entry.library}.svg` : null] as const)
      .filter(([, file]) => file !== null && !existsSync(join(here, file)))
      .map(([method, file]) => `${method} (${file})`);
    expect(missing).toEqual([]);
  });

  it("keeps the library's licence beside the logos", () => {
    expect(existsSync(join(here, 'library/MIT-LICENSE'))).toBe(true);
  });
});

describe('FinPaymentIcon', () => {
  it('is an image named by the brand, with the logo loaded when shown', async () => {
    render(<FinPaymentIcon method="visa" />);
    const icon = screen.getByRole('img', { name: 'Visa' });
    expect(icon).toHaveAttribute('data-size', 'medium');
    await waitFor(() => expect(icon.querySelector('img')).not.toBeNull());
  });

  it('draws the default card from tokens, also for an unknown method', () => {
    const { rerender } = render(<FinPaymentIcon method="default" size="xlarge" />);
    expect(screen.getByRole('img', { name: 'Card' })).toHaveAttribute('data-default');
    expect(screen.getByRole('img', { name: 'Card' })).toHaveTextContent('credit_card');
    rerender(<FinPaymentIcon method={'lankapay' as FinPaymentMethod} />);
    expect(screen.getByRole('img', { name: 'Card' })).toHaveAttribute('data-default');
  });

  it('can be decorative, disabled or relabelled', () => {
    const { container, rerender } = render(<FinPaymentIcon method="mastercard" decorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    rerender(<FinPaymentIcon method="mastercard" disabled label="Mastercard ending 4242" />);
    expect(screen.getByRole('img', { name: 'Mastercard ending 4242' })).toHaveAttribute('data-disabled');
  });
});
