import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import { PAGE_KNOWN_CONTRAST_ISSUES, withPageTheme } from '../pageShell';
import { ProgrammeConfiguration, type ProgrammeConfigurationProps } from './ProgrammeConfiguration';
import { ALL_CONFIGS, FIGMA_CONFIGS, MANY_CONFIGS, SEGMENTS } from './programmeConfigData';

/** Opens the add side sheet from the toolbar's button. */
const openAdd = async (canvasElement: HTMLElement) => {
  await userEvent.click(await within(canvasElement).findByRole('button', { name: 'Add programme configuration' }));
};

/** Opens a row's details from its ⋮ menu (View or Edit). */
const openRowAction = async (canvasElement: HTMLElement, segment: string, action = 'View') => {
  const canvas = within(canvasElement);
  await userEvent.click(await canvas.findByRole('button', { name: `More actions for ${segment}` }));
  await userEvent.click(await within(canvasElement.ownerDocument.body).findByRole('menuitem', { name: action }));
};

/**
 * Programme configuration (Figma `312:15165`, DESIGN.md §8.6), built only from the system's components: FinAppShell,
 * FinTable with its toolbar (search, Add), a filter on the Segment column and the row actions menu. Use the
 * viewport menu for 1920, 1440, 1280 and 1024. Add opens the add side sheet; a saved configuration joins the table.
 * View (or a row click) opens the details sheet, Edit the edit sheet, Remove the remove dialog and then the removed
 * snackbar. **Rows** (Controls) sets how many configurations the table starts with: 0 for none, more than 10 for
 * several pages.
 */
type PageArgs = Omit<ProgrammeConfigurationProps, 'configs'> & { rows: number };

const meta: Meta<PageArgs> = {
  title: 'Pages/Loyalty management/Programme configuration',
  decorators: [withPageTheme],
  parameters: {
    layout: 'fullscreen',
    controls: { include: ['rows'] },
    a11y: { context: { include: ['body'], exclude: PAGE_KNOWN_CONTRAST_ISSUES } },
  },
  argTypes: {
    rows: { control: { type: 'range', min: 0, max: ALL_CONFIGS.length, step: 1 }, description: 'How many configurations the table starts with (0 to 60)' },
  },
  // A new count starts the page again with that many rows.
  render: ({ rows, ...args }) => <ProgrammeConfiguration key={rows} {...args} configs={ALL_CONFIGS.slice(0, rows)} />,
  args: { rows: FIGMA_CONFIGS.length, segments: SEGMENTS, onAction: fn() },
};
export default meta;

type Story = StoryObj<PageArgs>;

/** As Figma: three segments, at 1920. */
export const List: Story = {};

/** Forty segments: four pages, as the Figma footer; a long segment name ending in "…", switched-off rules and large numbers. */
export const ManySegments: Story = {
  name: 'Many segments',
  args: { rows: 40 },
};

/** No configurations yet: an empty state (Medium) replaces the table, with Add programme configuration. */
export const NoConfigurations: Story = {
  name: 'No configurations',
  args: { rows: 0 },
};

/** A search that matches nothing: an empty state (Small) replaces the table; "Clear search and filters" brings the rows back. */
export const NoMatches: Story = {
  name: 'No matches',
  play: async ({ canvasElement }) => {
    await userEvent.type(await within(canvasElement).findByRole('searchbox', { name: 'Search segment' }), 'Platinum');
  },
};

/** At 1024: the side nav minimized, the table scrolls sideways with the ⋮ column fixed at the end. */
export const At1024: Story = {
  name: 'At 1024',
  args: { rows: MANY_CONFIGS.length },
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
};

/** Add programme configuration (Figma `312:15899`): the side sheet over the list. Fill it in and save to add a row. */
export const Add: Story = {
  name: 'Add configuration',
  play: async ({ canvasElement }) => {
    await openAdd(canvasElement);
  },
};

/** Save with nothing filled in: every field shows its error and the first one is focused. */
export const AddErrors: Story = {
  name: 'Add configuration, errors',
  play: async ({ canvasElement }) => {
    await openAdd(canvasElement);
    await userEvent.click(await within(canvasElement.ownerDocument.body).findByRole('button', { name: 'Save configuration' }));
  },
};

