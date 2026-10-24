import { Select as BaseSelect } from '@base-ui/react/select';
import { usePortalContainer } from '@lib/portal-container';
import { STATUS_LABEL } from '@lib/status';
import { Caret } from '@ui/Select/Caret';
import { OptionContent, optionText } from '@ui/Select/OptionContent';
import type { SelectProps } from '@ui/types';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import { useState } from 'react';

const text = (o: Parameters<typeof optionText>[0]) => optionText(o, (tone) => STATUS_LABEL[tone]);

// Rows are 56px with hairlines between them; the highlight hides the hairlines on both sides.
const row = clsx(
  'relative flex min-h-14 cursor-pointer items-center gap-4 rounded-md px-4 text-[1.0625rem] leading-6 text-ink outline-none select-none',
  // The hairline is always out of flow (an in-flow ::before would add a flex gap); only rows after a row colour it.
  'before:absolute before:inset-x-0 before:top-0 before:h-px [&+&]:before:bg-line',
  'data-highlighted:bg-surface-hover data-highlighted:before:opacity-0 [[data-highlighted]+&]:before:opacity-0',
  'data-disabled:cursor-not-allowed data-disabled:text-ink-disabled',
);

export const popup = clsx(
  'max-h-[min(var(--available-height),26.25rem)] overflow-y-auto rounded-lg border border-line bg-surface p-2 shadow-popover outline-none',
  // Menus drop 6px into place.
  'origin-(--transform-origin) transition-[opacity,translate] duration-140 ease-out data-ending-style:opacity-0 data-starting-style:-translate-y-1.5 data-starting-style:opacity-0',
  'motion-reduce:transition-none',
);

export function Select<V = string>({
  id,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  defaultOpen,
  invalid,
  disabled,
  onBlur,
}: SelectProps<V>) {
  // Always controlled internally, so action rows ("Clear this view") can run without becoming the value.
  const [ownValue, setOwnValue] = useState<V | null>(defaultValue ?? null);
  const current = value === undefined ? ownValue : value;
  const selected = options.find((o) => o.value === current);
  const container = usePortalContainer();

  return (
    <BaseSelect.Root<V>
      id={id}
      value={current}
      onValueChange={(next) => {
        const option = options.find((o) => o.value === next);
        if (option?.action) return option.action();
        setOwnValue(next);
        onValueChange?.(next);
      }}
      items={options.map((o) => ({ value: o.value, label: text(o) }))}
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        if (!open) onBlur?.();
      }}
      disabled={disabled}
    >
      <BaseSelect.Trigger
        data-invalid={invalid || undefined}
        className={clsx(
          'field flex w-full cursor-pointer items-center gap-3 px-5 text-left text-[1.0625rem] leading-6',
          'focus-visible:outline-none data-disabled:cursor-not-allowed',
        )}
      >
        <BaseSelect.Value
          placeholder={placeholder}
          className="flex min-w-0 flex-1 items-center gap-3 truncate data-placeholder:text-ink-placeholder"
        >
          {() => (selected ? <OptionContent option={selected} inTrigger /> : placeholder)}
        </BaseSelect.Value>
        <BaseSelect.Icon className="flex data-popup-open:rotate-180">
          <Caret />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal container={container}>
        <BaseSelect.Positioner
          sideOffset={8}
          alignItemWithTrigger={false}
          className="z-50 outline-none"
        >
          <BaseSelect.Popup className={clsx(popup, 'min-w-(--anchor-width)')}>
            <BaseSelect.List>
              {options.map((option) => (
                <BaseSelect.Item
                  key={String(option.value)}
                  value={option.value}
                  label={text(option)}
                  disabled={option.disabled}
                  data-danger={option.danger || undefined}
                  className={clsx(row, 'data-danger:text-brand-ink')}
                >
                  <BaseSelect.ItemText className="flex min-w-0 flex-1 items-center gap-4">
                    <OptionContent option={option} />
                  </BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="ml-auto flex text-brand-ink">
                    <Check aria-hidden strokeWidth={2} className="size-6" />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
