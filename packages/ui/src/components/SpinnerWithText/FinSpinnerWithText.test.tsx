import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinSpinnerWithText } from './FinSpinnerWithText';

describe('FinSpinnerWithText', () => {
  it('shows a still ring named by the heading, then a centred H3 Text Box', () => {
    const { container } = render(<FinSpinnerWithText value={50} heading="Importing" description="A few minutes." />);
    const ring = screen.getByRole('progressbar', { name: 'Importing' });
    expect(ring).toHaveAttribute('aria-valuenow', '50');
    expect(ring).not.toHaveAttribute('data-spinning');
    const box = container.querySelector('[data-type]')!;
    expect(box).toHaveAttribute('data-type', 'h3');
    expect(box).toHaveAttribute('data-align', 'center');
    expect(screen.getByRole('heading', { level: 3, name: 'Importing' })).toBeInTheDocument();
    expect(screen.getByText('A few minutes.')).toBeInTheDocument();
  });

  it('without a value is a spinning loader (added beyond Figma)', () => {
    render(<FinSpinnerWithText heading="Loading" />);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toHaveAttribute('data-spinning');
  });

  it.each([
    ['success', 'check'],
    ['error', 'warning'],
  ] as const)('Figma %s state shows the %s icon, named by the heading', (status, icon) => {
    render(<FinSpinnerWithText status={status} heading="Import finished" />);
    expect(screen.getByRole('img', { name: 'Import finished' })).toHaveTextContent(icon);
  });

  it('hides the description when not passed, and takes a heading level', () => {
    const { container } = render(<FinSpinnerWithText value={10} heading="Import" headingLevel={2} />);
    expect(container.querySelector('p')).toBeNull();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('passes className and other attributes to the root', () => {
    render(<FinSpinnerWithText heading="H" className="extra" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveClass('extra');
  });
});
