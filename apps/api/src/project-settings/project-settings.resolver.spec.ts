import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSettingsResolver } from './project-settings.resolver.js';

describe('ProjectSettingsResolver', () => {
  let resolver: ProjectSettingsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectSettingsResolver],
    }).compile();

    resolver = module.get<ProjectSettingsResolver>(ProjectSettingsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
