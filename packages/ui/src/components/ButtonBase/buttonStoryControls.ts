// Storybook controls shared by the button stories (stories only, not part of the components).
import { finIcons, type FinIconName } from '../../icons/finIcons';

/** Figma's icon controls: an on/off toggle plus the icon, like `Show Leading Icon` and its instance swap. */
export interface FinButtonIconToggles {
  showLeadingIcon: boolean;
  showTrailingIcon: boolean;
  leadingIcon?: FinIconName;
  trailingIcon?: FinIconName;
}

export const buttonIconArgs: FinButtonIconToggles = {
  showLeadingIcon: true,
  showTrailingIcon: true,
  leadingIcon: 'person',
  trailingIcon: 'person',
};

export const buttonIconArgTypes = {
  showLeadingIcon: { control: 'boolean', name: 'Show Leading Icon', description: 'Figma `Show Leading Icon`' },
  leadingIcon: {
    control: 'select',
    options: finIcons,
    description: 'The leading icon (Figma instance swap)',
    if: { arg: 'showLeadingIcon' },
  },
  showTrailingIcon: { control: 'boolean', name: 'Show Trailing Icon', description: 'Figma `Show Trailing Icon`' },
  trailingIcon: {
    control: 'select',
    options: finIcons,
    description: 'The trailing icon (Figma instance swap)',
    if: { arg: 'showTrailingIcon' },
  },
} as const;

/** Turns the toggles into the component props: an icon is passed only when its toggle is on. */
export function withIconToggles<T extends FinButtonIconToggles>({
  showLeadingIcon,
  showTrailingIcon,
  leadingIcon,
  trailingIcon,
  ...props
}: T) {
  return {
    ...props,
    ...(showLeadingIcon && leadingIcon ? { leadingIcon } : {}),
    ...(showTrailingIcon && trailingIcon ? { trailingIcon } : {}),
  };
}
