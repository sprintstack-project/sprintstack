import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import type { Auth } from '../auth/auth';
import { UserSummaryModel } from './user-summary.model';
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
}
