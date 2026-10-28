import {
  type Option,
  Sidebar,
  type SidebarProject,
  type SidebarUser,
  Text,
  useSidebar,
} from '@sprintstack/ui';
import { type Href, Redirect, router, Tabs, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogOut, Moon, Sun } from 'lucide-react-native';
import { Image, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';
import { AppHeader } from '@/components/main/app-header';
import { SECTIONS } from '@/components/main/navigation';
import { TabBar } from '@/components/main/tab-bar';
import { authClient } from '@/lib/auth-client';
import { useTokenColor } from '@/lib/use-token-color';

interface Person {
  name: string;
  email: string;
  image?: string | null;
}

// Placeholder until projects come from the API (same as the web layout).
const projects: Option[] = [
  { value: 'pay', label: 'Payments', avatar: 'PAY', description: 'Scrum' },
  { value: 'ios', label: 'iOS app', avatar: 'IOS', description: 'Kanban' },
];

const signOut: Option = {
  value: 'sign-out',
  label: 'Sign out',
  icon: LogOut,
  danger: true,
  // The session hook in MainLayout sees the sign-out and redirects to sign-in.
  action: () => authClient.signOut(),
};

/** Phones navigate with the tab bar; tablets (the sidebar's non-drawer widths) with the sidebar. */
const Shell = ({ user }: { user: Person }) => {
  const { drawer } = useSidebar();
  const segments = useSegments();
  const canvas = useTokenColor('canvas');
  const { theme } = useUniwind();
  const dark = theme === 'dark';

  // Shared by the sidebar (tablets) and the header (phones).
  const project: SidebarProject = {
    code: 'PAY',
    name: 'Payments',
    meta: 'Scrum · 5 members',
    options: projects,
    value: 'pay',
    onValueChange: () => {},
  };
  const account: SidebarUser = {
    name: user.name,
    email: user.email,
    avatar: user.image ?? undefined,
    options: [
      // {
      //   value: 'theme',
      //   label: dark ? 'Light theme' : 'Dark theme',
      //   icon: dark ? Sun : Moon,
      //   action: () => Uniwind.setTheme(dark ? 'light' : 'dark'),
      // },
      signOut,
    ],
    searchable: false,
  };

  return (
    <View className="flex-1 flex-row bg-canvas">
      <StatusBar style={dark ? 'light' : 'dark'} />
      {!drawer && (
        <Sidebar.Root
          logo={
            <View className="flex-row items-baseline">
              <Text className="text-[2rem] leading-8 font-extrabold uppercase text-ink">
                SprintStack
              </Text>
              <Text className="text-brand-ink text-[3rem] leading-8 font-extrabold uppercase">
                .
              </Text>
            </View>
          }
          logoCollapsed={
            <Image
              source={require('@/assets/images/icon.png')}
              accessibilityLabel="SprintStack"
              className="size-8 rounded-lg"
            />
          }
          project={project}
          sections={SECTIONS}
          active={segments[1]}
          onNavigate={(item) => item.href && router.navigate(item.href as Href)}
          user={account}
        />
      )}
      <View className="flex-1">
        <AppHeader project={project} user={account} />
        <Tabs
          // Android's back retraces the tabs visited, so a page opened from More returns to it.
          backBehavior="history"
          screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: canvas } }}
          tabBar={(props) => (drawer ? <TabBar {...props} /> : null)}
        >
          {/* Only declared screens render: every sidebar item, Dashboard first, then More. */}
          {SECTIONS.flatMap((section) => section.items).map((item) => (
            <Tabs.Screen key={item.key} name={item.key} />
          ))}
          <Tabs.Screen name="more" />
        </Tabs>
      </View>
    </View>
  );
};

const MainLayout = () => {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return null;
  if (!session) return <Redirect href="/sign-in" />;

  return (
    <Sidebar.Provider>
      <Shell user={session.user} />
    </Sidebar.Provider>
  );
};

export default MainLayout;
