import { Query, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import type { Auth } from './auth';
import { UserModel } from './user.model';

/** The signed-in user. Protected by the global AuthGuard, like every resolver without @AllowAnonymous. */
@Resolver(() => UserModel)
export class ViewerResolver {
  @Query(() => UserModel)
  viewer(@Session() session: UserSession<Auth>): UserModel {
    const { user } = session;
    return { ...user, twoFactorEnabled: Boolean(user.twoFactorEnabled) };
  }
}
