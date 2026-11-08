/*
 * FinNotificationBanner classes (DESIGN.md §9, §3.11). Figma Notification: Space-XL padding, Radius-M; the icon (20),
 * the text and the close button in a row, Space-M apart, all at the top; the title, description and button in a
 * column, Space-XS apart. Each tone is its bg-*-secondary with text-* (Neutral: bg-neutral, a text-primary title and
 * a text-secondary description). Fills its container (Figma draws it 343 wide).
 */
import type { FinNotificationBannerTone } from './FinNotificationBanner';

type ToneClasses = { banner: string; title: string; description: string };

const bannerBase = 'fin:flex fin:gap-m fin:items-start fin:box-border fin:w-full fin:p-xl fin:rounded-m';
const titleBase = 'fin:m-none fin:wrap-break-word fin:font-headline-small-h6';
const descriptionBase = 'fin:m-none fin:wrap-break-word fin:font-body-medium';

export const tone: Record<FinNotificationBannerTone, ToneClasses> = {
  info: {
    banner: `${bannerBase} fin:bg-info-secondary`,
    title: `${titleBase} fin:text-info`,
    description: `${descriptionBase} fin:text-info`,
  },
  success: {
    banner: `${bannerBase} fin:bg-success-secondary`,
    title: `${titleBase} fin:text-success`,
    description: `${descriptionBase} fin:text-success`,
  },
  error: {
    banner: `${bannerBase} fin:bg-error-secondary`,
    title: `${titleBase} fin:text-error`,
    description: `${descriptionBase} fin:text-error`,
  },
  warning: {
    banner: `${bannerBase} fin:bg-warning-secondary`,
    title: `${titleBase} fin:text-warning`,
    description: `${descriptionBase} fin:text-warning`,
  },
  neutral: {
    banner: `${bannerBase} fin:bg-neutral`,
    title: `${titleBase} fin:text-primary`,
    description: `${descriptionBase} fin:text-secondary`,
  },
};

export const text = 'fin:flex fin:flex-auto fin:flex-col fin:gap-xs fin:items-start fin:min-w-0';

/*
 * Figma sets both buttons' padding to 0, so the label lines up with the text and the close icon sits in the corner
 * (decided 27 Oct 2026): the real buttons keep their padding (for the hover tint and a larger target) and are pulled
 * back by it, so they take Figma's space. Small: Space-M by Space-XL; Medium icon only: Space-L. FinButton is already
 * flex-none, and so is FinIcon.
 */
export const action = 'fin:-my-m fin:-mx-xl';

export const close = 'fin:-m-l';
