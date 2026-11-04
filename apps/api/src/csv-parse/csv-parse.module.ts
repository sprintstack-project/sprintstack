import { Module } from '@nestjs/common';
import { CsvParseResolver } from './csv-parse.resolver';
import { CsvParseService } from './csv-parse.service';

/** Parsing CSV text sent through GraphQL. */
@Module({
  providers: [CsvParseResolver, CsvParseService],
})
export class CsvParseModule {}
