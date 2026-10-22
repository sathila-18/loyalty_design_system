'use client';

import { useId, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import type { FinListItemProps, FinListItemSize } from '../ListItem';
import { ListStandardRow } from '../ListStandard/FinListStandard';
import { FinToggle } from '../Toggle';

/** Figma `Leading accessory`. */
export type FinListToggleLeading = 'none' | 'icon';

export interface FinListToggleProps extends Pick<FinListItemProps, 'as'> {
  /** The title (also the toggle's name for screen readers). */
  title: ReactNode;
  /** Figma `Description`. Without it the row is centred. */
  description?: ReactNode;
  /** Figma `Leading accessory`. Default none. */
  leadingAccessory?: FinListToggleLeading;
  /** Icon accessory: the 24 icon (`fg-primary`; Disabled `fg-disabled`). Default `person` (Figma's placeholder). */
  icon?: FinIconName;
  /** Any other leading content (for future scenarios), in place of the icon. */
  leading?: ReactNode;
  /** Figma `State=Selected`: the toggle is on (controlled). */
  checked?: boolean;
  /** Uncontrolled: on at the start. */
  defaultChecked?: boolean;
  /** Called with the new value when the row or toggle is clicked. */
  onCheckedChange?: (checked: boolean) => void;
  /** Figma `State=Disabled`. */
  disabled?: boolean;
  /** Size (List-base). Default large. */
  size?: FinListItemSize;
  /** The toggle's `name` (form posting). */
  name?: string;
  /** Figma `Show divider` (List-base): the line under the row. Default on; the last of several rows never has one. */
  divider?: boolean;
  className?: string;
}

/** The row behind FinListToggle and FinListToggleFilled (internal; FinListToggleFilled is in ../ListToggleFilled). */
export function FinListToggleRow({
  filled = false,
  title,
  description,
  leadingAccessory = 'none',
  icon = 'person',
  leading,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  size = 'large',
  divider,
  name,
  as,
  className,
}: FinListToggleProps & { filled?: boolean }) {
  const id = useId();
  const hasDescription = description !== undefined && description !== null;

  let leadingNode: ReactNode = leading;
  if (leadingNode === undefined && leadingAccessory === 'icon')
    leadingNode = <FinIcon name={icon} size={24} color={disabled ? 'disabled' : 'primary'} />;

  return (
    <ListStandardRow
      filled={filled}
      {...(as ? { as } : {})}
      className={className}
      size={size}
      {...(filled ? {} : { divider })}
      title={title}
      titleId={`${id}-title`}
      descriptionId={`${id}-description`}
      labelFor={`${id}-toggle`}
      disabled={disabled}
      {...(leadingNode !== undefined ? { leading: leadingNode } : {})}
      {...(hasDescription ? { description } : {})}
      trailing={
        <FinToggle
          id={`${id}-toggle`}
          label=""
          size="small"
          focusRing={false}
          name={name}
          disabled={disabled}
          {...(checked !== undefined ? { checked } : {})}
          {...(defaultChecked !== undefined ? { defaultChecked } : {})}
          {...(checked !== undefined && !onCheckedChange ? { readOnly: true } : {})}
          onChange={(event) => onCheckedChange?.(event.target.checked)}
          aria-labelledby={`${id}-title`}
          {...(hasDescription ? { 'aria-describedby': `${id}-description` } : {})}
        />
      }
    />
  );
}


/**
 * A settings row with a toggle (Figma List-toggle; DESIGN.md §9), on List-standard: an optional leading icon, the title
 * and description, and FinToggle (small, 40 × 24) on the right. The whole row is the toggle's label: clicking anywhere
 * switches it; the focus ring goes around the row. Unlike the radio and checkbox lists, **on has no Selected fill**
 * (as Figma): the row only shows the grey hover. Each row is its own setting (no group). **Public:** Components/List.
 */
export function FinListToggle(props: FinListToggleProps) {
  return <FinListToggleRow {...props} />;
}
