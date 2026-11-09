import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { ZodValidationPipe } from '@/zod-validation.pipe';
import type { Auth } from '../auth/auth';
import { AvatarUploadModel, MeModel, User } from './users.model';
import { avatarContentTypeSchema, jobTitleSchema, nameSchema } from './users.schema';
import { UsersService } from './users.service';

const MAX_PAGE = 50;

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], {
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

  @Query(() => [User], {
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

  @Query(() => MeModel, {
    description:
      "Get the current user. Doesn't need an active organization: someone who has signed up from an invite has none until they accept it.",
  })
  me(@Session() session: UserSession<Auth>) {
    return this.usersService.getCurrentUser(session.user.id);
  }

  @Mutation(() => AvatarUploadModel, {
    description: 'Starts a profile photo upload for the current user',
  })
  createAvatarUpload(
    @Session() session: UserSession<Auth>,
    @Args('contentType', { type: () => String }, new ZodValidationPipe(avatarContentTypeSchema))
    contentType: string,
  ) {
    return this.usersService.createAvatarUpload(session.user.id, contentType);
  }

  @Mutation(() => MeModel, {
    description:
      'Update the current user. Leave a field out to keep it; a null image or jobTitle clears it.',
  })
  updateMe(
    @Session() session: UserSession<Auth>,
    @Args('name', { type: () => String, nullable: true }, new ZodValidationPipe(nameSchema))
    name: string | null | undefined,
    @Args('jobTitle', { type: () => String, nullable: true }, new ZodValidationPipe(jobTitleSchema))
    jobTitle: string | null | undefined,
    @Args('image', { type: () => String, nullable: true, description: 'From createAvatarUpload.' })
    image: string | null | undefined,
  ) {
    return this.usersService.updateCurrentUser(session.user.id, {
      name,
      jobTitle,
      image,
    });
  }
}
