import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinTextBox } from '../TextBox';
import { FinSideSheet } from './FinSideSheet';

describe('FinSideSheet', () => {
  it('opens as a dialog named by its title, and closes when open turns false', () => {
    const { rerender } = render(
      <FinSideSheet open onClose={() => {}} title="Add configuration">
        <p>Body</p>
      </FinSideSheet>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Add configuration' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement?.tagName).toBe('DIV');
    expect(screen.getByRole('heading', { level: 2, name: 'Add configuration' })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    rerender(
      <FinSideSheet open={false} onClose={() => {}} title="Add configuration">
        <p>Body</p>
      </FinSideSheet>,
    );
    expect(dialog).not.toHaveAttribute('open');
  });

  it('shows the close button by default and no back button; calls onClose and onBack', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onBack = vi.fn();
    const { rerender } = render(<FinSideSheet open onClose={onClose} title="Title" />);
    expect(screen.queryByRole('button', { name: 'Back' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('data-icon-tone', 'secondary');
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(<FinSideSheet open onClose={onClose} title="Title" backButton onBack={onBack} closeButton={false} backLabel="Back to list" />);
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Back to list' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('asks to close on Esc (the cancel event) and stays open until open changes', () => {
    const onClose = vi.fn();
    render(<FinSideSheet open onClose={onClose} title="Title" />);
    const dialog = screen.getByRole('dialog');
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancel);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(cancel.defaultPrevented).toBe(true);
    expect(dialog).toHaveAttribute('open');
  });

  it('closes on a scrim click unless closeOnOverlayClick is off', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container, rerender } = render(<FinSideSheet open onClose={onClose} title="Title" />);
    const scrim = () => container.querySelector('dialog > [aria-hidden="true"]') as HTMLElement;
    await user.click(scrim());
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(<FinSideSheet open onClose={onClose} title="Title" closeOnOverlayClick={false} />);
    await user.click(scrim());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stops the page scrolling while open and restores it after', () => {
    const { rerender } = render(<FinSideSheet open onClose={() => {}} title="Title" />);
    expect(document.documentElement.style.overflow).toBe('hidden');
    rerender(<FinSideSheet open={false} onClose={() => {}} title="Title" />);
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('places any title node as it is, and names the dialog with it', () => {
    render(
      <FinSideSheet open onClose={() => {}} title={<FinTextBox type="h4" heading="Add configuration" headingLevel={2} description="Applies to one segment" />} />,
    );
    expect(screen.getByRole('dialog', { name: /Add configuration/ })).toBeInTheDocument();
    expect(screen.getByText('Applies to one segment')).toBeInTheDocument();
  });

  it('shows the divider and Button dock only when asked; the dock is sticky while content is below', () => {
    const { container, rerender } = render(<FinSideSheet open onClose={() => {}} title="Title" />);
    expect(container.querySelector('hr')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Save' })).toBeNull();
    rerender(<FinSideSheet open onClose={() => {}} title="Title" divider buttonDock={{ secondaryButton: { label: 'Cancel' }, primaryButton: { label: 'Save' } }} />);
    expect(container.querySelector('hr')).toBeInTheDocument();
    const dock = screen.getByRole('button', { name: 'Save' }).closest('[class]')?.parentElement?.parentElement as HTMLElement;
    expect(dock).not.toHaveAttribute('data-sticky');

    const body = dock.previousElementSibling as HTMLElement;
    Object.defineProperty(body, 'scrollHeight', { configurable: true, value: 900 });
    Object.defineProperty(body, 'clientHeight', { configurable: true, value: 600 });
    fireEvent.scroll(body);
    expect(dock).toHaveAttribute('data-sticky');
    body.scrollTop = 300;
    fireEvent.scroll(body);
    expect(dock).not.toHaveAttribute('data-sticky');
  });

  it('passes className and attributes to the dialog', () => {
    render(<FinSideSheet open onClose={() => {}} title="Title" className="extra" data-testid="sheet" />);
    expect(screen.getByTestId('sheet')).toHaveClass('extra');
    expect(screen.getByTestId('sheet').tagName).toBe('DIALOG');
  });
});
