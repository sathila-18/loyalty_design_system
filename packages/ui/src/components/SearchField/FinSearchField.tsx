'use client';

import { forwardRef, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinInputBase, type FinInputBaseProps } from '../InputBase';
import styles from './FinSearchField.module.css';

export interface FinSearchFieldProps
  extends Omit<
    FinInputBaseProps,
    'variant' | 'prefix' | 'suffix' | 'leading' | 'trailing' | 'control' | 'filled' | 'country' | 'onCountryClick' | 'type' | 'error' | 'helperText' | 'showLabel'
  > {
  /** What's searched, read by screen readers ("Search members"). Never shown (Figma Search has no label). */
  label: string;
  /** Called after the clear button (or Escape) empties the field; `onChange` is called too, as for typing. */
  onClear?: () => void;
  /** The clear button's name. Default "Clear search". */
  clearLabel?: string;
}

/**
 * A search field (Figma Search; DESIGN.md §9), on FinInputBase, with its usual states (hover, focus, Complete) and
 * the label never shown (`label` still names it). A `search` icon at the start; once there's text, a clear button
 * (`cancel`) at the end that empties the field and returns focus to it. A click on it keeps focus in the input; it
 * has no hover look. Escape also clears. A native `type="search"` input (the browser's own clear button is hidden);
 * controlled or uncontrolled. `ref` and other attributes go to the input.
 */
export const FinSearchField = forwardRef<HTMLInputElement, FinSearchFieldProps>(function FinSearchField(
  { placeholder = 'Search', clearLabel = 'Clear search', onClear, size = 'large', value, defaultValue, onChange, onKeyDown, disabled = false, ...rest },
  ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [typed, setTyped] = useState(() => String(defaultValue ?? ''));
  const hasValue = (value !== undefined && value !== null ? String(value) : typed) !== '';
  const iconSize = size === 'small' ? 20 : 24;

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTyped(event.target.value);
    onChange?.(event);
  };

  // Empties the input the way typing would, so `onChange` runs in controlled and uncontrolled use alike.
  const clear = () => {
    const input = inputRef.current;
    if (!input) return;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
    onClear?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.key === 'Escape' && hasValue && !event.defaultPrevented) {
      event.preventDefault();
      clear();
    }
  };

  return (
    <FinInputBase
      enterKeyHint="search"
      {...rest}
      ref={setRefs}
      type="search"
      showLabel={false}
      placeholder={placeholder}
      size={size}
      disabled={disabled}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...(value !== undefined ? { value } : {})}
      {...(defaultValue !== undefined ? { defaultValue } : {})}
      leading={<FinIcon name="search" size={iconSize} />}
      {...(hasValue && !disabled
        ? {
            trailing: (
              <button
                type="button"
                className={styles.clear}
                aria-label={clearLabel}
                // A click doesn't take focus from the input; Tab still reaches the button.
                onMouseDown={(event) => event.preventDefault()}
                onClick={clear}
              >
                <FinIcon name="cancel" size={iconSize} filled />
              </button>
            ),
          }
        : {})}
    />
  );
});
