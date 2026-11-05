import { Module } from '@nestjs/common';
import { StorageService } from '@/storage/storage.service';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

/** Finding people in the viewer's organization. */
@Module({
  providers: [UsersResolver, UsersService, StorageService],
  exports: [UsersService],
})
export class UsersModule {}
