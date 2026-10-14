import type { HTMLAttributes } from 'react';
import { FinIcon, type FinFgColor, type FinIconSize } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import styles from './FinIconContainer.module.css';

export type FinIconContainerSize = 40 | 48 | 64;
export type FinIconContainerTone = 'primary' | 'secondary' | 'disabled' | 'success' | 'warning' | 'error' | 'info';

export interface FinIconContainerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** A name from the `finIcons` registry. */
  name: FinIconName;
  /** Circle size in px. The icon is 24 in the 40 and 48 circles, 36 in the 64 circle. */
  size?: FinIconContainerSize;
  /** Background and icon colors (Figma `State`, DESIGN.md §7.3). */
  tone?: FinIconContainerTone;
  /** Filled icon style (`FILL 1`), passed straight to FinIcon. */
  filled?: boolean;
  /** Accessible name for an icon that carries meaning, passed to FinIcon. Without it, the icon is decorative. */
  label?: string;
}

const ICON_SIZE: Record<FinIconContainerSize, FinIconSize> = { 40: 24, 48: 24, 64: 36 };
const ICON_COLOR: Record<FinIconContainerTone, FinFgColor> = {
  primary: 'primary',
  secondary: 'secondary',
  disabled: 'disabledOnBg',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
};

/** An icon on a colored circle (Figma Icon sizes: `40px bg`, `48px bg`, `64px bg`; DESIGN.md §9). */
export function FinIconContainer({
  name,
  size = 40,
  tone = 'primary',
  filled = false,
  label,
  className,
  ...rest
}: FinIconContainerProps) {
  return (
    <span
      {...rest}
      className={className ? `${styles.container} ${className}` : styles.container}
      data-size={size}
      data-tone={tone}
    >
      <FinIcon
        name={name}
        size={ICON_SIZE[size]}
        color={ICON_COLOR[tone]}
        filled={filled}
        {...(label ? { label } : {})}
      />
    </span>
  );
}
