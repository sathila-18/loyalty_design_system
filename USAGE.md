# Using @finspace-loyalty/ui in a React Project

A complete guide with working examples for a loyalty management admin app.

---

## 1. Installation

### Option A — Local path (same machine, dev-friendly)

Build the library once, then point to it by path.

```bash
# Step 1: build the library (run in the design system repo)
cd loyalty_design_system-main
pnpm --filter @finspace-loyalty/tokens build
pnpm --filter @finspace-loyalty/ui build
```

In your consumer project's `package.json`:

```json
{
  "dependencies": {
    "@finspace-loyalty/tokens": "file:../loyalty_design_system-main/packages/tokens",
    "@finspace-loyalty/ui":     "file:../loyalty_design_system-main/packages/ui"
  }
}
```

```bash
pnpm install
```

> Rebuild the library (`pnpm --filter @finspace-loyalty/ui build`) whenever you change components. Changes reflect after the next build.

---

### Option B — .tgz file (portable, no server needed)

```bash
# In the design system repo
pnpm --filter @finspace-loyalty/tokens build
pnpm --filter @finspace-loyalty/ui build

cd packages/tokens && npm pack
# → finspace-loyalty-tokens-0.1.0.tgz

cd ../ui && npm pack
# → finspace-loyalty-ui-0.1.0.tgz
```

Copy both `.tgz` files into your consumer project, then:

```bash
pnpm add ./finspace-loyalty-tokens-0.1.0.tgz
pnpm add ./finspace-loyalty-ui-0.1.0.tgz
```

---

## 2. Project setup

### 2.1 Import CSS

Add these four imports **once**, at the very top of your app entry point. Order matters.

