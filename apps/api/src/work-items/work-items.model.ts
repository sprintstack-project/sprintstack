import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

import { Priority, WorkItemStatus, WorkItemType } from '../generated/prisma/enums';

registerEnumType(WorkItemType, {
  name: 'WorkItemType',
});

registerEnumType(WorkItemStatus, {
  name: 'WorkItemStatus',
});

registerEnumType(Priority, {
  name: 'Priority',
});

@ObjectType('WorkItem')
export class WorkItemModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  projectId: string;

  @Field(() => Int, { description: 'With the project key it makes the item key, e.g. PAY-1482.' })
  number: number;

  @Field(() => WorkItemType)
  type: WorkItemType;

  @Field(() => String)
  title: string;

  /** Stored as JSON; resolved to a JSON string by the resolver. */
  @Field(() => String, { description: 'Tiptap JSON document, JSON-encoded.' })
  description: unknown;

  /** Stored as JSON; resolved to a JSON string by the resolver. */
  @Field(() => String, { description: 'JSON-encoded array of { given, when, outcome }.' })
  criteria: unknown;

  @Field(() => WorkItemStatus)
  status: WorkItemStatus;

  @Field(() => Boolean)
  atRisk: boolean;

  @Field(() => Priority)
  priority: Priority;

  @Field(() => Int, { nullable: true })
  points: number | null;

  @Field(() => [String])
  tags: string[];

  @Field(() => Date, { nullable: true })
  startDate: Date | null;

  @Field(() => Date, { nullable: true })
  targetDate: Date | null;

  @Field(() => ID, { nullable: true })
  sprintId: string | null;

  @Field(() => String)
  rank: string;

  @Field(() => ID, { nullable: true })
  parentId: string | null;

  @Field(() => String, { nullable: true })
  assigneeId: string | null;

  @Field(() => String, { nullable: true })
  reporterId: string | null;

  @Field(() => Date, { nullable: true })
  completedAt: Date | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
