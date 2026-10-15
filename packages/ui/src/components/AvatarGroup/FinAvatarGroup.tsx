import type { HTMLAttributes } from 'react';
import { FinAvatar } from '../Avatar';
import styles from './FinAvatarGroup.module.css';

export type FinAvatarGroupSize = 'xsmall' | 'medium' | 'xlarge';

export interface FinAvatarGroupPerson {
  /** Photo URL. Without it (or if it fails to load), the initials are shown. */
  src?: string;
  /** Initials, passed in as they should appear (for example `"SD"`). */
  initials?: string;
  /** The person's name, read by screen readers. */
  label: string;
}

export interface FinAvatarGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Everyone in the group, in display order. */
  people: FinAvatarGroupPerson[];
  /** Figma `Size`: 24, 40 or 56 px circles. */
  size?: FinAvatarGroupSize;
  /** Name of the group for screen readers, for example `"Team members"`. */
  label?: string;
}

/** Up to this many avatars are shown; from one more, the rest are counted in a "+N" circle (decided 15 Oct 2026). */
export const FIN_AVATAR_GROUP_MAX = 6;

/** Overlapping avatars with a "+N" count (Figma Avatar Group; DESIGN.md §9). Every circle is a FinAvatar. */
export function FinAvatarGroup({ people, size = 'medium', label, className, ...rest }: FinAvatarGroupProps) {
  const shown = people.slice(0, FIN_AVATAR_GROUP_MAX);
  const more = people.length - shown.length;

  return (
    <div
      {...rest}
      role="group"
      {...(label ? { 'aria-label': label } : {})}
      className={className ? `${styles.group} ${className}` : styles.group}
      data-size={size}
    >
      {shown.map((person, i) => (
        <FinAvatar key={i} {...person} className={styles.item} size={size} />
      ))}
      {more > 0 && (
        <FinAvatar className={styles.item} type="text" size={size} initials={`+${more}`} label={`${more} more`} />
      )}
    </div>
  );
}
