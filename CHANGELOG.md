# Changelog

Both packages, `@finspace-loyalty/tokens` and `@finspace-loyalty/ui`, always share one version. Each release is a GitHub Release with the two `.tgz` files (see USAGE.md and NEXTJS-USAGE.md for installing).

Sections: **Added** · **Changed** · **Fixed** · **Breaking** (with what developers need to change) · **Known issues**.

## Unreleased

### Added

### Changed

### Fixed

### Breaking

### Known issues

## v0.2.0 — 2026-11-10

### Added
- **`FinSignInLayout`**: the page shell for sign-in screens. The image panel on the left (your artwork, an optional title and description) and the form column on the right; below 1024 only the form, centred. Storybook: Components/Layout/Sign in layout.
- **`FinButton` `hanging`**: hanging alignment for Tertiary buttons under form content. The button keeps its padding and moves to the start by exactly that padding, so its label lines up with the fields' edge (the hover background and focus ring hang past it). Default off: existing buttons are unchanged. Storybook: Components/Buttons/Button, Hanging.

## v0.1.1 — 2026-11-09

### Changed
- `@finspace-loyalty/tokens` is now a **peer dependency** of `@finspace-loyalty/ui` (it was a regular dependency): install both release files in one command, at the same version (NEXTJS-USAGE.md §2). The library no longer carries its own copy of the tokens' code.

### Fixed
- Next.js: the components keep their `'use client'` markers in the built package (one file per component), so any component can be imported directly in a Server Component. With v0.1.0, `next build` failed with "createContext is not a function".
- Installing `@finspace-loyalty/ui` from the release files no longer looks for `@finspace-loyalty/tokens` on the npm registry (it failed with a 404 with pnpm).
- `FinTooltip` and `FinMenu` work when their trigger element is rendered by a Server Component (in development it failed with "Cannot read properties of undefined").

### Known issues
- On a window narrower than 1280, `FinAppShell` (and `FinSideNav` without `type` or `defaultType`) renders the side nav expanded on the server and collapses it once the page loads: the server can't know the window width. No hydration error, but the nav visibly collapses on first load on small screens.

## v0.1.0 — 2026-11-09

First release.

### Added
- 67 components (`Fin*`) for the Loyalty admin product: buttons, chips, badges, avatars, fields (text, mobile number, password, date, select, file upload, text area), checkboxes, radios, toggles, slider, lists, menus, table (toolbar, search, sorting, column filters, pagination, row actions, loading and empty states), dialog, side sheet, side nav, header, app shell, snackbar, notification banner, stepper, skeleton, stat card and more.
- Three brands, Finspace, Burgundy and Sampath, each in light and dark: set `data-brand` and `data-theme` on `<html>`.
- The design tokens package: colours, spacing, radius, type, shadows, grid and breakpoints, as CSS variables and TypeScript values.
- One stylesheet, `@finspace-loyalty/ui/index.css`, with everything in it: the tokens, the self-hosted fonts (Inter, Hanken Grotesk) and icon font (Material Symbols Rounded), the reset and the component styles.

### Changed
- Component styling moved from CSS Modules to Tailwind CSS, in the `@layer fin` cascade layer with the `fin:` prefix. No visual or API change, and apps don't need Tailwind. An app's own CSS (outside a layer) wins over the library's, so `className` works without `!important`; global element rules in the app (`button { … }`) override the components too.

### Breaking
- None (first release).
