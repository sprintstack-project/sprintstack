'use client';

import { useAppForm } from '@sprintstack/forms';
import { SIGN_UP_STEPS, type SignUpInput, signUpSchema } from '@sprintstack/shared';
import { Button, GitHubIcon, Stepper } from '@sprintstack/ui';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthHeading, AuthShell } from '@/components/auth/auth-shell';
import { Notice, OrDivider } from '@/components/auth/notice';
import { PasswordMeter } from '@/components/auth/password-meter';
import { TURNSTILE_PENDING, useTurnstile } from '@/components/auth/turnstile';
import { authClient, errorMessage, signInWithGitHub } from '@/lib/auth-client';

const defaultValues: SignUpInput = { name: '', email: '', password: '', terms: false };

const SignupPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const turnstile = useTurnstile();

  const form = useAppForm({
    defaultValues,
    validators: { onChange: signUpSchema },
    onSubmit: async ({ value: { name, email, password } }) => {
      setError(null);
      if (!turnstile.token) {
        setError(TURNSTILE_PENDING);
        return;
      }
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        fetchOptions: { headers: { 'x-captcha-response': turnstile.token } },
      });
      turnstile.reset();
      if (error) {
        setError(errorMessage(error, 'Couldn’t create your account. Try again.'));
        return;
      }
      // The API emails a 6-digit code on sign-up; the person stays signed in while they enter it.
      router.push('/signup/verify');
    },
  });

  const github = async () => {
    setError(null);
    const { error } = await signInWithGitHub();
    if (error) setError(errorMessage(error, 'Couldn’t reach GitHub. Try again.'));
  };

  return (
    <AuthShell
      width="lg"
      headerRight={
        <>
          Have an account?{' '}
          <a href="/signin" className="link ml-1.5">
            Sign in
          </a>
        </>
      }
      aside={{
        eyebrow: 'Early access',
        title: (
          <>
            Plan it.
            <br />
            Track it.
            <br />
            <em>Ship it.</em>
          </>
        ),
        children: (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {[
              'Boards, sprints and backlog',
              'Web, iOS and Android',
              'Passkeys and two-step sign-in',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <Check aria-hidden strokeWidth={2.5} className="size-5 text-brand-on-ink" />
                {item}
              </li>
            ))}
          </ul>
        ),
      }}
    >
      <Stepper label="Sign-up progress" steps={SIGN_UP_STEPS} current={0} />
      <AuthHeading title="Create your account.">Free during the beta. No credit card.</AuthHeading>

      {error && (
        <Notice tone="danger" title="Account not created">
          {error}
        </Notice>
      )}

      <Button variant="secondary" size="lg" block icon={GitHubIcon} onClick={github}>
        Sign up with GitHub
      </Button>

      <OrDivider />

      <form
        noValidate
        className="flex flex-col gap-4.5"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-4">
          <form.AppField name="name">
            {(field) => <field.TextField label="Full name" autoComplete="name" />}
          </form.AppField>
          <form.AppField name="email">
            {(field) => <field.TextField label="Work email" type="email" autoComplete="email" />}
          </form.AppField>
        </div>
        <div className="flex flex-col gap-2.5">
          <form.AppField name="password">
            {(field) => <field.PasswordField label="Password" autoComplete="new-password" />}
          </form.AppField>
          <form.Subscribe selector={(state) => state.values.password}>
            {(password) => <PasswordMeter password={password} />}
          </form.Subscribe>
        </div>
        <form.AppField name="terms">
          {(field) => (
            <field.CheckboxField>
              I agree to the{' '}
              <a href="/terms" className="link">
                Terms
              </a>{' '}
              and{' '}
              <a href="/privacy" className="link">
                Privacy notice
              </a>
              .
            </field.CheckboxField>
          )}
        </form.AppField>
        <div ref={turnstile.ref} />
        <form.AppForm>
          <form.SubmitButton size="lg" block>
            Create account
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </AuthShell>
  );
};

export default SignupPage;
