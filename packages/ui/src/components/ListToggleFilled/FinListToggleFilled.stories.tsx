import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FinListItemSize } from '../ListItem';
import type { FinListToggleLeading } from '../ListToggle';
import { FinListToggleFilled } from './FinListToggleFilled';
import styles from './FinListToggleFilled.stories.module.css';

/** Disabled cards are greyed on purpose (as List-standard, DESIGN.md §10 #3) and left out of the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-disabled]'];

interface Args {
  state: 'off' | 'on' | 'disabled';
  leadingAccessory: FinListToggleLeading;
  description: boolean;
  size: FinListItemSize;
}

/** Toggle cards: the toggle list on List_fill-base; on has no edge or fill. Code first (DESIGN.md §10 #56). */
const meta: Meta<Args> = {
  title: 'Components/List/Filled/List toggle',
  args: { state: 'off', leadingAccessory: 'none', description: true, size: 'large' },
  argTypes: {
    state: { control: 'inline-radio', options: ['off', 'on', 'disabled'], description: 'State (Hovered is the mouse)' },
    leadingAccessory: { control: 'inline-radio', options: ['none', 'icon'], description: 'Leading accessory' },
    description: { control: 'boolean', description: 'Description' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Size' },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: function Playground({ state, leadingAccessory, description, size }) {
    const [on, setOn] = useState(state === 'on');
    return (
      <ul className={styles.list}>
        <FinListToggleFilled
          key={state}
          as="li"
          title="Title here"
          leadingAccessory={leadingAccessory}
          size={size}
          checked={on}
          onCheckedChange={setOn}
          disabled={state === 'disabled'}
          {...(description ? { description: 'Placeholder description here' } : {})}
        />
      </ul>
    );
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** Off, on and disabled, without and with the icon. */
export const States: Story = {
  render: () => (
    <div className={styles.row}>
      {(['none', 'icon'] as const).map((leading) => (
        <ul key={leading} className={styles.list}>
          <FinListToggleFilled as="li" title="Title here" description="Placeholder description here" leadingAccessory={leading} />
          <FinListToggleFilled as="li" title="Title here" description="Placeholder description here" leadingAccessory={leading} defaultChecked />
          <FinListToggleFilled as="li" title="Title here" leadingAccessory={leading} defaultChecked disabled />
        </ul>
      ))}
    </div>
  ),
};

/** A settings list of cards: click a card or Tab to it and press Space. */
export const Settings: Story = {
  render: function Settings() {
    const [settings, setSettings] = useState({ email: true, sms: false });
    return (
      <ul className={styles.list}>
        <FinListToggleFilled as="li" title="Email" description="Tier changes and monthly statements" leadingAccessory="icon" checked={settings.email} onCheckedChange={(on) => setSettings((s) => ({ ...s, email: on }))} />
        <FinListToggleFilled as="li" title="SMS" description="Points earned and redeemed" leadingAccessory="icon" checked={settings.sms} onCheckedChange={(on) => setSettings((s) => ({ ...s, sms: on }))} />
      </ul>
    );
  },
};
