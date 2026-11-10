import { Dialog } from '@base-ui/react/dialog';
import { PortalContainerProvider } from '@lib/portal-container';
import { twMerge } from '@lib/tw-merge';
import { useGetProjectSettings } from '@sprintstack/api-client/project-settings';
import { useCreateSprint, useGetAllSprints } from '@sprintstack/api-client/sprints';
import { useAppForm } from '@sprintstack/forms/form';
import { type SprintDetailsInput, sprintDetailsSchema } from '@sprintstack/shared/schemas/sprint';
import Button from '@ui/button';
import { clsx } from 'clsx';
import { add, format, parseISO } from 'date-fns';
import { X } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Notice } from '@/components/auth/notice';
import { useProjectContext } from '@/providers/(main)/project';

/** Mounted while open, so each opening starts with an empty form. */
const Body = ({ onClose }: { onClose: () => void }) => {
  const { projectId } = useProjectContext();
  const [, createSprint] = useCreateSprint();
  const [error, setError] = useState<string | null>(null);
  const { data: projectSettings } = useGetProjectSettings(projectId);
  const { data: allSprints } = useGetAllSprints(projectId);

  const sprintDuration = projectSettings?.sprintDuration ?? 14;

  const defaultValues: SprintDetailsInput = {
    name: allSprints?.length ? `Sprint ${allSprints.length + 1}` : 'Sprint 1',
    startDate: new Date().toISOString(),
    endDate: add(new Date(), { days: sprintDuration }).toISOString(),
  };

  const form = useAppForm({
    defaultValues,
    validators: { onChange: sprintDetailsSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      if (!projectId) {
        return;
      }
      const { data, error } = await createSprint({
        projectId,
        name: value.name,
        startDate: value.startDate,
        endDate: value.endDate,
      });
      if (!data?.createSprint) {
        const conflict = error?.graphQLErrors.find((e) => e.extensions?.code === 'CONFLICT');
        setError(conflict?.message ?? 'Couldn’t create the sprint. Try again.');
        return;
      }
      onClose();
    },
  });

  return (
    <>
      <header className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
        <div className="flex flex-col gap-2">
          <Dialog.Title className="headline text-[2.25rem] leading-none text-ink">
            Create Sprint
          </Dialog.Title>
          <Dialog.Description className="text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
            {/* You can change these details later in project settings. */}
          </Dialog.Description>
        </div>
        <Dialog.Close
          aria-label="Close"
          className="kbd-focus -mt-2 -mr-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover"
        >
          <X aria-hidden strokeWidth={2} className="size-7" />
        </Dialog.Close>
      </header>

      <form
        noValidate
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-6 md:px-8">
          {error && (
            <Notice tone="danger" title="Sprint not created">
              {error}
            </Notice>
          )}
          <form.AppField name="name">
            {(f) => <f.TextField label="Sprint name" required autoComplete="off" />}
          </form.AppField>
          <form.AppField
            name="startDate"
            listeners={{
              onChange: ({ value }) => {
                const endDate = value
                  ? format(add(parseISO(value), { days: sprintDuration }), 'yyyy-MM-dd')
                  : '';
                form.setFieldValue('endDate', endDate);
              },
            }}
          >
            {(f) => <f.DateField label="Start date" required />}
          </form.AppField>
          <form.AppField name="endDate">
            {(f) => <f.DateField label="End date" required disabled />}
          </form.AppField>

          <Notice tone="info" title="">
            End date is calculated based on the start date and sprint duration. You can change it in
            project settings.
          </Notice>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-line px-6 py-5 md:px-8">
          <Button variant="ghost" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <form.AppForm>
            <form.SubmitButton size="lg">Create Sprint</form.SubmitButton>
          </form.AppForm>
        </footer>
      </form>
    </>
  );
};

interface CreateSprintProps {
  className?: string;
  /** The trigger's content. */
  children: ReactNode;
}

/** A button that opens a dialog for creating a sprint, then selects the new sprint. */
const CreateSprint = ({ className, children }: CreateSprintProps) => {
  const [open, setOpen] = useState(false);
  // Menus open inside the dialog, so they sit above it and stay in its focus trap.
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={twMerge('w-full cursor-pointer text-left', className)}>
        {children}
      </Dialog.Trigger>
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
            <Body onClose={() => setOpen(false)} />
          </PortalContainerProvider>
          <div ref={setContainer} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateSprint;
