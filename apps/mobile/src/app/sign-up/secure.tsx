import { CODE_LENGTH, SIGN_UP_STEPS } from '@sprintstack/shared';
import { Badge, Button, Field, Input, InputPassword, Stepper, Text } from '@sprintstack/ui';
import * as Clipboard from 'expo-clipboard';
import { Redirect, router } from 'expo-router';
import { Check, Copy, KeyRound, Smartphone } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Linking, View } from 'react-native';
import { AuthHeading, TextLink } from '@/components/auth/auth-heading';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Notice } from '@/components/auth/notice';
import { RecoveryCodes } from '@/components/auth/recovery-codes';
import { authClient, errorMessage } from '@/lib/auth-client';
import { addPasskey, isPasskeySupported } from '@/lib/passkey';
import { useTokenColor } from '@/lib/use-token-color';

interface Totp {
  uri: string;
  secret: string;
  backupCodes: string[];
}

/** "JBSWY3DPEHPK3PXP" → "JBSW Y3DP EHPK 3PXP", easier to type into an app. */
const groupKey = (secret: string) => secret.replace(/(.{4})(?=.)/g, '$1 ');

/** Step 3 (optional): a passkey, an authenticator app, or both. Then the recovery codes. */
const SignUpSecurePage = () => {
  const onBrand = useTokenColor('on-brand');
  const ink = useTokenColor('ink');
  const { data: session, isPending } = authClient.useSession();
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [passkeyAdded, setPasskeyAdded] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState<Totp | null>(null);
  const [code, setCode] = useState('');
  const [totpOn, setTotpOn] = useState(false);
  const [totpError, setTotpError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showCodes, setShowCodes] = useState(false);
  const autoStarted = useRef(false);

  useEffect(() => {
    if (!session) return;
    authClient.listAccounts().then(({ data }) => {
      setHasPassword(Boolean(data?.some((account) => account.providerId === 'credential')));
    });
  }, [session]);

  const startTotp = async () => {
    setTotpError(null);
    const { data, error } = await authClient.twoFactor.enable(hasPassword ? { password } : {});
    if (error || !data || !('totpURI' in data)) {
      setTotpError(errorMessage(error, 'Couldn’t start setup. Check your password and try again.'));
      return;
    }
    setPassword('');
    setTotp({
      uri: data.totpURI,
      secret: new URL(data.totpURI).searchParams.get('secret') ?? '',
      backupCodes: data.backupCodes,
    });
  };

  // GitHub accounts have no password to confirm, so setup can start straight away.
  useEffect(() => {
    if (hasPassword !== false || autoStarted.current) return;
    autoStarted.current = true;
    startTotp();
  });

  const finish = () => router.replace('/');

  if (!isPending && !session) return <Redirect href="/sign-in" />;
  if (showCodes && totp) return <RecoveryCodes codes={totp.backupCodes} onDone={finish} />;

  const createPasskey = async () => {
    setPasskeyError(null);
    try {
      const { error } = await addPasskey();
      if (error) throw new Error(error.message);
      setPasskeyAdded(true);
    } catch (cause) {
      setPasskeyError(
        cause instanceof Error && cause.message
          ? cause.message
          : 'The passkey wasn’t saved. Try again.',
      );
    }
  };

  // On the phone itself there's no QR code to scan: open the authenticator with the setup link.
  const openAuthenticator = async () => {
    if (!totp) return;
    try {
      await Linking.openURL(totp.uri);
    } catch {
      setTotpError('No authenticator app opened. Copy the key into your app instead.');
    }
  };

  const copyKey = async () => {
    if (!totp) return;
    await Clipboard.setStringAsync(totp.secret, { android: { isSensitive: true } });
    setCopied(true);
  };

  const turnOn = async () => {
    setTotpError(null);
    if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(code)) {
      setTotpError(`Enter the ${CODE_LENGTH}-digit code from your app.`);
      return;
    }
    const { error } = await authClient.twoFactor.verifyTotp({ code });
    if (error) {
      setTotpError(errorMessage(error, 'That code didn’t work. Try the next one.'));
      return;
    }
    setTotpOn(true);
  };

  return (
    <AuthScreen right={<TextLink onPress={finish}>Skip</TextLink>}>
      <Stepper label="Sign-up progress" steps={SIGN_UP_STEPS} current={2} compact />
      <AuthHeading title="Lock it" accent="down.">
        Optional, but recommended. You can change it any time in your account settings.
      </AuthHeading>

      {isPasskeySupported() && (
        <View className="gap-4 rounded-[1.75rem] bg-ink p-6">
          <View className="flex-row items-center justify-between">
            <View className="size-12 items-center justify-center rounded-full bg-brand">
              <KeyRound color={onBrand} size={22} strokeWidth={2} />
            </View>
            <Badge tone="neutral">Recommended</Badge>
          </View>
          <Text className="text-[1.75rem] leading-7 font-extrabold uppercase text-on-ink">
            Add a passkey
          </Text>
          <Text className="text-[1rem] leading-6 font-semibold text-on-ink">
            Sign in with Face ID, fingerprint or screen lock. Synced across your devices.
          </Text>
          {passkeyError && (
            <Text accessibilityRole="alert" className="text-meta font-bold text-brand-on-ink">
              {passkeyError}
            </Text>
          )}
          <Button
            variant="brand"
            size="lg"
            block
            icon={passkeyAdded ? Check : undefined}
            disabled={passkeyAdded}
            onClick={createPasskey}
          >
            {passkeyAdded ? 'Passkey added' : 'Create a passkey'}
          </Button>
        </View>
      )}

      <View className="gap-4 rounded-[1.25rem] border border-line bg-surface p-6">
        <View className="flex-row items-center gap-3">
          <View className="size-12 items-center justify-center rounded-full bg-surface-muted">
            <Smartphone color={ink} size={22} strokeWidth={2} />
          </View>
          <Text className="flex-1 text-[1.75rem] leading-7 font-extrabold uppercase text-ink">
            Authenticator app
          </Text>
        </View>

        {!totp && hasPassword && (
          <>
            <Field label="Confirm your password" description="Then add SprintStack to your app.">
              <InputPassword value={password} onChange={setPassword} />
            </Field>
            <Button variant="primary" block disabled={!password} onClick={startTotp}>
              Set up authenticator
            </Button>
          </>
        )}

        {totp && (
          <>
            <Text className="text-[1rem] leading-6 font-semibold text-ink-muted">
              On this phone there’s no QR code to scan: open your authenticator directly, or copy
              the key.
            </Text>
            <Button variant="secondary" block onClick={openAuthenticator}>
              Open authenticator app
            </Button>
            <View className="min-h-11 flex-row items-center gap-2 rounded-xl bg-surface-muted py-1 pr-1.5 pl-3.5">
              <Text selectable className="flex-1 font-mono text-[0.9375rem] leading-5 text-ink">
                {groupKey(totp.secret)}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                icon={copied ? Check : Copy}
                onClick={copyKey}
              >
                {copied ? 'Setup key copied' : 'Copy setup key'}
              </Button>
            </View>
            <Field label={`Then enter the ${CODE_LENGTH}-digit code`}>
              <Input
                value={code}
                onChange={(next) => setCode(next.replace(/\D/g, '').slice(0, CODE_LENGTH))}
                autoComplete="one-time-code"
                placeholder="123456"
                disabled={totpOn}
              />
            </Field>
            <Button
              variant="primary"
              block
              icon={totpOn ? Check : undefined}
              disabled={totpOn}
              onClick={turnOn}
            >
              {totpOn ? 'Turned on' : 'Turn on'}
            </Button>
          </>
        )}

        {totpError && (
          <Notice tone="danger" title="Authenticator not on yet">
            {totpError}
          </Notice>
        )}
      </View>

      <Button
        variant="brand"
        size="lg"
        block
        onClick={() => (totpOn ? setShowCodes(true) : finish())}
      >
        Continue
      </Button>
    </AuthScreen>
  );
};

export default SignUpSecurePage;
