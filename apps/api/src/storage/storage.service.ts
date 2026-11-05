import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadUrlModel } from './storage.model';

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3 MB

@Injectable()
export class StorageService {
  private readonly bucketName: string;
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('RAILWAY_STORAGE_BUCKET_NAME');

    this.s3Client = new S3Client({
      endpoint: this.configService.getOrThrow<string>('RAILWAY_STORAGE_BUCKET_ENDPOINT'),
      region: this.configService.getOrThrow<string>('RAILWAY_STORAGE_BUCKET_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('RAILWAY_STORAGE_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('RAILWAY_STORAGE_SECRET_ACCESS_KEY'),
      },
    });
  }

  async getFileDownloadUrl(key: string) {
    const presignedUrl = await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({ Bucket: this.bucketName, Key: key }),
      { expiresIn: 3600 },
    );
    return presignedUrl;
  }

  async getFileUploadUrl(key: string): Promise<UploadUrlModel> {
    const { url, fields } = await createPresignedPost(this.s3Client, {
      Bucket: this.bucketName,
      Key: key,
      Expires: 600,
      Conditions: [['content-length-range', 1, MAX_UPLOAD_BYTES]],
    });
    return {
      url,
      fields: Object.entries(fields).map(([name, value]) => ({ name, value })),
    };
  }
}
