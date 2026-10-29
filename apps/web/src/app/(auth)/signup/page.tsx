'use client';

import { useAppForm } from '@sprintstack/forms';
import {
  invitedSignUpSchema,
  SIGN_UP_STEPS,
  type SignUpInput,
  signUpSchema,
} from '@sprintstack/shared';
import { Button, GitHubIcon, Stepper } from '@sprintstack/ui';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AuthHeading, AuthShell } from '@/components/auth/auth-shell';
import { Notice, OrDivider } from '@/components/auth/notice';
import { PasswordMeter } from '@/components/auth/password-meter';
import { TURNSTILE_PENDING, useTurnstile } from '@/components/auth/turnstile';
import {
  authClient,
  createOrganization,
  errorMessage,
  hasPendingInvitation,
  signInWithGitHub,
} from '@/lib/auth-client';

const defaultValues: SignUpInput = {
  name: '',
  email: '',
  organization: '',
  password: '',
  terms: false,
};

const SignUpPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const turnstile = useTurnstile();
  // Opened from an invite: the person joins that organization rather than creating one. Read after
  // mount, since the invite is kept in this tab's storage.
  const [invited, setInvited] = useState(false);
  useEffect(() => setInvited(hasPendingInvitation()), []);
  // Set once the account exists, so a retry after the organization failed doesn't sign up again.
  const accountCreated = useRef(false);

  const form = useAppForm({
    defaultValues,
    validators: { onChange: invited ? invitedSignUpSchema : signUpSchema },
    onSubmit: async ({ value: { name, email, organization, password } }) => {
      setError(null);
      if (!accountCreated.current) {
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
        accountCreated.current = true;
      }
      if (!invited) {
        // The person is signed in now; they own the new organization and it becomes active.
        const { error } = await createOrganization(organization.trim());
        if (error) {
          setError(
            errorMessage(
              error,
              'Your account was created, but the organization wasn’t. Try again.',
            ),
          );
          return;
        }
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
        eyebrow: 'Demo purposes only',
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

      {!invited && (
        <Notice tone="info">
          You are creating a new admin owner account for SprintStack. If your organization already
          uses SprintStack, contact your admin for an invite instead.
        </Notice>
      )}

      {error && (
        <Notice tone="danger" title="Account not created">
          {error}
        </Notice>
      )}

      {/* GitHub can't ask for an organization name, so it's only for joining one from an invite
          (the API refuses new GitHub accounts without one). */}
      {invited && (
        <>
          <Button variant="secondary" size="lg" block icon={GitHubIcon} onClick={github}>
            Sign up with GitHub
          </Button>
          <OrDivider />
        </>
      )}

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
        {!invited && (
          <form.AppField name="organization">
            {(field) => (
              <field.TextField
                label="Organization name"
                autoComplete="organization"
                placeholder="Acme Inc."
              />
            )}
          </form.AppField>
        )}
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

export default SignUpPage;
