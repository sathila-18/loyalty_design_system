// A Server Component (no 'use client'). It imports the library directly and renders interactive components (each
// a Client Component inside the library) and presentational ones, with serialisable props only. The parts that need
// functions (onClick, getRowId, a link component) are in ClientPart.tsx, the app's own Client Component.
import {
  FinBadge,
  FinCheckbox,
  FinIcon,
  FinPagination,
  FinSelectField,
  FinTextField,
  FinToggle,
  FinTooltip,
} from '@finspace-loyalty/ui';
import { ClientPart } from './ClientPart';

export default function Page() {
  return (
    <main data-testid="page">
      <FinTextField label="Member name" placeholder="Olivia James" />
      <FinSelectField
        label="Tier"
        options={[
          { value: 'gold', label: 'Gold' },
          { value: 'silver', label: 'Silver' },
        ]}
      />
      <FinCheckbox>Send a welcome email</FinCheckbox>
      <FinToggle label="Active" />
      <FinPagination pageCount={5} />
      <FinTooltip content="More about tiers">
        <button type="button">Tiers</button>
      </FinTooltip>
      <FinBadge tone="success">Active</FinBadge>
      <FinIcon name="loyalty" />
      <ClientPart />
    </main>
  );
}
