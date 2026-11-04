import { Query, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import type { Auth } from '../auth/auth';
import { ProjectModel } from './project.model';
import { ProjectsService } from './projects.service';

@Resolver(() => ProjectModel)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [ProjectModel], {
    description: 'The viewer’s projects in the active organization, for the project switcher.',
  })
  projects(@Session() session: UserSession<Auth>) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return [];
    return this.projectsService.listFor(activeOrganizationId, session.user.id);
  }
}
