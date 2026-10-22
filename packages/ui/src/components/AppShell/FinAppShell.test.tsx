import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FinAppShell } from './FinAppShell';

/** jsdom has no matchMedia: a stand-in whose width can be changed (as the side nav tests). */
let wide = true;
const listeners = new Set<() => void>();
beforeEach(() => {
  wide = true;
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query.includes('1280') ? wide : true;
    },
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }));
});
afterEach(() => {
  vi.unstubAllGlobals();
  listeners.clear();
});

const setWidth = (isWide: boolean) =>
  act(() => {
    wide = isWide;
    listeners.forEach((listener) => listener());
  });

const shell = (onSideNavTypeChange = vi.fn()) =>
  render(
    <FinAppShell
      sideNav={{ sections: [{ icon: 'home', label: 'Dashboard', href: '/' }], currentHref: '/' }}
      header={{ heading: 'Programme configuration', backButton: false, notification: false }}
      onSideNavTypeChange={onSideNavTypeChange}
    >
      <p>Content</p>
    </FinAppShell>,
  );

describe('FinAppShell', () => {
  it('has one navigation, one banner and one main landmark, with the content in main', () => {
    shell();
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getByRole('banner')).toHaveTextContent('Programme configuration');
    expect(screen.getByRole('main')).toHaveTextContent('Content');
  });

  it('starts with a "Skip to content" link that moves focus to main', async () => {
    const user = userEvent.setup();
    shell();
    await user.tab();
    const skip = screen.getByRole('link', { name: 'Skip to content' });
    expect(skip).toHaveFocus();
    expect(skip).toHaveAttribute('href', `#${screen.getByRole('main').id}`);
    await user.keyboard('{Enter}');
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('makes the content a tab stop, so keyboard users can scroll it', () => {
    shell();
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '0');
  });

  it('minimizes the side nav below 1280 and expands it from 1280; its button wins until the width crosses 1280', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    shell(onChange);
    expect(screen.getByRole('button', { name: 'Collapse menu' })).toBeInTheDocument();
    setWidth(false);
    expect(screen.getByRole('button', { name: 'Expand menu' })).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith('minimized');
    await user.click(screen.getByRole('button', { name: 'Expand menu' }));
    expect(screen.getByRole('button', { name: 'Collapse menu' })).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith('expanded');
    setWidth(true);
    setWidth(false);
    expect(screen.getByRole('button', { name: 'Expand menu' })).toBeInTheDocument();
  });

  it('takes a translated skip link and passes attributes to the root', () => {
    render(
      <FinAppShell
        sideNav={{ sections: [], currentHref: '/' }}
        header={{ heading: 'Inicio', backButton: false, notification: false }}
        skipLabel="Saltar al contenido"
        data-testid="shell"
      >
        <p>Contenido</p>
      </FinAppShell>,
    );
    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toBeInTheDocument();
    expect(screen.getByTestId('shell')).toBeInTheDocument();
  });
});
