'use client';

import { FinListCheckboxRow, type FinListCheckboxProps } from '../ListCheckbox/FinListCheckbox';

export type FinListCheckboxFilledProps = FinListCheckboxProps;

/**
 * The filled (card) version of FinListCheckbox (DESIGN.md §9): the same row, behaviour and props on List_fill-base: a white card
 * (1px `border-subtle`, radius L, padding 16), 12 from the next; checked is a 1px `border-active` edge, no fill; hover `bg-secondary`; Disabled a
 * `border-disabled` edge. Code first (no Figma yet, §10 #56). **Public:** Components/List.
 */
export function FinListCheckboxFilled(props: FinListCheckboxFilledProps) {
  return <FinListCheckboxRow {...props} filled />;
}
