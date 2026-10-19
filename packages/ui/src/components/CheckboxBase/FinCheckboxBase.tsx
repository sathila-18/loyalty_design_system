'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, type InputHTMLAttributes } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import styles from './FinCheckboxBase.module.css';

export interface FinCheckboxBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children'> {
  /**
   * Accessible name, visually hidden (the base has no visible label). Leave it out only when the input is named
   * another way, as FinCheckbox does with `aria-labelledby` pointing at its Text Box.
   */
  label?: string;
  /**
   * Figma `Type=Indeterminate` ("some selected"): shows the dash and is announced as mixed. HTML has no attribute
   * for it, so it's set on the input. Clicking clears it in the browser; the parent decides the next value.
   */
  indeterminate?: boolean;
}

/**
 * A checkbox without a visible label (Figma Base-Checkbox; DESIGN.md §9). A native `<input type="checkbox">`, so
 * `checked` / `defaultChecked`, `onChange`, `name`, `value` and `disabled` work like any checkbox. Figma `Type`
 * Selected/Unselected is `checked`, Indeterminate is `indeterminate`; `State` and `Focused` are runtime (§7.3).
 * `ref` goes to the input.
 * **Internal:** not exported from the package; use FinCheckbox. Table parts use it directly inside their own code.
 */
export const FinCheckboxBase = forwardRef<HTMLInputElement, FinCheckboxBaseProps>(function FinCheckboxBase(
  { label, indeterminate = false, className, ...rest },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current as HTMLInputElement);

  useEffect(() => {
    if (input.current) input.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={className ? `${styles.checkbox} ${className}` : styles.checkbox}>
      <input {...rest} ref={input} type="checkbox" className={styles.input} />
      <span className={styles.box} aria-hidden="true">
        <span className={styles.check}>
          <FinIcon name="check" size={16} />
        </span>
        <span className={styles.dash}>
          <FinIcon name="remove" size={16} />
        </span>
      </span>
      {label !== undefined && <span className={styles.label}>{label}</span>}
    </label>
  );
});
