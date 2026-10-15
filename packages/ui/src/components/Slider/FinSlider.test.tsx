import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinSlider } from './FinSlider';

const fraction = (el: HTMLElement) => el.style.getPropertyValue('--fraction');

describe('FinSlider', () => {
  it('is a slider named by its label, 0–100 by default, starting at min', () => {
    render(<FinSlider label="Points" />);
    const s = screen.getByRole('slider', { name: 'Points' });
    expect(s).toHaveAttribute('min', '0');
    expect(s).toHaveAttribute('max', '100');
    expect(s).toHaveAttribute('step', '1');
    expect(s).toHaveValue('0');
    expect(fraction(s)).toBe('0');
  });

  // Arrow keys / Page Up / Home / End are the browser's own range behaviour (jsdom doesn't simulate them);
  // they're checked in a real browser against Storybook (DESIGN.md §9).
  it('is reachable with Tab and starts at its default value', async () => {
    const user = userEvent.setup();
    render(<FinSlider label="Points" defaultValue={50} />);
    const s = screen.getByRole('slider');
    await user.tab();
    expect(s).toHaveFocus();
    expect(s).toHaveValue('50');
    expect(fraction(s)).toBe('0.5');
  });

  it('follows drags and track clicks (input events)', () => {
    render(<FinSlider label="Points" />);
    const s = screen.getByRole('slider');
    fireEvent.change(s, { target: { value: '80' } });
    expect(s).toHaveValue('80');
    expect(fraction(s)).toBe('0.8');
  });

  it('uses the screen’s range and step, controlled', () => {
    const onChange = vi.fn();
    function Controlled() {
      const [v, setV] = useState(1500);
      return (
        <FinSlider
          label="Points"
          min={500}
          max={5000}
          step={100}
          value={v}
          valueText={`${v} points`}
          onChange={(e) => {
            setV(Number(e.target.value));
            onChange(Number(e.target.value));
          }}
        />
      );
    }
    render(<Controlled />);
    const s = screen.getByRole('slider');
    expect(s).toHaveAttribute('aria-valuetext', '1500 points');
    expect(fraction(s)).toBe(String((1500 - 500) / 4500));
    fireEvent.change(s, { target: { value: '5000' } });
    expect(onChange).toHaveBeenCalledWith(5000);
    expect(s).toHaveAttribute('aria-valuetext', '5000 points');
    expect(fraction(s)).toBe('1');
  });

  it('clamps a controlled value to the range', () => {
    render(<FinSlider label="Points" value={140} onChange={() => {}} />);
    expect(screen.getByRole('slider')).toHaveValue('100');
  });

  it('is skipped when disabled', async () => {
    const user = userEvent.setup();
    render(
      <>
        <FinSlider label="Locked" disabled defaultValue={40} />
        <button type="button">Next</button>
      </>,
    );
    expect(screen.getByRole('slider')).toBeDisabled();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it('forwards ref and native attributes; merges style', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FinSlider ref={ref} label="P" name="points" className="extra" style={{ marginTop: 0 }} defaultValue={25} />);
    const s = screen.getByRole('slider');
    expect(ref.current).toBe(s);
    expect(s).toHaveAttribute('name', 'points');
    expect(s).toHaveClass('extra');
    expect(s.style.marginTop).toBe('0px');
    expect(fraction(s)).toBe('0.25');
  });
});
