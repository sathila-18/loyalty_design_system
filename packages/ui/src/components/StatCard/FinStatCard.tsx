import type { HTMLAttributes, ReactNode } from 'react';
import { FinTextBox } from '../TextBox';
import * as styles from './FinStatCard.styles';

export interface FinStatCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** What the number is ("Total points"): the Text Box's Label (Label/Medium), one line, "…" when narrow. */
  label: string;
  /** The number or short value ("806,400", "1,200 pts on 31/10/2026"), formatted by the page. Wraps when long. */
  value: ReactNode;
}

/**
 * A summary number with its label (code first; Figma `Stat card`, added from code 13 Nov 2026; DESIGN.md §9): a
 * `bg-active` card, Radius-L, Space-2XL padding, holding the **Text Box atom** (FinTextBox, Headline Large-H4): its
 * Label is the card label, in `text-secondary` (`labelTone`; the Label's `text-tertiary` is 4.48:1 on Dark
 * `bg-active`, decided 28 Oct 2026), its heading the value, rendered as a paragraph (`headingAs="p"`: a number isn't a
 * section heading). It fills its container; the page lays cards out on its grid. Presentational: no `'use client'`.
 */
export function FinStatCard({ label, value, className, ...rest }: FinStatCardProps) {
  return (
    <div {...rest} className={className ? `${styles.card} ${className}` : styles.card}>
      <FinTextBox type="h4" label={label} labelTone="secondary" heading={value} headingAs="p" />
    </div>
  );
}
