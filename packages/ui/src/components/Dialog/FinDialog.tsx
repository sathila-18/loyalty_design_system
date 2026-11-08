'use client';

import { useId, type DialogHTMLAttributes, type ReactNode } from 'react';
import { FinButton } from '../Button';
import type { FinButtonDockToneButton } from '../ButtonDock';
import { FinOverlay } from '../Overlay';
import { FinTextBox, type FinHeadingLevel } from '../TextBox';
import { useBodyScroll, useModalDialog } from './useModalDialog';
import styles from './FinDialog.module.css';

/** A dialog button: a Medium label button, any button attribute (`onClick`, `disabled`, `type`…); `tone: 'destructive'` for remove and delete. */
export type FinDialogButton = FinButtonDockToneButton;

export interface FinDialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'onClose' | 'open'> {
  /** Whether the dialog is open. It opens as a modal dialog over the page; the page behind doesn't scroll. */
  open: boolean;
  /** Called when the dialog asks to close: the close button, Esc, and a click on the scrim (`closeOnOverlayClick`). */
  onClose: () => void;
  /**
   * The title. A string is shown as Figma's default, a Text Box Headline Large-H4 heading that wraps; anything else is
   * placed as it is. It names the dialog for screen readers.
   */
  title: ReactNode;
  /** The heading element for a string `title` (default 2). Changes the structure only, never the look. */
  headingLevel?: FinHeadingLevel;
  /** Figma `Show Trailing Icon`: the close button (default on). */
  closeButton?: boolean;
  /** The close button's accessible name (default "Close"). */
  closeLabel?: string;
  /**
   * Figma `Show Body Content` and its `Slot`. A string is shown as Figma's default, a Text Box description
   * (Body/Large, `text-secondary`); anything else is placed as it is. Hidden when not passed.
   */
  children?: ReactNode;
  /** Figma `Show Leading Button`: a Secondary button on the left, as wide as its label. Hidden when not passed. */
  leadingButton?: FinDialogButton;
  /** Figma `Show Button Secondary` (in `Show Trailing Buttons`): on the right, before the Primary one. Hidden when not passed. */
  secondaryButton?: FinDialogButton;
  /** Figma `Show Button Primary` (in `Show Trailing Buttons`): last. `tone: 'destructive'` for remove and delete. Hidden when not passed. */
  primaryButton?: FinDialogButton;
  /** A click on the scrim closes the dialog (default on). Turn it off where a stray click would lose input. */
  closeOnOverlayClick?: boolean;
}

const hasContent = (node: ReactNode) => node !== undefined && node !== null && node !== false;

/**
 * A dialog box in the middle of the window, over the page (Figma Dialog box; DESIGN.md §9): the title with a close
 * button, the body content and the buttons. A native modal `<dialog>`: focus stays inside, Esc closes it, and focus
 * goes back to what opened it. Its width follows the layout grid (about 600 to 680); taller content scrolls in the body.
 */
export function FinDialog({
  open,
  onClose,
  title,
  headingLevel = 2,
  closeButton = true,
  closeLabel = 'Close',
  children,
  leadingButton,
  secondaryButton,
  primaryButton,
  closeOnOverlayClick = true,
  className,
  onCancel,
  ...rest
}: FinDialogProps) {
  const { dialogRef, panelRef, handleCancel } = useModalDialog(open, onClose, onCancel);
  const { bodyRef, scrollable, update } = useBodyScroll(open, children);
  const titleId = useId();
  const hasBody = hasContent(children);
  const hasButtons = leadingButton !== undefined || secondaryButton !== undefined || primaryButton !== undefined;

  return (
    <dialog
      {...rest}
      ref={dialogRef}
      className={className ? `${styles.dialog} ${className}` : styles.dialog}
      aria-labelledby={titleId}
      onCancel={handleCancel}
    >
      <FinOverlay onClick={closeOnOverlayClick ? onClose : undefined} />
      <div ref={panelRef} className={styles.panel} tabIndex={-1}>
        <div className={styles.header} data-last={hasBody || hasButtons ? undefined : ''}>
          <div id={titleId} className={styles.title}>
            {typeof title === 'string' || typeof title === 'number' ? (
              <FinTextBox type="h4" heading={title} headingLevel={headingLevel} />
            ) : (
              title
            )}
          </div>
          {closeButton && (
            <FinButton variant="tertiary" iconTone="secondary" size="medium" icon="only-icon" iconName="close" onClick={onClose}>
              {closeLabel}
            </FinButton>
          )}
        </div>
        {hasBody && (
          <div ref={bodyRef} className={styles.body} data-part="body" data-last={hasButtons ? undefined : ''} {...(scrollable ? { role: 'region', 'aria-labelledby': titleId, tabIndex: 0 } : {})} onScroll={update}>
            {typeof children === 'string' || typeof children === 'number' ? <FinTextBox type="h2" description={children} /> : children}
          </div>
        )}
        {hasButtons && (
          <div className={styles.buttons}>
            {leadingButton && <DialogButton {...leadingButton} variant="secondary" />}
            {(secondaryButton || primaryButton) && (
              <div className={styles.trailing}>
                {secondaryButton && <DialogButton {...secondaryButton} variant="secondary" />}
                {primaryButton && <DialogButton {...primaryButton} variant="primary" />}
              </div>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}

function DialogButton({ label, variant, tone = 'normal', ...rest }: FinDialogButton & { variant: 'primary' | 'secondary' }) {
  if (tone === 'destructive')
    return (
      <FinButton {...rest} size="medium" tone="destructive" variant={variant}>
        {label}
      </FinButton>
    );
  return (
    <FinButton {...rest} size="medium" variant={variant}>
      {label}
    </FinButton>
  );
}
