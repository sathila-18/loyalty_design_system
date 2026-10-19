'use client';

import { useEffect, useState, type HTMLAttributes } from 'react';
import { finFlags, isFinFlagCountry, type FinFlagCountry } from './finFlags';
import styles from './FinFlag.module.css';

/** Figma Flag sizes `SIze` (typos fixed): heights 12, 16, 24, 40, 48. */
export type FinFlagSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
/** Figma Flag sizes `Type`. */
export type FinFlagShape = 'rectangle' | 'circle';

export interface FinFlagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** An ISO 3166-1 alpha-2 country code. An unsupported code shows the library's neutral flag. */
  country: FinFlagCountry;
  /** Figma Flag sizes `SIze`. Rectangles are 4:3 (16 × 12 … 64 × 48), circles 12 … 48. */
  size?: FinFlagSize;
  /** Figma Flag sizes `Type`: the 4:3 flag, or the square flag rounded into a circle. */
  shape?: FinFlagShape;
  /** Figma Flag sizes `State=Disabled`: the artwork is shown partly transparent, never recolored. */
  disabled?: boolean;
  /** Next to a visible country name (as in the country selector): hidden from screen readers so it isn't read twice. */
  decorative?: boolean;
  /** The alt text. Default the country's English name (for another language, pass the translated name). */
  label?: string;
}

// One lazy loader per flag file: a flag's artwork is fetched only when it's shown (no bundle of every flag).
const LOADERS: Record<FinFlagShape, Record<string, () => Promise<string>>> = {
  rectangle: import.meta.glob<string>('../assets/generated/flags/rectangle/*.svg', { query: '?url', import: 'default' }),
  circle: import.meta.glob<string>('../assets/generated/flags/circle/*.svg', { query: '?url', import: 'default' }),
};

const fileOf = (shape: FinFlagShape, code: string) => `../assets/generated/flags/${shape}/${code.toLowerCase()}.svg`;

/**
 * A country's flag (Figma Flag sizes; DESIGN.md §6.1, §8.5, §9). Artwork from the open-source `flag-icons` (lipis,
 * MIT), self-hosted: code is the source of truth, Figma's flags are visual reference only. Rendered as an `<img>`,
 * never recolored or distorted. Announced as an image named by the country unless `decorative`.
 */
export function FinFlag({
  country,
  size = 'medium',
  shape = 'rectangle',
  disabled = false,
  decorative = false,
  label,
  className,
  ...rest
}: FinFlagProps) {
  const known = isFinFlagCountry(country);
  const code = known ? country : 'XX';
  const name = label ?? (known ? finFlags[country] : 'Unknown country');
  const file = fileOf(shape, code);
  const [loaded, setLoaded] = useState<{ file: string; src: string }>();

  useEffect(() => {
    let current = true;
    void LOADERS[shape][file]?.().then((src) => {
      if (current) setLoaded({ file, src });
    });
    return () => {
      current = false;
    };
  }, [shape, file]);

  return (
    <span
      {...rest}
      className={className ? `${styles.flag} ${className}` : styles.flag}
      data-size={size}
      data-shape={shape}
      data-disabled={disabled || undefined}
      {...(decorative ? { 'aria-hidden': true } : { role: 'img', 'aria-label': name })}
    >
      {loaded?.file === file && <img className={styles.art} src={loaded.src} alt="" draggable={false} />}
    </span>
  );
}
