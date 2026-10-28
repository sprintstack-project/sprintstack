import { fonts } from '@lib/fonts';
import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { Text } from '@ui/text';
import type { HeadlineInputProps } from '@ui/types';
import { clsx } from 'clsx';
import { TriangleAlert } from 'lucide-react-native';
import { useImperativeHandle, useRef, useState } from 'react';
import { TextInput, type TextInputInstance, View } from 'react-native';

const HeadlineInput = ({
  id,
  label,
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  error,
  autoFocus,
  disabled,
  ref,
}: HeadlineInputProps) => {
  const input = useRef<TextInputInstance>(null);
  useImperativeHandle(ref, () => ({ focus: () => input.current?.focus() }), []);
  const [ownValue, setOwnValue] = useState(defaultValue ?? '');
  const [focused, setFocused] = useState(false);
  const errorColor = useTokenColor('brand-ink');

  return (
    // The error bar is its own view: one-sided borders (border-l-*) aren't drawn reliably here.
    <View className={clsx('relative gap-2', error && '-ml-6 pl-6 border-l-4 border-brand')}>
      {error && <View aria-hidden className="absolute top-0 bottom-0 left-0 w-1 bg-brand" />}
      {/* The focus ring, as on web: native has no outline, so a border that's clear until focused. */}
      <View
        className={clsx(
          'rounded-xl border-2 p-4',
          focused ? 'border-focus-ring' : 'border-transparent',
        )}
      >
        <TextInput
          ref={input}
          nativeID={id}
          accessibilityLabel={label}
          accessibilityHint={error}
          // Wraps like the web textarea; Return finishes rather than adding a line.
          multiline
          submitBehavior="blurAndSubmit"
          autoFocus={autoFocus}
          editable={!disabled}
          value={value ?? ownValue}
          onChangeText={(text) => {
            const next = text.replace(/\n/g, ' ');
            setOwnValue(next);
            onChange?.(next);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          placeholder={placeholder}
          // RN can't pick a weight from one family, so the extra-bold family is set directly.
          style={{ fontFamily: fonts[800] }}
          // Web's sizes: smaller on phones, the full headline from tablet widths.
          className={clsx(
            'p-0 text-[1.5rem] leading-[1.625rem] md:text-[2.75rem] md:leading-[2.875rem]',
            disabled ? 'text-ink-disabled' : 'text-ink',
          )}
          placeholderTextColorClassName="accent-ink-placeholder"
          cursorColorClassName="accent-ink"
          selectionColorClassName="accent-brand"
        />
      </View>
      {error && (
        <View accessibilityLiveRegion="polite" className="flex-row items-center gap-1.5">
          <TriangleAlert aria-hidden size={scaled(18)} strokeWidth={2} color={errorColor} />
          <Text className="shrink text-meta font-bold text-brand-ink">{error}</Text>
        </View>
      )}
    </View>
  );
};

export default HeadlineInput;
