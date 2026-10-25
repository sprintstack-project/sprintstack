'use client';

import { useAppForm } from '@sprintstack/forms';
import { resetPasswordSchema } from '@sprintstack/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AuthHeading, AuthShell } from '@/components/auth/auth-shell';
import { Notice } from '@/components/auth/notice';
import { PasswordMeter } from '@/components/auth/password-meter';
import { authClient, errorMessage } from '@/lib/auth-client';

/** Opened from the reset email: the API checks the link and adds ?token=… (or ?error=…). */
export const ResetPasswordForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');
  const [error, setError] = useState<string | null>(
    token ? null : 'This link has expired or was already used. Ask for a new one.',
  );

  const form = useAppForm({
    defaultValues: { password: '' },
    validators: { onChange: resetPasswordSchema },
    onSubmit: async ({ value }) => {
      if (!token) return;
      setError(null);
      const { error } = await authClient.resetPassword({ newPassword: value.password, token });
      if (error) {
        setError(errorMessage(error, 'Couldn’t change your password. Ask for a new link.'));
        return;
      }
      router.push('/signin');
    },
  });

  return (
    <AuthShell
      headerRight={
        <a href="/signin" className="link">
          Back to sign in
        </a>
      }
      aside={{
        eyebrow: 'Tip',
        title: (
          <>
            Never forget
            <br />
            <em>again.</em>
          </>
        ),
        children: 'Add a passkey once you’re in and you won’t need this password to sign in.',
      }}
    >
      <AuthHeading eyebrow="Reset password" title="Choose a new one.">
        You’ll be signed out everywhere else, so sign in again with the new password.
      </AuthHeading>

      {error && (
        <Notice tone="danger" title="Password not changed">
          {error}{' '}
          {!token && (
            <a href="/forgot-password" className="link">
              Send a new link
            </a>
          )}
        </Notice>
      )}

      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2.5">
          <form.AppField name="password">
            {(field) => (
              <field.PasswordField
                label="New password"
                autoComplete="new-password"
                disabled={!token}
              />
            )}
          </form.AppField>
          <form.Subscribe selector={(state) => state.values.password}>
            {(password) => <PasswordMeter password={password} />}
          </form.Subscribe>
        </div>
        <form.AppForm>
          <form.SubmitButton size="lg" block>
            Change password
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </AuthShell>
  );
};
