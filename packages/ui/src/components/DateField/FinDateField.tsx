'use client';

import { forwardRef, useState, type ChangeEvent, type FocusEvent } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinCalendar } from '../Calendar';
import { FinInputBase, type FinInputBaseProps } from '../InputBase';
import { FinMenu } from '../Menu';
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
  /** The earliest date allowed, as YYYY-MM-DD (the calendar greys out the ones before it). */
  min?: string;
  /** The latest date allowed, as YYYY-MM-DD. */
  max?: string;
  /** Rules out other dates in the calendar: return `true` for a date (YYYY-MM-DD) that can't be picked there. */
  isDateDisabled?: (date: string) => boolean;
  /** Today, as YYYY-MM-DD (the calendar marks it and opens on it). Default: the viewer's today (see FinCalendar). */
  today?: string;
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
 * and the slashes are added, or press the calendar button for **our calendar** (FinCalendar in a FinMenu, as
 * FinDatePicker; replaced the browser's date picker 13 Nov 2026). Code gets YYYY-MM-DD. Left with a date that isn't
 * whole or real, or outside `min` / `max`, it shows its own error (unless the page sets `error` itself).
 */
export const FinDateField = forwardRef<HTMLInputElement, FinDateFieldProps>(function FinDateField(
  {
    value,
    defaultValue,
    onChange,
    min,
    max,
    isDateDisabled,
    today,
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
  const [open, setOpen] = useState(false);
  // The text input: focus goes back to it when the calendar closes.
  const [input, setInput] = useState<HTMLInputElement | null>(null);
  const iso = parseDate(text);
  const words = { ...DEFAULT_MESSAGES, ...messages };

  const update = (next: string) => {
    setText(next);
    setProblem(null);
    onChange?.(parseDate(next));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => update(maskDate(event.target.value));

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    // Focus going into the calendar isn't leaving the field: no error while a date is being picked.
    if (open) {
      onBlur?.(event);
      return;
    }
    if (text && !iso) setProblem(words.invalid);
    else if (iso && min && iso < min) setProblem(words.beforeMin(formatDate(min)));
    else if (iso && max && iso > max) setProblem(words.afterMax(formatDate(max)));
    onBlur?.(event);
  };

  const iconSize = size === 'small' ? 20 : 24;
  const showProblem = problem !== null && !error;

  return (
    <FinInputBase
      inputMode="numeric"
      autoComplete="off"
      maxLength={10}
      {...rest}
      ref={(node) => {
        setInput(node);
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
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
      trailing={(field) => (
        <FinMenu
          kind="filter"
          anchor={field}
          // As wide as the calendar, as FinDatePicker (§9.87).
          width="fit-content"
          label={pickerLabel}
          open={open && !disabled}
          onOpenChange={setOpen}
          returnFocusTo={input}
          trigger={(menuProps) => (
            <button
              {...menuProps}
              type="button"
              className={styles.button}
              aria-label={pickerLabel}
              disabled={disabled}
              // A click doesn't take focus from the input; Tab still reaches the button.
              onMouseDown={(event) => event.preventDefault()}
            >
              <FinIcon name="calendar_today" size={iconSize} />
            </button>
          )}
        >
          <FinCalendar
            value={iso}
            {...(min ? { min } : {})}
            {...(max ? { max } : {})}
            {...(isDateDisabled ? { isDateDisabled } : {})}
            {...(today ? { today } : {})}
            onChange={(date) => {
              update(formatDate(date));
              // Focus back in the text before the menu goes, so it doesn't land on the button.
              input?.focus();
              setOpen(false);
            }}
          />
        </FinMenu>
      )}
    />
  );
});
