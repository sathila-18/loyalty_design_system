import type { HTMLAttributes, ReactNode } from 'react';
import styles from './FinStatCard.module.css';

export interface FinStatCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** What the number is ("Total points"): Label/Medium, one line, "…" when narrow. */
  label: string;
  /** The number or short value ("806,400", "1,200 pts on 31/10/2026"), formatted by the page. Wraps when long. */
  value: ReactNode;
}

/**
 * A summary number with its label (code first, no Figma component: the Reports screens draw it each time, `435:90575`,
 * `440:94624`; DESIGN.md §9): a `bg-active` card, Radius-L, Space-2XL padding, the label (Label/Medium,
 * `text-secondary`; the screens' `text-tertiary` is 4.48:1 on Dark `bg-active`, decided 28 Oct 2026) above the value
 * (Headline Large-H4, `text-primary`). It fills its container; the page lays cards out on its grid. Presentational:
 * no `'use client'`.
 */
export function FinStatCard({ label, value, className, ...rest }: FinStatCardProps) {
  return (
    <div {...rest} className={className ? `${styles.card} ${className}` : styles.card}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}
