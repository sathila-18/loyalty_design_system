'use client';

import { useId, type DialogHTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { FinButton } from '../Button';
import { FinButtonDock, type FinButtonDockProps } from '../ButtonDock';
import { useBodyScroll, useModalDialog } from '../Dialog/useModalDialog';
import { FinDivider } from '../Divider';
import { FinOverlay } from '../Overlay';
import { FinTextBox, type FinHeadingLevel } from '../TextBox';
import styles from './FinSideSheet.module.css';

export interface FinSideSheetProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'onClose' | 'open'> {
  /** Whether the sheet is open. The sheet opens as a modal dialog over the page; the page behind doesn't scroll. */
  open: boolean;
  /** Called when the sheet asks to close: the close button, Esc, and a click on the scrim (`closeOnOverlayClick`). */
  onClose: () => void;
  /**
   * Figma `Title` slot. A string is shown as Figma's default, a Text Box Headline Large-H4 heading (Figma: Display
   * Small-H3; changed by design 2 Nov 2026), up to two lines and then "…" (decided 26 Oct 2026; was one line);
   * anything else is placed as it is (for example a FinTextBox with a heading and description). It names the sheet for
   * screen readers.
   */
  title: ReactNode;
  /** The heading element for a string `title` (default 2). Changes the structure only, never the look. */
  headingLevel?: FinHeadingLevel;
  /** Figma `Show Back Button` (default off in code, decided 26 Oct 2026: it only works with `onBack`). */
  backButton?: boolean;
  /** Called when the back button is pressed. */
  onBack?: MouseEventHandler<HTMLButtonElement>;
  /** The back button's accessible name (default "Back"). */
  backLabel?: string;
  /** Figma `Show Close Button` (default on). */
  closeButton?: boolean;
  /** The close button's accessible name (default "Close"). */
  closeLabel?: string;
  /** Figma `View Divider` (default off): a line under the header. */
  divider?: boolean;
  /** Figma `Body content slot`. Design-system components only; the sheet owns the padding and scrolling. */
  children?: ReactNode;
  /**
   * Figma `Show Button Dock` and its options (shown when passed). The sheet keeps it at the bottom and sets its
   * `sticky` look while body content is under it.
   */
  buttonDock?: Omit<FinButtonDockProps, 'sticky'>;
  /** A click on the scrim closes the sheet (default on). Turn it off for forms, so a stray click doesn't lose input. */
  closeOnOverlayClick?: boolean;
}

/**
 * A panel on the right edge of the window, over the page (Figma Side sheet; DESIGN.md §9): a header with the title,
 * the body content, which scrolls, and a Button dock. A native modal `<dialog>`: focus stays inside, Esc closes it,
 * and focus goes back to what opened it. Its width follows the layout grid (about 600 at every page width).
 */
export function FinSideSheet({
  open,
  onClose,
  title,
  headingLevel = 2,
  backButton = false,
  onBack,
  backLabel = 'Back',
  closeButton = true,
  closeLabel = 'Close',
  divider = false,
  children,
  buttonDock,
  closeOnOverlayClick = true,
  className,
  onCancel,
  ...rest
}: FinSideSheetProps) {
  const { dialogRef, panelRef, handleCancel } = useModalDialog(open, onClose, onCancel);
  const { bodyRef, scrollable, contentBelow, update } = useBodyScroll(open, children);
  const titleId = useId();

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
        <div className={styles.header}>
          {backButton && (
            <FinButton variant="tertiary" iconTone="secondary" size="medium" icon="only-icon" iconName="arrow_back" onClick={onBack}>
              {backLabel}
            </FinButton>
          )}
          <div id={titleId} className={styles.title}>
            {typeof title === 'string' || typeof title === 'number' ? (
              <FinTextBox type="h4" heading={title} headingLevel={headingLevel} truncateHeading={2} />
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
        {divider && <FinDivider decorative className={styles.divider} />}
        <div ref={bodyRef} className={styles.body} {...(scrollable ? { role: 'region', 'aria-labelledby': titleId, tabIndex: 0 } : {})} onScroll={update}>
          {children}
        </div>
        {buttonDock && <FinButtonDock {...buttonDock} sticky={contentBelow} />}
      </div>
    </dialog>
  );
}
