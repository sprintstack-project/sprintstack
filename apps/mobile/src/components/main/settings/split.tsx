import { scaled } from '@lib/scale';
import { Text, useSidebar } from '@sprintstack/ui';
import { type Href, router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { PROJECT_SETTINGS } from '@/components/main/navigation';
import { useTokenColor } from '@/lib/use-token-color';
import { useSaved } from './data';
import { Details } from './details';
import { Notifications } from './notifications';
import { Sprints } from './sprints';

// What each section holds, under its name in the tablet's section list (as on web).
const SECTIONS: Record<string, { description: string; content: ReactNode }> = {
  'settings/details': { description: 'Name, key and description', content: <Details /> },
  'settings/sprints': { description: 'Length and start day', content: <Sprints /> },
  'settings/notifications': {
    description: 'Who hears about what',
    content: <Notifications />,
  },
};

export type SettingsSectionKey = keyof typeof SECTIONS;

const NavItem = ({
  item,
  current,
}: {
  item: (typeof PROJECT_SETTINGS)[number];
  current: boolean;
}) => {
  const color = useTokenColor(current ? 'on-ink' : 'ink');
  const Icon = item.icon;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={item.label}
      accessibilityHint={SECTIONS[item.key].description}
      accessibilityState={{ selected: current }}
      onPress={() => !current && item.href && router.navigate(item.href as Href)}
      className={`flex-row items-center gap-4 rounded-2xl px-5 py-3.5 ${current ? 'bg-ink' : 'active:bg-surface-pressed'}`}
    >
      <Icon aria-hidden size={scaled(24)} strokeWidth={2} color={color} />
      <View className="flex-1">
        <Text
          className={`text-[1.0625rem] leading-6 font-bold ${current ? 'text-on-ink' : 'text-ink'}`}
        >
          {item.label}
        </Text>
        <Text className={`text-meta ${current ? 'text-on-ink' : 'text-ink-muted'}`}>
          {SECTIONS[item.key].description}
        </Text>
      </View>
    </Pressable>
  );
};

/**
 * One project setting. Tablets lay it out like web: the page heading, then the section list
 * beside the open section. Phones reach each section from the Settings tab, so they show it alone.
 */
export const SettingsSection = ({ section }: { section: SettingsSectionKey }) => {
  const { drawer } = useSidebar();
  const { details } = useSaved();
  if (drawer) return SECTIONS[section].content;

  return (
    <>
      <View>
        <Text className="text-sm font-bold uppercase text-ink-muted">
          {details.name} · {details.key}
        </Text>
        <Text
          accessibilityRole="header"
          className="text-4xl leading-14 font-extrabold uppercase text-ink"
        >
          Project{' '}
          <Text className="text-4xl leading-14 font-extrabold uppercase text-brand-ink">
            settings
          </Text>
        </Text>
      </View>
      <View className="flex-row items-start gap-6">
        <View
          accessibilityLabel="Project settings"
          className="w-72 gap-1 rounded-3xl border border-line bg-surface p-2"
        >
          {PROJECT_SETTINGS.map((item) => (
            <NavItem key={item.key} item={item} current={item.key === section} />
          ))}
        </View>
        {/* Keyed so switching sections starts each form from what was saved. */}
        <View key={section} className="min-w-0 flex-1 gap-6">
          {SECTIONS[section].content}
        </View>
      </View>
    </>
  );
};
