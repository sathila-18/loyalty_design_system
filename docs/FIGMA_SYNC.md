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
| ✏️ Changed: in both, code differs visually | 22 |
| ✅ Unchanged | 38 |
| ⬜ In Figma only, not built in code | 4 |

### 🆕 New: in code only

| # | Code | What it is | Figma before | `DESIGN.md` ref | Status |
|---|---|---|---|---|---|
| N1 | `FinCalendar` | Month grid, Monday first; single or range; day looks: default, outside, chosen, in range, today, disabled | — | §9.86, §10 #120 | ⬜ |
| N2 | `FinDatePicker`, `FinDateRangePicker` | Select-look field that opens the calendar; range shows two months | — | §9.87, §10 #120 | ⬜ |
| N3 | `FinDateField` | Text field with DD/MM/YYYY mask and a calendar button | screens draw a text field with `calendar_today` | §9.79 | ⬜ |
| N4 | `FinStepper` | Steps of a multi-step form: done, current, upcoming | drawn on each Add reward screen | §9.77 | ✅ 13 Nov 2026 |
| N5 | `FinStatCard` | Summary number on `bg-active` | drawn on each Reports screen | §9.81 | ✅ 13 Nov 2026 |
| N6 | `FinSkeleton` | Loading placeholder: text, rect, circle | — | §9.76 | ✅ 13 Nov 2026 |
| N7 | `FinSignInLayout` | Login layout: artwork panel and form | drawn on each Login screen | §9.84, §10 #116 | ⬜ |
| N8 | `FinAppShell` | Page shell: side nav, header, content | drawn on each screen | §9.68, §10 #63 | ⬜ |
| N9 | `FinListCheckbox` | Checkbox list row, as List-radio_button | — | §9.54, §10 #55 | ⬜ |
| N10 | Filled list rows (×4) | Filled versions of List-standard, radio, checkbox, toggle | only `List_fill-base` | §9.56, §10 #56 | ⬜ |
| N11 | Table column sort / filter | Header sort arrows and filter menu | hidden 24px icon in the header cell | §9.41, §9.65, §10 #50 | ⬜ |
| N12 | Table row actions (⋮) | 64-wide ⋮ column with its menu | hidden "Action Slot" in cells | §9.66, §10 #60 | ⬜ |
| N13 | Side nav account menu | User row as a menu trigger; 320-wide menu with a Theme row | — | §9.57, §10 #62 | ⬜ |
| N14 | `FinTable` (assembled) | Whole table with footer and pagination | parts only, by decision (§10 #26) | §9.45 | ⬜ optional |

### ✏️ Changed: in Figma, but code differs visually

Behaviour-only and accessibility props are left out (Figma can't show them).

| # | Figma component (node) | Code differs by | `DESIGN.md` ref | Status |
|---|---|---|---|---|
| C1 | `all-button` (`47:1580`) | Link variant; `iconTone` secondary; `contentTone` colours | §9.28, §10 #118 | ⬜ |
| C2 | `Input field-base` (`49:5734`) | Small (40) size; mask | §9.58 | ⬜ |
| C3 | `Input field-standard` (`52:2629`) | Small size | §9.59 | ⬜ |
| C4 | `Input field-password` (`60:7165`) | Small size | §9.60 | ⬜ |
| C5 | `Search` (`440:5164`) | Small size | §9.61 | ⬜ |
| C6 | `Input field-select` (`537:2736`) | Small size; Disabled and Error | §9.72, §10 #58 | ⬜ |
| C7 | `Input field-Multi select` (`922:6170`) | Small; Disabled and Error; no Typing look; Input chip XSmall chips | §9.85, §10 #119 | ⬜ |
| C8 | `Chips` (`95:1848`) | Three chip types (Assist / Filter / Input); Input chip Unselected-border | §9.32, §10 #46 | ⬜ |
| C9 | `Checkbox` (`42:220`) | Checkbox on the left only; Selected + Disabled | §10 #44 | ⬜ |
| C10 | `Segmented_button-base` / `Segmented button` (`117:4667` / `117:4688`) | Small (32) and XSmall sizes, icon only, tooltips | §9.33, §9.34 | ⬜ |
| C11 | `Header notification` (`3178:24467`) | 40 everywhere, 20 bell (Figma 48) | §9.62 | ⬜ |
| C12 | `Main header` (`3178:24570`) | Headline Small-H6 title; XSmall (32) back button (Figma H4, 48) | §9.63 | ⬜ |
| C13 | `Button dock` (`75:5858`) | Small buttons; buttons hug labels, Secondary + Primary at the right | §9.69 | ⬜ |
| C14 | `Side Menu` (`3142:11871`) | Tree style; logo text "Fintech loyalty" | §9.57, §10 #76, #111 | ⬜ |
| C15 | `Main Selection` / `sub selection` (`3140:10997` / `3140:11076`) | Tree lines; chevron colours on tokens | §9.47, §10 #52, #76 | ⬜ |
| C16 | `standard-menu` (`3549:12004`) | Shadow/Menu effect style; header and footer slots; slot `conten` → content | §9.64, §10 #59 | ⬜ |
| C17 | `Table header cell` (`3151:14941`) | Sort / filter icons; narrow checkbox and ⋮ cells (56, Figma 72) | §9.41, §10 #50 | ⬜ |
| C18 | `Table - Cell` / `Table row` / `Header row` | Narrow checkbox cell; Link cell padding | §9.43, §10 #61 | ⬜ |
| C19 | Table (assembled) | Bordered style | §9.45, §10 #77 | ⬜ |
| C20 | `List-standard` (`3491:5292`) | Destructive tone | §9.51 | ⬜ |
| C21 | `Avatar` (`932:1387`) | Online indicator placed on the avatar | §9.4, §10 #33 | ⬜ |
| C22 | `File uploads` (`775:4280`) | XSmall (36) button; Large 218 tall | §9.80 | ⬜ |

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
