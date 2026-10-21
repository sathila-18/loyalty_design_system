import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinIcon } from '../../icons/FinIcon';
import { FinInputBase } from './FinInputBase';

describe('FinInputBase', () => {
  it('is a text input named by its label, even while the label is hidden', () => {
    render(<FinInputBase label="First name" placeholder="Your first name" />);
    const input = screen.getByRole('textbox', { name: 'First name' });
    expect(input).toHaveAttribute('placeholder', 'Your first name');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('always has a placeholder, so the label can show once there is a value', () => {
    render(<FinInputBase label="First name" />);
    expect(screen.getByRole('textbox', { name: 'First name' })).toHaveAttribute('placeholder', ' ');
  });

  it('takes typing and reports changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FinInputBase label="First name" onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'Olivia');
    expect(screen.getByRole('textbox')).toHaveValue('Olivia');
    expect(onChange).toHaveBeenCalledTimes(6);
  });

  it('links the helper text to the input', () => {
    render(<FinInputBase label="Email" helperText="We'll send the receipt here" aria-describedby="other" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription(/We'll send the receipt here/);
    expect(screen.getByRole('textbox').getAttribute('aria-describedby')).toMatch(/^other .+-helper$/);
  });

  it('with an error, is invalid and its helper text is the error tone', () => {
    const { container } = render(<FinInputBase label="Email" helperText="Enter a valid email" error />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(container.querySelector('[data-tone="error"]')).toHaveTextContent('Enter a valid email');
  });

  it('disabled: the input is disabled and the error look is dropped', () => {
    const { container } = render(<FinInputBase label="Email" helperText="Help" error disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(container.firstElementChild).not.toHaveAttribute('data-error');
    expect(container.querySelector('[data-tone="disabled"]')).toBeInTheDocument();
  });

  it('shows the prefix, suffix and accessories', () => {
    render(
      <FinInputBase
        label="Amount"
        prefix="LKR"
        suffix="%"
        leading={<FinIcon name="credit_card" />}
        trailing={<FinIcon name="person" />}
      />,
    );
    expect(screen.getByText('LKR')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
    expect(screen.getByText('credit_card')).toBeInTheDocument();
    expect(screen.getByText('person')).toBeInTheDocument();
  });

  it('select shows a down chevron unless another trailing accessory is given', () => {
    const { rerender } = render(<FinInputBase label="Tier" variant="select" />);
    expect(screen.getByText('keyboard_arrow_down')).toBeInTheDocument();
    rerender(<FinInputBase label="Tier" variant="select" trailing={<FinIcon name="search" />} />);
    expect(screen.queryByText('keyboard_arrow_down')).toBeNull();
  });

  it('mobile number: the country selector comes first and reports clicks', async () => {
    const user = userEvent.setup();
    const onCountryClick = vi.fn();
    render(<FinInputBase label="Mobile number" variant="mobile-number" country="GB" onCountryClick={onCountryClick} />);
    await user.click(screen.getByRole('button', { name: 'Country, United Kingdom' }));
    expect(onCountryClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('textbox', { name: 'Mobile number' })).toBeInTheDocument();
  });

  it('another control can take the input’s place', () => {
    render(<FinInputBase label="Tier" variant="select" control={<button id="tier" type="button">Gold</button>} filled />);
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByRole('button', { name: 'Gold' })).toBeInTheDocument();
  });

  it('gives its ref and other attributes to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FinInputBase ref={ref} label="Email" type="email" name="email" />);
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(ref.current).toHaveAttribute('type', 'email');
    expect(ref.current).toHaveAttribute('name', 'email');
  });

  it('keeps the border, ring and notch away from screen readers', () => {
    const { container } = render(<FinInputBase label="Email" />);
    for (const fieldset of container.querySelectorAll('fieldset')) expect(fieldset).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('group')).toBeNull();
  });
});
