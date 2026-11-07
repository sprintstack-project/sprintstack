import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { SprintModel } from './sprints.model';
import { SprintsService } from './sprints.service';

@Resolver(() => SprintModel)
export class SprintsResolver {
  constructor(private readonly sprintsService: SprintsService) {}

  @Query(() => [SprintModel], {
    description: 'Get all sprints',
  })
  sprints(@Args('projectId', { type: () => ID }) projectId: string) {
    return this.sprintsService.findAllByProjectId(projectId);
  }

  @Query(() => SprintModel, {
    description: 'Get a sprint by ID',
  })
  sprint(@Args('id', { type: () => ID }) id: string) {
    return this.sprintsService.findById(id);
  }

  @Query(() => SprintModel, { nullable: true, description: 'Get the current sprint' })
  currentSprint(@Args('projectId', { type: () => ID }) projectId: string) {
    return this.sprintsService.findCurrentByProjectId(projectId);
  }
}
