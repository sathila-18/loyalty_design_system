'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import * as styles from './FinSegmentBase.styles';

/** Code only (2 Nov 2026): `medium` is Figma's; `small` and `xsmall` are compact ones (`xsmall` for a menu row). */
export type FinSegmentBaseSize = 'medium' | 'small' | 'xsmall';

export interface FinSegmentBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The label. One line; cut off with "…" when the segment is narrower. */
  children: ReactNode;
  /** Figma `Type=Selected`: the white segment. A data state (§7.3); the mapped component sets the ARIA for it. */
  selected?: boolean;
  /** Figma `Show Leading Accessory` with its icon (icons only for now, decided 19 Oct 2026): 20px, colored by the segment. */
  leadingIcon?: FinIconName;
  /**
   * Code only (2 Nov 2026): only `leadingIcon` shows, in a 36 square (padding Space-M all round), filled when selected;
   * the label stays as hidden text, so it's still the button's name. Needs `leadingIcon`.
   */
  iconOnly?: boolean;
  /**
   * Default `medium` (Figma: padding Space-M / Space-3XL, Button/Medium, 40 tall; icon only 36). `small` (code only,
   * 2 Nov 2026): padding Space-XS / Space-L, Button/Small, 32 tall; icon only 28; the 20 icon either way. `xsmall`
   * (code only, 2 Nov 2026): padding 0 / Space-M, Button/Small, Radius-S, 24 tall; icon only 24 (padding Space-XS) with
   * a 16 icon.
   */
  size?: FinSegmentBaseSize;
}

/**
 * One segment of a segmented button (Figma Segmented_button-base; DESIGN.md §7.2, §9). A native `<button>`,
 * `type="button"` unless set; the look only. FinSegmentedButton gives it its role (a radio in a radio group) and
 * keyboard. Figma `State` (Hovered, Pressed, Disabled) is runtime state (§7.3). `ref` goes to the button.
 * **Internal:** not exported from the package; use FinSegmentedButton.
 */
export const FinSegmentBase = forwardRef<HTMLButtonElement, FinSegmentBaseProps>(function FinSegmentBase(
  { children, selected = false, leadingIcon, iconOnly = false, size = 'medium', type = 'button', className, ...rest },
  ref,
) {
  const onlyIcon = iconOnly && leadingIcon !== undefined;
  const look = selected ? styles.look.selected : styles.look.unselected;
  const sized = onlyIcon ? styles.size[size].iconOnly : styles.size[size].text;
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      className={[styles.segment, sized, look.segment, className].filter(Boolean).join(' ')}
      data-selected={selected || undefined}
      data-size={size === 'medium' ? undefined : size}
      data-icon-only={onlyIcon || undefined}
    >
      {leadingIcon && (
        <span className={look.icon}>
          <FinIcon name={leadingIcon} size={size === 'xsmall' ? 16 : 20} filled={iconOnly && selected} />
        </span>
      )}
      <span className={onlyIcon ? styles.label.hidden : styles.label.shown}>{children}</span>
    </button>
  );
});
