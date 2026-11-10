import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { uuidSchema } from '@/common.schema';
import { ValidateArgs } from '@/zod-validation.decorator';
import { SprintModel } from './sprints.model';
import { sprintNameSchema } from './sprints.schema';
import { SprintsService } from './sprints.service';

@Resolver(() => SprintModel)
export class SprintsResolver {
  constructor(private readonly sprintsService: SprintsService) {}

  @ValidateArgs({ projectId: uuidSchema })
  @Query(() => [SprintModel], {
    description: 'Get all sprints',
  })
  sprints(@Args('projectId', { type: () => ID }) projectId: string) {
    return this.sprintsService.findAllByProjectId(projectId);
  }

  @ValidateArgs({ id: uuidSchema })
  @Query(() => SprintModel, {
    description: 'Get a sprint by ID',
  })
  sprint(@Args('id', { type: () => ID }) id: string) {
    return this.sprintsService.findById(id);
  }

  @ValidateArgs({ projectId: uuidSchema })
  @Query(() => SprintModel, { nullable: true, description: 'Get the current sprint' })
  currentSprint(@Args('projectId', { type: () => ID }) projectId: string) {
    return this.sprintsService.findCurrentByProjectId(projectId);
  }

  @ValidateArgs({ projectId: uuidSchema, name: sprintNameSchema })
  @Mutation(() => SprintModel, { description: 'Create a new sprint' })
  createSprint(
    @Args('projectId', { type: () => ID }) projectId: string,
    @Args('name', { type: () => String }) name: string,
    @Args('startDate', { type: () => Date }) startDate: Date,
    @Args('endDate', { type: () => Date }) endDate: Date,
  ) {
    return this.sprintsService.create(projectId, name, startDate, endDate);
  }
}
