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

  @Field(() => ID, { nullable: true })
  workItemId?: string | null;

  @Field(() => ID, { nullable: true })
  sprintId?: string | null;

  @Field(() => Date, { nullable: true })
  readAt?: Date | null;

  @Field()
  createdAt: Date;
}
