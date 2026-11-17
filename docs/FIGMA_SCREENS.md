# Figma screens: built pages → Admin UI V0.2

Progress of redrawing the product screens in the screens file (**Loyalty**, `9eRxGGC7YQ6TPzi5PHYCgw`), page
**Admin UI V0.2** (`922:36767`), with the updated **Component library – Loyalty**. The old screens (page **Admin UIs**)
stay as they are.

**Rules (agreed with design 17 Nov 2026):**

- **One flow at a time**, in the order the designer picks; build, screenshot, wait for approval, then the next.
- **Source: the built page** (code and its Storybook story: text, sample data, states), not the old Figma screen. Where
  the page intentionally differs from the old screen, the page wins (the decisions are in `DESIGN.md` §8.6).
- **Library components only:** App shell (or Sign in layout for login) as the shell; tables, sheets, dialogs,
  snackbars and fields from Component library – Loyalty; Foundation – Loyalty variables and text styles for anything
  the page lays out itself. No detached instances, no raw values. A gap (something the library lacks) is reported to
  the designer, not drawn.
- **Frames:** 1920 × 1080, one Figma section per flow, frames named `<Page> / <State>`, left to right in the flow's
  order (list, add, details, edit, remove, snackbar, empty states).
- **This file is the log.** `DESIGN.md` isn't written for this work; `docs/FIGMA_SYNC.md` is the component sync.

## Flows

| # | Flow | Source (Storybook) | Status |
|---|---|---|---|
| S1 | Programme configuration | Pages/Loyalty Management/Programme Configuration | ✅ 17 Nov 2026 |
| S2 | Tier management | Pages/Loyalty Management/Tier Management | ✅ 17 Nov 2026 |
| S3 | Reward catalog | Pages/Loyalty Management/Reward Catalog | ⬜ |
| S4 | Focus areas | Pages/Gamification/Focus Areas | ⬜ |
| S5 | Badges | Pages/Gamification/Badges | ⬜ |
| S6 | Reports | Pages/Report Management/Reports | ⬜ |
| S7 | Login | Pages/Login | ⬜ |
| — | System users, Role management, System audit, Dashboard | not built in code | to decide |

## Done

### S1 · Programme configuration: 17 Nov 2026

- **Section** `1054:2509` "Programme configuration". Row 1 the flow, row 2 the empty states. Each frame 1920 × 1080,
  an **App shell** instance (Side Menu `Menu=Loyalty Management - Program Configuration, Style=Tree`; Main header
  "Programme configuration" / "One configuration per customer segment", no back button, bell 99+):

  | Frame | Node | Story | Built from |
  |---|---|---|---|
  | List | `1054:2510` | List | **Table** `Style=Bordered`: toolbar (search "Search segment", no filter, "Add programme configuration" with `add`); Header row + 3 Table rows, select column and Row actions on; 7 columns: No. (80), Segment (filter arrow, `Filter=Default`), Loyalty (Badge Success "Enable"), Expiry (days), Cash conversion (Badge), Conversion rate (Link cell), Min conversion (pts) (200), the rest fill; footer "Showing 1–3 of 3 entries in page 1", one page, both arrows Disabled |
  | Add | `1054:14231` | Add configuration | List + **Overlay** Desktop + **Side sheet** (632 wide, as code at 1920): no back or close button; title Text Box Headline Large-H4 + description; body: five sections (legend Label/Small `text-primary`, Space-XL to the fields, sections Space-3XL apart): **Input field-select** Small with helper, **List_fill-toggle** (List_fill-base Size Small) Active on / Activation flow off, **Input field-standard** Small with Suffix (Days, Points, LKR), the two rates side by side Space-XL apart; dock Cancel (Secondary) + Save configuration (Primary), hugging at the right |
  | Details | `1056:4906` | Details | Side sheet with the close button, title "Staff details" (the sheet's own Display Small-H3); body a **Table** `Style=Default`, no toolbar or footer, no select or ⋮ column: Attribute / Added record, 7 rows (badges as the list, the rate as plain text); dock Remove (**Destructive-button** Secondary, `delete` leading) + Edit (Primary) |
  | Edit | `1056:8391` | Edit configuration | The Add sheet with every field `Complete` (floating label + value: Staff, 1095, 80, 1.00, 100), Allow points… on, title "Edit programme configuration", Save `Disabled` (nothing changed yet) |
  | Remove | `1056:9589` | Remove | List + Overlay + **Dialog box** 608 × 200, centred (as code): "Remove segment", close button, body text, Cancel (Secondary) + Remove (**Destructive-button** Primary Medium) |
  | Removed | `1056:11016` | Removed | List without Staff ("Showing 1–2 of 2 entries in page 1") + **Snackbar** Single Success "Segment removed successfully", close, no button, 24 from the top and right |
  | No configurations | `1056:11710` | No configurations | Table footer off; the Rows slot holds an **Empty state** Medium (`loyalty`, the heading, description, "Add programme configuration" with `add`), centred; the table fills the content's height |
  | No matches | `1056:12747` | No matches | As above with Empty state Small (`search`, "No segments match “Platinum”", "Clear search and filters"); the search **Typing** "Platinum" |

- **Not like code:** the snackbar is the component's 343 wide (code hugs its text, ≈316).
- **Library issues found (worked around on the screens; fix in Component library – Loyalty?):**
  1. **Table Header** (toolbar) still uses the old `Search/Enabled/False` (48 tall, Large). Code's toolbar search is
     Small (40, 343 wide, §9.67): swapped to **Search** `Size=Small` on every frame.
  2. **Side Menu** labels are Title Case ("Loyalty Management", "Program Configuration"…); the product is sentence case
     ("Programme configuration"): overridden on every frame.
  3. **Side Menu** user row is the old List-base (photo, right chevron): swapped to **Side nav user** `Type=Expanded`,
     Avatar `Type=Text` "OJ", as the page.
  4. **Pagination group**: the next arrow's glyph is overridden to `fg-primary`, so it stays dark when Disabled (the
     previous arrow goes `fg-disabled`); and the two use different glyphs (`keyboard_arrow_left` / `chevron_right`).
     Recoloured here.
  5. **Dialog box**: the body Text Box (648) and the Button dock (696) have fixed widths, so the dialog doesn't fit
     608: set to fill here.
  6. **Side sheet**: its Button dock's buttons are set to fill (the Button dock itself hugs them at the right, C13);
     the Title slot's Text Box has a fixed 40 height (a description overflows): both overridden.
  7. **No destructive tone on all-button**: the separate **Destructive-button** set was swapped into the Base-button.
  8. **Slot content keeps its overrides across variant changes**: switching a field Enabled → Complete kept the value
     text in `text-placeholder`, and a toggle row Default → Selected kept its switch off (the switch is slot content):
     fixed by hand. Worth knowing for designers editing these screens.
