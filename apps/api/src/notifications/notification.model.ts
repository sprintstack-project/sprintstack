import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { NotificationType, PushPlatform } from '../generated/prisma/enums';

registerEnumType(NotificationType, { name: 'NotificationType' });
registerEnumType(PushPlatform, { name: 'PushPlatform' });

/** Who caused a notification: just enough to show them, not their account. */
@ObjectType('NotificationActor')
export class NotificationActorModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  image?: string | null;
}

/** The work item a notification is about. */
@ObjectType('NotificationWorkItem')
export class NotificationWorkItemModel {
  @Field(() => ID)
  id: string;

  /** e.g. "PAY-1482". */
  @Field()
  key: string;

  @Field()
  title: string;
}

/** The sprint a reminder is about. */
@ObjectType('NotificationSprint')
export class NotificationSprintModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}

/** A line in the header's bell. Clients write the text from the type and what it points at. */
@ObjectType('Notification')
export class NotificationModel {
  @Field(() => ID)
  id: string;

  @Field(() => NotificationType)
  type: NotificationType;

  /** Null for sprint reminders, and once the actor's account is deleted. */
  @Field(() => NotificationActorModel, { nullable: true })
  actor?: NotificationActorModel | null;

  @Field(() => NotificationWorkItemModel, { nullable: true })
  workItem?: NotificationWorkItemModel | null;

  @Field(() => NotificationSprintModel, { nullable: true })
  sprint?: NotificationSprintModel | null;

  @Field(() => Date, { nullable: true })
  readAt?: Date | null;

  @Field()
  createdAt: Date;
}