/**
 * Every segment already has a configuration: the Segment field is disabled and says why. A disabled field's helper
 * text is inactive by design (WCAG exempts disabled controls, as the field stories), so it's left out of the a11y check.
 */
export const AddNoSegmentsLeft: Story = {
  name: 'Add configuration, no segments left',
  args: { segments: FIGMA_CONFIGS.map((c) => c.segment) },
  parameters: { a11y: { context: { include: ['body'], exclude: [...PAGE_KNOWN_CONTRAST_ISSUES, '[data-tone="disabled"]'] } } },
  play: async ({ canvasElement }) => {
    await openAdd(canvasElement);
  },
};

/** At 1024: the sheet is the last 7 columns of the grid (583 wide). */
export const AddAt1024: Story = {
  name: 'Add configuration at 1024',
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
  play: async ({ canvasElement }) => {
    await openAdd(canvasElement);
  },
};

/** Details (code first, no Figma): View in a row's ⋮ menu opens the row's attributes and values, with Edit and Remove. */
export const View: Story = {
  name: 'Details',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Staff');
  },
};

/** A click on the row opens its details too. */
export const ViewFromRow: Story = {
  name: 'Details from a row click',
  args: { rows: MANY_CONFIGS.length },
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByText('Dormant accounts'));
  },
};

/** A long segment name: the title and the table's value end in "…". */
export const ViewLongName: Story = {
  name: 'Details, long segment name',
  args: { rows: MANY_CONFIGS.length },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Premier banking customers (Colombo and Kandy branches)');
  },
};

/** At 1024: the sheet is 583 wide. */
export const ViewAt1024: Story = {
  name: 'Details at 1024',
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'VIP');
  },
};

/** Edit (code first, no Figma): Edit in a row's ⋮ menu opens the add form with the row's values. Save stays disabled until a value changes. */
export const Edit: Story = {
  name: 'Edit configuration',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Staff', 'Edit');
  },
};

/** Change a value: Save turns on. Changing it back turns it off again. */
export const EditChanged: Story = {
  name: 'Edit configuration, changed',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Staff', 'Edit');
    const expiry = await within(canvasElement.ownerDocument.body).findByRole('textbox', { name: 'Points expiry' });
    await userEvent.clear(expiry);
    await userEvent.type(expiry, '48');
  },
};

/** Edit from the details sheet: the details close and the edit sheet opens with the same row. */
export const EditFromDetails: Story = {
  name: 'Edit configuration from details',
  args: { rows: MANY_CONFIGS.length },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Dormant accounts');
    await userEvent.click(await within(canvasElement.ownerDocument.body).findByRole('button', { name: 'Edit' }));
  },
};

/** Remove (Figma `328:25843`): Remove in a row's ⋮ menu asks in a dialog. Remove (red) takes the row out; Cancel, the close button, Esc or a scrim click keep it. */
export const Remove: Story = {
  name: 'Remove configuration',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Staff', 'Remove');
  },
};

/** A long segment name: the dialog's text wraps. */
export const RemoveLongName: Story = {
  name: 'Remove configuration, long segment name',
  args: { rows: MANY_CONFIGS.length },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Premier banking customers (Colombo and Kandy branches)', 'Remove');
  },
};

/** Remove from the details sheet: the details close and the dialog opens for the same row. */
export const RemoveFromDetails: Story = {
  name: 'Remove configuration from details',
  args: { rows: MANY_CONFIGS.length },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'VIP');
    await userEvent.click(await within(canvasElement.ownerDocument.body).findByRole('button', { name: 'Remove' }));
  },
};

/** At 1024: the dialog is 8 columns of the grid (643 wide). */
export const RemoveAt1024: Story = {
  name: 'Remove configuration at 1024',
  globals: { viewport: { value: 'desktop1024', isRotated: false } },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'VIP', 'Remove');
  },
};

/** Removed (Figma `328:26929`): after Remove in the dialog, the row goes and a Success snackbar shows at the top right; it closes itself after 6 seconds. */
export const Removed: Story = {
  name: 'Removed',
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Staff', 'Remove');
    await userEvent.click(await within(canvasElement.ownerDocument.body).findByRole('button', { name: 'Remove' }));
  },
};
