import { useQuery } from 'urql';
import { graphql, type ResultOf } from './graphql';

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
export const useProjects = () => {
  // Paused during Next's server render, like the bell: there's no session there.
  const [{ data, fetching, error }] = useQuery({
    query: ProjectsQuery,
    pause: typeof window === 'undefined',
  });
  return { projects: data?.projects ?? [], fetching, error };
};
