import { Passkey, type PasskeyCreateRequest, type PasskeyGetRequest } from 'react-native-passkey';
import { authClient } from './auth-client';

// @better-auth/passkey's client runs WebAuthn through the browser, so native apps run the same
// server ceremony with the OS passkey APIs instead. The challenge cookie is kept by expoClient.
// Native passkeys need PASSKEY_RP_ID to be a real domain serving /.well-known (see apps/web),
// with webcredentials:<domain> in app.json's ios.associatedDomains.

export const isPasskeySupported = () => Passkey.isSupported();

/**
 * A readable message for a failed passkey ceremony. react-native-passkey throws plain
 * `{ error, message }` objects (not Error instances) whose message is iOS's/Android's own reason,
 * e.g. "Application with identifier … is not associated with domain …". A genuine cancel gets the
 * fallback; anything else shows the native reason and its code so it can be diagnosed.
 */
export const passkeyErrorMessage = (cause: unknown, fallback: string) => {
  if (cause instanceof Error) return cause.message || fallback;
  if (typeof cause === 'object' && cause !== null && 'error' in cause) {
    const { error, message } = cause as { error?: unknown; message?: unknown };
    if (error === 'UserCancelled') return fallback;
    const text = typeof message === 'string' && message ? message : fallback;
    return typeof error === 'string' ? `${text} (${error})` : text;
  }
  return fallback;
};

/** Signs in with a passkey saved on this device or in the user's password manager. */
export const signInWithPasskey = async () => {
  const options = await authClient.$fetch<PasskeyGetRequest>(
    '/passkey/generate-authenticate-options',
    { method: 'GET' },
  );
  if (options.error) return options;
  const response = await Passkey.get(options.data);
  return authClient.$fetch('/passkey/verify-authentication', {
    method: 'POST',
    body: { response },
  });
};

/** Adds a passkey to the signed-in account. */
export const addPasskey = async (name?: string) => {
  const options = await authClient.$fetch<PasskeyCreateRequest>(
    '/passkey/generate-register-options',
    { method: 'GET', query: name ? { name } : undefined },
  );
  if (options.error) return options;
  const response = await Passkey.create(options.data);
  return authClient.$fetch('/passkey/verify-registration', {
    method: 'POST',
    body: { response, name },
  });
};
