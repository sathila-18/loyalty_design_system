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

0. **Plan first.** Read the component in Figma, compare it with `DESIGN.md`, and give the designer a build plan with a **Figma → code** table (§7.3 parity rules) and any questions. Flag anything outside the §7.3 patterns (a missing control, an extra visual option, a rename) **before** building. Wait for the go-ahead.
1. **Read the component in Figma** with the Figma tools, using the node ID from `DESIGN.md` §8. Get the exact layout, padding, gaps, sizes, radius, borders, shadows and which token each value uses. Take a screenshot to compare against. **Never guess a measurement.**
2. **If something can't be expressed with existing tokens**, stop and ask. Don't add new values.
   - **Other libraries and raw values:** if any value in the component is bound to a variable from another library (not Foundation – Loyalty) or is a raw value, this is **not** a reason to wait for a Figma fix. List each one with the Finspace Loyalty token you plan to use, **tell the designer before building**, then build with those tokens. In code, always use this system's tokens.
3. **Base → mapped:** if the component has a base (§7.2), build or extend the base first. Mapped components are thin wrappers that pass fixed props to the base and never copy its markup or styles.
4. **Map Figma properties as in §7.3**, following its **Figma ↔ code parity rules**: every Figma control (including exposed nested ones) has a matching prop with the same options; names differ only by the listed patterns. Interaction states (Enabled/Hovered/Pressed/Disabled/Focused/Typing) are runtime state handled in CSS and the DOM, not props. **Bases are internal** (not exported) unless `DESIGN.md` says otherwise (§7.2 rule 4).
5. **Add Storybook stories** for every variant, with controls for its main props, grouped under `Components/<Figma page>/` (internal bases under `Internal/`). Check them in **Light and Dark**.
6. **Write tests:** behaviour with Vitest + Testing Library (keyboard, disabled, ARIA), and no violations in the Storybook a11y addon in either theme.
7. **Compare with Figma:** check the Storybook result against the Figma screenshot, variant by variant. Fix any differences before saying it's done.
8. **Write a short component spec** in `DESIGN.md` §9 (Figma → code table, tokens used, API, accessibility, any decisions).
9. **Update the Status** in `DESIGN.md` §8 to ✅, and add a line to §11 Changelog.
10. **Summarize for the designer:** what was built, anything that didn't match Figma, and any questions. Then wait.

## Hard rules

