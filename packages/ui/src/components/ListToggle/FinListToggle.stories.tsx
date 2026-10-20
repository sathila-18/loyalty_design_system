import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { FinListItemSize } from '../ListItem';
import { FinListToggle, type FinListToggleLeading } from './FinListToggle';
import styles from './FinListToggle.stories.module.css';

/** Disabled rows are greyed on purpose (as List-standard, DESIGN.md §10 #3) and left out of the a11y check. */
const KNOWN_CONTRAST_ISSUES = ['[data-disabled]'];

interface Args {
  state: 'off' | 'on' | 'disabled';
  leadingAccessory: FinListToggleLeading;
  description: boolean;
  size: FinListItemSize;
}

/** Settings rows with a toggle. Matches Figma's properties (DESIGN.md §9). */
const meta: Meta<Args> = {
  title: 'Components/List/Plain/List toggle',
  args: { state: 'off', leadingAccessory: 'none', description: true, size: 'large' },
  argTypes: {
    state: { control: 'inline-radio', options: ['off', 'on', 'disabled'], description: 'Figma `State` (Selected is on; Hovered is the mouse)' },
    leadingAccessory: { control: 'inline-radio', options: ['none', 'icon'], description: 'Figma `Leading accessory`' },
    description: { control: 'boolean', description: 'Figma `Description`' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Size (List-base)' },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: function Playground({ state, leadingAccessory, description, size }) {
    const [on, setOn] = useState(state === 'on');
    return (
      <ul className={styles.list}>
        <FinListToggle
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

/** The Figma List-toggle page: off, on and disabled, without and with the icon. */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.row}>
      {(['none', 'icon'] as const).map((leading) => (
        <ul key={leading} className={styles.list}>
          <FinListToggle as="li" title="Title here" description="Placeholder description here" leadingAccessory={leading} />
          <FinListToggle as="li" title="Title here" description="Placeholder description here" leadingAccessory={leading} defaultChecked />
          <FinListToggle as="li" title="Title here" leadingAccessory={leading} defaultChecked disabled />
        </ul>
      ))}
    </div>
  ),
};

/** A real settings list: click a row or Tab to it and press Space. */
export const Settings: Story = {
  render: function Settings() {
    const [settings, setSettings] = useState({ email: true, sms: false, push: true });
    const set = (key: keyof typeof settings) => (on: boolean) => setSettings((s) => ({ ...s, [key]: on }));
    return (
      <ul className={styles.list}>
        <FinListToggle as="li" title="Email" description="Tier changes and monthly statements" leadingAccessory="icon" checked={settings.email} onCheckedChange={set('email')} />
        <FinListToggle as="li" title="SMS" description="Points earned and redeemed" leadingAccessory="icon" checked={settings.sms} onCheckedChange={set('sms')} />
        <FinListToggle as="li" title="Push notifications" leadingAccessory="icon" checked={settings.push} onCheckedChange={set('push')} />
      </ul>
    );
  },
};
