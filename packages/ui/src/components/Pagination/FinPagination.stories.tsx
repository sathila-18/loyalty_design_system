import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinPagination } from './FinPagination';
import styles from './FinPagination.stories.module.css';

/** Selected text contrast is accepted by design (DESIGN.md §10 #3); only the current page skips the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-selected]'];

interface Args {
  pageCount: number;
  defaultPage: number;
}

const meta: Meta<Args> = {
  title: 'Components/Pagination',
  args: { pageCount: 10, defaultPage: 1 },
  argTypes: {
    pageCount: { control: { type: 'range', min: 1, max: 50 }, description: 'The number of pages' },
    defaultPage: { control: { type: 'number', min: 1 }, description: 'The start page' },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ pageCount, defaultPage }) => (
    <FinPagination key={`${pageCount}-${defaultPage}`} pageCount={pageCount} defaultPage={defaultPage} />
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Pagination group page: Limited (4 pages), Only one, More than limit (10 pages). */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.list}>
      <span className={styles.caption}>Limited</span>
      <FinPagination pageCount={4} label="Pagination, limited" />
      <span className={styles.caption}>Only one</span>
      <FinPagination pageCount={1} label="Pagination, only one" />
      <span className={styles.caption}>More than limit</span>
      <FinPagination pageCount={10} label="Pagination, more than limit" />
    </div>
  ),
};

/** Many pages: always 7 items, so the control keeps its width; the current page stays in view. */
export const ManyPages: Story = {
  name: 'Many pages',
  render: () => (
    <div className={styles.list}>
      <FinPagination pageCount={50} defaultPage={1} label="Pagination, start" />
      <FinPagination pageCount={50} defaultPage={25} label="Pagination, middle" />
      <FinPagination pageCount={50} defaultPage={50} label="Pagination, end" />
    </div>
  ),
};

/** Keyboard: Tab moves through the arrows and pages; Enter or Space chooses. Click an empty area here, then press Tab. */
export const Keyboard: Story = {
  render: () => <FinPagination pageCount={10} defaultPage={5} />,
  play: async () => {
    await userEvent.tab();
  },
};
