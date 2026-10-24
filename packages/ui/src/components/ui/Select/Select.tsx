'use client';

import { Combobox } from '@base-ui/react/combobox';
import { Select as BaseSelect } from '@base-ui/react/select';
import { usePortalContainer } from '@lib/portal-container';
import { STATUS_LABEL } from '@lib/status';
import { Caret } from '@ui/select/caret';
import { hairline, popup, popupFrame, row } from '@ui/select/menu';
import { OptionContent, optionText } from '@ui/select/option-content';
import {
  type OptionVirtualizer,
  scrollHighlightedIntoView,
  VirtualOptionList,
} from '@ui/select/virtual-option-list';
import type { Option, SelectProps } from '@ui/types';
import { clsx } from 'clsx';
import { Check, Search } from 'lucide-react';
import { useRef, useState } from 'react';

const text = <V,>(o: Option<V>) => optionText(o, (tone) => STATUS_LABEL[tone]);

const trigger = clsx(
  'field flex w-full cursor-pointer items-center gap-3 px-5 text-left text-[1.0625rem] leading-6',
  'focus-visible:outline-none data-disabled:cursor-not-allowed',
);

export function Select<V = string>(props: SelectProps<V>) {
  return props.searchable ? <SearchableSelect {...props} /> : <PlainSelect {...props} />;
}

/** Always controlled internally, so action rows ("Clear this view") can run without becoming the value. */
function useSelectValue<V>({ options, value, defaultValue, onValueChange }: SelectProps<V>) {
  const [ownValue, setOwnValue] = useState<V | null>(defaultValue ?? null);
  const current = value === undefined ? ownValue : value;
  const pick = (option: Option<V> | undefined) => {
    if (!option) return;
    if (option.action) return option.action();
    setOwnValue(option.value);
    onValueChange?.(option.value);
  };
  return { current, selected: options.find((o) => o.value === current), pick };
}

function PlainSelect<V>(props: SelectProps<V>) {
  const { id, options, placeholder, defaultOpen, invalid, disabled, onBlur } = props;
  const { current, selected, pick } = useSelectValue(props);
  const container = usePortalContainer();

  return (
    <BaseSelect.Root<V>
      id={id}
      value={current}
      onValueChange={(next) => pick(options.find((o) => o.value === next))}
      items={options.map((o) => ({ value: o.value, label: text(o) }))}
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        if (!open) onBlur?.();
      }}
      disabled={disabled}
    >
      <BaseSelect.Trigger data-invalid={invalid || undefined} className={trigger}>
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
                  className={clsx(row, hairline, 'data-danger:text-brand-ink')}
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

/** Same trigger, plus a search box in the menu and virtualized rows (TanStack Virtual). */
function SearchableSelect<V>(props: SelectProps<V>) {
  const { id, options, placeholder, defaultOpen, invalid, disabled, onBlur } = props;
  const { selected, pick } = useSelectValue(props);
  const container = usePortalContainer();
  const virtualizer = useRef<OptionVirtualizer | null>(null);
  const [query, setQuery] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);

  return (
    <Combobox.Root<Option<V>>
      items={options}
      virtualized
      value={selected ?? null}
      onValueChange={(next) => pick(next ?? undefined)}
      itemToStringLabel={text}
      isItemEqualToValue={(a, b) => a.value === b.value}
      inputValue={query}
      onInputValueChange={setQuery}
      onItemHighlighted={scrollHighlightedIntoView(virtualizer)}
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        // Start each search fresh.
        if (open) setQuery('');
        else onBlur?.();
      }}
      disabled={disabled}
    >
      <Combobox.Trigger id={id} data-invalid={invalid || undefined} className={trigger}>
        <span
          className={clsx(
            'flex min-w-0 flex-1 items-center gap-3 truncate',
            !selected && 'text-ink-placeholder',
          )}
        >
          {selected ? <OptionContent option={selected} inTrigger /> : placeholder}
        </span>
        <span className="flex in-data-popup-open:rotate-180">
          <Caret />
        </span>
      </Combobox.Trigger>
      <Combobox.Portal container={container}>
        <Combobox.Positioner sideOffset={8} className="z-50 outline-none">
          <Combobox.Popup
            // Opening puts the cursor in the search box, so typing filters straight away.
            initialFocus={searchInput}
            className={clsx(popupFrame, 'min-w-(--anchor-width) overflow-hidden')}
          >
            <div className="border-b border-line p-2">
              <div className="flex h-11 items-center gap-2 rounded-full bg-surface-muted px-4 text-ink-muted">
                <Search aria-hidden strokeWidth={2} className="size-5 shrink-0" />
                {/* Named by the surrounding Field's label, like the trigger. */}
                <Combobox.Input
                  ref={searchInput}
                  placeholder="Search"
                  className="min-w-0 flex-1 bg-transparent text-[1.0625rem] text-ink outline-none placeholder:text-ink-placeholder"
                />
              </div>
            </div>
            <Combobox.Empty className="p-4 font-semibold text-ink-muted empty:hidden">
              No matches
            </Combobox.Empty>
            <VirtualOptionList<Option<V>>
              virtualizerRef={virtualizer}
              initialIndex={selected ? options.indexOf(selected) : undefined}
            >
              {(option, virtualRow) => (
                <Combobox.Item
                  key={String(option.value)}
                  value={option}
                  disabled={option.disabled}
                  data-danger={option.danger || undefined}
                  {...virtualRow}
                  className={clsx(
                    row,
                    virtualRow.index > 0 && 'before:bg-line',
                    'data-danger:text-brand-ink',
                  )}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-4">
                    <OptionContent option={option} />
                  </span>
                  <Combobox.ItemIndicator className="ml-auto flex text-brand-ink">
                    <Check aria-hidden strokeWidth={2} className="size-6" />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </VirtualOptionList>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
