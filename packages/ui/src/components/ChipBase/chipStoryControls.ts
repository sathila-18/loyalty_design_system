// Storybook controls shared by the chip stories (stories only, not part of the components).
import { createElement, type ReactNode } from 'react';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FinAvatar } from '../Avatar';

/**
 * Figma `Show Leading Accessory` and what the slot holds. The slot takes an icon today; an avatar is ready for when
 * design adds one (the smallest FinAvatar is 24px, so XSmall and Small chips grow; DESIGN.md §10 #47). More kinds can
 * be added here as they come.
 */
export type ChipLeadingKind = 'none' | 'icon' | 'avatar';

export interface ChipLeadingArgs {
  leading: ChipLeadingKind;
  leadingIcon: FinIconName;
  avatarInitials: string;
}

export const chipLeadingArgs: ChipLeadingArgs = { leading: 'icon', leadingIcon: 'person', avatarInitials: 'SD' };

export const chipLeadingArgTypes = {
  leading: {
    control: 'inline-radio',
    options: ['none', 'icon', 'avatar'],
    name: 'Leading accessory',
    description: 'Figma `Show Leading Accessory` and what the slot holds',
  },
  leadingIcon: {
    control: 'select',
    options: finIcons,
    name: 'Leading icon',
    description: 'The icon (Figma instance swap)',
    if: { arg: 'leading', eq: 'icon' },
  },
  avatarInitials: {
    control: 'text',
    name: 'Avatar initials',
    description: 'A FinAvatar (text type) in the slot',
    if: { arg: 'leading', eq: 'avatar' },
  },
} as const;

/** Turns the controls into the chip's props: `leadingIcon`, or `leadingAccessory` for an avatar. */
export function withChipLeading<T extends ChipLeadingArgs>({ leading, leadingIcon, avatarInitials, ...props }: T) {
  const accessory: ReactNode =
    leading === 'avatar' ? createElement(FinAvatar, { size: 'xsmall', type: 'text', initials: avatarInitials }) : null;
  return {
    ...props,
    ...(leading === 'icon' ? { leadingIcon } : {}),
    ...(accessory ? { leadingAccessory: accessory } : {}),
  };
}
