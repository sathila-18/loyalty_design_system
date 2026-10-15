import type { HTMLAttributes, ReactNode } from 'react';
import styles from './FinCaption.module.css';

export type FinCaptionSize = 'small' | 'medium' | 'large';
export type FinCaptionThickness = 'heavy' | 'light';

export interface FinCaptionProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The text (Figma: typed over the text layer). Wraps onto more lines when long (decided 15 Oct 2026). */
  children: ReactNode;
  /** Figma `Size`. */
  size?: FinCaptionSize;
  /** Figma `Thickness`: Heavy (Label text styles, semibold) or Light (Body text styles, regular). */
  thickness?: FinCaptionThickness;
}

/** A small caption (Figma Caption, List page; DESIGN.md §9). */
export function FinCaption({ children, size = 'small', thickness = 'heavy', className, ...rest }: FinCaptionProps) {
  return (
    <span {...rest} className={className ? `${styles.caption} ${className}` : styles.caption} data-size={size} data-thickness={thickness}>
      {children}
    </span>
  );
}
