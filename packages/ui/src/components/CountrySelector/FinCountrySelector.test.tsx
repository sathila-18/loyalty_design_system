import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FIN_PHONE_COUNTRIES } from './countrySearch';
import { FinCountrySelector } from './FinCountrySelector';

describe('FinCountrySelector', () => {
  it('is a button named by what it chooses and the chosen country, with a decorative Small flag and down arrow', () => {
    const { container } = render(<FinCountrySelector country="LK" />);
    const trigger = screen.getByRole('button', { name: 'Country, Sri Lanka' });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const flag = container.querySelector('[data-shape]')!;
    expect(flag).toHaveAttribute('data-size', 'small');
    expect(flag).toHaveAttribute('aria-hidden', 'true');
    expect(trigger.querySelector('[translate="no"]')).toHaveTextContent('keyboard_arrow_down');
  });

  it('opens the country menu: a search (not focused), every country with its dial code, the chosen one selected', async () => {
    const user = userEvent.setup();
    render(<FinCountrySelector country="LK" label="Phone country" />);
    const trigger = screen.getByRole('button', { name: 'Phone country, Sri Lanka' });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger.querySelector('[translate="no"]')).toHaveTextContent('keyboard_arrow_up');
    const search = screen.getByRole('searchbox', { name: 'Search countries' });
    expect(search).not.toHaveFocus();
    expect(search).toHaveAttribute('placeholder', 'Search by country or code');
    const listbox = screen.getByRole('listbox', { name: 'Phone country' });
    expect(listbox).toHaveFocus();
    const lk = screen.getByRole('option', { name: /Sri Lanka/ });
    expect(lk).toHaveAttribute('aria-selected', 'true');
    expect(lk).toHaveTextContent('+94');
    expect(listbox.querySelectorAll('[role="option"]').length).toBeGreaterThan(200);
  });

  it('filters as you type (typing in the open menu goes into the search): by name, ISO code or dial code', async () => {
    const user = userEvent.setup();
    render(<FinCountrySelector country="LK" />);
    await user.click(screen.getByRole('button'));
    const search = screen.getByRole('searchbox');
    await user.keyboard('lanka');
    expect(search).toHaveFocus();
    expect(search).toHaveValue('lanka');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([expect.stringContaining('Sri Lanka')]);
    await user.clear(search);
    await user.type(search, 'gb');
    expect(screen.getAllByRole('option')[0]).toHaveTextContent('United Kingdom');
    await user.clear(search);
    await user.type(search, '+94');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([expect.stringContaining('Sri Lanka')]);
    await user.clear(search);
    await user.type(search, 'zzz');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByRole('status')).toHaveTextContent('No countries found');
  });

  it('chooses a country with a click, or from the search with Enter, ArrowDown and Enter', async () => {
    const user = userEvent.setup();
    const onCountryChange = vi.fn();
    render(<FinCountrySelector country="LK" onCountryChange={onCountryChange} />);
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: /^India/ }));
    expect(onCountryChange).toHaveBeenLastCalledWith('IN');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    expect(screen.getByRole('searchbox')).toHaveValue('');
    await user.type(screen.getByRole('searchbox'), 'japan{Enter}');
    expect(onCountryChange).toHaveBeenLastCalledWith('JP');
    await user.click(trigger);
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: /Sri Lanka/ })).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onCountryChange).toHaveBeenLastCalledWith(FIN_PHONE_COUNTRIES[FIN_PHONE_COUNTRIES.indexOf('LK') + 1]);
  });

  it('Escape clears the search first, then closes; dial codes can be turned off', async () => {
    const user = userEvent.setup();
    render(<FinCountrySelector country="LK" showDialCodes={false} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('option', { name: /Sri Lanka/ })).not.toHaveTextContent('+94');
    await user.type(screen.getByRole('searchbox'), 'ind');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('searchbox')).toHaveValue('');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('when disabled, dims the flag, is skipped by Tab and ignores clicks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(<FinCountrySelector country="LK" disabled onClick={onClick} />);
    expect(container.querySelector('[data-shape]')).toHaveAttribute('data-disabled');
    await user.tab();
    expect(screen.getByRole('button')).not.toHaveFocus();
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards ref, className and attributes to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<FinCountrySelector ref={ref} country="LK" className="extra" data-testid="country" />);
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveClass('extra');
    expect(ref.current).toHaveAttribute('data-testid', 'country');
  });
});
