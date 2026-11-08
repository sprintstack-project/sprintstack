import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { GraphQLError } from 'graphql';
import { Auth } from '@/auth/auth';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { CreateProjectInput } from './projects.input';
import { ProjectModel } from './projects.model';
import { type CreateProject, createProjectSchema } from './projects.schema';
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

  @Mutation(() => ProjectModel, {
    description: 'Creates a project in the active organization, with the viewer as its admin.',
  })
  createProject(
    @Session() session: UserSession<Auth>,
    @Args('input', { type: () => CreateProjectInput }, new ZodValidationPipe(createProjectSchema))
    input: CreateProject,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) {
      throw new GraphQLError('Choose an organization first.', {
        extensions: { code: 'FORBIDDEN' },
      });
    }
    return this.projectsService.create(activeOrganizationId, session.user.id, input);
  }

  @Query(() => ProjectModel, {
    description: 'Get project by ID',
  })
  projectById(@Session() session: UserSession<Auth>, id: string) {
    if (!id) return null;
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) return null;
    return this.projectsService.getById(activeOrganizationId, id, session.user.id);
  }
}
