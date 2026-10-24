import { scaled } from '@lib/scale';
import { useTokenColor } from '@lib/use-token-color.native';
import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

/** The search pill at the top of a select sheet (searchable Select, MultiSelect). */
export function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
        autoCapitalize="none"
        className="h-12 flex-1 text-[1.0625rem] text-ink"
        placeholderTextColorClassName="accent-ink-placeholder"
        cursorColorClassName="accent-ink"
      />
    </View>
  );
}
