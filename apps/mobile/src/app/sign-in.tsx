import { useAppForm } from '@sprintstack/forms';
import { type SignInInput, signInSchema } from '@sprintstack/shared';
import { Button, GitHubIcon, Text } from '@sprintstack/ui';
import { router } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { AuthHeading, TextLink } from '@/components/auth/auth-heading';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Notice, OrDivider } from '@/components/auth/notice';
import { authClient, errorMessage, refreshSession } from '@/lib/auth-client';
import { signInWithPasskey } from '@/lib/passkey';

const defaultValues: SignInInput = { email: '', password: '', rememberMe: true };

const SignInPage = () => {
  const [error, setError] = useState<{ title: string; message: string } | null>(null);

  const form = useAppForm({
    defaultValues,
    validators: { onChange: signInSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      const { data, error } = await authClient.signIn.email(value);
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
      if (data && 'twoFactorRedirect' in data) {
        router.push('/sign-in-code');
        return;
      }
      await refreshSession();
      router.replace('/');
    },
  });

  const passkey = async () => {
    setError(null);
    try {
      const { error } = await signInWithPasskey();
      if (error) throw new Error(error.message);
      await refreshSession();
      router.replace('/');
    } catch (cause) {
      setError({
        title: 'Passkey not used',
        message:
          cause instanceof Error && cause.message
            ? cause.message
            : 'The prompt was closed before you approved it.',
      });
    }
  };

  const github = async () => {
    setError(null);
    const { error } = await authClient.signIn.social({ provider: 'github', callbackURL: '/' });
    if (error) {
      setError({ title: 'Couldn’t reach GitHub', message: errorMessage(error, 'Try again.') });
      return;
    }
    await refreshSession();
    router.replace('/');
  };

  return (
    <AuthScreen
      left={
        <Text className="text-[1.5rem] leading-6 font-extrabold uppercase text-ink">
          SprintStack<Text className="text-[1.5rem] font-extrabold text-brand-ink">.</Text>
        </Text>
      }
      right={<TextLink onPress={() => router.push('/sign-up')}>Sign up</TextLink>}
    >
      <AuthHeading title="Welcome" accent="back." />

      {error && (
        <Notice tone="danger" title={error.title}>
          {error.message}
        </Notice>
      )}

      <View className="gap-3">
        <Button variant="primary" size="lg" block icon={KeyRound} onClick={passkey}>
          Sign in with a passkey
        </Button>
        <Button variant="secondary" size="lg" block icon={GitHubIcon} onClick={github}>
          Continue with GitHub
        </Button>
      </View>

      <OrDivider />

      <View className="gap-5">
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
        <form.AppField name="password">
          {(field) => <field.PasswordField label="Password" autoComplete="current-password" />}
        </form.AppField>
        <View className="self-start">
          <TextLink onPress={() => router.push('/forgot-password')}>Forgot password?</TextLink>
        </View>
        <form.AppField name="rememberMe">
          {(field) => <field.CheckboxField>Keep me signed in on this phone</field.CheckboxField>}
        </form.AppField>
      </View>

      <View className="mt-auto gap-3">
        <form.AppForm>
          <form.SubmitButton size="lg" block>
            Sign in
          </form.SubmitButton>
        </form.AppForm>
      </View>
    </AuthScreen>
  );
};

export default SignInPage;
