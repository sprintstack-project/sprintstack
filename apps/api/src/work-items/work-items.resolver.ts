import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { userIdSchema, uuidSchema } from '@/common.schema';
import type { Auth } from '../auth/auth';
import { ValidateArgs } from '../zod-validation.decorator';
import { CreateWorkItemInput, UpdateWorkItemInput } from './work-items.input';
import { AttachmentModel, CommentModel, WorkItemModel } from './work-items.model';
import {
  type CreateWorkItem,
  createWorkItemSchema,
  type UpdateWorkItem,
  updateWorkItemSchema,
} from './work-items.schema';
import { WorkItemsService } from './work-items.service';

@Resolver(() => WorkItemModel)
export class WorkItemsResolver {
  constructor(private readonly workItemsService: WorkItemsService) {}

  @Query(() => WorkItemModel, { description: 'Get a single work item', nullable: true })
  @ValidateArgs({ id: uuidSchema })
  workItemById(@Session() session: UserSession<Auth>, @Args('id', { type: () => ID }) id: string) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return null;
    return this.workItemsService.findById(activeOrganizationId, session.user.id, id);
  }

  @Query(() => [WorkItemModel], { description: 'Get all work items by project ID' })
  @ValidateArgs({ projectId: uuidSchema })
  workItemsByProjectId(
    @Session() session: UserSession<Auth>,
    @Args('projectId', { type: () => ID }) projectId: string,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return [];
    return this.workItemsService.getAllByProjectId(
      activeOrganizationId,
      session.user.id,
      projectId,
    );
  }

  @Query(() => [WorkItemModel], { description: 'Get all work items by sprint ID' })
  @ValidateArgs({ sprintId: uuidSchema })
  workItemsBySprintId(
    @Session() session: UserSession<Auth>,
    @Args('sprintId', { type: () => ID }) sprintId: string,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return [];
    return this.workItemsService.getAllBySprintId(activeOrganizationId, session.user.id, sprintId);
  }

  @Query(() => [WorkItemModel], { description: 'Get all work items in the backlog' })
  workItemsInBacklog(
    @Session() session: UserSession<Auth>,
    @Args('projectId', { type: () => ID }) projectId: string,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return [];
    return this.workItemsService.getAllInBacklog(activeOrganizationId, session.user.id, projectId);
  }

  @Query(() => [WorkItemModel], { description: 'Get all work items by assignee' })
  @ValidateArgs({ projectId: uuidSchema, userId: userIdSchema })
  workItemsByAssignee(
    @Session() session: UserSession<Auth>,
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('userId', { type: () => ID }) userId: string,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return [];
    return this.workItemsService.getAllByAssignee(
      activeOrganizationId,
      session.user.id,
      projectId,
      userId,
    );
  }

  @Query(() => [CommentModel], { description: 'Get all comments for a work item' })
  @ValidateArgs({ workItemId: uuidSchema })
  commentsByWorkItemId(
    @Session() session: UserSession<Auth>,
    @Args('workItemId', { type: () => ID }) workItemId: string,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return [];
    return this.workItemsService.getAllCommentsByWorkItemId(
      activeOrganizationId,
      session.user.id,
      workItemId,
    );
  }

  @Query(() => [AttachmentModel], { description: 'Get all attachments for a work item' })
  @ValidateArgs({ workItemId: uuidSchema })
  attachmentsByWorkItemId(
    @Session() session: UserSession<Auth>,
    @Args('workItemId', { type: () => ID }) workItemId: string,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return [];
    return this.workItemsService.getAllAttachmentsByWorkItemId(
      activeOrganizationId,
      session.user.id,
      workItemId,
    );
  }

  @ValidateArgs({ input: createWorkItemSchema })
  @Mutation(() => WorkItemModel, {
    description: 'Create a new work item. The viewer is the reporter; it goes last in its group.',
  })
  createWorkItem(
    @Session() session: UserSession<Auth>,
    @Args('input', { type: () => CreateWorkItemInput })
    input: CreateWorkItem,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return null;
    return this.workItemsService.create(activeOrganizationId, session.user.id, input);
  }

  @ValidateArgs({ input: updateWorkItemSchema })
  @Mutation(() => WorkItemModel, {
    description: 'Update an existing work item.',
  })
  updateWorkItem(
    @Session() session: UserSession<Auth>,
    @Args('input', { type: () => UpdateWorkItemInput })
    input: UpdateWorkItem,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return null;
    return this.workItemsService.update(activeOrganizationId, session.user.id, input);
  }

  @ResolveField(() => String)
  description(@Parent() workItem: WorkItemModel) {
    return JSON.stringify(workItem.description);
  }

  @ResolveField(() => String)
  criteria(@Parent() workItem: WorkItemModel) {
    return JSON.stringify(workItem.criteria);
  }
}

/** Field resolvers attach to the type their class resolves, so Comment's need their own class. */
@Resolver(() => CommentModel)
export class CommentsResolver {
  @ResolveField(() => String, { description: 'Tiptap JSON document, JSON-encoded.' })
  body(@Parent() comment: CommentModel) {
    return JSON.stringify(comment.body);
  }
}
