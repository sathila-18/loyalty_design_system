# Theming — CSS Variable Overrides

How to apply a project-specific brand to `@finspace-loyalty/ui` without changing this library.

---

## How the token layers work

```
--fin-palette-*            raw color values (always fixed, defined in :root)
       ↓
--fin-color-primary-*      brand alias  ← your override point
       ↓
--fin-bg-*  --fin-text-*  --fin-border-*  --fin-fg-*    semantic (used by components)
```

Components only read semantic variables (`--fin-bg-action-primary`, `--fin-text-primary`, etc.).
Semantic variables read from `--fin-color-primary-*`.
So overriding `--fin-color-primary-*` inside a `[data-brand="..."]` selector is enough to rebrand every component.

---

## Step 1 — Create brand.css in the consumer project

```css
/* src/brand.css */

/* 1. Define your brand's color palette */
:root {
  --my-brand-50:  #f0f0ff;
  --my-brand-100: #d0d0f8;
  --my-brand-200: #b0b0f0;
  --my-brand-300: #8080e8;
  --my-brand-400: #6060e0;
  --my-brand-500: #3030d0;  /* your main brand color */
  --my-brand-600: #2a2abb;
  --my-brand-700: #2020a0;
  --my-brand-800: #18188a;
  --my-brand-900: #101070;
}

/* 2. Map your palette to the design system's primary color aliases */
[data-brand="my-brand"] {
  --fin-color-primary-50:  var(--my-brand-50);
  --fin-color-primary-100: var(--my-brand-100);
  --fin-color-primary-200: var(--my-brand-200);
  --fin-color-primary-300: var(--my-brand-300);
  --fin-color-primary-400: var(--my-brand-400);
  --fin-color-primary-500: var(--my-brand-500);
  --fin-color-primary-600: var(--my-brand-600);
  --fin-color-primary-700: var(--my-brand-700);
  --fin-color-primary-800: var(--my-brand-800);
  --fin-color-primary-900: var(--my-brand-900);

  /* Dark-mode interaction states — map to lighter shades */
  --fin-color-primary-dark-action:       var(--my-brand-400);
  --fin-color-primary-dark-hovered:      var(--my-brand-300);
  --fin-color-primary-dark-pressed:      var(--my-brand-200);
  --fin-color-primary-dark-focus:        var(--my-brand-300);
  --fin-color-primary-dark-fill:         var(--my-brand-500);
  --fin-color-primary-dark-fill-hovered: var(--my-brand-400);
  --fin-color-primary-dark-fill-pressed: var(--my-brand-300);
}
```

---

## Step 2 — Import it last in main.tsx

```ts
// main.tsx — import order matters
import '@finspace-loyalty/tokens/tokens.css';
import '@finspace-loyalty/tokens/styles.css';
import '@finspace-loyalty/ui/index.css';
import '@finspace-loyalty/ui/components.css';
import './brand.css';                          // ← last, so it wins
```

---

## Step 3 — Set data-brand on <html>

```ts
// Set once in your app shell (e.g. index.html or root component)
document.documentElement.setAttribute('data-brand', 'my-brand');
document.documentElement.setAttribute('data-theme', 'light'); // or 'dark'
```

Or directly in `index.html`:

```html
<html data-brand="my-brand" data-theme="light">
```

---

## What you can override

| Variable group | What it controls | Example |
|---|---|---|
| `--fin-color-primary-50` … `900` | All button, link, focus-ring and active-state colors | Your brand color scale |
| `--fin-palette-font-family-primary` | Font used in all components | `'Your Font', sans-serif` |
| `--fin-radius-xs` … `xl` | Corner radii across all components | `2px` for a sharp look |
| `--fin-space-*` | Spacing scale (padding, gap, margin) | Adjust density |
| `--fin-color-success/warning/error-*` | Status indicator colors | Match your brand's semantic colors |

Override only what differs. Leave everything else alone — it inherits from the library.

---

## Example — Sharp corporate style

```css
[data-brand="my-brand"] {
  /* Flatten all radii */
  --fin-radius-xs: 2px;
  --fin-radius-s:  2px;
  --fin-radius-m:  4px;
  --fin-radius-l:  4px;
  --fin-radius-xl: 6px;

  /* Use a different font */
  --fin-palette-font-family-primary: 'Roboto', system-ui, sans-serif;

  /* Primary brand: deep navy */
  --fin-color-primary-50:  #e8eaf6;
  --fin-color-primary-100: #c5cae9;
  --fin-color-primary-200: #9fa8da;
  --fin-color-primary-300: #7986cb;
  --fin-color-primary-400: #5c6bc0;
  --fin-color-primary-500: #3f51b5;
  --fin-color-primary-600: #3949ab;
  --fin-color-primary-700: #303f9f;
  --fin-color-primary-800: #283593;
  --fin-color-primary-900: #1a237e;

  --fin-color-primary-dark-action:       var(--fin-color-primary-400);
  --fin-color-primary-dark-hovered:      var(--fin-color-primary-300);
  --fin-color-primary-dark-pressed:      var(--fin-color-primary-200);
  --fin-color-primary-dark-focus:        var(--fin-color-primary-300);
  --fin-color-primary-dark-fill:         var(--fin-color-primary-500);
  --fin-color-primary-dark-fill-hovered: var(--fin-color-primary-400);
  --fin-color-primary-dark-fill-pressed: var(--fin-color-primary-300);
}
```

---

## Existing brands (built into the library)

The library ships three brands you can use without any `brand.css`:

| `data-brand` value | Primary color | Font |
|---|---|---|
| `finspace` (default) | Electric indigo `#625bff` | Inter |
| `burgundy` | Burgundy `#660033` | Inter |
| `sampath` | Orange `#f97316` | Hanken Grotesk |

```html
<!-- Use an existing brand — no brand.css needed -->
<html data-brand="burgundy" data-theme="light">
<html data-brand="sampath" data-theme="light">
```

---

## What you cannot change with this approach

- Component structure, layout or markup
- Spacing scale (you can override `--fin-space-*` values but not add new steps)
- Dark-mode behaviour — the library controls light/dark switching via `data-theme`

For changes beyond colors and radius, those require updates to the design system itself.
