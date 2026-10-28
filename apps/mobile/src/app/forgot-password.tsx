import { useAppForm } from '@sprintstack/forms';
import { forgotPasswordSchema } from '@sprintstack/shared';
import { Button, Text } from '@sprintstack/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { AuthHeading } from '@/components/auth/auth-heading';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Notice } from '@/components/auth/notice';
import { AUTH_URL, authClient, errorMessage } from '@/lib/auth-client';

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: { email: '' },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      // The link opens the web app's reset page, which works from any device.
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: `${AUTH_URL}/reset-password`,
      });
      if (error) {
        setError(errorMessage(error, 'Couldn’t send the link. Try again.'));
        return;
      }
      setSent(true);
    },
  });

  return (
    <AuthScreen
      back
      right={
        <Text className="text-[0.8125rem] leading-4 font-bold uppercase tracking-[.4px] text-ink-muted">
          Forgot password
        </Text>
      }
    >
      <AuthHeading title="Reset it.">We’ll email you a link to choose a new password.</AuthHeading>

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

      <View className="mt-auto gap-3">
        <form.AppForm>
          <form.SubmitButton size="lg" block>
            {sent ? 'Send another link' : 'Send reset link'}
          </form.SubmitButton>
        </form.AppForm>
        <Button variant="ghost" size="lg" block onClick={() => router.back()}>
          Back to sign in
        </Button>
      </View>
    </AuthScreen>
  );
};

export default ForgotPasswordPage;
