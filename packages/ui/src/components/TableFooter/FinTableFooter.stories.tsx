import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FinTableFooter } from './FinTableFooter';
import styles from './FinTableFooter.stories.module.css';

/** Selected page text contrast is accepted by design (DESIGN.md §10 #3); only the current page skips the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-selected]'];

interface Args {
  totalRows: number;
  rowsPerPage: number;
  defaultPage: number;
}

/** INTERNAL: part of the table (FinTable). The Row count dropdown opens its menu of row counts (10, 25, 50, 100). */
const meta: Meta<Args> = {
  title: 'Internal/Table/Table footer',
  args: { totalRows: 45, rowsPerPage: 10, defaultPage: 1 },
  argTypes: {
    totalRows: { control: { type: 'number', min: 0 }, description: 'The rows in the whole table' },
    rowsPerPage: { control: { type: 'number', min: 1 }, description: 'The rows shown per page' },
    defaultPage: { control: { type: 'number', min: 1 }, description: 'The start page' },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ totalRows, rowsPerPage, defaultPage }) => (
    <FooterDemo key={`${totalRows}-${rowsPerPage}-${defaultPage}`} totalRows={totalRows} rowsPerPage={rowsPerPage} defaultPage={defaultPage} />
  ),
};
export default meta;

/** The footer with its row count kept in state, so a choice in the menu shows. */
function FooterDemo({ totalRows, rowsPerPage, defaultPage }: Args) {
  const [perPage, setPerPage] = useState(rowsPerPage);
  return (
    <FinTableFooter
      className={styles.wide}
      totalRows={totalRows}
      rowsPerPage={perPage}
      defaultPage={defaultPage}
      onRowsPerPageChange={setPerPage}
    />
  );
}

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Table footer: 10 rows, 10 per page (Figma shows 4 pages in its sample; one page is what 10 of 10 gives). */
export const Figma: Story = {
  name: 'Figma',
  render: () => (
    <div className={styles.list}>
      <FinTableFooter className={styles.wide} totalRows={10} rowsPerPage={10} />
      <FinTableFooter className={styles.wide} totalRows={40} rowsPerPage={10} />
    </div>
  ),
};

/** Many rows: dots in the pagination; the last page shows only the rows left. */
export const ManyRows: Story = {
  name: 'Many rows',
  render: () => (
    <div className={styles.list}>
      <FinTableFooter className={styles.wide} totalRows={1234} rowsPerPage={25} />
      <FinTableFooter className={styles.wide} totalRows={1234} rowsPerPage={25} defaultPage={50} />
    </div>
  ),
};

/** No rows: "Showing 0 of 0 entries" and a single page with both arrows disabled. */
export const Empty: Story = {
  render: () => <FinTableFooter className={styles.wide} totalRows={0} rowsPerPage={10} />,
};

/** A narrow table: the pagination wraps onto a second line. */
export const Narrow: Story = {
  render: () => <FinTableFooter className={styles.narrow} totalRows={45} rowsPerPage={10} />,
};
