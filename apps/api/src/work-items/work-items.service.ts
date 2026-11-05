import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { generateKeyBetween } from 'fractional-indexing';

import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateWorkItem } from './work-items.schema';

/** Two writers can race for the same next number; the unique index rejects one, which retries. */
const MAX_NUMBER_ATTEMPTS = 3;

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

/** Work items in projects of the viewer's active organization that they're on. */
@Injectable()
export class WorkItemsService {
  constructor(private readonly prisma: PrismaService) {}

  findById(organizationId: string, userId: string, id: string) {
    return this.prisma.workItem.findFirst({
      where: { id, deletedAt: null, project: this.visibleProject(organizationId, userId) },
    });
  }

  getAllByProjectId(organizationId: string, userId: string, projectId: string) {
    return this.prisma.workItem.findMany({
      where: { projectId, deletedAt: null, project: this.visibleProject(organizationId, userId) },
      orderBy: [{ sprintId: 'asc' }, { rank: 'asc' }],
    });
  }

  async create(organizationId: string, userId: string, input: CreateWorkItem) {
    const { projectId } = input;

    const membership = await this.prisma.projectMember.findFirst({
      where: { projectId, userId, project: { organizationId, archivedAt: null } },
      select: { role: true },
    });
    if (!membership) throw new NotFoundException('Project not found.');
    if (membership.role === 'viewer') {
      throw new ForbiddenException('Viewers cannot create work items.');
    }

    await this.assertBelongsToProject(input);

    const sprintId = input.sprintId ?? null;
    const status = input.status ?? 'todo';

    for (let attempt = 1; ; attempt++) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          const [latest, lastInGroup] = await Promise.all([
            tx.workItem.findFirst({
              where: { projectId },
              orderBy: { number: 'desc' },
              select: { number: true },
            }),
            tx.workItem.findFirst({
              where: { projectId, sprintId, deletedAt: null },
              orderBy: { rank: 'desc' },
              select: { rank: true },
            }),
          ]);

          const workItem = await tx.workItem.create({
            data: {
              projectId,
              number: (latest?.number ?? 0) + 1,
              type: input.type,
              title: input.title,
              description: (input.description ?? undefined) as Prisma.InputJsonValue | undefined,
              criteria: input.criteria ?? undefined,
              status,
              atRisk: input.atRisk ?? undefined,
              priority: input.priority ?? undefined,
              points: input.points ?? null,
              tags: input.tags ?? [],
              startDate: input.startDate ?? null,
              targetDate: input.targetDate ?? null,
              sprintId,
              // New items go to the bottom of their sprint or the backlog.
              rank: generateKeyBetween(lastInGroup?.rank ?? null, null),
              parentId: input.parentId ?? null,
              assigneeId: input.assigneeId ?? null,
              reporterId: userId,
              completedAt: status === 'done' ? new Date() : null,
            },
          });

          await tx.activity.create({
            data: { projectId, workItemId: workItem.id, actorId: userId, action: 'created' },
          });

          return workItem;
        });
      } catch (error) {
        if (isUniqueViolation(error) && attempt < MAX_NUMBER_ATTEMPTS) continue;
        throw error;
      }
    }
  }

  private visibleProject(organizationId: string, userId: string) {
    return { organizationId, archivedAt: null, members: { some: { userId } } };
  }

  /** The sprint, parent and assignee must all be in the item's own project. */
  private async assertBelongsToProject({
    projectId,
    sprintId,
    parentId,
    assigneeId,
  }: CreateWorkItem) {
    const [sprint, parent, assignee] = await Promise.all([
      sprintId
        ? this.prisma.sprint.findFirst({ where: { id: sprintId, projectId }, select: { id: true } })
        : true,
      parentId
        ? this.prisma.workItem.findFirst({
            where: { id: parentId, projectId, deletedAt: null },
            select: { id: true },
          })
        : true,
      assigneeId
        ? this.prisma.projectMember.findFirst({
            where: { projectId, userId: assigneeId },
            select: { userId: true },
          })
        : true,
    ]);
    if (!sprint) throw new BadRequestException('Sprint is not in this project.');
    if (!parent) throw new BadRequestException('Parent is not in this project.');
    if (!assignee) throw new BadRequestException('Assignee is not a member of this project.');
  }
}
