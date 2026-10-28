import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FinEmptyState } from './FinEmptyState';

const glyph = (root: Element) => root.querySelector('[translate="no"]') as HTMLElement | null;

describe('FinEmptyState', () => {
  it("defaults to Figma's Medium: a 64 icon container, a centred Headline Medium-H5 Text Box, an h2", () => {
    const { container } = render(<FinEmptyState icon="search" heading="No results" description="Try another search." />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-size', 'medium');
    expect(root.querySelector('[data-size="64"]')).not.toBeNull();
    expect(glyph(root)).toHaveTextContent('search');
    expect(root.querySelector('[data-type="h5"]')).toHaveAttribute('data-align', 'center');
    expect(screen.getByRole('heading', { level: 2, name: 'No results' })).toBeInTheDocument();
    expect(screen.getByText('Try another search.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('Small uses a 48 icon container and a Headline Small-H6 Text Box', () => {
    const { container } = render(<FinEmptyState size="small" icon="search" heading="No results" />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-size', 'small');
    expect(root.querySelector('[data-size="48"]')).not.toBeNull();
    expect(root.querySelector('[data-type="h6"]')).not.toBeNull();
  });

  it('places something else in the icon slot', () => {
    render(<FinEmptyState iconSlot={<img alt="No data" src="data:," />} heading="Nothing here" />);
    expect(screen.getByRole('img', { name: 'No data' })).toBeInTheDocument();
  });

  it('shows one Primary Small button with action', async () => {
    const onClick = vi.fn();
    render(<FinEmptyState icon="add" heading="No configurations yet" action={{ label: 'Add configuration', onClick }} />);
    const button = screen.getByRole('button', { name: 'Add configuration' });
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'small');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('puts an icon before the button label with leadingIcon', () => {
    render(<FinEmptyState icon="loyalty" heading="No lessons yet" action={{ label: 'Add lesson', leadingIcon: 'add', onClick: vi.fn() }} />);
    const button = screen.getByRole('button', { name: 'Add lesson' });
    expect(button).toHaveAttribute('data-icon-side', 'leading');
    expect(button.querySelector('[translate="no"]')).toHaveTextContent('add');
  });

  it('takes another heading level without changing the look', () => {
    const { container } = render(<FinEmptyState icon="search" heading="No results" headingLevel={3} />);
    expect(screen.getByRole('heading', { level: 3, name: 'No results' })).toBeInTheDocument();
    expect(container.querySelector('[data-type="h5"]')).not.toBeNull();
  });
});
