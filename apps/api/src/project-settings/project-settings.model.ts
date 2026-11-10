import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

/** Per-project sprint configuration. */
@ObjectType('ProjectSettings')
export class ProjectSettingsModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  projectId: string;

  /** Sprint length in days. */
  @Field(() => Int, { nullable: true })
  sprintDuration?: number | null;

  /** Day of week a sprint starts on. */
  @Field(() => Int, { nullable: true })
  sprintStartsOn?: number | null;

  @Field()
  startSprintAutomatically: boolean;

  @Field()
  carryOverIncompleteWork: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
