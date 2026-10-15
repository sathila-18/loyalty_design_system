# Finspace Loyalty — Design System

> **Status:** Draft v0.2 · Last synced with Figma: 13 Oct 2026
> **Platform:** Web, React + TypeScript (desktop only)
> **Owner:** Design (Sathila)

This file is the **single source of truth** for the Finspace Loyalty design system. It describes **what** the system is: tokens, styles, icons and components. How Claude Code should work in this repo is in [`CLAUDE.md`](./CLAUDE.md).

If this file and Figma disagree, **Figma wins**. Flag the difference so this file can be updated.

---

## Contents

1. [Sources of truth](#1-sources-of-truth)
2. [Core rules](#2-core-rules)
3. [Foundations: tokens](#3-foundations-tokens)
4. [Foundations: styles (not variables)](#4-foundations-styles-not-variables)
5. [Motion](#5-motion)
6. [Icons](#6-icons)
7. [Component architecture](#7-component-architecture)
8. [Component inventory and build status](#8-component-inventory-and-build-status)
9. [Component specs](#9-component-specs)
10. [Known issues and open decisions](#10-known-issues-and-open-decisions)
11. [Changelog](#11-changelog)

---

## 1. Sources of truth

| What | Where | Figma file key |
|---|---|---|
| Foundations (variables, text/effect/grid styles) | [Foundation – Loyalty](https://www.figma.com/design/q4UmuwbvxJng9Y0AKZ4IGW/Foundation---Loyalty) | `q4UmuwbvxJng9Y0AKZ4IGW` |
| Components | [Component library – Loyalty](https://www.figma.com/design/vD9CL5tZQo4D26fUN3vKHT/Component-library---Loyalty) | `vD9CL5tZQo4D26fUN3vKHT` |
| Icons | [Material Symbols Rounded](https://fonts.google.com/icons?icon.set=Material+Symbols&icon.style=Rounded), npm package `material-symbols` (self-hosted) | — |
| Token values (exported) | `tokens/design.tokens.json` | — |

**Token export:** Figma variables are exported with the **TokensBrücke** plugin (DTCG 2025.10 format, colors as hex). To update, re-export, replace `tokens/design.tokens.json`, and rerun the token build. Never edit the generated files by hand.

**Out of scope:** In the component file, ignore every page below **🔒 Do not use** (Cards, Notes, Image ratios, Tabs). The **Overlay** `Mobile` variant is also out of scope.

---

## 2. Core rules

1. **Tokens only.** Components never contain raw hex values, pixel numbers or font sizes. Every color, space, radius, text style and shadow comes from a token. The only exceptions are artwork colors inside logos, flags, payment icons and illustrations.
2. **Use semantic colors in components.** Components use the `Color collection` tokens (`bg-*`, `text-*`, `border-*`, `fg-*`, `Alpha-*`). Primitive and alias colors exist only so semantic tokens can point to them.
3. **Light, dark and brand.** Every semantic color has a Light and a Dark value. Components must look correct in both. Theme and brand are set on `<html>` with `data-theme="light|dark"` and `data-brand="finspace"`. Never branch on theme or brand inside a component; read the token.
4. **Desktop layout.** The product is desktop only. No mobile layouts.

   | Rule | Value | Token |
   |---|---|---|
   | Grid | 12 columns, stretch | — |
   | Gutter | 24 | `Space-3XL` |
   | Page margin (left and right) | 24 | `Space-3XL` |
   | Narrowest supported width | 1024 | `Size-1024` |
   | Side nav | Collapsed by default below 1280, expanded from 1280 | `Size-1280` |

   - Below 1024 the page scrolls horizontally. Nothing reflows.
   - 1440 and 1920 currently use the same layout. The breakpoints exist for later.
   - **Spacing rules (page padding, section gap, card padding…) aren't defined yet.** Design will add them after the first UIs are built (§10). Until then, copy spacing from Figma using the spacing tokens (§3.5), and **report any value that isn't on the scale or isn't bound to a spacing variable** instead of copying it silently.
5. **Slots take design-system components.** A slot (for example the body of a Side sheet) accepts any React node, so it must only be filled with design-system components, never one-off layouts. **The container owns the outer padding and scrolling**, and slot content must not add its own outer padding, so spacing stays correct when content is swapped. See [§7.3](#73-figma-properties--react-props).
6. **Match Figma names.** Code names come from Figma names, converted to code style with the `Fin` prefix (see [§3.8](#38-figma--code-naming)). Don't invent new names.
7. **Accessibility: WCAG 2.2 AA.** Full keyboard support, visible focus (`border-focused`), native elements first, labels on icon-only controls, pointer targets at least 24 × 24, and respect for `prefers-reduced-motion` (see [§5](#5-motion)).
8. **Portable code.** Styles are CSS Modules that only use token variables, so the styling approach can change later without touching component logic. Components must also work under Next.js. The rules are in [`CLAUDE.md`](./CLAUDE.md) (Hard rules) and [§7.4](#74-code-conventions).

---

## 3. Foundations: tokens

Source: `tokens/design.tokens.json`, with 434 variables in 5 collections.

| Collection | Count | Modes | Purpose |
|---|---|---|---|
| `Primitives` | 151 | — | Raw color scales, type scale, sizes |
| `Alias Typography` | 92 | `Finspace` (brand) | Text style building blocks (family, weight, size, line height) |
| `Alias Colors` | 77 | `Finspace` (brand) | Role names for primitive scales. **This is the brand layer.** |
| `Color collection` | 87 | **Light / Dark** | **Semantic colors that components use** |
| `Alias Spacing & Radius` | 24 | — | Spacing and radius scales |

### 3.0 How the layers work

```
Primitives (raw hex)  →  Alias Colors (brand mode: Finspace)  →  Color collection (Light / Dark)  →  components
```

| Layer | Figma collection | Modes | Code scoping |
|---|---|---|---|
| 1. Primitives | `Primitives` | none | `:root` |
| 2. Alias (brand) | `Alias Colors` | **one mode per brand** (today: `Finspace`) | `[data-brand="…"]` |
| 2. Alias typography (brand) | `Alias Typography` | **one mode per brand** (today: `Finspace`) | `[data-brand="…"]` |
| 3. Semantic (theme) | `Color collection` | **Light / Dark** | `[data-theme="light|dark"]` |

- **Brands live in the alias layer as modes.** Each brand mode points the same alias names (`Primary-500`, `Secondary-500`…) at that brand's primitives. Adding a brand = adding a mode in `Alias Colors` (and its primitives); semantic tokens and components don't change.
- **Light and Dark live in the semantic layer as modes.** Semantic tokens point at alias names, so every brand gets Light and Dark automatically.
- **In code** the two attributes combine freely on `<html>`: `data-brand` picks the alias values, `data-theme` picks the semantic mapping.
- **`data-brand` goes on `<html>` only** (decided 14 Oct 2026). Semantic colors are computed where `data-theme` is set, so a `data-brand` further down the page wouldn't update them. `data-theme` may also be set on an inner element (for example side-by-side Light/Dark previews in Storybook).
- The token build reads the `Alias Colors` modes from the export and writes one `[data-brand]` block per mode. It does the same for `Alias Typography`, so a brand can also change fonts and type scale. Today there's one brand mode, `Finspace`, exported as `data-brand="finspace"`.

### 3.1 Primitive colors

_Collection `Primitives` → `Colors/Fintech`. Never use these directly in components; use the semantic tokens below._

| Scale | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| Electric Indigo (`Electric-Indigo-*`) | `#efefff` | `#ceccff` | `#b7b4ff` | `#9691ff` | `#817cff` | `#625bff` | `#5953e8` | `#4641b5` | `#36328c` | `#29266b` |
| Gray (`Gray-*`) | `#e8e8e8` | `#b8b8b8` | `#959596` | `#656566` | `#474748` | `#19191a` | `#171718` | `#121212` | `#0e0e0e` | `#0b0b0b` |
| White (`White-*`) | — | — | — | — | — | `#ffffff` | `#e8e8e8` | `#b5b5b5` | `#8c8c8c` | `#6b6b6b` |
| Graphite (`Graphite-*`) | `#efefef` | `#cecece` | `#b7b7b7` | `#969696` | `#818181` | `#626262` | `#595959` | `#464646` | `#363636` | `#292929` |
| Platinum (`Platinum-*`) | `#fdfdfd` | `#f8f8f8` | `#f5f5f5` | `#f0f0f0` | `#ededed` | `#e9e9e9` | `#d4d4d4` | `#a5a5a5` | `#808080` | `#626262` |
| Blue (`Blue-*`) — not used | `#e9e9fd` | `#bbbaf8` | `#9b99f4` | `#6d6bef` | `#514eec` | `#2522e7` | `#221fd2` | `#1a18a4` | `#14137f` | `#100e61` |
| Green (`Success-*`) | `#eaf6ef` | `#bee4cc` | `#9fd7b3` | `#73c590` | `#58b97b` | `#2ea85a` | `#2a9952` | `#217740` | `#195c32` | `#134726` |
| Yellow (`Warning-*`) | `#fdf3e7` | `#f8d9b3` | `#f5c68f` | `#f1ac5c` | `#ee9c3c` | `#ea830b` | `#d5770a` | `#a65d08` | `#814806` | `#623705` |
| Red (`Error-*`) | `#f9e8e8` | `#edb7b9` | `#e49497` | `#d86468` | `#d1454a` | `#c5171d` | `#b3151a` | `#8c1015` | `#6c0d10` | `#530a0c` |

Brand Key (hidden from publishing in Figma): `White` = `#ffffff`, `Black` = `#000000`

### 3.2 Alias colors (brand layer)

_Collection `Alias Colors` → `Colors/Fintech`. Role names that point 1:1 at a primitive scale (step for step)._

| Alias group | Token pattern | Points to |
|---|---|---|
| Primary | `Primary-50 … -900` | Electric Indigo |
| Secondary | `Secondary-50 … -900` | Gray (near-black) |
| Tertiary | `Tertiary-50 … -900` | Graphite |
| Tertiary1 | `Tertiary1-50 … -900` | Platinum |
| Tertiary2 | `Tertiary2-500 … -900` | White |
| Success | `Success-50 … -900` | Green |
| Warning | `Warning-50 … -900` | Yellow |
| Error | `Error-50 … -900` | Red |
| Key | `White`, `Black` | Brand Key White, Black |

### 3.3 Semantic colors (Light / Dark)

_Collection `Color collection`, modes **Light** and **Dark**. **Components must only use these.** Hex values are resolved for reference; code must reference the token, not the hex._

#### Background

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg-primary` | Tertiary2-500 `#ffffff` | Secondary-500 `#19191a` | Main background of screens, dialog boxes and side sheets |
| `bg-secondary` | Tertiary1-200 `#f5f5f5` | Tertiary-900 `#292929` | Side nav |
| `bg-tertiary` | Tertiary1-400 `#ededed` | Tertiary-800 `#363636` | Info callout notification backgrounds |
| `bg-neutral` | Tertiary1-500 `#e9e9e9` | Tertiary-700 `#464646` | Badge neutral background |
| `bg-brand` | Primary-500 `#625bff` | Primary-500 `#625bff` | Brand related backgrounds |
| `bg-active` | Primary-50 `#efefff` | Primary-900 `#29266b` | Active or selected state backgrounds |
| `bg-active-hover` | Primary-100 `#ceccff` | Primary-800 `#36328c` | Hover state of active or selected backgrounds |
| `bg-action-primary` | Primary-500 `#625bff` | Primary-500 `#625bff` | Primary button backgrounds |
| `bg-action-primary_hovered` | Primary-600 `#5953e8` | Primary-400 `#817cff` | Hover state of primary buttons |
| `bg-action-primary_pressed` | Primary-700 `#4641b5` | Primary-300 `#9691ff` | Pressed state of primary buttons |
| `bg-action-secondary` | Primary-50 `#efefff` | Primary-900 `#29266b` | Secondary button background (Figma description still says "swipe button", see §10) |
| `bg-action-secondary_hovered` | Primary-100 `#ceccff` | Primary-800 `#36328c` | Hover state of secondary buttons |
| `bg-action-secondary_pressed` | Primary-200 `#b7b4ff` | Primary-700 `#4641b5` | Pressed state of secondary buttons |
| `bg-action-inverse` | White `#ffffff` | White `#ffffff` | White call to action on brand |
| `bg-action-destructive` | Error-500 `#c5171d` | Error-400 `#d1454a` | Destructive buttons |
| `bg-action-destructive_hovered` | Error-600 `#b3151a` | Error-300 `#d86468` | Hover state of destructive buttons |
| `bg-action-destructive_pressed` | Error-700 `#8c1015` | Error-200 `#e49497` | Pressed state of destructive buttons |
| `bg-action-destructive-secondary_hovered` | Error-50 `#f9e8e8` | Error-700 `#8c1015` | Hover state of secondary destructive buttons |
| `bg-action-destructive-secondary_pressed` | Error-100 `#edb7b9` | Error-600 `#b3151a` | Pressed state of secondary destructive buttons |
| `bg-disabled` | Tertiary1-500 `#e9e9e9` | Tertiary-800 `#363636` | Disabled backgrounds |
| `bg-direct` | Secondary-500 `#19191a` | Tertiary1-50 `#fdfdfd` | Snackbar and Plain Tooltip backgrounds: dark in Light, light in Dark. Text on it uses `text-inverse`, icons `fg-inverse`. Renamed from `bg-dark` (14 Oct 2026). |
| `bg-success` | Success-600 `#2a9952` | Success-500 `#2ea85a` | Success backgrounds (notification, badge) |
| `bg-success_secondary` | Success-50 `#eaf6ef` | Success-900 `#134726` | Secondary success backgrounds (notification, badge) |
| `bg-error` | Error-500 `#c5171d` | Error-400 `#d1454a` | Error backgrounds (notification, badge) |
| `bg-error_secondary` | Error-50 `#f9e8e8` | Error-900 `#530a0c` | Secondary error backgrounds (notification, badge) |
| `bg-warning` | Warning-500 `#ea830b` | Warning-500 `#ea830b` | Warning backgrounds (notification, badge) |
| `bg-warning_secondary` | Warning-50 `#fdf3e7` | Warning-900 `#623705` | Secondary warning backgrounds (notification, badge) |
| `bg-info` | Primary-500 `#625bff` | Primary-400 `#817cff` | Info backgrounds (notification, badge) |
| `bg-info_secondary` | Primary-50 `#efefff` | Primary-900 `#29266b` | Secondary info backgrounds (notification, badge) |
| `bg-icons` | Tertiary1-400 `#ededed` | Tertiary-700 `#464646` | Icon or default avatar backgrounds |

#### Text

| Token | Light | Dark | Use |
|---|---|---|---|
| `text-primary` | Secondary-500 `#19191a` | Tertiary2-500 `#ffffff` | Titles and headings |
| `text-secondary` | Secondary-300 `#656566` | Tertiary-200 `#b7b7b7` | **Body text** and descriptions |
| `text-tertiary` | Secondary-400 `#474748` | Tertiary-300 `#969696` | Captions, overlines, hints |
| `text-placeholder` | Tertiary-300 `#969696` | Tertiary-400 `#818181` | Input field placeholder text |
| `text-disabled` | Tertiary-200 `#b7b7b7` | Tertiary-600 `#595959` | Disabled text |
| `text-disabled-on_bg` | Tertiary-300 `#969696` | Tertiary-500 `#626262` | Disabled text on backgrounds (buttons, badge, chips) |
| `text-inverse` | White `#ffffff` | Secondary-400 `#474748` | Text on `bg-direct` (Snackbar, Plain Tooltip). Flips with the theme (changed 14 Oct 2026). |
| `text-white_both` | White `#ffffff` | White `#ffffff` | Text on purple or red in both themes: primary and destructive buttons, Brand badge, badge indicator. Matches `fg-white_both`. New 14 Oct 2026. |
| `text-white_subtle` | Tertiary1-600 `#d4d4d4` | Tertiary1-600 `#d4d4d4` | Secondary text on brand backgrounds. Renamed from `text-inverse_subtle` (14 Oct 2026). |
| `text-dark_both` | Secondary-500 `#19191a` | Secondary-500 `#19191a` | Dark text in both light and dark modes |
| `text-action` | Primary-500 `#625bff` | Primary-400 `#817cff` | Text links, secondary buttons |
| `text-pressed` | Primary-700 `#4641b5` | Primary-300 `#9691ff` | Pressed state for text links |
| `text-hovered` | Primary-600 `#5953e8` | Primary-200 `#b7b4ff` | Hover state for text links |
| `text-success` | Success-700 `#217740` | Success-100 `#bee4cc` | Success texts |
| `text-error` | Error-500 `#c5171d` | Error-100 `#edb7b9` | Error texts |
| `text-info` | Primary-700 `#4641b5` | Primary-100 `#ceccff` | Information texts |
| `text-warning` | Warning-700 `#a65d08` | Warning-100 `#f8d9b3` | Warning texts |

#### Border

| Token | Light | Dark | Use |
|---|---|---|---|
| `border-default` | Tertiary1-600 `#d4d4d4` | Tertiary-700 `#464646` | Default border color. Also for dividers |
| `border-subtle` | Tertiary1-400 `#ededed` | Tertiary-800 `#363636` | Subtle border |
| `border-strong` | Tertiary-300 `#969696` | Tertiary-500 `#626262` | Strong border (radio buttons) |
| `border-active` | Primary-500 `#625bff` | Primary-400 `#817cff` | Active or selected states; typing state of input fields |
| `border-hovered` | Primary-600 `#5953e8` | Primary-300 `#9691ff` | Hover state for borders |
| `border-pressed` | Primary-700 `#4641b5` | Primary-200 `#b7b4ff` | Pressed state for borders |
| `border-focused` | Primary-400 `#817cff` | Primary-300 `#9691ff` | Focus ring and focused states |
| `border-action-primary` | Primary-500 `#625bff` | Primary-500 `#625bff` | Outline (secondary) buttons |
| `border-disabled` | Tertiary1-500 `#e9e9e9` | Tertiary-800 `#363636` | Disabled borders |
| `border-inverse` | Tertiary2-500 `#ffffff` | Secondary-500 `#19191a` | Borders on brand color |
| `border-success` | Success-500 `#2ea85a` | Success-400 `#58b97b` | Success border |
| `border-error` | Error-500 `#c5171d` | Error-400 `#d1454a` | Error border |
| `border-info` | Primary-500 `#625bff` | Primary-400 `#817cff` | Information border |
| `border-warning` | Warning-500 `#ea830b` | Warning-400 `#ee9c3c` | Warning border |

#### Foreground (icons)

| Token | Light | Dark | Use |
|---|---|---|---|
| `fg-primary` | Secondary-500 `#19191a` | Tertiary2-500 `#ffffff` | Primary icon color |
| `fg-secondary` | Tertiary-500 `#626262` | Tertiary-200 `#b7b7b7` | Secondary icons (input fields, close, chevron) |
| `fg-brand` | Primary-500 `#625bff` | Primary-400 `#817cff` | Brand related icons |
| `fg-placeholder` | Tertiary-300 `#969696` | Tertiary-400 `#818181` | Input field icons |
| `fg-active` | Primary-600 `#5953e8` | Primary-300 `#9691ff` | Icons in active state |
| `fg-disabled` | Tertiary-200 `#b7b7b7` | Tertiary-600 `#595959` | Disabled icons |
| `fg-disabled-on_bg` | Tertiary-300 `#969696` | Tertiary-500 `#626262` | Disabled icons on a background |
| `fg-inverse` | Tertiary2-500 `#ffffff` | Secondary-500 `#19191a` | Icons on brand color |
| `fg-dark_both` | Secondary-500 `#19191a` | Secondary-500 `#19191a` | Dark icons in both light and dark modes |
| `fg-white_both` | Tertiary2-500 `#ffffff` | Tertiary2-500 `#ffffff` | Light icons on brand color in both modes |
| `fg-action` | Primary-500 `#625bff` | Primary-400 `#817cff` | Action icons |
| `fg-hovered` | Primary-600 `#5953e8` | Primary-300 `#9691ff` | Hover state for action icons |
| `fg-pressed` | Primary-700 `#4641b5` | Primary-200 `#b7b4ff` | Pressed state for action icons |
| `fg-success` | Success-600 `#2a9952` | Success-200 `#9fd7b3` | Success icons |
| `fg-error` | Error-500 `#c5171d` | Error-200 `#e49497` | Error icons |
| `fg-info` | Primary-600 `#5953e8` | Primary-200 `#b7b4ff` | Information icons |
| `fg-warning` | Warning-600 `#d5770a` | Warning-200 `#f5c68f` | Warning icons |

#### Alpha

_Alpha tokens point at an alias color plus an opacity (Figma's color + opacity variable). The resolved value follows the brand._

| Token | Light | Dark | Use |
|---|---|---|---|
| `Alpha-sm` | Secondary-900 @ 16% `#0b0b0b29` | Secondary-900 @ 16% `#0b0b0b29` | Small CTAs inside branded cards |
| `Alpha-md` | Secondary-900 @ 40% `#0b0b0b66` | Secondary-900 @ 40% `#0b0b0b66` | Overlay backgrounds (scrim): `FinOverlay`, as in Figma (corrected 15 Oct 2026) |
| `Alpha-light` | White @ 12% `#ffffff1f` | White @ 12% `#ffffff1f` | More depth for elements on brand background |
| `Alpha-nav` | White @ 75% `#ffffffbf` | White @ 6% `#ffffff0f` | Navigation backgrounds and loading overlay |
| `Alpha-nav_background` | White @ 40% `#ffffff66` | Tertiary-900 @ 40% `#29292966` | — |
| `Alpha-both` | Tertiary-900 @ 42% `#2929296b` | Tertiary-900 @ 42% `#2929296b` | — (was listed as the scrim; Figma's Overlay uses `Alpha-md`, corrected 15 Oct 2026) |
| `Alpha-border` | Tertiary-900 @ 8% `#29292914` | Tertiary-900 @ 2% `#29292905` | Subtle borders on icon circles |
| `Alpha-success` | Success-500 @ 16% `#2ea85a29` | Success-500 @ 16% `#2ea85a29` | — |
| `Alpha-brand` | Primary-500 @ 16% `#625bff29` | Primary-500 @ 16% `#625bff29` | — |
| `Alpha-error` | Error-500 @ 16% `#c5171d29` | Error-500 @ 16% `#c5171d29` | — |

### 3.4 Typography

Font family: **Inter** (`Primitives/Typography/Font style/Primary`), self-hosted, weights 400, 500, 600, 700. Letter spacing 0 for all styles.

**Fallback stack (design decision, 14 Oct 2026):** `Inter, system-ui, sans-serif`. Figma only has `Inter`, so the token value stays `Inter`; The token build appends the fallbacks to every font family value (`--fin-palette-font-family-primary: Inter, system-ui, sans-serif`), so all `--fin-font-*` shorthands get them and a future brand font would too. Text never falls back to the browser's default serif font if Inter fails to load.

| Text style (Figma) | Variable group | Weight | Size | Line height | Note |
|---|---|---|---|---|---|
| `Display/Large-H1` | `Display Large-H1` | 700 | 48 | 62.4 |  |
| `Display/Medium-H2` | `Display Medium-H2` | 700 | 36 | 46.8 |  |
| `Display/Small-H3` | `Display Small-H3` | 700 | 28 | 39.2 |  |
| `Headline/Large-H4` | `Headline Large-H4` | 700 | 24 | 33.6 |  |
| `Headline/Medium-H5` | `Headline Medium-H5` | 600 | 20 | 28 |  |
| `Headline/Small-H6` | `Headline Small-H6` | 600 | 16 | 24 |  |
| `Body/Large` | `Body L` | 400 | 16 | 24 |  |
| `Body/Medium` | `Body M` | 400 | 14 | 21 |  |
| `Body/Small` | `Body S` | 400 | 12 | 18 |  |
| `Title/XLarge` | `Title XL` | 600 | 32 | 41.6 |  |
| `Title/Large` | `Title L` | 600 | 18 | 25.2 |  |
| `Title/Medium` | `Title M` | 600 | 16 | 24 |  |
| `Title/Small` | `Title S` | 600 | 14 | 21 |  |
| `Label/Large` | `Label L` | 600 | 16 | 24 |  |
| `Label/Medium` | `Label M` | 600 | 14 | 21 |  |
| `Label/Small` | `Label S` | 600 | 12 | 18 |  |
| `Caption/Large` | `Caption L` | 500 | 12 | 18 |  |
| `Caption/Medium` | `Caption M` | 500 | 11 | 16.5 |  |
| `Caption/Small` | `Caption S` | 600 | 10 | 15 |  |
| `Button/XLarge` | `Button XL` | 600 | 18 | 24 |  |
| `Button/Large` | `Button L` | 600 | 16 | 24 |  |
| `Button/Medium` | `Button M` | 600 | 14 | 24 |  |
| `Button/Small` | `Button S` | 600 | 12 | 24 |  |

- Line heights follow 1.3 (32 px and up), 1.4 (18–28 px) and 1.5 (16 px and below), except the Button styles, which use a fixed 24.
- `ExtraBold-800` exists in Primitives but no style uses it, so weight 800 isn't bundled.

### 3.5 Spacing

_Collection `Alias Spacing & Radius` → `Spacing`._

| Token | Value |
|---|---|
| `Space-none` | 0 |
| `Space-XXS` | 2 |
| `Space-XS` | 4 |
| `Space-S` | 6 |
| `Space-M` | 8 |
| `Space-L` | 12 |
| `Space-XL` | 16 |
| `Space-2XL` | 20 |
| `Space-3XL` | 24 |
| `Space-4XL` | 32 |
| `Space-5XL` | 36 |
| `Space-6XL` | 40 |
| `Space-7XL` | 48 |
| `Space-8XL` | 56 |
| `Space-9XL` | 64 |
| `Space-10XL` | 80 |
| `Space-11XL` | 96 |
| `Space-12XL` | 120 |

_14 Oct 2026: `Size-36` added and `Space-5XL`…`Space-11XL` moved down one step, with `Space-12XL` = 120 added. Before that date, `5XL` was 40 … `11XL` was 120._

### 3.6 Radius

| Token | Value |
|---|---|
| `Radius-none` | 0 |
| `Radius-XS` | 4 |
| `Radius-S` | 8 |
| `Radius-M` | 12 |
| `Radius-L` | 16 |
| `Radius-XL` | 24 |
| `Radius-Full` | 999999 (fully rounded / pill) |

### 3.7 Breakpoints

_From `Primitives/Sizes`. These are layout widths, not spacing, and are generated as breakpoint tokens only._

| Token | Value | Use |
|---|---|---|
| `Size-1024` | 1024 | Narrowest supported width. Side nav collapsed. |
| `Size-1280` | 1280 | Side nav expanded from here |
| `Size-1440` | 1440 | Main design width (Figma frames). No layout change yet |
| `Size-1920` | 1920 | Large desktop (Figma frames). No layout change yet |

`Size-343` and `Size-375` are mobile widths and aren't exported to code.

### 3.8 Figma → code naming

All generated code lives in `packages/tokens/dist/` and is **generated from `tokens/design.tokens.json`** by `pnpm --filter @finspace-loyalty/tokens build` (`packages/tokens/build.ts`). Don't edit those files by hand. Files: `tokens.css`, `tokens.ts` (`finColor`, `finSpace`, `finRadius`, `finSize`, `finFont`, plus `finBrands` and `finThemes` with their `FinBrand`/`FinTheme` types), `breakpoints.css`, `breakpoints.ts` (`finBreakpoint`), `reference.ts` (`finPaletteReference`, `finAliasReference`: palette and alias colors per brand, **for the Storybook reference page only, never for components**), plus compiled `.js` and `.d.ts`. Package entry points: `@finspace-loyalty/tokens`, `@finspace-loyalty/tokens/breakpoints`, `@finspace-loyalty/tokens/reference`, `@finspace-loyalty/tokens/tokens.css`, `@finspace-loyalty/tokens/breakpoints.css`, `@finspace-loyalty/tokens/styles.css`.

| Figma token | CSS | TypeScript | Rule |
|---|---|---|---|
| `bg-action-primary_hovered` | `var(--fin-bg-action-primary-hovered)` | `finColor.bgActionPrimaryHovered` | Semantic colors. Lowercase, `_` and spaces become `-` in CSS, camelCase in TS. The TS value is the `var(…)` reference, so it follows theme and brand. |
| `Alpha-nav_background` | `var(--fin-alpha-nav-background)` | `finColor.alphaNavBackground` | Same as above |
| `Space-XL`, `Space-2XL` | `var(--fin-space-xl)`, `var(--fin-space-2xl)` | `finSpace.xl`, `finSpace.x2l` | A number can't start a TS name, so `2XL` becomes `x2l` |
| `Radius-M`, `Radius-Full` | `var(--fin-radius-m)`, `var(--fin-radius-full)` | `finRadius.m`, `finRadius.full` | `full` = 999999 px, a pill / circle |
| Text style `Body/Large` | `font: var(--fin-font-body-large)` | `finFont.bodyLarge` | One `font` shorthand per **text style** (weight, size / line height, family). Use the text style name from §3.4. **Components use the shorthand only** (decided 14 Oct 2026). The parts (`--fin-font-body-large-size`, `-weight`, `-line-height`, `-family`) are generated so the shorthand can follow the brand; Stylelint (S6) blocks them in component CSS. If a component seems to need one, ask design. |
| `Size-1280` | `@media (--fin-bp-lg)` | `finBreakpoint.lg` | Custom media queries: `md` = 1024, `lg` = 1280, `xl` = 1440, `xxl` = 1920 (min-width). Generated by the token build (S2) into `breakpoints.css`; the TS value is the media query string, `'(min-width: 1280px)'`, for `matchMedia`. |
| Shadow style `Shadow/Resting_cards` | `var(--fin-shadow-resting-cards)` | — | Hand-written in `styles.css` (§4) |
| `Size-36` (a raw Figma size approved for a fixed dimension) | `var(--fin-size-36)` | `finSize[36]` | **Fixed sizes** (added 14 Oct 2026): the token build exposes every `Primitives/Sizes` value as `--fin-size-<n>`, pointing at its `--fin-palette-size-<n>` primitive. For dimensions that must **not** follow the spacing scale. **Widths and heights (design rule, 14 Oct 2026):** Figma doesn't bind component widths and heights to variables; that's normal and isn't reported as a raw value. Code maps each one to the matching `--fin-size-*` (icon sizes, icon containers…). If no `Size-*` primitive matches, ask design. Padding, gaps and margins always use `--fin-space-*`. Stylelint still blocks `--fin-palette-*`. |
| `Primitives`, `Alias Colors` | `--fin-palette-electric-indigo-500`, `--fin-color-primary-500` | — | Generated so semantic tokens can point to them. **Components must not use them** (Stylelint blocks it). |
| `Primitives` (non-color) | `--fin-palette-font-family-primary`, `--fin-palette-font-weight-bold-700`, `--fin-palette-font-size-48px`, `--fin-palette-line-height-48px`, `--fin-palette-size-8` | — | **Every primitive is `--fin-palette-*`**, not only colors (decided 14 Oct 2026), so one Stylelint pattern blocks the whole primitive layer. Spacing, radius and the text styles point to them. |

**Theming in CSS:**

```css
:root                    { /* primitives */ }
:root, [data-brand="finspace"] { /* alias colors + alias typography → primitives */ }
:root, [data-theme="light"]   { /* semantic colors → alias colors */ }
[data-theme="dark"]           { /* semantic colors → alias colors */ }
```

### 3.9 Export quirks the token build must handle

- **Font weights** are exported as `{ "value": 800, "unit": "px" }`. Drop the unit; they are plain weights.
- **Line heights** are exported as fractional px (`62.400002`). Round to one decimal (`62.4px`).
- **Alpha colors** are exported as `{ "components": "{Alias Colors…}", "alpha": 0.16 }`. This isn't standard DTCG. Resolve the referenced alias **as a variable** and apply the alpha with **`color-mix` only**: `color-mix(in srgb, var(--fin-color-primary-500) 16%, transparent)`, so it follows the brand (decided 14 Oct 2026; it works in more browsers than relative color syntax and gives the same result).
- **Aliases** (`{Collection.Group.Token}`) are kept as `var()` references between layers (not flattened to hex) and resolved per mode (Light/Dark).
- `LineHeight-64px 2` has a stray ` 2` in its name. Generate it as `line-height-64px`.
- `Primitives/Sizes`: `Size-1024` to `Size-1920` are generated as breakpoints only (§3.7). `Size-343` and `Size-375` aren't generated. The other sizes are generated as `--fin-palette-size-*` and are only reached through the spacing and radius tokens.
- `Font style/Primary` is the font family, not a style.
- **Mode names aren't in the export when a collection has only one mode.** TokensBrücke writes `mode: {}` for `Alias Colors` and `Alias Typography` (one mode, `Finspace`), and only writes mode names for `Color collection` (Light/Dark). The token build therefore has a small config that names the single brand `finspace`. When a second brand mode is added, the export will list both modes and the build should read them from there.
- **Styles aren't in the export** (shadows, text styles, grids). Shadows and grids are recorded in §4 and hand-written in `packages/tokens/src/styles.css`. Text styles are generated by the token build as `--fin-font-*` shorthands from the `Alias Typography` variables, one per group (23).

---

## 4. Foundations: styles (not variables)

These are saved as Figma **styles**, not variables, so they are **not** in the token JSON. Their values are recorded here. Claude Code puts them in `packages/tokens/src/styles.css` by hand, and they must be updated here and in code whenever the Figma style changes.

### 4.1 Text styles

There are 23 text styles (re-checked 13 Oct 2026). Each one is linked to its `Alias Typography` group (family, weight, size and line height all bound), so in code a text style is just the `--fin-font-*` shorthand built from those variables (§3.8). Names and values are in [§3.4](#34-typography), and they match the styles exactly. Letter spacing is 0 for all.

Designers use the text styles in Figma; Claude Code reads which style a text layer uses and applies the matching `--fin-font-*` token. A text layer with no text style is reported to the designer (§10 #22).

### 4.2 Shadows (effect styles)

_Re-checked 13 Oct 2026. Three styles, all neutral black, no background blur or inner shadow._

| Style | Layer (x, y, blur, spread, color) | CSS variable | Use |
|---|---|---|---|
| `Shadow/Resting_cards` | Drop: 0, 1, 3, 0, `#000000` 5% | `--fin-shadow-resting-cards` | Cards and surfaces at rest |
| `Shadow/Panel_sheets` | Drop: 0, 2, 10, 0, `#000000` 4% | `--fin-shadow-panel-sheets` | Panels and menus that sit directly on the page. **Not** Dialog box or Side sheet: they have no shadow on purpose, because they render on top of `FinOverlay` (the scrim), which separates them from the page. Their §9 specs must say so when they're built. |
| `Shadow/Sticky` | Drop: 0, **−2**, 16, 0, `#000000` 8% | `--fin-shadow-sticky` | Sticky bottom elements (the shadow falls upward) |

- Figma's drop-shadow **blur** maps to the CSS `box-shadow` blur value directly.
- Shadow colors are fixed values in Figma (not variables), so they're the same in Light and Dark (see §10 #5).
- Use a shadow only where the Figma component uses that style. If a component has an effect that isn't one of these styles, report it.

### 4.3 Layout grids (grid styles)

| Style | Frame | Columns | Gutter | Margin | Alignment |
|---|---|---|---|---|---|
| `Desktop-sm` | 1440 × 1024 | 12 | 24 (`Space-3XL`) | 24 (`Space-3XL`) | Stretch |
| `Desktop-lg` | 1920 × 1080 | 12 | 24 (`Space-3XL`) | 24 (`Space-3XL`) | Stretch |

Both grids are the same today. Hand-written in `styles.css` as `--fin-grid-columns`, `--fin-grid-gutter` and `--fin-grid-margin` (gutter and margin use `var(--fin-space-3xl)`).

---

## 5. Motion

> **Status: deferred. Don't build yet.** Don't create motion tokens or add animations to components until design confirms this section. Simple state changes (hover, pressed, focus) switch instantly until then.
>
> **Planned direction:** use **Material 3 motion** ([how it works](https://m3.material.io/styles/motion/overview/how-it-works)): its easing and duration pairs, written as CSS custom properties. When this is picked up:
> 1. Check the current M3 guidance first, since it has been updated over time.
> 2. Map each use (enter, exit, hover color, expand/collapse, side nav collapse) to an M3 easing + duration pair.
> 3. Agree the list with design.

**Exception (15 Oct 2026):** the `FinSpinner` loader spins (one turn per second, linear), at design's request (§9.17). It's the only animation so far; its duration is raw until motion tokens exist.

**Reduce motion:** every animation must respect `@media (prefers-reduced-motion: reduce)`. When it's on, elements appear instantly and loops stop.

---

## 6. Icons

### 6.1 Rules

| Type | Source | Style | Color |
|---|---|---|---|
| **Utility icons** | **Material Symbols Rounded**, npm package `material-symbols` (self-hosted variable font) | Outlined (`FILL 0`) by default, filled (`FILL 1`) for active/selected states | **Recolored per use** with an `fg-*` token. Changes in dark mode. |
| **Flags, payment icons, logos** | Assets exported from Figma | Own artwork | **Never recolor, redraw or distort.** |

- **For icons, the code is the source of truth (design decision, 14 Oct 2026).** Icons render from the self-hosted Material Symbols Rounded font by **ligature name**, never as SVGs. How an icon looks in Figma doesn't decide how it looks in code; design will update the Figma icons to match.
- **Never draw, invent or approximate an icon.** If a needed icon has no Material Symbols equivalent, stop and ask design.
- Icon names are the names **Material Symbols uses today**, in snake_case (`keyboard_arrow_down`, `person`). Where Figma uses an old Material Icons name, the code uses the current equivalent (list in §6.4); if there's no equivalent, ask design.
- The full variable font is 5.4 MB. The build generates a subset font from the `finIcons` registry automatically (§10 #14).

### 6.2 One component for every icon

Screens and components **never** render the icon font or an SVG directly. They always use:

```tsx
<FinIcon name="home" size={24} color="secondary" filled={isActive} label="Home" />
```

- `finIcons` is the single registry: a typed list of the icon names the system uses, so `name` is checked by TypeScript. **Adding an icon is a one-line change** to the registry; the font subset follows at the next build. In development, `FinIcon` warns when a name isn't in the registry.
- **Color (design decision, 14 Oct 2026):** `color` accepts **every `fg-*` token**, typed from the generated tokens, so new `fg-*` tokens become valid values automatically. Without `color`, the icon inherits `currentColor`. The Figma `State` variants (Primary, Secondary, Disabled, Success, Warning, Error, Info) are examples of these colors, not a separate prop.
- `filled` switches `FILL` 0 → 1. Use it for the active/selected state only.
- Without `label`, the icon is decorative (hidden from screen readers). With `label`, it's announced as an image with that name.
- **Font settings (design decision, 14 Oct 2026):** Material Symbols Rounded at **weight 300, optical size 24, grade 0**, with `FILL 0` by default and `FILL 1` when filled. The subset font has weight, optical size and grade fixed at these values, so CSS only sets `FILL`. They're the same at every size.
- **The icon size comes from `FinIcon`'s `size` prop** (the Icon sizes component, §6.3), not from the font. The optical size stays 24 at every size.
- S4 ships the full variable font from `material-symbols`; `FinIcon` replaces it with a generated subset (§10 #14). The smaller weight-300 build (`@material-symbols/font-300`) keeps `FILL` but is fixed at optical size 48, so it can't give optical size 24.

### 6.3 Sizes

_From the **Icon sizes** page (13 Oct 2026). Each set has a `State` variant: Primary / Secondary / Disabled / Success / Warning / Error / Info._

| Figma set | Node | Size |
|---|---|---|
| `16px` | `3017:6258` | 16 (`Size-16` → `--fin-size-16`) |
| `20px` | `3017:6323` | 20 (`Size-20` → `--fin-size-20`) |
| `24px` | `3017:6352` | 24 (`Size-24` → `--fin-size-24`), default |
| `36px` | `3017:6388` | 36 (`Size-36` → `--fin-size-36`) |
| `48px` | `3017:6417` | 48 (`Size-48` → `--fin-size-48`) |
| `64px` | `3017:7083` | 64 (`Size-64` → `--fin-size-64`) |

Only these six sizes exist (`size` prop: `16 | 20 | 24 | 36 | 48 | 64`). In Figma the frame sizes are **raw values** (not bound to a variable), which is fine; no Figma change is needed. **Design decision (14 Oct 2026):** code maps them to the `Size-*` primitives through `--fin-size-*` (§3.8), **not** to spacing tokens, so icon sizes never move when the spacing scale changes. Icon containers on the same page (`40px bg`, `48px bg`, `64px bg`) are `FinIconContainer`, §8.2 and §9.2.

### 6.4 Icons used in the component file

_Scan of all in-scope pages, 13 Oct 2026; names checked against Material Symbols Rounded on 14 Oct 2026 (§10 #23). `FinIcon`'s registry starts with these 28 names (current Material Symbols names):_

`arrow_back`, `assignment`, `cancel`, `check`, `check_circle`, `chevron_right`, `close`, `cloud_upload`, `credit_card`, `desktop_windows`, `dock_to_right`, `edit` (added 15 Oct 2026 for Profile image, §9.6), `home`, `info`, `keyboard_arrow_down`, `keyboard_arrow_right`, `keyboard_arrow_up`, `loyalty`, `notifications`, `person`, `photo_camera`, `plagiarism`, `remove`, `search`, `sports_esports`, `supervised_user_circle`, `visibility`, `visibility_off`, `warning`

**Old Material Icons names in Figma → current names in code:**

| Figma (old name) | Code (current name) | Note |
|---|---|---|
| `camera_alt` | `photo_camera` | |
| `payment` | `credit_card` | |
| `perm_identity` | `person` | The placeholder icon inside most components; in use it gets swapped for the needed icon. |
| `warning_amber` | `warning` | The font draws the same glyph for both, so the registry keeps one name. |

---

## 7. Component architecture

### 7.1 Levels

Components are built **bottom-up**. A component may only be built after everything it depends on is done.

| Level | Meaning |
|---|---|
| **Atom (L0)** | Contains no other component |
| **Atom (L1)** | Contains only icons or an L0 atom |
| **Molecule** | Built from atoms |
| **Organism** | Built from molecules |
| **Asset** | Artwork, not a component (flags, payment icons, logos) |

_Levels confirmed by design on 13 Oct 2026; each component's level is its section in §8. The first component to build is `Icon sizes` (L0)._

### 7.2 Base → mapped pattern (important)

Many components in Figma follow a **base → mapped** structure:

- A **base** component (for example `Base-button`, `Input field-base`) holds **every** option as boolean properties, text properties and slots.
- **Mapped** components are built from instances of the base, with some options fixed for a specific type, size or state.
- Changing the base updates every mapped component.

**Code must keep the same structure:**

1. Build the **base component first**, with all options as props.
2. Build each **mapped component** as a thin wrapper that only passes fixed props to the base. Mapped components must not copy the base's markup or CSS.
3. A visual fix to a mapped component almost always belongs in the **base**.
4. **Bases are internal unless DESIGN.md says otherwise** (decided 15 Oct 2026). A base isn't exported from the package entry point (`@finspace-loyalty/ui`); apps use the mapped components. Its stories live under **Internal** in Storybook, only to check it against Figma. A base becomes public only when DESIGN.md says so (for example when a Figma component uses the base directly), with the reason noted in its §9 spec. Shared option lists (such as tones) are defined once in the base and re-exported by the mapped component. `packages/ui/test/public-api.test.ts` checks that no `*Base` component, and none of the internal bases it lists (`FinBadgeBase`, `FinIndicatorDot`), is exported. Internal so far: FinBadgeBase (§9.9), FinIndicatorDot (§9.11). **Exceptions:** Figma's `Base-Radio_box` is public as `FinRadio` (§9.15), because nothing is mapped from it; `Progress bar` is public as `FinProgressBar` (§9.16) and `Spinner` as `FinSpinner` (§9.17), because they're also used on their own.

| Base | Mapped components |
|---|---|
| `Base-button` | `all-button` → used by Button dock, Dialog, Empty state, File uploads, Header, Notification, Side Menu, Side sheet, Snackbar, Pagination group, Table cell |
| `Badge-base` (was `Tag-base`) | `Badge-primary` |
| `Chips-base` | `Chips`, `Chips-group` |
| `Base-Checkbox` | `Checkbox` |
| `Segmented_button-base` | `Segmented button` |
| `Input field-base` (`49:5734`) | `Input field-standard`, `Input field-password`, `Input field-select`, `Input field-Multi select`, `Search` |
| `Input field-textArea-base` (`3094:26567`) | the text area set at `3097:27497` (still named `Input field-base` in Figma, §10 #17) |
| `Input-OTP-base` | (base only; no mapped OTP component in the file) |
| `Indicator` | `Indicator set` |
| `Progress bar` | `bar-with-text` (was `Progress-full`, before that `Progress-progress bar`) |
| `Spinner` | `spinner-with-text` (was `Progress-Spinner`) |
| `Avatar` | `Avatar Group`, `Profile image` |
| `Pagination item` | `Pagination group` |
| `List-base`, `List-fill-base` | (bases; used directly by Side Menu, no mapped components yet) |
| `Accordion-frame-base`, `Accordion-bare-base` | (bases only; no mapped components yet) |

**List and Accordion bases (design note, 13 Oct 2026).** These are bases even though nothing is mapped from them yet. They have no interaction states in Figma today (no hover, pressed or selected). Build them as bases with **no hover or selected styling** for now, but keep the structure ready for states: the root element must be able to take `data-selected` and be interactive later (as a `button` or link through the `as` prop) without changing the markup or slots. When design adds states, or a mapped list item needs them, they are added to the **base**, not to the mapped component. Don't invent states before design adds them.

`white-button` and `Destructive-button` are **separate** from `Base-button` in Figma (they don't contain it).

### 7.3 Figma properties → React props

| Figma property | React |
|---|---|
| **Variant** (Type, Size, Style…) | String union prop, such as `type: 'primary' \| 'secondary' \| 'tertiary'`, rendered as a `data-*` attribute for CSS |
| **Variant for interaction state** (`State=Enabled/Hovered/Pressed/Disabled`, `Focused`, `Typing`, `Complete`) | **Not a prop.** It's runtime state in CSS: `:hover`, `:active`, `:focus-visible`, `:disabled`. Only `disabled` itself is a prop (the native attribute). Only data states (`Error`, `Selected`, `Expanded`, `Indeterminate`) become props. |
| **`State` that only changes colors** (background, text, icon), for example `State=Primary/Secondary/Disabled/Success/Warning/Error/Info` on Icon sizes `40px bg` | **`tone` prop** (string union, rendered as `data-tone`). In this system "state" always means an interaction state, so a property that only changes colors is called `tone` in code (design decision, 14 Oct 2026). Use it for this and future components (badges, tags, notifications…). |
| **Boolean** (`Show Leading Icon`…) | `boolean` prop, or an optional node (for example `leadingIcon` undefined hides it) |
| **Text** (`Button label`…) | `string` prop, or `children` for the main label |
| **Slot** (`Leading accessory`, `Body content`…) | `ReactNode` prop |
| **Instance swap** (icon) | `FinIconName` prop |

- **Disabled controls are never focusable** and get no focus ring (native `disabled`). `Disabled + Focused` variants in Figma are ignored; don't build or style them (design decision, 13 Oct 2026).
- Form controls are **controlled or uncontrolled** like native inputs (`value` + `onChange`, or `defaultValue`), and forward `ref` to the native element.
- Every component accepts `className` and passes other native attributes to its root element.

#### Figma ↔ code parity (design rule, 15 Oct 2026)

A component does the same things in Figma and in code.

1. **Every Figma control has a matching prop**, with the same options and meaning, including the controls of nested components that Figma exposes (for example Text Box's Label: `labelSize`, `labelBadge`).
2. **Names differ only by these patterns:** a colour-only `State` becomes `tone`; interaction states (Hovered, Pressed, Focused…) become CSS, not props; typos get the corrected spelling; `Property 1` and unnamed properties get a meaningful name; booleans like `Show X` become `x`; a text property for the main content becomes `children` (see the table above). **Option values stay the same**, in lower case (`Display Large-H1` → `'display-large-h1'`, `Red` → `'red'`).
3. **Each §9 spec has a short "Figma → code" table** listing every Figma property and its prop. Components built before this rule have a one-line **"Figma → code names"** note instead, listing only the names that differ.
4. **Code may add props Figma can't express** only when they don't change the look and have sensible defaults: accessibility and behaviour (`label`, `htmlFor`, `headingLevel`, `onChange`, `valueText`…).
5. **Anything else** (a missing control, an extra visual option, or a rename outside these patterns) is **flagged to the designer before building**.

### 7.4 Code conventions

- One folder per component: `Fin<Name>.tsx`, `Fin<Name>.module.css`, `Fin<Name>.stories.tsx`, `Fin<Name>.test.tsx`, `index.ts`.
- Styles follow the CSS Modules rules in `CLAUDE.md`: token variables only, variants as `data-*` attributes, states with pseudo-classes, no `:global`, no style objects in TSX.
- `'use client'` on interactive components only. No browser APIs at import time. No router imports.
- Storybook: one story per variant, with controls, checked in Light and Dark.

---

## 8. Component inventory and build status

**Build order:** top to bottom. Design says what to build next. Claude Code updates the **Status** column when a component is done.

Status: ⬜ Not started · 🟨 In progress · ✅ Done (built, Storybook stories and tests added, checked against Figma)

All node IDs are in the component file `vD9CL5tZQo4D26fUN3vKHT`. Where a Figma name has a typo, the **code name** uses the corrected spelling, and the Figma name is kept here so it can still be found.

Inventory from the component file scan of 13 Oct 2026. Levels and scope confirmed by design.

**Figma check** column: ✅ clean · ⚠️ some values are bound to another library or are raw values (see §10 #13). **This never blocks a build:** Figma doesn't need to be fixed first, Claude Code maps each value to a Finspace Loyalty token and tells the designer before building · 🔴 a structural problem in Figma (broken component set, missing main component, placeholder or duplicate name) that must be fixed first (see the §10 item). **Don't build a 🔴 component; tell the designer.** **Before building a ⚠️ component, list its other-library and raw values with the Finspace Loyalty token you plan to use for each, and wait for the designer's approval.**

**Code names marked _(provisional)_** come from placeholder Figma names (`Frame …`). Confirm them with design before building.

### 8.0 Setup: before any component

| # | Task | Output | Status |
|---|---|---|---|
| S1 | pnpm monorepo scaffold (`packages/tokens`, `packages/ui`, `apps/storybook`), TypeScript, Vite, ESLint, Stylelint | repo root | ✅ |
| S2 | Token build: `tokens/design.tokens.json` → CSS variables + TypeScript (handles the quirks in §3.9), with brand and theme scoping (§3.8), and breakpoints (§3.7) | `packages/tokens/dist/` | ✅ |
| S3 | Styles by hand from §4 (shadows, grid). Breakpoints are generated in S2. Motion (§5) is deferred. | `packages/tokens/src/styles.css` | ✅ |
| S4 | Fonts: Inter (400, 500, 600, 700; Latin + Latin Extended) and Material Symbols Rounded, self-hosted, with the fallback stack `Inter, system-ui, sans-serif` (§3.4). CSS reset with page defaults: `Body/Medium`, `--fin-text-secondary`, `--fin-bg-primary`. One app stylesheet, `@finspace-loyalty/ui/styles.css`. | `packages/ui/src/styles/` | ✅ |
| S5 | Storybook with a Light/Dark and brand switcher, plus a Foundations section (colors, typography, spacing, radius, shadows, grid and breakpoints, and a separate Palette (reference only) page). Run with `pnpm storybook`; local only for now. `postcss-custom-media` set up for Storybook and the `ui` build. | `apps/storybook/` | ✅ |
| S6 | Tests and lint setup: Vitest + Testing Library (`pnpm test`), Storybook a11y addon with every story checked in Light and Dark (`pnpm test:a11y`), Stylelint rules for every CSS Module that block raw colors (hex, named, `rgb()`/`hsl()`/… and `color-mix()`), `--fin-palette-*`/`--fin-color-*`, and the typography parts (`--fin-font-*-size`, `-weight`, `-line-height`, `-family`), proven by `packages/ui/test/stylelint.test.ts` | repo root | ✅ |

### 8.1 Atoms, level 0: contain no other components

| # | Figma component | Page | Node | Code name | Variants / properties | Figma check | Status |
|---|---|---|---|---|---|---|---|
| 1 | `16px`, `20px`, `24px`, `36px`, `48px`, `64px` | Icon sizes | `3017:6258`, `3017:6323`, `3017:6352`, `3017:6388`, `3017:6417`, `3017:7083` | `FinIcon` | State: Primary/Secondary/Disabled/Success/Warning/Error/Info · see §6. Sizes are raw values in Figma, mapped to `Size-*` (`--fin-size-*`), approved 14 Oct 2026 | ✅ (64px state names fixed 14 Oct 2026) | ✅ |
| 2 | `Divider` | Divider | `28:367` | `FinDivider` | Type: Divider / Section Divider · plus `orientation` (vertical, code only, 15 Oct 2026) | ✅ | ✅ |
| 3 | `Badge - indicator` | Badge | `30:1500` | `FinBadgeIndicator` | Size: Large/Small · Digits: None/Single/Double (code: from `count`) · Style: Red/Yellow/Green (code: `tone`) | ⚠️ (other-library spacing dropped, padding mapped, approved 15 Oct 2026) | ✅ (contrast exceptions, §10 #3) |
| 4 | `Online Indicator` | Avatar | `14:995` | `FinOnlineIndicator` | Size: XSmall/Small/Medium/Large/XLarge (5, updated in Figma 15 Oct 2026) · on an avatar: FinAvatar `online` (§9.4) | ✅ (white frame fill, §10 #32) | ✅ |
| 5 | `Indicator` | Indicator | `98:3532` | `FinIndicatorDot` (**internal**, §9.11) | Type: Default/Selected (code: `selected`) · clickable option | ✅ (raw radius 8 → `Radius-Full`; selected 22 → 24, §10 #35) | ✅ |
| 6 | `Caption` | List | `77:10172` | `FinCaption` | Size: Small/Medium/Large · Thickness: Heavy/Light · code: `size`, `thickness`, wraps (§9.24) | ⚠️ (zero padding from another library) | ✅ |
| 7 | `Overlay` | Overlays | `111:2495` | `FinOverlay` | Type: **Desktop only** (Mobile is out of scope) · responsive: fills the window · `Alpha-md` | ✅ | ✅ |
| 8 | `Toggle` (renamed from `Switch` in Figma, 15 Oct 2026) | Toggle | `34:2545` | `FinToggle` | Type: Selected/Unselected · Size: Small/Large · State, Focused (runtime) · visually hidden `label` (§9.14) | ⚠️ (focus-ring radius from another library → `Radius-Full`; raw radii → `Radius-Full`; approved 15 Oct 2026) | ✅ |
| 9 | `Base-Radio_box` | Radio button | `37:104` | `FinRadio` | Type: Selected/Unselected · State (runtime) · **public** (§7.2 rule 4 exception) · visually hidden `label` (§9.15) | ⚠️ (radius from another library → `Radius-Full`, approved 15 Oct 2026) | ✅ |
| 10 | `Progress bar` | Progress | `31:2113` | `FinProgressBar` | **Base** of bar-with-text, **public** (§7.2 rule 4 exception, §9.16) · code: any `value`, `max`, fills its container · Filled: 0/25/50/75/100% (Steps=4, Large and Small) and 0/20/40/60/80/100% (Steps=5, Small only) · Size: Large (8 tall) / Small (4 tall) · 16 variants (checked 15 Oct 2026) | ⚠️ (fill radius from the `Tokens` library → `Radius-XS`, approved 15 Oct 2026) | ✅ |
| 11 | ~~`Progress bar-portfolio`~~ | Progress | ~~`695:5418`~~ | — | **Removed from Figma (15 Oct 2026); not built.** | — | — |
| 12 | `slider` (renamed from `dragger` in Figma, 15 Oct 2026) | Progress | `645:3136` | `FinSlider` | Filled: 5–100% · code: `value`/`defaultValue`, `min` 0, `max` 100, `step`, visually hidden `label`, disabled (§9.18) | ⚠️ (radius and padding from another library → `Radius-XS`, `Space-none`, approved 15 Oct 2026) | ✅ |
| 13 | `Spinner` | Progress | `33:2331` | `FinSpinner` | Progress (`Pregress`): 25/50/75%, Success, Error · **public** (§7.2 rule 4 exception) · code: `value` (still ring) or none (spinning loader), `status` success/error (§9.17) | ✅ | ✅ |
| 14 | `Input-OTP-base` | Input field | `49:5843` | `FinOtpCellBase` | **Base** for OTP. State (runtime) · Show number · Error | ⚠️ | ⬜ |
| 15 | `Pagination item` | Table | `3144:14184` | `FinPaginationItem` | State: Default/Selected/Hovered/Dots | ✅ | ⬜ |

### 8.2 Atoms, level 1: contain only icons or L0 atoms

| # | Figma component | Page | Node | Code name | Depends on | Variants / properties | Figma check | Status |
|---|---|---|---|---|---|---|---|---|
| 16 | `40px bg` | Icon sizes | `3017:6944` | `FinIconContainer` (size 40) | `24px` | State (7) → `tone` | ✅ | ✅ |
| 17 | `48px bg` | Icon sizes | `3017:6993` | `FinIconContainer` (size 48) | `24px` | State (7) → `tone` | ✅ | ✅ |
| 18 | `64px bg` (was `68px bg`, 68 → 64 on 14 Oct 2026) | Icon sizes | `3017:7023` | `FinIconContainer` (size 64) | `36px` | State (7) → `tone` | ✅ | ✅ |
| 19 | ~~`Circle Icon`~~ | Icon sizes | ~~`624:4882`~~ | ~~`FinCircleIcon`~~ | — | **Removed from Figma (14 Oct 2026); not built.** | — | — |
| 20 | `Badge-base` (renamed from `Tag-base` in Figma, 15 Oct 2026) | Badge | `30:1454` | `FinBadgeBase` | `16px`, `20px` | Size: Small/Large · Leading/Trailing icon (code: none by default) · Label (one line, "…" when narrow) | ✅ | ✅ |
| 21 | `Label` | Text box | `28:968` | `FinLabel` | Badge - indicator | Size: Medium/Small · Show badge · Label · code: `badgeLabel` required with `badge`, `htmlFor` → `<label>`, one line with "…" (§9.19) | ⚠️ (other-library bindings only inside the badge instance) | ✅ |
| 22 | `Helper text content` | Text box | `28:973` | `FinHelperText` | `20px` | State: Default/Error/Success/Warning/Disabled · Show leading icon · Text · code: `tone`, `showIcon`, wraps, `announce` (§9.20) | ⚠️ (text radius from another library, no effect, dropped) | ✅ |
| 23 | `Base-button` | Buttons | `45:405` | `FinButtonBase` | `20px`, `24px` | Type: Primary/Secondary/Tertiary · Size: Large/Medium/Small/XSmall · State, Focused (runtime) · Leading/Trailing icon · Label | ✅ | ⬜ |
| 24 | `white-button` | Buttons | `349:5042` | `FinWhiteButton` | `20px`, `24px` | Size (4) · State, Focused (runtime) · icons · Label | ✅ | ⬜ |
| 25 | `Destructive-button` | Buttons | `523:2813` | `FinDestructiveButton` | `20px`, `24px` | Type: Primary/Secondary · Size (4) · State, Focused (runtime) | ✅ | ⬜ |
| 26 | `Base-Checkbox` | Checkbox | `42:185` | `FinCheckboxBase` | `16px` | Type: Unselected/Selected/Indeterminate · State, Focused (runtime) | ⚠️ | ⬜ |
| 27 | `Chips-base` | Chips | `95:1811` | `FinChipBase` | `16px`, `20px` | Type: Unselected/Selected/Unselected-border · Size: XSmall/Small/Large · Leading slot · Trailing icon | ⚠️ | ⬜ |
| 28 | `Segmented_button-base` | Segmented button | `117:4667` | `FinSegmentBase` | `20px` | Type: Unselected/Selected · State (runtime) · Leading slot | ⚠️ | ⬜ |
| 29 | `Avatar` | Avatar | `932:1387` | `FinAvatar` | `16`–`64px` | Type: Image/Icon/Text · Size: XSmall…XXXLarge (7; XXXLarge 96 in code, §10 #30) · fallback photo → initials → icon, `online` indicator (code only, §9.4) | ⚠️ (sizes mapped to `Size-*`, approved 15 Oct 2026) | ✅ |
| 30 | `Contry selecter` | Input field | `49:5731` | `FinCountrySelector` | Flag sizes, Flag icons, `24px` | Show icon | ✅ | ⬜ |
| 31 | `Row count dropdown` | Table | `3151:14547` | `FinRowCountSelect` | `24px` | Default/Hovered (runtime) · `Property 1` name (§10 #21) | ✅ | ⬜ |
| 32 | `24px` (side nav) | Side nav | `3138:10976` | `FinSideNavIcon` | `24px` icon | Type: Unselected/Selected | 🔴 name clashes with icon size (§10 #20) | ⬜ |
| 33 | `sub selection` | Side nav | `3140:11076` | `FinSideNavSubItem` | — | Default/Hovered/Pressed/Selected (runtime; `Property 1`) | ✅ | ⬜ |

### 8.3 Molecules

| # | Figma component | Page | Node | Code name | Built on / depends on | Figma check | Status |
|---|---|---|---|---|---|---|---|
| 34 | `all-button` | Buttons | `47:1580` | `FinButton` | **Base-button** · Type (3) · Size (4) · Icon: None/Leading/Trailing/Only Icon | ⚠️ | ⬜ |
| 35 | `Badge-primary` | Badge | `30:1465` | `FinBadge` | **Badge-base** · State: Primary/Secondary/Success/Error/Info/Warning/Disabled/Neutral (`brand` removed 15 Oct 2026) → `tone` · optional icons (code) | ✅ (Error outer stroke fixed 15 Oct 2026) | ✅ |
| 36 | `Text Box` | Text box | `28:1001` | `FinTextBox` | Label · Type: H1–H6 · Alignment: Left/Center/Right · code: `headingLevel` (structure only), label badge (exposed in Figma) (§9.21) | ✅ | ✅ |
| 37 | `Checkbox` | Checkbox | `42:220` | `FinCheckbox` | **Base-Checkbox**, Text Box | ⚠️ | ⬜ |
| 38 | `Chips` | Chips | `95:1848` | `FinChip` | **Chips-base** | ✅ | ⬜ |
| 39 | `Chips-group` | Chips | `922:6646` | `FinChipGroup` | **Chips-base** · Chip count 1–4 | ⚠️ | ⬜ |
| 40 | `Segmented button` | Segmented button | `117:4688` | `FinSegmentedButton` | **Segmented_button-base** | ⚠️ | ⬜ |
| 41 | `Indicator set` | Indicator | `98:3541` | `FinPageIndicator` | **Indicator** · Active, Number (code: `active`, `count`, no maximum) · clickable with `onChange` (§9.12) | ✅ | ✅ |
| 42 | `Avatar Group` | Avatar | `14:1155` | `FinAvatarGroup` | **Avatar** · Size · Count 2/3/5/7 (code: 2–6 shown, then "+N", §9.5) | ⚠️ (overlaps mapped to spacing, approved 15 Oct 2026) | ✅ |
| 43 | `Profile image` | Avatar | `432:1610` | `FinProfileImage` | **Avatar**, icons · Type: Icon/Image (code: from `src`) · badge button: camera / edit (§9.6) | ⚠️ (frame 100 = `Size-96` + `Space-XS`, approved 15 Oct 2026) | ✅ |
| 44 | `bar-with-text` (renamed in Figma 15 Oct 2026: `Progress-progress bar` → `Progress-full` → `bar-with-text`) | Progress | `31:2122` | `FinBarWithText` | **Progress bar** (Large, Steps=4), **Text Box** (Center, Display Small-H3) · Progress: 25/50/75/100% · Description: True/False · 375 wide (a mobile-era width), gap `Space-XL` · built from FinProgressBar and FinTextBox; spans the middle 6 grid columns (§9.22) | ⚠️ | ✅ |
| 45 | `spinner-with-text` (renamed from `Progress-Spinner` in Figma, 15 Oct 2026) | Progress | `33:2348` | `FinSpinnerWithText` | **Spinner**, Text Box · built from FinSpinner and FinTextBox; loader added; spans the middle 6 grid columns (§9.23) | ⚠️ (zero padding from another library) | ✅ |
| 46 | `Plain Tooltip` | Tooltips | `476:752` | `FinTooltip` | Text Box · Type: Single line/Rich · Look: Black/Basic | ⚠️ (§10 #16) | ⬜ |
| 47 | `Pagination group` | Table | `3151:14607` | `FinPagination` | **Pagination item**, all-button | ⚠️ | ⬜ |
| 48 | `Main Selection` | Side nav | `3140:10997` | `FinSideNavItem` | Side nav `24px`, sub selection, `24px` icon · State · Expanded · Type: Full/Minimized · Expanded slot | 🔴 depends on #32 | ⬜ |
| 49 | `Header notification` | Header | `3178:24467` | `FinHeaderNotificationButton` | 48px bg, Badge - indicator, `24px` · State (runtime: Default/Hovered/Disabled) · Notification: Dot/Number | 🔴 broken set: duplicate variant `State=Hovered, Notification=Dot` (§10 #17) | ⬜ |
| 50 | `Table header cell` | Table | `3151:14941` | `FinTableHeaderCell` | Base-Checkbox, Label · White/Grey (`Property 1`) · Slot · Show checkbox/title/trailing icon | ⚠️ | ⬜ |
| 51 | `Table - Cell` | Table | `3151:14990` | `FinTableCell` | Base-Checkbox, Badge-primary, all-button (checked 15 Oct 2026: uses Badge-primary, not Badge-base directly) · Default/Badge/Link (`Property 1`) · Leading accessories and content slots · Show action button | ⚠️ | ⬜ |

### 8.4 Organisms

| # | Figma component | Page | Node | Code name | Built on / depends on | Figma check | Status |
|---|---|---|---|---|---|---|---|
| 52 | `Input field-base` | Input field | `49:5734` | `FinInputBase` | **Base** for single-line fields. Type: Default/Payment/Mobile number/Select · Destructive (= error) · Label, Placeholder, Prefix, Suffix, Caret, Focus ring · Leading, Trailing, Placeholder and Helper text slots · Helper text, Country selector, Flags, Divider, icons · **Follow-up when built:** replace the plain stand-in inputs in the Label "Usage" and Helper text "With a field" stories with this component | ⚠️ | ⬜ |
| 52a | `Input field-textArea-base` | Input field | `3094:26567` | `FinTextAreaBase` | **Base** for multi-line fields. Type: Default/Destructive (`Distructive`) · Label, Helper text, Placeholder, Caret, Focus ring · Helper text and Placeholder slots | ⚠️ (§10 #16) | ⬜ |
| 52b | `Input field-base` (text area) | Input field | `3097:27497` | _(provisional)_ `FinTextArea` | **Input field-textArea-base**, Helper text | 🔴 broken set and duplicate name (§10 #17) | ⬜ |
| 53 | `Input field-standard` | Input field | `52:2629` | `FinTextField` | **Input field-base**, Payment Icons, Country selector · Type: Default/Mobile number/Payment · Error | ⚠️ (after #52) | ⬜ |
| 54 | `Input field-password` | Input field | `60:7165` | `FinPasswordField` | **Input field-base** · Show password · Error | ⚠️ (after #52) | ⬜ |
| 55 | `Input field-select` | Input field | `537:2736` | `FinSelectField` | **Input field-base** | ⚠️ (after #52) | ⬜ |
| 56 | `Input field-Multi select` | Input field | `922:6170` | `FinMultiSelectField` | **Input field-base**, Chips-base | ⚠️ (after #52) | ⬜ |
| 57 | `Search` | Search | `440:5164` | `FinSearchField` | **Input field-base** · State · Sticky | ⚠️ (after #52) | ⬜ |
| 58 | `File uploads` | Input field | `775:4280` | `FinFileUpload` | 40px bg, 48px bg, Text Box, all-button · Size: Large/Small | ⚠️ | ⬜ |
| 59 | `List-base` | List | `77:10185` | `FinListItem` | **Base.** 40px bg, Label, Text Box, Divider · slots | 🔴 missing `20px` main (§10 #19) | ⬜ |
| 60 | `List-fill-base` | List | `3169:6327` | `FinListItemFilled` | **Base.** 40px bg, Label, Text Box · slots | 🔴 missing `20px` main (§10 #19) | ⬜ |
| 61 | `Accordion-frame-base` | Accordion | `555:1767` | `FinAccordionFramed` | **Base.** Text Box, Badge-primary, Label · slots | ✅ | ⬜ |
| 62 | `Accordion-bare-base` | Accordion | `555:1968` | `FinAccordion` | **Base.** Text Box, Badge-primary, Label, Divider · slots | 🔴 missing `20px` main (§10 #19) | ⬜ |
| 63 | `Notification` | Notification banners | `77:10612` | `FinNotificationBanner` | all-button, icons · Type: Info/Success/Error/Warning/Neutral | ⚠️ (§10 #16) | ⬜ |
| 64 | `Snackbar` | Snackbar | `268:992` | `FinSnackbar` | Text Box, all-button · State: Neutral/Success/Warning/Error · single/two lines | ⚠️ | ⬜ |
| 65 | `Empty state` | Empty state | `71:4588` | `FinEmptyState` | 48px bg, 68px bg, Text Box, all-button · Size: Small/Medium/Large · Icon slot | ✅ | ⬜ |
| 66 | `Button dock` | Button dock | `75:5858` | `FinButtonDock` | Text Box, all-button · Sticky · Accessory slot | ✅ | ⬜ |
| 67 | `Side sheet` | Side sheet | `3120:30707` | `FinSideSheet` | Text Box, Badge-primary, all-button, Button dock · Body slot · on FinOverlay; **the page doesn't scroll while it's open** (decided 15 Oct 2026, §9.13) | 🔴 remote `Views / Dividers` (§10 #25) | ⬜ |
| 68 | `Dialog box` | Dialog | `3234:11710` | `FinDialog` | Text Box, all-button, `24px` · Body slot · Leading button, Primary/Secondary buttons, Trailing buttons, Trailing icon · on FinOverlay; **the page doesn't scroll while it's open** (decided 15 Oct 2026, §9.13) | ✅ | ⬜ |
| 69 | `Main header` | Header | `3178:24570` | `FinHeader` | all-button, Text Box, Header notification · Notification, Back button, Description | 🔴 depends on #49 | ⬜ |
| 70 | `Side Menu` | Side nav | `3142:11871` | `FinSideNav` | Main Selection, List-base, Avatar, Text Box, all-button · Menu (8 sections) | 🔴 unstyled text, remote `Frame 3`/`image` (§10 #22, #25) | ⬜ |
| 71 | `Table row` | Table | `3151:15248` | `FinTableRow` | Table - Cell, Base-Checkbox · Default/Hovered/Selected/Selected-Hovered (hover is runtime; Selected is a prop) | ⚠️ | ⬜ |
| 72 | `Title row` | Table | `3151:15203` | `FinTableHeaderRow` | Table header cell, Base-Checkbox, Label | ⚠️ | ⬜ |
| 73 | `Table footer` | Table | `3151:14830` | `FinTableFooter` | Row count dropdown, Pagination group | ⚠️ | ⬜ |
| 74 | — (code only; in Figma the table is assembled on each screen) | Table | — | `FinTable` | **Code-only organism** composed from Title row, Table row, Table footer: columns and rows as data, row selection (select all / indeterminate), footer pagination. No Figma node, so it only uses the parts above and adds no new visuals. See §9 when built. | ✅ (after #50–73) | ⬜ |

### 8.5 Assets (exported, not built as components)

| Figma component | Page | Node | Export to |
|---|---|---|---|
| `Flag icons` (circle + rectangle) | Icon types | `49:6026` | `packages/ui/src/assets/flags/` |
| `Flag sizes` | Icon types | `49:13408` | (size rules for flags: XSmall…XLarge, Default/Disabled) |
| `Payment Icons` | Icon types | `58:14556` | `packages/ui/src/assets/payment/` |

---

## 9. Component specs

Each component gets a full spec here **when it's built**. Exact measurements (padding, gaps, sizes) come from Figma at build time. Read the component node with the Figma tools rather than guessing.

**Storybook grouping:** icon components are grouped in the sidebar under **Components/Icons**: Icon (`FinIcon`) and Icon container (`FinIconContainer`). Avatar components are grouped under **Components/Avatar**: Avatar (`FinAvatar`), Avatar group (`FinAvatarGroup`), Profile image (`FinProfileImage`) and Online indicator (`FinOnlineIndicator`) (15 Oct 2026). Badge components are grouped under **Components/Badge**: Badge indicator (`FinBadgeIndicator`) and Badge (`FinBadge`). Indicator components are under **Components/Indicator**: Page indicator (`FinPageIndicator`). Overlay is **Components/Overlay**; Toggle is **Components/Toggle**; Radio button is **Components/Radio button**; Progress bar, Spinner, Slider, Bar with text and Spinner with text are under **Components/Progress** (the Figma page they're on); Label, Helper text and Text box are under **Components/Text box**; Caption is under **Components/List**. Internal bases (§7.2) are under **Internal**, sorted last: Badge base (`FinBadgeBase`), Indicator (`FinIndicatorDot`). Only the story titles are grouped; each component keeps its own folder.

### 9.1 FinIcon (Icon sizes)

**Figma:** page **Icon sizes**, component sets `16px` `3017:6258`, `20px` `3017:6323`, `24px` `3017:6352`, `36px` `3017:6388`, `48px` `3017:6417`, `64px` `3017:7083`. Each has `State` = Primary / Secondary / Disabled / Success / Warning / Error / Info. The icon in Figma is a flattened vector of the old Material Icons `perm_identity`; **for icons the code is the source of truth** (§6.1), so only size and color were compared.

**Figma → code names:** component sets `16px`…`64px` → `size` (16…64); `State` → `color` (accepts every `fg-*` token, not only Figma's 7; pre-rule decision 14 Oct 2026); icon instance → `name`.

**Variants:**

| Figma | Prop |
|---|---|
| Component set `16px`…`64px` | `size: 16 \| 20 \| 24 \| 36 \| 48 \| 64` (default `24`) |
| `State` (Primary…Info) | Examples of `color`, which accepts **every** `fg-*` token: Primary → `'primary'`, Secondary → `'secondary'`, Disabled → `'disabled'`, Success → `'success'`, Warning → `'warning'`, Error → `'error'`, Info → `'info'` |
| Instance swap (the glyph) | `name: FinIconName` (the `finIcons` registry) |
| — | `filled` (FILL 1), `label` (accessible name) |

**Tokens used:**

| Part | Token |
|---|---|
| Size (width, height, font size) | `--fin-size-16`, `-20`, `-24`, `-36`, `-48`, `-64` via `data-size`. **Raw values in Figma mapped to the `Size-*` primitives** (approved 14 Oct 2026), not spacing. |
| Color | `color` → `--fin-fg-<name>` (set as the CSS variable `--icon-color`); none → `currentcolor` |
| Glyph | Material Symbols Rounded subset (§6.2, §10 #14): `FILL` 0, or 1 with `data-filled`; wght 300, opsz 24, GRAD 0 fixed in the font |

Raw values in the CSS: `line-height: 1` (unitless, so the glyph box equals the icon size) and the `FILL` axis values `0` / `1`. No px values.

**API:**

```tsx
import { FinIcon } from '@finspace-loyalty/ui';

<FinIcon name="home" />                                        // decorative, inherits color, 24px
<FinIcon name="warning" size={20} color="warning" label="Warning" />
<FinIcon name="home" color="active" filled={isActive} />
```

- `name` is typed from `finIcons` (`src/icons/finIcons.ts`). **Adding an icon is one line** there; the build regenerates the font (`pnpm icons`, also run by `build`, `storybook`, `test`). In development, a name that isn't in the registry logs a warning once and renders an empty box at the icon's size (production: no warning).
- `color` is typed from the generated tokens (`FinFgColor`), so a new `fg-*` token is a valid value without code changes.
- Presentational: no `'use client'`. `className` and other `<span>` attributes are passed to the root.

**Accessibility:** a `<span>` whose text is the ligature name.
- **Decorative by default:** `aria-hidden="true"`, so screen readers skip it.
- **With `label`:** `role="img"` and `aria-label`, announced as an image with that name.
- Always `translate="no"` (browser translation would break the ligature) and `user-select: none` (copying nearby text doesn't paste "home").
- **Icon-only buttons** put the accessible name on the button (its `aria-label` or visually hidden text) and keep the icon decorative.
- No interaction, so no keyboard behaviour or focus.

**Built (14 Oct 2026).** Storybook: Playground (controls), All icons (outlined and filled), Sizes and states (Figma). Checked against Figma: all 42 size × state combinations are exactly 16/20/24/36/48/64 px square, and every Light color equals the Figma `fg-*` value; Dark uses the current Dark tokens. a11y: no violations in Light or Dark. Font: 28 icons (19 with a filled glyph), 6.2 KB, identical to the full font outlined and filled.

### 9.2 FinIconContainer (Icon sizes)

**Figma:** page **Icon sizes**, component sets `40px bg` `3017:6944`, `48px bg` `3017:6993`, `64px bg` `3017:7023` (was `68px bg`, 68 × 68; changed to 64 on 14 Oct 2026). Each has `State` = Primary / Secondary / Disabled / Success / Warning / Error / Info. Icon shapes in Figma are ignored (§6.1).

**Figma → code names:** component sets `40px bg` / `48px bg` / `64px bg` → `size` (40 / 48 / 64); `State` → `tone`; icon instance → `name`.

**Variants:**

| Figma | Prop |
|---|---|
| Component set `40px bg` / `48px bg` / `64px bg` | `size: 40 \| 48 \| 64` (default `40`) |
| `State` (only changes colors) | `tone: 'primary' \| 'secondary' \| 'disabled' \| 'success' \| 'warning' \| 'error' \| 'info'` (default `'primary'`), rendered as `data-tone` (§7.3) |
| Icon inside (instance) | `name: FinIconName`; `filled` (default `false`) and `label` are passed straight to FinIcon |

**Structure:** a `<span>` circle containing a `FinIcon` (no copied markup or styles). The circle has a fixed size and centers the icon. Figma's 8 px padding is unbound and has no effect on fixed, centered circles, so it isn't used.

**Tokens used:**

| Part | 40 | 48 | 64 |
|---|---|---|---|
| Circle width/height | `--fin-size-40` | `--fin-size-48` | `--fin-size-64` |
| Icon (FinIcon `size`) | 24 | 24 | 36 |
| Radius | `--fin-radius-full` | `--fin-radius-full` | `--fin-radius-full` |

Widths and heights are unbound in Figma by convention and map to `--fin-size-*` (§3.8).

| `tone` | Background (`data-tone`) | Icon (FinIcon `color`) |
|---|---|---|
| `primary` | `--fin-bg-icons` | `fg-primary` |
| `secondary` | `--fin-bg-secondary` | `fg-secondary` |
| `disabled` | `--fin-bg-disabled` | `fg-disabled-on_bg` (all sizes, fixed in Figma 14 Oct 2026) |
| `success` | `--fin-bg-success-secondary` | `fg-success` |
| `warning` | `--fin-bg-warning-secondary` | `fg-warning` |
| `error` | `--fin-bg-error-secondary` | `fg-error` |
| `info` | `--fin-bg-info-secondary` | `fg-info` |

No raw values in the CSS, and nothing from another library.

**API:**

```tsx
import { FinIconContainer } from '@finspace-loyalty/ui';

<FinIconContainer name="check_circle" tone="success" />                  // 40px circle, 24px icon, decorative
<FinIconContainer name="person" size={64} label="Profile" />             // 64px circle, 36px icon, announced
```

Presentational: no `'use client'`. `className` and other `<span>` attributes go to the circle. `filled` passes straight through to FinIcon, with no styling of its own (added 14 Oct 2026; Figma doesn't show a filled container).

**Accessibility:** the circle has no role. The icon is decorative by default (hidden from screen readers); with `label` it's an image with that name (FinIcon). Not interactive, so no focus or keyboard behaviour.
- Contrast (icons need 3:1): every tone passes in Dark. In Light, `warning` is 2.96:1 (`fg-warning` on `bg-warning-secondary`, already §10 #3). `disabled` is exempt.
- In Dark, `primary` (`bg-icons` `#464646`) and `disabled` (`bg-disabled` `#363636`) now have different backgrounds (§10 #29, fixed 15 Oct 2026). White icon on `#464646` is 9.44:1.

**Built (14 Oct 2026).** Storybook: Playground (controls), Sizes and tones (Figma). Checked against Figma: all 21 size × tone combinations have the exact circle size (40/48/64), icon size (24/24/36), centered icon, full radius, and in Light the exact Figma background and icon colors; Dark uses the current Dark tokens. a11y: no violations in Light or Dark.

### 9.3 FinDivider (Divider)

**Figma:** page **Divider**, component set `Divider` `28:367`: `Type=Divider` (`28:368`, 375 × 1) and `Type=Section Divider` (`28:370`, 375 × 8). Both fill with `border-default`.

**Figma → code names:** `Type` → `type` (`divider`, `section-divider`). Code-only: `orientation` (vertical, a visual option added at design's request 15 Oct 2026, before this rule), `decorative` (accessibility).

**Variants:**

| Figma | Prop |
|---|---|
| `Type` = Divider / Section Divider | `type: 'divider' \| 'section-divider'` (default `'divider'`), rendered as `data-type` |
| — (not in Figma) | `orientation: 'horizontal' \| 'vertical'` (default `'horizontal'`), rendered as `data-orientation`. Added at design's request (15 Oct 2026). |
| — | `decorative` (default `false`) |

**Tokens used:**

| Part | Horizontal | Vertical |
|---|---|---|
| `divider` line | `border-block-start: 1px solid var(--fin-border-default)` | `border-inline-start: 1px solid var(--fin-border-default)` |
| `section-divider` band | `block-size: var(--fin-size-8)`, `background-color: var(--fin-border-default)` | `inline-size: var(--fin-size-8)`, same color |
| Length | full width of the container | stretches to the height of its flex row (`align-self: stretch`) |

Decisions (15 Oct 2026): the 1px line is a border width, not a size (there's no `Size-1`); the Section Divider is full width in code (375 in Figma is a mobile width); no margins, the container owns the spacing (§2 rule 5). The only raw value is the `1px` border width.

**API:**

```tsx
import { FinDivider } from '@finspace-loyalty/ui';

<FinDivider />                                   // 1px line, announced as a separator
<FinDivider type="section-divider" />            // 8px band between sections
<FinDivider orientation="vertical" decorative /> // 1px vertical line in a flex row, hidden from screen readers
```

Presentational: no `'use client'`. `className` and other `<hr>` attributes go to the root.

**Accessibility:** a native `<hr>` (role `separator`), not focusable. Vertical adds `aria-orientation="vertical"`. With `decorative`, it gets `aria-hidden="true"` and no orientation. Contrast: a divider is decorative and has no 3:1 requirement.

**Built (15 Oct 2026).** Storybook: Playground (controls), Types (Figma), Vertical. Checked against Figma: 1px and 8px high at full width, Light color `#d4d4d4` equals Figma `border-default`; Dark uses the Dark token (`#464646`). a11y: no violations in Light or Dark.

### 9.4 FinAvatar (Avatar)

**Figma:** page **Avatar**, component set `Avatar` `932:1387`: `Type` = Image / Icon / Text × `Size` = Xsmall / Small / Medium / Large / XLarge / XXLarge / XXXLarge (21 variants). The icon in Figma is the old `perm_identity`; code uses `person` (§6.4).

**Figma → code names:** `Size` → `size` (`Xsmall` → `xsmall`, typo); image fill → `src`; text `SD` → `initials`. Code-only: `label` (accessibility), `online` / `onlineLabel` (a visual option not in Figma, approved 15 Oct 2026 before this rule).

**Variants:**

| Figma | Prop |
|---|---|
| `Type` = Image / Icon / Text | `type: 'image' \| 'icon' \| 'text'` (default `'image'`). What's shown is rendered as `data-type` |
| `Size` (`Xsmall` in Figma, §10 #21) | `size: 'xsmall' \| 'small' \| 'medium' \| 'large' \| 'xlarge' \| 'xxlarge' \| 'xxxlarge'` (default `'medium'`), rendered as `data-size` |
| Image fill | `src` |
| Text (`SD`) | `initials`, passed in as they should appear (decided 15 Oct 2026; not worked out from the name) |
| — | `label`: the person's name |
| — (not in Figma) | `online`, `onlineLabel` (default "Online"): see **Online** below (added 15 Oct 2026) |

**Fallback** (not in Figma, decided 15 Oct 2026): `image` without a photo (no `src`, or it fails to load) shows the initials; without initials it shows the icon. `text` without initials shows the icon. `icon` ignores `src` and `initials`. A new `src` is tried again after a failure.

**Tokens used:**

| Size | Circle | Icon (FinIcon `size`) | Initials text style |
|---|---|---|---|
| `xsmall` | `--fin-size-24` | 16 | `--fin-font-label-small` |
| `small` | `--fin-size-32` | 20 | `--fin-font-label-medium` |
| `medium` | `--fin-size-40` | 24 | `--fin-font-label-large` |
| `large` | `--fin-size-48` | 24 | `--fin-font-title-large` |
| `xlarge` | `--fin-size-56` | 36 | `--fin-font-headline-medium-h5` |
| `xxlarge` | `--fin-size-64` | 48 | `--fin-font-headline-large-h4` |
| `xxxlarge` | `--fin-size-96` (was 100 in Figma; now 96 there too, §10 #30) | 64 | `--fin-font-display-medium-h2` |

| Part | Token |
|---|---|
| Circle | `border: 1px solid var(--fin-border-subtle)`, `--fin-radius-full`, `position: relative`. Not clipped since 15 Oct 2026 (so the online indicator isn't cut off) |
| Background (icon, text) | `--fin-bg-icons` (image: none) |
| Icon | FinIcon `color="secondary"` (`fg-secondary`) |
| Initials | `--fin-text-secondary`, centered (Figma's XSmall text is slightly off-center; centered in code, decided 15 Oct 2026) |
| Photo | fills the circle inside the border, `object-fit: cover`, rounded itself with `--fin-radius-full` |

Decisions (15 Oct 2026): XXXLarge is 96 so it maps to `Size-96`; the `"case"` font feature on the Figma initials is dropped (not part of the text style tokens, no visible effect on letters). The only raw value is the `1px` border width. Nothing from another library was found in the bindings.

**API:**

```tsx
import { FinAvatar } from '@finspace-loyalty/ui';

<FinAvatar src={user.photoUrl} initials="SD" label="Sathila De Silva" />  // photo, or initials if it's missing or fails
<FinAvatar type="text" size="large" initials="SD" />                      // initials, decorative
<FinAvatar type="icon" size="xsmall" />                                   // default icon
<FinAvatar src={user.photoUrl} label="Sathila De Silva" online />          // announced "Sathila De Silva, Online"
```

`'use client'` (it remembers a photo that failed to load). `className` and other `<span>` attributes go to the circle.

**Accessibility:**
- Photo: `<img alt={label}>` (with `online`: "label, Online"); without `label`, `alt=""`.
- Initials and icon: with `label`, the circle is `role="img"` with `aria-label`; without it, the circle is `aria-hidden` (decorative, next to a visible name), unless `online`: then only the indicator is announced (see **Online**). The initials themselves are always hidden, so the name is read instead of "S D".
- Not interactive. Contrast on `bg-icons`: initials 4.97:1 Light / 4.71:1 Dark, icon 5.21:1 / 4.71:1.

**Online** (added 15 Oct 2026; not in Figma, §10 #33): `online` places a `FinOnlineIndicator` (the component, not a redrawn dot) and `onlineLabel` (default "Online") names it.

| Avatar | 24 | 32 | 40 | 48 | 56 | 64 | 96 |
|---|---|---|---|---|---|---|---|
| Indicator `size` | xsmall 6 | small 8 | medium 12 | medium 12 | large 16 | large 16 | xlarge 24 |
| Inset from the bottom-right | 0 | 0 | 0 | 0 | 0 | `--fin-space-xxs` | `--fin-space-xxs` |

- **Position:** `position: absolute` at the bottom-right corner of the avatar's padding box, on top of the content. Because the avatar has a 1px border, the indicator's ring is flush with the avatar's outer corner. 64 and 96 move in by `Space-XXS` (2px) so the dot stays on the circle, like Atlassian's larger avatar sizes (`@atlaskit/avatar` presence offsets, checked 15 Oct 2026). Measured: every dot center is within 2.3px of the circle edge (2.3px inside at 64, 1.3px at 96). Inset kept after review (15 Oct 2026).
- **Clipping:** the avatar no longer clips its content (so the dot isn't cut off); the photo is rounded itself (`--fin-radius-full`, as in Figma). No visual change to the 21 variants (re-measured).
- **Screen readers** (decided 15 Oct 2026): with `label`, the status joins the name ("Sathila De Silva, Online", also the photo's alt) and the dot is decorative, like Atlassian. Without `label`, the avatar stays hidden but the dot is announced ("Online"), so the status isn't lost.
- Avatar Group and Profile image don't show the indicator (decided 15 Oct 2026).

**Built (15 Oct 2026).** Storybook: Playground (controls, incl. `online`), Types and sizes (Figma), Fallback, Online. Checked against Figma: all 21 variants have the exact circle size (96 for XXXLarge), 1px `border-subtle` border, full radius, `bg-icons` background, centered icon at the Figma size in `fg-secondary`, and initials in the Figma text style and `text-secondary`; Light colors equal Figma, Dark uses the Dark tokens. a11y: no violations in Light or Dark.

### 9.5 FinAvatarGroup (Avatar Group)

**Figma:** page **Avatar**, component set `Avatar Group` `14:1155`: `Size` = XSmall / Medium / XLarge × `Count` = 2 / 3 / 5 / 7 (12 variants). Every circle is an `Avatar` instance (Image, and Text for the "+4").

**Figma → code names:** `Count` (2/3/5/7) → no prop: the number of avatars comes from `people` (2–6 shown, then "+N"; pre-rule decision 15 Oct 2026). `Size` → `size`.

**Variants:**

| Figma | Prop |
|---|---|
| `Size` = XSmall / Medium / XLarge | `size: 'xsmall' \| 'medium' \| 'xlarge'` (default `'medium'`), passed to every FinAvatar and rendered as `data-size` |
| `Count` = 2 / 3 / 5 / 7 | Not a prop: the count comes from `people`. **Rule (decided 15 Oct 2026):** 2–6 people are all shown; from 7, the first 6 are shown plus a "+N" circle for the rest (Figma's Count=7: 6 photos and "+4"). Figma's Count=3 (2 photos and "+4") doesn't follow this rule and isn't used. The limit is `FIN_AVATAR_GROUP_MAX` (6). |
| Each Avatar instance | `people: { src?, initials?, label }[]`, in display order |
| — | `label`: name of the group |

**Structure:** a mapped component (§7.2). Each person is a `FinAvatar` (photo, or initials if there's no photo); the "+N" circle is `FinAvatar type="text"`. No markup or styles are copied from FinAvatar; the group only sets the overlap through a `className`.

**Tokens used:**

| Size | Circle (FinAvatar) | Overlap (Figma raw, approved 15 Oct 2026) | "+N" text style (FinAvatar) |
|---|---|---|---|
| `xsmall` | 24 | `--fin-space-xs` (−4) | Label/Small |
| `medium` | 40 | `--fin-space-m` (−8) | Label/Large |
| `xlarge` | 56 | `--fin-space-l` (−12) | Headline/Medium-H5 |

The overlap is a negative `margin-inline-start` on every avatar after the first, so each avatar sits on top of the one before it (as in Figma). No raw values in the CSS.

**API:**

```tsx
import { FinAvatarGroup } from '@finspace-loyalty/ui';

<FinAvatarGroup
  size="medium"
  label="Team members"
  people={members.map((m) => ({ src: m.photoUrl, initials: m.initials, label: m.name }))}
/>  // 10 members → 6 avatars and "+4"
```

Presentational: no `'use client'` of its own (FinAvatar is a client component). `className` and other `<div>` attributes go to the group.

**Accessibility:** the root is `role="group"` with `aria-label={label}`. Each avatar is announced by the person's name (FinAvatar `label`); the "+N" circle is announced as "N more". Not interactive: "+N" isn't a button (decided 15 Oct 2026).

**Built (15 Oct 2026).** Storybook: Playground (size and number of people), Sizes and counts (Figma) with 2–6 and 10 people, Without photos. Photos are the five Unsplash photos used in Figma, for the stories only. Checked against Figma: circle sizes 24/40/56, overlap 4/8/12, group widths equal the Figma frames (XSmall 44/104/144, Medium 72/168/232, XLarge 100/232/320 for 2/5/7 circles), each avatar on top of the previous one, "+4" in the Figma text style and colors; Dark uses the Dark tokens. Figma crops some photos higher than center; code centers them (`object-fit: cover`). a11y: no violations in Light or Dark.

### 9.6 FinProfileImage (Profile image)

**Figma:** page **Avatar**, component set `Profile image` `432:1610`: `Type=Image` (`432:1609`) and `Type=Icon` (`432:1608`), 100 × 100. Each is an `Avatar` XXXLarge (96) and an **add image** badge (`432:1578`): a 32 circle at (68, 68) with a 16px camera.

**Figma → code names:** `Type` (Image / Icon) → no prop: it follows `src` (pre-rule decision 15 Oct 2026). Code-only: `label`, `onClick`, `buttonLabel`.

**Variants:**

| Figma | Prop |
|---|---|
| `Type` = Image / Icon | Not a prop: `src` given → photo; no `src` → the default icon. Never initials (follows Figma, decided 15 Oct 2026). |
| Badge icon (camera in both variants) | **Rule (design, 15 Oct 2026):** no photo → `photo_camera`; photo → `edit`. The badge follows `src`, so a photo that fails to load shows the icon with `edit` (accepted). |
| — | `label` (the person's name, photo alt text), `onClick`, `buttonLabel` (default "Add profile photo" / "Change profile photo") |

**Structure:** a `FinAvatar` (`size="xxxlarge"`, `type` image or icon) and a native `<button type="button">` holding a `FinIcon`. **Only the badge is clickable** (decided 15 Oct 2026); the component calls `onClick` and the app opens its own upload or edit flow.

**Tokens used:**

| Part | Token |
|---|---|
| Frame (100 × 100) | `calc(var(--fin-size-96) + var(--fin-space-xs))` (no `Size-100`) |
| Badge | `--fin-size-32`, bottom right (0, 0) = Figma (68, 68), `--fin-radius-full`, `--fin-fg-action` fill (as in Figma) |
| Badge stroke | 1px `--fin-border-subtle` outside the circle, as a spread `box-shadow` so `outline` stays free for focus |
| Badge icon | FinIcon 16, `color="inverse"` (`fg-inverse`) |
| Focus | `outline: 2px solid var(--fin-border-focused)`, `outline-offset: 2px` (decided 15 Oct 2026, §10 #6) |
| Hover, pressed | **None yet**: only `cursor: pointer`. Added when design defines them (decided 15 Oct 2026, §10 #31) |

Raw values: the `1px` stroke, and the `2px` focus width and offset.

**API:**

```tsx
import { FinProfileImage } from '@finspace-loyalty/ui';

<FinProfileImage src={user.photoUrl} label={user.name} onClick={openPhotoDialog} />  // photo, "Change profile photo" (edit)
<FinProfileImage onClick={openPhotoDialog} />                                         // icon, "Add profile photo" (camera)
```

`'use client'` (interactive). `className` and other `<div>` attributes go to the root.

**Accessibility:** the badge is a native button: focusable, Enter and Space activate it, and it has a visible focus ring. Its name says what it does ("Add profile photo" / "Change profile photo"); the glyph is decorative. The photo's alt text is `label`; the default icon is decorative. Pointer target 32 × 32. Contrast: badge icon 4.71:1 Light / 5.24:1 Dark; focus ring `border-focused` 3.35:1 on white.

**Built (15 Oct 2026).** Storybook (under Components/Avatar): Playground, Types (Figma). Checked against Figma: frame 100 × 100, avatar 96 at (0, 0), badge 32 × 32 at (68, 68) with the 1px `border-subtle` stroke, `fg-action` fill, centered 16px icon in `fg-inverse`; Light colors equal Figma, Dark uses the Dark tokens. a11y: no violations in Light or Dark.

### 9.7 FinOnlineIndicator (Online Indicator)

**Figma:** page **Avatar**, component set `Online Indicator` `14:995` (updated by design 15 Oct 2026: 5 sizes, was 7 with two 14px sizes). Each is a dot (`fg-success`) with a 1px **outside** stroke (`fg-inverse`). Not placed on any Avatar in Figma (0 instances); placement is a code decision (§9.4 Online, §10 #33).

**Figma → code names:** `Size` → `size`. Code-only: `label`, `decorative` (accessibility).

**Variants:**

| Figma `Size` | Prop `size` | Dot | Token |
|---|---|---|---|
| XSmall | `'xsmall'` | 6 | `--fin-size-6` |
| Small | `'small'` | 8 | `--fin-size-8` |
| Medium | `'medium'` (default) | 12 | `--fin-size-12` |
| Large | `'large'` | 16 | `--fin-size-16` |
| XLarge | `'xlarge'` | 24 | `--fin-size-24` |

Also `label` (default "Online") and `decorative`.

**Tokens used:** fill `--fin-fg-success`; ring `box-shadow: 0 0 0 1px var(--fin-fg-inverse)` (outside the dot, as the Figma stroke); `--fin-radius-full`. The only raw value is the 1px ring. The variants' frames have an unbound white square fill in Figma; code ignores it (§10 #32).

**API:**

```tsx
import { FinOnlineIndicator } from '@finspace-loyalty/ui';

<FinOnlineIndicator size="small" />               // announced as "Online"
<FinOnlineIndicator label="Available" />          // custom label
<FinAvatar src={url} label="Sathila De Silva" online />  // on an avatar: use FinAvatar `online` (§9.4)
```

Presentational: no `'use client'`. `className` and other `<span>` attributes go to the dot.

**Accessibility:** `role="img"` with `aria-label` (default "Online", overridable), so the status doesn't rely on color; `decorative` hides it when the status is announced elsewhere. Contrast (non-text, 3:1): `fg-success` against the ring and page 3.64:1 Light / 10.75:1 Dark, against `bg-icons` 3.11:1 / 5.77:1.

**Built (15 Oct 2026).** Storybook (under Components/Avatar): Playground, Sizes (Figma). Checked against Figma: all 5 sizes exact (6/8/12/16/24), 1px ring outside, Light fill `#2a9952` and ring `#ffffff` equal Figma; Dark uses the Dark tokens (`#9fd7b3` on a `#19191a` ring). a11y: no violations in Light or Dark.

### 9.8 FinBadgeIndicator (Badge - indicator)

**Figma:** page **Badge**, component set `Badge - indicator` `30:1500`: `Size` = Small / Large × `Digits` = None / Single / Double × `Style` = Red / Yellow / Green (18 variants). Small Single changed from 14 to 16 in Figma (15 Oct 2026).

**Figma → code names:** `Style` (Red / Yellow / Green) → `tone` with values `error` / `warning` / `success` (pre-rule decision 15 Oct 2026; values renamed); `Digits` (None / Single / Double) → no prop: the shape comes from `count`.

**Variants:**

| Figma | Prop |
|---|---|
| `Size` = Small / Large | `size: 'small' \| 'large'` (default `'small'`) |
| `Style` = Red / Yellow / Green | `tone: 'error' \| 'warning' \| 'success'` (default `'error'`), rendered as `data-tone` (only changes colors, §7.3) |
| `Digits` = None / Single / Double | From `count`: none → dot; 1–9 → circle; 10 and up → pill, capped at `max` (default 99) as "99+". `count` 0 or less hides the badge (decided 15 Oct 2026). Rendered as `data-shape` (`dot`, `circle`, `pill`). |
| — | `label`: accessible text |

**Tokens used:**

| Part | Small | Large |
|---|---|---|
| Dot (None) | `--fin-size-6` | `--fin-size-12` |
| Circle (Single) | `--fin-size-16` | `--fin-size-20` |
| Pill (Double) | padding `--fin-space-xxs` / `--fin-space-xs` (Figma 2/4, raw) → 19 tall | same → 22 tall |
| Number | `--fin-font-caption-small` | `--fin-font-caption-large` |

Fill `--fin-fg-error` / `-warning` / `-success`; number `--fin-text-inverse`; `--fin-radius-full`. Heights are kept as in Figma (Small circle 16 vs pill 19, Large 20 vs 22; decided 15 Oct 2026). Dropped: the `Spacing and Radius` library bindings (padding 0, gap 8) on variants without auto layout, the raw 0/3 padding on Large Single (no effect on a fixed, centered circle), and the `"case"` font feature. No raw values in the CSS.

**API:**

```tsx
import { FinBadgeIndicator } from '@finspace-loyalty/ui';

<FinBadgeIndicator count={3} label="3 unread notifications" />   // circle
<FinBadgeIndicator count={120} size="large" />                   // pill "99+", read as "99+"
<FinBadgeIndicator tone="success" />                             // dot, decorative
```

Presentational: no `'use client'`. `className` and other `<span>` attributes go to the badge.

**Accessibility:** with `label`, `role="img"` and that name (the number isn't read separately). Without `label`, a count is read as its text and a dot is `aria-hidden`. Not interactive.
- **Known contrast failures (§10 #3, decided 15 Oct 2026: build as Figma, document them):** the number on Light Yellow 3.24:1 and Light Green 3.64:1 (white), and on Dark Red 3.97:1 (`text-inverse` `#474748`); 4.5:1 needed. The Storybook a11y check leaves out only those badges, in that theme (`KNOWN_CONTRAST_ISSUES` in the stories); dots and every other combination are checked. Remove the exceptions when §10 #3 is decided. Dots pass (3:1): 3.24:1 or more on the page.

**Built (15 Oct 2026).** Storybook (Components/Badge): Playground (controls, incl. a Figma `Digits` control: None, Single, Double or a custom count), Sizes, digits and tones (Figma). Checked against Figma: all 18 variants, dot 6/12, circle 16/20, pill height 19/22 with 2/4 padding, centered number in the Figma text style, Light colors equal Figma, Dark uses the Dark tokens. Pill widths are 27.5 and 31.1 against Figma's 28 and 32: Figma rounds the text box width up to whole pixels. a11y: no violations in Light or Dark apart from the three documented exceptions (checked: without them, exactly those fail).

### 9.9 FinBadgeBase (Badge-base)

**Figma:** page **Badge**, component set `Badge-base` `30:1454` (renamed from `Tag-base` 15 Oct 2026): `Size` = Small (`30:1455`) / Large (`3027:12293`), with `Show Leading Icon`, `Show Trailing Icon` and `Label`. Icons in Figma are the placeholder `perm_identity` with no swap property. **Base** of `Badge-primary` (§7.2). **Internal** (decided 15 Oct 2026): not exported from the package; FinBadge is the public badge. Checked 15 Oct 2026: in Figma only the 8 Badge-primary states use Badge-base directly (Table cell uses Badge-primary); the only other references are off-canvas leftovers (`Badge-primary/brand`, `Badge-primary/Gold`, not on any page).

**Figma → code names:** `Show Leading Icon` / `Show Trailing Icon` + the icon → `leadingIcon` / `trailingIcon` (an icon name; none = hidden); `Label` → `children`. Code-only: `tone` (Badge-primary's colours, held in the base).

**Variants:**

| Figma | Prop |
|---|---|
| `Size` = Small / Large | `size: 'small' \| 'large'` (default `'small'`) |
| `Label` | `children`: one line, no wrapping, no fixed max width; `max-width: 100%` with "…" in narrower containers such as table cells (decided 15 Oct 2026) |
| `Show Leading Icon` + the icon | `leadingIcon?: FinIconName`: shown when set. **None by default** (decided 15 Oct 2026; Figma shows both placeholders by default) |
| `Show Trailing Icon` + the icon | `trailingIcon?: FinIconName`. Decorative, not a dismiss button |
| — (Badge-primary `State` colors) | `tone: 'primary' \| 'secondary' \| 'success' \| 'error' \| 'info' \| 'warning' \| 'disabled' \| 'neutral'` (default `'primary'`, Badge-base's own colors), rendered as `data-tone` (added 15 Oct 2026 with FinBadge, §9.10) |

**Structure:** a `<span>` with the leading `FinIcon`, the label `<span>` and the trailing `FinIcon`. Icons are decorative and have no color of their own, so they inherit the label color (decided 15 Oct 2026; Figma's `fg-white_both` is the same white as `text-white_both`).

**Tokens used:**

| Part | Small | Large |
|---|---|---|
| Height | from content: 26 | `--fin-size-32` (fixed in Figma) |
| Padding | `--fin-space-xs` / `--fin-space-m` (4 / 8) | same |
| Gap | `--fin-space-xs` (4) | same |
| Label | `--fin-font-label-small` | `--fin-font-label-medium` |
| Icons (FinIcon `size`) | 16 | 20 |

Colors come from `tone` (table in §9.10; `primary` = `--fin-bg-brand` and `--fin-text-white-both`); `--fin-radius-s` (8). All Figma bindings are Foundation – Loyalty; no raw values except the fixed Large height (a size). The `"case"` font feature is dropped.

**Colors and tones (decided 15 Oct 2026):** the base was built with Figma's base colors only; the 8 Badge-primary tones were then added **to this file's CSS** with FinBadge (§9.10). Each tone sets `--badge-bg`, `--badge-text` (icons follow it) and `--badge-border`. The border is Figma's 1px *inside* stroke, drawn as `box-shadow: inset 0 0 0 1px` so it never changes the size (Small stays 26). FinBadge only passes `tone` and has no CSS of its own.

**API:**

```tsx
// Internal: only other components in packages/ui import it (FinBadge). Not exported from '@finspace-loyalty/ui'.
import { FinBadgeBase } from '../BadgeBase';

<FinBadgeBase {...props} size="small" />                              // how FinBadge uses it
<FinBadgeBase size="large" tone="success" leadingIcon="check_circle">Paid</FinBadgeBase>
```

Presentational: no `'use client'`. `className` and other `<span>` attributes go to the badge (for example `title` with the full text when it may be cut off).

**Accessibility:** read as its label; icons are `aria-hidden`. Not interactive. Contrast: white on `bg-brand` 4.71:1 in Light and Dark (text and icons pass). A cut-off label is still read in full by screen readers.

**Built (15 Oct 2026).** Storybook (**Internal/Badge base**, no Playground since it's internal): Sizes (Figma) with both icons, one, or none, Long label (240, 160 and 96 px containers). Checked against Figma: height 26 / 32, padding 4/8, gap 4, radius 8, `bg-brand`, Label/Small and Label/Medium in white, icons 16 / 20 in the label color; widths with both icons 110.2 / 127.2 against Figma's 111 / 128 (Figma rounds text widths up). Long labels end in "…" and stay inside the container. a11y: no violations in Light or Dark.

### 9.10 FinBadge (Badge-primary)

**Figma:** page **Badge**, component set `Badge-primary` `30:1465`: `State` = Primary / Secondary / Success / Error / Info / Warning / Disabled / Neutral (8 variants; `brand` removed by design 15 Oct 2026, and the Error variant's stray outer green stroke fixed). Each is a `Badge-base` instance with **Size=Small and both icons hidden**; only the colors change. **Mapped** from `Badge-base` (§7.2).

**Figma → code names:** `State` → `tone` (values lower case). Code-only: `leadingIcon` / `trailingIcon` (pass-through to the base; Figma hides them, approved 15 Oct 2026 before this rule).

**Variants:**

| Figma | Prop |
|---|---|
| `State` | `tone` (default `'primary'`), passed to FinBadgeBase. The tone list is defined once, `FIN_BADGE_TONES` / `FinBadgeTone` in FinBadgeBase, and exported publicly through FinBadge |
| Badge-base `Label` | `children` |
| Badge-base icons (hidden in Figma) | `leadingIcon`, `trailingIcon`: optional for any tone, in the tone's text color (decided 15 Oct 2026) |
| Badge-base `Size` | Always `small` (fixed in Figma). Large isn't public: no Figma component uses a Large badge (0 instances) |

**Structure:** `<FinBadgeBase {...props} size="small" />`. No markup or CSS of its own; the tone styles live in FinBadgeBase (§9.9).

**Tones (FinBadgeBase CSS):**

| `tone` | Fill | Border (1px, inside) | Text and icons | Text contrast Light / Dark |
|---|---|---|---|---|
| `primary` | `--fin-bg-brand` | none | `--fin-text-white-both` | 4.71 / 4.71 |
| `secondary` | none | `--fin-border-strong` | `--fin-text-secondary` | 5.82 / 8.76 |
| `success` | `--fin-bg-success-secondary` | `--fin-border-success` | `--fin-text-success` | 5.01 / 7.75 |
| `error` | `--fin-bg-error-secondary` | `--fin-border-error` | `--fin-text-error` | 5.05 / 8.52 |
| `info` | `--fin-bg-info-secondary` | `--fin-border-info` | `--fin-text-info` | 6.88 / 8.65 |
| `warning` | `--fin-bg-warning-secondary` | `--fin-border-warning` | `--fin-text-warning` | 4.57 / 7.53 |
| `disabled` | `--fin-bg-disabled` | none | `--fin-text-disabled-on-bg` | **2.44 / 1.98** (exception) |
| `neutral` | `--fin-bg-neutral` | none | `--fin-text-secondary` | 4.80 / 4.71 |

All Figma bindings are Foundation – Loyalty; no raw values.

**API:**

```tsx
import { FinBadge } from '@finspace-loyalty/ui';

<FinBadge>Active</FinBadge>
<FinBadge tone="success" leadingIcon="check_circle">Paid</FinBadge>
<FinBadge tone="warning" trailingIcon="keyboard_arrow_down">Pending</FinBadge>
```

Presentational: no `'use client'`. `className` and other `<span>` attributes go to the badge.

**Accessibility:** read as its label; icons are decorative. Not interactive. **`disabled` tone (decided 15 Oct 2026: keep as designed):** a disabled look, 2.44:1 Light / 1.98:1 Dark; the Storybook a11y check leaves out only `[data-tone="disabled"]` badges (FinBadge and FinBadgeBase stories); every other tone is checked (verified: without the exception, only the disabled badges fail). Borders are decorative (the text carries the meaning), so they have no 3:1 requirement.

**Built (15 Oct 2026).** Storybook (Components/Badge): Playground (tone, label, each icon or none), States (Figma) with each tone plain, with a leading and with a trailing icon. Checked against Figma: all 8 tones have the exact Light fill, border and text colors, 26 tall (also with icons), icons in the text color; width 70.2 against Figma's 71 (text rounding). Dark uses the Dark tokens. a11y: no violations in Light or Dark apart from the documented `disabled` exception.

### 9.11 FinIndicatorDot (Indicator) — internal

**Figma:** page **Indicator**, component set `Indicator` `98:3532`: `Type` = Default (6 × 6, `fg-placeholder`) / Selected (22 × 6, `fg-brand`), raw radius 8. Used only inside `Indicator set` (all 50 instances). **Internal base** (§7.2 rule 4): not exported; FinPageIndicator is the public component.

**Figma → code names:** `Type` (Default / Selected) → `selected` (boolean). Code-only: `interactive`.

**Variants:**

| Figma | Prop |
|---|---|
| `Type` = Default / Selected | `selected?: boolean` (renders `data-selected`) |
| — (clickable, decided 15 Oct 2026) | `interactive?: boolean`: a `<button>` with the hit area and focus ring; otherwise a decorative `<span>` (`aria-hidden`) |

**Tokens used:**

| Part | Token |
|---|---|
| Dot (Default) | `--fin-size-6` × `--fin-size-6`, `--fin-fg-placeholder` |
| Pill (Selected) | `--fin-size-24` × `--fin-size-6`, `--fin-fg-brand`. **24 in code, 22 in Figma** (no `Size-22`; decided 15 Oct 2026, §10 #35) |
| Radius | `--fin-radius-full` (Figma's raw 8 on a 6px shape is already a full pill) |
| Clickable hit area | height `--fin-size-24`, padding `0 var(--fin-space-xxs)` (the 2px either side that the set's 4px gap leaves) |
| Focus | on the visible dot: `outline: 2px solid var(--fin-border-focused)`, `outline-offset: 2px` (§10 #6) |
| Hover, pressed | none yet: cursor only (no design; like the Profile image badge, §10 #31) |

All styles live here (§7.2); FinPageIndicator only lays the dots out. Internal API: `<FinIndicatorDot selected interactive aria-label="Step 2" />` (ref goes to the button).

**Built (15 Oct 2026).** Storybook: **Internal/Indicator** › Types (Figma), display-only and clickable.

### 9.12 FinPageIndicator (Indicator set)

**Figma:** page **Indicator**, component set `Indicator set` `98:3541`: `Active` = 1–5 × `Number` = 3 / 4 / 5 × `Size` = Small (12 variants): a row of `Indicator` instances with a 4px gap (`Space-XS`), one Selected. No instances yet. **Mapped** from the internal FinIndicatorDot.

**Figma → code names:** `Number` → `count`; `Active` → `active`; `Size` (Small only) → no prop. Code-only: `onChange`, `label`, `dotLabel` (behaviour, accessibility).

**Variants:**

| Figma | Prop |
|---|---|
| `Number` = 3 / 4 / 5 | `count`: any number from 1, **no maximum** (decided 15 Oct 2026); 0 renders nothing |
| `Active` = 1…5 | `active`: 1-based, kept between 1 and `count` |
| `Size` = Small | only size; not a prop |
| — (clickable, decided 15 Oct 2026) | `onChange?(position)`: makes the dots clickable; `label`; `dotLabel?(position, count)` |

**Layout:** `display: inline-flex`, gap `--fin-space-xs`. Clickable: gap 0 (each hit area holds 2px either side) and negative margins (`calc((var(--fin-size-6) - var(--fin-size-24)) / 2)` and `calc(-1 * var(--fin-space-xxs))`) so the layout footprint stays the Figma size while the 24px-tall hit areas reach past it. Widths: 44 / 54 / 64 for 3 / 4 / 5 (Figma 42 / 52 / 62, from the 22px pill).

**API:**

```tsx
import { FinPageIndicator } from '@finspace-loyalty/ui';

<FinPageIndicator count={5} active={2} />                                  // display-only: "Step 2 of 5"
<FinPageIndicator count={5} active={step} onChange={setStep} label="Onboarding steps" />  // clickable
```

`'use client'`. `className` and other `<div>` attributes go to the root.

**Accessibility:**
- **Display-only:** `role="img"`, named "Step {active} of {count}" (or `label`); the dots are hidden.
- **Clickable (radio group pattern, decided 15 Oct 2026):** `role="radiogroup"` (named by `label`, default "Steps"); each dot is a native `<button role="radio">` with `aria-checked` and a name ("Step {n} of {count}", or `dotLabel`). One tab stop (the current dot); ←/↑ and →/↓ move and select (wrapping), Home/End jump to the ends; focus follows.
- **Target size (WCAG 2.2 2.5.8), decided 15 Oct 2026:** the dots keep Figma's spacing, so each hit area is 24 tall but only as wide as the dot plus 4 (10 px for a dot, 28 for the pill). This relies on the **equivalent-control exception**: any screen that uses a clickable page indicator must also offer another way to change position (for example Previous / Next buttons).
- The selected position differs by **shape** (24 vs 6 wide), not only color. Default dots are `fg-placeholder`: 2.96:1 on `bg-primary` and 2.71:1 on `bg-secondary` in Light (below the 3:1 non-text minimum; Dark 4.51 / 3.73), logged in §10 #3. The a11y check doesn't measure non-text contrast.
- The focus ring (2px, 2px offset) reaches the neighbouring dots because of the 4px gap.

**Built (15 Oct 2026).** Storybook (Components/Indicator): Playground (count, active, clickable), Active and number (Figma) with all 12, Clickable (3, 5 and 8 dots, keyboard). Checked against Figma: dots 6 × 6, selected 24 × 6, gap 4, full radius, Light colors `#625bff` / `#969696` equal Figma (Dark uses the Dark tokens), widths 44 / 54 / 64; clickable dots look the same, with 24px-tall hit areas side by side; Tab then → moves to and checks the next dot, with the focus ring on it. a11y: no violations in Light or Dark.

### 9.13 FinOverlay (Overlay)

**Figma:** page **Overlays**, component set `Overlay` `111:2495`, `Type=Desktop` only (`Type=Mobile` is kept in Figma for possible future mobile use and is out of scope, §10 #24): one 1920 × 1080 rectangle, fill `Alpha-md` (`#0b0b0b` @ 40%, Light and Dark), constraints Scale × Scale, no blur, radius or shadow. No instances yet; Dialog box and Side sheet sit on it (§4.2).

**Figma → code names:** `Type` → no prop (only `Desktop` is in scope).

**Size: responsive** (design rule, 15 Oct 2026). No fixed size: `position: fixed; inset: 0`, so it fills the browser window at any width and height and follows resizing. Figma's 1920 × 1080 is only the frame, so there's no `Size-*` token.

**Tokens used:** background `--fin-alpha-md` (the scrim, §3.3). No raw values.

**Stacking and scrolling (decided 15 Oct 2026):** FinOverlay has **no z-index**. Dialog box and Side sheet add the stacking when they're built (planned: a native `<dialog>` with `showModal()`, which uses the browser's top layer, with FinOverlay inside it and the panel on top). **While a Dialog box or Side sheet is open, the page behind doesn't scroll**; that belongs to those components, not to FinOverlay.

**API:**

```tsx
import { FinOverlay } from '@finspace-loyalty/ui';

<FinOverlay onClick={onClose} />   // "click outside"; the component on top decides what it does
```

Presentational: no `'use client'`, no props of its own. `className` and other `<div>` attributes (including `onClick`) go to the overlay. No animation (motion is deferred, §5).

**Accessibility:** decorative: `aria-hidden="true"`, not focusable, no content; the dialog on top owns focus, Esc and labels. Not a control, so it isn't part of the tab order (`onClick` is a pointer shortcut; the dialog must also offer a close button and Esc).

**Built (15 Oct 2026).** Storybook (Components/Overlay): Over page content (full screen, sample page behind). Checked against Figma: `#0b0b0b` @ 40% in Light and Dark; covers the window exactly at 1024 × 768, 1280 × 800, 1440 × 900, 1920 × 1080, 2560 × 1440 and 1100 × 600, and stays in place when the page scrolls. a11y: no violations in Light or Dark.

### 9.14 FinToggle (Toggle)

**Figma:** page **Toggle**, component set `Toggle` `34:2545` (renamed from `Switch` 15 Oct 2026): `State` = Enabled / Disabled × `Type` = Selected / Unselected × `Size` = Small / Large × `Focused` = True / False (16 variants). Updated by design 15 Oct 2026: Large track 52 → 56, handle `White` (alias) → `fg-white_both`, off track `border-default` → `fg-placeholder`, disabled on-track → `bg-disabled`. No hover or pressed variants; no instances yet.

**Figma → code names:** `Type` (Selected / Unselected) → `checked` / `defaultChecked` (native input); `State` (Enabled / Disabled) → `disabled`; `Focused` → CSS. Code-only: `label`.

**Variants:**

| Figma | Prop / state |
|---|---|
| `Type` = Selected / Unselected | `checked` / `defaultChecked` + `onChange` (native checkbox) |
| `Size` = Small / Large | `size: 'small' \| 'large'` (default `'small'`) |
| `State=Disabled` | `disabled` (native; never focusable, so Disabled + Focused is ignored, §7.3) |
| `Focused` | `:focus-visible` |
| — | `label` (required): the accessible name, **visually hidden** (decided 15 Oct 2026; Figma shows no label) |

**Structure:** a `<label>` holding a native `<input type="checkbox" role="switch">` laid invisibly over the track (it gets clicks, keyboard and focus), the track with its handle (`aria-hidden`), and the visually hidden label text. `ref` goes to the input; other input attributes (`name`, `value`, `checked`…) go to it too; `className` goes to the wrapper.

**Tokens used:**

| Part | Small | Large |
|---|---|---|
| Track | `--fin-size-40` × `--fin-size-24` | `--fin-size-56` × `--fin-size-32` |
| Handle | `--fin-size-16` | `--fin-size-24` |
| Handle inset | `--fin-space-xs` (track padding) | same |
| Radius | `--fin-radius-full` (Figma raw 100 and 23) | same |

| State | Track | Handle |
|---|---|---|
| Unselected | `--fin-fg-placeholder` | `--fin-fg-white-both`, left |
| Selected | `--fin-fg-brand` | `--fin-fg-white-both`, right |
| Unselected, disabled | `--fin-border-disabled` | `--fin-fg-disabled` |
| Selected, disabled | `--fin-bg-disabled` | `--fin-fg-disabled-on-bg` |
| Focused | `outline: 2px solid var(--fin-border-focused)`, `outline-offset: 1px` (as Figma: 2px ring 1px outside the track; Figma's ring radius is bound to another library, mapped to `Radius-Full`) | |
| Hover, pressed | none yet: cursor only (no design) | |

Raw values: the 2px / 1px focus ring and the 1px visually hidden label box. No animation: the handle moves instantly (motion is deferred, §5).

**API:**

```tsx
import { FinToggle } from '@finspace-loyalty/ui';

<FinToggle label="Email notifications" defaultChecked />
<FinToggle label="Auto-renew" size="large" checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} />
```

`'use client'` (interactive).

**Accessibility:** announced as a switch, on or off, with its label; Tab reaches it, Space toggles it; clicking anywhere on it toggles it. Disabled toggles are skipped. Pointer target 40 × 24 / 56 × 32 (≥ 24). Contrast (non-text, 3:1): selected track 4.71 Light / 5.24 Dark, handle on it 4.71 / 3.35. **Unselected track (decided 15 Oct 2026: build as Figma, logged in §10 #3):** `fg-placeholder` is 2.96:1 on `bg-primary` and 2.71:1 on `bg-secondary` in Light, handle on it 2.96:1 (Dark 4.51 / 3.73, handle 3.90). The a11y check doesn't measure non-text contrast.

**Built (15 Oct 2026).** Storybook (Components/Toggle): Playground, States (Figma) with both sizes, on/off, enabled/disabled, Focused (Tab). Checked against Figma: tracks 40 × 24 and 56 × 32, handles 16 and 24 at (4, 4) off and (20, 4) / (28, 4) on, full radius, Light colors equal Figma for all 8 states (Dark uses the Dark tokens), focus ring 2px 1px out; Space switches it on. a11y: no violations in Light or Dark.

### 9.15 FinRadio (Base-Radio_box)

**Figma:** page **Radio button**, component set `Base-Radio_box` `37:104`: `State` = Enabled / Hovered / Pressed / Disabled × `Type` = Unselected / Selected (8 variants), no `Focused` variant, no label, no instances. Hover and Pressed fills swapped by design on 15 Oct 2026 (Hovered = `bg-active`, Pressed = `bg-active-hover`). **Public despite the "Base" name** (decided 15 Oct 2026): nothing in Figma is mapped from it, so it's the exception to §7.2 rule 4.

**Figma → code names:** `Type` (Selected / Unselected) → `checked` / `defaultChecked` (native input); `State` Hovered / Pressed → CSS, Disabled → `disabled`. Code-only: `label`, `name`, `value`.

**Variants:**

| Figma | Prop / state |
|---|---|
| `Type` = Selected / Unselected | `checked` / `defaultChecked` + `onChange` (native radio) |
| `State` = Hovered / Pressed | `:hover` / `:active` (enabled only) |
| `State` = Disabled | `disabled` (native; not focusable, no hover or pressed) |
| — (no Focused variant) | `:focus-visible`: the default ring (§10 #6) |
| — | `label` (required): the accessible name, **visually hidden** (decided 15 Oct 2026; visible option labels will come from the List component) |

**Structure:** a `<label>` holding a native `<input type="radio">` laid invisibly over the 24px box (it gets clicks, keyboard and focus), the ring with its dot (`aria-hidden`), and the visually hidden label. `name`, `value` and other input attributes go to the input, `ref` too; `className` goes to the wrapper. Radios that share a `name` behave as one group natively: one tab stop (the selected radio), arrow keys move and select. Grouping is up to the screen (`<fieldset>` + `<legend>`, or `role="radiogroup"` with a name); no FinRadioGroup (not in Figma).

**Tokens used:** box `--fin-size-24`; ring `--fin-size-20`, 2px inside stroke (a border), centred (Figma inset 2); dot `--fin-size-12`, centred; `--fin-radius-full` (Figma's radius is bound to another library, `Alias Spacing & Radius`).

| State | Unselected: ring / fill | Selected: ring and dot |
|---|---|---|
| Enabled | `--fin-border-strong` / none | `--fin-fg-action` |
| Hovered | `--fin-border-hovered` / `--fin-bg-active` | `--fin-fg-hovered` |
| Pressed | `--fin-border-pressed` / `--fin-bg-active-hover` | `--fin-fg-pressed` |
| Disabled | `--fin-fg-disabled` / none | `--fin-fg-disabled` |
| Focus | `outline: 2px solid var(--fin-border-focused)`, `outline-offset: 2px` | same |

Raw values: the 2px ring stroke and focus ring, and the 1px visually hidden label box. No animation (§5).

**API:**

```tsx
import { FinRadio } from '@finspace-loyalty/ui';

<fieldset>
  <legend>Billing period</legend>
  <FinRadio name="billing" value="monthly" label="Monthly" defaultChecked />
  <FinRadio name="billing" value="yearly" label="Yearly" />
</fieldset>
```

`'use client'` (interactive).

**Accessibility:** announced as a radio button with its label, selected or not, and its position in the group. Pointer target 24 × 24. Contrast (non-text, 3:1): selected `fg-action` 4.71 Light / 5.24 Dark; hovered ring on its fill 4.82 / 4.92; pressed 5.11 / 5.52. **Unselected ring** `border-strong`: 2.96:1 on `bg-primary` and 2.71:1 on `bg-secondary` in Light (2.88 / 2.39 Dark), below 3:1; built as Figma (decided 15 Oct 2026), logged in §10 #3. Disabled is exempt.

**Built (15 Oct 2026).** Storybook (Components/Radio button): Playground, States (Figma) with Enabled and Disabled shown and Hovered/Pressed live, Group (fieldset, keyboard). Checked against Figma: box 24, ring 20 at (2, 2) with a 2px stroke, dot 12 at (4, 4); Light colors equal Figma for all 8 states (Hovered and Pressed measured with a real mouse); Dark uses the Dark tokens; Tab then ↓ moves to and selects the next radio, with the focus ring. a11y: no violations in Light or Dark.

### 9.16 FinProgressBar (Progress bar)

**Figma:** page **Progress**, component set `Progress bar` `31:2113`: `Filled` × `Size` = Large / Small × `Steps` = 4 / 5 (16 variants): a `bg-active-hover` track with an `fg-brand` fill, both `Radius-XS`, 311 wide (fixed). Base of `bar-with-text` (§8 #44; its 8 instances are all there). **Public** (decided 15 Oct 2026): §7.2 rule 4 exception, because it will also be used on its own, for example in layouts.

**Figma → code names:** `Filled` → `value` (any number, not only Figma's steps); `Steps` → no prop. Code-only: `max`, `label`.

**Variants:**

| Figma | Prop |
|---|---|
| `Filled` (0/25/50/75/100%, or 0/20/…/100% with `Steps=5`) | `value`: **any** number from 0 to `max`, clamped (decided 15 Oct 2026; the logic may come from the back end or the front end) |
| `Steps` = 4 / 5 | not a prop: only the set of example `Filled` values |
| `Size` = Large / Small | `size: 'large' \| 'small'` (default `'large'`) |
| — | `max` (default 100), so counts can be passed as they are ("3 of 5"); `label` (required): accessible name |

**Tokens used:**

| Part | Token |
|---|---|
| Track | width **100% of its container** (decided 15 Oct 2026; Figma's 311 is a mobile-era frame width), height `--fin-size-8` (Large) / `--fin-size-4` (Small), `--fin-bg-active-hover`, `--fin-radius-xs`, clips the fill |
| Fill | width `var(--progress)` (set on the element from `value / max`), `--fin-fg-brand`, `--fin-radius-xs` (Figma's fill radius is bound to the `Tokens` library, "Radius 4px") |

No raw values. No animation: the fill jumps to its new width (§5). No indeterminate state (not in Figma).

**API:**

```tsx
import { FinProgressBar } from '@finspace-loyalty/ui';

<FinProgressBar value={40} label="Profile completion" />
<FinProgressBar value={3} max={5} size="small" label="Step 3 of 5" />
```

Presentational: no `'use client'`. `className`, `style` and other `<div>` attributes go to the track (`style` is merged with `--progress`).

**Accessibility:** `role="progressbar"` with `aria-label`, `aria-valuemin="0"`, `aria-valuemax` (= `max`) and `aria-valuenow`. Contrast (non-text, 3:1): fill on track 3.07 Light / 3.14 Dark, fill on the page 4.71 / 5.24.

**Built (15 Oct 2026).** Storybook (Components/Progress): Playground, Values and sizes (Figma) with all 16 variants, Fills its container (120, 240, 480 px, with `max`). Checked against Figma: heights 8 / 4, radius 4, Light `#ceccff` / `#625bff` (Dark uses the Dark tokens), fill exactly `value`% of the track (25% of 311 = 77.75, as in Figma). a11y: no violations in Light or Dark.

### 9.17 FinSpinner (Spinner)

**Figma:** page **Progress**, component set `Spinner` `33:2331`: `Pregress` (typo for Progress, §10 #21) = 25% / 50% / 75% / Success / Error. Progress: a 48 box with a 40 ring (`bg-active-hover` track, 4px inside stroke) and an `fg-brand` arc (4px, flat ends). Success / Error: a 48 circle, `bg-success_secondary` / `bg-error_secondary`, with a 24px `check` (`fg-success`) / `warning_amber` (`fg-error`; current name `warning`, §6.4). Base of `spinner-with-text` (§8 #45; all 10 instances are there). **Public** (decided 15 Oct 2026): §7.2 rule 4 exception, used on its own.

**Figma → code names:** `Pregress` (typo for Progress) → `status` (`progress` / `success` / `error`) plus `value` for the 25 / 50 / 75% options. Code-only: `max`, `label`; no `value` gives the spinning loader.

**Variants:**

| Figma | Prop |
|---|---|
| `Pregress` = 25/50/75% | `status: 'progress'` (default) with `value` (any, 0 to `max`, default 100): a **still** ring whose arc is that share |
| — (loading) | `status: 'progress'` **without** `value`: a **loader**, a quarter arc that spins (decided 15 Oct 2026) |
| `Pregress` = Success / Error | `status: 'success' \| 'error'` |
| — | `label` (required): accessible name |

**Arc (decided 15 Oct 2026):** starts at 12 o'clock and runs clockwise, exactly `value / max` of the circle. Figma's arcs are hand-drawn (its "50%" is 168°, and the start points differ); code is exact.

**Motion (decided 15 Oct 2026, the first animation; §5 is otherwise still deferred):** the loader turns clockwise once per second at a steady speed (`1s linear infinite`, raw until motion tokens exist). With `prefers-reduced-motion: reduce` it doesn't spin. A ring with a `value` never spins.

**Tokens used:**

| Part | Token |
|---|---|
| Box | `--fin-size-48`, `--fin-radius-full` |
| Ring (progress) | `--fin-size-40`, centred (Figma inset 4); an SVG circle, r 18 in a 40 view box, stroke width `--fin-size-4`; track `--fin-bg-active-hover`, arc `--fin-fg-brand` with `stroke-dasharray: var(--arc) 100` on `pathLength="100"`, flat caps |
| Success | `--fin-bg-success-secondary`, FinIcon `check` 24 `color="success"` |
| Error | `--fin-bg-error-secondary`, FinIcon `warning` 24 `color="error"` |

Sizes as in Figma (decided 15 Oct 2026): the progress ring is 40 inside the 48 box; Success and Error fill the 48. The SVG is drawing geometry, not an icon (icons still go through FinIcon).

**API:**

```tsx
import { FinSpinner } from '@finspace-loyalty/ui';

<FinSpinner label="Loading members" />                     // spinning loader
<FinSpinner value={60} label="Uploading file" />           // still ring, 60%
<FinSpinner status="success" label="Upload complete" />
```

Presentational: no `'use client'`. `className`, `style` (merged with `--arc`) and other `<div>` attributes go to the box.

**Accessibility:** progress: `role="progressbar"` with `aria-label`; with a `value`, also `aria-valuemin`, `aria-valuemax`, `aria-valuenow` (without one it's an indeterminate progressbar). Success / Error: `role="img"` named by `label`; the icon is decorative. Contrast (non-text, 3:1): arc on track 3.07 Light / 3.14 Dark; check on its circle 3.28 / 6.56; warning 5.05 / 6.34.

**spinner-with-text (§8 #45)** puts a Text Box under this spinner.

**Built (15 Oct 2026).** Storybook (Components/Progress): Playground, States (Figma), Loading, Any value. Checked against Figma: box 48, ring 40 at (4, 4), stroke 4, arcs 90° / 180° / 270° from 12 o'clock, flat ends; Success / Error 48 circles with 24px icons at (12, 12); Light colors equal Figma (Dark uses the Dark tokens). The loader spins (1s, linear) and stays still with reduced motion. a11y: no violations in Light or Dark.

### 9.18 FinSlider (slider)

**Figma:** page **Progress**, component set `slider` `645:3136` (renamed from `dragger` 15 Oct 2026): `Filled` = 5 / 25 / 50 / 75 / 100% (5 variants). A 311 × 8 track (`bg-active-hover`, radius 4) with an `fg-brand` fill and a 24px `fg-brand` handle with a 2px white **inside** stroke (`border-inverse`) and `Shadow/Resting_cards`. No hover, pressed, focus or disabled variants; no instances. Figma's fills are hand-placed (its 25% is drawn at 33%, 5% at 11%, 75% at 72%).

**Figma → code names:** `Filled` → `value` / `defaultValue`. Code-only: `min`, `max`, `step`, `label`, `valueText`, `disabled`.

**Variants:**

| Figma | Prop |
|---|---|
| `Filled` | `value` (controlled, with `onChange`) or `defaultValue` (uncontrolled, default `min`) |
| — | `min` (default **0**), `max` (default 100), `step` (default 1): the screen sets the range for its scenario (decided 15 Oct 2026) |
| — | `label` (required, **visually hidden**), `valueText` (optional spoken value, for example "1500 points"), `disabled` |

**Geometry (decided 15 Oct 2026):** standard slider positions. The handle's centre travels from 12px to (width − 12px), so it never leaves the track, and the fill runs to its centre. Values are exact. Fills the width of its container (Figma's 311 is a mobile-era frame width).

**Structure:** a native `<input type="range">`, restyled: dragging, clicking the track, the keyboard (arrows step, Page Up / Down jump, Home / End go to the ends) and screen readers come from the browser. The fill is a two-colour track background stopped at `calc(12px + fraction × (100% − 24px))`, with `--fraction` set on the element. `ref` and native attributes go to the input.

**Tokens used:**

| Part | Token |
|---|---|
| Input (hit area) | width 100%, height `--fin-size-24` |
| Track | height `--fin-size-8`, `--fin-radius-xs` (Figma's radius is bound to another library, `Alias Spacing & Radius`), `--fin-bg-active-hover` |
| Fill | `--fin-fg-brand` |
| Handle | `--fin-size-24`, `--fin-radius-full`, `--fin-fg-brand`, 2px `--fin-border-inverse` border inside (`box-sizing: border-box`), `--fin-shadow-resting-cards` |
| Disabled (decided 15 Oct 2026; no Figma design) | track `--fin-border-disabled`, fill and handle `--fin-fg-disabled`, no shadow |
| Focus | on the handle: `outline: 2px solid var(--fin-border-focused)`, `outline-offset: 2px` (§10 #6) |
| Hover, pressed | none yet: cursor only |

Raw values: the 2px handle ring and focus ring. No animation (§5).

**API:**

```tsx
import { FinSlider } from '@finspace-loyalty/ui';

<FinSlider label="Points to redeem" min={500} max={5000} step={100} value={points}
  valueText={`${points} points`} onChange={(e) => setPoints(Number(e.target.value))} />
```

`'use client'` (keeps the uncontrolled value to draw the fill).

**Accessibility:** announced as a slider with its name, value (or `valueText`), minimum and maximum. Handle 24 × 24, input 24 tall. Contrast (non-text, 3:1): fill on track 3.07 Light / 3.14 Dark, handle on the page 4.71 / 5.24. Keyboard behaviour is the browser's own, so it's checked in a real browser (jsdom doesn't simulate range keys).

**Built (15 Oct 2026).** Storybook (Components/Progress): Playground, Values (Figma) with 5 / 25 / 50 / 75 / 100% and disabled, Controlled (500–5000, step 100), Fills its container. Checked in Chrome: input 24 tall, handle 24 with its ring centred on the track; handle centre at exactly 12 + v × (width − 24) for every value; fill, track and handle colors equal Figma (Dark uses the Dark tokens; the handle ring is `border-inverse`, dark in Dark); Tab, →, Page Up, End, Home, clicking the track and dragging all work; the focus ring shows around the handle. a11y: no violations in Light or Dark.

### 9.19 FinLabel (Label)

**Figma:** page **Text box**, component set `Label` `28:968`: `Size` = Medium / Small, `Show badge` (default off), `Label` (text, default "Label text"). Text `text-tertiary`, Label/Medium (14/21) or Label/Small (12/18); with `Show badge`, a `Badge - indicator` (Small, Digits=None, Red) **before** the text, 8px gap (`Space-M`), centred. Used 61 times (Text Box, Table header cell, List, Accordion, Snackbar, Quick action), so it's mostly a caption or small heading, not only a form label.

**Figma → code names:** `Show badge` → `badge`; `Label` → `children`. Code-only: `badgeLabel`, `htmlFor`.

**Variants:**

| Figma | Prop |
|---|---|
| `Size` = Medium / Small | `size: 'medium' \| 'small'` (default `'medium'`) |
| `Label` | `children`: one line; "…" when the container is narrower (decided 15 Oct 2026, as Badge) |
| `Show badge` | `badge` (boolean) |
| — | `badgeLabel`: **required when `badge` is on** (enforced by the types; decided 15 Oct 2026). The dot's meaning depends on the screen (required, new, unread, error…), so there's no default |
| — | `htmlFor`: renders a real `<label>` linked to that field; without it, a `<span>` (decided 15 Oct 2026) |

**Structure:** `<span>` (or `<label htmlFor>`) with the `FinBadgeIndicator` dot (decorative), the text, and the `badgeLabel` visually hidden **after** the text, so it's read "Email address, Required" rather than "Required Email address".

**Tokens used:** text `--fin-text-tertiary`, `--fin-font-label-medium` / `--fin-font-label-small`; gap `--fin-space-m`; the dot is FinBadgeIndicator `size="small" tone="error"` (`--fin-size-6`, `--fin-fg-error`). Figma's other-library bindings are only inside the badge instance (FinBadgeIndicator handles them). The only raw values are the visually hidden text's 1px box.

**API:**

```tsx
import { FinLabel } from '@finspace-loyalty/ui';

<FinLabel htmlFor="email" badge badgeLabel="Required">Email address</FinLabel>
<FinLabel size="small" badge badgeLabel="Unread">Notifications</FinLabel>
<FinLabel>Last transaction</FinLabel>
```

Presentational: no `'use client'`. `className` and other attributes go to the root.

**Accessibility:** with `htmlFor`, the field's accessible name is the label text plus `badgeLabel`, and clicking the label focuses the field. The dot is never the only signal: `badgeLabel` gives its meaning in words. Contrast: text 9.28:1 Light / 5.94:1 Dark on `bg-primary` (8.51 / 4.92 on `bg-secondary`); dot 5.98 / 7.51.

**Built (15 Oct 2026).** Storybook (Components/Text box): Playground, Sizes (Figma), Usage (form label, caption with badge, narrow caption). Checked against Figma: heights 21 / 18, Label/Medium and Label/Small in `#474748` (Dark uses the Dark tokens), dot 6 × 6 `fg-error`, 8px before the text and centred; widths 66 / 57 against Figma's 67 / 58 (text rounding). The field's name reads "Email address, Required"; clicking the label focuses the field; long captions end in "…". a11y: no violations in Light or Dark.

### 9.20 FinHelperText (Helper text content)

**Figma:** page **Text box**, component set `Helper text content` `28:973`: `State` = Default / Success / Warning / Error / Disabled, `Show Leading Icon` (default on), `Text`. A 20px icon (Icon sizes `20px`), 8px gap (`Space-M`), Body/Small text; fills its container. Icons updated by design 15 Oct 2026 (were placeholders). Used 78 times, in Input field-base, Input field-textArea-base and OTP. The Success variant's icon isn't linked to `Show Leading Icon` (§10 #36).

**Figma → code names:** `State` → `tone`; `Show Leading Icon` → `showIcon` (pattern would give `leadingIcon`, §10 #37); `Text` → `children`. Code-only: `icon`, `announce`.

**Variants:**

| Figma | Prop |
|---|---|
| `State` | `tone: 'default' \| 'success' \| 'warning' \| 'error' \| 'disabled'` (default `'default'`; only changes colors and the icon, so `tone`, §7.3; decided 15 Oct 2026) |
| `Show Leading Icon` | `showIcon` (default `true`; works in every tone, Success included) |
| `Text` | `children`: **wraps** onto more lines when long (decided 15 Oct 2026; messages aren't cut off) |
| — | `icon` (optional, replaces the tone's icon), `announce` (see Accessibility), `id` (for the field's `aria-describedby`) |

**Tokens used:**

| `tone` | Icon (FinIcon 20, Figma glyph) | Text |
|---|---|---|
| `default` | `info`, `fg-secondary` | `--fin-text-secondary` |
| `success` | `check_circle`, `fg-success` | `--fin-text-success` |
| `warning` | `warning`, `fg-warning` | `--fin-text-warning` |
| `error` | `warning`, `fg-error` (same glyph as warning, as in Figma) | `--fin-text-error` |
| `disabled` | `info`, `fg-disabled` | `--fin-text-disabled` |

Layout: flex, gap `--fin-space-m`, items at the top; text `--fin-font-body-small`. With the icon, the text has a 1px top offset (`calc(var(--fin-space-xxs) / 2)`), so its 18px line is centred on the 20px icon as in Figma, and a wrapped message keeps the icon beside its first line. Figma's text-layer radius (another library, `Spacing, Radius & Widths`) has no effect and is dropped.

**API:**

```tsx
import { FinHelperText } from '@finspace-loyalty/ui';

<input id="card" aria-invalid="true" aria-describedby="card-help" />
<FinHelperText id="card-help" tone="error">Enter all 16 digits.</FinHelperText>
<FinHelperText tone="error" announce>Payment failed. Try again.</FinHelperText>   // read as soon as it appears
```

Presentational: no `'use client'`. `className` and other `<div>` attributes go to the root.

**Accessibility:** the icon is decorative; the message carries the meaning. **Announcing (decided 15 Oct 2026):** by default the field links to the message (`aria-describedby`), so it's read when the person reaches the field and a form doesn't announce every error at once; `announce` adds `role="alert"` for a message that must interrupt. Contrast: text ≥ 4.60:1 in every enabled tone (Light, on `bg-primary` and `bg-secondary`; Dark ≥ 7.25). Icons ≥ 3:1, except the warning icon on `bg-secondary` in Light (2.98, already in §10 #3). **`disabled`** (2.0:1 Light, 2.5:1 Dark): the message of a disabled field, exempt like the Badge's disabled tone; the Storybook a11y check leaves out only `[data-tone="disabled"]` (verified: without it, only disabled text fails).

**Built (15 Oct 2026).** Storybook (Components/Text box): Playground, States (Figma) with and without the icon, With a field (long wrapping error, `aria-describedby`). Checked against Figma: 20 tall with the icon (18 without), icon 20 in the tone's color, 8px gap, Body/Small 12/18; Light colors equal Figma (Dark uses the Dark tokens); a long message wraps to two lines with the icon beside the first. a11y: no violations in Light or Dark apart from the documented `disabled` exception.

### 9.21 FinTextBox (Text Box)

**Figma:** page **Text box**, component set `Text Box` `28:1001`: `Type` = Display Large-H1 / Display Medium-H2 / Display Small-H3 / Headline Large-H4 / Headline Medium-H5 / Headline Small-H6 × `Alignment` = Left / Center / Right (18 variants), with `Show Label`, `Show Heading`, `Show Description` (all on by default). Its `Label` instance is **exposed**, so the Label's `Show badge` can be set from the Text Box in Figma. Used 113 times (Dialog box, Side sheet, Snackbar, Empty state, Button dock, Main header, Checkbox, OTP, File uploads, Tooltip, Accordion, List, spinner-with-text, bar-with-text…).

**Figma → code names:** `Alignment` → `align` and `Type` values `Display Large-H1` … `Headline Small-H6` → `h1` … `h6` (both outside the patterns, §10 #37); `Show Label` / `Show Heading` / `Show Description` → `label` / `heading` / `description` (shown when passed); exposed Label `Size` / `Show badge` → `labelSize` / `labelBadge`. Code-only: `headingLevel`, `labelBadgeLabel`.

**Variants:**

| Figma | Prop |
|---|---|
| `Type` | `type: 'h1' … 'h6'` (default `'h1'`): the **look** of the heading and the description |
| `Alignment` | `align: 'left' \| 'center' \| 'right'` (default `'left'`) |
| `Show Label` + text | `label` (string): a `FinLabel`; shown when passed |
| Label's `Size` (exposed) | `labelSize: 'medium' \| 'small'` (default `'medium'`, as in every Figma variant; added 15 Oct 2026 at design's request) |
| Label's `Show badge` (exposed) | `labelBadge`, with a required `labelBadgeLabel` (screen-reader text), passed to FinLabel (decided 15 Oct 2026: follow Figma's exposed control) |
| `Show Heading` + text | `heading`; shown when passed |
| `Show Description` + text | `description`; shown when passed (a `<p>`) |
| — | `headingLevel` (1–6): the heading **element** for the page's structure; defaults to the number in `type`; changes the structure only, never the look (decided 15 Oct 2026) |

**Tokens used:**

| `type` | Heading | Description | Heading → description gap |
|---|---|---|---|
| `h1` | `--fin-font-display-large-h1` | `--fin-font-body-large` | `--fin-space-m` |
| `h2` | `--fin-font-display-medium-h2` | `--fin-font-body-large` | `--fin-space-m` |
| `h3` | `--fin-font-display-small-h3` | `--fin-font-body-medium` | `--fin-space-m` |
| `h4` | `--fin-font-headline-large-h4` | `--fin-font-body-medium` | `--fin-space-m` |
| `h5` | `--fin-font-headline-medium-h5` | `--fin-font-body-medium` | `--fin-space-xs` |
| `h6` | `--fin-font-headline-small-h6` | `--fin-font-body-medium` | `--fin-space-xs` |

Heading `--fin-text-primary`, description `--fin-text-secondary`; label → content gap `--fin-space-none` (**no gap, exactly as Figma**, decided 15 Oct 2026). Fills its container; both texts wrap. Alignment moves the label row and aligns both texts. All Figma bindings are Foundation – Loyalty; no raw values.

**API:**

```tsx
import { FinTextBox } from '@finspace-loyalty/ui';

<FinTextBox type="h3" headingLevel={2} label="Step 2 of 3" heading="Confirm the reward" description="Check the details before you send it." />
<FinTextBox type="h5" align="center" heading="No members yet" />
<FinTextBox type="h6" label="Filters" labelSize="small" heading="Tier" />
```

Presentational: no `'use client'`. `className` and other `<div>` attributes go to the root.

**Accessibility:** a real heading (`<h1>`–`<h6>` from `headingLevel`), so screen readers can navigate by headings; set `headingLevel` to fit the page's order. The label's badge meaning is read after the label (FinLabel). Contrast: heading `text-primary`, description `text-secondary` (5.82:1 Light / 8.76:1 Dark on `bg-primary`).

**Built (15 Oct 2026).** Storybook (Components/Text box): Playground (type, alignment, each part, the label's badge), Types and alignments (Figma) at 342px, Parts on and off, Heading level. Checked against Figma at 342px: total heights 399 / 290 / 192 / 181 / 165 / 133 (within Figma's line-height rounding), label 21, the same number of heading and description lines, gaps 0 / 8 (H1–H4) and 0 / 4 (H5–H6), Figma's text styles and Light colors (Dark uses the Dark tokens), `<h1>`–`<h6>` by default; Center and Right align the label and both texts. a11y: no violations in Light or Dark.

### 9.22 FinBarWithText (bar-with-text)

**Figma:** page **Progress**, component set `bar-with-text` `31:2122` (was `Progress-full`, before that `Progress-progress bar`): `Progress` = 25 / 50 / 75 / 100% × `Description` = True / False (8 variants). A Progress bar (Large, 311 inset 32 in a 375 frame) above a Text Box (Center, Display Small-H3, label off, heading on, description per `Description`), gap 16 (`Space-XL`). No exposed nested instances; no instances. Mapped from the public FinProgressBar and FinTextBox.

**Figma → code:**

| Figma property | Prop | Notes |
|---|---|---|
| `Progress` = 25 / 50 / 75 / 100% | `value` (any number from 0 to `max`) | Outside the §7.3 patterns (decided 15 Oct 2026, option (b)); listed in §10 #37 |
| `Description` = True / False | `description` (text; shown when passed) | As Text Box's `Show Description` |
| Heading text (instance text) | `heading` (required) | Also the bar's accessible name |
| — | `max` (default 100), `headingLevel` (default 3) | Code-only: behaviour and structure, no change to the look |

**Width (decided 15 Oct 2026):** spans the **middle 6 of the 12 grid columns** of its container, from the grid tokens: `calc((100% − 11 × gutter) / 12 × 6 + 5 × gutter)`, centred. In a 1240-wide content area that's **608**; on a full 1440 page (1392 content) 684. The bar fills that width (Figma's 32px inset comes from the mobile frame).

**Tokens used:** gap `--fin-space-xl`, items centred; `--fin-grid-columns`, `--fin-grid-gutter` for the width. The bar and the Text Box keep their own styles (FinProgressBar `size="large"`, FinTextBox `type="h3" align="center"`). No raw values except the column counts (6 of 12, 5 gutters).

**API:**

```tsx
import { FinBarWithText } from '@finspace-loyalty/ui';

<FinBarWithText value={uploaded} max={total} heading="Uploading members" description="You can keep working." />
```

Presentational: no `'use client'`. `className` and other `<div>` attributes go to the root.

**Accessibility:** the bar is a progressbar named by `heading` (with its value); the heading is a real `<h3>` (or `headingLevel`). Contrast as FinProgressBar and FinTextBox.

**Built (15 Oct 2026).** Storybook (Components/Progress): Playground, Variants (Figma) with 25 / 50 / 75 / 100% and the description on and off, in a page-like content area (the window minus the 24px grid margins). Measured at window widths 1024 / 1288 / 1440 / 1920: 476 / **608** / 684 / 924 wide, equal gaps on both sides (centred). a11y: no violations in Light or Dark.

### 9.23 FinSpinnerWithText (spinner-with-text)

**Figma:** page **Progress**, component set `spinner-with-text` `33:2348` (was `Progress-Spinner`): `Progress` = 25% / 50% / 75% / Complete / Error × `Description` = True / False (10 variants). A Spinner (48, centred) above a Text Box (Center, Display Small-H3, label off, heading on, description per `Description`), gap 16 (`Space-XL`); 375 frame. Its zero padding is bound to another library (`Alias Spacing & Radius`, `Space-none`). No exposed nested instances; no instances. Mapped from the public FinSpinner and FinTextBox.

**Figma → code:**

| Figma property | Prop | Notes |
|---|---|---|
| `Progress` = 25 / 50 / 75% | `status="progress"` (default) with `value` (any number from 0 to `max`) | Outside the §7.3 patterns (decided 15 Oct 2026, option (b)); §10 #37 |
| `Progress` = Complete | `status="success"` | As FinSpinner; §10 #37 |
| `Progress` = Error | `status="error"` | |
| `Description` = True / False | `description` (text; shown when passed) | As Text Box's `Show Description` |
| Heading text (instance text) | `heading` (required) | Also the spinner's accessible name |
| — (not in Figma) | `status="progress"` **without** `value`: the spinning loader | **Extra option added at design's request** (15 Oct 2026) |
| — | `max` (default 100), `headingLevel` (default 3) | Code-only: behaviour and structure |

**Width and layout:** as FinBarWithText (§9.22): the middle 6 of 12 grid columns of its container (608 in a 1240 content area), centred column, gap `--fin-space-xl`; the spinner keeps its 48 box. Figma's other-library padding (0) needs nothing in code.

**API:**

```tsx
import { FinSpinnerWithText } from '@finspace-loyalty/ui';

<FinSpinnerWithText heading="Loading members" />                                   // spinning loader
<FinSpinnerWithText value={60} heading="Importing transactions" description="You can keep working." />
<FinSpinnerWithText status="success" heading="Import complete" />
```

Presentational: no `'use client'`. `className` and other `<div>` attributes go to the root.

**Accessibility:** the spinner is a progressbar (or, for Complete / Error, an image) named by `heading`; the heading is a real `<h3>` (or `headingLevel`). The loader stops spinning with reduced motion (FinSpinner).

**Built (15 Oct 2026).** Storybook (Components/Progress): Playground (status, loading or value, description), Variants (Figma) with all 10, Loading. Measured at window widths 1024 / 1288 / 1440 / 1920: 476 / **608** / 684 / 924 wide, centred; spinner 48 centred, gap 16, heading Display Small-H3 centred. a11y: no violations in Light or Dark.

### 9.24 FinCaption (Caption)

**Figma:** page **List**, component set `Caption` `77:10172`: `Size` = Small / Medium / Large × `Thickness` = Heavy / Light (6 variants). One text layer, `text-tertiary`, single line that grows; the text is typed over the layer (not a component property). Zero padding bound to another library (`Alias Spacing & Radius`, `Space-none`). Used twice (List-base/Notification-base, Face scan). Heavy Small/Medium look the same as Label Small/Medium (§9.19); kept as its own component, as in Figma (decided 15 Oct 2026).

**Figma → code:**

| Figma property | Prop | Notes |
|---|---|---|
| `Size` = Small / Medium / Large | `size: 'small' \| 'medium' \| 'large'` (default `'small'`) | Same options |
| `Thickness` = Heavy / Light | `thickness: 'heavy' \| 'light'` (default `'heavy'`) | Same options |
| Text layer (typed over) | `children` | Main content; **wraps** when long (decided 15 Oct 2026) |

**Tokens used:**

| `size` | `heavy` | `light` |
|---|---|---|
| `small` | `--fin-font-label-small` | `--fin-font-body-small` |
| `medium` | `--fin-font-label-medium` | `--fin-font-body-medium` |
| `large` | `--fin-font-label-large` | `--fin-font-body-large` |

Color `--fin-text-tertiary`. No raw values; Figma's other-library zero padding needs nothing in code.

**API:**

```tsx
import { FinCaption } from '@finspace-loyalty/ui';

<FinCaption>Last updated today</FinCaption>
<FinCaption size="medium" thickness="light">Points expire after 12 months.</FinCaption>
```

Presentational: no `'use client'`. A `<span>`; `className` and other attributes go to it.

**Accessibility:** plain text. Contrast `text-tertiary` 9.28:1 Light / 5.94:1 Dark on `bg-primary` (8.51 / 4.92 on `bg-secondary`).

**Built (15 Oct 2026).** Storybook (Components/List): Playground, Sizes and thickness (Figma), Long text. Checked against Figma: heights 18 / 21 / 24, weights 600 (Heavy) and 400 (Light), sizes 12 / 14 / 16, `#474748` (Dark uses the Dark token); widths within 1px (Figma rounds text widths up); long text wraps. a11y: no violations in Light or Dark.

Template:

```
### 9.x <Component> (<Figma page>)

**Figma:** page, component set name and node.
**Figma → code:** every Figma property (including exposed nested ones) → its prop, with the same option values (§7.3 parity rules); code-only props listed separately.
**Tokens used:** colors, spacing, radius, text style, shadow per part and state.
**API:** TSX usage example.
**Accessibility:** element, keyboard behaviour, ARIA.
**Built (date).** Checked against Figma; any decisions or differences.
```

---

## 10. Known issues and open decisions

| # | Item | Where | Status |
|---|---|---|---|
| 1 | **Desktop spacing rules** (page padding, section gap, card padding, gap between buttons…) aren't defined. Until then, spacing is copied from Figma with spacing tokens and off-scale values are reported (§2). | Foundation | ❓ Decide (after the first UIs) |
| 2 | `bg-action-secondary_hovered` and `_pressed` had the same value. Fixed 13 Oct 2026: pressed is now Primary-200 / Primary-700 (hovered stays Primary-100 / Primary-800), and the Secondary button in the component file uses both tokens. | Foundation › Color collection | ✅ Fixed |
| 3 | **Contrast failures** (checked 14 Oct 2026 after the Dark status-color update). **Light:** white text on `bg-success` 3.6:1 and on `bg-warning` 2.7:1 (dark text on `bg-warning` is 6.5:1); `border-strong` and `text-placeholder` about 2.96:1 on white (control borders need 3:1); `text-warning` on `bg-tertiary` 4.28:1; `fg-warning` on `bg-secondary` 2.98:1, `bg-tertiary` 2.77:1 and `bg-warning-secondary` 2.96:1 (icons need 3:1). **Dark, button hover/pressed:** `text-white_both` on `bg-action-primary-hovered` 3.35:1, `-pressed` 2.70:1, `bg-action-destructive-hovered` 3.53:1, `-pressed` 2.34:1 (`fg-white_both` fails on both pressed states). **Decide before `FinButtonBase` is built.** **Both:** `text-white_subtle` fails on `bg-brand`/`bg-action-primary` (3.18:1) and `bg-action-destructive` (4.03:1 Light, 3.04:1 Dark). **Badge indicator** (text is `text-inverse` on `fg-*`, rebound in Figma 14 Oct 2026): Light fails on `fg-warning` 3.24:1 and `fg-success` 3.64:1; Dark fails on `fg-error` 3.97:1 (the other four pass). **Icon container** (`FinIconContainer` `tone="warning"`, Light): `fg-warning` on `bg-warning-secondary` 2.96:1 (icons need 3:1). **`FinBadgeIndicator` built with these failures as documented exceptions (15 Oct 2026, §9.8):** Light Yellow 3.24 and Green 3.64, Dark Red 3.97; the a11y check skips only those badges in that theme. **Page indicator dots** (`fg-placeholder`, Light): 2.96:1 on `bg-primary`, 2.71:1 on `bg-secondary` (non-text needs 3:1; §9.12). **Toggle off track** (`fg-placeholder`, Light; decided 15 Oct 2026: build as Figma): 2.96:1 on `bg-primary`, 2.71:1 on `bg-secondary`, handle on it 2.96:1 (non-text needs 3:1; §9.14). **Radio unselected ring** (`border-strong`; decided 15 Oct 2026: build as Figma): 2.96:1 / 2.71:1 Light, 2.88:1 / 2.39:1 Dark (§9.15). | Foundation › Color collection | ❓ Decide (not blocking) |
| 4 | Dark mode default: follow the OS setting (`prefers-color-scheme`) or only the app setting? | Theming | ❓ Decide |
| 5 | Shadows are effect styles, not variables, so they're the same in Light and Dark. Now three neutral styles (Resting cards, Panel sheets, Sticky); the mobile-era Floating and Back styles were removed (13 Oct 2026). Does dark mode need different shadows? | Foundation › effect styles | ❓ Decide after the first components are built and checked in Dark (not a blocker) |
| 6 | Focus ring: color is `border-focused`, but width and offset aren't tokens. Read them from the `Focused` variants in Figma when building; ask if components differ. **Profile image badge** (no Focused variant in Figma): 2px ring, 2px offset (decided 15 Oct 2026); use this unless a component's Figma says otherwise. **Toggle** (Figma `Focused`): 2px, 1px offset (§9.14). | Foundation / Components | ⏳ Check per component |
| 7 | Outdated Figma descriptions: Title XL/L "To show balance"; `bg-action-secondary` "swipe button"; `Alpha-nav` "bottom navigation"; `Alpha-border` "back icon circle"; `text-secondary` says "description texts" (it's used for body text). Typos: "boarders", "outine", "Desctructive", "cheveron". | Foundation | ⏳ Design to update later |
| 8 | `LineHeight-64px 2` has a stray suffix. The token build handles it. | Foundation › Primitives | 🔧 Fix in Figma |
| 9 | `Alias Typography` mode was named `Mobile`; now `Finspace`. | Foundation | ✅ Fixed (13 Oct 2026) |
| 10 | Primitive naming: `Gray` is near-black; Green/Yellow/Red steps are named `Success-*`/`Warning-*`/`Error-*`; `Blue` isn't used. Code names follow Figma. | Foundation › Primitives | ⏳ Later |
| 11 | Primitive colors and `Alias Colors` are published with all scopes, so they appear in every color picker and components can bind them directly. Recommend no scopes / hidden from publishing. | Foundation | 🔧 Fix in Figma |
| 12 | Brands are modes in `Alias Colors` (§3.0). The mode is now named `Finspace` in `Alias Colors` and `Alias Typography` (13 Oct 2026). The variable paths still contain `Fintech` (`Colors/Fintech/Primary/…`, `Primitives/Colors/Fintech/…`). Before a second brand is added, remove `Fintech` from the paths (`Colors/Primary/…`) so every brand mode shares the same alias names. Code uses the mode name for `data-brand` and ignores the `Fintech` path segment in CSS variable names. | Foundation › Alias Colors | ⏳ Later: design will do this when a new brand is added |
| 13 | **Spacing and radius bound to other libraries** (values are the same as Loyalty's): the Sampath Foundation, and unknown libraries with collections `Alias Spacing & Radius`, `Spacing, Radius & Widths` (`radius-xs`), `Spacing and Radius` (`Spacing 0px`, `Spacing 8px`) and `Tokens` (`Border/Radius 4px`). Affects the ⚠️ components in §8. **In code:** always use this system's tokens, never the other library's names or raw values. Before building, list each such value with the proposed token (for example `radius-xs` / `Radius 4px` → `Radius-XS`, `Spacing 8px` → `Space-M`, `Spacing 0px` → `Space-none`) and **ask the designer first**. If no token has the same value, say so and wait. | Components | ✅ Not a blocker: build with Loyalty tokens after telling the designer. Fixing Figma is optional cleanup. |
| 14 | The Material Symbols Rounded variable font is **5.4 MB** (full font, shipped in S4). **Decided 14 Oct 2026:** the build generates a subset font automatically from the `finIcons` registry (no hand-made font files); adding an icon is a one-line registry change. The subset keeps only the registry's icons, the letters and ligature rules that spell them, and each icon's **filled alternate** (the font swaps 19 of the first 28 icons to a separate `.fill` glyph when `FILL` reaches 1, through `FeatureVariations`; leaving them out breaks filled icons). `FILL` stays variable (0–1); `wght` 300, `opsz` 24 and `GRAD` 0 are fixed (§6.2). Prototype with the 28 §6.4 icons: **6.4 KB** woff2, identical to the full font outlined and filled. `FinIcon` isn't done until the full font is replaced. | Icons | ✅ Decided: part of `FinIcon` |
| 15 | Motion: plan is to adopt Material 3 easing and duration pairs (see §5). | §5 | ⏳ Deferred |
| 16 | **Typography bound to another library** (the scan shows `Body L` in `Input field-textArea-base`, `Button M` in `Notification`, `Caption L` in `Plain Tooltip` coming from a non-Loyalty collection). **Decision (13 Oct 2026):** not a blocker. When building, use the Loyalty text style token with the same name (`--fin-font-body-large`, etc.) and list the mapping for the designer's approval first (§8 legend). | Components | ✅ Decided |
| 17 | **Broken component sets** ("Component set has existing errors"): `Header notification` (`3178:24467`) has two variants named `State=Hovered, Notification=Dot` (the last one is probably meant to be `Hovered, Number`; `Disabled, Number` is also missing). The text area set `Input field-base` (`3097:27497`) has the same name as the real base `49:5734`; rename it (for example `Input field-textArea`). | Header, Input field | 🔧 Fix in Figma |
| 18 | Input bases decided (13 Oct 2026): `Input field-base` (`49:5734`) for single-line fields, `Input field-textArea-base` (`3094:26567`) for text areas, `Input-OTP-base` (`49:5843`) for OTP. | Input field | ✅ Decided |
| 19 | `Accordion-bare-base`, `List-base` and `List-fill-base` use a `20px` component whose main component isn't on any page (deleted or moved). | Accordion, List | 🔧 Fix in Figma |
| 20 | **Clashing name:** `24px` on the Side nav page clashes with the icon size `24px`. (Renamed 13 Oct 2026: `Frame 5` → `sub selection`, Dialog `Frame 3` → `Dialog box`, Header `Frame 1707478998` → `Main header`, `Frame 1707478999` → `Header notification`, Table parts.) | Side nav | 🔧 Fix in Figma |
| 21 | **Typos and inconsistent names:** `Pregress` (Spinner); `SIze`/`Mediu` (Flag sizes); `Contry selecter`; `Distructive` (Input field-textArea-base); `Xsmall` vs `XSmall` (Avatar, Chips-base); `state` lowercase (Input field-select, Multi select); Snackbar has a property with no name; Empty state has both `Icon slot` and `Icon Slot`; Accordion-bare-base has `Trailing accessory` twice; several `Property 1` properties. Code uses the corrected spelling. The `64px` icon state names (`Variant3`, `Errorr`) were fixed in Figma on 14 Oct 2026. | Components | 🔧 Fix in Figma |
| 22 | `Side Menu`: 8 text layers have no text style. | Side nav | 🔧 Fix in Figma |
| 23 | Icon names checked against Material Symbols Rounded (14 Oct 2026): all 29 §6.4 names render, but four are old Material Icons names. **Decided:** code uses the current names: `camera_alt` → `photo_camera`, `payment` → `credit_card`, `perm_identity` → `person`, `warning_amber` → `warning` (same glyph as `warning`, so one registry entry). List in §6.4. Figma icons will be updated by design later; for icons, code is the source of truth (§6.1). | Icons | ✅ Decided (14 Oct 2026) |
| 24 | Overlay `Mobile` variant is out of scope; only `Desktop` is built. | Overlays | ✅ Decided (13 Oct 2026) |
| 25 | **Components from other libraries** used inside components: `Frame 3` and `image` (Side Menu), `Views / Dividers` (Side sheet), `gb-L` (Flag sizes). | Side nav, Side sheet, Icon types | 🔧 Fix in Figma |
| 26 | **Table** page is complete and renamed (13 Oct 2026). Figma has the parts only; designers assemble tables on screens. **Decision:** code also gets a `FinTable` organism (§8 #74) built from those parts. Its API (columns/rows as data, selection, pagination) is written in §9 when built and agreed with design. `Property 1` on Table parts still needs naming (§10 #21). | Table | ✅ Decided |
| 27 | **Dark-mode contrast: `text-error` on `bg-error-secondary`** was 4.19:1. Design updated the Dark status colors (14 Oct 2026): now 8.52:1, and every status text and icon color passes on `bg-primary`, `bg-secondary`, `bg-tertiary` and its own `bg-*_secondary` in Dark. | Foundation › Color collection (Dark) | ✅ Decided (14 Oct 2026) |
| 28 | **Spacing shift (14 Oct 2026) in the component file.** These components use `Space-5XL`…`Space-12XL`, and still show the **old** values because the component file hasn't accepted the Foundation library update yet. After it does, they get smaller: `sub selection` (`3140:11076`) `Space-5XL` 40 → 36; `Pagination group` (`3151:14607`) `Space-6XL` 48 → 40; `Main Selection` (`3140:10997`) `Space-5XL` 40 → 36; `Header notification` (`3178:24467`) `Space-5XL` 40 → 36; `Button dock` (`75:5858`) `Space-5XL` 40 → 36; `Side sheet` (`3120:30707`) `Space-5XL` 40 → 36; `Side Menu` (`3142:11871`) `Space-5XL` 40 → 36. No other component uses those steps. Accept the library update, then confirm each new value or rebind. | Component file | ❓ Decide |
| 29 | **Dark: Icon container Primary and Disabled looked alike** (both `#363636`). Fixed 15 Oct 2026: Dark `bg-icons` is now Tertiary-700 `#464646` (`bg-disabled` stays Tertiary-800 `#363636`). White icon on `#464646` is 9.44:1. | Foundation › Color collection (Dark) | ✅ Fixed |
| 30 | **Avatar XXXLarge was 100 in Figma**, but there's no `Size-100`. Decided 15 Oct 2026: 96 (`Size-96`). Figma updated to 96 × 96 (checked 15 Oct 2026). | Avatar | ✅ Fixed |
| 31 | **Profile image badge has no hover or pressed state** in Figma, and `fg-action` has no hovered/pressed tokens. For now the badge only changes the cursor (decided 15 Oct 2026). Design to add the states. | Profile image | ❓ Design to define |
| 32 | **Online Indicator frames have an unbound white fill** (square, no radius) behind the round dot, so white corners would show on a dark or colored background. Code draws only the round dot. Remove the frame fill. | Online Indicator | 🔧 Fix in Figma |
| 33 | **Online indicator on an avatar isn't in Figma.** Code places it (decided 15 Oct 2026, §9.4 Online): flush with the bottom-right corner, 2px in at 64 and 96, indicator size per avatar size. Design to add it to the Avatar (or an example) in Figma so the two match. | Avatar | ⏳ Design to add in Figma |
| 34 | **Off-canvas Badge leftovers:** `Badge-primary/brand` (`70:10326`, with 3 instances in an off-canvas `Placeholder-text` frame) and `Badge-primary/Gold` (`421:1316`) still reference Badge-base but aren't on any page. Nothing live depends on them. Is `Gold` planned (for example a loyalty tier)? | Badge | ❓ Design to confirm |
| 35 | **Indicator `Type=Selected` is 22 wide in Figma**, but there's no `Size-22`. Decided 15 Oct 2026: 24 (`Size-24`) in code. Update the Figma Indicator (and the Indicator set widths become 44 / 54 / 64). | Indicator | 🔧 Fix in Figma |
| 36 | **Helper text content `State=Success`:** its icon isn't linked to `Show Leading Icon`, so it can't be hidden in Figma (the other four states are linked). Code hides it in every tone. | Text box | 🔧 Fix in Figma |
| 37 | **Built components whose names or options differ from Figma beyond the §7.3 patterns** (found when the parity rule was added, 15 Oct 2026): FinIcon `State` → `color`; FinBadgeIndicator `Style` Red/Yellow/Green → `tone` error/warning/success and `Digits` → `count`; FinAvatarGroup `Count` → from `people`; FinProfileImage `Type` → from `src`; FinIndicatorDot `Type` → `selected`; FinPageIndicator `Number` / `Active` → `count` / `active`; FinToggle / FinRadio `Type` → `checked`; FinProgressBar / FinSlider `Filled` → `value`; FinSpinner `Pregress` → `status` + `value`; FinHelperText `Show Leading Icon` → `showIcon`; FinTextBox `Alignment` → `align` and `Type` values → `h1`…`h6`; FinBarWithText `Progress` → `value`; FinSpinnerWithText `Progress` → `status` + `value`. Visual options not in Figma: FinDivider `orientation`, FinAvatar `online`, FinSpinnerWithText loader. | Components | ⏸ Deferred to the end of the build (decided 15 Oct 2026): keep building with the current names; review all of them together then |

---

## 11. Changelog

> **Where we are (15 Oct 2026)**
> - **Done:** setup S1–S6, `FinIcon` (§9.1), `FinIconContainer` (§9.2), `FinDivider` (§9.3), `FinAvatar` (§9.4), `FinAvatarGroup` (§9.5), `FinProfileImage` (§9.6), `FinOnlineIndicator` (§9.7), `FinBadgeIndicator` (§9.8), `FinBadgeBase` (§9.9) and `FinBadge` (§9.10, with the tones added to FinBadgeBase, which is now internal). `FinIndicatorDot` (§9.11, internal), `FinPageIndicator` (§9.12) `FinOverlay` (§9.13) `FinToggle` (§9.14) `FinRadio` (§9.15) `FinProgressBar` (§9.16) `FinSpinner` (§9.17) `FinSlider` (§9.18) `FinLabel` (§9.19) `FinHelperText` (§9.20) `FinTextBox` (§9.21) `FinBarWithText` (§9.22) `FinSpinnerWithText` (§9.23) and `FinCaption` (§9.24). Everything is merged into `main`.
> - **Next:** wait for the designer to name the next component. Plan first, then wait for the go-ahead.
> - **Follow-up:** the Label and Helper text stories use a plain stand-in `<input>` (story-only); swap it for the real input field when §8 #52 is built.
> - **Deferred to the end:** §10 #37 (names outside the Figma ↔ code patterns, including FinTextBox `align` and `h1`…`h6`).
> - **Open:** §10 #3 (contrast, including Dark button hover/pressed, to decide before `FinButtonBase`, and the badge indicator, built with documented exceptions), §10 #5 (Dark-mode shadows), §10 #31 (Profile image badge hover/pressed, design to define), §10 #32 (Online Indicator white frame fill, fix in Figma), §10 #33 (online indicator placement to add in Figma), §10 #34 (off-canvas Badge leftovers), §10 #35 (Indicator selected width 22 → 24 in Figma) and §10 #36 (Helper text Success icon toggle). Fixed 15 Oct 2026: §10 #29, #30.

| Date | Version | Change |
|---|---|---|
| 12 Oct 2026 | 0.1 | First draft: sources, core rules (desktop layout, theming, portability), all tokens from the 12 Oct export (431 variables), text styles, shadows, grids, breakpoints, icons (Material Symbols Rounded), architecture, setup tasks, known issues. Component inventory pending the component file review. |
| 13 Oct 2026 | 0.2 | Component file reviewed: §8 inventory filled (73 components, 3 assets) with levels and scope confirmed by design, Figma check column, provisional names for placeholder components. §7.2 base → mapped table. §6.3 icon sizes corrected (16/20/24/36/48/64) and §6.4 icons used. §1: Cards now under 🔒 Do not use, Overlay `Mobile` out of scope. §10 #13 replaced, #16–26 added. |
| 13 Oct 2026 | 0.2 | Table page marked complete. Table rows re-checked against Figma: Pagination group and Table footer ⚠️, placeholder-named parts still 🔴. §10 #26 now asks how `FinTable` is assembled. |
| 13 Oct 2026 | 0.2 | Table parts renamed in Figma (`Table header cell`, `Table - Cell`, `Table row`); code names confirmed. Added #74 `FinTable` (code-only organism). |
| 13 Oct 2026 | 0.2 | Rule: values bound to another library or raw values always become this system's tokens in code, and the mapping is approved by design before building (§8 legend, §10 #13). |
| 13 Oct 2026 | 0.2 | §3.0: brands are modes in `Alias Colors`, Light/Dark are modes in `Color collection`; layer table added. §10 #12 updated. |
| 13 Oct 2026 | 0.2 | Foundation re-checked: `Alias Colors` and `Alias Typography` modes renamed to `Finspace` (no more `Mobile`). Brand attribute is `data-brand="finspace"`; `Alias Typography` is also brand-scoped. §10 #9 fixed, #12 updated. |
| 13 Oct 2026 | 0.2 | New token export saved to `tokens/design.tokens.json` (431 variables, matches Figma). §4 re-checked: 23 text styles unchanged; shadows now 3 neutral styles (Floating and Back removed, Sticky now black 8%). §3.9: single-mode names and styles aren't in the export. |
| 13 Oct 2026 | 0.2 | Input field page re-checked: three bases confirmed (Input field-base, Input field-textArea-base, Input-OTP-base). Added #52a `FinTextAreaBase` and #52b `FinTextArea`. §7.2 updated, §10 #18 decided, #16 and #17 updated. |
| 13 Oct 2026 | 0.2 | §10 #16 decided: typography from another library isn't a blocker; mapped to Loyalty text styles with designer approval. #52a now ⚠️. |
| 13 Oct 2026 | 0.2 | §7.2: List and Accordion are bases with no states yet; built ready for states to be added to the base later. |
| 13 Oct 2026 | 0.2 | S1 done: pnpm 12 workspace (`packages/tokens`, `packages/ui`, `apps/storybook` stub), TypeScript 6.0, Vite 8 library build for `ui`, ESLint 9 (typescript-eslint, react-hooks, jsx-a11y), Stylelint 17 base config. TypeScript 7 and ESLint 10 held back until typescript-eslint and jsx-a11y support them. |
| 14 Oct 2026 | 0.2 | S2 done: token build (`packages/tokens/build.ts`, Style Dictionary 5.5.5). 429 variables (431 exported, minus `Size-343` and `Size-375`) in four scoped blocks, 23 `--fin-font-*` text styles, TS maps, and breakpoints as custom media. Resolved values checked against §3.3–3.6 (all match). Decisions: alpha uses `color-mix` only (§3.9); every primitive is `--fin-palette-*` (§3.8); components use the text style shorthand only, and Stylelint in S6 blocks the parts (§3.8); breakpoints moved from S3 to S2 (§8.0). |
| 14 Oct 2026 | 0.2 | Design decisions: font fallback stack `Inter, system-ui, sans-serif`, added in S4 (§3.4, §8.0); `data-brand` on `<html>` only (§3.0). |
| 14 Oct 2026 | 0.2 | S3 done: `packages/tokens/src/styles.css` (exported as `@finspace-loyalty/tokens/styles.css`) with the three §4.2 shadows and the §4.3 grid variables. Background blur removed from the S3 row (there are no blur styles). All three re-checked in Figma on the Foundation Shadow page (`16027:179`); they match. Dialog box and Side sheet have no shadow on purpose (they sit on `FinOverlay`); §4.2 `Shadow/Panel_sheets` Use updated. |
| 14 Oct 2026 | 0.2 | S4 done: fallback stack added by the token build (§3.4). Inter 400–700 (Latin + Latin Extended, `@fontsource/inter` 5.3.0) and Material Symbols Rounded (`material-symbols` 0.47.5, full variable font) self-hosted in `packages/ui/src/styles/fonts.css`; reset with body defaults `Body/Medium`, `--fin-text-secondary`, `--fin-bg-primary`, plus reduced-motion. App stylesheet `@finspace-loyalty/ui/styles.css` built by a separate Vite pass (`vite.styles.config.ts`) because library mode inlines fonts as base64. Icon font settings recorded in §6.2 (weight 300, optical size 24, grade 0, FILL 0/1). Checked in headless Chrome: all fonts load, body text 14/21 `#656566` on white. |
| 14 Oct 2026 | 0.2 | §10 #14 decided: the icon font subset is generated automatically from the `finIcons` registry as part of building `FinIcon`, not later. §6.1 and §6.2 updated. |
| 14 Oct 2026 | 0.2 | S5 done: Storybook 10.6.1 (`@storybook/react-vite`, `addon-docs`), local only; publishing (GitHub Pages or Chromatic) to be decided after the first components. Toolbar: Theme (Light, Dark, Side by side) and Brand, both from new token exports `finBrands`/`finThemes`, set on `<html>` (side by side sets `data-theme` on two panels). Foundations pages are stories (MDX doc pages hide the toolbar): Colors (87 semantic colors), Typography, Spacing, Radius, Shadows, Grid, Breakpoints, and Palette (reference only) with primitives and alias colors per brand from the new `@finspace-loyalty/tokens/reference` entry point, labelled "do not use in components". `postcss-custom-media` 12.0.2 in Storybook and `ui` (the Breakpoints page uses it). Stylelint: camelCase class names. pnpm: esbuild install script denied (`allowBuilds`). Checked in headless Chrome: all 87 semantic colors match §3.3 in Light and Dark. |
| 14 Oct 2026 | 0.2 | S6 done: Vitest 5.0.2 + Testing Library in `packages/ui` (jsdom; example test in `packages/ui/test/`). Storybook `addon-a11y` and `addon-vitest` 10.6.1: `pnpm test:a11y` runs every story in Chrome with WCAG 2.2 AA checks, once in Light and once in Dark (16 runs, all pass). Stylelint moved to `stylelint.config.js`; component CSS rules apply to every `*.module.css` and block raw colors, `color-mix()`, palette/alias variables and typography parts, with messages naming the token to use. `bad.css`/`good.css` samples and a test prove each rule. No exceptions needed: the Palette page sets palette variables from TSX, and Typography uses only the shorthands. §10 #27 added (Dark `text-error` on `bg-error-secondary` contrast). |
| 14 Oct 2026 | 0.2 | Dark status colors and inverse tokens (new export, 432 variables). Dark only: `text-success/error/info/warning` → `*-100`, `fg-success/error/info/warning` → `*-200`. `bg-dark` renamed `bg-direct`, Dark now Tertiary1-50 `#fdfdfd` (Snackbar and Plain Tooltip are light in Dark). `text-inverse` Dark now Secondary-400 `#474748` (text on `bg-direct`). New `text-white_both` (white in both themes, text on purple/red). `text-inverse_subtle` renamed `text-white_subtle`. Code: `--fin-bg-direct`/`finColor.bgDirect`, `--fin-text-white-both`/`textWhiteBoth`, `--fin-text-white-subtle`/`textWhiteSubtle`; token build expects 432. Contrast checked in both themes: §10 #27 decided; failures recorded in §10 #3. Palette page notice back to `text-error`. Badge indicator text rebound to `text-inverse` in Figma (binding only); §10 #3 updated. |
| 14 Oct 2026 | 0.2 | Spacing: new primitive `Size-36`; `Space-5XL`…`Space-11XL` move down one step (5XL = 36, 6XL = 40, 7XL = 48, 8XL = 56, 9XL = 64, 10XL = 80, 11XL = 96); new `Space-12XL` = 120 (`--fin-space-12xl`, `finSpace.x12l`). Token build expects 434. Storybook Foundations pages moved up one step to keep their sizes. No components used the shifted steps. |
| 14 Oct 2026 | 0.2 | Token build: new `size` layer, `--fin-size-<n>` (and `finSize`) for every `Primitives/Sizes` value, pointing at the primitive, for fixed dimensions that must not follow spacing (§3.8). §10 #27 moved out of the §8 table, where it had been inserted by mistake. §10 #28 added (components affected by the spacing shift). |
| 14 Oct 2026 | 0.2 | **`FinIcon` done** (§8 #1, §9.1): registry `finIcons` (28 current Material Symbols names; four old names swapped, §6.4), `color` accepts every `fg-*` token, sizes 16–64 mapped to `--fin-size-*` (not spacing), `filled`, `label`. Icon font subset generated at build time (`packages/ui/scripts/subset-icons.ts`, `harfbuzzjs` 1.6.2 + `wawoff2` 2.0.1): 6.2 KB instead of 5.4 MB, keeps the filled `.fill` glyphs. Stylelint lets the icon font have no generic fallback. §6, §10 #14, #21, #23 updated. |
| 14 Oct 2026 | 0.2 | **`FinIconContainer` done** (§8 #16–18, §9.2): sizes 40/48/64 (`68px bg` changed to `64px bg` in Figma) via `--fin-size-*`, FinIcon inside (24/24/36), `tone` for Figma's color-only `State`, `fg-disabled-on_bg` for Disabled at every size. §7.3: a Figma `State` that only changes colors is `tone` in code. §3.8: widths and heights are unbound in Figma by convention and map to `--fin-size-*`. |
| 14 Oct 2026 | 0.2 | `FinIconContainer`: `filled` added (passes straight to FinIcon). Storybook: icon stories grouped under Components/Icons (§9). §10 #3 notes the Light warning icon container (2.96:1); §10 #29 added (Dark Primary and Disabled containers share `#363636`). |
| 14 Oct 2026 | 0.2 | Circle Icon removed from Figma; FinCircleIcon dropped. |
| 14 Oct 2026 | 0.2 | Status note added at the top of §11: done S1–S6, FinIcon, FinIconContainer; next component to be named by design; open §10 #3, #5, #29. |
| 15 Oct 2026 | 0.2 | §10 #29 fixed: new export, Dark `bg-icons` Tertiary-800 → Tertiary-700 `#464646` (Light unchanged), so the Dark Primary and Disabled icon containers differ. Token build still 432 variables; Storybook a11y checks pass in Light and Dark. §3.3, §9.2 and the status note updated. |
| 15 Oct 2026 | 0.2 | **`FinDivider` done** (§8 #2, §9.3): native `<hr>`, `type` `divider` (1px `border-default` border) / `section-divider` (`--fin-size-8` band), full width; `orientation="vertical"` added at design's request (not in Figma); `decorative` hides it from screen readers. Decisions: 1px is a border width (no `Size-1`), Section Divider full width instead of Figma's 375. |
| 15 Oct 2026 | 0.2 | **`FinAvatar` done** (§8 #29, §9.4): `type` image/icon/text, seven sizes mapped to `--fin-size-*`, `src`, `initials` (passed in), `label`; photo → initials → icon fallback. Decisions: XXXLarge 96 instead of 100 (§10 #30 added), `"case"` font feature dropped, XSmall initials centered. |
| 15 Oct 2026 | 0.2 | **`FinAvatarGroup` done** (§8 #42, §9.5): mapped from FinAvatar; `people`, `size` xsmall/medium/xlarge, `label`. Up to 6 avatars, then a non-interactive "+N" circle. Overlaps −4/−8/−12 mapped to `Space-XS`/`M`/`L`. Storybook photos from the Figma group (Unsplash). |
| 15 Oct 2026 | 0.2 | **`FinProfileImage` done** (§8 #43, §9.6): FinAvatar XXXLarge plus a badge button (camera without a photo, edit with one), only the badge clickable, cursor only for hover/pressed (§10 #31), 2px focus ring with 2px offset. `edit` added to `finIcons` (29 icons, 6.4 KB). §10 #30 fixed in Figma. Storybook: stories now wait for the Inter and icon fonts before rendering, so the a11y check no longer reads an unloaded glyph as text (this caused the intermittent §10 #3 warning failure). |
| 15 Oct 2026 | 0.2 | **`FinOnlineIndicator` done** (§8 #4, §9.7): 5 sizes (Figma updated from 7), `fg-success` dot with a 1px `fg-inverse` ring outside, `label` "Online" by default. **FinAvatar `online`** (§9.4): indicator at the bottom-right corner, 2px in at 64/96 (after checking Atlassian's avatar presence), size mapped per avatar size; status added to the avatar's name. FinAvatar no longer clips; the photo is rounded instead. §10 #32 (white frame fill) and #33 (placement not in Figma) added. |
| 15 Oct 2026 | 0.2 | DESIGN.md review: §9.4 updated for `online` (variants row, circle no longer clipped, photo rounded, API example, accessibility); §9 Storybook grouping includes Online indicator; §8 #29 mentions `online`; §10 #6 records the 2px/2px focus ring; status note lists open §10 #31–#33. |
| 15 Oct 2026 | 0.2 | **`FinBadgeIndicator` done** (§8 #3, §9.8): `count` → dot / circle (1–9) / pill (10+, "99+" over `max`), hidden at 0; `tone` error/warning/success; `size` small/large; `label`. Small Single 16 (Figma updated from 14). Figma heights kept. Known contrast failures (Light Yellow, Light Green, Dark Red) built as Figma and excluded from the a11y check only for those badges and themes (§10 #3). |
| 15 Oct 2026 | 0.2 | `Tag-base` renamed `Badge-base` in Figma (`30:1454`); code name `FinTagBase` → `FinBadgeBase`. §7.2 and §8 #20, #35, #51 updated. |
| 15 Oct 2026 | 0.2 | **`FinBadgeBase` done** (§8 #20, §9.9): `size` small/large, label as `children` (one line, "…" in narrow containers), `leadingIcon`/`trailingIcon` (none by default, decorative, inherit the label color). Figma base colors only; the Badge-primary tones go into this base's CSS when FinBadge is built. |
| 15 Oct 2026 | 0.2 | **`FinBadge` done** (§8 #35, §9.10): mapped from FinBadgeBase (always Small, passes `tone`, label and optional leading/trailing icons; no CSS of its own). FinBadgeBase gets `tone` and the 8 tone styles (fill, text, 1px inside border as an inset shadow), §9.9 updated. Figma: `brand` state removed and the Error variant's outer stroke fixed by design; `brand` dropped from §10 #21. `disabled` tone kept as designed, a documented a11y exception. |
| 15 Oct 2026 | 0.2 | §7.2 rule 4: **bases are internal unless DESIGN.md says otherwise**. FinBadgeBase no longer exported from `@finspace-loyalty/ui`; its stories moved to **Internal/Badge base** (Playground removed); FinBadge is the public badge. Tone list defined once (`FIN_BADGE_TONES`, `FinBadgeTone`), re-exported by FinBadge. New `test/public-api.test.ts`. Figma check: only Badge-primary uses Badge-base; Table cell uses Badge-primary (§8 #51 corrected). |
| 15 Oct 2026 | 0.2 | **`FinIndicatorDot` (internal) and `FinPageIndicator` done** (§8 #5, #41, §9.11, §9.12): `count` (no maximum), `active`; clickable with `onChange` as a radio group (one tab stop, arrows/Home/End), Figma spacing kept with the WCAG 2.5.8 equivalent-control exception documented. Selected pill 24 (Figma 22, §10 #35); raw radius 8 → `Radius-Full`. Light dot contrast added to §10 #3. Badge tone list moved to its own file (`badgeTones.ts`). §10 #34 added. |
| 15 Oct 2026 | 0.2 | **`FinOverlay` done** (§8 #7, §9.13): Desktop only, responsive (`position: fixed; inset: 0`, fills the window at any size), `--fin-alpha-md` as in Figma, decorative, optional `onClick`; no z-index. §3.3: `Alpha-md` is the scrim (was wrongly `Alpha-both`). Rule for Dialog box and Side sheet (§8 #67, #68): stacking added when built; the page behind doesn't scroll while they're open. |
| 15 Oct 2026 | 0.2 | `Switch` renamed `Toggle` in Figma (`34:2545`); code name `FinSwitch` → `FinToggle` (§8 #8). |
| 15 Oct 2026 | 0.2 | **`FinToggle` done** (§8 #8, §9.14): native checkbox with `role="switch"`, `checked`/`defaultChecked`/`onChange`/`disabled`, `size` small/large, required visually hidden `label`. Figma updated by design (Large 56, handle `fg-white_both`, off track `fg-placeholder`, disabled on-track `bg-disabled`). Off-track Light contrast logged in §10 #3; Toggle focus ring 2px/1px noted in §10 #6. |
| 15 Oct 2026 | 0.2 | **`FinRadio` done** (§8 #9, §9.15): native radio, public despite the Figma "Base" name (§7.2 exception), visually hidden `label`, Hovered/Pressed via `:hover`/`:active` (Figma updated: Hovered `bg-active`, Pressed `bg-active-hover`), default focus ring 2px/2px. Unselected-ring contrast logged in §10 #3. Figma's stray "Frame 2" mock removed by design. |
| 15 Oct 2026 | 0.2 | Progress page re-checked: `Progress bar-portfolio` removed from Figma (§8 #11 marked removed; `Fillted` dropped from §10 #21); `Progress-progress bar` renamed `Progress-full` (§8 #44, code name `FinProgress` → `FinProgressFull`, §7.2 updated); Progress bar's exact Filled values recorded (§8 #10). dragger, Spinner and Progress-Spinner unchanged. |
| 15 Oct 2026 | 0.2 | **`FinProgressBar` done** (§8 #10, §9.16): public base (§7.2 exception), `value` (any, clamped) with `max` (default 100), `size` large/small, required `label`; fills its container; `role="progressbar"`. Fill radius from the `Tokens` library mapped to `Radius-XS`. |
| 15 Oct 2026 | 0.2 | **`FinSpinner` done** (§8 #13, §9.17): public base; `value` → still ring (clockwise from 12 o'clock, exact), no value → spinning loader (1s linear, still with reduced motion; first animation, §5 exception), `status` success/error with FinIcon; Figma sizes kept. Progress-Spinner (§8 #45) waits for Text Box. |
| 15 Oct 2026 | 0.2 | `dragger` renamed `slider` in Figma; code name `FinDragger` → `FinSlider` (§8 #12). **`FinSlider` done** (§9.18): native range input restyled, `min`/`max`/`step` (0–100 by default, set by the screen), standard slider geometry, fills its container, visually hidden `label`, disabled with the disabled tokens. |
| 15 Oct 2026 | 0.2 | **`FinLabel` done** (§8 #21, §9.19): `size` medium/small, one line with "…", `badge` (FinBadgeIndicator dot before the text) with a required `badgeLabel` (meaning varies by screen, so no default; read after the text), `htmlFor` → real `<label>`. |
| 15 Oct 2026 | 0.2 | **`FinHelperText` done** (§8 #22, §9.20): `tone` (Figma `State`), Figma icons per tone (`info`, `check_circle`, `warning`, `warning`, `info`), `showIcon`, wrapping text, `announce` (`role="alert"`, off by default; `aria-describedby` is the default link). `disabled` tone a documented a11y exception. §10 #36 added (Success icon not linked to Show Leading Icon). |
| 15 Oct 2026 | 0.2 | **`FinTextBox` done** (§8 #36, §9.21): `type` h1–h6 (look), `align`, `label` (FinLabel Medium) / `heading` / `description` shown when passed, `headingLevel` (structure only, defaults to `type`), label badge exposed as in Figma (`labelBadge` + required `labelBadgeLabel`). No gap under the label, as Figma. Progress-Spinner (§8 #45) and Progress-full (§8 #44) are now unblocked. |
| 15 Oct 2026 | 0.2 | `FinTextBox`: `labelSize` (medium/small, default medium) added, following Figma's exposed Label (§9.21). |
| 15 Oct 2026 | 0.2 | §7.3 **Figma ↔ code parity rules** added (every Figma control, including exposed nested ones, has a matching prop; names differ only by the listed patterns; option values keep Figma's names in lower case; code-only props only for behaviour/accessibility; anything else flagged first). One-line "Figma → code names" notes added to §9.1–9.21; §9 template now asks for a full Figma → code table. Differences outside the patterns listed in §10 #37 for a decision. |
| 15 Oct 2026 | 0.2 | §10 #37 deferred to the end of the build at design's request. |
| 15 Oct 2026 | 0.2 | Figma renames: `Progress-full` → `bar-with-text` (§8 #44, code name `FinBarWithText`), `Progress-Spinner` → `spinner-with-text` (§8 #45, `FinSpinnerWithText`); §7.2, §9.16, §9.17, §9.21 updated. |
| 15 Oct 2026 | 0.2 | **`FinBarWithText` done** (§8 #44, §9.22): FinProgressBar (large) + FinTextBox (H3, centre); `value` (any, §10 #37), `heading`, `description`, `headingLevel`; spans the middle 6 of 12 grid columns of its container (608 in a 1240 content area). First spec with a full Figma → code table. |
| 15 Oct 2026 | 0.2 | **`FinSpinnerWithText` done** (§8 #45, §9.23): FinSpinner + FinTextBox (H3, centre); `status` / `value` (§10 #37), loader added at design's request, `heading`, `description`, `headingLevel`; spans the middle 6 grid columns. |
| 15 Oct 2026 | 0.2 | Bar with text / Spinner with text stories: the demo content area is now the full window minus the grid margins (it was a fixed 1240 box on the left), so the components show centred and responsive in Storybook. |
| 15 Oct 2026 | 0.2 | **`FinCaption` done** (§8 #6, §9.24): `size` small/medium/large, `thickness` heavy (Label styles) / light (Body styles), `text-tertiary`, wraps. Storybook under Components/List. Figma → code: same names and options, nothing flagged. |
