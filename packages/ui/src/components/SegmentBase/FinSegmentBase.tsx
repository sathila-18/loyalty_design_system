'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import styles from './FinSegmentBase.module.css';

export interface FinSegmentBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The label. One line; cut off with "…" when the segment is narrower. */
  children: ReactNode;
  /** Figma `Type=Selected`: the white segment. A data state (§7.3); the mapped component sets the ARIA for it. */
  selected?: boolean;
  /** Figma `Show Leading Accessory` with its icon (icons only for now, decided 19 Oct 2026): 20px, colored by the segment. */
  leadingIcon?: FinIconName;
}

/**
 * One segment of a segmented button (Figma Segmented_button-base; DESIGN.md §7.2, §9). A native `<button>`,
 * `type="button"` unless set; the look only. FinSegmentedButton gives it its role (a radio in a radio group) and
 * keyboard. Figma `State` (Hovered, Pressed, Disabled) is runtime state (§7.3). `ref` goes to the button.
 * **Internal:** not exported from the package; use FinSegmentedButton.
 */
export const FinSegmentBase = forwardRef<HTMLButtonElement, FinSegmentBaseProps>(function FinSegmentBase(
  { children, selected = false, leadingIcon, type = 'button', className, ...rest },
  ref,
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={className ? `${styles.segment} ${className}` : styles.segment}
      data-selected={selected || undefined}
    >
      {leadingIcon && (
        <span className={styles.icon}>
          <FinIcon name={leadingIcon} size={20} />
        </span>
      )}
      <span className={styles.label}>{children}</span>
    </button>
  );
});
