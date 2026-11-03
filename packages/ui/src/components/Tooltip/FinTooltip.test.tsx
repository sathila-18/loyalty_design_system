import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinButton } from '../Button';
import { FinTooltip } from './FinTooltip';

describe('FinTooltip', () => {
  it('describes its trigger, and is hidden until it opens', () => {
    render(
      <FinTooltip content="Edit the tier">
        <FinButton>Edit</FinButton>
      </FinTooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Edit' });
    expect(trigger).toHaveAccessibleDescription('Edit the tier');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('keeps the trigger’s own description and adds its own', () => {
    render(
      <>
        <p id="hint">Saved drafts</p>
        <FinTooltip content="Open drafts">
          <FinButton aria-describedby="hint">Drafts</FinButton>
        </FinTooltip>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Drafts' })).toHaveAccessibleDescription('Saved drafts Open drafts');
  });

  it('opens 250 ms after the pointer rests on the trigger, and closes when it leaves', async () => {
    vi.useFakeTimers();
    try {
      render(
        <FinTooltip content="Edit the tier">
          <FinButton>Edit</FinButton>
        </FinTooltip>,
      );
      const trigger = screen.getByRole('button', { name: 'Edit' });
      fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
      act(() => vi.advanceTimersByTime(200));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      act(() => vi.advanceTimersByTime(50));
      expect(screen.getByRole('tooltip')).toHaveTextContent('Edit the tier');
      fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
      act(() => vi.advanceTimersByTime(100));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('stays open while the pointer moves from the trigger onto the tooltip', () => {
    vi.useFakeTimers();
    try {
      render(
        <FinTooltip content="Edit the tier">
          <FinButton>Edit</FinButton>
        </FinTooltip>,
      );
      const trigger = screen.getByRole('button', { name: 'Edit' });
      fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
      act(() => vi.advanceTimersByTime(250));
      const tooltip = screen.getByRole('tooltip');
      fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
      fireEvent.pointerEnter(tooltip, { pointerType: 'mouse' });
      act(() => vi.advanceTimersByTime(500));
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      fireEvent.pointerLeave(tooltip, { pointerType: 'mouse' });
      act(() => vi.advanceTimersByTime(100));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('never opens on touch', () => {
    vi.useFakeTimers();
    try {
      render(
        <FinTooltip content="Edit the tier">
          <FinButton>Edit</FinButton>
        </FinTooltip>,
      );
      fireEvent.pointerEnter(screen.getByRole('button', { name: 'Edit' }), { pointerType: 'touch' });
      act(() => vi.advanceTimersByTime(1000));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('opens at once on keyboard focus, closes on Escape (focus stays) and on blur', async () => {
    const user = userEvent.setup();
    render(
      <>
        <FinTooltip content="Edit the tier">
          <FinButton>Edit</FinButton>
        </FinTooltip>
        <button type="button">After</button>
      </>,
    );
    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Edit' });
    expect(trigger).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Edit the tier');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await user.tab({ shift: true });
    await user.tab();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('closes when the trigger is pressed, and the trigger still gets its click', async () => {
    const onClick = vi.fn();
    render(
      <FinTooltip content="Edit the tier" defaultOpen>
        <FinButton onClick={onClick}>Edit</FinButton>
      </FinTooltip>,
    );
    const trigger = screen.getByRole('button', { name: 'Edit' });
    fireEvent.pointerDown(trigger, { pointerType: 'mouse' });
    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('shows the rich type as a Text Box (heading and description) and marks its type', () => {
    render(
      <FinTooltip type="rich" heading="Points expiry" description="Points expire 36 months after they're earned." defaultOpen>
        <FinButton>Expiry</FinButton>
      </FinTooltip>,
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveAttribute('data-type', 'rich');
    expect(tooltip).toHaveTextContent('Points expiry');
    expect(tooltip).toHaveTextContent("Points expire 36 months after they're earned.");
  });

  it('can be controlled, reporting what it asks for', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <FinTooltip content="Edit the tier" open={false} onOpenChange={onOpenChange}>
        <FinButton>Edit</FinButton>
      </FinTooltip>,
    );
    await user.tab();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    rerender(
      <FinTooltip content="Edit the tier" open onOpenChange={onOpenChange}>
        <FinButton>Edit</FinButton>
      </FinTooltip>,
    );
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('describesTrigger off (code only): no description on the trigger, and hidden from screen readers', () => {
    render(
      <FinTooltip content="Edit" describesTrigger={false} defaultOpen>
        <FinButton aria-label="Edit">E</FinButton>
      </FinTooltip>,
    );
    expect(screen.getByRole('button', { name: 'Edit' })).not.toHaveAccessibleDescription();
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
  });

  it('is the only one open: opening another closes it', async () => {
    const user = userEvent.setup();
    render(
      <>
        <FinTooltip content="First tip" defaultOpen>
          <FinButton>First</FinButton>
        </FinTooltip>
        <FinTooltip content="Second tip">
          <FinButton>Second</FinButton>
        </FinTooltip>
      </>,
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent('First tip');
    await user.hover(screen.getByRole('button', { name: 'Second' }));
    await waitFor(() => expect(screen.getAllByRole('tooltip').map((t) => t.textContent)).toEqual(['Second tip']));
  });
});
