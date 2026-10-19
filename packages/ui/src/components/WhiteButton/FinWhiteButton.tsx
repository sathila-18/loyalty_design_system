'use client';

import { forwardRef } from 'react';
import { FinButtonBase, type FinButtonBaseProps } from '../ButtonBase';

export type FinWhiteButtonProps = Omit<FinButtonBaseProps, 'variant'>;

/**
 * A white button with dark text, white in both themes (Figma white-button; DESIGN.md §9). A thin wrapper:
 * FinButtonBase with `variant="white"` (§7.2). Figma `State` and `Focused` are runtime states (§7.3).
 * **Internal:** not exported from the package. White-button is one of the bases inside all-button (decided
 * 19 Oct 2026); products use FinButton.
 */
export const FinWhiteButton = forwardRef<HTMLButtonElement, FinWhiteButtonProps>(function FinWhiteButton(props, ref) {
  return <FinButtonBase {...props} ref={ref} variant="white" />;
});
