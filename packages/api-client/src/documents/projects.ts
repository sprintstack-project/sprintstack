// Project documents, apart from the hooks so Server Components can import them.
import { graphql, type ResultOf } from '../graphql';

export const ProjectsQuery = graphql(`
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
