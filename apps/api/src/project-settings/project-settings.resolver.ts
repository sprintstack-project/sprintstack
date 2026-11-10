import { Args, Query, Resolver } from '@nestjs/graphql';
import { z } from 'zod';
import { ValidateArgs } from '@/zod-validation.decorator';
import { ProjectSettingsModel } from './project-settings.model';
import { ProjectSettingsService } from './project-settings.service';

@Resolver(() => ProjectSettingsModel)
export class ProjectSettingsResolver {
  constructor(private readonly projectsService: ProjectSettingsService) {}

  @ValidateArgs({ projectId: z.string() })
  @Query(() => ProjectSettingsModel, { nullable: true })
  getProjectSettings(@Args('projectId') projectId: string) {
    return this.projectsService.getProjectSettings(projectId);
  }
}
