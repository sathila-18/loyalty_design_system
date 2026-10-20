'use client';

import { createContext, useContext, useId, type HTMLAttributes, type ReactNode } from 'react';
import { FinFlag, type FinFlagCountry } from '../../flags';
import { FinPaymentIcon, type FinPaymentMethod } from '../../payment';
import type { FinListItemSize } from '../ListItem';
import { ListStandardRow } from '../ListStandard/FinListStandard';
import { FinRadio } from '../Radio';
import styles from './FinListRadio.module.css';

/** Figma `Type`: what sits beside the title (Default: nothing). */
export type FinListRadioType = 'default' | 'country' | 'payment';

/** Figma `Item side`: the item next to the radio (`leading`) or at the far right (`trailing`). */
export type FinListRadioItemSide = 'leading' | 'trailing';

interface GroupContext {
  name: string;
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  disabled: boolean;
  size: FinListItemSize;
}

const RadioGroupContext = createContext<GroupContext | null>(null);

export interface FinListRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The group's name for screen readers ("Country"). */
  label: string;
  /** The chosen row's `value` (controlled). */
  value?: string;
  /** Called with the row's `value` when a row is chosen. */
  onValueChange?: (value: string) => void;
  /** The radios' shared `name` (form posting). Default generated. */
  name?: string;
  /** Disables every row. */
  disabled?: boolean;
  /** Size for every row (List-base). Default large. */
  size?: FinListItemSize;
  /** The rows: FinListRadio. */
  children: ReactNode;
}

/**
 * A list of radio rows (DESIGN.md §9): a `radiogroup` named by `label`, sharing the radios' `name`, the chosen `value`
 * and `size`. Native radios, so Tab enters and leaves the group and the arrow keys move the choice. The last row has no
 * line (FinListItem rule). **Public:** Components/List.
 */
export function FinListRadioGroup({
  label,
  value,
  onValueChange,
  name,
  disabled = false,
  size = 'large',
  children,
  ...rest
}: FinListRadioGroupProps) {
  const generatedName = useId();
  return (
    <div {...rest} role="radiogroup" aria-label={label} aria-disabled={disabled || undefined}>
      <RadioGroupContext.Provider value={{ name: name ?? generatedName, value, onValueChange, disabled, size }}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}

export interface FinListRadioProps {
  /** The row's value in its group. */
  value: string;
  /** The title (also the radio's name for screen readers). */
  title: ReactNode;
  /** Figma `Description`. Without it the row is centred. */
  description?: ReactNode;
  /** Figma `Type`. Default `default`. */
  type?: FinListRadioType;
  /** Figma `Item side` for the Country or Payment item. Default `leading`. */
  itemSide?: FinListRadioItemSide;
  /** Country type: the flag (FinFlag medium, 32 × 24). */
  country?: FinFlagCountry;
  /** Payment type: the logo (FinPaymentIcon medium, 38 × 24). Default the default card. */
  paymentMethod?: FinPaymentMethod;
  /** Any other item (for example an avatar), in place of the country or payment item, on `itemSide`. */
  item?: ReactNode;
  /** Figma `State=Disabled`. */
  disabled?: boolean;
  /** Size (List-base). Default the group's. */
  size?: FinListItemSize;
  /** Outside a group: whether it's chosen. */
  checked?: boolean;
  /** Outside a group: the radio's `name`. */
  name?: string;
  /** Outside a group: called when chosen. */
  onChange?: () => void;
  className?: string;
}

/** The row behind FinListRadio and FinListRadioFilled (internal; FinListRadioFilled is in ../ListRadioFilled). */
export function FinListRadioRow({
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
  name: nameProp,
  onChange,
  className,
}: FinListRadioProps & { filled?: boolean }) {
  const group = useContext(RadioGroupContext);
  const id = useId();
  const disabled = disabledProp || (group?.disabled ?? false);
  const checked = group ? group.value === value : (checkedProp ?? false);
  const size = sizeProp ?? group?.size ?? 'large';

  let itemNode: ReactNode = item;
  if (itemNode === undefined && type === 'country' && country)
    itemNode = <FinFlag country={country} size="medium" disabled={disabled} decorative />;
  if (itemNode === undefined && type === 'payment')
    itemNode = <FinPaymentIcon method={paymentMethod} size="medium" disabled={disabled} decorative />;

  const radio = (
    <FinRadio
      id={`${id}-radio`}
      label=""
      focusRing={false}
      name={group?.name ?? nameProp}
      value={value}
      checked={checked}
      disabled={disabled}
      onChange={() => (group ? group.onValueChange?.(value) : onChange?.())}
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
      labelFor={`${id}-radio`}
      selected={checked}
      disabled={disabled}
      leading={
        <span className={styles.leading}>
          {radio}
          {itemSide === 'leading' && itemNode}
        </span>
      }
      {...(itemSide === 'trailing' && itemNode !== undefined ? { trailing: itemNode } : {})}
      {...(description !== undefined && description !== null ? { description } : {})}
    />
  );
}

/**
 * A radio list row (Figma List-radio_button; DESIGN.md §9), on List-standard: the radio on the left, then an optional
 * flag or payment logo (next to the radio or at the far right), the title and description. The whole row is the
 * radio's label: clicking anywhere chooses it; Selected (`bg-active`) when chosen; the focus ring goes around the row.
 * Use inside FinListRadioGroup. **Public:** Components/List.
 */
export function FinListRadio(props: FinListRadioProps) {
  return <FinListRadioRow {...props} />;
}
