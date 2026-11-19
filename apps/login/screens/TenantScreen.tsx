'use client';

import { FinButton, FinListStandardFilled, FinNotificationBanner, FinTextBox } from '@finspace-loyalty/ui';
import { useState } from 'react';
import { AppLogo } from './AppLogo';
import { useLoginPlatform } from './platform';
import { SignInScreen } from './SignInScreen';

export interface TenantOrganisation {
  id: string;
  name: string;
}

/** The avatar's initials: the first letters of the first and last words (Bank of Ceylon: BC), or a one-word name's first two letters (testname1: TE). */
export function organisationInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? `${words[0]![0]}${words[words.length - 1]![0]}` : (words[0] ?? '').slice(0, 2);
  return letters.toUpperCase();
}

/*
 * Select your organisation (design's screenshot, 19 Nov 2026; Storybook only, no app route yet): after sign-in, an
 * account with access to several organisations picks one. The Login screen's shell and header (logo, Text Box
 * Display Medium-H2), the organisations as filled list cards (FinListStandardFilled: border, no fill; text avatar with
 * the initials, the name, the chevron) 8 apart (Space-M, design 19 Nov 2026), 32 below the header; "Back to login" (the hanging text link button)
 * 32 below. Choosing one shows a demo banner (in the real app it opens that organisation's dashboard).
 */
export function TenantScreen({ organisations }: { organisations: TenantOrganisation[] }) {
  const { brand, navigate } = useLoginPlatform();
  const [chosen, setChosen] = useState<TenantOrganisation | null>(null);
  return (
    <SignInScreen artwork="laptop">
      <div className="flex flex-col gap-4xl">
        <div className="flex flex-col gap-xl">
          <AppLogo brand={brand} />
          <FinTextBox
            type="h2"
            headingLevel={1}
            heading="Select your organisation"
            description="Your account has access to multiple organisations. Please select one to continue."
          />
        </div>
        {chosen && (
          <FinNotificationBanner tone="success">
            {`Opening ${chosen.name} (demo). In the real app this opens its dashboard.`}
          </FinNotificationBanner>
        )}
        <ul className="m-none flex list-none flex-col gap-m p-none" aria-label="Organisations">
          {organisations.map((organisation) => (
            <FinListStandardFilled
              key={organisation.id}
              as="li"
              behavior="button"
              title={organisation.name}
              leadingAccessory="avatar"
              avatar={{ initials: organisationInitials(organisation.name) }}
              onClick={() => setChosen(organisation)}
            />
          ))}
        </ul>
        <div>
          <FinButton variant="link" size="xsmall" hanging onClick={() => navigate('login')}>
            Back to login
          </FinButton>
        </div>
      </div>
    </SignInScreen>
  );
}
