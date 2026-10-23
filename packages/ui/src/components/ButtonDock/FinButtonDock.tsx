import type { HTMLAttributes, ReactNode } from 'react';
import { FinButton } from '../Button';
import type { FinButtonBaseProps } from '../ButtonBase';
import { FinTextBox } from '../TextBox';
import styles from './FinButtonDock.module.css';

/** A dock button: a label button (Large, no icon, as Figma), any button attribute (`onClick`, `disabled`, `type`…). */
export type FinButtonDockButton = Omit<
  FinButtonBaseProps,
  'variant' | 'size' | 'leadingIcon' | 'trailingIcon' | 'showLabel' | 'iconOnly' | 'iconSide' | 'children'
> & {
  /** The button's label. */
  label: ReactNode;
};

/** The Primary and Secondary buttons can be destructive (red, FinButton `tone`) for remove and delete actions. */
export type FinButtonDockToneButton = FinButtonDockButton & {
  /** `destructive` for remove and delete actions. Default `normal`. */
  tone?: 'normal' | 'destructive';
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
 * accessory (a note) above a row of Large buttons, Tertiary first, then Secondary and Primary sharing the width
 * equally. Fills its container.
 */
export function FinButtonDock({ accessory, tertiaryButton, secondaryButton, primaryButton, sticky = false, className, ...rest }: FinButtonDockProps) {
  const hasButtons = tertiaryButton !== undefined || secondaryButton !== undefined || primaryButton !== undefined;
  return (
    <div {...rest} className={className ? `${styles.dock} ${className}` : styles.dock} data-sticky={sticky ? '' : undefined}>
      {hasContent(accessory) && (
        <div className={styles.accessory}>
          {typeof accessory === 'string' || typeof accessory === 'number' ? <FinTextBox type="h4" description={accessory} /> : accessory}
        </div>
      )}
      {hasButtons && (
        <div className={styles.buttons}>
          {tertiaryButton && <DockButton {...tertiaryButton} variant="tertiary" />}
          {secondaryButton && <DockButton {...secondaryButton} variant="secondary" fill />}
          {primaryButton && <DockButton {...primaryButton} variant="primary" fill />}
        </div>
      )}
    </div>
  );
}

function DockButton({
  label,
  variant,
  tone = 'normal',
  fill = false,
  className,
  ...rest
}: FinButtonDockToneButton & { variant: 'primary' | 'secondary' | 'tertiary'; fill?: boolean }) {
  const classes = [fill ? styles.fill : undefined, className].filter(Boolean).join(' ') || undefined;
  const props = { ...rest, size: 'large' as const, ...(classes ? { className: classes } : {}) };
  if (tone === 'destructive' && variant !== 'tertiary')
    return (
      <FinButton {...props} tone="destructive" variant={variant}>
        {label}
      </FinButton>
    );
  return (
    <FinButton {...props} variant={variant}>
      {label}
    </FinButton>
  );
}
