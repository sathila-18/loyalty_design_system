'use client';

import { forwardRef, useId, type InputHTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import type { FinFlagCountry } from '../../flags/finFlags';
import { FinIcon } from '../../icons/FinIcon';
import { FinCountrySelector } from '../CountrySelector';
import { FinDivider } from '../Divider';
import { FinHelperText } from '../HelperText';
import styles from './FinInputBase.module.css';

/**
 * Figma `Type` (code `variant`, so `type` stays the input's own, as FinButton): Default, Payment (the same box; the
 * payment field adds the card logo), Mobile number (the country selector and a divider first), Select (a down
 * chevron at the end by default).
 */
export type FinInputBaseVariant = 'default' | 'payment' | 'mobile-number' | 'select';

/**
 * The box's height: `large` 48 (Figma) or `small` 40 (code only; Figma doesn't have it yet, decided 21 Oct 2026).
 * Small has less padding above and below and 20 icons; the text is the same.
 */
export type FinInputBaseSize = 'large' | 'small';

export interface FinInputBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'children' | 'size'> {
  /** The field's name (Figma Label). Always the input's label; shown on the border when focused or filled. */
  label: string;
  /** Figma `Type`. Default `default`. */
  variant?: FinInputBaseVariant;
  /** `large` (default, the 48 box) or `small` (the 40 box, code only). Small fields take 20 icons in their slots. */
  size?: FinInputBaseSize;
  /** Figma `Destructive`: the error look (red border, ring and helper text) and `aria-invalid`. */
  error?: boolean;
  /** Figma `Show Placeholder text` and its text. Shown while the field is empty and not focused. */
  placeholder?: string;
  /** Figma `Show Prefix`: text before the value (for example a country code). Hidden without it. */
  prefix?: string;
  /** Figma `Show Suffix`: text after the value (for example "%"). Hidden without it. */
  suffix?: string;
  /** Figma `Show Leading accessory` and Leading slot: a 24 icon (20 when `small`) or other component before the value. */
  leading?: ReactNode;
  /** Figma `Show Trailing accessory` and Trailing slot. Select shows `keyboard_arrow_down` without it. */
  trailing?: ReactNode;
  /** Figma `Show Helper text` and Helper text slot: the message under the field, linked to the input. */
  helperText?: ReactNode;
  /** Mobile number: the chosen country (Figma Contry selecter). Default `LK`, as Figma. */
  country?: FinFlagCountry;
  /** Mobile number: called when the country selector is clicked (the country menu waits for §10 #49). */
  onCountryClick?: MouseEventHandler<HTMLButtonElement>;
  /** Figma Place holder slot: another control in place of the input (a select's value, chips). It needs `id`. */
  control?: ReactNode;
  /** With `control`: whether it has a value (the input works this out itself). */
  filled?: boolean;
}

/**
 * The base of the single-line fields (Figma Input field-base; DESIGN.md §9): a 48 box (radius M, 1px border,
 * padding 12 / 16, gap 8) with the leading accessory, prefix, input, suffix and trailing accessory, the label on the top
 * border and the helper text 8 below; `size="small"` is a 40 box (padding 8 / 16, 20 icons; code only). **The states are the browser's** (decided 21 Oct 2026), the same for every
 * field built on it: Hovered (`bg-secondary`, empty fields only), Focused and Typing (the label, caret and focus
 * ring), Complete (the label, `border-strong`), Disabled; Error changes the colors. The border is cut where the label
 * sits, so it shows whatever surface is behind it. `ref` and other attributes go to the input.
 * **Internal:** a base (§7.2).
 */
export const FinInputBase = forwardRef<HTMLInputElement, FinInputBaseProps>(function FinInputBase(
  {
    label,
    variant = 'default',
    size = 'large',
    error = false,
    placeholder,
    prefix,
    suffix,
    leading,
    trailing,
    helperText,
    country = 'LK',
    onCountryClick,
    control,
    filled,
    id: idProp,
    disabled = false,
    className,
    style,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = `${id}-helper`;
  const trailingContent = trailing ?? (variant === 'select' ? <FinIcon name="keyboard_arrow_down" size={size === 'small' ? 20 : 24} /> : undefined);
  const hasHelper = helperText !== undefined && helperText !== null && helperText !== false;
  // The notch in the border: the label's text, invisible, so the gap is exactly as wide as the label.
  const notch = (
    <legend className={styles.notch}>
      <span>{label}</span>
    </legend>
  );

  return (
    <div
      className={className ? `${styles.root} ${className}` : styles.root}
      style={style}
      data-variant={variant}
      data-size={size}
      data-error={error && !disabled ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-filled={filled ? '' : undefined}
      data-control={control ? '' : undefined}
    >
      <div className={styles.field}>
        {variant === 'mobile-number' && (
          <>
            <FinCountrySelector
              className={styles.country}
              country={country}
              size={size}
              disabled={disabled}
              {...(onCountryClick ? { onClick: onCountryClick } : {})}
            />
            <FinDivider orientation="vertical" decorative className={styles.divider} />
          </>
        )}
        <div className={styles.content}>
          {leading && <span className={styles.accessory}>{leading}</span>}
          {prefix && <span className={styles.affix}>{prefix}</span>}
          {control ?? (
            <input
              {...rest}
              ref={ref}
              id={id}
              className={styles.input}
              disabled={disabled}
              // The label and its notch show once the input has a value (`:placeholder-shown` is false), so there's
              // always a placeholder, even an empty one.
              placeholder={placeholder ?? ' '}
              aria-invalid={error || undefined}
              aria-describedby={[rest['aria-describedby'], hasHelper ? helperId : undefined].filter(Boolean).join(' ') || undefined}
            />
          )}
          {suffix && <span className={styles.affix}>{suffix}</span>}
          {trailingContent && <span className={styles.accessory}>{trailingContent}</span>}
        </div>
        <fieldset className={styles.outline} aria-hidden="true">
          {notch}
        </fieldset>
        <fieldset className={styles.halo} aria-hidden="true">
          {notch}
        </fieldset>
        <fieldset className={styles.ring} aria-hidden="true">
          {notch}
        </fieldset>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      </div>
      {hasHelper && (
        <FinHelperText id={helperId} className={styles.helper} showIcon={false} tone={disabled ? 'disabled' : error ? 'error' : 'default'}>
          {helperText}
        </FinHelperText>
      )}
    </div>
  );
});
