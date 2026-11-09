import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UploadUrlModel } from '@/storage/storage.model';

/** Someone in the viewer's organization: enough to show and mention them, not their account. */
@ObjectType('UserSummary')
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  image?: string | null;
}

/** The signed-in person, with the account details only they see. */
@ObjectType('Me')
export class MeModel extends User {
  @Field()
  emailVerified: boolean;

  @Field(() => String, { nullable: true })
  jobTitle?: string | null;
}

/** Where to send a new profile photo, and the `key` to save with updateMe once it's there. */
@ObjectType('AvatarUpload')
export class AvatarUploadModel extends UploadUrlModel {
  @Field(() => String)
  key: string;
}
