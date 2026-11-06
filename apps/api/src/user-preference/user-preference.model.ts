import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType('UserPreference')
export class UserPreference {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => [String])
  widgets: string[];

  @Field(() => String)
  theme: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@InputType('CreateUserPreferenceInput')
export class CreateUserPreferenceInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  projectId: string;

  @Field(() => [String], { nullable: true })
  widgets?: string[];

  @Field(() => String, { nullable: true })
  theme?: string;
}

@InputType('UpdateUserPreferenceInput')
export class UpdateUserPreferenceInput {
  @Field(() => [String], { nullable: true })
  widgets?: string[] | null;

  @Field(() => String, { nullable: true })
  theme?: string | null;
}
