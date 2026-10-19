'use client';

import { forwardRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import { FinChipBase, type FinChipSize } from '../ChipBase';
import styles from './FinInputChip.module.css';

const ICON_SIZE = { xsmall: 16, small: 16, large: 20 } as const;

export interface FinInputChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The chosen value. */
  children: string;
  /** Called when the ✕ is clicked, or Delete / Backspace is pressed on it. The parent removes the chip. */
  onRemove: () => void;
  /** The ✕ button's name. Default "Remove {children}". */
  removeLabel?: string;
  /** XSmall 26, Small 33 (default), Large 40 tall. */
  size?: FinChipSize;
  /** A leading icon, sized and colored by the chip. */
  leadingIcon?: FinIconName;
  /** Other leading content (an avatar, a flag…), used instead of `leadingIcon`. */
  leadingAccessory?: ReactNode;
  /** The Disabled look; the ✕ can't be used. */
  disabled?: boolean;
}

/**
 * A chosen value in a multi-select field, with a ✕ to remove it (DESIGN.md §9; one of the three chip types decided
 * 19 Oct 2026). FinChipBase with the Unselected look; only the ✕ is a button (no hover or pressed design: cursor
 * only, decided 19 Oct 2026). `ref` goes to the ✕ button, so the field can move focus after a removal;
 * `className` and other attributes go to the chip.
 */
export const FinInputChip = forwardRef<HTMLButtonElement, FinInputChipProps>(function FinInputChip(
  { children, onRemove, removeLabel, size = 'small', disabled = false, ...rest },
  ref,
) {
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      onRemove();
    }
  };

  return (
    <FinChipBase
      {...rest}
      size={size}
      variant="unselected"
      disabled={disabled}
      trailingAccessory={
        <button
          ref={ref}
          type="button"
          className={styles.remove}
          aria-label={removeLabel ?? `Remove ${children}`}
          disabled={disabled}
          onClick={onRemove}
          onKeyDown={onKeyDown}
        >
          <FinIcon name="close" size={ICON_SIZE[size]} />
        </button>
      }
    >
      {children}
    </FinChipBase>
  );
});
