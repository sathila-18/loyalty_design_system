import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinTextArea } from './FinTextArea';

describe('FinTextArea', () => {
  it('is a text area named by its label, 4 rows by default, with an empty placeholder when none is given', () => {
    render(<FinTextArea label="Description" />);
    const area = screen.getByRole('textbox', { name: 'Description' });
    expect(area.tagName).toBe('TEXTAREA');
    expect(area).toHaveAttribute('rows', '4');
    expect(area).toHaveAttribute('placeholder', ' ');
    expect(area).not.toHaveAttribute('aria-invalid');
  });

  it('takes the placeholder, rows and maxRows', () => {
    const { container } = render(<FinTextArea label="Description" placeholder="Describe the offer" rows={3} maxRows={6} />);
    const area = screen.getByRole('textbox');
    expect(area).toHaveAttribute('placeholder', 'Describe the offer');
    expect(area).toHaveAttribute('rows', '3');
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--text-area-rows')).toBe('3');
    expect(root.style.getPropertyValue('--text-area-max-rows')).toBe('6');
  });

  it('never grows to fewer lines than it starts with', () => {
    const { container } = render(<FinTextArea label="Description" rows={5} maxRows={2} />);
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--text-area-max-rows')).toBe('5');
  });

  it('links the helper text, and shows the error look and icon with error', () => {
    const { container, rerender } = render(<FinTextArea label="Description" helperText="Shown at the reward catalog" />);
    const area = screen.getByRole('textbox');
    expect(area).toHaveAccessibleDescription('Shown at the reward catalog');
    expect(container.querySelector('[translate="no"]')).toBeNull();
    rerender(<FinTextArea label="Description" helperText="Enter a description" error />);
    expect(area).toHaveAttribute('aria-invalid', 'true');
    expect(container.firstElementChild).toHaveAttribute('data-error');
    expect(container.querySelector('[translate="no"]')).toHaveTextContent('warning');
  });

  it('is disabled without the error look', () => {
    const { container } = render(<FinTextArea label="Description" helperText="Help" error disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(container.firstElementChild).toHaveAttribute('data-disabled');
    expect(container.firstElementChild).not.toHaveAttribute('data-error');
    expect(container.querySelector('[translate="no"]')).toBeNull();
  });

  it('types, keeps new lines, and forwards ref, onInput and other attributes', async () => {
    const ref = createRef<HTMLTextAreaElement>();
    const onInput = vi.fn();
    render(<FinTextArea ref={ref} label="Description" onInput={onInput} name="description" maxLength={500} />);
    const area = screen.getByRole('textbox');
    await userEvent.type(area, 'Line one{Enter}Line two');
    expect(area).toHaveValue('Line one\nLine two');
    expect(onInput).toHaveBeenCalled();
    expect(ref.current).toBe(area);
    expect(area).toHaveAttribute('name', 'description');
    expect(area).toHaveAttribute('maxlength', '500');
  });

  it('can hide the label and still be named by it', () => {
    render(<FinTextArea label="Notes" showLabel={false} />);
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAttribute('data-label-hidden');
  });
});
