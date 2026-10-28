'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Tabs } from '@base-ui/react/tabs';
import { PortalContainerProvider } from '@lib/portal-container';
import { useAppForm, useSelector } from '@sprintstack/forms';
import { type NewWorkItem as Created, workItemSchema } from '@sprintstack/shared';
import { Button } from '@ui/button';
import type { IconComponent } from '@ui/types';
import { clsx } from 'clsx';
import {
  FileText,
  History,
  Link2,
  Lock,
  Maximize2,
  MessageSquare,
  Minimize2,
  Paperclip,
  TriangleAlert,
  X,
} from 'lucide-react';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { AttachmentsTab } from './attachments-tab';
import { emptyWorkItem, NONE, SPRINT_OPTIONS, workItemForm } from './data';
import { CriteriaField, DescriptionMeta } from './description-tab';
import { clearDraft, loadDraft, saveDraft } from './draft';
import { LinksField } from './links-tab';
import { Properties } from './properties';
import { useUploads } from './use-uploads';

type Tab = 'description' | 'links' | 'attachments';

const SAVE_DELAY_MS = 400;

const kbd = 'rounded-md border px-1.5 py-0.5 font-sans text-badge';

const iconButton =
  'kbd-focus grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover';

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

const tabClass = clsx(
  'flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full px-5 text-[1.0625rem] leading-5 font-extrabold whitespace-nowrap text-ink font-stretch-condensed',
  'not-data-disabled:not-data-active:hover:bg-surface-hover data-active:bg-ink data-active:text-on-ink',
  'data-disabled:cursor-not-allowed data-disabled:text-ink-muted',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
);

const TabLabel = ({
  icon: Icon,
  label,
  count,
  locked,
}: {
  icon: IconComponent;
  label: string;
  count?: number;
  locked?: boolean;
}) => (
  <>
    <Icon aria-hidden strokeWidth={2} className="size-5" />
    {label}
    {count !== undefined && (
      <span className="grid h-6 min-w-6 place-items-center rounded-full bg-surface px-1.5 text-badge text-ink tabular-nums in-data-active:bg-brand in-data-active:text-on-brand">
        {count}
      </span>
    )}
    {locked && (
      <>
        <Lock aria-hidden strokeWidth={2} className="size-4" />
        <span className="sr-only">, available once the item is created</span>
      </>
    )}
  </>
);

interface BodyProps {
  sprint?: string | null;
  onCreate: (item: Created) => void;
  onClose: () => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /** Filled in with this body's discard, so Esc on the dialog can run it. */
  discardRef: RefObject<(() => void) | null>;
}

