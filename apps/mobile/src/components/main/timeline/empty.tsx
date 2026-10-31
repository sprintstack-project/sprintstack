import { Button, EmptyState, Text } from '@sprintstack/ui';
import { Plus } from 'lucide-react-native';
import { View } from 'react-native';
import type { Column } from './data';

// Dashed outlines where the first epics' bars would go, stepping across the range.
const GHOSTS = [
  { left: 0.04, width: 0.3 },
  { left: 0.2, width: 0.32 },
  { left: 0.42, width: 0.28 },
];

const pct = (fraction: number) => `${fraction * 100}%` as const;

interface EmptyTimelineProps {
  /** The range's columns, so the empty chart keeps its month headings. */
  columns: Column[];
  onCreate?: () => void;
  onConvert?: () => void;
}

/** In place of the chart while the project has no epics. */
export const EmptyTimeline = ({ columns, onCreate, onConvert }: EmptyTimelineProps) => {
  // A phone fits about six labels across, as on the chart.
  const every = Math.ceil(columns.length / 6);
  return (
    <View className="overflow-hidden rounded-2xl border border-line bg-surface">
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="px-5 pt-4"
      >
        <View className="relative h-5">
          {columns.map((c, i) =>
            i % every === 0 ? (
              <Text
                key={c.label}
                className="absolute top-0 text-sm font-extrabold uppercase text-ink"
                style={{ left: pct(c.left) }}
              >
                {c.label}
              </Text>
            ) : null,
          )}
        </View>
        <View className="gap-4 py-5">
          {GHOSTS.map((ghost) => (
            <View key={ghost.left} className="relative h-7">
              <View
                className="absolute inset-y-0 rounded-full border-[1.5px] border-dashed border-line-strong"
                style={{ left: pct(ghost.left), width: pct(ghost.width) }}
              />
            </View>
          ))}
        </View>
      </View>
      <EmptyState
        art={false}
        eyebrow="Timeline"
        title="Nothing on the"
        highlight="roadmap yet"
        description="Epics group work across sprints. Give one a start and end date and it shows up here."
        actions={
          <>
            <Button variant="brand" size="lg" icon={Plus} block onClick={onCreate}>
              Create an epic
            </Button>
            <Button size="lg" block onClick={onConvert}>
              Turn a story into an epic
            </Button>
          </>
        }
      />
    </View>
  );
};
