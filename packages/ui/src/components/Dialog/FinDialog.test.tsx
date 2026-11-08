import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinDialog } from './FinDialog';

describe('FinDialog', () => {
  it('opens as a dialog named by its title, focuses itself, and closes when open turns false', () => {
    const { rerender } = render(
      <FinDialog open onClose={() => {}} title="Remove segment">
        Are you sure?
      </FinDialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Remove segment' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement?.tagName).toBe('DIV');
    expect(screen.getByRole('heading', { level: 2, name: 'Remove segment' })).toBeInTheDocument();
    expect(screen.getByText('Are you sure?').tagName).toBe('P');
    rerender(<FinDialog open={false} onClose={() => {}} title="Remove segment" />);
    expect(dialog).not.toHaveAttribute('open');
  });

  it('shows a grey close button by default that calls onClose; hides it with closeButton={false}', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(<FinDialog open onClose={onClose} title="Title" />);
    const close = screen.getByRole('button', { name: 'Close' });
    expect(close).toHaveAttribute('data-icon-tone', 'secondary');
    expect(close).toHaveAttribute('data-size', 'medium');
    await user.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(<FinDialog open onClose={onClose} title="Title" closeButton={false} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows the buttons in order, Medium, with a destructive Primary', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(
      <FinDialog
        open
        onClose={() => {}}
        title="Title"
        closeButton={false}
        leadingButton={{ label: 'Help' }}
        secondaryButton={{ label: 'Cancel' }}
        primaryButton={{ label: 'Remove', tone: 'destructive', onClick: onRemove }}
      />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual(['Help', 'Cancel', 'Remove']);
    expect(buttons.map((b) => b.getAttribute('data-variant'))).toEqual(['secondary', 'secondary', 'destructive']);
    expect(buttons.every((b) => b.getAttribute('data-size') === 'medium')).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('asks to close on Esc and on a scrim click, unless closeOnOverlayClick is off', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container, rerender } = render(<FinDialog open onClose={onClose} title="Title" />);
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(screen.getByRole('dialog'), cancel);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(cancel.defaultPrevented).toBe(true);
    const scrim = () => container.querySelector('dialog > [aria-hidden="true"]') as HTMLElement;
    await user.click(scrim());
    expect(onClose).toHaveBeenCalledTimes(2);
    rerender(<FinDialog open onClose={onClose} title="Title" closeOnOverlayClick={false} />);
    await user.click(scrim());
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('stops the page scrolling while open and restores it after', () => {
    const { rerender } = render(<FinDialog open onClose={() => {}} title="Title" />);
    expect(document.documentElement.style.overflow).toBe('hidden');
    rerender(<FinDialog open={false} onClose={() => {}} title="Title" />);
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('places any body and title node as it is; no body or buttons without them', () => {
    const { container, rerender } = render(<FinDialog open onClose={() => {}} title="Title" closeButton={false} />);
    expect(container.querySelector('p')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    rerender(
      <FinDialog open onClose={() => {}} title={<span>Custom title</span>}>
        <a href="#terms">Terms</a>
      </FinDialog>,
    );
    expect(screen.getByRole('dialog', { name: 'Custom title' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Terms' })).toBeInTheDocument();
  });

  it('passes className and attributes to the dialog', () => {
    render(<FinDialog open onClose={() => {}} title="Title" className="extra" data-testid="dialog" />);
    expect(screen.getByTestId('dialog')).toHaveClass('extra');
    expect(screen.getByTestId('dialog').tagName).toBe('DIALOG');
  });

  it('makes the body a focusable region named by the title only while it scrolls', () => {
    render(
      <FinDialog open onClose={() => {}} title="Terms">
        Long text
      </FinDialog>,
    );
    const body = screen.getByText('Long text').closest('[data-part="body"]') as HTMLElement;
    expect(body).not.toHaveAttribute('tabindex');
    Object.defineProperty(body, 'scrollHeight', { configurable: true, value: 900 });
    Object.defineProperty(body, 'clientHeight', { configurable: true, value: 600 });
    fireEvent.scroll(body);
    expect(body).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('region', { name: 'Terms' })).toBe(body);
  });
});
