import { Controller, Get } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

/** The signed-in user. Protected by the global AuthGuard, like every route without @AllowAnonymous. */
@Controller('me')
export class MeController {
  @Get()
  me(@Session() session: UserSession) {
    return { user: session.user };
  }
}
