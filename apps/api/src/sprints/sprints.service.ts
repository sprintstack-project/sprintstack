import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SprintsService {
  constructor(private readonly prismaService: PrismaService) {}

  findAllByProjectId(projectId: string) {
    return this.prismaService.sprint.findMany({
      where: {
        projectId,
      },
    });
  }

  findById(id: string) {
    return this.prismaService.sprint.findUnique({
      where: {
        id,
      },
    });
  }

  findCurrentByProjectId(projectId: string) {
    return this.prismaService.sprint.findFirst({
      where: {
        projectId,
        state: 'active',
      },
    });
  }
}