### Tokens and styling
- **No hardcoded values.** No hex/rgb colors and no raw numbers for spacing, radius, font size, line height or shadows. Use the token utilities (`DESIGN.md` §3.11), or in CSS the generated token variables (`DESIGN.md` §3.8). The only exceptions are artwork (logos, flags, payment icons, illustrations) and `0`.
- **Components use semantic colors only** (`bg-*`, `text-*`, `border-*`, `fg-*`, `alpha-*`; in CSS `--fin-bg-*` …). Never palette or alias variables (`--fin-palette-*`, `--fin-color-*`); the Tailwind theme doesn't have them.
- **Never edit generated token files** (including `packages/ui/src/styles/theme.css`). Change `tokens/design.tokens.json` (re-exported from Figma) and rerun the token build and `pnpm icons`.
- **Tailwind CSS for components** (decided 5 Nov 2026; `DESIGN.md` §3.11). Components are being converted batch by batch; a component not yet converted keeps its `.module.css` and the old CSS Module rules until its batch. The rules:
  1. **Where classes live:** each component has a `Fin<Name>.styles.ts` with whole literal class strings, one export per element or part. Never build a class name from pieces (`'fin:p-' + size`): Tailwind and the lint must see every class. No style objects in TSX; the only exception is passing a dynamic value as a CSS variable (`style={{ '--fin-progress': '40%' }}`), read by a named utility.
  2. **Variants:** one class list per prop value, in a lookup object (`size.large`, `variant.primary`), picked in the TSX. Lists never set the same property, so nothing depends on the order of Tailwind's rules. Keep the `data-*` attributes on the element (`data-variant`, `data-size`, `data-error`) as hooks for tests, a11y exceptions and app CSS, but don't style props through them.
  3. **States:** `enabled:hover:`, `enabled:active:`, `disabled:`, `focus-visible:`, `aria-disabled:`. A child that follows its parent's state uses a named group (`fin:group/button` on the parent, `fin:group-hover/button:` on the child).
  4. **Tokens only:** every class has the `fin:` prefix; semantic utilities only (a colour from another group names it first: `bg-fg-active`); space names for padding, margin and gap (`p-xl`, `gap-m`), size numbers for sizes (`size-24`). No arbitrary values (`[…]`, `(--var)`), no `!`, no `-px`.
  5. **Brand and theme** come from the tokens only, never `dark:` (it's disabled). An arbitrary variant is allowed only for a documented exception approved by the designer, with a comment. The approved list (any new case needs the designer's approval first):
     - `[[data-theme=dark]_&]:` for FinButton's `inverse` tone: in Dark, `bg-direct` is light, so the hover tint changes (`DESIGN.md` §10 #74).
     - `[[data-theme=dark]_&]:` for FinLogo's `auto` colour: Colored in Light, White in Dark. A logo is an image and can't follow a colour token (`DESIGN.md` §9.83; approved 5 Nov 2026).
  6. **Standard patterns:** Figma's inside stroke is `inset-ring` (1px) / `inset-ring-2`; the focus ring is `focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focused`; visually hidden text is `sr-only`.
  7. **Motion:** every animation or transition has a `motion-reduce:` counterpart.
  8. **`className`** is appended last, for placement by the parent (margin, width, grid position). App CSS wins over ours because ours is in `@layer fin`. Don't style another component's internals; pass props instead.
  9. **What utilities can't express** (complex `:has()`, native control parts, keyframes) goes into `packages/ui/src/styles/tailwind.css` as a named custom variant or utility, with a comment, never into per-component CSS.
  10. **Story and page layout CSS stays CSS Modules** (`<Story>.stories.module.css`, `<Page>.module.css`), with tokens and Stylelint: their grids need values tokens can't express.
  11. **Verification for each converted component:** `apps/storybook/scripts/visual.ts`, `main` against the branch in every brand × theme, with states for the converted component's stories; pixels and computed styles identical, and every normalisation (`--ignore-props`, `--normalize-shadows`, `--skip-hidden`) listed and explained in the batch summary. Run it in chunks with the Storybook dev server stopped.
  - Global CSS is limited to the token files, the reset, the font files and the Tailwind setup (`tailwind.css`, `theme.css`, `components.css`).
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

