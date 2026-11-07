import Card from '@ui/card';

// Suspense fallbacks for the dashboard, shaped like what they stand in for so nothing shifts when
// the data streams in. No hooks, so they render in the server's first flush.

/** A placeholder block. `skeleton` is the shared shimmer (surface-muted); tiles pass a tint. */
const Bone = ({ className = '', tint = 'skeleton' }: { className?: string; tint?: string }) => (
  <span aria-hidden className={`block shrink-0 ${tint} ${className}`} />
);

/** Says once what's loading; the bones themselves are hidden from screen readers. */
const Loading = ({ label }: { label: string }) => <span className="sr-only">Loading {label}</span>;

const rows = (count: number) => Array.from({ length: count }, (_, i) => i);

export const NameSkeleton = () => (
  <span className="inline-block h-[0.75em] w-[3.5ch] rounded-lg align-baseline skeleton">
    <Loading label="your name" />
  </span>
);

// Tiles: the ink tile inverts in Night, so its bones are tinted from its own text colour.

export const SprintTileSkeleton = () => {
  const tint = 'rounded-lg bg-on-ink/15';
  return (
    <Card variant="tile" tone="ink">
      <div className="flex h-full flex-col gap-6">
        <Loading label="the current sprint" />
        <Bone tint={tint} className="h-3.5 w-48" />
        <div className="flex flex-1 flex-col justify-end gap-4">
          <Bone tint={tint} className="h-15 w-3/5" />
          <Bone tint={tint} className="h-15 w-[46%]" />
        </div>
        <Bone tint="rounded-full bg-on-ink/15" className="h-2 w-full" />
      </div>
    </Card>
  );
};

export const StatTileSkeleton = ({ label }: { label: string }) => {
  const tint = 'rounded-lg bg-ink/6';
  return (
    <Card variant="tile" tone="muted">
      <Loading label={label} />
      <Bone tint={tint} className="size-5" />
      <Bone tint={tint} className="size-22 rounded-xl" />
      <Bone tint={tint} className="size-5" />
    </Card>
  );
};

// Widget bodies: the widget's card and title stay; only its content is a skeleton.

const titleWidths = ['w-1/2', 'w-2/5', 'w-3/5', 'w-1/3', 'w-[45%]'];
const activityWidths = ['w-4/5', 'w-2/3', 'w-11/12', 'w-3/5', 'w-3/4'];

export const NextItemsSkeleton = () => (
  <>
    <Loading label="your next items" />
    <ul className="divide-y divide-line">
      {rows(5).map((i) => (
        <li key={i} className="flex items-center gap-4 py-4">
          <Bone className="size-8 rounded-md" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Bone className="h-3 w-16 rounded-[0.5rem]" />
            <Bone className={`h-3.5 rounded-[0.5rem] ${titleWidths[i]}`} />
          </div>
          <Bone className="hidden h-7 w-24 rounded-full sm:block" />
          <Bone className="h-3 w-16 rounded-[0.5rem]" />
        </li>
      ))}
    </ul>
  </>
);

export const ActivitySkeleton = () => (
  <>
    <Loading label="recent activity" />
    <ul className="flex flex-col gap-5">
      {rows(5).map((i) => (
        <li key={i} className="flex items-center gap-4">
          <Bone className="size-10 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <Bone className={`h-3.5 rounded-[0.5rem] ${activityWidths[i]}`} />
            <Bone className="h-3 w-2/5 rounded-[0.5rem]" />
          </div>
        </li>
      ))}
    </ul>
  </>
);

export const BurndownSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Loading label="the burndown" />
    <div className="flex gap-3">
      <Bone className="h-3 w-24 rounded-[0.5rem]" />
      <Bone className="h-3 w-16 rounded-[0.5rem]" />
    </div>
    <div className="relative h-64">
      {/* The chart's gridlines, then a falling area where the line will be. */}
      <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
        {rows(6).map((i) => (
          <span key={i} className="block border-t border-line" />
        ))}
      </div>
      <Bone className="absolute inset-x-2 top-1/4 bottom-0 [clip-path:polygon(0_0,50%_40%,100%_100%,0_100%)]" />
    </div>
  </div>
);

export const WorkStatusSkeleton = () => (
  <div className="flex flex-col gap-5">
    <Loading label="work item status" />
    <Bone className="h-14 w-24 rounded-lg" />
    <Bone className="h-3 w-full rounded-full" />
    <ul className="divide-y divide-line">
      {rows(5).map((i) => (
        <li key={i} className="flex items-center gap-4 py-3">
          <Bone className="size-3 rounded-xs" />
          <span className="flex-1">
            <Bone className="h-7 w-24 rounded-full" />
          </span>
          <Bone className="h-6 w-8 rounded-[0.5rem]" />
        </li>
      ))}
    </ul>
  </div>
);
