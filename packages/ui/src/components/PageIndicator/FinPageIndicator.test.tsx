import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinPageIndicator } from './FinPageIndicator';

function Controlled({ count = 5, initial = 2, onChange }: { count?: number; initial?: number; onChange?: (p: number) => void }) {
  const [active, setActive] = useState(initial);
  return (
    <FinPageIndicator
      count={count}
      active={active}
      onChange={(p) => {
        setActive(p);
        onChange?.(p);
      }}
    />
  );
}

describe('FinPageIndicator', () => {
  describe('display-only', () => {
    it('is one image named by the position, with the dots hidden', () => {
      const { container } = render(<FinPageIndicator count={5} active={2} />);
      const root = screen.getByRole('img', { name: 'Step 2 of 5' });
      expect(root).toBe(container.firstElementChild);
      expect(root.querySelectorAll('[aria-hidden="true"]')).toHaveLength(5);
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('marks only the active position as selected', () => {
      const { container } = render(<FinPageIndicator count={4} active={3} />);
      const selected = [...container.querySelectorAll('[aria-hidden="true"] > span')].map((d) => d.hasAttribute('data-selected'));
      expect(selected).toEqual([false, false, true, false]);
    });

    it('takes a label', () => {
      render(<FinPageIndicator count={3} active={1} label="Slide 1 of 3: Welcome" />);
      expect(screen.getByRole('img', { name: 'Slide 1 of 3: Welcome' })).toBeInTheDocument();
    });

    it('has no maximum and keeps active in range', () => {
      const { container } = render(<FinPageIndicator count={12} active={40} />);
      expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(12);
      expect(screen.getByRole('img', { name: 'Step 12 of 12' })).toBeInTheDocument();
    });

    it('renders nothing for a count of 0', () => {
      const { container } = render(<FinPageIndicator count={0} active={1} />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('clickable', () => {
    it('is a radio group with one checked, focusable radio per position', () => {
      render(<FinPageIndicator count={3} active={2} onChange={() => {}} />);
      expect(screen.getByRole('radiogroup', { name: 'Steps' })).toBeInTheDocument();
      const radios = screen.getAllByRole('radio');
      expect(radios.map((r) => r.getAttribute('aria-label'))).toEqual(['Step 1 of 3', 'Step 2 of 3', 'Step 3 of 3']);
      expect(radios.map((r) => r.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false']);
      expect(radios.map((r) => r.tabIndex)).toEqual([-1, 0, -1]);
      for (const r of radios) expect(r.tagName).toBe('BUTTON');
    });

    it('calls onChange with the clicked position', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<FinPageIndicator count={4} active={1} onChange={onChange} />);
      await user.click(screen.getByRole('radio', { name: 'Step 3 of 4' }));
      expect(onChange).toHaveBeenCalledWith(3);
    });

    it('is one tab stop; arrows, Home and End move, select and focus, wrapping at the ends', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<Controlled count={5} initial={2} onChange={onChange} />);
      await user.tab();
      expect(screen.getByRole('radio', { name: 'Step 2 of 5' })).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: 'Step 3 of 5' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Step 3 of 5' })).toHaveAttribute('aria-checked', 'true');
      await user.keyboard('{End}');
      expect(screen.getByRole('radio', { name: 'Step 5 of 5' })).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: 'Step 1 of 5' })).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('radio', { name: 'Step 5 of 5' })).toHaveFocus();
      await user.keyboard('{Home}');
      expect(onChange.mock.calls.map((c) => c[0])).toEqual([3, 5, 1, 5, 1]);
      await user.tab();
      expect(document.body).toHaveFocus();
    });

    it('takes a group label and dot labels', () => {
      render(<FinPageIndicator count={2} active={1} onChange={() => {}} label="Slides" dotLabel={(p) => `Go to slide ${p}`} />);
      expect(screen.getByRole('radiogroup', { name: 'Slides' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Go to slide 2' })).toBeInTheDocument();
    });
  });

  it('passes className and other attributes to the root', () => {
    render(<FinPageIndicator count={3} active={1} className="extra" data-testid="pi" />);
    expect(screen.getByTestId('pi')).toHaveClass('extra');
  });
});
