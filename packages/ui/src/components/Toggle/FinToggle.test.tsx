import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinToggle } from './FinToggle';

describe('FinToggle', () => {
  it('is a switch named by its visually hidden label, small and off by default', () => {
    const { container } = render(<FinToggle label="Email notifications" />);
    const toggle = screen.getByRole('switch', { name: 'Email notifications' });
    expect(toggle).not.toBeChecked();
    expect(toggle).toHaveAttribute('type', 'checkbox');
    expect(container.firstElementChild).toHaveAttribute('data-size', 'small');
  });

  it('toggles on click and with Space (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(<FinToggle label="Dark mode" />);
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    expect(toggle).toBeChecked();
    await user.keyboard(' ');
    expect(toggle).not.toBeChecked();
  });

  it('toggles when the visible area (label wrapper) is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<FinToggle label="Dark mode" />);
    await user.click(container.querySelector('[aria-hidden="true"]')!);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('works controlled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    function Controlled() {
      const [on, setOn] = useState(true);
      return (
        <FinToggle
          label="Auto-renew"
          checked={on}
          onChange={(e) => {
            setOn(e.target.checked);
            onChange(e.target.checked);
          }}
        />
      );
    }
    render(<Controlled />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeChecked();
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('is skipped and inert when disabled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <>
        <FinToggle label="Locked" disabled defaultChecked onChange={onChange} />
        <button type="button">Next</button>
      </>,
    );
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeDisabled();
    await user.click(toggle);
    expect(toggle).toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it('is reachable with Tab', async () => {
    const user = userEvent.setup();
    render(<FinToggle label="Email notifications" />);
    await user.tab();
    expect(screen.getByRole('switch')).toHaveFocus();
  });

  it('renders the large size', () => {
    const { container } = render(<FinToggle label="Large" size="large" />);
    expect(container.firstElementChild).toHaveAttribute('data-size', 'large');
  });

  it('forwards ref and native attributes to the input; className to the wrapper', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<FinToggle ref={ref} label="Name" name="notify" value="yes" className="extra" />);
    expect(ref.current).toBe(screen.getByRole('switch'));
    expect(ref.current).toHaveAttribute('name', 'notify');
    expect(container.firstElementChild).toHaveClass('extra');
  });
});
