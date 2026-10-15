import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinBadgeIndicator, type FinBadgeIndicatorSize, type FinBadgeIndicatorTone } from './FinBadgeIndicator';
import styles from './FinBadgeIndicator.stories.module.css';

const SIZES: FinBadgeIndicatorSize[] = ['small', 'large'];
const TONES: FinBadgeIndicatorTone[] = ['error', 'warning', 'success'];
const TONE_LABEL: Record<FinBadgeIndicatorTone, string> = { error: 'Red', warning: 'Yellow', success: 'Green' };
const DIGITS: { label: string; count: number | undefined }[] = [
  { label: 'Single', count: 3 },
  { label: 'Double', count: 120 },
  { label: 'None', count: undefined },
];

/**
 * Known contrast failures (DESIGN.md §10 #3, decided 15 Oct 2026: build as Figma, document the exceptions).
 * The number fails 4.5:1 on Light Yellow (3.24) and Green (3.64), and on Dark Red (3.97). Only those
 * badges are left out of the a11y check, in that theme; dots and every other combination are still checked.
 */
const KNOWN_CONTRAST_ISSUES = [
  'html[data-theme="light"] [data-tone="warning"]:is([data-shape="circle"], [data-shape="pill"])',
  'html[data-theme="light"] [data-tone="success"]:is([data-shape="circle"], [data-shape="pill"])',
  'html[data-theme="dark"] [data-tone="error"]:is([data-shape="circle"], [data-shape="pill"])',
];

const meta: Meta<typeof FinBadgeIndicator> = {
  title: 'Components/Badge/Badge indicator',
  component: FinBadgeIndicator,
  args: { count: 3, max: 99, tone: 'error', size: 'small' },
  argTypes: {
    count: { control: 'number', description: 'Empty: dot · 1–9: circle · 10+: pill · 0: hidden' },
    max: { control: 'number' },
    tone: { control: 'inline-radio', options: TONES },
    size: { control: 'inline-radio', options: SIZES },
    label: { control: 'text' },
  },
  parameters: { a11y: { context: { include: ['body'], exclude: KNOWN_CONTRAST_ISSUES } } },
};
export default meta;

type Story = StoryObj<typeof FinBadgeIndicator>;

export const Playground: Story = {};

/** The Figma Badge - indicator page: every Size, Digits and Style (tone). Double shows "99+" (count 120). */
export const Variants: Story = {
  name: 'Sizes, digits and tones (Figma)',
  render: () => (
    <div className={styles.table}>
      <span />
      {TONES.map((tone) => (
        <span key={tone}>{TONE_LABEL[tone]}</span>
      ))}
      {SIZES.map((size) =>
        DIGITS.map(({ label, count }) => [
          <span key={`${size}-${label}`} className={styles.rowLabel}>
            {size === 'small' ? 'Small' : 'Large'} · {label}
          </span>,
          ...TONES.map((tone) => (
            <FinBadgeIndicator key={`${size}-${label}-${tone}`} size={size} tone={tone} {...(count === undefined ? {} : { count })} />
          )),
        ]),
      )}
    </div>
  ),
};
