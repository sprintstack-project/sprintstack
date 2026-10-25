'use client';

import { useAppForm } from '@sprintstack/forms';
import { CODE_LENGTH, codeSchema, SIGN_UP_STEPS } from '@sprintstack/shared';
import { Button, Stepper } from '@sprintstack/ui';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthHeading, AuthIcon, AuthShell } from '@/components/auth/auth-shell';
import { Notice } from '@/components/auth/notice';
import { authClient, errorMessage } from '@/lib/auth-client';

const RESEND_AFTER = 60;

/** Step 2: the 6-digit code the API emailed at sign-up. */
const SignupVerifyPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user.email ?? '';
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [wait, setWait] = useState(RESEND_AFTER);

  useEffect(() => {
    if (isPending) return;
    if (!session) router.replace('/signup');
    else if (session.user.emailVerified) router.replace('/signup/secure');
  }, [isPending, session, router]);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const form = useAppForm({
    defaultValues: { code: '' },
    validators: { onChange: codeSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      const { error } = await authClient.emailOtp.verifyEmail({ email, otp: value.code });
      if (error) {
        setError(errorMessage(error, 'That code didn’t work. Check the latest email.'));
        return;
      }
      router.push('/signup/secure');
    },
  });

  const resend = async () => {
    setError(null);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'email-verification',
    });
    if (error) {
      setError(errorMessage(error, 'Couldn’t send a new code. Try again.'));
      return;
    }
    setResent(true);
    setWait(RESEND_AFTER);
  };

  // The account exists already; signing out lets them start again with another address.
  const changeEmail = async () => {
    await authClient.signOut();
    router.push('/signup');
  };

  return (
    <AuthShell
      width="lg"
      headerRight={
        <Button variant="link" onClick={changeEmail}>
          Change email
        </Button>
      }
      aside={{
        eyebrow: 'Step 2 of 3',
        title: (
          <>
            Almost
            <br />
            <em>there.</em>
          </>
        ),
        children:
          'Verifying your email keeps workspace invites and password resets going to the right person.',
      }}
    >
      <Stepper label="Sign-up progress" steps={SIGN_UP_STEPS} current={1} />
      <AuthIcon>
        <Mail aria-hidden strokeWidth={2} />
      </AuthIcon>
      <AuthHeading title="Check your inbox.">
        We sent a {CODE_LENGTH}-digit code to <strong>{email || 'your email'}</strong>. Enter it
        below.
      </AuthHeading>

      {error && (
        <Notice tone="danger" title="Email not verified">
          {error}
        </Notice>
      )}
      {resent && !error && (
        <Notice tone="success" title="New code sent">
          Use the code in the latest email. Earlier codes no longer work.
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
        <form.AppField name="code">
          {(field) => (
            <field.CodeField
              label="Verification code"
              description="The code expires in 10 minutes."
              autoFocus
              onComplete={() => form.handleSubmit()}
            />
          )}
        </form.AppField>
        <form.AppForm>
          <form.SubmitButton size="lg" block>
            Verify email
          </form.SubmitButton>
        </form.AppForm>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <span className="text-meta font-semibold text-ink-muted" aria-live="polite">
          {wait > 0
            ? `Didn’t get it? Check spam, or resend in ${Math.floor(wait / 60)}:${String(wait % 60).padStart(2, '0')}.`
            : 'Didn’t get it? Check spam, or send a new code.'}
        </span>
        <Button variant="secondary" size="sm" disabled={wait > 0 || !email} onClick={resend}>
          Resend code
        </Button>
      </div>
    </AuthShell>
  );
};

export default SignupVerifyPage;
