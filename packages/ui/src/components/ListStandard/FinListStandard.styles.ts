/*
 * FinListStandard classes (DESIGN.md §9, §3.11). Figma List-standard on List-base (FinListItem): Hovered bg-secondary
 * (interactive rows only), Selected bg-active, Selected+hovered bg-active-hover; Disabled: title and caption
 * text-disabled-on_bg, description text-disabled, icon and chevron fg-disabled, line border-disabled. No pressed look;
 * the standard focus ring inside the row (decided 20 Oct 2026). Caption and chevron 6 (Space-S) apart. Description
 * Body/Medium (Small: Body/Small) text-secondary.
 */
import type { FinListItemSize } from '../ListItem';

export type FinListRowFill = 'none' | 'hover' | 'selected' | 'selectedHover';

/*
 * The row (FinListItem's or FinListItemFilled's root). Plain rows: the fills above, a pointer on interactive rows.
 * Filled cards (List_fill-base, decided 20 Oct 2026): Selected is a 1px border-active edge with no fill (hover still
 * bg-secondary on interactive cards); Disabled cards have a border-disabled edge (and no Selected edge). The card's
 * own fill and edge are FinListItemFilled's, so these replace them with `placement:` (both in @layer fin).
 */
const rowBase = 'fin:relative';

export const row: Record<'plain' | 'filled', Record<FinListRowFill, string>> = {
  plain: {
    none: rowBase,
    hover: `${rowBase} fin:cursor-pointer fin:hover:bg-secondary`,
    selected: `${rowBase} fin:bg-active`,
    selectedHover: `${rowBase} fin:cursor-pointer fin:bg-active fin:hover:bg-active-hover`,
  },
  filled: {
    none: rowBase,
    hover: `${rowBase} fin:cursor-pointer fin:placement:hover:bg-secondary`,
    selected: `${rowBase} fin:placement:inset-ring-active`,
    selectedHover: `${rowBase} fin:cursor-pointer fin:placement:inset-ring-active fin:placement:hover:bg-secondary`,
  },
};

/* Disabled: the line under the row is border-disabled (FinDivider reads --divider-color); a card's edge too. */
export const disabledRow = {
  plain: 'fin:divider-color-disabled',
  filled: 'fin:divider-color-disabled fin:placement:inset-ring-disabled',
};

/*
 * An option (in a list box or select menu) takes focus itself (the menu moves it with the arrow keys): the ring with
 * the keyboard, no outline otherwise. Not `focus:outline-none` (it would hide the ring; see FinAppShell's main).
 */
export const option =
  'fin:focus:not-focus-visible:outline-none fin:focus-visible:outline-2 fin:focus-visible:-outline-offset-2 fin:focus-visible:outline-focused';

/* A control row (labelFor): the control has focus, so the row draws the ring (the control's own is off). */
export const control =
  'fin:has-focus-visible:outline-2 fin:has-focus-visible:-outline-offset-2 fin:has-focus-visible:outline-focused';

/*
 * The title keeps the base's text style; a link or button title is reset so it looks the same. Destructive (code
 * only, 23 Oct 2026): the destructive button's text colour (the icon gets fg-error in TSX). Disabled wins.
 */
const titleBase =
  'fin:p-none fin:border-none fin:border-current fin:bg-transparent fin:font-inherit fin:text-start fin:no-underline';

export const title = {
  default: `${titleBase} fin:text-inherit`,
  destructive: `${titleBase} fin:text-error`,
  disabled: `${titleBase} fin:text-disabled-on-bg`,
};

/*
 * A link or button row: the title's link or button covers the whole row (cover-action in tailwind.css, its ring on
 * that cover), so the row is one target. A filled card's cover follows its corners.
 */
export const action = {
  plain: { enabled: 'fin:cover-action fin:cursor-pointer', disabled: 'fin:cover-action fin:cursor-default' },
  filled: {
    enabled: 'fin:cover-action fin:after:rounded-l fin:cursor-pointer',
    disabled: 'fin:cover-action fin:after:rounded-l fin:cursor-default',
  },
};

/* The caption's colour when disabled, over FinCaption's own: `placement:`. */
export const disabledCaption = 'fin:placement:text-disabled-on-bg';

const descriptionBase = 'fin:m-none fin:wrap-break-word';

export const description: Record<FinListItemSize, { enabled: string; disabled: string }> = {
  large: {
    enabled: `${descriptionBase} fin:font-body-medium fin:text-secondary`,
    disabled: `${descriptionBase} fin:font-body-medium fin:text-disabled`,
  },
  small: {
    enabled: `${descriptionBase} fin:font-body-small fin:text-secondary`,
    disabled: `${descriptionBase} fin:font-body-small fin:text-disabled`,
  },
};

export const trailing = 'fin:flex fin:gap-s fin:items-center';
