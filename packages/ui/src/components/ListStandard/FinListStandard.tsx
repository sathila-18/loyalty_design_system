'use client';

import { useId, type ElementType, type MouseEvent, type ReactNode } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import type { FinIconName } from '../../icons/finIcons';
import { FinFlag, type FinFlagCountry } from '../../flags';
import { FinPaymentIcon, type FinPaymentMethod } from '../../payment';
import { FinAvatar, type FinAvatarProps } from '../Avatar';
import { FinCaption } from '../Caption';
import { FinListItem, type FinListItemProps } from '../ListItem';
import styles from './FinListStandard.module.css';

/** Figma `Leading accessory`. */
export type FinListStandardLeading = 'none' | 'icon' | 'flag' | 'payment' | 'avatar';

/**
 * What the row does, per scenario: `static` shows data; `link` goes somewhere (`href`); `button` runs `onClick`;
 * `option` is a choice in a list box or menu (`role="option"`, Selected is "chosen").
 */
export type FinListStandardBehavior = 'static' | 'link' | 'button' | 'option';

export interface FinListStandardProps
  extends Pick<FinListItemProps, 'as' | 'size' | 'className' | 'id' | 'style'> {
  /** The title (Headline Small-H6, Small: Label/Medium). */
  title: ReactNode;
  /** Figma `Description`: the line under the title. Without it the row is centred. */
  description?: ReactNode;
  /** Figma `Leading accessory`. Default none. */
  leadingAccessory?: FinListStandardLeading;
  /** Icon accessory: the 24 icon (`fg-primary`). Default `person` (Figma's placeholder). */
  icon?: FinIconName;
  /** Flag accessory: the country (FinFlag medium, 32 × 24). */
  country?: FinFlagCountry;
  /** Payment accessory: the payment method (FinPaymentIcon medium, 38 × 24). Default the default card. */
  paymentMethod?: FinPaymentMethod;
  /** Avatar accessory: the 40 avatar's photo, initials and name. */
  avatar?: Pick<FinAvatarProps, 'src' | 'initials' | 'label'>;
  /** Any other leading content, in place of the accessory above. */
  leading?: ReactNode;
  /** Figma `Trailing accessory=Caption`: the caption text (Caption Small, Heavy). */
  caption?: string;
  /** Figma `Chevron`: the right arrow. Default off. */
  chevron?: boolean;
  /** Figma `State=Selected` (`bg-active`; `bg-active-hover` when hovered). Default false. */
  selected?: boolean;
  /** Figma `State=Disabled`: greyed, not interactive. Default false. */
  disabled?: boolean;
  /** What the row does (see FinListStandardBehavior). Default `static`. */
  behavior?: FinListStandardBehavior;
  /** Link: where it goes. */
  href?: string;
  /** Link: a router's link component (React Router `Link`, `next/link`). Default `a`. */
  linkAs?: ElementType;
  /** Link, button or option: called on click. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

/**
 * A standard list row (Figma List-standard; DESIGN.md §9), built on FinListItem: an optional leading accessory, the
 * title and description, and an optional caption and chevron. Hovered `bg-secondary` (interactive rows only),
 * Selected `bg-active`, Selected + hovered `bg-active-hover`, Disabled greyed with a `border-disabled` line; no pressed
 * look; the standard focus ring inside the row. A link or button row is one big target (the title's link or button
 * covers the row), so the row keeps its list semantics (`as="li"`). **Public:** Components/List.
 */
export function FinListStandard({
  title,
  description,
  leadingAccessory = 'none',
  icon = 'person',
  country,
  paymentMethod = 'default',
  avatar,
  leading,
  caption,
  chevron = false,
  selected = false,
  disabled = false,
  behavior = 'static',
  href,
  linkAs: Link = 'a',
  onClick,
  className,
  ...rest
}: FinListStandardProps) {
  const descriptionId = useId();
  const interactive = behavior !== 'static' && !disabled;

  let leadingNode: ReactNode = leading;
  if (leadingNode === undefined && leadingAccessory === 'icon')
    leadingNode = <FinIcon name={icon} size={24} color={disabled ? 'disabled' : 'primary'} />;
  if (leadingNode === undefined && leadingAccessory === 'flag' && country)
    leadingNode = <FinFlag country={country} size="medium" disabled={disabled} decorative />;
  if (leadingNode === undefined && leadingAccessory === 'payment')
    leadingNode = <FinPaymentIcon method={paymentMethod} size="medium" disabled={disabled} />;
  if (leadingNode === undefined && leadingAccessory === 'avatar') leadingNode = <FinAvatar size="medium" {...avatar} />;

  const describedBy = description !== undefined && description !== null ? descriptionId : undefined;
  let titleNode: ReactNode = <span className={styles.title}>{title}</span>;
  if (behavior === 'link')
    titleNode = (
      <Link
        className={`${styles.title} ${styles.action}`}
        {...(disabled ? { 'aria-disabled': true } : { href, onClick })}
        aria-current={selected ? 'page' : undefined}
        aria-describedby={describedBy}
      >
        {title}
      </Link>
    );
  if (behavior === 'button')
    titleNode = (
      <button type="button" className={`${styles.title} ${styles.action}`} disabled={disabled} onClick={onClick} aria-describedby={describedBy}>
        {title}
      </button>
    );

  const hasTrailing = caption !== undefined || chevron;

  return (
    <FinListItem
      {...rest}
      className={className ? `${styles.row} ${className}` : styles.row}
      data-selected={selected ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-interactive={interactive ? '' : undefined}
      {...(behavior === 'option'
        ? { role: 'option', 'aria-selected': selected, 'aria-disabled': disabled || undefined, ...(disabled ? {} : { onClick }) }
        : {})}
      leadingAccessory={leadingNode !== undefined}
      leading={leadingNode}
      title={titleNode}
      trailingAccessory={hasTrailing}
      trailing={
        <span className={styles.trailing}>
          {caption !== undefined && (
            <FinCaption size="small" thickness="heavy" className={styles.caption}>
              {caption}
            </FinCaption>
          )}
          {chevron && <FinIcon name="keyboard_arrow_right" size={24} color={disabled ? 'disabled' : 'secondary'} />}
        </span>
      }
    >
      {describedBy && (
        <p id={descriptionId} className={styles.description}>
          {description}
        </p>
      )}
    </FinListItem>
  );
}
