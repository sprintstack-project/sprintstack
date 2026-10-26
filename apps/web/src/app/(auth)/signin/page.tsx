'use client';

import { useAppForm } from '@sprintstack/forms';
import { type SignInInput, signInSchema } from '@sprintstack/shared';
import { Button, GitHubIcon } from '@sprintstack/ui';
import { KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthHeading, AuthShell } from '@/components/auth/auth-shell';
import { Notice, OrDivider } from '@/components/auth/notice';
import { TURNSTILE_PENDING, useTurnstile } from '@/components/auth/turnstile';
import { AFTER_SIGN_IN, authClient, errorMessage, signInWithGitHub } from '@/lib/auth-client';

const defaultValues: SignInInput = { email: '', password: '', rememberMe: true };

const SigninPage = () => {
  const router = useRouter();
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const turnstile = useTurnstile();

  const form = useAppForm({
    defaultValues,
    validators: { onChange: signInSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      if (!turnstile.token) {
        setError({ title: 'Couldn’t sign you in', message: TURNSTILE_PENDING });
        return;
      }
      const { data, error } = await authClient.signIn.email({
        ...value,
        fetchOptions: { headers: { 'x-captcha-response': turnstile.token } },
      });
      turnstile.reset();
      if (error) {
        setError(
          error.status === 401
            ? {
                title: 'That didn’t match',
                message: 'Check your email and password and try again.',
              }
            : { title: 'Couldn’t sign you in', message: errorMessage(error, 'Try again.') },
        );
        return;
      }
      // Accounts with an authenticator app finish on the code step.
      router.push(data && 'twoFactorRedirect' in data ? '/signin/code' : AFTER_SIGN_IN);
    },
  });

  // Passkey autofill: browsers offer saved passkeys in the email field's suggestions.
  useEffect(() => {
    if (!window.PublicKeyCredential?.isConditionalMediationAvailable) return;
    let active = true;
    window.PublicKeyCredential.isConditionalMediationAvailable().then((available) => {
      if (!available || !active) return;
      authClient.signIn.passkey({ autoFill: true }).then(({ error }) => {
        if (active && !error) router.push(AFTER_SIGN_IN);
      });
    });
    return () => {
      active = false;
    };
  }, [router]);

  const github = async () => {
    setError(null);
    const { error } = await signInWithGitHub();
    if (error)
      setError({ title: 'Couldn’t reach GitHub', message: errorMessage(error, 'Try again.') });
  };

  return (
    <AuthShell
      headerRight={
        <>
          New here?{' '}
          <a href="/signup" className="link ml-1.5">
            Create an account
          </a>
        </>
      }
      aside={{
        eyebrow: 'Your sprint is waiting',
        title: (
          <>
            Pick up
            <br />
            where you
            <br />
            <em>left off.</em>
          </>
        ),
        children:
          'Your board, your sprint and every update since you were last here, waiting on the other side.',
      }}
    >
      <AuthHeading eyebrow="Sign in" title="Welcome back." />

      {error && (
        <Notice tone="danger" title={error.title}>
          {error.message}
        </Notice>
      )}

      <div className="flex flex-col gap-3">
        <Button variant="secondary" size="lg" block icon={GitHubIcon} onClick={github}>
          Continue with GitHub
        </Button>
        <Button
          variant="secondary"
          size="lg"
          block
          icon={KeyRound}
          onClick={() => router.push('/signin/passkey')}
        >
          Sign in with a passkey
        </Button>
      </div>

      <OrDivider />

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
              autoComplete="username webauthn"
              placeholder="you@company.com"
            />
          )}
        </form.AppField>
        <div className="flex flex-col gap-2">
          <form.AppField name="password">
            {(field) => <field.PasswordField label="Password" autoComplete="current-password" />}
          </form.AppField>
          <a href="/forgot-password" className="link self-end text-[0.9375rem]">
            Forgot password?
          </a>
        </div>
        <form.AppField name="rememberMe">
          {(field) => <field.CheckboxField>Keep me signed in on this device</field.CheckboxField>}
        </form.AppField>
        <div ref={turnstile.ref} />
        <form.AppForm>
          <form.SubmitButton size="lg" block>
            Sign in
          </form.SubmitButton>
        </form.AppForm>
      </form>

      <p className="m-0 text-meta font-semibold text-ink-muted">
        Protected by two-step verification when you turn it on.
      </p>
    </AuthShell>
  );
};

export default SigninPage;
