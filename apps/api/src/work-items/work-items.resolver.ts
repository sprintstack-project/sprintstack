import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import type { Auth } from '../auth/auth';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { CreateWorkItemInput } from './work-items.input';
import { WorkItemModel } from './work-items.model';
import { type CreateWorkItem, createWorkItemSchema } from './work-items.schema';
import { WorkItemsService } from './work-items.service';

@Resolver(() => WorkItemModel)
export class WorkItemsResolver {
  constructor(private readonly workItemsService: WorkItemsService) {}

  @Query(() => WorkItemModel, { description: 'Get a single work item', nullable: true })
  workItemById(@Session() session: UserSession<Auth>, @Args('id', { type: () => ID }) id: string) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return null;
    return this.workItemsService.findById(activeOrganizationId, session.user.id, id);
  }

  @Query(() => [WorkItemModel], { description: 'Get all work items by project ID' })
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

  @Mutation(() => WorkItemModel, {
    description: 'Create a new work item. The viewer is the reporter; it goes last in its group.',
  })
  createWorkItem(
    @Session() session: UserSession<Auth>,
    @Args('input', { type: () => CreateWorkItemInput }, new ZodValidationPipe(createWorkItemSchema))
    input: CreateWorkItem,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return null;
    return this.workItemsService.create(activeOrganizationId, session.user.id, input);
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
