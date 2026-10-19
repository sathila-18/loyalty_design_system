import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinCheckbox } from './FinCheckbox';

const TEXT = 'Send members a monthly points summary';

describe('FinCheckbox', () => {
  it('is a checkbox named by its visible text, shown in a Text Box description', () => {
    render(<FinCheckbox>{TEXT}</FinCheckbox>);
    const box = screen.getByRole('checkbox', { name: TEXT });
    expect(box).not.toBeChecked();
    const text = screen.getByText(TEXT);
    expect(text.tagName).toBe('P');
    expect(box).toHaveAttribute('aria-labelledby', text.closest('[id]')!.id);
  });

  it('toggles with a click on the box, a click on the text, and Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinCheckbox onChange={onChange}>{TEXT}</FinCheckbox>);
    const box = screen.getByRole('checkbox');
    await user.click(box);
    expect(box).toBeChecked();
    await user.click(screen.getByText(TEXT));
    expect(box).not.toBeChecked();
    await user.keyboard(' ');
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('when disabled, ignores clicks on the text and greys it', async () => {
    const user = userEvent.setup();
    const { container } = render(<FinCheckbox disabled>{TEXT}</FinCheckbox>);
    await user.click(screen.getByText(TEXT));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(container.querySelector('[data-type]')).toHaveAttribute('data-disabled');
  });

  it('passes indeterminate to the checkbox', () => {
    render(<FinCheckbox indeterminate>{TEXT}</FinCheckbox>);
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });

  it('with the Text Box hidden, keeps the text as a hidden name', () => {
    render(<FinCheckbox showTextBox={false}>{TEXT}</FinCheckbox>);
    expect(screen.getByRole('checkbox', { name: TEXT })).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-labelledby');
  });

  it('forwards ref and input attributes to the input, className to the row', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <FinCheckbox ref={ref} name="prefs" value="summary" defaultChecked className="extra">
        {TEXT}
      </FinCheckbox>,
    );
    const box = screen.getByRole('checkbox');
    expect(ref.current).toBe(box);
    expect(box).toBeChecked();
    expect(box).toHaveAttribute('name', 'prefs');
    expect(box).toHaveAttribute('value', 'summary');
    expect(container.firstElementChild).toHaveClass('extra');
  });
});
