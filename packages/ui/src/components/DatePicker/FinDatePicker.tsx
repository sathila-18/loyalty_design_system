'use client';

import { forwardRef, useState } from 'react';
import { FinCalendar, type FinDateRange } from '../Calendar';
import { formatDate } from '../DateField/dates';
import { DatePickerField, type DatePickerFieldProps } from './DatePickerField';

interface FinDatePickerCommonProps extends DatePickerFieldProps {
  /** The earliest date that can be chosen, as YYYY-MM-DD. */
  min?: string;
  /** The latest date that can be chosen, as YYYY-MM-DD. */
  max?: string;
  /** Rules out other dates: return `true` for a date (YYYY-MM-DD) that can't be chosen. */
  isDateDisabled?: (date: string) => boolean;
  /** Today, as YYYY-MM-DD (see FinCalendar). Default: the viewer's today. */
  today?: string;
}

export interface FinDatePickerProps extends FinDatePickerCommonProps {
  /** The chosen date (controlled), as YYYY-MM-DD; `null` for none. */
  value?: string | null;
  /** The date chosen at first (uncontrolled). */
  defaultValue?: string;
  /** Called with the date chosen, as YYYY-MM-DD. */
  onChange?: (date: string) => void;
  /** The form field name: the date (YYYY-MM-DD) is sent with the form. */
  name?: string;
}

/**
 * A date picker (code first, 13 Nov 2026; shadcn's date picker in this system's look; DESIGN.md §9): a field, as the
 * select field, that opens a calendar (FinCalendar) and shows the chosen date as DD/MM/YYYY. Code gets YYYY-MM-DD.
 * Choosing a date closes the calendar. To type a date as well, use FinDateField.
 */
export const FinDatePicker = forwardRef<HTMLButtonElement, FinDatePickerProps>(function FinDatePicker(
  { value, defaultValue, onChange, name, min, max, isDateDisabled, today, placeholder = 'Pick a date', disabled, form, ...rest },
  ref,
) {
  const [ownValue, setOwnValue] = useState<string | null>(defaultValue ?? null);
  const chosen = value !== undefined ? value : ownValue;
  const text = formatDate(chosen) || null;

  return (
    <DatePickerField
      {...rest}
      ref={ref}
      form={form}
      disabled={disabled}
      placeholder={placeholder}
      text={text}
      formInputs={name !== undefined && <input type="hidden" name={name} value={chosen ?? ''} form={form} disabled={disabled} />}
      calendar={(close) => (
        <FinCalendar
          value={chosen}
          {...(min ? { min } : {})}
          {...(max ? { max } : {})}
          {...(isDateDisabled ? { isDateDisabled } : {})}
          {...(today ? { today } : {})}
          onChange={(date) => {
            if (value === undefined) setOwnValue(date);
            onChange?.(date);
            close();
          }}
        />
      )}
    />
  );
});

export interface FinDateRangePickerProps extends FinDatePickerCommonProps {
  /** The chosen range (controlled); `null` for none. */
  value?: FinDateRange | null;
  /** The range chosen at first (uncontrolled). */
  defaultValue?: FinDateRange;
  /** Called with the whole range once its end is chosen (a start alone isn't a change). */
  onChange?: (range: { from: string; to: string }) => void;
  /** The form field names for the start and end dates (YYYY-MM-DD). */
  fromName?: string;
  toName?: string;
}

/**
 * A date range picker (code first, 13 Nov 2026; shadcn's range date picker in this system's look; DESIGN.md §9): the
 * date picker's field showing "DD/MM/YYYY – DD/MM/YYYY", opening two months side by side. The first pick is the
 * start, the second the end (an earlier one swaps them); the calendar closes once the range is whole, and only then
 * is `onChange` called. Closed after only a start, the range goes back to what it was.
 */
export const FinDateRangePicker = forwardRef<HTMLButtonElement, FinDateRangePickerProps>(function FinDateRangePicker(
  {
    value,
    defaultValue,
    onChange,
    fromName,
    toName,
    min,
    max,
    isDateDisabled,
    today,
    placeholder = 'Pick a date range',
    disabled,
    form,
    ...rest
  },
  ref,
) {
  const [ownValue, setOwnValue] = useState<FinDateRange | null>(defaultValue ?? null);
  const chosen = value !== undefined ? value : ownValue;
  // The picks while the calendar is open: the start alone isn't a change yet.
  const [draft, setDraft] = useState<FinDateRange | null>(null);
  const whole = chosen?.from && chosen.to ? chosen : null;
  // A real en dash between the dates.
  const text = whole ? `${formatDate(whole.from)} – ${formatDate(whole.to)}` : null;

  return (
    <DatePickerField
      {...rest}
      ref={ref}
      form={form}
      disabled={disabled}
      placeholder={placeholder}
      text={text}
      onOpenChange={(open) => setDraft(open ? whole : null)}
      formInputs={
        <>
          {fromName !== undefined && <input type="hidden" name={fromName} value={whole?.from ?? ''} form={form} disabled={disabled} />}
          {toName !== undefined && <input type="hidden" name={toName} value={whole?.to ?? ''} form={form} disabled={disabled} />}
        </>
      }
      calendar={(close) => (
        <FinCalendar
          mode="range"
          numberOfMonths={2}
          value={draft}
          {...(min ? { min } : {})}
          {...(max ? { max } : {})}
          {...(isDateDisabled ? { isDateDisabled } : {})}
          {...(today ? { today } : {})}
          onChange={(next) => {
            setDraft(next);
            if (next.from && next.to) {
              const range = { from: next.from, to: next.to };
              if (value === undefined) setOwnValue(range);
              onChange?.(range);
              close();
            }
          }}
        />
      )}
    />
  );
});
