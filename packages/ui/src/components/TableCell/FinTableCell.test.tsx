import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FinTableCell } from './FinTableCell';

const inTable = (cell: ReactNode) =>
  render(
    <table>
      <tbody>
        <tr>{cell}</tr>
      </tbody>
    </table>,
  );

describe('FinTableCell', () => {
  it('is a cell with the row checkbox and the text (Figma defaults)', () => {
    inTable(<FinTableCell>Table cell text</FinTableCell>);
    const cell = screen.getByRole('cell');
    expect(cell).toHaveAttribute('data-type', 'default');
    expect(cell).toHaveTextContent('Table cell text');
    expect(screen.getByRole('checkbox', { name: 'Select row' })).not.toBeChecked();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('hides the leading accessories and the content when turned off', () => {
    inTable(
      <FinTableCell leadingAccessories={false} showContent={false}>
        Hidden
      </FinTableCell>,
    );
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.queryByText('Hidden')).toBeNull();
  });

  it('puts other leading content in place of the checkbox', () => {
    inTable(<FinTableCell leading={<span>Lead</span>}>Name</FinTableCell>);
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.getByText('Lead')).toBeInTheDocument();
  });

  it('shows text as a badge with the nested badge tone', () => {
    inTable(
      <FinTableCell type="badge" badgeTone="success" leadingAccessories={false}>
        Active
      </FinTableCell>,
    );
    expect(screen.getByText('Active').closest('[data-tone="success"]')).not.toBeNull();
  });

  it('shows text as a link, with a router link component when given', () => {
    const RouterLink = ({ href, className, children }: { href?: string; className?: string; children?: ReactNode }) => (
      <a href={href} className={className} data-router="">
        {children}
      </a>
    );
    const { rerender } = inTable(
      <FinTableCell type="link" href="/members/1" leadingAccessories={false}>
        View
      </FinTableCell>,
    );
    expect(screen.getByRole('link', { name: 'View' })).toHaveAttribute('href', '/members/1');
    rerender(
      <table>
        <tbody>
          <tr>
            <FinTableCell type="link" href="/members/2" linkAs={RouterLink} leadingAccessories={false}>
              View
            </FinTableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByRole('link', { name: 'View' })).toHaveAttribute('data-router');
  });

  it('shows any other content as given, whatever the type', () => {
    inTable(
      <FinTableCell type="badge" leadingAccessories={false}>
        <strong>Custom</strong>
      </FinTableCell>,
    );
    expect(screen.getByText('Custom').tagName).toBe('STRONG');
    expect(screen.getByText('Custom').closest('[data-tone]')).toBeNull();
  });

  it('has a named action button that reports clicks', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    inTable(
      <FinTableCell action actionLabel="Edit member" actionIcon="visibility" onAction={onAction}>
        Name
      </FinTableCell>,
    );
    const button = screen.getByRole('button', { name: 'Edit member' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('visibility');
    await user.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('reports checkbox changes', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    inTable(<FinTableCell checked={false} onCheckedChange={onCheckedChange} checkboxLabel="Select Ann" />);
    await user.click(screen.getByRole('checkbox', { name: 'Select Ann' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('forwards ref and attributes to the td', () => {
    const ref = createRef<HTMLTableCellElement>();
    inTable(
      <FinTableCell ref={ref} className="extra" leadingAccessories={false}>
        Name
      </FinTableCell>,
    );
    expect(ref.current?.tagName).toBe('TD');
    expect(ref.current).toHaveClass('extra');
  });
});
