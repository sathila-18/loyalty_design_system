'use client';

import { forwardRef, useId, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinCheckboxBase } from '../CheckboxBase';
import { FinChipBase } from '../ChipBase';
import { FinInputBase, type FinInputBaseSize } from '../InputBase';
import { FinInputChip } from '../InputChip';
import { FinListStandard } from '../ListStandard';
import { FinMenu } from '../Menu';
import { FinSearchField } from '../SearchField';
import * as styles from './FinMultiSelectField.styles';

/** One choice in the menu. */
export interface FinMultiSelectFieldOption {
  /** What the field's `value`, `onChange` and the form get. */
  value: string;
  /** What's shown, on its chip and in the menu. */
  label: string;
  /** Shown greyed and can't be chosen. */
  disabled?: boolean;
}

export interface FinMultiSelectFieldProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value' | 'defaultValue' | 'onChange' | 'type' | 'name'> {
  /** Figma `Show Label`: on the top border once the field is focused or has a value; always its accessible name. */
  label: string;
  /** The choices, in order. With none, the field is disabled (as FinSelectField). */
  options: FinMultiSelectFieldOption[];
  /** Controlled: the chosen options' values, in the order they were chosen. */
  value?: string[];
  /** Uncontrolled: the options chosen at first. Default none. */
  defaultValue?: string[];
  /** Called with every chosen value after a choice in the menu or a chip's ✕. */
  onChange?: (value: string[]) => void;
  /** Figma `Show Placeholder text`: shown while nothing is chosen. */
  placeholder?: string;
  /** Figma `Show Helper text` and Helper text slot. */
  helperText?: ReactNode;
  /** The error look (`border-error`, error helper text). Say what's wrong in `helperText`: it's read with the field. */
  error?: boolean;
  /** Large 48 (Figma) or Small 40 (code only), as the other fields. Default `large`. */
  size?: FinInputBaseSize;
  /** The form field name: each chosen value is sent with the form (one hidden input each). */
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
 * A multi-select field (Figma Input field-Multi select; DESIGN.md §9.85): a field that opens a menu of options with
 * checkboxes (FinMenu `kind="select"` `multiple`, as wide as the field) and shows each chosen one as a FinInputChip
 * (XSmall) whose ✕ removes it. One row (decided 11 Nov 2026): the chips that fit, then "+N" for the rest. On
 * FinInputBase, as FinSelectField: Hovered while empty, Focused while focused or open, Complete once something is
 * chosen, Disabled, Error. A native `<button>`: Enter, Space or the arrow keys open the menu; the arrow keys and
 * letters move; Enter, Space or a click ticks or unticks an option and the menu stays open; Escape or Tab closes it.
 * `ref` and other attributes go to the button.
 */
