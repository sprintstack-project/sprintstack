import { Module } from '@nestjs/common';
import { UserPreferenceResolver } from './user-preference.resolver.js';
import { UserPreferenceService } from './user-preference.service.js';

@Module({
  providers: [UserPreferenceService, UserPreferenceResolver],
})
export class UserPreferenceModule {}
