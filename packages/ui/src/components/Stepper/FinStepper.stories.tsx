import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FinStepper } from './FinStepper';

const STEPS = ['Reward', 'Rules', 'Eligibility', 'UX'];

interface Args {
  current: number;
  clickable: boolean;
}

/**
 * The steps of a multi-step form (code first, no Figma component; measured from the Add reward screens, DESIGN.md
 * §9). Done steps are green with a checkmark, the current step is purple, the upcoming ones grey; labels are centred
 * under their boxes. With `onStepClick`, done steps are buttons that go back to them.
 */
const meta: Meta<Args> = {
  title: 'Components/Stepper',
  args: { current: 0, clickable: true },
  argTypes: {
    current: { control: { type: 'range', min: 0, max: STEPS.length, step: 1 }, description: '`current` (4: every step done)' },
    clickable: { control: 'boolean', description: '`onStepClick` (done steps are buttons)' },
  },
  render: function Playground({ current, clickable }) {
    const [step, setStep] = useState(current);
    const [shown, setShown] = useState(current);
    // A new `current` from the controls wins.
    if (shown !== current) {
      setShown(current);
      setStep(current);
    }
    return <FinStepper steps={STEPS} current={step} {...(clickable ? { onStepClick: setStep } : {})} />;
  },
};
export default meta;
type Story = StoryObj<Args>;

/** The first step, as Figma's Reward screen (`367:19964`). */
export const Playground: Story = {};

/** The third step, as Figma's Eligibility screen (`402:33879`): two done steps (green, checked; click one to go back). */
export const Eligibility: Story = {
  args: { current: 2 },
};

/** Every step done. */
export const AllDone: Story = {
  name: 'All done',
  args: { current: 4 },
};

/** Longer labels stay centred under their boxes and wrap inside their columns (80 wide). */
export const LongLabels: Story = {
  name: 'Long labels',
  render: () => <FinStepper steps={['Basic details', 'Rules and limits', 'Who can claim this reward', 'Offer text']} current={1} />,
};
