import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinListStandardFilled } from './FinListStandardFilled';

describe('FinListStandardFilled', () => {
  it('is a link card with the chevron always shown (and the caption when given)', () => {
    const { container } = render(<FinListStandardFilled href="/members" title="Members" caption="1,204" />);
    const card = container.firstElementChild as HTMLElement;
    expect(screen.getByRole('link', { name: 'Members' })).toHaveAttribute('href', '/members');
    expect(card).toHaveAttribute('data-filled');
    expect(card).toHaveTextContent('keyboard_arrow_right');
    expect(screen.getByText('1,204')).toBeInTheDocument();
    expect(container.querySelector('hr')).toBeNull();
  });

  it('can be a button or an option, selected or disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender, container } = render(<FinListStandardFilled behavior="button" title="Export" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Export' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <div role="listbox" aria-label="Tier">
        <FinListStandardFilled behavior="option" title="Gold" selected />
      </div>,
    );
    expect(screen.getByRole('option', { name: /Gold/ })).toHaveAttribute('aria-selected', 'true');
    rerender(<FinListStandardFilled behavior="button" title="Export" disabled />);
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled();
    expect(container.firstElementChild).toHaveAttribute('data-disabled');
  });

  it('shows no leading accessory unless one is set (no default avatar)', () => {
    const { container } = render(<FinListStandardFilled href="#" title="Plain" />);
    expect(container.querySelector('[class*=leading_]')).toBeNull();
  });
});
