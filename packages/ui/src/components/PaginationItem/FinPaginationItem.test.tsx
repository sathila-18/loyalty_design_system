import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinPaginationItem } from './FinPaginationItem';

describe('FinPaginationItem', () => {
  it('is a page button that does not submit forms, not the current page by default', () => {
    render(<FinPaginationItem>2</FinPaginationItem>);
    const page = screen.getByRole('button', { name: '2' });
    expect(page).toHaveAttribute('type', 'button');
    expect(page).toHaveAttribute('data-variant', 'page');
    expect(page).not.toHaveAttribute('aria-current');
  });

  it('marks the current page', () => {
    render(<FinPaginationItem selected>1</FinPaginationItem>);
    const page = screen.getByRole('button', { name: '1' });
    expect(page).toHaveAttribute('aria-current', 'page');
    expect(page).toHaveAttribute('data-selected');
  });

  it('is pressed with a click, Enter or Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<FinPaginationItem onClick={onClick}>3</FinPaginationItem>);
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('shows the dots as one character, not interactive and hidden from screen readers', async () => {
    const user = userEvent.setup();
    const { container } = render(<FinPaginationItem variant="dots" />);
    const dots = container.firstElementChild!;
    expect(dots.tagName).toBe('SPAN');
    expect(dots).toHaveTextContent(/^…$/);
    expect(dots).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button')).toBeNull();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it('forwards ref, className and attributes', () => {
    const ref = createRef<HTMLElement>();
    render(
      <FinPaginationItem ref={ref} className="extra" aria-label="Page 10">
        10
      </FinPaginationItem>,
    );
    const page = screen.getByRole('button', { name: 'Page 10' });
    expect(ref.current).toBe(page);
    expect(page).toHaveClass('extra');
  });
});
