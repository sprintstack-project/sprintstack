import { Module } from '@nestjs/common';
import { SprintsResolver } from './sprints.resolver';
import { SprintsService } from './sprints.service';

@Module({
  providers: [SprintsService, SprintsResolver],
})
export class SprintsModule {}
