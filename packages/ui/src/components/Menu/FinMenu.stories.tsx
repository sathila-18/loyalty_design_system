import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import type { FinIconName } from '../../icons/finIcons';
import { FinButton } from '../Button';
import { FinFilterChip } from '../FilterChip';
import { FinListCheckbox, FinListCheckboxGroup } from '../ListCheckbox';
import { FinListRadio, FinListRadioGroup } from '../ListRadio';
import { FinListStandard } from '../ListStandard';
import { FinListToggle } from '../ListToggle';
import { FinMenu, FinMenuDivider, type FinMenuKind, type FinMenuPlacement } from './FinMenu';
import styles from './FinMenu.stories.module.css';

/** The rows one filter menu holds: one list type at a time (DESIGN.md §9.64; mixing types only when design asks). */
type FilterList = 'checkbox' | 'radio' | 'toggle';

interface Args {
  kind: FinMenuKind;
  filterList: FilterList;
  rows: number;
  descriptions: boolean;
  leadingIcons: boolean;
  dividers: boolean;
  groups: boolean;
  width: 'content' | 'trigger' | '320px';
  maxHeight: string;
  placement: FinMenuPlacement;
}

const OPTIONS: { title: string; description: string; icon: FinIconName }[] = [
  { title: 'View details', description: 'Profile, tier and points', icon: 'visibility' },
  { title: 'Edit member', description: 'Change contact details', icon: 'edit' },
  { title: 'Assign tier', description: 'Gold, Silver or Bronze', icon: 'assignment' },
  { title: 'Rewards', description: 'Offers this member can redeem', icon: 'loyalty' },
  { title: 'Games', description: 'Campaign games played', icon: 'sports_esports' },
  { title: 'Deactivate', description: 'Stop earning and redeeming', icon: 'cancel' },
];
const FILTERS = [
  { title: 'Gold', description: '10,000 points or more' },
  { title: 'Silver', description: '5,000 to 9,999 points' },
  { title: 'Bronze', description: 'Under 5,000 points' },
  { title: 'Active', description: 'Earned or redeemed in the last 90 days' },
  { title: 'New this month', description: 'Joined in the last 30 days' },
  { title: 'Birthday this month', description: 'Eligible for the birthday reward' },
];
const filter = (i: number) => FILTERS[i % FILTERS.length]!;
const filterTitle = (i: number) => (i < FILTERS.length ? filter(i).title : `${filter(i).title} ${Math.floor(i / FILTERS.length) + 1}`);
const option = (i: number) => OPTIONS[i % OPTIONS.length]!;
const title = (i: number) => (i < OPTIONS.length ? option(i).title : `${option(i).title} ${Math.floor(i / OPTIONS.length) + 1}`);

