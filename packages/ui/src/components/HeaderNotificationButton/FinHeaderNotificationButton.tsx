'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinBadgeIndicator } from '../BadgeIndicator';
import styles from './FinHeaderNotificationButton.module.css';

export type FinHeaderNotification = 'none' | 'dot' | 'number';

export interface FinHeaderNotificationButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Figma `Notification` = None / Dot / Number. */
  notification?: FinHeaderNotification;
  /** The unread count shown with `notification="number"`. 0 (or none) shows no badge. */
  count?: number;
  /** Highest number shown before "+" (default 99). */
  max?: number;
  /** The button's accessible name (default "Notifications"). The unread state is added to it. */
  label?: string;
}

/**
 * The notification bell in the header (Figma Header notification; DESIGN.md §9). Figma `State` Hovered / Pressed /
 * Disabled is runtime state (§7.3). A disabled button never shows a badge (decided 22 Oct 2026).
 */
export const FinHeaderNotificationButton = forwardRef<HTMLButtonElement, FinHeaderNotificationButtonProps>(
  function FinHeaderNotificationButton(
    { notification = 'dot', count, max = 99, label = 'Notifications', type = 'button', disabled, className, ...rest },
    ref,
  ) {
    const shown: FinHeaderNotification =
      disabled || (notification === 'number' && !(count !== undefined && count > 0)) ? 'none' : notification;
    const countText = count !== undefined && count > max ? `${max}+` : String(count);
    const name =
      shown === 'number' ? `${label}, ${countText} unread` : shown === 'dot' ? `${label}, unread` : label;

    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        disabled={disabled}
        aria-label={name}
        className={className ? `${styles.button} ${className}` : styles.button}
        data-notification={shown}
      >
        <FinIcon name="notifications" size={24} />
        {shown !== 'none' && (
          <span className={styles.badge} aria-hidden="true">
            <FinBadgeIndicator {...(shown === 'number' ? { count, max } : {})} />
          </span>
        )}
      </button>
    );
  },
);
