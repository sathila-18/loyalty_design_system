/*
 * FinInputBase classes (DESIGN.md §9.58, §3.11). Figma Input field-base, with the states from Input field-standard
 * and -password: box 48 tall (padding 12 / 16, Space-L / Space-XL, around the 24 content), radius M, 1px border;
 * content gap 8 (Space-M); Mobile number: the content starts 8 (Space-M) after the divider; helper text 8 below, 16 in
 * from the sides. Value Body/Large text-primary, placeholder text-placeholder, prefix and suffix Body/Large
 * text-tertiary, icons fg-secondary, caret fg-brand. Label Label/Small text-tertiary on the top border, 16 in, with
 * 4 (Space-XS) each side.
 *
 * States (decided 21 Oct 2026; the field-* variants in tailwind.css): Enabled border-default, placeholder only;
 * Hovered bg-secondary (empty, not focused); Focused and Typing: the label, placeholder hidden, the ring (2px
 * border-focused over the border and a 2px bg-active halo outside it); Complete (filled, not focused): the label,
 * border-strong; Disabled: border-disabled, text-disabled, fg-disabled (no error look). Error: border-error, ring
 * border-error with a bg-error-secondary halo.
 *
 * Small (code only; decided 21 Oct 2026): box 40 tall, padding 8 / 16 (Space-M / Space-XL), icons 20. The value,
 * placeholder, prefix, suffix and mask are Body/Medium (decided by design 2 Nov 2026), in the same 24 row.
 *
 * The label sits on no background: the border, ring and halo are fieldsets whose legend (the label's text, invisible)
 * cuts a gap in them, so whatever surface is behind the field shows (decided 21 Oct 2026).
 */
import type { FinInputBaseSize, FinInputBaseVariant } from './FinInputBase';

/* The whole field; fin:group/field-root marks it for the state variants (data-error, data-disabled, data-filled). */
export const root = 'fin:group/field-root fin:flex fin:flex-col fin:gap-m fin:w-full fin:min-w-0';

/* The box. Hovered: only an empty field that isn't focused (Figma has Hovered for those only). */
export const field = 'fin:group/field-box fin:relative fin:flex fin:items-stretch fin:rounded-m fin:field-hover:bg-secondary';

/* The row inside the box: Space-L (Small: Space-M) above and below, Space-XL at the sides (Mobile number: Space-M after the divider). */
const contentBase = 'fin:group/field-content fin:flex fin:flex-1 fin:gap-m fin:items-center fin:min-w-0';

export const contentSize: Record<FinInputBaseSize, string> = {
  large: 'fin:py-l',
  small: 'fin:py-m',
};

export const contentVariant: Record<FinInputBaseVariant, string> = {
  default: `${contentBase} fin:px-xl`,
  payment: `${contentBase} fin:px-xl`,
  select: `${contentBase} fin:px-xl`,
  'mobile-number': `${contentBase} fin:ps-m fin:pe-xl`,
};

/* The value, placeholder, prefix, suffix and mask: Body/Large; Small: Body/Medium (decided by design 2 Nov 2026). */
export const text: Record<FinInputBaseSize, string> = {
  large: 'fin:font-body-large',
  small: 'fin:font-body-medium',
};

/*
 * The input: no native look; caret fg-brand. Its placeholder text-placeholder (disabled: text-disabled). Focused, the
 * label takes over from the placeholder; without a visible label (FinSearchField) the placeholder stays (decided by
 * design 22 Oct 2026). A search input uses its own clear button (search-plain in tailwind.css).
 */
const inputBase =
  'fin:peer/field-value fin:flex-1 fin:min-w-0 fin:h-24 fin:m-none fin:p-none fin:border-none fin:border-current fin:outline-none ' +
  'fin:bg-transparent fin:text-primary fin:caret-fg-brand fin:search-plain fin:disabled:text-disabled ' +
  'fin:placeholder:text-placeholder fin:placeholder:opacity-100 fin:disabled:placeholder:text-disabled';

export const input = {
  labelShown: `${inputBase} fin:focus:placeholder:text-transparent`,
  labelHidden: inputBase,
};

/*
 * The mask (code only, FinDateField): the format hint behind the value, in the placeholder's colour, so the rest of
 * the pattern stays while typing. Hidden while the placeholder shows (empty and not focused).
 */
export const masked = 'fin:relative fin:flex fin:flex-1 fin:min-w-0';

export const mask =
  'fin:absolute fin:inset-none fin:flex fin:items-center fin:overflow-hidden fin:text-placeholder fin:whitespace-pre ' +
  'fin:pointer-events-none fin:group-data-disabled/field-root:text-disabled fin:field-mask-idle:hidden';

export const maskTyped = 'fin:invisible';

export const affix = 'fin:flex-none fin:text-tertiary fin:group-data-disabled/field-root:text-disabled';

export const accessory =
  'fin:group/field-accessory fin:flex fin:flex-none fin:items-center fin:fg-secondary fin:group-data-disabled/field-root:fg-disabled';

/* Mobile number: the country selector fills the box's height, with the box's left corners. */
export const country = 'fin:self-stretch fin:rounded-l-m';

/*
 * The divider takes the border's colour. While the label shows, it starts under it, so a long label never sits on the
 * line (Figma's short label ends before it).
 */
export const divider =
  'fin:divider-color-default fin:group-data-error/field-root:divider-color-error fin:field-complete:divider-color-strong ' +
  'fin:group-data-disabled/field-root:divider-color-disabled fin:field-filled:mt-m fin:field-focused:mt-m';

/* Border, ring and halo: fieldsets laid over the box, each cut by the label's notch (field-*-box in tailwind.css). */
const frame = 'fin:absolute fin:min-w-0 fin:m-none fin:pointer-events-none';

export const outline =
  `${frame} fin:field-outline-box fin:border fin:border-default fin:group-data-error/field-root:border-error ` +
  'fin:field-complete:border-strong fin:group-data-disabled/field-root:border-disabled';

export const ring =
  `${frame} fin:field-ring-box fin:border-2 fin:border-focused fin:group-data-error/field-root:border-error ` +
  'fin:hidden fin:field-focused:block';

export const halo =
  `${frame} fin:field-halo-box fin:border-2 fin:border-bg-active ` +
  'fin:group-data-error/field-root:border-bg-error-secondary fin:hidden fin:field-focused:block';

/* The notch: as wide as the label (its text and 4 each side), closed until the label shows. */
export const notch =
  'fin:block fin:float-none fin:max-w-0 fin:h-0 fin:p-none fin:overflow-hidden fin:font-label-small fin:whitespace-nowrap ' +
  'fin:invisible fin:field-filled:max-w-full fin:field-focused:max-w-full';

export const notchText = 'fin:px-xs';

/* The label on the border: hidden (still the input's name) until the field is focused or filled. */
export const label =
  'fin:absolute fin:top-none fin:left-xl fin:field-label-place fin:px-xs fin:truncate fin:text-tertiary ' +
  'fin:group-data-disabled/field-root:text-disabled fin:font-label-small fin:opacity-0 fin:pointer-events-none ' +
  'fin:field-filled:opacity-100 fin:field-focused:opacity-100';

/* Show Label off (Search): read by screen readers, never shown. */
export const hiddenLabel = 'fin:sr-only';

export const helper = 'fin:px-xl';
