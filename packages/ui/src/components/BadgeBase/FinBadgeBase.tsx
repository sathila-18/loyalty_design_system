import type { HTMLAttributes, ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import styles from './FinBadgeBase.module.css';

export type FinBadgeBaseSize = 'small' | 'large';
/** The Badge-primary `State` colors, in Figma order (DESIGN.md §9.10). The one list every badge and story uses. */
export const FIN_BADGE_TONES = ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'disabled', 'neutral'] as const;
/** A badge tone. `primary` is Badge-base's own color. */
export type FinBadgeTone = (typeof FIN_BADGE_TONES)[number];

export interface FinBadgeBaseProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The label (Figma `Label`). Stays on one line; cut off with "…" when the container is narrower. */
  children: ReactNode;
  /** Figma `Size`: Small (26 tall, fits its content) or Large (32 tall). */
  size?: FinBadgeBaseSize;
  /** Background, border and text color (icons follow the text). Default `primary`, Badge-base's own colors. */
  tone?: FinBadgeTone;
  /** Figma `Show Leading Icon` + the icon: shown when set (none by default, decided 15 Oct 2026). */
  leadingIcon?: FinIconName;
  /** Figma `Show Trailing Icon` + the icon. Decorative, not a dismiss button. */
  trailingIcon?: FinIconName;
}

/**
 * The base every badge is built from (Figma Badge-base, was Tag-base; DESIGN.md §7.2, §9).
 * **Internal:** not exported from the package; use FinBadge. Bases are internal unless DESIGN.md says otherwise.
 */
export function FinBadgeBase({
  children,
  size = 'small',
  tone = 'primary',
  leadingIcon,
  trailingIcon,
  className,
  ...rest
}: FinBadgeBaseProps) {
  const iconSize = size === 'large' ? 20 : 16;
  return (
    <span {...rest} className={className ? `${styles.badge} ${className}` : styles.badge} data-size={size} data-tone={tone}>
      {leadingIcon && <FinIcon name={leadingIcon} size={iconSize} />}
      <span className={styles.label}>{children}</span>
      {trailingIcon && <FinIcon name={trailingIcon} size={iconSize} />}
    </span>
  );
}
