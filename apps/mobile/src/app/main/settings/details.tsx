import { MainScreen } from '@/components/main/main-screen';
import { SettingsSection } from '@/components/main/settings/split';

const DetailsPage = () => (
  <MainScreen>
    <SettingsSection section="settings/details" />
  </MainScreen>
);

export default DetailsPage;
