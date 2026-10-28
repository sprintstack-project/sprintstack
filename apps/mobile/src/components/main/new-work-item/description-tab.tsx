import { scaled, touchSlop } from '@lib/scale';
import { useFieldContext } from '@sprintstack/forms';
import { type Criterion, criterionSchema } from '@sprintstack/shared';
import { Button, Field, Input, richTextToPlainText, Text } from '@sprintstack/ui';
import type { RichTextDoc } from '@ui/types';
import { formatDistanceToNowStrict } from 'date-fns';
import { Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';

const wordCount = (doc: RichTextDoc) => {
  const text = richTextToPlainText(doc);
  return text ? text.split(/\s+/).length : 0;
};

const savedLabel = (savedAt: number) =>
  Date.now() - savedAt < 60_000
    ? 'just now'
    : formatDistanceToNowStrict(savedAt, { addSuffix: true });

/** Under the editor: how long the description is, and when the draft was last kept. */
export const DescriptionMeta = ({ savedAt }: { savedAt: number | null }) => {
  const field = useFieldContext<RichTextDoc>();
  const words = wordCount(field.state.value);
  return (
    <View className="-mt-2 flex-row justify-between gap-4">
      <Text className="text-meta font-semibold text-ink-muted">
        {words} {words === 1 ? 'word' : 'words'}
      </Text>
      {savedAt && (
        <Text className="text-meta font-semibold text-ink-muted">
          Saved as draft · {savedLabel(savedAt)}
        </Text>
      )}
    </View>
  );
};

const keyword = 'text-badge font-extrabold uppercase text-brand-ink';

const CriterionText = ({ criterion }: { criterion: Criterion }) => (
  <Text className="flex-1 text-[1.0625rem] leading-6 font-semibold text-ink">
    <Text className={keyword}>Given</Text> {criterion.given} <Text className={keyword}>When</Text>{' '}
    {criterion.when} <Text className={keyword}>Then</Text> {criterion.outcome}
  </Text>
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
    <View accessibilityLabel="New criterion" className="gap-4 rounded-xl border border-line p-4">
      {part('given', 'Given', 'E.g. a paid order')}
      {part('when', 'When', 'E.g. I choose Download')}
      {part('outcome', 'Then', 'E.g. a PDF downloads')}
      <View className="flex-row justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={add}>
          Add criterion
        </Button>
      </View>
    </View>
  );
};

/** Acceptance criteria, numbered, as Given · When · Then. */
export const CriteriaField = () => {
  const field = useFieldContext<Criterion[]>();
  const [adding, setAdding] = useState(false);
  const ink = useTokenColor('ink');
  const criteria = field.state.value;

  return (
    <View>
      <View className="flex-row items-baseline justify-between gap-4 border-b border-line pb-3">
        <Text accessibilityRole="header" className="text-[1.1875rem] leading-6 font-bold text-ink">
          Acceptance criteria
        </Text>
        <Text className="text-meta font-semibold text-ink-muted">Given · When · Then</Text>
      </View>
      {criteria.map((criterion, index) => (
        <View
          // Criteria have no ids; their text is unique enough to keep rows stable.
          key={`${criterion.given}|${criterion.when}|${criterion.outcome}`}
          className="flex-row items-start gap-4 border-b border-line py-4"
        >
          <View className="size-7 items-center justify-center rounded-full bg-surface-muted">
            <Text className="text-meta font-bold text-ink">{index + 1}</Text>
          </View>
          <CriterionText criterion={criterion} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove criterion ${index + 1}`}
            onPress={() => field.removeValue(index)}
            hitSlop={touchSlop(32)}
            className="size-8 items-center justify-center rounded-full active:bg-surface-pressed"
          >
            <X aria-hidden size={scaled(20)} strokeWidth={2} color={ink} />
          </Pressable>
        </View>
      ))}
      <View className="items-start pt-4">
        {adding ? (
          <View className="self-stretch">
            <CriterionComposer
              onAdd={(criterion) => field.pushValue(criterion)}
              onCancel={() => setAdding(false)}
            />
          </View>
        ) : (
          <Button variant="ghost" size="sm" icon={Plus} onClick={() => setAdding(true)}>
            Add criterion
          </Button>
        )}
      </View>
    </View>
  );
};
