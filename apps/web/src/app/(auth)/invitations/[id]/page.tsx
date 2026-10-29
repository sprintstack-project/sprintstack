'use client';

import { Button } from '@sprintstack/ui';
import { MailOpen } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthHeading, AuthIcon, AuthShell } from '@/components/auth/auth-shell';
import { Notice } from '@/components/auth/notice';
import { afterSignIn, authClient, errorMessage, rememberInvitation } from '@/lib/auth-client';

interface Invitation {
  organization: string;
  inviter: string;
  role: string;
}

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; invitation: Invitation }
  /** Signed in with an address the invite wasn't sent to. */
  | { kind: 'wrong-account' }
  /** Expired, cancelled, already used, or the organization is gone. */
  | { kind: 'gone'; message: string }
  | { kind: 'declined' };

/**
 * Opened from the invite email (sendInvitationEmail in apps/api). Better Auth only shows or accepts
 * an invite for the signed-in, verified address it was sent to, so signed-out and unverified
 * visitors are sent through sign-in or verification first and come back here afterwards.
 */
const InvitationPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending } = authClient.useSession();
  const signedIn = Boolean(session);
  const verified = Boolean(session?.user.emailVerified);
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    if (!signedIn || !verified) {
      rememberInvitation(id);
      return;
    }
    let active = true;
    authClient.organization.getInvitation({ query: { id } }).then(({ data, error }) => {
      if (!active) return;
      if (error) {
        if (error.status === 403) {
          rememberInvitation(id);
          setState({ kind: 'wrong-account' });
        } else {
          rememberInvitation(null);
          setState({
            kind: 'gone',
            message: 'It may have expired, been cancelled, or been used already.',
          });
        }
        return;
      }
      setState({
        kind: 'ready',
        invitation: {
          organization: data.organizationName,
          inviter: data.inviterEmail,
          role: data.role,
        },
      });
    });
    return () => {
      active = false;
    };
  }, [id, isPending, signedIn, verified]);

  const accept = async () => {
    setBusy(true);
    setError(null);
    const { error } = await authClient.organization.acceptInvitation({ invitationId: id });
    if (error) {
      setBusy(false);
      setError(errorMessage(error, 'Couldn’t join. Try again.'));
      return;
    }
    // Accepting also makes it the active organization.
    rememberInvitation(null);
    router.push(afterSignIn());
  };

  const decline = async () => {
    setBusy(true);
    setError(null);
    const { error } = await authClient.organization.rejectInvitation({ invitationId: id });
    setBusy(false);
    if (error) {
      setError(errorMessage(error, 'Couldn’t decline. Try again.'));
      return;
    }
    rememberInvitation(null);
    setState({ kind: 'declined' });
  };

  // The invite stays remembered, so signing in again comes back here.
  const switchAccount = async () => {
    await authClient.signOut();
    router.push('/signin');
  };

  const content = () => {
    if (isPending) return null;

    if (!session) {
      return (
        <>
          <AuthHeading eyebrow="Invitation" title="You’re invited.">
            Sign in or create an account with the email address this invite was sent to, and you’ll
            come straight back here to join.
          </AuthHeading>
          <div className="flex flex-col gap-3">
            <Button variant="primary" size="lg" block onClick={() => router.push('/signin')}>
              Sign in
            </Button>
            <Button variant="secondary" size="lg" block onClick={() => router.push('/signup')}>
              Create an account
            </Button>
          </div>
        </>
      );
    }

    if (!session.user.emailVerified) {
      return (
        <>
          <AuthHeading eyebrow="Invitation" title="Verify your email first.">
            Invites only work for a verified address. Confirm <strong>{session.user.email}</strong>{' '}
            and you’ll come back here to join.
          </AuthHeading>
          <Button variant="primary" size="lg" block onClick={() => router.push('/signup/verify')}>
            Verify email
          </Button>
        </>
      );
    }

    switch (state.kind) {
      case 'loading':
        return null;
      case 'wrong-account':
        return (
          <>
            <AuthHeading eyebrow="Invitation" title="Wrong account.">
              This invite was sent to a different email address than{' '}
              <strong>{session.user.email}</strong>. Sign in with the address it was sent to.
            </AuthHeading>
            <Button variant="primary" size="lg" block onClick={switchAccount}>
              Sign in with another account
            </Button>
          </>
        );
      case 'gone':
        return (
          <>
            <AuthHeading eyebrow="Invitation" title="This invite can’t be used.">
              {state.message} Ask whoever invited you to send a new one.
            </AuthHeading>
            <Button variant="secondary" size="lg" block onClick={() => router.push(afterSignIn())}>
              Go to SprintStack
            </Button>
          </>
        );
      case 'declined':
        return (
          <>
            <Notice tone="success" title="Invite declined">
              You won’t be added. If that was a mistake, ask for a new invite.
            </Notice>
            <Button variant="secondary" size="lg" block onClick={() => router.push(afterSignIn())}>
              Go to SprintStack
            </Button>
          </>
        );
      case 'ready': {
        const { organization, inviter, role } = state.invitation;
        return (
          <>
            <AuthHeading eyebrow="Invitation" title={`Join ${organization}.`}>
              <strong>{inviter}</strong> invited you to work with them on SprintStack. Your role
              will be <strong>{role}</strong>.
            </AuthHeading>
            {error && (
              <Notice tone="danger" title="Not joined">
                {error}
              </Notice>
            )}
            <div className="flex flex-col gap-3">
              <Button variant="primary" size="lg" block disabled={busy} onClick={accept}>
                Accept and join
              </Button>
              <Button variant="secondary" size="lg" block disabled={busy} onClick={decline}>
                Decline
              </Button>
            </div>
          </>
        );
      }
    }
  };

  return (
    <AuthShell
      headerRight={
        session && (
          <Button variant="link" onClick={switchAccount}>
            Not {session.user.email}?
          </Button>
        )
      }
      aside={{
        eyebrow: 'Invitation',
        title: (
          <>
            Your team
            <br />
            is <em>waiting.</em>
          </>
        ),
        children: 'Join to see the board, the backlog and the sprint your team is working in.',
      }}
    >
      <AuthIcon>
        <MailOpen aria-hidden strokeWidth={2} />
      </AuthIcon>
      {content()}
    </AuthShell>
  );
};

export default InvitationPage;
