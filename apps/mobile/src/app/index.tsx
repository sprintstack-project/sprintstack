import { Button, Text } from '@sprintstack/ui';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { authClient } from '@/lib/auth-client';

const Index = () => {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return null;
  if (!session) return <Redirect href="/sign-in" />;

  // Placeholder home until the real one exists; signing out clears the session and the redirect
  // above takes over.
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-canvas px-6">
      <Text className="text-body text-ink">Signed in as {session.user.email}</Text>
      <Button variant="secondary" onClick={() => authClient.signOut()}>
        Sign out
      </Button>
    </View>
  );
};

export default Index;
