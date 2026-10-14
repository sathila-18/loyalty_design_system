# CLAUDE.md — Finspace Loyalty Design System

Instructions for Claude Code in this repo. Read them fully at the start of every session.

**What this repo is:** the Finspace Loyalty design system: a React + TypeScript component library for a **desktop** admin product (admins and super admins), with a Storybook catalogue, taken from Figma. The owner is the designer (Sathila), who decides what gets built and when.

**[`DESIGN.md`](./DESIGN.md) is the spec.** It defines the tokens, styles, icons and components, and their build status. This file only says *how to work*.

---

## Before any task

1. **Read `DESIGN.md`**, at least §2 (Core rules), §7 (Component architecture) and the section for the component you're working on.
2. Check the component's row in **§8 (inventory)**: its Figma node, what it depends on, and its status.
3. If anything it depends on isn't ✅ Done, **stop and tell the designer**. Don't build dependencies on your own.

## How to build a component

**Build only what the designer asks for, one component at a time.** Don't build ahead. When a component is done, **stop and wait for the designer's go-ahead** before starting the next one.

1. **Read the component in Figma** with the Figma tools, using the node ID from `DESIGN.md` §8. Get the exact layout, padding, gaps, sizes, radius, borders, shadows and which token each value uses. Take a screenshot to compare against. **Never guess a measurement.**
2. **If something can't be expressed with existing tokens**, stop and ask. Don't add new values.
   - **Other libraries and raw values:** if any value in the component is bound to a variable from another library (not Foundation – Loyalty) or is a raw value, this is **not** a reason to wait for a Figma fix. List each one with the Finspace Loyalty token you plan to use, **tell the designer before building**, then build with those tokens. In code, always use this system's tokens.
3. **Base → mapped:** if the component has a base (§7.2), build or extend the base first. Mapped components are thin wrappers that pass fixed props to the base and never copy its markup or styles.
4. **Map Figma properties as in §7.3.** Interaction states (Enabled/Hovered/Pressed/Disabled/Focused/Typing) are runtime state handled in CSS and the DOM, not props.
5. **Add Storybook stories** for every variant, with controls for its main props. Check them in **Light and Dark**.
6. **Write tests:** behaviour with Vitest + Testing Library (keyboard, disabled, ARIA), and no violations in the Storybook a11y addon in either theme.
7. **Compare with Figma:** check the Storybook result against the Figma screenshot, variant by variant. Fix any differences before saying it's done.
8. **Write a short component spec** in `DESIGN.md` §9 (API, variants, tokens used, any decisions).
9. **Update the Status** in `DESIGN.md` §8 to ✅, and add a line to §11 Changelog.
10. **Summarize for the designer:** what was built, anything that didn't match Figma, and any questions. Then wait.

## Hard rules

### Tokens and styling
- **No hardcoded values.** No hex/rgb colors and no raw numbers for spacing, radius, font size, line height or shadows in component CSS. Use the generated token variables (`DESIGN.md` §3.8). The only exceptions are artwork (logos, flags, payment icons, illustrations) and `0`.
- **Components use semantic colors only** (`--fin-bg-*`, `--fin-text-*`, `--fin-border-*`, `--fin-fg-*`, `--fin-alpha-*`). Never palette or alias variables (`--fin-palette-*`, `--fin-color-*`).
- **Never edit generated token files.** Change `tokens/design.tokens.json` (re-exported from Figma) and rerun the token build.
- **CSS Modules only.** Each component has one `<Component>.module.css`. Keep it portable so the styling approach can be changed later without touching component logic:
  - All styles live in the `.module.css` file. No style objects in TSX. The only exception is passing a dynamic value as a CSS variable (`style={{ '--fin-progress': '40%' }}`).
  - Express variants and data states with data attributes (`data-type="primary"`, `data-size="md"`, `data-error`), read in CSS with attribute selectors.
  - Interaction states use CSS: `:hover`, `:active`, `:focus-visible`, `:disabled` / `[aria-disabled="true"]`.
  - No `:global` selectors, no `!important`, no deep descendant chains into other components. Don't style another component's internals; pass props instead.
  - Global CSS is limited to the token files, the reset and the font files.
- **No runtime CSS-in-JS** (styled-components, Emotion, etc.).

### Next.js readiness
The app is React today and may move to Next.js. Components must work in both:
- Add `'use client'` at the top of any component that uses state, effects, refs or event handlers. Purely presentational components don't get it.
- Never touch `window`, `document` or `localStorage` at import time or during render. Only inside effects or event handlers.
- Don't import a router. Link-like components take an `as` prop (or a link component through a provider), so they work with React Router now and `next/link` later.
- Theme and brand are set with `data-theme` and `data-brand` attributes on `<html>`, never by injecting styles with JavaScript.

