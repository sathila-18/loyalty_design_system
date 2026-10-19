import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinAssistChip } from './FinAssistChip';

const icons = (root: Element) => [...root.querySelectorAll('[translate="no"]')].map((i) => i.textContent);

describe('FinAssistChip', () => {
  it('is a small button with the Unselected-border look', () => {
    render(<FinAssistChip>Last 30 days</FinAssistChip>);
    const chip = screen.getByRole('button', { name: 'Last 30 days' });
    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('data-variant', 'unselected-border');
    expect(chip).toHaveAttribute('data-size', 'small');
    expect(chip).not.toHaveAttribute('aria-haspopup');
  });

  it('runs its action on click, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<FinAssistChip onClick={onClick}>Export</FinAssistChip>);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('with a dropdown, shows the down arrow and says it opens a popup', () => {
    render(
      <FinAssistChip dropdown leadingIcon="person">
        Owner
      </FinAssistChip>,
    );
    const chip = screen.getByRole('button', { name: 'Owner' });
    expect(chip).toHaveAttribute('aria-haspopup', 'true');
    expect(icons(chip)).toEqual(['person', 'keyboard_arrow_down']);
  });

  it('while its menu is open, has the Selected look and is announced as expanded', () => {
    const { rerender } = render(
      <FinAssistChip dropdown expanded aria-haspopup="dialog">
        Date range
      </FinAssistChip>,
    );
    const chip = screen.getByRole('button');
    expect(chip).toHaveAttribute('data-variant', 'selected');
    expect(chip).toHaveAttribute('aria-expanded', 'true');
    expect(chip).toHaveAttribute('aria-haspopup', 'dialog');
    rerender(
      <FinAssistChip dropdown expanded={false}>
        Date range
      </FinAssistChip>,
    );
    expect(chip).toHaveAttribute('data-variant', 'unselected-border');
    expect(chip).toHaveAttribute('aria-expanded', 'false');
  });

  it('when disabled, is skipped by Tab and does not run', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <FinAssistChip disabled onClick={onClick}>
        Export
      </FinAssistChip>,
    );
    await user.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('data-disabled');
  });

  it('forwards ref and attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <FinAssistChip ref={ref} size="xsmall" className="extra" aria-describedby="hint">
        Export
      </FinAssistChip>,
    );
    const chip = screen.getByRole('button');
    expect(ref.current).toBe(chip);
    expect(chip).toHaveClass('extra');
    expect(chip).toHaveAttribute('data-size', 'xsmall');
    expect(chip).toHaveAttribute('aria-describedby', 'hint');
  });
});
