'use client';

import { forwardRef, useState, type ButtonHTMLAttributes, type MouseEvent, type ReactNode, type Ref } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import { FinChipBase, type FinChipSize } from '../ChipBase';

export interface FinFilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The label. */
  children: ReactNode;
  /** Figma Chips `Type=Selected` (to be renamed `Selected` in Figma, §10 #46). Controlled. */
  selected?: boolean;
  /** The start value when uncontrolled. */
  defaultSelected?: boolean;
  /** Called with the new value when the chip is toggled. */
  onSelectedChange?: (selected: boolean) => void;
  /** XSmall 26, Small 33 (default), Large 40 tall. */
  size?: FinChipSize;
  /** A leading icon, sized and colored by the chip. */
  leadingIcon?: FinIconName;
  /** Other leading content (an avatar, a flag…), used instead of `leadingIcon`. */
  leadingAccessory?: ReactNode;
}

/**
 * A chip that turns a filter on or off; several can be on at once (Figma Chips; DESIGN.md §9; one of the three chip
 * types decided 19 Oct 2026). A native `<button>` with `aria-pressed` on FinChipBase: Unselected or Selected look.
 * Controlled (`selected` + `onSelectedChange`) or uncontrolled (`defaultSelected`). `ref` goes to the button.
 */
export const FinFilterChip = forwardRef<HTMLButtonElement, FinFilterChipProps>(function FinFilterChip(
  { selected, defaultSelected = false, onSelectedChange, onClick, size = 'small', disabled = false, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultSelected);
  const isSelected = selected ?? inner;

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (selected === undefined) setInner(!isSelected);
    onSelectedChange?.(!isSelected);
  };

  return (
    <FinChipBase
      {...rest}
      as="button"
      ref={ref as Ref<HTMLElement>}
      size={size}
      disabled={disabled}
      variant={isSelected ? 'selected' : 'unselected'}
      aria-pressed={isSelected}
      onClick={toggle}
    />
  );
});
