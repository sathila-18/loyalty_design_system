# Figma sync: code → Figma

Progress of bringing the Figma component library (**Component library – Loyalty**, `vD9CL5tZQo4D26fUN3vKHT`) up to date
with what was built or changed in code. The designer picks each item and the Figma page; Claude Code builds it in Figma
from the code and records it here.

**Rules (decided by design 13 Nov 2026):**

- **All sync progress is recorded here only.** `DESIGN.md` is the reference (specs, tokens, decisions) and is never
  written to for this work.
- One item at a time, on the page the designer names. Built from the code and `DESIGN.md` §9, with Foundation – Loyalty
  variables and the file's text styles only (no raw values), laid out like the existing component pages (white header
  with the 60 top radius, Heading 2/Semibold title, Text xl/Medium subtitle; a section with the set in its dashed
  Primary-400 border). Behaviour Figma can't show (animation, keyboard) goes in the component's description.

## Comparison (13 Nov 2026)

Figma checked read-only against the code, the Storybook stories and `DESIGN.md`. **Figma hadn't changed since the
components were built**: all 74 component sets and components recorded in `DESIGN.md` §8 are there with the same node
IDs, and there are no new ones. Every difference comes from work done in code.

| | Count |
|---|---|
| 🆕 New: in code, not in Figma | 14 |
| ✏️ Changed: in both, code differs visually | 24 (C23, C24 added 16 Nov 2026) |
| ✅ Unchanged | 38 |
| ⬜ In Figma only, not built in code | 4 |

### 🆕 New: in code only

