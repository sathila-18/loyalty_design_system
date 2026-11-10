/*
 * ─── MOCK AUTH: every fake call in the app is in this file. ───────────────────────────────────────────────────────
 * The developers replace each function's body with the real API call and keep the signature (or change the callers
 * in app/**). Nothing else in the app talks to a backend.
 *
 * Demo rules, so every state can be reviewed:
 * - signIn: any user name or email works, except the password "wrong" (shows the error).
 * - requestPasswordReset: any valid email works.
 * - resetPassword: any password of 8 or more characters works.
 */

export type SignInResult = { ok: true } | { ok: false; reason: 'invalid-credentials' };

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

/** Sign in with a user name or email and a password. `remember` keeps the session after the browser closes. */
export async function signIn(input: { identifier: string; password: string; remember: boolean }): Promise<SignInResult> {
  // TODO(developers): POST the credentials to the auth API; set the session cookie (long-lived when `remember`).
  await delay();
  return input.password === 'wrong' ? { ok: false, reason: 'invalid-credentials' } : { ok: true };
}

/** Send a password reset link to this email (if an account has it). */
export async function requestPasswordReset(input: { email: string }): Promise<{ ok: true }> {
  // TODO(developers): POST to the reset API. Answer the same whether or not the email has an account.
  void input;
  await delay();
  return { ok: true };
}

/** Set a new password with the token from the reset link. */
export async function resetPassword(input: { token: string; password: string }): Promise<{ ok: true } | { ok: false; reason: 'expired-link' }> {
  // TODO(developers): POST the token and the new password to the reset API.
  void input;
  await delay();
  return { ok: true };
}
