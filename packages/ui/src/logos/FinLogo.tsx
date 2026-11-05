'use client';

import { useEffect, useState, type HTMLAttributes } from 'react';
import type { FinLogoBrand } from './finLogos';
import * as styles from './FinLogo.styles';

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

/** Each brand's name (the image's name). Files: `./<brand>/<brand>[-mark]-<coloured|white>.png`. */
const NAMES: Record<FinLogoBrand, string> = { sampath: 'Sampath Bank' };

/**
 * Artwork exported from Figma (Foundation – Loyalty › Logo, `18276:4231`), as it is: never recolored or redrawn. One
 * lazy loader per file, as FinPaymentIcon and FinFlag: a logo is fetched only where it's shown, so apps of other
 * brands don't carry it (a library build would otherwise inline every PNG in the main bundle).
 */
const LOADERS = import.meta.glob<string>('./*/*.png', { query: '?url', import: 'default' });

type Version = 'coloured' | 'white';
const fileOf = (brand: FinLogoBrand, showText: boolean, version: Version) =>
  `./${brand}/${brand}${showText ? '' : '-mark'}-${version}.png`;

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
  const versions: Version[] = colour === 'auto' ? ['coloured', 'white'] : [colour];
  const files = versions.map((version) => fileOf(brand, showText, version));
  const key = files.join();
  const [loaded, setLoaded] = useState<{ key: string; src: Record<string, string> }>();

  useEffect(() => {
    let current = true;
    const wanted = key.split(',');
    void Promise.all(wanted.map((file) => LOADERS[file]?.() ?? Promise.resolve(''))).then((srcs) => {
      if (current) setLoaded({ key, src: Object.fromEntries(wanted.map((file, i) => [file, srcs[i] ?? ''])) });
    });
    return () => {
      current = false;
    };
  }, [key]);

  const box = showText ? styles.size[size].text : styles.size[size].mark;
  const artClass = (version: Version) =>
    colour !== 'auto' ? styles.artwork.fixed : version === 'white' ? styles.artwork.autoWhite : styles.artwork.autoColoured;
  return (
    <span
      {...rest}
      className={[styles.logo, box, className].filter(Boolean).join(' ')}
      data-size={size}
      data-colour={colour}
      data-text={showText || undefined}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': label ?? NAMES[brand] })}
    >
      {loaded?.key === key &&
        versions.map((version, i) => {
          const src = loaded.src[files[i]!];
          return src ? <img key={version} className={artClass(version)} src={src} alt="" data-version={version} draggable={false} /> : null;
        })}
    </span>
  );
}
