'use client';

import { useAppForm } from '@sprintstack/forms';
import { CODE_LENGTH, codeSchema, recoveryCodeSchema } from '@sprintstack/shared';
import { Button } from '@sprintstack/ui';
import { Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthHeading, AuthIcon, AuthShell } from '@/components/auth/auth-shell';
import { Notice } from '@/components/auth/notice';
import { afterSignIn, authClient, errorMessage } from '@/lib/auth-client';

/** Step 2 of an email sign-in, for accounts with an authenticator app. */
const SignInCodePage = () => {
  const router = useRouter();
  const [recovery, setRecovery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: { code: '', trustDevice: false },
    onSubmit: async ({ value: { code, trustDevice } }) => {
      setError(null);
      const { error } = recovery
        ? await authClient.twoFactor.verifyBackupCode({ code: code.trim(), trustDevice })
        : await authClient.twoFactor.verifyTotp({ code, trustDevice });
      if (error) {
        setError(errorMessage(error, 'That code didn’t work. Try the next one.'));
        return;
      }
      router.push(afterSignIn());
    },
  });

  const switchMode = () => {
    setRecovery(!recovery);
    setError(null);
    form.reset();
  };

  return (
    <AuthShell
      headerRight={
        <a href="/signin" className="link">
          Use a different account
        </a>
      }
      aside={{
        eyebrow: 'Two-step verification',
        title: (
          <>
            One more
            <br />
            step. That’s
            <br />
            <em>the point.</em>
          </>
        ),
        children: 'A code from your phone keeps your projects safe even if your password leaks.',
      }}
    >
      <AuthIcon>
        <Smartphone aria-hidden strokeWidth={2} />
      </AuthIcon>
      <AuthHeading eyebrow="Step 2 of 2" title="Enter your code.">
        {recovery
          ? 'Enter one of the recovery codes you saved when you turned on two-step verification. Each one works once.'
          : `Open your authenticator app and enter the ${CODE_LENGTH}-digit code for SprintStack.`}
      </AuthHeading>

      {error && (
        <Notice tone="danger" title="That code didn’t work">
          {error}
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
        {recovery ? (
          <form.AppField name="code" validators={{ onChange: recoveryCodeSchema.shape.code }}>
            {(field) => <field.TextField label="Recovery code" autoComplete="off" />}
          </form.AppField>
        ) : (
          <form.AppField name="code" validators={{ onChange: codeSchema.shape.code }}>
            {(field) => (
              <field.CodeField
                label="Authentication code"
                description="Codes refresh every 30 seconds. Paste works too."
                autoFocus
                onComplete={() => form.handleSubmit()}
              />
            )}
          </form.AppField>
        )}
        <form.AppField name="trustDevice">
          {(field) => (
            <field.CheckboxField>Don’t ask again on this device for 30 days</field.CheckboxField>
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton size="lg" block>
            Verify and sign in
          </form.SubmitButton>
        </form.AppForm>
      </form>

      <div className="flex flex-col items-start gap-2.5 border-t border-line pt-5">
        <span className="text-body font-bold font-stretch-semi-condensed text-ink">
          {recovery ? 'Found your phone?' : 'Can’t use your app?'}
        </span>
        <Button variant="link" onClick={switchMode}>
          {recovery ? 'Use your authenticator app' : 'Use a recovery code'}
        </Button>
        <a href="/signin/passkey" className="link">
          Use a passkey instead
        </a>
      </div>
    </AuthShell>
  );
};

export default SignInCodePage;
