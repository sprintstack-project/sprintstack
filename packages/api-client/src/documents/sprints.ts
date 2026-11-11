// Sprint documents, apart from the hooks so Server Components can import them.
import { graphql, type ResultOf } from '../graphql';

export const SprintFields = graphql(`
    fragment SprintFields on Sprint @_unmask {
        endDate
        goal
        id
        name
        startDate
        state
        capacity
    }
`);

export type Sprint = ResultOf<typeof SprintFields>;

export const SprintsQuery = graphql(
  `
    query Sprints($projectId: ID!) {
        sprints(projectId: $projectId) {
            ...SprintFields
        }
    }`,
  [SprintFields],
);

export const SprintByIdQuery = graphql(
  `
    query SprintById($id: ID!) {
      sprint(id: $id) {
        ...SprintFields
      }
    }
  `,
  [SprintFields],
);

export const CurrentSprintQuery = graphql(
  `
    query CurrentSprint($projectId: ID!) {
      currentSprint(projectId: $projectId) {
        ...SprintFields
      }
    }
  `,
  [SprintFields],
);

export const CreateSprintMutation = graphql(
  `mutation CreateSprint($endDate: DateTime!, $name: String!, $projectId: ID!, $startDate: DateTime!) {
    createSprint(endDate: $endDate, name: $name, projectId: $projectId, startDate: $startDate) {
        ...SprintFields
    }
  }
  `,
  [SprintFields],
);
