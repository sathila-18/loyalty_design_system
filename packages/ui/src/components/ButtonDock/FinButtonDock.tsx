import type { HTMLAttributes, ReactNode } from 'react';
import { FinButton, type FinButtonIconProps } from '../Button';
import type { FinButtonBaseProps } from '../ButtonBase';
import type { FinIconName } from '../../icons/finIcons';
import { FinTextBox } from '../TextBox';
import * as styles from './FinButtonDock.styles';

/** A dock button: a label button (Small; Figma's are Large, changed by design 2 Nov 2026), any button attribute (`onClick`, `disabled`, `type`…). */
export type FinButtonDockButton = Omit<
  FinButtonBaseProps,
  'variant' | 'size' | 'leadingIcon' | 'trailingIcon' | 'showLabel' | 'iconOnly' | 'iconSide' | 'children'
> & {
  /** The button's label. */
  label: ReactNode;
  /** Code only (decided 27 Oct 2026): an icon before the label (FinButton `icon="leading"`). Figma's has none. */
  leadingIcon?: FinIconName;
};

/** The Primary and Secondary buttons can be destructive (red, FinButton `tone`) for remove and delete actions. */
export type FinButtonDockToneButton = FinButtonDockButton & {
  /** `destructive` for remove and delete actions. Default `normal`. */
  tone?: 'normal' | 'destructive';
  /**
   * Code only (decided 27 Oct 2026). Default `hug` (changed by design 2 Nov 2026): as wide as its label, Secondary and
   * Primary at the right edge. `fill` takes the width left over (both `fill`: equal shares, as Figma).
   */
  width?: 'fill' | 'hug';
};

export interface FinButtonDockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Figma `Show Accessory` and its slot, above the buttons. A string is shown as Figma's default, a Text Box description
   * (Body/Medium, `text-secondary`); anything else is placed as it is. Hidden when not passed.
   */
  accessory?: ReactNode;
  /** Figma `Show Tertiary Button`: first, as wide as its label (Tertiary). Hidden when not passed. */
  tertiaryButton?: FinButtonDockButton;
  /** Figma `Show Secondary Button`: sharing the rest of the width with the Primary one. Hidden when not passed. */
  secondaryButton?: FinButtonDockToneButton;
  /** Figma `Show Primary Button`: last. Hidden when not passed. */
  primaryButton?: FinButtonDockToneButton;
  /**
   * Figma `Sticky`: the dock is over content that scrolls under it, so it casts Shadow/Sticky upward. The look only:
   * whatever holds the dock pins it and turns this on while content is under it (the side sheet does). Default false.
   */
  sticky?: boolean;
}

const hasContent = (node: ReactNode) => node !== undefined && node !== null && node !== false;

/**
 * The bar of actions at the bottom of a side sheet, dialog or form (Figma Button dock; DESIGN.md §9): an optional
 * accessory (a note) above a row of Small buttons (Figma: Large; changed by design 2 Nov 2026): Tertiary at the start, then
 * Secondary and Primary at the end, each as wide as its label (Figma: sharing the width; changed by design 2 Nov 2026).
 * Fills its container.
 */
export function FinButtonDock({ accessory, tertiaryButton, secondaryButton, primaryButton, sticky = false, className, ...rest }: FinButtonDockProps) {
  const hasButtons = tertiaryButton !== undefined || secondaryButton !== undefined || primaryButton !== undefined;
  const dockClass = sticky ? styles.dock.sticky : styles.dock.still;
  return (
    <div
      {...rest}
      className={className ? `${dockClass} ${className}` : dockClass}
      data-sticky={sticky ? '' : undefined}
    >
      {hasContent(accessory) && (
        <div className={styles.accessory}>
          {typeof accessory === 'string' || typeof accessory === 'number' ? <FinTextBox type="h4" description={accessory} /> : accessory}
        </div>
      )}
      {hasButtons && (
        <div className={styles.buttons}>
          {tertiaryButton && <DockButton {...tertiaryButton} variant="tertiary" />}
          {secondaryButton && <DockButton {...secondaryButton} variant="secondary" firstEnd />}
          {primaryButton && <DockButton {...primaryButton} variant="primary" firstEnd={!secondaryButton} />}
        </div>
      )}
    </div>
  );
}

function DockButton({
  label,
  variant,
  tone = 'normal',
  width = 'hug',
  leadingIcon,
  firstEnd = false,
  className,
  ...rest
}: FinButtonDockToneButton & { variant: 'primary' | 'secondary' | 'tertiary'; firstEnd?: boolean }) {
  // Tertiary is always as wide as its label.
  const fill = variant !== 'tertiary' && width === 'fill';
  const classes = [fill ? styles.fill : undefined, firstEnd ? styles.firstEnd : undefined, className].filter(Boolean).join(' ') || undefined;
  const props = { ...rest, size: 'small' as const, ...(classes ? { className: classes } : {}) };
  const icon: FinButtonIconProps = leadingIcon ? { icon: 'leading', iconName: leadingIcon } : {};
  if (tone === 'destructive' && variant !== 'tertiary')
    return (
      <FinButton {...props} {...icon} tone="destructive" variant={variant}>
        {label}
      </FinButton>
    );
  return (
    <FinButton {...props} {...icon} variant={variant}>
      {label}
    </FinButton>
  );
}
