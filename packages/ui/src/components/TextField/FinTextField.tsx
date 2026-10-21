'use client';

import { forwardRef, useState, type ChangeEvent } from 'react';
import { finDialCodes } from '../../flags/finDialCodes';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import { FinPaymentIcon } from '../../payment/FinPaymentIcon';
import type { FinPaymentMethod } from '../../payment/finPaymentMethods';
import { FinInputBase, type FinInputBaseProps } from '../InputBase';
import { cardBrand, cardDigits, formatCardNumber } from './cardNumber';

/** Figma `Type` (code `variant`, so `type` stays the input's own): Default, Mobile number, Payment. */
export type FinTextFieldVariant = 'default' | 'mobile-number' | 'payment';

export interface FinTextFieldProps
  extends Omit<FinInputBaseProps, 'variant' | 'prefix' | 'suffix' | 'leading' | 'trailing' | 'control' | 'filled'> {
  /** Figma `Type`. Default `default`. */
  variant?: FinTextFieldVariant;
  /** Figma `Trailing icon` and its icon: shown at the end of the field (24, or 20 when `small`). Hidden without it. */
  trailingIcon?: FinIconName;
  /** Payment: the card's brand logo. Without it, the brand is worked out from the number's first digits. */
  paymentMethod?: FinPaymentMethod;
}

// After reformatting, put the caret back after the same number of digits it was after.
const caretAfterDigits = (formatted: string, digits: number) => {
  let position = 0;
  for (let seen = 0; position < formatted.length && seen < digits; position += 1) {
    if (/\d/.test(formatted.charAt(position))) seen += 1;
  }
  return position;
};

/**
 * A single-line text field (Figma Input field-standard; DESIGN.md §9), on FinInputBase, which gives it its look and
 * states. **Mobile number:** the country selector, a divider and the country's dial code (from libphonenumber-js) before
 * a phone input. **Payment:** the card's logo (FinPaymentIcon) before a card-number input that groups the digits as
 * they're typed (`4242 4242 4242 4242`); the brand comes from the first digits unless `paymentMethod` is given.
 * Controlled or uncontrolled like a native input; `ref` and other attributes go to the input.
 */
export const FinTextField = forwardRef<HTMLInputElement, FinTextFieldProps>(function FinTextField(
  { variant = 'default', size = 'large', trailingIcon, paymentMethod, country = 'LK', value, defaultValue, onChange, disabled = false, ...rest },
  ref,
) {
  const isPayment = variant === 'payment';
  const [typedDigits, setTypedDigits] = useState(() => (isPayment ? cardDigits(String(defaultValue ?? '')) : ''));
  const digits = isPayment && value !== undefined && value !== null ? cardDigits(String(value)) : typedDigits;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isPayment) {
      const input = event.target;
      const typed = input.value.slice(0, input.selectionStart ?? input.value.length).replace(/\D/g, '').length;
      input.value = formatCardNumber(input.value);
      const caret = caretAfterDigits(input.value, typed);
      input.setSelectionRange(caret, caret);
      setTypedDigits(cardDigits(input.value));
    }
    onChange?.(event);
  };

  const iconSize = size === 'small' ? 20 : 24;
  const typeProps =
    variant === 'mobile-number'
      ? { type: 'tel', autoComplete: 'tel-national' }
      : isPayment
        ? { inputMode: 'numeric' as const, autoComplete: 'cc-number' }
        : {};
  const dialCode = variant === 'mobile-number' ? finDialCodes[country] : undefined;

  return (
    <FinInputBase
      {...typeProps}
      {...rest}
      ref={ref}
      variant={variant}
      size={size}
      country={country}
      disabled={disabled}
      onChange={handleChange}
      {...(value !== undefined ? { value: isPayment && value !== null ? formatCardNumber(String(value)) : value } : {})}
      {...(defaultValue !== undefined ? { defaultValue: isPayment ? formatCardNumber(String(defaultValue)) : defaultValue } : {})}
      {...(dialCode ? { prefix: dialCode } : {})}
      {...(isPayment ? { leading: <FinPaymentIcon method={paymentMethod ?? cardBrand(digits)} disabled={disabled} /> } : {})}
      {...(trailingIcon ? { trailing: <FinIcon name={trailingIcon} size={iconSize} /> } : {})}
    />
  );
});
