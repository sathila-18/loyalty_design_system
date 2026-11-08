import type { HTMLAttributes, ReactNode } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import { FinButton, type FinButtonIconProps } from '../Button';
import type { FinButtonDockButton } from '../ButtonDock';
import { FinIconContainer } from '../IconContainer';
import { FinTextBox, type FinHeadingLevel } from '../TextBox';
import * as styles from './FinEmptyState.styles';

/** Figma `Size`. */
export type FinEmptyStateSize = 'small' | 'medium';

/**
 * The button: a label, and any button attribute (`onClick`, `disabled`, `type`…). Primary Small. `leadingIcon` (code
 * only, added 28 Oct 2026: Figma's button has no icon) puts an icon before the label, as `add` on an Add button.
 */
export type FinEmptyStateAction = FinButtonDockButton;

interface FinEmptyStateBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma `Size` (default `medium`): the icon container 48 or 64, the heading Headline Small-H6 or Medium-H5. */
  size?: FinEmptyStateSize;
  /** The Text Box heading. */
  heading: ReactNode;
  /** The Text Box description, under the heading. */
  description?: ReactNode;
  /** The heading element (default 2). Changes the structure only, never the look. */
  headingLevel?: FinHeadingLevel;
  /** Figma `Show Button Group`: one Primary Small button under the text. Hidden when not passed. */
  action?: FinEmptyStateAction;
}

/**
 * Figma `Icon Slot`. Its default is an icon container (Primary) with the `person` placeholder, so code asks for an
 * icon (decided 27 Oct 2026); `iconSlot` places anything else instead.
 */
type FinEmptyStateIconProps = { icon: FinIconName; iconSlot?: never } | { icon?: never; iconSlot: ReactNode };

export type FinEmptyStateProps = FinEmptyStateBaseProps & FinEmptyStateIconProps;

/**
 * What a page or area shows when it has nothing to show (Figma Empty state; DESIGN.md §9): an icon, a heading and a
 * description, and an optional button, centred. Fills its container and centres itself in it, across and down;
 * 4 columns of the layout grid wide at most (decided 27 Oct 2026; Figma draws it 711 wide).
 */
export function FinEmptyState({ size = 'medium', icon, iconSlot, heading, description, headingLevel = 2, action, className, ...rest }: FinEmptyStateProps) {
  return (
    <div {...rest} className={className ? `${styles.emptyState} ${className}` : styles.emptyState} data-size={size}>
      <div className={styles.body}>
        <div className={styles.content}>
          {icon ? <FinIconContainer name={icon} size={size === 'small' ? 48 : 64} /> : iconSlot}
          <FinTextBox
            className={styles.text}
            type={size === 'small' ? 'h6' : 'h5'}
            align="center"
            heading={heading}
            {...(description !== undefined ? { description } : {})}
            headingLevel={headingLevel}
          />
        </div>
        {action && <EmptyStateButton {...action} />}
      </div>
    </div>
  );
}

function EmptyStateButton({ label, leadingIcon, ...rest }: FinEmptyStateAction) {
  const icon: FinButtonIconProps = leadingIcon ? { icon: 'leading', iconName: leadingIcon } : {};
  return (
    <FinButton {...rest} {...icon} variant="primary" size="small">
      {label}
    </FinButton>
  );
}
