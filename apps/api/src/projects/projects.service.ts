import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Projects in the viewer's active organization that they're on. */
@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /** The person's open (not archived) projects in the organization, by name. */
  async listFor(organizationId: string, userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { organizationId, archivedAt: null, members: { some: { userId } } },
      select: {
        id: true,
        key: true,
        name: true,
        description: true,
        methodology: true,
        _count: { select: { members: true } },
      },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
    return projects.map(({ _count, ...project }) => ({ ...project, memberCount: _count.members }));
  }

  async getById(organizationId: string, projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId, archivedAt: null, members: { some: { userId } } },
      select: {
        id: true,
        key: true,
        name: true,
        description: true,
        methodology: true,
        _count: { select: { members: true } },
      },
    });
    if (!project) return null;
    const { _count, ...rest } = project;
    return { ...rest, memberCount: _count.members };
  }
}
