import { useState } from 'react';
import type Animated from 'react-native-reanimated';
import { useAnimatedRef } from 'react-native-reanimated';
import { Backlog } from '@/components/main/backlog';
import { PLANNED_ITEMS } from '@/components/main/backlog/data';
import { MainScreen } from '@/components/main/main-screen';
import { NewItemFab } from '@/components/main/new-item-fab';
import { toPlannedItem } from '@/components/main/new-work-item/data';

const BacklogPage = () => {
  // Shared so dragging an item near the screen's edges scrolls it.
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const [items, setItems] = useState(PLANNED_ITEMS);
  return (
    <MainScreen
      scrollRef={scrollRef}
      fab={
        <NewItemFab
          onCreate={(item) =>
            setItems((all) => [
              ...all,
              toPlannedItem(
                item,
                all.map((i) => i.key),
              ),
            ])
          }
        />
      }
    >
      <Backlog scrollRef={scrollRef} items={items} onItemsChange={setItems} />
    </MainScreen>
  );
};

export default BacklogPage;
