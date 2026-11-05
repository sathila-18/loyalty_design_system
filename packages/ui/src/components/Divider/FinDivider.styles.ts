/*
 * FinDivider classes (DESIGN.md §9, §3.11). A native <hr>, so the browser's own margins and inset border are cleared.
 * The 1px line is a named utility in tailwind.css (divider-line-h / -v): a hairline border, not a size, whose colour a
 * parent in a state can set through --divider-color (a Disabled list row uses border-disabled).
 */
import type { FinDividerOrientation, FinDividerType } from './FinDivider';

export const divider = 'fin:flex-none fin:self-stretch fin:m-none';

export const look: Record<FinDividerType, Record<FinDividerOrientation, string>> = {
  divider: { horizontal: 'fin:divider-line-h', vertical: 'fin:divider-line-v' },
  // An 8px band between sections.
  'section-divider': {
    horizontal: 'fin:border-none fin:border-current fin:bg-border-default fin:h-8',
    vertical: 'fin:border-none fin:border-current fin:bg-border-default fin:w-8',
  },
};
