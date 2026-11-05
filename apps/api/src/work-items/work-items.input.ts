import { Field, ID, InputType, Int } from '@nestjs/graphql';

import { Priority, WorkItemStatus, WorkItemType } from '../generated/prisma/enums';

@InputType()
export class CreateWorkItemInput {
  @Field(() => ID)
  projectId: string;

  @Field(() => WorkItemType)
  type: WorkItemType;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true, description: 'Tiptap JSON document, JSON-encoded.' })
  description?: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Acceptance criteria as a JSON-encoded array of { given, when, outcome }.',
  })
  criteria?: string | null;

  @Field(() => WorkItemStatus, { nullable: true, description: 'Defaults to todo.' })
  status?: WorkItemStatus | null;

  @Field(() => Boolean, { nullable: true })
  atRisk?: boolean | null;

  @Field(() => Priority, { nullable: true, description: 'Defaults to medium.' })
  priority?: Priority | null;

  @Field(() => Int, { nullable: true })
  points?: number | null;

  @Field(() => [String], { nullable: true })
  tags?: string[] | null;

  @Field(() => Date, { nullable: true })
  startDate?: Date | null;

  @Field(() => Date, { nullable: true })
  targetDate?: Date | null;

  @Field(() => ID, { nullable: true, description: 'Leave empty to put the item in the backlog.' })
  sprintId?: string | null;

  @Field(() => ID, { nullable: true })
  parentId?: string | null;

  @Field(() => ID, { nullable: true })
  assigneeId?: string | null;
}
