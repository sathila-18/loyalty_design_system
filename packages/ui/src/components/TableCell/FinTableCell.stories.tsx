import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FinFlag } from '../../flags';
import { FinAvatar } from '../Avatar';
import { FIN_BADGE_TONES, type FinBadgeTone } from '../BadgeBase';
import { FinTableCell, type FinTableCellType } from './FinTableCell';
import styles from './FinTableCell.stories.module.css';

/** A cell is a `<td>`, so each story puts it in a one-row table. */
const Row = ({ children, className = styles.table }: { children: ReactNode; className?: string }) => (
  <table className={className}>
    <tbody>
      <tr>{children}</tr>
    </tbody>
  </table>
);

interface Args {
  type: FinTableCellType;
  leadingAccessories: boolean;
  showContent: boolean;
  content: string;
  badgeTone: FinBadgeTone;
  action: boolean;
  actionIcon: FinIconName;
}

/**
 * The badge's `disabled` tone is a disabled look kept as designed (DESIGN.md §9.10, decided 15 Oct 2026). Only
 * disabled badges are left out of the a11y check.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]'];

/** INTERNAL: part of the table (Table row, FinTable). Matches Figma's properties (DESIGN.md §9). */
const meta: Meta<Args> = {
  title: 'Internal/Table/Table cell',
  args: {
    type: 'default',
    leadingAccessories: true,
    showContent: true,
    content: 'Table cell text',
    badgeTone: 'primary',
    action: false,
    actionIcon: 'edit',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['default', 'badge', 'link'], description: 'Figma `Type`' },
    leadingAccessories: { control: 'boolean', description: 'Figma `Show leading accessories` (the row checkbox)' },
    showContent: { control: 'boolean', description: 'Figma `Show content`' },
    content: { control: 'text', description: 'Figma Content slot (text)' },
    badgeTone: {
      control: 'select',
      options: FIN_BADGE_TONES,
      description: 'Badge type: the nested Badge-primary `State`',
      if: { arg: 'type', eq: 'badge' },
    },
    action: { control: 'boolean', description: 'Figma `Show action button`' },
    actionIcon: {
      control: 'select',
      options: finIcons,
      description: 'Figma Action slot (the icon)',
      if: { arg: 'action' },
    },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ content, action, actionIcon, ...args }) => (
    <Row>
      {action ? (
        <FinTableCell {...args} href="#" action actionIcon={actionIcon} actionLabel="Edit">
          {content}
        </FinTableCell>
      ) : (
        <FinTableCell {...args} href="#">
          {content}
        </FinTableCell>
      )}
    </Row>
  ),
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Table - Cell page: Type Default, Badge and Link, each with the row checkbox. */
export const Types: Story = {
  name: 'Types (Figma)',
  render: () => (
    <Row>
      <FinTableCell>Table cell text</FinTableCell>
      <FinTableCell type="badge">Text here</FinTableCell>
      <FinTableCell type="link" href="#">
        Text here
      </FinTableCell>
    </Row>
  ),
};

/** Each type with the action button and without the checkbox, as in a table's data columns. */
export const WithAction: Story = {
  name: 'With action',
  render: () => (
    <Row>
      <FinTableCell leadingAccessories={false} action actionLabel="Edit name">
        Ann Perera
      </FinTableCell>
      <FinTableCell type="badge" badgeTone="success" leadingAccessories={false} action actionLabel="Edit status">
        Active
      </FinTableCell>
      <FinTableCell type="link" href="#" leadingAccessories={false} action actionIcon="visibility" actionLabel="View">
        View profile
      </FinTableCell>
    </Row>
  ),
};

/** The badge's nested `State`: every FinBadge tone. */
export const BadgeTones: Story = {
  name: 'Badge tones',
  render: () => (
    <Row>
      {FIN_BADGE_TONES.map((tone) => (
        <FinTableCell key={tone} type="badge" badgeTone={tone} leadingAccessories={false}>
          {tone}
        </FinTableCell>
      ))}
    </Row>
  ),
};

/** The select cell: only the checkbox (Show content off), as the first cell of a Table row. */
export const SelectCell: Story = {
  name: 'Select cell',
  render: () => (
    <Row>
      <FinTableCell showContent={false} checked onCheckedChange={() => undefined} />
      <FinTableCell leadingAccessories={false}>Ann Perera</FinTableCell>
    </Row>
  ),
};

/** Any other component goes in the Content slot as it is: here an avatar with a name, and a flag with a country. */
export const OtherContent: Story = {
  name: 'Other content',
  render: () => (
    <Row>
      <FinTableCell leadingAccessories={false}>
        <span className={styles.group}>
          <FinAvatar size="xsmall" initials="AP" />
          Ann Perera
        </span>
      </FinTableCell>
      <FinTableCell leadingAccessories={false}>
        <span className={styles.group}>
          <FinFlag country="LK" decorative />
          Sri Lanka
        </span>
      </FinTableCell>
    </Row>
  ),
};

/** Long text in a narrow, fixed column: one line, ending in "…". */
export const LongContent: Story = {
  name: 'Long content',
  render: () => (
    <Row className={`${styles.table} ${styles.fixed}`}>
      <FinTableCell leadingAccessories={false}>Loyalty member since 2019</FinTableCell>
    </Row>
  ),
};
