// Project documents, apart from the hooks so Server Components can import them.
import { graphql, type ResultOf } from '../graphql';

export const WorkItemFields = graphql(`
  fragment WorkItemFields on WorkItem @_unmask {
    assigneeId
    atRisk
    completedAt
    createdAt
    criteria
    description
    id
    number
    parentId
    points
    priority
    projectId
    rank
    reporterId
    sprintId
    startDate
    status
    tags
    targetDate
    title
    type
    updatedAt
  }
`);

export const WorkItemsByProjectIdQuery = graphql(
  `query WorkItemsByProjectId ($projectId: ID!) {
      workItemsByProjectId(projectId: $projectId) {
          ...WorkItemFields
      }
    }
`,
  [WorkItemFields],
);

export const CreateWorkItemMutation = graphql(
  `mutation CreateWorkItem($input: CreateWorkItemInput!) {
    createWorkItem(input: $input) {
        ...WorkItemFields
    }
  }
`,
  [WorkItemFields],
);

export const UpdateWorkItemMutation = graphql(
  `mutation UpdateWorkItem($input: UpdateWorkItemInput!) {
    updateWorkItem(input: $input) {
        ...WorkItemFields
    }
  }
`,
  [WorkItemFields],
);

export const WorkItemsByAssigneeQuery = graphql(
  `query WorkItemsByAssignee($userId: ID!, $projectId: ID!) {
    workItemsByAssignee(
        projectId: $projectId
        userId: $userId
    ) {
        ...WorkItemFields
    }
  }
`,
  [WorkItemFields],
);

export const WorkItemsBySprintIdQuery = graphql(
  `
  query WorkItemsBySprintId($sprintId: ID!) {
    workItemsBySprintId(sprintId: $sprintId) {
        ...WorkItemFields
    }
  }
`,
  [WorkItemFields],
);

export const WorkItemsInBacklogQuery = graphql(
  `
  query WorkItemsInBacklog($projectId: ID!) {
    workItemsInBacklog(projectId: $projectId) {
        ...WorkItemFields
    }
  }
`,
  [WorkItemFields],
);

export type WorkItem = ResultOf<typeof WorkItemsByProjectIdQuery>['workItemsByProjectId'][number];
