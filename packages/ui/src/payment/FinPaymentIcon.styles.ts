/*
 * FinPaymentIcon classes (DESIGN.md §9, §3.11). The box is sized from the Size-* tokens before the logo loads, so
 * nothing moves: heights 16 / 24 / 32 / 48 (Figma Payment Icons), width from the library's 38 × 24 card (payment-w-*
 * in tailwind.css). The logo is an <img> that fits the box at its own ratio, never distorted or recolored.
 */
import type { FinPaymentIconSize } from './FinPaymentIcon';

export const icon = 'fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:align-middle';

export const size: Record<FinPaymentIconSize, string> = {
  small: 'fin:h-16 fin:payment-w-16',
  medium: 'fin:h-24 fin:payment-w-24',
  large: 'fin:h-32 fin:payment-w-32',
  xlarge: 'fin:h-48 fin:payment-w-48',
};

/* The default card, drawn from tokens (Figma Default card: bg-primary, 1px border-subtle inside, Radius-XS). */
export const defaultCard = 'fin:rounded-xs fin:bg-primary fin:inset-ring fin:inset-ring-subtle';

/* Disabled: partly transparent (opacity 0.4, as FinFlag, decided 19 Oct 2026); colors unchanged. */
export const disabled = 'fin:opacity-40';

/*
 * The artwork, never larger than the card. The logo fills the card (its own ratio, centred); the default card's
 * `credit_card` icon (fg-secondary) keeps its size. Both are flex items, so they're blocks.
 */
export const art = { logo: 'fin:block fin:max-w-full fin:max-h-full fin:size-full fin:object-contain', icon: 'fin:max-w-full fin:max-h-full' };
