# Changelog

Both packages, `@finspace-loyalty/tokens` and `@finspace-loyalty/ui`, always share one version. Each release is a GitHub Release with the two `.tgz` files (see USAGE.md and NEXTJS-USAGE.md for installing).

Sections: **Added** · **Changed** · **Fixed** · **Breaking** (with what developers need to change) · **Known issues**.

## Unreleased

### Added

### Changed

### Fixed

### Breaking

### Known issues

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

### Known issues
- The build strips the components' `'use client'` markers. In Next.js, use the components only inside your own Client Components (a Server Component that imports the library fails `next build`).
- `@finspace-loyalty/ui` asks for `@finspace-loyalty/tokens` from the npm registry, where it isn't published. Installing the `ui` file with pnpm fails; with npm, install both files in one command.
