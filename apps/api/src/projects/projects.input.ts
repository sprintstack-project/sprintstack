import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { description: 'Prefix of item keys, e.g. "PAY" in PAY-1482.' })
  key: string;

  @Field(() => String, { nullable: true })
  description?: string | null;
}
