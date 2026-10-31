import { scaled } from '@lib/scale';
import { type IconComponent, Switch, Text, useSidebar } from '@sprintstack/ui';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useTokenColor } from '@/lib/use-token-color';

/** The overline and headline at the top of a settings screen. */
export const Heading = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <View>
    <Text className="text-sm font-bold uppercase text-ink-muted">{eyebrow}</Text>
    <Text
      accessibilityRole="header"
      className="text-4xl leading-14 font-extrabold uppercase text-ink"
    >
      {title}
    </Text>
  </View>
);

/** A group's overline, e.g. "Administration". */
export const GroupTitle = ({ children }: { children: string }) => (
  <Text
    accessibilityRole="header"
    className="text-[0.8125rem] leading-4 font-bold uppercase tracking-[.4px] text-ink-muted"
  >
    {children}
  </Text>
);

interface Choice<V> {
  value: V;
  label: string;
  icon?: IconComponent;
}

const SegmentedOption = ({
  label,
  icon: Icon,
  selected,
  onPress,
}: {
  label: string;
  icon?: IconComponent;
  selected: boolean;
  onPress: () => void;
}) => {
  const color = useTokenColor(selected ? 'on-ink' : 'ink');
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      className={`h-12 flex-1 flex-row items-center justify-center gap-2 rounded-full ${selected ? 'bg-ink' : 'active:bg-surface-pressed'}`}
    >
      {Icon && <Icon aria-hidden size={scaled(22)} strokeWidth={2} color={color} />}
      <Text
        className={`text-[1.0625rem] leading-5 font-extrabold ${selected ? 'text-on-ink' : 'text-ink'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
};

/** A row of options in a grey track, the chosen one filled with ink. */
export const Segmented = <V extends string>({
  label,
  choices,
  value,
  onChange,
}: {
  label: string;
  choices: Choice<V>[];
  value: V;
  onChange: (value: V) => void;
}) => (
  <View
    accessibilityRole="radiogroup"
    accessibilityLabel={label}
    className="flex-row rounded-full bg-surface-muted p-1"
  >
    {choices.map((choice) => (
      <SegmentedOption
        key={choice.value}
        label={choice.label}
        icon={choice.icon}
        selected={value === choice.value}
        onPress={() => onChange(choice.value)}
      />
    ))}
  </View>
);

/** A setting that's on or off: its title and what it does, the switch on the right. */
export const ToggleRow = ({
  title,
  description,
  checked,
  onCheckedChange,
  children,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** More of the setting under the description, e.g. who it notifies. */
  children?: ReactNode;
}) => (
  <View className="gap-3 border-t border-line py-5">
    <View className="flex-row items-start gap-4">
      <View className="flex-1 gap-1">
        <Text className="text-[1.0625rem] leading-6 font-bold text-ink">{title}</Text>
        <Text className="text-[0.9375rem] leading-5 text-ink-muted">{description}</Text>
      </View>
      <Switch label={title} checked={checked} onCheckedChange={onCheckedChange} />
    </View>
    {children}
  </View>
);

/** A field's label where the control isn't a `Field` (a picker built from buttons). */
export const Label = ({ children }: { children: string }) => (
  <Text className="text-[1.0625rem] leading-5.5 font-bold text-ink">{children}</Text>
);

/**
 * A section's fields. Tablets frame them in a card under the section's headline, beside the
 * section list; phones name the section in the header, so they show just the fields (and the
 * description where it's needed, `phoneDescription`).
 */
export const Panel = ({
  title,
  description,
  phoneDescription,
  children,
}: {
  title: string;
  description: string;
  phoneDescription?: boolean;
  children: ReactNode;
}) => {
  const { drawer } = useSidebar();
  if (drawer) {
    return (
      <>
        {phoneDescription && (
          <Text className="text-[1.0625rem] leading-6 text-ink-muted">{description}</Text>
        )}
        {children}
      </>
    );
  }
  return (
    <View className="gap-6 rounded-3xl border border-line bg-surface p-8">
      <View className="gap-2">
        <Text accessibilityRole="header" className="text-headline uppercase text-ink">
          {title}
        </Text>
        <Text className="text-[1.0625rem] leading-6 text-ink-muted">{description}</Text>
      </View>
      {children}
    </View>
  );
};
