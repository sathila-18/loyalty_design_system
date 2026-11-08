import type { HTMLAttributes, ReactNode } from 'react';
import { FinLabel, type FinLabelSize } from '../Label';
import * as styles from './FinTextBox.styles';

export type FinTextBoxType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type FinTextBoxAlign = 'left' | 'center' | 'right';
export type FinHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** Code only (3 Nov 2026): `default` or `inverse` (`text-inverse`, on a `bg-direct` surface such as FinTooltip). */
export type FinTextBoxTone = 'default' | 'inverse';

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
  /**
   * The heading and description use `text-disabled`, for a Text Box inside a disabled control (Figma Checkbox
   * `State=Disabled` overrides its Text Box this way; added 19 Oct 2026).
   */
  disabled?: boolean;
  /**
   * Code only (3 Nov 2026): the heading and description in `text-inverse` (`inverse`), for a Text Box on a `bg-direct`
   * surface (FinTooltip's rich type, Figma Plain Tooltip). Default `default`.
   */
  tone?: FinTextBoxTone;
  /**
   * The heading stays on one line (`true`) or up to two (`2`) and ends in "…" when it doesn't fit (code only; added
   * 22 Oct 2026 for FinHeader, two lines 26 Oct 2026 for FinSideSheet).
   */
  truncateHeading?: boolean | 2;
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
  disabled = false,
  tone = 'default',
  truncateHeading = false,
  labelBadge,
  labelBadgeLabel,
  className,
  ...rest
}: FinTextBoxProps) {
  const Heading = `h${headingLevel ?? Number(type.slice(1))}` as 'h1';
  const colour = disabled ? 'disabled' : tone === 'inverse' ? 'inverse' : 'default';
  const truncate = truncateHeading === 2 ? 'two' : truncateHeading ? 'one' : 'none';
  return (
    <div {...rest} className={className ? `${styles.textBox[align]} ${className}` : styles.textBox[align]} data-type={type} data-align={align} data-disabled={disabled || undefined} data-tone={tone === 'inverse' ? 'inverse' : undefined} data-truncate-heading={truncateHeading === 2 ? '2' : truncateHeading ? '' : undefined}>
      {label !== undefined &&
        (labelBadge ? (
          <FinLabel size={labelSize} badge badgeLabel={labelBadgeLabel}>
            {label}
          </FinLabel>
        ) : (
          <FinLabel size={labelSize}>{label}</FinLabel>
        ))}
      {(heading !== undefined || description !== undefined) && (
        <div className={styles.content[type]}>
          {heading !== undefined && (
            <Heading className={`${styles.heading.type[type]} ${styles.heading.colour[colour]} ${styles.heading.truncate[truncate]}`}>
              {heading}
            </Heading>
          )}
          {description !== undefined && (
            <p className={`${styles.description.type[type]} ${styles.description.colour[colour]}`}>{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
