import type { HTMLAttributes, ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import type { FinBadgeTone } from './badgeTones';
import * as styles from './FinBadgeBase.styles';

export type FinBadgeBaseSize = 'small' | 'large';

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
    <span
      {...rest}
      className={[styles.badge, styles.tone[tone], styles.size[size], className].filter(Boolean).join(' ')}
      data-part="badge"
      data-size={size}
      data-tone={tone}
    >
      {leadingIcon && <FinIcon name={leadingIcon} size={iconSize} />}
      <span className={styles.label}>{children}</span>
      {trailingIcon && <FinIcon name={trailingIcon} size={iconSize} />}
    </span>
  );
}
