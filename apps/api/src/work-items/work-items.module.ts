import { Module } from '@nestjs/common';
import { WorkItemsResolver } from './work-items.resolver.js';
import { WorkItemsService } from './work-items.service.js';

@Module({
  providers: [WorkItemsService, WorkItemsResolver],
})
export class WorkItemsModule {}
