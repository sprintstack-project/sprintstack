'use client';

import { STATUS_LABEL } from '@lib/status';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { ChevronRight, Sparkles, Zap } from 'lucide-react';
import { type ReactNode, type Ref, useId } from 'react';
import { Avatar } from '../taskboard/parts';
import {
  type Column,
  contains,
  datesOf,
  EPICS,
  type Epic,
  type Feature,
  type Level,
  MIN_COLUMN,
  offsetOf,
  PLAN_STATUSES,
  type PlanStatus,
  type Range,
  type Scale,
  spanOf,
  TODAY,
} from './data';

const labelWidth = 'w-52 shrink-0 sm:w-72 lg:w-[26rem]';

/** The label column; it stays put while the track scrolls under it. */
const labels = `sticky left-0 z-20 border-r border-line ${labelWidth}`;

const pct = (fraction: number) => `${fraction * 100}%`;

/** Outline, fill, the shaded part that's done, and the text, per status. */
export const TONES: Record<PlanStatus, { bar: string; done: string; text: string }> = {
  neutral: { bar: 'border-line-strong bg-surface', done: 'bg-neutral-subtle', text: 'text-ink' },
  info: { bar: 'border-info bg-info-subtle', done: 'bg-info/30', text: 'text-info-ink' },
  review: { bar: 'border-review bg-review-subtle', done: 'bg-review/30', text: 'text-review-ink' },
  warning: {
    bar: 'border-warning bg-warning-subtle',
    done: 'bg-warning/30',
    text: 'text-warning-ink',
  },
  success: {
    bar: 'border-success bg-success-subtle',
    done: 'bg-success/30',
    text: 'text-success-ink',
  },
};

const kinds = {
  epic: { icon: Zap, label: 'Epic', className: 'bg-review-subtle text-review-ink' },
  feature: { icon: Sparkles, label: 'Feature', className: 'bg-warning-subtle text-warning-ink' },
};

const KindIcon = ({ kind }: { kind: keyof typeof kinds }) => {
  const { icon: Icon, label, className } = kinds[kind];
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`grid size-8 shrink-0 place-items-center rounded-lg ${className}`}
    >
      <Icon aria-hidden strokeWidth={2} className="size-4.5" />
    </span>
  );
};

/** A line where each column starts, behind the bars. */
const Gridlines = ({ columns }: { columns: Column[] }) =>
  columns
    .filter((c) => c.left > 0)
    .map((c) => (
      <span
        key={c.label}
        aria-hidden
        className="absolute inset-y-0 w-px bg-line"
        style={{ left: pct(c.left) }}
      />
    ));

/**
 * The item's dates as a pill, its done part shaded. An arrow marks a bar that runs on past either
 * end of the range.
 */