```ts
// src/main.tsx
import '@finspace-loyalty/tokens/tokens.css';   // design token CSS variables
import '@finspace-loyalty/tokens/styles.css';   // shadows, grid helpers
import '@finspace-loyalty/ui/index.css';        // reset + Inter font
import '@finspace-loyalty/ui/components.css';   // pre-compiled component styles

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

> **No Tailwind setup needed.** Component styles are pre-compiled. You do not need to install or configure Tailwind CSS in the consumer project.

### 2.2 Set theme on \<html\>

All theming is controlled by `data-theme` and `data-brand` attributes on the `<html>` element.

```html
<!-- index.html -->
<html data-theme="light" data-brand="finspace" lang="en">
```

Or set them from JavaScript (useful for a theme toggle):

```ts
// Set once at app startup, or on toggle
document.documentElement.setAttribute('data-theme', 'light'); // 'light' | 'dark'
document.documentElement.setAttribute('data-brand', 'finspace'); // 'finspace' | 'burgundy'
```

### 2.3 Peer dependencies

The library requires React 19. Make sure your project has it:

```json
{
  "dependencies": {
    "react":     "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

---

## 3. Component examples

All components are imported from `@finspace-loyalty/ui`.

```ts
import {
  FinButton,
  FinTextField,
  FinBadge,
  FinAvatar,
  FinStatCard,
  FinToggle,
  FinIcon,
  FinDialog,
  FinTable,
  FinSideSheet,
  // ... any other component
} from '@finspace-loyalty/ui';
```

---

### 3.1 FinButton

```tsx
import { FinButton } from '@finspace-loyalty/ui';

// Primary
<FinButton variant="primary">Add member</FinButton>

// Secondary
<FinButton variant="secondary">Export report</FinButton>

// Tertiary
<FinButton variant="tertiary">Cancel</FinButton>

// With leading icon
<FinButton variant="primary" icon="leading" iconName="add">
  Add programme
</FinButton>

// With trailing icon
<FinButton variant="secondary" icon="trailing" iconName="download">
  Download CSV
</FinButton>

// Icon only (accessible label required as children)
<FinButton variant="tertiary" icon="only-icon" iconName="filter_list">
  Filter
</FinButton>

// Destructive
<FinButton tone="destructive" variant="primary">Delete member</FinButton>
<FinButton tone="destructive" variant="secondary">Remove tier</FinButton>

// Disabled
<FinButton variant="primary" disabled>Save changes</FinButton>

// Loading state (show spinner alongside)
<FinButton variant="primary" disabled aria-busy="true">
  Saving…
</FinButton>
```

---

### 3.2 FinTextField

```tsx
import { FinTextField } from '@finspace-loyalty/ui';
import { useState } from 'react';

// Default — uncontrolled
<FinTextField
  label="Programme name"
  placeholder="e.g. Platinum Rewards"
/>

// With helper text
<FinTextField
  label="Points multiplier"
  placeholder="1.5"
  helperText="Applied to base points earned per transaction"
/>

// Error state
<FinTextField
  label="Email address"
  value="not-an-email"
  error
  helperText="Enter a valid email address"
/>

// With trailing icon
<FinTextField
  label="Search members"
  placeholder="Name or member ID"
  trailingIcon="search"
/>

// Disabled
<FinTextField
  label="Member ID"
  value="MBR-00142"
  disabled
/>

// Mobile number variant
<FinTextField
  variant="mobile-number"
  label="Contact number"
  defaultCountry="LK"
  placeholder="77 123 4567"
/>

// Payment variant
<FinTextField
  variant="payment"
  label="Card number"
  placeholder="1234 5678 9012 3456"
/>

// Controlled example
function ProgrammeNameField() {
  const [name, setName] = useState('');
  return (
    <FinTextField
      label="Programme name"
      value={name}
      onChange={e => setName(e.target.value)}
      helperText={`${name.length}/80 characters`}
      error={name.length > 80}
    />
  );
}
```

---

### 3.3 FinBadge

```tsx
import { FinBadge } from '@finspace-loyalty/ui';

// Status tones
<FinBadge tone="success" label="Active" />
<FinBadge tone="warning" label="Expiring soon" />
<FinBadge tone="error"   label="Suspended" />
<FinBadge tone="info"    label="Pending approval" />
<FinBadge tone="neutral" label="Draft" />

// With icons
<FinBadge tone="success" label="Verified"      leadingIcon="check_circle" />
<FinBadge tone="error"   label="Fraud alert"   leadingIcon="warning" />
<FinBadge tone="warning" label="Expiring soon" trailingIcon="schedule" />

// Real usage — membership tier
function TierBadge({ tier }: { tier: 'gold' | 'silver' | 'platinum' }) {
  const config = {
    gold:     { tone: 'warning' as const, label: 'Gold' },
    silver:   { tone: 'neutral' as const, label: 'Silver' },
    platinum: { tone: 'info'    as const, label: 'Platinum' },
  };
  return <FinBadge {...config[tier]} />;
}
```

---

### 3.4 FinStatCard

```tsx
import { FinStatCard } from '@finspace-loyalty/ui';

// Basic stat cards
<FinStatCard label="Total members"     value="24,816" />
<FinStatCard label="Active programmes" value="6" />
<FinStatCard label="Points issued"     value="4,208,500 pts" />
<FinStatCard label="Points redeemed"   value="1,340,200 pts" />

// With formatted value
<FinStatCard
  label="Redemption rate"
  value={
    <span>
      31.8% <small style={{ fontSize: '14px', color: 'var(--fin-fg-secondary)' }}>↑ 4.2%</small>
    </span>
  }
/>

// Real usage — dashboard stat row
const dashboardStats = [
  { label: 'Total members',     value: '24,816' },
  { label: 'Active programmes', value: '6'       },
  { label: 'Points issued',     value: '4,208,500 pts' },
  { label: 'Points redeemed',   value: '1,340,200 pts' },
];

function DashboardStats() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {dashboardStats.map(stat => (
        <FinStatCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}
```

---

### 3.5 FinAvatar

```tsx
import { FinAvatar } from '@finspace-loyalty/ui';

// Image type with photo
<FinAvatar
  type="image"
  src="https://example.com/photo.jpg"
  initials="OJ"
  label="Olivia James"
  size="medium"
/>

// Text type — initials
<FinAvatar type="text" initials="RS" label="Ravi Seneviratne" size="large" />

// Icon fallback
<FinAvatar type="icon" label="Unknown member" size="small" />

// Sizes
<FinAvatar type="text" initials="PK" size="xsmall" />
<FinAvatar type="text" initials="PK" size="small" />
<FinAvatar type="text" initials="PK" size="medium" />
<FinAvatar type="text" initials="PK" size="large" />
<FinAvatar type="text" initials="PK" size="xlarge" />

// With online indicator
<FinAvatar
  type="image"
  src="/photos/maya.jpg"
  initials="MF"
  label="Maya Fernando"
  size="medium"
  online
  onlineLabel="Online"
/>

// Real usage — member list row
interface Member {
  id: string;
  name: string;
  initials: string;
  photo?: string;
  tier: string;
}

function MemberRow({ member }: { member: Member }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <FinAvatar
        type={member.photo ? 'image' : 'text'}
        src={member.photo}
        initials={member.initials}
        label={member.name}
        size="medium"
      />
      <div>
        <div>{member.name}</div>
        <div style={{ color: 'var(--fin-fg-secondary)', fontSize: '12px' }}>{member.tier}</div>
      </div>
    </div>
  );
}
```

---

### 3.6 FinToggle

```tsx
import { FinToggle } from '@finspace-loyalty/ui';
import { useState } from 'react';

// Uncontrolled
<FinToggle label="Enable notifications" />
<FinToggle label="Allow points transfer" defaultChecked />
<FinToggle label="Archived" disabled />

// Controlled
function ProgrammeToggle({ programmeId }: { programmeId: string }) {
  const [active, setActive] = useState(true);

  async function handleChange(checked: boolean) {
    setActive(checked);
    await fetch(`/api/programmes/${programmeId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active: checked }),
    });
  }

  return (
    <FinToggle
      label="Programme active"
      checked={active}
      onChange={e => handleChange(e.target.checked)}
    />
  );
}
```

---

### 3.7 FinIcon

```tsx
import { FinIcon } from '@finspace-loyalty/ui';

