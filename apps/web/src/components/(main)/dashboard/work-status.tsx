import { Badge } from '@ui/badge';
import type { StatusTone } from '@ui/types';
import { SPRINT, STATUS_COUNTS } from './data';

// Solid fills for the bar and the legend dots.
const fills: Record<StatusTone, string> = {
  neutral: 'bg-ink-muted',
  info: 'bg-info',
  review: 'bg-review',
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
};

const WorkStatus = () => {
  const total = STATUS_COUNTS.reduce((sum, status) => sum + status.count, 0);
  return (
    <div className="flex flex-col gap-5">
      <p className="flex items-baseline gap-3">
        <span className="headline text-[3.5rem] leading-none text-ink tabular-nums">{total}</span>
        <span className="text-meta text-ink-muted">work items in {SPRINT.name}</span>
      </p>
      {/* Only the bar's outer ends are rounded; the segments meet square. */}
      <div aria-hidden className="flex h-3 gap-1 overflow-hidden rounded-full">
        {STATUS_COUNTS.map((status) => (
          <span
            key={status.tone}
            className={fills[status.tone]}
            style={{ flexGrow: status.count }}
          />
        ))}
      </div>
      <ul className="divide-y divide-line">
        {STATUS_COUNTS.map((status) => (
          <li key={status.tone} className="flex items-center gap-4 py-3">
            <span aria-hidden className={`size-3 shrink-0 rounded-xs ${fills[status.tone]}`} />
            <span className="flex-1">
              <Badge tone={status.tone} />
            </span>
            <span className="headline text-title text-ink tabular-nums">{status.count}</span>
            <span className="w-12 text-right text-meta text-ink-muted tabular-nums">
              {Math.round((status.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkStatus;
