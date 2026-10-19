'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import { FinChipBase, type FinChipSize } from '../ChipBase';

export interface FinAssistChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The label. */
  children: ReactNode;
  /** XSmall 26, Small 33 (default), Large 40 tall. */
  size?: FinChipSize;
  /** A leading icon, sized and colored by the chip. */
  leadingIcon?: FinIconName;
  /** Other leading content (an avatar, a flag…), used instead of `leadingIcon`. */
  leadingAccessory?: ReactNode;
  /** Shows a down arrow: the chip opens a menu or picker. Sets `aria-haspopup` unless you pass your own. */
  dropdown?: boolean;
  /** Whether that menu or picker is open: shown with the Selected look and announced (`aria-expanded`). */
  expanded?: boolean;
}

/**
 * A chip that runs an action, such as choosing a date range or opening a picker (DESIGN.md §9; one of the three chip
 * types decided 19 Oct 2026). A native `<button>` on FinChipBase: the Unselected-border look, Selected while its
 * menu is `expanded`. `ref` goes to the button.
 */
export const FinAssistChip = forwardRef<HTMLButtonElement, FinAssistChipProps>(function FinAssistChip(
  { dropdown = false, expanded, size = 'small', disabled = false, ...rest },
  ref,
) {
  return (
    <FinChipBase
      aria-haspopup={dropdown ? true : undefined}
      {...rest}
      {...(dropdown && expanded !== undefined ? { 'aria-expanded': expanded } : {})}
      as="button"
      ref={ref as Ref<HTMLElement>}
      size={size}
      disabled={disabled}
      variant={expanded ? 'selected' : 'unselected-border'}
      {...(dropdown ? { trailingIcon: 'keyboard_arrow_down' as const } : {})}
    />
  );
});