### Text: sentence case
- **All text content is in sentence case** (decided 22 Oct 2026): only the first word and proper names start with a capital. That's every label, title, heading, button, menu item, placeholder, helper text, message and default string in components, stories and pages: "Add programme configuration", "Rows per page", "Loyalty management", not "Add Programme Configuration".
- Proper names keep their capitals: people ("Olivia James"), countries ("Sri Lanka"), brands ("American Express"), and acronyms ("VIP", "LKR").
- Figma screens often use Title Case; write the text in sentence case anyway and note the difference (`DESIGN.md` §10 #65).
- Figma property names quoted in Storybook control descriptions (`Show Leading Icon`) are names, not text content; keep them as Figma has them.

### Figma
- **Figma is read-only.** Never create, edit, rename or delete anything in the Figma files. Only read and screenshot. If something in Figma needs changing, tell the designer.
- **Out of scope:** pages under "🔒 Do not use" in the component file (Cards, Notes, Image ratios, Tabs), and the Overlay `Mobile` variant. Never use a component from those pages, even inside another component.
- **Don't build a component marked 🔴 in `DESIGN.md` §8.** Tell the designer which §10 item blocks it.

## Pages (Storybook)

Real screens from the Figma screens file (`9eRxGGC7YQ6TPzi5PHYCgw`, page **Admin UIs**), built as Storybook pages to test the system end to end. The list, widths and status are in `DESIGN.md` §8.6 and §4.4.

- **Where:** in the Storybook app only (`apps/storybook/src/pages/<area>/`), never in `@finspace-loyalty/ui`, so pages are never shipped with the library. Titles `Pages/<Area>/<Page>`, the areas following the side nav (for example `Pages/Loyalty Management/Programme Configuration`).
- **Only our components and tokens.** Page CSS (`<Page>.module.css`) is for layout only: grid, sections and spacing between blocks, with tokens. Stylelint applies. No one-off buttons, colours or custom versions of existing components in a page.
- **Gaps are reported, not improvised.** If a screen needs a component that isn't built, a variant or option code doesn't have, or a value that isn't a token, list it for the designer instead of building something ad hoc.
- **Figma screens may be out of date.** If a screen uses a detached or older version of a component, or differs from the built component, flag the difference. Don't copy it.
- **Sentence case** for every text on a page, whatever the screen shows (see "Text: sentence case").
- **Fake data only, defined in the story files:** realistic, with edge cases (long names, empty states, many rows, and error states where the design shows them).
- **Widths:** check every page at **1920, 1440, 1280 and 1024** (Storybook viewport options; the side nav collapses below 1280, §2). Compare with Figma at 1920, and report how each layout behaves at the smaller widths, especially anything that breaks or wraps badly.
- **Light and Dark:** every page is checked in both themes and passes the a11y checks in both.
- **The real shell:** use the real layout components (side nav, header, grid) for the page shell, never a recreated version. If a shell component is missing, say so.
- **One screen at a time:** plan, wait for the go-ahead, build one page, show it in Storybook, and wait before the next.

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
  src/flags/                         ← FinFlag, finFlags registry (artwork copied from flag-icons by scripts/copy-flags.ts)
  scripts/subset-icons.ts            ← builds src/styles/generated/ (icon font subset, not committed)
  src/components/<Name>/             ← one folder per component:
    Fin<Name>.tsx
    Fin<Name>.styles.ts               ← Tailwind class lists (Fin<Name>.module.css until the component's batch)
    Fin<Name>.stories.tsx
    Fin<Name>.test.tsx
    index.ts
apps/storybook/                      ← Storybook (theme + brand toolbar, Foundations pages)
  src/pages/<area>/                  ← Pages: real screens from Figma (see "Pages"), never in the library
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
| Tailwind CSS 4.3 (`@tailwindcss/vite`) | Component styling, with a theme generated from the tokens (`DESIGN.md` §3.11) |
| ESLint + Stylelint | Lint. ESLint (`eslint-plugin-better-tailwindcss`) checks every class: our theme only, the `fin:` prefix, no arbitrary values, no `dark:`, no `!`. Stylelint (`stylelint.config.js`) blocks raw colors, `color-mix()`, palette/alias variables and typography parts in every CSS Module |

Commands (repo root): `pnpm storybook`, `pnpm icons` (regenerate the icon font after editing `finIcons`, and copy the flag artwork from `flag-icons`), `pnpm test` (Vitest, incl. the Stylelint rules test), `pnpm test:a11y` (every story, Light and Dark), `pnpm lint`, `pnpm lint:css`, `pnpm typecheck`, `pnpm build`, `pnpm build-storybook`. Before saying a component is done, all of them pass.
| PostCSS (`postcss-custom-media`) | Breakpoint custom media queries |

## Git

- `main` always builds, its tests pass and its Storybook runs.
- Use one short-lived branch per component (`feat/<component>`). **Merge into `main` and push only after the designer approves it, and only if every check passes** (`lint`, `lint:css`, `typecheck`, `test`, `test:a11y`, `build`, `build-storybook`); stop on the first failure. Then delete the branch (locally and on GitHub) and update the `DESIGN.md` §11 status note.
- Storybook is deployed on Vercel (`vercel.json`, README "Storybook on Vercel"): `main` deploys to production at **https://loyaltydesignsystem.vercel.app**, and every pushed branch gets a preview link. **After building a component, push its branch to GitHub** (`git push -u origin feat/<component>`, never to `main`), so Vercel builds a preview, and give the designer the preview link with the summary. The branch's link is **`https://loyaltydesignsystem-git-<branch>-sathila.vercel.app`** (the branch name in lower case, `/` and other symbols as `-`; e.g. `feat/tier-management` → `https://loyaltydesignsystem-git-feat-tier-management-sathila.vercel.app`). Previews sit behind Vercel's login (Deployment Protection), so the designer opens them signed in; before sharing, check the link exists (a redirect to the Vercel login, not a 404; the build can take a few minutes after the push). Pushing the branch is not merging: `main` still waits for the designer's approval.
- Write commit messages in the present tense, naming the component (for example `Add FinIcon and icon registry`).

## Figma files

| File | Key |
|---|---|
| Foundation – Loyalty | `q4UmuwbvxJng9Y0AKZ4IGW` |
| Component library – Loyalty | `vD9CL5tZQo4D26fUN3vKHT` |
