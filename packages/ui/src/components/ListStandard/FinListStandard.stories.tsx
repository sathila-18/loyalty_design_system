import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import avatarSample from '../Avatar/avatar-sample.jpg';
import type { FinListItemSize } from '../ListItem';
import {
  FinListStandard,
  type FinListStandardBehavior,
  type FinListStandardLeading,
} from './FinListStandard';
import styles from './FinListStandard.stories.module.css';

type State = 'default' | 'selected' | 'disabled';

interface Args {
  state: State;
  size: FinListItemSize;
  description: boolean;
  chevron: boolean;
  leadingAccessory: FinListStandardLeading;
  caption: boolean;
  behavior: FinListStandardBehavior;
}

/**
 * Known contrast exceptions: Disabled rows are greyed on purpose (disabled content is exempt from WCAG contrast, but the
 * check can only tell for native disabled controls), so only `[data-disabled]` rows are left out. Accepted by design
 * (DESIGN.md §10 #3, 20 Oct 2026): the caption on a Selected row in Dark (`text-tertiary` on `bg-active`, 4.48:1), left
 * out in Dark only; the Selected+hovered description (3.80:1 Light), not part of the run (hover).
 */
const KNOWN_CONTRAST_ISSUES = ['li[data-disabled]', 'html[data-theme="dark"] li[data-selected] [data-thickness]'];

const meta: Meta<Args> = {
  title: 'Components/List/List standard',
  args: { state: 'default', size: 'large', description: true, chevron: false, leadingAccessory: 'none', caption: false, behavior: 'link' },
  argTypes: {
    state: { control: 'inline-radio', options: ['default', 'selected', 'disabled'], description: 'Figma `State` (Hovered is the mouse)' },
    size: { control: 'inline-radio', options: ['large', 'small'], description: 'Size (List-base, nested in Figma)' },
    description: { control: 'boolean', description: 'Figma `Description`' },
    chevron: { control: 'boolean', description: 'Figma `Chevron`' },
    leadingAccessory: { control: 'inline-radio', options: ['none', 'icon', 'flag', 'avatar'], description: 'Figma `Leading accessory` (Payment later)' },
    caption: { control: 'boolean', description: 'Figma `Trailing accessory=Caption`' },
    behavior: { control: 'inline-radio', options: ['static', 'link', 'button', 'option'], description: 'What the row does (per scenario)' },
  },
  parameters: { layout: 'padded', a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ state, description, caption, behavior, ...args }) => {
    const row = (
      <FinListStandard
        {...args}
        as="li"
        behavior={behavior}
        title="Title here"
        country="LK"
        avatar={{ src: avatarSample }}
        selected={state === 'selected'}
        disabled={state === 'disabled'}
        {...(behavior === 'link' ? { href: '#' } : {})}
        {...(description ? { description: 'Placeholder description here' } : {})}
        {...(caption ? { caption: 'Caption' } : {})}
      />
    );
    return behavior === 'option' ? (
      <ul className={styles.list} role="listbox" aria-label="Example">
        {row}
      </ul>
    ) : (
      <ul className={styles.list}>{row}</ul>
    );
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma List-standard page: each leading accessory, with and without a description, caption and chevron. */
export const Accessories: Story = {
  name: 'Accessories (Figma)',
  render: () => (
    <div className={styles.row}>
      <ul className={styles.list}>
        <FinListStandard as="li" title="Title here" description="Placeholder description here" />
        <FinListStandard as="li" title="Title here" leadingAccessory="icon" description="Placeholder description here" />
        <FinListStandard as="li" title="Title here" leadingAccessory="flag" country="LK" description="Placeholder description here" />
        <FinListStandard as="li" title="Title here" leadingAccessory="avatar" avatar={{ src: avatarSample }} description="Placeholder description here" />
      </ul>
      <ul className={styles.list}>
        <FinListStandard as="li" title="Title here" caption="Caption" chevron />
        <FinListStandard as="li" title="Title here" leadingAccessory="icon" caption="Caption" chevron />
        <FinListStandard as="li" title="Title here" leadingAccessory="flag" country="LK" caption="Caption" chevron />
        <FinListStandard as="li" title="Title here" leadingAccessory="avatar" avatar={{ src: avatarSample }} caption="Caption" chevron />
      </ul>
    </div>
  ),
};

/** Figma `State`: Default, Selected and Disabled (hover the link rows to see Hovered and Selected+hovered). */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <ul className={styles.list}>
      <FinListStandard as="li" behavior="link" href="#" title="Default" leadingAccessory="icon" description="Placeholder description here" caption="Caption" chevron />
      <FinListStandard as="li" behavior="link" href="#" title="Selected" leadingAccessory="icon" description="Placeholder description here" caption="Caption" chevron selected />
      <FinListStandard as="li" behavior="link" href="#" title="Disabled" leadingAccessory="icon" description="Placeholder description here" caption="Caption" chevron disabled />
    </ul>
  ),
};

/** Size Large and Small (List-base's sizes). */
export const Sizes: Story = {
  render: () => (
    <div className={styles.row}>
      <ul className={styles.list}>
        <FinListStandard as="li" title="Large" leadingAccessory="icon" description="Placeholder description here" chevron />
      </ul>
      <ul className={styles.list}>
        <FinListStandard as="li" size="small" title="Small" leadingAccessory="icon" description="Placeholder description here" chevron />
      </ul>
    </div>
  ),
};

/** Per scenario: links that navigate, buttons that act, and options that are chosen (a country picker). */
export const Behaviors: Story = {
  render: function Behaviors() {
    const [country, setCountry] = useState('LK');
    const [last, setLast] = useState('none');
    const countries = [
      { code: 'LK', name: 'Sri Lanka' },
      { code: 'IN', name: 'India' },
      { code: 'MV', name: 'Maldives' },
    ] as const;
    return (
      <>
        <div className={styles.row}>
          <ul className={styles.list} aria-label="Links">
            <FinListStandard as="li" behavior="link" href="#" title="Members" description="All loyalty members" leadingAccessory="icon" chevron />
            <FinListStandard as="li" behavior="link" href="#" title="Tiers" description="Silver, Gold, Platinum" leadingAccessory="icon" icon="check_circle" chevron />
          </ul>
          <ul className={styles.list} aria-label="Actions">
            <FinListStandard as="li" behavior="button" title="Export members" caption="CSV" onClick={() => setLast('Export members')} />
            <FinListStandard as="li" behavior="button" title="Archive program" disabled onClick={() => setLast('Archive program')} />
          </ul>
          <ul className={styles.list} role="listbox" aria-label="Country">
            {countries.map(({ code, name }) => (
              <FinListStandard
                key={code}
                as="li"
                behavior="option"
                size="small"
                title={name}
                leadingAccessory="flag"
                country={code}
                selected={country === code}
                onClick={() => setCountry(code)}
              />
            ))}
          </ul>
        </div>
        <p className={styles.readout}>
          Country: {country} · Last action: {last}
        </p>
      </>
    );
  },
};
