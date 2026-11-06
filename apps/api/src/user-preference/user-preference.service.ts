import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserPreferenceInput, UpdateUserPreferenceInput } from './user-preference.model';

@Injectable()
export class UserPreferenceService {
  constructor(private readonly prisma: PrismaService) {}

  getUserPreferences(userId: string, projectId: string) {
    return this.prisma.userPreference.findFirst({
      where: { userId, projectId },
      select: {
        id: true,
        userId: true,
        projectId: true,
        widgets: true,
        theme: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  createUserPreferences(data: CreateUserPreferenceInput) {
    return this.prisma.userPreference.create({
      data,
    });
  }
  updateUserPreferences(userId: string, projectId: string, input: UpdateUserPreferenceInput) {
    const data = {
      ...(input.widgets != null && { widgets: input.widgets }),
      ...(input.theme != null && { theme: input.theme }),
    };
    return this.prisma.userPreference.upsert({
      where: { userId_projectId: { userId, projectId } },
      create: { userId, projectId, ...data },
      update: data,
    });
  }
}
