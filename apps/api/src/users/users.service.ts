import { Injectable } from '@nestjs/common';
import { StorageService } from '@/storage/storage.service';
import { PrismaService } from '../prisma/prisma.service';

/** People the viewer works with. Everyone outside their active organization stays hidden. */
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  /** Members of the organization whose name or email contains `search`, by name. */
  async search(
    organizationId: string,
    { search, first }: { search?: string | null; first: number },
  ) {
    const text = search?.trim();
    const users = await this.prisma.user.findMany({
      where: {
        members: { some: { organizationId } },
        ...(text && {
          OR: [
            { name: { contains: text, mode: 'insensitive' } },
            { email: { contains: text, mode: 'insensitive' } },
          ],
        }),
      },
      select: { id: true, name: true, email: true, image: true },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      take: first,
    });
    return users?.map(async (user) => ({
      ...user,
      image: user?.image ? await this.storageService.getFileDownloadUrl(user.image) : null,
    }));
  }

  /** Members of a project in the organization, by name. `after` is the id of the last one already shown. */
  async getByProject(
    organizationId: string,
    { projectId, first, after }: { projectId: string; first: number; after?: string | null },
  ) {
    const users = await this.prisma.user.findMany({
      where: {
        members: { some: { organizationId } },
        projects: { some: { projectId, project: { organizationId } } },
      },
      select: { id: true, name: true, email: true, image: true },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      take: first,
      ...(after && { cursor: { id: after }, skip: 1 }),
    });
    return users?.map(async (user) => ({
      ...user,
      image: user?.image ? await this.storageService.getFileDownloadUrl(user.image) : null,
    }));
  }

  async getCurrentUser(organizationId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, members: { some: { organizationId } } },
      select: { id: true, name: true, email: true, image: true },
    });

    return {
      ...user,
      image: user?.image ? await this.storageService.getFileDownloadUrl(user.image) : null,
    };
  }

  async updateCurrentUser(
    organizationId: string,
    userId: string,
    data: { name?: string | null; email?: string | null; image?: string | null },
  ) {
    const existing = await this.prisma.user.findFirst({
      where: { id: userId, members: { some: { organizationId } } },
      select: { id: true },
    });

    if (!existing) return null;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name != null && { name: data.name }),
        ...(data.email != null && { email: data.email }),
        ...(data.image != null && { image: data.image }),
      },
      select: { id: true, name: true, email: true, image: true },
    });

    return {
      ...user,
      image: user?.image ? await this.storageService.getFileDownloadUrl(user.image) : null,
    };
  }
}
