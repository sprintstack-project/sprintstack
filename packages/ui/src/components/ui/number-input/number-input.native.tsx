import { fieldShell } from '@lib/field-shell.native';
import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { useField } from '@ui/field';
import { Text } from '@ui/text';
import type { NumberInputProps } from '@ui/types';
import { clsx } from 'clsx';
import { Minus, Plus } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

const REPEAT_MS = 90;

const parse = (text: string) => {
  const n = Number.parseFloat(text.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

// Inputs are always 56px (see ControlSize), so `size` is accepted but not applied.
const NumberInput = ({
  id,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  unit,
  placeholder,
  invalid,
  disabled,
  onBlur,
}: NumberInputProps) => {
  const field = useField();
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(defaultValue ?? null);
  const current = value === undefined ? draft : value;
  const [text, setText] = useState(current == null ? '' : String(current));
  const repeat = useRef<ReturnType<typeof setInterval> | null>(null);
  const latest = useRef(current);
  latest.current = current;

  // Keep the text in step with outside changes to a controlled value.
  useEffect(() => {
    if (value !== undefined) setText(value == null ? '' : String(value));
  }, [value]);
  // Stop a held stepper if the input unmounts mid-repeat.
  useEffect(
    () => () => {
      if (repeat.current) clearInterval(repeat.current);
    },
    [],
  );

  const commit = (next: number | null) => {
    setDraft(next);
    setText(next == null ? '' : String(next));
    latest.current = next;
    onValueChange?.(next);
  };

  const canDecrement = !disabled && (min === undefined || (current ?? 0) > min);
  const canIncrement = !disabled && (max === undefined || (current ?? 0) < max);
  const nudge = (dir: 1 | -1) => {
    // Steppers clamp to the bounds; only typed values may go out of range.
    let next = (latest.current ?? 0) + dir * step;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    commit(next);
  };
  const startRepeat = (dir: 1 | -1) => {
    stopRepeat();
    repeat.current = setInterval(() => nudge(dir), REPEAT_MS);
  };
  const stopRepeat = () => {
    if (repeat.current) clearInterval(repeat.current);
    repeat.current = null;
  };

  const over =
    current != null &&
    ((min !== undefined && current < min) || (max !== undefined && current > max));
  const decColor = useTokenColor(canDecrement ? 'ink' : 'ink-disabled');
  const incColor = useTokenColor(canIncrement ? 'ink' : 'ink-disabled');

  const stepper = (dir: 1 | -1, enabled: boolean) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={dir === 1 ? 'Increase' : 'Decrease'}
      accessibilityState={{ disabled: !enabled }}
      disabled={!enabled}
      onPress={() => nudge(dir)}
      onLongPress={() => startRepeat(dir)}
      onPressOut={stopRepeat}
      className={clsx(
        'w-16 items-center justify-center border-line-strong active:bg-surface-pressed',
        dir === 1 ? 'border-l-[1.5px]' : 'border-r-[1.5px]',
      )}
    >
      {dir === 1 ? (
        <Plus aria-hidden size={scaled(24)} strokeWidth={2} color={incColor} />
      ) : (
        <Minus aria-hidden size={scaled(24)} strokeWidth={2} color={decColor} />
      )}
    </Pressable>
  );

  return (
    <View
      className={fieldShell(
        { focused, invalid: invalid || over || field?.invalid, disabled },
        'flex-row overflow-hidden',
      )}
    >
      {stepper(-1, canDecrement)}
      <View className="min-w-0 flex-1 flex-row items-center justify-center gap-1.5 px-2">
        <TextInput
          nativeID={id}
          value={text}
          onChangeText={(next) => {
            setText(next);
            const n = parse(next);
            setDraft(n);
            onValueChange?.(n);
          }}
          keyboardType={min !== undefined && min >= 0 ? 'decimal-pad' : 'numbers-and-punctuation'}
          placeholder={placeholder}
          editable={!disabled}
          accessibilityLabel={field?.label}
          aria-labelledby={field?.labelId}
          accessibilityHint={field?.hint}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          className={clsx(
            // Natural height, so the row centres value and unit on the same line.
            'p-0 text-lg leading-6',
            unit ? 'text-right' : 'flex-1 text-center',
            disabled ? 'text-ink-disabled' : 'text-ink',
          )}
          style={{ fontVariant: ['tabular-nums'] }}
          placeholderTextColorClassName="accent-ink-placeholder"
          cursorColorClassName="accent-ink"
        />
        {unit && <Text className="text-lg leading-6 text-ink-muted">{unit}</Text>}
      </View>
      {stepper(1, canIncrement)}
    </View>
  );
};

export default NumberInput;