// Default (outlined, 24px)
<FinIcon name="loyalty" />
<FinIcon name="people" />
<FinIcon name="settings" />
<FinIcon name="download" />
<FinIcon name="filter_list" />

// Sizes
<FinIcon name="loyalty" size={16} />
<FinIcon name="loyalty" size={20} />
<FinIcon name="loyalty" size={24} />
<FinIcon name="loyalty" size={40} />

// Filled (active/selected state)
<FinIcon name="star" filled />
<FinIcon name="bookmark" filled />

// With accessible label (icon-only context)
<FinIcon name="delete" label="Delete member" />
```

---

### 3.8 FinDialog

```tsx
import { FinButton, FinDialog } from '@finspace-loyalty/ui';
import { useState } from 'react';

function DeleteMemberDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FinButton
        tone="destructive"
        variant="secondary"
        onClick={() => setOpen(true)}
      >
        Delete member
      </FinButton>

      <FinDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete member?"
        description="This will permanently remove Olivia James and all associated points history. This action cannot be undone."
        primaryAction={
          <FinButton tone="destructive" variant="primary" onClick={() => setOpen(false)}>
            Delete
          </FinButton>
        }
        secondaryAction={
          <FinButton variant="tertiary" onClick={() => setOpen(false)}>
            Cancel
          </FinButton>
        }
      />
    </>
  );
}
```

---

### 3.9 FinSideSheet

```tsx
import { FinButton, FinSideSheet, FinTextField } from '@finspace-loyalty/ui';
import { useState } from 'react';

function AddMemberSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <FinButton variant="primary" icon="leading" iconName="person_add" onClick={() => setOpen(true)}>
        Add member
      </FinButton>

      <FinSideSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Add member"
        primaryAction={
          <FinButton variant="primary" onClick={() => setOpen(false)}>Save member</FinButton>
        }
        secondaryAction={
          <FinButton variant="tertiary" onClick={() => setOpen(false)}>Cancel</FinButton>
        }
      >
        <FinTextField label="Full name"      placeholder="e.g. Olivia James" />
        <FinTextField label="Email address"  placeholder="olivia@example.com" />
        <FinTextField
          variant="mobile-number"
          label="Contact number"
          defaultCountry="LK"
        />
        <FinTextField label="Member ID"      placeholder="Auto-generated" disabled />
      </FinSideSheet>
    </>
  );
}
```

---

### 3.10 FinTable

```tsx
import { FinTable } from '@finspace-loyalty/ui';

const members = [
  { id: 'MBR-001', name: 'Olivia James',      tier: 'Platinum', points: 806_400, status: 'active'    },
  { id: 'MBR-002', name: 'Ravi Seneviratne',  tier: 'Gold',     points: 420_150, status: 'active'    },
  { id: 'MBR-003', name: 'Maya Fernando',     tier: 'Silver',   points: 112_300, status: 'active'    },
  { id: 'MBR-004', name: 'Thilina Perera',    tier: 'Gold',     points: 318_900, status: 'suspended' },
  { id: 'MBR-005', name: 'Dinusha Wijeratne', tier: 'Silver',   points:  48_600, status: 'active'    },
];

