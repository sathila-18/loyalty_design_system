import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinListItemFilled } from './FinListItemFilled';

describe('FinListItemFilled', () => {
  it('is a list item with no divider and an avatar as the leading accessory (Figma defaults)', () => {
    const { container } = render(<FinListItemFilled title="Title here">Placeholder description here</FinListItemFilled>);
    const item = container.firstElementChild as HTMLElement;
    expect(item).toHaveAttribute('data-size', 'large');
    expect(screen.getByText('Title here')).toBeInTheDocument();
    expect(container.querySelector('hr')).toBeNull();
    expect(item).toHaveTextContent('keyboard_arrow_right');
  });

  it('takes the same props as List-base, including other leading content and size', () => {
    const { container } = render(
      <FinListItemFilled size="small" leading={<span>Lead</span>} title="Ann Perera" trailingAccessory={false}>
        ann.perera@email.com
      </FinListItemFilled>,
    );
    expect(container.firstElementChild).toHaveAttribute('data-size', 'small');
    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveTextContent('keyboard_arrow_right');
  });

  it('can be a list item and keeps extra classes and attributes', () => {
    render(
      <ul>
        <FinListItemFilled as="li" title="One" className="extra" data-testid="one" />
        <FinListItemFilled as="li" title="Two" />
      </ul>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByTestId('one')).toHaveClass('extra');
  });
});
