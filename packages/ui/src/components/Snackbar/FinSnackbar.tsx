'use client';

import { useEffect, useRef, useState, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import { FinButton } from '../Button';
import styles from './FinSnackbar.module.css';

/** Figma `State`. */
export type FinSnackbarTone = 'neutral' | 'success' | 'warning' | 'error';

export interface FinSnackbarAction {
  /** The button's label (Figma `Text here`). */
  label: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export interface FinSnackbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
  /** The message (Figma: the Text Box description). Body/Medium, wraps. */
  children: ReactNode;
  /** Figma `State` (default `neutral`): dark `bg-direct`, or the status's light background with its icon. */
  tone?: FinSnackbarTone;
  /** Figma `# of lines` (default `single`): `two` puts the buttons on a row under the message. */
  lines?: 'single' | 'two';
  /** Figma `Show Leading Icon` (default on). The icon comes from `tone`. */
  showIcon?: boolean;
  /** The Neutral icon (default `info`; Figma has the `person` placeholder, decided 27 Oct 2026). */
  icon?: FinIconName;
  /** Figma `Show Button` (in `Show Trailing content`): a Tertiary Small button. Hidden when not passed. */
  action?: FinSnackbarAction;
  /**
   * Figma `Show Close` (in `Show Trailing content`): the close button shows when this is passed. Also called when
   * the snackbar closes itself (`duration`).
   */
  onClose?: () => void;
  /** The close button's accessible name (default "Close"). */
  closeLabel?: string;
  /**
   * Milliseconds before it closes itself through `onClose` (code only, decided 27 Oct 2026). Default 6000 without an
   * `action`; with one it stays until closed, so there's time to reach the button. `null` never closes it. The time
   * starts again after the pointer and focus leave it.
   */
  duration?: number | null;
}

const ICONS: Record<Exclude<FinSnackbarTone, 'neutral'>, FinIconName> = {
  success: 'check_circle',
  warning: 'warning',
  error: 'warning',
};

/**
 * A short message about something that just happened, with an optional action (Figma Snackbar; DESIGN.md §9). Show
 * it inside a FinSnackbarRegion, which places it at the top right and announces it. Error snackbars are alerts
 * (announced straight away); the others wait for the screen reader to finish. Focus doesn't move to it.
 */
export function FinSnackbar({
  children,
  tone = 'neutral',
  lines = 'single',
  showIcon = true,
  icon = 'info',
  action,
  onClose,
  closeLabel = 'Close',
  duration,
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: FinSnackbarProps) {
  const [paused, setPaused] = useState({ pointer: false, focus: false });
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  const wait = duration === undefined ? (action ? null : 6000) : duration;
  const holding = paused.pointer || paused.focus;
  useEffect(() => {
    if (wait === null || holding || !closeRef.current) return;
    const timer = setTimeout(() => closeRef.current?.(), wait);
    return () => clearTimeout(timer);
  }, [wait, holding]);

  const neutral = tone === 'neutral';
  const hasTrailing = action !== undefined || onClose !== undefined;

  return (
    <div
      {...rest}
      className={className ? `${styles.snackbar} ${className}` : styles.snackbar}
      data-tone={tone}
      data-lines={lines}
      data-trailing={hasTrailing ? '' : undefined}
      {...(tone === 'error' ? { role: 'alert' } : {})}
      onMouseEnter={(e) => {
        setPaused((p) => ({ ...p, pointer: true }));
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setPaused((p) => ({ ...p, pointer: false }));
        onMouseLeave?.(e);
      }}
      onFocus={(e) => {
        setPaused((p) => ({ ...p, focus: true }));
        onFocus?.(e);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused((p) => ({ ...p, focus: false }));
        onBlur?.(e);
      }}
    >
      <div className={styles.lead}>
        {showIcon && <FinIcon name={neutral ? icon : ICONS[tone]} color={neutral ? 'inverse' : tone} className={styles.icon} />}
        <p className={styles.message}>{children}</p>
      </div>
      {hasTrailing && (
        <div className={styles.trailing}>
          {action && (
            <FinButton variant="tertiary" size="small" contentTone={neutral ? 'inverse' : 'primary'} onClick={action.onClick}>
              {action.label}
            </FinButton>
          )}
          {onClose && (
            <FinButton
              variant="tertiary"
              size="medium"
              icon="only-icon"
              iconName="close"
              contentTone={neutral ? 'inverse' : 'primary'}
              onClick={() => onClose()}
            >
              {closeLabel}
            </FinButton>
          )}
        </div>
      )}
    </div>
  );
}