const meta: Meta<Args> = {
  title: 'Components/Menu/Menu',
  parameters: { layout: 'padded' },
  args: {
    kind: 'action',
    filterList: 'checkbox',
    rows: 4,
    descriptions: true,
    leadingIcons: false,
    dividers: true,
    groups: false,
    width: 'content',
    maxHeight: '',
    placement: 'bottom-start',
  },
  argTypes: {
    kind: { control: 'inline-radio', options: ['action', 'filter', 'navigation'], description: '`kind`: what the menu is for' },
    filterList: {
      control: 'inline-radio',
      options: ['checkbox', 'radio', 'toggle'],
      description: 'Filter menu: the one list type it holds',
      if: { arg: 'kind', eq: 'filter' },
    },
    rows: { control: { type: 'range', min: 1, max: 40 }, description: 'Number of rows' },
    descriptions: { control: 'boolean', description: 'Rows: `description`' },
    leadingIcons: { control: 'boolean', description: 'Rows: leading icon (action and navigation rows)' },
    dividers: { control: 'boolean', description: 'Rows: `divider` (without it, 16 of bottom padding)' },
    groups: { control: 'boolean', description: 'A `FinMenuDivider` before the last row (action and navigation)' },
    width: { control: 'inline-radio', options: ['content', 'trigger', '320px'], description: '`width`' },
    maxHeight: { control: 'text', description: '`maxHeight` (a CSS length; empty: up to the window edge)' },
    placement: { control: 'select', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'], description: '`placement` (flips when there is no room)' },
  },
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <MenuDemo {...args} />,
};
export default meta;

type Story = StoryObj<Args>;

/** The rows of an action or navigation menu, from the controls. */
function standardRows({ kind, rows, descriptions, leadingIcons, dividers, groups }: Args) {
  return Array.from({ length: rows }, (_, i) => (
    <RowWithSeparator key={i} separator={groups && rows > 1 && i === rows - 1}>
      <FinListStandard
        as="li"
        size="small"
        behavior={kind === 'navigation' ? 'link' : 'menuitem'}
        {...(kind === 'navigation' ? { href: `#page-${i + 1}`, selected: i === 0 } : {})}
        title={title(i)}
        description={descriptions ? option(i).description : undefined}
        {...(leadingIcons ? { leadingAccessory: 'icon' as const, icon: option(i).icon } : {})}
        divider={dividers}
      />
    </RowWithSeparator>
  ));
}

function RowWithSeparator({ separator, children }: { separator: boolean; children: ReactNode }) {
  return (
    <>
      {separator && <FinMenuDivider />}
      {children}
    </>
  );
}

/** One list type, as the controls say: a checkbox group, a radio group or toggles. */
function FilterRows({ filterList, rows, descriptions, dividers }: Args) {
  const [ticked, setTicked] = useState<string[]>([]);
  const [chosen, setChosen] = useState('0');
  const items = Array.from({ length: rows }, (_, i) => ({
    value: String(i),
    title: filterTitle(i),
    description: descriptions ? filter(i).description : undefined,
  }));
  if (filterList === 'checkbox')
    return (
      <FinListCheckboxGroup label="Show" size="small" value={ticked} onValueChange={setTicked}>
        {items.map((item) => (
          <FinListCheckbox key={item.value} {...item} divider={dividers} />
        ))}
      </FinListCheckboxGroup>
    );
  if (filterList === 'radio')
    return (
      <FinListRadioGroup label="Show" size="small" value={chosen} onValueChange={setChosen}>
        {items.map((item) => (
          <FinListRadio key={item.value} {...item} divider={dividers} />
        ))}
      </FinListRadioGroup>
    );
  return (
    <div role="group" aria-label="Show">
      {items.map((item) => (
        <FinListToggle key={item.value} size="small" title={item.title} description={item.description} divider={dividers} />
      ))}
    </div>
  );
}

function MenuDemo(args: Args) {
  const { kind, width, maxHeight, placement } = args;
  const [open, setOpen] = useState(true);
  const trigger =
    kind === 'filter' ? (
      <FinFilterChip selected={false} leadingIcon="supervised_user_circle">
        Members
      </FinFilterChip>
    ) : (
      <FinButton variant={kind === 'navigation' ? 'tertiary' : 'secondary'} icon="trailing" iconName="keyboard_arrow_down">
        {kind === 'navigation' ? 'Programme' : 'Member actions'}
      </FinButton>
    );
  return (
    <div className={placement.startsWith('top') ? styles.bottom : undefined}>
      <FinMenu
        key={`${kind}-${args.filterList}`}
        kind={kind}
        open={open}
        onOpenChange={setOpen}
        width={width}
        placement={placement}
        {...(maxHeight ? { maxHeight } : {})}
        {...(kind === 'filter' ? { label: 'Member filters' } : {})}
        trigger={trigger}
        footer={
          kind === 'filter' ? (
            <>
              <FinButton variant="tertiary" size="small">
                Reset
              </FinButton>
              <FinButton size="small" onClick={() => setOpen(false)}>
                Apply
              </FinButton>
            </>
          ) : undefined
        }
      >
        {kind === 'filter' ? <FilterRows {...args} /> : standardRows(args)}
      </FinMenu>
    </div>
  );
}

/** Every control. Open and close the menu with its trigger. */
export const Playground: Story = {};

/** Figma standard-menu `Type=Normal`: four List-standard Small rows with descriptions; the last has no line. */
export const Figma: Story = {
  name: 'Standard menu (Figma)',
  parameters: { controls: { disable: true } },
  render: () => (
    <FinMenu
      defaultOpen
      width="375px"
      trigger={
        <FinButton variant="secondary" icon="trailing" iconName="keyboard_arrow_down">
          Open menu
        </FinButton>
      }
    >
      {[1, 2, 3, 4].map((i) => (
        <FinListStandard key={i} as="li" size="small" behavior="menuitem" title="Title here" description="Placeholder description here" />
      ))}
    </FinMenu>
  ),
};

/**
 * Action menu: a trigger reveals actions; choosing one runs it and closes the menu. Arrow keys, Home and End move
 * between actions; Escape closes; Tab leaves.
 */
export const ActionMenu: Story = {
  args: { kind: 'action', rows: 6, descriptions: false, leadingIcons: true, dividers: false, groups: true },
  parameters: { controls: { include: ['rows', 'descriptions', 'leadingIcons', 'dividers', 'groups', 'width'] } },
};

/**
 * Filter menu: opened from a filter chip; one list type (checkbox, radio or toggle, in the controls) is adjusted,
 * then applied with the footer buttons, which stay at the bottom while the rows scroll.
 */
export const FilterMenu: Story = {
  args: { kind: 'filter', filterList: 'checkbox', rows: 4, descriptions: false, dividers: true, width: '320px' },
  parameters: { controls: { include: ['filterList', 'rows', 'descriptions', 'dividers', 'width', 'maxHeight'] } },
};

/** Navigation menu: destinations; choosing one goes there. The current page is Selected and gets focus on open. */
export const NavigationMenu: Story = {
  args: { kind: 'navigation', rows: 4, descriptions: false, leadingIcons: true, dividers: false },
  parameters: { controls: { include: ['rows', 'descriptions', 'leadingIcons', 'dividers', 'groups', 'width'] } },
};

/** A long list: the menu never grows past the window and the rows scroll; `maxHeight` sets a fixed limit instead. */
export const LongList: Story = {
  args: { kind: 'action', rows: 40, descriptions: false, dividers: false, maxHeight: '' },
  parameters: { controls: { include: ['rows', 'descriptions', 'dividers', 'maxHeight'] } },
};

/** Opening above: `placement` top, or a flip when there's no room below. */
export const Placement: Story = {
  args: { kind: 'action', rows: 4, descriptions: false, placement: 'top-start' },
  parameters: { controls: { include: ['placement', 'rows'] } },
};
