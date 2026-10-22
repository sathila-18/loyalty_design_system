'use client';

import { forwardRef, useState, type ButtonHTMLAttributes } from 'react';
import { finDialCodes } from '../../flags/finDialCodes';
import { FinFlag } from '../../flags/FinFlag';
import { finFlags, type FinFlagCountry } from '../../flags/finFlags';
import { FinIcon } from '../../icons/FinIcon';
import { FinListStandard } from '../ListStandard';
import { FinMenu } from '../Menu';
import { FinSearchField } from '../SearchField';
import { searchCountries } from './countrySearch';
import styles from './FinCountrySelector.module.css';

export interface FinCountrySelectorProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
  /** The chosen country (an ISO code), shown as its Small flag and Selected in the menu. */
  country: FinFlagCountry;
  /** Called with the country chosen in the menu. */
  onCountryChange?: (country: FinFlagCountry) => void;
  /** Each row's dial code as a trailing caption ("+94"). Default on. */
  showDialCodes?: boolean;
  /** What's being chosen, read before the country: "Country, Sri Lanka". Default "Country". Also names the list. */
  label?: string;
  /** The search field's name for screen readers. Default "Search countries". */
  searchLabel?: string;
  /** The search field's placeholder. Default "Search by country or code". */
  searchPlaceholder?: string;
  /** Shown when nothing matches the search. Default "No countries found". */
  noResultsText?: string;
  /** The element the menu lines up with and takes its width from (the input field's box). Without it, the menu sits
   * under the button and fits its content. */
  menuAnchor?: HTMLElement | null;
  /** The field's size: `large` (default, a 24 arrow) or `small` (a 20 arrow, less padding; the Small input field). */
  size?: 'large' | 'small';
}

/**
 * The country selector (Figma Contry selecter; DESIGN.md §9): the chosen country's flag and a down arrow, a native
 * `<button>` that opens the country menu (FinMenu `kind="select"`): a small search field at the top, then every
 * country with a dial code (flag, name and, by default, the dial code as a caption), the chosen one Selected and in
 * view. The search filters as you type, by name, ISO code or dial code. `ref` goes to the button.
 * **Internal:** part of the input field (Mobile number); its hover and focus design come with the input field.
 */
export const FinCountrySelector = forwardRef<HTMLButtonElement, FinCountrySelectorProps>(function FinCountrySelector(
  {
    country,
    onCountryChange,
    showDialCodes = true,
    label = 'Country',
    searchLabel = 'Search countries',
    searchPlaceholder = 'Search by country or code',
    noResultsText = 'No countries found',
    menuAnchor,
    size = 'large',
    disabled = false,
    type = 'button',
    className,
    ...rest
  },
  ref,
) {
  const [query, setQuery] = useState('');
  const countries = searchCountries(query);

  return (
    <FinMenu
      kind="select"
      // In a field: the field's width. On its own: its content's (the flag button is too narrow).
      width={menuAnchor ? 'trigger' : 'content'}
      label={label}
      anchor={menuAnchor ?? null}
      // A fresh search each time it opens.
      onOpenChange={(open) => {
        if (!open) setQuery('');
      }}
      header={
        <>
          <FinSearchField size="small" label={searchLabel} placeholder={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
          {/* Always there, so screen readers announce the text when the search finds nothing. */}
          <p className={styles.empty} role="status" data-empty={countries.length === 0 || undefined}>
            {countries.length === 0 ? noResultsText : ''}
          </p>
        </>
      }
      trigger={({ ref: menuRef, ...menuProps }) => (
        <button
          {...rest}
          {...menuProps}
          ref={(node) => {
            menuRef(node);
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          type={type}
          disabled={disabled}
          className={className ? `${styles.selector} ${className}` : styles.selector}
          data-size={size}
          aria-label={`${label}, ${finFlags[country] ?? 'Unknown country'}`}
        >
          <FinFlag country={country} size="small" disabled={disabled} decorative />
          <span className={styles.chevron}>
            {/* Up while the menu is open (decided 22 Oct 2026). */}
            <FinIcon name={menuProps['aria-expanded'] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={size === 'small' ? 20 : 24} />
          </span>
        </button>
      )}
    >
      {countries.map((code) => (
        <FinListStandard
          key={code}
          as="li"
          size="small"
          behavior="option"
          divider={false}
          leadingAccessory="flag"
          country={code}
          title={finFlags[code]}
          {...(showDialCodes ? { caption: finDialCodes[code] } : {})}
          selected={code === country}
          onClick={() => onCountryChange?.(code)}
        />
      ))}
    </FinMenu>
  );
});
