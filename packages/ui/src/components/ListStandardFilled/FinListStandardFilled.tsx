'use client';

import { ListStandardRow, type FinListStandardBehavior, type FinListStandardProps } from '../ListStandard/FinListStandard';

export interface FinListStandardFilledProps extends Omit<FinListStandardProps, 'behavior' | 'chevron'> {
  /** What the card does: it's always clickable (a link, a button or an option). Default `link`. */
  behavior?: Exclude<FinListStandardBehavior, 'static'>;
}

/**
 * The filled (card) version of FinListStandard (DESIGN.md §9): the same row on List_fill-base, a white card (1px
 * `border-subtle`, radius L, padding 16), 12 from the next. **Always clickable, so the chevron is always shown**, with
 * or without the caption (decided 20 Oct 2026). Hover `bg-secondary`; Selected a 1px `border-active` edge, no fill;
 * Disabled a `border-disabled` edge. Code first (no Figma yet, §10 #56). **Public:** Components/List.
 */
export function FinListStandardFilled({ behavior = 'link', ...props }: FinListStandardFilledProps) {
  return <ListStandardRow {...props} behavior={behavior} chevron filled />;
}
