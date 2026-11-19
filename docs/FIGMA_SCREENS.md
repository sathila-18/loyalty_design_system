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
| S3 | Reward catalog | Pages/Loyalty Management/Reward Catalog | ✅ 17 Nov 2026 |
| S4 | Focus areas | Pages/Gamification/Focus Areas | ✅ 17 Nov 2026 |
| S5 | Badges | Pages/Gamification/Badges | ✅ 17 Nov 2026 |
| S6 | Reports | Pages/Report Management/Reports | ✅ 17 Nov 2026 |
| S7 | Login | Pages/Login | ✅ 17 Nov 2026 |
| S8 | Forgot password | Old Figma screens `435:90303`, `435:90402` (Admin UIs, Login Option 02) | ✅ 17 Nov 2026 |
| S9 | Reset password | Old Figma screens `150:5950`, `435:90550` (Admin UIs, Login Option 02) | ✅ 17 Nov 2026 |
| S10 | System users | Old Figma screens, section `188:13373` (Admin UIs) | ✅ 17 Nov 2026 |
| S11 | Role management | Old Figma screens, section `196:18060` (Admin UIs) | ✅ 17 Nov 2026 |
| S12 | System audit | Old Figma screens, section `208:41600` (Admin UIs) | ✅ 19 Nov 2026 |
| — | Dashboard | not built in code, no reference yet | to decide |

**S8–S12: screens not built in code (agreed with design 17 Nov 2026).** The old Figma screens give the **content**
only (text, fields, columns, sample data, states). Everything else follows the screens above: the same library
components and layout patterns (App shell or Sign in layout, Table with search in its toolbar and **filters in the
column headers**, not the old screens' filter chips beside the buttons; side sheets, dialogs, snackbars, empty
states). One flow at a time, in this order, each approved before the next.

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

### S3 · Reward catalog: 17 Nov 2026

- **Section** `1066:9060` "Reward catalog", under S2. Row 1 the flow (list, the four Add reward steps, details,
  remove, removed), row 2 Edit and the empty states. Started as a copy of S2's frames (S1's workarounds carry over).
  App shell as before with **Reward catalog** selected; Main header "Reward catalog" / "Rewards members can redeem
  with their points". The Add reward steps aren't separate stories: their content is from stepping through the Add
  and Edit reward stories in Storybook (Edit marks every step done and clickable).

  | Frame | Node | Story | Built from |
  |---|---|---|---|
  | List | `1066:9061` | List | **Table** `Style=Bordered`: search "Search reward", "Add reward"; 6 columns as code: ID (120), Reward name, Partner, User limit, Users, Status (176, Badge, filter arrow: Draft Secondary, Published Success, Limit exceed Warning, Expired Error); Figma's 10 rows (N/A where none); "Showing 1–10 of 10 entries in page 1" |
  | Add reward · Reward | `1066:9063` | Add reward | Side sheet, the sheet's own title (Text Box Display Small-H3) "Add reward", no close button; **Stepper** `Steps=4, Current=1`; "Basic details": Reward name, Event (select); "Availability": Provider (**Input field-Multi select** Small), Run for lifetime (List_fill-toggle, off), Start date + End date (**Input field-date**, side by side Space-XL apart); dock Cancel + Next |
  | Add reward · Rules | `1066:9910` | (Add reward, step 2) | Back button on; Stepper `Current=2` (Reward Done); "Qualifying transaction": Minimum transaction value (LKR); "Reward value": panels Type (Discount, Cash back (Points are earned)) and Value (Fixed amount, Percentage), Discount amount (LKR); panel Give the reward (On every qualifying event, Count of the nth qualifying event); "Cost to the customer": Points cost, Customer must enter a promo code (toggle); "Limits": Maximum claim duration (select) + Maximum claims per customer (Customer), Max total uses of campaign (optional) (Uses, helper "Leave it empty for no limit"). **Frame 1468 tall**: the whole step |
  | Add reward · Eligibility | `1066:10061` | (Add reward, step 3) | Stepper `Current=3`; "Who can claim this reward": panel All eligible segments (All customers (All tiers & segments) chosen, Tier only, Segment only, Rules - segments & tiers); Badge after completion (select) |
  | Add reward · UX | `1066:10212` | (Add reward, step 4) | Stepper `Current=4`; "Offer text, shown in the reward catalogue": Headline, Description (**Input field-textArea**); "Notifications": Push notification (toggle); dock Save as draft (tertiary, left) + Cancel + Publish |
  | Details | `1066:9067` | Details | "Transaction fee details": ID RW-002, Reward name, Partner SLT, User limit 20, Users 20, Status Published |
  | Remove reward | `1066:9075` | Remove reward | "Remove reward", "Are you sure you want to remove the “Cash back” reward?" |
  | Removed | `1066:9079` | Removed | List without Cash back ("Showing 1–9 of 9 entries in page 1") + Snackbar "Reward removed successfully" |
  | Edit reward | `1066:9071` | Edit reward | Step 1 `Complete`: Transaction fee, Bill payment, Provider chip SLT (Input chip), 01/08/2026 – 31/07/2027; Stepper: Reward current, the rest Done (Edit: every step done); title "Edit reward", Cancel + Save `Disabled` |
  | Edit reward, rules | `1066:10363` | Edit reward, rules | Step 3: Rules - segments & tiers chosen; "Create a rule": Segment + Tier (selects), Add rule (all-button Secondary Medium, `add`, full width); "Added rules": Table `Style=Default` Segment / Tier with Row actions, 5 rules; Badge after completion `Complete` "Budget builder". **Frame 1198 tall** |
  | No rewards | `1066:9082` | No rewards | Empty state Medium: "No rewards yet", "Add a reward for members to redeem with their points.", "Add reward" |
  | No matches | `1066:9084` | No matches | Empty state Small: "No rewards match “Lottery”"; the search **Typing** "Lottery" |

