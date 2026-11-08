'use client';

import { forwardRef, useCallback, useId, useLayoutEffect, useRef, type CSSProperties, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { FinHelperText } from '../HelperText';
import * as styles from './FinTextArea.styles';

export interface FinTextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children' | 'rows'> {
  /** The field's name (Figma Label). Always the text area's label; shown on the border when focused or filled. */
  label: string;
  /** Figma `Label`. Off: the label is never shown (no notch), but it still names the text area. Default on. */
  showLabel?: boolean;
  /** Figma `Type=Distructive`: the error look (red border, ring and helper text with its icon) and `aria-invalid`. */
  error?: boolean;
  /** Figma `Place holder` and its slot. Shown while the field is empty and not focused. */
  placeholder?: string;
  /** Figma `Helper text` and its slot: the message under the field, linked to the text area. */
  helperText?: ReactNode;
  /** How many lines it shows when empty (default 4: Figma's 128 box). */
  rows?: number;
  /** How many lines it grows to with longer text before it scrolls (default 8; decided 27 Oct 2026). */
  maxRows?: number;
}

/**
 * A multi-line text field (Figma Input field-textArea-base and its field set, Input field-base `3097:27497`; DESIGN.md
 * §9; one public component for both, decided 27 Oct 2026): a box (radius M, 1px border,
 * Space-XL padding all round) with the text area, the label on the top border and the helper text 8 below. It's
 * `rows` lines tall (4: Figma's 128) and grows with the text up to `maxRows` (8), then scrolls. **The states are the
 * browser's**, as FinInputBase: Hovered (`bg-secondary`, empty fields only), Focused and Typing (the label, caret and
 * focus ring), Complete (the label, `border-strong`), Disabled; Error changes the colors and shows the helper text's
 * icon (as Figma). `ref` and other attributes go to the text area.
 */
export const FinTextArea = forwardRef<HTMLTextAreaElement, FinTextAreaProps>(function FinTextArea(
  {
    label,
    showLabel = true,
    error = false,
    placeholder,
    helperText,
    rows = 4,
    maxRows = 8,
    id: idProp,
    disabled = false,
    className,
    style,
    onInput,
    value,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = `${id}-helper`;
  const hasHelper = helperText !== undefined && helperText !== null && helperText !== false;
  const own = useRef<HTMLTextAreaElement | null>(null);
  const setRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      own.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // Grow with the text: as tall as its content, between `rows` and `maxRows` lines (the CSS keeps it in that range).
  const fit = () => {
    const area = own.current;
    if (!area) return;
    area.style.height = 'auto';
    area.style.height = `${area.scrollHeight}px`;
  };
  useLayoutEffect(fit, [value, rows, maxRows]);

  // The notch in the border: the label's text, invisible, so the gap is exactly as wide as the label.
  const notch = showLabel ? (
    <legend className={styles.notch}>
      <span className={styles.notchText}>{label}</span>
    </legend>
  ) : null;

  return (
    <div
      className={className ? `${styles.root} ${className}` : styles.root}
      style={{ ...style, '--text-area-rows': rows, '--text-area-max-rows': Math.max(rows, maxRows) } as CSSProperties}
      data-error={error && !disabled ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <div className={styles.field}>
        <div className={styles.content}>
          <textarea
            {...rest}
            {...(value !== undefined ? { value } : {})}
            ref={setRef}
            id={id}
            rows={rows}
            className={showLabel ? styles.textarea.labelShown : styles.textarea.labelHidden}
            data-label-hidden={showLabel ? undefined : ''}
            disabled={disabled}
            // The label and its notch show once there's text (`:placeholder-shown` is false), so there's always a
            // placeholder, even an empty one.
            placeholder={placeholder ?? ' '}
            aria-invalid={error || undefined}
            aria-describedby={[rest['aria-describedby'], hasHelper ? helperId : undefined].filter(Boolean).join(' ') || undefined}
            onInput={(event) => {
              fit();
              onInput?.(event);
            }}
          />
        </div>
        <fieldset className={styles.outline} aria-hidden="true">
          {notch}
        </fieldset>
        <fieldset className={styles.halo} aria-hidden="true">
          {notch}
        </fieldset>
        <fieldset className={styles.ring} aria-hidden="true">
          {notch}
        </fieldset>
        <label id={`${id}-label`} className={showLabel ? styles.label : styles.hiddenLabel} htmlFor={id}>
          {label}
        </label>
      </div>
      {hasHelper && (
        <FinHelperText id={helperId} className={styles.helper} showIcon={error && !disabled} tone={disabled ? 'disabled' : error ? 'error' : 'default'}>
          {helperText}
        </FinHelperText>
      )}
    </div>
  );
});
