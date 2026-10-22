import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { FinButton } from '../Button';
import { FinListCheckbox, FinListCheckboxGroup } from '../ListCheckbox';
import { FinListStandard } from '../ListStandard';
import { FinMenu, FinMenuDivider } from './FinMenu';

function ActionMenu({ onEdit = () => {}, defaultOpen = false }: { onEdit?: () => void; defaultOpen?: boolean }) {
  return (
    <>
      <FinMenu defaultOpen={defaultOpen} trigger={<FinButton>Actions</FinButton>}>
        <FinListStandard as="li" behavior="menuitem" title="View" />
        <FinListStandard as="li" behavior="menuitem" title="Edit" onClick={onEdit} />
        <FinMenuDivider />
        <FinListStandard as="li" behavior="menuitem" title="Delete" disabled />
        <FinListStandard as="li" behavior="menuitem" title="Archive" />
      </FinMenu>
      <button type="button">After</button>
    </>
  );
}

// jsdom hides [popover] elements but has no showPopover() to open them; real browsers do. Show them for the tests.
beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = '[popover]:not(:popover-open):not(dialog[open]) { display: block; }';
  document.head.append(style);
});

describe('FinMenu', () => {
  it('opens from its trigger as a menu named by the trigger, focusing the first action', async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).toBeNull();
    await user.click(trigger);
    const menu = screen.getByRole('menu', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(screen.getByRole('menuitem', { name: 'View' })).toHaveFocus();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('moves between actions with the arrow keys, Home and End, skipping disabled ones', async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'View' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
    await user.keyboard('{Home}{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
  });

  it('opens with ArrowUp on the last action', async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
  });

  it('runs a chosen action, closes and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<ActionMenu onEdit={onEdit} />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it('closes with Escape (focus back on the trigger) and with a click outside', async () => {
    const user = userEvent.setup();
    render(<ActionMenu />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    await user.click(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes when the trigger is pressed again', async () => {
    const user = userEvent.setup();
    render(<ActionMenu defaultOpen />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('is a navigation of links that closes when one is chosen, focusing the current page on open', async () => {
    const user = userEvent.setup();
    render(
      <FinMenu kind="navigation" trigger={<FinButton>Programme</FinButton>}>
        <FinListStandard as="li" behavior="link" href="#a" title="Overview" />
        <FinListStandard as="li" behavior="link" href="#b" title="Rewards" selected />
      </FinMenu>,
    );
    const trigger = screen.getByRole('button', { name: 'Programme' });
    expect(trigger).not.toHaveAttribute('aria-haspopup');
    await user.click(trigger);
    expect(screen.getByRole('navigation', { name: 'Programme' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Rewards' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveFocus();
    await user.click(screen.getByRole('link', { name: 'Overview' }));
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('is a filter dialog that stays open while controls change, with a footer, closed by the app', async () => {
    const user = userEvent.setup();
    function Filters() {
      const [open, setOpen] = useState(false);
      const [tiers, setTiers] = useState<string[]>([]);
      return (
        <>
          <FinMenu
            kind="filter"
            open={open}
            onOpenChange={setOpen}
            label="Member filters"
            trigger={<FinButton>Filters</FinButton>}
            footer={<FinButton onClick={() => setOpen(false)}>Apply</FinButton>}
          >
            <FinListCheckboxGroup label="Tier" value={tiers} onValueChange={setTiers}>
              <FinListCheckbox value="gold" title="Gold" />
              <FinListCheckbox value="silver" title="Silver" />
            </FinListCheckboxGroup>
          </FinMenu>
          <p>Chosen: {tiers.join(', ')}</p>
        </>
      );
    }
    render(<Filters />);
    const trigger = screen.getByRole('button', { name: 'Filters' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await user.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Member filters' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Gold' })).toHaveFocus();
    await user.keyboard(' ');
    await user.click(screen.getByRole('checkbox', { name: 'Silver' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Chosen: gold, silver')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes a filter menu when focus leaves it', async () => {
    const user = userEvent.setup();
    render(
      <>
        <FinMenu kind="filter" defaultOpen label="Filters" trigger={<FinButton>Filters</FinButton>} footer={<FinButton>Apply</FinButton>}>
          <p>Options</p>
        </FinMenu>
        <button type="button">After</button>
      </>,
    );
    screen.getByRole('button', { name: 'Apply' }).focus();
    await user.tab();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps the trigger\'s own handlers and ref, and calls onOpenChange', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onOpenChange = vi.fn();
    let node: HTMLButtonElement | null = null;
    render(
      <FinMenu onOpenChange={onOpenChange} trigger={<FinButton ref={(n) => { node = n; }} onClick={onClick}>Actions</FinButton>}>
        <FinListStandard as="li" behavior="menuitem" title="View" />
      </FinMenu>,
    );
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(node).toBe(screen.getByRole('button', { name: 'Actions' }));
  });

  it('takes a trigger render function, a label, width and maxHeight', () => {
    render(
      <FinMenu defaultOpen label="Row actions" width="trigger" maxHeight="200px" trigger={(props) => <button type="button" {...props}>More</button>}>
        <FinListStandard as="li" behavior="menuitem" title="View" />
      </FinMenu>,
    );
    expect(screen.getByRole('button', { name: 'More' })).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('menu', { name: 'Row actions' });
    const surface = menu.closest('[data-kind]')!;
    expect(surface).toHaveAttribute('data-width', 'trigger');
    expect(surface).toHaveAttribute('data-max-height');
    expect(surface).toHaveAttribute('popover', 'manual');
  });
});
