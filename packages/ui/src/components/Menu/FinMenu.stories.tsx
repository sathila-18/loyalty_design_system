import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FinAssistChip } from '../AssistChip';
import { FinButton } from '../Button';
import { FinFilterChip } from '../FilterChip';
import { FinListCheckbox, FinListCheckboxGroup } from '../ListCheckbox';
import { FinListRadio, FinListRadioGroup } from '../ListRadio';
import { FinListStandard } from '../ListStandard';
import { FinListToggle } from '../ListToggle';
import { FinMenu, FinMenuDivider, type FinMenuKind } from './FinMenu';
import styles from './FinMenu.stories.module.css';

/** The rows' accepted Dark caption and Disabled exemptions are the lists' own (DESIGN.md §9.51); none are used here. */
const meta: Meta<typeof FinMenu> = {
  title: 'Components/Menu/Menu',
  component: FinMenu,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof FinMenu>;

interface PlaygroundArgs {
  kind: FinMenuKind;
  rows: number;
  descriptions: boolean;
  dividers: boolean;
  width: 'content' | 'trigger';
}

/** Open the menu with the button. Controls: kind, number of rows, descriptions, lines between rows, width. */
export const Playground: StoryObj<PlaygroundArgs> = {
  args: { kind: 'action', rows: 4, descriptions: true, dividers: true, width: 'content' },
  argTypes: {
    kind: { control: 'inline-radio', options: ['action', 'filter', 'navigation'] },
    rows: { control: { type: 'range', min: 1, max: 40 } },
    descriptions: { control: 'boolean' },
    dividers: { control: 'boolean', description: 'Each row\'s `divider`' },
    width: { control: 'inline-radio', options: ['content', 'trigger'] },
  },
  render: ({ kind, rows, descriptions, dividers, width }) => (
    <FinMenu
      key={kind}
      kind={kind}
      width={width}
      defaultOpen
      trigger={
        <FinButton variant="secondary" icon="trailing" iconName="keyboard_arrow_down">
          Open menu
        </FinButton>
      }
      footer={kind === 'filter' ? <FinButton size="small">Apply</FinButton> : undefined}
    >
      {Array.from({ length: rows }, (_, i) => (
        <FinListStandard
          key={i}
          as={kind === 'filter' ? 'div' : 'li'}
          size="small"
          behavior={kind === 'action' ? 'menuitem' : kind === 'navigation' ? 'link' : 'static'}
          {...(kind === 'navigation' ? { href: `#item-${i + 1}` } : {})}
          title="Title here"
          description={descriptions ? 'Placeholder description here' : undefined}
          divider={dividers}
        />
      ))}
    </FinMenu>
  ),
};

/** Figma standard-menu `Type=Normal`: four List-standard Small rows with descriptions; the last has no line. */
export const Figma: Story = {
  name: 'Standard menu (Figma)',
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
 * Action menu: a trigger reveals actions; choosing one runs it and closes the menu. Arrow keys, Home / End move
 * between actions; Escape closes; Tab leaves. Rows without lines, a FinMenuDivider before the destructive action.
 */
export const ActionMenu: Story = {
  render: function ActionMenuStory() {
    const [last, setLast] = useState('none yet');
    return (
      <div className={styles.column}>
        <FinMenu
          defaultOpen
          trigger={
            <FinButton variant="secondary" icon="trailing" iconName="keyboard_arrow_down">
              Member actions
            </FinButton>
          }
        >
          <FinListStandard as="li" size="small" behavior="menuitem" divider={false} leadingAccessory="icon" icon="visibility" title="View details" onClick={() => setLast('View details')} />
          <FinListStandard as="li" size="small" behavior="menuitem" divider={false} leadingAccessory="icon" icon="edit" title="Edit member" onClick={() => setLast('Edit member')} />
          <FinListStandard as="li" size="small" behavior="menuitem" divider={false} leadingAccessory="icon" icon="assignment" title="Assign tier" description="Gold, Silver or Bronze" onClick={() => setLast('Assign tier')} />
          <FinMenuDivider />
          <FinListStandard as="li" size="small" behavior="menuitem" divider={false} leadingAccessory="icon" icon="cancel" title="Deactivate" onClick={() => setLast('Deactivate')} />
          <FinListStandard as="li" size="small" behavior="menuitem" divider={false} leadingAccessory="icon" icon="remove" title="Delete (no permission)" disabled />
        </FinMenu>
        <p className={styles.note}>Last action: {last}</p>
      </div>
    );
  },
};

const TIERS = ['Gold', 'Silver', 'Bronze', 'Platinum'];

/**
 * Filter menu: opened from a filter chip; checkbox and radio lists are adjusted, then applied with the footer
 * buttons (kept at the bottom while the content scrolls). Escape or a click outside closes without applying.
 */
export const FilterMenu: Story = {
  render: function FilterMenuStory() {
    const [open, setOpen] = useState(true);
    const [tiers, setTiers] = useState<string[]>(['Gold']);
    const [status, setStatus] = useState('active');
    const [applied, setApplied] = useState<{ tiers: string[]; status: string }>({ tiers: [], status: 'all' });
    const count = applied.tiers.length + (applied.status === 'all' ? 0 : 1);
    return (
      <FinMenu
        kind="filter"
        open={open}
        onOpenChange={setOpen}
        label="Member filters"
        width="320px"
        trigger={
          <FinFilterChip selected={count > 0} leadingIcon="supervised_user_circle">
            {count > 0 ? `Members · ${count}` : 'Members'}
          </FinFilterChip>
        }
        footer={
          <>
            <FinButton
              variant="tertiary"
              size="small"
              onClick={() => {
                setTiers([]);
                setStatus('all');
              }}
            >
              Reset
            </FinButton>
            <FinButton
              size="small"
              onClick={() => {
                setApplied({ tiers, status });
                setOpen(false);
              }}
            >
              Apply
            </FinButton>
          </>
        }
      >
        <FinListCheckboxGroup label="Tier" size="small" value={tiers} onValueChange={setTiers}>
          {TIERS.map((tier) => (
            <FinListCheckbox key={tier} value={tier} title={tier} />
          ))}
        </FinListCheckboxGroup>
        <FinMenuDivider />
        <FinListRadioGroup label="Status" size="small" value={status} onValueChange={setStatus}>
          <FinListRadio value="all" title="All members" />
          <FinListRadio value="active" title="Active" description="Earned or redeemed in the last 90 days" />
          <FinListRadio value="inactive" title="Inactive" />
        </FinListRadioGroup>
      </FinMenu>
    );
  },
};

/** A filter menu with toggles and no lines between the rows. */
export const FilterWithToggles: Story = {
  name: 'Filter menu with toggles',
  render: () => (
    <FinMenu
      kind="filter"
      defaultOpen
      label="Display options"
      width="320px"
      trigger={<FinAssistChip dropdown>Display</FinAssistChip>}
      footer={<FinButton size="small">Apply</FinButton>}
    >
      <FinListToggle size="small" divider={false} title="Show inactive members" />
      <FinListToggle size="small" divider={false} title="Show points balance" defaultChecked />
      <FinListToggle size="small" divider={false} title="Compact rows" description="Fit more members on the page" />
    </FinMenu>
  ),
};

/** Navigation menu: destinations; choosing one goes there. The current page is Selected and gets focus on open. */
export const NavigationMenu: Story = {
  render: () => (
    <FinMenu
      kind="navigation"
      defaultOpen
      trigger={
        <FinButton variant="tertiary" icon="trailing" iconName="keyboard_arrow_down">
          Programme
        </FinButton>
      }
    >
      <FinListStandard as="li" size="small" behavior="link" href="#overview" leadingAccessory="icon" icon="home" title="Overview" />
      <FinListStandard as="li" size="small" behavior="link" href="#rewards" leadingAccessory="icon" icon="loyalty" title="Rewards" selected />
      <FinListStandard as="li" size="small" behavior="link" href="#games" leadingAccessory="icon" icon="sports_esports" title="Games" />
      <FinListStandard as="li" size="small" behavior="link" href="#members" leadingAccessory="icon" icon="supervised_user_circle" title="Members" chevron />
    </FinMenu>
  ),
};

/** A long list: the menu never grows past the window; the rows scroll. `maxHeight` sets a fixed limit instead. */
export const LongList: Story = {
  render: () => (
    <div className={styles.row}>
      <FinMenu
        defaultOpen
        trigger={<FinButton variant="secondary">Fits the window</FinButton>}
      >
        {Array.from({ length: 40 }, (_, i) => (
          <FinListStandard key={i} as="li" size="small" behavior="menuitem" divider={false} title={`Campaign ${i + 1}`} />
        ))}
      </FinMenu>
    </div>
  ),
};

/** `maxHeight`: a fixed limit (a CSS length); the rows scroll inside it. */
export const MaxHeight: Story = {
  render: () => (
    <FinMenu defaultOpen maxHeight="320px" trigger={<FinButton variant="secondary">320 high</FinButton>}>
      {Array.from({ length: 20 }, (_, i) => (
        <FinListStandard key={i} as="li" size="small" behavior="menuitem" title={`Campaign ${i + 1}`} description="Ends 31 Dec" />
      ))}
    </FinMenu>
  ),
};
