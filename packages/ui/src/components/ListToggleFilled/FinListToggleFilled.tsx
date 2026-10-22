'use client';

import { FinListToggleRow, type FinListToggleProps } from '../ListToggle/FinListToggle';

export type FinListToggleFilledProps = Omit<FinListToggleProps, 'divider'>;

/**
 * The filled (card) version of FinListToggle (DESIGN.md §9): the same row, behaviour and props on List_fill-base: a white card
 * (1px `border-subtle`, radius L, padding 16), 12 from the next; on has no edge or fill (as the plain toggle); hover `bg-secondary`; Disabled a
 * `border-disabled` edge. Code first (no Figma yet, §10 #56). **Public:** Components/List.
 */
export function FinListToggleFilled(props: FinListToggleFilledProps) {
  return <FinListToggleRow {...props} filled />;
}
