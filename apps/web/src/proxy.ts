import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Sends signed-in people from the landing, sign-in and sign-up pages straight to the dashboard,
 * before any HTML is rendered, so those pages stay static. Optimistic: it only checks that a
 * session cookie is present; an expired or revoked one is caught by the dashboard, which goes back
 * to sign-in.
 */
export const proxy = (request: NextRequest) => {
  if (getSessionCookie(request)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
};

// Exact paths only: /signup/verify and /signup/secure run with a fresh session, and /signin/code
// and /signin/passkey are mid-sign-in steps.
export const config = { matcher: ['/', '/signin', '/signup'] };
