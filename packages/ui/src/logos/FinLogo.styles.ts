/*
 * FinLogo classes (DESIGN.md §9.83, §3.11). The logo is artwork: an <img> at its own ratio, the height from the Size-*
 * tokens (Figma Logo sizes: Small 41, Medium 53, Large 82, mapped to 40 / 56 / 80; Small fits the side nav's 40 slot).
 * The box is sized before the file loads (lazily), from the artwork's ratio, so nothing moves: with text 770 × 275,
 * the mark 300 × 318 (Sampath's files; logo-text-w-*, logo-mark-w-* in tailwind.css).
 */
import type { FinLogoSize } from './FinLogo';

export const logo = 'fin:inline-flex fin:flex-none fin:items-center fin:align-middle';

export const size: Record<FinLogoSize, { text: string; mark: string }> = {
  small: { text: 'fin:h-40 fin:logo-text-w-40', mark: 'fin:h-40 fin:logo-mark-w-40' },
  medium: { text: 'fin:h-56 fin:logo-text-w-56', mark: 'fin:h-56 fin:logo-mark-w-56' },
  large: { text: 'fin:h-80 fin:logo-text-w-80', mark: 'fin:h-80 fin:logo-mark-w-80' },
};

/*
 * The artwork. `auto`: Colored in Light, White in Dark, from the nearest data-theme (on <html>, or a side-by-side
 * panel). A theme selector in a component, as FinButtonBase's (§10 #74): an image can't follow a color token.
 */
const art = 'fin:size-full fin:object-contain';
export const artwork = {
  fixed: `fin:block ${art}`,
  autoColoured: `fin:block fin:[[data-theme=dark]_&]:hidden ${art}`,
  autoWhite: `fin:hidden fin:[[data-theme=dark]_&]:block ${art}`,
};
