# Using Finspace Loyalty UI in Next.js

How to use the design system's **component library** and **foundations** (tokens, fonts, icons) in a Next.js app.

> **Scope:** only the two packages, `@finspace-loyalty/ui` and `@finspace-loyalty/tokens`. The "Pages" section of Storybook holds design reference screens for designers. It is not part of the library, so don't copy those pages into the app.

**Component reference:** browse every component, its variants and its props in Storybook: <https://loyaltydesignsystem.vercel.app>

---

## 1. What you get

| Package | Contains |
|---|---|
| `@finspace-loyalty/ui` | React components (`Fin*`), the `FinIcon` icon component, and one stylesheet, `index.css`, with everything in it |
| `@finspace-loyalty/tokens` | The design tokens (colours, spacing, radius, type, shadows) for every brand and theme, plus TypeScript token values and breakpoints |

Requirements: **React 19** and **Next.js with the App Router**. A short note on the Pages Router is in §10.

---

## 2. Install

Both packages are attached to each GitHub Release (use **v0.1.1 or later**). Install **both, in one command, always at the same version**:

```bash
pnpm add \
  https://github.com/sathila-18/loyalty_design_system/releases/download/v0.1.1/finspace-loyalty-tokens-0.1.1.tgz \
  https://github.com/sathila-18/loyalty_design_system/releases/download/v0.1.1/finspace-loyalty-ui-0.1.1.tgz
```

`ui` needs `tokens` at the same version (a peer dependency): installed together, nothing is fetched from the npm registry. Installing `ui` alone fails with a 404 (pnpm then looks for `tokens` on the npm registry, where it isn't published). npm works the same way: `npm install <tokens url> <ui url>`.

**To upgrade:** change the version in **both** URLs in `package.json`, then run `pnpm install`. Never mix versions, for example `tokens 0.2.0` with `ui 0.1.0`.

You **don't** need to install or configure Tailwind CSS. The component styles are pre-compiled.

---

## 3. Import the styles once

Import one stylesheet, in the **root layout** only:

```tsx
// app/layout.tsx
import '@finspace-loyalty/ui/index.css';
```

`index.css` already contains:
- the tokens for every brand and theme
- the shadows and grid helpers
- the fonts (Inter, Hanken Grotesk and the Material Symbols icon font), self-hosted, so no Google Fonts link is needed
- the reset
- all the component styles

**Don't also import** `tokens.css`, `styles.css` or `components.css`. That loads the same styles twice, and if the two packages are ever at different versions, the copies conflict (for example, old and new brand colours at once).

---

## 4. Set the brand and theme

The brand and theme come from **two attributes on `<html>`**. Every component and token follows them automatically.

```tsx
// app/layout.tsx
import '@finspace-loyalty/ui/index.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-brand="sampath" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
```

| Attribute | Values |
|---|---|
| `data-brand` | `finspace`, `burgundy`, `sampath` |
| `data-theme` | `light`, `dark` |

**Rules:**
- **Set them on `<html>` only.** On a smaller element, the colours change but the font doesn't.
- **Each bank's deployment sets its brand once**, in the layout above. That's the planned setup: one site per bank.
- **Never inject brand or theme styles with JavaScript.** Change only the attributes.

### Switching light and dark at runtime (optional)

If the app offers a theme toggle, change the attribute from a Client Component, inside an event handler:

```tsx
// components/ThemeToggle.tsx
'use client';

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  }
  return <button type="button" onClick={toggle}>Toggle theme</button>;
}
```

If the user's choice must be remembered across visits, store it (in a cookie, so the server can render the right `data-theme` on first load and the page doesn't flash). That isn't built into the library yet.

---

## 5. Server and Client Components

- **Import any component directly in a Server Component** (v0.1.1 or later). The interactive ones (fields, menus, dialogs, tables…) are marked `'use client'` inside the library, file by file; purely presentational ones (badge, icon…) have no marker and render on the server.
- Next.js doesn't allow passing **functions** (like `onClick`, `onChange` or `getRowId`) or **components** (like `linkAs={Link}`) from a Server Component to a Client Component. When you need those, put that part in your own Client Component:

```tsx
// app/members/page.tsx (Server Component)
import { FinSelectField, FinTextField } from '@finspace-loyalty/ui';
import { MembersActions } from './MembersActions';

export default function MembersPage() {
  return (
    <main>
      {/* Props that are plain data: directly in the Server Component */}
      <FinTextField label="Member name" />
      <FinSelectField label="Tier" options={[{ value: 'gold', label: 'Gold' }]} />
      {/* Handlers: in your own Client Component */}
      <MembersActions />
    </main>
  );
}
```

```tsx
// app/members/MembersActions.tsx
'use client';

import { FinButton } from '@finspace-loyalty/ui';

export function MembersActions() {
  return (
    <FinButton onClick={() => { /* … */ }}>
      Add member
    </FinButton>
  );
}
```

> The exact props of each component (variant, size, tone, icons…) are in Storybook, under each component's **Docs** and **Controls**, and in the TypeScript types your editor shows.

---

## 6. Links and routing

