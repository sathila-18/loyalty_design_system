import type { Meta, StoryObj } from '@storybook/react-vite';
import { finIcons, type FinIconName } from '../../icons/finIcons';
import { FIN_BADGE_TONES, type FinBadgeTone } from '../BadgeBase';
import { FinBadge } from './FinBadge';
import styles from './FinBadge.stories.module.css';

const TONES = FIN_BADGE_TONES;
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const NONE = '(none)';
const ICON_OPTIONS = [NONE, ...finIcons];
const icon = (value: string) => (value === NONE ? undefined : (value as FinIconName));

/**
 * The `disabled` tone is a disabled look (2.44:1 Light, 1.98:1 Dark), kept as designed (DESIGN.md §9.10,
 * decided 15 Oct 2026). Only disabled badges are left out of the a11y check; every other tone is checked.
 */
const KNOWN_CONTRAST_ISSUES = ['[data-tone="disabled"]'];

type Args = { tone: FinBadgeTone; label: string; leadingIcon: string; trailingIcon: string };

const meta: Meta<Args> = {
  title: 'Components/Badge/Badge',
  args: { tone: 'primary', label: 'Text here', leadingIcon: NONE, trailingIcon: NONE },
  argTypes: {
    tone: { control: 'select', options: TONES, description: 'Figma `State`' },
    label: { control: 'text', description: 'The badge text (`children`)' },
    leadingIcon: { control: 'select', options: ICON_OPTIONS, description: 'Optional leading icon, in the tone’s text color' },
    trailingIcon: { control: 'select', options: ICON_OPTIONS, description: 'Optional trailing icon, in the tone’s text color' },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
  render: ({ tone, label, leadingIcon, trailingIcon }) => {
    const lead = icon(leadingIcon);
    const trail = icon(trailingIcon);
    return (
      <FinBadge tone={tone} {...(lead ? { leadingIcon: lead } : {})} {...(trail ? { trailingIcon: trail } : {})}>
        {label}
      </FinBadge>
    );
  },
};
export default meta;

type Story = StoryObj<Args>;

export const Playground: Story = {};

/** The Figma Badge-primary page: every State (tone), and each tone with a leading and a trailing icon. */
export const States: Story = {
  name: 'States (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      <span>Figma</span>
      <span>Leading icon</span>
      <span>Trailing icon</span>
      {TONES.map((tone) => [
        <span key={tone} className={styles.rowLabel}>
          {title(tone)}
        </span>,
        <FinBadge key={`${tone}-plain`} tone={tone}>
          Text here
        </FinBadge>,
        <FinBadge key={`${tone}-lead`} tone={tone} leadingIcon="check_circle">
          Text here
        </FinBadge>,
        <FinBadge key={`${tone}-trail`} tone={tone} trailingIcon="keyboard_arrow_down">
          Text here
        </FinBadge>,
      ])}
    </div>
  ),
};