| # | Code | What it is | Figma before | `DESIGN.md` ref | Status |
|---|---|---|---|---|---|
| N1 | `FinCalendar` | Month grid, Monday first; single or range; day looks: default, outside, chosen, in range, today, disabled | — | §9.86, §10 #120 | ✅ 13 Nov 2026 |
| N2 | `FinDatePicker`, `FinDateRangePicker` | Select-look field that opens the calendar; range shows two months | — | §9.87, §10 #120 | ➖ compose from parts (decided 16 Nov 2026) |
| N3 | `FinDateField` | Text field with DD/MM/YYYY mask and a calendar button | screens draw a text field with `calendar_today` | §9.79 | ✅ 16 Nov 2026 |
| N4 | `FinStepper` | Steps of a multi-step form: done, current, upcoming | drawn on each Add reward screen | §9.77 | ✅ 13 Nov 2026 |
| N5 | `FinStatCard` | Summary number on `bg-active` | drawn on each Reports screen | §9.81 | ✅ 13 Nov 2026 |
| N6 | `FinSkeleton` | Loading placeholder: text, rect, circle | — | §9.76 | ✅ 13 Nov 2026 |
| N7 | `FinSignInLayout` | Login layout: artwork panel and form | drawn on each Login screen | §9.84, §10 #116 | ➖ not needed in Figma (decided 16 Nov 2026) |
| N8 | `FinAppShell` | Page shell: side nav, header, content | drawn on each screen | §9.68, §10 #63 | ➖ not needed in Figma (decided 16 Nov 2026) |
| N9 | `FinListCheckbox` | Checkbox list row, as List-radio_button | — | §9.54, §10 #55 | ✅ 16 Nov 2026 |
| N10 | Filled list rows (×4) | Filled versions of List-standard, radio, checkbox, toggle | only `List_fill-base` | §9.56, §10 #56 | ✅ 16 Nov 2026 |
| N11 | Table column sort / filter | Header sort arrows and filter menu | hidden 24px icon in the header cell | §9.41, §9.65, §10 #50 | ✅ 16 Nov 2026 |
| N12 | Table row actions (⋮) | 64-wide ⋮ column with its menu | hidden "Action Slot" in cells | §9.66, §10 #60 | ✅ 16 Nov 2026 (sideways shadow to add with Shadow/Menu) |
| N13 | Side nav account menu | User row as a menu trigger; 320-wide menu with a Theme row | — | §9.57, §10 #62 | ✅ 16 Nov 2026 (Light / Dark icons temporary) |
| N14 | `FinTable` (assembled) | Whole table with footer and pagination | parts only, by decision (§10 #26) | §9.45 | ✅ 16 Nov 2026 |

### ✏️ Changed: in Figma, but code differs visually

Behaviour-only and accessibility props are left out (Figma can't show them).

| # | Figma component (node) | Code differs by | `DESIGN.md` ref | Status |
|---|---|---|---|---|
| C1 | `all-button` (`47:1580`) | Link variant; `iconTone` secondary; `contentTone` colours | §9.28, §10 #118 | ✅ 16 Nov 2026 |
| C2 | `Input field-base` (`49:5734`) | Small (40) size; mask | §9.58 | ✅ 16 Nov 2026 |
| C3 | `Input field-standard` (`52:2629`) | Small size | §9.59 | ✅ 16 Nov 2026 |
| C4 | `Input field-password` (`60:7165`) | Small size | §9.60 | ✅ 16 Nov 2026 |
| C5 | `Search` (`440:5164`) | Small size | §9.61 | ✅ 16 Nov 2026 |
| C6 | `Input field-select` (`537:2736`) | Small size; Disabled and Error | §9.72, §10 #58 | ✅ 16 Nov 2026 |
| C7 | `Input field-Multi select` (`922:6170`) | Small; Disabled and Error; no Typing look; Input chip XSmall chips | §9.85, §10 #119 | ✅ 16 Nov 2026 (Typing kept; "+N" and open menu later) |
| C8 | `Chips` (`95:1848`) | Three chip types (Assist / Filter / Input); Input chip Unselected-border | §9.32, §10 #46 | ✅ 16 Nov 2026 (before C7) |
| C9 | `Checkbox` (`42:220`) | Checkbox on the left only; Selected + Disabled | §10 #44 | ✅ 16 Nov 2026 |
| C10 | `Segmented_button-base` / `Segmented button` (`117:4667` / `117:4688`) | Small (32) and XSmall sizes, icon only, tooltips | §9.33, §9.34 | ✅ 16 Nov 2026 (for N13) |
| C11 | `Header notification` (`3178:24467`) | 40 everywhere, 20 bell (Figma 48) | §9.62 | ✅ 16 Nov 2026 |
| C12 | `Main header` (`3178:24570`) | Headline Small-H6 title; XSmall (32) back button (Figma H4, 48) | §9.63 | ✅ 16 Nov 2026 |
| C13 | `Button dock` (`75:5858`) | Small buttons; buttons hug labels, Secondary + Primary at the right | §9.69 | ✅ 16 Nov 2026 |
| C14 | `Side Menu` (`3142:11871`) | Tree style; logo text "Fintech loyalty" | §9.57, §10 #76, #111 | ⬜ |
| C15 | `Main Selection` / `sub selection` (`3140:10997` / `3140:11076`) | Tree lines; chevron colours on tokens | §9.47, §10 #52, #76 | ⬜ |
| C16 | `standard-menu` (`3549:12004`) | Shadow/Menu effect style; header and footer slots; slot `conten` → content | §9.64, §10 #59 | ✅ 16 Nov 2026 (shadow kept Sticky for now) |
| C17 | `Table header cell` (`3151:14941`) | Sort / filter icons; narrow checkbox and ⋮ cells (56, Figma 72) | §9.41, §10 #50 | ✅ 16 Nov 2026 (with N11) |
| C18 | `Table - Cell` / `Table row` / `Header row` | Narrow checkbox cell; Link cell padding | §9.43, §10 #61 | ✅ 16 Nov 2026 (with N12) |
| C19 | Table (assembled) | Bordered style | §9.45, §10 #77 | ✅ 16 Nov 2026 (with N14) |
| C20 | `List-standard` (`3491:5292`) | Destructive tone | §9.51 | ⬜ |
| C21 | `Avatar` (`932:1387`) | Online indicator placed on the avatar | §9.4, §10 #33 | ⬜ |
| C22 | `File uploads` (`775:4280`) | XSmall (36) button; Large 218 tall | §9.80 | ⬜ |
| C23 | `List-base` (`77:10185`) and every list built on it | **Compact density** (v0.8.0): a `Density` property, Default / Compact; Compact is 8 (`Space-M`) on every side and between the content and the divider (Default 16). Exposed on List-standard, List-radio_button, List-checkbox, List-toggle and the four `List_fill-*` sets (filled cards 8 all round). Then use it in the **Row actions menu** (`3849:786`, N12) and the **Rows per page** menu, which are compact in code | §9.49–9.56, §9.38, §9.66, §10 #121 | ✅ 16 Nov 2026 |
| C24 | `Table - Cell` (`3151:14990`) | **`Type=Checkbox`** (v0.8.0): the cell is only a checkbox (Base-Checkbox Selected / Unselected / Disabled), lined up with the header text (24 padding, 40 tall), for values per row such as permissions (the Create user role screen). Not applicable = an ordinary Disabled unticked box (not the screen's Disabled + Indeterminate dash) | §9.43, §9.45, §10 #122 | ✅ 16 Nov 2026 |

Smaller, optional: `Indicator` (`98:3532`) Selected 24 wide (Figma 22, §10 #35); `Side sheet` (`3120:30707`) with a
two-line title (§10 #69).

### ✅ Unchanged

Divider · Badge - indicator, Badge-base, Badge-primary · Online Indicator, Avatar Group, Profile image · Caption,
List-base, List_fill-base, List-radio_button, List-toggle · Overlay · Toggle · Base-Radio_box · Progress bar,
bar-with-text, Spinner, spinner-with-text, slider · Pagination item, Row count dropdown, Pagination group, Table footer,
Table Header (toolbar) · Icon sizes (16, 20, 24, 36, 48, 64; 40 / 48 / 64 bg) · Label, Helper text content, Text Box ·
Base-button, white-button, Destructive-button · Base-Checkbox · Chips-base · Notification · Snackbar · Dialog box ·
Empty state · Contry selecter · text-area base and field set · Plain Tooltip · side nav Icon · Flag sizes, Payment Icons.

Some of these still have Figma-side fixes logged in `DESIGN.md` §10 (#17, #21, #38, #40–42, #45): corrections to Figma
itself, not code changes, so they're not part of this sync.

### ⬜ In Figma only, not built in code

`Accordion-frame-base`, `Accordion-bare-base`, `Input-OTP-base`, `Chips-group`. Nothing to sync.

### Figma housekeeping noticed (13 Nov 2026)

- The text-area field set (`3097:27497`) is now named "Input field-textArea" (part of `DESIGN.md` §10 #17 done in Figma).
- The off-canvas `Badge-primary/brand` (`70:10326`) is gone (`DESIGN.md` §10 #34).
- Loose design-note text layers on the Side nav (`3653:9300`), Input field (`3783:3280`) and Menu (`3553:25049`) pages.

## Done

### N1 · Calendar: 13 Nov 2026

- **Page:** Calender `3818:4065` (Figma's page name). Page frame `3820:4` (header `3820:5`, section `3820:9`).
- **`Calendar day`** component set `3820:76`: **Type** × **State** (22 variants), 40 × 40 (Size-40); text property
  **Day** (the number, Body/Medium). The component is the cell (a range's `bg-active` band, rounded Radius-S on the
  range's own side at its start and end); inside it the **Day** frame (Radius-S) carries the state's fill:

  | Type | Enabled | Hovered | Pressed | Text |
  |---|---|---|---|---|
  | Default | — | `bg-secondary` | `bg-tertiary` | `text-primary` |
  | Today | — + 1px `border-strong` inside | `bg-secondary` | `bg-tertiary` | `text-primary` |
  | Outside | — | `bg-secondary` | `bg-tertiary` | `text-tertiary` |
  | Selected | `bg-action-primary` | `bg-action-primary_hovered` | `bg-action-primary_pressed` | `text-white_both` |
  | Range start / Range end | as Selected, on the band (rounded left / right) | | | `text-white_both` |
  | Range middle | — on the band | `bg-active-hover` | `bg-active-hover` | `text-primary` |
  | Disabled | — (Enabled only) | | | `text-disabled` |

- **`Calendar`** component set `3821:530`, **Type** = Single (`3821:12`, 304 × 356) / Range (`3821:219`, 604 × 356):
  the same sizes as `FinCalendar` in the browser (306 / 606 with the menu's 1px border). Built from instances:

  | Part | Built from |
  |---|---|
  | Previous / next month | **all-button** `Size=Small, State=Enabled, Type=Tertiary, Icon=Only Icon` (`47:1673`), its 20px icon set to `State=Secondary` (`fg-secondary`, code's `iconTone="secondary"`) and the glyph swapped to Loyalty Iconography `chevron_left` / `chevron_right` |
  | Month title | text, Title/Small, `text-primary`, centred in the 40 header (no atom covers Title styles) |
  | Weekdays Mo … Su | **Label atom** `Size=Small` (`28:971`), text overridden to `text-secondary`, centred in 40 cells |
  | Days | **Calendar day** instances, six weeks from the Monday on or before the 1st |

  Padding Space-L; months Space-2XL apart; Space-S between header, weekdays and weeks. Single: August 2026, 1 Aug
  Selected, 12 Aug Today, other months' days Outside. Range: August + September 2026, 20 Aug Range start, 4 Sep Range
  end, the days between Range middle, other months' days empty (as code with two months). The previous button sits on
  the first month, the next on the last; a 36 spacer keeps the title centred.
- **Descriptions** on both sets: types, tokens, how to set each day, and what Figma can't show (keyboard, hover
  preview of a range, the menu in the date pickers: that's N2 with `standard-menu`).
- **Source:** `FinCalendar` (`packages/ui/src/components/Calendar/`), `DESIGN.md` §9.86.

### N4 · Stepper: 13 Nov 2026

- **Page:** Stepper `3815:3701`. Page frame `3817:11` (header `3817:12`, section `3817:16`).
- **Decided by design (13 Nov 2026):** the step label uses the **Label atom in Figma only** (code keeps FinStepper's own
  label text); the Stepper is offered as **variants** (Steps × Current), built from a Step component.
- **`Step`** component set `3817:68`, **State** × **Line** (6 variants), 80 wide (Space-10XL), 65 tall:

  | Variant | Node |
  |---|---|
  | `State=Done, Line=True` / `False` | `3817:17` / `3817:31` |
  | `State=Current, Line=True` / `False` | `3817:42` / `3817:49` |
  | `State=Upcoming, Line=True` / `False` | `3817:55` / `3817:62` |

  | Part | Built from | Bindings / overrides |
  |---|---|---|
  | Box | frame, 36 (Size-36), Radius-S, 2px inside stroke | Done `bg-success_secondary` / `border-success`; Current `bg-active` / `border-active`; Upcoming `bg-secondary` / `border-default` |
  | Check (Done) | **20px icon set** instance, `State=Success` (`3017:6330`), glyph swapped to Loyalty Iconography `check` | glyph `fg-success` |
  | Number (Current, Upcoming) | text, Title/Medium; text property **Number** | Current `text-action`, Upcoming `text-secondary` |
  | Label | **Label atom** instance (`Size=Medium`, `28:969`), **exposed** | text colour overridden: Done `text-primary`, Current `text-action`, Upcoming `text-secondary`; centred, wraps (truncation off) in the column |
  | Line (Line=True) | 2px rectangle, absolute, from the box's edge (x 58) to the next box, 124 long | Done `border-success`, Current `border-active`, Upcoming `border-default` |

  Gap box → label Space-M (8). The line's 124 isn't a token: it's the distance between boxes in a stepper whose steps
  are 80 apart (80 + 80 − 36), as code's `hug`.
- **`Stepper`** component set `3817:476`, **Steps** = 3 / 4 / 5 × **Current** = 1…Steps (12 variants), each a row of
  Step instances Space-10XL (80) apart, the last with Line=False: widths 400 / 560 / 720 (4 steps = 560, as code's
  `hug`). Labels Reward, Rules, Eligibility, UX (the code stories' steps) and Review for a fifth.

  | Variants | Nodes |
  |---|---|
  | Steps=3, Current=1–3 | `3817:69`, `3817:90`, `3817:114` |
  | Steps=4, Current=1–4 | `3817:141`, `3817:169`, `3817:200`, `3817:234` |
  | Steps=5, Current=1–5 | `3817:271`, `3817:306`, `3817:344`, `3817:385`, `3817:429` |

- **Descriptions** on both sets: the states and tokens, how to edit (exposed Label, Number), and what Figma can't show:
  done steps as buttons back to them (focus ring round the box), and `width="fill"` (only the lines change length).
- **Not drawn** (code only): `width="fill"`; `doneSteps="all"` (Edit reward: every step but the current done, a
  combination designers can make by setting each Step instance's State); the all-done state (`current` = steps).
- **Check icon:** Loyalty Iconography has two `check` components with identical geometry; `c3bdd89c…` is used.
- **Source:** `FinStepper` (`packages/ui/src/components/Stepper/`), `DESIGN.md` §9.77.

### N5 · Stat card: 13 Nov 2026

- **Page:** Cards `3805:3461` (a new page; not the old Cards page `1:132` under "🔒 Do not use"). Page frame `3806:6`
  (header `3806:7`, section `3806:11`).
- **Component:** `Stat card` `3806:12` (a single component, no variants), 364 × 95 (the Reports screens' size),
  **built from the atoms** (design review 13 Nov 2026: no raw text; the first version had plain text layers):

  | Part | Node | What | Bindings / overrides |
  |---|---|---|---|
  | Card | `3806:12` | vertical, content centred | fill `bg-active`; padding Space-2XL (20); radius Radius-L (16) |
  | Text Box | `3809:57` | instance of **Text Box** `Alignment=Left, Type=Headline Large-H4` (`28:1017`), Show Description off; **exposed** | — |
  | Label | in the Text Box | its **Label** atom (Size Medium), the card label | text overridden to `text-secondary` |
  | Value | in the Text Box | its Headline/Large-H4 heading, `text-primary` | — |

- **Properties:** the card exposes its Text Box, so **Text Box** and its **Label** (label text) show in the card's
  properties panel; the value is edited by double-clicking the heading. Card-level `Label` / `Value` text properties
  aren't possible: Figma can't point a component's own property at text inside a nested instance ("Cannot set component
  property references on instance sublayer").
- **Example:** "Example: Reports summary" `3806:15`: four instances (Total points 806,400; Reward redemption (pts)
  806,400; Cash conversion (pts) 286,400; Points expired 76,200), Space-4XL (32) apart, each 220 wide to fit the page
  frame (the screens use 364 at 1920).
- **Description** on the component: the structure, the label's `text-secondary` override (the Label atom's default is
  too light on Dark `bg-active`, decided 28 Oct 2026), how to edit, and that it fills its column.
- **Width** 364 isn't a token (it's the screens' column width); instances are resized to the grid, as in code.
- **Possible follow-up (not done):** a heading text property on the Text Box atom would let the value be edited from
  the properties panel too; that's a change to an existing atom, for design to decide.
- **Source:** `FinStatCard` (`packages/ui/src/components/StatCard/`), `DESIGN.md` §9.81.

### N6 · Skeleton: 13 Nov 2026

- **Page:** Skeleton `3799:3342`. Page frame `3801:6` (header `3801:7`, section `3801:11`).
- **Component set:** `Skeleton` `3801:15`, property **Shape**:

  | Variant | Node | Size | Radius | Bindings |
  |---|---|---|---|---|
  | `Shape=Text` | `3801:12` | 343 × 12 | Radius-XS (4) | fill `bg-neutral`; width Size-343, height Size-12 |
  | `Shape=Rect` | `3801:13` | 343 × 24 | Radius-S (8) | fill `bg-neutral`; width Size-343, height Size-24 |
  | `Shape=Circle` | `3801:14` | 24 × 24 | Radius-Full | fill `bg-neutral`; width and height Size-24 |

- **Example:** "Example: list row loading" `3801:16`: a Circle instance at 40 and two Text instances (200 and 120 wide),
  as the Storybook story *List item*.
- **Description** on the set: when to use it, and the code's pulse (100% → 60% opacity, 1.6 s, still with reduced
  motion), which Figma can't animate.
- **Source:** `FinSkeleton` (`packages/ui/src/components/Skeleton/`), `DESIGN.md` §9.76.
- **Note:** the header text styles are referenced by their IDs in the file (Heading 2/Semibold, Text xl/Medium); their
  library keys can't be imported, so a new page copies them from an existing page's header.

### N9 · List checkbox: 16 Nov 2026

- **Page:** List `1:143` (the designer's choice, with the other list rows). Page frame `3828:13487` at x 16344, to the
  right of List-toggle (header copied from the List-radio_button frame; section heading `3828:13493` "List-checkbox").
- **Decided by design (16 Nov 2026):** built the same way as **List-radio_button** (`3503:21171`), from the base
  component; **no Indeterminate state in Figma** (code only).
- **Component set:** `List-checkbox` `3828:13494`, the radio list's properties and grid (50 variants):
  **Type** Default / Country / Payment × **State** Default / Hovered / Selected / Selected+hovered / Disabled ×
  **Item side** Leading / Trailing (Country and Payment; Default is Leading only, as the radio) × **Description**
  True / False.
- **Built from:** each variant is a **List-base** instance with **Base-Checkbox** (`42:185`) in its accessory slot;
  row fills, text, flag (Flag sizes) and payment icon (Payment Icons) are List-radio_button's, unchanged.

  | Row State | Base-Checkbox variant |
  |---|---|
  | Default, Hovered | `State=Enabled, Type=Unselected, Focused=False` (`42:186`) |
  | Selected, Selected+hovered | `State=Enabled, Type=Selected, Focused=False` (`42:189`) |
  | Disabled | `State=Disabled, Type=Unselected, Focused=False` (`42:204`) |

  As in the radio list, the row (not the control) shows hover and selection: Hovered `bg-secondary`, Selected `bg-active`,
  Selected+hovered `bg-active-hover`.
- **Description** on the set: types and states, and what Figma can't show: `indeterminate` for a "select all" row,
  keyboard (Space toggles), the focus ring round the row, and `FinListCheckboxGroup`.
- **Source:** `FinListCheckbox`, `FinListCheckboxGroup` (`packages/ui/src/components/ListCheckbox/`), `DESIGN.md` §9.54,
  §10 #55.
- **Subtitles corrected (16 Nov 2026, asked by design):** all five List page frames had the Input field subtitle
  ("Input Fields will help users…"). Each now describes its own list: List-base `77:10169`, List-standard `3500:14329`,
  List-radio_button `3503:21176`, List-toggle `3506:23930`, List-checkbox `3828:13491`.

### N10 · Filled lists: 16 Nov 2026

- **Page:** List `1:143` (designer's choice), four new frames in a row at y 14000, each under its plain list:
  `List_fill-standard` frame `3833:23177` (x 1948), `List_fill-radio_button` `3833:16165` (x 8112),
  `List_fill-toggle` `3833:15073` (x 12228), `List_fill-checkbox` `3833:19561` (x 16344). Names follow `List_fill-base`.
- **Built from:** each plain set copied and every variant's **List-base** instance swapped to **List_fill-base** of the
  same size (Large `3494:14234`, Small `3494:14251`), keeping the plain rows' content (controls, flags, payment icons,
  avatars, captions, chevrons). Card fill and edge are overridden on the List_fill-base instance per state
  (`DESIGN.md` §9.56):

  | Row State | Fill | Edge (1px) |
  |---|---|---|
  | Default | `bg-primary` | `border-subtle` |
  | Hovered | `bg-secondary` | `border-subtle` |
  | Selected | `bg-primary` | `border-active` (toggle on: `border-subtle`, no edge) |
  | Selected+hovered | `bg-secondary` | `border-active` (toggle: `border-subtle`) |
  | Disabled | `bg-primary` | `border-disabled` |

- **Component sets:**

  | Set | Node | Variants | Properties |
  |---|---|---|---|
  | `List_fill-standard` | `3833:23184` | 200 | as List-standard **without Chevron** (always shown, code's "always clickable"): State, Description, Leading accessory, Trailing accessory, Size |
  | `List_fill-radio_button` | `3833:16172` | 50 | as List-radio_button |
  | `List_fill-checkbox` | `3833:19568` | 50 | as List-checkbox (no Indeterminate) |
  | `List_fill-toggle` | `3833:15080` | 20 | as List-toggle |

  The standard set keeps List-standard's grid with the Chevron=False columns removed.
- **Variables:** `Border/border-active` and `Border/border-disabled` imported from Foundation – Loyalty
  for the edges.
- **Descriptions** on all four sets: the card, the state table, and what Figma can't show (keyboard, focus ring round
  the card, indeterminate on the checkbox, 12 between cards in a list).
- **Subtitles** written for the four new frames (the copied ones described the plain lists).
- **Source:** `FinListStandardFilled`, `FinListRadioFilled`, `FinListCheckboxFilled`, `FinListToggleFilled`
  (`packages/ui/src/components/List*Filled/`), `DESIGN.md` §9.56, §10 #56.

### N11 (header cell) + C17 · Table header cell sort, filter, narrow: 16 Nov 2026

- **Page:** Table `3144:13398`. The existing **`Table header cell`** set `3151:14941` updated in place (not a new
  component), so the Header row and tables pick it up.
- **Decided by design (16 Nov 2026):** sort and filter as **variants on the cell**; **C17 done with N11**; the
  **filter menu after C16** (it's built from `standard-menu`).
- **Structure:** the title Slot now sits in a **Title** frame (auto layout, gap Space-XS) with a hidden **Sort icon**
  (20px icon set `3017:6326`, State=Secondary). The trailing **24px** arrow is unchanged; in Filter variants it's
  renamed **Filter icon**, always shown (unlinked from `Show trailing icon`). Slot property, `Show checkbox`,
  `Show title` and `Show trailing icon` kept.
- **New variant properties** (34 variants; defaults = the old look):

  | Property | Values | Look |
  |---|---|---|
  | Sort | None / Unsorted / Ascending / Descending | Unsorted `unfold_more` `fg-secondary`; Ascending `arrow_upward`, Descending `arrow_downward`, glyph `fg-action` |
  | Filter | None / Default / Open / Applied | None = display-only arrow (the boolean); Default `keyboard_arrow_down` `fg-secondary`; Open `keyboard_arrow_up` `fg-action`; Applied `keyboard_arrow_down` `fg-action` |
  | Narrow | False / True | True: padding Space-XL (16) either side; only with Sort=None, Filter=None |

  Type (White / Grey) × Sort × Filter = 32, plus Narrow=True for each Type.
- **Icons:** Loyalty Iconography `unfold_more`, `arrow_upward`, `arrow_downward`, `keyboard_arrow_up` (each has two
  identical components in the library; the first listed is used). The icon sets have no Action state, so the glyph's
  fill is overridden to `Foreground/fg-action` (imported from Foundation – Loyalty).
- **Widths:** variants now hug (the set wraps at 1152); the default is 150 wide (code 150; was 151 from the old fill).
  Header row checked after the change: same variants and widths.
- **API note:** copying a variant turns its Slot into a plain frame; each copy got a real slot (`createSlot`) linked
  to the original `Slot#3151:16` property, and the extra slot properties were deleted.
- **Description** on the set: all properties, tokens, and code-only behaviour (icon hover / pressed, focus ring, the
  filter menu).
- **Filter menu:** done after C16, on the Menu page (below).
- **Source:** `FinTableHeaderCell` (`packages/ui/src/components/TableHeaderCell/`), `FinTableColumnFilter`,
  `DESIGN.md` §9.41, §9.65, §10 #50.

### C16 · Menu: 16 Nov 2026

- **Page:** Menu `3549:11198`. `standard-menu` set `3549:12004`, variant `Type=Normal` `3549:11762`, updated in place.
- **Slot name:** already `content` in Figma (`content#3549:1`); the `conten` typo had been fixed. Nothing to do.
- **Header and footer added** (code's `header` and `footer`), both off by default, so existing menus are unchanged
  (377 × 305):

  | Part | Node | Built from | Layout |
  |---|---|---|---|
  | **Header** frame, `Show header` (off) | `3843:123` | slot **header** `3843:124` holding a **Search** instance (`State=Enabled` `440:5163`) | padding Space-L, 1px `border-subtle` line below, above the content |
  | **Footer** frame, `Show footer` (off) | `3843:165` | slot **footer** `3843:166` holding **all-button** Small Tertiary "Reset" (`47:1601`) and Small Primary "Apply" (`47:1585`) | padding Space-XL, gap Space-M, right aligned, 1px `border-subtle` line above |

  New properties: `header`, `footer` (slots), `Show header`, `Show footer` (booleans).
- **Example:** "Example: menu with header and footer" `3843:201` (377 × 451) below the set.
- **Shadow (decided by design 16 Nov 2026):** stays **`Shadow/Sticky`** for now (the same values as code's
  `Shadow/Menu`). Design adds `Shadow/Menu` to Foundation – Loyalty and publishes it; then it's swapped in.
- **Divider between groups:** described (full-width Divider, as `FinMenuDivider`), not drawn.
- **Search size:** the header's Search is Figma's only size (48); code's country search uses Small (40), which is C5.
- **Description** on the set: content, header, footer, and code-only behaviour (kind, placement, height, width).
- **Source:** `FinMenu`, `FinMenuDivider` (`packages/ui/src/components/Menu/`), `DESIGN.md` §9.64, §10 #59.

### N11 · Table column filter menu: 16 Nov 2026

- **Page:** Menu `3549:11198` (designer's choice), below the standard menu: heading `3845:1873` "Table column filter"
  and the set.
- **Component set:** `Table column filter` `3845:1872`, **Type** × **Search** (4 variants), each a **standard-menu**
  instance (the C16 version) with Small list rows in its `content` slot. Examples are the code stories' columns.

  | Variant | Node | Size | Contents |
  |---|---|---|---|
  | `Type=Checkbox, Search=False` | `3845:673` | 377 × 245 | **List-checkbox** rows Active, Inactive, Pending (Selected); `Show footer` on: Reset, Apply |
  | `Type=Checkbox, Search=True` | `3845:942` | 377 × 318 | as above; `Show header` on, Search "Search Status" |
  | `Type=Radio, Search=False` | `3845:1241` | 377 × 229 | **List-radio_button** rows All (Selected), Silver, Gold, Platinum; no footer |
  | `Type=Radio, Search=True` | `3845:1560` | 377 × 302 | as above; `Show header` on, Search "Search Tier" |

- **Rows:** `Type=Default, Item side=Leading, Description=False`, the nested List-base set to **Size=Small** (code's
  `size="small"`). The **last row** has `Show Divider` off and **Space-XL bottom padding** (bound on the nested
  List-base), as code's last-of-many rule (`FinListItem.styles.ts`).
- **Width:** the menu's 377 (code fits the content; noted, not drawn).
- **Description** on the set: when each type is used, Reset / Apply vs apply on selection, "All", search from 8 values,
  and code-only behaviour.
- **Source:** `FinTableColumnFilter` (`packages/ui/src/components/TableColumnFilter/`), `DESIGN.md` §9.65, §10 #50.

### N12 + C18 · Table row actions, narrow cells: 16 Nov 2026

- **Decided by design (16 Nov 2026):** the ⋮ cell is a **variant of Table - Cell**; the ⋮ button and its menu are
  their own components; **C18 done with N12**.
- **`Row actions button`** set `3848:792` (Table page, before Table - Cell), **State** (32 × 32 each), each an
  **all-button** `Size=XSmall, Type=Tertiary, Icon=Only Icon` instance, 20px glyph swapped to Loyalty Iconography
  `more_vert`:

  | State | Node | Built from | Overrides |
  |---|---|---|---|
  | Enabled | `3848:744` | all-button Enabled `47:1675` | glyph `fg-secondary` (not the Tertiary purple) |
  | Hovered | `3848:756` | all-button Hovered `3062:2111` | — (`bg-action-secondary_hovered`, `fg-hovered`) |
  | Pressed | `3848:768` | all-button Pressed `47:1771` | — (`bg-action-secondary_pressed`, `fg-pressed`) |
  | Open | `3848:780` | all-button Enabled `47:1675` | Base-button fill `bg-action-secondary`, glyph `fg-action` |

- **`Table - Cell`** `3151:14990`, new **Narrow** property (5 variants, slots relinked in the copies):
  - `Type=Default, Narrow=True`: padding Space-XL, the checkbox column (56).
  - `Type=Row actions, Narrow=True`: 64 wide; only the Action Slot (always shown), holding a Row actions button.
  - **Link (C18):** the link button's Base-button side padding overridden to Space-none, so the text lines up.
  - Variants now hug (Default 173, was 174 from the set's fill).
- **`Table row`** `3151:15248` and **`Header row`** `3151:15203` (C18): the select cell set to **Narrow** (56); a new
  **Row actions** boolean (off) adds the ⋮ column: the Row actions cell in each row variant, and an empty Grey
  Narrow header cell fixed at 64 in the header row. Rows with it off: Table row 902 (was 918).
- **`Row actions menu`** `3849:786` (Menu page, heading `3849:1044`): a standard-menu instance 240 wide with
  List-standard Small rows (Leading accessory=Icon, no lines, Space-XL bottom padding): View details (`visibility`),
  Edit member (`edit`), Assign tier (`assignment`), a full-width Divider, Deactivate (`cancel`, destructive: title
  `text-error`, icon `fg-error`). Icons `fg-secondary`. The code story's actions.
- **Not drawn:** the fixed column's **sideways Sticky shadow** (needs new effect styles in Foundation – Loyalty, like
  `Shadow/Menu`); fixed position while scrolling (code only).
- **Fixes to N11's header cell found here:** (1) the copied variants had lost the `Show checkbox` link on the
  checkbox (32 variants) and `Show trailing icon` on the arrow (8 Filter=None variants): relinked; (2) the Title
  frame kept its width with the title hidden (a select cell was 150, not 72): its visibility is now linked to
  `Show title` (a sorted column with no title isn't drawn).
- **Descriptions** on all new and changed components.
- **Source:** `FinTableRowActions`, `FinTableCell`, `FinTableRow`, `FinTableHeaderRow`, `DESIGN.md` §9.43, §9.66,
  §10 #60, #61.

### C23 · Compact list density: 16 Nov 2026

- **Page:** List `1:143`. **Decided by design (16 Nov 2026):** Density on the two bases only; the list sets expose
  their nested base, so Density shows in their properties panel without doubling their variants.
- **`List-base`** `77:10185`: new variant property **Density** (Default / Compact), 4 variants:

  | Variant | Node | Padding (top / sides) | Content → divider | Height |
  |---|---|---|---|---|
  | `Size=Large, Density=Default` | `77:10186` | Space-XL | Space-XL | 82 |
  | `Size=Small, Density=Default` | `3097:27929` | Space-XL | Space-XL | 76 |
  | `Size=Large, Density=Compact` | `3857:24199` | Space-M | Space-M | 66 (code 66) |
  | `Size=Small, Density=Compact` | `3857:24493` | Space-M | Space-M | 60 (code 60) |

- **`List_fill-base`** `3494:14233`: the same property; Compact `Size=Large` `3857:25274` (65, code 65) and
  `Size=Small` `3857:25308` (59), padding Space-M all round.
- **Copies checked:** each Compact variant was copied from its Default one, and its 4 slots and every property link
  were restored (List-base 8 links, List_fill-base 7, as the originals).
- **Exposed:** the nested List-base / List_fill-base is now an exposed instance in all 8 list sets (List-standard,
  List-radio_button, List-checkbox, List-toggle and the four `List_fill-*`, 840 variants), so Density (and the base's
  other properties) can be set from them.
- **Row actions menu** `3849:786` (N12): its rows set to Density=Compact with Space-M bottom padding (no lines), 40
  tall as in code; its description updated. Figma's **Row count dropdown** (`3151:14547`) has no menu, so nothing to
  change there.
- **Descriptions** on both bases: the Density values and the bottom-padding rule.
- **Source:** `FinListItem`, `FinListItemFilled` and the list rows (`density`), `DESIGN.md` §9.49–9.56, §10 #121
  (released in v0.8.0).

### C24 · Table - Cell `Type=Checkbox`: 16 Nov 2026

- **Page:** Table `3144:13398`. `Table - Cell` set `3151:14990`, updated in place.
- **New variant** `Type=Checkbox, Narrow=False` `3860:782`, 72 × 40, copied from `Type=Default, Narrow=False`:
  only the **Leading accessories** slot is shown (Base-Checkbox `State=Enabled, Type=Unselected`); the Content slot
  and Action Slot are hidden. In this variant the three slots are unlinked from their Show booleans (always shown /
  hidden), as Type=Row actions. Padding Space-3XL, so the box lines up with the header text (as code).
- **Copy checked:** its 3 slots restored as real slots linked to the original properties (`Leading accessories`,
  `Content slot`, `Action Slot`); no extra properties.
- **Looks:** set by swapping the Base-Checkbox in the slot: Selected (ticked), Unselected, Disabled Unselected
  (doesn't apply; not the screen's Disabled + Indeterminate dash, decided by design 16 Nov 2026).
- **Example:** "Example: checkbox cells (ticked, unticked, disabled)" `3860:799`, below the set.
- **Description** on the set: the Checkbox type, the three looks, and the code's screen-reader names.
- **Source:** `FinTableCell` `type="checkbox"`, `FinTable` checkbox columns, `DESIGN.md` §9.43, §9.45, §10 #122
  (released in v0.8.0).

### N14 + C19 · Table (assembled), bordered style: 16 Nov 2026

- **Page:** Table `3144:13398` (designer's choice), after Table row.
- **Decided by design (16 Nov 2026):** a configurable component (frame + slots), not a fixed example; **C19 done with
  N14** as a Style property; **data only** (Empty and Loading described, not drawn).
- **Component set:** `Table` `3863:976`, **Style** = Default (`3863:806`, 1152 × 562) / Bordered (`3863:891`,
  1152 × 564). Auto layout, 1152 wide, Space-XL between toolbar, table and footer (as code):

  | Part | Built from | Notes |
  |---|---|---|
  | **Toolbar** (`Show toolbar`, on) | **Table Header** `3313:18577` | fills the width |
  | **Table** frame | — | Bordered: 1px `border-subtle` inside, Radius-S, clips its content |
  | **Rows** slot (in the Table frame) | **Header row** `3151:15203` + 10 **Table row** `State=Default` `3151:15247` | each fills the width (the row's Cell Slot set to fill), so the 6 columns line up; the last row's line removed (code: the last row never has one) |
  | **Footer** (`Show footer`, on) | **Table footer** `3151:14830` | fills the width |

  Properties: `Rows` (slot, one property for both variants), `Show toolbar`, `Show footer`, `Style`.
- **Not table-level:** Select Cell and Row actions stay on the rows (a table boolean can't reach instances in a
  slot); designers select every row to change them at once (in the description).
- **Description** on the set: the parts, the properties, and code-only behaviour (widths and scrolling, sort and
  filter, selection, the fixed ⋮ column, Empty and Loading).
- **Source:** `FinTable` (`packages/ui/src/components/Table/`), `DESIGN.md` §9.45, §10 #26, #77.

### N2 · Date pickers: composed from parts (decided 16 Nov 2026)

- **Decided by design:** no separate Date picker component in Figma; designers compose it from the parts, so N2 is
  closed without a build. The Calendar (N1) is the grid; the date picker is the field that opens it.
- **How to compose** (as `FinDatePicker` / `FinDateRangePicker`, `DESIGN.md` §9.87):

  | Part | Use |
  |---|---|
  | Field | **Input field-select** (`537:2736`), trailing icon swapped to Loyalty Iconography `calendar_today`; placeholder "Pick a date" / "Pick a date range"; value "DD/MM/YYYY", a range "DD/MM/YYYY – DD/MM/YYYY" (en dash) |
  | Menu (open) | **standard-menu** (`3549:12004`) 4 (Space-XS) below the field, **as wide as the calendar** (not the field), the Calendar in its `content` slot |
  | Calendar | **Calendar** (`3821:530`): Type=Single for a date, Type=Range (two months) for a range |

- States follow the select field (Focused while open, Complete once chosen, Disabled, Error).

### N3 · Date field: 16 Nov 2026

- **Page:** Input field `1:142` (designer's link). New frame `3866:3442` at x 17069 (header copied from the
  Input field-password frame; section heading "Input field-date", subtitle written for it).
- **Component set:** `Input field-date` `3866:3654`, **State** × **Error** (11 variants), copied from
  **Input field-standard** `Type=Default, Trailing icon=True` (each an **Input field-base** instance), so it has
  the standard field's states and looks:

  | Change | All variants |
  |---|---|
  | Trailing icon | Loyalty Iconography `calendar_today` (24px icon set, State=Secondary: `fg-secondary`) |
  | Label | "Start date" |
  | Placeholder | "DD/MM/YYYY" (Enabled, Hovered, Disabled; **Focused shows it too**, as code: the hidden Placeholder-text frame shown) |
  | Typing | "01/0" `text-primary` + "M/YYYY" `text-placeholder` (code's pattern-while-typing) |
  | Complete | "01/08/2026" |
  | Error helper | "Enter a date as DD/MM/YYYY" |

- **Large only:** the Small (40) size is C2 / C3 (not in Figma yet).
- **Not drawn:** the caret moving through the pattern (Figma's caret sits after the text), the digit mask, the
  keyboard, min / max. The calendar opening is described (the N2 composition), not drawn.
- **Description** on the set: states, texts, the calendar button and the code-only behaviour.
- **Source:** `FinDateField` (`packages/ui/src/components/DateField/`), `DESIGN.md` §9.79.

### N7, N8 · not needed in Figma (decided 16 Nov 2026)

- `FinSignInLayout` (N7) and `FinAppShell` (N8) stay code only: screens already draw the login layout and the page
  shell, so no Figma components are added.

### C10 · Segmented button sizes and icon only: 16 Nov 2026

- **Page:** Segmented button `3:150`. Both sets updated in place. **Decided by design (16 Nov 2026):** done before
  N13, so the account menu's Theme row uses the real XSmall icon-only control.
- **`Segmented_button-base`** `117:4667`: new **Size** (Medium / Small / XSmall) and **Icon only** (False / True),
  48 variants (Type × State × Size × Icon only); the 40 new ones copied from the 8 originals with their slot and
  property links restored:

  | Size | Padding | Gap, radius, text | Height | Icon only |
  |---|---|---|---|---|
  | Medium (Figma's) | Space-M / Space-3XL | Space-M, Radius-M, Button/Medium | 40 | 36 (Space-M all round, 20 icon) |
  | Small | Space-XS / Space-L | Space-XS, Radius-S, Button/Small | 32 | 28 (Space-XS, 20 icon) |
  | XSmall | 0 / Space-M | Space-XS, Radius-S, Button/Small; 16px icon set | 24 | 24 (Space-XS, 16 icon) |

  Icon only hides the label and always shows the Leading accessory slot (unlinked from its boolean there).
- **`Segmented button`** `117:4688`: the same two properties, 12 variants (State × Size × Icon only); its segments
  set to the matching size; Show Button 1–3 links kept:

  | Size | Track | Text | Icon only (3) |
  |---|---|---|---|
  | Medium | padding Space-XS, gap Space-L, Radius-L | 343 × 48 | 140 × 44 |
  | Small | padding and gap Space-XS, Radius-M | 343 × 40 | 100 × 36 |
  | XSmall | none, Radius-S, segments flush | 343 × 24 | **72 × 24** |

  Icon only: the track hugs its segments (as code). All sizes measured equal to code.
- **Not drawn:** the filled icon when selected, tooltips, `menuitemradio` (code only; in the descriptions).
- **Source:** `FinSegmentBase`, `FinSegmentedButton`, `DESIGN.md` §9.33, §9.34.

### N13 · Side nav account menu: 16 Nov 2026

- **Page:** Side nav `1:129` (designer's link), in the section with Side Menu.
- **Decided by design (16 Nov 2026):** the user row is a **standalone** set (Side Menu left as it is); **C10 first**
  so the Theme row uses the real XSmall icon-only control; Light / Dark use the **nearest library icons for now**.
- **`Side nav user`** set `3872:1506` (built from the Side Menu's own user row, a List-base Small instance):

  | Variant | Node | Look |
  |---|---|---|
  | `Type=Expanded, State=Default` | `3872:1380` | 240 × 70; padding Space-L / Space-XL, Radius-M; `keyboard_arrow_down` |
  | `Type=Expanded, State=Hovered` | `3872:1411` | `bg-tertiary` |
  | `Type=Expanded, State=Pressed` | `3872:1442` | `bg-neutral` |
  | `Type=Expanded, State=Open` | `3872:1473` | `bg-tertiary`, `keyboard_arrow_up` |
  | `Type=Minimized, State=Default` | `3872:1504` | the avatar (40) in a 48 column, Space-L above and below; no fill (as code) |

- **`Account menu`** component `3873:1489`, 320 × 294: a **standard-menu** instance (C16 version) at 320, Show
  header on with the header padding set to Space-none (code's `headerPadding="none"`), no footer:

  | Part | Built from | Height |
  |---|---|---|
  | Header | List-standard Small (description) "Olivia James" / "oliviajames@email.com", trailing **Badge-primary State=Neutral** "Admin"; no line of its own (the header's line) | 75 |
  | My profile, Settings, Log out | List-standard Small, no description, Show Divider off + Space-XL bottom padding | 53 each (as code) |
  | Theme | the same row, trailing **Segmented button `Size=XSmall, Icon only=True`** (72 × 24, C10): System `desktop_windows` (Selected), Light, Dark | 56 (as code) |
  | Line | **Divider** atom, full width, before Log out | 1 |

- **Icons (temporary):** Loyalty Iconography has no `light_mode` or `dark_mode`; Light uses `brightness_low` and
  Dark `bedtime` until they're added (code uses `light_mode` and `dark_mode`). To swap when published.
- **Descriptions** on both: states, placement (above the user area, or right of the minimized nav) and code-only
  behaviour (keyboard, theme picking keeps the menu open, tooltips).
- **Source:** `FinSideNav` (`profile.menu`, the theme row), `DESIGN.md` §9.57, §10 #62.

### C1 · Button: Link, icon and content tones: 16 Nov 2026

- **Page:** Buttons `1:130`. `all-button` `47:1580`, updated in place.
- **Decided by design (16 Nov 2026):** Link as **`Type = Link`** variants; Tertiary's code-only colour options as
  **documented overrides**, not variants (as variants they'd add 576).
- **`Type=Link`** (§10 #118): 48 new variants (Size × State × Icon None / Leading / Trailing; no Only Icon), copied
  from the Tertiary ones (Base-button instances, same sizes and padding: all 48 measured equal to Tertiary), with:

  | State | Background | Label | Icon |
  |---|---|---|---|
  | Enabled | none | `text-action` | `fg-action` |
  | Hovered | none | `text-action`, underlined | `fg-action` |
  | Pressed | none | `text-pressed`, underlined | `fg-pressed` |
  | Disabled | none | `text-disabled` | `fg-disabled` |

  The set now has 240 variants; the Link rows sit below the others.
- **Tertiary tones** (`iconTone="secondary"`, `contentTone` inverse / primary / secondary / info / success / error /
  warning): a reference frame **"Tertiary tones (overrides)"** `3877:6319` under the set: eight cards, each a
  Tertiary Small Leading instance with the label and icon recoloured, on the background it's used on (`bg-direct`
  for inverse, the status `*_secondary` fills, `bg-primary`). Captions are Label atoms.
- **Description** on the set: the Link states, and how to apply the tones (with code's hover and press tints).
- **Not in this item:** the `Tone` property (Normal / White / Destructive, §9.28) is still separate sets in Figma.
- **Source:** `FinButton` / `FinButtonBase` (`variant="link"`, `iconTone`, `contentTone`), `DESIGN.md` §9.28, §10 #118.

### C2 · Input field base: Small size, mask: 16 Nov 2026

- **Page:** Input field `1:142`. `Input field-base` `49:5734`, updated in place.
- **New variant property `Size`** (Large / Small): 16 variants (Type × Destructive × Size). The 8 Small ones are copies
  of the Large ones, with their 4 slots and 11 property links restored (checked equal to the originals, no extra
  properties):

  | | Large (Figma's) | Small (code's `size="small"`) |
  |---|---|---|
  | Box | 48 | **40** |
  | Content padding | Space-L / Space-XL | **Space-M** / Space-XL |
  | Slot icons (leading, trailing) | 24px | **20px** (same State) |
  | Country selector (Mobile number) | 78 × 48 | 78 × **40** |
  | Focus overlay | 341 × 46 | 341 × **38** (1 in from the border) |
  | Whole field with helper | 343 × 74 | 343 × **66** (as code) |

  Small variants: Default `3879:3477` / `3879:4879`, Select `3879:4372` / `3879:4817`, Payment `3879:4848` /
  `3879:4910`, Mobile number `3879:4941` / `3879:4998` (Destructive False / True).
- **Known difference:** the country selector's chevron stays **24** in Small (the `Contry selecter` component keeps
  its icon in a fixed 24 frame); code uses 20. Noted in the description.
- **Mask** (code only): not a base property; the look (the rest of "DD/MM/YYYY" in `text-placeholder` while typing)
  is drawn in `Input field-date`'s Typing variants (N3). Noted in the description.
- **Not yet:** the mapped fields (standard, password, search, select, multi select) still use Large: C3–C7.
- **Source:** `FinInputBase` (`size`, `mask`), `DESIGN.md` §9.58.

### C3 · Input field standard: Small size: 16 Nov 2026

- **Page:** Input field `1:142`. `Input field-standard` `52:2629`, updated in place.
- **New variant property `Size`** (Large / Small): 132 variants (Type × State × Trailing icon × Error × Size). Each
  Small one is a copy of its Large one (a single Input field-base instance, no slots or links of its own) with the
  base set to **Size=Small** (C2) and any icon placed in its leading / trailing slot swapped to the 20px icon set
  (same State and glyph; 3 needed it, the rest come from the base).
- **Sizes:** box 40, 66 tall with the helper (as code). Two Mobile number variants (Enabled and Hovered, Trailing
  icon) are 68 in Small because they're already 76 in Large (2 more than the others): an existing difference, kept.
- **Known difference (from C2):** the country selector's chevron stays 24 in Small.
- **Description** on the set: the Size property.
- **Source:** `FinTextField` `size`, `DESIGN.md` §9.59.

### C4 · Input field password: Small size: 16 Nov 2026

- **Page:** Input field `1:142`. `Input field-password` `60:7165`, updated in place.
- **New variant property `Size`** (Large / Small): 44 variants (State × Show password × Error × Size). Each Small one
  is a copy of its Large one (a single Input field-base instance) with the base set to **Size=Small** (C2) and the
  eye swapped to the 20px icon set (same State, same `visibility` / `visibility_off` glyph): 22 swapped, no 24px icon
  left.
- **Sizes:** box 40, 66 tall with the helper in all 22 (as code).
- **Description** on the set: the Size property.
- **Source:** `FinPasswordField` `size`, `DESIGN.md` §9.60.

### C5 · Search: Small size: 16 Nov 2026

- **Page:** Search. `Search` `440:5164`, updated in place.
- **New variant property `Size`** (Large / Small): 8 variants (State × Size). Each Small one is a copy of its Large
  one (a single Input field-base instance) with the base set to **Size=Small** (C2) and every slot icon swapped to the
  20px icon set (same State, same glyph) and sized 20 × 20: `search` in all 4, `cancel` in Typing and Complete (6 icons,
  no 24px icon left).
- **Small variants:** Enabled `3885:110`, Focus `3885:297`, Typing `3885:237`, Complete `3885:177`.
- **Sizes:** 343 × 40 (no helper, as code). Large unchanged (343 × 48).
- **Description** on the set: the Size property.
- **Option order:** the Plugin API listed Size as Small, Large; design reordered it to Large, Small by hand (as C3 /
  C4).
- **Found while checking (C3, C4):** some slot icons swapped to the 20px set kept a 24 × 24 size: the eye in all 22
  Small `Input field-password` variants and the 3 Disabled icons in Small `Input field-standard`. Design is fixing
  them to 20 × 20 by hand (16 Nov 2026).
- **Source:** `FinSearchField` `size` (20px icons when small), `DESIGN.md` §9.61.

### C6 · Input field select: Small size, Disabled and Error: 16 Nov 2026

- **Page:** Input field `1:142`. `Input field-select` `537:2736`, updated in place (was 5 variants, `state` only).
- **Properties now:** `state` (Enabled / Hovered / Focused / Typing / Complete / **Disabled**) × **`Error`** (False /
  True) × **`Size`** (Large / Small): 22 variants, no Disabled + Error (as `Input field-standard`). The lowercase
  `state` is kept (§10 #21).
- **Disabled** (new, from Enabled, the overrides `Input field-standard` Disabled uses): border `border-disabled`,
  placeholder `text-disabled`, the chevron's 24px wrapper `State=Disabled` (`fg-disabled`), helper text
  `State=Disabled`. Large `3886:6041`, Small `3886:6648`.
- **Error** (new, from each of the 5 states): Input field-base `Destructive=True` and helper text `State=Error`, the
  rest as the state (Hovered keeps its `bg-secondary`, Focused / Typing the ring in error colour).
- **Small:** a copy of every Large variant with the base **Size=Small** (C2) and the chevron's wrapper swapped to the
  20px set (same State) at 20 × 20: 343 × 66 with the helper (as code).
- **Layout:** the set's wrap auto-layout put the 5-item Error rows out of line, so it's now a fixed grid: a row per
  Size × Error (Large, Large error, Small, Small error), a column per state, 100 apart, 20 padding; the Error rows
  leave the Disabled column empty. Set 2598 × 620.
- **Description** on the set: the three properties and how Disabled / Error / Small are drawn.
- **Option order:** Figma lists `Error` as False, True (`Input field-standard` has True, False) and `state` as
  Complete, Enabled, Focused, Typing, Hovered, Disabled (as before, plus Disabled); reorder by hand if wanted.
- **Already different from code, unchanged:** Focused and Typing show the base's caret (code's select is a button,
  no caret, §9.72 (2)); no open-menu look (`keyboard_arrow_up`) in Figma.
- **Source:** `FinSelectField` (`disabled`, `error`, `size` from FinInputBase), `DESIGN.md` §9.72.

### C8 · Chips: Filter, Assist and Input chip: 16 Nov 2026 (done before C7)

Done before C7 by design's choice (16 Nov 2026), so the Multi select can use the real Input chip. Page **Chips**,
frame `Headline - EN` `95:1810` (now: Chips-base, Filter chip, Assist chip, Input chip, Chips-group). `Chips-base`
unchanged. As §10 #46.

- **Filter chip** = the old `Chips` `95:1848`, **renamed** in place (same node, every instance keeps working, e.g. the
  Multi select's chip and Chips-group). `Type` (Unselected / Selected) → **`Selected`** (False / True); new **`Size`**
  (XSmall / Small / Large, Chips-base's Xsmall / Small / Large): `State` × `Selected` × `Size` = 24 variants. No icons
  (as before). → `FinFilterChip`.
- **Assist chip** `3891:8729` (new): Chips-base **Unselected-border**, leading icon on (the slot's `perm_identity`),
  `State` Enabled / Hovered / Pressed / Disabled / **Open** × **`Dropdown`** (False / True: `keyboard_arrow_down` in
  the trailing icon) × `Size` = 27 (Open only with Dropdown). Open = Chips-base **Selected** with `keyboard_arrow_up`
  (code: `expanded`). → `FinAssistChip` (`dropdown`, `expanded`).
- **Input chip** `3891:8808` (new): Chips-base **Unselected-border**, label + ✕ (`close`), leading accessory off,
  `State` Enabled / Disabled × `Size` = 6 (no hover or pressed: the ✕ has a cursor only). → `FinInputChip`.
- **States** (every set, every size; each set explicitly, bound to Foundation – Loyalty variables): Hovered
  `bg-active-hover`; Pressed `bg-action-primary_pressed`, `text-inverse`, icons `fg-inverse`; Disabled `bg-disabled`,
  `text-disabled-on_bg`, icons `fg-disabled-on_bg`. Unselected / Unselected-border drop the stroke (and shadow) in those
  states; Selected keeps `border-active` / `border-pressed` / `border-disabled`. Selected icons `fg-brand`.
- **Layout:** each set a fixed grid, a column per State, a row per Size × the other property, **Small rows first** so
  **Small is the default** (as code; Figma takes the default from the top-left variant), then XSmall, Large. The new
  sets have the same dashed set outline as the others.
- **Descriptions** on the three sets (meaning, code component, states).
- **Option order** of `Size` in Filter chip reads Small, XSmall, Large (Assist XSmall, Small, Large); reorder by hand
  if wanted.
- **Source:** `FinChipBase` (§9.31), `FinAssistChip` / `FinFilterChip` / `FinInputChip` (§9.32), `DESIGN.md` §10 #46.

### C7 · Input field Multi select: Input chip, Small, Disabled and Error: 16 Nov 2026

- **Page:** Input field `1:142`. `Input field-Multi select` `922:6170`, updated in place (was 5 variants, `state`
  only). Built after C8 (design's choice), so it uses the real Input chip.
- **The chip** (Complete): the `Chips` instance (Chips-base overridden to Unselected-border XSmall) **swapped to Input
  chip `State=Enabled, Size=XSmall`** (C8): label and ✕, no person icon (§10 #119 (2)). 68 × 26, same look.
- **Complete shows the chevron** now (Show Trailing accessory was off; code's `keyboard_arrow_down` is always there).
- **Properties now:** `state` (Enabled / Hovered / Focused / Typing / Complete / **Disabled**) × **`Error`** × **`Size`**
  (Large / Small): 22 variants, built exactly as C6: Disabled from Enabled (`border-disabled`, `text-disabled`
  placeholder, chevron `State=Disabled`, helper Disabled; Large `3893:6441`); Error = base `Destructive=True` + helper
  Error on each of the 5 states (Complete keeps its chip); Small = base Size=Small, chevron 20 × 20, 343 × 66, the chip
  stays XSmall (as code). The lowercase `state` is kept (§10 #21).
- **Layout:** fixed grid as C6 (row per Size × Error, column per state, 100 apart), set 2598 × 620. Its parent frame
  `Headline - EN` `922:6168` was 2290 wide and clipped the Disabled column: widened to **2726** (as Select's).
- **Description** on the set.
- **Kept, logged (design's choice 16 Nov 2026):** the **Typing** variant (typed text and caret): code is a button and
  the search is in the menu (§10 #119 (1)); Focused / Typing show the base's caret.
- **Not yet (later, §10 #119 (3)):** several chips with the "+N" chip, and the open menu with checkbox rows.
- **Option order:** `Error` False, True; `state` Complete, Enabled, Focused, Typing, Hovered, Disabled (as C6).
- **Source:** `FinMultiSelectField` (`disabled`, `error`, `size`), `FinInputChip` XSmall, `DESIGN.md` §9.85.

### C9 · Checkbox: left only, box focus ring, Selected + Disabled, Indeterminate: 16 Nov 2026

- **Page:** Checkbox. `Checkbox` `42:220`, updated in place (decided by design 16 Nov 2026, §10 #44).
- **Left only:** the trailing Base-Checkbox is deleted from every variant and the `Show Leading Icon` and
  `Show Trailing Icon` properties are removed; the left checkbox is always shown. The Text Box now **fills** the row
  (it was 271 wide, leaving room for the trailing box), so lines break as code's. `Show Text box` stays.
- **Focused** = the checkbox's own ring (Base-Checkbox `Focused=True`), as code; the row `Focus ring` frame is deleted
  from the three Focused variants.
- **New variants** (Base-Checkbox has the looks): Selected + Disabled `3895:135`; Indeterminate Enabled `3895:147`,
  Enabled Focused `3895:159`, Disabled `3895:173` (disabled text from the Unselected Disabled variant). 10 variants:
  `Type` Unselected / Selected / Indeterminate × `State` Enabled / Disabled × `Focused`; Hovered and Pressed stay in
  Base-Checkbox (code: from the base).
- **Kept:** `Type=Unselected, State=Disabled, Focused=True` (a disabled checkbox can't take focus in code; kept so
  existing instances don't break).
- **Layout:** fixed grid, a row per Type × State, Focused False / True in two columns; set 766 × 572. Its frame
  `Headline - EN` and the page frame `Checkbox` `42:179` widened 797 → **894** so the set isn't clipped (the header
  fills it).
- **Description** on the set.
- **Source:** `FinCheckbox` (`checked`, `indeterminate`, `disabled`), `DESIGN.md` §9.30, §10 #44.

### C11 · Header notification: 40 circle, 20 bell: 16 Nov 2026

- **Page:** Header. `Header notification` `3178:24467`, updated in place (10 variants, same properties and IDs).
- **The circle:** each variant's `48px bg` icon container is **replaced by a plain auto-layout frame `Circle`**:
  40 × 40, padding **Space-M** (bound), radius **Radius-Full** (bound), centred, its fill the variant's own
  (`bg-action-secondary` / `_hovered` / `_pressed`, Disabled `bg-disabled`, kept). As code, which draws the circle on
  the button, not FinIconContainer (§9.62 (3)). Why not `40px bg`: an icon inside an icon-container instance can't be
  resized (Figma: "size cannot be overridden in an instance"), and `40px bg` holds a 24 icon top-left, so a 20 bell
  wouldn't be 20 or centred.
- **The bell:** a **20px** icon wrapper instance (`State=Secondary`; Disabled `State=Disabled`) with `notifications`,
  its colour the variant's own (`fg-action` / `fg-hovered` / `fg-pressed`, Disabled `fg-disabled-on_bg`): 20 × 20 at
  10 / 10.
- **Badges** (absolute, as before): the dot at **26 / 8** (8 from the top and right); the number at **20 / −4** (the
  centre line, 4 above the top, growing right). Disabled: no badge (unchanged).
- **Effect elsewhere:** every instance (the Main header's notification button) is now 40, as code; C12 updates the
  header itself.
- **Description** on the set.
- **Source:** `FinHeaderNotificationButton` (`FinHeaderNotificationButton.styles.ts`), `DESIGN.md` §9.62.

### C12 · Main header: H6 title, XSmall back button: 16 Nov 2026

- **Page:** Header. `Main header` `3178:24570` (a component), updated in place.
- **Title:** the Text Box `Type` Headline Large-H4 → **Headline Small-H6** (16 / 24, Semibold 600); the body content
  slot stays 4 below (now at 28).
- **Back button:** all-button `Size` Medium (48) → **XSmall** (32, 20 icon), Tertiary, Only Icon. The size change
  reset the icon to the slot default (`perm_identity`), so `arrow_back` was swapped back in (the glyph component from
  the Side sheet page, `3173:14562`).
- **Bell:** the Header notification is 40 from C11.
- **Measured:** 1368 × **77** (12 + 24 + 4 + 21 + 12 + the 4 border, as code; was 87); back button 32 at 24; the text
  at **68** (24 + 32 + 12); the bell 40 at the right edge minus 24. Padding, gaps, border and radius unchanged.
- **Description** on the component.
- **Effect elsewhere:** screens using Main header get the 77 header.
- **Source:** `FinHeader` (`FinHeader.styles.ts`), `DESIGN.md` §9.63.

### C13 · Button dock: Small buttons that hug, Secondary + Primary at the right: 16 Nov 2026

- **Page:** Button dock. `Button dock` `75:5858`, updated in place (both variants, Sticky False / True).
- **Small:** the three all-buttons `Size` Large (56) → **Small** (40); labels kept.
- **Hug:** Secondary and Primary were Fill (sharing the width): now **Hug** (their inner Base-button too, which was
  Fill), so each is as wide as its label (96 with "Text here"), as Tertiary already was.
- **At the right:** Secondary and Primary moved into a new auto-layout frame **`End buttons`** inside `Button content`:
  Fill width, aligned right, gap bound to **Space-XL** (as the row). Same as code's `ms-auto` on the first of them;
  still right with Tertiary hidden. Their `Show Secondary button` / `Show Primary button` booleans still work. The row
  centres its items.
- **Measured** (711 drawing width): 141 tall with a one-line accessory (16 + 21 + 24 + 40 + 40), 96 with buttons only
  (as code); Tertiary 96 at 24; Secondary at 533, Primary at 591 (16 apart, ending at 687, the right padding).
- **Not changed:** the Tertiary layer is still named "Button-Secondary" (renaming could confuse existing overrides; rename
  by hand if wanted).
- **Description** on the set. **Effect elsewhere:** the Side sheet's dock (an instance) gets the same.
- **Source:** `FinButtonDock` (`FinButtonDock.styles.ts`), `DESIGN.md` §9.69.
