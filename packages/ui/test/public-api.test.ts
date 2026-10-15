import { describe, expect, it } from 'vitest';
import * as ui from '../src';

// DESIGN.md §7.2: bases are internal unless DESIGN.md says otherwise. The package entry point must not expose them.
describe('public API', () => {
  it('exports FinBadge and the shared tone list, but not FinBadgeBase', () => {
    expect(ui).toHaveProperty('FinBadge');
    expect(ui.FIN_BADGE_TONES).toEqual(['primary', 'secondary', 'success', 'error', 'info', 'warning', 'disabled', 'neutral']);
    expect(ui).not.toHaveProperty('FinBadgeBase');
  });

  it('exports no base components', () => {
    expect(Object.keys(ui).filter((name) => /Base$/.test(name))).toEqual([]);
  });
});
