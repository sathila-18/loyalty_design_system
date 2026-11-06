/*
 * FinAvatar classes (DESIGN.md §9, §3.11). The icon is FinIcon; these style the circle, the photo and the initials.
 * No overflow clip, so the online indicator can sit on the edge: the photo is rounded itself instead.
 */
import type { FinAvatarSize, FinAvatarType } from './FinAvatar';

export const avatar =
  'fin:relative fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:border fin:border-subtle fin:rounded-full';

/* The icon and the initials sit on bg-icons; a photo fills the circle. */
export const type: Record<FinAvatarType, string> = {
  image: '',
  icon: 'fin:bg-icons',
  text: 'fin:bg-icons',
};

/*
 * Sizes: the circle, the initials' text style, and the online indicator, flush with the bottom-right corner, 2px in
 * at 64 and 96 so it stays on the circle (decided 15 Oct 2026). 96 was 100 in Figma (since 15 Oct 2026, a token).
 */
const onlineFlush = 'fin:absolute fin:bottom-none fin:end-none';
const onlineIn = 'fin:absolute fin:bottom-xxs fin:end-xxs';
export const size: Record<FinAvatarSize, { avatar: string; initials: string; online: string }> = {
  xsmall: { avatar: 'fin:size-24', initials: 'fin:font-label-small', online: onlineFlush },
  small: { avatar: 'fin:size-32', initials: 'fin:font-label-medium', online: onlineFlush },
  medium: { avatar: 'fin:size-40', initials: 'fin:font-label-large', online: onlineFlush },
  large: { avatar: 'fin:size-48', initials: 'fin:font-title-large', online: onlineFlush },
  xlarge: { avatar: 'fin:size-56', initials: 'fin:font-headline-medium-h5', online: onlineFlush },
  xxlarge: { avatar: 'fin:size-64', initials: 'fin:font-headline-large-h4', online: onlineIn },
  xxxlarge: { avatar: 'fin:size-96', initials: 'fin:font-display-medium-h2', online: onlineIn },
};

export const image = 'fin:block fin:size-full fin:object-cover fin:rounded-full';

export const initials = 'fin:text-secondary fin:whitespace-nowrap';