/** Mounted while the dialog is open, so each opening starts from the saved draft (or blank). */
const Body = ({ sprint, onCreate, onClose, expanded, onExpandedChange, discardRef }: BodyProps) => {
  const [draft] = useState(loadDraft);
  const [savedAt, setSavedAt] = useState(draft?.savedAt ?? null);
  const [tab, setTab] = useState<Tab>('description');
  const [waitingForUploads, setWaitingForUploads] = useState(false);
  const titleRef = useRef<{ focus: () => void }>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastSaved = useRef(
    draft ? JSON.stringify({ values: draft.values, files: draft.files }) : '',
  );

  const form = useAppForm({
    ...workItemForm,
    defaultValues: draft?.values ?? emptyWorkItem(sprint),
    onSubmit: ({ value }) => {
      if (uploads.pending > 0) {
        setWaitingForUploads(true);
        return;
      }
      onCreate(workItemSchema.parse(value));
      clearTimeout(saveTimer.current);
      clearDraft();
      setSavedAt(null);
      onClose();
    },
  });

  const uploads = useUploads({
    initial: draft?.files,
    onDone: (id) => form.pushFieldValue('attachments', id),
    onRemove: (id) =>
      form.setFieldValue('attachments', (ids) => ids.filter((existing) => existing !== id)),
  });

  const values = useSelector(form.store, (state) => state.values);
  const links = values.links.length;
  const attention = useSelector(form.store, (state) =>
    state.submissionAttempts > 0
      ? Object.values(state.fieldMeta).filter((meta) => meta && meta.errors.length > 0).length
      : 0,
  );
  const waiting = waitingForUploads && uploads.pending > 0;
  const sprintName =
    SPRINT_OPTIONS.find((o) => o.value === (values.sprint ?? NONE))?.label ?? 'Backlog';

  // Save the draft shortly after typing stops. Uploads still going are left out.
  const doneFiles = uploads.uploads.filter((u) => u.status === 'done');
  const snapshot = JSON.stringify({ values, files: doneFiles });
  useEffect(() => {
    if (snapshot === lastSaved.current) return;
    saveTimer.current = setTimeout(() => {
      const { values: v, files } = JSON.parse(snapshot);
      lastSaved.current = snapshot;
      setSavedAt(saveDraft(v, files));
    }, SAVE_DELAY_MS);
    return () => clearTimeout(saveTimer.current);
  }, [snapshot]);

  const discard = () => {
    clearTimeout(saveTimer.current);
    clearDraft();
  };
  useEffect(() => {
    discardRef.current = discard;
  });

  return (
    // ⌘↵ creates the item from anywhere in the dialog.
    // biome-ignore lint/a11y/noStaticElementInteractions: a keyboard shortcut, not a control
    <div
      className="flex min-h-0 flex-1 flex-col"
      onKeyDown={(e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          form.handleSubmit();
        }
      }}
    >
      <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 md:px-10">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="eyebrow">Payments · {sprintName}</p>
          <Dialog.Title className="headline text-[2rem] leading-none text-ink">
            New work item
          </Dialog.Title>
        </div>
        <div className="flex items-center gap-2">
          <span
            aria-live="polite"
            className="mr-2 text-meta text-ink-muted font-stretch-semi-condensed max-sm:hidden"
          >
            {savedAt ? 'Draft saved' : ''}
          </span>
          <button
            type="button"
            aria-label={expanded ? 'Shrink' : 'Expand'}
            aria-pressed={expanded}
            onClick={() => onExpandedChange(!expanded)}
            className={clsx(iconButton, 'max-md:hidden')}
          >
            {expanded ? (
              <Minimize2 aria-hidden strokeWidth={2} className="size-6" />
            ) : (
              <Maximize2 aria-hidden strokeWidth={2} className="size-6" />
            )}
          </button>
          <Dialog.Close aria-label="Close and keep the draft" className={iconButton}>
            <X aria-hidden strokeWidth={2} className="size-8" />
          </Dialog.Close>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Phones stack title, details, tabs; wider screens put the details in a column. */}
        <div className="grid min-h-full lg:grid-cols-[minmax(0,1fr)_29rem] lg:grid-rows-[auto_1fr]">
          <div className="flex flex-col gap-8 px-6 pt-8 pb-4 md:px-10 lg:col-start-1 lg:row-start-1">
            {(attention > 0 || waiting) && (
              <div
                role="alert"
                className="flex items-center gap-3 rounded-xl bg-brand-subtle px-5 py-4 text-[1.0625rem] leading-6 font-bold text-ink font-stretch-semi-condensed"
              >
                <TriangleAlert
                  aria-hidden
                  strokeWidth={2}
                  className="size-6 shrink-0 text-brand-ink"
                />
                {attention > 0
                  ? `${attention} ${attention === 1 ? 'field needs' : 'fields need'} attention before you can create this item.`
                  : `Wait for ${uploads.pending === 1 ? 'the upload' : `${uploads.pending} uploads`} to finish before you create this item.`}
              </div>
            )}
            <form.AppField name="title">
              {(f) => (
                <f.HeadlineField
                  ref={titleRef}
                  label="Title"
                  placeholder="What needs doing?"
                  autoFocus
                />
              )}
            </form.AppField>
          </div>

          <aside
            aria-label="Details"
            className="border-y border-line px-6 py-8 md:px-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:border-y-0 lg:border-l lg:px-8"
          >
            <Properties form={form} />
          </aside>

          <Tabs.Root
            value={tab}
            onValueChange={(next) => setTab(next as Tab)}
            className="flex min-w-0 flex-col gap-8 px-6 pt-4 pb-10 md:px-10 lg:col-start-1 lg:row-start-2"
          >
            <Tabs.List
              aria-label="Work item sections"
              className="-mx-2 flex gap-1 overflow-x-auto rounded-full bg-surface-muted p-1.5"
            >
              <Tabs.Tab value="description" className={tabClass}>
                <TabLabel icon={FileText} label="Description" />
              </Tabs.Tab>
              <Tabs.Tab value="links" className={tabClass}>
                <TabLabel icon={Link2} label="Links" count={links} />
              </Tabs.Tab>
              <Tabs.Tab value="attachments" className={tabClass}>
                <TabLabel icon={Paperclip} label="Attachments" count={uploads.uploads.length} />
              </Tabs.Tab>
              <Tabs.Tab
                value="comments"
                disabled
                title="Available once the item is created"
                className={tabClass}
              >
                <TabLabel icon={MessageSquare} label="Comments" locked />
              </Tabs.Tab>
              <Tabs.Tab
                value="activity"
                disabled
                title="Available once the item is created"
                className={tabClass}
              >
                <TabLabel icon={History} label="Activity" locked />
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="description" className="flex flex-col gap-8 outline-none">
              <form.AppField name="description">
                {(f) => (
                  <div className="flex flex-col gap-4">
                    <f.RichTextField
                      label="Description"
                      placeholder="What’s the problem, and what does done look like?"
                      minRows={6}
                    />
                    <DescriptionMeta savedAt={savedAt} />
                  </div>
                )}
              </form.AppField>
              <form.AppField name="criteria" mode="array">
                {() => <CriteriaField />}
              </form.AppField>
            </Tabs.Panel>
            <Tabs.Panel value="links" className="outline-none">
              <form.AppField name="links" mode="array">
                {() => <LinksField />}
              </form.AppField>
            </Tabs.Panel>
            <Tabs.Panel value="attachments" className="outline-none">
              <AttachmentsTab uploads={uploads} />
            </Tabs.Panel>
          </Tabs.Root>
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-4 md:px-10">
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-meta text-ink-muted font-stretch-semi-condensed max-md:hidden">
            <kbd className={clsx(kbd, 'border-line-strong text-ink-muted')}>Esc</kbd> to discard
          </span>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              discard();
              onClose();
            }}
          >
            Discard
          </Button>
          <form.AppForm>
            <form.SubmitButton size="lg">
              Create work item
              <kbd aria-hidden className={clsx(kbd, 'border-on-brand/40 max-md:hidden')}>
                {isMac() ? '⌘↵' : 'Ctrl ↵'}
              </kbd>
            </form.SubmitButton>
          </form.AppForm>
        </div>
      </footer>
    </div>
  );
};

