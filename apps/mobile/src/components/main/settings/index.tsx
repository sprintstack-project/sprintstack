import { scaled } from '@lib/scale';
import { Button, type SidebarItem, Text } from '@sprintstack/ui';
import { type Href, router } from 'expo-router';
import { ChevronRight, LogOut, Moon, Sun } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';
import { ADMIN_ITEMS, PROJECT_SETTINGS } from '@/components/main/navigation';
import { signOut } from '@/lib/restore-key';
import { useTokenColor } from '@/lib/use-token-color';
import { notificationsSummary, sprintsSummary, useSaved } from './data';
import { GroupTitle, Heading, Segmented } from './parts';

// Placeholders until teams, workflows and roles come from the API.
const ADMIN_SUMMARY: Record<string, string> = {
  team: '5 members, 1 invite pending',
  workflows: 'To do → In progress → In review → Done',
  users: 'Roles and access',
};

const themes = [
  { value: 'dark' as const, label: 'Dark', icon: Moon },
  { value: 'light' as const, label: 'Light', icon: Sun },
];

const Row = ({
  item,
  description,
  first,
}: {
  item: SidebarItem;
  description: string;
  first: boolean;
}) => {
  const ink = useTokenColor('ink');
  const muted = useTokenColor('ink-muted');
  const Icon = item.icon;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={item.label}
      accessibilityHint={description}
      onPress={() => item.href && router.navigate(item.href as Href)}
      className={`min-h-20 flex-row items-center gap-4 px-5 py-4 active:bg-surface-pressed ${first ? '' : 'border-t border-line'}`}
    >
      <View className="size-12 items-center justify-center rounded-xl bg-surface-muted">
        <Icon aria-hidden size={scaled(26)} strokeWidth={2} color={ink} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-[1.0625rem] leading-6 font-bold text-ink">{item.label}</Text>
        <Text className="text-[0.9375rem] leading-5 text-ink-muted">{description}</Text>
      </View>
      <ChevronRight aria-hidden size={scaled(22)} strokeWidth={2} color={muted} />
    </Pressable>
  );
};

const Group = ({
  title,
  rows,
}: {
  title: string;
  rows: { item: SidebarItem; description: string }[];
}) => (
  <View className="gap-3">
    <GroupTitle>{title}</GroupTitle>
    <View className="overflow-hidden rounded-3xl border border-line bg-surface">
      {rows.map((row, i) => (
        <Row key={row.item.key} item={row.item} description={row.description} first={i === 0} />
      ))}
    </View>
  </View>
);

/**
 * The Settings tab on phones: the project's settings, the pages without a tab, the theme and
 * sign-out. Tablets open the project's settings in two columns instead (SettingsSection).
 */
export const Settings = () => {
  const { theme } = useUniwind();
  const saved = useSaved();

  const projectSummary: Record<string, string> = {
    'settings/details': 'Name, key, icon and description',
    'settings/sprints': sprintsSummary(saved.sprints),
    'settings/notifications': notificationsSummary(saved.notifications),
  };

  return (
    <>
      <Heading eyebrow={`${saved.details.name} · ${saved.details.key}`} title="Settings" />
      <Group
        title="Project"
        rows={PROJECT_SETTINGS.map((item) => ({ item, description: projectSummary[item.key] }))}
      />
      <Group
        title="Administration"
        rows={ADMIN_ITEMS.map((item) => ({ item, description: ADMIN_SUMMARY[item.key] }))}
      />
      <View className="gap-3">
        <GroupTitle>Appearance</GroupTitle>
        <Segmented
          label="Theme"
          choices={themes}
          value={theme === 'dark' ? 'dark' : 'light'}
          onChange={(next) => Uniwind.setTheme(next)}
        />
      </View>
      {/* The session hook in MainLayout sees the sign-out and redirects to sign-in. */}
      <Button variant="secondary" size="lg" icon={LogOut} block onClick={() => signOut()}>
        Log out
      </Button>
    </>
  );
};
