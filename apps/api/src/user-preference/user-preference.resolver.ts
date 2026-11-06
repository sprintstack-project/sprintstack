import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import type { Auth } from '@/auth/auth';
import {
  CreateUserPreferenceInput,
  UpdateUserPreferenceInput,
  UserPreference,
} from './user-preference.model';
import { UserPreferenceService } from './user-preference.service';

@Resolver(() => UserPreference)
export class UserPreferenceResolver {
  constructor(private readonly userPreferenceService: UserPreferenceService) {}

  @Query(() => UserPreference)
  async getUserPreferences(
    @Session() session: UserSession<Auth>,
    @Args('projectId') projectId: string,
  ) {
    const { activeOrganizationId, userId } = session.session;
    if (!activeOrganizationId) throw new Error('No active organization');

    console.log(
      'Fetching user preferences for user:',
      userId,
      'project:',
      projectId,
      activeOrganizationId,
    );
    return this.userPreferenceService.getUserPreferences(userId, projectId);
  }

  @Mutation(() => UserPreference)
  createUserPreferences(
    @Session() session: UserSession<Auth>,
    @Args('projectId') projectId: string,
    @Args('data', { type: () => CreateUserPreferenceInput }) data: CreateUserPreferenceInput,
  ) {
    const { activeOrganizationId, userId } = session.session;
    if (!activeOrganizationId) throw new Error('No active organization');

    return this.userPreferenceService.createUserPreferences({ ...data, userId, projectId });
  }

  @Mutation(() => UserPreference)
  updateUserPreferences(
    @Session() session: UserSession<Auth>,
    @Args('projectId') projectId: string,
    @Args('data', { type: () => UpdateUserPreferenceInput }) data: UpdateUserPreferenceInput,
  ) {
    const { activeOrganizationId, userId } = session.session;
    if (!activeOrganizationId) throw new Error('No active organization');

    return this.userPreferenceService.updateUserPreferences(userId, projectId, data);
  }
}
