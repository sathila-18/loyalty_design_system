import type { Meta, StoryObj } from '@storybook/react-vite';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FinBadgeBase, type FinBadgeBaseSize } from './FinBadgeBase';
import styles from './FinBadgeBase.stories.module.css';

const SIZES: FinBadgeBaseSize[] = ['small', 'large'];
const NONE = '(none)';
const ICON_OPTIONS = [NONE, ...finIcons];

/** Controls use a plain label and "(none)" for no icon; the component takes children and optional icon names. */
type Args = { size: FinBadgeBaseSize; label: string; leadingIcon: string; trailingIcon: string };
const icon = (value: string) => (value === NONE ? undefined : (value as FinIconName));

const meta: Meta<Args> = {
  title: 'Components/Badge/Badge base',
  args: { size: 'small', label: 'Text here', leadingIcon: NONE, trailingIcon: NONE },
  argTypes: {
    size: { control: 'inline-radio', options: SIZES },
    label: { control: 'text', description: 'The badge text (`children`)' },
    leadingIcon: { control: 'select', options: ICON_OPTIONS, description: 'Figma `Show Leading Icon` + the icon' },
    trailingIcon: { control: 'select', options: ICON_OPTIONS, description: 'Figma `Show Trailing Icon` + the icon' },
  },
  render: ({ size, label, leadingIcon, trailingIcon }) => {
    const lead = icon(leadingIcon);
    const trail = icon(trailingIcon);
    return (
      <FinBadgeBase size={size} {...(lead ? { leadingIcon: lead } : {})} {...(trail ? { trailingIcon: trail } : {})}>
        {label}
      </FinBadgeBase>
    );
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Badge-base page: Small and Large, with both icons (Figma's default), one, or none (code's default). */
export const Sizes: Story = {
  name: 'Sizes (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Both icons</span>
      <span>Leading only</span>
      <span>Trailing only</span>
      <span>No icons</span>
      {SIZES.map((size) => [
        <span key={size} className={styles.rowLabel}>
          {size === 'small' ? 'Small' : 'Large'}
        </span>,
        <FinBadgeBase key={`${size}-both`} size={size} leadingIcon="person" trailingIcon="person">
          Text here
        </FinBadgeBase>,
        <FinBadgeBase key={`${size}-lead`} size={size} leadingIcon="person">
          Text here
        </FinBadgeBase>,
        <FinBadgeBase key={`${size}-trail`} size={size} trailingIcon="person">
          Text here
        </FinBadgeBase>,
        <FinBadgeBase key={`${size}-none`} size={size}>
          Text here
        </FinBadgeBase>,
      ])}
    </div>
  ),
};

/** Long labels stay on one line and end in "…" when the container is narrower, like a table cell (decided 15 Oct 2026). */
export const LongLabel: Story = {
  name: 'Long label',
  render: () => (
    <div className={styles.cells}>
      {[240, 160, 96].map((width) => (
        <div key={width} className={styles.cell} data-width={width}>
          <span className={styles.cellLabel}>{width}px container</span>
          <FinBadgeBase leadingIcon="person">Awaiting approval from the finance team</FinBadgeBase>
          <FinBadgeBase size="large" leadingIcon="person">
            Awaiting approval from the finance team
          </FinBadgeBase>
        </div>
      ))}
    </div>
  ),
};
