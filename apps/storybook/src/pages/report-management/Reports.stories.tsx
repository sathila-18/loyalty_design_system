import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import { PAGE_KNOWN_CONTRAST_ISSUES, withPageTheme } from '../pageShell';
import { ALL_CUSTOMERS, FIGMA_CUSTOMERS } from './reportData';
import { Reports, type ReportsProps } from './Reports';

const body = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

/**
 * Reports (Figma section `162:18060`, DESIGN.md §8.6), read only, built from the system's components: the summary
 * cards (FinStatCard) over the customer table (search, the Tier column's filter). View, a row click
 * or the Active balance opens the customer's points history (`440:94624`); the back button returns. **Rows**
 * (Controls) sets how many customers the list starts with (0 to 25). The negative states are as Pages/Common states.
 */
type PageArgs = Omit<ReportsProps, 'customers'> & { rows: number };

const meta: Meta<PageArgs> = {
  title: 'Pages/Report management/Reports',
  decorators: [withPageTheme],
  parameters: {
    layout: 'fullscreen',
    controls: { include: ['rows'] },
    a11y: { context: { include: ['body'], exclude: PAGE_KNOWN_CONTRAST_ISSUES } },
  },
  argTypes: {
    rows: { control: { type: 'range', min: 0, max: ALL_CUSTOMERS.length, step: 1 }, description: 'How many customers the list starts with (0 to 25)' },
  },
  // A new count starts the page again with that many rows.
  render: ({ rows, ...args }) => <Reports key={rows} {...args} customers={ALL_CUSTOMERS.slice(0, rows)} />,
  args: { rows: FIGMA_CUSTOMERS.length, onAction: fn() },
};
export default meta;
type Story = StoryObj<PageArgs>;

/** Figma's list (`435:90575`): ten customers. */
export const List: Story = {};

/** Twenty-five customers: three pages, a long name, one with no points yet. */
export const ManyCustomers: Story = { name: 'Many customers', args: { rows: 25 } };

/** No customers yet. */
export const NoCustomers: Story = { name: 'No customers', args: { rows: 0 } };

/** A search with no results. */
export const NoMatches: Story = {
  name: 'No matches',
  play: async ({ canvasElement }) => {
    await userEvent.type(await within(canvasElement).findByRole('searchbox', { name: 'Search customer name or number' }), 'Lottery');
  },
};

/** At 1024: the side nav minimized, the cards narrower, the table scrolls sideways. */
export const At1024: Story = { name: 'At 1024', args: { rows: 25 }, globals: { viewport: { value: 'desktop1024', isRotated: false } } };

/** A customer's points history (Figma `440:94624`): View on Fatima Khan. */
export const PointsHistory: Story = {
  name: 'Points history',
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: 'More actions for Fatima Khan' }));
    await userEvent.click(await body(canvasElement).findByRole('menuitem', { name: 'View' }));
  },
};

/** A customer with no activity yet. */
export const NoActivity: Story = { name: 'No activity', args: { rows: 25, initialCustomerId: 15 } };

/** The history at 1024. */
export const PointsHistoryAt1024: Story = {
  name: 'Points history at 1024',
  args: { initialCustomerId: 1 },
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
};

/** The Duration chip's ranges (a custom date range comes later, from design). */
export const DurationFilter: Story = {
  name: 'Duration filter',
  args: { rows: 25, initialCustomerId: 10 },
  // The open chip is Selected: its text contrast is accepted by design (DESIGN.md §10 #3), as the chips' own stories.
  parameters: { a11y: { context: { include: ['body'], exclude: [...PAGE_KNOWN_CONTRAST_ISSUES, 'html[data-brand="finspace"] [data-variant="selected"]'] } } },
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: /Duration: All/ }));
  },
};
