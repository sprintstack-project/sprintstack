import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { Text } from '@ui/text';
import type { StepperProps } from '@ui/types';
import { clsx } from 'clsx';
import { Check } from 'lucide-react-native';
import { Fragment } from 'react';
import { View } from 'react-native';

const stepLabel = 'text-[0.9375rem] leading-4 font-extrabold uppercase';

/** Numbered progress: done steps get a check, the current one is brand, later ones outlined. */
const Stepper = ({ steps, current, label = 'Progress', compact }: StepperProps) => {
  const onInk = useTokenColor('on-ink');
  const summary = `Step ${current + 1} of ${steps.length} · ${steps[current]}`;

  if (compact) {
    return (
      <View className="gap-2" accessible accessibilityLabel={`${label}: ${summary}`}>
        <View className="flex-row gap-1.5">
          {steps.map((step, index) => (
            <View
              key={step}
              className={clsx(
                'h-1.5 flex-1 rounded-full',
                index <= current ? 'bg-brand' : 'bg-line',
              )}
            />
          ))}
        </View>
        <Text className="text-[0.8125rem] leading-4 font-bold uppercase tracking-[.4px] text-ink-muted">
          {summary}
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-row items-center gap-2.5"
      accessible
      accessibilityLabel={`${label}: ${summary}`}
    >
      {steps.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'upcoming';
        return (
          <Fragment key={step}>
            {index > 0 && (
              <View
                className={clsx(
                  'h-[1.5px] min-w-4 flex-1',
                  index <= current ? 'bg-ink' : 'bg-line',
                )}
              />
            )}
            <View className="shrink-0 flex-row items-center gap-2">
              <View
                className={clsx(
                  'size-8 items-center justify-center rounded-full',
                  state === 'done' && 'bg-ink',
                  state === 'current' && 'bg-brand',
                  state === 'upcoming' && 'border-[1.5px] border-line-strong',
                )}
              >
                {state === 'done' ? (
                  <Check size={scaled(16)} strokeWidth={2.5} color={onInk} aria-hidden />
                ) : (
                  <Text
                    className={clsx(
                      stepLabel,
                      state === 'current' ? 'text-on-brand' : 'text-ink-muted',
                    )}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                className={clsx(stepLabel, state === 'upcoming' ? 'text-ink-muted' : 'text-ink')}
              >
                {step}
              </Text>
            </View>
          </Fragment>
        );
      })}
    </View>
  );
};

export default Stepper;