const columns = [
  { key: 'id',     header: 'Member ID'  },
  { key: 'name',   header: 'Name'       },
  { key: 'tier',   header: 'Tier'       },
  { key: 'points', header: 'Points',    render: (v: number) => v.toLocaleString() },
  { key: 'status', header: 'Status'     },
];

<FinTable columns={columns} rows={members} />
```

---

## 4. Complete page example — Members list

A realistic loyalty admin screen combining multiple components.

```tsx
// src/pages/Members.tsx
import { useState } from 'react';
import {
  FinAvatar,
  FinBadge,
  FinButton,
  FinStatCard,
  FinTextField,
  FinToggle,
  FinDialog,
} from '@finspace-loyalty/ui';

const MEMBERS = [
  {
    id: 'MBR-001',
    name: 'Olivia James',
    initials: 'OJ',
    email: 'olivia.james@example.com',
    tier: 'Platinum',
    points: 806_400,
    status: 'active' as const,
    joinedDate: '12 Jan 2024',
  },
  {
    id: 'MBR-002',
    name: 'Ravi Seneviratne',
    initials: 'RS',
    email: 'ravi.s@example.com',
    tier: 'Gold',
    points: 420_150,
    status: 'active' as const,
    joinedDate: '3 Mar 2024',
  },
  {
    id: 'MBR-003',
    name: 'Maya Fernando',
    initials: 'MF',
    email: 'maya.f@example.com',
    tier: 'Silver',
    points: 112_300,
    status: 'active' as const,
    joinedDate: '19 May 2024',
  },
  {
    id: 'MBR-004',
    name: 'Thilina Perera',
    initials: 'TP',
    email: 'thilina.p@example.com',
    tier: 'Gold',
    points: 318_900,
    status: 'suspended' as const,
    joinedDate: '7 Aug 2023',
  },
  {
    id: 'MBR-005',
    name: 'Dinusha Wijeratne',
    initials: 'DW',
    email: 'dinusha@example.com',
    tier: 'Silver',
    points: 48_600,
    status: 'active' as const,
    joinedDate: '22 Oct 2024',
  },
];

const tierBadgeTone = {
  Platinum: 'info',
  Gold:     'warning',
  Silver:   'neutral',
} as const;

const statusBadgeTone = {
  active:    'success',
  suspended: 'error',
} as const;

