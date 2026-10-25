import type { StepperProps } from '@ui/types';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import { Fragment } from 'react';

const stepLabel =
  'font-display text-[0.9375rem] leading-none font-extrabold uppercase font-stretch-condensed';

/** Numbered progress: done steps get a check, the current one is brand, later ones outlined. */
const Stepper = ({ steps, current, label = 'Progress', compact }: StepperProps) => {
  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <div className="grid grid-flow-col gap-1.5" aria-hidden>
          {steps.map((step, index) => (
            <span
              key={step}
              className={clsx('h-1.5 rounded-full', index <= current ? 'bg-brand' : 'bg-line')}
            />
          ))}
        </div>
        <span className="eyebrow">
          Step {current + 1} of {steps.length} · {steps[current]}
        </span>
      </div>
    );
  }

  return (
    <ol aria-label={label} className="m-0 flex list-none items-center gap-2.5 p-0">
      {steps.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'upcoming';
        return (
          <Fragment key={step}>
            {index > 0 && (
              <li
                aria-hidden
                className={clsx(
                  'h-[1.5px] min-w-4 flex-1',
                  index <= current ? 'bg-ink' : 'bg-line',
                )}
              />
            )}
            <li
              aria-current={state === 'current' ? 'step' : undefined}
              className={clsx(
                'flex shrink-0 items-center gap-2',
                state === 'upcoming' ? 'text-ink-muted' : 'text-ink',
              )}
            >
              <span
                className={clsx(
                  'grid size-8 place-items-center rounded-full',
                  stepLabel,
                  state === 'done' && 'bg-ink text-on-ink',
                  state === 'current' && 'bg-brand text-on-brand',
                  state === 'upcoming' && 'border-[1.5px] border-line-strong',
                )}
              >
                {state === 'done' ? (
                  <Check aria-hidden strokeWidth={2.5} className="size-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span className={stepLabel}>
                {step}
                {state === 'done' && <span className="sr-only"> (done)</span>}
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
};

export default Stepper;