- **Panels** (the grey frames round the radio cards): drawn on the screens as code's page CSS does (the library has no
  panel): bg-secondary, Radius-L, Space-XL padding, the title (Label/Small, as the section titles) Space-L above the
  cards, cards Space-L apart.
- **Not like code:** the two long steps are drawn at full height (the product scrolls the sheet body); the stepper is
  560 wide (code stretches its lines to fill 584); the snackbar is 343 wide, as S1.
- **Library issues found (in addition to S1's and S2's):**
  11. **Input field-date** has no Size: Large only (48). Code's is Small: the nested Input field-base set to Small
      here; its calendar icon stays 24 (code 20).
  12. **List_fill-radio_button** has no Size either: Large shows the title 16 semibold; code's small cards are 14
      medium: the nested List_fill-base set to Small.
  13. **Stepper** can't fill its container (80-wide steps, fixed 124 lines).
  14. **all-button**: changing Type or Size resets the leading icon (to `person`): swapped back to `add`.
  15. **Input chip**: the Chips-base "Label text" property didn't change the chip's text here: set on the text.
- **Figma quirks:** fields, radio cards and the multi-select drawn at their old width after cloning or a Size change
  (resized to fix, as S2); the half-width "Maximum claims per customer" placeholder clipped before its suffix, as code.
- **Reference:** Storybook stories screenshotted at 1920 (local, from `main`), the Edit reward steps opened from the
  stepper, compared frame by frame.

### S4 · Focus areas: 17 Nov 2026

- **Section** `1075:20402` "Focus areas", under S3. Three levels, one row each: focus areas, lessons, questions. A new
  section (frames copied from S3's), with the section's variable modes set as S1–S3's (Alias Colors **Burgundy
  theme**, Color collection Light): without them the screens render in the Finspace purple.
