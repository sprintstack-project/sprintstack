import { Passkey, type PasskeyCreateRequest, type PasskeyGetRequest } from 'react-native-passkey';
import { authClient } from './auth-client';

// @better-auth/passkey's client runs WebAuthn through the browser, so native apps run the same
// server ceremony with the OS passkey APIs instead. The challenge cookie is kept by expoClient.
// Native passkeys need PASSKEY_RP_ID to be a real domain serving /.well-known (see apps/web),
// with webcredentials:<domain> in app.json's ios.associatedDomains.

export const isPasskeySupported = () => Passkey.isSupported();

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
