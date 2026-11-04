import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SprintState } from '../generated/prisma/enums';

registerEnumType(SprintState, {
  name: 'SprintState',
});

@ObjectType('Sprint')
export class SprintModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  goal: string;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date, { nullable: true })
  endDate: Date;

  @Field(() => SprintState)
  state: SprintState;
}
