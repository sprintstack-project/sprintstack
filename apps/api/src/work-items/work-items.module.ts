import { Module } from '@nestjs/common';
import { StorageService } from '../storage/storage.service.js';
import { CommentsResolver, WorkItemsResolver } from './work-items.resolver.js';
import { WorkItemsService } from './work-items.service.js';

@Module({
  providers: [WorkItemsService, WorkItemsResolver, CommentsResolver, StorageService],
})
export class WorkItemsModule {}
