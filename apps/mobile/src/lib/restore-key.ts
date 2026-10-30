import * as RestoreCredentials from 'expo-restore-credentials';
import * as SecureStore from 'expo-secure-store';
import { authClient } from './auth-client';

// Android Restore Credentials, for Google Play's zero-tap sign-in restoration. While signed in, the
// device holds a restore key that Credential Manager backs up with the phone; on a new phone the app
// reads it silently and the API (apps/api/src/auth/restore-key.ts) signs the person back in. Every
// call is a no-op on iOS and on Android devices without support.

// The session this device's restore key was registered for. SecureStore is left out of backups,
// so a restored phone starts without it.
const KEY_SESSION = 'sprintstack.restoreKeySession';

// Failures never block sign-in, so in development they're logged instead of disappearing.
const warn = (step: string, cause: unknown) => {
  if (__DEV__) console.warn(`[restore-key] ${step}`, cause);
};

/** Registers a restore key for the signed-in session, once per session. Failures retry next launch. */
export const syncRestoreKey = async (sessionId: string) => {
  if (!RestoreCredentials.isSupported()) return;
  try {
    if ((await SecureStore.getItemAsync(KEY_SESSION)) === sessionId) return;
    const options = await authClient.$fetch<Record<string, unknown>>(
      '/restore-key/generate-register-options',
      { method: 'GET' },
    );
    if (options.error) return warn('register options', options.error);
    const result = await RestoreCredentials.createRestoreCredentialAsync(options.data);
    if (!result) return;
    const { error } = await authClient.$fetch('/restore-key/verify-registration', {
      method: 'POST',
      body: { response: JSON.parse(result.responseJson) },
    });
    if (error) return warn('verify registration', error);
    await SecureStore.setItemAsync(KEY_SESSION, sessionId);
  } catch (cause) {
    // Credential Manager or the network failed; the next launch tries again.
    warn('register', cause);
  }
};

const attemptRestore = async () => {
  try {
    const options = await authClient.$fetch<Record<string, unknown>>(
      '/restore-key/generate-authenticate-options',
      { method: 'GET' },
    );
    if (options.error) {
      warn('authenticate options', options.error);
      return false;
    }
    const result = await RestoreCredentials.getRestoreCredentialAsync(options.data);
    if (result) {
      const { error } = await authClient.$fetch('/restore-key/verify-authentication', {
        method: 'POST',
        body: { response: JSON.parse(result.authenticationResponseJson) },
      });
      if (error) {
        warn('verify authentication', error);
        // Any other error (offline, server down) leaves the attempt for the next launch.
        if (error.status !== 401) return false;
        // The old phone signed out or its session ended, so the key is dead.
        await RestoreCredentials.clearRestoreCredentialAsync();
        RestoreCredentials.markRestoreHandled();
        return false;
      }
    }
    RestoreCredentials.markRestoreHandled();
    return Boolean(result);
  } catch (cause) {
    warn('restore', cause);
    return false;
  }
};

let pendingRestore: Promise<boolean> | null = null;

/**
 * On a new phone (or after its data was restored), signs in with the restore key backed up from
 * the old one. Resolves true once signed in. Only call it while signed out.
 */
export const restoreSignIn = () => {
  if (!RestoreCredentials.shouldAttemptRestore()) return Promise.resolve(false);
  // One attempt at a time: a second would replace the first one's challenge cookie.
  pendingRestore ??= attemptRestore().finally(() => {
    pendingRestore = null;
  });
  return pendingRestore;
};

/** Whether restoreSignIn has anything to try on this launch. */
export const shouldRestoreSignIn = () => RestoreCredentials.shouldAttemptRestore();

/**
 * Signs out and deletes this device's restore key, so a phone set up from it later starts signed
 * out. The API drops its copy of the key along with the session.
 */
export const signOut = async () => {
  await RestoreCredentials.clearRestoreCredentialAsync().catch(() => {});
  await SecureStore.deleteItemAsync(KEY_SESSION).catch(() => {});
  return authClient.signOut();
};
