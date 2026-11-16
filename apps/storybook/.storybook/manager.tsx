// Storybook bundles the manager with the classic JSX transform, so React must be in scope.
import React, { useState, type CSSProperties } from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';

/**
 * The "Custom colour" toolbar field (DESIGN.md §3.12): shown while the Brand toolbar is `custom`, it sets the
 * `customColor` global, which preview.tsx puts on the preview's <html> as --fin-custom-primary. Every story and page
 * can then be checked with any brand colour. Storybook only.
 *
 * The global is stored without the "#" (`625bff`), so it travels in Storybook's URL (`globals=…;customColor:625bff`).
 */
const ADDON_ID = 'fin/custom-colour';
const DEFAULT = '625bff';
const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** `#ABC` / `abc` → `aabbcc`, or null. */
function normalise(value: string): string | null {
  const m = HEX.exec(value.trim());
  if (!m) return null;
  const hex = m[1]!.toLowerCase();
  return hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
}

// Manager UI (Storybook's own chrome), not the product: plain inline styles that follow Storybook's toolbar.
const wrap: CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', font: 'inherit', fontSize: 12 };
const input: CSSProperties = {
  width: 76,
  height: 24,
  padding: '0 6px',
  font: 'inherit',
  fontFamily: 'ui-monospace, monospace',
  color: 'inherit',
  background: 'transparent',
  border: '1px solid currentColor',
  borderRadius: 4,
  opacity: 0.9,
};

function CustomColourTool() {
  const [globals, updateGlobals] = useGlobals();
  const stored = normalise(String(globals.customColor ?? DEFAULT)) ?? DEFAULT;
  const [draft, setDraft] = useState(`#${stored}`);
  // When the colour changes from outside (the URL, another story), show it; not while it's being typed.
  const [seen, setSeen] = useState(stored);
  if (seen !== stored) {
    setSeen(stored);
    if (normalise(draft) !== stored) setDraft(`#${stored}`);
  }

  if (globals.brand !== 'custom') return null;
  const valid = normalise(draft);

  return (
    <label style={wrap} title="Custom brand colour (--fin-custom-primary): a hex, #rgb or #rrggbb">
      <span>Custom colour</span>
      <span
        aria-hidden
        style={{ width: 16, height: 16, borderRadius: 4, border: '1px solid currentColor', background: `#${valid ?? stored}` }}
      />
      <input
        style={{ ...input, ...(valid ? {} : { borderColor: '#d22', color: '#d22' }) }}
        value={draft}
        spellCheck={false}
        aria-invalid={!valid}
        aria-label="Custom colour (hex)"
        onChange={(event) => {
          setDraft(event.target.value);
          const next = normalise(event.target.value);
          if (next && next !== stored) updateGlobals({ customColor: next });
        }}
        onBlur={() => setDraft(`#${stored}`)}
      />
    </label>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(`${ADDON_ID}/tool`, {
    type: types.TOOL,
    title: 'Custom colour',
    match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
    render: () => <CustomColourTool />,
  });
});
