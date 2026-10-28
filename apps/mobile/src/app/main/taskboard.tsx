import { useState } from 'react';
import { MainScreen } from '@/components/main/main-screen';
import { NewItemFab } from '@/components/main/new-item-fab';
import { toPlannedItem } from '@/components/main/new-work-item/data';
import { Taskboard } from '@/components/main/taskboard';
import { WORK_ITEMS } from '@/components/main/taskboard/data';

const TaskboardPage = () => {
  // Every sprint shows the same placeholder items until the API is wired up.
  const [items, setItems] = useState(WORK_ITEMS);
  return (
    <MainScreen
      fab={
        <NewItemFab
          onCreate={(item) =>
            setItems((all) => [
              toPlannedItem(
                item,
                all.map((i) => i.key),
              ),
              ...all,
            ])
          }
        />
      }
    >
      <Taskboard items={items} onItemsChange={setItems} />
    </MainScreen>
  );
};

export default TaskboardPage;