interface NewWorkItemProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the validated item when it's created. */
  onCreate: (item: Created) => void;
  /** The sprint a new item starts in; null for the backlog. Defaults to the active sprint. */
  sprint?: string | null;
}

/**
 * Creating a work item: a panel over the page from the right (or the whole window, expanded).
 * Closing keeps a draft; Esc and Discard throw it away.
 */
export const NewWorkItem = ({ open, onOpenChange, onCreate, sprint }: NewWorkItemProps) => {
  const [expanded, setExpanded] = useState(false);
  // Menus open inside the panel, so they sit above it and stay in its focus trap.
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const discardRef = useRef<(() => void) | null>(null);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next, details) => {
        if (!next && details.reason === 'escape-key') discardRef.current?.();
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          className={clsx(
            'fixed inset-0 z-(--z-dialog) bg-scrim transition-opacity duration-200',
            'data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none',
          )}
        />
        <Dialog.Popup
          className={clsx(
            'fixed inset-y-0 right-0 z-(--z-dialog) flex w-full flex-col border-line bg-canvas text-ink shadow-popover outline-none md:border-l',
            // Leaves the page's navigation in view on wide screens, as a panel over the content.
            !expanded && 'md:w-[max(min(100vw,64rem),calc(100vw-22rem))]',
            'transition-[translate,opacity,width] duration-200 ease-out motion-reduce:transition-none',
            'data-ending-style:translate-x-12 data-ending-style:opacity-0 data-starting-style:translate-x-12 data-starting-style:opacity-0',
          )}
        >
          <PortalContainerProvider value={container}>
            <Body
              sprint={sprint}
              onCreate={onCreate}
              onClose={() => onOpenChange(false)}
              expanded={expanded}
              onExpandedChange={setExpanded}
              discardRef={discardRef}
            />
          </PortalContainerProvider>
          <div ref={setContainer} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
