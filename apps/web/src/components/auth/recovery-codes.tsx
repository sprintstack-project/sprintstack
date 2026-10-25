'use client';

import { Button, Checkbox } from '@sprintstack/ui';
import { Copy, Download, Printer } from 'lucide-react';
import { useState } from 'react';
import { AuthHeading, AuthShell } from '@/components/auth/auth-shell';

/** Shown once, right after the authenticator is turned on. */
export const RecoveryCodes = ({ codes, onDone }: { codes: string[]; onDone: () => void }) => {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = `SprintStack recovery codes\nEach code signs you in once.\n\n${codes.join('\n')}\n`;

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const link = Object.assign(document.createElement('a'), {
      href: url,
      download: 'sprintstack-recovery-codes.txt',
    });
    link.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
  };

  return (
    <AuthShell
      width="xl"
      headerRight="Two-step verification is on"
      aside={{
        eyebrow: 'Account secured',
        title: (
          <>
            You’re in.
            <br />
            <em>Let’s ship.</em>
          </>
        ),
        children: 'Next: create your first project and invite your team.',
      }}
    >
      <AuthHeading eyebrow="Recovery codes" title="Save these somewhere safe.">
        If you lose your phone, each code lets you sign in once. We won’t show them again.
      </AuthHeading>

      <div className="rounded-[1.25rem] border border-line bg-surface p-5">
        <ul
          aria-label="Recovery codes"
          className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-2.5 p-0 font-mono text-[1.125rem] leading-7 tracking-[.08em] tabular-nums"
        >
          {codes.map((code) => (
            <li key={code}>{code}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2.5 [&>*]:flex-[1_1_8.75rem]">
        <Button variant="secondary" icon={Download} onClick={download}>
          Download
        </Button>
        <Button variant="secondary" icon={Copy} onClick={copy}>
          {copied ? 'Copied' : 'Copy all'}
        </Button>
        <Button variant="secondary" icon={Printer} onClick={() => window.print()}>
          Print
        </Button>
      </div>

      <div className="rounded-2xl bg-surface-muted px-4.5 py-4">
        <Checkbox checked={saved} onCheckedChange={setSaved}>
          I’ve saved my recovery codes
        </Checkbox>
      </div>

      <Button variant="brand" size="lg" block disabled={!saved} onClick={onDone}>
        Go to my workspace
      </Button>
    </AuthShell>
  );
};
