import { scaled, touchSlop } from '@lib/scale';
import { useAppForm, useSelector } from '@sprintstack/forms';
import { type NewWorkItem as Created, workItemSchema } from '@sprintstack/shared';
import { Button, Text } from '@sprintstack/ui';
import type { IconComponent } from '@ui/types';
import {
  FileText,
  History,
  Link2,
  Lock,
  MessageSquare,
  Paperclip,
  TriangleAlert,
  X,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  View,
} from 'react-native';
import { SafeAreaView as BaseSafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';
import { useTokenColor } from '@/lib/use-token-color';
import {
  clearDraft,
  emptyWorkItem,
  loadDraft,
  NONE,
  SPRINT_OPTIONS,
  saveDraft,
  workItemForm,
} from './data';
import { CriteriaField, DescriptionMeta } from './description-tab';
import { LinksField } from './links-tab';
import { Properties } from './properties';

// Uniwind only reads `className` on React Native's own components; third-party ones need wrapping.
const SafeAreaView = withUniwind(BaseSafeAreaView);

type Tab = 'description' | 'links';

const SAVE_DELAY_MS = 400;

const TabPill = ({
  icon: Icon,
  label,
  count,
  selected,
  locked,
  onPress,
}: {
  icon: IconComponent;
  label: string;
  count?: number;
  selected?: boolean;
  locked?: boolean;
  onPress?: () => void;
}) => {
  const color = useTokenColor(selected ? 'on-ink' : locked ? 'ink-muted' : 'ink');
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={locked ? `${label}, available once the item is created` : label}
      accessibilityState={{ selected: Boolean(selected), disabled: Boolean(locked) }}
      disabled={locked}
      onPress={onPress}
      className={`h-11 flex-row items-center gap-2 rounded-full px-4 ${selected ? 'bg-ink' : 'active:bg-surface-pressed'}`}
    >
      <Icon aria-hidden size={scaled(20)} strokeWidth={2} color={color} />
      <Text
        className={`text-[1.0625rem] leading-5 font-extrabold ${selected ? 'text-on-ink' : locked ? 'text-ink-muted' : 'text-ink'}`}
      >
        {label}
      </Text>
      {count !== undefined && (
        <View
          className={`h-6 min-w-6 items-center justify-center rounded-full px-1.5 ${selected ? 'bg-brand' : 'bg-surface'}`}
        >
          <Text className={`text-badge font-extrabold ${selected ? 'text-on-brand' : 'text-ink'}`}>
            {count}
          </Text>
        </View>
      )}
      {locked && <Lock aria-hidden size={scaled(16)} strokeWidth={2} color={color} />}
    </Pressable>
  );
};

interface BodyProps {
  sprint?: string | null;
  onCreate: (item: Created) => void;
  onClose: () => void;
}