### Icons
- Always go through `FinIcon` and the `finIcons` registry (`DESIGN.md` §6.2). Never render the icon font, a `<span class="material-symbols-rounded">` or an SVG icon directly in a component.
- Utility icons are **Material Symbols Rounded** (self-hosted `material-symbols` package). Outlined (`FILL 0`) by default, filled (`FILL 1`) for active/selected states.
- **Never draw, invent or substitute an icon.** If an icon in Figma isn't from Material Symbols Rounded, or has no equivalent, stop and ask.
- Only the sizes listed in `DESIGN.md` §6.3 are allowed.

### Accessibility (WCAG 2.2 AA)
- Every interactive element works with the keyboard and shows a visible focus indicator (`:focus-visible`, using `--fin-border-focused`).
- Use native elements first (`button`, `input`, `a`). Add ARIA only when there's no native element.
- Icon-only controls need an accessible label.
- Pointer targets are at least 24 × 24 px.
- Respect `prefers-reduced-motion`.

### Names
- Components use the `Fin` prefix in PascalCase (`FinButton`, `FinTextField`). Code names follow `DESIGN.md` §8.
- Where a Figma name has a typo, use the corrected spelling in code and keep the Figma name in `DESIGN.md`.

### Figma
- **Figma is read-only.** Never create, edit, rename or delete anything in the Figma files. Only read and screenshot. If something in Figma needs changing, tell the designer.
- **Out of scope:** pages under "🔒 Do not use" in the component file (Cards, Notes, Image ratios, Tabs), and the Overlay `Mobile` variant. Never use a component from those pages, even inside another component.
- **Don't build a component marked 🔴 in `DESIGN.md` §8.** Tell the designer which §10 item blocks it.

## When to stop and ask

Stop and ask the designer, rather than deciding yourself, when:
- Figma and `DESIGN.md` disagree. Figma wins, but tell the designer so `DESIGN.md` gets updated.
- A value, color or icon isn't covered by a token or the icon registry.
- A spacing value in Figma isn't on the spacing scale, or isn't bound to a spacing variable.
- A value in a component is bound to a variable from another library, or is a raw value (ask with the proposed token mapping before building).
- A component needs something the design doesn't show (a missing state, a dark-mode color, keyboard behavior, empty/loading/error states).
- A component in Figma depends on a component from another file or library.
- Something is listed in `DESIGN.md` §10 (Known issues) as ❓ Decide.

## Repo layout

```
tokens/design.tokens.json            ← Figma variables (TokensBrücke export). Source of truth for values.
packages/tokens/                     ← @finspace-loyalty/tokens
  build.ts                           ← Style Dictionary config + custom transforms (DESIGN.md §3.9)
  src/styles.css                     ← hand-written: shadows, grid (DESIGN.md §4). Breakpoints are generated into dist/
  dist/                              ← GENERATED: tokens.css, tokens.ts, breakpoints.css, breakpoints.ts
packages/ui/                         ← @finspace-loyalty/ui
  src/styles/                        ← index.css (app stylesheet), reset.css, fonts.css (Inter, Material Symbols Rounded)
  test/                              ← tests that don't belong to one component (setup example, Stylelint rules)
  src/icons/                         ← FinIcon, finIcons registry (the icon font is subset from it)
  scripts/subset-icons.ts            ← builds src/styles/generated/ (icon font subset, not committed)
  src/components/<Name>/             ← one folder per component:
    Fin<Name>.tsx
    Fin<Name>.module.css
    Fin<Name>.stories.tsx
    Fin<Name>.test.tsx
    index.ts
apps/storybook/                      ← Storybook (theme + brand toolbar, Foundations pages)
DESIGN.md                            ← the spec
CLAUDE.md                            ← this file
```

- Package manager: **pnpm** workspaces.
- Create folders as you need them. Don't add folders, packages or dependencies outside this layout without asking.

## Tooling

| Tool | Use |
|---|---|
| Style Dictionary | JSON tokens → CSS variables + TypeScript |
| Vite | Library build and Storybook |
| Storybook (`@storybook/react-vite`) | Catalogue, with the a11y addon |
| Vitest + Testing Library | Behaviour tests |
| ESLint + Stylelint | Lint. Stylelint (`stylelint.config.js`) blocks raw colors, `color-mix()`, palette/alias variables and typography parts in every CSS Module |

Commands (repo root): `pnpm storybook`, `pnpm icons` (regenerate the icon font after editing `finIcons`), `pnpm test` (Vitest, incl. the Stylelint rules test), `pnpm test:a11y` (every story, Light and Dark), `pnpm lint`, `pnpm lint:css`, `pnpm typecheck`, `pnpm build`, `pnpm build-storybook`. Before saying a component is done, all of them pass.
| PostCSS (`postcss-custom-media`) | Breakpoint custom media queries |

## Git

- `main` always builds, its tests pass and its Storybook runs.
- Use one short-lived branch per component (`feat/<component>`), and merge back when it's done and checked.
- Write commit messages in the present tense, naming the component (for example `Add FinIcon and icon registry`).

## Figma files

| File | Key |
|---|---|
| Foundation – Loyalty | `q4UmuwbvxJng9Y0AKZ4IGW` |
| Component library – Loyalty | `vD9CL5tZQo4D26fUN3vKHT` |
