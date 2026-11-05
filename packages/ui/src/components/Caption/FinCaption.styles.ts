/* FinCaption classes (DESIGN.md §9, §3.11). Heavy uses the Label text styles, Light the Body text styles; always text-tertiary. */
import type { FinCaptionSize, FinCaptionThickness } from './FinCaption';

export const caption = 'fin:text-tertiary fin:wrap-break-word';

export const font: Record<FinCaptionThickness, Record<FinCaptionSize, string>> = {
  heavy: { small: 'fin:font-label-small', medium: 'fin:font-label-medium', large: 'fin:font-label-large' },
  light: { small: 'fin:font-body-small', medium: 'fin:font-body-medium', large: 'fin:font-body-large' },
};
