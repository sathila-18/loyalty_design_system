import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent } from 'storybook/test';
import { finFlags, type FinFlagCountry } from '../../flags/finFlags';
import { FinCountrySelector } from './FinCountrySelector';
import styles from './FinCountrySelector.stories.module.css';

const COUNTRIES = Object.keys(finFlags) as FinFlagCountry[];

/**
 * INTERNAL: part of the input field (Mobile number). Opens the country menu: a small search (name, ISO code or dial
 * code), every country with its dial code, the chosen one Selected (DESIGN.md §9). On its own, the menu is as wide as
 * its content; in the field it takes the field's width.
 */
/** The dial code on the Selected row in Dark: the accepted List-standard caption exception (4.48:1, DESIGN.md §10 #3). */
const KNOWN_CONTRAST_ISSUES = ['html[data-theme="dark"] li[data-selected] [data-thickness]'];

const meta: Meta<typeof FinCountrySelector> = {
  title: 'Internal/Input field/Country selector',
  component: FinCountrySelector,
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  args: { country: 'LK', label: 'Country', showDialCodes: true, disabled: false },
  argTypes: {
    country: {
      control: 'select',
      options: COUNTRIES,
      labels: Object.fromEntries(COUNTRIES.map((c) => [c, `${c} - ${finFlags[c]}`])),
      description: 'The chosen country (ISO code)',
    },
    label: { control: 'text', description: 'What is being chosen, read before the country' },
    showDialCodes: { control: 'boolean', description: 'The dial codes in the menu, as captions' },
    onCountryChange: { control: false },
    menuAnchor: { control: false },
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof FinCountrySelector>;

/** Click the flag (or focus it and press Enter, Space or an arrow key) and choose a country. */
export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
  ],
  render: function Playground(args) {
    const [country, setCountry] = useState(args.country);
    return <FinCountrySelector key={args.country} {...args} country={country} onCountryChange={setCountry} />;
  },
};

/** The Figma Contry selecter (Sri Lanka), a few other countries, and disabled. */
export const Countries: Story = {
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
  render: () => <FinCountrySelector country="LK" />,
  play: async () => {
    await userEvent.tab();
  },
};
