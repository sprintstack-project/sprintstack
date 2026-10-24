import { Combobox } from '@base-ui/react/combobox';
import { usePortalContainer } from '@lib/portal-container';
import { isImageUrl, STATUS_LABEL } from '@lib/status';
import { popupFrame, row } from '@ui/Select/menu';
import { OptionContent, optionText } from '@ui/Select/OptionContent';
import {
  type OptionVirtualizer,
  scrollHighlightedIntoView,
  VirtualOptionList,
} from '@ui/Select/VirtualOptionList';
import type { MultiSelectProps, Option } from '@ui/types';
import { clsx } from 'clsx';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

const text = <V,>(o: Option<V>) => optionText(o, (tone) => STATUS_LABEL[tone]);

const chipTones = {
  ink: 'bg-ink text-on-ink',
  neutral: 'bg-surface-muted text-ink',
  outline: 'border-[1.5px] border-line-strong text-ink',
};

/** Marks the "Create …" row offered by `creatable`. */
const CREATE = Symbol('create');
type Item<V> = Option<V> & { [CREATE]?: true };

export function MultiSelect<V = string>({
  id,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  chipTone = 'ink',
  creatable,
  max,
  loadOptions,
  defaultOpen,
  invalid,
  disabled,
  onBlur,
}: MultiSelectProps<V>) {
  const container = usePortalContainer();
  const field = useRef<HTMLDivElement>(null);
  const virtualizer = useRef<OptionVirtualizer | null>(null);
  const [ownValue, setOwnValue] = useState<V[]>(defaultValue ?? []);
  const values = value ?? ownValue;
  const [query, setQuery] = useState('');
  const [loaded, setLoaded] = useState<Option<V>[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Remember every option we've seen, so picked values keep their labels after an async search moves on.
  const known = useRef(new Map<V, Option<V>>());
  for (const o of [...options, ...(loaded ?? [])]) known.current.set(o.value, o);
  const lookup = (v: V): Option<V> => known.current.get(v) ?? { value: v, label: String(v) };
  const selected = values.map(lookup);

  useEffect(() => {
    if (!loadOptions) return;
    let cancelled = false;
    setLoading(true);
    loadOptions(query).then((result) => {
      if (cancelled) return;
      setLoaded(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [loadOptions, query]);

  const source: Item<V>[] = loadOptions ? (loaded ?? []) : options;
  const trimmed = query.trim();
  const canCreate =
    creatable &&
    trimmed !== '' &&
    ![...source, ...selected].some((o) => text(o).toLowerCase() === trimmed.toLowerCase());
  const items: Item<V>[] = [
    ...source,
    ...selected.filter((s) => !source.some((o) => o.value === s.value)),
    ...(canCreate
      ? [{ value: trimmed as V, label: `Create "${trimmed}"`, [CREATE]: true as const }]
      : []),
  ];
  const full = max !== undefined && values.length >= max;

  const commit = (next: V[]) => {
    setOwnValue(next);
    onValueChange?.(next);
  };

  return (
    <Combobox.Root<Item<V>, true>
      id={id}
      multiple
      items={items}
      // Rows are virtualized (TanStack Virtual); Base UI tracks them by index.
      virtualized
      onItemHighlighted={scrollHighlightedIntoView(virtualizer)}
      // Async results arrive pre-filtered; local options are filtered by label.
      {...(loadOptions && { filteredItems: items })}
      itemToStringLabel={text}
      isItemEqualToValue={(a, b) => a.value === b.value}
      value={selected}
      onValueChange={(next) => {
        const created = next.find((o) => o[CREATE]);
        if (created) {
          const option = { value: created.value, label: String(created.value) };
          known.current.set(option.value, option);
          setQuery('');
        }
        commit(next.map((o) => o.value));
      }}
      inputValue={query}
      onInputValueChange={setQuery}
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        if (!open) onBlur?.();
      }}
      disabled={disabled}
    >
      <PillField
        box={field}
        selected={selected}
        chipTone={chipTone}
        invalid={invalid}
        disabled={disabled}
        placeholder={values.length ? undefined : placeholder}
      />
      <Combobox.Portal container={container}>
        {/* Anchor to the whole field, not just the text input. */}
        <Combobox.Positioner anchor={field} sideOffset={8} className="z-50 outline-none">
          <Combobox.Popup className={clsx(popupFrame, 'w-(--anchor-width) overflow-hidden')}>
            {loading && (
              <div role="status" className="p-4 font-semibold text-ink-muted">
                Searching…
              </div>
            )}
            {!loading && (
              <Combobox.Empty className="p-4 font-semibold text-ink-muted empty:hidden">
                No matches
              </Combobox.Empty>
            )}
            <VirtualOptionList<Item<V>> virtualizerRef={virtualizer}>
              {(option, virtualRow) => (
                <Combobox.Item
                  key={option[CREATE] ? 'create' : String(option.value)}
                  value={option}
                  disabled={
                    option.disabled || (full && !values.includes(option.value) && !option[CREATE])
                  }
                  {...virtualRow}
                  className={clsx(row, virtualRow.index > 0 && 'before:bg-line')}
                >
                  {option[CREATE] ? (
                    <>
                      <Plus aria-hidden strokeWidth={2} className="size-6 shrink-0" />
                      <span className="truncate">{option.label}</span>
                    </>
                  ) : (
                    <>
                      <span className="grid size-6 shrink-0 place-items-center rounded-[0.4375rem] border-2 border-ink group-data-disabled:border-ink-disabled group-data-selected:bg-ink group-data-selected:text-on-ink">
                        <Combobox.ItemIndicator className="flex">
                          <Check aria-hidden strokeWidth={3} className="size-4" />
                        </Combobox.ItemIndicator>
                      </span>
                      <OptionContent option={option} />
                    </>
                  )}
                </Combobox.Item>
              )}
            </VirtualOptionList>
            {full && (
              <p className="px-4 pt-2 pb-1 text-meta font-semibold text-ink-muted font-stretch-semi-condensed">
                You can pick up to {max}.
              </p>
            )}
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

interface PillFieldProps<V> {
  box: RefObject<HTMLDivElement | null>;
  selected: Option<V>[];
  chipTone: keyof typeof chipTones;
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

/** The field: pills plus the filter input. Past two rows, pills collapse to "+N more" until focused. */
function PillField<V>({
  box,
  selected,
  chipTone,
  invalid,
  disabled,
  placeholder,
}: PillFieldProps<V>) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(Number.POSITIVE_INFINITY);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, [box]);

  // Measure with every pill shown, then keep only the ones on the first two rows.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when pills or width change
  useLayoutEffect(() => {
    setVisible(Number.POSITIVE_INFINITY);
  }, [selected.length, width]);
  useLayoutEffect(() => {
    if (visible !== Number.POSITIVE_INFINITY || !box.current) return;
    const chips = [...box.current.querySelectorAll<HTMLElement>('[data-pill]')];
    const rows = [...new Set(chips.map((c) => c.offsetTop))];
    if (rows.length <= 2) return;
    // Leave room on row two for the "+N more" pill.
    const fit = chips.filter((c) => c.offsetTop <= rows[1]).length;
    setVisible(Math.max(1, fit - 1));
  }, [box, visible]);

  const collapsed = !focused && selected.length > visible;
  const shown = collapsed ? selected.slice(0, visible) : selected;

  return (
    <Combobox.Chips
      ref={box}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      className="field relative flex w-full flex-wrap items-center gap-2 py-2.5 pr-12 pl-2.5"
    >
      {shown.map((option) => (
        <Combobox.Chip
          key={String(option.value)}
          data-pill
          className={clsx(
            'inline-flex h-[2.125rem] max-w-full items-center gap-2 rounded-full pl-3.5',
            disabled ? 'pr-3.5' : 'pr-2',
            'text-[0.9375rem] leading-5 font-semibold font-stretch-semi-condensed',
            'outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring',
            chipTones[chipTone],
          )}
        >
          {option.avatar &&
            (isImageUrl(option.avatar) ? (
              <img
                src={option.avatar}
                alt=""
                className="-ml-2 size-[1.375rem] rounded-full object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="-ml-2 grid size-[1.375rem] shrink-0 place-items-center rounded-full bg-ink-muted text-[0.625rem] font-bold text-on-ink"
              >
                {option.avatar}
              </span>
            ))}
          <span className="truncate">{text(option)}</span>
          {!disabled && (
            <Combobox.ChipRemove
              aria-label={`Remove ${text(option)}`}
              className="grid size-[1.375rem] shrink-0 cursor-pointer place-items-center rounded-full hover:bg-current/20"
            >
              <X aria-hidden strokeWidth={2} className="size-[1.125rem]" />
            </Combobox.ChipRemove>
          )}
        </Combobox.Chip>
      ))}
      {collapsed && (
        <span className="inline-flex h-[2.125rem] items-center rounded-full bg-surface-muted px-3.5 text-[0.9375rem] font-semibold text-ink font-stretch-semi-condensed">
          +{selected.length - visible} more
        </span>
      )}
      <Combobox.Input
        placeholder={placeholder}
        className="h-9 min-w-16 flex-1 bg-transparent pl-2 text-[1.0625rem] text-ink outline-none placeholder:text-ink-placeholder disabled:cursor-not-allowed"
      />
      <Combobox.Trigger
        aria-label="Show options"
        className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-ink-muted hover:bg-surface-hover data-popup-open:[&>svg]:rotate-180"
      >
        <ChevronDown
          aria-hidden
          strokeWidth={2}
          className="size-6 transition-transform duration-120"
        />
      </Combobox.Trigger>
    </Combobox.Chips>
  );
}
