import { MainScreen } from '@/components/main/main-screen';
import { NewItemFab } from '@/components/main/new-item-fab';
import { Timeline } from '@/components/main/timeline';

const TimelinePage = () => (
  <MainScreen fab={<NewItemFab label="New epic" />}>
    <Timeline />
  </MainScreen>
);

export default TimelinePage;
