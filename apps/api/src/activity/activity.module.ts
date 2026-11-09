import { Module } from '@nestjs/common';
import { ActivityResolver } from './activity.resolver';
import { ActivityService } from './activity.service';

/** Recent activity in the viewer's projects. */
@Module({
  providers: [ActivityService, ActivityResolver],
})
export class ActivityModule {}
