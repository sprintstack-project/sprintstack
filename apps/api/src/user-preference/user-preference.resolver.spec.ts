import { Test, TestingModule } from '@nestjs/testing';
import { UserPreferenceResolver } from './user-preference.resolver.js';

describe('UserPreferenceResolver', () => {
  let resolver: UserPreferenceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPreferenceResolver],
    }).compile();

    resolver = module.get<UserPreferenceResolver>(UserPreferenceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
