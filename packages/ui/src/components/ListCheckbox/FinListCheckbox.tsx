'use client';

import { createContext, useContext, useId, type HTMLAttributes, type ReactNode } from 'react';
import { FinFlag, type FinFlagCountry } from '../../flags';
import { FinPaymentIcon, type FinPaymentMethod } from '../../payment';
import { FinCheckboxBase } from '../CheckboxBase';
import type { FinListItemSize } from '../ListItem';
import type { FinListRadioItemSide, FinListRadioType } from '../ListRadio';
import { ListStandardRow } from '../ListStandard/FinListStandard';
import styles from './FinListCheckbox.module.css';

/** As the radio list's `Type`: what sits beside the title. */
export type FinListCheckboxType = FinListRadioType;

/** As the radio list's `Item side`. */
export type FinListCheckboxItemSide = FinListRadioItemSide;

interface GroupContext {
  name: string | undefined;
  value: string[];
  onValueChange: ((value: string[]) => void) | undefined;
  disabled: boolean;
  size: FinListItemSize;
}

const CheckboxGroupContext = createContext<GroupContext | null>(null);

export interface FinListCheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The group's name for screen readers ("Notifications"). */
  label: string;
  /** The ticked rows' values (controlled). */
  value?: string[];
  /** Called with the new list of ticked values. */
  onValueChange?: (value: string[]) => void;
  /** The checkboxes' shared `name` (form posting). */
  name?: string;
  /** Disables every row. */
  disabled?: boolean;
  /** Size for every row (List-base). Default large. */
  size?: FinListItemSize;
  /** The rows: FinListCheckbox. */
  children: ReactNode;
}

/**
 * A list of checkbox rows (DESIGN.md §9): a `group` named by `label`, sharing the ticked `value`s and `size`. Native
 * checkboxes, so each is its own Tab stop and Space ticks it. The last row has no line and 16 of bottom padding
 * (FinListItem rule). Code first: no Figma component yet (§10 #55). **Public:** Components/List.
 */
export function FinListCheckboxGroup({
  label,
  value = [],
  onValueChange,
  name,
  disabled = false,
  size = 'large',
  children,
  ...rest
}: FinListCheckboxGroupProps) {
  return (
    <div {...rest} role="group" aria-label={label} aria-disabled={disabled || undefined}>
      <CheckboxGroupContext.Provider value={{ name, value, onValueChange, disabled, size }}>{children}</CheckboxGroupContext.Provider>
    </div>
  );
}

export interface FinListCheckboxProps {
  /** The row's value in its group. */
  value: string;
  /** The title (also the checkbox's name for screen readers). */
  title: ReactNode;
  /** The line under the title. Without it the row is centred. */
  description?: ReactNode;
  /** As the radio list's `Type`. Default `default`. */
  type?: FinListCheckboxType;
  /** As the radio list's `Item side`. Default `leading`. */
  itemSide?: FinListCheckboxItemSide;
  /** Country type: the flag (FinFlag medium, 32 × 24). */
  country?: FinFlagCountry;
  /** Payment type: the logo (FinPaymentIcon medium, 38 × 24). Default the default card. */
  paymentMethod?: FinPaymentMethod;
  /** Any other item (for example an avatar), in place of the country or payment item, on `itemSide`. */
  item?: ReactNode;
  /** Not interactive; greyed (as List-standard). */
  disabled?: boolean;
  /** Size (List-base). Default the group's. */
  size?: FinListItemSize;
  /** Outside a group: whether it's ticked. */
  checked?: boolean;
  /** Outside a group: called with the new value. */
  onCheckedChange?: (checked: boolean) => void;
  /** Some (not all) of what this row stands for is ticked: the dash, announced as mixed (for a "select all" row). */
  indeterminate?: boolean;
  className?: string;
}

/** The row behind FinListCheckbox and FinListCheckboxFilled (internal; FinListCheckboxFilled is in ../ListCheckboxFilled). */
export function FinListCheckboxRow({
  filled = false,
  value,
  title,
  description,
  type = 'default',
  itemSide = 'leading',
  country,
  paymentMethod = 'default',
  item,
  disabled: disabledProp = false,
  size: sizeProp,
  checked: checkedProp,
  onCheckedChange,
  indeterminate = false,
  className,
}: FinListCheckboxProps & { filled?: boolean }) {
  const group = useContext(CheckboxGroupContext);
  const id = useId();
  const disabled = disabledProp || (group?.disabled ?? false);
  const checked = group ? group.value.includes(value) : (checkedProp ?? false);
  const size = sizeProp ?? group?.size ?? 'large';

  let itemNode: ReactNode = item;
  if (itemNode === undefined && type === 'country' && country)
    itemNode = <FinFlag country={country} size="medium" disabled={disabled} decorative />;
  if (itemNode === undefined && type === 'payment')
    itemNode = <FinPaymentIcon method={paymentMethod} size="medium" disabled={disabled} decorative />;

  const toggle = (on: boolean) => {
    if (!group) return onCheckedChange?.(on);
    group.onValueChange?.(on ? [...group.value.filter((v) => v !== value), value] : group.value.filter((v) => v !== value));
  };

  const checkbox = (
    <FinCheckboxBase
      id={`${id}-checkbox`}
      focusRing={false}
      name={group?.name}
      value={value}
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      onChange={(event) => toggle(event.target.checked)}
      aria-labelledby={`${id}-title`}
      {...(description !== undefined && description !== null ? { 'aria-describedby': `${id}-description` } : {})}
    />
  );

  return (
    <ListStandardRow
      filled={filled}
      className={className}
      size={size}
      title={title}
      titleId={`${id}-title`}
      descriptionId={`${id}-description`}
      labelFor={`${id}-checkbox`}
      selected={checked}
      disabled={disabled}
      leading={
        <span className={styles.leading}>
          {checkbox}
          {itemSide === 'leading' && itemNode}
        </span>
      }
      {...(itemSide === 'trailing' && itemNode !== undefined ? { trailing: itemNode } : {})}
      {...(description !== undefined && description !== null ? { description } : {})}
    />
  );
}

/**
 * A checkbox list row (DESIGN.md §9), the radio list's twin on List-standard: the checkbox on the left, then an
 * optional flag or payment logo (next to it or at the far right), the title and description. The whole row is the
 * checkbox's label: clicking anywhere ticks it; Selected (`bg-active`) when ticked; the focus ring goes around the row.
 * Use inside FinListCheckboxGroup. Code first (§10 #55). **Public:** Components/List.
 */
export function FinListCheckbox(props: FinListCheckboxProps) {
  return <FinListCheckboxRow {...props} />;
}
