import { Args, ID, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { uuidSchema } from '@/common.schema';
import { ValidateArgs } from '@/zod-validation.decorator';
import type { Auth } from '../auth/auth';
import { ActivityModel } from './activity.model';
import { ActivityService, DEFAULT_ACTIVITY_PAGE_SIZE } from './activity.service';

@Resolver(() => ActivityModel)
export class ActivityResolver {
  constructor(private readonly activityService: ActivityService) {}

  @Query(() => [ActivityModel], { description: 'Recent activity in a project, newest first' })
  @ValidateArgs({ projectId: uuidSchema, after: uuidSchema.nullish() })
  activityByProjectId(
    @Session() session: UserSession<Auth>,
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('first', {
      type: () => Int,
      defaultValue: DEFAULT_ACTIVITY_PAGE_SIZE,
      description: 'Page size, at most 50.',
    })
    first: number,
    @Args('after', {
      type: () => ID,
      nullable: true,
      description: 'Id of the last activity of the previous page.',
    })
    after?: string | null,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return [];
    return this.activityService.getAllByProjectId(
      activeOrganizationId,
      session.user.id,
      projectId,
      {
        first,
        after,
      },
    );
  }

  @ResolveField(() => String)
  data(@Parent() activity: ActivityModel) {
    return JSON.stringify(activity.data);
  }
}
