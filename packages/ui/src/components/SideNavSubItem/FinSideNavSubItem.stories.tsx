import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { FinSideNavSubItem } from './FinSideNavSubItem';
import styles from './FinSideNavSubItem.stories.module.css';

/** Sub items sit in the side nav, on its `bg-secondary`; each story shows them in a 280 nav column. */
const Nav = ({ children }: { children: ReactNode }) => <nav className={styles.nav} aria-label="Side nav">{children}</nav>;

interface Args {
  label: string;
  selected: boolean;
}

/** INTERNAL: part of the side nav (Main Selection, FinSideNav). Matches Figma's properties (DESIGN.md §9). */
const meta: Meta<Args> = {
  title: 'Internal/Side nav/Sub selection',
  args: { label: 'Text Here', selected: false },
  argTypes: {
    label: { control: 'text', description: 'The label (one line, "…" when narrow)' },
    selected: { control: 'boolean', description: 'Figma `state=Selected` (Hovered and Pressed are the mouse)' },
  },
  render: ({ label, selected }) => (
    <Nav>
      <FinSideNavSubItem href="#" selected={selected}>
        {label}
      </FinSideNavSubItem>
    </Nav>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma sub selection page: Default and Selected (hover and press an item to see Hovered and Pressed). */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <Nav>
      <FinSideNavSubItem href="#">Text Here</FinSideNavSubItem>
      <FinSideNavSubItem href="#" selected>
        Text Here
      </FinSideNavSubItem>
    </Nav>
  ),
};

/** A section's sub items, the current page selected, and a long label ending in "…". */
export const Example: Story = {
  render: () => (
    <Nav>
      <FinSideNavSubItem href="#">All members</FinSideNavSubItem>
      <FinSideNavSubItem href="#" selected>
        Tiers
      </FinSideNavSubItem>
      <FinSideNavSubItem href="#">Points and rewards history for every member</FinSideNavSubItem>
    </Nav>
  ),
};
