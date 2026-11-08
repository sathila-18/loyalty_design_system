'use client';

import { forwardRef, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinInputBase, type FinInputBaseSize } from '../InputBase';
import { FinListStandard } from '../ListStandard';
import { FinMenu } from '../Menu';
import { FinSearchField } from '../SearchField';
import * as styles from './FinSelectField.styles';

/** One choice in the menu. */
export interface FinSelectFieldOption {
  /** What the field's `value`, `onChange` and the form get. */
  value: string;
  /** What's shown, in the field and in the menu. */
  label: string;
  /** Shown greyed and can't be chosen. */
  disabled?: boolean;
}

export interface FinSelectFieldProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'name'> {
  /** Figma `Show Label`: on the top border once the field is focused or has a value; always its accessible name. */
  label: string;
  /** The choices, in order. With none, the field is disabled (decided 26 Oct 2026). */
  options: FinSelectFieldOption[];
  /** Controlled: the chosen option's value, or `null` for none. */
  value?: string | null;
  /** Uncontrolled: the option chosen at first. Default none. */
  defaultValue?: string;
  /** Called with the value of the option chosen in the menu. */
  onChange?: (value: string) => void;
  /** Figma `Show Placeholder text`: shown while nothing is chosen. */
  placeholder?: string;
  /** Figma `Show Helper text` and Helper text slot. */
  helperText?: ReactNode;
  /** The error look (`border-error`, error helper text). Say what's wrong, or that a choice is needed, in `helperText`:
   * it's read with the field (a button can't be marked invalid or required). */
  error?: boolean;
  /** Large 48 (Figma) or Small 40 (code only), as the other fields. Default `large`. */
  size?: FinInputBaseSize;
  /** The form field name: the chosen value is sent with the form (a hidden input). */
  name?: string;
  /** A search field at the top of the menu that filters the options as you type (long lists). Default off. */
  searchable?: boolean;
  /** The search field's name for screen readers. Default "Search". */
  searchLabel?: string;
  /** The search field's placeholder. Default "Search". */
  searchPlaceholder?: string;
  /** Shown when nothing matches the search. Default "No results found". */
  noResultsText?: string;
}

/**
 * A select field (Figma Input field-select; DESIGN.md §9): a field that opens a menu of options (FinMenu
 * `kind="select"`) as wide as the field, and shows the chosen one. On FinInputBase, which gives it its look and states
 * (decided 26 Oct 2026): Hovered while empty, Focused while focused or open, Complete once chosen, Disabled, Error.
 * The arrow points up while the menu is open. A native `<button>`: Enter, Space or the arrow keys open the menu; the
 * arrow keys and letters move through the options; Enter chooses; Escape closes. Nothing chosen can't be cleared back
 * to empty (decided 26 Oct 2026). `ref` and other attributes go to the button.
 */
export const FinSelectField = forwardRef<HTMLButtonElement, FinSelectFieldProps>(function FinSelectField(
  {
    label,
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    helperText,
    error = false,
    size = 'large',
    name,
    searchable = false,
    searchLabel = 'Search',
    searchPlaceholder = 'Search',
    noResultsText = 'No results found',
    disabled = false,
    id: idProp,
    className,
    style,
    form,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [ownValue, setOwnValue] = useState<string | null>(defaultValue ?? null);
  const chosen = value !== undefined ? value : ownValue;
  const selected = options.find((option) => option.value === chosen);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  // Opened with the mouse: once the menu closes (a choice, Escape, a click outside), the field goes back to Enabled or
  // Complete, not Focused, until the keyboard is used on it again (decided 26 Oct 2026).
  const openedByPointer = useRef(false);
  const [quiet, setQuiet] = useState(false);
  const isDisabled = disabled || options.length === 0;
  const hasHelper = helperText !== undefined && helperText !== null && helperText !== false;

  const search = query.trim().toLowerCase();
  const shown = searchable && search ? options.filter((option) => option.label.toLowerCase().includes(search)) : options;

  const choose = (option: FinSelectFieldOption) => {
    if (value === undefined) setOwnValue(option.value);
    onChange?.(option.value);
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
      disabled={isDisabled}
      filled={selected !== undefined}
      helperText={helperText}
      trailing={<FinIcon name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={size === 'small' ? 20 : 24} />}
      control={(field) => (
        <>
          <FinMenu
            kind="select"
            width="trigger"
            anchor={field}
            label={label}
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              setQuiet(!next && openedByPointer.current);
              // A fresh search each time it opens.
              if (!next) setQuery('');
            }}
            {...(searchable
              ? {
                  header: (
                    <>
                      <FinSearchField size="small" label={searchLabel} placeholder={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
                      {/* Always there, so screen readers announce the text when the search finds nothing. */}
                      <p className={shown.length === 0 ? styles.empty.none : styles.empty.found} role="status" data-empty={shown.length === 0 || undefined}>
                        {shown.length === 0 ? noResultsText : ''}
                      </p>
                    </>
                  ),
                }
              : {})}
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
                form={form}
                disabled={isDisabled}
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
                  menuProps.onKeyDown(event);
                }}
                onBlur={(event) => {
                  setQuiet(false);
                  rest.onBlur?.(event);
                }}
                // The label, then the chosen option (or the placeholder): "Segment, Staff".
                aria-labelledby={`${id}-label ${id}-value`}
                aria-describedby={[rest['aria-describedby'], hasHelper ? `${id}-helper` : undefined].filter(Boolean).join(' ') || undefined}
              >
                <span id={`${id}-value`} className={selected ? styles.value.selected : styles.value.placeholder} data-placeholder={selected ? undefined : ''}>
                  {selected ? selected.label : placeholder}
                </span>
              </button>
            )}
          >
            {shown.map((option) => (
              <FinListStandard
                key={option.value}
                as="li"
                size="small"
                behavior="option"
                divider={false}
                title={option.label}
                selected={option.value === chosen}
                disabled={option.disabled ?? false}
                onClick={() => choose(option)}
              />
            ))}
          </FinMenu>
          {name !== undefined && <input type="hidden" name={name} value={chosen ?? ''} form={form} disabled={isDisabled} />}
        </>
      )}
    />
  );
});
