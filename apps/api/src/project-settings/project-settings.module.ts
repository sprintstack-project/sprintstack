import { Module } from '@nestjs/common';
import { ProjectSettingsResolver } from './project-settings.resolver.js';
import { ProjectSettingsService } from './project-settings.service.js';

@Module({
  providers: [ProjectSettingsService, ProjectSettingsResolver],
})
export class ProjectSettingsModule {}
