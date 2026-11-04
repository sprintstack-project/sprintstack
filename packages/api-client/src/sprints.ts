import { graphql, type ResultOf } from './graphql';
import useRootQuery from './useRootQuery';

const SprintFields = graphql(`
    fragment SprintFields on Sprint @_unmask {
        endDate
        goal
        id
        name
        startDate
        state
    }
`);

export type Sprint = ResultOf<typeof SprintFields>;

const SprintsQuery = graphql(
  `
    query Sprints($projectId: ID!) {
        sprints(projectId: $projectId) {
            ...SprintFields
        }
    }`,
  [SprintFields],
);

const SprintByIdQuery = graphql(
  `
    query SprintById($id: ID!) {
      sprint(id: $id) {
        ...SprintFields
      }
    }
  `,
  [SprintFields],
);

const CurrentSprintQuery = graphql(
  `
    query CurrentSprint($projectId: ID!) {
      currentSprint(projectId: $projectId) {
        ...SprintFields
      }
    }
  `,
  [SprintFields],
);

export const useGetAllSprints = (projectId: string) =>
  useRootQuery({
    query: SprintsQuery,
    variables: { projectId },
  });

export const useGetSprintById = (id: string) =>
  useRootQuery({
    query: SprintByIdQuery,
    variables: { id },
  });

export const useGetCurrentSprint = (projectId: string) =>
  useRootQuery({
    query: CurrentSprintQuery,
    variables: { projectId },
  });
