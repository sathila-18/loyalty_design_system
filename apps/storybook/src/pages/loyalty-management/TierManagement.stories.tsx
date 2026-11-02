import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import { PAGE_KNOWN_CONTRAST_ISSUES, withPageTheme } from '../pageShell';
import { TierManagement, type TierManagementProps } from './TierManagement';
import type { Tier } from './tiers';

/**
 * Figma's three rows (`152:6162`), then the Highest level with a long name and large numbers, then more tiers sharing
 * the levels (12: two pages of 10).
 */
const ALL_TIERS: Tier[] = [
  { id: 1, name: 'Silver', level: 'Entry', upgradeThreshold: 0, downgradeThreshold: 0, earnMultiplier: 1, active: true },
  { id: 2, name: 'Gold', level: 'Intermediate', upgradeThreshold: 5000, downgradeThreshold: 4000, earnMultiplier: 2, active: true },
  { id: 3, name: 'Platinum', level: 'Advanced', upgradeThreshold: 10000, downgradeThreshold: 8000, earnMultiplier: 3, active: false },
  {
    id: 4,
    name: 'Diamond (by invitation, for premier banking customers only)',
    level: 'Highest',
    upgradeThreshold: 1250000,
    downgradeThreshold: 1000000,
    earnMultiplier: 4.75,
    active: true,
  },
  { id: 5, name: 'Bronze', level: 'Entry', upgradeThreshold: 0, downgradeThreshold: 0, earnMultiplier: 0.5, active: false },
  { id: 6, name: 'Silver plus', level: 'Intermediate', upgradeThreshold: 7500, downgradeThreshold: 6000, earnMultiplier: 2.5, active: true },
  { id: 7, name: 'Gold plus', level: 'Advanced', upgradeThreshold: 15000, downgradeThreshold: 12000, earnMultiplier: 3.5, active: true },
  { id: 8, name: 'Titanium', level: 'Highest', upgradeThreshold: 50000, downgradeThreshold: 40000, earnMultiplier: 5, active: false },
  { id: 9, name: 'Ruby', level: 'Advanced', upgradeThreshold: 20000, downgradeThreshold: 16000, earnMultiplier: 3.75, active: true },
  { id: 10, name: 'Sapphire', level: 'Highest', upgradeThreshold: 75000, downgradeThreshold: 60000, earnMultiplier: 6, active: true },
  { id: 11, name: 'Emerald', level: 'Highest', upgradeThreshold: 100000, downgradeThreshold: 80000, earnMultiplier: 7.5, active: true },
  { id: 12, name: 'Starter', level: 'Entry', upgradeThreshold: 0, downgradeThreshold: 0, earnMultiplier: 1, active: true },
];

const body = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

/** Opens the add side sheet from the toolbar's button. */
const openAdd = async (canvasElement: HTMLElement) => {
  await userEvent.click(await within(canvasElement).findByRole('button', { name: 'Add tier' }));
};

/** Runs a row's ⋮ menu action (View, Edit or Remove). */
const openRowAction = async (canvasElement: HTMLElement, tier: string, action = 'View') => {
  await userEvent.click(await within(canvasElement).findByRole('button', { name: `More actions for ${tier}` }));
  await userEvent.click(await body(canvasElement).findByRole('menuitem', { name: action }));
};

/**
 * Tier management (Figma `152:6162`, DESIGN.md §8.6), built only from the system's components and the same way as
 * Programme configuration: FinAppShell, FinTable with its toolbar (search, Add), filters on the Level and Status columns and
 * the row actions menu. The tier name, thresholds and multiplier are links that go nowhere yet. Use the viewport
 * menu for 1920, 1440, 1280 and 1024. Add opens the add side sheet; View (or a row click) the details, Edit the edit
 * sheet, Remove the remove dialog and then the removed snackbar. **Rows** (Controls) sets how many tiers the table
 * starts with: 0 for none, up to 12 (two pages).
 */
type PageArgs = Omit<TierManagementProps, 'tiers'> & { rows: number };

const meta: Meta<PageArgs> = {
  title: 'Pages/Loyalty management/Tier management',
  decorators: [withPageTheme],
  parameters: {
    layout: 'fullscreen',
    controls: { include: ['rows'] },
    a11y: { context: { include: ['body'], exclude: PAGE_KNOWN_CONTRAST_ISSUES } },
  },
  argTypes: {
    rows: { control: { type: 'range', min: 0, max: ALL_TIERS.length, step: 1 }, description: 'How many tiers the table starts with (0 to 12)' },
  },
  // A new count starts the page again with that many rows.
  render: ({ rows, ...args }) => <TierManagement key={rows} {...args} tiers={ALL_TIERS.slice(0, rows)} />,
  args: { rows: 3, onAction: fn() },
};
export default meta;

type Story = StoryObj<PageArgs>;

/** As Figma: three tiers, at 1920. */
export const List: Story = {};

/** A tier on every level: the Highest one has a long name (ends in "…") and large thresholds. */
export const EveryLevel: Story = {
  name: 'Every level',
  args: { rows: 4 },
};

/** Twelve tiers: two pages, several on each level (sorted by level, then by upgrade threshold). */
export const ManyTiers: Story = {
  name: 'Many tiers',
  args: { rows: 12 },
};

/** No tiers yet: an empty state (Medium) replaces the table, with Add tier. */
export const NoTiers: Story = {
  name: 'No tiers',
  args: { rows: 0 },
};

/** A search that matches nothing: an empty state (Small) replaces the table; "Clear search and filters" brings the rows back. */
export const NoMatches: Story = {
  name: 'No matches',
  play: async ({ canvasElement }) => {
    await userEvent.type(await within(canvasElement).findByRole('searchbox', { name: 'Search tier' }), 'Bronze');
  },
};

