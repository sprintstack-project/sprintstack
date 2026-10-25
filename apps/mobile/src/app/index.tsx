import { Text } from '@sprintstack/ui';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { authClient } from '@/lib/auth-client';

const Index = () => {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return null;
  if (!session) return <Redirect href="/sign-in" />;

  return (
    <View className="flex-1 items-center justify-center bg-canvas">
      <Text className="text-body text-ink">Edit src/app/index.tsx to edit this screen.</Text>
    </View>
  );
};

export default Index;
