'use client';

import type { HTMLAttributes } from 'react';
import { FinIcon } from '../../icons/FinIcon';
import styles from './FinStepper.module.css';

/** A step's state: done (before the current step), current, or upcoming. */
export type FinStepState = 'done' | 'current' | 'upcoming';

export interface FinStepperProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children' | 'onChange'> {
  /** The steps' labels, in order ("Reward", "Rules"…). */
  steps: string[];
  /** The current step, from 0. The steps before it are done; the ones after it are upcoming. */
  current: number;
  /** Called with a done step's index when it's clicked: done steps become buttons, to go back to them. */
  onStepClick?: (index: number) => void;
  /** The list's name for screen readers (default "Steps"). */
  label?: string;
  /** What screen readers hear after a done or upcoming step's label (default "completed", "not started"). */
  stateLabels?: { done: string; upcoming: string };
  /**
   * Code only (decided 28 Oct 2026, for the Add reward side sheet): `fill` spreads the steps across the stepper's
   * width, the first box at the start and the last at the end. Default `hug`: columns 80 wide and 80 apart, as the
   * screens.
   */
  width?: 'hug' | 'fill';
  /**
   * Code only (decided 28 Oct 2026, for Edit reward, where every step is already filled in): `all` makes every step
   * but the current one done (green, and a button with `onStepClick`). Default `before`: only the steps before it.
   */
  doneSteps?: 'before' | 'all';
}

const stateOf = (index: number, current: number, doneSteps: 'before' | 'all'): FinStepState =>
  index === current ? 'current' : index < current || doneSteps === 'all' ? 'done' : 'upcoming';

/**
 * The steps of a multi-step form (code first, no Figma component: measured from the Add reward screens; DESIGN.md
 * §9): numbered 36 boxes in a row, their labels centred under them, joined by lines. Done steps are green with a
 * checkmark (decided by design 27 Oct 2026), the current step is purple, the upcoming ones grey. An ordered list; the
 * current step has `aria-current="step"`. With `onStepClick`, done steps are buttons that go back to them.
 */
export function FinStepper({
  steps,
  current,
  onStepClick,
  label = 'Steps',
  stateLabels = { done: 'completed', upcoming: 'not started' },
  width = 'hug',
  doneSteps = 'before',
  className,
  ...rest
}: FinStepperProps) {
  return (
    <ol
      {...rest}
      aria-label={label}
      data-width={width}
      className={className ? `${styles.stepper} ${className}` : styles.stepper}
    >
      {steps.map((step, index) => {
        const state = stateOf(index, current, doneSteps);
        const marker = (
          <>
            <span className={styles.box} aria-hidden="true">
              {state === 'done' ? <FinIcon name="check" size={20} color="success" /> : index + 1}
            </span>
            <span className={styles.label}>
              {step}
              {state !== 'current' && <span className={styles.hidden}>{`, ${stateLabels[state]}`}</span>}
            </span>
          </>
        );
        return (
          <li key={`${index}-${step}`} className={styles.step} data-state={state} {...(state === 'current' ? { 'aria-current': 'step' as const } : {})}>
            {state === 'done' && onStepClick ? (
              <button type="button" className={styles.button} onClick={() => onStepClick(index)}>
                {marker}
              </button>
            ) : (
              <span className={styles.content}>{marker}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