- **App shell:** Side Menu `Menu=Gamification` (Gamification open, **Focus areas** selected, Badges); Main header as
  the level: "Focus areas" / "Topics members learn about, in lessons and questions"; lessons and questions with the
  **back button** and the breadcrumb as the description ("Focus areas › Lessons", "Focus areas › Using BNPL
  responsibly › Questions").

  | Frame | Node | Story | Built from |
  |---|---|---|---|
  | List | `1075:20403` | List | Table: "Search focus area", "Add focus area"; Order (120), Focus area, Lessons (200, Link cell "10 lessons"), Status (176, Badge, filter: Published Success, Draft Secondary); Figma's 10 rows |
  | Add focus area | `1075:21523` | Add focus area | Sheet title (Display Small-H3) "Add focus area", no close button; "Details": Focus area name, Short description (textArea), Badge after completion (optional) + Order (`Complete` "11", helper "The others move down to make room"); "Status": Published (toggle, off); Cancel + Save focus area |
  | Edit focus area | `1075:22872` | Edit focus area | Budgeting basics, "Learn about budgeting basics.", Order 02, Published on; Save `Disabled` |
  | Remove focus area | `1075:24243` | Remove focus area | "Are you sure you want to remove the “Budgeting basics” focus area? Its 4 lessons will be removed too." |
  | No focus areas | `1075:25406` | No focus areas | Empty state Medium, `sports_esports`: "No focus areas yet", "Add focus area" |
  | No matches | `1075:25660` | No matches | Empty state Small: "No focus areas match “Lottery”" |
  | Lessons | `1075:25913` | Lessons | Header "Using BNPL responsibly" with back; Order, Lesson topic, Questions (200, Link "5 questions"), Status; 10 rows |
  | Add lesson | `1075:27033` | Add lesson | Title Text Box Headline Large-H4 "Add lesson" / "Using BNPL responsibly"; "Lesson": Topic, Description; "Example": Example topic (optional), Example description (optional); "After the lesson": Trigger event (after success) + Order 11, panel Tiers (**List_fill-checkbox** Basic, Silver, Gold); "Status": Published; Cancel + Save lesson. **Frame 1200 tall** |
  | No lessons | `1075:28382` | No lessons | Header the long focus area name; Empty state: "No lessons yet", "Add a lesson to teach members about spotting scam messages…" |
  | Questions | `1075:28636` | Questions | Header "What is an instalment plan" with back; No. (120), Question, Options (160), Points (160); 5 rows, "Showing 1–5 of 5 entries in page 1" |
  | Question details | `1075:29756` | Question details | "Question 01 details": No., Question, Answer options, Correct option, Tiers, Explanation, Points; long values end in "…" as code |
  | Add question | `1075:31097` | Add question | "Add question" / "What is an instalment plan"; **Notification** `Type=Info` "Question rule" (no close, no button; the four rules as a bulleted list); "Question": Question, panel Tiers; "Answer options": panel "Select the correct one" with Option + **Add option** (all-button Primary Medium, `add`) Space-L apart; "After answering": Explanation shown after answering (textArea), Points per correct answer (Points); Cancel + Save question. **Frame 1161 tall** |
  | Edit question | `1075:32446` | Edit question | Values filled, Tiers all ticked; Option and Add option `Disabled`, Helper text with its info icon "A question has up to 4 options. Remove one to add another."; four options, each a radio card (Four payments chosen) and a delete button (all-button Tertiary Only Icon Small, `delete` in fg-error) Space-S apart; Save `Disabled`. **Frame 1477 tall** |
  | No questions | `1075:33817` | No questions | Header "Choosing the right plan length"; Empty state: "No questions yet", "Add a question" |

- **Not like code:** long sheets drawn at full height (the product scrolls), as S3; the snackbar isn't drawn (no
  Removed story here).
