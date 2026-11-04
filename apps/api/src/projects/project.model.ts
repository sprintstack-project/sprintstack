import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Methodology } from '../generated/prisma/enums';

registerEnumType(Methodology, { name: 'Methodology' });

/** A project the viewer is on: enough for the project switcher. */
@ObjectType('Project')
export class ProjectModel {
  @Field(() => ID)
  id: string;

  /** Prefix of item keys, e.g. "PAY" in PAY-1482. */
  @Field()
  key: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Methodology)
  methodology: Methodology;

  @Field(() => Int)
  memberCount: number;
}
