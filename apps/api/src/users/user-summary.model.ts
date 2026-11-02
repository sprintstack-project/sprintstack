import { Field, ID, ObjectType } from '@nestjs/graphql';

/** Someone in the viewer's organization: enough to show and mention them, not their account. */
@ObjectType('UserSummary')
export class UserSummaryModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  image?: string | null;
}
