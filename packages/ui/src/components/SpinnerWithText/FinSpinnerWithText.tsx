import type { HTMLAttributes, ReactNode } from 'react';
import { FinSpinner, type FinSpinnerStatus } from '../Spinner';
import { FinTextBox, type FinHeadingLevel } from '../TextBox';
import styles from './FinSpinnerWithText.module.css';

export interface FinSpinnerWithTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma `Progress` 25/50/75% → `progress` (default), Complete → `success`, Error → `error` (decided 15 Oct 2026, §10 #37). */
  status?: FinSpinnerStatus;
  /**
   * Figma `Progress` 25/50/75%: any value from 0 to `max`, shown as a still ring. Without it, a spinning loader
   * (not in Figma; added at design's request 15 Oct 2026).
   */
  value?: number;
  /** The value that means complete (default 100). */
  max?: number;
  /** The heading under the spinner; also the spinner's accessible name. */
  heading: string;
  /** Figma `Description` = True: the text under the heading (shown when passed). */
  description?: ReactNode;
  /** The heading element (default 3, from the Text Box's Display Small-H3). Structure only, never the look. */
  headingLevel?: FinHeadingLevel;
}

/**
 * A spinner with a centred heading and description under it (Figma spinner-with-text, was Progress-Spinner;
 * DESIGN.md §9). Built from FinSpinner and FinTextBox; spans the middle 6 of 12 grid columns of its container.
 */
export function FinSpinnerWithText({
  status = 'progress',
  value,
  max = 100,
  heading,
  description,
  headingLevel,
  className,
  ...rest
}: FinSpinnerWithTextProps) {
  return (
    <div {...rest} className={className ? `${styles.withText} ${className}` : styles.withText}>
      <FinSpinner status={status} max={max} label={heading} {...(value !== undefined ? { value } : {})} />
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
