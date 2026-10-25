'use client';

import { Button } from '@sprintstack/ui';
import { Check, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AuthHeading, AuthShell } from '@/components/auth/auth-shell';
import { Notice } from '@/components/auth/notice';
import { AFTER_SIGN_IN, authClient, errorMessage } from '@/lib/auth-client';

type Status = 'waiting' | 'failed' | 'done';

/** Starts the browser's passkey prompt as soon as the page opens. */
const SignInPasskeyPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('waiting');
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  const start = useCallback(async () => {
    setStatus('waiting');
    setError(null);
    const { error } = await authClient.signIn.passkey();
    if (error) {
      setStatus('failed');
      setError(
        'code' in error && error.code === 'AUTH_CANCELLED'
          ? 'The prompt was closed before you approved it.'
          : errorMessage(error, 'The prompt was closed before you approved it.'),
      );
      return;
    }
    setStatus('done');
    router.push(AFTER_SIGN_IN);
  }, [router]);

  useEffect(() => {
    // Once per visit: development's double effect would cancel the first prompt.
    if (started.current) return;
    started.current = true;
    start();
  }, [start]);

  return (
    <AuthShell
      headerRight={
        <a href="/signin" className="link">
          Back to sign in
        </a>
      }
      aside={{
        eyebrow: 'Passkeys',
        title: (
          <>
            No password.
            <br />
            <em>No phishing.</em>
          </>
        ),
        children:
          'Passkeys live on your devices and only work on SprintStack, so there is nothing to steal or type into the wrong site.',
      }}
    >
      <div className="grid size-28 place-items-center rounded-full bg-surface-muted shadow-[0_0_0_0.625rem_var(--color-brand-subtle)]">
        <span className="grid size-18 place-items-center rounded-full bg-brand text-on-brand">
          <KeyRound aria-hidden strokeWidth={2} className="size-8" />
        </span>
      </div>
      <AuthHeading eyebrow="Passkey" title="Confirm it’s you.">
        Follow the prompt from your browser or device. Use your fingerprint, face or screen lock, or
        a security key.
      </AuthHeading>

      <ol className="m-0 flex list-none flex-col border-t border-line p-0" aria-live="polite">
        <li className="flex min-h-14 items-center gap-3.5 border-b border-line">
          <span className="grid size-7 flex-none place-items-center rounded-full bg-ink text-on-ink">
            <Check aria-hidden strokeWidth={2.5} className="size-4" />
          </span>
          <span className="text-body font-bold font-stretch-semi-condensed">
            Request sent to your device
          </span>
        </li>
        <li className="flex min-h-14 items-center gap-3.5 border-b border-line">
          <span
            className={
              status === 'done'
                ? 'grid size-7 flex-none place-items-center rounded-full bg-ink text-on-ink'
                : 'headline grid size-7 flex-none place-items-center rounded-full bg-brand text-[0.875rem] text-on-brand'
            }
          >
            {status === 'done' ? <Check aria-hidden strokeWidth={2.5} className="size-4" /> : 2}
          </span>
          <span className="text-body font-bold font-stretch-semi-condensed">
            {status === 'waiting' && 'Waiting for you to approve…'}
            {status === 'failed' && 'Not approved yet'}
            {status === 'done' && 'Approved. Signing you in…'}
          </span>
        </li>
      </ol>

      {error && (
        <Notice tone="danger" title="Passkey not used">
          {error}
        </Notice>
      )}

      <div className="flex flex-col gap-3">
        <Button variant="brand" size="lg" block disabled={status !== 'failed'} onClick={start}>
          Try again
        </Button>
        <Button variant="secondary" size="lg" block onClick={() => router.push('/signin')}>
          Use email and password
        </Button>
      </div>
      <p className="m-0 text-meta font-semibold text-ink-muted">
        No passkey on this device? Your browser’s prompt can use one from a phone or tablet nearby.
      </p>
    </AuthShell>
  );
};

export default SignInPasskeyPage;
