'use client';

import { useState, type HTMLAttributes } from 'react';
import { FinIcon, type FinIconSize } from '../../icons/FinIcon';
import { FinOnlineIndicator, type FinOnlineIndicatorSize } from '../OnlineIndicator';
import styles from './FinAvatar.module.css';

export type FinAvatarType = 'image' | 'icon' | 'text';
export type FinAvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge';

export interface FinAvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Figma `Type`. `image` falls back to `text` without a photo (no `src`, or it fails to load), and `text` to `icon` without initials. */
  type?: FinAvatarType;
  /** Figma `Size` (`Xsmall` in Figma): 24, 32, 40, 48, 56, 64 and 96 px. */
  size?: FinAvatarSize;
  /** Photo URL for the `image` type. */
  src?: string;
  /** Initials shown by the `text` type and the photo fallback, passed in as they should appear (for example `"SD"`). */
  initials?: string;
  /** The person's name. Without it, the avatar is decorative (for use next to a visible name). */
  label?: string;
  /** Shows a FinOnlineIndicator at the bottom-right corner (placement decided 15 Oct 2026; not in Figma). */
  online?: boolean;
  /** How the online status is announced. Added to `label` ("Name, Online"), or announced on its own without a label. */
  onlineLabel?: string;
}

const ICON_SIZE: Record<FinAvatarSize, FinIconSize> = {
  xsmall: 16,
  small: 20,
  medium: 24,
  large: 24,
  xlarge: 36,
  xxlarge: 48,
  xxxlarge: 64,
};

/** The indicator is about a quarter of the avatar, on the five Figma sizes (decided 15 Oct 2026). */
const INDICATOR_SIZE: Record<FinAvatarSize, FinOnlineIndicatorSize> = {
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'medium',
  xlarge: 'large',
  xxlarge: 'large',
  xxxlarge: 'xlarge',
};

/** A person's photo, initials or a default icon in a circle (Figma Avatar; DESIGN.md §9). */
export function FinAvatar({
  type = 'image',
  size = 'medium',
  src,
  initials,
  label,
  online = false,
  onlineLabel = 'Online',
  className,
  ...rest
}: FinAvatarProps) {
  // The src that failed to load, so a new src is tried again without an effect.
  const [failedSrc, setFailedSrc] = useState<string>();

  const hasPhoto = type === 'image' && !!src && failedSrc !== src;
  const hasInitials = !hasPhoto && type !== 'icon' && !!initials?.trim();
  const shown: FinAvatarType = hasPhoto ? 'image' : hasInitials ? 'text' : 'icon';

  // With a name, the status joins it and the dot is decorative. Without one, only the dot is announced.
  const name = label && online ? `${label}, ${onlineLabel}` : label;
  // A photo is named by its alt text; initials and the icon by role="img" on the circle.
  const a11y = hasPhoto
    ? {}
    : name
      ? { role: 'img', 'aria-label': name }
      : online
        ? {}
        : { 'aria-hidden': true as const };

  return (
    <span
      {...rest}
      {...a11y}
      className={className ? `${styles.avatar} ${className}` : styles.avatar}
      data-size={size}
      data-type={shown}
    >
      {shown === 'image' && (
        <img className={styles.image} src={src} alt={name ?? ''} onError={() => setFailedSrc(src)} />
      )}
      {shown === 'text' && (
        <span className={styles.initials} aria-hidden="true">
          {initials}
        </span>
      )}
      {shown === 'icon' && <FinIcon name="person" size={ICON_SIZE[size]} color="secondary" />}
      {online && (
        <FinOnlineIndicator
          className={styles.online}
          size={INDICATOR_SIZE[size]}
          label={onlineLabel}
          decorative={!!label}
        />
      )}
    </span>
  );
}
