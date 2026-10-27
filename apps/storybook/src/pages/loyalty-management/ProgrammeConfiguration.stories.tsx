import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import { PAGE_KNOWN_CONTRAST_ISSUES } from '../pageShell';
import { ProgrammeConfiguration, type ProgrammeConfig } from './ProgrammeConfiguration';

/** Figma's three rows (`312:15165`). */
const FIGMA_CONFIGS: ProgrammeConfig[] = [
  { id: 1, segment: 'Staff', loyalty: true, expiryMonths: 36, cashConversion: true, pointsPerUnit: 80, minConversion: 100, maxConversion: 20000 },
  { id: 2, segment: 'VIP', loyalty: true, expiryMonths: 24, cashConversion: true, pointsPerUnit: 90, minConversion: 100, maxConversion: 15000 },
  { id: 3, segment: 'Regular', loyalty: true, expiryMonths: 24, cashConversion: true, pointsPerUnit: 100, minConversion: 200, maxConversion: 10000 },
];

/** More segments than one page holds, with edge cases: long names, switched-off rules, large numbers. */
const MANY_CONFIGS: ProgrammeConfig[] = [
  ...FIGMA_CONFIGS,
  { id: 4, segment: 'Corporate', loyalty: true, expiryMonths: 12, cashConversion: false, pointsPerUnit: 120, minConversion: 500, maxConversion: 50000 },
  { id: 5, segment: 'Senior citizens', loyalty: true, expiryMonths: 48, cashConversion: true, pointsPerUnit: 75, minConversion: 100, maxConversion: 10000 },
  { id: 6, segment: 'Students', loyalty: true, expiryMonths: 12, cashConversion: false, pointsPerUnit: 150, minConversion: 50, maxConversion: 2500 },
  { id: 7, segment: 'Premier banking customers (Colombo and Kandy branches)', loyalty: true, expiryMonths: 60, cashConversion: true, pointsPerUnit: 60, minConversion: 1000, maxConversion: 1250000 },
  { id: 8, segment: 'Dormant accounts', loyalty: false, expiryMonths: 6, cashConversion: false, pointsPerUnit: 200, minConversion: 0, maxConversion: 0 },
  { id: 9, segment: 'Credit card holders', loyalty: true, expiryMonths: 24, cashConversion: true, pointsPerUnit: 100, minConversion: 250, maxConversion: 30000 },
  { id: 10, segment: 'New joiners', loyalty: true, expiryMonths: 12, cashConversion: false, pointsPerUnit: 110, minConversion: 100, maxConversion: 5000 },
  { id: 11, segment: 'SME', loyalty: true, expiryMonths: 24, cashConversion: true, pointsPerUnit: 95, minConversion: 500, maxConversion: 75000 },
  { id: 12, segment: 'Pensioners', loyalty: false, expiryMonths: 36, cashConversion: true, pointsPerUnit: 85, minConversion: 100, maxConversion: 8000 },
];

/** Every customer segment: the ones without a configuration are offered when adding. */
const SEGMENTS = [
  ...MANY_CONFIGS.map((c) => c.segment),
  'Overseas Sri Lankans',
  'Youth savers',
  'Women in business',
  'Priority banking customers with joint accounts across several branches',
];

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
 * View (or a row click) opens the details sheet. Edit and Remove only report what was chosen: the edit sheet, remove
 * dialog and snackbar come next.
 */
const meta: Meta<typeof ProgrammeConfiguration> = {
  title: 'Pages/Loyalty management/Programme configuration',
  component: ProgrammeConfiguration,
  parameters: { layout: 'fullscreen', controls: { disable: true }, a11y: { context: { include: ['body'], exclude: PAGE_KNOWN_CONTRAST_ISSUES } } },
  globals: { viewport: { value: 'desktop1920', isRotated: false } },
  args: { configs: FIGMA_CONFIGS, segments: SEGMENTS, onAction: fn() },
};
export default meta;

type Story = StoryObj<typeof ProgrammeConfiguration>;

/** As Figma: three segments, at 1920. */
export const List: Story = {};

/** Twelve segments: two pages, a long segment name ending in "…", switched-off rules and large numbers. */
export const ManySegments: Story = {
  name: 'Many segments',
  args: { configs: MANY_CONFIGS },
};

/** No configurations yet: the table's header and "Showing 0 of 0 entries" until the Empty state is built. */
export const NoConfigurations: Story = {
  name: 'No configurations',
  args: { configs: [] },
};

/** At 1024: the side nav minimized, the table scrolls sideways with the ⋮ column fixed at the end. */
export const At1024: Story = {
  name: 'At 1024',
  args: { configs: MANY_CONFIGS },
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
  args: { configs: MANY_CONFIGS },
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByText('Dormant accounts'));
  },
};

/** A long segment name: the title and the table's value end in "…". */
export const ViewLongName: Story = {
  name: 'Details, long segment name',
  args: { configs: MANY_CONFIGS },
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
  args: { configs: MANY_CONFIGS },
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Dormant accounts');
    await userEvent.click(await within(canvasElement.ownerDocument.body).findByRole('button', { name: 'Edit' }));
  },
};
