'use client';

// The app's own Client Component: the props that are functions (onClick, getRowId, a router's link component).
import Link from 'next/link';
import { useState } from 'react';
import { FinButton, FinSideNav, FinTable } from '@finspace-loyalty/ui';

type Member = { id: string; name: string; tier: string };
const MEMBERS: Member[] = [
  { id: '1', name: 'Olivia James', tier: 'Gold' },
  { id: '2', name: 'Kasun Perera', tier: 'Silver' },
];

export function ClientPart() {
  const [clicks, setClicks] = useState(0);
  return (
    <>
      <FinSideNav linkAs={Link} currentHref="/" defaultType="expanded" sections={[{ icon: 'person', label: 'Members', href: '/' }]} />
      <FinButton onClick={() => setClicks((n) => n + 1)}>Add member</FinButton>
      <p data-testid="clicks">{clicks}</p>
      <FinTable
        label="Members"
        rows={MEMBERS}
        getRowId={(row) => row.id}
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'tier', header: 'Tier' },
        ]}
      />
    </>
  );
}
