import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinSnackbar } from './FinSnackbar';
import { FinSnackbarRegion } from './FinSnackbarRegion';

const glyph = (root: Element) => root.querySelector('[translate="no"]') as HTMLElement | null;

describe('FinSnackbar', () => {
  it("defaults to Figma's Neutral, single line, with the info icon and no buttons", () => {
    const { container } = render(<FinSnackbar duration={null}>Saved as a draft</FinSnackbar>);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-tone', 'neutral');
    expect(root).toHaveAttribute('data-lines', 'single');
    expect(root).not.toHaveAttribute('data-trailing');
    expect(root).not.toHaveAttribute('role');
    expect(root).toHaveTextContent('Saved as a draft');
    expect(glyph(root)).toHaveTextContent('info');
    expect(glyph(root)!.style.getPropertyValue('--icon-color')).toBe('var(--fin-fg-inverse)');
    expect(screen.queryByRole('button')).toBeNull();
  });

  it.each([
    ['success', 'check_circle', 'var(--fin-fg-success)'],
    ['warning', 'warning', 'var(--fin-fg-warning)'],
    ['error', 'warning', 'var(--fin-fg-error)'],
  ] as const)('the %s tone uses the Figma icon %s in %s', (tone, icon, color) => {
    const { container } = render(
      <FinSnackbar tone={tone} duration={null}>
        Text
      </FinSnackbar>,
    );
    expect(glyph(container.firstElementChild!)).toHaveTextContent(icon);
    expect(glyph(container.firstElementChild!)!.style.getPropertyValue('--icon-color')).toBe(color);
  });

  it('takes another Neutral icon, and hides the icon with showIcon={false}', () => {
    const { container, rerender } = render(
      <FinSnackbar icon="delete" duration={null}>
        Text
      </FinSnackbar>,
    );
    expect(glyph(container.firstElementChild!)).toHaveTextContent('delete');
    rerender(
      <FinSnackbar showIcon={false} duration={null}>
        Text
      </FinSnackbar>,
    );
    expect(glyph(container.firstElementChild!)).toBeNull();
  });

  it('is an alert only in the error tone', () => {
    render(
      <FinSnackbar tone="error" duration={null}>
        Couldn&apos;t save
      </FinSnackbar>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't save");
  });

  it('shows the action and close buttons, with the tone colours', async () => {
    const onAction = vi.fn();
    const onClose = vi.fn();
    render(
      <FinSnackbar tone="success" action={{ label: 'Undo', onClick: onAction }} onClose={onClose}>
        Segment removed
      </FinSnackbar>,
    );
    const undo = screen.getByRole('button', { name: 'Undo' });
    const close = screen.getByRole('button', { name: 'Close' });
    expect(undo).toHaveAttribute('data-size', 'small');
    expect(undo).toHaveAttribute('data-content-tone', 'primary');
    expect(close).toHaveAttribute('data-size', 'medium');
    await userEvent.click(undo);
    await userEvent.click(close);
    expect(onAction).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('uses the inverse button colours in the neutral tone, and a custom close label', () => {
    render(
      <FinSnackbar onClose={() => undefined} closeLabel="Dismiss" duration={null}>
        Text
      </FinSnackbar>,
    );
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveAttribute('data-content-tone', 'inverse');
  });

  it('puts the buttons under the message with lines="two"', () => {
    const { container } = render(
      <FinSnackbar lines="two" onClose={() => undefined} duration={null}>
        Text
      </FinSnackbar>,
    );
    expect(container.firstElementChild).toHaveAttribute('data-lines', 'two');
  });

  describe('closing by itself', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('closes after 6 seconds without an action', () => {
      const onClose = vi.fn();
      render(<FinSnackbar onClose={onClose}>Text</FinSnackbar>);
      act(() => vi.advanceTimersByTime(5999));
      expect(onClose).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(1));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('stays with an action, or with duration={null}', () => {
      const onClose = vi.fn();
      render(
        <>
          <FinSnackbar onClose={onClose} action={{ label: 'Undo', onClick: () => undefined }}>
            One
          </FinSnackbar>
          <FinSnackbar onClose={onClose} duration={null}>
            Two
          </FinSnackbar>
        </>,
      );
      act(() => vi.advanceTimersByTime(60000));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('takes another duration', () => {
      const onClose = vi.fn();
      render(
        <FinSnackbar onClose={onClose} duration={2000}>
          Text
        </FinSnackbar>,
      );
      act(() => vi.advanceTimersByTime(2000));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('waits while the pointer is over it or focus is inside, then starts again', () => {
      const onClose = vi.fn();
      const { container } = render(<FinSnackbar onClose={onClose}>Text</FinSnackbar>);
      const root = container.firstElementChild!;
      fireEvent.mouseEnter(root);
      act(() => vi.advanceTimersByTime(10000));
      expect(onClose).not.toHaveBeenCalled();
      fireEvent.focus(screen.getByRole('button', { name: 'Close' }));
      fireEvent.mouseLeave(root);
      act(() => vi.advanceTimersByTime(10000));
      expect(onClose).not.toHaveBeenCalled();
      fireEvent.blur(screen.getByRole('button', { name: 'Close' }), { relatedTarget: document.body });
      act(() => vi.advanceTimersByTime(6000));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });
});

describe('FinSnackbarRegion', () => {
  it('is a polite live region named "Notifications" that holds the snackbars', () => {
    render(
      <FinSnackbarRegion>
        <FinSnackbar duration={null}>Saved</FinSnackbar>
      </FinSnackbarRegion>,
    );
    const region = screen.getByRole('region', { name: 'Notifications' });
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('popover', 'manual');
    expect(region).toHaveTextContent('Saved');
  });

  it('takes another name', () => {
    render(<FinSnackbarRegion label="Messages" />);
    expect(screen.getByRole('region', { name: 'Messages' })).toBeInTheDocument();
  });
});
