import { redirect } from 'next/navigation';

/** Opens on the first section. */
const ProjectSettingsPage = () => {
  redirect('/project-settings/details');
};

export default ProjectSettingsPage;
