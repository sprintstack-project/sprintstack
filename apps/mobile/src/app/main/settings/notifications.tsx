import { MainScreen } from '@/components/main/main-screen';
import { SettingsSection } from '@/components/main/settings/split';

const NotificationsPage = () => (
  <MainScreen>
    <SettingsSection section="settings/notifications" />
  </MainScreen>
);

export default NotificationsPage;
