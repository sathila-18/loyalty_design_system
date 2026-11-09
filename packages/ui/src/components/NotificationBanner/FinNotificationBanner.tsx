'use client';

import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import { FinButton, type FinButtonContentTone } from '../Button';
import * as styles from './FinNotificationBanner.styles';

/** Figma `Type`. */
export type FinNotificationBannerTone = 'info' | 'success' | 'error' | 'warning' | 'neutral';

export interface FinNotificationBannerAction {
  /** The button's label (Figma `Text here`). */
  label: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export interface FinNotificationBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** The description (Figma `Show Description` + `Description`): the message itself, usually the only text. Body/Medium. */
  children?: ReactNode;
  /** Figma `Show Title` + `Title text`: a title above the description, for the rare cases that need one. Shown when passed. */
  title?: ReactNode;
  /** Figma `Type` (default `info`): the background, text, icon and button colours. */
  tone?: FinNotificationBannerTone;
  /** Figma `Show Leading Icon` (default on). The icon comes from `tone`. */
  showIcon?: boolean;
  /** The Neutral icon (default `info`, as Figma). The other tones always show their own. */
  icon?: FinIconName;
  /** Figma `Show Button`: a Tertiary Small button under the text, in the tone's colour. Hidden when not passed. */
  action?: FinNotificationBannerAction;
  /** Figma `Show Close`: the close button shows when this is passed. The page removes the banner. */
  onClose?: () => void;
  /** The close button's accessible name (default "Close"). */
  closeLabel?: string;
}

const ICONS: Record<Exclude<FinNotificationBannerTone, 'neutral'>, FinIconName> = {
  info: 'info',
  success: 'check_circle',
  error: 'warning',
  warning: 'warning',
};

/** The button's and close button's colours: the tone's own; on Neutral, the button `primary` and the close `secondary`. */
const BUTTON_TONE: Record<FinNotificationBannerTone, { action: FinButtonContentTone; close: FinButtonContentTone }> = {
  info: { action: 'info', close: 'info' },
  success: { action: 'success', close: 'success' },
  error: { action: 'error', close: 'error' },
  warning: { action: 'warning', close: 'warning' },
  neutral: { action: 'primary', close: 'secondary' },
};

/**
 * A message that stays on the page until it's dealt with or closed (Figma Notification; DESIGN.md §9): a status
 * background with an icon, an optional title, the description, an optional action and a close button. Fills its
 * container. Not announced by default (it's part of the page); pass `role="status"` (or `"alert"` for an urgent error)
 * when it appears after something the user did. The title is text, not a heading.
 */
export function FinNotificationBanner({
  children,
  title,
  tone = 'info',
  showIcon = true,
  icon = 'info',
  action,
  onClose,
  closeLabel = 'Close',
  className,
  ...rest
}: FinNotificationBannerProps) {
  const neutral = tone === 'neutral';
  const buttons = BUTTON_TONE[tone];
  const classes = styles.tone[tone];

  return (
    <div {...rest} className={className ? `${classes.banner} ${className}` : classes.banner} data-part="banner" data-tone={tone}>
      {showIcon && <FinIcon name={neutral ? icon : ICONS[tone]} size={20} color={neutral ? 'secondary' : tone} />}
      <div className={styles.text}>
        {title != null && <p className={classes.title}>{title}</p>}
        {children != null && <p className={classes.description}>{children}</p>}
        {action && (
          <FinButton variant="tertiary" size="small" contentTone={buttons.action} className={styles.action} onClick={action.onClick}>
            {action.label}
          </FinButton>
        )}
      </div>
      {onClose && (
        <FinButton
          variant="tertiary"
          size="medium"
          icon="only-icon"
          iconName="close"
          contentTone={buttons.close}
          className={styles.close}
          onClick={() => onClose()}
        >
          {closeLabel}
        </FinButton>
      )}
    </div>
  );
}
