import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ProjectSettingsService {
  constructor(private readonly prismaService: PrismaService) {}

  getProjectSettings(projectId: string) {
    return this.prismaService.projectSettings.findUnique({
      where: { projectId },
    });
  }
}
