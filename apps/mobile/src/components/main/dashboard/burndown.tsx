import { fonts } from '@lib/fonts';
import { Text } from '@sprintstack/ui';
import { differenceInCalendarDays, format } from 'date-fns';
import { useState } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTokenColor } from '@/lib/use-token-color';
import { IDEAL, REMAINING, SPRINT, SPRINT_DAYS, TODAY } from './data';

const HEIGHT = 150;
const Y_AXIS_WIDTH = 24;
const START = 8;
const END = 16;
// Room above the plot for the TODAY pill. The chart draws its top rule 10pt below this.
const OVERFLOW_TOP = 24;
const PLOT_TOP = OVERFLOW_TOP + 10;
const POINT = 10;

const todayIndex = differenceInCalendarDays(TODAY, SPRINT.start);
const labelled = [0, todayIndex, SPRINT_DAYS.length - 1];

/** A hollow point on the remaining line. */
const Point = () => (
  <View
    className="rounded-full border-2 border-brand-ink bg-surface"
    style={{ width: POINT, height: POINT }}
  />
);

const LegendLine = ({ dashed }: { dashed?: boolean }) =>
  dashed ? (
    <View className="w-5 border-t-2 border-dashed border-ink-muted" />
  ) : (
    <View className="h-0.5 w-5 rounded-full bg-brand-ink" />
  );

export const Burndown = () => {
  const [width, setWidth] = useState(0);
  const muted = useTokenColor('ink-muted');
  const accent = useTokenColor('brand-ink');
  const line = useTokenColor('line');

  const spacing = (width - Y_AXIS_WIDTH - START - END) / (SPRINT_DAYS.length - 1);
  /** Where day `i` falls, from the left of the chart. */
  const xOf = (i: number) => Y_AXIS_WIDTH + START + i * spacing;

  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-6">
        <View className="flex-row items-center gap-2">
          <LegendLine />
          <Text className="text-meta font-semibold text-ink-muted">Remaining</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <LegendLine dashed />
          <Text className="text-meta font-semibold text-ink-muted">Ideal</Text>
        </View>
      </View>
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Burndown for ${SPRINT.name}: ${REMAINING.at(-1)} of ${SPRINT.pointsTotal} points remaining`}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={{ height: PLOT_TOP + HEIGHT + 24 }}
      >
        {width > 0 && (
          <>
            <LineChart
              // The ideal line is the full sprint; remaining stops at today.
              data={IDEAL.map((value) => ({ value }))}
              data2={REMAINING.map((value) => ({ value, customDataPoint: Point }))}
              height={HEIGHT}
              width={width - Y_AXIS_WIDTH}
              overflowTop={OVERFLOW_TOP}
              maxValue={SPRINT.pointsTotal}
              noOfSections={4}
              spacing={spacing}
              initialSpacing={START}
              endSpacing={END}
              disableScroll
              hideDataPoints1
              color1={muted}
              thickness1={1.5}
              strokeDashArray1={[6, 6]}
              color2={accent}
              thickness2={2.5}
              areaChart2
              startFillColor2={accent}
              endFillColor2={accent}
              startOpacity2={0.15}
              endOpacity2={0.15}
              dataPointsWidth2={POINT}
              dataPointsHeight2={POINT}
              rulesType="solid"
              rulesColor={line}
              xAxisColor={line}
              yAxisThickness={0}
              yAxisLabelWidth={Y_AXIS_WIDTH}
              yAxisTextStyle={{ color: muted, fontSize: 10, fontFamily: fonts[600] }}
            />
            {/* Today: a rule through the plot with a pill on top. */}
            <View
              pointerEvents="none"
              className="absolute w-px bg-ink"
              style={{ left: xOf(todayIndex), top: PLOT_TOP, height: HEIGHT }}
            />
            <View
              pointerEvents="none"
              className="absolute h-5 w-14 items-center justify-center rounded-full bg-ink"
              style={{ left: xOf(todayIndex) - 28, top: PLOT_TOP - 22 }}
            >
              <Text className="text-[0.6875rem] font-extrabold text-on-ink">TODAY</Text>
            </View>
            {labelled.map((i) => (
              <Text
                key={i}
                className="absolute w-12 text-center text-[0.75rem] font-semibold text-ink-muted"
                // The last label keeps inside the card rather than centring on its day.
                style={{ left: Math.min(xOf(i) - 24, width - 48), top: PLOT_TOP + HEIGHT + 6 }}
              >
                {format(SPRINT_DAYS[i], 'd MMM')}
              </Text>
            ))}
          </>
        )}
      </View>
    </View>
  );
};
