import type { HTMLAttributes, ReactNode } from 'react';
import { FinBadgeIndicator } from '../BadgeIndicator';
import * as styles from './FinLabel.styles';

export type FinLabelSize = 'medium' | 'small';
/**
 * Code only (13 Nov 2026, for FinStatCard): the text colour. `default` is `text-tertiary` (Figma's Label); `secondary`
 * is `text-secondary`, for a label on a tinted surface where `text-tertiary` is under 4.5:1 (Dark `bg-active`). Figma
 * does the same with an override on the Label's text.
 */
export type FinLabelTone = 'default' | 'secondary';

interface FinLabelBaseProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The text (Figma `Label`). One line; cut off with "…" when the container is narrower. */
  children: ReactNode;
  /** Figma `Size`: Medium (Label/Medium, 21 tall) or Small (Label/Small, 18 tall). */
  size?: FinLabelSize;
  /** The id of a form field: renders a real `<label>` linked to it. Without it, plain text (a `<span>`). */
  htmlFor?: string;
  /** Code only: `default` (`text-tertiary`) or `secondary` (`text-secondary`). Default `default`. */
  tone?: FinLabelTone;
}

/**
 * Figma `Show badge`: a small red dot before the text. Its meaning depends on the screen (required, new,
 * unread, error…), so `badgeLabel` is required with it: it's what screen readers announce (decided 15 Oct 2026).
 */
type FinLabelBadgeProps = { badge?: false; badgeLabel?: never } | { badge: true; badgeLabel: string };

export type FinLabelProps = FinLabelBaseProps & FinLabelBadgeProps;

/** A small label or caption (Figma Label, Text box page; DESIGN.md §9). */
export function FinLabel({ children, size = 'medium', htmlFor, tone = 'default', badge, badgeLabel, className, ...rest }: FinLabelProps) {
  const content = (
    <>
      {/* The dot is visual only; its meaning is read after the text ("Email, Required"), not before it. */}
      {badge && <FinBadgeIndicator size="small" tone="error" />}
      <span className={styles.text}>{children}</span>
      {badge && <span className={styles.hidden}>, {badgeLabel}</span>}
    </>
  );
  const props = {
    ...rest,
    className: [styles.label, styles.size[size], styles.tone[tone], className].filter(Boolean).join(' '),
    'data-size': size,
    'data-label-tone': tone === 'default' ? undefined : tone,
  };
  return htmlFor ? (
    <label {...props} htmlFor={htmlFor}>
      {content}
    </label>
  ) : (
    <span {...props}>{content}</span>
  );
}
