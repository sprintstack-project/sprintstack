'use client';

import { CODE_LENGTH, SIGN_UP_STEPS } from '@sprintstack/shared';
import { Badge, Button, Field, Input, InputPassword, Stepper } from '@sprintstack/ui';
import { Check, Copy, KeyRound, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { Notice } from '@/components/auth/notice';
import { RecoveryCodes } from '@/components/auth/recovery-codes';
import { Logo } from '@/components/landing/site-header';
import { AFTER_SIGN_IN, authClient, errorMessage } from '@/lib/auth-client';

interface Totp {
  uri: string;
  secret: string;
  backupCodes: string[];
}

const toTotp = (uri: string, backupCodes: string[]): Totp => ({
  uri,
  secret: new URL(uri).searchParams.get('secret') ?? '',
  backupCodes,
});

/** "JBSWY3DPEHPK3PXP" → "JBSW Y3DP EHPK 3PXP", easier to type into an app. */
const groupKey = (secret: string) => secret.replace(/(.{4})(?=.)/g, '$1 ');

/** Step 3 (optional): a passkey, an authenticator app, or both. Then the recovery codes. */
const SignUpSecurePage = () => {
  const router = useRouter();
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
    if (!isPending && !session) router.replace('/signin');
  }, [isPending, session, router]);

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
    setTotp(toTotp(data.totpURI, data.backupCodes));
  };

  // GitHub accounts have no password to confirm, so the QR code can show straight away.
  useEffect(() => {
    if (hasPassword !== false || autoStarted.current) return;
    autoStarted.current = true;
    startTotp();
  });

  const addPasskey = async () => {
    setPasskeyError(null);
    const { error } = await authClient.passkey.addPasskey();
    if (error) setPasskeyError(errorMessage(error, 'The passkey wasn’t saved. Try again.'));
    else setPasskeyAdded(true);
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

  const copyKey = async () => {
    if (!totp) return;
    await navigator.clipboard.writeText(totp.secret);
    setCopied(true);
  };

  const finish = () => router.push(AFTER_SIGN_IN);

  if (showCodes && totp) return <RecoveryCodes codes={totp.backupCodes} onDone={finish} />;

  return (
    <div className="min-h-screen flex-1 bg-canvas px-6 pt-8 pb-12 text-ink">
      <div className="mx-auto flex max-w-[65rem] flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <a href="/" aria-label="SprintStack home" className="text-ink no-underline">
            <Logo className="text-[1.875rem]" />
          </a>
          <div className="w-full max-w-[30rem]">
            <Stepper label="Sign-up progress" steps={SIGN_UP_STEPS} current={2} />
          </div>
        </header>

        <div className="flex max-w-[42.5rem] flex-col gap-2.5">
          <span className="eyebrow">Optional · recommended</span>
          <h1 className="headline m-0 text-[clamp(2.75rem,5vw,4rem)] leading-[0.95]">
            Lock it down.
          </h1>
          <p className="m-0 text-[1.125rem] leading-[1.625rem] font-semibold font-stretch-semi-condensed text-ink-muted">
            Add a passkey, an authenticator app, or both. You can change this any time in your
            account settings.
          </p>
        </div>

        <div className="flex flex-wrap items-stretch gap-5">
          <section
            aria-labelledby="passkey-title"
            className="flex flex-[1_1_23.75rem] flex-col gap-5 rounded-[1.75rem] bg-ink p-9 text-on-ink"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-14 place-items-center rounded-full bg-brand text-on-brand">
                <KeyRound aria-hidden strokeWidth={2} className="size-6.5" />
              </span>
              <Badge tone="neutral">Recommended</Badge>
            </div>
            <h2 id="passkey-title" className="headline m-0 text-[2.125rem] leading-none">
              Add a passkey
            </h2>
            <p className="m-0 text-[1.0625rem] leading-[1.5625rem] font-semibold font-stretch-semi-condensed">
              Sign in with your fingerprint, face or screen lock. Faster than a password and it
              can’t be phished.
            </p>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-body font-bold font-stretch-semi-condensed">
              {['Synced across your devices', 'Works with security keys'].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check aria-hidden strokeWidth={2.5} className="size-5 text-brand-on-ink" />
                  {item}
                </li>
              ))}
            </ul>
            {passkeyError && (
              <p role="alert" className="m-0 text-meta font-bold text-brand-on-ink">
                {passkeyError}
              </p>
            )}
            <div className="mt-auto">
              <Button
                variant="brand"
                size="lg"
                block
                icon={passkeyAdded ? Check : undefined}
                disabled={passkeyAdded}
                onClick={addPasskey}
              >
                {passkeyAdded ? 'Passkey added' : 'Create a passkey'}
              </Button>
            </div>
          </section>

          <section
            aria-labelledby="totp-title"
            className="flex flex-[1.3_1_28.75rem] flex-col gap-5 rounded-[1.25rem] border border-line bg-surface p-9"
          >
            <div className="flex items-center gap-4">
              <span className="grid size-14 flex-none place-items-center rounded-full bg-surface-muted">
                <Smartphone aria-hidden strokeWidth={2} className="size-6.5" />
              </span>
              <h2 id="totp-title" className="headline m-0 text-[2.125rem] leading-none">
                Authenticator app
              </h2>
            </div>

            {!totp && hasPassword && (
              <div className="flex flex-col gap-4">
                <Field
                  label="Confirm your password"
                  description="Then scan the code with your app."
                >
                  <InputPassword value={password} onChange={setPassword} />
                </Field>
                <Button variant="primary" disabled={!password} onClick={startTotp}>
                  Show setup code
                </Button>
              </div>
            )}

            {totp && (
              <ol className="m-0 flex list-none flex-col gap-5 p-0">
                <li className="flex flex-wrap items-start gap-5">
                  {/* Light in both themes: scanners need dark modules on a light quiet zone. */}
                  <div data-theme="light" className="flex-none rounded-2xl bg-surface p-3">
                    <QRCode value={totp.uri} size={124} title="Setup QR code" />
                  </div>
                  <div className="flex flex-[1_1_12.5rem] flex-col gap-2.5">
                    <strong className="headline text-[1.1875rem] leading-[1.2] normal-case">
                      1. Scan with your app
                    </strong>
                    <span className="text-meta font-semibold text-ink-muted">
                      Any TOTP app works: your phone’s password manager or a dedicated
                      authenticator. Can’t scan? Enter this key:
                    </span>
                    <div className="flex min-h-11 items-center gap-2 rounded-xl bg-surface-muted py-1 pr-1.5 pl-3.5">
                      <code className="flex-1 font-mono text-[0.9375rem] leading-5 font-semibold tracking-[.06em] [overflow-wrap:anywhere]">
                        {groupKey(totp.secret)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        icon={copied ? Check : Copy}
                        onClick={copyKey}
                      >
                        {copied ? 'Setup key copied' : 'Copy setup key'}
                      </Button>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex flex-wrap items-end gap-2.5">
                    <div className="flex-[1_1_12.5rem]">
                      <Field label={`2. Enter the ${CODE_LENGTH}-digit code`}>
                        <Input
                          value={code}
                          onChange={(next) =>
                            setCode(next.replace(/\D/g, '').slice(0, CODE_LENGTH))
                          }
                          autoComplete="one-time-code"
                          placeholder="123456"
                          disabled={totpOn}
                        />
                      </Field>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={totpOn ? Check : undefined}
                      disabled={totpOn}
                      onClick={turnOn}
                    >
                      {totpOn ? 'Turned on' : 'Turn on'}
                    </Button>
                  </div>
                </li>
              </ol>
            )}

            {totpError && (
              <Notice tone="danger" title="Authenticator not on yet">
                {totpError}
              </Notice>
            )}
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <span className="text-meta font-semibold text-ink-muted">
            Turning on the authenticator gives you recovery codes next.
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="link" onClick={finish}>
              Skip for now
            </Button>
            <Button
              variant="brand"
              size="lg"
              onClick={() => (totpOn ? setShowCodes(true) : finish())}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSecurePage;
