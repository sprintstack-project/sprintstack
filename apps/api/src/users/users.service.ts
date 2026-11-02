import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** People the viewer works with. Everyone outside their active organization stays hidden. */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Members of the organization whose name or email contains `search`, by name. */
  search(organizationId: string, { search, first }: { search?: string | null; first: number }) {
    const text = search?.trim();
    return this.prisma.user.findMany({
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
  }
}
