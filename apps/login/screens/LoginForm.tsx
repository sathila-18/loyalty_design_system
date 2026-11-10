'use client';

import { FinButton, FinCheckbox, FinNotificationBanner, FinPasswordField, FinTextField } from '@finspace-loyalty/ui';
import { useRef, useState, type FormEvent } from 'react';
import { useLoginPlatform } from './platform';

type Errors = { identifier?: string; password?: string };

/*
 * Figma `135:4939`: User name/ email and Password 16 apart, then Forgot password (Tertiary, XSmall) and Remember me
 * on one row, 16 below; the Login button (Medium, the fields' height, full width) 32 below. Errors and the signed-in message are code
 * first (the screens show none).
 */
export function LoginForm() {
  const { Link, href, auth } = useLoginPlatform();
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'invalid' | 'signed-in'>('idle');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!identifier.trim()) next.identifier = 'Enter your user name or email';
    if (!password) next.password = 'Enter your password';
    setErrors(next);
    if (next.identifier) return identifierRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();

    setStatus('submitting');
    const result = await auth.signIn({ identifier: identifier.trim(), password, remember });
    setStatus(result.ok ? 'signed-in' : 'invalid');
  }

  return (
    <form className="flex flex-col gap-4xl" noValidate onSubmit={submit}>
      {status === 'invalid' && (
        <FinNotificationBanner tone="error">The user name, email or password is incorrect. Check them and try again.</FinNotificationBanner>
      )}
      {status === 'signed-in' && (
        <FinNotificationBanner tone="success">Signed in (demo). In the real app this opens the dashboard.</FinNotificationBanner>
      )}
      <div className="flex flex-col gap-xl">
        <FinTextField
          ref={identifierRef}
          label="User name/ email"
          placeholder="User name/ email"
          name="identifier"
          autoComplete="username"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          error={Boolean(errors.identifier)}
          helperText={errors.identifier}
        />
        <FinPasswordField
          ref={passwordRef}
          label="Password"
          placeholder="Password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <div className="flex items-center justify-between gap-l">
          {/* A real link (FinButton href + the platform's link); a Tertiary link has no side padding, so it lines up with the fields. */}
          <FinButton variant="tertiary" size="xsmall" href={href('forgot-password')} linkAs={Link}>
            Forgot password
          </FinButton>
          <FinCheckbox checked={remember} onChange={(event) => setRemember(event.target.checked)}>
            Remember me
          </FinCheckbox>
        </div>
      </div>
      {/* Medium (48), the fields' height (decided 10 Nov 2026; Figma's Button-Primary is 56). */}
      <FinButton type="submit" size="medium" className="w-full" disabled={status === 'submitting'} aria-busy={status === 'submitting'}>
        {status === 'submitting' ? 'Logging in…' : 'Login'}
      </FinButton>
    </form>
  );
}
