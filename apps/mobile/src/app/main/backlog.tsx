import type Animated from 'react-native-reanimated';
import { useAnimatedRef } from 'react-native-reanimated';
import { Backlog } from '@/components/main/backlog';
import { MainScreen } from '@/components/main/main-screen';
import { NewItemFab } from '@/components/main/new-item-fab';

const BacklogPage = () => {
  // Shared so dragging an item near the screen's edges scrolls it.
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  return (
    <MainScreen scrollRef={scrollRef} fab={<NewItemFab />}>
      <Backlog scrollRef={scrollRef} />
    </MainScreen>
  );
};

export default BacklogPage;
