import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FinPaginationItem } from './FinPaginationItem';
import styles from './FinPaginationItem.stories.module.css';

/** Selected text contrast is accepted by design (DESIGN.md §10 #3); only the Selected item skips the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-selected]'];

interface Args {
  page: string;
  selected: boolean;
  dots: boolean;
}

/**
 * INTERNAL: FinPaginationItem isn't exported from the package (DESIGN.md §7.2: bases are internal unless DESIGN.md
 * says otherwise). These stories exist only to check it against Figma; products use FinPagination.
 */
const meta: Meta<Args> = {
  title: 'Internal/Pagination item',
  args: { page: '1', selected: false, dots: false },
  argTypes: {
    page: { control: 'text', description: 'The page number' },
    selected: { control: 'boolean', description: 'Figma `State=Selected`', if: { arg: 'dots', truthy: false } },
    dots: { control: 'boolean', description: 'Figma `State=Dots`' },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ page, selected, dots }) =>
    dots ? <FinPaginationItem variant="dots" /> : <FinPaginationItem selected={selected}>{page}</FinPaginationItem>,
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Pagination item page: Selected, Default and Dots. Hovered is live: point at a page. */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.row}>
      <FinPaginationItem selected>1</FinPaginationItem>
      <FinPaginationItem>1</FinPaginationItem>
      <FinPaginationItem>1</FinPaginationItem>
      <FinPaginationItem variant="dots" />
    </div>
  ),
};

/** A run of pages as the Pagination group lays them out (gap Space-M), with longer numbers that widen the item. */
export const Run: Story = {
  render: () => (
    <div className={styles.row}>
      <FinPaginationItem selected>1</FinPaginationItem>
      <FinPaginationItem>2</FinPaginationItem>
      <FinPaginationItem variant="dots" />
      <FinPaginationItem>10</FinPaginationItem>
      <FinPaginationItem>100</FinPaginationItem>
      <FinPaginationItem>1000</FinPaginationItem>
    </div>
  ),
};

/** No Focused design: the default ring. Click an empty area here, then press Tab. */
export const Focused: Story = {
  render: () => (
    <div className={styles.row}>
      <FinPaginationItem>2</FinPaginationItem>
      <FinPaginationItem selected>3</FinPaginationItem>
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};
