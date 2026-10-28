import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { FinButton } from '../Button';
import { FinSideSheet } from '../SideSheet';
import { FinStepper } from './FinStepper';

const STEPS = ['Reward', 'Rules', 'Eligibility', 'UX'];

interface Args {
  current: number;
  clickable: boolean;
  width: 'hug' | 'fill';
}

/**
 * The steps of a multi-step form (code first, no Figma component; measured from the Add reward screens, DESIGN.md
 * §9). Done steps are green with a checkmark, the current step is purple, the upcoming ones grey; labels are centred
 * under their boxes. With `onStepClick`, done steps are buttons that go back to them.
 */
const meta: Meta<Args> = {
  title: 'Components/Stepper',
  args: { current: 0, clickable: true, width: 'hug' },
  argTypes: {
    current: { control: { type: 'range', min: 0, max: STEPS.length, step: 1 }, description: '`current` (4: every step done)' },
    clickable: { control: 'boolean', description: '`onStepClick` (done steps are buttons)' },
    width: { control: 'inline-radio', options: ['hug', 'fill'], description: '`width` (code only: `fill` spreads the steps across the width)' },
  },
  render: function Playground({ current, clickable, width }) {
    const [step, setStep] = useState(current);
    const [shown, setShown] = useState(current);
    // A new `current` from the controls wins.
    if (shown !== current) {
      setShown(current);
      setStep(current);
    }
    return <FinStepper steps={STEPS} current={step} width={width} {...(clickable ? { onStepClick: setStep } : {})} />;
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

/** `doneSteps="all"` (code only), as Edit reward uses it: every step is filled in, so every other step is done and clickable. */
export const Editing: Story = {
  name: 'Editing (every step done)',
  render: function Editing() {
    const [step, setStep] = useState(1);
    return <FinStepper steps={STEPS} current={step} doneSteps="all" onStepClick={setStep} />;
  },
};

/**
 * `width="fill"` in a side sheet, as the Add reward sheet will use it (decided 28 Oct 2026): the boxes spread from
 * edge to edge of the sheet's body, whose width follows the window (535 at 1024 to 584 at 1920). Check it with the
 * viewport sizes.
 */
export const InASideSheet: Story = {
  name: 'Fill, in a side sheet',
  parameters: { controls: { disable: true } },
  render: function InASideSheet() {
    const [open, setOpen] = useState(true);
    const [step, setStep] = useState(1);
    return (
      <>
        <FinButton onClick={() => setOpen(true)}>Open side sheet</FinButton>
        <FinSideSheet
          open={open}
          onClose={() => setOpen(false)}
          title="Add reward"
          buttonDock={{
            secondaryButton: { label: 'Cancel', onClick: () => setOpen(false) },
            primaryButton: { label: 'Next', onClick: fn() },
          }}
        >
          <FinStepper steps={STEPS} current={step} width="fill" onStepClick={setStep} />
        </FinSideSheet>
      </>
    );
  },
};