The library doesn't import a router. Link-like components (`FinSideNav`, `FinListStandard`, `FinTable` columns) take the link component through their `linkAs` prop, so they work with `next/link`. A component can't be passed from a Server Component, so set `linkAs` in a Client Component:

```tsx
'use client';

import Link from 'next/link';
import { FinSideNav } from '@finspace-loyalty/ui';

<FinSideNav linkAs={Link} currentHref="/members" sections={[{ icon: 'person', label: 'Members', href: '/members' }]} />
```

---

## 7. Icons

- Always use **`FinIcon`**, or a component's own icon props. Don't use the Material Symbols font, a `<span class="material-symbols-rounded">` or your own SVG icons for UI icons.
- Only the icon names in the library's registry are available. The icon font is reduced to those icons to keep it small.
- Allowed sizes: **16, 20, 24, 36, 48, 64** px.
- Icon-only controls need an accessible label (see each component's props).

If you need an icon that isn't in the registry, ask the design team to add it, rather than adding your own.

---

## 8. Using the foundations in your own CSS

For your own layout and page styles, use the **semantic** token variables. They change automatically with the brand and theme.

```css
.panel {
  background: var(--fin-bg-secondary);
  color: var(--fin-text-primary);
  border: 1px solid var(--fin-border-default);
  border-radius: var(--fin-radius-m);
  padding: var(--fin-space-xl);
}
```

| Family | Prefix | Use for |
|---|---|---|
| Backgrounds | `--fin-bg-*` | surfaces, fills |
| Text | `--fin-text-*` | text colour |
| Icons | `--fin-fg-*` | icon colour |
| Borders | `--fin-border-*` | borders, dividers, focus |
| Overlays | `--fin-alpha-*` | scrims, transparent fills |

**Rules:**
- **Use semantic variables only.** Never use `--fin-palette-*` or `--fin-color-*`: those are raw colours and don't switch with brand or theme.
- **Don't hard-code hex colours or pixel values** that exist as tokens.
- The full token list, with values for every brand and theme, is on the **Foundations** pages in Storybook.

**Breakpoints:** if your app uses PostCSS custom media, the tokens package ships breakpoint definitions (`@finspace-loyalty/tokens/breakpoints.css`). They're also available as TypeScript values (`@finspace-loyalty/tokens/breakpoints`).

**Tailwind (optional):** if your app uses Tailwind 4 for its own pages, the library also offers a theme file (`@finspace-loyalty/ui/theme.css`) that maps the tokens to Tailwind utilities. Its scale is our tokens, not Tailwind's defaults (for example `p-xl`, not `p-4`). See DESIGN.md §3.11 before using it.

---

## 9. Styling and overriding components

- **Use `className` only for placement:** margin, width, grid or flex position. To change how a component looks, use its props.
- **Your app's styles win over the library's** without `!important`, because the library's styles sit in a lower-priority CSS layer (`@layer fin`).
- **Watch out for global element rules** in your app, such as `button { background: none }`, `a { color: … }` or a CSS reset. They also override the components, because unlayered styles win. Scope your own resets to your own classes.

---

## 10. Pages Router (if needed)

Import the stylesheet once in `pages/_app.tsx`, and set the attributes in `pages/_document.tsx`:

```tsx
// pages/_app.tsx
import '@finspace-loyalty/ui/index.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

```tsx
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" data-brand="sampath" data-theme="light">
      <Head />
      <body><Main /><NextScript /></body>
    </Html>
  );
}
```

---

## 11. Accessibility

The components meet WCAG 2.2 AA: keyboard support, visible focus rings and proper roles. Keep it that way in the app:
- Give every icon-only control a label.
- Don't remove focus outlines with your own CSS.
- Use the components' own label and helper-text props for form fields, rather than placeholder text alone.
- Known brand-specific contrast exceptions are listed in DESIGN.md §10.

---

## 12. Troubleshooting

| Problem | Fix |
|---|---|
| Components have no styles | Import `@finspace-loyalty/ui/index.css` once in `app/layout.tsx` |
| Wrong colours, or no theme | Set `data-brand` and `data-theme` on `<html>` |
| Font doesn't change with the brand | `data-brand` must be on `<html>`, not on an inner element |
| Icons show as text | The stylesheet isn't imported, or the icon name isn't in the registry |
| A component looks different from Storybook | Check for global element rules in your app (§9) |
| Error about passing functions to Client Components | Move the part with handlers (or `linkAs`) into a `'use client'` component (§5) |
| "createContext is not a function" in a Server Component | You're on v0.1.0: upgrade both packages to v0.1.1 or later (§2) |
| Hydration warnings mentioning attributes like `bis_skin_checked`, `cz-shortcut-listen` or `data-new-gr-c-s-check-loaded` | A browser extension adds them to the page before React loads, not the library: test in an incognito window (extensions off) |
| On a narrow window (below 1280), the side nav shows expanded for a moment, then collapses | Expected for now: the server can't know the window width, so it renders the nav expanded and it collapses once the page loads (`FinAppShell`, and `FinSideNav` without `type` or `defaultType`). A `FinSideNav` on its own can start in a set state with `defaultType` |
| Styles look duplicated in dev tools | Remove extra imports; use only `index.css` (§3) |
| `404` when installing | Check the version in both URLs matches an existing release |
