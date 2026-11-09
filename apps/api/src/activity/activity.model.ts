import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ActivityAction } from '../generated/prisma/enums';
import { User } from '../users/users.model';

registerEnumType(ActivityAction, {
  name: 'ActivityAction',
});

/** The work item a line points at, with its key already built, e.g. PAY-1482. */
@ObjectType('ActivityWorkItem')
export class ActivityWorkItemModel {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  number: number;

  @Field(() => String, { description: 'Project key and number, e.g. PAY-1482.' })
  key: string;

  @Field(() => String)
  title: string;
}

/** One line of recent activity in a project. */
@ObjectType('Activity')
export class ActivityModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  projectId: string;

  @Field(() => ActivityAction)
  action: ActivityAction;

  /** Stored as JSON; resolved to a JSON string by the resolver. */
  @Field(() => String, {
    description: 'JSON-encoded details, e.g. { from, to } or { commentId, quote }.',
  })
  data: unknown;

  /** Null once the actor's account is deleted. */
  @Field(() => User, { nullable: true })
  actor: User | null;

  /** Null for project-level activity. */
  @Field(() => ActivityWorkItemModel, { nullable: true })
  workItem: ActivityWorkItemModel | null;

  @Field(() => Date)
  createdAt: Date;
}
