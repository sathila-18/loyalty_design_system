import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinSegmentBase } from './FinSegmentBase';

const icons = (root: Element) => [...root.querySelectorAll('[translate="no"]')] as HTMLElement[];

describe('FinSegmentBase', () => {
  it('is an unselected native button that does not submit forms, with just its label', () => {
    render(<FinSegmentBase>Monthly</FinSegmentBase>);
    const segment = screen.getByRole('button', { name: 'Monthly' });
    expect(segment).toHaveAttribute('type', 'button');
    expect(segment).not.toHaveAttribute('data-selected');
    expect(icons(segment)).toHaveLength(0);
  });

  it('marks Selected', () => {
    render(<FinSegmentBase selected>Monthly</FinSegmentBase>);
    expect(screen.getByRole('button')).toHaveAttribute('data-selected');
  });

  it('shows a decorative 20px leading icon before the label', () => {
    render(<FinSegmentBase leadingIcon="person">Members</FinSegmentBase>);
    const segment = screen.getByRole('button', { name: 'Members' });
    const [icon] = icons(segment);
    expect(icon).toHaveTextContent('person');
    expect(icon).toHaveAttribute('data-size', '20');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect([...segment.children].map((c) => c.textContent)).toEqual(['person', 'Members']);
  });

  it('is pressed with a click, Enter or Space, and not when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { unmount } = render(<FinSegmentBase onClick={onClick}>Monthly</FinSegmentBase>);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
    unmount();
    render(
      <FinSegmentBase onClick={onClick} disabled>
        Monthly
      </FinSegmentBase>,
    );
    await user.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('passes ref, className and attributes (such as the role a group gives it) to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <FinSegmentBase ref={ref} className="extra" role="radio" aria-checked="true" selected>
        Monthly
      </FinSegmentBase>,
    );
    const segment = screen.getByRole('radio', { name: 'Monthly', checked: true });
    expect(ref.current).toBe(segment);
    expect(segment).toHaveClass('extra');
  });
});
