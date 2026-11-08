/*
 * FinTextArea classes (DESIGN.md §9.78, §3.11). The single-line field's look and states (FinInputBase, §9.58) for
 * several lines: the box (radius M, 1px border) with Space-XL padding all round, the value Body/Large text-primary,
 * caret fg-brand; the label on the top border, the ring and halo when focused, Complete border-strong, Disabled,
 * Error. `rows` lines tall, growing to `maxRows` and then scrolling (textarea-rows in tailwind.css reads the
 * --text-area-rows / --text-area-max-rows set from TSX). The states are the field-* variants in tailwind.css, with the
 * same markers as FinInputBase.
 */

export const root = 'fin:group/field-root fin:flex fin:flex-col fin:gap-m fin:w-full fin:min-w-0';

/* Hovered: only an empty field that isn't focused. */
export const field = 'fin:group/field-box fin:relative fin:flex fin:rounded-m fin:field-hover:bg-secondary';

export const content = 'fin:group/field-content fin:flex fin:flex-1 fin:min-w-0 fin:p-xl';

/*
 * The textarea: no native look, no resize handle. Its placeholder text-placeholder (disabled: text-disabled); focused,
 * the label takes over from the placeholder, unless the label is hidden.
 */
const textareaBase =
  'fin:peer/field-value fin:flex-1 fin:box-content fin:min-w-0 fin:textarea-rows fin:m-none fin:p-none fin:overflow-y-auto ' +
  'fin:border-none fin:border-current fin:outline-none fin:bg-transparent fin:text-primary fin:font-body-large fin:caret-fg-brand ' +
  'fin:resize-none fin:disabled:text-disabled fin:placeholder:text-placeholder fin:placeholder:opacity-100 ' +
  'fin:disabled:placeholder:text-disabled';

export const textarea = {
  labelShown: `${textareaBase} fin:focus:placeholder:text-transparent`,
  labelHidden: textareaBase,
};

/* Border, ring and halo: fieldsets laid over the box, each cut by the label's notch (field-*-box in tailwind.css). */
const frame = 'fin:absolute fin:min-w-0 fin:m-none fin:pointer-events-none';

export const outline =
  `${frame} fin:field-outline-box fin:border fin:border-default fin:group-data-error/field-root:border-error ` +
  'fin:field-complete:border-strong fin:group-data-disabled/field-root:border-disabled';

export const ring =
  `${frame} fin:field-ring-box fin:border-2 fin:border-focused fin:group-data-error/field-root:border-error ` +
  'fin:hidden fin:field-focused:block';

export const halo =
  `${frame} fin:field-halo-box fin:border-2 fin:border-bg-active fin:group-data-error/field-root:border-bg-error-secondary ` +
  'fin:hidden fin:field-focused:block';

export const notch =
  'fin:block fin:float-none fin:max-w-0 fin:h-0 fin:p-none fin:overflow-hidden fin:font-label-small fin:whitespace-nowrap ' +
  'fin:invisible fin:field-filled:max-w-full fin:field-focused:max-w-full';

export const notchText = 'fin:px-xs';

export const label =
  'fin:absolute fin:top-none fin:left-xl fin:field-label-place fin:px-xs fin:truncate fin:text-tertiary ' +
  'fin:group-data-disabled/field-root:text-disabled fin:font-label-small fin:opacity-0 fin:pointer-events-none ' +
  'fin:field-filled:opacity-100 fin:field-focused:opacity-100';

export const hiddenLabel = 'fin:sr-only';

export const helper = 'fin:px-xl';
