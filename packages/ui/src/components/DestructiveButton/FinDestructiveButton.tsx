'use client';

import { forwardRef } from 'react';
import { FinButtonBase, type FinButtonBaseProps } from '../ButtonBase';

export type FinDestructiveButtonVariant = 'primary' | 'secondary';

export interface FinDestructiveButtonProps extends Omit<FinButtonBaseProps, 'variant'> {
  /** Figma `Type`: Primary (filled red) or Secondary (red border). Named like the base's `variant`. */
  variant?: FinDestructiveButtonVariant;
}

const BASE_VARIANT = { primary: 'destructive', secondary: 'destructive-secondary' } as const;

/**
 * A button for destructive actions such as delete (Figma Destructive-button; DESIGN.md §9). A thin wrapper:
 * FinButtonBase with `variant="destructive"` or `"destructive-secondary"` (§7.2). Figma `State` and `Focused` are
 * runtime states (§7.3).
 * **Internal:** not exported from the package. Destructive-button is one of the bases inside all-button (decided
 * 19 Oct 2026); products use FinButton.
 */
export const FinDestructiveButton = forwardRef<HTMLButtonElement, FinDestructiveButtonProps>(
  function FinDestructiveButton({ variant = 'primary', ...props }, ref) {
    return <FinButtonBase {...props} ref={ref} variant={BASE_VARIANT[variant]} />;
  },
);
