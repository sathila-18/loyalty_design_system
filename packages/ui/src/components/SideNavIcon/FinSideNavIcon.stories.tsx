import type { Meta, StoryObj } from '@storybook/react-vite';
import { finIcons } from '../../icons/finIcons';
import { FinSideNavIcon, type FinSideNavIconProps } from './FinSideNavIcon';

/** INTERNAL: part of the side nav (Main Selection, FinSideNav). Matches Figma's properties (DESIGN.md §9). */
const meta: Meta<FinSideNavIconProps> = {
  title: 'Internal/Side nav/Icon',
  component: FinSideNavIcon,
  args: { name: 'person', selected: false },
  argTypes: {
    name: { control: 'select', options: finIcons, description: "The item's icon (Figma placeholder `perm_identity`)" },
    selected: { control: 'boolean', description: 'Figma `Type=Selected`' },
  },
};
export default meta;

type Story = StoryObj<FinSideNavIconProps>;

export const Playground: Story = {};

/** The Figma Icon page: Type Unselected and Selected. */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <>
      <FinSideNavIcon name="person" />
      <FinSideNavIcon name="person" selected />
    </>
  ),
};