const Bar = ({ item, range, small }: { item: Epic | Feature; range: Range; small?: boolean }) => {
  const span = spanOf(range, item);
  if (!span) return null;
  const tone = TONES[item.status];
  return (
    <div
      role="img"
      aria-label={`${item.title}: ${datesOf(item)}, ${STATUS_LABEL[item.status]}, ${item.progress}% done`}
      title={`${datesOf(item)} · ${STATUS_LABEL[item.status]}`}
      className={clsx(
        'absolute top-1/2 flex min-w-14 -translate-y-1/2 items-center overflow-hidden border-[1.5px]',
        small ? 'h-8' : 'h-11',
        tone.bar,
        // A bar cut off by the range ends square at the edge.
        span.before ? 'rounded-l-md' : 'rounded-l-full',
        span.after ? 'rounded-r-md' : 'rounded-r-full',
      )}
      style={{ left: pct(span.left), width: pct(span.width) }}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 ${tone.done}`}
        style={{ width: `${item.progress}%` }}
      />
      <span
        aria-hidden
        className={clsx(
          'relative flex flex-1 items-center gap-1 px-3 text-meta font-extrabold whitespace-nowrap tabular-nums',
          tone.text,
        )}
      >
        {span.before && '←'}
        {item.progress}%{span.after && <span className="ml-auto">→</span>}
      </span>
    </div>
  );
};

const Row = ({
  label,
  muted,
  columns,
  children,
}: {
  label: ReactNode;
  /** Features under an epic sit on a darker band. */
  muted?: boolean;
  columns: Column[];
  children: ReactNode;
}) => (
  <li className={clsx('flex border-t border-line', muted ? 'bg-surface-muted' : 'bg-surface')}>
    <div
      className={clsx(
        labels,
        'flex items-center gap-3 px-4 lg:px-6',
        muted ? 'bg-surface-muted' : 'bg-surface',
      )}
    >
      {label}
    </div>
    <div className="relative flex-1">
      <Gridlines columns={columns} />
      {children}
    </div>
  </li>
);

const FeatureRow = ({
  feature,
  epic,
  range,
  columns,
}: {
  feature: Feature;
  /** Named above the title when features are listed on their own. */
  epic?: Epic;
  range: Range;
  columns: Column[];
}) => (
  <Row
    muted={!epic}
    columns={columns}
    label={
      <div className={clsx('flex min-w-0 items-center gap-3', epic ? 'py-4' : 'py-3.5 pl-10')}>
        <KindIcon kind="feature" />
        <div className="min-w-0">
          {epic && (
            <p className="truncate text-meta text-ink-muted">
              {epic.key} · {epic.title}
            </p>
          )}
          <p className="truncate text-body-strong text-ink font-stretch-semi-condensed lg:text-[1.0625rem]">
            {feature.title}
          </p>
        </div>
      </div>
    }
  >
    <Bar item={feature} range={range} small={!epic} />
  </Row>
);

const EpicRow = ({
  epic,
  range,
  columns,
  expanded,
  onExpandedChange,
}: {
  epic: Epic;
  range: Range;
  columns: Column[];
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}) => {
  const featuresId = useId();
  return (
    <>
      <Row
        columns={columns}
        label={
          <>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={featuresId}
              aria-label={`${expanded ? 'Hide' : 'Show'} features of ${epic.title}`}
              onClick={() => onExpandedChange(!expanded)}
              className="kbd-focus -ml-2 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-ink transition-colors duration-120 hover:bg-surface-hover"
            >
              <ChevronRight
                aria-hidden
                strokeWidth={2}
                className={clsx(
                  'size-5 transition-transform duration-120',
                  expanded && 'rotate-90',
                )}
              />
            </button>
            <KindIcon kind="epic" />
            <div className="min-w-0 flex-1 py-4">
              <p className="text-meta text-ink-muted tabular-nums">{epic.key}</p>
              <p className="truncate text-body-strong text-ink font-stretch-semi-condensed lg:text-[1.0625rem]">
                {epic.title}
              </p>
            </div>
            <span className="hidden sm:flex">
              <Avatar person={epic.owner} size="sm" />
            </span>
          </>
        }
      >
        <Bar item={epic} range={range} />
      </Row>
      {expanded && (
        <li id={featuresId}>
          <ul aria-label={`Features of ${epic.title}`}>
            {epic.features.map((feature) => (
              <FeatureRow key={feature.key} feature={feature} range={range} columns={columns} />
            ))}
          </ul>
        </li>
      )}
    </>
  );
};

interface ChartProps {
  level: Level;
  /** Epics mode: the epics the filter leaves. */
  epics: Epic[];
  /** Features mode: the features the filter leaves. */
  features: Feature[];
  range: Range;
  scale: Scale;
  columns: Column[];
  expanded: string[];
  onExpandedChange: (key: string, expanded: boolean) => void;
  /** The track scrolls sideways once the columns don't fit. */
  scrollRef: Ref<HTMLDivElement>;
  /** The label column, measured to centre today. */
  labelRef: Ref<HTMLDivElement>;
}

const Chart = ({
  level,
  epics,
  features,
  range,
  scale,
  columns,
  expanded,
  onExpandedChange,
  scrollRef,
  labelRef,
}: ChartProps) => {
  const today = contains(range, TODAY) ? offsetOf(range, TODAY) : null;
  const count = level === 'epics' ? epics.length : features.length;
  const epicOf = (feature: Feature) => EPICS.find((e) => e.features.includes(feature));
  const track = { minWidth: `${columns.length * MIN_COLUMN[scale]}rem` };

  return (
    <section
      aria-label="Timeline"
      className="overflow-hidden rounded-2xl border border-line bg-surface"
    >
      <div ref={scrollRef} className="overflow-x-auto">
        <div className="relative w-max min-w-full">
          <div className="flex">
            <div
              ref={labelRef}
              className={clsx(labels, 'flex items-center bg-surface px-4 lg:px-6')}
            >
              <p className="eyebrow">
                {level === 'epics' ? 'Epic' : 'Feature'} · {count}
              </p>
            </div>
            <div className="relative h-24 flex-1" style={track}>
              <Gridlines columns={columns} />
              {columns.map((c) => (
                <span
                  key={c.label}
                  className="headline absolute top-5 pl-4 text-[1.25rem] leading-none whitespace-nowrap text-ink"
                  style={{ left: pct(c.left) }}
                >
                  {c.label}
                </span>
              ))}
              {today !== null && (
                <>
                  <span
                    aria-hidden
                    className="absolute top-14 bottom-0 w-0.5 -translate-x-1/2 bg-brand"
                    style={{ left: pct(today) }}
                  />
                  <span
                    className="absolute top-12 z-10 -translate-x-1/2 rounded-full bg-brand px-3 py-1 font-display text-[0.8125rem] leading-4 font-extrabold whitespace-nowrap text-on-brand uppercase font-stretch-condensed"
                    style={{ left: pct(today) }}
                  >
                    Today · {format(TODAY, 'd MMM')}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="relative">
            {count === 0 ? (
              <p className="border-t border-line px-6 py-10 text-center text-body-strong text-ink-muted">
                No {level} match this status
              </p>
            ) : (
              <ul aria-label={level === 'epics' ? 'Epics' : 'Features'}>
                {level === 'epics'
                  ? epics.map((epic) => (
                      <EpicRow
                        key={epic.key}
                        epic={epic}
                        range={range}
                        columns={columns}
                        expanded={expanded.includes(epic.key)}
                        onExpandedChange={(next) => onExpandedChange(epic.key, next)}
                      />
                    ))
                  : features.map((feature) => (
                      <FeatureRow
                        key={feature.key}
                        feature={feature}
                        epic={epicOf(feature)}
                        range={range}
                        columns={columns}
                      />
                    ))}
              </ul>
            )}
            {/* Today's line runs over the bars, under the sticky labels. */}
            {today !== null && (
              <div aria-hidden className="pointer-events-none absolute inset-0 z-10 flex">
                <div className={labelWidth} />
                <div className="relative flex-1">
                  <span
                    className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-brand"
                    style={{ left: pct(today) }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line px-4 py-4 lg:px-6">
        <ul aria-label="Legend" className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {PLAN_STATUSES.map((status) => (
            <li key={status} className="flex items-center gap-2 text-meta text-ink-muted">
              <span
                aria-hidden
                className={`h-3.5 w-7 rounded-full border-[1.5px] ${TONES[status].bar}`}
              />
              {STATUS_LABEL[status]}
            </li>
          ))}
        </ul>
        <p className="text-meta text-ink-muted md:ml-auto">Shaded part of a bar = % done</p>
      </div>
    </section>
  );
};

export default Chart;
