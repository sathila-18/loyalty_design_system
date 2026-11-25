# Changelog

Both packages, `@finspace-loyalty/tokens` and `@finspace-loyalty/ui`, always share one version. Each release is a GitHub Release with the two `.tgz` files (see USAGE.md and NEXTJS-USAGE.md for installing).

Sections: **Added** · **Changed** · **Fixed** · **Breaking** (with what developers need to change) · **Known issues**.

## Unreleased

### Added

- **Scrollbars:** the design system now styles every scrollbar (tables, the app shell content, the side nav, menus, sheets, dialogs, text areas and the page): 8px thick, a light rounded thumb (`border-subtle`, `border-default` on hover) on a transparent track, in Light and Dark. Comes with `styles.css` / `index.css`; nothing to change. Always visible in Chrome, Edge and Safari; Firefox takes the colours and a thin bar; touch devices keep their own (DESIGN.md §4.6). On macOS, scroll areas now give 8px to the bar where the system used to overlay it. To use the browser's default in one area, override the scrollbar styles in your own CSS (ours are in a layer, so yours win).

### Changed

### Fixed

### Breaking

### Known issues

## v0.10.0 — 2026-11-24

### Added

- **FinSideNav:** `profile.menuDensity` (`'default' | 'compact'`, default `'default'`): compact rows in the account menu (8 padding instead of 16) for the items and the Theme row. New type `FinSideNavMenuDensity`.

## v0.9.1 — 2026-11-19

### Changed

- **Input fields:** an error's helper text now shows the warning icon, as Figma and FinTextArea (FinTextField, FinPasswordField, FinSelectField, FinMultiSelectField, FinDateField and every field on FinInputBase). Default and disabled helper text stay without an icon.
- **FinHelperText:** the error tone's `warning` icon is filled (was outlined), wherever error helper text shows it.

## v0.9.0 — 2026-11-16

### Added

- **Custom brand** (`data-brand="custom"` with `--fin-custom-primary: <hex>` on `<html>`): the Primary scale and the Primary dark group are generated in CSS from one admin-chosen colour (OKLCH relative colour syntax; DESIGN.md §3.12). Dark colours are kept; light ones are darkened so white text and action text stay readable. Info keeps a fixed scale. `checkBrandColor(hex)` and `resolveCustomScale(hex)` in `@finspace-loyalty/ui` (and `@finspace-loyalty/tokens/custom-brand`) say what a colour becomes. `FinBrand` now includes `'custom'`. How to use it: NEXTJS-USAGE.md ("Custom brand colour") and CUSTOM-BRAND.md.

### Changed

- Info colours (`bg-info`, `bg-info_secondary`, `text-info`, `border-info`, `fg-info`) now come from a new `--fin-color-info-*` alias group. Same colours in every brand and theme.

## v0.8.0 — 2026-11-16

### Added

- List rows: `density` (`'default'` | `'compact'`, default `'default'`) on `FinListStandard`, `FinListRadio`, `FinListCheckbox`, `FinListToggle`, their filled versions, and `FinListRadioGroup` / `FinListCheckboxGroup` (passed to every row). Compact is 8 padding on every side and between the content and the line (Default 16); filled cards 8 all round. Type `FinListItemDensity`.
- `FinTable` checkbox columns: `type: 'checkbox'` with `checked(row)`, `onCheckedChange(row, checked)` and `disabled` (boolean or per row), for values per row such as permissions. Each box is named "{row}, {header}" for screen readers.

### Changed

- The table's Rows per page menu and row actions menu use compact rows (8 padding instead of 16), so the menus are shorter.

## v0.7.0 — 2026-11-13

### Added

- `FinLabel` `tone`: `'default'` (`text-tertiary`, as before) or `'secondary'` (`text-secondary`), for a label on a tinted surface.
- `FinTextBox` `labelTone` (its Label's `tone`) and `headingAs="p"` (the heading as a paragraph, same look, for text that isn't a section heading).

### Changed

- `FinStatCard` is built from the atoms: a `FinTextBox` (type `h4`) with its `FinLabel`. It looks the same; in the markup the label is now a `<span>` (was a `<p>`). The API is unchanged.

## v0.6.0 — 2026-11-13

### Added

- `FinDateField` `isDateDisabled` and `today`, passed to its calendar (as `FinDatePicker`).
- `FinMenu` `returnFocusTo`: where focus goes when the menu closes with focus inside it, instead of the trigger.

### Changed

- `FinDateField`'s calendar button opens our calendar (`FinCalendar`) under the field instead of the browser's date picker. It opens on the typed date (or today); picking a day fills the field and puts focus back in the text. The API is the same.

## v0.5.0 — 2026-11-13

### Added

- `FinCalendar`: a month calendar (weeks from Monday) to pick one date (`mode="single"`, the default) or a range (`mode="range"`: a start, then an end). `value` / `defaultValue` / `onChange` as YYYY-MM-DD or `{ from, to }`, `numberOfMonths` (1 or 2), `min`, `max`, `isDateDisabled`, `defaultMonth`, `onMonthChange`, `today`. Full keyboard support (arrows, Home / End, Page Up / Page Down).
- `FinDatePicker`: a field with the select field's look that opens `FinCalendar` and shows the date as DD/MM/YYYY. `value` / `defaultValue` / `onChange` (YYYY-MM-DD), `label`, `placeholder`, `helperText`, `error`, `disabled`, `size`, `name`, `min`, `max`, `isDateDisabled`.
- `FinDateRangePicker`: the same field for a range, opening two months; `onChange({ from, to })` once the range is whole; `fromName` / `toName` for forms.

### Changed

- `FinMenu`: content marked `data-menu-focus` now also takes focus when a filter menu is opened with the keyboard (it was the first focusable element).

## v0.4.0 — 2026-11-11

### Added

- `FinMultiSelectField` (Figma Input field-Multi select): a field that opens a menu of options with checkboxes and shows each chosen one as a chip with a ✕; on one row, the chips that fit and "+N" for the rest. `value: string[]` / `defaultValue`, `onChange(values)`, `name`, `searchable`, `size`, `error`, `disabled`, like `FinSelectField`.
- `FinMenu` `multiple` (with `kind="select"`): several options can be chosen and the menu stays open after each.

### Changed

- `FinInputChip` uses the Unselected-border look (`border-default` with the Resting cards shadow), as Figma's multi-select chip; it was the lighter Unselected look.

## v0.3.0 — 2026-11-11

### Added

- Token `Size-500` (`--fin-size-500`; Tailwind `size-500`, `w-500`, `max-w-500` …), from the new Foundation – Loyalty export (646 variables).
- `FinButton` `variant="link"`: the text link button (like shadcn's link variant). `text-action` with no background, the label underlined on hover in the same colour, `text-pressed` when pressed; the same sizes and padding as the other buttons (use `hanging` to line it up with content). Normal tone only, with a leading or trailing icon or none (no icon-only). New type `FinButtonLinkProps`.

### Changed

- `FinSignInLayout`: the title and description over the artwork are now at most 500 wide (`Size-500`, as Figma's 499 text block), left-aligned, instead of the panel's full width. On a narrower panel (1024) they still wrap at the panel.

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
