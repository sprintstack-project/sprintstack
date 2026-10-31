import { useSidebar } from '@sprintstack/ui';
import { MainScreen } from '@/components/main/main-screen';
import { Settings } from '@/components/main/settings';
import { SettingsSection } from '@/components/main/settings/split';

// Phones list everything under Settings; tablets open the first project setting, as web does.
const SettingsPage = () => {
  const { drawer } = useSidebar();
  return (
    <MainScreen>
      {drawer ? <Settings /> : <SettingsSection section="settings/details" />}
    </MainScreen>
  );
};

export default SettingsPage;
