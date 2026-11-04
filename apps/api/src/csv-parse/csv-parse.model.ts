import { Field, ObjectType } from '@nestjs/graphql';

/** The outcome of a CSV import. */
@ObjectType('CsvImport')
export class CsvImportModel {
  @Field(() => Boolean)
  success: boolean;
}
