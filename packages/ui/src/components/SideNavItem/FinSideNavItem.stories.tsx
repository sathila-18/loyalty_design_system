import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FinSideNavSubItem } from '../SideNavSubItem';
import { FinSideNavItem, type FinSideNavItemSelected, type FinSideNavItemType } from './FinSideNavItem';
import styles from './FinSideNavItem.stories.module.css';

/** Items sit in the side nav, on its `bg-secondary`. */
const Nav = ({ children, type = 'full' }: { children: ReactNode; type?: FinSideNavItemType }) => (
  <nav className={styles.nav} data-type={type} aria-label="Side nav">
    {children}
  </nav>
);

const subItems = (current?: string) =>
  ['Program Configuration', 'Tier Management', 'Reward Catalog'].map((name) => (
    <FinSideNavSubItem key={name} href="#" selected={name === current}>
      {name}
    </FinSideNavSubItem>
  ));

interface Args {
  icon: FinIconName;
  label: string;
  selected: 'none' | FinSideNavItemSelected;
  expanded: boolean;
  type: FinSideNavItemType;
  subItems: boolean;
}

/**
 * Known contrast failure, accepted by design (DESIGN.md §10 #3, 20 Oct 2026): a Selected section's label
 * (`text-action` on the nav's `bg-secondary`) is 4.32:1 Light / 4.34:1 Dark. Only those labels are left out of the
 * a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-selected="sub-item"]'];

/** INTERNAL: part of the side nav (FinSideNav). Matches Figma's properties (DESIGN.md §9). */
const meta: Meta<Args> = {
  title: 'Internal/Side nav/Main selection',
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: { icon: 'person', label: 'Text Here', selected: 'none', expanded: false, type: 'full', subItems: true },
  argTypes: {
    icon: { control: 'select', options: finIcons, description: 'The item icon (Figma Icon)' },
    label: { control: 'text', description: 'The label (one line, "…" when narrow)' },
    selected: {
      control: 'inline-radio',
      options: ['none', 'item', 'sub-item'],
      description: 'Figma `State`: Selected - BG (`item`) or Selected (`sub-item`); Hovered and Pressed are the mouse',
    },
    expanded: { control: 'boolean', description: 'Figma `Expanded` (Full only)' },
    type: { control: 'inline-radio', options: ['full', 'minimized'], description: 'Figma `Type`' },
    subItems: { control: 'boolean', description: 'Figma `Show dropdown` and `Expanded Slot` (sub items)' },
  },
  render: ({ icon, label, selected, expanded, type, subItems: withSubItems }) => (
    <Nav type={type}>
      <FinSideNavItem
        icon={icon}
        label={label}
        type={type}
        expanded={expanded}
        {...(selected === 'none' ? {} : { selected })}
        {...(withSubItems ? {} : { href: '#' })}
      >
        {withSubItems ? subItems(selected === 'sub-item' ? 'Program Configuration' : undefined) : null}
      </FinSideNavItem>
    </Nav>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Main Selection page: each State, closed and open, Full and Minimized. */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.row}>
      <Nav>
        <FinSideNavItem icon="person" label="Default">
          {subItems()}
        </FinSideNavItem>
        <FinSideNavItem icon="person" label="Selected - BG" selected="item">
          {subItems()}
        </FinSideNavItem>
        <FinSideNavItem icon="person" label="Selected" selected="sub-item">
          {subItems()}
        </FinSideNavItem>
        <FinSideNavItem icon="person" label="Selected - BG, expanded" selected="item" expanded>
          {subItems()}
        </FinSideNavItem>
        <FinSideNavItem icon="person" label="Selected, expanded" selected="sub-item" expanded>
          {subItems('Program Configuration')}
        </FinSideNavItem>
      </Nav>
      <Nav type="minimized">
        <FinSideNavItem icon="person" label="Default" type="minimized">
          {subItems()}
        </FinSideNavItem>
        <FinSideNavItem icon="person" label="Selected - BG" type="minimized" selected="item">
          {subItems()}
        </FinSideNavItem>
        <FinSideNavItem icon="person" label="Selected" type="minimized" selected="sub-item">
          {subItems()}
        </FinSideNavItem>
      </Nav>
    </div>
  ),
};

const SECTIONS: { label: string; icon: FinIconName; subItems?: string[] }[] = [
  { label: 'Dashboard', icon: 'home' },
  { label: 'Loyalty Management', icon: 'person', subItems: ['Program Configuration', 'Tier Management', 'Reward Catalog'] },
  { label: 'Gamification', icon: 'person', subItems: ['Badge Management', 'Focus & Learning'] },
  { label: 'System Configuration', icon: 'desktop_windows' },
];

/**
 * The Side Menu behaviour (decided by FinSideNav later, shown here): only the active section is open; clicking a
 * section makes it active (Selected - BG); clicking a sub item makes it the current page (its section is Selected).
 */
export const Example: Story = {
  render: function Example() {
    const [current, setCurrent] = useState<{ section: string; page?: string }>({ section: 'Loyalty Management', page: 'Program Configuration' });
    return (
      <Nav>
        {SECTIONS.map(({ label, icon, subItems: pages }) => {
          const active = current.section === label;
          const selected: FinSideNavItemSelected | undefined = active ? (current.page ? 'sub-item' : 'item') : undefined;
          return (
            <FinSideNavItem
              key={label}
              icon={icon}
              label={label}
              expanded={active}
              {...(selected ? { selected } : {})}
              {...(pages ? {} : { href: '#' })}
              onClick={(event) => {
                event.preventDefault();
                setCurrent({ section: label });
              }}
            >
              {pages?.map((page) => (
                <FinSideNavSubItem
                  key={page}
                  href="#"
                  selected={active && current.page === page}
                  onClick={(event) => {
                    event.preventDefault();
                    setCurrent({ section: label, page });
                  }}
                >
                  {page}
                </FinSideNavSubItem>
              ))}
            </FinSideNavItem>
          );
        })}
      </Nav>
    );
  },
};
