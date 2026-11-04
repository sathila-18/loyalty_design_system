import type { HTMLAttributes } from 'react';
import sampathColoured from './sampath/sampath-coloured.png';
import sampathWhite from './sampath/sampath-white.png';
import sampathMarkColoured from './sampath/sampath-mark-coloured.png';
import sampathMarkWhite from './sampath/sampath-mark-white.png';
import type { FinLogoBrand } from './finLogos';
import styles from './FinLogo.module.css';

/** Figma Logo sizes `Size`: heights 40 / 56 / 80 (`--fin-size-*`; Figma 41 / 53 / 82). */
export type FinLogoSize = 'small' | 'medium' | 'large';

/**
 * Figma `Style`: Colored (on light surfaces) or White (on dark ones). `auto` (the default) follows `data-theme`:
 * Colored in Light, White in Dark.
 */
export type FinLogoColour = 'auto' | 'coloured' | 'white';

export interface FinLogoProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  brand: FinLogoBrand;
  /** Figma `Size`. Default small (the side nav's logo slot). */
  size?: FinLogoSize;
  /** Figma `Style`. Default `auto`: Colored in Light, White in Dark. */
  colour?: FinLogoColour;
  /** Figma `Type`: With text (default) or Without text (the mark only). */
  showText?: boolean;
  /** The image's name. Default the brand's name. */
  label?: string;
  /** Next to a visible brand name: hidden from screen readers so it isn't read twice. */
  decorative?: boolean;
}

interface LogoArt {
  name: string;
  withText: Record<'coloured' | 'white', string>;
  mark: Record<'coloured' | 'white', string>;
}

/** Artwork exported from Figma (Foundation – Loyalty › Logo, `18276:4231`), as it is: never recolored or redrawn. */
const LOGOS: Record<FinLogoBrand, LogoArt> = {
  sampath: {
    name: 'Sampath Bank',
    withText: { coloured: sampathColoured, white: sampathWhite },
    mark: { coloured: sampathMarkColoured, white: sampathMarkWhite },
  },
};

/**
 * A brand's logo (Figma Logo sizes; DESIGN.md §6.1, §9.83). Artwork, shown at its own ratio from the height. With
 * `colour="auto"` both versions are in the page and CSS shows the one for the theme (`data-theme`), so it switches with
 * the theme without JavaScript. Announced as one image named by the brand unless `decorative`.
 */
export function FinLogo({
  brand,
  size = 'small',
  colour = 'auto',
  showText = true,
  label,
  decorative = false,
  className,
  ...rest
}: FinLogoProps) {
  const art = LOGOS[brand];
  const files = showText ? art.withText : art.mark;
  const versions = colour === 'auto' ? (['coloured', 'white'] as const) : ([colour] as const);
  return (
    <span
      {...rest}
      className={className ? `${styles.logo} ${className}` : styles.logo}
      data-size={size}
      data-colour={colour}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label ?? art.name })}
    >
      {versions.map((version) => (
        <img key={version} className={styles.art} src={files[version]} alt="" data-version={version} draggable={false} />
      ))}
    </span>
  );
}
