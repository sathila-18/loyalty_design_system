'use client';

import { forwardRef, useRef, useState, type ChangeEvent, type FocusEvent } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinInputBase, type FinInputBaseProps } from '../InputBase';
import { formatDate, maskDate, parseDate } from './dates';
import * as styles from './FinDateField.styles';

export interface FinDateFieldProps
  extends Omit<
    FinInputBaseProps,
    | 'variant'
    | 'prefix'
    | 'suffix'
    | 'leading'
    | 'trailing'
    | 'control'
    | 'filled'
    | 'country'
    | 'onCountryChange'
    | 'showDialCodes'
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'min'
    | 'max'
  > {
  /** The date (controlled), as YYYY-MM-DD; `null` or "" for none. */
  value?: string | null;
  /** The date at the start (uncontrolled), as YYYY-MM-DD. */
  defaultValue?: string;
  /** Called as the date changes: YYYY-MM-DD once it's a whole, real date, or `null` while it isn't (or is cleared). */
  onChange?: (date: string | null) => void;
  /** The earliest date allowed, as YYYY-MM-DD (the picker greys out the ones before it). */
  min?: string;
  /** The latest date allowed, as YYYY-MM-DD. */
  max?: string;
  /** The calendar button's name (default "Choose date"). */
  pickerLabel?: string;
  /** The field's own messages after it's left with a wrong date. Defaults are in sentence case, with the dates as shown. */
  messages?: { invalid?: string; beforeMin?: (min: string) => string; afterMax?: (max: string) => string };
}

const DEFAULT_MESSAGES = {
  invalid: 'Enter a date as DD/MM/YYYY',
  beforeMin: (min: string) => `Choose a date from ${min}`,
  afterMax: (max: string) => `Choose a date until ${max}`,
};

/**
 * A date field (code first, no Figma component: the Add reward screens draw a text field with `calendar_today`;
 * DESIGN.md §9), on FinInputBase, so it looks and behaves as the other fields. It shows DD/MM/YYYY: type the digits
 * and the slashes are added, or press the calendar button for the **browser's date picker** (for now, decided 27 Oct
 * 2026: replaced by our own calendar once it's designed in Figma). Code gets YYYY-MM-DD. Left with a date that isn't
 * whole or real, or outside `min` / `max`, it shows its own error (unless the page sets `error` itself).
 */
export const FinDateField = forwardRef<HTMLInputElement, FinDateFieldProps>(function FinDateField(
  {
    value,
    defaultValue,
    onChange,
    min,
    max,
    pickerLabel = 'Choose date',
    messages,
    error = false,
    helperText,
    size = 'large',
    disabled = false,
    placeholder = 'DD/MM/YYYY',
    onBlur,
    ...rest
  },
  ref,
) {
  const [text, setText] = useState(() => formatDate(value ?? defaultValue));
  // A new `value` from the page replaces what's shown (but not while the page just echoes what was typed).
  const [shownValue, setShownValue] = useState(value);
  if (value !== undefined && value !== shownValue) {
    setShownValue(value);
    if ((value || null) !== parseDate(text)) setText(formatDate(value));
  }
  const [problem, setProblem] = useState<string | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const iso = parseDate(text);
  const words = { ...DEFAULT_MESSAGES, ...messages };

  const update = (next: string) => {
    setText(next);
    setProblem(null);
    onChange?.(parseDate(next));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => update(maskDate(event.target.value));

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (text && !iso) setProblem(words.invalid);
    else if (iso && min && iso < min) setProblem(words.beforeMin(formatDate(min)));
    else if (iso && max && iso > max) setProblem(words.afterMax(formatDate(max)));
    onBlur?.(event);
  };

  const openPicker = () => {
    const native = picker.current;
    if (!native) return;
    try {
      native.showPicker();
    } catch {
      // Browsers without showPicker() (or blocked): focusing the date input opens it in most of them.
      native.focus();
    }
  };

  const iconSize = size === 'small' ? 20 : 24;
  const showProblem = problem !== null && !error;

  return (
    <FinInputBase
      inputMode="numeric"
      autoComplete="off"
      maxLength={10}
      {...rest}
      ref={ref}
      size={size}
      disabled={disabled}
      placeholder={placeholder}
      // The format stays while typing (decided by design 27 Oct 2026): the rest of DD/MM/YYYY behind the digits.
      mask={placeholder}
      value={text}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error || showProblem}
      {...(showProblem ? { helperText: problem } : helperText !== undefined ? { helperText } : {})}
      trailing={
        <span className={styles.trailing}>
          <button
            type="button"
            className={styles.button}
            aria-label={pickerLabel}
            disabled={disabled}
            // A click doesn't take focus from the input; Tab still reaches the button.
            onMouseDown={(event) => event.preventDefault()}
            onClick={openPicker}
          >
            <FinIcon name="calendar_today" size={iconSize} />
          </button>
          {/* The browser's picker opens from this native date input, hidden under the button. */}
          <input
            ref={picker}
            type="date"
            className={styles.picker}
            tabIndex={-1}
            aria-hidden="true"
            disabled={disabled}
            value={iso ?? ''}
            {...(min ? { min } : {})}
            {...(max ? { max } : {})}
            onChange={(event) => update(formatDate(event.target.value))}
          />
        </span>
      }
    />
  );
});
