import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
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

/**
 * Programme configuration (Figma `312:15165`, DESIGN.md §8.6), built only from the system's components: FinAppShell,
 * FinTable with its toolbar (search, Segment chip with a select menu, Add) and the row actions menu. Use the
 * viewport menu for 1920, 1440, 1280 and 1024. The actions only report what was chosen: the side sheet, dialog and
 * snackbar aren't built yet.
 */
const meta: Meta<typeof ProgrammeConfiguration> = {
  title: 'Pages/Loyalty management/Programme configuration',
  component: ProgrammeConfiguration,
  parameters: { layout: 'fullscreen', controls: { disable: true }, a11y: { context: { include: ['body'], exclude: PAGE_KNOWN_CONTRAST_ISSUES } } },
  globals: { viewport: { value: 'desktop1920', isRotated: false } },
  args: { configs: FIGMA_CONFIGS, onAction: fn() },
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
