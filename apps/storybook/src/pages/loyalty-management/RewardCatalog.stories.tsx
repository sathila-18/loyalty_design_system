import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import { PAGE_KNOWN_CONTRAST_ISSUES, withPageTheme } from '../pageShell';
import { RewardCatalog, type RewardCatalogProps } from './RewardCatalog';
import { ALL_REWARDS, FIGMA_REWARDS } from './rewardCatalogData';

const body = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

/** Opens the Add reward side sheet from the toolbar. */
const openAddReward = async (canvasElement: HTMLElement) => {
  await userEvent.click(await within(canvasElement).findByRole('button', { name: 'Add reward' }));
  return within(await body(canvasElement).findByRole('dialog', { name: 'Add reward' }));
};

/** Runs a row's ⋮ menu action (View, Edit or Remove). */
const openRowAction = async (canvasElement: HTMLElement, reward: string, action = 'View') => {
  await userEvent.click(await within(canvasElement).findByRole('button', { name: `More actions for ${reward}` }));
  await userEvent.click(await body(canvasElement).findByRole('menuitem', { name: action }));
};

/**
 * Reward catalog (Figma `349:18532`, DESIGN.md §8.6), built only from the system's components and the same way as
 * the other list pages: FinAppShell, FinTable with its toolbar (search, Add reward), a filter on the Status column and
 * the row actions menu. Use the viewport menu for 1920, 1440, 1280 and 1024. View (or a row click) opens the details,
 * Remove the remove dialog and then the removed snackbar. Add reward opens the four-step Add reward side sheet; Edit
 * opens the same sheet with the reward's details. **Rows** (Controls) sets how many rewards the table starts with (0 to 40). The
 * negative states are in Pages/Common states.
 */
type PageArgs = Omit<RewardCatalogProps, 'rewards'> & { rows: number };

const meta: Meta<PageArgs> = {
  title: 'Pages/Loyalty management/Reward catalog',
  decorators: [withPageTheme],
  parameters: {
    layout: 'fullscreen',
    controls: { include: ['rows'] },
    a11y: { context: { include: ['body'], exclude: PAGE_KNOWN_CONTRAST_ISSUES } },
  },
  argTypes: {
    rows: { control: { type: 'range', min: 0, max: ALL_REWARDS.length, step: 1 }, description: 'How many rewards the table starts with (0 to 40)' },
  },
  // A new count starts the page again with that many rows.
  render: ({ rows, ...args }) => <RewardCatalog key={rows} {...args} rewards={ALL_REWARDS.slice(0, rows)} />,
  args: { rows: FIGMA_REWARDS.length, onAction: fn() },
};
export default meta;

type Story = StoryObj<PageArgs>;

/** As Figma: ten rewards, at 1920. */
export const List: Story = {};

/** Forty rewards: four pages, as the Figma footer; a long name and partner end in "…". */
export const ManyRewards: Story = {
  name: 'Many rewards',
  args: { rows: 40 },
};

/** No rewards yet: an empty state (Medium) replaces the table, with Add reward. */
export const NoRewards: Story = {
  name: 'No rewards',
  args: { rows: 0 },
};

/** A search that matches nothing: an empty state (Small); "Clear search and filters" brings the rows back. */
export const NoMatches: Story = {
  name: 'No matches',
  play: async ({ canvasElement }) => {
    await userEvent.type(await within(canvasElement).findByRole('searchbox', { name: 'Search reward' }), 'Lottery');
  },
};

/** The Status filter: Expired and Limit exceed only. */
export const FilteredByStatus: Story = {
  name: 'Filtered by status',
  args: { rows: 40 },
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: 'Filter Status' }));
    await userEvent.click(await body(canvasElement).findByRole('checkbox', { name: 'Limit exceed' }));
    await userEvent.click(body(canvasElement).getByRole('checkbox', { name: 'Expired' }));
    await userEvent.click(body(canvasElement).getByRole('button', { name: 'Apply' }));
  },
};

/** At 1024: the side nav minimized, the table scrolls sideways with the ⋮ column fixed at the end. */
export const At1024: Story = {
  name: 'At 1024',
  args: { rows: 40 },
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
};

/** Details (code first, no Figma): View in a row's ⋮ menu opens the row's attributes and values, with Edit and Remove. */
export const View: Story = {
  name: 'Details',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Transaction fee');
  },
};

/** A reward with no partner, no limit and no users yet: "N/A". */
export const ViewNoPartner: Story = {
  name: 'Details, no partner or limit',
  play: async ({ canvasElement }) => {
    // In the table: the Add reward sheet also has a "Cash back" option.
    const table = await within(canvasElement).findByRole('table', { name: 'Rewards' });
    await userEvent.click(within(table).getByText('Cash back'));
  },
};

/** Remove (Figma `410:36648`): Remove in a row's ⋮ menu asks in a dialog. Remove (red) takes the row out. */
export const Remove: Story = {
  name: 'Remove reward',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Cash back', 'Remove');
  },
};

/** At 1024: the dialog is 8 columns of the grid. */
export const RemoveAt1024: Story = {
  name: 'Remove reward at 1024',
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Cash back', 'Remove');
  },
};

/** Removed (Figma `410:37938`): the row goes and a Success snackbar shows at the top right. */
export const Removed: Story = {
  name: 'Removed',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Cash back', 'Remove');
    await userEvent.click(await body(canvasElement).findByRole('button', { name: 'Remove' }));
  },
};

/**
 * Add reward (Figma `367:19964`–`409:36106`, in a side sheet, decided 28 Oct 2026): four steps, the stepper at the top.
 * Next checks the step; done steps and the back button go back; the last step has Save as draft, Cancel and Publish.
 */
export const AddReward: Story = {
  name: 'Add reward',
  play: async ({ canvasElement }) => {
    await openAddReward(canvasElement);
  },
};

/** Next with nothing filled in: errors under the fields, the first one focused. */
export const AddRewardErrors: Story = {
  name: 'Add reward, errors',
  play: async ({ canvasElement }) => {
    const sheet = await openAddReward(canvasElement);
    await userEvent.click(sheet.getByRole('button', { name: 'Next' }));
  },
};

/** At 1024: the sheet is 7 columns; Start and End date stay side by side. */
export const AddRewardAt1024: Story = {
  name: 'Add reward at 1024',
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
  play: async ({ canvasElement }) => {
    await openAddReward(canvasElement);
  },
};

/** Cancel with something entered asks first (decided 28 Oct 2026): Keep editing, or Discard (red). */
export const AddRewardDiscard: Story = {
  name: 'Add reward, discard',
  play: async ({ canvasElement }) => {
    const sheet = await openAddReward(canvasElement);
    await userEvent.type(sheet.getByRole('textbox', { name: 'Reward name' }), 'Weekend cash back');
    await userEvent.click(sheet.getByRole('button', { name: 'Cancel' }));
  },
};

/**
 * Edit reward (code first, decided 28 Oct 2026): Edit in a row's ⋮ menu opens the Add reward sheet with the reward's
 * details. Every step is done and clickable; Cancel / Save, Save off until something changes.
 */
export const EditReward: Story = {
  name: 'Edit reward',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Transaction fee', 'Edit');
  },
};

/** A reward with no partner and no limit: Provider and Max total uses start empty (both optional). */
export const EditRewardNoPartner: Story = {
  name: 'Edit reward, no partner or limit',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Cash back', 'Edit');
  },
};
