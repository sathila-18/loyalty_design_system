import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinChipBase } from './FinChipBase';

const icons = (root: Element) => [...root.querySelectorAll('[translate="no"]')] as HTMLElement[];

describe('FinChipBase', () => {
  it('defaults to a small unselected chip with just its label', () => {
    const { container } = render(<FinChipBase>Gold</FinChipBase>);
    const chip = container.firstElementChild!;
    expect(chip).toHaveAttribute('data-variant', 'unselected');
    expect(chip).toHaveAttribute('data-size', 'small');
    expect(chip).toHaveTextContent('Gold');
    expect(icons(chip)).toHaveLength(0);
  });

  it.each([
    ['xsmall', '16'],
    ['small', '16'],
    ['large', '20'],
  ] as const)('a %s chip uses %spx icons', (size, iconSize) => {
    const { container } = render(
      <FinChipBase size={size} leadingIcon="person" trailingIcon="close">
        Gold
      </FinChipBase>,
    );
    const [lead, trail] = icons(container.firstElementChild!);
    expect(lead).toHaveTextContent('person');
    expect(trail).toHaveTextContent('close');
    for (const i of [lead, trail]) expect(i).toHaveAttribute('data-size', iconSize);
  });

  it('places the leading accessory, label and trailing icon in order', () => {
    const { container } = render(
      <FinChipBase leadingIcon="person" trailingIcon="close">
        Gold
      </FinChipBase>,
    );
    expect([...container.firstElementChild!.children].map((c) => c.textContent)).toEqual(['person', 'Gold', 'close']);
  });

  it('takes other content as the leading accessory, instead of the icon', () => {
    const { container } = render(
      <FinChipBase leadingIcon="person" leadingAccessory={<img alt="" src="data:," data-testid="flag" />}>
        Sri Lanka
      </FinChipBase>,
    );
    expect(screen.getByTestId('flag')).toBeInTheDocument();
    expect(icons(container.firstElementChild!)).toHaveLength(0);
  });

  it('keeps icons decorative and colorless, so they take the chip colors', () => {
    const { container } = render(
      <FinChipBase leadingIcon="person" trailingIcon="close" variant="selected">
        Gold
      </FinChipBase>,
    );
    for (const i of icons(container.firstElementChild!)) {
      expect(i).toHaveAttribute('aria-hidden', 'true');
      expect(i.style.getPropertyValue('--icon-color')).toBe('');
    }
  });

  it('is a span by default, or a native button that does not submit forms', () => {
    const { container, rerender } = render(<FinChipBase>Gold</FinChipBase>);
    expect(container.firstElementChild!.tagName).toBe('SPAN');
    rerender(<FinChipBase as="button">Gold</FinChipBase>);
    expect(screen.getByRole('button', { name: 'Gold' })).toHaveAttribute('type', 'button');
  });

  it('marks Disabled on any chip, and disables a button chip natively', () => {
    const { container, rerender } = render(<FinChipBase disabled>Gold</FinChipBase>);
    expect(container.firstElementChild).toHaveAttribute('data-disabled');
    rerender(
      <FinChipBase as="button" disabled>
        Gold
      </FinChipBase>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('takes other trailing content instead of the trailing icon', () => {
    render(
      <FinChipBase trailingIcon="close" trailingAccessory={<button type="button">x</button>}>
        Gold
      </FinChipBase>,
    );
    expect(screen.getByRole('button', { name: 'x' })).toBeInTheDocument();
  });

  it('passes className and other attributes to the chip', () => {
    render(
      <FinChipBase className="extra" data-testid="c" title="Gold tier">
        Gold
      </FinChipBase>,
    );
    expect(screen.getByTestId('c')).toHaveClass('extra');
    expect(screen.getByTestId('c')).toHaveAttribute('title', 'Gold tier');
  });
});
