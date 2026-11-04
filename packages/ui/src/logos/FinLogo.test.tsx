import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinLogo } from './FinLogo';

const sources = (logo: HTMLElement) => [...logo.querySelectorAll('img')].map((img) => img.getAttribute('src') ?? '');

describe('FinLogo', () => {
  it('is one image named by the brand, Small by default', () => {
    render(<FinLogo brand="sampath" />);
    const logo = screen.getByRole('img', { name: 'Sampath Bank' });
    expect(logo).toHaveAttribute('data-size', 'small');
    for (const img of logo.querySelectorAll('img')) expect(img).toHaveAttribute('alt', '');
  });

  it('loads both versions with colour auto (CSS shows the one for the theme), else only the one asked for', async () => {
    const { rerender } = render(<FinLogo brand="sampath" />);
    const logo = screen.getByRole('img', { name: 'Sampath Bank' });
    expect(logo).toHaveAttribute('data-colour', 'auto');
    await waitFor(() =>
      expect(sources(logo)).toEqual([expect.stringMatching(/sampath-coloured/), expect.stringMatching(/sampath-white/)]),
    );

    rerender(<FinLogo brand="sampath" colour="white" />);
    await waitFor(() => expect(sources(logo)).toEqual([expect.stringMatching(/sampath-white/)]));
    rerender(<FinLogo brand="sampath" colour="coloured" />);
    await waitFor(() => expect(sources(logo)).toEqual([expect.stringMatching(/sampath-coloured/)]));
  });

  it('shows the mark only without text', async () => {
    render(<FinLogo brand="sampath" showText={false} colour="coloured" size="large" />);
    const logo = screen.getByRole('img', { name: 'Sampath Bank' });
    await waitFor(() => expect(sources(logo)).toEqual([expect.stringMatching(/sampath-mark-coloured/)]));
    expect(logo).toHaveAttribute('data-size', 'large');
    expect(logo).not.toHaveAttribute('data-text');
  });

  it('takes a label, and can be decorative', () => {
    const { rerender, container } = render(<FinLogo brand="sampath" label="Sampath Bank home" />);
    expect(screen.getByRole('img', { name: 'Sampath Bank home' })).toBeInTheDocument();
    rerender(<FinLogo brand="sampath" decorative />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
