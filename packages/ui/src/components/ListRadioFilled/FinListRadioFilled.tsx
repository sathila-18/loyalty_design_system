'use client';

import { FinListRadioRow, type FinListRadioProps } from '../ListRadio/FinListRadio';

export type FinListRadioFilledProps = Omit<FinListRadioProps, 'divider'>;

/**
 * The filled (card) version of FinListRadio (DESIGN.md §9): the same row, behaviour and props on List_fill-base: a white card
 * (1px `border-subtle`, radius L, padding 16), 12 from the next; checked is a 1px `border-active` edge, no fill; hover `bg-secondary`; Disabled a
 * `border-disabled` edge. Code first (no Figma yet, §10 #56). **Public:** Components/List.
 */
export function FinListRadioFilled(props: FinListRadioFilledProps) {
  return <FinListRadioRow {...props} filled />;
}
