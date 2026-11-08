import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageService } from '@/storage/storage.service';
import { PrismaService } from '../prisma/prisma.service';

const ME_SELECT = {
  id: true,
  name: true,
  email: true,
  image: true,
  emailVerified: true,
  jobTitle: true,
} as const;

const avatarPrefix = (userId: string) => `avatars/${userId}/`;

/** People the viewer works with. Everyone outside their active organization stays hidden. */
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  /** A stored photo's key becomes a signed link; GitHub accounts already hold a full URL. */
  private imageUrl(image: string | null | undefined) {
    if (!image) return null;
    return /^https?:\/\//.test(image) ? image : this.storageService.getFileDownloadUrl(image);
  }

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
      image: await this.imageUrl(user?.image),
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
      image: await this.imageUrl(user?.image),
    }));
  }

  async getCurrentUser(organizationId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, members: { some: { organizationId } } },
      select: ME_SELECT,
    });

    return {
      ...user,
      image: await this.imageUrl(user?.image),
    };
  }

  /** The key is made here, under the person's own prefix, so a photo can't land on someone else's. */
  async createAvatarUpload(userId: string, contentType: string) {
    const key = `${avatarPrefix(userId)}${randomUUID()}`;
    return { key, ...(await this.storageService.getFileUploadUrl(key, contentType)) };
  }

  async updateCurrentUser(
    organizationId: string,
    userId: string,
    data: { name?: string | null; jobTitle?: string | null; image?: string | null },
  ) {
    // The image is later signed for download, so only the person's own uploads are accepted.
    if (data.image && !data.image.startsWith(avatarPrefix(userId))) {
      throw new BadRequestException('Upload the photo with createAvatarUpload first.');
    }

    const existing = await this.prisma.user.findFirst({
      where: { id: userId, members: { some: { organizationId } } },
      select: { id: true },
    });

    if (!existing) return null;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name != null && { name: data.name }),
        ...(data.jobTitle !== undefined && { jobTitle: data.jobTitle || null }),
        ...(data.image !== undefined && { image: data.image }),
      },
      select: ME_SELECT,
    });

    return { ...user, image: await this.imageUrl(user.image) };
  }
}
