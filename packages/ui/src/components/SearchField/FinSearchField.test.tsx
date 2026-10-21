import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinSearchField } from './FinSearchField';

const box = () => screen.getByRole('searchbox', { name: 'Search members' });

describe('FinSearchField', () => {
  it('is a search box named by its label, which is never shown', () => {
    const { container } = render(<FinSearchField label="Search members" defaultValue="Olivia" />);
    expect(box()).toHaveAttribute('type', 'search');
    expect(box()).toHaveAttribute('placeholder', 'Search');
    expect(box()).toHaveAttribute('enterkeyhint', 'search');
    expect(container.querySelector('legend')).toBeNull();
    expect(screen.getByText('search')).toBeInTheDocument();
  });

  it('shows the clear button only once there is text', async () => {
    const user = userEvent.setup();
    render(<FinSearchField label="Search members" />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
    await user.type(box(), 'Ol');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('clearing empties the field, reports it and keeps focus in the input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(<FinSearchField label="Search members" onChange={onChange} onClear={onClear} />);
    await user.type(box(), 'Olivia');
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(box()).toHaveValue('');
    expect(box()).toHaveFocus();
    expect(onClear).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ target: box() }));
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('with the keyboard: Tab reaches the clear button, Enter clears and focus returns to the input', async () => {
    const user = userEvent.setup();
    render(<FinSearchField label="Search members" defaultValue="Olivia" />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Clear search' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(box()).toHaveValue('');
    expect(box()).toHaveFocus();
  });

  it('Escape clears', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<FinSearchField label="Search members" defaultValue="Olivia" onClear={onClear} />);
    await user.click(box());
    await user.keyboard('{Escape}');
    expect(box()).toHaveValue('');
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('works controlled', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [query, setQuery] = useState('Gold');
      return (
        <>
          <FinSearchField label="Search members" value={query} onChange={(event) => setQuery(event.target.value)} />
          <output>{query}</output>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByRole('status')).toHaveTextContent('');
    expect(box()).toHaveValue('');
  });

  it('small has 20 icons; disabled has no clear button', () => {
    const { rerender } = render(<FinSearchField label="Search members" size="small" defaultValue="Ol" />);
    expect(screen.getByText('search')).toHaveAttribute('data-size', '20');
    expect(screen.getByText('cancel')).toHaveAttribute('data-size', '20');
    rerender(<FinSearchField label="Search members" size="small" defaultValue="Ol" disabled />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('gives its ref and other attributes to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FinSearchField ref={ref} label="Search members" name="q" />);
    expect(ref.current).toBe(box());
    expect(ref.current).toHaveAttribute('name', 'q');
  });
});
