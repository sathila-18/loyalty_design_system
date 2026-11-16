import { checkBrandColor, contrastRatio, LMAX, LMIN, oklchToRgb, resolveCustomScale, toHex } from '@finspace-loyalty/tokens/custom-brand';
import { describe, expect, it } from 'vitest';
import * as ui from '../src';

// The page and panel colours the brand sits on (the same in every brand; DESIGN.md §3.12).
const LIGHT = ['#ffffff', '#f5f5f5', '#ededed'];
const DARK = ['#19191a', '#292929', '#363636'];

/** The most saturated in-gamut colour at a lightness and hue (gamut mapping lowers chroma 0.4 to the edge). */
const vivid = (l: number, h: number) => toHex(oklchToRgb({ l, c: 0.4, h }));

const inputs: string[] = [];
for (let h = 0; h < 360; h += 15) for (const l of [0.15, 0.3, 0.45, 0.62, 0.85]) inputs.push(vivid(l, h), toHex(oklchToRgb({ l, c: 0.06, h })));
inputs.push('#ffff00', '#00ffff', '#0a0a0a', '#f5f5f5', '#000000', '#ffffff', '#0000ff', '#ff0000', '#00ff00', '#ff00ff');

describe('custom brand', () => {
  it('passes every contrast rule for any input colour (24 hues × 5 lightnesses, muted and vivid, and the extremes)', () => {
    const worst = { white: 99, action: 99, focus: 99, darkAction: 99, darkFocus: 99, darkFill: 99 };
    for (const input of inputs) {
      const { scale, dark } = resolveCustomScale(input)!;
      worst.white = Math.min(worst.white, ...(['500', '600', '700'] as const).map((s) => contrastRatio('#ffffff', scale[s])));
      worst.action = Math.min(worst.action, ...LIGHT.map((b) => contrastRatio(scale['500'], b)));
      worst.focus = Math.min(worst.focus, ...LIGHT.map((b) => contrastRatio(scale['400'], b)));
      worst.darkAction = Math.min(worst.darkAction, ...DARK.map((b) => contrastRatio(dark.action, b)));
      worst.darkFocus = Math.min(worst.darkFocus, ...DARK.map((b) => contrastRatio(dark.focus, b)));
      worst.darkFill = Math.min(worst.darkFill, ...(['fill', 'fill-hovered', 'fill-pressed'] as const).map((s) => contrastRatio('#ffffff', dark[s])));
    }
    expect(worst.white).toBeGreaterThanOrEqual(4.5);
    expect(worst.action).toBeGreaterThanOrEqual(4.5);
    expect(worst.focus).toBeGreaterThanOrEqual(3);
    expect(worst.darkAction).toBeGreaterThanOrEqual(4.5);
    expect(worst.darkFocus).toBeGreaterThanOrEqual(3);
    expect(worst.darkFill).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps a dark brand colour as it is, and never makes hover or pressed lighter than the button', () => {
    for (const input of ['#660033', '#1f2a5c', '#1e5631', '#a4161a']) {
      expect(checkBrandColor(input)).toMatchObject({ input, button: input, deltaE: 0, adjusted: false, lightness: 'kept' });
      const { scale } = resolveCustomScale(input)!;
      expect(contrastRatio('#ffffff', scale['600'])).toBeGreaterThan(contrastRatio('#ffffff', scale['500']));
      expect(contrastRatio('#ffffff', scale['700'])).toBeGreaterThan(contrastRatio('#ffffff', scale['600']));
    }
  });

  it('reports light colours as adjusted (lowered) and near-black as raised, without blocking', () => {
    expect(checkBrandColor('#ffff00')).toMatchObject({ adjusted: true, lightness: 'lowered' });
    expect(checkBrandColor('#625bff')).toMatchObject({ adjusted: true, lightness: 'lowered' });
    expect(checkBrandColor('#0a0a0a')).toMatchObject({ adjusted: true, lightness: 'raised' });
    expect(checkBrandColor('#fff')!.input).toBe('#ffffff');
    expect(checkBrandColor('not a colour')).toBeNull();
    expect(LMIN).toBeLessThan(LMAX);
  });

  it('is exported from the ui package', () => {
    expect(ui).toHaveProperty('checkBrandColor');
    expect(ui).toHaveProperty('resolveCustomScale');
  });
});