export const FinMultiSelectField = forwardRef<HTMLButtonElement, FinMultiSelectFieldProps>(function FinMultiSelectField(
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
  const [ownValue, setOwnValue] = useState<string[]>(defaultValue ?? []);
  const values = value ?? ownValue;
  // The chosen options, in the order chosen; a value with no option is left out.
  const chosen = values.map((v) => options.find((option) => option.value === v)).filter((o): o is FinMultiSelectFieldOption => o !== undefined);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const openedByPointer = useRef(false);
  const [quiet, setQuiet] = useState(false);
  const isDisabled = disabled || options.length === 0;
  const hasHelper = helperText !== undefined && helperText !== null && helperText !== false;
  const button = useRef<HTMLButtonElement | null>(null);

  const search = query.trim().toLowerCase();
  const shown = searchable && search ? options.filter((option) => option.label.toLowerCase().includes(search)) : options;

  const update = (next: string[]) => {
    if (value === undefined) setOwnValue(next);
    onChange?.(next);
  };
  const toggle = (option: FinMultiSelectFieldOption) =>
    update(values.includes(option.value) ? values.filter((v) => v !== option.value) : [...values, option.value]);
  const remove = (option: FinMultiSelectFieldOption) => {
    update(values.filter((v) => v !== option.value));
    // The chip (and its ✕) is gone: focus goes back to the field.
    button.current?.focus();
  };

  // One row: how many chips fit, measured on a hidden copy of them all (with the widest "+N"), again on every resize.
  const [visible, setVisible] = useState(chosen.length);
  const row = useRef<HTMLSpanElement | null>(null);
  const measure = useRef<HTMLSpanElement | null>(null);
  const chosenKey = chosen.map((o) => o.value).join('\n');
  useLayoutEffect(() => {
    const content = row.current?.parentElement;
    const copy = measure.current;
    if (!content || !copy) return;
    const fit = () => {
      const parts = Array.from(copy.children) as HTMLElement[];
      const plus = parts.pop();
      const gap = Number.parseFloat(getComputedStyle(copy).columnGap) || 0;
      // The row's room: the box's content width less everything else in it (the arrow) and the gaps; the button
      // can shrink to nothing (its ::after still covers the box). Hidden inputs and the menu (top layer) take none.
      const box = getComputedStyle(content);
      const inFlow = (Array.from(content.children) as HTMLElement[]).filter(
        (el) => el.offsetParent !== null && !el.hasAttribute('popover') && getComputedStyle(el).position !== 'fixed',
      );
      const others = inFlow.filter((el) => el !== row.current && el !== button.current);
      const room =
        content.clientWidth -
        Number.parseFloat(box.paddingInlineStart || '0') -
        Number.parseFloat(box.paddingInlineEnd || '0') -
        others.reduce((sum, el) => sum + el.offsetWidth, 0) -
        (Number.parseFloat(box.columnGap) || 0) * Math.max(0, inFlow.length - 1);
      const widths = parts.map((part) => part.offsetWidth);
      const used = (count: number) =>
        widths.slice(0, count).reduce((sum, w) => sum + w, 0) + gap * Math.max(0, count - 1) + (count < widths.length ? gap + (plus?.offsetWidth ?? 0) : 0);
      let count = widths.length;
      while (count > 1 && used(count) > room) count -= 1;
      setVisible(count);
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(fit);
    observer.observe(content);
    return () => observer.disconnect();
  }, [chosenKey, size]);

  const hidden = Math.max(0, chosen.length - visible);

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
      filled={chosen.length > 0}
      helperText={helperText}
      trailing={<FinIcon name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={size === 'small' ? 20 : 24} />}
      control={(field) => (
        <>
          {chosen.length > 0 && (
            <span ref={row} className={styles.chips} data-part="chips">
              {chosen.slice(0, visible).map((option) => (
                <FinInputChip key={option.value} size="xsmall" className={styles.chip} disabled={isDisabled} onRemove={() => remove(option)}>
                  {option.label}
                </FinInputChip>
              ))}
              {hidden > 0 && (
                <FinChipBase size="xsmall" variant="unselected-border" disabled={isDisabled} aria-hidden="true" data-part="more">
                  {`+${hidden}`}
                </FinChipBase>
              )}
              <span ref={measure} className={styles.measure} aria-hidden="true" inert>
                {chosen.map((option) => (
                  <FinInputChip key={option.value} size="xsmall" onRemove={() => undefined}>
                    {option.label}
                  </FinInputChip>
                ))}
                <FinChipBase size="xsmall" variant="unselected-border">{`+${chosen.length}`}</FinChipBase>
              </span>
            </span>
          )}
          <FinMenu
            kind="select"
            multiple
            width="trigger"
            anchor={field}
            label={label}
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              setQuiet(!next && openedByPointer.current);
              if (!next) setQuery('');
            }}
            {...(searchable
              ? {
                  header: (
                    <>
                      <FinSearchField size="small" label={searchLabel} placeholder={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
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
                  button.current = node;
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
                // The label, then the chosen options (or the placeholder): "Provider, SLT Mobitel, Dialog".
                aria-labelledby={`${id}-label ${id}-value`}
                aria-describedby={[rest['aria-describedby'], hasHelper ? `${id}-helper` : undefined].filter(Boolean).join(' ') || undefined}
              >
                <span id={`${id}-value`} className={chosen.length > 0 ? styles.valueText : styles.placeholder} data-placeholder={chosen.length > 0 ? undefined : ''}>
                  {chosen.length > 0 ? chosen.map((option) => option.label).join(', ') : placeholder}
                </span>
              </button>
            )}
          >
            {shown.map((option) => {
              const ticked = values.includes(option.value);
              const optionDisabled = option.disabled ?? false;
              return (
                <FinListStandard
                  key={option.value}
                  as="li"
                  size="small"
                  behavior="option"
                  divider={false}
                  title={option.label}
                  selected={ticked}
                  disabled={optionDisabled}
                  leading={
                    // The row is the option (aria-selected); its checkbox only shows it.
                    <span className={styles.optionCheck} inert aria-hidden="true">
                      <FinCheckboxBase checked={ticked} disabled={optionDisabled} readOnly tabIndex={-1} />
                    </span>
                  }
                  onClick={() => toggle(option)}
                />
              );
            })}
          </FinMenu>
          {name !== undefined && chosen.map((option) => <input key={option.value} type="hidden" name={name} value={option.value} form={form} disabled={isDisabled} />)}
        </>
      )}
    />
  );
});
