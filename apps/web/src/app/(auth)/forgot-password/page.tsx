'use client';

import { useAppForm } from '@sprintstack/forms';
import { forgotPasswordSchema } from '@sprintstack/shared';
import { useState } from 'react';
import { AuthHeading, AuthShell } from '@/components/auth/auth-shell';
import { Notice } from '@/components/auth/notice';
import { authClient, errorMessage, signInWithGitHub } from '@/lib/auth-client';

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: { email: '' },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setError(errorMessage(error, 'Couldn’t send the link. Try again.'));
        return;
      }
      setSent(true);
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
        children:
          'Once you’re back in, add a passkey and sign in with your fingerprint or face next time.',
      }}
    >
      <AuthHeading eyebrow="Forgot password" title="Reset it.">
        Enter the email you use for SprintStack and we’ll send a link to choose a new password.
      </AuthHeading>

      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton size="lg" block>
            {sent ? 'Send another link' : 'Send reset link'}
          </form.SubmitButton>
        </form.AppForm>
      </form>

      {sent && (
        <Notice tone="success" title="Check your inbox">
          If an account exists for that email, a link is on its way. It expires in 30 minutes.
        </Notice>
      )}
      {error && (
        <Notice tone="danger" title="Link not sent">
          {error}
        </Notice>
      )}

      <p className="m-0 text-meta font-semibold text-ink-muted">
        Signed up with GitHub? You don’t have a password here.{' '}
        <button type="button" className="link cursor-pointer" onClick={() => signInWithGitHub()}>
          Continue with GitHub
        </button>
      </p>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
