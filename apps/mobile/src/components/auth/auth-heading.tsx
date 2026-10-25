import { Text } from '@sprintstack/ui';
import type { ReactNode } from 'react';
import { View } from 'react-native';

/** Eyebrow, a two-tone headline ("Welcome" / "back."), and a lead paragraph. */
export const AuthHeading = ({
  eyebrow,
  title,
  accent,
  children,
}: {
  eyebrow?: string;
  title: string;
  /** The headline's last line, in brand colour. */
  accent?: string;
  children?: ReactNode;
}) => {
  return (
    <View className="gap-2">
      {eyebrow && (
        <Text className="text-[0.8125rem] leading-4 font-bold uppercase tracking-[.4px] text-ink-muted">
          {eyebrow}
        </Text>
      )}
      <Text className="text-[2.75rem] leading-[2.625rem] font-extrabold uppercase text-ink">
        {title}
        {accent && (
          <Text className="text-[2.75rem] leading-[2.625rem] font-extrabold uppercase text-brand-ink">
            {`\n${accent}`}
          </Text>
        )}
      </Text>
      {children && (
        <Text className="text-[1.0625rem] leading-6 font-semibold text-ink-muted">{children}</Text>
      )}
    </View>
  );
};

/** Inline link text (inside a paragraph or on its own). */
export const TextLink = ({ children, onPress }: { children: string; onPress: () => void }) => {
  return (
    <Text
      accessibilityRole="link"
      onPress={onPress}
      className="text-[1rem] leading-5 font-extrabold text-brand-ink underline"
    >
      {children}
    </Text>
  );
};
