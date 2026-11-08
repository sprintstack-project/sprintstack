import { useGetMe } from '@sprintstack/api-client/users';
import { useProjectSwitcher } from '@sprintstack/shared/hooks/main/use-project-switcher';
import Sidebar, { useSidebar } from '@ui/sidebar';
import Text from '@ui/text';
import type { Option, SidebarUser } from '@ui/types';
import { type Href, Redirect, router, Tabs, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogOut, UserRound } from 'lucide-react-native';
import { useEffect } from 'react';
import { Image, View } from 'react-native';
import { useUniwind } from 'uniwind';
import { AppHeader } from '@/components/main/app-header';
import { PROFILE, PROJECT_SETTINGS, SECTIONS } from '@/components/main/navigation';
import { TabBar } from '@/components/main/tab-bar';
import { authClient } from '@/lib/auth-client';
import { signOut, syncRestoreKey } from '@/lib/restore-key';
import { useTokenColor } from '@/lib/use-token-color';
import ProjectProvider, { useProjectContext } from '@/providers/main/project';

interface Person {
  name: string;
  email: string;
  image?: string | null;
}

const signOutOption: Option = {
  value: 'sign-out',
  label: 'Sign out',
  icon: LogOut,
  danger: true,
  // The session hook in MainLayout sees the sign-out and redirects to sign-in.
  action: () => signOut(),
};

/** Phones navigate with the tab bar; tablets (the sidebar's non-drawer widths) with the sidebar. */
const Shell = ({ user }: { user: Person }) => {
  const { drawer } = useSidebar();
  const segments = useSegments();
  const canvas = useTokenColor('canvas');
  const { theme } = useUniwind();
  const dark = theme === 'dark';
  const { data: me } = useGetMe();

  // Shared by the sidebar (tablets) and the header (phones).
  const { projectId, setProjectId } = useProjectContext();
  const { switcher } = useProjectSwitcher({ selectedId: projectId, onSelect: setProjectId });

  const account: SidebarUser = {
    // me follows profile edits; the session keeps the name from sign-in.
    name: me?.name ?? user.name,
    email: user.email,
    avatar: me?.image ?? undefined,
    options: [
      // {
      //   value: 'theme',
      //   label: dark ? 'Light theme' : 'Dark theme',
      //   icon: dark ? Sun : Moon,
      //   action: () => Uniwind.setTheme(dark ? 'light' : 'dark'),
      // },
      {
        value: 'profile',
        label: 'Profile',
        icon: UserRound,
        action: () => router.navigate('/main/profile' as Href),
      },
      signOutOption,
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
          project={switcher}
          sections={SECTIONS}
          active={segments[1]}
          onNavigate={(item) => item.href && router.navigate(item.href as Href)}
          user={account}
        />
      )}
      <View className="flex-1">
        <AppHeader project={switcher} user={account} />
        <Tabs
          // Android's back retraces the tabs visited, so a page opened from Settings returns to it.
          backBehavior="history"
          screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: canvas } }}
          tabBar={(props) => (drawer ? <TabBar {...props} /> : null)}
        >
          {/* Only declared screens render: every sidebar item (Dashboard first), then Settings' pages and Profile. */}
          {[...SECTIONS.flatMap((section) => section.items), ...PROJECT_SETTINGS, PROFILE].map(
            (item) => (
              <Tabs.Screen key={item.key} name={item.key} />
            ),
          )}
        </Tabs>
      </View>
    </View>
  );
};

const MainLayout = () => {
  const { data: session, isPending } = authClient.useSession();
  const sessionId = session?.session.id;

  // Lets a new Android phone sign in without asking (Google Play's zero-tap sign-in restoration).
  useEffect(() => {
    if (sessionId) syncRestoreKey(sessionId);
  }, [sessionId]);

  if (isPending) return null;
  if (!session) return <Redirect href="/sign-in" />;

  return (
    <ProjectProvider>
      <Sidebar.Provider>
        <Shell user={session.user} />
      </Sidebar.Provider>
    </ProjectProvider>
  );
};

export default MainLayout;