- **Reference:** Storybook stories screenshotted at 1920 (local, from `main`), compared frame by frame.

### S2 · Tier management: 17 Nov 2026

- **Section** `1060:4739` "Tier management", under S1, laid out the same way (row 1 the flow, row 2 the empty states).
  Started as a copy of S1's frames, so every S1 workaround below carries over. App shell as S1, with **Tier management**
  selected in the Side Menu's Loyalty management group (Side Menu has no Tier management variant: sub-item states
  overridden); Main header "Tier management" / "Thresholds and earn multipliers".

  | Frame | Node | Story | Built from |
  |---|---|---|---|
  | List | `1060:4740` | List | **Table** `Style=Bordered`: search "Search tier", "Add tier" with `add`; 7 columns as code: No. (80), Level (filter arrow), Tier name (Link cell), Upgrade threshold (pts) (Link, 216), Downgrade threshold (pts) (Link, 232), Earn multiplier (Link), Status (Badge, filter arrow; Active Success, Inactive Neutral); rows Silver, Gold, Platinum, sorted by level; footer "Showing 1–3 of 3 entries in page 1" |
  | Add | `1060:4742` | Add tier | List + Overlay + Side sheet (632), no close button; title "Add tier" / "Tiers are common to every segment"; body: six Small fields **two by two** (rows and columns Space-3XL apart, as the page's grid): Tier name, Level (**Input field-select**), Upgrade threshold and Downgrade threshold (Suffix "Points" and helper text), Earn multiplier (×), Status (select); dock Cancel + Save tier |
  | Details | `1060:4746` | Details | Side sheet with the close button, title "Gold details"; Table `Style=Default` Attribute / Added record, 7 rows (links as plain text, Status a Success badge); dock Remove + Edit |
  | Edit | `1060:4750` | Edit tier | The Add sheet with every field `Complete` (Gold, Intermediate, 5000, 4000, 2.00, Active, unformatted as code's inputs), title "Edit tier", Save `Disabled` |
  | Remove | `1060:4754` | Remove tier | List + Overlay + Dialog box: "Remove tier", "Are you sure you want to remove the “Silver” tier?", Cancel + Remove (Destructive) |
  | Removed | `1060:4758` | Removed | List without Silver ("Showing 1–2 of 2 entries in page 1") + Snackbar Success "Tier removed successfully" |
  | No tiers | `1060:4761` | No tiers | Empty state Medium (`loyalty`, "No tiers yet", "Add a tier to set the points members need to reach it and how fast they earn there.", "Add tier" with `add`) |
  | No matches | `1060:4763` | No matches | Empty state Small (`search`, "No tiers match “Bronze”", "Clear search and filters"); the search **Typing** "Bronze" |

- **Not like code:** the snackbar is the component's 343 wide, as S1.
- **Library issues found (in addition to S1's):**
  9. **Side sheet**: the Body content slot clips its content, so a `Complete` field in the first row loses the top of
     its floating label: clipping turned off on the Add and Edit sheets.
  10. **Table - Cell**: switching `Type` keeps the old slot content (a Default cell switched to Badge still holds its
      text), as #8: cells of another type were replaced with fresh instances of the right variant.
- **Figma quirk:** a field cloned from a 584-wide field into a 280-wide column kept drawing at the old width (right edge
  cut off) until it was resized; resized on every field here.
- **Reference:** Storybook stories screenshotted at 1920 (local, from `main`), compared frame by frame.
