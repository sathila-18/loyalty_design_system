import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinFlag, type FinFlagShape, type FinFlagSize } from './FinFlag';
import { finFlags, type FinFlagCountry } from './finFlags';
import styles from './FinFlag.stories.module.css';

const SIZES: FinFlagSize[] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
const SHAPES: FinFlagShape[] = ['rectangle', 'circle'];
const COUNTRIES = Object.keys(finFlags) as FinFlagCountry[];

const meta: Meta<typeof FinFlag> = {
  title: 'Components/Flag',
  component: FinFlag,
  args: { country: 'LK', size: 'medium', shape: 'rectangle', disabled: false, decorative: false },
  argTypes: {
    country: {
      control: 'select',
      options: COUNTRIES,
      labels: Object.fromEntries(COUNTRIES.map((c) => [c, `${c} - ${finFlags[c]}`])),
      description: 'ISO 3166-1 alpha-2 code',
    },
    size: { control: 'inline-radio', options: SIZES, description: 'Figma Flag sizes `SIze`' },
    shape: { control: 'inline-radio', options: SHAPES, description: 'Figma Flag sizes `Type`' },
    disabled: { control: 'boolean', description: 'Figma Flag sizes `State=Disabled`' },
    decorative: { control: 'boolean', description: 'Next to a visible country name: hidden from screen readers' },
    label: { control: 'text', description: 'Alt text; default the country name' },
  },
};
export default meta;

type Story = StoryObj<typeof FinFlag>;

export const Playground: Story = {};

/** The Figma Flag sizes reference: every size, rectangle and circle, Default and Disabled (Bahrain and Sri Lanka, as Figma). */
export const Sizes: Story = {
  name: 'Sizes (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Rectangle</span>
      <span>Circle</span>
      <span>Rectangle, disabled</span>
      <span>Circle, disabled</span>
      {SIZES.map((size) => [
        <span key={`${size}-name`}>{size}</span>,
        <FinFlag key={`${size}-r`} country="BH" size={size} />,
        <FinFlag key={`${size}-c`} country="LK" shape="circle" size={size} />,
        <FinFlag key={`${size}-rd`} country="BH" size={size} disabled />,
        <FinFlag key={`${size}-cd`} country="LK" shape="circle" size={size} disabled />,
      ])}
    </div>
  ),
};

/** Next to its name (as in the country selector): the flag is decorative so the name is read once. */
export const WithName: Story = {
  name: 'With a name',
  render: () => (
    <ul className={styles.list}>
      {(['LK', 'GB', 'AE', 'JP'] as const).map((c) => (
        <li key={c} className={styles.item}>
          <FinFlag country={c} size="small" decorative />
          {finFlags[c]}
        </li>
      ))}
    </ul>
  ),
};

/** Every flag, rectangle and circle, to check the set at a glance (each loads as it's shown). */
export const AllFlags: Story = {
  name: 'All flags',
  render: () => (
    <div className={styles.grid}>
      {COUNTRIES.map((c) => (
        <span key={c} className={styles.cell} title={finFlags[c]}>
          <FinFlag country={c} />
          <FinFlag country={c} shape="circle" />
          <span className={styles.code}>{c}</span>
        </span>
      ))}
    </div>
  ),
};