- **Library issues found (in addition to S1–S3's):**
  16. **Side Menu** `Menu=Gamification`: its items are "Badge Management" then "Focus & Learning" (the product:
      "Focus areas" then "Badges") and Title Case, and Gamification is `Selected - BG` (a pill) where the Loyalty
      variants use `Selected`: all overridden.
  17. **Input field-textArea** `Complete` shows the value in text-placeholder: recoloured to text-primary (as #8).
  18. **all-button** has no error tone for Tertiary (code: `contentTone="error"`): the delete icon recoloured to
      fg-error, as the library's "Tertiary tones (overrides)" says.
- **Figma quirks:** clones and new instances drawn at old widths until resized (every field in the sheets resized);
  Table cell text doesn't fill its cell, so the ellipsis needed a fixed width.
- **Reference:** Storybook stories screenshotted at 1920 (local, from `main`), compared frame by frame.

### S5 · Badges: 17 Nov 2026

- **Section** `1084:29493` "Badges", under S4 (copied from S4's frames; the section's modes set as S4's: Alias Colors
  Burgundy theme, Color collection Light). App shell: Side Menu Gamification with **Badges** selected; Main header
  "Badges" / "Badges members earn as they use the programme", no back button.

  | Frame | Node | Story | Built from |
  |---|---|---|---|
  | List | `1084:29494` | List | Table: "Search badge", "Add badge"; ID (120), Badge name (the cell's leading accessory an **Avatar** Small 32 before the name), Status (176, Badge, filter: Active Success, Inactive Neutral); Figma's 4 rows; "Showing 1–4 of 4 entries in page 1" |
  | Add badge | `1084:29671` | Add badge | Sheet title "Add badge" **with the close button and no Cancel** (as code, decided 28 Oct 2026); "Badge": **File uploads** `Size=Large, State=Enabled` ("Upload badge icon", "(JPEG, PNG) / Max file size: 5 MB", Upload), Badge name; "Status": Active (toggle on), "Inactive badges are hidden from the badge list when creating a reward"; dock Save badge only |
  | Edit badge | `1084:29885` | Edit badge | File uploads `State=Complete` "early-adopter.png" with Delete; Badge name `Complete` "Early adopter"; Active on; Save `Disabled` |
  | Details | `1084:30099` | Details | "Top server details": ID 02, Badge name (avatar + "Top server"), Status Active |
  | Remove badge | `1084:30277` | Remove badge | "Remove badge", "Are you sure you want to remove the “Early adopter” badge?" |
  | Removed | `1084:30458` | Removed | List without Early adopter ("Showing 1–3 of 3 entries in page 1") + Snackbar "Badge removed successfully" |
  | No badges | `1084:30635` | No badges | Empty state Medium, `loyalty`: "No badges yet", "Add a badge members can earn, for example by completing a focus area.", "Add badge" |
  | No matches | `1084:30661` | No matches | Empty state Small: "No badges match “Lottery”" |

- **Not like code:** the badge icons are uploaded artwork; the stories draw placeholders (a coloured disc with the
  name's first letter). The screens use Avatar `Type=Text` with the letter (neutral), not an image; the snackbar is
  343 wide, as S1.
- **Figma note:** a new section must get the Alias Colors mode by the collection's exact id
  (`…/18268:346`); copying it through another id of the same collection (`…/18133:365`) passes the plugin check but
  the screens still render in Finspace.
- **Reference:** Storybook stories screenshotted at 1920 (local, from `main`), compared frame by frame.

### S6 · Reports: 17 Nov 2026

- **Section** `1087:35607` "Reports", under S5. Row 1 the customer list, row 2 a customer's points history. App shell:
  Side Menu (Loyalty variant) with Loyalty management closed and **Report management** `Selected`; read only, so the
  Table toolbar's button is off (Show Button).

  | Frame | Node | Story | Built from |
  |---|---|---|---|
  | List | `1087:35608` | List | Header "Reports" / "Points earned, redeemed, converted and expired, by customer"; **Stat card** ×4 (Total points 138,900, Reward redemption (pts) 52,500, Cash conversion (pts) 17,600, Points expired 0), equal columns Space-4XL apart; Table: search "Search customer name or number"; No. (96), Customer, Tier (144, filter), Segments (144), Earned, Redeemed, Converted, Expired (128 each), Active balance (160, Link cell), Last activity (152); ⋮ on each row (View); Figma's 10 customers |
  | No customers | `1087:36768` | No customers | Cards all 0; Empty state Medium `loyalty` "No customers yet", "Customers show here once they earn or use points.", no button |
  | No matches | `1087:37041` | No matches | Search Typing "Lottery"; Empty state Small "No customers match “Lottery”" |
  | Points history | `1087:37313` | Points history | Header "Fatima Khan" / "Reports › Points history" with the back button; 3 Stat cards in the first three of four columns (Active points 5,900, Lifetime points 12,400, Expires 31/10/2026 1,200 pts); toolbar search "Search activity" and, in the filter slot, **Assist chip** Large Dropdown "Duration: All"; Table: No. (96), Date (144), Type (200, filter), Description, Points (144), Active balance (160), Lifetime (144); no ⋮ (as code); Figma's 10 activities |
  | Duration filter | `1087:38496` | Duration filter | Mason Lee (11,400 / 25,800 / 1,217 pts), 10 of 15 activities, pagination 1 2 with next enabled; the chip `State=Open`; **standard-menu** under it (4 below, right-aligned), List-standard Small rows without lines: All (Selected), Last 7 days, Last 30 days, Last 3 months, Last 12 months |
  | No activity | `1087:39655` | No activity | Dilini Wickramasinghe: 0, 0, Next expiry N/A; Empty state Medium "No activity yet", "Dilini Wickramasinghe hasn't earned or used any points yet.", no button |

- **Library issues found (in addition to S1–S5's):**
  19. **List-standard** Small with Show Divider off has no bottom padding (37 tall) except the menu's last row (53);
      code's rows without lines are 53 (16 top and bottom): the bottom padding set to the last row's on every row.
  20. **Assist chip** shows Chips-base's leading accessory (a person icon) by default; code's chip has none: turned
      off.
- **Figma note:** setting the section's Alias Colors mode can be stored under another id of the same collection
  (`…/18253:468` here) even when the exact id is passed; check `explicitVariableModes` has `…/18268:346` and set it
  again until it does, or the screens render in Finspace.
- **Reference:** Storybook stories screenshotted at 1920 (local, from `main`); Mason Lee's first five Lifetime values,
  hidden by the open menu in the screenshot, from the stories' data.

### S7 · Login: 17 Nov 2026

- **Section** `1092:36487` "Login", under S6, one row. Each frame 1920 × 1080 holds a **Sign in layout** instance
  (Image panel and Image text on: the trophy artwork, "Customer Engagement Management Portal" and its description, as
  the component's defaults), with the screen's form in its **Form** slot in place of the sample form (608 wide):
  - **Heading** (gap Space-XL): the logo (**Logo sizes** Small Coloured With text, as the side nav's: "Fintech
    loyalty"), Text Box `Display Medium-H2` "Get started now!" / "Please enter the login credentials here".
  - **Form** (Space-4XL below; gap Space-4XL): [banner], Fields (gap Space-XL): **Input field-standard** Large "User
    name/ email", **Input field-password** Large "Password", a row (space between, Space-L): "Forgot password"
    (**all-button** `Type=Link` XSmall, left padding 0 so the label sits on the fields' edge, as code's hanging link)
    and **Checkbox** "Remember me"; then **all-button** Primary Medium "Login", full width.

  | Frame | Node | Story | State |
  |---|---|---|---|
  | Default | `1092:36529` | Default | Empty fields |
  | Empty-field errors | `1092:37339` | Empty-field errors | Both fields `Error=True` with Helper text content Error: "Enter your user name or email", "Enter your password" |
  | Wrong password | `1092:37567` | Wrong password | **Notification** `Type=Error` (no title, close or button) "The user name, email or password is incorrect. Check them and try again."; fields `Complete` (olivia.james@bank.lk, 5 dots) |
  | Submitting | `1092:37858` | Submitting | Fields `Complete` (9 dots); Login `Disabled` "Logging in…" |
  | Success | `1092:38064` | Success | **Notification** `Type=Success` "Signed in (demo). In the real app this opens the dashboard."; fields `Complete` |

- **Library issues found (in addition to S1–S6's):**
  21. **Checkbox** is fixed 343 wide with its text filling; code's checkbox hugs its label: set to hug here so
      "Remember me" sits at the row's end.
  22. **Input field-standard / -password**: the helper slot is empty after switching on Show Helper text (no Helper
      text content in it): a Helper text content `State=Error` placed in it. And a field switched to `Complete` keeps
      its value in text-placeholder (as #8): recoloured to text-primary.
- **Figma notes:** copying a frame that holds an instance with filled slots (Sign in layout) leaves a copy whose slot
  content can't be edited by script: each state is a new Sign in layout with the form copied into its slot.
- **Reference:** Storybook stories screenshotted at 1920 (local, from `main`), compared frame by frame.

### S8 · Forgot password, S9 · Reset password: 17 Nov 2026

- **Source:** the old screens in section `150:6161` "Login Option 02" (page Admin UIs), content only. Not built in
  code. Layout as S7: each frame a **Sign in layout** instance with the screen's content (608 wide) in its Form slot,
  built from the same parts as the Login form (Text Box `Display Medium-H2`, Large fields, all-button Primary Medium
  full width, the hanging Link button). Artwork as code plans (`SignInScreen`): the trophy with the portal's title and
  description on Reset password; the **detective** alone (Image text off) on the other three, the old screens' image
  and colour adjustments (saturation, temperature, tint) copied onto the panel's Image fill.
- **Text decisions (design, 17 Nov 2026):** the Forgot password button keeps the old screen's "Login"; field labels in
  sentence case ("New password", "Confirm password"); the trailing space of "Password reset " dropped.
- **S8** section `1097:37058` "Forgot password":

  | Frame | Node | Old screen | Built from |
  |---|---|---|---|
  | Forgot password | `1097:37059` | `435:90303` | "Back" (all-button `Type=Link` XSmall, `arrow_back` leading, left padding 0), Space-XL above the Text Box "Forgot password" / "Please enter the email address on the below options to get a password reset link."; Space-4XL; Input field-standard Large "Email"; Space-4XL; "Login" |
  | Reset link sent | `1097:37274` | `435:90402` | **48px bg** `State=Success` with `check` (as File uploads' Complete), Space-XL above the Text Box "Reset link sent" / "Please check your inbox to find an email with the password reset link. Use the link to complete password resetting process." |

- **S9** section `1097:37354` "Reset password":

  | Frame | Node | Old screen | Built from |
  |---|---|---|---|
  | Reset password | `1097:37355` | `150:5950` | Trophy with image text; Text Box "Reset password" (no description); Space-4XL; **Input field-password** Large "New password" with helper "Must be at least 8 characters", "Confirm password" with "Confirm your password" (Space-XL apart; Helper text content without its icon, as the old screen); Space-4XL; "Next" |
  | Password reset | `1097:37512` | `435:90550` | 48px bg Success `check`, Text Box "Password reset" / "Your password has been successfully changed!"; Space-4XL; "Back to login" |

- **Not like the old screens (by the rules above):** the old success icon (a Spinner component with a check) is the
  library's 48px bg Success; headings are the Login's Text Box (Display Medium-H2), not the old smaller titles.
- **Figma note:** a new section's first Alias Colors setting is stored under another id (`…/18133:365`); clearing it
  and setting it again stores `…/18268:346` (checked on both sections).

### S10 · System users: 17 Nov 2026

- **Source:** the old section `188:13373` "User management - System users" (Admin UIs): list `428:53386`, Add
  `428:55936`, Edit and Updated `203:31563`, Remove and Removed `203:31578`. Content only; built as S1–S3.
- **Decisions (design, 17 Nov 2026):** the remove dialog in the built pages' words; the Edit sheet titled "Edit
  system user" (the old one repeats "Add new system user"); current conventions ("Add new user" in sentence case,
  "Status" for the old "Ststus", dates DD/MM/YYYY, Inactive the neutral badge as Tier management and Badges); only the
  old screens' states (no empty-state frames). The old inline edit / delete icons are the ⋮ menu, and the old Status
  and Role chips beside the button are the columns' filters (the S8–S12 rule). The Add sheet is drawn empty and the
  Edit sheet filled with the old screen's values, as the other pages.
- **Section** `1101:80133` "System users". App shell: Side Menu `Menu=User Management` (User management `Selected`,
  sub-items "User roles", **"System users"** selected, sentence case as the old screen's labels); Main header "System
  users" with no description (as the old screen; Body content off).

  | Frame | Node | Old screen | Built from |
  |---|---|---|---|
  | List | `1101:80134` | `428:53386` | Table: search "Search user name/ email", "Add new user" with `add`; No. (80), User name, First name (160), Last name (160), Email, Role (144, filter), Created date (152), Updated date (152), Status (176, Badge, filter: Active Success, Inactive Neutral); ⋮ on each row; the old 10 users; "Showing 1–10 of 10 entries in page 1" |
  | Add new system user | `1101:80374` | `428:55936` | Side sheet, its own title (Display Small-H3) "Add new system user" **with the close button** (as the old screen) and Cancel + Create user; fields Small, Space-XL apart: NIC; First name + Last name; Email; User name + Contact number (**Input field-standard `Type=Mobile number`**: flag, +94); Date of birth (Input field-date, nested Small) + Role (select) |
  | Edit system user | `1101:80525` | `203:31563` | The same, `Complete`: 956678437V, Fatima, Khar, fatimakhar@email.com, Fatima, +94 77 554 7776, 12/08/1996, Admin; Status (select) Active; a grey panel (bg-secondary, Radius-L, Space-XL padding, as S3's) with Text Box `Headline Small-H6` "Reset password" / "Send password reset email." and all-button Primary Small "Send email"; Cancel + Update `Disabled` (as the other edit sheets) |
  | Updated | `1101:80676` | `203:31563` | List + Snackbar Success "User details updated successfully!" |
  | Remove user | `1101:80897` | `203:31578` | Dialog "Remove user", "Are you sure you want to remove the “Fatima Khar” user?", Cancel + Remove |
  | Removed | `1101:81141` | `203:31578` | List without Fatima Khar ("Showing 1–9 of 9 entries in page 1") + Snackbar "User removed successfully!" |

- **Library issues found:** 23. **Side Menu** `Menu=User Management`: items "User Roles", "System Users" (Title Case)
  and User Management `Selected - BG`, as #16: overridden.

### S11 · Role management: 17 Nov 2026

- **Source:** the old section `196:18060` "Role management" (Admin UIs): list `428:66319`; Create user role empty
  `434:74848` / `434:74877` and filled `428:68571` / `428:73285` (pages 1 and 2); Edit `434:77457` / `434:77486`;
  Updated `434:79954`; Remove `434:81065`, Removed `434:82196`. Content only; built as S10.
- **Decisions (design, 17 Nov 2026):** Edit's primary button "Update" (the old one says "Create"), disabled until a
  change as the other edit forms; the permissions named as the product's pages; the remove dialog and list in the
  built pages' words and conventions ("Add new role"); no empty-state frames. Create / Edit stay **full pages** (back
  button in the header), as the old screens and as the library's checkbox cell was made for ("the Create user role
  screen").
- **Section** `1106:44206` "Role management". Side Menu `Menu=User Management` with **User roles** selected.

  | Frame | Node | Built from |
  |---|---|---|
  | List | `1106:44207` | Header "User roles"; Table: "Search role name", "Add new role"; No. (80), Role name; ⋮; the old 10 roles (Admin, Editor, Viewer, Support, Analyst, Manager, Finance, HR, Legal, IT) |
  | Create user role | `1106:45607` | Header "Create user role" with the back button; Content (Space-4XL apart): Role name (Input field-standard Small, full width); **List_fill-toggle** "Give full access" / "This will give this user role full access to the system." (off); Table without toolbar, select or ⋮ columns: List of permissions, View, Add, Delete, Update, Download, Import (128 each), the actions as **Table - Cell `Type=Checkbox`**: Base-Checkbox Unselected where the action applies, `State=Disabled` where it doesn't (the old screens' disabled dash, as the library decided); 10 of 14 permissions, pagination 1 2; Go back (Secondary Medium) + Create (Primary Medium, `Disabled`) |
  | Create user role, page 2 | `1106:47015` | The last 4 permissions, page 2 selected |
  | Create user role, filled | `1106:48423` | Role name "Admin"; every applicable action ticked; Create enabled |
  | Create user role, filled, page 2 | `1106:49831` | As above, page 2 |
  | Edit user role | `1106:51239` | Header "Edit user role"; filled as Admin; Go back + Update `Disabled` |
  | Edit user role, page 2 | `1106:52647` | As above, page 2 |
  | Updated | `1106:54055` | List + Snackbar "User role updated successfully!" |
  | Remove user role | `1106:55478` | "Remove user role", "Are you sure you want to remove the “Manager” user role?" |
  | Removed | `1106:56921` | List without Manager (9) + Snackbar "User role removed successfully!" |

  The permissions and their actions (V View, A Add, D Delete, U Update, Dl Download, I Import), from the old screens:
  Dashboard V; Programme configuration, Tier management, Reward catalog, Badges, System configuration V A D U; Focus
  areas, Focus areas - Lessons, Focus areas - Questions V A U; Report management, Report management - Customer, System
  audit - Audit trail V Dl I; User management - System users V A D U Dl; User management - User roles V A D U.
- **Not like the old screens:** Pagination's previous arrow on page 2 still looks disabled (S1 issue #4, the arrows'
  glyph colours are overridden in Pagination group).

### S12 · System audit: 17 Nov 2026

- **Source:** the old section `208:41600` "System audit" (Admin UIs): list `434:83306`, date range `435:85266`,
  details `435:86927`. Content only; built as S6 (read-only list with a toolbar chip) and S10.
- **Decisions (design, 17 Nov 2026):** the toolbar keeps the old screen's button, as "Add new user" (sentence case);
  the sample data tidied: row 07's Page "Sofia" is "Badges", and the details sheet shows row 01 (Fatima Khar, Admin:
  Question / Focus area / Update) with the old sheet's other values. Conventions as S10: "Audit trail" (the old menu
  says "Audit Trial"), "Section" for "Sections", the date 28/09/2026, 08:19:40. Section and Task are the columns'
  filters; the old "Start to end: All" range stays a toolbar chip (a range isn't a column filter), as Reports'
  Duration; the old eye icon is the ⋮ menu (View).
- **Section** `1112:51196` "System audit". Side Menu `Menu=System Audit`, System audit `Selected`, **Audit trail**
  selected; Main header "Audit trail" (no description, as the old screen).

  | Frame | Node | Built from |
  |---|---|---|
  | List | `1112:51197` | Toolbar: search "Search action by", **Assist chip** Large Dropdown "Start to end: All" (no leading icon, #20), "Add new user"; Table: No. (80), Section (200, filter), Page (200), Task (144, filter), Description, Action by (200); ⋮; the old 10 rows |
  | Start to end | `1112:53127` | The chip `Open`; **standard-menu** (400 wide, 4 below, right-aligned) holding Start date + End date (Input field-date Small, labels shown, Space-XL apart) and "Apply" (all-button Primary Medium, full width), Space-XL padding |
  | Audit trail details | `1112:54769` | Overlay + Side sheet (close button) "Audit trail details": Table Column / Value, 10 rows (Audit ID 2026094758948, User name Fatima Khar, Created date & time 28/09/2026, 08:19:40, Old value N/A, New value N/A, User role Admin, Section description Question, Page description Focus area, Task description Update, Description N/A); dock "Done" only |

- **Library issues found:** 24. **Side Menu** `Menu=System Audit`: its page is "Audit Trial" (typo) and Title Case
  items, as #16 / #23: overridden.
