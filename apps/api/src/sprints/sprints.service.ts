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
      orderBy: { startDate: 'asc' },
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

  async create(projectId: string, name: string, startDate: Date, endDate: Date) {
    const newSprint = await this.prismaService.sprint.create({
      data: {
        projectId,
        name,
        startDate,
        endDate,
      },
    });

    const timeOffs = await this.prismaService.timeOff.findMany({
      where: {
        organizationId: (
          await this.prismaService.project.findUnique({
            where: { id: projectId },
          })
        )?.organizationId,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });

    for (const timeOff of timeOffs) {
      await this.prismaService.sprintCapacity.create({
        data: {
          sprintId: newSprint.id,
          userId: timeOff.userId,
          adjustmentDays: timeOff.type === 'half' ? 0.5 : 1,
        },
      });
    }

    const totalCapacity = await this.prismaService.sprintCapacity.aggregate({
      where: { sprintId: newSprint.id },
      _sum: { adjustmentDays: true },
    });

    return this.prismaService.sprint.update({
      where: { id: newSprint.id },
      data: { capacity: totalCapacity._sum.adjustmentDays },
    });
  }
}
