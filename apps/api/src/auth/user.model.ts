import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  emailVerified: boolean;

  @Field(() => String, { nullable: true })
  image?: string | null;

  @Field()
  twoFactorEnabled: boolean;

  @Field()
  createdAt: Date;
}
