'use client';

import { forwardRef, useId, useImperativeHandle, useRef } from 'react';
import { FinCheckboxBase, type FinCheckboxBaseProps } from '../CheckboxBase';
import { FinTextBox } from '../TextBox';
import styles from './FinCheckbox.module.css';

export interface FinCheckboxProps extends Omit<FinCheckboxBaseProps, 'label' | 'aria-labelledby'> {
  /** The text (Figma's Text Box). It names the checkbox, and clicking it toggles the checkbox. */
  children: string;
  /** Figma `Show Text Box`. When false the text is visually hidden but still names the checkbox. */
  showTextBox?: boolean;
}

/**
 * A checkbox with its text (Figma Checkbox; DESIGN.md §9): FinCheckboxBase on the left, a FinTextBox description
 * beside it. The checkbox is always on the left (decided 19 Oct 2026). A native checkbox, so `checked` /
 * `defaultChecked`, `onChange`, `indeterminate`, `name`, `value` and `disabled` go to it, and `ref` too;
 * `className` goes to the row.
 */
export const FinCheckbox = forwardRef<HTMLInputElement, FinCheckboxProps>(function FinCheckbox(
  { children, showTextBox = true, disabled = false, className, ...rest },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current as HTMLInputElement);
  const textId = useId();

  // Clicking the text works like clicking a <label>: it moves focus to the checkbox (without the keyboard focus
  // ring, as a label click does) and toggles it.
  const toggle = () => {
    input.current?.focus({ preventScroll: true, focusVisible: false });
    input.current?.click();
  };

  return (
    <div className={className ? `${styles.checkbox} ${className}` : styles.checkbox} data-disabled={disabled || undefined}>
      <FinCheckboxBase
        {...rest}
        ref={input}
        disabled={disabled}
        {...(showTextBox ? { 'aria-labelledby': textId } : { label: children })}
      />
      {showTextBox && (
        // A pointer shortcut only: the checkbox is the keyboard control, and the text is already its name.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className={styles.text} onClick={toggle}>
          <FinTextBox id={textId} description={children} disabled={disabled} />
        </div>
      )}
    </div>
  );
});
