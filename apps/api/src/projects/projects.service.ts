import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateProject } from './projects.schema';

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

  /** Creates a project with its creator as the only member, an admin. */
  async create(organizationId: string, userId: string, input: CreateProject) {
    try {
      const project = await this.prisma.project.create({
        data: { ...input, organizationId, members: { create: { userId, role: 'admin' } } },
        select: { id: true, key: true, name: true, description: true, methodology: true },
      });
      return { ...project, memberCount: 1 };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new GraphQLError(`Another project already uses the key ${input.key}.`, {
          extensions: { code: 'CONFLICT' },
        });
      }
      throw error;
    }
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
