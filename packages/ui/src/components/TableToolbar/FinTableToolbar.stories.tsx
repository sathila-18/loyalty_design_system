import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FinAssistChip } from '../AssistChip';
import { FinFilterChip } from '../FilterChip';
import { FinListStandard } from '../ListStandard';
import { FinMenu } from '../Menu';
import { FinTableToolbar } from './FinTableToolbar';
import styles from './FinTableToolbar.stories.module.css';

/** Selected chips (an open Assist chip, a selected filter chip): the accepted Selected text contrast (DESIGN.md §10 #3). */
const KNOWN_CONTRAST_ISSUES = ['[data-variant="selected"]'];

const SEGMENTS = ['All segments', 'Staff', 'VIP', 'Regular'];

/** The Filter slot as the pages use it: a Large Assist chip (40, as Figma) with a select menu (DESIGN.md §9.64; two-tone label: §10 #64). */
function SegmentFilter() {
  const [segment, setSegment] = useState(SEGMENTS[0]!);
  return (
    <FinMenu
      kind="select"
      label="Segment"
      placement="bottom-end"
      trigger={(menuProps) => (
        <FinAssistChip {...menuProps} size="large" dropdown expanded={menuProps['aria-expanded']}>
          {segment}
        </FinAssistChip>
      )}
    >
      {SEGMENTS.map((s) => (
        <FinListStandard key={s} as="li" size="small" behavior="option" divider={false} title={s} selected={s === segment} onClick={() => setSegment(s)} />
      ))}
    </FinMenu>
  );
}

interface Args {
  showSearch: boolean;
  placeholder: string;
  showFilter: boolean;
  showButton: boolean;
  actionLabel: string;
}

/**
 * INTERNAL: part of the table (FinTable `toolbar`); these stories exist to check it against Figma's Table Header
 * (DESIGN.md §9.67). Pages use FinTable with a toolbar.
 */
const meta: Meta<Args> = {
  title: 'Internal/Table/Table toolbar',
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: { showSearch: true, placeholder: 'Search segment', showFilter: true, showButton: true, actionLabel: 'Action' },
  argTypes: {
    showSearch: { control: 'boolean', description: 'Figma `Show search` (`search`)' },
    placeholder: { control: 'text', description: "The search's placeholder", if: { arg: 'showSearch' } },
    showFilter: { control: 'boolean', description: 'Figma `Show filter` (`filters`: here an Assist chip with a select menu)' },
    showButton: { control: 'boolean', description: 'Figma `Show button` (`actionLabel`)' },
    actionLabel: { control: 'text', description: "The button's label", if: { arg: 'showButton' } },
  },
  render: function Playground({ showSearch, placeholder, showFilter, showButton, actionLabel }) {
    const [query, setQuery] = useState('');
    return (
      <div className={styles.stage}>
        <FinTableToolbar
          {...(showSearch ? { search: { label: 'Search segments', placeholder, value: query, onChange: (e) => setQuery(e.target.value) } } : {})}
          {...(showFilter ? { filters: <SegmentFilter /> } : {})}
          {...(showButton ? { actionLabel } : {})}
        />
      </div>
    );
  },
};
export default meta;

type Story = StoryObj<Args>;

/** Every Figma option on; the button's text is a placeholder ("Action"). */
export const Playground: Story = {};

/** Each part on its own: search only, filters and button only, button only. */
export const Options: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.stack}>
      <FinTableToolbar search={{ label: 'Search members', placeholder: 'Search members' }} />
      <FinTableToolbar filters={<SegmentFilter />} actionLabel="Action" />
      <FinTableToolbar actionLabel="Action" />
    </div>
  ),
};

/** The Filter slot takes any chips: here filter chips, 4 apart (Figma Chips-group). */
export const FilterChips: Story = {
  name: 'Filter chips',
  parameters: { controls: { disable: true } },
  render: () => (
    <FinTableToolbar
      search={{ label: 'Search rewards', placeholder: 'Search rewards' }}
      filters={
        <>
          <FinFilterChip>Active</FinFilterChip>
          <FinFilterChip defaultSelected>Vouchers</FinFilterChip>
          <FinFilterChip>Expiring soon</FinFilterChip>
        </>
      }
      actionLabel="Action"
    />
  ),
};

/** Narrow containers: the search shrinks first; the filters and button keep their size. */
export const Narrow: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.stack}>
      {(['wide', 'medium', 'narrow'] as const).map((width) => (
        <div key={width} className={styles[width]}>
          <FinTableToolbar
            search={{ label: 'Search segments', placeholder: 'Search segment' }}
            filters={<SegmentFilter />}
            actionLabel="Action"
          />
        </div>
      ))}
    </div>
  ),
};
