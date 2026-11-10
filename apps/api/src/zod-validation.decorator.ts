import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { z } from 'zod';

/**
 * Parses a resolver arg with a zod schema and passes on its output, transforms included. GraphQL
 * still builds its types from the @InputType class; this checks what the types can't express.
 * Usually attached through @ValidateArgs rather than by hand.
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

/** GqlParamtype.ARGS, which @nestjs/graphql doesn't export. Its param metadata keys are `3:<index>`. */
const GQL_ARGS_PARAMTYPE = '3';

type ParamMetadata = Record<string, { index: number; data?: unknown; pipes: PipeTransform[] }>;

/**
 * Validates named @Args of a resolver method with zod schemas, keyed by arg name.
 *
 *   @Mutation(() => WorkItemModel)
 *   @ValidateArgs({ input: createWorkItemSchema })
 *   createWorkItem(@Args('input', { type: () => CreateWorkItemInput }) input: CreateWorkItem) {}
 *
 * Parameter decorators run before method decorators, so the @Args metadata already exists here:
 * each schema becomes a ZodValidationPipe on its arg, exactly as if passed to @Args. A name with no
 * matching @Args throws when the class loads, so a typo can't silently skip validation.
 */
export const ValidateArgs =
  (schemas: Record<string, z.ZodType>): MethodDecorator =>
  (target, key) => {
    const params: ParamMetadata =
      Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) ?? {};
    const next = { ...params };

    for (const [name, schema] of Object.entries(schemas)) {
      const entry = Object.entries(params).find(
        ([paramKey, param]) => paramKey.split(':')[0] === GQL_ARGS_PARAMTYPE && param.data === name,
      );
      if (!entry) {
        throw new Error(
          `@ValidateArgs on ${target.constructor.name}.${String(key)}: no @Args('${name}') parameter`,
        );
      }
      const [paramKey, param] = entry;
      next[paramKey] = {
        ...param,
        pipes: [...param.pipes, new ZodValidationPipe(schema)],
      };
    }

    Reflect.defineMetadata(ROUTE_ARGS_METADATA, next, target.constructor, key);
  };
