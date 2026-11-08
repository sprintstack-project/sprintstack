'use client';

import { Dialog } from '@base-ui/react/dialog';
import { twMerge } from '@lib/tw-merge';
import { useCreateProject } from '@sprintstack/api-client/projects';
import { useAppForm } from '@sprintstack/forms/form';
import {
  PROJECT_DESCRIPTION_MAX_LENGTH,
  type ProjectDetailsInput,
  projectDetailsSchema,
} from '@sprintstack/shared/schemas/project';
import Button from '@ui/button';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Notice } from '@/components/auth/notice';
import { useProjectContext } from '@/providers/(main)/project';

const defaultValues: ProjectDetailsInput = { name: '', key: '', description: '' };

/** Mounted while open, so each opening starts with an empty form. */
const Body = ({ onClose }: { onClose: () => void }) => {
  const { setProjectId } = useProjectContext();
  const [, createProject] = useCreateProject();
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues,
    validators: { onChange: projectDetailsSchema },
    onSubmit: async ({ value }) => {
      setError(null);
      const { data, error } = await createProject({ input: projectDetailsSchema.parse(value) });
      if (!data?.createProject) {
        const conflict = error?.graphQLErrors.find((e) => e.extensions?.code === 'CONFLICT');
        setError(conflict?.message ?? 'Couldn’t create the project. Try again.');
        return;
      }
      onClose();
      // Selecting it re-renders the dashboard, which swaps this card for the project's sprint.
      setProjectId(data.createProject.id);
    },
  });

  return (
    <>
      <header className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
        <div className="flex flex-col gap-2">
          <Dialog.Title className="headline text-[2.25rem] leading-none text-ink">
            Create your first project
          </Dialog.Title>
          <Dialog.Description className="text-[1.0625rem] leading-6 font-semibold text-ink-muted font-stretch-semi-condensed">
            You can change these details later in project settings.
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
            <Notice tone="danger" title="Project not created">
              {error}
            </Notice>
          )}
          <form.AppField name="name">
            {(f) => <f.TextField label="Project name" required autoComplete="off" />}
          </form.AppField>
          <form.AppField
            name="key"
            listeners={{
              // Keys are capitals, whatever was typed.
              onChange: ({ value }) => {
                const upper = value.toUpperCase();
                if (upper !== value) form.setFieldValue('key', upper);
              },
            }}
          >
            {(f) => (
              <f.TextField
                label="Key"
                required
                description="Prefix for work item IDs, e.g. PAY-1482"
                autoComplete="off"
              />
            )}
          </form.AppField>
          <form.AppField name="description">
            {(f) => (
              <f.TextAreaField
                label="Description"
                rows={3}
                maxLength={PROJECT_DESCRIPTION_MAX_LENGTH}
              />
            )}
          </form.AppField>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-line px-6 py-5 md:px-8">
          <Button variant="ghost" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <form.AppForm>
            <form.SubmitButton size="lg">Create project</form.SubmitButton>
          </form.AppForm>
        </footer>
      </form>
    </>
  );
};

interface CreateProjectProps {
  className?: string;
  /** The trigger's content. */
  children: ReactNode;
}

/** A button that opens a dialog for creating a project, then selects the new project. */
const CreateProject = ({ className, children }: CreateProjectProps) => {
  const [open, setOpen] = useState(false);

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
          <Body onClose={() => setOpen(false)} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateProject;
