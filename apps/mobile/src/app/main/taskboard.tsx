import { MainScreen } from '@/components/main/main-screen';
import { NewItemFab } from '@/components/main/new-item-fab';
import { Taskboard } from '@/components/main/taskboard';

const TaskboardPage = () => (
  <MainScreen fab={<NewItemFab />}>
    <Taskboard />
  </MainScreen>
);

export default TaskboardPage;
