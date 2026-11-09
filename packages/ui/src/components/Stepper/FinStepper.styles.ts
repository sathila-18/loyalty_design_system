/*
 * FinStepper classes (DESIGN.md §9, §3.11; code first, measured from the Add reward screens, Figma `367:19964`,
 * `402:33879`). Each step is a column Space-10XL wide (as the screens' step frames), the box centred, the label
 * centred Space-M below it and wrapping inside the column; columns are Space-10XL apart, so box centres are 160 apart
 * as on the screens. Centred labels (decided by design 27 Oct 2026; the screens align them left) put the first box 22
 * in from the edge. The box: Size-36, Radius-S, a 2px border, Title/Medium. A 2px line joins each box to the next,
 * coloured by the step it leaves (stepper-* in tailwind.css for the widths and the line's geometry).
 *   current:  bg-active, border-active, text-action; its line border-active
 *   upcoming: bg-secondary, border-default, text-secondary; its line border-default
 *   done:     bg-success-secondary, border-success, a check in fg-success (decided by design 27 Oct 2026; the screens
 *             draw done steps black), the label text-primary; its line border-success
 */

type FinStepperWidth = 'hug' | 'fill';

export type FinStepState = 'current' | 'upcoming' | 'done';

const list = 'fin:flex fin:m-none fin:p-none fin:list-none';

/*
 * width="fill" (code only, decided 28 Oct 2026): the steps but the last share the width left after the last column,
 * so the boxes spread from edge to edge. Each column stays Space-10XL wide at the start of its step; the line runs
 * from this box to the next one, the step's width less a box.
 */
export const stepper: Record<FinStepperWidth, string> = {
  hug: `${list} fin:gap-10xl`,
  fill: `${list} fin:gap-none fin:w-full`,
};

/* A step: hug, or in a fill stepper growing (all but the last) or the last. */
export const step = {
  hug: 'fin:relative fin:flex-none fin:stepper-step-w',
  fillGrow: 'fin:relative fin:flex-share fin:stepper-step-min-w fin:stepper-step-w fin:stepper-fill-step',
  fillLast: 'fin:relative fin:flex-none fin:stepper-step-w fin:stepper-fill-step',
};

/* The line to the next step (none after the last), coloured by the step it leaves. */
export const line: Record<FinStepperWidth, Record<FinStepState, string>> = {
  hug: {
    current: 'fin:stepper-line fin:after:bg-border-active',
    upcoming: 'fin:stepper-line fin:after:bg-border-default',
    done: 'fin:stepper-line fin:after:bg-border-success',
  },
  fill: {
    current: 'fin:stepper-line-fill fin:after:bg-border-active',
    upcoming: 'fin:stepper-line-fill fin:after:bg-border-default',
    done: 'fin:stepper-line-fill fin:after:bg-border-success',
  },
};

const marker = 'fin:flex fin:flex-col fin:gap-m fin:items-center fin:stepper-content-w';

export const content = marker;

/* A done step with onStepClick: a button; the focus ring goes round the box. */
export const button =
  `${marker} fin:group/step fin:m-none fin:p-none fin:border-none fin:border-current fin:rounded-s fin:bg-transparent ` +
  'fin:text-inherit fin:font-inherit fin:cursor-pointer fin:focus-visible:outline-none';

const boxBase =
  'fin:flex fin:box-border fin:items-center fin:justify-center fin:size-36 fin:border-2 fin:rounded-s fin:font-title-medium ' +
  'fin:group-focus-visible/step:outline-2 fin:group-focus-visible/step:outline-offset-2 fin:group-focus-visible/step:outline-focused';

export const box: Record<FinStepState, string> = {
  current: `${boxBase} fin:border-active fin:bg-active fin:text-action`,
  upcoming: `${boxBase} fin:border-default fin:bg-secondary fin:text-secondary`,
  done: `${boxBase} fin:border-success fin:bg-success-secondary fin:text-secondary`,
};

/* Centred under the box; a long label wraps inside the column. */
const labelBase = 'fin:w-full fin:font-label-medium fin:text-center fin:wrap-break-word';

export const label: Record<FinStepState, string> = {
  current: `${labelBase} fin:text-action`,
  upcoming: `${labelBase} fin:text-secondary`,
  done: `${labelBase} fin:text-primary`,
};

export const hidden = 'fin:sr-only';
