import { FinIcon, type FinIconProps } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';

export interface FinSideNavIconProps extends Omit<FinIconProps, 'name' | 'size' | 'color' | 'filled'> {
  /** The item's icon (Figma's placeholder is `perm_identity`, `person` in the registry). */
  name: FinIconName;
  /** Figma `Type=Selected`: filled, `fg-active`. Unselected is outlined, `fg-secondary`. Default false. */
  selected?: boolean;
}

/**
 * The 24 icon in front of a side nav item (Figma Icon, was `24px`; DESIGN.md §9). Unselected: outlined,
 * `fg-secondary` (Figma raw `#626262`). Selected: filled, `fg-active` (Figma raw `#5953E8`). Decorative, as the
 * item's label names it. No markup or CSS of its own: FinIcon with fixed size, color and fill.
 * **Internal:** part of the side nav.
 */
export function FinSideNavIcon({ name, selected = false, ...rest }: FinSideNavIconProps) {
  return <FinIcon {...rest} name={name} size={24} color={selected ? 'active' : 'secondary'} filled={selected} />;
}
