'use client';

import { forwardRef, useState } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinInputBase, type FinInputBaseProps } from '../InputBase';
import styles from './FinPasswordField.module.css';

export interface FinPasswordFieldProps
  extends Omit<FinInputBaseProps, 'variant' | 'prefix' | 'suffix' | 'leading' | 'trailing' | 'control' | 'filled' | 'country' | 'onCountryClick' | 'type'> {
  /** Figma `Show password`: the password as plain text (controlled). */
  showPassword?: boolean;
  /** Whether the password starts shown (uncontrolled). Default hidden. */
  defaultShowPassword?: boolean;
  /** Called with the new value when the eye button is pressed. */
  onShowPasswordChange?: (showPassword: boolean) => void;
  /** The eye button's names, which always say what it does. Default "Show password" / "Hide password". */
  showLabel?: string;
  hideLabel?: string;
}

/**
 * A password field (Figma Input field-password; DESIGN.md §9), on FinInputBase, which gives it its look and states.
 * The eye button at the end shows or hides the password: `visibility_off` while it's hidden, `visibility` while it's
 * shown, as Figma. Its name always says what pressing it does ("Show password" / "Hide password"). Clicking it doesn't
 * move focus (the field keeps its look, and typing carries on); reached with Tab, focus stays on it, so a keyboard user
 * can press it again, and only the button shows the focus ring. Controlled (`showPassword`) or not (`defaultShowPassword`); the value is
 * controlled or uncontrolled like a native input. `autoComplete` defaults to `current-password` (use `new-password`
 * when setting one). `ref` and other attributes go to the input.
 */
export const FinPasswordField = forwardRef<HTMLInputElement, FinPasswordFieldProps>(function FinPasswordField(
  {
    showPassword: showPasswordProp,
    defaultShowPassword = false,
    onShowPasswordChange,
    showLabel = 'Show password',
    hideLabel = 'Hide password',
    size = 'large',
    disabled = false,
    autoComplete = 'current-password',
    ...rest
  },
  ref,
) {
  const [shownState, setShownState] = useState(defaultShowPassword);
  const shown = showPasswordProp ?? shownState;

  const toggle = () => {
    if (showPasswordProp === undefined) setShownState(!shown);
    onShowPasswordChange?.(!shown);
  };

  return (
    <FinInputBase
      {...rest}
      ref={ref}
      type={shown ? 'text' : 'password'}
      autoComplete={autoComplete}
      size={size}
      disabled={disabled}
      trailing={
        <button
          type="button"
          className={styles.toggle}
          aria-label={shown ? hideLabel : showLabel}
          disabled={disabled}
          // A click doesn't take focus from the input, so typing carries on; Tab still reaches the button.
          onMouseDown={(event) => event.preventDefault()}
          onClick={toggle}
        >
          <FinIcon name={shown ? 'visibility' : 'visibility_off'} size={size === 'small' ? 20 : 24} />
        </button>
      }
    />
  );
});
