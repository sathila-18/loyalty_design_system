import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinAvatarGroup, type FinAvatarGroupPerson } from './FinAvatarGroup';

const people = (n: number): FinAvatarGroupPerson[] =>
  Array.from({ length: n }, (_, i) => ({ src: `/p${i + 1}.jpg`, initials: `P${i + 1}`, label: `Person ${i + 1}` }));

describe('FinAvatarGroup', () => {
  it.each([2, 3, 4, 5, 6])('shows all %i people without a count', (n) => {
    render(<FinAvatarGroup people={people(n)} label="Team" />);
    const group = screen.getByRole('group', { name: 'Team' });
    expect(within(group).getAllByRole('img')).toHaveLength(n);
    expect(within(group).queryByText(/^\+/)).toBeNull();
  });

  it.each([
    [7, 1],
    [10, 4],
  ])('with %i people shows 6 avatars and +%i', (n, more) => {
    render(<FinAvatarGroup people={people(n)} label="Team" />);
    const imgs = within(screen.getByRole('group')).getAllByRole('img');
    expect(imgs).toHaveLength(7);
    expect(imgs.slice(0, 6).map((img) => img.getAttribute('alt'))).toEqual(people(6).map((p) => p.label));
    const count = screen.getByRole('img', { name: `${more} more` });
    expect(count).toHaveTextContent(`+${more}`);
    expect(count).toHaveAttribute('data-type', 'text');
    expect(count.tagName).not.toBe('BUTTON');
  });

  it('passes the size to every avatar, including the count', () => {
    const { container } = render(<FinAvatarGroup people={people(8)} size="xlarge" />);
    const group = container.firstElementChild!;
    expect(group).toHaveAttribute('data-size', 'xlarge');
    const avatars = group.querySelectorAll(':scope > [data-size]');
    expect(avatars).toHaveLength(7);
    avatars.forEach((a) => expect(a).toHaveAttribute('data-size', 'xlarge'));
  });

  it('shows initials for a person without a photo', () => {
    render(<FinAvatarGroup people={[{ initials: 'SD', label: 'Sathila De Silva' }, ...people(1)]} />);
    expect(screen.getByRole('img', { name: 'Sathila De Silva' })).toHaveTextContent('SD');
  });

  it('passes className and other attributes to the group', () => {
    const { container } = render(<FinAvatarGroup people={people(2)} className="extra" data-testid="g" />);
    expect(container.firstElementChild).toHaveClass('extra');
    expect(screen.getByTestId('g')).toBe(screen.getByRole('group'));
  });
});
