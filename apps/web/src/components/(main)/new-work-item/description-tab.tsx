'use client';

import { useFieldContext } from '@sprintstack/forms';
import { type Criterion, criterionSchema } from '@sprintstack/shared';
import { richTextToPlainText } from '@sprintstack/ui';
import { Button } from '@ui/button';
import { Field } from '@ui/field';
import { Input } from '@ui/input';
import type { RichTextDoc } from '@ui/types';
import { formatDistanceToNowStrict } from 'date-fns';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

const meta = 'text-meta text-ink-muted font-stretch-semi-condensed';

const wordCount = (doc: RichTextDoc) => {
  const text = richTextToPlainText(doc);
  return text ? text.split(/\s+/).length : 0;
};

const savedLabel = (savedAt: number) =>
  Date.now() - savedAt < 60_000
    ? 'just now'
    : formatDistanceToNowStrict(savedAt, { addSuffix: true });

/** Under the editor: how long the description is, and when the draft last saved. */
export const DescriptionMeta = ({ savedAt }: { savedAt: number | null }) => {
  const field = useFieldContext<RichTextDoc>();
  const words = wordCount(field.state.value);
  return (
    <div className={`-mt-2 flex justify-between gap-4 tabular-nums ${meta}`}>
      <span>
        {words} {words === 1 ? 'word' : 'words'}
      </span>
      {savedAt && <span>Saved as draft · {savedLabel(savedAt)}</span>}
    </div>
  );
};

const keyword = 'font-display text-badge font-extrabold text-brand-ink uppercase';

const CriterionText = ({ criterion }: { criterion: Criterion }) => (
  <p className="min-w-0 flex-1 text-[1.0625rem] leading-6 font-semibold text-ink font-stretch-semi-condensed">
    <span className={keyword}>Given</span> {criterion.given} <span className={keyword}>When</span>{' '}
    {criterion.when} <span className={keyword}>Then</span> {criterion.outcome}
  </p>
);

const BLANK: Criterion = { given: '', when: '', outcome: '' };
type CriterionErrors = Partial<Record<keyof Criterion, string>>;

/** Writes one criterion in three parts; it joins the list once each part says something. */
const CriterionComposer = ({
  onAdd,
  onCancel,
}: {
  onAdd: (criterion: Criterion) => void;
  onCancel: () => void;
}) => {
  const [draft, setDraft] = useState(BLANK);
  const [errors, setErrors] = useState<CriterionErrors>({});

  const add = () => {
    const result = criterionSchema.safeParse(draft);
    if (!result.success) {
      setErrors(
        Object.fromEntries(
          result.error.issues.map((i) => [i.path[0], i.message]),
        ) as CriterionErrors,
      );
      return;
    }
    onAdd(result.data);
    setDraft(BLANK);
    setErrors({});
  };

  const part = (name: keyof Criterion, label: string, placeholder: string) => (
    <Field label={label} error={errors[name]}>
      <Input
        value={draft[name]}
        onChange={(value) => {
          setDraft((d) => ({ ...d, [name]: value }));
          setErrors((e) => ({ ...e, [name]: undefined }));
        }}
        placeholder={placeholder}
      />
    </Field>
  );

  return (
    // Enter in any part adds the criterion; ⌘↵ is left to the dialog, which creates the item.
    <fieldset
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          add();
        }
      }}
      className="flex flex-col gap-4 rounded-xl border border-line p-4"
    >
      <legend className="sr-only">New criterion</legend>
      <div className="grid gap-4 md:grid-cols-3">
        {part('given', 'Given', 'E.g. a paid order')}
        {part('when', 'When', 'E.g. I choose Download')}
        {part('outcome', 'Then', 'E.g. a PDF downloads')}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={add}>
          Add criterion
        </Button>
      </div>
    </fieldset>
  );
};

/** Acceptance criteria, numbered, as Given · When · Then. */
export const CriteriaField = () => {
  const field = useFieldContext<Criterion[]>();
  const [adding, setAdding] = useState(false);
  const criteria = field.state.value;

  return (
    <section aria-labelledby="criteria-heading" className="flex flex-col">
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <h3
          id="criteria-heading"
          className="text-[1.1875rem] leading-6 font-bold text-ink font-stretch-semi-condensed"
        >
          Acceptance criteria
        </h3>
        <span className={meta}>Given · When · Then</span>
      </div>
      {criteria.length > 0 && (
        <ol className="flex flex-col">
          {criteria.map((criterion, index) => (
            <li
              // Criteria have no ids; their text is unique enough to keep rows stable.
              key={`${criterion.given}|${criterion.when}|${criterion.outcome}`}
              className="flex items-start gap-4 border-b border-line py-4"
            >
              <span
                aria-hidden
                className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-muted text-meta font-bold text-ink tabular-nums"
              >
                {index + 1}
              </span>
              <CriterionText criterion={criterion} />
              <button
                type="button"
                aria-label={`Remove criterion ${index + 1}`}
                onClick={() => field.removeValue(index)}
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-ink hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-focus-ring"
              >
                <X aria-hidden strokeWidth={2} className="size-5" />
              </button>
            </li>
          ))}
        </ol>
      )}
      <div className="pt-4">
        {adding ? (
          <CriterionComposer
            onAdd={(criterion) => field.pushValue(criterion)}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <Button variant="ghost" size="sm" icon={Plus} onClick={() => setAdding(true)}>
            Add criterion
          </Button>
        )}
      </div>
    </section>
  );
};
