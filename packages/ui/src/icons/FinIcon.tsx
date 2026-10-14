import type { CSSProperties, HTMLAttributes } from 'react';
import { finColor } from '@finspace-loyalty/tokens';
import { finIcons, type FinIconName } from './finIcons';
import styles from './FinIcon.module.css';

type FinFgToken = Extract<keyof typeof finColor, `fg${string}`>;
/** Every `fg-*` token, without the prefix: `'primary'`, `'secondary'`, `'whiteBoth'`… Generated from the tokens. */
export type FinFgColor = FinFgToken extends `fg${infer Name}` ? Uncapitalize<Name> : never;
/** The Icon sizes in Figma (DESIGN.md §6.3). */
export type FinIconSize = 16 | 20 | 24 | 36 | 48 | 64;

export interface FinIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color' | 'children'> {
  /** A name from the `finIcons` registry. */
  name: FinIconName;
  /** Icon size in px. */
  size?: FinIconSize;
  /** An `fg-*` token. Without it, the icon inherits the surrounding text color. */
  color?: FinFgColor;
  /** Filled style (`FILL 1`), for active or selected states. */
  filled?: boolean;
  /** Accessible name for an icon that carries meaning. Without it, the icon is decorative and hidden from screen readers. */
  label?: string;
}

const registry = new Set<string>(finIcons);
const warned = new Set<string>();

const fgToken = (color: FinFgColor) => finColor[`fg${color.charAt(0).toUpperCase()}${color.slice(1)}` as FinFgToken];

/** Material Symbols Rounded icon, rendered by ligature from the subset font (DESIGN.md §6, §9). */
export function FinIcon({ name, size = 24, color, filled = false, label, className, style, ...rest }: FinIconProps) {
  const known = registry.has(name);
  if (!known && process.env.NODE_ENV !== 'production' && !warned.has(name)) {
    warned.add(name);
    console.warn(`FinIcon: "${name}" isn't in the finIcons registry, so the icon font doesn't include it. Add it to src/icons/finIcons.ts.`);
  }

  return (
    <span
      {...rest}
      className={className ? `${styles.icon} ${className}` : styles.icon}
      style={color ? ({ ...style, '--icon-color': fgToken(color) } as CSSProperties) : style}
      data-size={size}
      data-filled={filled || undefined}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      translate="no"
    >
      {known ? name : null}
    </span>
  );
}
