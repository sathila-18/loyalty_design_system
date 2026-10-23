import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinButtonDock } from './FinButtonDock';

describe('FinButtonDock', () => {
  it('shows the accessory and the buttons in order: Tertiary, Secondary, Primary', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <FinButtonDock
        accessory="Changes apply to new members."
        tertiaryButton={{ label: 'Reset' }}
        secondaryButton={{ label: 'Cancel' }}
        primaryButton={{ label: 'Save', onClick: onSave }}
      />,
    );
    expect(screen.getByText('Changes apply to new members.').tagName).toBe('P');
    const buttons = screen.getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual(['Reset', 'Cancel', 'Save']);
    expect(buttons.map((b) => b.getAttribute('data-variant'))).toEqual(['tertiary', 'secondary', 'primary']);
    expect(buttons.every((b) => b.getAttribute('data-size') === 'large')).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('hides each part without it; places any other accessory as it is', () => {
    const { container, rerender } = render(<FinButtonDock primaryButton={{ label: 'Done' }} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(container.querySelector('p')).toBeNull();
    rerender(<FinButtonDock accessory={<a href="#terms">Terms</a>} />);
    expect(screen.getByRole('link', { name: 'Terms' })).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('makes the Primary and Secondary buttons destructive with tone', () => {
    render(<FinButtonDock secondaryButton={{ label: 'Keep', tone: 'destructive' }} primaryButton={{ label: 'Remove', tone: 'destructive' }} />);
    expect(screen.getByRole('button', { name: 'Remove' })).toHaveAttribute('data-variant', 'destructive');
    expect(screen.getByRole('button', { name: 'Keep' })).toHaveAttribute('data-variant', 'destructive-secondary');
  });

  it('passes button attributes through: disabled, type', () => {
    render(<FinButtonDock primaryButton={{ label: 'Save', type: 'submit', disabled: true }} />);
    const save = screen.getByRole('button', { name: 'Save' });
    expect(save).toBeDisabled();
    expect(save).toHaveAttribute('type', 'submit');
  });

  it('marks Sticky, and passes className and attributes to the root', () => {
    const { container, rerender } = render(<FinButtonDock className="extra" aria-label="Actions" primaryButton={{ label: 'Save' }} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('extra');
    expect(root).toHaveAttribute('aria-label', 'Actions');
    expect(root).not.toHaveAttribute('data-sticky');
    rerender(<FinButtonDock sticky primaryButton={{ label: 'Save' }} />);
    expect(container.firstElementChild).toHaveAttribute('data-sticky');
  });
});
