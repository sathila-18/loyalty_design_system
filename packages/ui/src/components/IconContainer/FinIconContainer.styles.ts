/* FinIconContainer classes (DESIGN.md §9, §3.11). The icon is FinIcon; these only style the circle. */
import type { FinIconContainerSize, FinIconContainerTone } from './FinIconContainer';

export const container = 'fin:inline-flex fin:flex-none fin:items-center fin:justify-center fin:rounded-full';

export const size: Record<FinIconContainerSize, string> = {
  40: 'fin:size-40',
  48: 'fin:size-48',
  64: 'fin:size-64',
};

export const tone: Record<FinIconContainerTone, string> = {
  primary: 'fin:bg-icons',
  secondary: 'fin:bg-secondary',
  disabled: 'fin:bg-disabled',
  success: 'fin:bg-success-secondary',
  warning: 'fin:bg-warning-secondary',
  error: 'fin:bg-error-secondary',
  info: 'fin:bg-info-secondary',
};
