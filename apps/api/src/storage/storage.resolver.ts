import { Args, Query, Resolver } from '@nestjs/graphql';
import { UploadUrlModel } from './storage.model';
import { StorageService } from './storage.service';

@Resolver(() => UploadUrlModel)
export class StorageResolver {
  constructor(private readonly storageService: StorageService) {}

  @Query(() => UploadUrlModel)
  getUploadUrl(@Args('key', { type: () => String, nullable: false }) key: string) {
    return this.storageService.getFileUploadUrl(key);
  }
}
