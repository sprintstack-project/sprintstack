import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';
import { z } from 'zod';

/**
 * Parses a resolver arg with a zod schema and passes on its output, transforms included. GraphQL
 * still builds its types from the @InputType class; this checks what the types can't express.
 *
 *   @Args('input', { type: () => CreateWorkItemInput }, new ZodValidationPipe(createWorkItemSchema))
 */
@Injectable()
export class ZodValidationPipe<T extends z.ZodType> implements PipeTransform<unknown, z.output<T>> {
  constructor(private readonly schema: T) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) throw new BadRequestException(z.prettifyError(result.error));
    return result.data;
  }
}
