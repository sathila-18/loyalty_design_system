import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { finFlags, type FinFlagCountry } from '../../flags/finFlags';
import { FinCountrySelector } from './FinCountrySelector';
import styles from './FinCountrySelector.stories.module.css';

const COUNTRIES = Object.keys(finFlags) as FinFlagCountry[];

/**
 * INTERNAL: part of the input field (Mobile number). The trigger only for now: the country menu comes once the List
 * component is built (DESIGN.md §9, decided 19 Oct 2026); hover and focus design come with the input field.
 */
const meta: Meta<typeof FinCountrySelector> = {
  title: 'Internal/Input field/Country selector',
  component: FinCountrySelector,
  args: { country: 'LK', label: 'Country', disabled: false },
  argTypes: {
    country: {
      control: 'select',
      options: COUNTRIES,
      labels: Object.fromEntries(COUNTRIES.map((c) => [c, `${c} - ${finFlags[c]}`])),
      description: 'The chosen country (ISO code)',
    },
    label: { control: 'text', description: 'What is being chosen, read before the country' },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof FinCountrySelector>;

export const Playground: Story = {};

/** The Figma Contry selecter (Sri Lanka), a few other countries, and disabled. */
export const Countries: Story = {
  render: () => (
    <div className={styles.row}>
      {(['LK', 'AE', 'GB', 'IN', 'JP'] as const).map((c) => (
        <FinCountrySelector key={c} country={c} />
      ))}
      <FinCountrySelector country="LK" disabled />
    </div>
  ),
};

/** Temporary focus: the default ring, drawn inside. Click an empty area here, then press Tab. */
export const Focused: Story = {
  render: () => <FinCountrySelector country="LK" />,
  play: async () => {
    await userEvent.tab();
  },
};
