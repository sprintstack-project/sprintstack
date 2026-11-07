import Card from '@ui/card';
import Skeleton from '@ui/skeleton';

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
    <Card variant="ink">
      <div className="flex flex-1 flex-col gap-6">
        <Loading label="the current sprint" />
        <Skeleton lines={1} tint={tint} />
        <div className="flex flex-1 flex-col justify-end gap-4">
          <Skeleton shape="input" tint={tint} width={128} />
          <Skeleton shape="bar" tint={tint} width={128} />
        </div>
        <Skeleton shape="bar" tint={tint} />
      </div>
    </Card>
  );
};

export const StatTileSkeleton = ({ label }: { label: string }) => {
  return (
    <Card variant="panel" className="flex flex-col justify-between">
      <Loading label={label} />
      <Skeleton lines={1} />
      <Skeleton shape="icon" width={64} />
      <Skeleton shape="bar" />
    </Card>
  );
};

// Widget bodies: the widget's card and title stay; only its content is a skeleton.

const titleWidths = ['50%', '40%', '60%', '33%', '45%'] as const;
const activityWidths = ['80%', '67%', '92%', '60%', '75%'] as const;

export const NextItemsSkeleton = () => (
  <>
    <Loading label="your next items" />
    <ul className="divide-y divide-line">
      {rows(5).map((i) => (
        <li key={i} className="flex items-center gap-4 py-4">
          <Skeleton shape="icon" width={32} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton width={64} />
            <Skeleton width={titleWidths[i]} />
          </div>
          <span className="hidden sm:block">
            <Skeleton shape="pill" />
          </span>
          <Skeleton width={64} />
        </li>
      ))}
    </ul>
  </>
);

export const ActivitySkeleton = () => (
  <>
    <Loading label="recent activity" />
    <ul className="flex flex-col gap-5 mt-4">
      {rows(5).map((i) => (
        <li key={i} className="flex items-center gap-4">
          <Skeleton shape="circle" />
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <Skeleton width={activityWidths[i]} />
            <Skeleton width="40%" />
          </div>
        </li>
      ))}
    </ul>
  </>
);

export const BurndownSkeleton = () => (
  <div className="flex flex-col gap-4 mt-4">
    <Loading label="the burndown" />
    <div className="flex gap-3">
      <Skeleton width={96} />
      <Skeleton width={64} />
    </div>
    <div className="relative h-64">
      {/* The chart's gridlines, then a falling area where the line will be. */}
      <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
        {rows(6).map((i) => (
          <span key={i} className="block border-t border-line" />
        ))}
      </div>
      {/* No Skeleton shape for a chart area, so this one uses the shimmer class directly. */}
      <span
        aria-hidden
        className="skeleton absolute inset-x-2 top-1/4 bottom-0 [clip-path:polygon(0_0,50%_40%,100%_100%,0_100%)]"
      />
    </div>
  </div>
);

export const WorkStatusSkeleton = () => (
  <div className="flex flex-col gap-5 mt-4">
    <Loading label="work item status" />
    <Skeleton shape="input" width={96} />
    <Skeleton shape="bar" />
    <ul className="divide-y divide-line">
      {rows(5).map((i) => (
        <li key={i} className="flex items-center gap-4 py-3">
          <Skeleton shape="icon" width={12} />
          <span className="flex-1">
            <Skeleton shape="pill" />
          </span>
          <Skeleton shape="heading" width={32} />
        </li>
      ))}
    </ul>
  </div>
);
