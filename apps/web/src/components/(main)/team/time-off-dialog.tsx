'use client';

import { Dialog } from '@base-ui/react/dialog';
import { PortalContainerProvider } from '@lib/portal-container';
import { useAppForm, useSelector } from '@sprintstack/forms';
import { timeOffSchema } from '@sprintstack/shared';
import { Button } from '@ui/button';
import { clsx } from 'clsx';
import { Check, Trash2, TriangleAlert, X } from 'lucide-react';
import { useState } from 'react';
import { Segmented } from '../timeline/toolbar';
import {
  type Adjustments,
  datesOf,
  draftDays,
  formatDays,
  HOLIDAY_MARKERS,
  impactOf,
  MEMBER_OPTIONS,
  rangeLabel,
  TIME_OFF_TYPES,
  type TimeOff,
  type TimeOffDraft,
  TYPE_LABEL,
  timeOffForm,
  timeOffOf,
  workingDaysError,
} from './data';

const types = TIME_OFF_TYPES.map((value) => ({ value, label: TYPE_LABEL[value] }));

interface BodyProps {
  initial: TimeOffDraft;
  timeOff: TimeOff[];
  adjust: Adjustments;
  onSave: (entry: TimeOff) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

/** Mounted while open, so each opening starts from the draft it was given. */
const Body = ({ initial, timeOff, adjust, onSave, onRemove, onClose }: BodyProps) => {
  const { id, ...defaultValues } = initial;
  const form = useAppForm({
    ...timeOffForm,
    defaultValues,
    onSubmit: ({ value }) => {
      onSave(timeOffOf(id ?? String(Date.now()), timeOffSchema.parse(value)));
      onClose();
    },
  });

  const values = useSelector(form.store, (state) => state.values);
  const dates = datesOf(values.dates);
  const days = draftDays(values);
  const impact = impactOf({ ...values, id }, timeOff, adjust);

  return (
    <>
      <header className="flex items-start justify-between gap-4 px-6 pt-6 md:px-8 md:pt-8">
        <Dialog.Title className="headline text-[2.25rem] leading-none text-ink">
          {id ? 'Edit time off' : 'Add time off'}
        </Dialog.Title>
        <Dialog.Close
          aria-label="Close"
          className="kbd-focus -mt-2 -mr-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover"
        >
          <X aria-hidden strokeWidth={2} className="size-7" />
        </Dialog.Close>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-6 md:px-8">
        <form.AppField name="member">
          {(f) => <f.SelectField label="Who" options={MEMBER_OPTIONS} />}
        </form.AppField>
        <form.AppField
          name="type"
          listeners={{
            // A half day is one day, so a longer run shrinks to its first day.
            onChange: ({ value }) => {
              const picked = form.getFieldValue('dates');
              if (value === 'half' && picked && picked.start !== picked.end) {
                form.setFieldValue('dates', { start: picked.start, end: picked.start });
              }
            },
          }}
        >
          {(f) => (
            <div className="flex flex-col gap-3">
              <p className="text-[1.0625rem] leading-5.5 font-bold text-ink font-stretch-semi-condensed">
                Type
              </p>
              <div className="self-start">
                <Segmented
                  label="Type"
                  choices={types}
                  value={f.state.value}
                  onChange={f.handleChange}
                />
              </div>
            </div>
          )}
        </form.AppField>
        <form.AppField
          name="dates"
          validators={{ onChange: ({ value }) => workingDaysError(value) }}
        >
          {(f) => (
            <f.RangeCalendarField
              label="Days off"
              single={values.type === 'half'}
              markers={HOLIDAY_MARKERS}
            />
          )}
        </form.AppField>
        <div className="flex min-h-14 items-center justify-between gap-3 rounded-xl bg-surface-muted px-5 py-3">
          <p className="text-[1.0625rem] leading-6 font-bold text-ink font-stretch-semi-condensed">
            {dates ? rangeLabel(dates.start, dates.end) : 'Pick the days on the calendar'}
          </p>
          {dates && (
            <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-surface px-3 font-display text-[0.8125rem] leading-4 font-extrabold whitespace-nowrap text-ink-muted uppercase tracking-[.03em] font-stretch-condensed">
              {days === 0
                ? 'No working days'
                : `${formatDays(days)} working ${days === 1 ? 'day' : 'days'}`}
            </span>
          )}
        </div>
        {impact && days > 0 && (
          <div
            role="status"
            className={clsx(
              'flex items-start gap-3 rounded-xl px-5 py-4 text-[1.0625rem] leading-6 font-stretch-semi-condensed',
              impact.fits
                ? 'bg-success-subtle text-success-ink'
                : 'bg-warning-subtle text-warning-ink',
            )}
          >
            {impact.fits ? (
              <Check aria-hidden strokeWidth={2.5} className="mt-0.5 size-5 shrink-0" />
            ) : (
              <TriangleAlert aria-hidden strokeWidth={2} className="mt-0.5 size-5 shrink-0" />
            )}
            <p>
              <strong className="font-extrabold">{impact.headline}</strong>
              {impact.detail && ` ${impact.detail}`}
            </p>
          </div>
        )}
      </div>

      <footer className="flex items-center gap-3 border-t border-line px-6 py-5 md:px-8">
        {id && (
          <Button
            variant="danger"
            icon={Trash2}
            onClick={() => {
              onRemove(id);
              onClose();
            }}
          >
            Remove
          </Button>
        )}
        <div className="ml-auto flex items-center gap-3">
          <Button variant="ghost" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <form.AppForm>
            <form.SubmitButton size="lg">Save time off</form.SubmitButton>
          </form.AppForm>
        </div>
      </footer>
    </>
  );
};

interface TimeOffDialogProps {
  /** The draft to open with; null keeps the dialog closed. */
  draft: TimeOffDraft | null;
  onClose: () => void;
  timeOff: TimeOff[];
  adjust: Adjustments;
  onSave: (entry: TimeOff) => void;
  onRemove: (id: string) => void;
}

/** Adding or editing one stretch of time off, with what it does to the sprint. */
const TimeOffDialog = ({ draft, onClose, ...body }: TimeOffDialogProps) => {
  // Menus open inside the dialog, so they sit above it and stay in its focus trap.
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  // The last draft stays shown while the dialog animates out; each opening remounts the body.
  const [shown, setShown] = useState({ draft, opening: 0 });
  if (draft && draft !== shown.draft) setShown({ draft, opening: shown.opening + 1 });

  return (
    <Dialog.Root open={draft !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={clsx(
            'fixed inset-0 z-(--z-dialog) bg-scrim transition-opacity duration-200',
            'data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none',
          )}
        />
        <Dialog.Popup
          className={clsx(
            'fixed top-1/2 left-1/2 z-(--z-dialog) flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[38rem] -translate-x-1/2 -translate-y-1/2 flex-col rounded-3xl border border-line bg-surface text-ink shadow-popover outline-none',
            'transition-[scale,opacity] duration-200 ease-out motion-reduce:transition-none',
            'data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
          )}
        >
          <PortalContainerProvider value={container}>
            {shown.draft && (
              <Body key={shown.opening} initial={shown.draft} onClose={onClose} {...body} />
            )}
          </PortalContainerProvider>
          <div ref={setContainer} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TimeOffDialog;
