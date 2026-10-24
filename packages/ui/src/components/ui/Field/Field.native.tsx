import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import type { FieldProps } from '@ui/types';
import { CircleAlert } from 'lucide-react-native';
import { createContext, useContext, useId } from 'react';
import { Text, View } from 'react-native';

interface FieldContextValue {
  labelId: string;
  label: string;
  /** Read out after the label: the error when there is one, else the description. */
  hint?: string;
  invalid: boolean;
}

// Native counterpart of Base UI's Field context: controls read their label and state from it.
const FieldContext = createContext<FieldContextValue | null>(null);

export function useField() {
  return useContext(FieldContext);
}

export function Field({ label, description, error, required, children }: FieldProps) {
  const labelId = useId();
  const errorColor = useTokenColor('brand-ink');
  const invalid = Boolean(error);

  return (
    <FieldContext.Provider value={{ labelId, label, hint: error ?? description, invalid }}>
      <View className="min-w-0 gap-2">
        <Text nativeID={labelId} className="text-[1.0625rem] leading-[1.375rem] font-bold text-ink">
          {label}
          {required && (
            <Text aria-hidden className="text-brand-ink">
              {' *'}
            </Text>
          )}
        </Text>
        {children}
        {/* The error replaces the helper text rather than stacking under it. */}
        {invalid ? (
          <View accessibilityLiveRegion="polite" className="flex-row items-center gap-1">
            <CircleAlert aria-hidden size={scaled(18)} strokeWidth={2} color={errorColor} />
            <Text className="text-meta font-bold text-brand-ink">{error}</Text>
          </View>
        ) : (
          description && (
            <Text className="text-meta font-semibold text-ink-muted">{description}</Text>
          )
        )}
      </View>
    </FieldContext.Provider>
  );
}
