import { Field, ObjectType } from '@nestjs/graphql';

/** One form field S3 expects alongside the file in a presigned POST. */
@ObjectType('UploadUrlFieldModel')
export class UploadUrlFieldModel {
  @Field(() => String)
  name: string;

  @Field(() => String)
  value: string;
}

/** A presigned S3 POST: send `fields` as form data before the `file` part, to `url`. */
@ObjectType('UploadUrlModel')
export class UploadUrlModel {
  @Field(() => String)
  url: string;

  @Field(() => [UploadUrlFieldModel])
  fields: UploadUrlFieldModel[];
}
