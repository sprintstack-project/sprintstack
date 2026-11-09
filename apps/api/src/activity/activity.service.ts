import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const DEFAULT_ACTIVITY_PAGE_SIZE = 20;
export const MAX_ACTIVITY_PAGE_SIZE = 50;

/** Activity in projects of the viewer's active organization that they're on. */
@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  /** Newest first. Pass the last id of a page as `after` to get the next one. */
  async getAllByProjectId(
    organizationId: string,
    userId: string,
    projectId: string,
    { first = DEFAULT_ACTIVITY_PAGE_SIZE, after }: { first?: number; after?: string | null } = {},
  ) {
    const take = Math.min(Math.max(first, 1), MAX_ACTIVITY_PAGE_SIZE);

    const activity = await this.prisma.activity.findMany({
      where: {
        projectId,
        project: { organizationId, archivedAt: null, members: { some: { userId } } },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take,
      ...(after ? { cursor: { id: after }, skip: 1 } : {}),
      include: {
        actor: { select: { id: true, name: true, email: true, image: true } },
        workItem: { select: { id: true, number: true, title: true } },
        project: { select: { key: true } },
      },
    });

    return activity.map(({ project, workItem, ...rest }) => ({
      ...rest,
      workItem: workItem ? { ...workItem, key: `${project.key}-${workItem.number}` } : null,
    }));
  }
}
