import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { generateKeyBetween } from 'fractional-indexing';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import type { CreateWorkItem, UpdateWorkItem } from './work-items.schema';

/** Two writers can race for the same next number; the unique index rejects one, which retries. */
const MAX_NUMBER_ATTEMPTS = 3;

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

/** Work items in projects of the viewer's active organization that they're on. */
@Injectable()
export class WorkItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

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

  getAllBySprintId(organizationId: string, userId: string, sprintId: string) {
    return this.prisma.workItem.findMany({
      where: { sprintId, deletedAt: null, project: this.visibleProject(organizationId, userId) },
      orderBy: [{ sprintId: 'asc' }, { rank: 'asc' }],
    });
  }

  getAllInBacklog(organizationId: string, userId: string, projectId: string) {
    return this.prisma.workItem.findMany({
      where: {
        projectId,
        sprintId: null,
        deletedAt: null,
        project: this.visibleProject(organizationId, userId),
      },
      orderBy: [{ rank: 'asc' }],
    });
  }

  getAllByAssignee(organizationId: string, userId: string, projectId: string, assigneeId: string) {
    return this.prisma.workItem.findMany({
      where: {
        deletedAt: null,
        projectId,
        assigneeId,
        project: this.visibleProject(organizationId, userId),
      },
      orderBy: [{ sprintId: 'asc' }, { rank: 'asc' }],
    });
  }

  getAllCommentsByWorkItemId(organizationId: string, userId: string, workItemId: string) {
    return this.prisma.comment.findMany({
      where: { workItemId, deletedAt: null, project: this.visibleProject(organizationId, userId) },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getAllAttachmentsByWorkItemId(organizationId: string, userId: string, workItemId: string) {
    const workItem = await this.prisma.workItem.findFirst({
      where: {
        id: workItemId,
        deletedAt: null,
        project: this.visibleProject(organizationId, userId),
      },
      select: { projectId: true },
    });
    if (!workItem) throw new NotFoundException('Work item not found.');

    const attachments = await this.prisma.attachment.findMany({
      where: { workItemId },
      orderBy: { createdAt: 'asc' },
    });
    return attachments.map(async (attachment) => ({
      ...attachment,
      url: await this.storageService.getFileDownloadUrl(attachment.storageKey),
    }));
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

  async update(organizationId: string, userId: string, input: UpdateWorkItem) {
    const { id, ...changes } = input;

    const existing = await this.prisma.workItem.findFirst({
      where: { id, deletedAt: null, project: this.visibleProject(organizationId, userId) },
      include: { project: { select: { members: { where: { userId }, select: { role: true } } } } },
    });
    if (!existing) throw new NotFoundException('Work item not found.');
    if (existing.project.members[0]?.role === 'viewer') {
      throw new ForbiddenException('Viewers cannot edit work items.');
    }

    const { projectId } = existing;
    if (changes.parentId === id) throw new BadRequestException('An item cannot be its own parent.');
    await this.assertBelongsToProject({
      projectId,
      sprintId: changes.sprintId,
      parentId: changes.parentId,
      assigneeId: changes.assigneeId,
    });

    const startDate = changes.startDate === undefined ? existing.startDate : changes.startDate;
    const targetDate = changes.targetDate === undefined ? existing.targetDate : changes.targetDate;
    if (startDate && targetDate && startDate > targetDate) {
      throw new BadRequestException('Start date must be on or before the target date.');
    }

    const statusChanged = changes.status !== undefined && changes.status !== existing.status;
    const sprintChanged = changes.sprintId !== undefined && changes.sprintId !== existing.sprintId;
    const assigneeChanged =
      changes.assigneeId !== undefined && changes.assigneeId !== existing.assigneeId;

    return this.prisma.$transaction(async (tx) => {
      // Moving to another sprint (or the backlog) puts the item at the bottom of its new group.
      let rank: string | undefined;
      if (sprintChanged) {
        const lastInGroup = await tx.workItem.findFirst({
          where: { projectId, sprintId: changes.sprintId ?? null, deletedAt: null },
          orderBy: { rank: 'desc' },
          select: { rank: true },
        });
        rank = generateKeyBetween(lastInGroup?.rank ?? null, null);
      }

      const workItem = await tx.workItem.update({
        where: { id },
        data: {
          type: changes.type,
          title: changes.title,
          description: changes.description as Prisma.InputJsonValue | undefined,
          criteria: changes.criteria,
          status: changes.status,
          atRisk: changes.atRisk,
          priority: changes.priority,
          points: changes.points,
          tags: changes.tags,
          startDate: changes.startDate,
          targetDate: changes.targetDate,
          sprintId: changes.sprintId,
          rank,
          parentId: changes.parentId,
          assigneeId: changes.assigneeId,
          // Stamped when the item moves into done, cleared when it leaves.
          completedAt: statusChanged ? (changes.status === 'done' ? new Date() : null) : undefined,
        },
      });

      const activity: Prisma.ActivityCreateManyInput[] = [];
      const log = (action: Prisma.ActivityCreateManyInput['action'], data: object) =>
        activity.push({ projectId, workItemId: id, actorId: userId, action, data });

      if (statusChanged) log('status_changed', { from: existing.status, to: changes.status });
      if (sprintChanged) log('sprint_changed', { from: existing.sprintId, to: changes.sprintId });
      if (assigneeChanged) {
        log('assigned', { from: existing.assigneeId, to: changes.assigneeId });
      }
      const fields = Object.entries(changes)
        .filter(([field, value]) => {
          if (value === undefined || ['status', 'sprintId', 'assigneeId'].includes(field)) {
            return false;
          }
          const before = existing[field as keyof typeof existing];
          return JSON.stringify(before) !== JSON.stringify(value);
        })
        .map(([field]) => field);
      if (fields.length) log('updated', { fields });

      if (activity.length) await tx.activity.createMany({ data: activity });

      return workItem;
    });
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
  }: Pick<CreateWorkItem, 'projectId' | 'sprintId' | 'parentId' | 'assigneeId'>) {
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
