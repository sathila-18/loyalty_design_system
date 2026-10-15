import type { HTMLAttributes } from 'react';
import styles from './FinOverlay.module.css';

export type FinOverlayProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

/**
 * The dimmed backdrop behind dialogs and side sheets (Figma Overlay, `Type=Desktop`; DESIGN.md §9).
 * Covers the whole browser window at any size. Decorative: hidden from screen readers and not focusable.
 * `onClick` is for "click outside"; the component on top decides what it does. Stacking and page-scroll
 * locking belong to that component (Dialog box, Side sheet), not here.
 */
export function FinOverlay({ className, ...rest }: FinOverlayProps) {
  return <div {...rest} aria-hidden="true" className={className ? `${styles.overlay} ${className}` : styles.overlay} />;
}
