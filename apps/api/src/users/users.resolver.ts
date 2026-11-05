import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import type { Auth } from '../auth/auth';
import { UserSummaryModel } from './users.model';
import { UsersService } from './users.service';

const MAX_PAGE = 50;

@Resolver(() => UserSummaryModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserSummaryModel], {
    description: 'People in the active organization, e.g. for @mentions. Matches name or email.',
  })
  users(
    @Session() session: UserSession<Auth>,
    @Args('search', { type: () => String, nullable: true }) search: string | null,
    @Args('first', { type: () => Int, defaultValue: 20 }) first: number,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return [];
    return this.usersService.search(activeOrganizationId, {
      search,
      first: Math.min(Math.max(first, 1), MAX_PAGE),
    });
  }

  @Query(() => [UserSummaryModel], {
    description: 'Members of a project in the active organization, by name.',
  })
  usersByProject(
    @Session() session: UserSession<Auth>,
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('first', { type: () => Int, defaultValue: 20 }) first: number,
    @Args('after', { type: () => ID, nullable: true, description: 'The last id already shown.' })
    after?: string | null,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return [];
    return this.usersService.getByProject(activeOrganizationId, {
      projectId,
      first: Math.min(Math.max(first, 1), MAX_PAGE),
      after,
    });
  }

  @Query(() => UserSummaryModel, {
    description: 'Get the current user in the active organization',
  })
  me(@Session() session: UserSession<Auth>) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return null;
    return this.usersService.getCurrentUser(activeOrganizationId, session.user.id);
  }

  @Mutation(() => UserSummaryModel, {
    description: 'Update the current user in the active organization',
  })
  updateMe(
    @Session() session: UserSession<Auth>,
    @Args('name', { type: () => String, nullable: true }) name: string | null,
    @Args('email', { type: () => String, nullable: true }) email: string | null,
    @Args('image', { type: () => String, nullable: true }) image: string | null,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return null;
    return this.usersService.updateCurrentUser(activeOrganizationId, session.user.id, {
      name,
      email,
      image,
    });
  }
}
