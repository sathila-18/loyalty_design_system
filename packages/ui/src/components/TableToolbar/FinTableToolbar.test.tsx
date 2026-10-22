import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinTableToolbar } from './FinTableToolbar';

describe('FinTableToolbar', () => {
  it('shows the search, the filters and the action when given', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onChange = vi.fn();
    render(
      <FinTableToolbar
        search={{ label: 'Search segments', placeholder: 'Search segment', onChange }}
        filters={<button type="button">All segments</button>}
        actionLabel="Add Programme Configuration"
        onAction={onAction}
      />,
    );
    await user.type(screen.getByRole('searchbox', { name: 'Search segments' }), 'VIP');
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'All segments' })).toBeInTheDocument();
    const action = screen.getByRole('button', { name: 'Add Programme Configuration' });
    expect(action).toHaveTextContent('add');
    await user.click(action);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('hides each part without it, and takes another action icon', () => {
    const { rerender } = render(<FinTableToolbar actionLabel="Export" actionIcon="cloud_upload" />);
    expect(screen.queryByRole('searchbox')).toBeNull();
    expect(screen.getByRole('button', { name: 'Export' })).toHaveTextContent('cloud_upload');
    rerender(<FinTableToolbar search={{ label: 'Search' }} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('passes className and attributes to the root', () => {
    const { container } = render(<FinTableToolbar className="extra" aria-label="Segments tools" actionLabel="Add" />);
    expect(container.firstElementChild).toHaveClass('extra');
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Segments tools');
  });
});
