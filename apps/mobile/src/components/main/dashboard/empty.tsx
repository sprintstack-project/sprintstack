import { scaled } from '@lib/scale';
import { Button, Card, EmptyState, Text } from '@sprintstack/ui';
import { type Href, router } from 'expo-router';
import { ChartNoAxesGantt, Check, ChevronRight, Clock, ListTodo } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';
import { SETUP_STEPS } from './data';

// What a new project's dashboard shows before there's any work: the setup checklist and the import
// tile in place of the summary tiles, and an empty row for each panel.

const poster = 'text-[2.5rem] leading-[2.375rem] font-extrabold uppercase';

const SetupTile = () => {
  const onInk = useTokenColor('on-ink');
  const onBrand = useTokenColor('on-brand');
  const done = SETUP_STEPS.filter((step) => step.done).length;
  return (
    <Card variant="tile" tone="ink">
      <View className="gap-5">
        <View className="flex-row items-end justify-between gap-4">
          <Text accessibilityRole="header" className={`${poster} text-on-ink`}>
            Get set up{'\n'}
            <Text className={`${poster} text-brand-on-ink`}>in four steps</Text>
          </Text>
          <Text className="text-headline font-extrabold text-on-ink">
            {done}
            <Text className="text-headline font-extrabold text-on-ink/60">
              /{SETUP_STEPS.length}
            </Text>
          </Text>
        </View>
        <View className="border-t border-on-ink/20">
          {SETUP_STEPS.map((step, i) =>
            step.done ? (
              <View
                key={step.label}
                accessibilityLabel={`${step.label}, done`}
                className="min-h-14 flex-row items-center gap-4 border-b border-on-ink/20"
              >
                <View className="size-8 items-center justify-center rounded-full bg-brand">
                  <Check aria-hidden size={scaled(18)} strokeWidth={2.5} color={onBrand} />
                </View>
                <Text className="flex-1 text-body-strong font-bold text-on-ink/60 line-through">
                  {step.label}
                </Text>
              </View>
            ) : (
              <Pressable
                key={step.label}
                accessibilityRole="link"
                onPress={() => router.navigate(step.href as Href)}
                className={`min-h-14 flex-row items-center gap-4 active:opacity-70 ${i < SETUP_STEPS.length - 1 ? 'border-b border-on-ink/20' : ''}`}
              >
                <View className="size-8 items-center justify-center rounded-full border-2 border-on-ink">
                  <Text className="text-meta font-extrabold text-on-ink">{i + 1}</Text>
                </View>
                <Text className="flex-1 text-body-strong font-bold text-on-ink">{step.label}</Text>
                <ChevronRight aria-hidden size={scaled(20)} strokeWidth={2.5} color={onInk} />
              </Pressable>
            ),
          )}
        </View>
      </View>
    </Card>
  );
};

const ImportTile = ({ onImport }: { onImport?: () => void }) => (
  <Card variant="tile" tone="muted">
    <View className="gap-4">
      <Text className="text-eyebrow font-bold uppercase text-ink-muted">
        Moving from another tool?
      </Text>
      <Text accessibilityRole="header" className={`${poster} text-ink`}>
        Bring your backlog
      </Text>
      <Text className="text-body font-semibold text-ink-muted">
        Import issues, sprints and assignees from a CSV export.
      </Text>
      <Button size="lg" block onClick={onImport}>
        Import from CSV
      </Button>
    </View>
  </Card>
);

/** Takes the summary tiles' place until the project has work in it. */
export const GetStarted = ({ onImport }: { onImport?: () => void }) => (
  <>
    <SetupTile />
    <ImportTile onImport={onImport} />
  </>
);

export const NoNextItems = () => (
  <EmptyState
    variant="widget"
    icon={Check}
    title="Nothing assigned"
    description="Your next items show up here."
  />
);

export const NoBurndown = () => (
  <EmptyState
    variant="widget"
    icon={ChartNoAxesGantt}
    title="No active sprint"
    description="Start one to see the burndown."
  />
);

export const NoWorkStatus = () => (
  <EmptyState
    variant="widget"
    icon={ListTodo}
    title="No work items yet"
    description="Their split across statuses shows up here."
  />
);

export const NoActivity = () => (
  <EmptyState
    variant="widget"
    icon={Clock}
    title="All quiet"
    description="Team activity appears here."
  />
);
