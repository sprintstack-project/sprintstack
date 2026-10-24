import { fieldShell } from '@lib/field-shell.native';
import { scaled, touchSlop } from '@lib/scale';
import { Sheet, type SheetRef } from '@lib/sheet.native';
import { isImageUrl } from '@lib/status';
import { useTokenColor } from '@lib/use-token-color.native';
import { Button } from '@ui/Button/Button';
import { useField } from '@ui/Field/Field';
import { OptionContent, optionText } from '@ui/Select/OptionContent';
import type { MultiSelectProps, Option } from '@ui/types';
import { clsx } from 'clsx';
import { Check, ChevronDown, Plus, Search, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-actions-sheet';

const chipTones = {
  ink: { box: 'bg-ink', text: 'text-on-ink', icon: 'on-ink' },
  neutral: { box: 'bg-surface-muted', text: 'text-ink', icon: 'ink' },
  outline: { box: 'border-[1.5px] border-line-strong', text: 'text-ink', icon: 'ink' },
};

export function MultiSelect<V = string>({
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
  const field = useField();
  const sheet = useRef<SheetRef>(null);
  const [open, setOpen] = useState(false);
  const [ownValue, setOwnValue] = useState<V[]>(defaultValue ?? []);
  const values = value ?? ownValue;
  const [query, setQuery] = useState('');
  const [loaded, setLoaded] = useState<Option<V>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [rowsOf, setRowsOf] = useState<number[]>([]);

  const known = useRef(new Map<V, Option<V>>());
  for (const o of [...options, ...(loaded ?? [])]) known.current.set(o.value, o);
  const lookup = (v: V): Option<V> => known.current.get(v) ?? { value: v, label: String(v) };
  const selected = values.map(lookup);

  useEffect(() => {
    if (defaultOpen) sheet.current?.show();
  }, [defaultOpen]);
  // Re-measure from a full layout whenever pills are added or removed.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the count is the trigger
  useEffect(() => setRowsOf([]), [selected.length]);
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

  const commit = (next: V[]) => {
    setOwnValue(next);
    onValueChange?.(next);
  };
  const toggle = (v: V) =>
    commit(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);

  const q = query.trim().toLowerCase();
  const source = loadOptions
    ? (loaded ?? [])
    : options.filter((o) => optionText(o).toLowerCase().includes(q));
  const canCreate =
    creatable &&
    q !== '' &&
    ![...source, ...selected].some((o) => optionText(o).toLowerCase() === q);
  const full = max !== undefined && values.length >= max;

  // Past two rows of pills, collapse to "+N more" (measured from each pill's layout).
  const rowTops = [...new Set(rowsOf.slice(0, selected.length))].sort((a, b) => a - b);
  const fit =
    rowTops.length > 2 ? rowsOf.filter((y) => y <= rowTops[1]).length - 1 : selected.length;
  const shown = selected.slice(0, Math.max(1, fit));
  const hidden = selected.length - shown.length;

  return (
    <>
      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel={field?.label}
        accessibilityHint={field?.hint}
        accessibilityValue={{ text: selected.map(optionText).join(', ') || placeholder }}
        accessibilityState={{ disabled: Boolean(disabled), expanded: open }}
        disabled={disabled}
        onPress={() => {
          setOpen(true);
          sheet.current?.show();
        }}
        className={fieldShell(
          { focused: open, invalid: invalid || field?.invalid, disabled },
          'flex-row flex-wrap items-center gap-2 py-2.5 pr-12 pl-2.5',
        )}
      >
        {selected.length === 0 && (
          <Text
            className={clsx(
              'pl-2 text-[1.0625rem]',
              disabled ? 'text-ink-disabled' : 'text-ink-placeholder',
            )}
          >
            {placeholder}
          </Text>
        )}
        {(hidden > 0 ? shown : selected).map((option, i) => (
          <View
            key={String(option.value)}
            onLayout={(e) => {
              const y = Math.round(e.nativeEvent.layout.y);
              setRowsOf((all) => (all[i] === y ? all : Object.assign([...all], { [i]: y })));
            }}
          >
            <Pill
              option={option}
              tone={chipTone}
              disabled={disabled}
              onRemove={() => toggle(option.value)}
            />
          </View>
        ))}
        {hidden > 0 && (
          <View className="h-[2.125rem] justify-center rounded-full bg-surface-muted px-3.5">
            <Text className="text-[0.9375rem] font-semibold text-ink">+{hidden} more</Text>
          </View>
        )}
        <View className="absolute top-0 right-4 bottom-0 justify-center">
          <Chevron disabled={disabled} />
        </View>
      </Pressable>

      <Sheet
        sheetRef={sheet}
        title={field?.label}
        onClose={() => {
          onBlur?.();
          setOpen(false);
          setQuery('');
        }}
      >
        <SearchBox value={query} onChange={setQuery} />
        <ScrollView style={{ maxHeight: 360 }} keyboardShouldPersistTaps="handled">
          {loading && <Text className="p-4 font-semibold text-ink-muted">Searching…</Text>}
          {!loading && source.length === 0 && !canCreate && (
            <Text className="p-4 font-semibold text-ink-muted">No matches</Text>
          )}
          {source.map((option, index) => {
            const checked = values.includes(option.value);
            const blocked = option.disabled || (full && !checked);
            return (
              <Pressable
                key={String(option.value)}
                accessibilityRole="checkbox"
                accessibilityLabel={optionText(option)}
                accessibilityState={{ checked, disabled: blocked }}
                disabled={blocked}
                onPress={() => toggle(option.value)}
                className={clsx(
                  'min-h-14 flex-row items-center gap-4 rounded-md px-4 active:bg-surface-pressed',
                  index > 0 && 'border-t border-line',
                )}
              >
                <CheckBox checked={checked} disabled={blocked} />
                <View className="min-w-0 flex-1 flex-row items-center gap-4">
                  <OptionContent option={blocked ? { ...option, disabled: true } : option} />
                </View>
              </Pressable>
            );
          })}
          {canCreate && (
            <CreateRow
              label={query.trim()}
              onPress={() => {
                const option = { value: query.trim() as V, label: query.trim() };
                known.current.set(option.value, option);
                commit([...values, option.value]);
                setQuery('');
              }}
            />
          )}
        </ScrollView>
        {full && (
          <Text className="px-4 text-meta font-semibold text-ink-muted">
            You can pick up to {max}.
          </Text>
        )}
        <View className="items-end pt-2">
          <Button variant="primary" onClick={() => sheet.current?.hide()}>
            Done
          </Button>
        </View>
      </Sheet>
    </>
  );
}

function Pill<V>({
  option,
  tone,
  disabled,
  onRemove,
}: {
  option: Option<V>;
  tone: keyof typeof chipTones;
  disabled?: boolean;
  onRemove: () => void;
}) {
  const style = chipTones[tone];
  const color = useTokenColor(style.icon);
  const label = optionText(option);
  return (
    <View
      className={clsx(
        'h-[2.125rem] flex-row items-center gap-2 rounded-full pl-3.5',
        disabled ? 'pr-3.5' : 'pr-2',
        style.box,
      )}
    >
      {option.avatar &&
        (isImageUrl(option.avatar) ? (
          <Image
            source={{ uri: option.avatar }}
            accessibilityIgnoresInvertColors
            className="-ml-2 size-[1.375rem] rounded-full"
          />
        ) : (
          <View
            aria-hidden
            className="-ml-2 size-[1.375rem] items-center justify-center rounded-full bg-ink-muted"
          >
            <Text className="text-[0.625rem] font-bold text-on-ink">{option.avatar}</Text>
          </View>
        ))}
      <Text numberOfLines={1} className={clsx('shrink text-[0.9375rem] font-semibold', style.text)}>
        {label}
      </Text>
      {!disabled && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          onPress={onRemove}
          hitSlop={touchSlop(22)}
          className="size-[1.375rem] items-center justify-center rounded-full"
        >
          <X aria-hidden size={scaled(18)} strokeWidth={2} color={color} />
        </Pressable>
      )}
    </View>
  );
}

function CheckBox({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  const onInk = useTokenColor('on-ink');
  return (
    <View
      className={clsx(
        'size-6 items-center justify-center rounded-[0.4375rem] border-2',
        disabled ? 'border-ink-disabled' : 'border-ink',
        checked && 'bg-ink',
      )}
    >
      {checked && <Check aria-hidden size={scaled(16)} strokeWidth={3} color={onInk} />}
    </View>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const muted = useTokenColor('ink-muted');
  return (
    <View className="mb-1 h-12 flex-row items-center gap-3 rounded-full bg-surface-muted px-4">
      <Search aria-hidden size={scaled(20)} strokeWidth={2} color={muted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search"
        accessibilityLabel="Search options"
        autoCorrect={false}
        className="h-12 flex-1 text-[1.0625rem] text-ink"
        placeholderTextColorClassName="accent-ink-placeholder"
        cursorColorClassName="accent-ink"
      />
    </View>
  );
}

function CreateRow({ label, onPress }: { label: string; onPress: () => void }) {
  const ink = useTokenColor('ink');
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-14 flex-row items-center gap-4 rounded-md border-t border-line px-4 active:bg-surface-pressed"
    >
      <Plus aria-hidden size={scaled(24)} strokeWidth={2} color={ink} />
      <Text numberOfLines={1} className="shrink text-[1.0625rem] text-ink">
        Create "{label}"
      </Text>
    </Pressable>
  );
}

function Chevron({ disabled }: { disabled?: boolean }) {
  const color = useTokenColor(disabled ? 'ink-disabled' : 'ink-muted');
  return <ChevronDown aria-hidden size={scaled(24)} strokeWidth={2} color={color} />;
}
