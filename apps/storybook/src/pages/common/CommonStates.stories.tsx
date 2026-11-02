import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { fn, userEvent, within } from 'storybook/test';
import { ProgrammeConfiguration } from '../loyalty-management/ProgrammeConfiguration';
import { FIGMA_CONFIGS, MANY_CONFIGS, SEGMENTS } from '../loyalty-management/programmeConfigData';
import { PAGE_KNOWN_CONTRAST_ISSUES, withPageTheme } from '../pageShell';
import type { PageApi } from './pageApi';

type Args = Required<PageApi>;

const body = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

/** Runs a row's ⋮ menu action. */
const rowAction = async (canvasElement: HTMLElement, segment: string, action: string) => {
  await userEvent.click(await within(canvasElement).findByRole('button', { name: `More actions for ${segment}` }));
  await userEvent.click(await body(canvasElement).findByRole('menuitem', { name: action }));
};

/**
 * The negative states every list page shares (code first, no Figma; decided 27 Oct 2026; DESIGN.md §8.6), shown on
 * Programme configuration. The parts are in `apps/storybook/src/pages/common/` (`PageStates.tsx`, `pageApi.ts`), so
 * any page can use them. Use the controls to change the fake API: how the list **load**s, whether **save** and
 * **remove** fail (the first time only; trying again works), and whether the connection is **online**.
 */
const meta: Meta<Args> = {
  title: 'Pages/Common states',
  decorators: [withPageTheme],
  parameters: {
    layout: 'fullscreen',
    a11y: { context: { include: ['body'], exclude: PAGE_KNOWN_CONTRAST_ISSUES } },
  },
  args: { load: 'ready', save: 'ok', remove: 'ok', online: true },
  argTypes: {
    load: { control: 'inline-radio', options: ['ready', 'loading', 'fail'], description: 'Loading the list' },
    save: { control: 'inline-radio', options: ['ok', 'fail'], description: 'Saving in the add or edit sheet (fails once)' },
    remove: { control: 'inline-radio', options: ['ok', 'fail'], description: 'Removing a row (fails once)' },
    online: { control: 'boolean', description: 'The connection' },
  },
  // A new load, save or remove setting starts the page again; the connection changes on the open page.
  render: (args) => (
    <ProgrammeConfiguration key={`${args.load}-${args.save}-${args.remove}`} configs={MANY_CONFIGS} segments={SEGMENTS} onAction={fn()} api={args} />
  ),
};
export default meta;

type Story = StoryObj<Args>;

/** Loading: skeleton rows in place of the data, no toolbar (decided 27 Oct 2026) and no footer. */
export const Loading: Story = {
  args: { load: 'loading' },
};

/** Couldn't load: an empty state with the warning icon replaces the table, no toolbar. Try again loads the list. */
export const LoadFailed: Story = {
  name: "Couldn't load",
  args: { load: 'fail' },
};

/**
 * Network or server error: an Error banner above the table until the connection is back. Add, Edit and Remove are
 * off (the ⋮ menu, the details sheet), so nothing is lost.
 */
export const ConnectionLost: Story = {
  name: 'Network or server error',
  args: { online: false },
};

/** The same, in a form that was open: the banner at the top and Save off. */
export const ConnectionLostForm: Story = {
  name: 'Network or server error, in a form',
  args: { online: false },
  render: function ConnectionLostForm(args) {
    // The sheet was opened before the connection dropped.
    const [online, setOnline] = useState(true);
    return <ProgrammeConfiguration configs={FIGMA_CONFIGS} segments={SEGMENTS} onAction={() => setOnline(args.online)} api={{ ...args, online }} />;
  },
  play: async ({ canvasElement }) => {
    await rowAction(canvasElement, 'Staff', 'Edit');
  },
};

/** Back online: the banner goes and a Success snackbar says so (here, 1.5 seconds after the page opens offline). */
export const BackOnline: Story = {
  name: 'Back online',
  render: function BackOnline(args) {
    const [online, setOnline] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => setOnline(true), 1500);
      return () => clearTimeout(timer);
    }, []);
    return <ProgrammeConfiguration configs={FIGMA_CONFIGS} segments={SEGMENTS} onAction={fn()} api={{ ...args, online }} />;
  },
};

/** Couldn't save: Save in the edit sheet fails once; the sheet stays open with the values and an Error banner. Save again works. */
export const SaveFailed: Story = {
  name: "Couldn't save",
  args: { save: 'fail' },
  play: async ({ canvasElement }) => {
    await rowAction(canvasElement, 'Staff', 'Edit');
    const expiry = await body(canvasElement).findByRole('textbox', { name: 'Points expiry' });
    await userEvent.clear(expiry);
    await userEvent.type(expiry, '48');
    await userEvent.click(body(canvasElement).getByRole('button', { name: 'Save' }));
  },
};

/** Couldn't remove: Remove fails once; the row stays and an Error snackbar offers Try again (which works). */
export const RemoveFailed: Story = {
  name: "Couldn't remove",
  args: { remove: 'fail' },
  play: async ({ canvasElement }) => {
    await rowAction(canvasElement, 'Staff', 'Remove');
    await userEvent.click(await body(canvasElement).findByRole('button', { name: 'Remove' }));
  },
};
