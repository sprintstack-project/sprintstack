import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { GraphQLError } from 'graphql';
import type { Auth } from '@/auth/auth';
import { CsvImportModel } from './csv-parse.model';
import { CsvParseService } from './csv-parse.service';

/** CSV imports: the client reads the file and sends its text, so no multipart upload is needed. */
@Resolver(() => CsvImportModel)
export class CsvParseResolver {
  constructor(private readonly csvParseService: CsvParseService) {}

  @Mutation(() => CsvImportModel, {
    description:
      'Imports work items from a CSV export into a project. AI matches the columns to fields; ' +
      'values are converted and checked before anything is written.',
  })
  importCsv(
    @Session() session: UserSession<Auth>,
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('content', { description: 'The file’s text, up to 100,000 characters.' }) content: string,
  ) {
    const { activeOrganizationId } = session.session;
    if (!activeOrganizationId) {
      throw new GraphQLError('Choose an organization first.', {
        extensions: { code: 'FORBIDDEN' },
      });
    }
    return this.csvParseService.importCsv(
      content,
      projectId,
      activeOrganizationId,
      session.user.id,
    );
  }
}
