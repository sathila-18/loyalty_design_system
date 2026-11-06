/*
 * FinHelperText classes (DESIGN.md §9, §3.11). The icon is FinIcon (its color comes from the tone); these lay it out
 * and color the text. Long messages wrap; the 20px icon lines up with the first 18px line (decided 15 Oct 2026).
 */
import type { FinHelperTextTone } from './FinHelperText';

export const helper = 'fin:flex fin:gap-m fin:items-start fin:w-full';

export const text = 'fin:min-w-0 fin:font-body-small fin:wrap-anywhere';

/* The text's colour by tone. */
export const tone: Record<FinHelperTextTone, string> = {
  default: 'fin:text-secondary',
  success: 'fin:text-success',
  warning: 'fin:text-warning',
  error: 'fin:text-error',
  disabled: 'fin:text-disabled',
};

/* With the icon, the first line is offset 1px (helper-text-offset in tailwind.css). */
export const textWithIcon = 'fin:helper-text-offset';
