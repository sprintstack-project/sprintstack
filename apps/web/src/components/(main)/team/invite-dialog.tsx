'use client';

import { Dialog } from '@base-ui/react/dialog';
import { PortalContainerProvider } from '@lib/portal-container';
import { useAppForm } from '@sprintstack/forms';
import {
  INVITE_ROLE_LABEL,
  INVITE_ROLES,
  type InviteInput,
  type InviteRole,
  inviteSchema,
} from '@sprintstack/shared';
import { Button } from '@ui/button';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Notice } from '@/components/auth/notice';
import { authClient, errorMessage } from '@/lib/auth-client';

const roles = INVITE_ROLES.map((value) => ({ value, label: INVITE_ROLE_LABEL[value] }));

const defaultValues: InviteInput = { email: '', role: 'member' };

interface Pending {
  id: string;
  email: string;
  role: string;
  expiresAt: Date;
}

const roleLabel = (role: string) => INVITE_ROLE_LABEL[role as InviteRole] ?? role;

/** Mounted while open, so each opening starts with an empty form and a fresh pending list. */
const Body = ({ onClose }: { onClose: () => void }) => {
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending[] | null>(null);

  const loadPending = useCallback(async () => {
    const { data } = await authClient.organization.listInvitations();
    setPending(
      (data ?? [])
        .filter((i) => i.status === 'pending' && new Date(i.expiresAt) > new Date())
        .map((i) => ({
          id: i.id,
          email: i.email,
          role: i.role ?? 'member',
          expiresAt: new Date(i.expiresAt),
        })),
    );
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const form = useAppForm({
    defaultValues,
    validators: { onChange: inviteSchema },
    onSubmit: async ({ value, formApi }) => {
      setSent(null);
      setError(null);
      const { email, role } = inviteSchema.parse(value);
      // Goes to the session's active organization; the API emails the link.
      const { error } = await authClient.organization.inviteMember({ email, role });
      if (error) {
        setError(errorMessage(error, 'Couldn’t send the invite. Try again.'));
        return;
      }
      setSent(email);
      formApi.reset();
      loadPending();
    },
  });

  const cancel = async (id: string) => {
    setError(null);
    const { error } = await authClient.organization.cancelInvitation({ invitationId: id });
    if (error) {
      setError(errorMessage(error, 'Couldn’t cancel the invite. Try again.'));
      return;
    }
    loadPending();
  };

  return (
    <>
      <header className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
        <div className="flex flex-col gap-2">
          <Dialog.Title className="headline text-[2.25rem] leading-none text-ink">
            Invite people
          </Dialog.Title>
          <Dialog.Description className="text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
            They’ll get an email with a link to join. Invites expire after 48 hours.
          </Dialog.Description>
        </div>
        <Dialog.Close
          aria-label="Close"
          className="kbd-focus -mt-2 -mr-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover"
        >
          <X aria-hidden strokeWidth={2} className="size-7" />
        </Dialog.Close>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-6 md:px-8">
        {error && (
          <Notice tone="danger" title="Invite not sent">
            {error}
          </Notice>
        )}
        {sent && !error && (
          <Notice tone="success" title="Invite sent">
            {sent} will get an email with a link to join.
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
          <form.AppField name="email">
            {(f) => (
              <f.TextField
                label="Email"
                type="email"
                autoComplete="off"
                placeholder="teammate@company.com"
              />
            )}
          </form.AppField>
          <form.AppField name="role">
            {(f) => (
              <f.SelectField
                label="Role"
                description="Admins can also invite people and change settings."
                options={roles}
              />
            )}
          </form.AppField>
          <form.AppForm>
            <form.SubmitButton size="lg">Send invite</form.SubmitButton>
          </form.AppForm>
        </form>

        {pending && pending.length > 0 && (
          <section className="flex flex-col gap-3 border-t border-line pt-5">
            <h3 className="eyebrow">Pending invites</h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {pending.map((invite) => (
                <li
                  key={invite.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-surface-muted px-4 py-3"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[1.0625rem] leading-6 font-bold text-ink font-stretch-semi-condensed">
                      {invite.email}
                    </span>
                    <span className="text-meta font-semibold text-ink-muted">
                      {roleLabel(invite.role)} · expires {format(invite.expiresAt, 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => cancel(invite.id)}>
                    Cancel invite
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <footer className="flex items-center justify-end gap-3 border-t border-line px-6 py-5 md:px-8">
        <Button variant="ghost" size="lg" onClick={onClose}>
          Done
        </Button>
      </footer>
    </>
  );
};

/** Invites people to the active organization by email, and lists the invites still open. */
const InviteDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  // Menus open inside the dialog, so they sit above it and stay in its focus trap.
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  // Each opening remounts the body.
  const [opening, setOpening] = useState({ open, count: 0 });
  if (open !== opening.open) setOpening({ open, count: opening.count + (open ? 1 : 0) });

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={clsx(
            'fixed inset-0 z-(--z-dialog) bg-scrim transition-opacity duration-200',
            'data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none',
          )}
        />
        <Dialog.Popup
          className={clsx(
            'fixed top-1/2 left-1/2 z-(--z-dialog) flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-152 -translate-x-1/2 -translate-y-1/2 flex-col rounded-3xl border border-line bg-surface text-ink shadow-popover outline-none',
            'transition-[scale,opacity] duration-200 ease-out motion-reduce:transition-none',
            'data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
          )}
        >
          <PortalContainerProvider value={container}>
            <Body key={opening.count} onClose={onClose} />
          </PortalContainerProvider>
          <div ref={setContainer} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default InviteDialog;
