import { Button } from '@sprintstack/ui';
import { Plus } from 'lucide-react-native';
import { MainScreen } from '@/components/main/main-screen';
import { Taskboard } from '@/components/main/taskboard';

const TaskboardPage = () => (
  <MainScreen
    fab={
      <Button variant="brand" size="lg" icon={Plus}>
        New item
      </Button>
    }
  >
    <Taskboard />
  </MainScreen>
);

export default TaskboardPage;
