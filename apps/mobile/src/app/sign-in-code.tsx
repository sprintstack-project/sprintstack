import { useAppForm } from '@sprintstack/forms';
import { codeSchema, recoveryCodeSchema } from '@sprintstack/shared';
import { Button, Text } from '@sprintstack/ui';
import { router } from 'expo-router';
import { Smartphone } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { AuthHeading } from '@/components/auth/auth-heading';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Notice } from '@/components/auth/notice';
import { authClient, errorMessage } from '@/lib/auth-client';
import { useTokenColor } from '@/lib/use-token-color';

/** Step 2 of an email sign-in, for accounts with an authenticator app. */
const SignInCodeScreen = () => {
  const onBrand = useTokenColor('on-brand');
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
      router.replace('/');
    },
  });

  return (
    <AuthScreen
      back
      right={
        <Text className="text-[0.8125rem] leading-4 font-bold uppercase tracking-[.4px] text-ink-muted">
          Step 2 of 2
        </Text>
      }
    >
      <View className="size-16 items-center justify-center rounded-full bg-brand">
        <Smartphone color={onBrand} size={26} strokeWidth={2} />
      </View>
      <AuthHeading title="Enter your code.">
        {recovery
          ? 'Enter one of the recovery codes you saved. Each one works once.'
          : 'From your authenticator app for SprintStack.'}
      </AuthHeading>

      {error && (
        <Notice tone="danger" title="That code didn’t work">
          {error}
        </Notice>
      )}

      <View className="gap-5">
        {recovery ? (
          <form.AppField name="code" validators={{ onChange: recoveryCodeSchema.shape.code }}>
            {(field) => <field.TextField label="Recovery code" />}
          </form.AppField>
        ) : (
          <form.AppField name="code" validators={{ onChange: codeSchema.shape.code }}>
            {(field) => (
              <field.CodeField
                label="Authentication code"
                autoFocus
                onComplete={() => form.handleSubmit()}
              />
            )}
          </form.AppField>
        )}
        <form.AppField name="trustDevice">
          {(field) => <field.CheckboxField>Trust this phone for 30 days</field.CheckboxField>}
        </form.AppField>
      </View>

      <View className="mt-auto gap-3">
        <form.AppForm>
          <form.SubmitButton size="lg" block>
            Verify
          </form.SubmitButton>
        </form.AppForm>
        <Button
          variant="ghost"
          size="lg"
          block
          onClick={() => {
            setRecovery(!recovery);
            setError(null);
            form.reset();
          }}
        >
          {recovery ? 'Use your authenticator app' : 'Use a recovery code'}
        </Button>
      </View>
    </AuthScreen>
  );
};

export default SignInCodeScreen;
