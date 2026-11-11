import type { ProgressBarProps } from '@ui/types';

const ProgressBar = ({ label, value, showValue, color }: ProgressBarProps) => {
  const pct = value === undefined ? undefined : Math.round(Math.min(100, Math.max(0, value)));
  const bar = (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-0.75 min-w-0 flex-1 overflow-hidden rounded-full bg-brand-subtle"
    >
      {pct === undefined ? (
        <div className="progress-sweep h-full rounded-full bg-brand" />
      ) : (
        <div
          className={`h-full rounded-full transition-[width] duration-200 ease-out motion-reduce:transition-none ${color === 'danger' ? 'bg-danger' : 'bg-brand'}`}
          style={{ width: `${pct}%` }}
        />
      )}
    </div>
  );

  if (!showValue || pct === undefined) return <div className="flex w-full">{bar}</div>;
  return (
    <div className="flex w-full items-center gap-3">
      {bar}
      <span
        aria-hidden
        className="w-[4ch] text-right text-meta text-ink-muted tabular-nums font-stretch-semi-condensed"
      >
        {pct}%
      </span>
    </div>
  );
};

export default ProgressBar;
