'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { FinFlag } from '../../flags/FinFlag';
import { finFlags, type FinFlagCountry } from '../../flags/finFlags';
import { FinIcon } from '../../icons/FinIcon';
import styles from './FinCountrySelector.module.css';

export interface FinCountrySelectorProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
  /** The chosen country (an ISO code), shown as its Small flag. */
  country: FinFlagCountry;
  /** What's being chosen, read before the country: "Country, Sri Lanka". Default "Country". */
  label?: string;
  /** Whether the country menu is open (announced; the menu comes with the List component). */
  expanded?: boolean;
  /** The field's size: `large` (default, a 24 arrow) or `small` (a 20 arrow, less padding; the Small input field). */
  size?: 'large' | 'small';
}

/**
 * The country selector's trigger (Figma Contry selecter; DESIGN.md §9): the chosen country's flag and a down arrow.
 * A native `<button>` that opens the country menu, which is built once the List component exists (decided 19 Oct
 * 2026); until then it only shows the country and reports clicks. `ref` goes to the button.
 * **Internal:** part of the input field (Mobile number); its hover and focus design come with the input field.
 */
export const FinCountrySelector = forwardRef<HTMLButtonElement, FinCountrySelectorProps>(function FinCountrySelector(
  { country, label = 'Country', expanded, size = 'large', disabled = false, type = 'button', className, ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled}
      className={className ? `${styles.selector} ${className}` : styles.selector}
      data-size={size}
      aria-label={`${label}, ${finFlags[country] ?? 'Unknown country'}`}
      aria-haspopup="listbox"
      {...(expanded !== undefined ? { 'aria-expanded': expanded } : {})}
    >
      <FinFlag country={country} size="small" disabled={disabled} decorative />
      <span className={styles.chevron}>
        <FinIcon name="keyboard_arrow_down" size={size === 'small' ? 20 : 24} />
      </span>
    </button>
  );
});
