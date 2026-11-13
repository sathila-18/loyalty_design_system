'use client';

import { forwardRef, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinInputBase, type FinInputBaseSize } from '../InputBase';
import { FinMenu } from '../Menu';
import * as styles from './FinDatePicker.styles';

/** The props both pickers share with their field (the rest go to the button). */
export interface DatePickerFieldProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'name'> {
  /** On the top border once the field is focused or has a value; always its accessible name. */
  label: string;
  /** Shown while nothing is chosen. */
  placeholder?: string;
  /** Helper text below the field. */
  helperText?: ReactNode;
  /** The error look (`border-error`, error helper text); say what's wrong in `helperText`. */
  error?: boolean;
  /** Large 48 or Small 40, as the other fields. Default `large`. */
  size?: FinInputBaseSize;
}

interface InternalProps extends DatePickerFieldProps {
  /** What the field shows (the date or range), or `null` for the placeholder. */
  text: string | null;
  /** The calendar, given a function that closes the menu. */
  calendar: (close: () => void) => ReactNode;
  /** Called as the calendar opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Hidden inputs for the form. */
  formInputs?: ReactNode;
}

/**
 * Internal: the field FinDatePicker and FinDateRangePicker share (not exported). Built as FinSelectField: FinInputBase
 * gives the look and states (Focused while open, Complete once chosen), a `<button>` opens a FinMenu `kind="filter"`
 * (a dialog) holding the calendar, focus goes to the chosen day (or today), and Escape or a click outside closes it.
 */
export const DatePickerField = forwardRef<HTMLButtonElement, InternalProps>(function DatePickerField(
  {
    label,
    placeholder,
    helperText,
    error = false,
    size = 'large',
    text,
    calendar,
    onOpenChange,
    formInputs,
    disabled = false,
    id: idProp,
    className,
    style,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [open, setOpen] = useState(false);
  // Opened with the mouse: once closed, the field goes back to Enabled or Complete, not Focused (as FinSelectField).
  const openedByPointer = useRef(false);
  const [quiet, setQuiet] = useState(false);
  const hasHelper = helperText !== undefined && helperText !== null && helperText !== false;

  const changeOpen = (next: boolean) => {
    setOpen(next);
    setQuiet(!next && openedByPointer.current);
    onOpenChange?.(next);
  };

  return (
    <FinInputBase
      label={label}
      variant="select"
      size={size}
      id={id}
      className={className}
      style={style}
      error={error}
      disabled={disabled}
      filled={text !== null}
      helperText={helperText}
      trailing={<FinIcon name="calendar_today" size={size === 'small' ? 20 : 24} />}
      control={(field) => (
        <>
          <FinMenu
            kind="filter"
            // As wide as the calendar, not the field: the default (never narrower than the trigger) left extra space
            // on the calendar's right (design review 13 Nov 2026).
            width="fit-content"
            anchor={field}
            label={label}
            open={open}
            onOpenChange={changeOpen}
            trigger={({ ref: menuRef, ...menuProps }) => (
              <button
                {...rest}
                {...menuProps}
                ref={(node) => {
                  menuRef(node);
                  if (typeof ref === 'function') ref(node);
                  else if (ref) ref.current = node;
                }}
                type="button"
                id={id}
                disabled={disabled}
                className={styles.trigger[size]}
                data-size={size}
                data-quiet={quiet || undefined}
                onPointerDown={(event) => {
                  openedByPointer.current = true;
                  rest.onPointerDown?.(event);
                }}
                onKeyDown={(event) => {
                  openedByPointer.current = false;
                  setQuiet(false);
                  // ArrowDown opens it too, as the select field.
                  if (event.key === 'ArrowDown' && !open) {
                    event.preventDefault();
                    changeOpen(true);
                  }
                  rest.onKeyDown?.(event);
                }}
                onBlur={(event) => {
                  setQuiet(false);
                  rest.onBlur?.(event);
                }}
                // The label, then the date (or the placeholder): "Start date, 01/08/2026".
                aria-labelledby={`${id}-label ${id}-value`}
                aria-describedby={[rest['aria-describedby'], hasHelper ? `${id}-helper` : undefined].filter(Boolean).join(' ') || undefined}
              >
                <span id={`${id}-value`} className={text !== null ? styles.value.chosen : styles.value.placeholder} data-placeholder={text !== null ? undefined : ''}>
                  {text ?? placeholder}
                </span>
              </button>
            )}
          >
            {calendar(() => changeOpen(false))}
          </FinMenu>
          {formInputs}
        </>
      )}
    />
  );
});
