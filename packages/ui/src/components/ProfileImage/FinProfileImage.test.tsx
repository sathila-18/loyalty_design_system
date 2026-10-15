import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinProfileImage } from './FinProfileImage';

const glyph = (button: HTMLElement) => button.querySelector('[translate="no"]');

describe('FinProfileImage', () => {
  it('without a photo shows the default icon and an add-photo camera button', () => {
    const { container } = render(<FinProfileImage />);
    const avatar = container.querySelector('[data-type]')!;
    expect(avatar).toHaveAttribute('data-type', 'icon');
    expect(avatar).toHaveAttribute('data-size', 'xxxlarge');
    const button = screen.getByRole('button', { name: 'Add profile photo' });
    expect(glyph(button)).toHaveTextContent('photo_camera');
    expect(glyph(button)).toHaveAttribute('data-size', '16');
    expect((glyph(button) as HTMLElement).style.getPropertyValue('--icon-color')).toBe('var(--fin-fg-inverse)');
  });

  it('with a photo shows it and a change-photo edit button', () => {
    render(<FinProfileImage src="/me.jpg" label="Sathila De Silva" />);
    expect(screen.getByRole('img', { name: 'Sathila De Silva' })).toHaveAttribute('src', '/me.jpg');
    expect(glyph(screen.getByRole('button', { name: 'Change profile photo' }))).toHaveTextContent('edit');
  });

  it('keeps the edit button when the photo fails to load', () => {
    const { container } = render(<FinProfileImage src="/broken.jpg" />);
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('[data-type]')).toHaveAttribute('data-type', 'icon');
    expect(glyph(screen.getByRole('button', { name: 'Change profile photo' }))).toHaveTextContent('edit');
  });

  it('never shows initials', () => {
    const { container } = render(<FinProfileImage label="Sathila De Silva" />);
    expect(container.querySelector('[data-type]')).toHaveAttribute('data-type', 'icon');
  });

  it('calls onClick from a click and from the keyboard', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<FinProfileImage onClick={onClick} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    await user.click(button);
    button.blur();
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('only the badge is focusable', async () => {
    const user = userEvent.setup();
    render(<FinProfileImage src="/me.jpg" />);
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it('takes a custom button label', () => {
    render(<FinProfileImage buttonLabel="Upload a logo" />);
    expect(screen.getByRole('button', { name: 'Upload a logo' })).toBeInTheDocument();
  });

  it('passes className and other attributes to the root', () => {
    const { container } = render(<FinProfileImage className="extra" data-testid="profile" />);
    expect(container.firstElementChild).toHaveClass('extra');
    expect(screen.getByTestId('profile')).toBe(container.firstElementChild);
  });
});
