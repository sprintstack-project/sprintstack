// Project documents, apart from the hooks so Server Components can import them.
import { graphql, type ResultOf } from '../graphql';

export const WorkItemsByProjectIdQuery = graphql(`
  query WorkItemsByProjectId ($projectId: ID!) {
      workItemsByProjectId(projectId: $projectId) {
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
    }
`);

export const CreateWorkItemMutation = graphql(`
  mutation CreateWorkItem ($atRisk: Boolean, $assigneeId: ID, $criteria: String, $description: String, $parentId: ID, $points: Int, $priority: Int, $projectId: ID, $sprintId: ID, $startDate: String, $status: String, $tags: [String!], $targetDate: String, $title: String, $type: String) {
    createWorkItem(atRisk: $atRisk
            assigneeId: $assigneeId
            criteria: $criteria
            description: $description
            parentId: $parentId
            points: $points
            priority: $priority
            projectId: $projectId
            sprintId: $sprintId
            startDate: $startDate
            status: $status
            tags: $tags
            targetDate: $targetDate
            title: $title
            type: $type) {
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
  }
`);

export const WorkItemsByAssigneeQuery =
  graphql(`query WorkItemsByAssignee($userId: ID!, $projectId: ID!) {
    workItemsByAssignee(
        projectId: $projectId
        userId: $userId
    ) {
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
}`);

export type Project = ResultOf<typeof WorkItemsByProjectIdQuery>['workItemsByProjectId'][number];
export type WorkItem = ResultOf<typeof WorkItemsByAssigneeQuery>['workItemsByAssignee'][number];
