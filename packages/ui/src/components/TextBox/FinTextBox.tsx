import type { HTMLAttributes, ReactNode } from 'react';
import { FinLabel, type FinLabelSize } from '../Label';
import styles from './FinTextBox.module.css';

export type FinTextBoxType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type FinTextBoxAlign = 'left' | 'center' | 'right';
export type FinHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface FinTextBoxBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma `Type`: the heading's look (Display Large-H1 … Headline Small-H6) and the description's text style. */
  type?: FinTextBoxType;
  /** Figma `Alignment`. */
  align?: FinTextBoxAlign;
  /** Figma `Show Label` + its text: a FinLabel directly above the heading. */
  label?: string;
  /** The Label's `Size` (exposed by Figma's Text Box): Medium (default, as in Figma) or Small. */
  labelSize?: FinLabelSize;
  /** Figma `Show Heading` + its text. */
  heading?: ReactNode;
  /** Figma `Show Description` + its text. */
  description?: ReactNode;
  /**
   * The heading element (`<h1>`…`<h6>`), for the page's structure. Defaults to the number in `type`; changes the
   * structure only, never the look (decided 15 Oct 2026).
   */
  headingLevel?: FinHeadingLevel;
}

/**
 * The Label's `Show badge`, exposed by Figma's Text Box: shown with `labelBadge`, and then `labelBadgeLabel` (what the
 * dot means, for screen readers) is required, as on FinLabel.
 */
type FinTextBoxBadgeProps = { labelBadge?: false; labelBadgeLabel?: never } | { labelBadge: true; labelBadgeLabel: string };

export type FinTextBoxProps = FinTextBoxBaseProps & FinTextBoxBadgeProps;

/** A heading with an optional label above and description below (Figma Text Box; DESIGN.md §9). */
export function FinTextBox({
  type = 'h1',
  align = 'left',
  label,
  labelSize = 'medium',
  heading,
  description,
  headingLevel,
  labelBadge,
  labelBadgeLabel,
  className,
  ...rest
}: FinTextBoxProps) {
  const Heading = `h${headingLevel ?? Number(type.slice(1))}` as 'h1';
  return (
    <div {...rest} className={className ? `${styles.textBox} ${className}` : styles.textBox} data-type={type} data-align={align}>
      {label !== undefined &&
        (labelBadge ? (
          <FinLabel size={labelSize} badge badgeLabel={labelBadgeLabel}>
            {label}
          </FinLabel>
        ) : (
          <FinLabel size={labelSize}>{label}</FinLabel>
        ))}
      {(heading !== undefined || description !== undefined) && (
        <div className={styles.content}>
          {heading !== undefined && <Heading className={styles.heading}>{heading}</Heading>}
          {description !== undefined && <p className={styles.description}>{description}</p>}
        </div>
      )}
    </div>
  );
}
