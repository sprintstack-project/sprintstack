import type { SpinnerProps } from '@ui/types';
import { clsx } from 'clsx';

const sizes = { 16: 'size-4', 20: 'size-5', 24: 'size-6', 40: 'size-10' };

/** A faint track and a short arc, in currentColor. */
const Ring = ({ size = 20 }: Pick<SpinnerProps, 'size'>) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    // The page ring is drawn thinner so it doesn't read heavy at 40.
    strokeWidth={size === 40 ? 1.75 : 2.5}
    className={clsx(
      'shrink-0 animate-spin motion-reduce:[animation-duration:2.5s]',
      sizes[size],
      size === 40 && 'text-brand-ink',
    )}
  >
    <circle cx="12" cy="12" r="10" opacity={0.25} />
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeDasharray="16 100" />
  </svg>
);

const Spinner = ({ size = 20, label }: SpinnerProps) => {
  if (!label) return <Ring size={size} />;
  return (
    <span
      role="status"
      className="inline-flex items-center gap-2.5 text-[1.0625rem] leading-5 font-semibold text-ink-muted font-stretch-semi-condensed"
    >
      <Ring size={size} />
      {label}
    </span>
  );
};

export default Spinner;
