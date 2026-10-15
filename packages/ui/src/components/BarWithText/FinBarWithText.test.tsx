import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinBarWithText } from './FinBarWithText';

describe('FinBarWithText', () => {
  it('shows a large progress bar named by the heading, then a centred H3 Text Box', () => {
    const { container } = render(<FinBarWithText value={25} heading="Uploading members" description="A few minutes." />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading members' });
    expect(bar).toHaveAttribute('aria-valuenow', '25');
    expect(bar).toHaveAttribute('data-size', 'large');
    const box = container.querySelector('[data-type]')!;
    expect(box).toHaveAttribute('data-type', 'h3');
    expect(box).toHaveAttribute('data-align', 'center');
    expect(screen.getByRole('heading', { level: 3, name: 'Uploading members' })).toBeInTheDocument();
    expect(screen.getByText('A few minutes.')).toBeInTheDocument();
  });

  it('hides the description when not passed (Figma Description=False)', () => {
    const { container } = render(<FinBarWithText value={50} heading="Half way" />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('accepts any value and a max', () => {
    render(<FinBarWithText value={3} max={5} heading="Step 3 of 5" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
    expect(bar).toHaveAttribute('aria-valuenow', '3');
  });

  it('takes a heading level without changing the look', () => {
    const { container } = render(<FinBarWithText value={10} heading="Import" headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(container.querySelector('[data-type]')).toHaveAttribute('data-type', 'h3');
  });

  it('passes className and other attributes to the root', () => {
    render(<FinBarWithText value={1} heading="H" className="extra" data-testid="b" />);
    expect(screen.getByTestId('b')).toHaveClass('extra');
  });
});
