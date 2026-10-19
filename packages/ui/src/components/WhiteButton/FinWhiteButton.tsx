'use client';

import { forwardRef } from 'react';
import { FinButtonBase, type FinButtonBaseProps } from '../ButtonBase';

export type FinWhiteButtonProps = Omit<FinButtonBaseProps, 'variant'>;

/**
 * A white button with dark text, white in both themes (Figma white-button; DESIGN.md §9). Made for colored
 * backgrounds such as the brand color. A thin wrapper: FinButtonBase with `variant="white"` (§7.2). A native
 * `<button>`, `type="button"` unless set; `ref` goes to it. Figma `State` and `Focused` are runtime states (§7.3).
 */
export const FinWhiteButton = forwardRef<HTMLButtonElement, FinWhiteButtonProps>(function FinWhiteButton(props, ref) {
  return <FinButtonBase {...props} ref={ref} variant="white" />;
});
