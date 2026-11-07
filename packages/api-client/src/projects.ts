import { ProjectsQuery } from './documents/projects';
import useRootQuery from './useRootQuery';

/** The viewer's projects in their active organization, by name, for the project switcher. */
export const useProjects = () =>
  useRootQuery({
    query: ProjectsQuery,
    pause: typeof window === 'undefined',
  });
