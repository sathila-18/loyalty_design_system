# Custom brand colour (admin-defined)

**What it does:** an admin enters **one primary colour** in the product's settings, and the brand colours update everywhere: buttons, links, focus rings, selected states, toggles, sliders, progress bars and so on, in Light and Dark.

**What doesn't change:**
- The existing brands (`finspace`, `burgundy`, `sampath`). We still set those up for clients ourselves.
- Neutrals (backgrounds, text, borders), fonts, the status colours (success, warning, error) and **info**. The custom brand takes these from Finspace.

Available from **@finspace-loyalty/ui and @finspace-loyalty/tokens v0.9.0**. The design system's spec is DESIGN.md §3.12.

---

## How it works

Components never use colours directly. They use **semantic tokens** (`--fin-bg-action-primary`, `--fin-text-action`…), which point to a **brand scale** (Primary 50–900, plus a set for Dark). Each brand fills that scale with its own colours.

The **`custom`** brand fills the same scale from **one CSS variable**, `--fin-custom-primary`. The browser calculates every step with CSS relative colour syntax (`oklch(from var(--fin-custom-primary) …)`): each step takes the colour's **hue** and **saturation**, at a **lightness chosen so text stays readable** for any colour. The primary button keeps the colour's own lightness when it's dark enough for white text, so most brand colours come through unchanged.

```
admin's hex ──► --fin-custom-primary ──► brand scale (oklch, in CSS) ──► semantic tokens ──► every component
```

**What the colour becomes:**

| Admin's colour | Primary button | |
|---|---|---|
| Dark colours: burgundy `#660033`, navy `#1f2a5c`, forest `#1e5631`, crimson `#a4161a` | the same colour | kept |
| Mid and light colours: `#625bff` → `#4841c7`, sky blue `#38bdf8` → `#006388`, yellow `#ffff00` → `#5f5f00` | the same hue, darker | adjusted for readability |
| Near-black `#0a0a0a` | `#2e2e2e` | raised, so hover and pressed still show |

**Every colour works.** White text on buttons, links on the page, and focus rings meet WCAG 2.2 AA contrast for any input; the design system tests this across the whole colour wheel. Nothing needs to be blocked.

---

## For developers

### 1. Store the colour

Save the admin's colour as a hex string (`#rrggbb`, e.g. `#e11d48`) in the organisation's or tenant's settings. Save what the admin chose (`input` below), not the adjusted button colour.

### 2. Tell the admin what it becomes

```ts
import { checkBrandColor } from '@finspace-loyalty/ui';

const result = checkBrandColor('#38bdf8');
// {
//   input: '#38bdf8',     // the colour, as a 6-digit lower-case hex
//   button: '#006388',    // the primary button's colour that results
//   deltaE: 0.2866,       // how far the button colour is from the input (0 = the same)
//   adjusted: true,       // true when the difference is visible (deltaE ≥ 0.02)
//   lightness: 'lowered', // 'kept', 'lowered' (too light for white text) or 'raised' (near black)
// }
```

- **It never blocks.** Every colour can be saved.
- When `adjusted` is **true**, show **"Adjusted for readability"** next to the colour, with a swatch of `button`, so the admin isn't surprised.
- It returns **`null`** for anything that isn't a hex colour (`#rgb` or `#rrggbb`). Use that to validate the input field.
- For a full preview, `resolveCustomScale(hex)` returns every generated colour: `{ scale: { '50' … '900' }, dark: { action, hovered, pressed, focus, fill, 'fill-hovered', 'fill-pressed' } }`.

### 3. Apply it when the page is rendered

Set the brand and the colour on `<html>` **on the server**, so the page never flashes the default brand first:

```tsx
// app/layout.tsx
import type { CSSProperties } from 'react';
import { checkBrandColor } from '@finspace-loyalty/ui';
import '@finspace-loyalty/ui/index.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getTenantSettings(); // your own data source
  // Only a valid hex reaches the page: checkBrandColor returns null for anything else.
  const color = settings.brandColor ? checkBrandColor(settings.brandColor)?.input : undefined;

  return (
    <html
      lang="en"
      data-brand={color ? 'custom' : settings.brand /* finspace | burgundy | sampath */}
      data-theme={settings.theme ?? 'light'}
      style={color ? ({ '--fin-custom-primary': color } as CSSProperties) : undefined}
    >
      <body>{children}</body>
    </html>
  );
}
```

That's all a page needs: every component follows it, in Light and Dark.

- If `--fin-custom-primary` isn't set, the custom brand uses Finspace's primary (`#625bff`).
- Pass the colour through `checkBrandColor(...)?.input` as above, so only a clean hex ever goes into the `style` attribute.
- This variable is the **one allowed exception** to "don't inject styles": set only `--fin-custom-primary`, never another `--fin-*` variable.

### 4. Live preview in the settings screen (optional)

While the admin picks a colour, preview it before saving:

```tsx
'use client';

function previewBrandColor(hex: string) {
  const root = document.documentElement;
  root.dataset.brand = 'custom';
  root.style.setProperty('--fin-custom-primary', hex);
}
```

If they cancel, put back the saved `data-brand` and `--fin-custom-primary` (or remove the variable with `root.style.removeProperty('--fin-custom-primary')`).

### 5. Reset to default

Remove the custom colour from settings. The server then renders the normal `data-brand` with no `style` variable.

### 6. Browser support

The scale uses CSS relative colour syntax, supported by current Chrome, Edge, Safari and Firefox. Check it against the product's supported browsers.

### Don'ts

- Don't calculate colour scales yourself, and don't override individual tokens. Only set `--fin-custom-primary`.
- Don't save the adjusted `button` colour as the brand colour; save the admin's `input`.
- Don't set `data-brand` or the variable on an inner element. Use `<html>` only.

---

## What's next

- **Logo support** (formats, size, Dark mode, fallback) follows in a later version.
- **Dark text on very light buttons** (keeping pastel colours exactly as chosen) has been explored and isn't planned for now.

## Open questions for the developers

- Where the brand colour is stored, and who is allowed to change it.
- Whether the settings screen needs the live preview (step 4).
