/*
 * FinTextBox classes (DESIGN.md §9, §3.11). The label is FinLabel; these lay out the parts and style the heading and
 * description. Fills its container; both texts wrap. The look comes from `type`, never from the heading level.
 */
import type { FinTextBoxAlign, FinTextBoxType } from './FinTextBox';

/* No gap between the label and the content (Space-none, exactly as Figma). Alignment: the label row and both texts. */
const textBoxBase = 'fin:flex fin:flex-col fin:gap-none fin:w-full';

export const textBox: Record<FinTextBoxAlign, string> = {
  left: `${textBoxBase} fin:items-start`,
  center: `${textBoxBase} fin:items-center fin:text-center`,
  right: `${textBoxBase} fin:items-end fin:text-right`,
};

/* Type: the gap between heading and description, 8 (Space-M) for H1–H4, 4 (Space-XS) for H5–H6. */
const contentBase = 'fin:flex fin:flex-col fin:w-full';

export const content: Record<FinTextBoxType, string> = {
  h1: `${contentBase} fin:gap-m`,
  h2: `${contentBase} fin:gap-m`,
  h3: `${contentBase} fin:gap-m`,
  h4: `${contentBase} fin:gap-m`,
  h5: `${contentBase} fin:gap-xs`,
  h6: `${contentBase} fin:gap-xs`,
};

/*
 * The colours: text-primary (heading) / text-secondary (description); text-inverse on a bg-direct surface (code only,
 * 3 Nov 2026; FinTooltip's rich type); text-disabled inside a disabled control (Figma Checkbox, State=Disabled), which
 * wins over inverse.
 */
export type FinTextBoxColour = 'default' | 'inverse' | 'disabled';

export const heading = {
  /* Type: the heading's text style. */
  type: {
    h1: 'fin:font-display-large-h1',
    h2: 'fin:font-display-medium-h2',
    h3: 'fin:font-display-small-h3',
    h4: 'fin:font-headline-large-h4',
    h5: 'fin:font-headline-medium-h5',
    h6: 'fin:font-headline-small-h6',
  } satisfies Record<FinTextBoxType, string>,
  colour: {
    default: 'fin:text-primary',
    inverse: 'fin:text-inverse',
    disabled: 'fin:text-disabled',
  } satisfies Record<FinTextBoxColour, string>,
  /* Wraps; or one line ending in "…" (code only, for FinHeader); or up to two lines (code only, for FinSideSheet). */
  truncate: {
    none: 'fin:wrap-break-word',
    one: 'fin:wrap-break-word fin:truncate fin:w-full',
    two: 'fin:wrap-break-word fin:line-clamp-2',
  },
};

export const description = {
  /* Type: Body/Large for H1–H2, Body/Medium for H3–H6. Always wraps. */
  type: {
    h1: 'fin:font-body-large fin:wrap-break-word',
    h2: 'fin:font-body-large fin:wrap-break-word',
    h3: 'fin:font-body-medium fin:wrap-break-word',
    h4: 'fin:font-body-medium fin:wrap-break-word',
    h5: 'fin:font-body-medium fin:wrap-break-word',
    h6: 'fin:font-body-medium fin:wrap-break-word',
  } satisfies Record<FinTextBoxType, string>,
  colour: {
    default: 'fin:text-secondary',
    inverse: 'fin:text-inverse',
    disabled: 'fin:text-disabled',
  } satisfies Record<FinTextBoxColour, string>,
};
