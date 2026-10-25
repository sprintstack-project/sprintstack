import { useAppForm } from '@sprintstack/forms';
import { CODE_LENGTH, codeSchema, SIGN_UP_STEPS } from '@sprintstack/shared';
import { Button, Stepper, Text } from '@sprintstack/ui';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { AuthHeading, TextLink } from '@/components/auth/auth-heading';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Notice } from '@/components/auth/notice';
import { authClient, errorMessage } from '@/lib/auth-client';

const RESEND_AFTER = 60;

/** Step 2: the 6-digit code the API emailed at sign-up. */
const SignUpVerifyScreen = () => {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user.email ?? '';
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [wait, setWait] = useState(RESEND_AFTER);

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
      router.replace('/sign-up/secure');
    },
  });

  if (!isPending && !session) return <Redirect href="/sign-up" />;
  if (session?.user.emailVerified) return <Redirect href="/sign-up/secure" />;

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
    router.replace('/sign-up');
  };

  const countdown = `${Math.floor(wait / 60)}:${String(wait % 60).padStart(2, '0')}`;

  return (
    <AuthScreen right={<TextLink onPress={changeEmail}>Change email</TextLink>}>
      <Stepper label="Sign-up progress" steps={SIGN_UP_STEPS} current={1} compact />
      <AuthHeading title="Check your" accent="inbox.">
        Enter the {CODE_LENGTH}-digit code we sent to {email || 'your email'}.
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

      <form.AppField name="code">
        {(field) => (
          <field.CodeField
            label="Verification code"
            description={
              wait > 0 ? `Expires in 10 minutes · Resend in ${countdown}` : 'Expires in 10 minutes'
            }
            autoFocus
            onComplete={() => form.handleSubmit()}
          />
        )}
      </form.AppField>

      <View className="mt-auto gap-3">
        <form.AppForm>
          <form.SubmitButton size="lg" block>
            Verify email
          </form.SubmitButton>
        </form.AppForm>
        <Button variant="ghost" size="lg" block disabled={wait > 0 || !email} onClick={resend}>
          Resend code
        </Button>
        <Text className="text-center text-meta font-semibold text-ink-muted">
          Didn’t get it? Check spam.
        </Text>
      </View>
    </AuthScreen>
  );
};

export default SignUpVerifyScreen;