export function MembersPage() {
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = MEMBERS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  );

  const memberToDelete = MEMBERS.find(m => m.id === deleteTarget);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ font: 'var(--fin-font-headline-large-h4)', color: 'var(--fin-text-primary)', margin: 0 }}>
          Members
        </h1>
        <FinButton variant="primary" icon="leading" iconName="person_add">
          Add member
        </FinButton>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <FinStatCard label="Total members"   value="24,816" />
        <FinStatCard label="Active"          value="23,104" />
        <FinStatCard label="Suspended"       value="1,712" />
        <FinStatCard label="Avg. points"     value="12,450 pts" />
      </div>

      {/* Search + filter bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <FinTextField
            placeholder="Search by name or member ID"
            trailingIcon="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search members"
          />
        </div>
        <FinButton variant="secondary" icon="leading" iconName="filter_list">
          Filter
        </FinButton>
        <FinButton variant="secondary" icon="leading" iconName="download">
          Export
        </FinButton>
      </div>

      {/* Members list */}
      <div style={{ border: '1px solid var(--fin-border-default)', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr auto',
          padding: '12px 20px',
          borderBottom: '1px solid var(--fin-border-default)',
          font: 'var(--fin-font-label-small)',
          color: 'var(--fin-text-secondary)',
          gap: '16px',
        }}>
          <span>Member</span>
          <span>Email</span>
          <span>Tier</span>
          <span>Points</span>
          <span>Status</span>
          <span />
        </div>

        {/* Rows */}
        {filtered.map(member => (
          <div
            key={member.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr auto',
              padding: '14px 20px',
              borderBottom: '1px solid var(--fin-border-subtle)',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            {/* Member name + ID */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FinAvatar type="text" initials={member.initials} label={member.name} size="medium" />
              <div>
                <div style={{ font: 'var(--fin-font-label-medium)', color: 'var(--fin-text-primary)' }}>
                  {member.name}
                </div>
                <div style={{ font: 'var(--fin-font-caption-medium)', color: 'var(--fin-text-secondary)' }}>
                  {member.id} · Joined {member.joinedDate}
                </div>
              </div>
            </div>

            {/* Email */}
            <span style={{ font: 'var(--fin-font-body-medium)', color: 'var(--fin-text-secondary)' }}>
              {member.email}
            </span>

            {/* Tier */}
            <FinBadge tone={tierBadgeTone[member.tier as keyof typeof tierBadgeTone]} label={member.tier} />

            {/* Points */}
            <span style={{ font: 'var(--fin-font-label-medium)', color: 'var(--fin-text-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {member.points.toLocaleString()}
            </span>

            {/* Status */}
            <FinBadge
              tone={statusBadgeTone[member.status]}
              label={member.status === 'active' ? 'Active' : 'Suspended'}
            />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <FinButton variant="tertiary" icon="only-icon" iconName="edit">
                Edit {member.name}
              </FinButton>
              <FinButton
                tone="destructive"
                variant="tertiary"
                icon="only-icon"
                iconName="delete"
                onClick={() => setDeleteTarget(member.id)}
              >
                Delete {member.name}
              </FinButton>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--fin-text-secondary)' }}>
            No members match "{search}"
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <FinDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete member?"
        description={
          memberToDelete
            ? `This will permanently remove ${memberToDelete.name} (${memberToDelete.id}) and all ${memberToDelete.points.toLocaleString()} points. This action cannot be undone.`
            : ''
        }
        primaryAction={
          <FinButton
            tone="destructive"
            variant="primary"
            onClick={() => setDeleteTarget(null)}
          >
            Delete member
          </FinButton>
        }
        secondaryAction={
          <FinButton variant="tertiary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </FinButton>
        }
      />
    </div>
  );
}
```

---

## 5. Semantic CSS variables (for page layout)

When building page layouts around library components, use the library's semantic CSS variables for consistency. Never use hardcoded colors.

```css
/* Colors */
var(--fin-bg-primary)          /* main page background */
var(--fin-bg-secondary)        /* raised surfaces, cards */
var(--fin-bg-active)           /* stat card background */
var(--fin-text-primary)        /* headings, body text */
var(--fin-text-secondary)      /* helper text, labels */
var(--fin-border-default)      /* table borders, dividers */
var(--fin-border-subtle)       /* row separators */

/* Typography (use the font shorthand) */
font: var(--fin-font-headline-large-h4);  /* h4 heading */
font: var(--fin-font-label-medium);       /* table labels */
font: var(--fin-font-body-medium);        /* body text */
font: var(--fin-font-caption-medium);     /* captions, metadata */
```

Example page layout CSS:

```css
/* src/pages/members.module.css */
.page {
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--fin-bg-primary);
  min-height: 100vh;
}

.heading {
  font: var(--fin-font-headline-large-h4);
  color: var(--fin-text-primary);
  margin: 0;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.table-wrap {
  border: 1px solid var(--fin-border-default);
  border-radius: 12px;
  overflow: hidden;
}
```

---

## 6. Theme toggle (light / dark)

```tsx
// src/components/ThemeToggle.tsx
import { FinButton } from '@finspace-loyalty/ui';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <FinButton
      variant="tertiary"
      icon="only-icon"
      iconName={theme === 'light' ? 'dark_mode' : 'light_mode'}
      onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
    >
      {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    </FinButton>
  );
}
```

---

## 7. Project structure recommendation

```
consumer-project/
  src/
    main.tsx               ← CSS imports + ReactDOM.createRoot
    App.tsx                ← data-theme / data-brand setup
    pages/
      Members.tsx
      Programmes.tsx
      Reports.tsx
    components/
      ThemeToggle.tsx
    brand.css              ← optional: custom brand overrides (see THEMING.md)
  index.html               ← data-theme="light" data-brand="finspace" on <html>
```

---

## 8. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Components render but have no styles | CSS not imported | Add the four imports to `main.tsx` in the correct order |
| Colors look wrong | `data-theme` not set | Add `data-theme="light"` to `<html>` |
| `dist/` not found after install | Library not built | Run `pnpm --filter @finspace-loyalty/ui build` in the design system repo |
| TypeScript errors on props | Stale types | Rebuild the library; `dist/index.d.ts` is generated at build time |
| Icons not showing | Icon font not loaded | The icon font is bundled in `index.css` — make sure that import is present |
| `workspace:*` error | Wrong install method | Use `pnpm publish` not `npm publish`; or use the `.tgz` / `file:` approach |
