import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinTextBox } from './FinTextBox';

describe('FinTextBox', () => {
  it('renders the label, heading and description, h1 and left by default', () => {
    const { container } = render(<FinTextBox label="Label text" heading="Heading" description="Description" />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-type', 'h1');
    expect(root).toHaveAttribute('data-align', 'left');
    expect(screen.getByRole('heading', { level: 1, name: 'Heading' })).toBeInTheDocument();
    expect(screen.getByText('Description').tagName).toBe('P');
    expect(screen.getByText('Label text').closest('[data-size]')).toHaveAttribute('data-size', 'medium');
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('type h%i renders an <h%i> by default', (n) => {
    render(<FinTextBox type={`h${n}`} heading="Heading" />);
    expect(screen.getByRole('heading', { level: n })).toHaveTextContent('Heading');
  });

  it('headingLevel changes the element, not the look', () => {
    const { container } = render(<FinTextBox type="h3" headingLevel={2} heading="Dialog title" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Dialog title' })).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('data-type', 'h3');
  });

  it('shows only the parts that are passed', () => {
    const { container, rerender } = render(<FinTextBox heading="Only heading" />);
    expect(container.querySelector('[data-size]')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
    rerender(<FinTextBox label="Only label" />);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getByText('Only label')).toBeInTheDocument();
    rerender(<FinTextBox description="Only description" />);
    expect(screen.queryByRole('heading')).toBeNull();
    expect(screen.getByText('Only description').tagName).toBe('P');
  });

  it('passes the label badge through to FinLabel, with its screen-reader text', () => {
    const { container } = render(<FinTextBox label="Details" labelBadge labelBadgeLabel="Required" heading="Account" />);
    expect(container.querySelector('[data-shape="dot"]')).not.toBeNull();
    expect(container.querySelector('[data-size="medium"]')).toHaveTextContent('Details, Required');
  });

  it('takes the label size (exposed in Figma), medium by default', () => {
    const { container, rerender } = render(<FinTextBox label="L" heading="H" />);
    expect(container.querySelector('[data-size]')).toHaveAttribute('data-size', 'medium');
    rerender(<FinTextBox label="L" labelSize="small" labelBadge labelBadgeLabel="New" heading="H" />);
    expect(container.querySelector('[data-size]:not([data-shape])')).toHaveAttribute('data-size', 'small');
  });

  it.each(['center', 'right'] as const)('aligns %s', (align) => {
    const { container } = render(<FinTextBox align={align} heading="Heading" />);
    expect(container.firstElementChild).toHaveAttribute('data-align', align);
  });

  it('requires labelBadgeLabel with labelBadge (types)', () => {
    // @ts-expect-error labelBadgeLabel is required with labelBadge
    const missing = <FinTextBox label="L" labelBadge heading="H" />;
    expect(missing).toBeTruthy();
  });

  it('passes className and other attributes to the root', () => {
    render(<FinTextBox heading="H" className="extra" data-testid="tb" />);
    expect(screen.getByTestId('tb')).toHaveClass('extra');
  });
});
