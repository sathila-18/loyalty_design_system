import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinStepper } from './FinStepper';

const STEPS = ['Reward', 'Rules', 'Eligibility', 'UX'];

describe('FinStepper', () => {
  it('is a named ordered list with done, current and upcoming steps', () => {
    render(<FinStepper steps={STEPS} current={2} />);
    const list = screen.getByRole('list', { name: 'Steps' });
    const items = within(list).getAllByRole('listitem');
    expect(items.map((item) => item.getAttribute('data-state'))).toEqual(['done', 'done', 'current', 'upcoming']);
    expect(items[2]).toHaveAttribute('aria-current', 'step');
    expect(items[0]).not.toHaveAttribute('aria-current');
    expect(items[0]).toHaveTextContent('Reward, completed');
    expect(items[3]).toHaveTextContent('UX, not started');
    expect(items[2]).toHaveTextContent(/^3Eligibility$/);
  });

  it('shows a checkmark for done steps and the number for the others', () => {
    render(<FinStepper steps={STEPS} current={1} />);
    const items = screen.getAllByRole('listitem');
    expect(items[0]!.querySelector('[translate="no"]')).toHaveTextContent('check');
    expect(items[1]!.querySelector('[translate="no"]')).toBeNull();
    expect(items[1]).toHaveTextContent(/^2Rules$/);
  });

  it('makes done steps buttons with onStepClick, and only them', async () => {
    const onStepClick = vi.fn();
    render(<FinStepper steps={STEPS} current={2} onStepClick={onStepClick} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    await userEvent.click(screen.getByRole('button', { name: 'Rules, completed' }));
    expect(onStepClick).toHaveBeenCalledWith(1);
    screen.getByRole('button', { name: 'Reward, completed' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(onStepClick).toHaveBeenLastCalledWith(0);
  });

  it('has no buttons without onStepClick, and takes its own names', () => {
    render(<FinStepper steps={STEPS} current={1} label="Add reward steps" stateLabels={{ done: 'done', upcoming: 'to do' }} className="extra" />);
    expect(screen.queryByRole('button')).toBeNull();
    const list = screen.getByRole('list', { name: 'Add reward steps' });
    expect(list).toHaveClass('extra');
    expect(within(list).getAllByRole('listitem')[0]).toHaveTextContent('Reward, done');
    expect(within(list).getAllByRole('listitem')[3]).toHaveTextContent('UX, to do');
  });

  it('hugs its steps by default and takes width="fill"', () => {
    const { rerender } = render(<FinStepper steps={STEPS} current={0} />);
    expect(screen.getByRole('list')).toHaveAttribute('data-width', 'hug');
    rerender(<FinStepper steps={STEPS} current={0} width="fill" />);
    expect(screen.getByRole('list')).toHaveAttribute('data-width', 'fill');
  });

  it('makes every step but the current one done with doneSteps="all"', async () => {
    const onStepClick = vi.fn();
    render(<FinStepper steps={STEPS} current={1} doneSteps="all" onStepClick={onStepClick} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.getAttribute('data-state'))).toEqual(['done', 'current', 'done', 'done']);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    await userEvent.click(screen.getByRole('button', { name: 'UX, completed' }));
    expect(onStepClick).toHaveBeenCalledWith(3);
  });
});
