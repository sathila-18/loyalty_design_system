import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import { PAGE_KNOWN_CONTRAST_ISSUES, withPageTheme } from '../pageShell';
import { ALL_BADGES, FIGMA_BADGES } from './badgeModel';
import { Badges, type BadgesProps } from './Badges';

const body = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

/** Runs a row's ⋮ menu action (View, Edit or Remove). */
const openRowAction = async (canvasElement: HTMLElement, badge: string, action = 'View') => {
  await userEvent.click(await within(canvasElement).findByRole('button', { name: `More actions for ${badge}` }));
  await userEvent.click(await body(canvasElement).findByRole('menuitem', { name: action }));
};

/**
 * Badges (Figma section `57:14322`, DESIGN.md §8.6), built only from the system's components and the same way as the
 * other list pages: search, a filter on the Status column, the ⋮ menu. View (or a row click) opens the details; Add
 * badge and Edit open the badge sheet (`428:51250`), whose icon upload is faked (pick or drop a JPEG or PNG up to 5
 * MB). Remove asks in a dialog (`428:52089`), then a snackbar (`428:52801`). **Rows** (Controls) sets how many badges
 * the list starts with (0 to 20). The negative states are as Pages/Common states.
 */
type PageArgs = Omit<BadgesProps, 'badges'> & { rows: number };

const meta: Meta<PageArgs> = {
  title: 'Pages/Gamification/Badges',
  decorators: [withPageTheme],
  parameters: {
    layout: 'fullscreen',
    controls: { include: ['rows'] },
    a11y: { context: { include: ['body'], exclude: PAGE_KNOWN_CONTRAST_ISSUES } },
  },
  argTypes: {
    rows: { control: { type: 'range', min: 0, max: ALL_BADGES.length, step: 1 }, description: 'How many badges the list starts with (0 to 20)' },
  },
  // A new count starts the page again with that many rows.
  render: ({ rows, ...args }) => <Badges key={rows} {...args} badges={ALL_BADGES.slice(0, rows)} />,
  args: { rows: FIGMA_BADGES.length, onAction: fn() },
};
export default meta;
type Story = StoryObj<PageArgs>;

/** Figma's list (`420:49815`): four badges. */
export const List: Story = {};

/** Twenty badges: two pages, a long name, inactive ones. */
export const ManyBadges: Story = { name: 'Many badges', args: { rows: 20 } };

/** No badges yet: the empty state with Add badge. */
export const NoBadges: Story = { name: 'No badges', args: { rows: 0 } };

/** A search with no results. */
export const NoMatches: Story = {
  name: 'No matches',
  play: async ({ canvasElement }) => {
    await userEvent.type(await within(canvasElement).findByRole('searchbox', { name: 'Search badge' }), 'Lottery');
  },
};

/** At 1024: the side nav minimized. */
export const At1024: Story = { name: 'At 1024', args: { rows: 20 }, globals: { viewport: { value: 'desktop1024', isRotated: false } } };

/** Add badge (Figma `428:51250`): the icon upload, the name and the Active toggle (decided 28 Oct 2026). */
export const AddBadge: Story = {
  name: 'Add badge',
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: 'Add badge' }));
  },
};

/** Save with nothing filled in: the upload shows "Upload a badge icon", the name its error. */
export const AddBadgeErrors: Story = {
  name: 'Add badge, errors',
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: 'Add badge' }));
    const sheet = within(await body(canvasElement).findByRole('dialog', { name: 'Add badge' }));
    await userEvent.click(sheet.getByRole('button', { name: 'Save badge' }));
  },
};

/** Edit: the badge's icon (Complete, with Delete), name and status; Save off until something changes. */
export const EditBadge: Story = {
  name: 'Edit badge',
  play: async ({ canvasElement }) => openRowAction(canvasElement, 'Early adopter', 'Edit'),
};

/** Details: View in a row's ⋮ menu, with Edit and Remove. */
export const Details: Story = {
  play: async ({ canvasElement }) => openRowAction(canvasElement, 'Top server'),
};

/** Remove (Figma `428:52089`): asks in a dialog; Remove (red) takes the row out. */
export const RemoveBadge: Story = {
  name: 'Remove badge',
  play: async ({ canvasElement }) => openRowAction(canvasElement, 'Early adopter', 'Remove'),
};

/** Removed (Figma `428:52801`): the row goes and a Success snackbar shows at the top right. */
export const Removed: Story = {
  play: async ({ canvasElement }) => {
    await openRowAction(canvasElement, 'Early adopter', 'Remove');
    await userEvent.click(await body(canvasElement).findByRole('button', { name: 'Remove' }));
  },
};
