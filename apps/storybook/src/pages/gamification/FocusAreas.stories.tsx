import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import { PAGE_KNOWN_CONTRAST_ISSUES, withPageTheme } from '../pageShell';
import { ALL_FOCUS_AREAS, FIGMA_FOCUS_AREAS } from './focusAreaData';
import { FocusAreas, type FocusAreasProps } from './FocusAreas';

const body = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

/** Runs a row's ⋮ menu action (View, Edit or Remove). */
const openRowAction = async (canvasElement: HTMLElement, row: string, action = 'View') => {
  await userEvent.click(await within(canvasElement).findByRole('button', { name: `More actions for ${row}` }));
  await userEvent.click(await body(canvasElement).findByRole('menuitem', { name: action }));
};

/** Opens an add side sheet from the toolbar. */
const openAdd = async (canvasElement: HTMLElement, label: string) => {
  await userEvent.click(await within(canvasElement).findByRole('button', { name: label }));
};

/**
 * Focus areas (Figma section `57:13928`, DESIGN.md §8.6), built only from the system's components and the same way as
 * the other list pages. Three levels: **focus areas** (`413:39213`) → View, a row click or "5 lessons" opens its
 * **lessons** (`420:42435`) → View, a row click or "5 questions" opens its **questions** (`420:45368`) → View opens a
 * question's details. The header's back button goes up a level. Each level has its add / edit side sheet
 * (`420:40932`, `420:43923`, `420:46735`), a remove dialog and snackbar, and empty states. Use the viewport menu for
 * 1920, 1440, 1280 and 1024. **Rows** (Controls) sets how many focus areas the list starts with (0 to 20). The
 * negative states are as Pages/Common states.
 */
type PageArgs = Omit<FocusAreasProps, 'focusAreas'> & { rows: number };

const meta: Meta<PageArgs> = {
  title: 'Pages/Gamification/Focus areas',
  decorators: [withPageTheme],
  parameters: {
    layout: 'fullscreen',
    controls: { include: ['rows'] },
    a11y: { context: { include: ['body'], exclude: PAGE_KNOWN_CONTRAST_ISSUES } },
  },
  argTypes: {
    rows: { control: { type: 'range', min: 0, max: ALL_FOCUS_AREAS.length, step: 1 }, description: 'How many focus areas the list starts with (0 to 20)' },
  },
  // A new count starts the page again with that many rows.
  render: ({ rows, ...args }) => <FocusAreas key={rows} {...args} focusAreas={ALL_FOCUS_AREAS.slice(0, rows)} />,
  args: { rows: FIGMA_FOCUS_AREAS.length, onAction: fn() },
};
export default meta;
type Story = StoryObj<PageArgs>;

/** Figma's list (`413:39213`): ten focus areas. */
export const List: Story = {};

/** Twenty focus areas: two pages, a long name, one with no lessons. */
export const ManyFocusAreas: Story = { name: 'Many focus areas', args: { rows: 20 } };

/** No focus areas yet: the empty state with Add focus area. */
export const NoFocusAreas: Story = { name: 'No focus areas', args: { rows: 0 } };

/** A search with no results. */
export const NoMatches: Story = {
  name: 'No matches',
  play: async ({ canvasElement }) => {
    await userEvent.type(await within(canvasElement).findByRole('searchbox', { name: 'Search focus area' }), 'Lottery');
  },
};

/** At 1024: the side nav minimized. */
export const At1024: Story = { name: 'At 1024', globals: { viewport: { value: 'desktop1024', isRotated: false } } };

/** Add focus area (Figma `420:40932`), with the Published toggle (decided 28 Oct 2026). */
export const AddFocusArea: Story = {
  name: 'Add focus area',
  play: async ({ canvasElement }) => openAdd(canvasElement, 'Add focus area'),
};

/** Edit: the same sheet with the focus area's values; Save off until something changes. */
export const EditFocusArea: Story = {
  name: 'Edit focus area',
  play: async ({ canvasElement }) => openRowAction(canvasElement, 'Budgeting basics', 'Edit'),
};

/** Remove asks in a dialog; its lessons go too. */
export const RemoveFocusArea: Story = {
  name: 'Remove focus area',
  play: async ({ canvasElement }) => openRowAction(canvasElement, 'Budgeting basics', 'Remove'),
};

/** Lessons (Figma `420:42435`): View on "Using BNPL responsibly" opens its ten lessons. */
export const Lessons: Story = {
  play: async ({ canvasElement }) => openRowAction(canvasElement, 'Using BNPL responsibly'),
};

/** A focus area with no lessons yet. */
export const NoLessons: Story = {
  name: 'No lessons',
  args: { rows: 20 },
  play: async ({ canvasElement }) => {
    await userEvent.click(await within(canvasElement).findByRole('button', { name: 'Next page' }));
    await openRowAction(canvasElement, 'Spotting scam messages and fake websites before you share any personal or card details');
  },
};

/** Add lesson (Figma `420:43923`), with the Published toggle. */
export const AddLesson: Story = {
  name: 'Add lesson',
  args: { initialLevel: { areaId: 1 } },
  play: async ({ canvasElement }) => openAdd(canvasElement, 'Add lesson'),
};

/** Questions (Figma `420:45368`): View on a lesson opens its questions. */
export const Questions: Story = {
  args: { initialLevel: { areaId: 1 } },
  play: async ({ canvasElement }) => openRowAction(canvasElement, 'What is an instalment plan'),
};

/** A lesson with no questions yet. */
export const NoQuestions: Story = {
  name: 'No questions',
  args: { initialLevel: { areaId: 1, lessonId: 4 } },
};

/** View on a question opens its details: every option, the correct one, tiers, the explanation and points. */
export const QuestionDetails: Story = {
  name: 'Question details',
  args: { initialLevel: { areaId: 1, lessonId: 1 } },
  play: async ({ canvasElement }) => openRowAction(canvasElement, 'How many payments in a standard plan?'),
};

/** Add question (Figma `420:46735`): type an option and press Add option; the radio marks the correct one. */
export const AddQuestion: Story = {
  name: 'Add question',
  args: { initialLevel: { areaId: 1, lessonId: 1 } },
  play: async ({ canvasElement }) => openAdd(canvasElement, 'Add question'),
};

/** Save with nothing filled in: errors under the fields, "Add at least 2 options" in the options panel. */
export const AddQuestionErrors: Story = {
  name: 'Add question, errors',
  args: { initialLevel: { areaId: 1, lessonId: 1 } },
  play: async ({ canvasElement }) => {
    await openAdd(canvasElement, 'Add question');
    const sheet = within(await body(canvasElement).findByRole('dialog', { name: /Add question/ }));
    await userEvent.click(sheet.getByRole('button', { name: 'Save question' }));
  },
};

/** Edit question: the options as radio cards, the correct one chosen. */
export const EditQuestion: Story = {
  name: 'Edit question',
  args: { initialLevel: { areaId: 1, lessonId: 1 } },
  play: async ({ canvasElement }) => openRowAction(canvasElement, 'How many payments in a standard plan?', 'Edit'),
};
