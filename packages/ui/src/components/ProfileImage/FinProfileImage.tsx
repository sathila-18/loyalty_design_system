'use client';

import type { HTMLAttributes, MouseEventHandler } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import { FinAvatar } from '../Avatar';
import styles from './FinProfileImage.module.css';

export interface FinProfileImageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onClick'> {
  /** Photo URL. Without it, the default icon is shown (Figma `Type=Icon`) and the badge adds a photo. */
  src?: string;
  /** The person's name, for the photo's alt text. */
  label?: string;
  /** Called when the badge is clicked; the app opens its own upload or edit flow. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Accessible name of the badge. Default: "Add profile photo", or "Change profile photo" with a photo. */
  buttonLabel?: string;
}

/** A 96px avatar with an add/edit photo button (Figma Profile image; DESIGN.md §9). */
export function FinProfileImage({ src, label, onClick, buttonLabel, className, ...rest }: FinProfileImageProps) {
  // Decided 15 Oct 2026: the badge follows `src`, so a photo that fails to load still shows `edit`.
  const hasPhoto = !!src;

  return (
    <div {...rest} className={className ? `${styles.profile} ${className}` : styles.profile}>
      <FinAvatar
        type={hasPhoto ? 'image' : 'icon'}
        size="xxxlarge"
        {...(src ? { src } : {})}
        {...(label ? { label } : {})}
      />
      <button
        type="button"
        className={styles.badge}
        aria-label={buttonLabel ?? (hasPhoto ? 'Change profile photo' : 'Add profile photo')}
        {...(onClick ? { onClick } : {})}
      >
        <FinIcon name={hasPhoto ? 'edit' : 'photo_camera'} size={16} color="inverse" />
      </button>
    </div>
  );
}
