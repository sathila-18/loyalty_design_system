import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinTextField } from './FinTextField';

describe('FinTextField', () => {
  it('is a text input named by its label, with its helper text', () => {
    render(<FinTextField label="First name" placeholder="Your first name" helperText="As on your ID" />);
    const input = screen.getByRole('textbox', { name: 'First name' });
    expect(input).toHaveAttribute('placeholder', 'Your first name');
    expect(input).toHaveAccessibleDescription(/As on your ID/);
  });

  it('shows the trailing icon only when given, 20 when small', () => {
    const { rerender } = render(<FinTextField label="Name" />);
    expect(screen.queryByText('person')).toBeNull();
    rerender(<FinTextField label="Name" trailingIcon="person" />);
    expect(screen.getByText('person')).toHaveAttribute('data-size', '24');
    rerender(<FinTextField label="Name" trailingIcon="person" size="small" />);
    expect(screen.getByText('person')).toHaveAttribute('data-size', '20');
  });

  it('with an error, is invalid', () => {
    render(<FinTextField label="Email" error helperText="Enter a valid email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('gives its ref and other attributes to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FinTextField ref={ref} label="Email" type="email" name="email" />);
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(ref.current).toHaveAttribute('type', 'email');
  });

  describe('mobile number', () => {
    it('is a phone input with the country’s dial code', () => {
      render(<FinTextField variant="mobile-number" label="Mobile number" />);
      expect(screen.getByRole('textbox', { name: 'Mobile number' })).toHaveAttribute('type', 'tel');
      expect(screen.getByText('+94')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Country, Sri Lanka' })).toBeInTheDocument();
    });

    it('follows the chosen country', () => {
      const { rerender } = render(<FinTextField variant="mobile-number" label="Mobile number" country="GB" />);
      expect(screen.getByText('+44')).toBeInTheDocument();
      rerender(<FinTextField variant="mobile-number" label="Mobile number" country="AE" />);
      expect(screen.getByText('+971')).toBeInTheDocument();
    });

    it('changes the country from its menu, and the dial code with it (uncontrolled)', async () => {
      const user = userEvent.setup();
      const onCountryChange = vi.fn();
      render(<FinTextField variant="mobile-number" label="Mobile number" onCountryChange={onCountryChange} />);
      await user.click(screen.getByRole('button', { name: 'Country, Sri Lanka' }));
      await user.type(screen.getByRole('searchbox'), 'united kingdom{Enter}');
      expect(onCountryChange).toHaveBeenCalledWith('GB');
      expect(screen.getByRole('button', { name: 'Country, United Kingdom' })).toBeInTheDocument();
      expect(screen.getByText('+44')).toBeInTheDocument();
    });
  });

  describe('payment', () => {
    it('is a card number input that groups the digits as they are typed', async () => {
      const user = userEvent.setup();
      render(<FinTextField variant="payment" label="Card number" />);
      const input = screen.getByRole('textbox', { name: 'Card number' });
      expect(input).toHaveAttribute('inputmode', 'numeric');
      expect(input).toHaveAttribute('autocomplete', 'cc-number');
      await user.type(input, '4242424242424242');
      expect(input).toHaveValue('4242 4242 4242 4242');
    });

    it('shows the default card until the brand is known, then its logo', async () => {
      const user = userEvent.setup();
      render(<FinTextField variant="payment" label="Card number" />);
      expect(screen.getByRole('img', { name: 'Card' })).toBeInTheDocument();
      await user.type(screen.getByRole('textbox'), '37');
      expect(screen.getByRole('img', { name: 'American Express' })).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveValue('37');
    });

    it('takes another brand from paymentMethod', () => {
      render(<FinTextField variant="payment" label="Card number" paymentMethod="mastercard" defaultValue="4242" />);
      expect(screen.getByRole('img', { name: 'Mastercard' })).toBeInTheDocument();
    });

    it('formats a starting value, and works controlled', async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = useState('42424242');
        return <FinTextField variant="payment" label="Card number" value={value} onChange={(event) => setValue(event.target.value)} />;
      }
      render(<Controlled />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('4242 4242');
      await user.type(input, '42');
      expect(input).toHaveValue('4242 4242 42');
      expect(screen.getByRole('img', { name: 'Visa' })).toBeInTheDocument();
    });
  });
});
