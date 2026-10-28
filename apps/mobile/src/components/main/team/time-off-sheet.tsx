import { scaled } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import { useAppForm, useSelector } from '@sprintstack/forms';
import { timeOffSchema } from '@sprintstack/shared';
import { Button, Text } from '@sprintstack/ui';
import { Check, Trash2, TriangleAlert } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
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
  type TimeOffType,
  TYPE_LABEL,
  timeOffForm,
  timeOffOf,
  workingDaysError,
} from './data';

/** Vacation · Sick · Half day · Other, as one row of radio pills. */
const TypePicker = ({
  value,
  onChange,
}: {
  value: TimeOffType;
  onChange: (type: TimeOffType) => void;
}) => (
  <View className="gap-2">
    <Text className="text-[1.0625rem] leading-5.5 font-bold text-ink">Type</Text>
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Type"
      className="flex-row rounded-full bg-surface-muted p-1"
    >
      {TIME_OFF_TYPES.map((type) => {
        const selected = value === type;
        return (
          <Pressable
            key={type}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(type)}
            className={`h-11 flex-1 items-center justify-center rounded-full ${selected ? 'bg-ink' : 'active:bg-surface-pressed'}`}
          >
            <Text
              className={`text-[1.0625rem] leading-5 font-extrabold ${selected ? 'text-on-ink' : 'text-ink'}`}
            >
              {TYPE_LABEL[type]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

interface BodyProps {
  initial: TimeOffDraft;
  timeOff: TimeOff[];
  adjust: Adjustments;
  onSave: (entry: TimeOff) => void;
  onRemove: (id: string) => void;
  /** Slides the sheet away; its own close then clears the draft. */
  onDone: () => void;
}

/** Mounted per opening, so each starts from the draft it was given. */
const Body = ({ initial, timeOff, adjust, onSave, onRemove, onDone }: BodyProps) => {
  const { id, ...defaultValues } = initial;
  const form = useAppForm({
    ...timeOffForm,
    defaultValues,
    onSubmit: ({ value }) => {
      onSave(timeOffOf(id ?? String(Date.now()), timeOffSchema.parse(value)));
      onDone();
    },
  });
  const success = useTokenColor('success-ink');
  const warning = useTokenColor('warning-ink');

  const values = useSelector(form.store, (state) => state.values);
  const dates = datesOf(values.dates);
  const days = draftDays(values);
  const impact = impactOf({ ...values, id }, timeOff, adjust);

  return (
    <View className="gap-5 px-2">
      <Text
        accessibilityRole="header"
        className="text-[1.75rem] leading-8 font-extrabold uppercase text-ink"
      >
        {id ? 'Edit time off' : 'Add time off'}
      </Text>
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
        {(f) => <TypePicker value={f.state.value} onChange={f.handleChange} />}
      </form.AppField>
      <form.AppField name="dates" validators={{ onChange: ({ value }) => workingDaysError(value) }}>
        {(f) => (
          <f.RangeCalendarField
            label="Days off"
            single={values.type === 'half'}
            markers={HOLIDAY_MARKERS}
          />
        )}
      </form.AppField>
      <View className="min-h-14 flex-row items-center justify-between gap-3 rounded-xl bg-surface-muted px-4 py-3">
        <Text className="shrink text-[1.0625rem] leading-6 font-bold text-ink">
          {dates ? rangeLabel(dates.start, dates.end) : 'Pick the days above'}
        </Text>
        {dates && (
          <View className="h-7 justify-center rounded-full bg-surface px-3">
            <Text className="text-[0.75rem] leading-4 font-extrabold uppercase text-ink-muted">
              {days === 0
                ? 'No working days'
                : `${formatDays(days)} working ${days === 1 ? 'day' : 'days'}`}
            </Text>
          </View>
        )}
      </View>
      {impact && days > 0 && (
        <View
          accessibilityLiveRegion="polite"
          className={`flex-row items-start gap-3 rounded-xl px-4 py-3 ${impact.fits ? 'bg-success-subtle' : 'bg-warning-subtle'}`}
        >
          {impact.fits ? (
            <Check aria-hidden size={scaled(20)} strokeWidth={2.5} color={success} />
          ) : (
            <TriangleAlert aria-hidden size={scaled(20)} strokeWidth={2} color={warning} />
          )}
          <Text
            className={`shrink text-[1rem] leading-6 ${impact.fits ? 'text-success-ink' : 'text-warning-ink'}`}
          >
            <Text
              className={`text-[1rem] leading-6 font-extrabold ${impact.fits ? 'text-success-ink' : 'text-warning-ink'}`}
            >
              {impact.headline}
            </Text>
            {impact.detail && ` ${impact.detail}`}
          </Text>
        </View>
      )}
      <View className="flex-row gap-3">
        {id && (
          <Button
            variant="danger"
            size="lg"
            icon={Trash2}
            iconOnly
            onClick={() => {
              onRemove(id);
              onDone();
            }}
          >
            Remove
          </Button>
        )}
        <View className="flex-1">
          <form.AppForm>
            <form.SubmitButton size="lg" block>
              Save time off
            </form.SubmitButton>
          </form.AppForm>
        </View>
      </View>
    </View>
  );
};

interface TimeOffSheetProps {
  /** The draft to open with; null keeps the sheet closed. */
  draft: TimeOffDraft | null;
  onClose: () => void;
  timeOff: TimeOff[];
  adjust: Adjustments;
  onSave: (entry: TimeOff) => void;
  onRemove: (id: string) => void;
}

/** Adding or editing one stretch of time off, with what it does to the sprint. */
export const TimeOffSheet = ({ draft, onClose, ...body }: TimeOffSheetProps) => {
  const sheet = useRef<SheetRef>(null);
  // The last draft stays shown while the sheet slides away; each opening remounts the body.
  const [shown, setShown] = useState({ draft, opening: 0 });
  if (draft && draft !== shown.draft) setShown({ draft, opening: shown.opening + 1 });

  useEffect(() => {
    if (draft) sheet.current?.show();
  }, [draft]);

  return (
    <Sheet sheetRef={sheet} onClose={onClose}>
      {shown.draft && (
        <Body
          key={shown.opening}
          initial={shown.draft}
          onDone={() => sheet.current?.hide()}
          {...body}
        />
      )}
    </Sheet>
  );
};