/** The Level and Status filters together leave nothing: "No tiers match the filters", and "Clear filters" brings the rows back. */
export const NoMatchesFilters: Story = {
  name: 'No matches, filters',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = body(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'Filter Level' }));
    await userEvent.click(await page.findByRole('checkbox', { name: 'Advanced' }));
    await userEvent.click(page.getByRole('button', { name: 'Apply' }));
    await userEvent.click(await canvas.findByRole('button', { name: 'Filter Status' }));
    await userEvent.click(await page.findByRole('checkbox', { name: 'Active' }));
    await userEvent.click(page.getByRole('button', { name: 'Apply' }));
  },
};

/** At 1024: the side nav minimized, the table scrolls sideways with the ⋮ column fixed at the end. */
export const At1024: Story = {
  name: 'At 1024',
  args: { rows: 4 },
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
};

/** Add tier (Figma `345:14560`): the side sheet over the list. Fill it in and save to add a row. */
export const Add: Story = {
  name: 'Add tier',
  play: async ({ canvasElement }) => {
    await openAdd(canvasElement);
  },
};

/** The Level menu open (Figma `347:15784`): every level, lowest first, as Figma. */
export const AddLevelMenu: Story = {
  name: 'Add tier, level menu',
  play: async ({ canvasElement }) => {
    await openAdd(canvasElement);
    await userEvent.click(await body(canvasElement).findByRole('button', { name: /^Level/ }));
  },
};

/** Save with nothing filled in: every field shows its error and the first one is focused. */
export const AddErrors: Story = {
  name: 'Add tier, errors',
  play: async ({ canvasElement }) => {
    await openAdd(canvasElement);
    await userEvent.click(await body(canvasElement).findByRole('button', { name: 'Save tier' }));
  },
};

/** A name already used and a downgrade threshold above the upgrade threshold. */
export const AddInvalid: Story = {
  name: 'Add tier, name taken and thresholds',
  play: async ({ canvasElement }) => {
    await openAdd(canvasElement);
    const sheet = body(canvasElement);
    await userEvent.type(await sheet.findByRole('textbox', { name: 'Tier name' }), 'gold');
    await userEvent.type(sheet.getByRole('textbox', { name: 'Upgrade threshold' }), '20000');
    await userEvent.type(sheet.getByRole('textbox', { name: 'Downgrade threshold' }), '25000');
    await userEvent.type(sheet.getByRole('textbox', { name: 'Earn multiplier (×)' }), '4.5');
    await userEvent.click(sheet.getByRole('button', { name: 'Save tier' }));
  },
};

/** At 1024: the sheet is the last 7 columns of the grid (583 wide); the fields stay two by two. */
export const AddAt1024: Story = {
  name: 'Add tier at 1024',
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
  play: async ({ canvasElement }) => {
    await openAdd(canvasElement);
  },
};

/** Details (code first, no Figma): View in a row's ⋮ menu opens the row's attributes and values, with Edit and Remove. */
export const View: Story = {
  name: 'Details',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Gold');
  },
};

/** A click on the row opens its details too (a click on one of its links doesn't, and goes nowhere yet). */
export const ViewFromRow: Story = {
  name: 'Details from a row click',
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByText('Intermediate'));
  },
};

/** A long tier name: the title wraps to two lines, the table's value ends in "…". */
export const ViewLongName: Story = {
  name: 'Details, long tier name',
  args: { rows: 4 },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, ALL_TIERS[3]!.name);
  },
};

/** At 1024: the sheet is 583 wide. */
export const ViewAt1024: Story = {
  name: 'Details at 1024',
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Platinum');
  },
};

/** Edit (code first, no Figma): Edit in a row's ⋮ menu opens the add form with the row's values. Save stays disabled until a value changes. */
export const Edit: Story = {
  name: 'Edit tier',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Gold', 'Edit');
  },
};

/** Change a value: Save turns on. Changing it back turns it off again. */
export const EditChanged: Story = {
  name: 'Edit tier, changed',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Gold', 'Edit');
    const field = await body(canvasElement).findByRole('textbox', { name: 'Earn multiplier (×)' });
    await userEvent.clear(field);
    await userEvent.type(field, '2.25');
  },
};

/** Edit from the details sheet: the details close and the edit sheet opens with the same row. */
export const EditFromDetails: Story = {
  name: 'Edit tier from details',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Platinum');
    await userEvent.click(await body(canvasElement).findByRole('button', { name: 'Edit' }));
  },
};

/** Remove (Figma `347:16831`): Remove in a row's ⋮ menu asks in a dialog. Remove (red) takes the row out; Cancel, the close button, Esc or a scrim click keep it. */
export const Remove: Story = {
  name: 'Remove tier',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Silver', 'Remove');
  },
};

/** A long tier name: the dialog's text wraps. */
export const RemoveLongName: Story = {
  name: 'Remove tier, long name',
  args: { rows: 4 },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, ALL_TIERS[3]!.name, 'Remove');
  },
};

/** Remove from the details sheet: the details close and the dialog opens for the same row. */
export const RemoveFromDetails: Story = {
  name: 'Remove tier from details',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Gold');
    await userEvent.click(await body(canvasElement).findByRole('button', { name: 'Remove' }));
  },
};

/** At 1024: the dialog is 8 columns of the grid (643 wide). */
export const RemoveAt1024: Story = {
  name: 'Remove tier at 1024',
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Gold', 'Remove');
  },
};

/** Removed (Figma `347:17774`): after Remove in the dialog, the row goes and a Success snackbar shows at the top right; it closes itself after 6 seconds. */
export const Removed: Story = {
  name: 'Removed',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Silver', 'Remove');
    await userEvent.click(await body(canvasElement).findByRole('button', { name: 'Remove' }));
  },
};
