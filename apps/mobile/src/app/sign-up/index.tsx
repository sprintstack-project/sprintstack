import { useAppForm } from '@sprintstack/forms';
import { SIGN_UP_STEPS, type SignUpInput, signUpSchema } from '@sprintstack/shared';
import { Stepper, Text } from '@sprintstack/ui';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { AuthHeading, TextLink } from '@/components/auth/auth-heading';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Notice } from '@/components/auth/notice';
import { PasswordMeter } from '@/components/auth/password-meter';
import {
  AUTH_URL,
  authClient,
  createOrganization,
  errorMessage,
  refreshSession,
} from '@/lib/auth-client';

const defaultValues: SignUpInput = {
  name: '',
  email: '',
  organization: '',
  password: '',
  terms: false,
};

const SignUpPage = () => {
  const [error, setError] = useState<string | null>(null);
  // Set once the account exists, so a retry after the organization failed doesn't sign up again.
  const accountCreated = useRef(false);

  const form = useAppForm({
    defaultValues,
    validators: { onChange: signUpSchema },
    onSubmit: async ({ value: { name, email, organization, password } }) => {
      setError(null);
      if (!accountCreated.current) {
        const { error } = await authClient.signUp.email({ name, email, password });
        if (error) {
          setError(errorMessage(error, 'Couldn’t create your account. Try again.'));
          return;
        }
        accountCreated.current = true;
      }
      // The person is signed in now; they own the new organization and it becomes active.
      const { error } = await createOrganization(organization.trim());
      if (error) {
        setError(
          errorMessage(error, 'Your account was created, but the organization wasn’t. Try again.'),
        );
        return;
      }
      // The API emails a 6-digit code on sign-up; the person stays signed in while they enter it.
      await refreshSession();
      router.replace('/sign-up/verify');
    },
  });

  return (
    <AuthScreen
      back
      right={<TextLink onPress={() => router.replace('/sign-in')}>Sign in</TextLink>}
    >
      <Stepper label="Sign-up progress" steps={SIGN_UP_STEPS} current={0} compact />
      <AuthHeading title="Create your" accent="account." />

      <Notice tone="info">
        You are creating a new owner account for SprintStack. If your organization already uses
        SprintStack, contact your admin for an invite instead.
      </Notice>

      {error && (
        <Notice tone="danger" title="Account not created">
          {error}
        </Notice>
      )}

      <View className="gap-4.5">
        <form.AppField name="name">
          {(field) => <field.TextField label="Full name" autoComplete="name" />}
        </form.AppField>
        <form.AppField name="email">
          {(field) => <field.TextField label="Work email" type="email" autoComplete="email" />}
        </form.AppField>
        <form.AppField name="organization">
          {(field) => (
            <field.TextField
              label="Organization name"
              autoComplete="organization"
              placeholder="Acme Inc."
            />
          )}
        </form.AppField>
        <View className="gap-2.5">
          <form.AppField name="password">
            {(field) => <field.PasswordField label="Password" autoComplete="new-password" />}
          </form.AppField>
          <form.Subscribe selector={(state) => state.values.password}>
            {(password) => <PasswordMeter password={password} />}
          </form.Subscribe>
        </View>
        <form.AppField name="terms">
          {(field) => (
            <field.CheckboxField>
              <Text className="text-body font-semibold text-ink">
                I agree to the{' '}
                <TextLink onPress={() => WebBrowser.openBrowserAsync(`${AUTH_URL}/terms`)}>
                  Terms
                </TextLink>{' '}
                and{' '}
                <TextLink onPress={() => WebBrowser.openBrowserAsync(`${AUTH_URL}/privacy`)}>
                  Privacy notice
                </TextLink>
                .
              </Text>
            </field.CheckboxField>
          )}
        </form.AppField>
      </View>

      <form.AppForm>
        <form.SubmitButton size="lg" block>
          Create account
        </form.SubmitButton>
      </form.AppForm>
    </AuthScreen>
  );
};

export default SignUpPage;
