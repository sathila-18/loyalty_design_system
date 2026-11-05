/*
 * FinOnlineIndicator classes (DESIGN.md §9, §3.11). The Figma stroke is a 1px ring of fg-inverse outside the dot, so it
 * stands apart from what it sits on.
 */
import type { FinOnlineIndicatorSize } from './FinOnlineIndicator';

export const indicator = 'fin:inline-block fin:flex-none fin:rounded-full fin:bg-fg-success fin:ring fin:ring-fg-inverse';

export const size: Record<FinOnlineIndicatorSize, string> = {
  xsmall: 'fin:size-6',
  small: 'fin:size-8',
  medium: 'fin:size-12',
  large: 'fin:size-16',
  xlarge: 'fin:size-24',
};
