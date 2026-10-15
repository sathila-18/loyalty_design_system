import type { HTMLAttributes, ReactNode } from 'react';
import { FinProgressBar } from '../ProgressBar';
import { FinTextBox, type FinHeadingLevel } from '../TextBox';
import styles from './FinBarWithText.module.css';

export interface FinBarWithTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma `Progress` (25/50/75/100%): any value from 0 to `max` (decided 15 Oct 2026, §10 #37). */
  value: number;
  /** The value that means complete (default 100). */
  max?: number;
  /** The heading under the bar; also the bar's accessible name. */
  heading: string;
  /** Figma `Description` = True: the text under the heading (shown when passed). */
  description?: ReactNode;
  /** The heading element (default 3, from the Text Box's Display Small-H3). Structure only, never the look. */
  headingLevel?: FinHeadingLevel;
}

/**
 * A large progress bar with a centred heading and description under it (Figma bar-with-text, was Progress-full;
 * DESIGN.md §9). Built from FinProgressBar and FinTextBox; spans the middle 6 of 12 grid columns of its container.
 */
export function FinBarWithText({ value, max = 100, heading, description, headingLevel, className, ...rest }: FinBarWithTextProps) {
  return (
    <div {...rest} className={className ? `${styles.withText} ${className}` : styles.withText}>
      <FinProgressBar value={value} max={max} size="large" label={heading} />
      <FinTextBox
        type="h3"
        align="center"
        heading={heading}
        {...(description !== undefined ? { description } : {})}
        {...(headingLevel ? { headingLevel } : {})}
      />
    </div>
  );
}
