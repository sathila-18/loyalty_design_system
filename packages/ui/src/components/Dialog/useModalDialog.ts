'use client';

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react';

/**
 * The modal behaviour FinDialog and FinSideSheet share (DESIGN.md §9.13, §9.70, §9.71). Internal.
 * - `open` opens the native `<dialog>` with `showModal()` (top layer, page inert, focus kept inside) and closes it;
 *   closing returns focus to what opened it.
 * - On open, focus goes to the panel itself (screen readers read the title; Tab reaches the buttons next), not the
 *   first button, so no focus ring shows until the keyboard is used. The panel needs `tabIndex={-1}`.
 * - The page behind doesn't scroll while it's open.
 * - Esc asks the parent to close through `onClose` (`handleCancel`), so `open` stays the one source of truth.
 */
export function useModalDialog(
  open: boolean,
  onClose: () => void,
  onCancel?: (event: SyntheticEvent<HTMLDialogElement>) => void,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      panelRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    onCancel?.(event);
    event.preventDefault();
    onClose();
  };

  return { dialogRef, panelRef, handleCancel };
}

/**
 * The scrolling body of FinDialog and FinSideSheet. Internal. Watches the body (and its content) while `open`:
 * - `scrollable`: the content is taller than the body. The body then becomes a focusable region named by the title
 *   (`role="region"`, `tabIndex={0}`), so keyboard users can reach and scroll it even when it holds only text
 *   (WCAG 2.1.1, axe `scrollable-region-focusable`).
 * - `contentBelow`: the body can still scroll down (FinSideSheet turns its dock `sticky`).
 * Pass `update` to the body's `onScroll`; `content` re-runs the check when the content changes.
 */
export function useBodyScroll(open: boolean, content: unknown) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  const [contentBelow, setContentBelow] = useState(false);

  const update = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return;
    setScrollable(body.scrollHeight - body.clientHeight > 1);
    setContentBelow(body.scrollHeight - body.scrollTop - body.clientHeight > 1);
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (!open || !body) return;
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(body);
    for (const child of Array.from(body.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [open, content, update]);

  return { bodyRef, scrollable, contentBelow, update };
}