/** Mounted while the form is open, so each opening starts from the kept draft (or blank). */
const Body = ({ sprint, onCreate, onClose }: BodyProps) => {
  const [draft] = useState(loadDraft);
  const [savedAt, setSavedAt] = useState(draft?.savedAt ?? null);
  const [tab, setTab] = useState<Tab>('description');
  const ink = useTokenColor('ink');
  const alert = useTokenColor('brand-ink');
  const scroll = useRef<ScrollViewInstance>(null);
  const titleRef = useRef<{ focus: () => void }>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const form = useAppForm({
    ...workItemForm,
    defaultValues: draft?.values ?? emptyWorkItem(sprint),
    onSubmit: ({ value }) => {
      onCreate(workItemSchema.parse(value));
      clearTimeout(saveTimer.current);
      clearDraft();
      setSavedAt(null);
      onClose();
    },
  });

  const values = useSelector(form.store, (state) => state.values);
  const attention = useSelector(form.store, (state) =>
    state.submissionAttempts > 0
      ? Object.values(state.fieldMeta).filter((meta) => meta && meta.errors.length > 0).length
      : 0,
  );
  const sprintName =
    SPRINT_OPTIONS.find((o) => o.value === (values.sprint ?? NONE))?.label ?? 'Backlog';

  // Keep the draft shortly after typing stops.
  const snapshot = JSON.stringify(values);
  const lastSaved = useRef(draft ? JSON.stringify(draft.values) : '');
  useEffect(() => {
    if (snapshot === lastSaved.current) return;
    saveTimer.current = setTimeout(() => {
      lastSaved.current = snapshot;
      setSavedAt(saveDraft(JSON.parse(snapshot)));
    }, SAVE_DELAY_MS);
    return () => clearTimeout(saveTimer.current);
  }, [snapshot]);

  const discard = () => {
    clearTimeout(saveTimer.current);
    clearDraft();
    onClose();
  };

  return (
    <SafeAreaView className="flex-1 bg-canvas">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-row items-start gap-4 border-b border-line px-6 py-4">
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-sm font-bold uppercase text-ink-muted">
              Payments · {sprintName}
            </Text>
            <Text
              accessibilityRole="header"
              className="text-[1.75rem] leading-8 font-extrabold uppercase text-ink"
            >
              New work item
            </Text>
          </View>
          {savedAt && (
            <Text className="self-center text-meta font-semibold text-ink-muted">Draft saved</Text>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close and keep the draft"
            onPress={onClose}
            hitSlop={touchSlop(44)}
            className="size-12 items-center justify-center rounded-full active:bg-surface-pressed"
          >
            <X aria-hidden size={scaled(48)} strokeWidth={2} color={ink} />
          </Pressable>
        </View>

        <ScrollView
          ref={scroll}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="w-full max-w-3xl gap-8 self-center px-6 pt-6 pb-10"
        >
          {attention > 0 && (
            <View
              accessibilityRole="alert"
              className="flex-row items-center gap-3 rounded-xl bg-brand-subtle px-5 py-4"
            >
              <TriangleAlert aria-hidden size={scaled(24)} strokeWidth={2} color={alert} />
              <Text className="shrink text-[1.0625rem] leading-6 font-bold text-ink">
                {`${attention} ${attention === 1 ? 'field needs' : 'fields need'} attention before you can create this item.`}
              </Text>
            </View>
          )}
          <form.AppField name="title">
            {(f) => (
              <f.HeadlineField ref={titleRef} label="Title" placeholder="What needs doing?" />
            )}
          </form.AppField>
          <Properties form={form} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            accessibilityRole="tablist"
            className="-mx-6"
            contentContainerClassName="px-6"
          >
            <View className="flex-row gap-1 rounded-full bg-surface-muted p-1">
              <TabPill
                icon={FileText}
                label="Description"
                selected={tab === 'description'}
                onPress={() => setTab('description')}
              />
              <TabPill
                icon={Link2}
                label="Links"
                count={values.links.length}
                selected={tab === 'links'}
                onPress={() => setTab('links')}
              />
              {/* Attaching needs a file picker on the phone; add files from the web for now. */}
              <TabPill icon={Paperclip} label="Attachments" locked />
              <TabPill icon={MessageSquare} label="Comments" locked />
              <TabPill icon={History} label="Activity" locked />
            </View>
          </ScrollView>

          {tab === 'description' ? (
            <View className="gap-8">
              <form.AppField name="description">
                {(f) => (
                  <View className="gap-4">
                    <f.RichTextField
                      label="Description"
                      placeholder="What’s the problem, and what does done look like?"
                      minRows={6}
                    />
                    <DescriptionMeta savedAt={savedAt} />
                  </View>
                )}
              </form.AppField>
              <form.AppField name="criteria" mode="array">
                {() => <CriteriaField />}
              </form.AppField>
            </View>
          ) : (
            <form.AppField name="links" mode="array">
              {() => <LinksField />}
            </form.AppField>
          )}
        </ScrollView>

        <View className="gap-4 border-t border-line px-6 pt-4 pb-2">
          <View className="flex-row items-center justify-end gap-2">
            <Button variant="ghost" size="lg" onClick={discard}>
              Discard
            </Button>
            <form.AppForm>
              <form.SubmitButton size="lg">Create work item</form.SubmitButton>
            </form.AppForm>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

interface NewWorkItemProps {
  open: boolean;
  /** Closing keeps the draft; Discard (inside) throws it away first. */
  onClose: () => void;
  /** Called with the validated item when it's created. */
  onCreate: (item: Created) => void;
  /** The sprint a new item starts in; null for the backlog. Defaults to the active sprint. */
  sprint?: string | null;
}

/** Creating a work item, full screen over the app. */
export const NewWorkItem = ({ open, onClose, onCreate, sprint }: NewWorkItemProps) => (
  <Modal
    visible={open}
    animationType="slide"
    presentationStyle="fullScreen"
    // Android's back button closes it, keeping the draft.
    onRequestClose={onClose}
  >
    <Body sprint={sprint} onCreate={onCreate} onClose={onClose} />
  </Modal>
);
