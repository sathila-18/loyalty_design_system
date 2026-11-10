import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinSignInLayout } from './FinSignInLayout';

const layout = (props: Partial<Parameters<typeof FinSignInLayout>[0]> = {}) =>
  render(
    <FinSignInLayout image={<img src="/art.jpg" alt="" />} {...props}>
      <h1>Get started now!</h1>
    </FinSignInLayout>,
  );

describe('FinSignInLayout', () => {
  it('puts the form column in the main landmark and the artwork in a complementary panel', () => {
    layout();
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { name: 'Get started now!' }));
    const panel = screen.getByRole('complementary');
    expect(panel.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('shows the image title and description as text, with the scrim hidden from assistive tech', () => {
    const { container } = layout({ imageTitle: 'Customer engagement portal', imageDescription: 'Start your journey.' });
    expect(screen.getByText('Customer engagement portal')).toBeInTheDocument();
    expect(screen.getByText('Start your journey.')).toBeInTheDocument();
    expect(container.querySelector('[data-part="panel"] [aria-hidden="true"]')).not.toBeNull();
  });

  it('draws no text block or scrim without a title or description', () => {
    const { container } = layout();
    expect(container.querySelector('[data-part="panel"] [aria-hidden="true"]')).toBeNull();
    expect(container.querySelectorAll('[data-part="panel"] p')).toHaveLength(0);
  });

  it('shows the description alone when there is no title', () => {
    const { container } = layout({ imageDescription: 'Only a description.' });
    expect(container.querySelectorAll('[data-part="panel"] p')).toHaveLength(1);
  });

  it('passes other attributes to the root and appends className last', () => {
    const { container } = layout({ className: 'app-placement', id: 'sign-in' });
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('id', 'sign-in');
    expect(root.className.endsWith(' app-placement')).toBe(true);
  });
});
