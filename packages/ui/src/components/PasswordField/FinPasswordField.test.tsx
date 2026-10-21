import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinPasswordField } from './FinPasswordField';

const input = () => screen.getByLabelText('Password', { selector: 'input' });

describe('FinPasswordField', () => {
  it('is a hidden password input named by its label, for the saved password by default', () => {
    render(<FinPasswordField label="Password" helperText="At least 8 characters" />);
    expect(input()).toHaveAttribute('type', 'password');
    expect(input()).toHaveAttribute('autocomplete', 'current-password');
    expect(input()).toHaveAccessibleDescription(/At least 8 characters/);
  });

  it('the eye button names its action and shows or hides the password, with the icon as Figma', async () => {
    const user = userEvent.setup();
    render(<FinPasswordField label="Password" />);
    const eye = screen.getByRole('button', { name: 'Show password' });
    expect(eye).not.toHaveAttribute('aria-pressed');
    expect(screen.getByText('visibility_off')).toBeInTheDocument();
    await user.click(eye);
    expect(input()).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBe(eye);
    expect(screen.getByText('visibility')).toBeInTheDocument();
    await user.click(eye);
    expect(input()).toHaveAttribute('type', 'password');
    expect(eye).toHaveAccessibleName('Show password');
  });

  it('works with the keyboard and keeps focus on the eye button', async () => {
    const user = userEvent.setup();
    render(<FinPasswordField label="Password" />);
    await user.tab();
    expect(input()).toHaveFocus();
    await user.keyboard('secret');
    await user.tab();
    const eye = screen.getByRole('button', { name: 'Show password' });
    expect(eye).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(input()).toHaveAttribute('type', 'text');
    expect(eye).toHaveFocus();
    await user.keyboard(' ');
    expect(input()).toHaveAttribute('type', 'password');
    expect(input()).toHaveValue('secret');
  });

  it('can start shown, or be controlled', async () => {
    const user = userEvent.setup();
    const onShowPasswordChange = vi.fn();
    const { rerender } = render(<FinPasswordField label="Password" defaultShowPassword />);
    expect(input()).toHaveAttribute('type', 'text');
    rerender(<FinPasswordField key="controlled" label="Password" showPassword={false} onShowPasswordChange={onShowPasswordChange} />);
    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(onShowPasswordChange).toHaveBeenCalledWith(true);
    expect(input()).toHaveAttribute('type', 'password');
  });

  it('takes other button names', () => {
    render(<FinPasswordField label="PIN" showLabel="Show PIN" hideLabel="Hide PIN" />);
    expect(screen.getByRole('button', { name: 'Show PIN' })).toBeInTheDocument();
  });

  it('disabled: the input and the eye button are disabled', () => {
    render(<FinPasswordField label="Password" disabled />);
    expect(input()).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Show password' })).toBeDisabled();
  });

  it('with an error, is invalid; small has a 20 eye', () => {
    render(<FinPasswordField label="Password" error size="small" />);
    expect(input()).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('visibility_off')).toHaveAttribute('data-size', '20');
  });

  it('gives its ref and other attributes to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FinPasswordField ref={ref} label="Password" name="password" autoComplete="new-password" />);
    expect(ref.current).toBe(input());
    expect(ref.current).toHaveAttribute('name', 'password');
    expect(ref.current).toHaveAttribute('autocomplete', 'new-password');
  });
});
