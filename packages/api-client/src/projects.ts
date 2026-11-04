import { graphql, type ResultOf } from './graphql';
import useRootQuery from './useRootQuery';

const ProjectsQuery = graphql(`
  query Projects {
    projects {
      id
      key
      name
      description
      methodology
      memberCount
    }
  }
`);

export type Project = ResultOf<typeof ProjectsQuery>['projects'][number];

/** The viewer's projects in their active organization, by name, for the project switcher. */
export const useProjects = () =>
  useRootQuery({
    query: ProjectsQuery,
    pause: typeof window === 'undefined',
  });
