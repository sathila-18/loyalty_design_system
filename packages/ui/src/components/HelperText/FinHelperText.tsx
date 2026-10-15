import type { HTMLAttributes, ReactNode } from 'react';
import { FinIcon, type FinFgColor } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import styles from './FinHelperText.module.css';

export type FinHelperTextTone = 'default' | 'success' | 'warning' | 'error' | 'disabled';

export interface FinHelperTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The message (Figma `Text`). Wraps onto more lines when long (decided 15 Oct 2026). */
  children: ReactNode;
  /** Figma `State` (only changes colors and the icon, so `tone`, DESIGN.md §7.3). */
  tone?: FinHelperTextTone;
  /** Figma `Show Leading Icon` (default on). */
  showIcon?: boolean;
  /** A different icon than the tone's Figma icon. */
  icon?: FinIconName;
  /**
   * Announce the message as soon as it appears (`role="alert"`, for an error that must interrupt). Off by default:
   * the field links to the message with `aria-describedby`, so it's read when the person reaches the field
   * (decided 15 Oct 2026), and a form doesn't announce every error at once.
   */
  announce?: boolean;
}

/** The tone's icon and color, as in Figma (icons updated by design 15 Oct 2026). */
const TONE: Record<FinHelperTextTone, { icon: FinIconName; color: FinFgColor }> = {
  default: { icon: 'info', color: 'secondary' },
  success: { icon: 'check_circle', color: 'success' },
  warning: { icon: 'warning', color: 'warning' },
  error: { icon: 'warning', color: 'error' },
  disabled: { icon: 'info', color: 'disabled' },
};

/** A message under a field (Figma Helper text content; DESIGN.md §9). Give it an `id` for the field's `aria-describedby`. */
export function FinHelperText({ children, tone = 'default', showIcon = true, icon, announce = false, className, ...rest }: FinHelperTextProps) {
  return (
    <div
      {...rest}
      {...(announce ? { role: 'alert' } : {})}
      className={className ? `${styles.helper} ${className}` : styles.helper}
      data-tone={tone}
      data-icon={showIcon || undefined}
    >
      {showIcon && <FinIcon name={icon ?? TONE[tone].icon} size={20} color={TONE[tone].color} />}
      <span className={styles.text}>{children}</span>
    </div>
  );
}
