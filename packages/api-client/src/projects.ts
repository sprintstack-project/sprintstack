import { useMutation } from 'urql';
import { CreateProjectMutation, ProjectsQuery } from './documents/projects';
import useRootQuery from './useRootQuery';

export const useCreateProject = () => useMutation(CreateProjectMutation);

/** The viewer's projects in their active organization, by name, for the project switcher. */
export const useProjects = () =>
  useRootQuery({
    query: ProjectsQuery,
    pause: typeof window === 'undefined',
  });
