import { ProjectSettingsQuery } from './documents/project-settings';
import useRootQuery from './useRootQuery';

export const useGetProjectSettings = (projectId?: string) =>
  useRootQuery({
    query: ProjectSettingsQuery,
    variables: { projectId: projectId ?? '' },
    pause: !projectId,
  });
