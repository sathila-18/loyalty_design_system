import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinListItem } from './FinListItem';

describe('FinListItem', () => {
  it('shows the Figma defaults: leading icon container, title, body, trailing arrow and divider', () => {
    const { container } = render(<FinListItem title="Title here">Placeholder description here</FinListItem>);
    const item = container.firstElementChild as HTMLElement;
    expect(item).toHaveAttribute('data-size', 'large');
    expect(screen.getByText('Title here')).toBeInTheDocument();
    expect(screen.getByText('Placeholder description here').tagName).toBe('P');
    expect(item).toHaveTextContent('person');
    expect(item).toHaveTextContent('keyboard_arrow_right');
    expect(container.querySelector('hr')).not.toBeNull();
  });

  it('shows the top label and extra icon when given, and hides the parts turned off', () => {
    const { container } = render(
      <FinListItem
        size="small"
        title="Title"
        topLabel="Label text"
        extraIcon="check_circle"
        leadingAccessory={false}
        trailingAccessory={false}
        divider={false}
        showBody={false}
      >
        Body
      </FinListItem>,
    );
    const item = container.firstElementChild as HTMLElement;
    expect(item).toHaveAttribute('data-size', 'small');
    expect(screen.getByText('Label text')).toBeInTheDocument();
    expect(item).toHaveTextContent('check_circle');
    expect(item).not.toHaveTextContent('person');
    expect(item).not.toHaveTextContent('keyboard_arrow_right');
    expect(screen.queryByText('Body')).toBeNull();
    expect(container.querySelector('hr')).toBeNull();
  });

  it('puts any component in the slots, as given', () => {
    render(
      <FinListItem title="Ann Perera" leading={<span>Lead</span>} trailing={<button type="button">Edit</button>}>
        <strong>Gold member</strong>
      </FinListItem>,
    );
    expect(screen.getByText('Lead')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByText('Gold member').tagName).toBe('STRONG');
  });

  it('passes attributes to the root', () => {
    render(<FinListItem title="Title" data-testid="item" className="extra" />);
    expect(screen.getByTestId('item')).toHaveClass('extra');
  });
});
