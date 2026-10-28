'use client';

import { format } from 'date-fns';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { BURNDOWN, BURNDOWN_TICKS, SPRINT, TODAY } from './data';

// Theme tokens, so the chart follows light and dark like everything else.
const ink = 'var(--color-ink)';
const muted = 'var(--color-ink-muted)';
const accent = 'var(--color-brand-ink)';
const tick = { fill: muted, fontSize: 12, fontWeight: 600 };

const TodayLabel = ({ viewBox }: { viewBox?: { x?: number; y?: number } }) => {
  if (viewBox?.x === undefined || viewBox.y === undefined) return null;
  return (
    <g transform={`translate(${viewBox.x},${viewBox.y})`}>
      <rect x={-28} y={-20} width={56} height={20} rx={10} fill={ink} />
      <text
        y={-6}
        textAnchor="middle"
        fill="var(--color-on-ink)"
        className="font-display text-[0.6875rem] font-extrabold"
      >
        TODAY
      </text>
    </g>
  );
};

const Burndown = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6 text-meta text-ink-muted">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-5 rounded-full bg-brand-ink" />
          Remaining
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="w-5 border-t-2 border-dashed border-ink-muted" />
          Ideal
        </span>
        <span className="flex-1 text-right">Story points</span>
      </div>
      <div
        role="img"
        aria-label={`Burndown for ${SPRINT.name}: ${SPRINT.pointsTotal - SPRINT.pointsDone} of ${SPRINT.pointsTotal} points remaining`}
        className="h-64"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={BURNDOWN} margin={{ top: 24, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid vertical={false} stroke="var(--color-line)" />
            <XAxis
              dataKey="label"
              ticks={BURNDOWN_TICKS}
              interval={0}
              tick={tick}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              domain={[0, SPRINT.pointsTotal]}
              ticks={[0, 10, 20, 30, 40]}
              tick={tick}
              tickLine={false}
              axisLine={false}
            />
            <Line
              dataKey="ideal"
              stroke={muted}
              strokeWidth={1.5}
              strokeDasharray="6 6"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
            <Area
              dataKey="remaining"
              stroke={accent}
              strokeWidth={2.5}
              fill={accent}
              fillOpacity={0.15}
              dot={{ r: 4, fill: 'var(--color-surface)', stroke: accent, strokeWidth: 2 }}
              activeDot={false}
            />
            <ReferenceLine
              x={format(TODAY, 'd MMM')}
              stroke={ink}
              strokeWidth={1.5}
              label={<TodayLabel />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Burndown;
